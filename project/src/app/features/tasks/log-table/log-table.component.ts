import { Component, ViewChild, input, OnInit, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { MatTable, MatTableModule, MatTableDataSource } from '@angular/material/table';
import { TrackingLogEntry } from './tracking-log-entry.interface';
import { TrackingLogEntry as ServiceTrackingLogEntry } from '../../../core/services/tracking-log-entry-dto.interface';
import { Board } from '../boards-page-material/board.interface';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TaskManagerBackendService } from '../../../core/services/task-manager-backend.service';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { MatDialog } from '@angular/material/dialog';
import { CreationDialog } from '../../../shared/components/dialogs/creation-dialog/creation-dialog.component';
import { Status } from '../../../core/services/tracking-log-entry-status-dto.interface';
import { Card } from '../column/card.interface';
import { MatCardModule } from '@angular/material/card';
import { DetailsForm } from '../../../shared/components/details-form/details-form.component';

@Component({
  selector: 'log-table',
  imports: [MatTableModule, MatSortModule, MatButtonModule, MatIconModule, MatCardModule],
  templateUrl: './log-table.component.html',
  styleUrl: './log-table.component.css'
})
export class LogTableComponent implements OnInit, AfterViewInit {
  board = input.required<Board>();

  displayedColumns: string[] = ['id', 'title', 'status', 'priority'];
  colors: string[] = ["bg-blue-400", "bg-cyan-400", "bg-pink-400", "bg-red-400", "bg-green-400"];
  defaultColor: string = "bg-amber-400";
  titleToColor: Map<string, string> = new Map<string, string>();

  @ViewChild(MatTable) table!: MatTable<TrackingLogEntry>;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource(Array.of<TrackingLogEntry>());

  @Output() deleteBoardEvent = new EventEmitter<number>();

    constructor(private taskManagerBackendService: TaskManagerBackendService,
      private localStorageService: LocalStorageService,
      private dialog: MatDialog) {
      this.taskManagerBackendService = taskManagerBackendService;
      this.localStorageService = localStorageService;
      this.dialog = dialog;
    }

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

  OpenDetails() {
      let boardDto = this.board();
      let dialogRef = this.dialog.open(DetailsForm, {
        autoFocus: false,
        height: "80%",
        minWidth: "80vw",
        data: {
          id: boardDto.id,
          title: boardDto.title,
          description: boardDto.description,
          createdBy: boardDto.createdBy,
          createdAt: boardDto.createdAt.toLocaleString(),
          updatedBy: boardDto.updatedBy,
          updatedAt: boardDto.updatedAt.toLocaleString()
        }
      });
    }

    OpenRowDetails(row: any) {
      let trackingLogEntryId = row.id;
      let trackingLogEntry = this.board().columns.flatMap(o => o.cards).find(o => o.id === trackingLogEntryId);

      if (trackingLogEntry === undefined)
      {
        return;
      }

      let dialogRef = this.dialog.open(DetailsForm, {
        autoFocus: false,
        height: "80%",
        minWidth: "80vw",
        data: {
          id: trackingLogEntry.id,
          title: trackingLogEntry.title,
          description: trackingLogEntry.description,
          createdBy: trackingLogEntry.createdBy,
          createdAt: trackingLogEntry.createdAt.toLocaleString(),
          updatedBy: trackingLogEntry.updatedBy,
          updatedAt: trackingLogEntry.updatedAt.toLocaleString()
        }
      });
    }

    DeleteBoard() {
      this.deleteBoardEvent.emit(this.board().id);
    }

    AddColumn(): void {
      let dialogRef = this.dialog.open(CreationDialog, { autoFocus: false })

      dialogRef.afterClosed().subscribe(result => {
        if (result === null)
        {
          return;
        }

        console.log("Adding column");
        if (result.title === null || result.title === undefined)
        {
          console.log("Cannot add column without title")
          return;
        }

        this.taskManagerBackendService.AddColumn(this.board().id, result.title, result.description)
          .subscribe((response: { data: Status, message: string, success: boolean }) => {
            console.log("response: ", response)
            if (response.data !== null) {
              let column = { id: response.data.id, title: response.data.title, boardId: response.data.trackingLogId, cards: [] as Array<Card> }
              this.board().columns.push(column)
            }
          })
      })
    }

    AddCard(): void {
        let dialogRef = this.dialog.open(CreationDialog, { autoFocus: false })

        dialogRef.afterClosed().subscribe(result => {
          if (result === null) {
            return;
          }

          console.log("Adding card");
          if (result.title === null || result.title === undefined) {
            console.log("Cannot add card without title")
            return;
          }

          // TODO: add status selection in dialog
          var status = this.board().columns.at(0)!;

          this.taskManagerBackendService.AddCard(this.board().id,
                                                status.id,
                                                 result.title,
                                                 result.description,
                                                 // TODO: decide on actual algorithm to choose index
                                                 1)
            .subscribe((response: { data: ServiceTrackingLogEntry, message: string, success: boolean }) => {
              console.log("response: ", response)
              if (response.data !== null) {
                let card = {
                  id: response.data.id,
                  title: response.data.title,
                  description: response.data.description,
                  boardId: response.data.trackingLogId,
                  columnId: response.data.status.id,
                  priority: response.data.priority,
                  orderIndex: response.data.orderIndex,
                  createdBy: response.data.createdBy,
                  createdAt: response.data.createdAt,
                  updatedBy: response.data.updatedBy,
                  updatedAt: response.data.updatedAt
                };
                status.cards.push(card);
                this.dataSource.data.push({ id: card.id, title: card.title, status: status.title, priority: null});
                this.dataSource.data = [...this.dataSource.data];
              }
            })
        })
      }
}
