import React from "react";
import { api } from "~/trpc/react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Skeleton } from "./ui/skeleton";
import { authClient } from "~/auth/client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

function HeaderButtons() {
  const { data: user, isPending: isSessionLoading } = authClient.useSession();
  const userId = user?.user.id;

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
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarImage src={user.user.image ?? ""} />
            <AvatarFallback>{user.user.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link href={"/"}>Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem hidden={user.user.role !== "mentor"}>
            <Link href={"/dashboard/mentor"}>Dashboard</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {!userProfile?.id && (
        <Link href="/join">
          <Button>Join Us</Button>
        </Link>
      )}
    </div>
  );
}

export default HeaderButtons;
