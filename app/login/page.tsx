"use client";
import { Login } from "@/components/Login";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";

export default function LoginPage() {
  const router = useRouter();
  const { setIsAuthenticated, setCurrentUserId } = useApp();

  const handleLogin = (email: string, password: string, hasCompletedOnboarding:boolean, currentUserId:string) => {
    setIsAuthenticated(true);
    setCurrentUserId(currentUserId)
    if (hasCompletedOnboarding){
      router.push("/home");
    } else {
      router.push("/onboarding");
    }
  };

  return (
    <Login
      onLogin={handleLogin}
      onGoToRegister={() => router.push("/register")}
    />
  );
}
