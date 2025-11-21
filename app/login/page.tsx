"use client";
import { Login } from "@/components/Login";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";

export default function LoginPage() {
  const router = useRouter();
  const { setIsAuthenticated } = useApp();

  const handleLogin = (email: string, password: string) => {
    console.log("Login:", { email, password });
    setIsAuthenticated(true);
    router.push("/onboarding");
  };

  return (
    <Login
      onLogin={handleLogin}
      onGoToRegister={() => router.push("/register")}
    />
  );
}
