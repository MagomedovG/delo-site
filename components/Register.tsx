import { useState } from "react";
import Cookies from 'js-cookie';
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { useAuthFetchWithBase } from "@/hooks/useAuthFetchWithBase";

interface RegisterProps {
  onRegister: (name: string, email: string, password: string) => void;
  onGoToLogin: () => void;
}

interface RegisterResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: string;
      name: string;
      email: string;
      role: string | null;
      createdAt: string;
    };
    token: string;
  };
  errors?: Record<string, string>;
}

export function Register({ onRegister, onGoToLogin }: RegisterProps) {
  const [name, setName] = useState("MagomedovG");
  const [email, setEmail] = useState("gamzat9953@gmail.com");
  const [password, setPassword] = useState("gamzatgamzat");
  const [confirmPassword, setConfirmPassword] = useState("gamzatgamzat");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";
  const authFetch = useAuthFetchWithBase();
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Введите имя";
    } else if (name.trim().length < 2) {
      newErrors.name = "Имя должно содержать минимум 2 символа";
    }

    if (!email.trim()) {
      newErrors.email = "Введите email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Введите корректный email";
    }

    if (!password.trim()) {
      newErrors.password = "Введите пароль";
    } else if (password.length < 6) {
      newErrors.password = "Пароль должен содержать минимум 6 символов";
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Подтвердите пароль";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Пароли не совпадают";
    }

    if (!agreeToTerms) {
      newErrors.terms = "Необходимо принять условия использования";
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
      const response = await authFetch(`/auth/register`, {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          confirmPassword,
        }),
      });

      const data: RegisterResponse = await response.json();

      if (response.status === 201 && data.success) {
        // Успешная регистрация
        if (data.data) {
          // Сохраняем токен в куки (на 30 дней)
          Cookies.set('authToken', data.data.token, { 
            expires: 30,
            path: '/',
            sameSite: 'strict'
          });
          
          // Сохраняем данные пользователя в localStorage для быстрого доступа
          localStorage.setItem("user", JSON.stringify(data.data.user));
        }
        
        // Вызываем колбэк onRegister
        onRegister(name, email, password);
      } else {
        // Ошибка регистрации
        if (data.errors) {
          // Ошибки валидации от сервера
          setErrors(data.errors);
        } else {
          setErrors({ 
            submit: data.message || "Произошла ошибка при регистрации" 
          });
        }
      }
    } catch (error) {
      console.error("Ошибка при регистрации:", error);
      setErrors({ 
        submit: "Ошибка сети. Проверьте подключение к интернету." 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = () => {
    if (!password) return { text: "", color: "" };
    
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2) return { text: "Слабый", color: "text-red-500" };
    if (strength <= 3) return { text: "Средний", color: "text-yellow-500" };
    return { text: "Сильный", color: "text-green-500" };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl text-blue-600">Delo</h1>
          <p className="text-gray-600">
            Создайте аккаунт и начните работать
          </p>
        </div>

        {/* Register Form */}
        <Card className="p-8">
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <h2 className="text-2xl">Регистрация</h2>
              <p className="text-sm text-gray-600">
                Заполните данные для создания аккаунта
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  Имя <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Иван Иванов"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) {
                      setErrors({ ...errors, name: "" });
                    }
                  }}
                  className={errors.name ? "border-red-500" : ""}
                  disabled={isLoading}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
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
                <Label htmlFor="password">
                  Пароль <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Минимум 6 символов"
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
                {password && (
                  <p className={`text-sm ${passwordStrength.color}`}>
                    Надёжность пароля: {passwordStrength.text}
                  </p>
                )}
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  Подтвердите пароль <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Повторите пароль"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword) {
                        setErrors({ ...errors, confirmPassword: "" });
                      }
                    }}
                    className={errors.confirmPassword ? "border-red-500 pr-10" : "pr-10"}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Terms Agreement */}
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Checkbox
                    id="terms"
                    checked={agreeToTerms}
                    onCheckedChange={(checked) => {
                      setAgreeToTerms(checked as boolean);
                      if (errors.terms) {
                        setErrors({ ...errors, terms: "" });
                      }
                    }}
                    className="mt-1"
                    disabled={isLoading}
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm text-gray-600 cursor-pointer"
                  >
                    Я принимаю{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      Условия использования
                    </a>{" "}
                    и{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      Политику конфиденциальности
                    </a>
                  </label>
                </div>
                {errors.terms && (
                  <p className="text-sm text-red-500">{errors.terms}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                {isLoading ? "Регистрация..." : "Зарегистрироваться"}
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

            {/* Login Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Уже есть аккаунт?{" "}
                <Button
                  type="button"
                  variant="link"
                  className="text-blue-600 p-0 h-auto"
                  onClick={onGoToLogin}
                  disabled={isLoading}
                >
                  Войдите
                </Button>
              </p>
            </div>
          </div>
        </Card>

        {/* Info */}
        <Card className="p-4 bg-blue-50 border-blue-200">
          <p className="text-sm text-gray-700">
            ℹ️ После регистрации вы сможете публиковать задачи или откликаться на них как исполнитель
          </p>
        </Card>
      </div>
    </div>
  );
}