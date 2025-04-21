import { model, Schema, Document, Types, ObjectId } from "mongoose";

export interface ITask extends Document {
  _id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "completed";
  assignedTo: ObjectId;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    assignedTo: {
      type: Types.ObjectId,
      ref: "User",
    },
    dueDate: {
      type: Date,
    },

    status: {
      type: String,
      enum: ["todo", "in-progress", "completed"],
      default: "todo",
    },
  },
  {
    timestamps: true,
  }
);

const TaskModel = model<ITask>("Task", taskSchema);
export default TaskModel;
