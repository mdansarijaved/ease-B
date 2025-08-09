"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDownIcon, MoveRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { Button } from "@acme/ui/button";

import { authClient } from "~/auth/client";

function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const user = authClient.useSession();
  const isLoggedIn = !!user.data?.user;
  const isNormalUser = user.data?.user.role === "user";

  const features = [
    {
      name: "Explore Mentors",
      href: "/mentors",
      description: "Find the perfect mentor for you",
    },
    {
      name: "Explore Courses",
      href: "/courses",
      description: "Find the perfect course for you",
    },
    {
      name: "Explore Communities",
      href: "/communities",
      description: "Find the perfect community for you",
    },
    {
      name: "Explore Jobs",
      href: "/jobs",
      description: "Find the perfect job for you",
    },
    {
      name: "Explore Events",
      href: "/events",
      description: "Find the perfect event for you",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative bg-white text-neutral-700 shadow-sm"
    >
      <div className="mx-auto">
        <div className="relative">
          <div className="container flex h-16 items-center justify-between px-6">
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
              <Link href="/about" className="flex items-center gap-2">
                About
              </Link>
            </div>
            <div>
              <Link href="/">
                <h1 className="text-2xl font-bold text-neutral-700">
                  EasyWeasy
                </h1>
              </Link>
            </div>
            <div className="flex items-center gap-2">
              {isLoggedIn && !isNormalUser ? (
                <Button>
                  <Link href="/profile">Profile</Link>
                </Button>
              ) : isNormalUser ? (
                <Button>
                  <Link href="/join">Join Us</Link>
                </Button>
              ) : (
                <>
                  <Button variant="outline">
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button variant="outline">
                    <Link href="/signup">Signup</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="absolute left-0 top-full z-50 flex w-full border-t border-gray-100 bg-white shadow-sm"
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <div className="container mx-auto flex w-full items-center justify-center gap-20 px-6 pb-6 pt-4">
                  <div className="grid flex-1 grid-cols-2 gap-10 pt-4">
                    {features.map((feature) => (
                      <Link
                        key={feature.name}
                        href={feature.href}
                        className="group flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-gray-50"
                      >
                        <div className="flex flex-col gap-1">
                          <div className="text-sm font-medium text-gray-900 group-hover:text-primary">
                            {feature.name}
                          </div>
                          <div className="group-hover:primary text-xs text-gray-500 group-hover:text-primary/80">
                            {feature.description}
                          </div>
                        </div>
                        <MoveRight className="h-4 w-4 group-hover:text-primary" />
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
                      <Link href="/mentors/new">Become a Mentor</Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

export default Header;
