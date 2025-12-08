import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ArrowLeft, Star, Send, User } from "lucide-react";

interface ReviewFormProps {
  taskTitle: string;
  revieweeId: string;
  revieweeName: string;
  revieweeAvatar?: string;
  revieweeRole: "tasker" | "poster";
  onBack: () => void;
  onSubmit: (rating: number, comment: string) => void;
}

export function ReviewForm({
  taskTitle,
  revieweeId,
  revieweeName,
  revieweeAvatar,
  revieweeRole,
  onBack,
  onSubmit
}: ReviewFormProps) {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (rating === 0) {
      newErrors.rating = "Поставьте оценку";
    }
    if (!comment.trim()) {
      newErrors.comment = "Напишите отзыв";
    } else if (comment.trim().length < 10) {
      newErrors.comment = "Отзыв должен содержать минимум 10 символов";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(rating, comment);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl">Оставить отзыв</h1>
              <p className="text-sm text-gray-600">{taskTitle}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        <Card className="p-6 space-y-6">
          {/* User Info */}
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              {revieweeRole === "tasker" ? "Оцените исполнителя" : "Оцените заказчика"}
            </p>
            <div className="flex items-center gap-3">
              <Avatar className="h-16 w-16">
                <AvatarImage src={revieweeAvatar} />
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  <User className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-lg">{revieweeName}</h2>
                <p className="text-sm text-gray-600">
                  {revieweeRole === "tasker" ? "Исполнитель" : "Заказчик"}
                </p>
              </div>
            </div>
          </div>

          {/* Rating */}
          <div className="space-y-3">
            <label className="text-sm">
              Оценка <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star
                    className={`h-10 w-10 ${
                      star <= (hoveredRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm text-gray-600">
                {rating === 1 && "Плохо"}
                {rating === 2 && "Неудовлетворительно"}
                {rating === 3 && "Удовлетворительно"}
                {rating === 4 && "Хорошо"}
                {rating === 5 && "Отлично"}
              </p>
            )}
            {errors.rating && (
              <p className="text-sm text-red-500">{errors.rating}</p>
            )}
          </div>

          {/* Comment */}
          <div className="space-y-3">
            <label className="text-sm">
              Комментарий <span className="text-red-500">*</span>
            </label>
            <Textarea
              placeholder={
                revieweeRole === "tasker"
                  ? "Расскажите, как исполнитель справился с задачей. Был ли он пунктуален, профессионален, вежлив?"
                  : "Расскажите о взаимодействии с заказчиком. Был ли он четким в постановке задачи, пунктуально ли оплатил работу?"
              }
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={6}
              className={errors.comment ? "border-red-500" : ""}
            />
            <p className="text-sm text-gray-500">
              Минимум 10 символов. Напишите детальный отзыв, это поможет другим пользователям.
            </p>
            {errors.comment && (
              <p className="text-sm text-red-500">{errors.comment}</p>
            )}
          </div>

          {/* Tips */}
          <Card className="p-4 bg-blue-50 border-blue-200">
            <h3 className="text-sm mb-2">💡 Советы:</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Будьте объективны и честны</li>
              <li>• Опишите конкретные моменты работы</li>
              <li>• Избегайте оскорблений и грубости</li>
              <li>• Отзыв нельзя будет изменить после публикации</li>
            </ul>
          </Card>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="flex-1"
            >
              Отмена
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              <Send className="mr-2 h-4 w-4" />
              Опубликовать отзыв
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
}
