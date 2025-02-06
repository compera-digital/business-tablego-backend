import type { IResponseHandler } from "./types";
import { ILoginResponseDto, IVerificationResponseDto } from "@/core/types";

export class ResponseHandler implements IResponseHandler {

  registrationSuccess(name: string, lastName: string, email: string) {
    return {
      success: true,
      status: 201,
      message: "Registration successful! Please check your email for verification.",
      user: { name, lastName, email }
    };
  }

  loginSuccess(user: ILoginResponseDto, token: string) {
    return {
      success: true,
      status: 200,
      message: "Logged in successfully.",
      user: { name: user.name, lastName: user.lastName, email: user.email, isVerified: user.isVerified },
      token
    };
  }

  error(message: string, status = 400) {
    return { success: false, status, message };
  }

  invalidEmailFormat() {
    return { success: false, status: 400, message: "Invalid email format." };
  }

  unexpectedError(operation: string) {
    return {
      success: false,
      status: 500,
      message: `An unexpected error occurred during ${operation}. Please try again later.`,
      error: "INTERNAL_SERVER_ERROR"
    };
  }

  validationError() {
    return { success: false, status: 400, message: "Invalid input format." };
  }

  userNotFound() {
    return { success: false, status: 404, message: "User not found." };
  }

  invalidEmailOrPassword() {
    return { success: false, status: 400, message: "Invalid email or password." };
  }

  sameEmailProvided() {
    return { success: false, status: 400, message: "This email is already registered but not verified." };
  }

  userAlreadyVerified() {
    return { success: false, status: 400, message: "User is already verified." };
  }

  userNotVerified(email: string, isVerified: boolean, remainingTime: number) {
    return {
      success: false,
      status: 400,
      message: "Account pending verification. Please check your email.",
      data: {
        email,
        isVerified,
        remainingTime,
      },
      error: "VERIFICATION_PENDING"
    };
  }

  verificationCodeExpired() {
    return { success: false, status: 400, message: "Verification code expired. Please request a new code." };
  }

  invalidVerificationCode() {
    return { success: false, status: 400, message: "Invalid verification code." };
  }

  verificationCodeNotExpired(email: string, remainingTime: number) {
    return { success: false, status: 400, message: "Verification code not expired. Please check your email for the code.", data: { email, remainingTime } };
  }


  emailInUse() {
    return {
      success: false,
      status: 400,
      message: "Account already exists. Please login.",
      error: "EMAIL_IN_USE"
    };
  }

  emailRegisteredNotVerified() {
    return { success: false, status: 400, message: "Email already registered but not verified." };
  }

  verificationEmailResent() {
    return { success: true, status: 200, message: "Verification email resent. Please check your inbox." };
  }

  logoutSuccess() {
    return { success: true, status: 200, message: "Logged out successfully." };
  }

  verificationSuccess (user: IVerificationResponseDto, token: string) {
    return { 
      success: true, 
      status: 200, message: "Verification successful.", 
      user: { name: user.name, lastName: user.lastName, email: user.email, isVerified: user.isVerified },
      token 
    };
  }

  newVerificationCodeSent() {
    return { success: true, status: 200, message: "New verification code sent. Please check your email." };
  }
}
