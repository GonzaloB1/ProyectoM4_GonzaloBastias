import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Task, NewTask, UpdateTaskInput } from "../types/task";

const tasksCollection = collection(db, "tasks");

export function subscribeToUserTasks(
  userId: string,
  callback: (tasks: Task[]) => void
): Unsubscribe {
  const q = query(
    tasksCollection,
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const tasks: Task[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Task[];

    callback(tasks);
  });
}

export async function createTask(newTask: NewTask) {
  return addDoc(tasksCollection, {
    ...newTask,
    completed: false,
    createdAt: serverTimestamp(),
  });
}

export async function updateTask(taskId: string, data: UpdateTaskInput) {
  const taskRef = doc(db, "tasks", taskId);
  return updateDoc(taskRef, {
    title: data.title,
    description: data.description,
  });
}

export async function toggleTaskCompleted(taskId: string, completed: boolean) {
  const taskRef = doc(db, "tasks", taskId);
  return updateDoc(taskRef, { completed });
}

export async function deleteTask(taskId: string) {
  const taskRef = doc(db, "tasks", taskId);
  return deleteDoc(taskRef);
}

