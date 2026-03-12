import { Component, EventEmitter, input, Output } from '@angular/core';
import { TaskManagerBackendService } from '../../../core/services/task-manager-backend.service';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { Card } from '../column/card.interface';

@Component({
  selector: 'card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent
{
  card = input.required<Card>();

  @Output() deleteCardEvent = new EventEmitter<number>();

  constructor(private taskManagerBackendService: TaskManagerBackendService,
              private localStorageService: LocalStorageService)
  {
    this.taskManagerBackendService = taskManagerBackendService;
    this.localStorageService = localStorageService;
  }

  DeleteCard()
  {
    this.deleteCardEvent.emit(this.card().id);
  }
}
