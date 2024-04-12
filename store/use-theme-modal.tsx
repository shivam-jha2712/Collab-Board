import { create } from "zustand";

export const useplannerTheme = create((set) => ({
  plannerTheme: "#020817",
  setLightTheme: () => set((state: string) => ({ plannerTheme: "#FFF" })),
  setDarkTheme: () => set((state: string) => ({ plannerTheme: "#020817" })),
}));
