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
  cors: {
    allowedOrigins: string[];
    allowedMethods: string[];
  };
  rateLimit: {
    windowMs: number;
    maxRequests: number;
  };
}

// ✅ config.yaml dosyasını oku
const file = fs.readFileSync("config.yaml", "utf8");
const config: Config = yaml.parse(file);

export default config;
