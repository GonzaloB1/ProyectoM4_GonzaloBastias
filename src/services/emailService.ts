import type { Task } from "../types/task";

export async function sendTaskSummary(toEmail: string, tasks: Task[]) {
  const response = await fetch("/api/send-summary", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      toEmail,
      tasks: tasks.map((t) => ({ title: t.title, completed: t.completed })),
    }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Error al enviar el resumen");
  }

  return response.json();
}