"use client";

import React, { Suspense, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDownIcon, MoveRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { authClient } from "~/auth/client";
import { Button } from "./ui/button";
import { api } from "~/trpc/react";
import HeaderButtons from "./headerButton";
import type { UrlObject } from "url";

function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { data: user, isPending: isSessionLoading } = authClient.useSession();
  const features = [
    {
      name: "Explore Mentors",
      href: "/",
      description: "Find the perfect mentor for you",
    },
    {
      name: "Explore Courses",
      href: "/",
      description: "Find the perfect course for you",
    },
    {
      name: "Explore Communities",
      href: "/",
      description: "Find the perfect community for you",
    },
    {
      name: "Explore Jobs",
      href: "/",
      description: "Find the perfect job for you",
    },
    {
      name: "Explore Events",
      href: "/",
      description: "Find the perfect event for you",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative w-full text-neutral-700 shadow-sm"
    >
      <nav className="mx-auto">
        <div className="relative">
          <div className="container mx-auto grid h-16 grid-cols-3 items-center justify-between px-6">
            <div className="flex items-center gap-2">
              <div
                className="relative"
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <Button variant="ghost" className="flex items-center gap-2">
                  Features
                  <motion.div
                    animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDownIcon className="h-4 w-4" />
                  </motion.div>
                </Button>
              </div>
              <Link href="/commmunity" className="flex items-center gap-2">
                Community
              </Link>
            </div>
            <div className="text-center">
              <Link href="/">
                <h1 className="text-2xl font-bold text-neutral-700">
                  EasyWisy.
                </h1>
              </Link>
            </div>
            <div className="flex items-center justify-end gap-2">
              <HeaderButtons
                userId={user?.user.id ?? ""}
                isSessionLoading={isSessionLoading}
              />
            </div>
          </div>
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="absolute top-full left-0 z-50 flex w-full border-t border-gray-100 bg-white shadow-sm"
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <div className="container mx-auto flex w-full items-center justify-center gap-20 px-6 pt-4 pb-6">
                  <div className="grid flex-1 grid-cols-2 gap-10 pt-4">
                    {features.map((feature) => (
                      <Link
                        key={feature.name}
                        // @ts-expect-error url type
                        href={feature.href}
                        className="group flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-gray-50"
                      >
                        <div className="flex flex-col gap-1">
                          <div className="group-hover:text-primary text-sm font-medium text-gray-900">
                            {feature.name}
                          </div>
                          <div className="group-hover:primary group-hover:text-primary/80 text-xs text-gray-500">
                            {feature.description}
                          </div>
                        </div>
                        <MoveRight className="group-hover:text-primary h-4 w-4" />
                      </Link>
                    ))}
                  </div>
                  <div className="flex h-full flex-col items-center justify-center gap-2">
                    <Image
                      src="/join.jpg"
                      alt="Join"
                      width={500}
                      height={500}
                      className="h-[200px] w-[300px] rounded-lg grayscale"
                    />

                    <Button variant="outline" className="w-full">
                      <Link href="/join">Become a Mentor</Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
    </motion.div>
  );
}

export default Header;
