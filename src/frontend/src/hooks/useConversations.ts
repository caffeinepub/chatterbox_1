import type { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { SendMessageRequest } from "../types";
import { useBackend } from "./useBackend";

export function useConversations() {
  const { actor, isFetching } = useBackend();

  return useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getDirectConversationSummaries();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 3000,
  });
}

export function useDirectMessages(conversationId: bigint | null) {
  const { actor, isFetching } = useBackend();

  return useQuery({
    queryKey: ["direct-messages", conversationId?.toString()],
    queryFn: async () => {
      if (!actor || conversationId === null) return [];
      return actor.getDirectMessages(conversationId, null, BigInt(50));
    },
    enabled: !!actor && !isFetching && conversationId !== null,
    refetchInterval: 3000,
  });
}

export function useGetOrCreateDirectConversation() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (other: Principal) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.getOrCreateDirectConversation(other);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

export function useSendDirectMessage() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      conversationId,
      req,
    }: {
      conversationId: bigint;
      req: SendMessageRequest;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.sendDirectMessage(conversationId, req);
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({
        queryKey: ["direct-messages", vars.conversationId.toString()],
      });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

export function useMarkDirectRead() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      conversationId,
      upToMessageId,
    }: {
      conversationId: bigint;
      upToMessageId: bigint;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.markDirectRead(conversationId, upToMessageId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}
