import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from '../entities/note.entity';
import { CreateNoteDto, UpdateNoteDto } from '../dto/note.dto';

@Injectable()
export class NotesRepository {
  constructor(
    @InjectRepository(Note)
    private readonly noteRepository: Repository<Note>,
  ) {}

  async create(createNoteDto: CreateNoteDto): Promise<Note> {
    const note = this.noteRepository.create(createNoteDto);
    return await this.noteRepository.save(note);
  }

  async findAll(): Promise<Note[]> {
    return await this.noteRepository.find({
      order: { createdAt: 'DESC' },
      relations: ['category'],
    });
  }

  async findById(id: string): Promise<Note | null> {
    return await this.noteRepository.findOne({
      where: { id },
      relations: ['category'],
    });
  }

  async findActive(): Promise<Note[]> {
    return await this.noteRepository.find({
      where: { isArchived: false },
      order: { createdAt: 'DESC' },
      relations: ['category'],
    });
  }

  async findArchived(): Promise<Note[]> {
    return await this.noteRepository.find({
      where: { isArchived: true },
      order: { createdAt: 'DESC' },
      relations: ['category'],
    });
  }

  async findByCategory(categoryId: string): Promise<Note[]> {
    return await this.noteRepository.find({
      where: { categoryId, isArchived: false },
      order: { createdAt: 'DESC' },
      relations: ['category'],
    });
  }

  async update(id: string, updateNoteDto: UpdateNoteDto): Promise<Note | null> {
    await this.noteRepository.update(id, updateNoteDto);
    return await this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.noteRepository.delete(id);
    return result.affected > 0;
  }

  async archive(id: string): Promise<Note | null> {
    return await this.update(id, { isArchived: true });
  }

  async unarchive(id: string): Promise<Note | null> {
    return await this.update(id, { isArchived: false });
  }
}

