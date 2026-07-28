import type { User } from "firebase/auth";

export interface AuthContextType {
  user: User | null;
  loading: boolean;
}

export interface AuthFormData {
  email: string;
  password: string;
}