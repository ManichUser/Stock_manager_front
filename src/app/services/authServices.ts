import api from "../lib/api";

export interface LoginResponse {
  message: string;
  token: string;
}

export interface RegisterResponse {
  message: string;
  user: {
    id: number;
    username: string;
  };
}

export const AuthService = {
  register: async (username: string, password: string) => {
    const res = await api.post<RegisterResponse>("/auth/register", {
      username,
      password,
    });
    return res.data;
  },


  login: async (username: string, password: string) => {
    const res = await api.post<LoginResponse>("/auth/login", {
      username,
      password,
    });
    return res.data;
  },


  getUsers: async () => {
    const res = await api.post("/auth/getUsers");
    return res.data;
  },

  
  deleteUser: async (id: number) => {
    const res = await api.delete(`/auth/delete/${id}`);
    return res.data;
  },
};
