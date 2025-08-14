import { Database, GraduationCap, PenTool } from "lucide-react";
import { motion } from "motion/react";

export default function InfoAside() {
  return (
    <motion.aside
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-4 md:sticky md:top-6"
    >
      <div className="rounded border bg-card p-4">
        <div className="mb-2 text-sm font-medium">Why join?</div>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <GraduationCap className="mt-0.5 h-4 w-4 text-primary" />
            Personalized mentor matches
          </li>
          <li className="flex items-start gap-2">
            <PenTool className="mt-0.5 h-4 w-4 text-primary" />
            Build a rich, searchable profile
          </li>
          <li className="flex items-start gap-2">
            <Database className="mt-0.5 h-4 w-4 text-primary" />
            Keep your data private by default
          </li>
        </ul>
      </div>
      <div className="rounded border bg-card p-4">
        <div className="mb-1 text-sm font-medium">Quick facts</div>
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="rounded border p-2">
            <div className="font-semibold">3 min</div>
            <div className="mt-0.5 text-muted-foreground">to complete</div>
          </div>
          <div className="rounded border p-2">
            <div className="font-semibold">Free</div>
            <div className="mt-0.5 text-muted-foreground">to join</div>
          </div>
          <div className="rounded border p-2">
            <div className="font-semibold">100%</div>
            <div className="mt-0.5 text-muted-foreground">control</div>
          </div>
        </div>
      </div>
      <div className="rounded border bg-card p-4">
        <div className="text-sm font-medium">Need help?</div>
        <p className="mt-1 text-xs text-muted-foreground">
          You can always change your details later from your profile settings.
        </p>
      </div>
    </motion.aside>
  );
}
