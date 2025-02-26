import { ILoginResponseDto, IVerificationResponseDto } from "@/core/types";

export interface IResponseHandler {
  // Auth Responses
  registrationSuccess(
    name: string,
    lastName: string,
    email: string
  ): {
    success: boolean;
    status: number;
    message: string;
    user: { name: string; lastName: string; email: string };
  };
  loginSuccess(
    user: ILoginResponseDto,
    token: string
  ): {
    success: boolean;
    status: number;
    message: string;
    user: ILoginResponseDto;
    token: string;
  };
  logoutSuccess(): {
    success: boolean;
    status: number;
    message: string;
  };

  // Verification Responses
  verificationSuccess(
    user: IVerificationResponseDto,
    token: string
  ): {
    success: boolean;
    status: number;
    message: string;
    user: IVerificationResponseDto;
    token: string;
  };
  verificationEmailResent(): {
    success: boolean;
    status: number;
    message: string;
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
  verificationCodeNotExpired(
    email: string,
    remainingTime: number
  ): {
    success: boolean;
    status: number;
    message: string;
    data: { email: string; remainingTime: number };
  };
  newVerificationCodeSent(): {
    success: boolean;
    status: number;
    message: string;
  };

  // User Responses
  invalidCurrentPassword(): {
    success: boolean;
    status: number;
    message: string;
  };
  passwordChangeSuccess(): {
    success: boolean;
    status: number;
    message: string;
  };

  // Password Reset Responses
  passwordResetLinkSent(): {
    success: boolean;
    status: number;
    message: string;
  };
  nonExistentEmailForPasswordReset(): {
    success: boolean;
    status: number;
    message: string;
  };
  passwordResetLinkExpired(): {
    success: boolean;
    status: number;
    message: string;
  };
  invalidPasswordResetLink(): {
    success: boolean;
    status: number;
    message: string;
  };
  passwordResetLinkVerified(): {
    success: boolean;
    status: number;
    message: string;
  };
  passwordResetSuccess(): {
    success: boolean;
    status: number;
    message: string;
  };
  passwordResetFailed(): {
    success: boolean;
    status: number;
    message: string;
  };

  // User Status Responses
  userNotFound(): {
    success: boolean;
    status: number;
    message: string;
  };
  userAlreadyVerified(): {
    success: boolean;
    status: number;
    message: string;
  };
  userNotVerified(
    email: string,
    isVerified: boolean,
    remainingTime: number
  ): {
    success: boolean;
    status: number;
    message: string;
    data: { email: string; isVerified: boolean; remainingTime: number };
    error: string;
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

  // Validation Responses
  invalidEmailFormat(): {
    success: boolean;
    status: number;
    message: string;
  };
  invalidEmailOrPassword(): {
    success: boolean;
    status: number;
    message: string;
  };
  validationError(): {
    success: boolean;
    status: number;
    message: string;
  };
  sameEmailProvided(): {
    success: boolean;
    status: number;
    message: string;
  };

  // Generic Responses
  error(
    message: string,
    status?: number
  ): {
    success: boolean;
    status: number;
    message: string;
  };
  unexpectedError(action: string): {
    success: boolean;
    status: number;
    message: string;
  };

  // Auth Error Responses
  unauthorized(): {
    success: boolean;
    status: number;
    message: string;
  };

  checkAuthSuccess(user?: any): {
    success: boolean;
    status: number;
    message: string;
    user?: any;
  };

  checkAuthFailed(): {
    success: boolean;
    status: number;
    message: string;
  };

  forbidden(): {
    success: boolean;
    status: number;
    message: string;
  };

  invalidToken(): {
    success: boolean;
    status: number;
    message: string;
  };

  tokenExpired(): {
    success: boolean;
    status: number;
    message: string;
  };
}
