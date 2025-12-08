"use client";
import { useRouter } from "next/navigation";
import { MyOffers } from "@/components/MyOffers";
import { useApp } from "@/context/AppContext";

export default function MyOffersPage() {
  const router = useRouter();
  const { selectedRole } = useApp();

  if (!selectedRole) {
    // router.push("/home");
    // return null;
  }

  return (
    <MyOffers
      userRole={selectedRole}
      onBack={() => router.push("/home")}
      onTaskClick={(id: string) => router.push(`/task-detail/${id}`)}
    />
  );
}
