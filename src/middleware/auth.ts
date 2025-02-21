import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import {
  IAuthMiddleware,
  IAuthMiddlewareDependencies,
  DecodedAccessToken,
} from "./types";

export class AuthMiddleware implements IAuthMiddleware {
  private readonly jwtToken;
  private readonly logger;
  private readonly responseHandler;

  constructor({
    jwtToken,
    responseHandler,
    logger,
  }: IAuthMiddlewareDependencies) {
    this.jwtToken = jwtToken;
    this.responseHandler = responseHandler;
    this.logger = logger;
  }

  public authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = req.cookies.accessToken;
      if (!token) {
        this.logger.warn("No token provided");
        const response = this.responseHandler.unauthorized();
        res.status(response.status).json(response);
        return;
      }

      const decoded = jwt.verify(token, this.jwtToken) as DecodedAccessToken;

      if (decoded.type !== "access") {
        this.logger.warn("Invalid token type", { type: decoded.type });
        const response = this.responseHandler.invalidToken();
        res.status(response.status).json(response);
        return;
      }

      req.user = {
        id: decoded.id,
        email: decoded.email,
        name: decoded.name,
        lastName: decoded.lastName,
        type: decoded.type,
        isVerified: true,
        authProvider: "EMAIL",
      };

      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        this.logger.warn("Token expired");
        const response = this.responseHandler.tokenExpired();
        res.status(response.status).json(response);
        return;
      }

      this.logger.error("Token verification failed", error as Error);
      const response = this.responseHandler.invalidToken();
      res.status(response.status).json(response);
      return;
    }
  };

  // Opsiyonel: middleware for specific roles
  //public requireRole = (roles: string[]) => {
  //};
}
