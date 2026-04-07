import type { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  CreateGroupRequest,
  EditGroupRequest,
  SendMessageRequest,
} from "../types";
import { useBackend } from "./useBackend";

export function useGroups() {
  const { actor, isFetching } = useBackend();

  return useQuery({
    queryKey: ["groups"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserGroups();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000,
  });
}

export function useGroup(groupId: bigint | null) {
  const { actor, isFetching } = useBackend();

  return useQuery({
    queryKey: ["group", groupId?.toString()],
    queryFn: async () => {
      if (!actor || groupId === null) return null;
      return actor.getGroup(groupId);
    },
    enabled: !!actor && !isFetching && groupId !== null,
    refetchInterval: 10000,
  });
}

export function useGroupMembers(groupId: bigint | null) {
  const { actor, isFetching } = useBackend();

  return useQuery({
    queryKey: ["group-members", groupId?.toString()],
    queryFn: async () => {
      if (!actor || groupId === null) return [];
      return actor.getGroupMembers(groupId);
    },
    enabled: !!actor && !isFetching && groupId !== null,
    refetchInterval: 10000,
  });
}

export function useGroupMessages(groupId: bigint | null) {
  const { actor, isFetching } = useBackend();

  return useQuery({
    queryKey: ["group-messages", groupId?.toString()],
    queryFn: async () => {
      if (!actor || groupId === null) return [];
      return actor.getGroupMessages(groupId, null, BigInt(50));
    },
    enabled: !!actor && !isFetching && groupId !== null,
    refetchInterval: 3000,
  });
}

export function useCreateGroup() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (req: CreateGroupRequest) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createGroup(req);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
}

export function useEditGroup() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      groupId,
      req,
    }: {
      groupId: bigint;
      req: EditGroupRequest;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.editGroup(groupId, req);
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({
        queryKey: ["group", vars.groupId.toString()],
      });
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
}

export function useAddGroupMember() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      groupId,
      newMember,
    }: {
      groupId: bigint;
      newMember: Principal;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.addGroupMember(groupId, newMember);
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({
        queryKey: ["group-members", vars.groupId.toString()],
      });
    },
  });
}

export function useRemoveGroupMember() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      groupId,
      target,
    }: {
      groupId: bigint;
      target: Principal;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.removeGroupMember(groupId, target);
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({
        queryKey: ["group-members", vars.groupId.toString()],
      });
    },
  });
}

export function useLeaveGroup() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (groupId: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.leaveGroup(groupId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
}

export function useSendGroupMessage() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      groupId,
      req,
    }: {
      groupId: bigint;
      req: SendMessageRequest;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.sendGroupMessage(groupId, req);
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({
        queryKey: ["group-messages", vars.groupId.toString()],
      });
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
}

export function useMarkGroupRead() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      groupId,
      upToMsgId,
    }: {
      groupId: bigint;
      upToMsgId: bigint;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.markGroupRead(groupId, upToMsgId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
}
