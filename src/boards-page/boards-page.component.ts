import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TaskManagerBackendService } from '../services/task-manager-backend.service';
import { LocalStorageService } from '../services/local-storage.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BoardDto } from './board-dto.interface';
import { BoardComponent } from "../board/board.component";
import { Board } from './board.interface';
import { Column } from '../board/column.interface';

@Component({
  selector: 'boards-page',
  imports: [RouterOutlet, ReactiveFormsModule, BoardComponent],
  templateUrl: './boards-page.component.html',
  styleUrl: './boards-page.component.css'
})
export class BoardsPageComponent implements OnInit
{
  boards: Array<BoardDto> = [];

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
                                  .subscribe((response: {data: BoardDto, message: string, success: boolean}) => 
                                    {
                                      console.log("response: ", response)
                                      if (response.data !== null)
                                      {
                                        this.boards.push(response.data)
                                      }
                                    })
    this.newBoardForm.reset();
    //this.GetBoards();
  }

  GetBoards(): void
  {
    this.taskManagerBackendService.GetBoards()
                                  .subscribe((boards: any) => 
                                    this.boards = this.ConvertToBoardArray(boards['data'] || new Array<BoardDto>()));
  }

  private ConvertToBoardArray(data: any): Array<BoardDto>
  {
    console.log("Converting...")
    let converted = data.map((board: BoardDto) => 
      {
        let mappedBoard = board;
        mappedBoard.columns = board.columns.map((column: Column) => 
          {
            let mappedColumn = column;
            mappedColumn.cards = column.cards.sort((lhs, rhs) => lhs.orderIndex - rhs.orderIndex)
            return mappedColumn;
          });
        return mappedBoard;
      });
    console.log("Converted:", converted);
    return converted;
  }

  DeleteBoard(boardId: number)
  {
    console.log("Deleting board", boardId);

    this.taskManagerBackendService.DeleteBoard(boardId)
                                  .subscribe((boards: any) => this.boards = this.ConvertToBoardArray(boards['data'] || new Array<BoardDto>()));
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