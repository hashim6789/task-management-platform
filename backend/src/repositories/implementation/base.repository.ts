//

import {
  Document,
  Model,
  FilterQuery,
  UpdateQuery,
  DeleteResult,
  UpdateResult,
  Types,
  isValidObjectId,
} from "mongoose";
import { IBaseRepository } from "../interface/IBaseRepository";

export abstract class BaseRepository<T extends Document>
  implements IBaseRepository<T>
{
  constructor(protected readonly model: Model<T>) {}
  async create(data: Partial<T>): Promise<T> {
    const document = new this.model(data);
    return document.save();
  }

  async update(
    id: string | Types.ObjectId,
    data: Partial<T>
  ): Promise<T | null> {
    if (!isValidObjectId(id)) throw new Error("Invalid ID format");
    return this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    return this.model.findOne(filter);
  }
  async findById(id: string | Types.ObjectId): Promise<T | null> {
    if (!isValidObjectId(id)) throw new Error("Invalid ID format");
    return this.model.findById(id);
  }

  // async findByIdAndUpdate(
  //   id: string | Types.ObjectId,
  //   update: UpdateQuery<T>
  // ): Promise<T | null> {
  //   if (!isValidObjectId(id)) throw new Error("Invalid ID format");
  //   return this.model.findByIdAndUpdate(id, update, {
  //     upsert: true,
  //     new: true,
  //   });
  // }

  // async findAll(): Promise<T[]> {
  //   return this.model.find();
  // }

  // async updateOne(
  //   filter: FilterQuery<T>,
  //   update: UpdateQuery<T>
  // ): Promise<UpdateResult> {
  //   return this.model.updateOne(filter, update);
  // }

  // async delete(id: string | Types.ObjectId): Promise<T | null> {
  //   if (!isValidObjectId(id)) throw new Error("Invalid ID format");
  //   return this.model.findByIdAndDelete(id);
  // }

  // async deleteOne(filter: FilterQuery<T>): Promise<DeleteResult> {
  //   return this.model.deleteOne(filter);
  // }

  // async find(filter: FilterQuery<T>): Promise<T[]> {
  //   return this.model.find(filter);
  // }

  // async findOneAndUpdate(
  //   filter: FilterQuery<T>,
  //   update: UpdateQuery<T>
  // ): Promise<T | null> {
  //   return this.model.findOneAndUpdate(filter, update, {
  //     upsert: true,
  //     new: true,
  //   });
  // }

  // async findOneAndDelete(filter: FilterQuery<T>): Promise<T | null> {
  //   return this.model.findOneAndDelete(filter);
  // }

  // async addToSet(id: string | Types.ObjectId, field: keyof T, value: unknown): Promise<T | null> {
  //     if (!isValidObjectId(id)) throw new Error("Invalid ID format");
  //     const update: UpdateQuery<T> = { $addToSet: { [field]: value } } as any;
  //     return this.model.findByIdAndUpdate(id, update, { new: true });
  // }

  // async pull(id: string | Types.ObjectId, field: keyof T, value: unknown): Promise<T | null> {
  //     if (!isValidObjectId(id)) throw new Error("Invalid ID format");
  //     const update: UpdateQuery<T> = { $pull: { [field]: value } } as any;
  //     return this.model.findByIdAndUpdate(id, update, { new: true });
  // }
}
