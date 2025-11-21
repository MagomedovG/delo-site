import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";
import {
  ArrowLeft,
  Star,
  CheckCircle,
  Calendar,
  MapPin,
  User,
  Award,
  Briefcase
} from "lucide-react";

interface Review {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  rating: number;
  comment: string;
  taskTitle: string;
  createdAt: string;
}

interface UserStats {
  completedTasks: number;
  activeTasksAsPoster: number;
  activeTasksAsTasker: number;
  memberSince: string;
  location: string;
  responseTime: string;
}

interface UserProfileData {
  userId: string;
  name: string;
  avatar?: string;
  bio?: string;
  rating: number;
  reviewsCount: number;
  stats: UserStats;
  reviews: Review[];
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

// Моковые данные
const mockUserProfile: UserProfileData = {
  userId: "user1",
  name: "Дмитрий Иванов",
  bio: "Профессиональный мастер по сборке мебели. Работаю более 5 лет. Гарантирую качество и пунктуальность.",
  rating: 4.8,
  reviewsCount: 47,
  stats: {
    completedTasks: 52,
    activeTasksAsPoster: 2,
    activeTasksAsTasker: 3,
    memberSince: "2023-03-15",
    location: "Москва",
    responseTime: "в течение часа"
  },
  ratingDistribution: {
    5: 38,
    4: 7,
    3: 2,
    2: 0,
    1: 0
  },
  reviews: [
    {
      id: "r1",
      authorId: "a1",
      authorName: "Анна Смирнова",
      rating: 5,
      comment: "Отличный мастер! Собрал шкаф быстро и аккуратно. Все инструменты свои, работал чисто. Рекомендую!",
      taskTitle: "Сборка мебели IKEA",
      createdAt: "2025-10-15T14:30:00"
    },
    {
      id: "r2",
      authorId: "a2",
      authorName: "Сергей Петров",
      rating: 5,
      comment: "Профессионал своего дела. Приехал вовремя, работал быстро, все объяснил. Очень доволен результатом.",
      taskTitle: "Установка полок",
      createdAt: "2025-10-10T16:20:00"
    },
    {
      id: "r3",
      authorId: "a3",
      authorName: "Мария Иванова",
      rating: 4,
      comment: "Хорошо выполнил работу, но приехал с опозданием на 30 минут. В остальном всё отлично.",
      taskTitle: "Сборка кровати",
      createdAt: "2025-10-05T10:15:00"
    },
    {
      id: "r4",
      authorId: "a4",
      authorName: "Алексей Козлов",
      rating: 5,
      comment: "Очень аккуратный и внимательный мастер. Обратил внимание на нюансы, которые я не заметил. Спасибо!",
      taskTitle: "Сборка кухонного гарнитура",
      createdAt: "2025-09-28T12:00:00"
    },
    {
      id: "r5",
      authorId: "a5",
      authorName: "Ольга Волкова",
      rating: 5,
      comment: "Рекомендую! Быстро, качественно, недорого. Будем обращаться еще.",
      taskTitle: "Сборка детской мебели",
      createdAt: "2025-09-20T09:30:00"
    }
  ]
};

interface UserProfileProps {
  userId: string;
  onBack: () => void;
}

export function UserProfile({ userId, onBack }: UserProfileProps) {
  const [profile] = useState<UserProfileData>(mockUserProfile);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  const getMemberDuration = () => {
    const memberDate = new Date(profile.stats.memberSince);
    const now = new Date();
    const months = Math.floor(
      (now.getTime() - memberDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
    );
    const years = Math.floor(months / 12);
    
    if (years > 0) {
      return `${years} ${years === 1 ? "год" : years < 5 ? "года" : "лет"} на платформе`;
    }
    return `${months} ${months === 1 ? "месяц" : months < 5 ? "месяца" : "месяцев"} на платформе`;
  };

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
        {/* Profile Header */}
        <Card className="p-6">
          <div className="flex items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile.avatar} />
              <AvatarFallback className="bg-blue-100 text-blue-600 text-3xl">
                <User className="h-12 w-12" />
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-3">
              <div>
                <h1 className="text-2xl mb-1">{profile.name}</h1>
                {profile.bio && (
                  <p className="text-gray-600">{profile.bio}</p>
                )}
              </div>

              <div className="flex items-center gap-6 flex-wrap">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-xl">{profile.rating}</span>
                  <span className="text-gray-600">({profile.reviewsCount} отзывов)</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>{profile.stats.completedTasks} выполненных задач</span>
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-600 flex-wrap">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{profile.stats.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{getMemberDuration()}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center">
                <Award className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl">{profile.stats.completedTasks}</p>
                <p className="text-sm text-gray-600">Выполнено задач</p>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl">{profile.stats.activeTasksAsTasker}</p>
                <p className="text-sm text-gray-600">Активных задач</p>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center">
                <Star className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl">{profile.rating}</p>
                <p className="text-sm text-gray-600">Средний рейтинг</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Reviews Section */}
        <Card className="p-6">
          <Tabs defaultValue="reviews" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="reviews">
                Отзывы ({profile.reviewsCount})
              </TabsTrigger>
              <TabsTrigger value="rating">Рейтинг</TabsTrigger>
            </TabsList>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="space-y-4">
              {profile.reviews.map((review) => (
                <Card key={review.id} className="p-5 bg-gray-50">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={review.authorAvatar} />
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            <User className="h-5 w-5" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{review.authorName}</p>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>

                    <p className="text-gray-700">{review.comment}</p>
                    
                    <Badge variant="outline" className="text-xs">
                      {review.taskTitle}
                    </Badge>
                  </div>
                </Card>
              ))}

              {profile.reviews.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Пока нет отзывов
                </div>
              )}
            </TabsContent>

            {/* Rating Distribution Tab */}
            <TabsContent value="rating" className="space-y-4">
              <div className="text-center mb-6">
                <div className="text-5xl mb-2">{profile.rating}</div>
                <div className="flex items-center justify-center gap-1 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-6 w-6 ${
                        i < Math.round(profile.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-gray-600">На основе {profile.reviewsCount} отзывов</p>
              </div>

              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const count = profile.ratingDistribution[stars as keyof typeof profile.ratingDistribution];
                  const percentage = profile.reviewsCount > 0 
                    ? (count / profile.reviewsCount) * 100 
                    : 0;

                  return (
                    <div key={stars} className="flex items-center gap-3">
                      <div className="flex items-center gap-1 w-20">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{stars}</span>
                      </div>
                      <Progress value={percentage} className="flex-1 h-2" />
                      <span className="text-sm text-gray-600 w-12 text-right">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </main>
    </div>
  );
}
