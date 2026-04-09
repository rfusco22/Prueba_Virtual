import { Note } from '../../notes/entities/note.entity';
export declare class Category {
    id: string;
    name: string;
    color: string;
    order: number;
    createdAt: Date;
    updatedAt: Date;
    notes: Note[];
}
