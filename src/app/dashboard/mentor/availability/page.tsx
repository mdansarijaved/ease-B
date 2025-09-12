"use client";

import { useState, useEffect } from "react";
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
import { Plus, Copy, X, Loader2, Save, CheckCircle } from "lucide-react";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { validateAndNormalizeTime } from "~/lib/utils";
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
  const [availability, setAvailability] = useState<Availability>({});
  const [hasChanges, setHasChanges] = useState(false);

  const {
    data: existingAvailability,
    isLoading,
    error,
  } = api.availability.getMyAvailability.useQuery();

  const utils = api.useUtils();
  const saveAvailabilityMutation =
    api.availability.saveWeeklyAvailability.useMutation({
      onSuccess: (data) => {
        if (data.mentorCreated) {
          toast.success(
            "🎉 Welcome to mentoring! Your profile and availability have been set up successfully!",
          );
        } else {
          toast.success(data.message);
        }
        setHasChanges(false);
        void utils.availability.getMyAvailability.invalidate();
      },
      onError: (error) => {
        toast.error(`Failed to save availability: ${error.message}`);
      },
    });

  useEffect(() => {
    if (existingAvailability) {
      setAvailability(existingAvailability as Availability);
      setHasChanges(false);
    }
  }, [existingAvailability]);

  const handleDayToggle = (day: string, checked: boolean) => {
    setAvailability((prev) => {
      const newAvail = { ...prev };
      if (!checked) {
        delete newAvail[day];
      } else {
        newAvail[day] ??= [];
      }
      setHasChanges(true);
      return newAvail;
    });
  };

  const handleAddInterval = (day: string, interval: TimeInterval) => {
    // Validate and normalize the interval data
    const normalizedStart = validateAndNormalizeTime(interval.start);
    const normalizedEnd = validateAndNormalizeTime(interval.end);

    console.log("Adding interval for", day, ":", {
      original: interval,
      normalized: { start: normalizedStart, end: normalizedEnd },
    });

    // Basic validation
    if (!normalizedStart || !normalizedEnd) {
      console.error("Invalid time format for interval:", interval);
      toast.error(
        "Please enter valid times in HH:MM format (e.g., 09:00, 14:30)",
      );
      return;
    }

    // Validate start time is before end time
    if (normalizedStart >= normalizedEnd) {
      console.error("Start time must be before end time");
      toast.error("Start time must be before end time");
      return;
    }

    const cleanInterval = {
      start: normalizedStart,
      end: normalizedEnd,
    };

    setAvailability((prev) => ({
      ...prev,
      [day]: [...(prev[day] ?? []), cleanInterval].sort((a, b) =>
        a.start.localeCompare(b.start),
      ),
    }));
    setHasChanges(true);
  };

  const handleRemoveInterval = (
    day: string,
    intervalToRemove: TimeInterval,
  ) => {
    setAvailability((prev) => {
      const newAvail = { ...prev };
      if (newAvail[day]) {
        newAvail[day] = newAvail[day].filter((i) => i !== intervalToRemove);
        if (newAvail[day].length === 0) {
          delete newAvail[day];
        }
      }
      return newAvail;
    });
    setHasChanges(true);
  };

  const handleCopyTo = (fromDay: string, toDay: string) => {
    const sourceIntervals = availability[fromDay] ?? [];
    console.log(
      "Copying intervals from",
      fromDay,
      "to",
      toDay,
      ":",
      sourceIntervals,
    );

    // Validate and normalize all intervals before copying
    const validIntervals = sourceIntervals
      .map((interval) => ({
        start: validateAndNormalizeTime(interval.start),
        end: validateAndNormalizeTime(interval.end),
      }))
      .filter((interval) => interval.start && interval.end);

    if (validIntervals.length !== sourceIntervals.length) {
      console.warn("Some intervals were invalid and not copied");
      toast.error("Some time slots had invalid formats and were not copied");
    }

    setAvailability((prev) => ({
      ...prev,
      [toDay]: validIntervals as TimeInterval[],
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    console.log("Saving availability data:", availability);

    // Validate and normalize all data before sending
    const validatedAvailability: Record<string, TimeInterval[]> = {};
    let hasInvalidTimes = false;

    Object.entries(availability).forEach(([day, intervals]) => {
      if (!intervals) return;

      const validIntervals = intervals
        .map((interval) => ({
          start: validateAndNormalizeTime(interval.start),
          end: validateAndNormalizeTime(interval.end),
        }))
        .filter((interval) => {
          if (!interval.start || !interval.end) {
            hasInvalidTimes = true;
            return false;
          }
          // Validate start time is before end time
          if (interval.start >= interval.end) {
            hasInvalidTimes = true;
            return false;
          }
          return true;
        }) as TimeInterval[];

      if (validIntervals.length > 0) {
        validatedAvailability[day] = validIntervals;
      }
    });

    if (hasInvalidTimes) {
      toast.error("Some time slots have invalid formats and will be skipped");
    }

    console.log("Validated availability data:", validatedAvailability);

    saveAvailabilityMutation.mutate({
      availability: validatedAvailability,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl space-y-8 py-10">
        <h1 className="text-4xl font-bold">Availability</h1>
        <Card>
          <CardContent className="py-12">
            <div className="flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading your availability...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-5xl space-y-8 py-10">
        <h1 className="text-4xl font-bold">Availability</h1>
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <p className="mb-4 text-red-600">
                Error loading availability: {error.message}
              </p>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">Availability</h1>
        {hasChanges && (
          <div className="flex items-center gap-2 text-sm text-orange-600">
            <span>You have unsaved changes</span>
          </div>
        )}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Set Your Weekly Hours</CardTitle>
          <CardDescription>
            Define your recurring availability. Students will be able to book
            you during these hours. All times are in your local timezone.
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
        <CardFooter className="flex items-center justify-between">
          <div className="text-muted-foreground text-sm">
            Timezone: {Intl.DateTimeFormat().resolvedOptions().timeZone}
          </div>
          <Button
            onClick={handleSave}
            disabled={!hasChanges || saveAvailabilityMutation.isPending}
            className="min-w-[120px]"
          >
            {saveAvailabilityMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : hasChanges ? (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Saved
              </>
            )}
          </Button>
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
