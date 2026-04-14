import { IMessage, IUser } from "@/types";
import { create } from "zustand";

type Store = {
  currentContact: IUser | null;
  setCurrentContact: (currentContact: IUser | null) => void;
  editedMessage: IMessage | null;
  setEditedMesssage: (message: IMessage | null) => void;
};

export const useCurrentContact = create<Store>()((set) => ({
  currentContact: null,
  setCurrentContact: (contact) => set({ currentContact: contact }),
  editedMessage: null,
  setEditedMesssage: (message) => set({ editedMessage: message }),
}));
