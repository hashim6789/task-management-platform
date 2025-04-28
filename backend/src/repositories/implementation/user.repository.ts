import { IUserRepository } from "../interface/IUserRepository";
import { BaseRepository } from "./base.repository";
import { FilterQuery, Model } from "mongoose";
import { IUser } from "@/models";
import { PaginatedData, UserQuery } from "@/types";

export class UserRepository
  extends BaseRepository<IUser>
  implements IUserRepository
{
  constructor(model: Model<IUser>) {
    super(model);
  }

  async findAllByQuery(query: UserQuery): Promise<PaginatedData<IUser>> {
    const {
      page = "1",
      limit = "10",
      search = "",
      role = "user",
      isBlocked = "all",
      sortBy = "createdAt",
      sortOrder = "desc",
    } = query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    const filter: FilterQuery<IUser> = {
      role,
    };

    console.log("query", query);

    if (isBlocked !== "all") {
      filter.isBlocked =
        isBlocked === "false" ? false : (true as IUser["isBlocked"]);
    }

    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const sort: Record<string, 1 | -1> = {
      [sortBy]: sortOrder === "asc" ? 1 : -1,
    };

    console.log("filter", filter);

    const data = await this.model
      .find(filter)
      .sort(sort)
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    const total = await this.model.countDocuments(filter);

    return { data, total };
  }

  async findByEmail(email: string): Promise<IUser | null> {
    try {
      return await this.findOne({ email });
    } catch (error) {
      console.error(error);
      throw new Error("Error finding user by email");
    }
  }
}
