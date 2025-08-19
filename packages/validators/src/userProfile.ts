import { z } from "zod/v4";

export interface Step {
  key: "bio" | "skills" | "education" | "experience";
  title: string;
  description: string;
}

export const skillsSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().min(2).max(2000),
});

export const userSkillSchema = z.object({
  skill: skillsSchema,
  proficiencyLevel: z.enum(["beginner", "intermediate", "advanced", "expert"]),
});

export const educationSchema = z.object({
  institution: z.string().min(2).max(100),
  degree: z.string().min(2).max(100),
  active: z.boolean(),
  description: z.string().min(2).max(2000),
  startYear: z.date(),
  endYear: z.date().optional(),
});

export const experienceSchema = z.object({
  company: z.string().min(2).max(100),
  position: z.string().min(2).max(100),
  current: z.boolean(),
  description: z.string().min(2).max(2000),
  startDate: z.date(),
  endDate: z.date().optional(),
});

export const userProfileFormSchema = z.object({
  bio: z.string().min(100).max(2000),
  skills: userSkillSchema.array().min(1).max(10),
  education: educationSchema.array().min(1).max(10),
  experience: experienceSchema.array().min(1).max(10),
});

export type userProfileFormSchemaType = z.infer<typeof userProfileFormSchema>;
