import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  // Hardcoded credentials for demo
  private readonly adminCredentials = {
    username: 'admin',
    password: '123',
  };

  async validateCredentials(username: string, password: string): Promise<boolean> {
    if (username === this.adminCredentials.username && password === this.adminCredentials.password) {
      return true;
    }
    return false;
  }

  async login(username: string, password: string): Promise<{ access_token: string }> {
    const isValid = await this.validateCredentials(username, password);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    const payload = { username, sub: 'admin-user' };
    const access_token = this.jwtService.sign(payload);

    return { access_token };
  }

  validateToken(token: string): any {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      return null;
    }
  }
}
