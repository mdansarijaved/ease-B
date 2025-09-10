import React from "react";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { Button } from "~/components/ui/button";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
const communityCourse = [
  {
    name: "AI & Machine Learning",
    type: "Career",
    image: "/community.jpg",
    author: "John Doe",
    description: "AI & Machine Learning",
    totalMembers: 100,
  },
  {
    name: "Blockchain",
    type: "Career",
    image: "/community.jpg",
    author: "John Doe",
    description: "Blockchain",
    totalMembers: 100,
  },
  {
    name: "Data Science",
    type: "Career",
    image: "/community.jpg",
    author: "John Doe",
    description: "Data Science",
    totalMembers: 100,
  },
  {
    name: "DevOps",
    type: "Career",
    image: "/community.jpg",
    author: "John Doe",
    description: "DevOps",
    totalMembers: 100,
  },
  {
    name: "Frontend Development",
    type: "Career",
    image: "/community.jpg",
    author: "John Doe",
    description: "Frontend Development",
    totalMembers: 100,
  },
  {
    name: "Full Stack Development",
    type: "Career",
    image: "/community.jpg",
    author: "John Doe",
    description: "Full Stack Development",
    totalMembers: 100,
  },
  {
    name: "Backend Development",
    type: "Career",
    image: "/community.jpg",
    author: "John Doe",
    description: "Backend Development",
    totalMembers: 100,
  },
  {
    name: "Mobile Development",
    type: "Career",
    image: "/community.jpg",
    author: "John Doe",
    description: "Mobile Development",
    totalMembers: 100,
  },
  {
    name: "Product Management",
    type: "Career",
    image: "/community.jpg",
    author: "John Doe",
    description: "Product Management",
    totalMembers: 100,
  },
  {
    name: "Project Management",
    type: "Career",
    image: "/community.jpg",
    author: "John Doe",
    description: "Project Management",
    totalMembers: 100,
  },
  {
    name: "Sales",
    type: "Career",
    image: "/community.jpg",
    author: "John Doe",
    description: "Sales",
    totalMembers: 100,
  },
  {
    name: "Supply Chain",
    type: "Career",
    image: "/community.jpg",
    author: "John Doe",
    description: "Supply Chain",
    totalMembers: 100,
  },
  {
    name: "UI/UX Design",
    type: "Career",
    image: "/community.jpg",
    author: "john doe",
    description: "UI/UX Design",
    totalMembers: 100,
  },
  {
    name: "Web Development",
    type: "Career",
    image: "/community.jpg",
    author: "John Doe",
    description: "Web Development",
    totalMembers: 100,
  },
  {
    name: "Others",
    type: "Career",
    image: "/community.jpg",
    author: "John Doe",
    description: "Others",
    totalMembers: 100,
  },
];

function CommunityPage() {
  const communityTypes = [
    "All",
    "Career",
    "Consulting",
    "Content",
    "Cybersecurity",
    "Data & AI",
    "Design",
    "Finance",
    "HR",
    "Law",
    "Marketing",
    "Mental Health",
    "Product",
    "Software",
    "Study Abroad",
    "Best Selling",
    "Supply Chain",
    "Others",
  ];

  return (
    <div>
      <div className="container mx-auto w-full py-4">
        <ScrollArea className="mx-auto w-[1200px] whitespace-nowrap">
          <div className="flex w-max gap-2">
            {communityTypes.map((type) => (
              <Button key={type} variant="outline">
                {type}
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
      <div className="container mx-auto grid w-full grid-cols-4 gap-4 py-10">
        {communityCourse.map((community) => (
          <CommunityCard key={community.name} community={community} />
        ))}
      </div>
    </div>
  );
}

const CommunityCard = ({
  community,
}: {
  community: (typeof communityCourse)[0];
}) => {
  return (
    <Card className="gap-2 overflow-clip rounded-lg py-0 pb-4">
      <CardHeader className="overflow-clip object-cover px-0">
        <Image
          src={community.image}
          alt={community.name}
          width={300}
          height={300}
          className="h-full w-full"
        />
      </CardHeader>
      <CardContent className="px-3">
        <h3 className="text-lg font-semibold">{community.name}</h3>
        <p className="text-muted-foreground line-clamp-1 text-sm">
          {community.description}
        </p>
        <p className="text-muted-foreground text-xs">by. {community.author}</p>
        <p className="text-muted-foreground flex items-center gap-2 text-xs">
          <Users className="text-primary h-3 w-3" strokeWidth={3} />
          {community.totalMembers} members
        </p>
        <Button variant="default" className="mt-2 w-full">
          Join
        </Button>
      </CardContent>
    </Card>
  );
};

export default CommunityPage;
