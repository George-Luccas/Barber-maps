"use client";

import { getUserMembership } from "@/actions/get-user-membership";
import { useQuery } from "@tanstack/react-query";

export const useUserMembership = () => {
    return useQuery({
        queryKey: ["user-membership"],
        queryFn: async () => {
             const result = await getUserMembership();
             return result.data ?? null;
        }
    });
}
