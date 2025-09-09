import React from "react";
import { api } from "~/trpc/react";
import { Button } from "./ui/button";
import { authClient } from "~/auth/client";
import Link from "next/link";

function HeaderButtons({ userId }: { userId: string }) {
  const { data: userProfile, isLoading } = api.userProfile.get.useQuery({});
  const isLoggedIn = !!userId;
  console.log(userProfile);
  if (!userId) {
    return (
      <>
        <Link href="/auth/login">
          <Button variant="outline">Login</Button>
        </Link>
        <Link href="/auth/signup">
          <Button variant="outline">Signup</Button>
        </Link>
      </>
    );
  }

  if (isLoggedIn && userProfile?.id) {
    return (
      <div>
        <Button>
          <Link href="/profile">Profile</Link>
        </Button>
      </div>
    );
  }
  if (isLoggedIn && !userProfile) {
    return (
      <div>
        <Button>
          <Link href="/profile">Profile</Link>
        </Button>
        <Button>
          <Link href="/join">Join Us</Link>
        </Button>
      </div>
    );
  }

  return <div></div>;
}

export default HeaderButtons;
