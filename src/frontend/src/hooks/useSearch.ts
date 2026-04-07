import { useMutation } from "@tanstack/react-query";
import type { SearchResult } from "../types";
import { useBackend } from "./useBackend";

export type { SearchResult };

export function useSearchMessages() {
  const { actor } = useBackend();

  return useMutation({
    mutationFn: async (searchTerm: string): Promise<SearchResult[]> => {
      if (!actor) return [];
      if (!searchTerm.trim()) return [];
      return actor.searchMessages(searchTerm.trim());
    },
  });
}
