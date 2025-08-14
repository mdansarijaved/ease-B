import { useState } from "react";
import { useFormContext } from "react-hook-form";

import type { userProfileFormSchemaType } from "@acme/validators";
import { Button } from "@acme/ui/button";
import {
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@acme/ui/form";
import { Input } from "@acme/ui/input";
import { Label } from "@acme/ui/label";

export default function SkillsStep() {
  const form = useFormContext<userProfileFormSchemaType>();
  const [skillInput, setSkillInput] = useState("");
  const [languageInput, setLanguageInput] = useState("");

  const skills = form.watch("skills");
  const languages = form.watch("languages");

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

  const addLanguage = () => {
    const s = languageInput.trim();
    if (!s) return;
    if (languages.includes(s)) return;
    form.setValue("languages", [...languages, s], {
      shouldValidate: true,
      shouldDirty: true,
    });
    setLanguageInput("");
  };

  const removeLanguage = (s: string) => {
    form.setValue(
      "languages",
      languages.filter((x) => x !== s),
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

      <div className="mt-6 space-y-2">
        <Label>Languages</Label>
        <div className="flex gap-2">
          <Input
            placeholder="e.g. English, Hindi"
            value={languageInput}
            onChange={(e) => setLanguageInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addLanguage();
              }
            }}
          />
          <Button type="button" onClick={addLanguage}>
            Add
          </Button>
        </div>
        {languages.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {languages.map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm text-primary"
              >
                {s}
                <button
                  type="button"
                  onClick={() => removeLanguage(s)}
                  className="text-primary/70 hover:text-primary"
                  aria-label={`Remove ${s}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
