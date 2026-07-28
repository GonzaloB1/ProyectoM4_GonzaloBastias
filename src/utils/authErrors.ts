export function getAuthErrorMessage(code: string): string {
  const errorMessages: Record<string, string> = {
    "auth/email-already-in-use": "Ese email ya está registrado.",
    "auth/invalid-email": "El formato del email no es válido.",
    "auth/weak-password": "La contraseña debe tener al menos 6 caracteres.",
    "auth/user-not-found": "No existe una cuenta con ese email.",
    "auth/wrong-password": "La contraseña es incorrecta.",
    "auth/invalid-credential": "Email o contraseña incorrectos.",
    "auth/too-many-requests": "Demasiados intentos. Probá de nuevo más tarde.",
  };

  return errorMessages[code] ?? "Ocurrió un error. Intentá de nuevo.";
}