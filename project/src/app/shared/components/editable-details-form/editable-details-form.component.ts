import { Component, inject, signal, OnDestroy } from '@angular/core';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { TextFieldModule } from '@angular/cdk/text-field';
import { Subject } from 'rxjs';
import { TaskManagerBackendService } from '../../../core/services/task-manager-backend.service';
import { TrackingLogEntry } from '../../../core/services/tracking-log-entry-dto.interface';
import { LocalDateTimePipe } from '../../pipes/local-date-time.pipe';
import { statusColor as resolveStatusColor } from '../../utils/status-color';

export interface EditableDialogData {
  id: number;
  title: string;
  description: string | null;
  statusId: number;
  statuses: { id: number; title: string }[];
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

@Component({
  selector: 'editable-details-form',
  imports: [
    MatDialogModule,
    MatDivider,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    TextFieldModule,
    LocalDateTimePipe
  ],
  templateUrl: './editable-details-form.component.html',
  styleUrl: './editable-details-form.component.css'
})
export class EditableDetailsForm implements OnDestroy {
  readonly data = inject<EditableDialogData>(MAT_DIALOG_DATA);
  private backend = inject(TaskManagerBackendService);

  readonly titleMaxLength = 256;
  readonly descriptionMaxLength = 512;

  title = signal(this.data.title);
  description = signal(this.data.description);
  statusId = signal(this.data.statusId);
  updatedBy = signal(this.data.updatedBy);
  updatedAt = signal(this.data.updatedAt);

  readonly saved = new Subject<TrackingLogEntry>();

  isEditing = signal(false);
  editTitle = '';
  editDescription = '';
  editStatusId = this.data.statusId;

  statusName(id: number): string {
    return this.data.statuses.find(s => s.id === id)?.title ?? '';
  }

  protected readonly statusColor = resolveStatusColor;

  toggleEdit() {
    if (!this.isEditing()) {
      this.seedDrafts();
    }
    this.isEditing.update(value => !value);
  }

  onTitleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  }

  onTitleModelChange(value: string) {
    this.editTitle = value.replace(/[\r\n]+/g, ' ');
  }

  cancel() {
    this.seedDrafts();
    this.isEditing.set(false);
  }

  save() {
    const patch: {
      id: number;
      title?: string | null;
      description?: string | null;
      trackingLogEntryStatusId?: number;
    } = { id: this.data.id };

    const newTitle = this.editTitle.trim();
    if (newTitle !== '' && newTitle !== this.title()) {
      patch.title = newTitle;
    }

    const newDescription = this.editDescription.trim() === '' ? null : this.editDescription;
    if (newDescription !== this.description()) {
      patch.description = newDescription;
    }

    if (this.editStatusId !== this.statusId()) {
      patch.trackingLogEntryStatusId = this.editStatusId;
    }

    if (patch.title === undefined && patch.description === undefined && patch.trackingLogEntryStatusId === undefined) {
      this.isEditing.set(false);
      return;
    }

    this.backend.EditLogEntry(patch).subscribe({
      next: response => {
        if (response?.success && response.data) {
          this.title.set(response.data.title);
          this.description.set(response.data.description);
          this.statusId.set(response.data.status.id);
          this.updatedBy.set(response.data.updatedBy);
          this.updatedAt.set(response.data.updatedAt);
          this.saved.next(response.data);
          this.isEditing.set(false);
        } else {
          console.log('Edit did not succeed', response);
        }
      },
      error: error => {
        console.log('Edit request failed', error);
      }
    });
  }

  ngOnDestroy() {
    this.saved.complete();
  }

  private seedDrafts() {
    this.editTitle = this.title() ?? '';
    this.editDescription = this.description() ?? '';
    this.editStatusId = this.statusId();
  }
}