import { Column } from "../board/column.interface"

export interface Board
{
    id: number,
    title: string,
    columns: Array<Column>
}