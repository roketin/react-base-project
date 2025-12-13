import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

// ============================================================================
// SMART STACK MANAGER
// ============================================================================

const BASE_Z_INDEX = 60;
const Z_INDEX_INCREMENT = 10;

type TStackItem = {
  id: string;
  zIndex: number;
};

type TListener = () => void;

class SmartStackManager {
  private stack: TStackItem[] = [];
  private listeners: Set<TListener> = new Set();
  private idCounter = 0;
  private originalBodyOverflow: string | null = null;

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  subscribe = (listener: TListener) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  getSnapshot = () => this.stack;

  generateId(): string {
    return `stack-${++this.idCounter}`;
  }

  private lockBodyScroll(): void {
    // Only lock if this is the first dialog
    if (this.stack.length === 0 && this.originalBodyOverflow === null) {
      this.originalBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }
  }

  private unlockBodyScroll(): void {
    // Only unlock if no more dialogs are open
    if (this.stack.length === 0 && this.originalBodyOverflow !== null) {
      document.body.style.overflow = this.originalBodyOverflow;
      this.originalBodyOverflow = null;
    }
  }

  register(id: string): number {
    // Lock body scroll before adding to stack
    this.lockBodyScroll();

    // Always push to top of stack (remove if exists, then add)
    const existingIndex = this.stack.findIndex((item) => item.id === id);
    if (existingIndex !== -1) {
      this.stack.splice(existingIndex, 1);
    }

    const zIndex =
      this.stack.length === 0
        ? BASE_Z_INDEX
        : this.stack[this.stack.length - 1].zIndex + Z_INDEX_INCREMENT;

    this.stack.push({ id, zIndex });
    this.notify();
    return zIndex;
  }

  unregister(id: string): void {
    const index = this.stack.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.stack.splice(index, 1);
      this.notify();
      // Unlock body scroll after removing from stack
      this.unlockBodyScroll();
    }
  }

  getZIndex(id: string): number | undefined {
    return this.stack.find((item) => item.id === id)?.zIndex;
  }

  isTopmost(id: string): boolean {
    if (this.stack.length === 0) return false;
    return this.stack[this.stack.length - 1].id === id;
  }

  getStackSize(): number {
    return this.stack.length;
  }
}

// Singleton instance
const smartStackManager = new SmartStackManager();

// ============================================================================
// HOOK
// ============================================================================

type TUseSmartStackOptions = {
  enabled?: boolean;
};

type TUseSmartStackReturn = {
  id: string;
  zIndex: number;
  overlayZIndex: number;
  contentZIndex: number;
  isTopmost: boolean;
};

export function useSmartStack(
  options: TUseSmartStackOptions = {},
): TUseSmartStackReturn {
  const { enabled = true } = options;
  const idRef = useRef<string | null>(null);
  const [currentId, setCurrentId] = useState<string | null>(null);

  // Subscribe to stack changes
  useSyncExternalStore(
    smartStackManager.subscribe,
    smartStackManager.getSnapshot,
    smartStackManager.getSnapshot,
  );

  useEffect(() => {
    if (!enabled) {
      // Unregister when disabled
      if (idRef.current) {
        smartStackManager.unregister(idRef.current);
        idRef.current = null;
        setCurrentId(null);
      }
      return;
    }

    // Generate new ID each time dialog opens (enabled becomes true)
    const newId = smartStackManager.generateId();
    idRef.current = newId;
    setCurrentId(newId);
    smartStackManager.register(newId);

    return () => {
      if (idRef.current) {
        smartStackManager.unregister(idRef.current);
        idRef.current = null;
      }
    };
  }, [enabled]);

  const baseZIndex = currentId
    ? (smartStackManager.getZIndex(currentId) ?? BASE_Z_INDEX)
    : BASE_Z_INDEX;

  return {
    id: currentId ?? '',
    zIndex: baseZIndex,
    overlayZIndex: baseZIndex,
    contentZIndex: baseZIndex + 1,
    isTopmost: currentId ? smartStackManager.isTopmost(currentId) : false,
  };
}

export { smartStackManager };
export default useSmartStack;
