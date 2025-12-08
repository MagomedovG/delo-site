"use client";
import { useRouter, useParams } from "next/navigation";
import { UserProfile } from "@/components/UserProfile";

export default function UserProfilePage() {
  const router = useRouter();
  const { id } = useParams();

  return (
    <UserProfile
      userId={String(id)}
      onBack={() => router.push("/home")}
    />
  );
}
