import { Briefcase, GraduationCap, PenTool, UserCog } from "lucide-react";

import type { Step } from "@acme/validators";
import { cn } from "@acme/ui";

export function Stepper(props: { current: number }) {
  const items: { key: Step["key"]; label: string; icon: React.ReactNode }[] = [
    {
      key: "basicInformation",
      label: "Basic Information",
      icon: <UserCog className="h-3.5 w-3.5" />,
    },
    {
      key: "about",
      label: "About",
      icon: <UserCog className="h-3.5 w-3.5" />,
    },
    {
      key: "skills",
      label: "Skills",
      icon: <PenTool className="h-3.5 w-3.5" />,
    },
    {
      key: "education",
      label: "Education",
      icon: <GraduationCap className="h-3.5 w-3.5" />,
    },
    {
      key: "experience",
      label: "Experience",
      icon: <Briefcase className="h-3.5 w-3.5" />,
    },
  ];
  return (
    <div className="mb-4 flex items-center gap-2 overflow-x-auto pb-1">
      {items.map((item, i) => {
        const isActive = i === props.current;
        const isDone = i < props.current;
        return (
          <div key={item.key} className="flex items-center gap-2">
            <div
              className={cn(
                "flex items-center gap-2 rounded-full border px-3 py-1 text-xs",
                isActive
                  ? "border-primary bg-primary/10 text-primary"
                  : isDone
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-input text-muted-foreground",
              )}
            >
              <span>{item.icon}</span>
              <span className="whitespace-nowrap">{item.label}</span>
            </div>
            {i < items.length - 1 && (
              <div
                className={cn(
                  "h-0.5 w-3",
                  isDone ? "bg-green-500" : "bg-muted",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
