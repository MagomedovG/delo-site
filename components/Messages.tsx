"use client"

import Link from "next/link";
import MainHeader from "./MainHeader";
import { ArrowLeft } from "lucide-react";

// Mock data — replace with your API data
const chats = [
  {
    id: 1,
    name: "Дмитрий Иванов",
    role: "Исполнитель",
    task: "Ремонт сантехники в ванной",
    message: "Да, все необходимые инструменты будут. Также возьму шурупове..",
    time: "10:12",
    unread: 2,
    online: true,
  },
  {
    id: 2,
    name: "Игорь Соколов",
    role: "Исполнитель",
    task: "Установка кондиционера",
    message: "Уже в пути, буду через 15 минут",
    time: "09:45",
    unread: 1,
    online: false,
  },
  {
    id: 3,
    name: "Сергей Петров",
    role: "Исполнитель",
    task: "Доставка мебели из IKEA",
    message: "Спасибо за заказ! Доставка завтра с 14:00 до 16:0(",
    time: "Вчера",
    unread: 0,
    online: false,
  },
  {
    id: 4,
    name: "Мария Кузнецова",
    role: "Исполнитель",
    task: "Уборка квартиры после ремонта",
    message: "Работа полностью выполнена, фото выслала в ч",
    time: "Вчера",
    unread: 0,
    online: false,
  },
  {
    id: 5,
    name: "Елена Смирнова",
    role: "Исполнитель",
    task: "Нужен репетитор по математике",
    message: "Хорошо, жду вас завтра в 15:0(",
    time: "Вчера",
    unread: 0,
    online: true,
  },
  {
    id: 6,
    name: "Александр Волков",
    role: "Исполнитель",
    task: "Перевезти вещи на дачу",
    message: "Готов выехать в субботу утром",
    time: "Чт",
    unread: 0,
    online: false,
  },
];

export default function Messages() {
  return (
    <>
        <div className="w-full bg-white rounded-xl shadow-sm">
        {/* Header */}
        <div className="px-6 py-4 border-b">
            <div className="flex items-center gap-4">
                <Link href="/home" className="cursor-pointer">
                    <ArrowLeft size={22} />
                </Link>
                <div className="flex flex-col">
                   <h2 className="text-xl font-semibold mb-1">Сообщения</h2>
                    <p className="text-sm text-gray-500">3 непрочитанных</p> 
                </div>
                
            </div>

            <div className="mt-4">
            <input
                placeholder="Поиск по чатам..."
                className="w-full rounded-xl border px-4 py-2 text-sm focus:outline-none"
            />
            </div>
        </div>

        {/* Chats */}
        <div className="divide-y">
            {chats.map((chat) => (
            <Link
                key={chat.id}
                href={`/home/messages/${chat.id}`}
                className="flex items-start gap-4 px-6 py-5 hover:bg-gray-50 cursor-pointer"
            >
                {/* Avatar */}
                <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-lg">
                    {chat.name[0]}
                </div>
                {chat.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                )}
                </div>

                {/* Content */}
                <div className="flex-1">
                <div className="flex justify-between">
                    <div className="flex gap-4">
                        <div className="font-medium">{chat.name}</div>
                        <span className="text-xs inline-block bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md mt-1">
                        {/* {chat.role} */}
                        {chat.task}
                        </span>
                    </div>
                    <div className="text-sm text-gray-400">{chat.time}</div>
                </div>

                

                {/* <div className="text-sm text-gray-500 mt-1">{chat.task}</div> */}
                <div className="text-sm mt-1 line-clamp-1">{chat.message}</div>
                </div>

                {/* Unread */}
                {chat.unread > 0 && (
                <span className="min-w-[24px] h-6 bg-blue-600 text-white text-sm flex items-center justify-center rounded-full">
                    {chat.unread}
                </span>
                )}
            </Link>
            ))}
        </div>
        </div>
    </>

  );
}
