"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Switch } from "~/components/ui/switch";
import { Plus, Copy, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Separator } from "~/components/ui/separator";

type TimeInterval = { start: string; end: string };
type Availability = Record<string, TimeInterval[]>;

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function AvailabilityPage() {
  const [availability, setAvailability] = useState<Availability>({
    Monday: [{ start: "10:00", end: "12:00" }],
    Wednesday: [
      { start: "09:00", end: "11:00" },
      { start: "14:00", end: "16:00" },
    ],
    Friday: [{ start: "13:00", end: "17:00" }],
  });

  const handleDayToggle = (day: string, checked: boolean) => {
    setAvailability((prev) => {
      const newAvail = { ...prev };
      if (!checked) {
        delete newAvail[day];
      } else if (!newAvail[day]) {
        newAvail[day] = [];
      }
      return newAvail;
    });
  };

  const handleAddInterval = (day: string, interval: TimeInterval) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: [...(prev[day] ?? []), interval].sort((a, b) =>
        a.start.localeCompare(b.start),
      ),
    }));
  };

  const handleRemoveInterval = (
    day: string,
    intervalToRemove: TimeInterval,
  ) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: prev[day]?.filter((i) => i !== intervalToRemove),
    }));
  };

  const handleCopyTo = (fromDay: string, toDay: string) => {
    setAvailability((prev) => ({
      ...prev,
      [toDay]: prev[fromDay] ? [...prev[fromDay]] : [],
    }));
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 py-10">
      <h1 className="text-4xl font-bold">Availability</h1>
      <Card>
        <CardHeader>
          <CardTitle>Set Your Weekly Hours</CardTitle>
          <CardDescription>
            Define your recurring availability. Clients will be able to book you
            during these hours.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            {daysOfWeek.map((day) => (
              <DayRow
                key={day}
                day={day}
                intervals={availability[day] ?? []}
                isAvailable={day in availability}
                onToggle={(checked) => handleDayToggle(day, checked)}
                onAddInterval={(interval) => handleAddInterval(day, interval)}
                onRemoveInterval={(interval) =>
                  handleRemoveInterval(day, interval)
                }
                onCopyTo={(toDay) => handleCopyTo(day, toDay)}
              />
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button>Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

function DayRow({
  day,
  intervals,
  isAvailable,
  onToggle,
  onAddInterval,
  onRemoveInterval,
  onCopyTo,
}: {
  day: string;
  intervals: TimeInterval[];
  isAvailable: boolean;
  onToggle: (checked: boolean) => void;
  onAddInterval: (interval: TimeInterval) => void;
  onRemoveInterval: (interval: TimeInterval) => void;
  onCopyTo: (toDay: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleAdd = () => {
    if (startTime && endTime && startTime < endTime) {
      onAddInterval({ start: startTime, end: endTime });
      setStartTime("");
      setEndTime("");
      setIsEditing(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4">
        <Switch id={day} checked={isAvailable} onCheckedChange={onToggle} />
        <label htmlFor={day} className="w-24 font-medium">
          {day}
        </label>
        {isAvailable ? (
          <div className="flex flex-wrap items-center gap-2">
            {intervals.map((interval, index) => (
              <motion.div
                key={index}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="bg-muted flex items-center gap-2 rounded-md px-3 py-1.5 text-sm"
              >
                <span>
                  {interval.start} - {interval.end}
                </span>
                <button
                  onClick={() => onRemoveInterval(interval)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              </motion.div>
            ))}
            <AnimatePresence>
              {isEditing && (
                <motion.div
                  layout
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="flex items-center gap-2"
                >
                  <Input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="h-9 w-[120px]"
                  />
                  <span>-</span>
                  <Input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="h-9 w-[120px]"
                  />
                  <Button size="sm" onClick={handleAdd}>
                    Add
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setIsEditing(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
            {!isEditing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Plus className="mr-2 h-4 w-4" /> Add
              </Button>
            )}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">Unavailable</p>
        )}
        <div className="ml-auto flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!isAvailable}>
                <Copy className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {daysOfWeek
                .filter((d) => d !== day)
                .map((toDay) => (
                  <DropdownMenuItem key={toDay} onClick={() => onCopyTo(toDay)}>
                    Copy to {toDay}
                  </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <Separator className="mt-4" />
    </div>
  );
}
