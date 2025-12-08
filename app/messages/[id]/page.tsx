'use client'
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Send, Loader2, ExternalLink, Check, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Cookies from 'js-cookie';
import { io, Socket } from 'socket.io-client';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api/v1";
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "";

interface Message {
  id: string;
  sender_id: string;
  sender_name: string;
  sender_avatar?: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

interface Conversation {
  id: string;
  task_id: string;
  task_title: string;
  other_user_id: string;
  other_user_name: string;
  other_user_avatar?: string;
  status: string;
}

export default function ChatPage() {
  const router = useRouter();
  const params = useParams();
  const conversationId = params.id as string;
  
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    const token = Cookies.get('access');
    if (!token) {
      router.push('/login');
      return;
    }

    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUserId(user.id);
      } catch (e) {
        console.error("Error parsing user:", e);
      }
    }

    fetchConversation();
    fetchMessages();

    const socketUrl = SOCKET_URL || window.location.origin.replace(':5000', ':8000');
    socketRef.current = io(socketUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    socketRef.current.on('connect', () => {
      console.log('Socket connected');
      socketRef.current?.emit('join_conversation', conversationId);
    });

    socketRef.current.on('new_message', (message: Message) => {
      setMessages(prev => {
        const exists = prev.some(m => m.id === message.id);
        if (exists) return prev;
        return [...prev, message];
      });
      scrollToBottom();
      
      markAsRead();
    });

    socketRef.current.on('message_read', () => {
      setMessages(prev => prev.map(m => ({ ...m, is_read: true })));
    });

    socketRef.current.on('typing', (data: { userId: string }) => {
      if (data.userId !== currentUserId) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 3000);
      }
    });

    return () => {
      socketRef.current?.emit('leave_conversation', conversationId);
      socketRef.current?.disconnect();
    };
  }, [conversationId, router, scrollToBottom, currentUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const fetchConversation = async () => {
    const token = Cookies.get('access');
    if (!token) return;

    try {
      const response = await fetch(`${BASE_URL}/chat/conversations/${conversationId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setConversation(data.data);
        }
      } else if (response.status === 404) {
        router.push('/messages');
      }
    } catch (err) {
      console.error("Ошибка загрузки диалога:", err);
    }
  };

  const fetchMessages = async () => {
    const token = Cookies.get('access');
    if (!token) return;

    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/chat/conversations/${conversationId}/messages`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setMessages(data.data?.messages || []);
          markAsRead();
        }
      }
    } catch (err) {
      console.error("Ошибка загрузки сообщений:", err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async () => {
    const token = Cookies.get('access');
    if (!token) return;

    try {
      await fetch(`${BASE_URL}/chat/conversations/${conversationId}/read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.error("Ошибка отметки прочтения:", err);
    }
  };

  const sendMessage = async () => {
    const token = Cookies.get('access');
    if (!token || !messageText.trim() || sending) return;

    try {
      setSending(true);
      const response = await fetch(`${BASE_URL}/chat/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: messageText.trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setMessages(prev => {
            const exists = prev.some(m => m.id === data.data.id);
            if (exists) return prev;
            return [...prev, data.data];
          });
          setMessageText("");
          scrollToBottom();
        }
      }
    } catch (err) {
      console.error("Ошибка отправки сообщения:", err);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleTyping = () => {
    socketRef.current?.emit('typing', conversationId);
  };

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
  };

  const formatMessageDate = (dateString: string) => {
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

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { date: string; messages: Message[] }[] = [];
    let currentDate = "";

    messages.forEach(message => {
      const messageDate = new Date(message.created_at).toDateString();
      if (messageDate !== currentDate) {
        currentDate = messageDate;
        groups.push({ date: message.created_at, messages: [message] });
      } else {
        groups[groups.length - 1].messages.push(message);
      }
    });

    return groups;
  };

  if (loading && !conversation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center gap-3 p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/messages')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          {conversation && (
            <div 
              className="flex items-center gap-3 flex-1 cursor-pointer"
              onClick={() => router.push(`/user-profile/${conversation.other_user_id}`)}
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={conversation.other_user_avatar} />
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  {conversation.other_user_name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{conversation.other_user_name}</p>
                <p className="text-xs text-gray-500 truncate">
                  {isTyping ? "печатает..." : conversation.task_title}
                </p>
              </div>
            </div>
          )}
          
          {conversation && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push(`/task-detail/${conversation.task_id}`)}
              title="Перейти к задаче"
            >
              <ExternalLink className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-4">
          {messages.length === 0 && !loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <p className="text-center">Напишите первое сообщение, чтобы начать диалог</p>
            </div>
          ) : (
            messageGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                <div className="flex justify-center my-4">
                  <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                    {formatMessageDate(group.date)}
                  </span>
                </div>
                
                {group.messages.map((message, index) => {
                  const isOwn = message.sender_id === currentUserId;
                  
                  return (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className={`flex mb-3 ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex gap-2 max-w-[75%] ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                        {!isOwn && (
                          <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarImage src={message.sender_avatar} />
                            <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">
                              {message.sender_name?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        
                        <div
                          className={`px-4 py-2 rounded-2xl ${
                            isOwn 
                              ? 'bg-blue-600 text-white rounded-br-md' 
                              : 'bg-white text-gray-900 rounded-bl-md shadow-sm'
                          }`}
                        >
                          <p className="whitespace-pre-wrap break-words">{message.content}</p>
                          <div className={`flex items-center gap-1 mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                            <span className={`text-xs ${isOwn ? 'text-blue-200' : 'text-gray-400'}`}>
                              {formatMessageTime(message.created_at)}
                            </span>
                            {isOwn && (
                              message.is_read 
                                ? <CheckCheck className="h-3 w-3 text-blue-200" />
                                : <Check className="h-3 w-3 text-blue-200" />
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="bg-white border-t sticky bottom-0">
        <div className="max-w-2xl mx-auto p-4">
          <div className="flex gap-3">
            <Textarea
              ref={textareaRef}
              placeholder="Напишите сообщение..."
              value={messageText}
              onChange={(e) => {
                setMessageText(e.target.value);
                handleTyping();
              }}
              onKeyDown={handleKeyDown}
              className="min-h-[44px] max-h-[120px] resize-none"
              rows={1}
              disabled={conversation?.status === 'blocked'}
            />
            <Button
              onClick={sendMessage}
              disabled={!messageText.trim() || sending || conversation?.status === 'blocked'}
              className="px-4"
            >
              {sending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
          {conversation?.status === 'blocked' && (
            <p className="text-red-500 text-sm text-center mt-2">
              Этот диалог заблокирован
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
