import { describe, it, expect } from "vitest";
import { getAuthErrorMessage } from "./authErrors";

describe("getAuthErrorMessage", () => {
  it("traduce un código conocido de Firebase a un mensaje en español", () => {
    const result = getAuthErrorMessage("auth/wrong-password");
    expect(result).toBe("La contraseña es incorrecta.");
  });

  it("devuelve un mensaje genérico para un código desconocido", () => {
    const result = getAuthErrorMessage("auth/algun-codigo-inventado");
    expect(result).toBe("Ocurrió un error. Intentá de nuevo.");
  });
});