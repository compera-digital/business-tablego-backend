import type { IResponseHandler } from "./types";
import { ILoginResponseDto, IVerificationResponseDto } from "@/core/types";

export class ResponseHandler implements IResponseHandler {
  // Auth Responses
  registrationSuccess(name: string, lastName: string, email: string) {
    return {
      success: true,
      status: 201,
      message:
        "Registration successful! Please check your email for verification.",
      user: {
        name,
        lastName,
        email,
      },
    };
  }

  loginSuccess(user: ILoginResponseDto, token: string) {
    return {
      success: true,
      status: 200,
      message: "Logged in successfully.",
      user: {
        id: user.id,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        isVerified: user.isVerified,
      },
      token,
    };
  }

  logoutSuccess() {
    return {
      success: true,
      status: 200,
      message: "Logged out successfully.",
    };
  }

  // Verification Responses
  verificationSuccess(user: IVerificationResponseDto, token: string) {
    return {
      success: true,
      status: 200,
      message: "Verification successful.",
      user: {
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        isVerified: user.isVerified,
      },
      token,
    };
  }

  verificationEmailResent() {
    return {
      success: true,
      status: 200,
      message: "Verification email resent. Please check your inbox.",
    };
  }

  verificationCodeExpired() {
    return {
      success: false,
      status: 400,
      message: "Verification code expired. Please request a new code.",
    };
  }

  invalidVerificationCode() {
    return {
      success: false,
      status: 400,
      message: "Invalid verification code.",
    };
  }

  verificationCodeNotExpired(email: string, remainingTime: number) {
    return {
      success: false,
      status: 400,
      message:
        "Verification code not expired. Please check your email for the code.",
      data: {
        email,
        remainingTime,
      },
    };
  }

  newVerificationCodeSent() {
    return {
      success: true,
      status: 200,
      message: "New verification code sent. Please check your email.",
    };
  }

  // user responses
  invalidCurrentPassword() {
    return {
      success: false,
      status: 400,
      message: "Current password is incorrect",
    };
  }

  passwordChangeSuccess() {
    return {
      success: true,
      status: 200,
      message: "Password changed successfully",
    };
  }

  // Password Reset Responses
  passwordResetLinkSent() {
    return {
      success: true,
      status: 200,
      message: "Password reset link sent. Please check your email.",
    };
  }

  nonExistentEmailForPasswordReset() {
    return {
      success: false,
      status: 404,
      message: "Password reset requested for non-existent email",
    };
  }

  passwordResetLinkExpired() {
    return {
      success: false,
      status: 400,
      message: "Password reset link expired. Please request a new link.",
    };
  }

  invalidPasswordResetLink() {
    return {
      success: false,
      status: 400,
      message: "Invalid password reset link.",
    };
  }

  passwordResetLinkVerified() {
    return {
      success: true,
      status: 200,
      message: "Password reset link verified.",
    };
  }

  passwordResetSuccess() {
    return {
      success: true,
      status: 200,
      message: "Password reset successful.",
    };
  }

  passwordResetFailed() {
    return {
      success: false,
      status: 400,
      message: "Password reset failed.",
    };
  }

  // User Status Responses
  userNotFound() {
    return {
      success: false,
      status: 404,
      message: "User not found.",
    };
  }

  userAlreadyVerified() {
    return {
      success: false,
      status: 400,
      message: "User is already verified.",
    };
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
      error: "VERIFICATION_PENDING",
    };
  }

  emailInUse() {
    return {
      success: false,
      status: 400,
      message: "Account already exists. Please login.",
      error: "EMAIL_IN_USE",
    };
  }

  emailRegisteredNotVerified() {
    return {
      success: false,
      status: 400,
      message: "Email already registered but not verified.",
    };
  }

  // Validation Responses
  invalidEmailFormat() {
    return {
      success: false,
      status: 400,
      message: "Invalid email format.",
    };
  }

  invalidEmailOrPassword() {
    return {
      success: false,
      status: 400,
      message: "Invalid email or password.",
    };
  }

  validationError() {
    return {
      success: false,
      status: 400,
      message: "Invalid input format.",
    };
  }

  sameEmailProvided() {
    return {
      success: false,
      status: 400,
      message: "This email is already registered but not verified.",
    };
  }

  // Generic Responses
  error(message: string, status = 400) {
    return {
      success: false,
      status,
      message,
    };
  }

  unexpectedError(operation: string) {
    return {
      success: false,
      status: 500,
      message: `An unexpected error occurred during ${operation}. Please try again later.`,
      error: "INTERNAL_SERVER_ERROR",
    };
  }

  // Auth Error Responses
  unauthorized() {
    return {
      success: false,
      status: 401,
      message: "Authentication required",
    };
  }

  checkAuthSuccess(user?: any) {
    return {
      success: true,
      status: 200,
      message: "Authentication successful",
      ...(user && { user }),
    };
  }

  checkAuthFailed() {
    return {
      success: false,
      status: 401,
      message: "Authentication failed",
    };
  }

  forbidden() {
    return {
      success: false,
      status: 403,
      message: "Access forbidden",
    };
  }

  invalidToken() {
    return {
      success: false,
      status: 401,
      message: "Invalid token",
    };
  }

  tokenExpired() {
    return {
      success: false,
      status: 401,
      message: "Token has expired",
    };
  }
}
