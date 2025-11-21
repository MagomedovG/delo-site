import {
    Hammer,
    Package,
    Bike,
    Sparkles,
    BookOpen,
    Laptop,
    Heart,
    Camera,
    Car,
    Scale,
    MoreHorizontal,
  } from "lucide-react";
export default function DeloCategories() {
    const categories = [
        { id: "repair", name: "Ремонт и строительство", icon: Hammer, count: 234 },
        { id: "delivery", name: "Доставка", icon: Package, count: 156 },
        { id: "courier", name: "Курьерские поручения", icon: Bike, count: 89 },
        { id: "cleaning", name: "Уборка", icon: Sparkles, count: 178 },
        { id: "education", name: "Репетиторы и обучение", icon: BookOpen, count: 145 },
        { id: "it", name: "IT и цифровые услуги", icon: Laptop, count: 267 },
        { id: "beauty", name: "Красота и здоровье", icon: Heart, count: 92 },
        { id: "media", name: "Фото / Видео / Дизайн", icon: Camera, count: 103 },
        { id: "auto", name: "Автоуслуги", icon: Car, count: 67 },
        { id: "legal", name: "Юридические и финансовые", icon: Scale, count: 54 },
        { id: "other", name: "Прочее", icon: MoreHorizontal, count: 198 },
      ];
    
    
    return (
    <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">DELO — для любого дела</h2>
        <p className="text-gray-600 mb-16">От бытового до профессионального</p>
        
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {categories.map((cat, i) => (
            <div
                key={i}
                className="flex flex-col items-center cursor-pointer justify-center h-40 border rounded-2xl hover:shadow-md transition bg-white"
            >
                <cat.icon className="w-10 h-10 text-blue-600 mb-3" />
                <p className="font-medium">{cat.name}</p>
            </div>
            ))}
        </div>
        
        
        <button className="px-6 py-2 border text-blue-600 border-blue-300 rounded-lg hover:bg-blue-50 transition text-sm cursor-pointer">
            Посмотреть все категории
        </button>
    </section>
    );
    }