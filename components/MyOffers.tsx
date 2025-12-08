import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  ArrowLeft,
  Star,
  MapPin,
  Calendar,
  DollarSign,
  MessageCircle,
  CheckCircle,
  Clock,
  XCircle,
  User,
  Loader2
} from "lucide-react";
import { useAuthFetchWithBase } from "@/hooks/useAuthFetchWithBase";


// Типы для API ответа
interface Offer {
  id: string;
  task: {
    id: string;
    title: string;
    category: string;
    location: string;
    deadline: string;
    author: {
      id: string;
      name: string;
      avatar?: string;
    };
  };
  myPrice: number;
  myDescription: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}

interface OffersResponse {
  success: boolean;
  data: {
    offers: Offer[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

interface MyOffersProps {
  userRole: "poster" | "tasker";
  onBack: () => void;
  onTaskClick: (taskId: string) => void;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

export function MyOffers({ userRole, onBack, onTaskClick }: MyOffersProps) {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "accepted" | "rejected">("all");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  });

  const authFetch = useAuthFetchWithBase();

  // Загрузка откликов с сервера
  const fetchOffers = async (page: number = 1, statusFilter: string = "all") => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(statusFilter !== "all" && { status: statusFilter })
      });

      const response = await authFetch(`/offers/my?${params}`);

      if (!response.ok) {
        throw new Error(`Ошибка загрузки откликов: ${response.status}`);
      }

      const data: OffersResponse = await response.json();
      
      if (data.success) {
        // Маппим данные из бэкенда в формат фронтенда
        const mappedOffers = data.data.offers.map((offer: any) => ({
          id: offer.id,
          task: {
            id: offer.task_id,
            title: offer.task_title || 'Без названия',
            category: offer.task_category || 'Без категории',
            location: offer.task_location || 'Не указано',
            deadline: offer.task_deadline || new Date().toISOString(),
            author: {
              id: offer.task_author_id,
              name: offer.task_author_name || 'Пользователь',
              avatar: offer.task_author_avatar
            }
          },
          myPrice: offer.price || offer.proposed_price || 0,
          myDescription: offer.message || offer.description || '',
          status: offer.status,
          createdAt: offer.created_at
        }));
        setOffers(mappedOffers);
        setPagination(data.data.pagination);
      } else {
        throw new Error("Не удалось загрузить отклики");
      }
    } catch (err) {
      console.error("Ошибка при загрузке откликов:", err);
      // 401 ошибка уже обработана в authFetch, показываем другие ошибки
      if (err.message !== 'Требуется авторизация') {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers(1, filter);
  }, [filter]);

  const getOfferStatusBadge = (status: Offer["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            <Clock className="h-3 w-3 mr-1" />
            Ожидает ответа
          </Badge>
        );
      case "accepted":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Назначен
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return "Только что";
    if (diffHours < 24) return `${diffHours} ч. назад`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} дн. назад`;
  };

  const getStatusCount = (status: Offer["status"]) => {
    return offers.filter(offer => offer.status === status).length;
  };

  // Скелетон для загрузки
  const OfferSkeleton = () => (
    <Card className="p-5 animate-pulse">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
          <div className="h-6 bg-gray-200 rounded w-20"></div>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-1">
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
        <div className="bg-gray-100 rounded-lg p-3 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-3 bg-gray-200 rounded w-full"></div>
        </div>
        <div className="flex items-center justify-between">
          <div className="h-3 bg-gray-200 rounded w-16"></div>
          <div className="h-8 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl">Мои отклики</h1>
              <p className="text-sm text-gray-600">
                {loading ? "Загрузка..." : `${pagination.total} откликов`}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-center">{error}</p>
            <div className="flex justify-center mt-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => fetchOffers(1, filter)}
              >
                Попробовать снова
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {/* Фильтры */}
          <div className="flex items-center gap-2">
            <Tabs value={filter} onValueChange={(value: any) => setFilter(value)} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">Все ({pagination.total})</TabsTrigger>
                <TabsTrigger value="pending">
                  Ожидают ({loading ? "..." : getStatusCount("pending")})
                </TabsTrigger>
                <TabsTrigger value="accepted">
                  Принятые ({loading ? "..." : getStatusCount("accepted")})
                </TabsTrigger>
                <TabsTrigger value="rejected">
                  Отклонённые ({loading ? "..." : getStatusCount("rejected")})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Список откликов */}
          {loading ? (
            // Скелетоны при загрузке
            Array.from({ length: 3 }).map((_, index) => (
              <OfferSkeleton key={index} />
            ))
          ) : offers.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-500">
                {filter === "all" 
                  ? "У вас пока нет откликов" 
                  : `Нет откликов со статусом "${filter}"`}
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => fetchOffers(1, filter)}
              >
                Обновить
              </Button>
            </Card>
          ) : (
            <div className="space-y-3">
              {offers.map((offer) => (
                <Card key={offer.id} className="p-5 hover:shadow-lg transition-shadow">
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h3 
                          className="text-lg mb-1 cursor-pointer hover:text-blue-600"
                          onClick={() => onTaskClick(offer.task.id)}
                        >
                          {offer.task.title}
                        </h3>
                        <Badge variant="outline" className="text-xs">
                          {offer.task.category}
                        </Badge>
                      </div>
                      {getOfferStatusBadge(offer.status)}
                    </div>

                    {/* Информация о задаче */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{offer.task.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(offer.task.deadline).toLocaleDateString("ru-RU", {
                            day: "numeric",
                            month: "short"
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{offer.task.author.name}</span>
                      </div>
                    </div>

                    {/* Ваше предложение */}
                    <div className="bg-blue-50 rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Ваше предложение:</span>
                        <span className="text-lg text-blue-600">₽{offer.myPrice.toLocaleString()}</span>
                      </div>
                      {offer.myDescription && (
                        <p className="text-sm text-gray-700">{offer.myDescription}</p>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">{formatDate(offer.createdAt)}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onTaskClick(offer.task.id)}
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Открыть задачу
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Пагинация */}
          {!loading && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="outline"
                onClick={() => fetchOffers(pagination.page - 1, filter)}
                disabled={pagination.page === 1}
              >
                Назад
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.page <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.page >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = pagination.page - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={pagination.page === pageNum ? "default" : "outline"}
                      className={pagination.page === pageNum ? "bg-blue-600 hover:bg-blue-700" : ""}
                      onClick={() => fetchOffers(pageNum, filter)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                onClick={() => fetchOffers(pagination.page + 1, filter)}
                disabled={pagination.page === pagination.totalPages}
              >
                Вперед
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}