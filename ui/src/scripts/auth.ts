// Auth script for signin and signup page

import api from './api';
import { SignUpRequest, SignInRequest, AuthResponse, ApiResponse, ApiError } from './interface';

export interface AuthError {
  message: string;
  field?: 'email' | 'password';
}

export const auth = {
  // Sign up new user
  async signUp(data: SignUpRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      const { name, ...rest } = data;
      const response = await api.post<ApiResponse<AuthResponse>>('/api/auth/signup', {
        ...rest,
        full_name: name
      });
      if (response.data.success && response.data.accessToken && response.data.refreshToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
      }
      return response.data;
    } catch (error: any) {
      const apiError = error.response?.data?.error as ApiError;
      throw {
        message: apiError?.message || 'Failed to create account. Please try again.',
        field: apiError?.code === 'EMAIL_EXISTS' ? 'email' : undefined
      };
    }
  },

  // Sign in existing user
  async signIn(data: SignInRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>('/api/auth/signin', {
        identifier: data.identifier,
        password: data.password
      });
      if (response.data.success && response.data.accessToken && response.data.refreshToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
      }
      return response.data;
    } catch (error: any) {
      const apiError = error.response?.data?.error as ApiError;
      const errorMessage = error.response?.data?.message || apiError?.message || 'Invalid credentials. Please try again.';
      
      // Handle specific error cases
      if (error.response?.status === 400) {
        if (errorMessage.toLowerCase().includes('user not found')) {
          throw {
            message: 'No account found with this identifier. Please sign up first.',
            field: 'identifier'
          };
        }
        if (errorMessage.toLowerCase().includes('credentials')) {
          throw {
            message: 'Incorrect password. Please try again.',
            field: 'password'
          };
        }
      }
      
      throw {
        message: errorMessage,
        field: apiError?.code === 'INVALID_CREDENTIALS' ? 'password' : undefined
      };
    }
  },

  // Sign out user
  async signOut(): Promise<void> {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/signin';
      return;
    }

    try {
      const response = await api.post('/api/auth/logout', null, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/signin';
      } else {
        throw new Error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Still remove tokens on error, but log the issue
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/signin';
    }
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken') && !!localStorage.getItem('refreshToken');
  },

  // Get current user token
  getToken(): string | null {
    return localStorage.getItem('accessToken');
  },

  // Get refresh token
  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  },

  // Validate email format
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validate password strength
  validatePassword(password: string): {
    isValid: boolean;
    message: string;
  } {
    if (password.length < 6) {
      return {
        isValid: false,
        message: 'Password must be at least 6 characters long'
      };
    }

    if (!/[A-Z]/.test(password)) {
      return {
        isValid: false,
        message: 'Password must contain at least one uppercase letter'
      };
    }

    if (!/[a-z]/.test(password)) {
      return {
        isValid: false,
        message: 'Password must contain at least one lowercase letter'
      };
    }

    if (!/[0-9]/.test(password)) {
      return {
        isValid: false,
        message: 'Password must contain at least one number'
      };
    }

    return {
      isValid: true,
      message: 'Password is valid'
    };
  }
};

export default auth;