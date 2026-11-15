"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_EVENT = "superior-mail-storage-update";

function subscribe(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }
  const handler = () => callback();
  window.addEventListener("storage", handler);
  window.addEventListener(STORAGE_EVENT, handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(STORAGE_EVENT, handler);
  };
}

export function setStoredItem(key: string, value: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, value);
    window.dispatchEvent(new Event(STORAGE_EVENT));
  } catch {
    // Gracefully handle storage quotas or unavailable localStorage in private browsing
  }
}

export function getStoredItem(key: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  try {
    return window.localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

/**
 * Enterprise-grade isomorphic localStorage hook powered by React 18/19 `useSyncExternalStore`.
 * Guarantees zero SSR hydration mismatches, cross-tab synchronization, and avoids
 * React 19 `react-hooks/set-state-in-effect` warnings by decoupling subscription from effects.
 */
export function useLocalStorage(
  key: string,
  initialValue: string
): [string, (value: string) => void] {
  const getSnapshot = useCallback(() => {
    return getStoredItem(key, initialValue);
  }, [key, initialValue]);

  const getServerSnapshot = useCallback(() => initialValue, [initialValue]);

  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setValue = useCallback(
    (newValue: string) => {
      setStoredItem(key, newValue);
    },
    [key]
  );

  return [value, setValue];
}
