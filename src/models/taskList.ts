import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './taskUser';

export interface IList extends Document {
  id: int;
  title: string;
  user: IUser['_id'];
}

const ListSchema = new Schema<IList>({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

export const List = mongoose.model<IList>('List', ListSchema);
