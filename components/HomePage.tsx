import { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import {
  Search,
  Plus,
  Wrench,
  Package,
  Bike,
  Sparkles,
  GraduationCap,
  Laptop,
  Heart,
  Camera,
  Car,
  Scale,
  MoreHorizontal,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import LogoutButton from "./LogoutButton";

interface Category {
  id: string;
  name: string;
  icon: string;
  tasks_count: number;
}

interface CategoriesResponse {
  success: boolean;
  data: {
    categories: Category[];
  };
}

interface HomePageProps {
  onCategoryClick: (categoryId: string) => void;
  onCreateTask: () => void;
  onViewOffers?: () => void;
  onViewProfile?: () => void;
}

// const categories: Category[] = [
//   { id: "repair", name: "Ремонт и строительство", icon: Wrench, count: 234 },
//   { id: "delivery", name: "Доставка", icon: Package, count: 156 },
//   { id: "courier", name: "Курьерские поручения", icon: Bike, count: 89 },
//   { id: "cleaning", name: "Уборка", icon: Sparkles, count: 178 },
//   { id: "education", name: "Репетиторы и обучение", icon: GraduationCap, count: 145 },
//   { id: "it", name: "IT и цифровые услуги", icon: Laptop, count: 267 },
//   { id: "beauty", name: "Красота и здоровье", icon: Heart, count: 92 },
//   { id: "media", name: "Фото / Видео / Дизайн", icon: Camera, count: 103 },
//   { id: "auto", name: "Автоуслуги", icon: Car, count: 67 },
//   { id: "legal", name: "Юридические и финансовые", icon: Scale, count: 54 },
//   { id: "other", name: "Прочее", icon: MoreHorizontal, count: 198 },
// ];

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

// Маппинг иконок с бэкенда на компоненты Lucide
const iconMap: Record<string, any> = {
  wrench: Wrench,
  package: Package,
  bike: Bike,
  sparkles: Sparkles,
  "graduation-cap": GraduationCap,
  laptop: Laptop,
  heart: Heart,
  camera: Camera,
  car: Car,
  scale: Scale,
  "more-horizontal": MoreHorizontal,
};

export function HomePage({
  onCategoryClick,
  onCreateTask,
  onViewOffers,
  onViewProfile,
}: HomePageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загрузка категорий с сервера
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${BASE_URL}/categories`);
      
      if (!response.ok) {
        throw new Error(`Ошибка загрузки категорий: ${response.status}`);
      }

      const data: CategoriesResponse = await response.json();
      
      if (data.success) {
        setCategories(data.data.categories);
      } else {
        throw new Error("Не удалось загрузить категории");
      }
    } catch (err) {
      console.error("Ошибка при загрузке категорий:", err);
      setError("Не удалось загрузить категории. Попробуйте позже.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Функция для получения компонента иконки
  const getIconComponent = (iconName: string) => {
    return iconMap[iconName] || MoreHorizontal;
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const visibleCategories = showAll ? filteredCategories : filteredCategories.slice(0, 8);

  // Скелетон для загрузки
  const CategorySkeleton = () => (
    <Card className="p-6 border border-gray-200 bg-white/90 backdrop-blur-sm">
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="bg-gray-200 w-16 h-16 rounded-2xl flex items-center justify-center animate-pulse">
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
        </div>
        <div className="space-y-2 w-full">
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2 mx-auto"></div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Link href="/">
              <h1 className="text-2xl font-semibold text-blue-600">Delo</h1>
            </Link>
            <div className="flex gap-2">
              {onViewOffers && (
                <Button variant="outline" size="sm" onClick={onViewOffers}>
                  Отклики
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={onViewProfile}>
                Профиль
              </Button>
              <LogoutButton/>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Поиск задачи или категории..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 rounded-xl"
              disabled={loading}
            />
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 text-center">
          <h2 className="text-xl font-semibold">Категории услуг</h2>
          <p className="text-gray-600">Выберите категорию или создайте своё задание</p>
        </div>

        {/* Error State */}
        {error && (
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">{error}</p>
            <Button 
              onClick={fetchCategories}
              variant="outline"
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Попробовать снова
            </Button>
          </div>
        )}

        {/* Categories */}
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4"
        >
          <AnimatePresence>
            {loading ? (
              // Скелетоны при загрузке
              Array.from({ length: 8 }).map((_, index) => (
                <motion.div
                  key={`skeleton-${index}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <CategorySkeleton />
                </motion.div>
              ))
            ) : (
              // Категории после загрузки
              visibleCategories.map((category) => {
                const IconComponent = getIconComponent(category.icon);
                return (
                  <motion.div
                    key={category.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card
                      className="p-6 cursor-pointer hover:shadow-md active:scale-95 transition-all border border-gray-200 hover:border-blue-500 bg-white/90 backdrop-blur-sm"
                      onClick={() => onCategoryClick(category.id)}
                    >
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center">
                          <IconComponent className="w-8 h-8 text-blue-600" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-sm font-medium leading-tight">{category.name}</h3>
                          <p className="text-xs text-gray-500">{category.tasks_count} заданий</p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </motion.div>

        {!loading && !error && filteredCategories.length > 6 && (
          <div className="flex justify-center mt-4">
            <Button
              variant="ghost"
              className="text-blue-600 hover:text-blue-700"
              onClick={() => setShowAll((prev) => !prev)}
            >
              {showAll ? "Скрыть" : "Показать все"}
            </Button>
          </div>
        )}

        {!loading && !error && filteredCategories.length === 0 && searchQuery && (
          <div className="text-center py-12 text-gray-500">
            Категории не найдены
          </div>
        )}

        {!loading && !error && categories.length === 0 && !searchQuery && (
          <div className="text-center py-12 text-gray-500">
            Категории временно недоступны
          </div>
        )}
      </main>

      {/* Floating Button */}
      {/* <div className="fixed bottom-6 right-6 z-20">
        <Button
          onClick={onCreateTask}
          size="lg"
          className="h-14 px-6 bg-blue-600 hover:bg-blue-700 shadow-xl rounded-full flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Создать задачу
        </Button>
      </div> */}
    </div>
  );
}