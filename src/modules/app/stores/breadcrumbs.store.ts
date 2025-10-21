// stores/useBreadcrumbStore.ts
import { create } from 'zustand';

export type ResolverFn = (id: string) => string | undefined;

export type BreadcrumbType = string;

export type TBreadcrumbs = {
  resolvers: Partial<Record<BreadcrumbType, ResolverFn>>;
  register: (type: BreadcrumbType, fn: ResolverFn) => void;
  unregister: (type: BreadcrumbType) => void;
  clear: () => void;
};

export const useBreadcrumbStore = create<TBreadcrumbs>((set) => ({
  resolvers: {},
  register: (type, fn) =>
    set((state) => ({
      resolvers: { ...state.resolvers, [type]: fn },
    })),
  unregister: (type) =>
    set((state) => {
      const next = { ...state.resolvers };
      delete next[type];
      return { resolvers: next };
    }),
  clear: () => set({ resolvers: {} }),
}));
