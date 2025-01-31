import { Request } from 'express';
import { UserRole } from '@prisma/client';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role?: UserRole;
  };
}

export interface RegisterRequestBody {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequestBody {
  email: string;
  password: string;
}

export interface VerifyEmailRequestBody {
  email: string;
  code: string;
}

export interface ResendVerificationRequestBody {
  email: string;
}

export interface CreateRestaurantRequestBody {
  name: string;
  description?: string;
  address: string;
  city: string;
  country: string;
  phone?: string;
  email: string;
  website?: string;
}

export interface AddStaffRequestBody {
  email: string;
  role: UserRole;
  restaurantId: string;
} 