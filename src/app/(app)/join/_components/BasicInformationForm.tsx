import React from "react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Textarea } from "~/components/ui/textarea";
import type { userProfileFormSchemaType } from "~/vlidators";

function BasicInformationForm() {
  const form = useFormContext<userProfileFormSchemaType>();

  return (
    <div>
      <p>Lets start by adding your basic information</p>

      <FormField
        control={form.control}
        name="bio"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tell us about yourself.</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                className={`${form.formState.errors.bio ? "border-red-500" : ""}`}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

export default BasicInformationForm;
