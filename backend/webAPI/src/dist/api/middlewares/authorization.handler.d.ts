import { Request, Response, NextFunction } from 'express';
export declare const authorize: (roles: string[]) => (_: Request, res: Response, next: NextFunction) => Promise<void>;
