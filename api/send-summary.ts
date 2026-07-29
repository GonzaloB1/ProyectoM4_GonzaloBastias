import type { VercelRequest, VercelResponse } from "@vercel/node";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const sesClient = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { toEmail, tasks } = req.body;

  if (!toEmail || !Array.isArray(tasks)) {
    return res.status(400).json({ error: "Faltan datos requeridos" });
  }

  const pendingTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  const htmlBody = `
    <h2>Resumen de tus tareas - MateCode</h2>
    <h3>Pendientes (${pendingTasks.length})</h3>
    <ul>${pendingTasks.map((t) => `<li>${t.title}</li>`).join("")}</ul>
    <h3>Completadas (${completedTasks.length})</h3>
    <ul>${completedTasks.map((t) => `<li>${t.title}</li>`).join("")}</ul>
  `;

  const command = new SendEmailCommand({
    Source: process.env.SES_SENDER_EMAIL,
    Destination: { ToAddresses: [toEmail] },
    Message: {
      Subject: { Data: "Resumen de tus tareas" },
      Body: { Html: { Data: htmlBody } },
    },
  });

  try {
    await sesClient.send(command);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error al enviar email:", error);
    return res.status(500).json({ error: "No se pudo enviar el email" });
  }
}