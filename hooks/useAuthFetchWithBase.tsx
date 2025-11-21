// hooks/useAuthFetch.ts
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

// Базовый вариант (нужно указывать полный URL)
export function useAuthFetch() {
  const router = useRouter();

  const authFetch = async (url: string, options: RequestInit = {}) => {
    const token = Cookies.get('access');
    
    // Подготавливаем заголовки
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Добавляем токен авторизации, если он есть
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Если получили 401 Unauthorized, перенаправляем на страницу логина
      if (response.status === 401) {
        Cookies.remove('authToken');
        localStorage.removeItem('user');
        router.push('/login');
        throw new Error('Требуется авторизация');
      }

      return response;
    } catch (error) {
      throw error;
    }
  };

  return authFetch;
}

// Вариант с авто-BASE_URL (удобнее)
export function useAuthFetchWithBase() {
  const router = useRouter();
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ;

  const authFetch = async (endpoint: string, options: RequestInit = {}) => {
    const token = Cookies.get('access');
    const url = `${BASE_URL}${endpoint}`;
    
    // Подготавливаем заголовки
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Добавляем токен авторизации, если он есть
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // if (response.status === 401) {
      //   Cookies.remove('access');
      //   localStorage.removeItem('user');
      //   router.push('/login');
      //   throw new Error('Требуется авторизация');
      // }

      return response;
    } catch (error) {
      throw error;
    }
  };

  return authFetch;
}