import type { Timestamp } from "firebase/firestore";

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  userId: string;
  createdAt: Timestamp;
}

export interface NewTask {
  title: string;
  userId: string;
}