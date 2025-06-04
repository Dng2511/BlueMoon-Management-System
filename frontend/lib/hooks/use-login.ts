import { useState } from "react";
import { loginUser } from "@/lib/api/auth";

export function useLogin() {
  const [error, setError] = useState<string | null>(null);

  async function login(username: string, password: string) {
    setError(null);
    try {
      const data = await loginUser(username, password);
      return data;
    } catch (err: any) {
      // console.log(err.response.data.message);
      setError(err.response.data.message);
      return null;
    }
  }

  return { login, error };
} 