import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { SaveProfileRequest } from "../types";
import { useBackend } from "./useBackend";

export function useProfile() {
  const { actor, isFetching } = useBackend();

  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000,
  });
}

export function useUserProfile(userId: string | undefined) {
  const { actor, isFetching } = useBackend();

  return useQuery({
    queryKey: ["user-profile", userId],
    queryFn: async () => {
      if (!actor || !userId) return null;
      const principal = (
        await import("@icp-sdk/core/principal")
      ).Principal.fromText(userId);
      return actor.getUserProfile(principal);
    },
    enabled: !!actor && !isFetching && !!userId,
    refetchInterval: 10000,
  });
}

export function useSaveProfile() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (req: SaveProfileRequest) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.saveCallerUserProfile(req);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

export function useFindUserByUsername() {
  const { actor } = useBackend();

  return useMutation({
    mutationFn: async (username: string) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.findUserByUsername(username);
    },
  });
}
