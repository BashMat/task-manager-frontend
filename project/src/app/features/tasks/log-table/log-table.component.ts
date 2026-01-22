import { Component, ViewChild, input, OnInit, AfterViewInit } from '@angular/core';
import { MatTable, MatTableModule, MatTableDataSource } from '@angular/material/table';
import { TrackingLogEntry } from './tracking-log-entry.interface';
import { Board } from '../boards-page-material/board.interface';
import { MatSort, MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'log-table',
  imports: [MatTableModule, MatSortModule],
  templateUrl: './log-table.component.html',
  styleUrl: './log-table.component.css'
})
export class LogTableComponent implements OnInit, AfterViewInit {
  board = input.required<Board>();

  displayedColumns: string[] = ['id', 'title', 'status', 'priority'];
  colors: string[] = ["bg-blue-400", "bg-cyan-400", "bg-pink-400", "bg-red-400", "bg-green-400"];
  defaultColor: string = "bg-amber-400";
  titleToColor: Map<string, string> = new Map<string, string>();

  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource(Array.of<TrackingLogEntry>());

  ngOnInit() {
    this.dataSource.data = this.board().columns.flatMap(column =>
      column.cards.map(card => {

        // TODO: Add colors to backend and just use them
        let curColor = this.colors.pop();
        if (curColor !== undefined) {
          this.titleToColor.set(column.title, curColor);
        }

        return {
          id: card.id,
          status: column.title,
          title: card.title,
          priority: card.priority
        }
      })
    )
      .sort((lhs, rhs) => lhs.priority === null || rhs.priority === null ? 1 : rhs.priority - lhs.priority);
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  getStatusColorClass(status: string) {
    if (this.titleToColor.has(status)) {
      return this.titleToColor.get(status);
    }

    return this.defaultColor;
  }
}