export declare class CreateNoteDto {
    title: string;
    content: string;
    excerpt?: string;
    tags?: string[];
    categoryId?: string;
}
export declare class UpdateNoteDto {
    title?: string;
    content?: string;
    excerpt?: string;
    tags?: string[];
    isArchived?: boolean;
    categoryId?: string;
}
