import { publicApi } from "./client"

export async function loginUser(username: string, password: string) {
  const response = await publicApi.post("/users/login", { username, password });
  return response.data;
}

export interface UpdateUserRequest {
  username: string
  password: string
  email: string
}

export const updateUser = async (userId: number, data: UpdateUserRequest) => {
  const response = await publicApi.put(`/users/${userId}`, data)
  return response.data
} 