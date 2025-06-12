export interface Card
{
    id: number,
    title: string,
    description: string | null,
    boardId: number,
    columnId: number,
    priority: number,
    orderIndex: number,
    updatedAt: Date
}