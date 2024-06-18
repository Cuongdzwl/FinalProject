import { Request, Response, NextFunction } from 'express';

export interface OAuth2Strategy {
  login(req: Request, res: Response, next: NextFunction): Promise<any>;
  callback(req: Request, res: Response, next: NextFunction): Promise<any>;
}
