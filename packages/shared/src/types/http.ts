// HTTP Response format
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
  meta?: {
    pagination?: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

// Auth response
export interface AuthTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: any;
}

// Pagination query
export interface PaginationQuery {
  page?: number;
  limit?: number;
}

// JWT Payload
export interface JWTPayload {
  sub: string; // user ID
  email: string;
  role: string;
  iat: number;
  exp: number;
}
