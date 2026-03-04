import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

interface AuthResponse {
  token: string;
  user: { id: string; email: string; name?: string };
}

export const authService = {
  async login(dto: { email: string; password: string }): Promise<AuthResponse> {
    const response = await axios.get(`${API_URL}/auth/login`, { params: dto });
    const data: AuthResponse = response.data;
    localStorage.setItem('token', data.token);
    return data;
  },

  async signup(dto: { email: string; name: string; password: string }): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/auth/signup`, dto);
    const data: AuthResponse = response.data;
    localStorage.setItem('token', data.token);
    return data;
  },

  logout(): void {
    localStorage.removeItem('token');
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },
};
