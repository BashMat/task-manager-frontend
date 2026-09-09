import { Component, ElementRef, EventEmitter, Output, computed, input, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CdkTextareaAutosize, TextFieldModule } from '@angular/cdk/text-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { statusColor } from '../../../shared/utils/status-color';

@Component({
  selector: 'new-card',
  imports: [FormsModule, TextFieldModule, MatIconModule, MatButtonModule],
  templateUrl: './new-card.component.html',
  styleUrl: './new-card.component.css'
})
export class NewCardComponent {
  variant = input<'placeholder' | 'thin'>('placeholder');
  placeholder = input<string>('New entry');
  statusName = input<string>('');

  @Output() create = new EventEmitter<string>();
  @Output() expanded = new EventEmitter<void>();

  color = computed(() => statusColor(this.statusName()));

  readonly titleMaxLength = 256;

  isExpanded = signal(false);
  titleValue = '';

  private titleInput = viewChild<ElementRef<HTMLTextAreaElement>>('titleInput');
  private autosize = viewChild(CdkTextareaAutosize);

  expand() {
    this.isExpanded.set(true);
    this.expanded.emit();
    setTimeout(() => {
      this.titleInput()?.nativeElement.focus({preventScroll: true});
      this.autosize()?.resizeToFitContent(true);
    });
  }

  onTitleChange(value: string) {
    this.titleValue = value.replace(/[\r\n]+/g, ' ');
    this.autosize()?.resizeToFitContent(true);
  }

  submit() {
    const title = this.titleValue.trim();
    if (title !== '') {
      this.create.emit(title);
    }
    this.reset();
  }

  cancel() {
    this.reset();
  }

  private reset() {
    this.titleValue = '';
    this.isExpanded.set(false);
  }
}