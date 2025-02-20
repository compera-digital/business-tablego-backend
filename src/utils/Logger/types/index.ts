// src/utils/Logger/types/index.ts

export enum LogLevel {
    ERROR = 'ERROR',
    WARN = 'WARN',
    INFO = 'INFO',
    DEBUG = 'DEBUG'
}

export interface ILogger {
    info(message: string, metadata?: Record<string, any>): void;
    warn(message: string, metadata?: Record<string, any>): void;
    error(message: string, error?: Error, metadata?: Record<string, any>): void;
    debug(message: string, metadata?: Record<string, any>): void;
}
  