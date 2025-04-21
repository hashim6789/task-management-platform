import { NextFunction, Request, Response } from "express";

export interface ITaskController {
  createTask(req: Request, res: Response, next: NextFunction): Promise<void>;
  findTasks(req: Request, res: Response, next: NextFunction): Promise<void>;
  assignTask(req: Request, res: Response, next: NextFunction): Promise<void>;
  changeStatusOfTask(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}
