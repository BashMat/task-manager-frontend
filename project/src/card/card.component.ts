import { Component, EventEmitter, input, Output } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TaskManagerBackendService } from '../services/task-manager-backend.service';
import { LocalStorageService } from '../services/local-storage.service';
import { Card } from '../column/card.interface';

@Component({
  selector: 'card',
  imports: [RouterOutlet],
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
    this.taskManagerBackendService.token = this.localStorageService.GetAccessToken();
  }

  DeleteCard()
  {
    this.deleteCardEvent.emit(this.card().id);
  }
}