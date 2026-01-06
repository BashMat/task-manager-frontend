import { Component, EventEmitter, input, Output } from '@angular/core';
import { TaskManagerBackendService } from '../../../core/services/task-manager-backend.service';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { Card } from '../column-material/card.interface';
import { MatCard, MatCardHeader, MatCardTitle, MatCardTitleGroup } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'card-material',
  templateUrl: './card-material.component.html',
  styleUrl: './card-material.component.css',
  imports: [
      MatCard,
      MatCardHeader,
      MatCardTitle,
      MatButtonModule,
      MatIconModule,
      MatCardTitleGroup
  ]
})
export class CardMaterialComponent
{
  card = input.required<Card>();

  @Output() deleteCardEvent = new EventEmitter<number>();
  
  constructor(private taskManagerBackendService: TaskManagerBackendService,
              private localStorageService: LocalStorageService)
  {
    this.taskManagerBackendService = taskManagerBackendService;
    this.localStorageService = localStorageService;
    this.taskManagerBackendService.token = this.localStorageService.GetAccessToken();
  }

  DeleteCard()
  {
    this.deleteCardEvent.emit(this.card().id);
  }
}