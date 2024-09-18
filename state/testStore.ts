import { create } from "zustand";
import axios from "axios";

interface UploadImages {
  public_id: string;
  url: string;
  originalname: string;
}

interface Test {
  id: number;
  test: string;
  image: UploadImages[];
}

interface TestState {
  tests: Test[];
  singleTest: Test | null;
  loading: boolean;
  error: string | null;
  fetchTests: () => void;
  fetchSingleTest: (id: number) => void;
  addTest: (data: FormData) => void;
  updateTest: (id: number, data: FormData) => void;
  deleteTest: (id: number) => void;
}

const BASE_URL = "http://localhost:4000/api/v1/tests";

export const useTestStore = create<TestState>((set) => ({
  tests: [],
  singleTest: null,
  loading: false,
  error: null,

  fetchTests: async () => {
    set({ loading: true });
    try {
      const response = await axios.get<{ status: boolean; data: Test[] }>(
        BASE_URL,
      );
      const normalizedTests = response.data.data.map((test) => ({
        ...test,
        image: Array.isArray(test.image) ? test.image : JSON.parse(test.image),
      }));
      set({ tests: normalizedTests, loading: false });
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

  fetchSingleTest: async (id: number) => {
    set({ loading: true });
    try {
      const response = await axios.get<{ status: boolean; data: Test }>(
        `${BASE_URL}/${id}`,
      );
      const normalizedTest = {
        ...response.data.data,
        image: Array.isArray(response.data.data.image)
          ? response.data.data.image
          : JSON.parse(response.data.data.image),
      };
      set({ singleTest: normalizedTest, loading: false });
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

  addTest: async (data: FormData) => {
    set({ loading: true });
    try {
      const response = await axios.post<Test>(BASE_URL, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set((state) => ({
        tests: [...state.tests, response.data],
        loading: false,
      }));
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

  updateTest: async (id: number, data: FormData) => {
    set({ loading: true });
    try {
      const response = await axios.patch<Test>(`${BASE_URL}/edit/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set((state) => ({
        tests: state.tests.map((test) =>
          test.id === id ? response.data : test,
        ),
        loading: false,
      }));
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

  deleteTest: async (id: number) => {
    set({ loading: true });
    try {
      await axios.delete(`${BASE_URL}/delete/${id}`);
      set((state) => ({
        tests: state.tests.filter((test) => test.id !== id),
        loading: false,
      }));
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
