import { useFormContext } from "react-hook-form";

import type { userProfileFormSchemaType } from "@acme/validators";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@acme/ui/form";

export default function ExperienceStep() {
  const form = useFormContext<userProfileFormSchemaType>();
  return (
    <div>
      <FormField
        control={form.control}
        name="experience"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Experience summary</FormLabel>
            <FormDescription>
              Briefly describe your professional experience (roles, projects,
              accomplishments)
            </FormDescription>
            <FormControl>
              <textarea
                rows={6}
                placeholder="Share a concise summary of your experience..."
                className="min-h-[140px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
