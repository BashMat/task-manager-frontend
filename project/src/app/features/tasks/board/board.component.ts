import { Component, EventEmitter, input, Input, OnInit, Output } from '@angular/core';
import { TaskManagerBackendService } from '../../../core/services/task-manager-backend.service';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Column } from './column.interface';
import { Board } from '../boards-page/board.interface';
import { ColumnComponent } from '../column/column.component';
import { CdkDropListGroup } from '@angular/cdk/drag-drop';
import { Status } from '../../../core/services/tracking-log-entry-status-dto.interface';
import { Card } from '../column/card.interface';

@Component({
  selector: 'board',
  imports: [ReactiveFormsModule, ColumnComponent, CdkDropListGroup],
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

    this.taskManagerBackendService.AddColumn(this.board().id, this.newColumnForm.value.columnTitle!, null)
                                  .subscribe((response: {data: Status, message: string, success: boolean}) =>
                                    {
                                      console.log("response: ", response)
                                      if (response.data !== null)
                                      {
                                        let column = { id: response.data.id, title: response.data.title, boardId: response.data.trackingLogId, cards: [] as Array<Card>}
                                        this.board().columns.push(column)
                                      }
                                    })
    this.newColumnForm.reset();
  }

  DeleteColumn(columnId: number)
  {
    console.log("Deleting column", columnId);

    this.taskManagerBackendService.DeleteColumn(columnId)
                                  .subscribe((response: {data: Array<Status>, message: string, success: boolean}) =>
                                    {
                                      this.board().columns = this.board().columns.filter((column: Column) => response.data.filter(status => status.id === column.id).length == 1);
                                    });
  }
}
