import { Request, Response, NextFunction } from 'express';
import { ILogger, IResponseHandler } from "@/utils";

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    name: string;
    lastName: string;
    type: string;
  }
}

export interface IAuthMiddlewareDependencies {
  jwtToken: string;
  responseHandler: IResponseHandler;
  logger: ILogger;
}

export interface IAuthMiddleware {
  authenticate: (
    req: Request, 
    res: Response, 
    next: NextFunction
  ) => Promise<void | undefined>;
  
  // requireRole: (roles: string[]) => (
  //   req: AuthenticatedRequest, 
  //   res: Response, 
  //   next: NextFunction
  // ) => void;
}

export interface DecodedAccessToken {
  type: string;
  id: string;
  email: string;
  name: string;
  lastName: string;
}
