import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { Task } from "../models/taskModels";
import { List } from "../models/taskList";
import { User } from "../models/taskUser";

export let token: string;
export let userId: string;
export let baseListId: string;

export const connectTestDB = async () => {
  process.env.NODE_ENV = "test";

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(
      "mongodb+srv://USERNAME:PASSWORD@dbtask.ec8ughh.mongodb.net/?appName=dbTask"
    );
  }
};

export const clearTestDB = async () => {
  await Task.deleteMany({});
  await List.deleteMany({});
  await User.deleteMany({});
};

export const createTestUserAndAuth = async () => {
  const uniqueUsername = `testuser_${Date.now()}`;

  const user = await User.create({
    username: uniqueUsername,
    password: "123456",
  });

  userId = (user as any)._id.toString();

  token =
    "Bearer " +
    jwt.sign({ id: userId }, "secret_key", { expiresIn: "1h" });

  const baseList = await List.create({
    title: `Lista Base ${Date.now()}`,
    user: userId,
  });

  baseListId = (baseList as any)._id.toString();
};

export const disconnectTestDB = async () => {
  await Task.deleteMany({});
  await List.deleteMany({});
  await User.deleteMany({});
  await mongoose.disconnect();
};