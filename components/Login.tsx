import { useState } from "react";
import Cookies from 'js-cookie';
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Eye, EyeOff, LogIn } from "lucide-react";
interface LoginProps {
  onLogin: (email: string, password: string, hasCompletedOnboarding:boolean, currentUserId:string) => void;
  onGoToRegister: () => void;
}

interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      avatar: string;
      rating: number;
      reviewsCount: number;
      completedTasks: number;
      hasCompletedOnboarding:boolean
    };
    accessToken: string;
    refreshToken:string;
    expiresIn: number;
  };
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export function Login({ onLogin, onGoToRegister }: LoginProps) {
  const [email, setEmail] = useState("mgmdvgg@mail.ru");
  const [password, setPassword] = useState("gamzatgamzat");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!email.trim()) {
      newErrors.email = "Введите email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Введите корректный email";
    }

    if (!password.trim()) {
      newErrors.password = "Введите пароль";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          rememberMe,
        }),
      });

      const data: LoginResponse = await response.json();

      if (response.ok && data.success) {
        // Успешный вход
        if (data.data) {
          // Сохраняем токен в куки
          // if (rememberMe) {
            // Запоминаем на 30 дней
            Cookies.set('access', data.data.accessToken, { 
              expires: 30,
              path: '/',
              sameSite: 'strict'
            });
            Cookies.set('refresh', data.data.refreshToken, { 
              expires: 30,
              path: '/',
              sameSite: 'strict'
            });
          // } else {
          //   // Сессионная кука (удалится при закрытии браузера)
          //   Cookies.set('authToken', data.data.accessToken, {
          //     path: '/',
          //     sameSite: 'strict'
          //   });
          // }
          
          // Также сохраняем пользователя в localStorage для быстрого доступа
          localStorage.setItem("user", JSON.stringify(data.data.user));
        }
        
        // Вызываем колбэк onLogin
        onLogin(email, password, data?.data?.user.hasCompletedOnboarding, data?.data?.user.id);
      } else {
        // Ошибка аутентификации
        setErrors({ 
          submit: data.message || "Произошла ошибка при входе" 
        });
      }
    } catch (error) {
      console.error("Ошибка при входе:", error);
      setErrors({ 
        submit: "Ошибка сети. Проверьте подключение к интернету." 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl text-blue-600">Delo</h1>
          <p className="text-gray-600">
            Платформа для публикации задач и поиска работы
          </p>
        </div>

        {/* Login Form */}
        <Card className="p-8">
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <h2 className="text-2xl">Вход</h2>
              <p className="text-sm text-gray-600">
                Войдите в свой аккаунт
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@mail.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) {
                      setErrors({ ...errors, email: "" });
                    }
                  }}
                  className={errors.email ? "border-red-500" : ""}
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Введите пароль"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) {
                        setErrors({ ...errors, password: "" });
                      }
                    }}
                    className={errors.password ? "border-red-500 pr-10" : "pr-10"}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    disabled={isLoading}
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm text-gray-600 cursor-pointer"
                  >
                    Запомнить меня
                  </label>
                </div>
                <Button
                  type="button"
                  variant="link"
                  className="text-sm text-blue-600 p-0 h-auto"
                  disabled={isLoading}
                >
                  Забыли пароль?
                </Button>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                <LogIn className="h-4 w-4 mr-2" />
                {isLoading ? "Вход..." : "Войти"}
              </Button>

              {/* Submit Error */}
              {errors.submit && (
                <p className="text-sm text-red-500 text-center">{errors.submit}</p>
              )}
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">или</span>
              </div>
            </div>

            {/* Register Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Нет аккаунта?{" "}
                <Button
                  type="button"
                  variant="link"
                  className="text-blue-600 p-0 h-auto"
                  onClick={onGoToRegister}
                  disabled={isLoading}
                >
                  Зарегистрируйтесь
                </Button>
              </p>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500">
          Нажимая "Войти", вы принимаете наши{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Условия использования
          </a>{" "}
          и{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Политику конфиденциальности
          </a>
        </p>
      </div>
    </div>
  );
}