import { NotesService } from '../services/notes.service';
import { CreateNoteDto, UpdateNoteDto } from '../dto/note.dto';
import { Note } from '../entities/note.entity';
export declare class NotesController {
    private readonly notesService;
    constructor(notesService: NotesService);
    createNote(createNoteDto: CreateNoteDto): Promise<Note>;
    getAllNotes(categoryId?: string): Promise<Note[]>;
    getActiveNotes(): Promise<Note[]>;
    getArchivedNotes(): Promise<Note[]>;
    getNoteById(id: string): Promise<Note>;
    updateNote(id: string, updateNoteDto: UpdateNoteDto): Promise<Note>;
    archiveNote(id: string): Promise<Note>;
    unarchiveNote(id: string): Promise<Note>;
    deleteNote(id: string): Promise<{
        message: string;
    }>;
}
