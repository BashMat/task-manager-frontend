export interface Card
{
    id: number,
    title: string,
    description: string | null,
    columnId: number,
    orderIndex: number,
    createdBy: any,
    createdAt: Date,
    updatedBy: any,
    updatedAt: Date
}