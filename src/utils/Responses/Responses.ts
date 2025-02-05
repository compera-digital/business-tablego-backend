import type { IResponseHandler } from "./types";

export class ResponseHandler implements IResponseHandler {

  registrationSuccess(name: string, lastName: string, email: string) {
    return {
      success: true,
      status: 201,
      message: "Registration successful! Please check your email for verification.",
      user: { name, lastName, email }
    };
  }

  loginSuccess(user: { name: string; lastName: string; email: string }, token: string) {
    return {
      success: true,
      status: 200,
      message: "Logged in successfully.",
      user: { name: user.name, lastName: user.lastName, email: user.email },
      token
    };
  }

  error(message: string, status = 400) {
    return { success: false, status, message };
  }

  invalidEmail() {
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
      message: "Account pending verification. Please check your email.",
      data: {
        email,
        remainingTime,
        nextResendAllowed: `${Math.floor(remainingTime / 60)} minutes`
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

  userExists() {
    return { success: false, status: 400, message: "Account already exists." };
  }

  emailInUse() {
    return {
      success: false,
      status: 400,
      message: "This email address is already registered.",
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

  verificationSuccess() {
    return { success: true, status: 200, message: "Verification successful." };
  }

  newVerificationCodeSent() {
    return { success: true, status: 200, message: "New verification code sent. Please check your email." };
  }
}
