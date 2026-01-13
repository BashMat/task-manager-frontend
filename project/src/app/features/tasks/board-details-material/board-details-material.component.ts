import { Component, inject, model } from '@angular/core';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from "@angular/material/button";

export interface DialogData {
  id: number;
  title: string;
  description: string | null;
  createdBy: string;
  createdAt: Date;
  updatedBy: string;
  updatedAt: Date;
}

@Component({
  selector: 'board-details-material',
  imports: [MatDialogModule, MatDivider, MatIconModule, MatButtonModule ],
  templateUrl: './board-details-material.component.html',
  styleUrl: './board-details-material.component.css'
})
export class BoardDetailsMaterialComponent
{ 
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  readonly id = model(this.data.id);
  readonly title = model(this.data.title);
  readonly description = model(this.data.description);
  readonly createdBy = model(this.data.createdBy);
  readonly createdAt = model(this.data.createdAt);
  readonly updatedBy = model(this.data.updatedBy);
  readonly updatedAt = model(this.data.updatedAt);
}