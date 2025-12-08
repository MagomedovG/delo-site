'use client'
import { useState } from "react";
import { ArrowLeft, Send, MoreVertical, Check } from "lucide-react";
import Link from "next/link";

// Mock messages
const messages = [
  {
    id: 1,
    fromMe: false,
    text: "Добрый день! Могу приехать завтра в 10:00. Вам удобно?",
    date: "7 нояб.",
  },
  {
    id: 2,
    fromMe: true,
    text: "Да, отлично! Буду ждать. Все инструменты с собой?",
    date: "7 нояб.",
  },
  {
    id: 3,
    fromMe: false,
    text: "Да, все необходимые инструменты будут. Также возьму шуруповерт и уровень.",
    date: "7 нояб.",
  },
];

export default function ChatPage() {
  const [input, setInput] = useState("");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="w-full bg-white border-b px-4 py-3 flex items-center gap-3 sticky top-0 z-10 md:max-w-xl md:mx-auto">
        <Link href="/home/messages" className="cursor-pointer">
          <ArrowLeft size={22} />
        </Link>

        <div className="flex items-center gap-3 flex-1">
          <div className="relative">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-lg">Д</div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
          </div>

          <div>
            <div className="font-semibold text-[15px]">Дмитрий Иванов</div>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              онлайн
            </div>
          </div>
        </div>

        <span className="hidden md:block bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-sm">Исполнитель</span>

        <button>
          <MoreVertical size={20} />
        </button>
      </div>

      {/* Task box */}
      <div className="bg-[#eef4ff] border border-[#d8e3ff] mx-4 my-4 p-4 rounded-2xl text-sm md:max-w-xl md:mx-auto">
        <div className="text-gray-500 mb-1">Задача:</div>
        <div className="font-medium">Ремонт сантехники в ванной</div>
        <button className="text-blue-600 font-medium mt-2">Открыть</button>
      </div>

      {/* System message */}
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 mx-4 p-4 rounded-2xl text-sm md:max-w-xl md:mx-auto">
        <div className="flex gap-2">
          <span>⚠️</span>
          Заказчик подтвердил начало сотрудничества. Теперь вы можете обсудить детали задачи.
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto mt-4 px-4 md:max-w-xl md:mx-auto space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.fromMe ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] p-3 rounded-2xl text-[15px] leading-snug shadow-sm ${
                msg.fromMe
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-white text-gray-800 border rounded-bl-none"
              }`}
            >
              {msg.text}
              <div className="text-xs mt-1 opacity-75 flex items-center gap-1">
                {msg.date}
                {msg.fromMe && <Check size={14} />}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom actions */}
      <div className="border-t bg-white p-3 mt-3 md:max-w-xl md:mx-auto w-full">
        <button className="w-full mb-3 border rounded-xl py-3 font-medium flex items-center justify-center gap-2 text-gray-700">
          <Check size={18} /> Завершить задачу
        </button>

        <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-xl border">
          <button className="text-gray-500">📎</button>

          <input
            className="flex-1 bg-transparent outline-none text-sm"
            placeholder="Напишите сообщение..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <button className="bg-blue-600 text-white p-2 rounded-xl">
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
