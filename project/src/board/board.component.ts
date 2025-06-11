import { Component, EventEmitter, input, Input, OnInit, Output } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TaskManagerBackendService } from '../services/task-manager-backend.service';
import { LocalStorageService } from '../services/local-storage.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Column } from './column.interface';
import { Board } from '../boards-page/board.interface';
import { ColumnComponent } from '../column/column.component';
import { CdkDropListGroup } from '@angular/cdk/drag-drop';

@Component({
  selector: 'board',
  imports: [RouterOutlet, ReactiveFormsModule, ColumnComponent, CdkDropListGroup],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})
export class BoardComponent
{
  board = input.required<Board>();

  @Output() deleteBoardEvent = new EventEmitter<number>();

  newColumnForm = new FormGroup(
    {
      columnTitle: new FormControl("")
    }
  )
  
  constructor(private taskManagerBackendService: TaskManagerBackendService,
              private localStorageService: LocalStorageService)
  {
    this.taskManagerBackendService = taskManagerBackendService;
    this.localStorageService = localStorageService;
    this.taskManagerBackendService.token = this.localStorageService.GetAccessToken();
  }

  DeleteBoard()
  {
    this.deleteBoardEvent.emit(this.board().id);
  }

  AddColumn(): void
  {
    console.log("Adding column");

    if (this.newColumnForm.value.columnTitle === null || this.newColumnForm.value.columnTitle === undefined)
    {
      console.log("Cannot add column without title")
      return;
    }

    this.taskManagerBackendService.AddColumn(this.board().id, this.newColumnForm.value.columnTitle!)
                                  .subscribe((response: {data: Column, message: string, success: boolean}) => 
                                    {
                                      console.log("response: ", response)
                                      if (response.data !== null)
                                      {
                                        this.board().columns.push(response.data)
                                      }
                                    })
    this.newColumnForm.reset();
  }

  DeleteColumn(columnId: number)
  {
    console.log("Deleting column", columnId);

    this.taskManagerBackendService.DeleteColumn(columnId)
                                  .subscribe((columns: any) => this.board().columns = columns['data'].filter((column: Column) => column.boardId === this.board().id) || []);
  }
}