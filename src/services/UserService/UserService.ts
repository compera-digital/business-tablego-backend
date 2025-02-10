import { IUserService, IUserServiceDependencies } from "./types";

export class UserService implements IUserService {
  private readonly dbService;
  private readonly helper;
  private readonly responseHandler;
  private readonly logger;

  constructor({ dbService, helper, responseHandler, logger }: IUserServiceDependencies) {
    this.dbService = dbService;
    this.helper = helper;
    this.responseHandler = responseHandler;
    this.logger = logger;
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    try {
      const user = await this.dbService.findUserById(userId);
      if (!user) {
        this.logger.error("User not found");
        return this.responseHandler.userNotFound();
      }

      const isPasswordValid = await this.helper.comparePassword(currentPassword, user.password);
      if (!isPasswordValid) {
        this.logger.error("Current password is incorrect");
        return this.responseHandler.invalidCurrentPassword();
      }

      const hashedNewPassword = await this.helper.hashPassword(newPassword);
      await this.dbService.updateUserPasswordById(userId, hashedNewPassword);
      
      this.logger.info("Password changed successfully");
      return this.responseHandler.passwordChangeSuccess();
    } catch (error) {
      this.logger.error("Error changing password", error as Error);
      throw error;
    }
  }
}