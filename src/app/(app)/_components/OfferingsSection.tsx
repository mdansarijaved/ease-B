"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Plus, Minus } from "lucide-react";
import { cn } from "~/lib/utils";

const offerings = [
  {
    id: "item-1",
    title: "Offer 1:1 Sessions",
    content:
      "Provide personalized mentorship, consultations, and discovery calls. We handle the scheduling and payments, so you can focus on what you do best.",
  },
  {
    id: "item-2",
    title: "Setup Priority DM in Seconds",
    content:
      "Offer exclusive access to your direct messages for students who need quick advice or support, creating a valuable and direct line of communication.",
  },
  {
    id: "item-3",
    title: "Host Engaging Webinars",
    content:
      "Share your expertise with a larger audience by hosting live webinars. Easily manage registrations, reminders, and follow-ups through our platform.",
  },
  {
    id: "item-4",
    title: "Bundle Your Services",
    content:
      "Create attractive packages by bundling multiple services like 1:1 sessions, priority DMs, and webinars to offer more value to your students.",
  },
  {
    id: "item-5",
    title: "Sell Courses & Digital Products",
    content:
      "Monetize your knowledge by selling pre-recorded courses, e-books, and other digital products directly through your EasyWeasy page.",
  },
];

const BookingCard = () => (
  <Card className="mx-auto w-full max-w-sm shadow-lg">
    <CardContent className="p-6">
      <div className="flex items-center gap-4">
        <Image
          src="/join.jpg"
          alt="Mentor"
          width={48}
          height={48}
          className="rounded-full"
        />
        <div>
          <h3 className="text-foreground font-bold">Book Session</h3>
          <p className="text-muted-foreground text-sm">Select a date & time</p>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-4 gap-2 text-center text-sm">
        <div>
          <p className="text-muted-foreground text-xs">Fri</p>
          <p>29</p>
        </div>
        <div className="bg-primary text-primary-foreground rounded-lg p-2">
          <p className="text-xs">Sat</p>
          <p>30</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Sun</p>
          <p>31</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Mon</p>
          <p>01</p>
        </div>
      </div>
      <div className="bg-muted/50 mt-6 h-24 rounded-lg"></div>
      <div className="bg-muted/50 mt-6 flex items-center justify-between rounded-lg p-4">
        <div>
          <p className="text-muted-foreground text-xs">Next available</p>
          <p className="text-foreground font-semibold">07:00pm, Tue 29th</p>
        </div>
        <Button>Book</Button>
      </div>
    </CardContent>
  </Card>
);

const DMChatCard = () => (
  <Card className="mx-auto w-full max-w-sm shadow-lg">
    <CardContent className="p-6">
      <h3 className="text-foreground font-bold">Priority DM</h3>
      <p className="text-muted-foreground mb-4 text-sm">
        Direct access for your top students.
      </p>
      <div className="space-y-4">
        <div className="flex items-start gap-2">
          <Image
            src="/join.jpg"
            alt="Student"
            width={40}
            height={40}
            className="rounded-full"
          />
          <div className="bg-muted rounded-lg p-3 text-sm">
            <p>Hey! I have a quick question about our last session.</p>
          </div>
        </div>
        <div className="flex items-start justify-end gap-2">
          <div className="bg-primary text-primary-foreground rounded-lg p-3 text-sm">
            <p>Of course, ask away!</p>
          </div>
          <Image
            src="/join.jpg"
            alt="Mentor"
            width={40}
            height={40}
            className="rounded-full"
          />
        </div>
      </div>
    </CardContent>
  </Card>
);

const WebinarCard = () => (
  <Card className="mx-auto w-full max-w-sm shadow-lg">
    <CardContent className="p-6">
      <h3 className="text-foreground font-bold">Live Webinar</h3>
      <p className="text-muted-foreground mb-4 text-sm">
        Engage with your audience.
      </p>
      <div className="bg-muted flex aspect-video items-center justify-center rounded-lg">
        <p className="text-muted-foreground">Webinar Thumbnail</p>
      </div>
      <Button className="mt-4 w-full">Register Now</Button>
    </CardContent>
  </Card>
);

const BundleCard = () => (
  <Card className="mx-auto w-full max-w-sm shadow-lg">
    <CardContent className="p-6">
      <h3 className="text-foreground font-bold">Service Bundle</h3>
      <p className="text-muted-foreground mb-4 text-sm">Get the best value.</p>
      <div className="space-y-2">
        <div className="bg-muted flex items-center justify-between rounded-lg p-3">
          <p>1:1 Mentorship</p> <p className="font-bold">$100</p>
        </div>
        <div className="bg-muted flex items-center justify-between rounded-lg p-3">
          <p>Priority DM Access</p> <p className="font-bold">$50</p>
        </div>
        <div className="bg-muted flex items-center justify-between rounded-lg p-3">
          <p>Monthly Webinar</p> <p className="font-bold">$30</p>
        </div>
      </div>
      <Button className="mt-4 w-full">Purchase Bundle</Button>
    </CardContent>
  </Card>
);

const CourseCard = () => (
  <Card className="mx-auto w-full max-w-sm shadow-lg">
    <CardContent className="p-6">
      <h3 className="text-foreground font-bold">Digital Course</h3>
      <p className="text-muted-foreground mb-4 text-sm">
        Learn at your own pace.
      </p>
      <div className="bg-muted flex aspect-video items-center justify-center rounded-lg">
        <p className="text-muted-foreground">Course Preview</p>
      </div>
      <Button className="mt-4 w-full">Enroll Now</Button>
    </CardContent>
  </Card>
);

const cardComponents: { [key: string]: React.FC } = {
  "item-1": BookingCard,
  "item-2": DMChatCard,
  "item-3": WebinarCard,
  "item-4": BundleCard,
  "item-5": CourseCard,
};

export function OfferingsSection() {
  const [activeOffering, setActiveOffering] = useState("item-1");
  const ActiveCard = cardComponents[activeOffering];

  return (
    <section className="bg-background w-full py-24">
      <div className="container mx-auto grid grid-cols-1 items-center gap-16 md:grid-cols-2">
        <div className="bg-primary/10 flex h-[500px] items-center justify-center rounded-3xl p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeOffering}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {ActiveCard && <ActiveCard />}
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="flex flex-col gap-4">
          {offerings.map((offer, index) => (
            <div
              key={offer.id}
              onClick={() => setActiveOffering(offer.id)}
              className={cn(
                "cursor-pointer rounded-xl p-6 transition-all duration-300",
                activeOffering === offer.id
                  ? "bg-primary/10"
                  : "bg-muted/50 hover:bg-muted",
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-primary mr-4 font-bold">
                    0{index + 1}
                  </span>
                  <span className="text-lg font-semibold">{offer.title}</span>
                </div>
                {activeOffering === offer.id ? (
                  <Minus className="text-primary h-6 w-6" />
                ) : (
                  <Plus className="h-6 w-6" />
                )}
              </div>
              <AnimatePresence>
                {activeOffering === offer.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                    animate={{ height: "auto", opacity: 1, marginTop: "1rem" }}
                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="text-muted-foreground pl-10">
                      {offer.content}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
