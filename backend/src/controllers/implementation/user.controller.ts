import { IUserService } from "@/services/interface";
import { IUserController } from "../interface";
import { NextFunction, Response, Request } from "express";
import { BlockUserRequestDTO, CreateUserRequestDTO } from "@/schema/user";
import { HttpStatus } from "@/constants";
import { UserQuery } from "@/types";

export class UserController implements IUserController {
  constructor(private _userService: IUserService) {}

  async createUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data = req.body as CreateUserRequestDTO;
      const user = await this._userService.createUser(data);
      res.status(HttpStatus.OK).json(user);
    } catch (err) {
      next(err);
    }
  }
  async blockUnblockUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data = req.body as BlockUserRequestDTO;
      const { id } = req.params;
      const user = await this._userService.blockUnblockUser({ ...data, id });
      res.status(HttpStatus.OK).json(user);
    } catch (err) {
      next(err);
    }
  }

  async findUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const query = req.query as unknown as UserQuery;
      console.log(req.query);
      const data = await this._userService.findUsers(query);
      res.status(HttpStatus.OK).json(data);
    } catch (err) {
      next(err);
    }
  }
}
