// src/utils/Logger/index.ts

import { ILogger, LogLevel } from "./types";

export class Logger implements ILogger {
  private context?: string;

  constructor(context?: string) {
    this.context = context;
  }

  private log(level: LogLevel, message: string, metadata?: Record<string, any>): void {
    
    if (level === LogLevel.DEBUG && process.env.NODE_ENV === 'production') return;

    const timestamp = new Date().toISOString();
    const contextInfo = this.context ? `[${this.context}] ` : '';
    const metaInfo = metadata ? ` ${JSON.stringify(metadata)}` : '';
    const formattedMessage = `[${timestamp}] ${level} ${contextInfo}${message}${metaInfo}`;

    switch (level) {
      case LogLevel.ERROR:
        console.error(formattedMessage);
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage);
        break;
      case LogLevel.DEBUG:
        console.debug(formattedMessage);
        break;
      default:
        console.log(formattedMessage);
        break;
    }
  }

  info(message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, metadata);
  }

  warn(message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, metadata);
  }

  error(message: string, error?: Error, metadata?: Record<string, any>): void {
    this.log(LogLevel.ERROR, message, {
      ...metadata,
      ...(error
        ? { errorName: error.name, errorMessage: error.message, stackTrace: error.stack }
        : {}),
    });
  }

  debug(message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, metadata);
  }
}
