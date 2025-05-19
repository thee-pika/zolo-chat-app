import { Request, Response, NextFunction } from "express";

interface ErrorType {
  message: string;
  statusCode: number;
}

type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

const errorMiddleware = (
  err: ErrorType,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.message = err.message || "Internal server error";
  err.statusCode = err.statusCode || 500;

  res.status(err.statusCode).json({ success: false, message: err.message });
  return;
};

const TryCatch =
  (passedFunc: AsyncHandler) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await passedFunc(req, res, next);
    } catch (error) {
      next(error);
    }
  };

export { TryCatch, errorMiddleware };
