import { Component, EventEmitter, input, Output } from '@angular/core';
import { TaskManagerBackendService } from '../../../core/services/task-manager-backend.service';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { Card } from '../column/card.interface';
import { Column } from '../board/column.interface';
import { MatCard, MatCardHeader, MatCardTitle, MatCardTitleGroup } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from '@angular/material/icon';
import { EditableDetailsForm } from '../../../shared/components/editable-details-form/editable-details-form.component';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { TrackingLogEntry } from '../../../core/services/tracking-log-entry-dto.interface';

@Component({
  selector: 'card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
  imports: [
      MatCard,
      MatCardHeader,
      MatCardTitle,
      MatButtonModule,
      MatIconModule,
      MatCardTitleGroup,
      MatMenuModule
  ]
})
export class CardComponent
{
  card = input.required<Card>();
  boardColumns = input<Column[]>([]);

  @Output() deleteCardEvent = new EventEmitter<number>();
  @Output() updateCardEvent = new EventEmitter<TrackingLogEntry>();

  constructor(private taskManagerBackendService: TaskManagerBackendService,
              private localStorageService: LocalStorageService,
              private dialog: MatDialog)
  {
    this.taskManagerBackendService = taskManagerBackendService;
    this.localStorageService = localStorageService;
    this.dialog = dialog;
  }

  DeleteCard()
  {
    this.deleteCardEvent.emit(this.card().id);
  }

  OpenDetails() {
      let cardDto = this.card();
      let dialogRef = this.dialog.open(EditableDetailsForm, {
        autoFocus: false,
        height: "80%",
        minWidth: "80vw",
        panelClass: "editable-details-dialog",
        data: {
          id: cardDto.id,
          title: cardDto.title,
          description: cardDto.description,
          statusId: cardDto.columnId,
          statuses: this.boardColumns().map(c => ({ id: c.id, title: c.title })),
          createdBy: cardDto.createdBy,
          createdAt: cardDto.createdAt.toLocaleString(),
          updatedBy: cardDto.updatedBy,
          updatedAt: cardDto.updatedAt.toLocaleString()
        }
      });

      dialogRef.componentInstance.saved.subscribe((updated: TrackingLogEntry) => {
        this.updateCardEvent.emit(updated);
      });
    }
}
