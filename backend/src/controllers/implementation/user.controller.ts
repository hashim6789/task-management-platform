import { IUserService } from "@/services/interface";
import { IUserController } from "../interface";
import { NextFunction, Response, Request } from "express";
import { CreateUserRequestDTO } from "@/schema/user";
import { HttpStatus } from "@/constants";

export class UserController implements IUserController {
  constructor(private _userService: IUserService) {}

  async createUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data = req.body as CreateUserRequestDTO;
      console.log(req.body);
      const user = await this._userService.createUser(data);
      res.status(HttpStatus.OK).json(user);
    } catch (err) {
      next(err);
    }
  }
}
