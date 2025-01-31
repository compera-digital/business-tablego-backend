import type { IResponseHandler } from "./types";

export class ResponseHandler implements IResponseHandler {
  registrationSuccess(userId: string, email: string) {
    return {
      success: true,
      status: 201,
      message: "Registration successful. Please verify your email.",
      user: { userId, email }
    };
  }

  loginSuccess(userId: string, email: string, token: string) {
    return {
      success: true,
      status: 200,
      message: "Logged in successfully.",
      user: { userId, email, token }
    };
  }

  error(message: string, status = 400) {
    return { success: false, status, message };
  }

  unexpectedError(action: string) {
    return {
      success: false,
      status: 500,
      message: `An unexpected error occurred during ${action}. Please try again later.`,
    };
  }

  validationError() {
    return { success: false, status: 400, message: "Invalid input format." };
  }

  userNotFound() {
    return { success: false, status: 404, message: "User not found." };
  }

  sameEmailProvided() {
    return { success: false, status: 400, message: "This email is already registered but not verified." };
  }

  userAlreadyVerified() {
    return { success: false, status: 400, message: "User is already verified." };
  }

  userNotVerified(email: string, remainingTime: number) {
    return {
      success: false,
      status: 400,
      message: "User is not verified.",
      user: { email, remainingTime: remainingTime > 0 ? remainingTime : 0 }
    };
  }

  verificationCodeExpired() {
    return { success: false, status: 400, message: "Verification code expired. Please request a new code." };
  }

  invalidVerificationCode() {
    return { success: false, status: 400, message: "Invalid verification code." };
  }

  userExists() {
    return { success: false, status: 400, message: "Account already exists." };
  }

  emailInUse() {
    return { success: false, status: 400, message: "Email already in use by another account." };
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

  verificationSuccess() {
    return { success: true, status: 200, message: "Verification successful." };
  }

  newVerificationCodeSent() {
    return { success: true, status: 200, message: "New verification code sent. Please check your email." };
  }
}
