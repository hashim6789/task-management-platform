import {
  FilterQuery,
  Types,
  UpdateQuery,
  DeleteResult,
  UpdateResult,
} from "mongoose";

export interface IBaseRepository<T> {
  create(data: Partial<T>): Promise<T>;
  update(id: string | Types.ObjectId, data: Partial<T>): Promise<T | null>;
  findById(id: string | Types.ObjectId): Promise<T | null>;
  //   findByIdAndUpdate(
  //     id: string | Types.ObjectId,
  //     update: UpdateQuery<T>
  //   ): Promise<T | null>;
  //   findAll(): Promise<T[]>;
  //   updateOne(
  //     filter: FilterQuery<T>,
  //     update: UpdateQuery<T>
  //   ): Promise<UpdateResult>;
  //   delete(id: string | Types.ObjectId): Promise<T | null>;
  //   deleteOne(filter: FilterQuery<T>): Promise<DeleteResult>;
  //   find(filter: FilterQuery<T>): Promise<T[]>;
  findOne(filter: FilterQuery<T>): Promise<T | null>;
  //   findByUsernameOrEmail(value: string): Promise<T | null>;
  //   findOneAndUpdate(
  //     filter: FilterQuery<T>,
  //     update: UpdateQuery<T>
  //   ): Promise<T | null>;
  //   findOneAndDelete(filter: FilterQuery<T>): Promise<T | null>;
}
