import { create } from "zustand";

type Store = {
  isCreating: boolean;
  setCreating: (isCreating: boolean) => void;
  isLoading: boolean;
  setLoading: (isLoading: boolean) => void;
  loadMessage: boolean;
  setLoadMessage: (loadMessage: boolean) => void;
};

export const useLoading = create<Store>()((set) => ({
  isCreating: false,
  setCreating: (isCreating) => set({ isCreating }),
  isLoading: false,
  setLoading: (isLoading) => set({ isLoading }),
  loadMessage: false,
  setLoadMessage: (loadMessage) => set({ loadMessage }),
}));
