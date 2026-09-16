import { Component, inject, signal } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { BackgroundPreferenceService } from '../../../../core/services/background-preference.service';

@Component({
  selector: 'background-settings-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    FormsModule
  ],
  templateUrl: './background-settings-dialog.component.html',
  styleUrl: './background-settings-dialog.component.css'
})
export class BackgroundSettingsDialog {
  readonly backgroundPreference = inject(BackgroundPreferenceService);
  private readonly dialogRef = inject(MatDialogRef<BackgroundSettingsDialog>);

  private readonly initialColor = this.backgroundPreference.current();
  readonly selectedColor = signal<string>(this.backgroundPreference.current());

  SelectColor(hex: string): void {
    this.selectedColor.set(hex);
    this.backgroundPreference.previewColor(hex);
  }

  Cancel(): void {
    this.backgroundPreference.previewColor(this.initialColor);
    this.dialogRef.close();
  }

  Save(): void {
    this.backgroundPreference.setColor(this.selectedColor());
    this.dialogRef.close();
  }
}