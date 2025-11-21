"use client";
import { useParams, useRouter } from "next/navigation";
import { TaskDetail } from "@/components/TaskDetail";
import { useApp } from "@/context/AppContext";

export default function TaskDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const { currentUserId } = useApp();

  return (
    <TaskDetail
      taskId={String(id)}
      currentUserId={currentUserId}
      onBack={() => router.back()}
    />
  );
}
