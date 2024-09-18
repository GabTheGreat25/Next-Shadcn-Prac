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
  createdAt: string;
  updatedAt: string;
}

interface TestChild {
  id: number;
  testChild: string;
  image: UploadImages[];
  testId: number;
  test?: Test;
}

interface TestChildState {
  testChildren: TestChild[];
  singleTestChild: TestChild | null;
  loading: boolean;
  error: string | null;
  fetchTestChildren: () => void;
  fetchSingleTestChild: (id: number) => void;
  addTestChild: (data: FormData) => void;
  updateTestChild: (id: number, data: FormData) => void;
  deleteTestChild: (id: number) => void;
}

const BASE_URL = "http://localhost:4000/api/v1/testsChild";

export const useTestChildStore = create<TestChildState>((set) => ({
  testChildren: [],
  singleTestChild: null,
  loading: false,
  error: null,

  fetchTestChildren: async () => {
    set({ loading: true });
    try {
      const response = await axios.get<{ status: boolean; data: TestChild[] }>(
        BASE_URL,
      );

      const normalizedTestChildren = response.data.data.map((child) => ({
        ...child,
        image: Array.isArray(child.image)
          ? child.image
          : JSON.parse(child.image),
        test: child.test
          ? {
              ...child.test,
              image: Array.isArray(child.test.image)
                ? child.test.image
                : JSON.parse(child.test.image),
            }
          : undefined,
      }));
      set({ testChildren: normalizedTestChildren, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchSingleTestChild: async (id: number) => {
    set({ loading: true });
    try {
      const response = await axios.get<{ status: boolean; data: TestChild }>(
        `${BASE_URL}/${id}`,
      );

      const normalizedTestChild = {
        ...response.data.data,
        image: Array.isArray(response.data.data.image)
          ? response.data.data.image
          : JSON.parse(response.data.data.image),
        test: response.data.data.test
          ? {
              ...response.data.data.test,
              image: Array.isArray(response.data.data.test.image)
                ? response.data.data.test.image
                : JSON.parse(response.data.data.test.image),
            }
          : undefined,
      };
      set({ singleTestChild: normalizedTestChild, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  addTestChild: async (data: FormData) => {
    set({ loading: true });
    try {
      const response = await axios.post<TestChild>(BASE_URL, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set((state) => ({
        testChildren: [...state.testChildren, response.data],
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  updateTestChild: async (id: number, data: FormData) => {
    set({ loading: true });
    try {
      const response = await axios.patch<TestChild>(
        `${BASE_URL}/edit/${id}`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      set((state) => ({
        testChildren: state.testChildren.map((child) =>
          child.id === id ? response.data : child,
        ),
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  deleteTestChild: async (id: number) => {
    set({ loading: true });
    try {
      await axios.delete(`${BASE_URL}/delete/${id}`);
      set((state) => ({
        testChildren: state.testChildren.filter((child) => child.id !== id),
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
}));
