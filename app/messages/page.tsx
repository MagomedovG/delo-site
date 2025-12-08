'use client'
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MessageCircle, ArrowLeft, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Cookies from 'js-cookie';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api/v1";

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
}

export default function MessagesPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const token = Cookies.get('access');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchConversations();
  }, [router]);

  const fetchConversations = async () => {
    const token = Cookies.get('access');
    if (!token) return;

    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/chat/conversations`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setConversations(data.data || []);
        }
      }
    } catch (err) {
      console.error("Ошибка загрузки диалогов:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
    } else if (days === 1) {
      return "Вчера";
    } else if (days < 7) {
      return date.toLocaleDateString("ru-RU", { weekday: "short" });
    } else {
      return date.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.other_user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.task_title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="flex items-center gap-4 p-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold">Сообщения</h1>
          </div>
          
          <div className="px-4 pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Поиск по диалогам..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <MessageCircle className="h-16 w-16 text-gray-300 mb-4" />
            <h2 className="text-xl font-medium text-gray-700 mb-2">
              {searchQuery ? "Диалоги не найдены" : "Нет сообщений"}
            </h2>
            <p className="text-gray-500 text-center">
              {searchQuery 
                ? "Попробуйте изменить параметры поиска"
                : "Сообщения появятся, когда вы начнёте обсуждать задачи с исполнителями или заказчиками"
              }
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {filteredConversations.map((conv, index) => (
              <motion.div
                key={conv.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => router.push(`/messages/${conv.id}`)}
              >
                <div className="flex items-start gap-4 p-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={conv.other_user_avatar} />
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {conv.other_user_name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-medium truncate">
                        {conv.other_user_name}
                      </span>
                      <span className="text-xs text-gray-400 flex-shrink-0">
                        {formatTime(conv.last_message_at)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-500 truncate mb-1">
                      {conv.task_title}
                    </p>
                    
                    {conv.last_message && (
                      <p className={`text-sm truncate ${conv.unread_count > 0 ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                        {conv.last_message}
                      </p>
                    )}
                  </div>
                  
                  {conv.unread_count > 0 && (
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full min-w-[24px] text-center flex-shrink-0">
                      {conv.unread_count}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
