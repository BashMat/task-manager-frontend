import { Component, EventEmitter, input, Input, OnInit, Output } from '@angular/core';
import { TaskManagerBackendService } from '../../../core/services/task-manager-backend.service';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TrackingLogEntry } from '../../../core/services/tracking-log-entry-dto.interface';
import { CardMaterialComponent } from '../card-material/card-material.component';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { Column } from '../board-material/column.interface';
import { Card } from './card.interface';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle, MatCardTitleGroup } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from '@angular/material/icon';
import { DeletionWarningDialog } from '../../../shared/components/dialogs/deletion-warning-dialog/deletion-warning-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CreationDialog } from '../../../shared/components/dialogs/creation-dialog/creation-dialog.component';
import { MatDivider } from "@angular/material/divider";

@Component({
  selector: 'column-material',
  imports: [
    ReactiveFormsModule,
    CardMaterialComponent,
    CdkDropList,
    CdkDrag,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatButtonModule,
    MatIconModule,
    MatCardTitleGroup,
    MatDivider
],
  templateUrl: './column-material.component.html',
  styleUrl: './column-material.component.css'
})
export class ColumnMaterialComponent {
  column = input.required<Column>();

  @Output() deleteColumnEvent = new EventEmitter<number>();

  constructor(private taskManagerBackendService: TaskManagerBackendService,
    private localStorageService: LocalStorageService,
    private dialog: MatDialog) {
    this.taskManagerBackendService = taskManagerBackendService;
    this.localStorageService = localStorageService;
    this.dialog = dialog;
  }

  DeleteColumn() {
    this.deleteColumnEvent.emit(this.column().id);
  }

  AddCard(): void {
    let dialogRef = this.dialog.open(CreationDialog, { autoFocus: false })

    dialogRef.afterClosed().subscribe(result => {
      if (result === null) {
        return;
      }

      console.log("Adding card");
      if (result.title === null || result.title === undefined) {
        console.log("Cannot add card without title")
        return;
      }

      let columnLength = this.column().cards.length;
      let newCardIndex = columnLength === 0
        ? 1
        : this.column().cards[columnLength - 1].orderIndex + 1;

      this.taskManagerBackendService.AddCard(this.column().boardId,
                                             this.column().id,
                                             result.title,
                                             result.description,
                                             newCardIndex)
        .subscribe((response: { data: TrackingLogEntry, message: string, success: boolean }) => {
          console.log("response: ", response)
          if (response.data !== null) {
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
    })
  }

  DeleteCard(cardId: number) {
    let dialogRef = this.dialog.open(DeletionWarningDialog)

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result === false) {
        return;
      }
      console.log("Deleting card", cardId);

      this.taskManagerBackendService.DeleteCard(cardId)
        .subscribe((cards: any) => this.column().cards = cards['data'].filter((card: TrackingLogEntry) => card.status.id === this.column().id) || []);
    });
  }

  drop(event: CdkDragDrop<Card[], Card[], Card>) {
    console.log("Card dropped in column: processing");
    let newNextCard = event.container.data[event.currentIndex + 1];
    let newPreviousCard = event.container.data[event.currentIndex - 1];
    let newOrderIndex = 1;
    let updatedData = event.previousContainer.data[event.previousIndex];

    if (newNextCard !== undefined && newPreviousCard !== undefined) {
      newOrderIndex = (newNextCard.orderIndex + newPreviousCard.orderIndex) / 2
      console.log(`inserting card between two existing cards with indeces: ${newPreviousCard.orderIndex}, ${newOrderIndex}, ${newNextCard.orderIndex}`)
    }
    else if (newNextCard === undefined && newPreviousCard !== undefined) {
      newOrderIndex = newPreviousCard.orderIndex + 0.5
      console.log(`inserting card as last with indeces: ${newPreviousCard.orderIndex}, ${newOrderIndex}`)
    }
    else if (newPreviousCard === undefined && newNextCard !== undefined) {
      newOrderIndex = newNextCard.orderIndex / 2
      console.log(`inserting card as first with indeces: ${newOrderIndex}, ${newNextCard.orderIndex}`)
    }

    this.taskManagerBackendService.MoveCard(event.previousContainer.data[event.previousIndex],
      event.container.id as unknown as number,
      newOrderIndex)
      .subscribe((response: { data: TrackingLogEntry, message: string, success: boolean }) => {
        console.log("Put request for Card was received!")
        console.log(response)
        if (response.data !== null) {
          this.column().cards = this.column().cards.map((card: Card) => {
            if (card.id == response.data.id) {
              card.updatedAt = response.data.updatedAt;
              return card;
            }
            return card;
          })
        }
      });
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }
    else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }
}
