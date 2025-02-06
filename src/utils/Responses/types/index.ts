import { ILoginResponseDto, IVerificationResponseDto } from "@/core/types";

export interface IResponseHandler {
    registrationSuccess(name: string, lastName: string, email: string): {
      success: boolean;
      status: number;
      message: string;
      user: { name: string; lastName: string; email: string };
    };
  
    loginSuccess( user: ILoginResponseDto, token: string ): {
      success: boolean;
      status: number;
      message: string;
      user: ILoginResponseDto;
      token: string;
    };  

    invalidEmailFormat(): {
      success: boolean;
      status: number;
      message: string;
    };
  
    error(message: string, status?: number): {
      success: boolean;
      status: number;
      message: string;
    };
  
    unexpectedError(action: string): {
      success: boolean;
      status: number;
      message: string;
    };
  
    validationError(): {
      success: boolean;
      status: number;
      message: string;
    };
  
    userNotFound(): {
      success: boolean;
      status: number;
      message: string;
    };

    invalidEmailOrPassword(): {
      success: boolean;
      status: number;
      message: string;
    };
  
    sameEmailProvided(): {
      success: boolean;
      status: number;
      message: string;
    };
  
    userAlreadyVerified(): {
      success: boolean;
      status: number;
      message: string;
    };
  
    userNotVerified(email: string, isVerified: boolean, remainingTime: number): {
      success: boolean;
      status: number;
      message: string;
      data: { email: string; isVerified: boolean; remainingTime: number };
      error: string;
    };
  
    verificationCodeExpired(): {
      success: boolean;
      status: number;
      message: string;
    };
  
    invalidVerificationCode(): {
      success: boolean;
      status: number;
      message: string;
    };

    verificationCodeNotExpired(email: string, remainingTime: number): {
      success: boolean;
      status: number;
      message: string;
      data: { email: string; remainingTime: number };
    };
  
    emailInUse(): {
      success: boolean;
      status: number;
      message: string;
    };
  
    emailRegisteredNotVerified(): {
      success: boolean;
      status: number;
      message: string;
    };
  
    verificationEmailResent(): {
      success: boolean;
      status: number;
      message: string;
    };
  
    logoutSuccess(): {
      success: boolean;
      status: number;
      message: string;
    };
  
    verificationSuccess(user: IVerificationResponseDto, token: string): {
      success: boolean;
      status: number;
      message: string;
      user: IVerificationResponseDto;
      token: string;
    };
  
    newVerificationCodeSent(): {
      success: boolean;
      status: number;
      message: string;
    };
    
  }


  