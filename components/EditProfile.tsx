//edit-profile.tsx
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ArrowLeft, User, Upload, Save, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import Cookies from 'js-cookie';
import { useAuthFetchWithBase } from "@/hooks/useAuthFetchWithBase";

interface EditProfileData {
  name: string;
  bio: string;
  location: string;
  phone: string;
  email: string;
  role: "poster" | "tasker" | "both";
  avatar?: string;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  bio?: string;
  location?: string;
  phone?: string;
  role: "poster" | "tasker" | "both";
  avatar?: string;
  memberSince: string;
  completedTasks: number;
  rating: number;
  reviewsCount: number;
}

interface UserResponse {
  success: boolean;
  data: UserData;
}

interface EditProfileProps {
  onBack: () => void;
  onSave: (data: EditProfileData) => void;
}

export function EditProfile({ onBack, onSave }: EditProfileProps) {
  const [formData, setFormData] = useState<EditProfileData>({
    name: "",
    bio: "",
    location: "",
    phone: "",
    email: "",
    role: "both",
    avatar: undefined
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fetchError, setFetchError] = useState<string | null>(null);
  
  const authFetch = useAuthFetchWithBase();

  // Загрузка данных пользователя
  const fetchUserData = async () => {
    const token = Cookies.get('access');
    if (!token) {
      setFetchError("Требуется авторизация");
      setLoading(false);
      return;
    }

    try {
      const response = await authFetch(`/auth/me`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`);
      }

      const data: UserResponse = await response.json();
      
      if (data.success) {
        // Преобразуем данные из API в форму
        setFormData({
          name: data.data.name || "",
          bio: data.data.bio || "",
          location: data.data.location || "",
          phone: data.data.phone || "",
          email: data.data.email || "",
          role: data.data.role || "both",
          avatar: data.data.avatar
        });
      } else {
        throw new Error("Не удалось загрузить данные пользователя");
      }
    } catch (err) {
      console.error("Ошибка при загрузке данных пользователя:", err);
      setFetchError(err instanceof Error ? err.message : "Ошибка при загрузке данных");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleChange = (field: keyof EditProfileData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Очищаем ошибку при изменении поля
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Введите имя";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Имя должно содержать минимум 2 символа";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Укажите город";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Введите номер телефона";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Введите email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Введите корректный email";
    }

    if (formData.bio.length > 500) {
      newErrors.bio = "Описание не должно превышать 500 символов";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    setErrors({});

    try {
      // Отправляем данные на сервер
      const response = await authFetch(`/users/profile`, {
        method: "PUT",
        body: JSON.stringify({
          name: formData.name.trim(),
          bio: formData.bio.trim(),
          location: formData.location.trim(),
          phone: formData.phone.trim(),
          role: formData.role
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Вызываем колбэк onSave с обновленными данными
          onSave(formData);
        } else {
          setErrors({ submit: data.message || "Ошибка при сохранении" });
        }
      } else {
        const errorData = await response.json();
        setErrors({ submit: errorData.message || "Ошибка сервера" });
      }
    } catch (error) {
      console.error("Ошибка при сохранении профиля:", error);
      setErrors({ submit: "Ошибка сети. Проверьте подключение к интернету." });
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = () => {
    // Здесь будет логика загрузки аватара
    alert("Функция загрузки фото будет доступна после подключения к серверу");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Загрузка профиля...</p>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-2xl mx-auto px-4 py-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-5 w-5 mr-2" />
              Назад
            </Button>
          </div>
        </header>
        <main className="max-w-2xl mx-auto px-4 py-6">
          <Card className="p-6 text-center">
            <div className="text-red-600 mb-4">
              <p className="text-lg font-medium">Ошибка загрузки</p>
              <p className="text-sm mt-2">{fetchError}</p>
            </div>
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
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-5 w-5 mr-2" />
              Отмена
            </Button>
            <h1 className="text-xl">Редактировать профиль</h1>
            <div className="w-20" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit}>
          <Card className="p-6 space-y-6">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-32 w-32">
                <AvatarImage src={formData.avatar} />
                <AvatarFallback className="bg-blue-100 text-blue-600 text-4xl">
                  <User className="h-16 w-16" />
                </AvatarFallback>
              </Avatar>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAvatarUpload}
              >
                <Upload className="h-4 w-4 mr-2" />
                Загрузить фото
              </Button>
              <p className="text-xs text-gray-500 text-center">
                Рекомендуемый размер: 400x400px
                <br />
                Формат: JPG, PNG
              </p>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Имя <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Введите ваше имя"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className={errors.name ? "border-red-500" : ""}
                disabled={saving}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Role */}
            <div className="space-y-2">
              <Label htmlFor="role">
                Роль на платформе <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.role}
                onValueChange={(value: any) => handleChange("role", value)}
                disabled={saving}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="poster">Заказчик</SelectItem>
                  <SelectItem value="tasker">Исполнитель</SelectItem>
                  <SelectItem value="both">Заказчик и Исполнитель</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">О себе</Label>
              <Textarea
                id="bio"
                placeholder="Расскажите о себе, своих навыках и опыте"
                value={formData.bio}
                onChange={(e) => handleChange("bio", e.target.value)}
                rows={4}
                className={errors.bio ? "border-red-500" : ""}
                disabled={saving}
              />
              <p className="text-sm text-gray-500">
                {formData.bio.length}/500 символов
              </p>
              {errors.bio && (
                <p className="text-sm text-red-500">{errors.bio}</p>
              )}
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">
                Город <span className="text-red-500">*</span>
              </Label>
              <Input
                id="location"
                type="text"
                placeholder="Москва"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                className={errors.location ? "border-red-500" : ""}
                disabled={saving}
              />
              {errors.location && (
                <p className="text-sm text-red-500">{errors.location}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">
                Телефон <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+7 (999) 123-45-67"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className={errors.phone ? "border-red-500" : ""}
                disabled={saving}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone}</p>
              )}
              <p className="text-sm text-gray-500">
                Телефон будет виден только после принятия вашего отклика
              </p>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={errors.email ? "border-red-500" : ""}
                disabled={true} // Email обычно нельзя менять
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
              <p className="text-sm text-gray-500">
                Email нельзя изменить
              </p>
            </div>

            {/* Info Card */}
            <Card className="p-4 bg-blue-50 border-blue-200">
              <h3 className="text-sm mb-2">ℹ️ Конфиденциальность</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Ваш телефон и email не публикуются в профиле</li>
                <li>• Контакты становятся доступны только принятым исполнителям</li>
                <li>• Вы можете изменить настройки приватности в любое время</li>
              </ul>
            </Card>

            {/* Submit Error */}
            {errors.submit && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{errors.submit}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="flex-1"
                disabled={saving}
              >
                Отмена
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Сохранение...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Сохранить изменения
                  </>
                )}
              </Button>
            </div>
          </Card>
        </form>
      </main>
    </div>
  );
}