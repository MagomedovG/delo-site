"use client";
import { Register } from "@/components/Register";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";

export default function RegisterPage() {
  const router = useRouter();
  const { setIsAuthenticated } = useApp();

  const handleRegister = (name: string, email: string, password: string) => {
    console.log("Register:", { name, email, password });
    setIsAuthenticated(true);
    router.push("/onboarding");
  };

  return (
    <Register
      onRegister={handleRegister}
      onGoToLogin={() => router.push("/login")}
    />
  );
}
