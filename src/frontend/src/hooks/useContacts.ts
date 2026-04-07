import type { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useBackend } from "./useBackend";

export function useContacts() {
  const { actor, isFetching } = useBackend();

  return useQuery({
    queryKey: ["contacts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getContacts();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000,
  });
}

export function usePendingContactRequests() {
  const { actor, isFetching } = useBackend();

  return useQuery({
    queryKey: ["pending-requests"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPendingContactRequests();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000,
  });
}

export function useSentContactRequests() {
  const { actor, isFetching } = useBackend();

  return useQuery({
    queryKey: ["sent-requests"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSentContactRequests();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 10000,
  });
}

export function useSendContactRequest() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (target: Principal) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.sendContactRequest(target);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      queryClient.invalidateQueries({ queryKey: ["sent-requests"] });
    },
  });
}

export function useAcceptContactRequest() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestId: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.acceptContactRequest(requestId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      queryClient.invalidateQueries({ queryKey: ["pending-requests"] });
    },
  });
}

export function useRejectContactRequest() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestId: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.rejectContactRequest(requestId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-requests"] });
    },
  });
}

export function useRemoveContact() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (target: Principal) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.removeContact(target);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
}
