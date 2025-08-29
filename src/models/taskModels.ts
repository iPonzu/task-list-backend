import mongoose, { Document, Schema } from 'mongoose'
import { IList } from './taskList'
import { IUser } from './taskUser'

export interface ITask extends Document {
  title: string
  description: string
  status: 'pendente' | 'em andamento' | 'concluída'
  dueDate?: Date
  list?: IList['_id']      
  user: IUser['_id']
}

const TaskSchema = new Schema<ITask>({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  status: { type: String, enum: ['pendente', 'em andamento', 'concluída'], default: 'pendente'},
  dueDate: Date,
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  list: { type: Schema.Types.ObjectId, ref: "List" },
})

export const Task = mongoose.model<ITask>("Task", TaskSchema)
