import cors from "cors";
import { Request } from "express";
import { config } from "../config/config";

// Create a custom CORS middleware that handles multiple origins
const corsMiddleware = () => {
  const corsOptions = {
    credentials: true,
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void
    ) => {
      // Get the allowed origins from config
      const allowedOrigins = config.getCorsConfig().origin.split(",");

      // If no origin provided (like a same-origin request) or the origin is in the allowed list
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  };

  return cors(corsOptions);
};

export default corsMiddleware;
