import { Column } from "../board-material/column.interface"

export interface Board
{
    id: number,
    title: string,
    description: string | null,
    createdBy: string,
    createdAt: Date,
    updatedBy: string,
    updatedAt: Date,
    columns: Array<Column>
}