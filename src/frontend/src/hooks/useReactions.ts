import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useBackend } from "./useBackend";

export function useReactions(conversationId: string, messageId: bigint) {
  const { actor, isFetching } = useBackend();
  const queryClient = useQueryClient();
  const queryKey = ["reactions", conversationId, messageId.toString()];

  const reactionsQuery = useQuery({
    queryKey,
    queryFn: async () => {
      if (!actor) return [];
      return actor.getReactions(conversationId, messageId);
    },
    enabled: !!actor && !isFetching && !!conversationId,
    refetchInterval: 5000,
    staleTime: 2000,
  });

  const addReaction = useMutation({
    mutationFn: async (emoji: string) => {
      if (!actor) throw new Error("Actor not ready");
      await actor.addReaction(conversationId, messageId, emoji);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const removeReaction = useMutation({
    mutationFn: async (emoji: string) => {
      if (!actor) throw new Error("Actor not ready");
      await actor.removeReaction(conversationId, messageId, emoji);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    reactions: reactionsQuery.data ?? [],
    addReaction,
    removeReaction,
  };
}
