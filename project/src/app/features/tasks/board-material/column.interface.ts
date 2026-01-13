import { Card } from "../column-material/card.interface";

export interface Column
{
    id: number,
    title: string,
    boardId: number,
    cards: Card[]
}