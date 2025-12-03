import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  DollarSign,
  Star,
  MessageCircle,
  ExternalLink,
  Send,
  CheckCircle,
  Clock,
  User,
  Loader2
} from "lucide-react";
import { useAuthFetchWithBase } from "@/hooks/useAuthFetchWithBase";

interface TaskDetailData {
  id: string;
  title: string;
  description: string;
  budgetMin: number;
  budgetMax: number;
  categoryId: string;
  categoryName: string;
  location: string;
  deadline: string;
  status: "open" | "in_progress" | "completed";
  posterId: string;
  posterName: string;
  posterAvatar: string | null;
  posterRating: number;
  offersCount: number;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  success: boolean;
  data: TaskDetailData;
}

interface OfferResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    taskId: string;
    taskerId: string;
    price: number;
    description: string;
    estimatedTime: string;
    status: "pending";
    createdAt: string;
  };
}

interface TaskDetailProps {
  taskId: string;
  currentUserId: string;
  onBack: () => void;
}

export function TaskDetail({ taskId, currentUserId, onBack }: TaskDetailProps) {
  const [task, setTask] = useState<TaskDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOfferDialogOpen, setIsOfferDialogOpen] = useState(false);
  const [offerPrice, setOfferPrice] = useState("");
  const [offerDescription, setOfferDescription] = useState(" Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos mollitia deleniti quidem officiis eum qui quisquam, praesentium recusandae quibusdam sed dolores magnam dolorem sint quaerat aut at delectus nemo? Excepturi?");
  const [offerTime, setOfferTime] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [offerError, setOfferError] = useState<string | null>(null);
  const [offerSuccess, setOfferSuccess] = useState(false);
  
  const authFetch = useAuthFetchWithBase();

  // Загрузка данных задачи
  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await authFetch(`/tasks/${taskId}`);
        
        if (!response.ok) {
          throw new Error(`Ошибка загрузки: ${response.status}`);
        }
        
        const result: ApiResponse = await response.json();
        
        if (result.success && result.data) {
          setTask(result.data);
        } else {
          throw new Error("Неверный формат ответа");
        }
      } catch (err) {
        console.error("Ошибка загрузки задачи:", err);
        setError(err instanceof Error ? err.message : "Произошла ошибка при загрузке");
      } finally {
        setLoading(false);
      }
    };

    if (taskId) {
      fetchTask();
    }
  }, [taskId]);

  const isAuthor = task?.posterId === currentUserId;

  const getStatusBadge = (status: TaskDetailData["status"]) => {
    switch (status) {
      case "open":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Открыта</Badge>;
      case "in_progress":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">В работе</Badge>;
      case "completed":
        return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">Выполнена</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const validateOffer = () => {
    const errors: string[] = [];

    if (!offerPrice || parseInt(offerPrice) <= 0) {
      errors.push("Цена должна быть больше 0");
    }

    if (!offerDescription || offerDescription.length < 20) {
      errors.push("Описание должно содержать минимум 20 символов");
    }

    if (!offerTime) {
      errors.push("Укажите время выполнения");
    }

    return errors;
  };

  const handleSubmitOffer = async () => {
    const validationErrors = validateOffer();
    if (validationErrors.length > 0) {
      setOfferError(validationErrors.join(", "));
      return;
    }

    setSubmitting(true);
    setOfferError(null);

    try {
      const response = await authFetch(`/tasks/${taskId}/offers`, {
        method: "POST",
        body: JSON.stringify({
          price: parseInt(offerPrice),
          description: offerDescription.trim(),
          estimatedTime: offerTime.trim()
        })
      });

      if (response.status === 201) {
        const result: OfferResponse = await response.json();
        
        if (result.success) {
          setOfferSuccess(true);
          setIsOfferDialogOpen(false);
          setOfferPrice("");
          setOfferDescription("");
          setOfferTime("");
          
          // Можно показать уведомление об успехе
          console.log("Отклик успешно отправлен:", result.data);
          
          // Обновляем счетчик откликов
          if (task) {
            setTask({
              ...task,
              offersCount: task.offersCount + 1
            });
          }
        } else {
          setOfferError(result.message || "Ошибка при отправке отклика");
        }
      } else {
        const errorData = await response.json();
        setOfferError(errorData.message || `Ошибка сервера: ${response.status}`);
      }
    } catch (err) {
      console.error("Ошибка при отправке отклика:", err);
      setOfferError("Ошибка сети. Проверьте подключение к интернету.");
    } finally {
      setSubmitting(false);
    }
  };

  const openMapLink = () => {
    if (task?.location) {
      window.open(
        `https://www.google.com/maps?q=${encodeURIComponent(task.location)}`,
        "_blank"
      );
    }
  };

  // Сброс состояния при открытии/закрытии диалога
  useEffect(() => {
    if (isOfferDialogOpen) {
      setOfferError(null);
      setOfferSuccess(false);
    }
  }, [isOfferDialogOpen]);

  // Состояние загрузки
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Загрузка задачи...</p>
        </div>
      </div>
    );
  }

  // Состояние ошибки
  if (error && !task) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-5 w-5 mr-2" />
              Назад
            </Button>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-6">
          <Card className="p-6 text-center">
            <div className="text-red-600 mb-4">
              <p className="text-lg font-medium">Ошибка загрузки</p>
              <p className="text-sm mt-2">{error}</p>
            </div>
            <Button onClick={onBack} variant="outline">
              Вернуться назад
            </Button>
          </Card>
        </main>
      </div>
    );
  }

  // Если задача не найдена
  if (!task) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-5 w-5 mr-2" />
              Назад
            </Button>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-6">
          <Card className="p-6 text-center">
            <p className="text-lg text-gray-600 mb-4">Задача не найдена</p>
            <Button onClick={onBack} variant="outline">
              Вернуться назад
            </Button>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-5 w-5 mr-2" />
            Назад
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Task Header */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-3xl mb-3">{task.title}</h1>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="text-blue-600 border-blue-600">
                    {task.categoryName}
                  </Badge>
                  {getStatusBadge(task.status)}
                </div>
              </div>
            </div>

            <Separator />

            {/* Price and Deadline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Бюджет</p>
                  <p className="text-xl text-blue-600">
                    ₽{task?.budgetMin?.toLocaleString()} - ₽{task?.budgetMax?.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">диапазон цен</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Срок выполнения</p>
                  <p className="text-lg">{formatDate(task.deadline)}</p>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-3">
              <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">Локация</p>
                <div className="flex items-center gap-2">
                  <p className="text-lg">{task.location}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={openMapLink}
                    className="h-8"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Карта
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Description */}
        <Card className="p-6">
          <h2 className="text-xl mb-3">Описание задачи</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">{task.description}</p>
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>Опубликовано {formatDateTime(task.createdAt)}</span>
          </div>
          {task.updatedAt !== task.createdAt && (
            <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
              <span>Обновлено {formatDateTime(task.updatedAt)}</span>
            </div>
          )}
        </Card>

        {/* Author Info */}
        <Card className="p-6">
          <h2 className="text-xl mb-4">Заказчик</h2>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={task.posterAvatar || undefined} />
              <AvatarFallback className="bg-blue-100 text-blue-600">
                {getInitials(task.posterName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-lg mb-1">{task.posterName}</h3>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{task.posterRating > 0 ? task.posterRating : "Нет оценок"}</span>
                </div>
                {task.posterRating > 0 && (
                  <>
                    <span>•</span>
                    <span>Рейтинг заказчика</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Offers Count */}
        {isAuthor && (
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl">Отклики на задачу</h2>
              <Badge variant="outline" className="text-lg px-3 py-1">
                {task.offersCount}
              </Badge>
            </div>
            <p className="text-gray-600 mt-2">
              {task.offersCount === 0 
                ? "На вашу задачу пока нет откликов" 
                : `На вашу задачу откликнулось ${task.offersCount} исполнителей`}
            </p>
          </Card>
        )}

        {/* Action Button for non-authors */}
        {!isAuthor && task.status === "open" && (
          <div className="sticky bottom-6 z-10">
            <Dialog open={isOfferDialogOpen} onOpenChange={setIsOfferDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  className="w-full h-14 bg-blue-600 hover:bg-blue-700 shadow-lg"
                >
                  <Send className="mr-2 h-5 w-5" />
                  Откликнуться на задачу
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Отклик на задачу</DialogTitle>
                  <DialogDescription>
                    Предложите свою цену и расскажите, как вы выполните эту задачу
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm">Ваша цена (₽) <span className="text-red-500">*</span></label>
                    <Input
                      type="number"
                      placeholder="1500"
                      value={offerPrice}
                      onChange={(e) => setOfferPrice(e.target.value)}
                      min={task.budgetMin}
                      max={task.budgetMax}
                      disabled={submitting}
                    />
                    <p className="text-xs text-gray-500">
                      Бюджет заказчика: ₽{task.budgetMin} - ₽{task.budgetMax}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm">Время выполнения <span className="text-red-500">*</span></label>
                    <Input
                      type="text"
                      placeholder="например: 3-4 часа"
                      value={offerTime}
                      onChange={(e) => setOfferTime(e.target.value)}
                      disabled={submitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm">Комментарий <span className="text-red-500">*</span></label>
                    <Textarea
                      placeholder="Расскажите о своём опыте и подходе к выполнению задачи (минимум 20 символов)..."
                      value={offerDescription}
                      onChange={(e) => setOfferDescription(e.target.value)}
                      rows={5}
                      disabled={submitting}
                    />
                    <p className="text-xs text-gray-500">
                      {offerDescription.length}/20 символов
                    </p>
                  </div>

                  {/* Ошибка отправки */}
                  {offerError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-600">{offerError}</p>
                    </div>
                  )}
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsOfferDialogOpen(false)}
                    className="flex-1"
                    disabled={submitting}
                  >
                    Отмена
                  </Button>
                  <Button
                    onClick={handleSubmitOffer}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    disabled={!offerPrice || !offerDescription || !offerTime || submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Отправка...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Отправить отклик
                      </>
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </main>
    </div>
  );
}