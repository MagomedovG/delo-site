"use client";
import { useRouter } from "next/navigation";
import { ReviewForm } from "@/components/ReviewForm";

export default function ReviewFormPage() {
  const router = useRouter();

  const handleSubmitReview = (rating: number, comment: string) => {
    console.log("Review submitted:", { rating, comment });
    alert("Отзыв успешно опубликован!");
    router.push("/home");
  };

  return (
    <ReviewForm
      taskTitle="Сборка мебели IKEA"
      revieweeId="tasker1"
      revieweeName="Дмитрий Иванов"
      revieweeRole="tasker"
      onBack={() => router.push("/home")}
      onSubmit={handleSubmitReview}
    />
  );
}
