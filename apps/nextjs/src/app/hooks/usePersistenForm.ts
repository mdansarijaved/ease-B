import type { ZodType } from "zod/v4";
import { useEffect } from "react";
import { FieldValues } from "react-hook-form";

import { useForm } from "@acme/ui/form";

export const usePersistedForm = <
  TOut extends FieldValues,
  TIn extends FieldValues,
>(
  formKey: string,
  schema: ZodType<TOut, TIn>,
  defaultValues = {},
) => {
  const form = useForm({ schema, defaultValues });
  const { watch, setValue, reset } = form;

  const watchedValues = watch();

  useEffect(() => {
    const savedData = localStorage.getItem(formKey);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData) as Record<string, unknown>;
        Object.keys(parsedData).forEach((key) => {
          if (parsedData[key] !== undefined) {
            // @ts-expect-error whatever
            setValue(key, parsedData[key]);
          }
        });
      } catch (error) {
        console.error("Error loading persisted form data:", error);
      }
    }
  }, [formKey, setValue]);

  useEffect(() => {
    localStorage.setItem(formKey, JSON.stringify(watchedValues));
  }, [watchedValues, formKey]);

  const clearPersistedData = () => {
    localStorage.removeItem(formKey);
    reset(defaultValues);
  };

  return {
    ...form,
    clearPersistedData,
  };
};
