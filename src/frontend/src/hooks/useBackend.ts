import { useActor } from "@caffeineai/core-infrastructure";
import { createActor } from "../backend";
import type { Backend } from "../backend";

export function useBackend(): { actor: Backend | null; isFetching: boolean } {
  return useActor(createActor);
}
