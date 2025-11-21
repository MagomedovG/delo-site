"use client";
import { useRouter } from "next/navigation";
import { EditProfile } from "@/components/EditProfile";

export default function EditProfilePage() {
  const router = useRouter();

  const handleSaveProfile = (data: any) => {
    console.log("Profile updated:", data);
    alert("Профиль успешно обновлен!");
    router.push("/my-profile");
  };

  return (
    <EditProfile
      onBack={() => router.push("/my-profile")}
      onSave={handleSaveProfile}
    />
  );
}
