import { useState, useEffect } from "react";
import Cookies from 'js-cookie';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card } from "./ui/card";
import { Label } from "./ui/label";
import { Calendar } from "./ui/calendar";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import { ArrowLeft, Calendar as CalendarIcon, MapPin, Send, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { useAuthFetchWithBase } from "@/hooks/useAuthFetchWithBase";

interface Category {
  id: string;
  name: string;
  icon: string;
  tasksCount: number;
}

interface CategoriesResponse {
  success: boolean;
  data: {
    categories: Category[];
  };
}

interface CreateTaskProps {
  onBack: () => void;
  onSubmit: (taskData: any) => void;
}

interface CreateTaskResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    title: string;
    category: {
      id: string;
      name: string;
    };
    description: string;
    price: number;
    priceType: string;
    location: string;
    deadline: string;
    status: string;
    createdAt: string;
  };
}

interface TaskFormData {
  title: string;
  category_id: string;
  description: string;
  budget_type: "fixed" | "hourly" | "range" | "negotiable";
  budget_min?: number;
  budget_max?: number;
  hourly_rate?: number;
  deadline: string;
  location: string;
  locationCoords?: {
    lat: number;
    lng: number;
  };
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export function CreateTask({ onBack, onSubmit }: CreateTaskProps) {
  const [title, setTitle] = useState("Задача про");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos mollitia deleniti quidem officiis eum qui quisquam, praesentium recusandae quibusdam sed dolores magnam dolorem sint quaerat aut at delectus nemo? Excepturi?");
  const [budgetType, setBudgetType] = useState<"fixed" | "hourly" | "range" | "negotiable">("fixed");
  const [budgetMin, setBudgetMin] = useState("3000");
  const [budgetMax, setBudgetMax] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [deadline, setDeadline] = useState<Date>();
  const [location, setLocation] = useState("На поселке");
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const authFetch = useAuthFetchWithBase()

  // Получение токена авторизации из куки
  const getAuthToken = () => {
    return Cookies.get('access');
  };

  // Загрузка категорий с сервера
  const fetchCategories = async () => {
    try {
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
    } catch (error) {
      console.error("Ошибка при загрузке категорий:", error);
      setErrors({ categories: "Не удалось загрузить категории" });
    } finally {
      setCategoriesLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Сброс полей бюджета при смене типа
  useEffect(() => {
    if (budgetType === "negotiable") {
      setBudgetMin("");
      setBudgetMax("");
      setHourlyRate("");
    } else if (budgetType === "hourly") {
      setBudgetMin("");
      setBudgetMax("");
    } else if (budgetType === "fixed") {
      setBudgetMax("");
      setHourlyRate("");
    } else if (budgetType === "range") {
      setHourlyRate("");
    }
  }, [budgetType]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Валидация названия
    if (!title.trim()) {
      newErrors.title = "Введите название задачи";
    } else if (title.trim().length < 5) {
      newErrors.title = "Название должно содержать минимум 5 символов";
    } else if (title.trim().length > 200) {
      newErrors.title = "Название не должно превышать 200 символов";
    }

    // Валидация категории
    if (!category) {
      newErrors.category = "Выберите категорию";
    }

    // Валидация описания
    if (!description.trim()) {
      newErrors.description = "Добавьте описание";
    } else if (description.trim().length < 50) {
      newErrors.description = "Описание должно содержать минимум 50 символов";
    }

    // Валидация бюджета в зависимости от типа
    if (budgetType === "fixed") {
      if (!budgetMin) {
        newErrors.budgetMin = "Укажите бюджет";
      } else if (parseInt(budgetMin) <= 0) {
        newErrors.budgetMin = "Бюджет должен быть больше 0";
      }
    } else if (budgetType === "hourly") {
      if (!hourlyRate) {
        newErrors.hourlyRate = "Укажите почасовую ставку";
      } else if (parseInt(hourlyRate) <= 0) {
        newErrors.hourlyRate = "Ставка должна быть больше 0";
      }
    } else if (budgetType === "range") {
      if (!budgetMin) {
        newErrors.budgetMin = "Укажите минимальный бюджет";
      } else if (parseInt(budgetMin) <= 0) {
        newErrors.budgetMin = "Минимальный бюджет должен быть больше 0";
      }
      
      if (!budgetMax) {
        newErrors.budgetMax = "Укажите максимальный бюджет";
      } else if (parseInt(budgetMax) <= parseInt(budgetMin || "0")) {
        newErrors.budgetMax = "Максимальный бюджет должен быть больше минимального";
      }
    }

    // Валидация срока
    if (!deadline) {
      newErrors.deadline = "Выберите срок выполнения";
    } else if (deadline < new Date()) {
      newErrors.deadline = "Срок выполнения должен быть в будущем";
    }

    // Валидация локации
    if (!location.trim()) {
      newErrors.location = "Укажите локацию";
    } else if (location.trim().length < 5) {
      newErrors.location = "Локация должна содержать минимум 5 символов";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    const token = getAuthToken();
    if (!token) {
      setErrors({ submit: "Требуется авторизация. Пожалуйста, войдите в систему." });
      setIsLoading(false);
      return;
    }
    
    try {
      // Формируем данные в зависимости от типа бюджета
      const taskData: TaskFormData = {
        title: title.trim(),
        category_id: category,
        description: description.trim(),
        budget_type: budgetType,
        deadline: deadline ? deadline.toISOString() : "",
        location: location.trim(),
      };

      // Добавляем специфичные поля бюджета
      if (budgetType === "fixed") {
        taskData.budget_min = parseInt(budgetMin);
        taskData.budget_max = parseInt(budgetMin); // Для фиксированного бюджета min = max
      } else if (budgetType === "hourly") {
        taskData.hourly_rate = parseInt(hourlyRate);
      } else if (budgetType === "range") {
        taskData.budget_min = parseInt(budgetMin);
        taskData.budget_max = parseInt(budgetMax);
      }
      // Для negotiable не добавляем никаких полей бюджета

      console.log("Отправляемые данные:", JSON.stringify(taskData, null, 2));

      // Отправка запроса на создание задачи
      const response = await authFetch(`/tasks`, {
        method: "POST",
        body: JSON.stringify(taskData),
      });

      const data: CreateTaskResponse = await response.json();

      if (response.status === 201 && data.success) {
        // Успешное создание задачи
        onSubmit(data.data);
      } else {
        // Обработка ошибок валидации
        if (data.message && data.message.includes("валидации") && data.errors) {
          setErrors(data.errors);
        } else {
          setErrors({ submit: data.message || "Произошла ошибка при создании задачи" });
        }
      }
    } catch (error) {
      console.error("Ошибка при создании задачи:", error);
      setErrors({ submit: "Ошибка сети. Проверьте подключение к интернету." });
    } finally {
      setIsLoading(false);
    }
  };

  // Функция для получения иконки по названию
  const getCategoryIcon = (iconName: string) => {
    const iconMap: Record<string, string> = {
      wrench: "🔧",
      package: "📦",
      bike: "🚴",
      sparkles: "✨",
      "graduation-cap": "🎓",
      laptop: "💻",
      heart: "❤️",
      camera: "📷",
      car: "🚗",
      scale: "⚖️",
      "more-horizontal": "⋯"
    };
    return iconMap[iconName] || "📝";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl">Создание задачи</h1>
              <p className="text-sm text-gray-600">Заполните все поля</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-6">
        <Card className="p-6">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Название задачи <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder="Например: Сборка мебели IKEA"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors({ ...errors, title: "" });
                }}
                className={errors.title ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title}</p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">
                Категория <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={category} 
                onValueChange={(value) => {
                  setCategory(value);
                  if (errors.category) setErrors({ ...errors, category: "" });
                }}
                disabled={isLoading || categoriesLoading}
              >
                <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                  <SelectValue placeholder={
                    categoriesLoading ? "Загрузка категорий..." : "Выберите категорию"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      <div className="flex items-center gap-2">
                        <span>{getCategoryIcon(cat.icon)}</span>
                        <span>{cat.name}</span>
                        <span className="text-xs text-gray-500 ml-auto">
                          {cat.tasksCount}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categories && (
                <p className="text-sm text-red-500">{errors.categories}</p>
              )}
              {errors.category && (
                <p className="text-sm text-red-500">{errors.category}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">
                Описание задачи <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Подробно опишите, что нужно сделать, какие требования к исполнителю, есть ли особые условия..."
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description) setErrors({ ...errors, description: "" });
                }}
                rows={6}
                className={errors.description ? "border-red-500" : ""}
                disabled={isLoading}
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>Минимум 50 символов</span>
                <span className={description.length < 50 ? "text-red-500" : "text-green-500"}>
                  {description.length}/50
                </span>
              </div>
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description}</p>
              )}
            </div>

            {/* Budget Type */}
            <div className="space-y-3">
              <Label>
                Тип бюджета <span className="text-red-500">*</span>
              </Label>
              <RadioGroup 
                value={budgetType} 
                onValueChange={(value: any) => {
                  setBudgetType(value);
                  if (errors.budgetMin || errors.budgetMax || errors.hourlyRate) {
                    setErrors({ 
                      ...errors, 
                      budgetMin: "", 
                      budgetMax: "", 
                      hourlyRate: "" 
                    });
                  }
                }}
                disabled={isLoading}
              >
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <RadioGroupItem value="fixed" id="fixed" className="sr-only" />
                    <Label
                      htmlFor="fixed"
                      className={`flex flex-col p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                        budgetType === "fixed" 
                          ? "border-blue-500 bg-blue-50" 
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <span className="font-medium">Фиксированная</span>
                      <span className="text-sm text-gray-500">Одна сумма</span>
                    </Label>
                  </div>
                  
                  <div>
                    <RadioGroupItem value="hourly" id="hourly" className="sr-only" />
                    <Label
                      htmlFor="hourly"
                      className={`flex flex-col p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                        budgetType === "hourly" 
                          ? "border-blue-500 bg-blue-50" 
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <span className="font-medium">Почасовая</span>
                      <span className="text-sm text-gray-500">За час работы</span>
                    </Label>
                  </div>

                  <div>
                    <RadioGroupItem value="range" id="range" className="sr-only" />
                    <Label
                      htmlFor="range"
                      className={`flex flex-col p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                        budgetType === "range" 
                          ? "border-blue-500 bg-blue-50" 
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <span className="font-medium">Диапазон</span>
                      <span className="text-sm text-gray-500">От и до</span>
                    </Label>
                  </div>

                  <div>
                    <RadioGroupItem value="negotiable" id="negotiable" className="sr-only" />
                    <Label
                      htmlFor="negotiable"
                      className={`flex flex-col p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                        budgetType === "negotiable" 
                          ? "border-blue-500 bg-blue-50" 
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <span className="font-medium">Договорная</span>
                      <span className="text-sm text-gray-500">Обсудим</span>
                    </Label>
                  </div>
                </div>
              </RadioGroup>

              {/* Budget Amount Inputs */}
              {budgetType !== "negotiable" && (
                <div className="space-y-3 pt-2">
                  {budgetType === "range" ? (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="budgetMin">От (₽)</Label>
                        <Input
                          id="budgetMin"
                          type="number"
                          placeholder="1000"
                          value={budgetMin}
                          onChange={(e) => {
                            setBudgetMin(e.target.value);
                            if (errors.budgetMin) setErrors({ ...errors, budgetMin: "" });
                          }}
                          className={errors.budgetMin ? "border-red-500" : ""}
                          disabled={isLoading}
                        />
                        {errors.budgetMin && (
                          <p className="text-sm text-red-500">{errors.budgetMin}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="budgetMax">До (₽)</Label>
                        <Input
                          id="budgetMax"
                          type="number"
                          placeholder="5000"
                          value={budgetMax}
                          onChange={(e) => {
                            setBudgetMax(e.target.value);
                            if (errors.budgetMax) setErrors({ ...errors, budgetMax: "" });
                          }}
                          className={errors.budgetMax ? "border-red-500" : ""}
                          disabled={isLoading}
                        />
                        {errors.budgetMax && (
                          <p className="text-sm text-red-500">{errors.budgetMax}</p>
                        )}
                      </div>
                    </div>
                  ) : budgetType === "hourly" ? (
                    <div className="space-y-2">
                      <Label htmlFor="hourlyRate">Стоимость за час (₽)</Label>
                      <Input
                        id="hourlyRate"
                        type="number"
                        placeholder="500"
                        value={hourlyRate}
                        onChange={(e) => {
                          setHourlyRate(e.target.value);
                          if (errors.hourlyRate) setErrors({ ...errors, hourlyRate: "" });
                        }}
                        className={errors.hourlyRate ? "border-red-500" : ""}
                        disabled={isLoading}
                      />
                      {errors.hourlyRate && (
                        <p className="text-sm text-red-500">{errors.hourlyRate}</p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor="budgetMin">Бюджет (₽)</Label>
                      <Input
                        id="budgetMin"
                        type="number"
                        placeholder="3000"
                        value={budgetMin}
                        onChange={(e) => {
                          setBudgetMin(e.target.value);
                          if (errors.budgetMin) setErrors({ ...errors, budgetMin: "" });
                        }}
                        className={errors.budgetMin ? "border-red-500" : ""}
                        disabled={isLoading}
                      />
                      {errors.budgetMin && (
                        <p className="text-sm text-red-500">{errors.budgetMin}</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Deadline */}
            <div className="space-y-2">
              <Label>
                Срок выполнения <span className="text-red-500">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left ${
                      errors.deadline ? "border-red-500" : ""
                    }`}
                    disabled={isLoading}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {deadline ? (
                      format(deadline, "d MMMM yyyy", { locale: ru })
                    ) : (
                      <span className="text-gray-500">Выберите дату</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={deadline}
                    onSelect={(date) => {
                      setDeadline(date);
                      if (errors.deadline) setErrors({ ...errors, deadline: "" });
                    }}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.deadline && (
                <p className="text-sm text-red-500">{errors.deadline}</p>
              )}
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">
                Локация <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="location"
                  placeholder="Москва, улица Ленина 10"
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    if (errors.location) setErrors({ ...errors, location: "" });
                  }}
                  className={`pl-10 ${errors.location ? "border-red-500" : ""}`}
                  disabled={isLoading}
                />
              </div>
              <p className="text-sm text-gray-500">
                Укажите точный адрес или район
              </p>
              {errors.location && (
                <p className="text-sm text-red-500">{errors.location}</p>
              )}
            </div>

            {/* Info Card */}
            <Card className="p-4 bg-blue-50 border-blue-200">
              <h3 className="text-sm font-medium mb-2">💡 Советы для успешной публикации:</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Используйте понятное и конкретное название</li>
                <li>• Подробно опишите задачу и требования</li>
                <li>• Укажите реальный бюджет для привлечения исполнителей</li>
                <li>• Будьте на связи для ответов на вопросы</li>
              </ul>
            </Card>

            {/* Submit Error */}
            {errors.submit && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{errors.submit}</p>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="flex-1"
                disabled={isLoading}
              >
                Отмена
              </Button>
              <Button
                type="button"
                onClick={handleSubmit}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Создание...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Опубликовать задачу
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
}