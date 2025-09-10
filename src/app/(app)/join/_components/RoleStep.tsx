import Image from "next/image";
import React from "react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import type { userProfileFormSchemaType } from "~/vlidators";
import { cn } from "~/lib/utils";

function RoleStep() {
  const form = useFormContext<userProfileFormSchemaType>();

  return (
    <div className="">
      <FormField
        control={form.control}
        name="role"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Choose your role.</FormLabel>
            <FormControl>
              <div className="grid h-full w-full grid-cols-2 gap-4 p-5">
                <label
                  htmlFor="student"
                  className={cn(
                    "hover:border-primary/50 relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 p-6 transition-all duration-200",
                    field.value === "student"
                      ? "border-primary bg-primary/5 ring-primary/20 ring-2"
                      : "border-gray-200 hover:bg-gray-50",
                  )}
                >
                  <Image
                    src={"/graduated.png"}
                    alt="Student Role"
                    width={150}
                    height={150}
                    className={cn(
                      "transition-all duration-200",
                      field.value === "student" ? "scale-105" : "",
                    )}
                  />
                  <p
                    className={cn(
                      "text-2xl font-bold transition-colors duration-200",
                      field.value === "student"
                        ? "text-primary"
                        : "text-gray-700",
                    )}
                  >
                    Student
                  </p>
                  {field.value === "student" && (
                    <div className="bg-primary absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full">
                      <svg
                        className="h-4 w-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                  <input
                    type="radio"
                    id="student"
                    name={field.name}
                    value="student"
                    checked={field.value === "student"}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                    }}
                    className="sr-only"
                  />
                </label>

                <label
                  htmlFor="mentor"
                  className={cn(
                    "hover:border-primary/50 relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 p-6 transition-all duration-200",
                    field.value === "mentor"
                      ? "border-primary bg-primary/5 ring-primary/20 ring-2"
                      : "border-gray-200 hover:bg-gray-50",
                  )}
                >
                  <Image
                    src={"/person.png"}
                    alt="Professional Role"
                    width={150}
                    height={150}
                    className={cn(
                      "transition-all duration-200",
                      field.value === "mentor" ? "scale-105" : "",
                    )}
                  />
                  <p
                    className={cn(
                      "text-2xl font-bold transition-colors duration-200",
                      field.value === "mentor"
                        ? "text-primary"
                        : "text-gray-700",
                    )}
                  >
                    Professional
                  </p>
                  {field.value === "mentor" && (
                    <div className="bg-primary absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full">
                      <svg
                        className="h-4 w-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                  <input
                    type="radio"
                    id="mentor"
                    name={field.name}
                    value="mentor"
                    checked={field.value === "mentor"}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                    }}
                    className="sr-only"
                  />
                </label>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

export default RoleStep;
