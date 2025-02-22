export class ResponseHandler implements IResponseHandler {
  // ... diğer metodlar

  public logoutSuccess() {
    return {
      success: true,
      status: 200,
      message: "Logged out successfully"
    };
  }
} 