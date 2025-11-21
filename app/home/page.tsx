"use client";
import { useRouter } from "next/navigation";
import { HomePage } from "@/components/HomePage";
import { TaskList } from "@/components/TaskList";
import { useApp } from "@/context/AppContext";

export default function Home() {
  const router = useRouter();
  const { setSelectedCategory } = useApp();

  const handleCategoryClick = (categoryId: string) => {
    const names: Record<string, string> = {
      repair: "Ремонт и строительство",
      delivery: "Доставка",
      courier: "Курьерские поручения",
      cleaning: "Уборка",
      education: "Репетиторы и обучение",
      it: "IT и цифровые услуги",
      beauty: "Красота и здоровье",
      media: "Фото / Видео / Дизайн",
      auto: "Автоуслуги",
      legal: "Юридические и финансовые",
      other: "Прочее",
    };
    setSelectedCategory({ id: categoryId, name: names[categoryId] });
    router.push("/task-list");
  };

  const handleTaskClick = (taskId: string) => {
    router.push(`/task-detail/${taskId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HomePage
        onCategoryClick={handleCategoryClick}
        onCreateTask={() => router.push("/create-task")}
        onViewOffers={() => router.push("/my-offers")}
        onViewProfile={() => router.push("/my-profile")}
      />

      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-semibold mb-6">Рекомендованные задания</h2>
        <TaskList 
          onBack={() => {}} 
          onTaskClick={handleTaskClick} 
        />
      </section>
    </div>
  );
}
