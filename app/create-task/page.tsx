"use client";
import { useRouter } from "next/navigation";
import { CreateTask } from "@/components/CreateTask";

export default function CreateTaskPage() {
  const router = useRouter();

  const handleSubmitTask = (taskData: any) => {
    console.log("Task submitted:", taskData);
    alert("Задача успешно опубликована!");
    // router.push("/home");
  };

  return (
    <CreateTask
      onBack={() => router.push("/home")}
      onSubmit={handleSubmitTask}
    />
  );
}
