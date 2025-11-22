import { useState, useEffect, useCallback } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  MessageCircle, 
  DollarSign,
  SlidersHorizontal,
  Clock,
  Loader2
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Slider } from "./ui/slider";
import { useAuthFetchWithBase } from "@/hooks/useAuthFetchWithBase";

interface Task {
  id: string;
  title: string;
  description: string;
  price: number;
  priceType: "fixed" | "hourly" | "range" | "negotiable";
  deadline: string;
  location: string;
  offersCount: number;
  status: "open" | "in_progress" | "completed" | "cancelled";
  createdAt: string;
  category: string;
  budgetAmount?: number;
  budgetMax?: number;
}

interface TasksResponse {
  success: boolean;
  data: {
    tasks: Task[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface TaskListProps {
  categoryId?: string;
  categoryName?: string;
  onBack: () => void;
  onTaskClick: (taskId: string) => void;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

export function TaskList({ categoryId, categoryName, onBack, onTaskClick }: TaskListProps) {
  const [sortBy, setSortBy] = useState<string>("date");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<number[]>([0, 10000]);
  const [currentPage, setCurrentPage] = useState(1);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalTasks, setTotalTasks] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const tasksPerPage = 10;
 const authFetch = useAuthFetchWithBase()
  // Получение токена из куков
  const getAuthToken = () => {
    if (typeof document !== 'undefined') {
      const cookies = document.cookie.split(';');
      const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('authToken='));
      return tokenCookie ? tokenCookie.split('=')[1] : null;
    }
    return null;
  };

  // Загрузка задач с сервера
  const fetchTasks = async (page: number = 1, append: boolean = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setCurrentPage(page);
      }
      
      setError(null);

      const params = new URLSearchParams({
        status: statusFilter === "all" ? "open" : statusFilter,
        sortBy: sortBy === "date" ? "createdAt" : sortBy,
        page: page.toString(),
        limit: tasksPerPage.toString(),
        ...(categoryId && { category: categoryId })
      });

      const token = getAuthToken();
      

      const response = await authFetch(`/tasks?${params}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`Ошибка загрузки задач: ${response.status}`);
      }

      const data: TasksResponse = await response.json();
      
      if (data.success) {
        if (append) {
          // Добавляем новые задачи к существующим
          setTasks(prev => [...prev, ...data.data.tasks]);
        } else {
          // Заменяем задачи при первой загрузке или смене фильтров
          setTasks(data.data.tasks);
        }
        
        setTotalTasks(data.data.total);
        setTotalPages(data.data.totalPages);
        setHasMore(page < data.data.totalPages);
      } else {
        throw new Error("Не удалось загрузить задачи");
      }
    } catch (err) {
      console.error("Ошибка при загрузке задач:", err);
      setError(err instanceof Error ? err.message : "Ошибка при загрузке задач");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Загрузка первой страницы при изменении параметров
  useEffect(() => {
    fetchTasks(1, false);
  }, [categoryId, sortBy, statusFilter]);

  // Обработчик бесконечного скролла
  const handleScroll = useCallback(() => {
    if (loading || loadingMore || !hasMore) return;

    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // Загружаем следующую страницу когда до конца осталось 200px
    if (scrollTop + windowHeight >= documentHeight - 200) {
      const nextPage = currentPage + 1;
      fetchTasks(nextPage, true);
      setCurrentPage(nextPage);
    }
  }, [loading, loadingMore, hasMore, currentPage]);

  // Добавляем обработчик скролла
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const getStatusBadge = (status: Task["status"]) => {
    switch (status) {
      case "open":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Открыта</Badge>;
      case "in_progress":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">В работе</Badge>;
      case "completed":
        return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">Выполнена</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Отменена</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Сегодня";
    if (diffDays === 1) return "Завтра";
    if (diffDays > 1 && diffDays <= 7) return `Через ${diffDays} дн.`;
    
    return date.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
  };

  const getPriceDisplay = (task: Task) => {
    if (task.priceType === "negotiable") {
      return "Договорная";
    }
    if (task.budgetMax && task.budgetMin && task.budgetMax !== task.budgetMin) {
      return `₽${task.budgetMin?.toLocaleString()} - ${task.budgetMax.toLocaleString()}`;
    }
    if (task.priceType === "hourly") {
      return `₽${task.price?.toLocaleString()}/час`;
    }
    if( task.budgetMax === task.budgetMin && task.budgetMax === task.budgetMin){
      `₽${task.budgetMin} фикс`
    }
    return `₽${task.price?.toLocaleString()}`;
  };

  const getPriceTypeText = (task: Task) => {
    switch (task.priceType) {
      case "fixed":
        return "за задание";
      case "hourly":
        return "в час";
      case "range":
        return "диапазон";
      case "negotiable":
        return "договорная";
    }
  };

  // Скелетон для загрузки
  const TaskSkeleton = () => (
    <Card className="p-5 border-l-4 border-l-gray-300 animate-pulse">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
          <div className="text-right space-y-1">
            <div className="h-6 bg-gray-200 rounded w-20"></div>
            <div className="h-3 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="flex flex-wrap items-center gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-1">
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-3">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl">{categoryName || "Все задания"}</h1>
              <p className="text-sm text-gray-600">
                {loading ? "Загрузка..." : `${totalTasks} заданий`}
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            <Select value={sortBy} onValueChange={setSortBy} disabled={loading}>
              <SelectTrigger className="w-[180px] h-10">
                <SelectValue placeholder="Сортировка" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">По дате</SelectItem>
                <SelectItem value="price_asc">Цена: низкая</SelectItem>
                <SelectItem value="price_desc">Цена: высокая</SelectItem>
                <SelectItem value="offers">По откликам</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter} disabled={loading}>
              <SelectTrigger className="w-[150px] h-10">
                <SelectValue placeholder="Статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все</SelectItem>
                <SelectItem value="open">Открытые</SelectItem>
                <SelectItem value="in_progress">В работе</SelectItem>
                <SelectItem value="completed">Выполненные</SelectItem>
              </SelectContent>
            </Select>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="h-10" disabled={loading}>
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Фильтры
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Фильтры</SheetTitle>
                  <SheetDescription>
                    Настройте параметры поиска заданий
                  </SheetDescription>
                </SheetHeader>
                <div className="py-6 space-y-6">
                  <div className="space-y-3">
                    <label className="text-sm">Диапазон цен: ₽{priceRange[0]} - ₽{priceRange[1]}</label>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={10000}
                      step={100}
                      className="w-full"
                    />
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {error && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => fetchTasks(1, false)}
                className="h-10"
              >
                Повторить
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Task List */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-center">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          {loading ? (
            // Скелетоны при загрузке
            Array.from({ length: 5 }).map((_, index) => (
              <TaskSkeleton key={index} />
            ))
          ) : (
            // Задачи после загрузки
            <>
              {tasks.map((task) => (
                <Card
                  key={task.id}
                  className="p-5 cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-l-blue-600"
                  onClick={() => onTaskClick(task.id)}
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h3 className="text-lg mb-1">{task.title}</h3>
                        {getStatusBadge(task.status)}
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-blue-600">
                          {/* <DollarSign className="h-4 w-4" /> */}
                          <span className="text-xl">{getPriceDisplay(task)}</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {getPriceTypeText(task)}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 text-sm line-clamp-2">{task.description}</p>

                    {/* Meta info */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{task.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatDate(task.deadline)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>{task.offersCount} откликов</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {new Date(task.createdAt).toLocaleDateString("ru-RU", {
                            day: "numeric",
                            month: "short"
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}

              {/* Индикатор загрузки следующих страниц */}
              {loadingMore && (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                </div>
              )}

              {/* Сообщение о конце списка */}
              {!hasMore && tasks.length > 0 && (
                <div className="text-center py-8 text-gray-500">
                  Вы просмотрели все задания
                </div>
              )}
            </>
          )}

          {!loading && tasks.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Задания не найдены</p>
              <Button 
                variant="outline" 
                onClick={() => fetchTasks(1, false)}
                className="mt-4"
              >
                Обновить
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}