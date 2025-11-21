"use client";
import { useRouter } from "next/navigation";
import { TaskList } from "@/components/TaskList";
import { useApp } from "@/context/AppContext";

export default function TaskListPage() {
  const router = useRouter();
  const { selectedCategory, setSelectedTaskId } = useApp();

  const handleTaskClick = (taskId: string) => {
    setSelectedTaskId(taskId);
    router.push(`/task-detail/${taskId}`);
  };

  return (
    <TaskList
      categoryId={selectedCategory?.id}
      categoryName={selectedCategory?.name}
      onBack={() => router.push("/home")}
      onTaskClick={handleTaskClick}
    />
  );
}
