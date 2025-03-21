// get the interface for the all the data that user send to the server and get from the server

// User related interfaces
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends User {
  avatar?: string;
  bio?: string;
  role: 'student' | 'teacher' | 'admin';
}

// Authentication related interfaces
export interface SignUpRequest {
  name: string;
  email: string;
  username: string;
  password: string;
}

export interface SignInRequest {
  identifier: string;  // Can be either email or username
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

// Classroom related interfaces
export interface Classroom {
  id: string;
  name: string;
  description: string;
  teacherId: string;
  createdAt: string;
  updatedAt: string;
  studentCount: number;
}

export interface CreateClassroomRequest {
  name: string;
  description: string;
}

export interface JoinClassroomRequest {
  classroomId: string;
  code?: string;
}

// Error response interface
export interface ApiError {
  message: string;
  code: string;
  status: number;
}

// API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  accessToken?: string;
  refreshToken?: string;
  user?: User;
}

// Pagination interfaces
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Form validation interfaces
export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Common interfaces
export interface Timestamp {
  createdAt: string;
  updatedAt: string;
}

export interface BaseEntity extends Timestamp {
  id: string;
}

// Request/Response headers
export interface RequestHeaders {
  Authorization?: string;
  'Content-Type': string;
}

export interface ResponseHeaders {
  'Content-Type': string;
  'Access-Control-Allow-Origin': string;
  'Access-Control-Allow-Credentials': string;
}