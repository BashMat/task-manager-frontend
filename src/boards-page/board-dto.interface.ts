export interface BoardDto
{
    id: number,
    title: string,
    description: string | null,
    createdBy: any,
    CreatedAt: Date,
    updatedBy: any,
    updatedAt: Date,
    columns: any[]
}