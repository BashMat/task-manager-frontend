import {Component, EventEmitter, input, Output, signal, effect, inject} from '@angular/core';
import {TaskManagerBackendService} from '../../../core/services/task-manager-backend.service';
import {LocalStorageService} from '../../../core/services/local-storage.service';
import {ReactiveFormsModule} from '@angular/forms';
import {Column} from './column.interface';
import {CdkDropListGroup} from '@angular/cdk/drag-drop';
import {Status} from '../../../core/services/tracking-log-entry-status-dto.interface';
import {Card} from '../column/card.interface';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle, MatCardTitleGroup} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatDialog} from '@angular/material/dialog';
import {CreationDialog} from '../../../shared/components/dialogs/creation-dialog/creation-dialog.component';
import {DetailsForm} from '../../../shared/components/details-form/details-form.component';
import {
  DeletionWarningDialog
} from '../../../shared/components/dialogs/deletion-warning-dialog/deletion-warning-dialog.component';
import {Board} from '../boards-page/board.interface';
import {ColumnComponent} from '../column/column.component';
import {MatMenuModule} from '@angular/material/menu';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'board',
  imports: [
    ReactiveFormsModule,
    CdkDropListGroup,
    ColumnComponent,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatButtonModule,
    MatIcon,
    MatCardTitleGroup,
    MatMenuModule,
    CommonModule
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})
export class BoardComponent {
  board = input.required<Board>();
  isCollapsed = signal(false);
  private taskManagerBackendService = inject(TaskManagerBackendService);
  private localStorageService = inject(LocalStorageService);
  private dialog = inject(MatDialog);

  @Output() deleteBoardEvent = new EventEmitter<number>();

  constructor() {
    effect(() => {
      const boardId = this.board().id;
      const storageKey = `board_collapsed_${boardId}`;
      const savedState = localStorage.getItem(storageKey);
      if (savedState !== null) {
        this.isCollapsed.set(JSON.parse(savedState));
      }
    });
  }

  toggleCollapse() {
    this.isCollapsed.update(val => !val);
    const boardId = this.board().id;
    const storageKey = `board_collapsed_${boardId}`;
    localStorage.setItem(storageKey, JSON.stringify(this.isCollapsed()));
  }

  OpenDetails() {
    let boardDto = this.board();
    let dialogRef = this.dialog.open(DetailsForm, {
      autoFocus: false,
      height: '80%',
      minWidth: '80vw',
      data: {
        id: boardDto.id,
        title: boardDto.title,
        description: boardDto.description,
        createdBy: boardDto.createdBy,
        createdAt: boardDto.createdAt.toLocaleString(),
        updatedBy: boardDto.updatedBy,
        updatedAt: boardDto.updatedAt.toLocaleString()
      }
    });
  }

  DeleteBoard() {
    this.deleteBoardEvent.emit(this.board().id);
  }

  AddColumn(): void {
    let dialogRef = this.dialog.open(CreationDialog, {autoFocus: false});

    dialogRef.afterClosed().subscribe(result => {
      if (result === null) {
        return;
      }

      console.log('Adding column');
      if (result.title === null || result.title === undefined) {
        console.log('Cannot add column without title');
        return;
      }

      this.taskManagerBackendService.AddColumn(this.board().id, result.title, result.description)
          .subscribe((response: { data: Status, message: string, success: boolean }) => {
            console.log('response: ', response);
            if (response.data !== null) {
              let column = {
                id: response.data.id,
                title: response.data.title,
                boardId: response.data.trackingLogId,
                cards: [] as Array<Card>
              };
              this.board().columns.push(column);
            }
          });
    });
  }

  DeleteColumn(columnId: number) {
    let dialogRef = this.dialog.open(DeletionWarningDialog);

    dialogRef.afterClosed().subscribe(result => {
      if (result === false) {
        return;
      }
      console.log('Deleting column', columnId);

      this.taskManagerBackendService.DeleteColumn(columnId)
          .subscribe((response: { data: Array<Status>, message: string, success: boolean }) => {
            this.board().columns = this.board().columns
                                       .filter((column: Column) => response.data.filter(status => status.id === column.id).length == 1);
          });
    });
  }
}