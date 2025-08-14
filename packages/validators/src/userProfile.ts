import { z } from "zod/v4";

export interface Step {
  key: "basicInformation" | "about" | "skills" | "education" | "experience";
  title: string;
  description: string;
}

export const basicInformationFormSchema = z.object({
  name: z.string().min(1),
  image: z.string().min(1),
  email: z.email().min(1),
  phone: z.string().min(1),
  country: z.string().min(1),
});

export const educationItemSchema = z.object({
  degree: z.string().min(2, "Degree is required"),
  institution: z.string().min(2, "Institution is required"),
  year: z
    .string()
    .min(4, "Year is required")
    .regex(/^\d{4}$/g, "Enter a valid year"),
  active: z.boolean(),
});

export const experienceTextSchema = z
  .string()
  .max(10000, "Too long")
  .optional()
  .or(z.literal(""));

export const userProfileFormSchema = z.object({
  basicInformation: basicInformationFormSchema,
  about: z.string().max(2000).optional().or(z.literal("")),
  skills: z
    .array(z.string().min(1))
    .min(1, "Add at least one skill")
    .max(20, "Too many skills"),
  education: z.array(educationItemSchema).min(0).max(10),
  experience: experienceTextSchema,
  languages: z.array(z.string().min(1)).min(0).max(20),
});

export type BasicInformationFormSchemaType = z.infer<
  typeof basicInformationFormSchema
>;

export type userProfileFormSchemaType = z.infer<typeof userProfileFormSchema>;
