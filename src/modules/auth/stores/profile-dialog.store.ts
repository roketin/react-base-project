import { create } from 'zustand';

type TProfileDialogStore = {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
};

export const useProfileDialogStore = create<TProfileDialogStore>((set) => ({
  isOpen: false,
  setOpen: (open) => set({ isOpen: open }),
}));
