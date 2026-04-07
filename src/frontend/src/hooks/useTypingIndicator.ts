import { useMutation, useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { useBackend } from "./useBackend";

export function useTypingIndicator(conversationId: string) {
  const { actor, isFetching } = useBackend();
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setTypingMutation = useMutation({
    mutationFn: async (isTyping: boolean) => {
      if (!actor) return;
      await actor.setTypingStatus(conversationId, isTyping);
    },
  });

  const typingUsersQuery = useQuery({
    queryKey: ["typing-users", conversationId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTypingUsers(conversationId);
    },
    enabled: !!actor && !isFetching && !!conversationId,
    refetchInterval: 2000,
  });

  const onKeydown = () => {
    setTypingMutation.mutate(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setTypingMutation.mutate(false);
    }, 3000);
  };

  const onStopTyping = () => {
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    setTypingMutation.mutate(false);
  };

  return {
    typingUsers: typingUsersQuery.data ?? [],
    onKeydown,
    onStopTyping,
  };
}
