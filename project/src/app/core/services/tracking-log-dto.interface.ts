import { Status } from "./tracking-log-entry-status-dto.interface"
import { TrackingLogEntry } from "./tracking-log-entry-dto.interface"

export interface TrackingLogDto
{
    id: number,
    title: string,
    description: string | null,
    createdBy: any,
    createdAt: string,
    updatedBy: any,
    updatedAt: string,
    trackingLogEntriesStatuses: Status[],
    trackingLogEntries: TrackingLogEntry[]
}