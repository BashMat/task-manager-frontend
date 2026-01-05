import { Component, OnInit } from '@angular/core';
import { TaskManagerBackendService } from '../../../core/services/task-manager-backend.service';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TrackingLogDto } from '../../../core/services/tracking-log-dto.interface';
import { BoardComponent } from "../board/board.component";
import { Board } from './board.interface';
import { Column } from '../board/column.interface';
import { Status } from '../../../core/services/tracking-log-entry-status-dto.interface';
import { TrackingLogEntry } from '../../../core/services/tracking-log-entry-dto.interface';
import { Card } from '../column/card.interface';
import { MatToolbar } from "@angular/material/toolbar";
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'boards-page-material',
  imports: [ ReactiveFormsModule, BoardComponent, MatToolbar, MatButtonModule, MatIcon ],
  templateUrl: './boards-page-material.component.html',
  styleUrl: './boards-page-material.component.css'
})
export class BoardsPageMaterialComponent implements OnInit
{
  boards: Array<Board> = [];

  newBoardForm = new FormGroup(
    {
      boardTitle: new FormControl("")
    }
  )
  
  constructor(private taskManagerBackendService: TaskManagerBackendService,
              private localStorageService: LocalStorageService)
  {
    this.taskManagerBackendService = taskManagerBackendService;
    this.localStorageService = localStorageService;
    this.taskManagerBackendService.token = this.localStorageService.GetAccessToken();
  }

  ngOnInit()
  {
    this.GetBoards()
  }

  AddBoard(): void
  {
    console.log("Adding board");
    if (this.newBoardForm.value.boardTitle === null || this.newBoardForm.value.boardTitle === undefined)
    {
      console.log("Cannot add board without title")
      return;
    }

    this.taskManagerBackendService.AddBoard(this.newBoardForm.value.boardTitle!)
                                  .subscribe((response: {data: TrackingLogDto, message: string, success: boolean}) => 
                                    {
                                      console.log("response: ", response)
                                      if (response.data !== null)
                                      {
                                        this.boards.push(this.ConvertToBoard(response.data))
                                      }
                                    })
    this.newBoardForm.reset();
    //this.GetBoards();
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
    let mappedBoard = { id: data.id, title: data.title, columns: [] as Array<Column> };
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
    console.log("Deleting board", boardId);

    this.taskManagerBackendService.DeleteBoard(boardId)
                                  .subscribe((boards: any) => this.boards = this.ConvertToBoardArray(boards['data'] || new Array<TrackingLogDto>()));
  }

  AddColumn(boardId: number)
  {
    console.log("Adding column for board", boardId)
  }
  
  DeleteColumn(columnId: number)
  {
    console.log("Deleting column", columnId);
  }
  
  DeleteCard(cardId: number)
  {
    console.log("Deleting card", cardId);
  }
}