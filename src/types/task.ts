import type { Timestamp } from "firebase/firestore";

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  userId: string;
  createdAt: Timestamp;
}

export interface NewTask {
  title: string;
  description: string;
  userId: string;
}

export interface UpdateTaskInput {
  title: string;
  description: string;
}