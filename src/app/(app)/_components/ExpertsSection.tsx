"use client";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import Image from "next/image";

const experts = [
  {
    name: "Kavach Khanna",
    title: "Mentor You Always Needed",
    image: "/join.jpg",
  },
  {
    name: "Prashant Verma",
    title: "Building World-Class Scrum Masters. One Spri...",
    image: "/join.jpg",
  },
  {
    name: "Abhishek Srivastava",
    title: "NOTE: If you're not prepared to confront som...",
    image: "/join.jpg",
  },
  {
    name: "Shreya Mehta",
    title: "Talent Acquisition / Recruiting/ HR /...",
    image: "/join.jpg",
  },
  {
    name: "Maveesh Velayudhan",
    title: "Education & Career Advisor",
    image: "/join.jpg",
  },
];

export function ExpertsSection() {
  return (
    <section className="min-h-screen w-full py-16">
      <div className="container mx-auto mt-20 grid h-full place-items-center">
        <div className="z-10 flex h-full w-full flex-col items-center justify-center gap-8 text-center">
          <h1 className="max-w-3xl text-7xl font-bold text-gray-800">
            The Go-To Platform for Experts
          </h1>
          <p className="max-w-2xl text-lg text-gray-600">
            Experts from every niche use Topmate to build trust, grow revenue,
            and stay booked.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button>Career</Button>
            <Button variant="outline">Consulting</Button>
            <Button variant="outline">Content</Button>
            <Button variant="outline">Cybersecurity</Button>
            <Button variant="outline">Data & AI</Button>
            <Button variant="outline">Design</Button>
            <Button variant="outline">Finance</Button>
            <Button variant="outline">HR</Button>
            <Button variant="outline">Law</Button>
            <Button variant="outline">Marketing</Button>
            <Button variant="outline">Mental Health</Button>
            <Button variant="outline">Product</Button>
            <Button variant="outline">Software</Button>
            <Button variant="outline">Study Abroad</Button>
            <Button variant="outline">Best Selling</Button>
            <Button variant="outline">Supply Chain</Button>
            <Button variant="outline">Others</Button>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-5">
            {experts.map((expert) => (
              <Card
                key={expert.name}
                className="bg-primary-foreground overflow-hidden py-0 text-neutral-700"
              >
                <CardHeader className="p-2">
                  <Image
                    src={expert.image}
                    alt={expert.name}
                    width={300}
                    height={300}
                    className="aspect-square w-full rounded-sm object-cover"
                  />
                </CardHeader>
                <CardContent className="pb-4">
                  <CardTitle className="line-clamp-1 text-lg font-semibold">
                    {expert.name}
                  </CardTitle>
                  <CardDescription className="line-clamp-1">
                    {expert.title}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
