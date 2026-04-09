import { Category } from '../../categories/entities/category.entity';
export declare class Note {
    id: string;
    title: string;
    content: string;
    excerpt: string;
    tags: string[];
    isArchived: boolean;
    categoryId: string;
    category: Category;
    createdAt: Date;
    updatedAt: Date;
}
