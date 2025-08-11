import { Lora } from "next/font/google";

import { cn } from "@acme/ui";
import { Badge } from "@acme/ui/badge";
import { Button } from "@acme/ui/button";

import { HydrateClient } from "~/trpc/server";

const playFair = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
export default function HomePage() {
  return (
    <HydrateClient>
      <main className="relative min-h-screen w-full overflow-hidden bg-primary py-16">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="h-full w-full bg-[linear-gradient(to_right,var(--grid-color)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-color)_1px,transparent_1px)] bg-[size:40px_40px] [--grid-color:rgba(0,0,0,0.06)] [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)] dark:[--grid-color:rgba(255,255,255,0.06)]" />
        </div>

        <div className="container relative mt-20 grid h-full place-items-center">
          {/* <Image
            src={"/Home.png"}
            height={500}
            width={500}
            alt="Home"
            className="absolute inset-0 z-0 size-[500px]"
          /> */}
          <div className="z-10 flex h-full w-full flex-col justify-center gap-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <Badge variant="transparent">
                <p>
                  <span className="text-primary-light">
                    Start you career with the best mentor
                  </span>
                </p>
              </Badge>
            </div>
            <p
              className={cn(
                "mx-auto max-w-3xl text-5xl font-extralight text-primary-light",
                playFair.className,
              )}
            >
              Kickstart your career by joining the best mentor marketplace
            </p>
            <p
              className={cn(
                "mx-auto max-w-xl text-lg font-light text-primary-light",
                playFair.className,
              )}
            >
              Find the best mentor for your career and get the support you need
              to succeed.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button className="bg-primary-light text-primary hover:bg-primary-light">
                Get Started
              </Button>
              <Button variant="transparent">Learn More</Button>
            </div>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
