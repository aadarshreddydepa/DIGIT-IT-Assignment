import { type IUser } from "./User";

export interface ITask {
  creatorId: any;
  _id: string;
  title: string;
  description?: string;
  dueDate?: string;
  progress: "not-started" | "in-progress" | "completed";
  createdAt: string;
  userId: string | IUser;
}
