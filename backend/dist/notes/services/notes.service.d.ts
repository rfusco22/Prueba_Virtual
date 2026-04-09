import { NotesRepository } from '../repositories/notes.repository';
import { CreateNoteDto, UpdateNoteDto } from '../dto/note.dto';
import { Note } from '../entities/note.entity';
export declare class NotesService {
    private readonly notesRepository;
    constructor(notesRepository: NotesRepository);
    createNote(createNoteDto: CreateNoteDto): Promise<Note>;
    getAllNotes(): Promise<Note[]>;
    getActiveNotes(): Promise<Note[]>;
    getArchivedNotes(): Promise<Note[]>;
    getNoteById(id: string): Promise<Note>;
    updateNote(id: string, updateNoteDto: UpdateNoteDto): Promise<Note>;
    deleteNote(id: string): Promise<{
        message: string;
    }>;
    archiveNote(id: string): Promise<Note>;
    unarchiveNote(id: string): Promise<Note>;
}
