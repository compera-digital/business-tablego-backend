import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import {
  IGoogleStrategy,
  IGoogleStrategyDependencies,
  IGoogleProfile,
} from "./types";
import { AuthProvider } from "@prisma/client";

export class GooglePassportStrategy implements IGoogleStrategy {
  private readonly googleConfig;
  private readonly dbService;
  private readonly helper;
  private readonly responseHandler;

  constructor({
    googleConfig,
    dbService,
    helper,
    responseHandler,
  }: IGoogleStrategyDependencies) {
    this.googleConfig = googleConfig;
    this.dbService = dbService;
    this.helper = helper;
    this.responseHandler = responseHandler;
  }

  public initialize(): void {
    passport.use(
      new GoogleStrategy(
        {
          clientID: this.googleConfig.clientId,
          clientSecret: this.googleConfig.clientSecret,
          callbackURL: this.googleConfig.callbackURL,
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const user = await this.handleCallback(profile as IGoogleProfile);
            return done(null, user);
          } catch (error) {
            return done(error as Error, undefined);
          }
        }
      )
    );

    passport.serializeUser((user, done) => {
      done(null, user);
    });

    passport.deserializeUser((user, done) => {
      done(null, user as Express.User);
    });
  }

  public authenticate(): void {
    passport.authenticate("google", {
      scope: ["profile", "email"],
    });
  }

  public async handleCallback(profile: IGoogleProfile): Promise<any> {
    try {
      const email = profile.emails[0].value;
      let user = await this.dbService.findUserByEmail(email);

      if (user) {
        return user;
      }

      const hashedPassword = await this.helper.hashPassword(
        this.helper.generateRandomPassword()
      );

      await this.dbService.registerUser({
        name: profile.name.givenName,
        lastName: profile.name.familyName,
        email: email,
        referralCode: "",
        password: hashedPassword,
        isVerified: true,
        authProvider: AuthProvider.GOOGLE,
      });

      user = await this.dbService.findUserByEmail(email);

      if (!user) {
        throw new Error("User registration failed");
      }

      return user;
    } catch (error) {
      throw new Error("Google authentication failed");
    }
  }
}
