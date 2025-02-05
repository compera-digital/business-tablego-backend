export interface IResponseHandler {
    registrationSuccess(name: string, lastName: string, email: string): {
      success: boolean;
      status: number;
      message: string;
      user: { name: string; lastName: string; email: string };
    };
  
    loginSuccess(userId: string, email: string, token: string): {
      success: boolean;
      status: number;
      message: string;
      user: { userId: string; email: string; token: string };
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
  
    userNotVerified(email: string, remainingTime: number): {
      success: boolean;
      status: number;
      message: string;
      data: { email: string; remainingTime: number, nextResendAllowed: string };
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
  
    userExists(): {
      success: boolean;
      status: number;
      message: string;
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
  
    verificationSuccess(): {
      success: boolean;
      status: number;
      message: string;
    };
  
    newVerificationCodeSent(): {
      success: boolean;
      status: number;
      message: string;
    };
  }
  