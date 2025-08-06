"use client";

import React, { useState } from "react";

import { Button } from "@acme/ui/button";

function JoinPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="h-[60vh] w-[60vw] rounded-xl border shadow">
        <div className="flex w-full justify-between px-6 py-2">
          {step !== 1 && (
            <Button onClick={() => setStep((step - 1) as 1 | 2 | 3)}>
              Back
            </Button>
          )}
          <Button onClick={() => setStep((step + 1) as 1 | 2 | 3)}>Next</Button>
        </div>
        {step === 1 && <StepOne />}
        {step === 2 && <StepTwo />}
        {step === 3 && <StepThree />}
      </div>
    </div>
  );
}

const StepOne = () => {
  return (
    <div className="h-full w-full">
      <h1>Step One</h1>
    </div>
  );
};

const StepTwo = () => {
  return (
    <div className="h-full w-full">
      <h1>Step Two</h1>
    </div>
  );
};

const StepThree = () => {
  return (
    <div className="h-full w-full">
      <h1>Step Three</h1>
    </div>
  );
};

export default JoinPage;
