import {Component, OnInit} from '@angular/core';
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
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DynamicHeaderComponent } from '../../../shared/components/dynamic-header.component';
import { NotFoundComponent } from '../../../shared/components/not-found/not-found.component';
import { ProfileResult } from '../../../shared/user.resolver';
import { TaskManagerBackendService } from '../../../core/services/task-manager-backend.service';
import { TrackingLogDto } from '../../../core/services/tracking-log-dto.interface';
import { parseBackendDate } from '../../../shared/pipes/local-date-time.pipe';

interface DayCell {
  count: number;
  level: number;
  title: string;
}

interface ContributionData {
  cells: DayCell[];
  monthLabels: string[];
}

@Component({
  selector: 'profile-page',
  imports: [RouterOutlet, MatCardModule, MatFormFieldModule, MatInputModule, MatIconModule, MatListModule, MatButtonModule, MatTooltipModule, FormsModule, CommonModule, DynamicHeaderComponent, NotFoundComponent],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css'
})
export class ProfilePageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private backend = inject(TaskManagerBackendService);
  private data = toSignal(this.route.data);
  private now = new Date();

  profile = computed<ProfileResult | undefined>(() => this.data()?.['profile']);
  status = computed(() => this.profile()?.status);

  username = computed(() => {
    const profile = this.profile();
    return profile?.status === 'visible' ? profile.user.userName : null;
  });
  firstName = computed(() => this.getData('firstName'));
  lastName = computed(() => this.getData('lastName'));

  private readonly activityMonths = 3;
  activityLoading = signal(false);
  mostActiveBoardName = signal<string | null>(null);
  totalActions = signal(0);
  entriesCreated = signal(0);
  private activityByDate = signal<Map<string, number>>(new Map());

  busiestDay = computed<{ count: number; dateLabel: string }>(() => {
    let count = 0;
    let dateLabel = '';
    for (const [key, value] of this.activityByDate()) {
      if (value > count) {
        count = value;
        const [year, month, day] = key.split('-').map(Number);
        dateLabel = new Date(year, month, day).toLocaleDateString();
      }
    }
    return { count, dateLabel };
  });
  private readonly levelColors = ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'];

  private readonly monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  contributionGrid = computed<ContributionData>(() => {
    const activity = this.activityByDate();
    const start = this.windowStart();
    const endExclusive = this.windowEndExclusive();
    const lastDay = new Date(endExclusive.getFullYear(), endExclusive.getMonth(), 0);

    const cells: DayCell[] = [];
    const monthLabels: string[] = [];
    let lastLabeledMonth = -1;
    let columnFirstDay: Date | null = null;
    let dayInColumn = 0;

    const pushColumnLabel = (firstDay: Date | null) => {
      let label = '';
      if (firstDay !== null && firstDay.getMonth() !== lastLabeledMonth) {
        label = this.monthNames[firstDay.getMonth()];
        lastLabeledMonth = firstDay.getMonth();
      }
      monthLabels.push(label);
    };

    for (let day = new Date(start); day <= lastDay; day.setDate(day.getDate() + 1)) {
      if (columnFirstDay === null) {
        columnFirstDay = new Date(day);
      }
      const count = activity.get(this.dayKey(day)) ?? 0;
      cells.push({ count, level: this.levelFor(count), title: `${count} action${count === 1 ? '' : 's'} on ${day.toLocaleDateString()}` });

      dayInColumn++;
      if (dayInColumn === 7) {
        pushColumnLabel(columnFirstDay);
        dayInColumn = 0;
        columnFirstDay = null;
      }
    }
    if (dayInColumn > 0) {
      pushColumnLabel(columnFirstDay);
    }

    return { cells, monthLabels };
  });

  ngOnInit(): void {
    if (this.status() !== 'visible') {
      return;
    }

    this.activityLoading.set(true);
    this.backend.GetBoards().subscribe({
      next: (response: any) => {
        const boards: TrackingLogDto[] = response?.data ?? [];
        this.summarizeActivity(boards);
        this.activityLoading.set(false);
      },
      error: (error) => {
        console.error('Failed to load tracking logs for profile activity', error);
        this.activityLoading.set(false);
      }
    });
  }

  levelColor(level: number): string {
    return this.levelColors[level] ?? this.levelColors[0];
  }

  private summarizeActivity(boards: TrackingLogDto[]): void {
    const start = this.windowStart();
    const endExclusive = this.windowEndExclusive();
    const inWindow = (date: Date) => date >= start && date < endExclusive;

    const activity = new Map<string, number>();
    let best: { name: string; count: number; lastEvent: number } | null = null;
    let totalActions = 0;
    let entriesCreated = 0;

    for (const board of boards) {
      const windowEvents = this.collectBoardEvents(board).filter(inWindow);
      for (const event of windowEvents) {
        const key = this.dayKey(event);
        activity.set(key, (activity.get(key) ?? 0) + 1);
      }
      totalActions += windowEvents.length;

      for (const entry of board.trackingLogEntries ?? []) {
        if (inWindow(parseBackendDate(entry.createdAt))) {
          entriesCreated++;
        }
      }

      if (windowEvents.length === 0) {
        continue;
      }
      const lastEvent = Math.max(...windowEvents.map(event => event.getTime()));
      if (best === null || windowEvents.length > best.count || (windowEvents.length === best.count && lastEvent > best.lastEvent)) {
        best = { name: board.title, count: windowEvents.length, lastEvent };
      }
    }

    this.activityByDate.set(activity);
    this.mostActiveBoardName.set(best?.name ?? null);
    this.totalActions.set(totalActions);
    this.entriesCreated.set(entriesCreated);
  }

  private windowStart(): Date {
    return new Date(this.now.getFullYear(), this.now.getMonth() - (this.activityMonths - 1), 1);
  }

  private windowEndExclusive(): Date {
    return new Date(this.now.getFullYear(), this.now.getMonth() + 1, 1);
  }

  private dayKey(date: Date): string {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  }

  private collectBoardEvents(board: TrackingLogDto): Date[] {
    const events: Date[] = [];
    const add = (createdAt: string, updatedAt: string) => {
      events.push(parseBackendDate(createdAt));
      if (updatedAt !== createdAt) {
        events.push(parseBackendDate(updatedAt));
      }
    };

    add(board.createdAt, board.updatedAt);
    for (const entry of board.trackingLogEntries ?? []) {
      add(entry.createdAt, entry.updatedAt);
    }
    return events;
  }

  private levelFor(count: number): number {
    if (count === 0) {
      return 0;
    }
    if (count <= 2) {
      return 1;
    }
    if (count <= 5) {
      return 2;
    }
    if (count <= 9) {
      return 3;
    }
    return 4;
  }

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