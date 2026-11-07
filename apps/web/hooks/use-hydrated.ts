import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** `true` somente no client após a hidratação — evita mismatch com dados do localStorage. */
export function useHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
