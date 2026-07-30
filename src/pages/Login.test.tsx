import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { Login } from "./Login";
import * as authService from "../services/authService";

vi.mock("../services/authService");

function renderLogin() {
  return render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );
}

describe("Login", () => {
  it("muestra un mensaje de error cuando las credenciales son incorrectas", async () => {
    const user = userEvent.setup();

    vi.mocked(authService.loginUser).mockRejectedValueOnce(
      new FirebaseError("auth/wrong-password", "The password is invalid")
    );

    renderLogin();

    await user.type(screen.getByLabelText("Email"), "test@test.com");
    await user.type(screen.getByLabelText("Contraseña"), "clave123");
    await user.click(screen.getByRole("button", { name: /iniciar sesión/i }));

    await waitFor(() => {
      expect(screen.getByText("La contraseña es incorrecta.")).toBeInTheDocument();
    });
  });

  it("llama a loginUser con el email y contraseña ingresados", async () => {
    const user = userEvent.setup();

    vi.mocked(authService.loginUser).mockResolvedValueOnce({} as any);

    renderLogin();

    await user.type(screen.getByLabelText("Email"), "test@test.com");
    await user.type(screen.getByLabelText("Contraseña"), "clave123");
    await user.click(screen.getByRole("button", { name: /iniciar sesión/i }));

    await waitFor(() => {
      expect(authService.loginUser).toHaveBeenCalledWith("test@test.com", "clave123");
    });
  });
});