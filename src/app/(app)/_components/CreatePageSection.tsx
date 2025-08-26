"use client";

import Image from "next/image";

export function CreatePageSection() {
  return (
    <section className="bg-background w-full py-24">
      <div className="container mx-auto grid grid-cols-1 items-center gap-16 md:grid-cols-2">
        <div className="flex flex-col items-start gap-6 text-left">
          <h2 className="text-foreground text-6xl font-bold">
            Share Your Knowledge. <br />
            Empower the Next <br />
            <span className="text-primary">Generation.</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Become a mentor on EasyWeasy and connect with students who need your
            guidance and expertise.
          </p>
          <a
            href="#"
            className="group text-foreground flex items-center gap-2 text-lg font-semibold underline"
          >
            Become a Mentor
            <span className="transition-transform group-hover:translate-x-1">
              ↗
            </span>
          </a>
        </div>

        <div className="border-primary/10 bg-primary/5 rounded-3xl border-[12px] p-6 shadow-lg">
          <div className="bg-card relative flex items-start gap-4 rounded-xl p-4 shadow-sm">
            <Image
              src="/join.jpg"
              alt="Alex Doe"
              width={60}
              height={60}
              className="rounded-full"
            />
            <div className="flex-1">
              <p className="text-foreground font-bold">Alex Doe</p>
              <p className="text-muted-foreground text-sm">easyweasy.io/alex</p>
              <div className="mt-3 flex gap-2">
                <div className="bg-muted h-5 w-24 rounded-md"></div>
                <div className="bg-muted h-5 w-24 rounded-md"></div>
              </div>
            </div>
            <div className="bg-card absolute -top-3 -right-3 flex flex-col gap-1.5 rounded-lg p-1.5 shadow-md">
              <div className="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded text-sm">
                ✓
              </div>
              <div className="bg-primary/75 h-6 w-6 rounded"></div>
              <div className="bg-primary/50 h-6 w-6 rounded"></div>
              <div className="bg-primary/25 h-6 w-6 rounded"></div>
            </div>
          </div>

          <div className="mt-4 flex gap-4">
            <div className="bg-primary flex flex-1 items-center justify-center rounded-2xl p-8">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="text-primary-foreground h-20 w-20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <div className="flex flex-1 flex-col justify-between gap-2">
              <div className="bg-card flex items-center gap-2 rounded-full p-2 px-3 text-sm shadow-sm">
                <div className="bg-primary/10 text-primary flex h-5 w-5 items-center justify-center rounded-full">
                  S
                </div>
                <span>New student enrolled</span>
              </div>
              <div className="bg-card flex items-center gap-2 rounded-full p-2 px-3 text-sm shadow-sm">
                <div className="bg-primary/10 text-primary flex h-5 w-5 items-center justify-center rounded-full">
                  F
                </div>
                <span>Positive feedback received</span>
              </div>
              <div className="bg-card flex items-center gap-2 rounded-full p-2 px-3 text-sm shadow-sm">
                <div className="bg-primary/10 text-primary flex h-5 w-5 items-center justify-center rounded-full">
                  B
                </div>
                <span>1-on-1 session booked</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
