import { Card } from "../column/card.interface";

export interface Column
{
    id: number,
    title: string,
    boardId: number,
    cards: Card[]
}
