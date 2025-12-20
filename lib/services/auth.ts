import { User } from '../../types';
import { db, delay, ApiError } from '../db';

interface LoginResponse {
  user: User;
  token: string;
  expiresAt: number;
}

export const authApi = {
  login: async (email: string, _password?: string, rememberMe?: boolean): Promise<LoginResponse> => {
    await delay(600);
    const users = db.get('users');
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) throw new ApiError('Invalid email or password', 401);
    if (user.status === 'DISABLED') throw new ApiError('Account is disabled by administrator', 403);

    const duration = rememberMe ? 7 * 24 * 3600 * 1000 : 24 * 3600 * 1000;
    return {
      user,
      token: `mock_jwt_${Math.random().toString(36).substr(2)}`,
      expiresAt: Date.now() + duration
    };
  }
};
