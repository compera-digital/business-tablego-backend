import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import yaml from "js-yaml";

class Config {
  private static instance: Config;
  private config: any;

  private constructor() {
    this.loadEnvironmentVariables();
    this.config = this.loadConfig();
  }

  public static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }

  private loadEnvironmentVariables(): void {
    const environment = process.env.NODE_ENV || "development";
    const envPath = path.resolve(process.cwd(), `.env.${environment}`);

    if (fs.existsSync(envPath)) {
      dotenv.config({ path: envPath });
    } else {
      console.warn(`Environment file not found: ${envPath}`);
      dotenv.config();
    }
  }

  private loadConfig(): any {
    try {
      const configPath = path.resolve(process.cwd(), "src/config/config.yaml");
      const fileContents = fs.readFileSync(configPath, "utf8");
      const interpolatedYaml = this.interpolateEnvVars(fileContents);
      return yaml.load(interpolatedYaml);
    } catch (error) {
      console.error("Error loading config:", error);
      process.exit(1);
    }
  }

  private interpolateEnvVars(yaml: string): string {
    return yaml.replace(/\${(\w+)}/g, (match, envVar) => {
      const value = process.env[envVar];
      if (!value) {
        console.warn(`Environment variable ${envVar} not found`);
        return match;
      }
      return value;
    });
  }

  // Config getter metodları
  public getPort(): number {
    return this.config.server.port || 3000;
  }

  public getJwtConfig() {
    return {
      jwtToken: this.config.auth.jwt.token,
      jwtExpiresIn: this.config.auth.jwt.expiresIn,
    };
  }

  public getMailConfig() {
    return {
      user: this.config.email.smtp.auth.user,
      pass: this.config.email.smtp.auth.pass,
      server: this.config.email.smtp.host,
      port: this.config.email.smtp.port,
    };
  }

  public getDatabaseConfig() {
    return {
      url: this.config.database.postgres.url,
      host: this.config.database.postgres.host,
      port: this.config.database.postgres.port,
      username: this.config.database.postgres.username,
      password: this.config.database.postgres.password,
      database: this.config.database.postgres.database,
    };
  }

  public getRedisConfig() {
    return {
      host: this.config.database.redis.host,
      port: this.config.database.redis.port,
      password: this.config.database.redis.password,
    };
  }

  public getCorsConfig() {
    return {
      origin: this.config.cors.origin,
      credentials: this.config.cors.credentials,
    };
  }

  public getVerificationConfig() {
    return {
      codeExpirationTime: this.config.verification.codeExpirationTime,
    };
  }

  public getFullAuthConfig() {
    return {
      jwt: {
        token: this.config.auth.jwt.token,
        expiresIn: this.config.auth.jwt.expiresIn,
        cookieMaxAge: this.config.auth.jwt.cookieMaxAge,
      },
      google: {
        clientId: this.config.auth.google.clientId,
        clientSecret: this.config.auth.google.clientSecret,
        callbackURL: this.config.auth.google.callbackURL,
      },
    };
  }

  public getGoogleConfig() {
    return {
      clientId: this.config.auth.google.clientId,
      clientSecret: this.config.auth.google.clientSecret,
      callbackURL: this.config.auth.google.callbackURL,
    };
  }

  // Getter for server config
  public getServerConfig() {
    return {
      port: this.config.server.port,
      host: this.config.server.host,
      apiPrefix: this.config.server.apiPrefix,
    };
  }
}

export const config = Config.getInstance();
