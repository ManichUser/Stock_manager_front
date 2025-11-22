import api from "../lib/api";
export interface LoginResponse {
  message: string;
  token: string;
  userId:number
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
    document.cookie = `token=${res.data.token}; path=/; SameSite=Lax`;

    return res.data;
  },

  logout: ()=>{
    const token = localStorage.getItem('token');
    if(token) localStorage.removeItem('token')
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
