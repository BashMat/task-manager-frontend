import { Status } from "./tracking-log-entry-status-dto.interface";

export interface TrackingLogEntry
{
    id: number,
    trackingLogId: number,
    status: Status,
    title: string,
    description: string | null,
    priority: number | null,
    orderIndex: number,
    createdBy: any,
    CreatedAt: Date,
    updatedBy: any,
    updatedAt: Date,
}