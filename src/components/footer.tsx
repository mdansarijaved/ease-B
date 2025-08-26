"use client";

import React from "react";
import { Github, Linkedin, Twitter } from "lucide-react";
import { cn } from "~/lib/utils";
import { motion } from "motion/react";

interface FooterProps {
  className?: string;
}

export default function Footer({ className }: FooterProps) {
  const [scrollProgress, setScrollProgress] = React.useState(0);

  React.useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      setScrollProgress(Math.min(1, Math.max(0, progress)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const baseHeight = 500;
  const extra = Math.round(100 * scrollProgress);
  const height = baseHeight + extra;

  return (
    <footer
      className={cn(
        "bg-primary-foreground relative w-full overflow-hidden",
        className,
      )}
      aria-label="Site footer"
    >
      <motion.div
        initial={false}
        animate={{ height }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        className="mx-auto w-full max-w-6xl px-6"
      >
        <div className="grid gap-8 py-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="text-primary text-2xl font-bold">Butter.</div>
            <p className="text-muted-foreground mt-2 text-sm">
              Built for teams of today, like yours. Learn, mentor, and grow in
              one place.
            </p>

            <div className="text-muted-foreground mt-6 flex items-center gap-3">
              <a
                aria-label="Twitter"
                href="#"
                className="hover:text-primary/80"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a aria-label="GitHub" href="#" className="hover:text-primary/80">
                <Github className="h-4 w-4" />
              </a>
              <a
                aria-label="LinkedIn"
                href="#"
                className="hover:text-primary/80"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="md:col-span-8">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:border-primary/15 md:border-l md:px-6">
                <FooterCol
                  title="Benefits"
                  items={[
                    "Health insurance",
                    "Retirement",
                    "Life Assurance",
                    "Bring Your Own",
                  ]}
                />
              </div>
              <div className="md:border-primary/15 md:border-l md:px-6">
                <FooterCol
                  title="Solutions"
                  items={["Startups", "Mid-sized", "Developers"]}
                />
              </div>
              <div className="md:border-primary/15 md:border-l md:px-6">
                <FooterCol
                  title="Resources"
                  items={[
                    "Blog",
                    "Help centre",
                    "Security",
                    "Careers",
                    "Cost Calculator",
                    "Become a partner",
                  ]}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t pt-6">
          <div className="text-foreground text-sm font-semibold tracking-wide">
            Our Blog
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
            {["PARTNERSHIPS", "PRODUCT", "MEET THE TEAM", "COMPANY NEWS"].map(
              (tag) => (
                <span
                  key={tag}
                  className="border-primary/30 bg-primary/10 text-primary rounded-full border px-2.5 py-1"
                >
                  {tag}
                </span>
              ),
            )}
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <BlogCard
              title="Kota raise €5M Seed led by EQT Ventures"
              desc="A quick look at our next phase of growth and what it means for teams."
            />
            <BlogCard
              title="Life Assurance is now available on Kota"
              desc="Rolling out new benefits across India — learn what's included."
            />
          </div>
        </div>

        <div className="text-muted-foreground mt-6 border-t py-6 text-xs">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              © {new Date().getFullYear()} Butter.. Built with love from India.
            </div>
            <div className="flex gap-3">
              <a href="#" className="hover:text-foreground">
                Terms of Service
              </a>
              <a href="#" className="hover:text-foreground">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-foreground">
                Regulatory
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}

function FooterCol(props: { title: string; items: string[] }) {
  return (
    <div>
      <div className="text-foreground text-sm font-semibold tracking-wide">
        {props.title}
      </div>
      <ul className="text-muted-foreground mt-3 space-y-2 text-sm">
        {props.items.map((item) => (
          <li key={item}>
            <a
              href="#"
              className="hover:text-primary/80 transition-all duration-300"
            >
              {item}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function BlogCard(props: { title: string; desc: string }) {
  return (
    <a className="group bg-card/50 hover:bg-card block rounded-xl border p-3 transition-colors">
      <div className="text-foreground group-hover:text-primary text-sm font-medium">
        {props.title}
      </div>
      <div className="text-muted-foreground mt-1 text-[12px]">{props.desc}</div>
    </a>
  );
}
