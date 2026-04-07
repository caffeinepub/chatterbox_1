import { k as useBackend, l as useQuery, m as useQueryClient, n as useMutation } from "./index-Cdrxh2KL.js";
function useContacts() {
  const { actor, isFetching } = useBackend();
  return useQuery({
    queryKey: ["contacts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getContacts();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5e3
  });
}
function usePendingContactRequests() {
  const { actor, isFetching } = useBackend();
  return useQuery({
    queryKey: ["pending-requests"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPendingContactRequests();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5e3
  });
}
function useSendContactRequest() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (target) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.sendContactRequest(target);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      queryClient.invalidateQueries({ queryKey: ["sent-requests"] });
    }
  });
}
function useAcceptContactRequest() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (requestId) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.acceptContactRequest(requestId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      queryClient.invalidateQueries({ queryKey: ["pending-requests"] });
    }
  });
}
function useRejectContactRequest() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (requestId) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.rejectContactRequest(requestId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-requests"] });
    }
  });
}
function useRemoveContact() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (target) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.removeContact(target);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    }
  });
}
export {
  useSendContactRequest as a,
  usePendingContactRequests as b,
  useAcceptContactRequest as c,
  useRejectContactRequest as d,
  useRemoveContact as e,
  useContacts as u
};
