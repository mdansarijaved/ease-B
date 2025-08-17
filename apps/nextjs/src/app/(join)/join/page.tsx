"use client";

import type { FieldPath } from "react-hook-form";
import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import type { Step } from "@acme/validators";
import { finalUserSchema } from "@acme/db/schema";
import { Button } from "@acme/ui/button";
import { Form, useForm } from "@acme/ui/form";

import { authClient } from "~/auth/client";
import AboutStep from "./_components/About";
import BasicInformationForm from "./_components/BasicInformationForm";
import EducationStep from "./_components/EducationFrom";
import ExperienceStep from "./_components/ExperienceForm";
import InfoAside from "./_components/InfoAside";
import SkillsStep from "./_components/SkillStep";
import { Stepper } from "./_components/Steppper";

const steps: Step[] = [
  {
    key: "basicInformation",
    title: "Who are you?",
    description: "Choose your role",
  },
  { key: "about", title: "About you", description: "Tell us about yourself" },
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
  const { data: session } = authClient.useSession();

  const [current, setCurrent] = useState(0);

  const formValues = useMemo(
    () => ({
      basicInformation: {
        name: session?.user.name ?? "",
        image: session?.user.image ?? "",
        email: session?.user.email ?? "",
        phone: "",
        country: "",
      },
      about: "",
      skills: [],
      education: [],
      experience: "",
      languages: [],
    }),
    [session],
  );

  const form = useForm({
    schema: finalUserSchema,
    values: formValues,

    mode: "onChange",
  });

  const stepFields: FieldPath<typeof finalUserSchema>[][] = [
    ["basicInformation"],
    ["about"],
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

    if (valid) setCurrent((s) => Math.min(s + 1, steps.length - 1));
  };

  const goBack = () => setCurrent((s) => Math.max(s - 1, 0));

  const onSubmit = (values: typeof finalUserSchema) => {
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
                    key: "basicInformation",
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
                      {current === 0 && <BasicInformationForm />}
                      {current === 1 && <AboutStep />}
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
export default JoinPage;

/**
 *
 * {
    "basicInformation": {
        "name": "Md Ansari",
        "image": "https://lh3.googleusercontent.com/a/ACg8ocJWBV-9EPMdLVUZRhPCKChAoSKzEJnaiuk4udew0V2CuqUGsg=s96-c",
        "email": "javedans2003@gmail.com",
        "phone": "08298342254",
        "country": "India"
    },
    "about": "sfgafg",
    "skills": [
        "adf"
    ],
    "education": [
        {
            "degree": "something",
            "institution": "standford university",
            "year": "2025",
            "active": false
        }
    ],
    "experience": "adfasdf",
    "languages": [
        "adf"
    ]
}
 */
