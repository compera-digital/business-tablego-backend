import { AuthProvider } from "@prisma/client";

export interface RegisterUserDTO {
    name: string;
    lastName: string;
    email: string;
    referralCode: string;
    password: string;
    authProvider: AuthProvider;
    isVerified: boolean;
}

export interface ResgisterdUserDto {
    name: string;
    lastName: string;
    email: string;
}

export interface ILoginResponseDto {
    name: string;
    lastName: string;
    email: string;
    isVerified: boolean;
}

export interface IVerificationResponseDto {
    name: string;
    lastName: string;
    email: string;
    isVerified: boolean;
} 