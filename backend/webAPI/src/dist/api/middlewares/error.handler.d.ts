/// <reference types="cookie-parser" />
import { Request, Response, NextFunction } from 'express';
export default function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction): void;
