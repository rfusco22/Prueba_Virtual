import { Repository } from 'typeorm';
import { Note } from '../entities/note.entity';
import { CreateNoteDto, UpdateNoteDto } from '../dto/note.dto';
export declare class NotesRepository {
    private readonly noteRepository;
    constructor(noteRepository: Repository<Note>);
    create(createNoteDto: CreateNoteDto): Promise<Note>;
    findAll(): Promise<Note[]>;
    findById(id: string): Promise<Note | null>;
    findActive(): Promise<Note[]>;
    findArchived(): Promise<Note[]>;
    update(id: string, updateNoteDto: UpdateNoteDto): Promise<Note | null>;
    delete(id: string): Promise<boolean>;
    archive(id: string): Promise<Note | null>;
    unarchive(id: string): Promise<Note | null>;
}
