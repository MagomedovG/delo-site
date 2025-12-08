'use client'

import { useState, useEffect, useRef, use } from "react";
import { ArrowLeft, Send, MoreVertical, Check, CheckCheck, Loader2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useAuthFetchWithBase } from "@/hooks/useAuthFetchWithBase";

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
  sender_name: string;
  sender_avatar?: string;
}

interface ConversationDetails {
  id: string;
  task_id: string;
  task_title: string;
  poster_id: string;
  tasker_id: string;
  other_user_id: string;
  other_user_name: string;
  other_user_avatar?: string;
  status: string;
}

interface MessagesResponse {
  success: boolean;
  data: Message[];
}

interface ConversationResponse {
  success: boolean;
  data: ConversationDetails;
}

export default function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: conversationId } = use(params);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversation, setConversation] = useState<ConversationDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const authFetch = useAuthFetchWithBase();

  // Получить ID текущего пользователя из токена
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUserId(payload.userId || payload.id);
      } catch (e) {
        console.error("Error parsing token:", e);
      }
    }
  }, []);

  // Загрузить данные беседы
  const fetchConversation = async () => {
    try {
      const response = await authFetch(`/chat/conversations/${conversationId}`);
      if (response.ok) {
        const data: ConversationResponse = await response.json();
        if (data.success) {
          setConversation(data.data);
        }
      }
    } catch (err) {
      console.error("Error fetching conversation:", err);
    }
  };

  // Загрузить сообщения
  const fetchMessages = async () => {
    try {
      setError(null);
      const response = await authFetch(`/chat/conversations/${conversationId}/messages`);
      
      if (response.ok) {
        const data: MessagesResponse = await response.json();
        if (data.success) {
          setMessages(data.data || []);
        }
      } else {
        throw new Error(`Ошибка загрузки: ${response.status}`);
      }
    } catch (err: any) {
      console.error("Error fetching messages:", err);
      if (err.message !== 'Требуется авторизация') {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Отметить как прочитанные
  const markAsRead = async () => {
    try {
      await authFetch(`/chat/conversations/${conversationId}/read`, {
        method: "POST"
      });
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  useEffect(() => {
    if (conversationId) {
      fetchConversation();
      fetchMessages();
      markAsRead();
      
      // Периодически обновлять сообщения
      const interval = setInterval(() => {
        fetchMessages();
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [conversationId]);

  // Прокрутить вниз при новых сообщениях
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || sending) return;
    
    const messageContent = input.trim();
    setInput("");
    setSending(true);
    
    try {
      const response = await authFetch(`/chat/conversations/${conversationId}/messages`, {
        method: "POST",
        body: JSON.stringify({ content: messageContent })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setMessages(prev => [...prev, data.data]);
        }
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Ошибка отправки сообщения");
        setInput(messageContent); // Вернуть текст в поле ввода
      }
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Ошибка при отправке сообщения");
      setInput(messageContent);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "Сегодня";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Вчера";
    } else {
      return date.toLocaleDateString("ru-RU", { day: "numeric", month: "long" });
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

  // Группировка сообщений по дате
  const groupedMessages = messages.reduce((groups: { [key: string]: Message[] }, message) => {
    const date = new Date(message.created_at).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <p className="text-red-600 mb-4">{error}</p>
        <Link href="/home/messages" className="text-blue-600 hover:underline">
          Вернуться к сообщениям
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="w-full bg-white border-b px-4 py-3 flex items-center gap-3 sticky top-0 z-10 md:max-w-2xl md:mx-auto">
        <Link href="/home/messages" className="cursor-pointer hover:bg-gray-100 p-1 rounded">
          <ArrowLeft size={22} />
        </Link>

        <div className="flex items-center gap-3 flex-1">
          <div className="relative">
            {conversation?.other_user_avatar ? (
              <img 
                src={conversation.other_user_avatar} 
                alt={conversation.other_user_name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-lg text-blue-600 font-medium">
                {getInitials(conversation?.other_user_name || "?")}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="font-semibold text-[15px] truncate">
              {conversation?.other_user_name || "Загрузка..."}
            </div>
            {conversation?.task_title && (
              <div className="text-sm text-gray-500 truncate">
                {conversation.task_title}
              </div>
            )}
          </div>
        </div>

        <button className="hover:bg-gray-100 p-2 rounded">
          <MoreVertical size={20} />
        </button>
      </div>

      {/* Task box */}
      {conversation?.task_id && (
        <div className="bg-[#eef4ff] border border-[#d8e3ff] mx-4 my-4 p-4 rounded-2xl text-sm md:max-w-2xl md:mx-auto w-[calc(100%-2rem)]">
          <div className="text-gray-500 mb-1">Задача:</div>
          <div className="font-medium">{conversation.task_title}</div>
          <Link 
            href={`/home/tasks/${conversation.task_id}`}
            className="text-blue-600 font-medium mt-2 inline-flex items-center gap-1 hover:underline"
          >
            <ExternalLink size={14} />
            Открыть
          </Link>
        </div>
      )}

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto px-4 md:max-w-2xl md:mx-auto w-full">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-12 text-gray-500">
            <p className="text-center">Нет сообщений</p>
            <p className="text-sm mt-1">Начните переписку!</p>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            {Object.entries(groupedMessages).map(([date, dateMessages]) => (
              <div key={date}>
                {/* Date separator */}
                <div className="flex justify-center mb-4">
                  <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                    {formatDate(dateMessages[0].created_at)}
                  </span>
                </div>
                
                {/* Messages for this date */}
                <div className="space-y-3">
                  {dateMessages.map((msg) => {
                    const isMe = msg.sender_id === currentUserId;
                    return (
                      <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[80%] p-3 rounded-2xl text-[15px] leading-snug shadow-sm ${
                            isMe
                              ? "bg-blue-600 text-white rounded-br-none"
                              : "bg-white text-gray-800 border rounded-bl-none"
                          }`}
                        >
                          <div className="whitespace-pre-wrap break-words">{msg.content}</div>
                          <div className={`text-xs mt-1 flex items-center gap-1 ${isMe ? "opacity-75" : "text-gray-400"}`}>
                            {formatTime(msg.created_at)}
                            {isMe && (
                              msg.is_read ? (
                                <CheckCheck size={14} className="text-blue-200" />
                              ) : (
                                <Check size={14} />
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="border-t bg-white p-3 md:max-w-2xl md:mx-auto w-full">
        <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-xl border">
          <input
            className="flex-1 bg-transparent outline-none text-sm px-2"
            placeholder="Напишите сообщение..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={sending}
          />

          <button 
            className={`p-2 rounded-xl transition-colors ${
              input.trim() && !sending
                ? "bg-blue-600 text-white hover:bg-blue-700" 
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
            onClick={handleSend}
            disabled={!input.trim() || sending}
          >
            {sending ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

