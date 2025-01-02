export interface Column
{
    id: number,
    title: string,
    description: string | null,
    boardId: number,
    createdBy: any,
    CreatedAt: Date,
    updatedBy: any,
    updatedAt: Date,
    cards: any[]
}