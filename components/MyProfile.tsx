import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import Cookies from 'js-cookie';
import {
  ArrowLeft,
  Star,
  User,
  Edit,
  Briefcase,
  ClipboardList,
  MessageSquare,
  MapPin,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  DollarSign
} from "lucide-react";
import { useAuthFetchWithBase } from "@/hooks/useAuthFetchWithBase";

interface Task {
  id: string;
  title: string;
  category: string;
  description: string;
  budget: number;
  location: string;
  deadline: string;
  status: "active" | "in_progress" | "completed" | "cancelled";
  offersCount: number;
  createdAt: string;
}

interface Offer {
  id: string;
  taskId: string;
  taskTitle: string;
  taskCategory: string;
  myPrice: number;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}

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

interface UserData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "poster" | "tasker" | "both";
  avatar?: string;
  bio?: string;
  location: string;
  rating: number;
  reviewsCount: number;
  completedTasks: number;
  memberSince: string;
  createdAt: string;
  updatedAt: string;
}

interface UserResponse {
  success: boolean;
  data: UserData;
}

interface TasksResponse {
  success: boolean;
  data: Task[];
}

interface OffersResponse {
  success: boolean;
  data: Offer[];
}

interface ReviewsResponse {
  success: boolean;
  data: Review[];
}

interface MyProfileProps {
  onBack: () => void;
  onEditProfile: () => void;
  onTaskClick: (taskId: string) => void;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

export function MyProfile({ onBack, onEditProfile, onTaskClick }: MyProfileProps) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [myTasks, setMyTasks] = useState<Task[]>([]);
  const [myOffers, setMyOffers] = useState<Offer[]>([]);
  const [myReviews, setMyReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<any>('')
  const getAuthToken = () => {
    return Cookies.get('access');
  };

 
  const authFetch = useAuthFetchWithBase();
  const token = Cookies.get('access');

  const fetchUserData = async () => {
    const token = getAuthToken();
    if (!token) {
      setError("Требуется авторизация");
      setLoading(false);
      return;
    }
    try {
      // const response = await fetch(`http://185.244.22.130:8000/api/v1/users/782dd693-311a-49a5-b724-c7aade8dfc4e`, 
      const response = await authFetch(`/auth/me`, 
        {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`);
      }

      const data: UserResponse = await response.json();
      
      if (data.success) {
        setUserData(data.data);
      } else {
        throw new Error("Не удалось загрузить данные пользователя");
      }
    } catch (err) {
      console.error("Ошибка при загрузке данных пользователя:", err);
      setError(err instanceof Error ? err.message : "Ошибка при загрузке данных");
    }
  };

  // Загрузка задач пользователя
  const fetchMyTasks = async () => {
    const token = getAuthToken();
    if (!token) return;

    try {
      // Здесь нужно заменить на ваш реальный endpoint для получения задач пользователя
      const response = await authFetch(`/tasks/my`, {
        method: "GET",
      });

      if (response.ok) {
        const data: TasksResponse = await response.json();
        if (data.success) {
          setMyTasks(data.data);
        }
      }
    } catch (err) {
      console.error("Ошибка при загрузке задач:", err);
    }
  };

  // Загрузка откликов пользователя
  const fetchMyOffers = async () => {
    const token = getAuthToken();
    if (!token) return;

    try {
      // Здесь нужно заменить на ваш реальный endpoint для получения откликов пользователя
      const response = await authFetch(`/offers/my`, {
        method: "GET",
      });

      if (response.ok) {
        const data: OffersResponse = await response.json();
        if (data.success) {
          setMyOffers(data.data);
        }
      }
    } catch (err) {
      console.error("Ошибка при загрузке откликов:", err);
    }
  };

  // Загрузка отзывов о пользователе
  const fetchMyReviews = async () => {
    const token = getAuthToken();
    if (!token) return;

    try {
      // Здесь нужно заменить на ваш реальный endpoint для получения отзывов
      const response = await authFetch(`${BASE_URL}/reviews/my-reviews`, {
        method: "GET",
      });

      if (response.ok) {
        const data: ReviewsResponse = await response.json();
        if (data.success) {
          setMyReviews(data.data);
        }
      }
    } catch (err) {
      console.error("Ошибка при загрузке отзывов:", err);
    }
  };

  // Загрузка всех данных при монтировании компонента
  useEffect(() => {
     
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        await Promise.all([
          fetchUserData(),
          fetchMyTasks(),
          fetchMyOffers(),
          // fetchMyReviews()
        ]);
      } catch (err) {
        console.error("Ошибка при загрузке данных:", err);
        setError("Не удалось загрузить данные профиля");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getStatusBadge = (status: Task["status"]) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
            <Clock className="h-3 w-3 mr-1" />
            Активна
          </Badge>
        );
      case "in_progress":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            <Briefcase className="h-3 w-3 mr-1" />
            В работе
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Завершена
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">
            <XCircle className="h-3 w-3 mr-1" />
            Отменена
          </Badge>
        );
    }
  };

  const getOfferStatusBadge = (status: Offer["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            <Clock className="h-3 w-3 mr-1" />
            Ожидает
          </Badge>
        );
      case "accepted":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Принят
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">
            <XCircle className="h-3 w-3 mr-1" />
            Отклонен
          </Badge>
        );
    }
  };

  const getRoleLabel = (role: UserData["role"]) => {
    switch (role) {
      case "poster":
        return "Заказчик";
      case "tasker":
        return "Исполнитель";
      case "both":
        return "Заказчик и Исполнитель";
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

  const getMemberDuration = (memberSince: string) => {
    const memberDate = new Date(memberSince);
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

  // Обновление данных
  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([
        fetchUserData(),
        fetchMyTasks(),
        fetchMyOffers(),
        fetchMyReviews()
      ]);
    } catch (err) {
      setError("Не удалось обновить данные");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка профиля...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={handleRefresh} className="bg-blue-600 hover:bg-blue-700">
            Попробовать снова
          </Button>
          <Button variant="outline" onClick={onBack} className="ml-2">
            Назад
          </Button>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Данные пользователя не найдены</p>
          <Button onClick={onBack} className="bg-blue-600 hover:bg-blue-700">
            Назад
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-5 w-5 mr-2" />
              Назад
            </Button>
            <h1 className="text-xl">Мой профиль</h1>
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
              Обновить
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Profile Header */}
        <Card className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={userData.avatar} />
              <AvatarFallback className="bg-blue-100 text-blue-600 text-3xl">
                <User className="h-12 w-12" />
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-3">
              <div>
                <h1 className="text-2xl mb-1">{userData.name}</h1>
                <Badge variant="outline" className="mb-2">
                  {getRoleLabel(userData.role)}
                </Badge>
                {userData.bio && (
                  <p className="text-gray-600 mt-2">{userData.bio}</p>
                )}
              </div>

              <div className="flex items-center gap-6 flex-wrap">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-xl">{userData.rating}</span>
                  <span className="text-gray-600">({userData.reviewsCount} отзывов)</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>{userData.completedTasks} выполненных задач</span>
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-600 flex-wrap">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{userData.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{getMemberDuration(userData.memberSince)}</span>
                </div>
              </div>
            </div>

            <Button onClick={onEditProfile} className="bg-blue-600 hover:bg-blue-700">
              <Edit className="h-4 w-4 mr-2" />
              Редактировать
            </Button>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-5 cursor-pointer hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center">
                <ClipboardList className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl">{myTasks.length}</p>
                <p className="text-sm text-gray-600">Мои задачи</p>
              </div>
            </div>
          </Card>

          <Card className="p-5 cursor-pointer hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl">{myOffers.length}</p>
                <p className="text-sm text-gray-600">Мои отклики</p>
              </div>
            </div>
          </Card>

          <Card className="p-5 cursor-pointer hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl">{myReviews.length}</p>
                <p className="text-sm text-gray-600">Отзывы обо мне</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Card className="p-6">
          <Tabs defaultValue="tasks" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="tasks">
                Мои задачи ({myTasks.length})
              </TabsTrigger>
              <TabsTrigger value="offers">
                Мои отклики ({myOffers.length})
              </TabsTrigger>
              <TabsTrigger value="reviews">
                Отзывы ({myReviews.length})
              </TabsTrigger>
            </TabsList>

            {/* Tasks Tab */}
            <TabsContent value="tasks" className="space-y-3">
              {myTasks.map((task) => (
                <Card 
                  key={task.id} 
                  className="p-5 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => onTaskClick(task.id)}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h3 className="text-lg mb-1">{task.title}</h3>
                        <Badge variant="outline" className="text-xs">
                          {task.category}
                        </Badge>
                      </div>
                      {getStatusBadge(task.status)}
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-2">
                      {task.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          <span>₽{task.budget.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{task.location}</span>
                        </div>
                      </div>
                      <Badge variant="outline">
                        {task.offersCount} откликов
                      </Badge>
                    </div>
                  </div>
                </Card>
              ))}

              {myTasks.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  У вас пока нет задач
                </div>
              )}
            </TabsContent>

            {/* Offers Tab */}
            <TabsContent value="offers" className="space-y-3">
              {myOffers?.length > 0 &&  myOffers?.map((offer) => (
                <Card key={offer.id} className="p-5">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h3 className="text-lg mb-1">{offer.taskTitle}</h3>
                        <Badge variant="outline" className="text-xs">
                          {offer.taskCategory}
                        </Badge>
                      </div>
                      {getOfferStatusBadge(offer.status)}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-blue-600">
                        <DollarSign className="h-4 w-4" />
                        <span className="text-lg">₽{offer.myPrice.toLocaleString()}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatDate(offer.createdAt)}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}

              {myOffers.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  У вас пока нет откликов
                </div>
              )}
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="space-y-3">
              {myReviews.map((review) => (
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

              {myReviews.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  У вас пока нет отзывов
                </div>
              )}
            </TabsContent>
          </Tabs>
        </Card>
      </main>
    </div>
  );
}