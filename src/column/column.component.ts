import { Component, EventEmitter, input, Input, OnInit, Output } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TaskManagerBackendService } from '../services/task-manager-backend.service';
import { LocalStorageService } from '../services/local-storage.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Card } from './card.interface';
import { Column } from '../board/column.interface';
import { CardComponent } from '../card/card.component';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';

@Component({
  selector: 'column',
  imports: [RouterOutlet, ReactiveFormsModule, CardComponent, CdkDropList, CdkDrag],
  templateUrl: './column.component.html',
  styleUrl: './column.component.css'
})
export class ColumnComponent
{
  column = input.required<Column>();

  @Output() deleteColumnEvent = new EventEmitter<number>();

  newCardForm = new FormGroup(
    {
      cardTitle: new FormControl("")
    }
  )
  
  constructor(private taskManagerBackendService: TaskManagerBackendService,
              private localStorageService: LocalStorageService)
  {
    this.taskManagerBackendService = taskManagerBackendService;
    this.localStorageService = localStorageService;
    this.taskManagerBackendService.token = this.localStorageService.GetAccessToken();
  }

  DeleteColumn()
  {
    this.deleteColumnEvent.emit(this.column().id);
  }

  AddCard(): void
  {
    console.log("Adding card");

    if (this.newCardForm.value.cardTitle === null || this.newCardForm.value.cardTitle === undefined)
    {
      console.log("Cannot add card without title")
      return;
    }

    this.taskManagerBackendService.AddCard(this.column().id, this.newCardForm.value.cardTitle!)
                                  .subscribe((response: {data: Card, message: string, success: boolean}) => 
                                    {
                                      console.log("response: ", response)
                                      if (response.data !== null)
                                      {
                                        this.column().cards.push(response.data)
                                      }
                                    })
    this.newCardForm.reset();
  }

  DeleteCard(cardId: number)
  {
    console.log("Deleting card", cardId);

    this.taskManagerBackendService.DeleteCard(cardId)
                                  .subscribe((cards: any) => this.column().cards = cards['data'].filter((card: Card) => card.columnId === this.column().id) || []);
  }

  drop(event: CdkDragDrop<Card[]>)
  {
    console.log("Card dropped in column: processing");
    this.taskManagerBackendService.MoveCard(event.previousContainer.data[event.previousIndex],
                                            event.container.id as unknown as number,
                                            event.currentIndex)
                                  .subscribe((response: Card) => console.log("Put request for Card was sent!"));
    if (event.previousContainer === event.container)
    {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } 
    else
    {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
  }
}