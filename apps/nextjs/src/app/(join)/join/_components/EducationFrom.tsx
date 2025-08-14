import { useFormContext } from "react-hook-form";

import type { userProfileFormSchemaType } from "@acme/validators";
import { Button } from "@acme/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFieldArray,
} from "@acme/ui/form";
import { Input } from "@acme/ui/input";

export default function EducationStep() {
  const form = useFormContext<userProfileFormSchemaType>();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "education",
  });

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <div className="text-sm font-medium">Add education</div>
          <div className="text-xs text-muted-foreground">Degrees</div>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            append({ degree: "", institution: "", year: "", active: true })
          }
        >
          Add item
        </Button>
      </div>

      <div className="space-y-4">
        {fields.length === 0 && (
          <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
            No education added yet.
          </div>
        )}

        {fields.map((field, idx) => (
          <div key={field.id} className="rounded border p-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <FormField
                control={form.control}
                name={`education.${idx}.degree` as const}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Degree</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. B.Sc Computer Science"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`education.${idx}.institution` as const}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Institution</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Stanford University"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`education.${idx}.year` as const}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <FormControl>
                      <Input
                        inputMode="numeric"
                        placeholder="e.g. 2025"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`education.${idx}.active` as const}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Active</FormLabel>
                    <FormControl>
                      <input
                        type="checkbox"
                        className="size-4 rounded border"
                        checked={!!field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mt-3 flex justify-end">
              <Button type="button" variant="ghost" onClick={() => remove(idx)}>
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
