import { AuthService } from '../services/auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(credentials: {
        username: string;
        password: string;
    }): Promise<{
        access_token: string;
    }>;
}
