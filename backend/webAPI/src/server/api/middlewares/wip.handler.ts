import { Request, Response, NextFunction } from 'express';

export function wip(
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  res.status(501).json({errors:{
    status: 'W.I.P',
    message: 'This endpoint is a work in progress and is not yet implemented.',
  }});
}
