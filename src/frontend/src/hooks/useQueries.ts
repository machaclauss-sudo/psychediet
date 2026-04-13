import type { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { FoodEntry, MoodEntry, UserProfile, UserStatus } from "../backend";
import { useActor } from "./useActor";

export function useCurrentUserProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCurrentUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUserRole() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["userRole"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useFoodEntries() {
  const { actor, isFetching } = useActor();
  return useQuery<FoodEntry[]>({
    queryKey: ["foodEntries"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllFoodEntriesForCurrentUser();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMoodEntries() {
  const { actor, isFetching } = useActor();
  return useQuery<MoodEntry[]>({
    queryKey: ["moodEntries"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCurrentUserMoodEntriesReverse();
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePersonalizedInsights() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["insights"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getPersonalizedInsights();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllUserProfiles() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile[]>({
    queryKey: ["allUserProfiles"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllUserProfiles();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCurrentUsersWithStatus() {
  const { actor, isFetching } = useActor();
  return useQuery<[Principal, UserStatus][]>({
    queryKey: ["usersWithStatus"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCurrentUsersWithStatus();
    },
    enabled: !!actor && !isFetching,
  });
}

export interface UserRow {
  principal: Principal;
  status: UserStatus;
  profile: UserProfile | null;
}

export function useAllUsersWithProfiles() {
  const { actor, isFetching } = useActor();
  return useQuery<UserRow[]>({
    queryKey: ["allUsersWithProfiles"],
    queryFn: async () => {
      if (!actor) return [];
      const usersWithStatus = await actor.getCurrentUsersWithStatus();
      const rows = await Promise.all(
        usersWithStatus.map(async ([principal, status]) => {
          let profile: UserProfile | null = null;
          try {
            profile = await actor.getUserProfileByPrincipal(principal);
          } catch {
            // user hasn't completed onboarding
          }
          return { principal, status, profile } satisfies UserRow;
        }),
      );
      return rows;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAggregateAnalytics() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["aggregateAnalytics"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getAggregateAnalytics();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useLogFood() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (entry: FoodEntry) => {
      if (!actor) throw new Error("Not connected");
      return actor.logFoodEntry(entry);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["foodEntries"] });
      queryClient.invalidateQueries({ queryKey: ["insights"] });
    },
  });
}

export function useLogMood() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (entry: MoodEntry) => {
      if (!actor) throw new Error("Not connected");
      return actor.logMoodEntry(entry);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["moodEntries"] });
      queryClient.invalidateQueries({ queryKey: ["insights"] });
    },
  });
}

export function useCompleteOnboarding() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Not connected");
      return actor.completeOnboarding(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
      queryClient.invalidateQueries({ queryKey: ["userRole"] });
    },
  });
}

export function useSetUserStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      user,
      status,
    }: { user: Principal; status: UserStatus }) => {
      if (!actor) throw new Error("Not connected");
      return actor.setStatusToUserForAdmin(user, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usersWithStatus"] });
      queryClient.invalidateQueries({ queryKey: ["allUsersWithProfiles"] });
      queryClient.invalidateQueries({ queryKey: ["aggregateAnalytics"] });
    },
  });
}

export function useUserFoodEntries(userId: string | undefined) {
  const { actor, isFetching } = useActor();
  return useQuery<FoodEntry[]>({
    queryKey: ["userFoodEntries", userId],
    queryFn: async () => {
      if (!actor || !userId) return [];
      return actor.getAllFoodEntriesForCurrentUser();
    },
    enabled: !!actor && !isFetching && !!userId,
  });
}
