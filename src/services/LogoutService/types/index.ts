import { ILogger } from "../../../utils/Logger/types";

export interface ILogoutService {
  logout(userId: string, token: string): Promise<boolean>;
  isTokenBlacklisted(token: string): Promise<boolean>;
}

export interface ILogoutServiceDependencies {
  logger: ILogger;
} 