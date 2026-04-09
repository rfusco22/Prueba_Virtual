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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotesRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const note_entity_1 = require("../entities/note.entity");
let NotesRepository = class NotesRepository {
    constructor(noteRepository) {
        this.noteRepository = noteRepository;
    }
    async create(createNoteDto) {
        const note = this.noteRepository.create(createNoteDto);
        return await this.noteRepository.save(note);
    }
    async findAll() {
        return await this.noteRepository.find({
            order: { createdAt: 'DESC' },
        });
    }
    async findById(id) {
        return await this.noteRepository.findOne({ where: { id } });
    }
    async findActive() {
        return await this.noteRepository.find({
            where: { isArchived: false },
            order: { createdAt: 'DESC' },
        });
    }
    async findArchived() {
        return await this.noteRepository.find({
            where: { isArchived: true },
            order: { createdAt: 'DESC' },
        });
    }
    async update(id, updateNoteDto) {
        await this.noteRepository.update(id, updateNoteDto);
        return await this.findById(id);
    }
    async delete(id) {
        const result = await this.noteRepository.delete(id);
        return result.affected > 0;
    }
    async archive(id) {
        return await this.update(id, { isArchived: true });
    }
    async unarchive(id) {
        return await this.update(id, { isArchived: false });
    }
};
exports.NotesRepository = NotesRepository;
exports.NotesRepository = NotesRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(note_entity_1.Note)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], NotesRepository);
//# sourceMappingURL=notes.repository.js.map