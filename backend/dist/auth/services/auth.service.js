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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
let AuthService = class AuthService {
    constructor(jwtService) {
        this.jwtService = jwtService;
        this.adminCredentials = {
            username: 'admin',
            password: '123',
        };
    }
    async validateCredentials(username, password) {
        if (username === this.adminCredentials.username && password === this.adminCredentials.password) {
            return true;
        }
        return false;
    }
    async login(username, password) {
        const isValid = await this.validateCredentials(username, password);
        if (!isValid) {
            throw new Error('Invalid credentials');
        }
        const payload = { username, sub: 'admin-user' };
        const access_token = this.jwtService.sign(payload);
        return { access_token };
    }
    validateToken(token) {
        try {
            return this.jwtService.verify(token);
        }
        catch (error) {
            return null;
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map