"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotesService = void 0;
const common_1 = require("@nestjs/common");
const notes_repository_1 = require("../repositories/notes.repository");
let NotesService = class NotesService {
    constructor(notesRepository) {
        this.notesRepository = notesRepository;
    }
    async createNote(createNoteDto) {
        return await this.notesRepository.create(createNoteDto);
    }
    async getAllNotes() {
        return await this.notesRepository.findAll();
    }
    async getActiveNotes() {
        return await this.notesRepository.findActive();
    }
    async getArchivedNotes() {
        return await this.notesRepository.findArchived();
    }
    async getNoteById(id) {
        const note = await this.notesRepository.findById(id);
        if (!note) {
            throw new common_1.NotFoundException(`Note with ID ${id} not found`);
        }
        return note;
    }
    async updateNote(id, updateNoteDto) {
        const note = await this.notesRepository.update(id, updateNoteDto);
        if (!note) {
            throw new common_1.NotFoundException(`Note with ID ${id} not found`);
        }
        return note;
    }
    async deleteNote(id) {
        const deleted = await this.notesRepository.delete(id);
        if (!deleted) {
            throw new common_1.NotFoundException(`Note with ID ${id} not found`);
        }
        return { message: 'Note deleted successfully' };
    }
    async archiveNote(id) {
        const note = await this.notesRepository.archive(id);
        if (!note) {
            throw new common_1.NotFoundException(`Note with ID ${id} not found`);
        }
        return note;
    }
    async unarchiveNote(id) {
        const note = await this.notesRepository.unarchive(id);
        if (!note) {
            throw new common_1.NotFoundException(`Note with ID ${id} not found`);
        }
        return note;
    }
};
exports.NotesService = NotesService;
exports.NotesService = NotesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [notes_repository_1.NotesRepository])
], NotesService);
//# sourceMappingURL=notes.service.js.map