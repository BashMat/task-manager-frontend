import {Component, EventEmitter, input, Output, signal, effect, inject, computed, viewChild, ElementRef} from '@angular/core';
import {TaskManagerBackendService} from '../../../core/services/task-manager-backend.service';
import {ReactiveFormsModule} from '@angular/forms';
import {TrackingLogEntry} from '../../../core/services/tracking-log-entry-dto.interface';
import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {Column} from '../board/column.interface';
import {Card} from './card.interface';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle, MatCardTitleGroup} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {
  DeletionWarningDialog
} from '../../../shared/components/dialogs/deletion-warning-dialog/deletion-warning-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {CreationDialog} from '../../../shared/components/dialogs/creation-dialog/creation-dialog.component';
import {CardComponent} from '../card/card.component';
import {NewCardComponent} from '../new-card/new-card.component';
import {statusColor} from '../../../shared/utils/status-color';
import {MatMenuModule} from '@angular/material/menu';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'column',
  imports: [
    ReactiveFormsModule,
    CdkDropList,
    CdkDrag,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatButtonModule,
    MatIconModule,
    MatCardTitleGroup,
    CardComponent,
    NewCardComponent,
    MatMenuModule,
    CommonModule
  ],
  templateUrl: './column.component.html',
  styleUrl: './column.component.css'
})
export class ColumnComponent {
  column = input.required<Column>();
  boardColumns = input<Column[]>([]);
  isCollapsed = signal(false);

  headerColor = computed(() => statusColor(this.column().title));
  columnBackground = computed(() => `color-mix(in srgb, ${this.headerColor().bg} 10%, white)`);

  @Output() deleteColumnEvent = new EventEmitter<number>();
  @Output() cardUpdatedEvent = new EventEmitter<TrackingLogEntry>();

  private scrollContainer = viewChild<ElementRef<HTMLElement>>('scrollContainer');

  private taskManagerBackendService = inject(TaskManagerBackendService);
  private dialog = inject(MatDialog);

  constructor() {
    effect(() => {
      const columnId = this.column().id;
      const storageKey = `column_collapsed_${columnId}`;
      const savedState = localStorage.getItem(storageKey);
      if (savedState !== null) {
        this.isCollapsed.set(JSON.parse(savedState));
      }
    });
  }

  toggleCollapse() {
    this.isCollapsed.update(val => !val);
    const columnId = this.column().id;
    const storageKey = `column_collapsed_${columnId}`;
    localStorage.setItem(storageKey, JSON.stringify(this.isCollapsed()));
  }

  DeleteColumn() {
    this.deleteColumnEvent.emit(this.column().id);
  }

  AddCard(): void {
    let dialogRef = this.dialog.open(CreationDialog, {autoFocus: false});

    dialogRef.afterClosed().subscribe(result => {
      if (result === null) {
        return;
      }

      console.log('Adding card');
      if (result.title === null || result.title === undefined) {
        console.log('Cannot add card without title');
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
            console.log('response: ', response);
            if (response.data !== null) {
              this.column().cards.push(this.mapEntryToCard(response.data));
            }
          });
    });
  }

  addCardAtBottom(title: string) {
    const cards = this.column().cards;
    const orderIndex = cards.length === 0 ? 1 : cards[cards.length - 1].orderIndex + 1;

    this.taskManagerBackendService.AddCard(this.column().boardId, this.column().id, title, null, orderIndex)
        .subscribe((response: { data: TrackingLogEntry, message: string, success: boolean }) => {
          if (response.data !== null) {
            this.column().cards.push(this.mapEntryToCard(response.data));
          }
        });
  }

  addCardAtTop(title: string) {
    const cards = this.column().cards;
    const orderIndex = cards.length === 0 ? 1 : cards[0].orderIndex / 2;

    this.taskManagerBackendService.AddCard(this.column().boardId, this.column().id, title, null, orderIndex)
        .subscribe((response: { data: TrackingLogEntry, message: string, success: boolean }) => {
          if (response.data !== null) {
            this.column().cards.unshift(this.mapEntryToCard(response.data));
          }
        });
  }

  scrollToTop() {
    requestAnimationFrame(() => {
      const el = this.scrollContainer()?.nativeElement;
      if (el) {
        el.scrollTop = 0;
      }
    });
  }

  private mapEntryToCard(entry: TrackingLogEntry): Card {
    return {
      id: entry.id,
      title: entry.title,
      description: entry.description,
      boardId: entry.trackingLogId,
      columnId: entry.status.id,
      priority: entry.priority,
      orderIndex: entry.orderIndex,
      createdBy: entry.createdBy,
      createdAt: entry.createdAt,
      updatedBy: entry.updatedBy,
      updatedAt: entry.updatedAt
    };
  }

  DeleteCard(cardId: number) {
    let dialogRef = this.dialog.open(DeletionWarningDialog);

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result === false) {
        return;
      }
      console.log('Deleting card', cardId);

      this.taskManagerBackendService.DeleteCard(cardId)
          .subscribe((cards: any) => this.column().cards = cards['data'].filter((card: TrackingLogEntry) => card.status.id === this.column().id) || []);
    });
  }

  drop(event: CdkDragDrop<Card[], Card[], Card>) {
    console.log('Card dropped in column: processing');
    let newNextCard = event.container.data[event.currentIndex + 1];
    let newPreviousCard = event.container.data[event.currentIndex - 1];
    let newOrderIndex = 1;
    let updatedData = event.previousContainer.data[event.previousIndex];

    if (newNextCard !== undefined && newPreviousCard !== undefined) {
      newOrderIndex = (newNextCard.orderIndex + newPreviousCard.orderIndex) / 2;
      console.log(`inserting card between two existing cards with indeces: ${newPreviousCard.orderIndex}, ${newOrderIndex}, ${newNextCard.orderIndex}`);
    } else if (newNextCard === undefined && newPreviousCard !== undefined) {
      newOrderIndex = newPreviousCard.orderIndex + 0.5;
      console.log(`inserting card as last with indeces: ${newPreviousCard.orderIndex}, ${newOrderIndex}`);
    } else if (newPreviousCard === undefined && newNextCard !== undefined) {
      newOrderIndex = newNextCard.orderIndex / 2;
      console.log(`inserting card as first with indeces: ${newOrderIndex}, ${newNextCard.orderIndex}`);
    }

    this.taskManagerBackendService.MoveCard(event.previousContainer.data[event.previousIndex],
          event.container.id as unknown as number,
          newOrderIndex)
        .subscribe((response: { data: TrackingLogEntry, message: string, success: boolean }) => {
          console.log('Put request for Card was received!');
          console.log(response);
          if (response.data !== null) {
            this.column().cards = this.column().cards.map((card: Card) => {
              if (card.id == response.data.id) {
                card.updatedAt = response.data.updatedAt;
                return card;
              }
              return card;
            });
          }
        });
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }
}