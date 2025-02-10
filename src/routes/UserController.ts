import { Request, Response } from "express";
import { IUserController, IUserControllerDependencies } from "./types";

export class UserController implements IUserController {
  private readonly logger;
  private readonly responseHandler;
  private readonly userService;

  constructor({ responseHandler, logger, userService }: IUserControllerDependencies) {
    this.responseHandler = responseHandler;
    this.logger = logger;
    this.userService = userService;
  }

  async changePassword(req: Request, res: Response) {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user?.id;
    try {
      const response = await this.userService.changePassword(
        userId!, 
        currentPassword, 
        newPassword
      );
      res.status(response.status).json(response);
    } catch (error) {
      this.logger.error(`Password change failed: ${(error as Error).message}`);
      res.status(500).json(this.responseHandler.unexpectedError("password change"));
    }
  }
}
