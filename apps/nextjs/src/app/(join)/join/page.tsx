"use client";

import type { FieldPath } from "react-hook-form";
import React, { useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { parseAsInteger, useQueryState } from "nuqs";

import type { Step, userProfileFormSchemaType } from "@acme/validators";
import { Button } from "@acme/ui/button";
import { Form } from "@acme/ui/form";
import { userProfileFormSchema } from "@acme/validators";

import { usePersistedForm } from "~/app/hooks/usePersistenForm";
import BasicInformationForm from "./_components/BasicInformationForm";
import EducationStep from "./_components/EducationFrom";
import ExperienceStep from "./_components/ExperienceForm";
import InfoAside from "./_components/InfoAside";
import SkillsStep from "./_components/SkillStep";
import { Stepper } from "./_components/Steppper";

const steps: Step[] = [
  {
    key: "bio",
    title: "Who are you?",
    description: "Choose your role",
  },
  {
    key: "skills",
    title: "Your skills",
    description: "Tell us what you are good at",
  },
  {
    key: "education",
    title: "Education",
    description: "Your academic journey",
  },
  {
    key: "experience",
    title: "Experience",
    description: "Summary of your experience",
  },
];

function JoinPage() {
  const [query, setQuery] = useQueryState("formStep", {
    defaultValue: "bio",
  });
  const [current, setCurrent] = useQueryState(
    "current",
    parseAsInteger.withDefault(0),
  );

  const form = usePersistedForm("userProfileForm", userProfileFormSchema, {
    bio: "",
    skills: [],
    education: [],
    experience: [],
  });

  const stepFields: FieldPath<userProfileFormSchemaType>[][] = [
    ["bio"],
    ["skills"],
    ["education"],
    ["experience"],
  ];

  const progress = useMemo(
    () => ((current + 1) / steps.length) * 100,
    [current],
  );

  const goNext = async () => {
    const valid = await form.trigger(stepFields[current]);

    if (valid) await setCurrent((s) => Math.min(s + 1, steps.length - 1));

    await setQuery(stepFields[current + 1]?.[0] ?? "");
  };

  const goBack = async () => {
    await setCurrent((s) => Math.max(s - 1, 0));
    await setQuery(stepFields[current - 1]?.[0] ?? "");
  };

  const onSubmit = (values: userProfileFormSchemaType) => {
    console.log("Join submission", values);
  };

  return (
    <div className="grid h-full place-items-center">
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
            <div className="flex flex-col rounded border bg-card p-6 shadow-sm">
              <header className="mb-6">
                {(() => {
                  const step: Step = steps[current] ?? {
                    key: "bio",
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
                      {query === "bio" && <BasicInformationForm />}
                      {query === "skills" && <SkillsStep />}
                      {query === "education" && <EducationStep />}
                      {query === "experience" && <ExperienceStep />}
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
export default JoinPage;
