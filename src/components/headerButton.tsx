import React from "react";
import { api } from "~/trpc/react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Skeleton } from "./ui/skeleton";

function HeaderButtons({
  userId,
  isSessionLoading,
}: {
  userId: string;
  isSessionLoading: boolean;
}) {
  const { data: userProfile, isLoading } = api.userProfile.get.useQuery(
    {},
    {
      enabled: !!userId,
    },
  );

  if (isSessionLoading) {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-20" />
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/auth/login">
          <Button variant="outline">Login</Button>
        </Link>
        <Link href="/auth/signup">
          <Button variant="outline">Signup</Button>
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-20" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link href="/profile">
        <Button variant="outline">Profile</Button>
      </Link>
      {!userProfile?.id && (
        <Link href="/join">
          <Button>Join Us</Button>
        </Link>
      )}
    </div>
  );
}

export default HeaderButtons;
