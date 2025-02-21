import { IDbService } from "@/services";
import { IHelper, IResponseHandler } from "@/utils";

export interface IGoogleProfile {
  id: string;
  displayName: string;
  name: {
    givenName: string;
    familyName: string;
  };
  emails: Array<{
    value: string;
    verified: boolean;
  }>;
  photos: Array<{
    value: string;
  }>;
}

export interface IGoogleStrategyDependencies {
  googleConfig: {
    clientId: string;
    clientSecret: string;
    callbackURL: string;
  };
  dbService: IDbService;
  helper: IHelper;
  responseHandler: IResponseHandler;
}

export interface IGoogleStrategy {
  initialize(): void;
  authenticate(): void;
  handleCallback(profile: IGoogleProfile): Promise<any>;
}
