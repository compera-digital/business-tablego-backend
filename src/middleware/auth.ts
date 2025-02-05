import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { LogoutService } from '../services/LogoutService';
import { Logger } from '../utils/Logger';

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Token blacklist kontrolü
    const logoutService = new LogoutService({ logger: new Logger('AuthMiddleware') });
    const isBlacklisted = await logoutService.isTokenBlacklisted(token);

    if (isBlacklisted) {
      return res.status(401).json({ error: 'Token is no longer valid' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    req.token = token;

    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate' });
  }
}; 