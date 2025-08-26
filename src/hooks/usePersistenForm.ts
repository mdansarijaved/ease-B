import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

export const usePersistedForm = (
  formKey: string,
  schema: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  defaultValues = {},
) => {
  const form = useForm({ resolver: zodResolver(schema), defaultValues });
  const { watch, setValue, reset } = form;

  const watchedValues = watch(); // eslint-disable-line @typescript-eslint/no-unsafe-assignment

  useEffect(() => {
    const savedData = localStorage.getItem(formKey);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData) as Record<string, unknown>;
        Object.keys(parsedData).forEach((key) => {
          if (parsedData[key] !== undefined) {
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
