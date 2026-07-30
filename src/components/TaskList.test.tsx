import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaskList } from "./TaskList";
import * as taskService from "../services/taskService";
import type { Task } from "../types/task";

vi.mock("../services/taskService");

const baseTasks: Task[] = [
  {
    id: "task-1",
    title: "Comprar pan",
    description: "Antes de las 20hs",
    completed: false,
    userId: "user-123",
    createdAt: {} as any,
  },
  {
    id: "task-2",
    title: "Lavar el auto",
    description: "",
    completed: true,
    userId: "user-123",
    createdAt: {} as any,
  },
];

describe("TaskList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("muestra un mensaje cuando no hay tareas", () => {
    render(<TaskList tasks={[]} />);
    expect(screen.getByText(/no tenés tareas todavía/i)).toBeInTheDocument();
  });

  it("renderiza el título y la descripción de cada tarea", () => {
    render(<TaskList tasks={baseTasks} />);

    expect(screen.getByText("Comprar pan")).toBeInTheDocument();
    expect(screen.getByText("Antes de las 20hs")).toBeInTheDocument();
    expect(screen.getByText("Lavar el auto")).toBeInTheDocument();
  });

  it("llama a toggleTaskCompleted al tildar el checkbox", async () => {
    const user = userEvent.setup();
    render(<TaskList tasks={baseTasks} />);

    const checkboxes = screen.getAllByRole("checkbox");
    await user.click(checkboxes[0]);

    expect(taskService.toggleTaskCompleted).toHaveBeenCalledWith("task-1", true);
  });

  it("llama a deleteTask al hacer click en Eliminar", async () => {
    const user = userEvent.setup();
    render(<TaskList tasks={baseTasks} />);

    const deleteButtons = screen.getAllByRole("button", { name: /eliminar/i });
    await user.click(deleteButtons[0]);

    expect(taskService.deleteTask).toHaveBeenCalledWith("task-1");
  });

  it("permite editar una tarea y guarda los cambios con updateTask", async () => {
    const user = userEvent.setup();
    vi.mocked(taskService.updateTask).mockResolvedValueOnce(undefined as any);

    render(<TaskList tasks={baseTasks} />);

    const editButtons = screen.getAllByRole("button", { name: /editar/i });
    await user.click(editButtons[0]);

    const titleInput = screen.getByDisplayValue("Comprar pan");
    await user.clear(titleInput);
    await user.type(titleInput, "Comprar pan integral");

    await user.click(screen.getByRole("button", { name: /guardar/i }));

    expect(taskService.updateTask).toHaveBeenCalledWith("task-1", {
      title: "Comprar pan integral",
      description: "Antes de las 20hs",
    });
  });

  it("cancela la edición sin llamar a updateTask", async () => {
    const user = userEvent.setup();
    render(<TaskList tasks={baseTasks} />);

    const editButtons = screen.getAllByRole("button", { name: /editar/i });
    await user.click(editButtons[0]);

    await user.click(screen.getByRole("button", { name: /cancelar/i }));

    expect(taskService.updateTask).not.toHaveBeenCalled();
    expect(screen.getByText("Comprar pan")).toBeInTheDocument();
  });
});
