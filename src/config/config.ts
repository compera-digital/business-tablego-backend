import fs from "fs";
import yaml from "yaml";

interface Config {
  app: {
    name: string;
    environment: string;
    port: number;
    host: string;
    apiPrefix: string;
  };
  env: {
    host: string;
  };
  auth: {
    jwt: {
      expiresIn: string;
      cookieMaxAge: number;
    };
  };
  cors: {
    allowedOrigins: string[];
    allowedMethods: string[];
  };
  rateLimit: {
    windowMs: number;
    maxRequests: number;
  };
  verification: {
    codeExpirationTime: number;
  };
  
  mail: {
    smtp: {
      server: string;
      port: number;
    };
  };
}

const file = fs.readFileSync("./src/config/config.yaml", "utf8");
const config: Config = yaml.parse(file);

export default config;
