// hooks/useAuthFetch.ts
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

// Базовый вариант (нужно указывать полный URL)
export function useAuthFetch() {
  const router = useRouter();

  const refreshTokens = async (): Promise<boolean> => {
    try {
      const refreshToken = Cookies.get('refresh');
      
      if (!refreshToken) {
        throw new Error('Refresh token not found');
      }

      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh_token: refreshToken
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.success && data.data) {
          // Сохраняем новые токены в куки
          Cookies.set('access', data.data.accessToken);
          Cookies.set('refresh', data.data.refreshToken);
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Error refreshing tokens:', error);
      return false;
    }
  };

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
      let response = await fetch(url, {
        ...options,
        headers,
      });

      // Если получили 401 Unauthorized, пытаемся обновить токены
      if (response.status === 401) {
        const refreshSuccess = await refreshTokens();
        
        if (refreshSuccess) {
          // Повторяем оригинальный запрос с новым токеном
          const newToken = Cookies.get('access');
          if (newToken) {
            headers['Authorization'] = `Bearer ${newToken}`;
          }
          
          response = await fetch(url, {
            ...options,
            headers,
          });
        } else {
          // Если обновление токенов не удалось, разлогиниваем пользователя
          Cookies.remove('access');
          Cookies.remove('refresh');
          localStorage.removeItem('user');
          router.push('/login');
          throw new Error('Сессия истекла. Требуется повторная авторизация');
        }
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
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const refreshTokens = async (): Promise<boolean> => {
    try {
      const refreshToken = Cookies.get('refresh');
      
      if (!refreshToken) {
        throw new Error('Refresh token not found');
      }

      const response = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refreshToken
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.success && data.data) {
          // Сохраняем новые токены в куки
          Cookies.set('access', data.data.accessToken);
          Cookies.set('refresh', data.data.refreshToken);
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Error refreshing tokens:', error);
      return false;
    }
  };

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
      let response = await fetch(url, {
        ...options,
        headers,
      });

      // Если получили 401 Unauthorized, пытаемся обновить токены
      if (response.status === 401) {
        const refreshSuccess = await refreshTokens();
        
        if (refreshSuccess) {
          // Повторяем оригинальный запрос с новым токеном
          const newToken = Cookies.get('access');
          if (newToken) {
            headers['Authorization'] = `Bearer ${newToken}`;
          }
          
          response = await fetch(url, {
            ...options,
            headers,
          });
        } else {
          // Если обновление токенов не удалось, разлогиниваем пользователя
          // Cookies.remove('access');
          // Cookies.remove('refresh');
          // localStorage.removeItem('user');
          // router.push('/login');
          throw new Error('Сессия истекла. Требуется повторная авторизация');
        }
      }

      return response;
    } catch (error) {
      throw error;
    }
  };

  return authFetch;
}