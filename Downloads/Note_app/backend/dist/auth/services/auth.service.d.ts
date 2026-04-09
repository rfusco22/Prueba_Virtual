import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private readonly jwtService;
    constructor(jwtService: JwtService);
    private readonly adminCredentials;
    validateCredentials(username: string, password: string): Promise<boolean>;
    login(username: string, password: string): Promise<{
        access_token: string;
    }>;
    validateToken(token: string): any;
}
