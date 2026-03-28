import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import { inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { computed, signal } from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DynamicHeaderComponent } from '../../../shared/components/dynamic-header.component';

@Component({
  selector: 'profile-page',
  imports: [RouterOutlet, MatCardModule, MatFormFieldModule, MatInputModule, MatIconModule, MatListModule, MatButtonModule, FormsModule, CommonModule, DynamicHeaderComponent],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css'
})
export class ProfilePageComponent {
  private route = inject(ActivatedRoute);
  private data = toSignal(this.route.data);
  username = computed(() => this.getData('username'));
  firstName = computed(() => this.getData('firstName'));
  lastName = computed(() => this.getData('lastName'));

  isEditing = signal(false);
  editUsername = signal('');
  editFirstName = signal('');
  editLastName = signal('');

  toggleEdit() {
    // TODO: Use Edit mode when write API is available
    return;
    if (!this.isEditing()) {
      this.editUsername.set(this.username() || '');
      this.editFirstName.set(this.firstName() || '');
      this.editLastName.set(this.lastName() || '');
    }
    this.isEditing.update(val => !val);
  }

  save() {
    // TODO: Implement save logic to persist changes
    this.isEditing.set(false);
  }

  cancel() {
    this.isEditing.set(false);
  }

  private getData(key: string): string | null {
    const data = this.data();
    if (data === undefined) {
      return null;
    }
    return data![key] as string || null;
  }
}