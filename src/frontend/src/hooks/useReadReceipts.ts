import { useQuery } from "@tanstack/react-query";
import type { UserId } from "../types";
import { useBackend } from "./useBackend";

export function useDirectMessageReaders(
  conversationId: bigint,
  messageId: bigint,
  enabled: boolean,
) {
  const { actor, isFetching } = useBackend();

  return useQuery<UserId[]>({
    queryKey: [
      "direct-msg-readers",
      conversationId.toString(),
      messageId.toString(),
    ],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getDirectMessageReaders(conversationId, messageId);
    },
    enabled: !!actor && !isFetching && enabled,
    refetchInterval: 5000,
    staleTime: 3000,
  });
}

export function useGroupMessageReaders(
  groupId: bigint,
  messageId: bigint,
  enabled: boolean,
) {
  const { actor, isFetching } = useBackend();

  return useQuery<UserId[]>({
    queryKey: ["group-msg-readers", groupId.toString(), messageId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getGroupMessageReaders(groupId, messageId);
    },
    enabled: !!actor && !isFetching && enabled,
    refetchInterval: 5000,
    staleTime: 3000,
  });
}
