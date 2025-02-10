import express from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        lastName: string;
        type: string;
      }
    }
  }
}

