import { Component, EventEmitter, input, Input, OnInit, Output } from '@angular/core';
import { TaskManagerBackendService } from '../../../core/services/task-manager-backend.service';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Column } from './column.interface';
import { Board } from '../boards-page-material/board.interface';
import { ColumnMaterialComponent } from '../column-material/column-material.component';
import { CdkDropListGroup } from '@angular/cdk/drag-drop';
import { Status } from '../../../core/services/tracking-log-entry-status-dto.interface';
import { Card } from '../column-material/card.interface';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle, MatCardTitleGroup } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { CreationDialog } from '../../../shared/components/dialogs/creation-dialog/creation-dialog.component';
import { BoardDetailsMaterialComponent } from '../board-details-material/board-details-material.component';
import { DeletionWarningDialog } from '../../../shared/components/dialogs/deletion-warning-dialog/deletion-warning-dialog.component';

@Component({
  selector: 'board-material',
  imports: [
    ReactiveFormsModule,
    ColumnMaterialComponent,
    CdkDropListGroup,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatButtonModule,
    MatIcon,
    MatCardTitleGroup
  ],
  templateUrl: './board-material.component.html',
  styleUrl: './board-material.component.css'
})
export class BoardMaterialComponent {
  board = input.required<Board>();

  @Output() deleteBoardEvent = new EventEmitter<number>();

  constructor(private taskManagerBackendService: TaskManagerBackendService,
    private localStorageService: LocalStorageService,
    private dialog: MatDialog) {
    this.taskManagerBackendService = taskManagerBackendService;
    this.localStorageService = localStorageService;
    this.dialog = dialog;
    this.taskManagerBackendService.token = this.localStorageService.GetAccessToken();
  }

  OpenDetails() {
    let boardDto = this.board();
    let dialogRef = this.dialog.open(BoardDetailsMaterialComponent, {
      autoFocus: false,
      height: "80%",
      minWidth: "80vw",
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
    let dialogRef = this.dialog.open(CreationDialog, { autoFocus: false })

    dialogRef.afterClosed().subscribe(result => {
      if (result === null)
      {
        return;
      }

      console.log("Adding column");
      if (result.title === null || result.title === undefined)
      {
        console.log("Cannot add column without title")
        return;
      }

      this.taskManagerBackendService.AddColumn(this.board().id, result.title, result.description)
        .subscribe((response: { data: Status, message: string, success: boolean }) => {
          console.log("response: ", response)
          if (response.data !== null) {
            let column = { id: response.data.id, title: response.data.title, boardId: response.data.trackingLogId, cards: [] as Array<Card> }
            this.board().columns.push(column)
          }
        })
    })
  }

  DeleteColumn(columnId: number) {
    let dialogRef = this.dialog.open(DeletionWarningDialog)

    dialogRef.afterClosed().subscribe(result => {
      if (result === false) {
        return;
      }
      console.log("Deleting column", columnId);

      this.taskManagerBackendService.DeleteColumn(columnId)
        .subscribe((response: { data: Array<Status>, message: string, success: boolean }) => {
          this.board().columns = this.board().columns.filter((column: Column) => response.data.filter(status => status.id === column.id).length == 1);
        });
    });
  }
}