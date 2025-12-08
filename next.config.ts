import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Разрешённые origin для dev-сервера
  allowedDevOrigins: [
    'localhost:5000',
    '127.0.0.1:5000',
    'delo-backend.ru',
    '*',
  ],
  
  // Проксирование API запросов к бэкенду
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'http://localhost:8000/api/v1/:path*',
      },
    ];
  },
};

export default nextConfig;
