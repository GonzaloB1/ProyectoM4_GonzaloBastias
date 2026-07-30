import { useEffect, useState } from "react";
import { subscribeToUserTasks } from "../services/taskService";
import { useAuth } from "../features/auth/useAuth";
import type { Task } from "../types/task";

export function useTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeToUserTasks(user.uid, (newTasks) => {
      setTasks(newTasks);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return { tasks, loading };
}