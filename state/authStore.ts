import { create } from "zustand";
import axios from "axios";

interface Role {
  id: number;
  roleName: string;
}

interface UploadImages {
  public_id: string;
  url: string;
  originalname: string;
}

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  image: UploadImages[];
  address: string;
  verificationCode?: string;
  governmentId?: UploadImages[];
  roleId: number;
  role: Role;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  error: string | null;
  loginUser: (email: string, password: string) => void;
  logoutUser: () => void;
}

interface LoginResponse {
  status: boolean;
  data: User;
  meta: {
    accessToken: string;
  };
}

const BASE_URL = "http://localhost:4000/api/v1/auth";

const getInitialState = (): AuthState => {
  const user = localStorage.getItem("user");
  const accessToken = localStorage.getItem("accessToken");
  return {
    user: user ? JSON.parse(user) : null,
    accessToken: accessToken || null,
    loading: false,
    error: null,
    loginUser: async () => {},
    logoutUser: async () => {},
  };
};

export const useAuthStore = create<AuthState>((set) => ({
  ...getInitialState(),

  loginUser: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post<LoginResponse>(`${BASE_URL}/login`, {
        email,
        password,
      });

      const user = response.data.data;
      const accessToken = response.data.meta.accessToken;

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("accessToken", accessToken);

      set({
        user,
        accessToken,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      const errorDetails = error.response
        ? `${error.response.data.message || "Unknown error occurred"}`
        : error.message || "An error occurred while logging in.";

      set({
        error: errorDetails,
        loading: false,
      });
    }
  },

  logoutUser: async () => {
    set({ loading: true, error: null });
    try {
      await axios.post(`${BASE_URL}/logout`);

      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");

      set({
        user: null,
        accessToken: null,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      const errorDetails = error.response
        ? `${error.response.data.message || "Unknown error occurred"}`
        : error.message || "An error occurred while logging in.";

      set({
        error: errorDetails,
        loading: false,
      });
    }
  },
}));
