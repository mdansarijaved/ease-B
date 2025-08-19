import React from "react";
import { useFormContext } from "react-hook-form";

import type { userProfileFormSchemaType } from "@acme/validators";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@acme/ui/form";
import { Textarea } from "@acme/ui/textarea";

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
              <Textarea {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

export default BasicInformationForm;
