"use client";
import { useRouter } from "next/navigation";
import { MyProfile } from "@/components/MyProfile";

export default function MyProfilePage() {
  const router = useRouter();

  return (
    <MyProfile
      onBack={() => router.push("/home")}
      onEditProfile={() => router.push("/edit-profile")}
      onTaskClick={(id: string) => router.push(`/task-detail/${id}`)}
    />
  );
}
