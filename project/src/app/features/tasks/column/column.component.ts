import { Component, EventEmitter, input, Input, OnInit, Output } from '@angular/core';
import { TaskManagerBackendService } from '../../../core/services/task-manager-backend.service';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TrackingLogEntry } from '../../../core/services/tracking-log-entry-dto.interface';
import { CardComponent } from '../card/card.component';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { Column } from '../board/column.interface';
import { Card } from './card.interface';

@Component({
  selector: 'column',
  imports: [ReactiveFormsModule, CardComponent, CdkDropList, CdkDrag],
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

    let columnLength = this.column().cards.length;
    let newCardIndex = columnLength === 0
                       ? 1
                       : this.column().cards[columnLength - 1].orderIndex + 1;

    this.taskManagerBackendService.AddCard(this.column().boardId, this.column().id, this.newCardForm.value.cardTitle!, null, newCardIndex)
                                  .subscribe((response: {data: TrackingLogEntry, message: string, success: boolean}) =>
                                    {
                                      console.log("response: ", response)
                                      if (response.data !== null)
                                      {
                                        let card = {
                                                      id: response.data.id,
                                                      title: response.data.title,
                                                      description: response.data.description,
                                                      boardId: response.data.trackingLogId,
                                                      columnId: response.data.status.id,
                                                      priority: response.data.priority,
                                                      orderIndex: response.data.orderIndex,
                                                      createdBy: response.data.createdBy,
                                                      createdAt: response.data.createdAt,
                                                      updatedBy: response.data.updatedBy,
                                                      updatedAt: response.data.updatedAt
                                                    };
                                        this.column().cards.push(card)
                                      }
                                    })
    this.newCardForm.reset();
  }

  DeleteCard(cardId: number)
  {
    console.log("Deleting card", cardId);

    this.taskManagerBackendService.DeleteCard(cardId)
                                  .subscribe((cards: any) => this.column().cards = cards['data'].filter((card: TrackingLogEntry) => card.status.id === this.column().id) || []);
  }

  drop(event: CdkDragDrop<Card[], Card[], Card>)
  {
    console.log("Card dropped in column: processing");
    let newNextCard = event.container.data[event.currentIndex + 1];
    let newPreviousCard = event.container.data[event.currentIndex - 1];
    let newOrderIndex = 1;
    let updatedData = event.previousContainer.data[event.previousIndex];

    if (newNextCard !== undefined && newPreviousCard !== undefined)
    {
      newOrderIndex = (newNextCard.orderIndex + newPreviousCard.orderIndex) / 2
      console.log(`inserting card between two existing cards with indeces: ${newPreviousCard.orderIndex}, ${newOrderIndex}, ${newNextCard.orderIndex}`)
    }
    else if (newNextCard === undefined && newPreviousCard !== undefined)
    {
      newOrderIndex = newPreviousCard.orderIndex + 0.5
      console.log(`inserting card as last with indeces: ${newPreviousCard.orderIndex}, ${newOrderIndex}`)
    }
    else if (newPreviousCard === undefined && newNextCard !== undefined)
    {
      newOrderIndex = newNextCard.orderIndex / 2
      console.log(`inserting card as first with indeces: ${newOrderIndex}, ${newNextCard.orderIndex}`)
    }

    this.taskManagerBackendService.MoveCard(event.previousContainer.data[event.previousIndex],
                                            event.container.id as unknown as number,
                                            newOrderIndex)
                                  .subscribe((response: {data: TrackingLogEntry, message: string, success: boolean}) =>
                                    {
                                      console.log("Put request for Card was received!")
                                      console.log(response)
                                      if (response.data !== null)
                                      {
                                        this.column().cards = this.column().cards.map((card: Card) =>
                                        {
                                          if (card.id == response.data.id)
                                          {
                                            card.updatedAt = response.data.updatedAt;
                                            return card;
                                          }
                                          return card;
                                        })
                                      }
                                    });
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
