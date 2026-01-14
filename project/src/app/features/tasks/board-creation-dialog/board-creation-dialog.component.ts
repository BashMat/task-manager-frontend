import { Component, inject, model } from '@angular/core';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from "@angular/material/button";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';

@Component({
  selector: 'board-creation-dialog',
  imports: [
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './board-creation-dialog.component.html',
  styleUrl: './board-creation-dialog.component.css'
})
export class BoardCreationDialog
{
  readonly title = new FormControl('', [ Validators.required ]);
  readonly description = new FormControl('');

  constructor(private dialogRef: MatDialogRef<BoardCreationDialog>) { }

  cancel() {
    this.dialogRef.close(null)
  }

  create() {
    this.title.markAsTouched();
    if (this.title.hasError('required'))
    {
      return;
    }
    this.dialogRef.close({ title: this.title.value, description: this.description.value })
  }
}
