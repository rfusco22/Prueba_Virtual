import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus, UseGuards, Query } from '@nestjs/common';
import { NotesService } from '../services/notes.service';
import { CreateNoteDto, UpdateNoteDto } from '../dto/note.dto';
import { Note } from '../entities/note.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('api/notes')
@UseGuards(JwtAuthGuard)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createNote(@Body() createNoteDto: CreateNoteDto): Promise<Note> {
    return await this.notesService.createNote(createNoteDto);
  }

  @Get()
  async getAllNotes(@Query('categoryId') categoryId?: string): Promise<Note[]> {
    if (categoryId) {
      return await this.notesService.getNotesByCategory(categoryId);
    }
    return await this.notesService.getAllNotes();
  }

  @Get('active')
  async getActiveNotes(): Promise<Note[]> {
    return await this.notesService.getActiveNotes();
  }

  @Get('archived')
  async getArchivedNotes(): Promise<Note[]> {
    return await this.notesService.getArchivedNotes();
  }

  @Get(':id')
  async getNoteById(@Param('id') id: string): Promise<Note> {
    return await this.notesService.getNoteById(id);
  }

  @Put(':id')
  async updateNote(
    @Param('id') id: string,
    @Body() updateNoteDto: UpdateNoteDto,
  ): Promise<Note> {
    return await this.notesService.updateNote(id, updateNoteDto);
  }

  @Post(':id/archive')
  async archiveNote(@Param('id') id: string): Promise<Note> {
    return await this.notesService.archiveNote(id);
  }

  @Post(':id/unarchive')
  async unarchiveNote(@Param('id') id: string): Promise<Note> {
    return await this.notesService.unarchiveNote(id);
  }

  @Delete(':id')
  async deleteNote(@Param('id') id: string): Promise<{ message: string }> {
    return await this.notesService.deleteNote(id);
  }
}

