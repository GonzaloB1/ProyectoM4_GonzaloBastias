import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaskForm } from "./TaskForm";
import * as taskService from "../services/taskService";
import * as useAuthModule from "../features/auth/useAuth";

vi.mock("../services/taskService");
vi.mock("../features/auth/useAuth");

function mockAuthenticatedUser() {
  vi.mocked(useAuthModule.useAuth).mockReturnValue({
    user: { uid: "user-123", email: "test@test.com" } as any,
    loading: false,
  });
}

describe("TaskForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthenticatedUser();
  });

  it("llama a createTask con el título, la descripción y el userId ingresados", async () => {
    const user = userEvent.setup();
    vi.mocked(taskService.createTask).mockResolvedValueOnce({} as any);

    render(<TaskForm />);

    await user.type(screen.getByPlaceholderText("Nueva tarea"), "Comprar pan");
    await user.type(screen.getByPlaceholderText("Descripción (opcional)"), "Antes de las 20hs");
    await user.click(screen.getByRole("button", { name: /agregar/i }));

    expect(taskService.createTask).toHaveBeenCalledWith({
      title: "Comprar pan",
      description: "Antes de las 20hs",
      userId: "user-123",
    });
  });

  it("no envía el formulario si el título está vacío", async () => {
    const user = userEvent.setup();

    render(<TaskForm />);

    await user.click(screen.getByRole("button", { name: /agregar/i }));

    expect(taskService.createTask).not.toHaveBeenCalled();
  });

  it("limpia los campos después de crear la tarea exitosamente", async () => {
    const user = userEvent.setup();
    vi.mocked(taskService.createTask).mockResolvedValueOnce({} as any);

    render(<TaskForm />);

    const titleInput = screen.getByPlaceholderText("Nueva tarea") as HTMLInputElement;
    const descriptionInput = screen.getByPlaceholderText(
      "Descripción (opcional)"
    ) as HTMLTextAreaElement;

    await user.type(titleInput, "Lavar el auto");
    await user.type(descriptionInput, "Fin de semana");
    await user.click(screen.getByRole("button", { name: /agregar/i }));

    expect(titleInput.value).toBe("");
    expect(descriptionInput.value).toBe("");
  });
});
