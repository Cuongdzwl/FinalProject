import { Request, Response, NextFunction } from 'express';

export default function response(
  prev: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  var validate = undefined;
  var message = undefined;
  var data = undefined;
  var metadata = undefined;
  var none = true;
  if (prev.data) {
    data = prev.data;
    none = false;
  }
  if (prev.metadata) {
    metadata = prev.metadata;
    none = false;
  }
  if (prev.errors || prev.message) {
    message = prev.errors || prev.message;
    none = false;
  }
  if (prev.validate) {
    validate = prev.validate;
    none = false;
  }

  if (none) {
    message = [{ message: prev }];
  }

  res.status(prev.status || 500).json({ message, validate, data, metadata });
}
