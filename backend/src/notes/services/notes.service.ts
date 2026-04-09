import { Injectable, NotFoundException } from '@nestjs/common';
import { NotesRepository } from '../repositories/notes.repository';
import { CreateNoteDto, UpdateNoteDto } from '../dto/note.dto';
import { Note } from '../entities/note.entity';

@Injectable()
export class NotesService {
  constructor(private readonly notesRepository: NotesRepository) {}

  async createNote(createNoteDto: CreateNoteDto): Promise<Note> {
    return await this.notesRepository.create(createNoteDto);
  }

  async getAllNotes(): Promise<Note[]> {
    return await this.notesRepository.findAll();
  }

  async getActiveNotes(): Promise<Note[]> {
    return await this.notesRepository.findActive();
  }

  async getArchivedNotes(): Promise<Note[]> {
    return await this.notesRepository.findArchived();
  }

  async getNoteById(id: string): Promise<Note> {
    const note = await this.notesRepository.findById(id);
    if (!note) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }
    return note;
  }

  async updateNote(id: string, updateNoteDto: UpdateNoteDto): Promise<Note> {
    const note = await this.notesRepository.update(id, updateNoteDto);
    if (!note) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }
    return note;
  }

  async deleteNote(id: string): Promise<{ message: string }> {
    const deleted = await this.notesRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }
    return { message: 'Note deleted successfully' };
  }

  async archiveNote(id: string): Promise<Note> {
    const note = await this.notesRepository.archive(id);
    if (!note) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }
    return note;
  }

  async unarchiveNote(id: string): Promise<Note> {
    const note = await this.notesRepository.unarchive(id);
    if (!note) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }
    return note;
  }
}
