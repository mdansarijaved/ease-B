"use client";

import { ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";

export function HeroSection() {
  return (
    <section className="bg-background relative w-full overflow-hidden py-32 md:py-48">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="bg-primary/10 absolute -top-48 left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full blur-3xl" />
        <div className="bg-secondary/10 absolute right-1/2 -bottom-48 h-[40rem] w-[40rem] translate-x-1/2 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto text-center">
        <div className="flex flex-col items-center gap-8">
          <h1 className="text-foreground max-w-4xl text-5xl font-bold tracking-tighter md:text-7xl">
            Kickstart Your Career with the Perfect Mentor
          </h1>
          <p className="text-muted-foreground max-w-2xl text-lg">
            Find the best mentor for your career and get the support you need to
            succeed in our thriving marketplace.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <Button size="lg">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="link" className="text-muted-foreground">
              Learn More
            </Button>
          </div>
          <div className="mt-8 flex items-center justify-center">
            <div className="flex -space-x-4">
              <Avatar className="border-background h-12 w-12 border-2">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>M1</AvatarFallback>
              </Avatar>
              <Avatar className="border-background h-12 w-12 border-2">
                <AvatarImage src="https://github.com/vercel.png" />
                <AvatarFallback>M2</AvatarFallback>
              </Avatar>
              <Avatar className="border-background h-12 w-12 border-2">
                <AvatarImage src="https://github.com/nextjs.png" />
                <AvatarFallback>M3</AvatarFallback>
              </Avatar>
            </div>
            <p className="text-muted-foreground ml-4 font-medium">
              Join <span className="text-foreground font-bold">500+</span>{" "}
              mentors worldwide.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
