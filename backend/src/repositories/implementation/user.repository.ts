import { IUserRepository } from "../interface/IUserRepository";
import { BaseRepository } from "../base.repository";
import { FilterQuery, Model, Types } from "mongoose";
import { toObjectId } from "@/utils";
import { IUser } from "@/models";
import { CreateUserDTO, PaginatedData, UserQuery } from "@/types";

export class UserRepository
  extends BaseRepository<IUser>
  implements IUserRepository
{
  constructor(model: Model<IUser>) {
    super(model);
  }
  async create(user: CreateUserDTO): Promise<IUser> {
    try {
      const newUser = new this.model({
        username: user.username,
        password: user.password,
        email: user.email,
      });

      return await newUser.save();
    } catch (error) {
      console.error(error);
      throw new Error("Error creating user");
    }
  }

  async updateUser(id: string, data: Partial<IUser>): Promise<IUser | null> {
    try {
      console.log(data);

      return await this.update(toObjectId(id), data);
    } catch (error) {
      console.error(error);
      throw new Error("Error updating user");
    }
  }

  async findAllByQuery(query: UserQuery): Promise<PaginatedData<IUser>> {
    const {
      page = "1",
      limit = "10",
      search = "",
      role = "user",
      isBlocked = "false",
      sortBy = "createdAt",
      sortOrder = "desc",
    } = query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    const filter: FilterQuery<IUser> = {
      role,
      isBlocked: isBlocked === "true",
    };

    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const sort: Record<string, 1 | -1> = {
      [sortBy]: sortOrder === "asc" ? 1 : -1,
    };

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

  async findByUsername(username: string): Promise<IUser | null> {
    try {
      return await this.findOne({ username });
    } catch (error) {
      console.error(error);
      throw new Error("Error while finding user by email");
    }
  }

  async findUserById(id: string): Promise<IUser | null> {
    try {
      return await this.findById(new Types.ObjectId(id));
    } catch (error) {
      console.error(error);
      throw new Error("Error while finding user by Id");
    }
  }

  async findOneWithUsernameOrEmail(value: string): Promise<IUser | null> {
    try {
      return await this.findByUsernameOrEmail(value);
    } catch (error) {
      console.error(error);
      throw new Error("errror while finding user by email,username");
    }
  }

  async updatePassword(
    email: string,
    hashedPassword: string
  ): Promise<IUser | null> {
    try {
      return await this.model.findOneAndUpdate(
        { email: email },
        { $set: { password: hashedPassword } },
        { new: true }
      );
    } catch (error) {
      console.error(error);
      throw new Error("errror while updating the password");
    }
  }

  // async updateUsername(id: string, username: string): Promise<IUser | null> {
  //   try {
  //     return await this.model.findByIdAndUpdate(id, {
  //       $set: { username: username },
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     throw new Error("error while updating username");
  //   }
  // }

  // async updateUserProfile(
  //   id: string,
  //   updateData: Partial<IUser>
  // ): Promise<IUser | null> {
  //   try {
  //     return await this.model.findByIdAndUpdate(
  //       id,
  //       { $set: { ...updateData } },
  //       { new: true, upsert: true, runValidators: true }
  //     );
  //   } catch (error) {
  //     console.log(error);
  //     throw new Error("error while updating username");
  //   }
  // }

  // async updateEmail(id: string, email: string): Promise<IUser | null> {
  //   try {
  //     return await this.findByIdAndUpdate(toObjectId(id), { $set: { email } });
  //   } catch (error) {
  //     console.log(error);
  //     throw new Error("error while updating email");
  //   }
  // }

  // async updateProfilePicture(
  //   id: string,
  //   profilePicture: string
  // ): Promise<void> {
  //   try {
  //     await this.findByIdAndUpdate(toObjectId(id), {
  //       $set: { profilePicture },
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     throw new Error("error while updating profile picture");
  //   }
  // }
}
