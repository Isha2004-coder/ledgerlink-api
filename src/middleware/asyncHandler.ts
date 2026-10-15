import { Request, Response, NextFunction, RequestHandler } from "express";

// Express 4 does not catch rejected promises from async route handlers.
// This forwards them to the error middleware instead of crashing the process.
export function asyncHandler(
  fn: (req: any, res: Response, next: NextFunction) => Promise<unknown>
): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
}
