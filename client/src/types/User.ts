export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: "student" | "teacher";
  teacherId?: string;
}
