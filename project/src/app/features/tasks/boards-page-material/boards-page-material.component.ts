import { Component, OnInit } from '@angular/core';
import { TaskManagerBackendService } from '../../../core/services/task-manager-backend.service';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { TrackingLogDto } from '../../../core/services/tracking-log-dto.interface';
import { BoardMaterialComponent } from '../board-material/board-material.component';
import { Board } from './board.interface';
import { Column } from '../board-material/column.interface';
import { Status } from '../../../core/services/tracking-log-entry-status-dto.interface';
import { TrackingLogEntry } from '../../../core/services/tracking-log-entry-dto.interface';
import { Card } from '../column-material/card.interface';
import { MatToolbar } from "@angular/material/toolbar";
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { BoardCreationDialog } from '../board-creation-dialog/board-creation-dialog.component';
import { DeletionWarningDialog } from '../../../shared/components/dialogs/deletion-warning-dialog/deletion-warning-dialog.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { View } from './view.enum';
import { LogTableComponent } from '../log-table/log-table.component';

@Component({
  selector: 'boards-page-material',
  imports: [
    BoardMaterialComponent,
    MatToolbar,
    MatButtonModule,
    MatIcon,
    MatButtonToggleModule,
    LogTableComponent
  ],
  templateUrl: './boards-page-material.component.html',
  styleUrl: './boards-page-material.component.css'
})
export class BoardsPageMaterialComponent implements OnInit
{
  view = View;
  selectedView = this.view.Board;
  boards: Array<Board> = [];

  constructor(private taskManagerBackendService: TaskManagerBackendService,
              private localStorageService: LocalStorageService,
              private dialog: MatDialog)
  {
    this.taskManagerBackendService = taskManagerBackendService;
    this.localStorageService = localStorageService;
    this.dialog = dialog;
  }

  ngOnInit()
  {
    this.GetBoards()
  }

  switchView(value: View): void
  {
    this.selectedView = value;
  }

  AddBoard(): void
  {
    let dialogRef = this.dialog.open(BoardCreationDialog, {autoFocus: false})

    dialogRef.afterClosed().subscribe(result => {
      if (result === null)
      {
        return;
      }

      console.log("Adding board");
      if (result.title === null || result.title === undefined)
      {
        console.log("Cannot add board without title")
        return;
      }

      this.taskManagerBackendService.AddBoard(result.title, result.description)
                                    .subscribe((response: {data: TrackingLogDto, message: string, success: boolean}) =>
                                      {
                                        console.log("response: ", response)
                                        if (response.data !== null)
                                        {
                                          this.boards.push(this.ConvertToBoard(response.data))
                                        }
                                      })
    });
  }

  GetBoards(): void
  {
    this.taskManagerBackendService.GetBoards()
                                  .subscribe((boards: any) =>
                                    this.boards = this.ConvertToBoardArray(boards['data'] || new Array<Board>()));
  }

  private ConvertToBoardArray(data: any): Array<Board>
  {
    console.log("Converting...")
    let converted = data.map((log: TrackingLogDto) =>
      {
        return this.ConvertToBoard(log);
      });
    console.log("Converted:", converted);
    return converted;
  }

  private ConvertToBoard(data: TrackingLogDto): Board
  {
    let mappedBoard = {
      id: data.id,
      title: data.title,
      description: data.description,
      createdBy: data.createdBy.userName,
      createdAt: new Date(data.createdAt + "Z"),
      updatedBy: data.updatedBy.userName,
      updatedAt: new Date(data.updatedAt + "Z"),
      columns: [] as Array<Column>
    } as Board;
    mappedBoard.columns = data.trackingLogEntriesStatuses.map((status: Status) =>
      {
        let mappedColumn = { id: status.id, title: status.title, boardId: status.trackingLogId, cards: [] as Array<Card> };
        console.log(mappedColumn);
        console.log(data.trackingLogEntries);
        let filtered = data.trackingLogEntries.filter((entry: TrackingLogEntry,
                                                             index: number,
                                                             array: TrackingLogEntry[]
                                                            ) => { return entry.status.id === mappedColumn.id} );
        console.log(filtered)
        mappedColumn.cards = filtered.map((entry: TrackingLogEntry) =>
                                                      {
                                                        let mappedCard = {
                                                                           id: entry.id,
                                                                           title: entry.title,
                                                                           description: entry.description,
                                                                           boardId: entry.trackingLogId,
                                                                           columnId: entry.status.id,
                                                                           priority: entry.priority,
                                                                           orderIndex: entry.orderIndex,
                                                                           createdBy: entry.createdBy.userName,
                                                                           createdAt: entry.createdAt,
                                                                           updatedBy: entry.updatedBy.userName,
                                                                           updatedAt: entry.updatedAt
                                                                         };
                                                        return mappedCard;
                                                      }
                                                    )
                                                    .sort((lhs, rhs) => lhs.orderIndex - rhs.orderIndex);

        return mappedColumn;
      });
    return mappedBoard;
  }

  DeleteBoard(boardId: number)
  {
    let dialogRef = this.dialog.open(DeletionWarningDialog)

    dialogRef.afterClosed().subscribe(result => {
      if (result === false)
      {
        return;
      }
      console.log("Deleting board", boardId);

      this.taskManagerBackendService.DeleteBoard(boardId)
                                    .subscribe((boards: any) => this.boards = this.ConvertToBoardArray(boards['data'] || new Array<TrackingLogDto>()));
    });
  }
}
