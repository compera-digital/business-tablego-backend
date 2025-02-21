export {};

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      name: string;
      lastName: string;
      isVerified: boolean;
      authProvider: string;
      type?: string;
    }
  }
}
