import { FilterQuery, Types } from "mongoose";

export interface IBaseRepository<T> {
  create(data: Partial<T>): Promise<T>;
  update(id: string | Types.ObjectId, data: Partial<T>): Promise<T | null>;
  findById(id: string | Types.ObjectId): Promise<T | null>;
  findOne(filter: FilterQuery<T>): Promise<T | null>;
}
