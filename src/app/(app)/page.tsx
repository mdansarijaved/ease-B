import { Lora } from "next/font/google";
import { Badge } from "~/components/ui/badge";
import { cn } from "~/lib/utils";

import { HydrateClient } from "~/trpc/server";
import { Button } from "~/components/ui/button";

const playFair = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
export default function HomePage() {
  return (
    <HydrateClient>
      <main className="bg-primary relative min-h-screen w-full overflow-hidden py-16">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="h-full w-full bg-[linear-gradient(to_right,var(--grid-color)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-color)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)] bg-[size:40px_40px] [--grid-color:rgba(0,0,0,0.06)] dark:[--grid-color:rgba(255,255,255,0.06)]" />
        </div>

        <div className="relative container mx-auto mt-20 grid h-full place-items-center">
          <div className="z-10 flex h-full w-full flex-col justify-center gap-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <Badge variant="transparent" className="bg-white">
                <p>
                  <span className="text-primary-light">
                    Start you career with the best mentor
                  </span>
                </p>
              </Badge>
            </div>
            <p
              className={cn(
                "text-primary-light mx-auto max-w-3xl text-5xl font-extralight",
                playFair.className,
              )}
            >
              Kickstart your career by joining the best mentor marketplace
            </p>
            <p
              className={cn(
                "text-primary-light mx-auto max-w-xl text-lg font-light",
                playFair.className,
              )}
            >
              Find the best mentor for your career and get the support you need
              to succeed.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button variant={"secondary"} className="">
                Get Started
              </Button>
              <Button variant="outline">Learn More</Button>
            </div>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
