"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, MessageCircle, Loader2 } from "lucide-react";
import { useAuthFetchWithBase } from "@/hooks/useAuthFetchWithBase";

interface Conversation {
  id: string;
  task_id: string;
  task_title: string;
  other_user_id: string;
  other_user_name: string;
  other_user_avatar?: string;
  last_message?: string;
  last_message_at?: string;
  unread_count: number;
  status: string;
  created_at: string;
}

interface ConversationsResponse {
  success: boolean;
  data: Conversation[];
}

export default function Messages() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const authFetch = useAuthFetchWithBase();

  const fetchConversations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authFetch('/chat/conversations');
      
      if (!response.ok) {
        throw new Error(`Ошибка загрузки: ${response.status}`);
      }
      
      const data: ConversationsResponse = await response.json();
      
      if (data.success) {
        setConversations(data.data || []);
      } else {
        throw new Error("Не удалось загрузить переписки");
      }
    } catch (err: any) {
      console.error("Ошибка при загрузке переписок:", err);
      if (err.message !== 'Требуется авторизация') {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const formatTime = (dateString?: string) => {
    if (!dateString) return "";
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffHours < 24) {
      return date.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
    } else if (diffDays === 1) {
      return "Вчера";
    } else if (diffDays < 7) {
      return date.toLocaleDateString("ru-RU", { weekday: "short" });
    } else {
      return date.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const totalUnread = conversations.reduce((sum, conv) => sum + (conv.unread_count || 0), 0);

  const filteredConversations = conversations.filter(conv => 
    conv.other_user_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.task_title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full bg-white rounded-xl shadow-sm min-h-[400px]">
      {/* Header */}
      <div className="px-6 py-4 border-b">
        <div className="flex items-center gap-4">
          <Link href="/home" className="cursor-pointer hover:bg-gray-100 p-1 rounded">
            <ArrowLeft size={22} />
          </Link>
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold mb-1">Сообщения</h2>
            <p className="text-sm text-gray-500">
              {loading ? "Загрузка..." : `${totalUnread} непрочитанных`}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <input
            placeholder="Поиск по чатам..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 border-b border-red-200">
          <p className="text-red-600 text-center text-sm">{error}</p>
          <button 
            onClick={fetchConversations}
            className="block mx-auto mt-2 text-sm text-blue-600 hover:underline"
          >
            Попробовать снова
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filteredConversations.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <MessageCircle className="h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            {searchQuery ? "Ничего не найдено" : "Нет сообщений"}
          </h3>
          <p className="text-sm text-gray-500 text-center">
            {searchQuery 
              ? "Попробуйте изменить поисковый запрос" 
              : "Начните переписку, откликнувшись на задачу или написав исполнителю"
            }
          </p>
        </div>
      )}

      {/* Chats */}
      {!loading && !error && filteredConversations.length > 0 && (
        <div className="divide-y">
          {filteredConversations.map((conv) => (
            <Link
              key={conv.id}
              href={`/chat/${conv.id}`}
              className="flex items-start gap-4 px-6 py-5 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                {conv.other_user_avatar ? (
                  <img 
                    src={conv.other_user_avatar} 
                    alt={conv.other_user_name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-lg text-blue-600 font-medium">
                    {getInitials(conv.other_user_name || "?")}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium truncate">{conv.other_user_name}</span>
                      <span className="text-xs inline-block bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md truncate max-w-[200px]">
                        {conv.task_title}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-400 flex-shrink-0">
                    {formatTime(conv.last_message_at)}
                  </div>
                </div>

                <div className="text-sm mt-1 line-clamp-1 text-gray-600">
                  {conv.last_message || "Нет сообщений"}
                </div>
              </div>

              {/* Unread */}
              {conv.unread_count > 0 && (
                <span className="min-w-[24px] h-6 bg-blue-600 text-white text-sm flex items-center justify-center rounded-full flex-shrink-0">
                  {conv.unread_count}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
