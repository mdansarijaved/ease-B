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

export default function AboutStep() {
  const form = useFormContext<userProfileFormSchemaType>();
  return (
    <div>
      <FormField
        control={form.control}
        name="about"
        render={({ field }) => (
          <FormItem>
            <FormLabel>About</FormLabel>
            <FormDescription>
              A short bio about you and what you mentor in
            </FormDescription>
            <FormControl>
              <textarea
                rows={6}
                placeholder="Tell us about yourself..."
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
