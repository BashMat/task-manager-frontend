import { Component, EventEmitter, input, Output } from '@angular/core';
import { TaskManagerBackendService } from '../../../core/services/task-manager-backend.service';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { Card } from '../column/card.interface';
import { MatCard, MatCardHeader, MatCardTitle, MatCardTitleGroup } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from '@angular/material/icon';
import { DetailsForm } from '../../../shared/components/details-form/details-form.component';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
  imports: [
      MatCard,
      MatCardHeader,
      MatCardTitle,
      MatButtonModule,
      MatIconModule,
      MatCardTitleGroup,
      MatMenuModule
  ]
})
export class CardComponent
{
  card = input.required<Card>();

  @Output() deleteCardEvent = new EventEmitter<number>();

  constructor(private taskManagerBackendService: TaskManagerBackendService,
              private localStorageService: LocalStorageService,
              private dialog: MatDialog)
  {
    this.taskManagerBackendService = taskManagerBackendService;
    this.localStorageService = localStorageService;
    this.dialog = dialog;
  }

  DeleteCard()
  {
    this.deleteCardEvent.emit(this.card().id);
  }

  OpenDetails() {
      let cardDto = this.card();
      let dialogRef = this.dialog.open(DetailsForm, {
        autoFocus: false,
        height: "80%",
        minWidth: "80vw",
        data: {
          id: cardDto.id,
          title: cardDto.title,
          description: cardDto.description,
          createdBy: cardDto.createdBy,
          createdAt: cardDto.createdAt.toLocaleString(),
          updatedBy: cardDto.updatedBy,
          updatedAt: cardDto.updatedAt.toLocaleString()
        }
      });
    }
}
