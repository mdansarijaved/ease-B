"use client";

import type { FieldPath } from "react-hook-form";
import React, { useMemo, useState } from "react";
import {
  Briefcase,
  ClipboardList,
  Database,
  GraduationCap,
  MoreHorizontal,
  PenTool,
  UserCog,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useFormContext } from "react-hook-form";
import { z } from "zod/v4";

import { cn } from "@acme/ui";
import { Button } from "@acme/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFieldArray,
  useForm,
} from "@acme/ui/form";
import { Input } from "@acme/ui/input";

type Role = "student" | "mentor";
interface Step {
  key: "role" | "profession" | "skills" | "education" | "experience";
  title: string;
  description: string;
}

const educationSchema = z.object({
  degree: z.string().min(2, "Degree is required"),
  institution: z.string().min(2, "Institution is required"),
  graduationYear: z
    .string()
    .min(4, "Year is required")
    .regex(/^\d{4}$/g, "Enter a valid year"),
});

const experienceItemSchema = z.object({
  company: z.string().min(2, "Company is required"),
  role: z.string().min(2, "Role is required"),
  startYear: z
    .string()
    .min(4, "Start year is required")
    .regex(/^\d{4}$/g, "Enter a valid year"),
  endYear: z
    .string()
    .min(4, "End year is required")
    .regex(/^\d{4}$/g, "Enter a valid year"),
});

const formSchema = z
  .object({
    role: z.enum(["student", "mentor"], "Please select a role"),
    profession: z.string().min(2, "Please select your profession"),
    professionOther: z.string().optional(),
    skills: z
      .array(z.string().min(1))
      .min(1, "Add at least one skill")
      .max(20, "Too many skills"),
    education: educationSchema,
    achievements: z.string().max(1000).optional().or(z.literal("")),
    experience: z.array(experienceItemSchema).min(0).max(10),
  })
  .superRefine((val, ctx) => {
    if (
      val.profession === "Other" &&
      (!val.professionOther || val.professionOther.trim().length < 2)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["professionOther"],
        message: "Please specify your profession",
      });
    }
  });

type FormValues = z.infer<typeof formSchema>;

const steps: Step[] = [
  { key: "role", title: "Who are you?", description: "Choose your role" },
  {
    key: "profession",
    title: "Your profession",
    description: "Select what best describes you",
  },
  {
    key: "skills",
    title: "Your skills",
    description: "Tell us what you are good at",
  },
  {
    key: "education",
    title: "Education & achievements",
    description: "Your academic journey",
  },
  {
    key: "experience",
    title: "Experience",
    description: "Work history or projects",
  },
];

function JoinPage() {
  const form = useForm<FormValues, FormValues>({
    schema: formSchema,
    defaultValues: {
      role: undefined as unknown as Role,
      profession: "",
      professionOther: "",
      skills: [],
      education: { degree: "", institution: "", graduationYear: "" },
      achievements: "",
      experience: [],
    },
    mode: "onChange",
  });

  const [current, setCurrent] = useState(0);

  const stepFields: FieldPath<FormValues>[][] = [
    ["role"],
    ["profession", "professionOther"],
    ["skills"],
    [
      "education.degree",
      "education.institution",
      "education.graduationYear",
      "achievements",
    ],
    ["experience"],
  ];

  const progress = useMemo(
    () => ((current + 1) / steps.length) * 100,
    [current],
  );

  const goNext = async () => {
    const valid = await form.trigger(stepFields[current]);
    if (valid) setCurrent((s) => Math.min(s + 1, steps.length - 1));
  };

  const goBack = () => setCurrent((s) => Math.max(s - 1, 0));

  const onSubmit = (values: FormValues) => {
    // TODO: Hook this to your backend
    // For now just log
    console.log("Join submission", values);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-white to-secondary/40">
      <div className="container mx-auto max-w-6xl px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Create your profile
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Join the community, match with mentors, and showcase your journey.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="flex flex-col rounded-2xl border bg-card p-6 shadow-sm">
              <header className="mb-6">
                {(() => {
                  const step: Step = steps[current] ?? {
                    key: "role",
                    title: "Who are you?",
                    description: "Choose your role",
                  };
                  return (
                    <>
                      <div className="mb-4 flex items-center justify-between">
                        <h1 className="text-xl font-semibold text-foreground">
                          {step.title}
                        </h1>
                        <span className="text-sm text-muted-foreground">
                          Step {current + 1} of {steps.length}
                        </span>
                      </div>
                      <p className="mb-4 text-sm text-muted-foreground">
                        {step.description}
                      </p>
                      <Stepper current={current} />
                    </>
                  );
                })()}
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </header>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-1 flex-col"
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={current}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                    >
                      {current === 0 && <RoleStep />}
                      {current === 1 && <ProfessionStep />}
                      {current === 2 && <SkillsStep />}
                      {current === 3 && <EducationStep />}
                      {current === 4 && <ExperienceStep />}
                    </motion.div>
                  </AnimatePresence>

                  <div className="mt-6 flex items-center justify-between border-t pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={goBack}
                      disabled={current === 0}
                    >
                      Back
                    </Button>
                    {current < steps.length - 1 ? (
                      <Button type="button" onClick={goNext}>
                        Continue
                      </Button>
                    ) : (
                      <Button type="submit">Finish</Button>
                    )}
                  </div>
                </form>
              </Form>
            </div>
          </div>

          <InfoAside />
        </div>
      </div>
    </div>
  );
}

function Stepper(props: { current: number }) {
  const items: { key: Step["key"]; label: string; icon: React.ReactNode }[] = [
    { key: "role", label: "Role", icon: <UserCog className="h-3.5 w-3.5" /> },
    {
      key: "profession",
      label: "Profession",
      icon: <Briefcase className="h-3.5 w-3.5" />,
    },
    {
      key: "skills",
      label: "Skills",
      icon: <PenTool className="h-3.5 w-3.5" />,
    },
    {
      key: "education",
      label: "Education",
      icon: <GraduationCap className="h-3.5 w-3.5" />,
    },
    {
      key: "experience",
      label: "Experience",
      icon: <ClipboardList className="h-3.5 w-3.5" />,
    },
  ];
  return (
    <div className="mb-4 flex items-center gap-2 overflow-x-auto pb-1">
      {items.map((item, i) => {
        const isActive = i === props.current;
        const isDone = i < props.current;
        return (
          <div key={item.key} className="flex items-center gap-2">
            <div
              className={cn(
                "flex items-center gap-2 rounded-full border px-3 py-1 text-xs",
                isActive
                  ? "border-primary bg-primary/10 text-primary"
                  : isDone
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-input text-muted-foreground",
              )}
            >
              <span>{item.icon}</span>
              <span className="whitespace-nowrap">{item.label}</span>
            </div>
            {i < items.length - 1 && (
              <div
                className={cn(
                  "h-0.5 w-3",
                  isDone ? "bg-green-500" : "bg-muted",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function InfoAside() {
  return (
    <motion.aside
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-4 md:sticky md:top-6"
    >
      <div className="rounded-2xl border bg-card p-4">
        <div className="mb-2 text-sm font-medium">Why join?</div>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <GraduationCap className="mt-0.5 h-4 w-4 text-primary" />
            Personalized mentor matches
          </li>
          <li className="flex items-start gap-2">
            <PenTool className="mt-0.5 h-4 w-4 text-primary" />
            Build a rich, searchable profile
          </li>
          <li className="flex items-start gap-2">
            <Database className="mt-0.5 h-4 w-4 text-primary" />
            Keep your data private by default
          </li>
        </ul>
      </div>
      <div className="rounded-2xl border bg-card p-4">
        <div className="mb-1 text-sm font-medium">Quick facts</div>
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="rounded-lg border p-2">
            <div className="font-semibold">3 min</div>
            <div className="mt-0.5 text-muted-foreground">to complete</div>
          </div>
          <div className="rounded-lg border p-2">
            <div className="font-semibold">Free</div>
            <div className="mt-0.5 text-muted-foreground">to join</div>
          </div>
          <div className="rounded-lg border p-2">
            <div className="font-semibold">100%</div>
            <div className="mt-0.5 text-muted-foreground">control</div>
          </div>
        </div>
      </div>
      <div className="rounded-2xl border bg-card p-4">
        <div className="text-sm font-medium">Need help?</div>
        <p className="mt-1 text-xs text-muted-foreground">
          You can always change your details later from your profile settings.
        </p>
      </div>
    </motion.aside>
  );
}

function RoleStep() {
  const form = useFormContext<FormValues>();
  const currentRole = form.watch("role");

  const Card = ({
    value,
    title,
    desc,
  }: {
    value: Role;
    title: string;
    desc: string;
  }) => (
    <button
      type="button"
      onClick={() =>
        form.setValue("role", value, {
          shouldValidate: true,
          shouldDirty: true,
        })
      }
      className={cn(
        "group w-full rounded-xl border p-4 text-left transition-all hover:shadow-sm",
        currentRole === value
          ? "border-primary ring-2 ring-primary/30"
          : "border-input",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {value === "student" ? (
            <GraduationCap className="h-6 w-6 text-primary" />
          ) : (
            <UserCog className="h-6 w-6 text-primary" />
          )}
          <div>
            <div className="text-base font-medium">{title}</div>
            <div className="mt-1 text-sm text-muted-foreground">{desc}</div>
          </div>
        </div>
        <div
          className={cn(
            "size-4 rounded-full border",
            currentRole === value
              ? "border-primary bg-primary"
              : "border-input",
          )}
        />
      </div>
    </button>
  );

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <FormField
        control={form.control}
        name="role"
        render={() => (
          <FormItem className="col-span-full">
            <FormLabel>Select your role</FormLabel>
            <FormDescription>
              We personalize your experience based on this.
            </FormDescription>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Card
                value="student"
                title="Student"
                desc="Find mentors and grow faster"
              />
              <Card
                value="mentor"
                title="Mentor"
                desc="Share your expertise and guide others"
              />
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

function ProfessionStep() {
  const form = useFormContext<FormValues>();
  const profession = form.watch("profession");
  const options = [
    { label: "Software Engineer", icon: <PenTool className="h-5 w-5" /> },
    { label: "Data Scientist", icon: <Database className="h-5 w-5" /> },
    { label: "Product Manager", icon: <ClipboardList className="h-5 w-5" /> },
    { label: "Designer", icon: <PenTool className="h-5 w-5" /> },
    { label: "Other", icon: <MoreHorizontal className="h-5 w-5" /> },
  ];

  return (
    <div className="space-y-5">
      <FormField
        control={form.control}
        name="profession"
        render={() => (
          <FormItem>
            <FormLabel>Select your profession</FormLabel>
            <FormDescription>Pick the closest match.</FormDescription>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {options.map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() =>
                    form.setValue("profession", opt.label, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                  className={cn(
                    "flex items-center gap-3 rounded-xl border p-3 text-left transition-all hover:shadow-sm",
                    profession === opt.label
                      ? "border-primary ring-2 ring-primary/30"
                      : "border-input",
                  )}
                >
                  <span className="text-primary">{opt.icon}</span>
                  <span className="text-sm font-medium">{opt.label}</span>
                </button>
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      {profession === "Other" && (
        <FormField
          control={form.control}
          name="professionOther"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Specify your profession</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Researcher, Entrepreneur" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
}

function SkillsStep() {
  const form = useFormContext<FormValues>();
  const [skillInput, setSkillInput] = useState("");
  const skills = form.watch("skills");

  const addSkill = () => {
    const s = skillInput.trim();
    if (!s) return;
    if (skills.includes(s)) return;
    form.setValue("skills", [...skills, s], {
      shouldValidate: true,
      shouldDirty: true,
    });
    setSkillInput("");
  };

  const removeSkill = (s: string) => {
    form.setValue(
      "skills",
      skills.filter((x) => x !== s),
      { shouldValidate: true, shouldDirty: true },
    );
  };

  return (
    <div>
      <FormField
        control={form.control}
        name="skills"
        render={() => (
          <FormItem>
            <FormLabel>Add your skills</FormLabel>
            <FormDescription>
              Press Enter or click Add to save a skill.
            </FormDescription>
            <div className="flex gap-2">
              <Input
                placeholder="e.g. React, Data Science, UI/UX"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill();
                  }
                }}
              />
              <Button type="button" onClick={addSkill}>
                Add
              </Button>
            </div>
            {skills.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {skills.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm text-primary"
                  >
                    {s}
                    <button
                      type="button"
                      onClick={() => removeSkill(s)}
                      className="text-primary/70 hover:text-primary"
                      aria-label={`Remove ${s}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

function EducationStep() {
  const form = useFormContext<FormValues>();
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <FormField
        control={form.control}
        name="education.degree"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Degree</FormLabel>
            <FormControl>
              <Input placeholder="e.g. B.Sc Computer Science" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="education.institution"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Institution</FormLabel>
            <FormControl>
              <Input placeholder="e.g. Stanford University" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="education.graduationYear"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Graduation year</FormLabel>
            <FormControl>
              <Input inputMode="numeric" placeholder="e.g. 2025" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="achievements"
        render={({ field }) => (
          <FormItem className="sm:col-span-2">
            <FormLabel>Academic achievements</FormLabel>
            <FormDescription>
              Scholarships, awards, publications, etc.
            </FormDescription>
            <FormControl>
              <textarea
                rows={4}
                placeholder="Tell us about your notable achievements"
                className="min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
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

function ExperienceStep() {
  const form = useFormContext<FormValues>();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "experience",
  });

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <div className="text-sm font-medium">Add experience</div>
          <div className="text-xs text-muted-foreground">
            Internships, jobs, or significant projects
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            append({ company: "", role: "", startYear: "", endYear: "" })
          }
        >
          Add item
        </Button>
      </div>

      <div className="space-y-4">
        {fields.length === 0 && (
          <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
            No experience added yet.
          </div>
        )}

        {fields.map((field, idx) => (
          <div key={field.id} className="rounded-lg border p-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <FormField
                control={form.control}
                name={`experience.${idx}.company` as const}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Acme Inc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`experience.${idx}.role` as const}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Frontend Developer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`experience.${idx}.startYear` as const}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start year</FormLabel>
                    <FormControl>
                      <Input
                        inputMode="numeric"
                        placeholder="e.g. 2022"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`experience.${idx}.endYear` as const}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End year</FormLabel>
                    <FormControl>
                      <Input
                        inputMode="numeric"
                        placeholder="e.g. 2024"
                        {...field}
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

export default JoinPage;
