"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingWelcome } from "@/components/OnboardingWelcome";
import { OnboardingFeatures } from "@/components/OnboardingFeatures";
import { OnboardingRoleSelection } from "@/components/OnboardingRoleSelection";
import { OnboardingComplete } from "@/components/OnboardingComplete";
import { useApp } from "@/context/AppContext";
import { useAuthFetchWithBase } from "@/hooks/useAuthFetchWithBase";

type Step = "welcome" | "features" | "role" | "complete";

export default function OnboardingPage() {
  const [step, setStep] = useState<Step>("welcome");
  const router = useRouter();
  const { selectedRole, setSelectedRole } = useApp();
  const authFetch = useAuthFetchWithBase();

   const completeOnboarding = async () => {
    return authFetch('/auth/complete-onboarding', {
      method: 'POST',
    });
  };
  if (step === "welcome") return <OnboardingWelcome onNext={() => setStep("features")} />;
  if (step === "features") return <OnboardingFeatures onNext={() => setStep("role")} onBack={() => setStep("welcome")} />;
  if (step === "role")
    return (
      <OnboardingRoleSelection
        onSelectRole={(r) => {
          setSelectedRole(r);
          setStep("complete");
        }}
        onBack={() => setStep("features")}
      />
    );
  if (step === "complete" && selectedRole)
    return (
      <OnboardingComplete
        role={selectedRole}
        onComplete={() => {
          completeOnboarding()
          router.push("/home")
        }}
        onBack={() => setStep("role")}
      />
    );

  return null;
}
