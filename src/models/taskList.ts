import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./taskUser";

export interface IList extends Document {
  title: string;
  user: IUser["_id"];
}

const TaskListSchema = new Schema<IList>(
  {
    title: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

// evita erro de em ambiente de teste
export const List =
  mongoose.models.TaskList || mongoose.model<IList>("TaskList", TaskListSchema);