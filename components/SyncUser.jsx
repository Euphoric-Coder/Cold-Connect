"use client";

import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { useEffect } from "react";

export default function SyncUser() {
  const { user } = useUser();
  const updateUser = useMutation(api.users.updateUser);
  const status = useQuery(api.users.onboardingStatus, {
    email: user?.emailAddresses[0]?.emailAddress,
  });

  useEffect(() => {
    if (!user) return;

    const syncUser = async () => {
      try {
        await updateUser({
          name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
          email: user.emailAddresses[0]?.emailAddress ?? "",
          resumeURL: user.publicMetadata?.resumeURL ?? undefined,
          githubURL: user.publicMetadata?.githubURL ?? undefined,
          hasOnboarded: status,
        });
      } catch (error) {
        console.error("Error syncing user:", error);
      }
    };

    syncUser();
  }, [user, updateUser]);

  return null;
}
