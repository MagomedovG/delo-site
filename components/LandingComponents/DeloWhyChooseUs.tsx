import {
    Shield,
    CheckCircle2,
    Clock3,
    Users,
    Headphones,
  } from "lucide-react";
  
const features = [
    {
      id: "safety",
      title: "Безопасность сделок",
      desc: "Средства удерживаются до подтверждения выполнения",
      icon: Shield,
    },
    {
      id: "verified",
      title: "Проверенные исполнители",
      desc: "Верификация, рейтинги, модерация",
      icon: CheckCircle2,
    },
    {
      id: "speed",
      title: "Скорость отклика",
      desc: "78% задач получают первый отклик в течение 15 минут",
      icon: Clock3,
    },
    {
      id: "control",
      title: "Полный контроль",
      desc: "Всё — от создания до оплаты — в одном месте",
      icon: Users,
    },
    {
      id: "support",
      title: "Поддержка 24/7",
      desc: "Команда DELO помогает при спорах или сложных ситуациях",
      icon: Headphones,
    },
  ];
  
export function DeloWhyChooseUs() {
    
    return (
        <section className="py-24">
        <h2 className="text-center text-3xl">
          Почему в DELO решают дела?
        </h2>
  
        <p className="text-center text-gray-500 mt-2">
          Ваша безопасность и удобство — наш приоритет
        </p>
  
        <div className="
          mt-14
          grid 
          grid-cols-1 
          sm:grid-cols-2 
          lg:grid-cols-3 
          gap-8
          max-w-6xl 
          mx-auto 
          px-4
        ">
          {features.map(({ id, title, desc, icon: Icon }) => (
            <div
              key={id}
              className="
                border 
                border-gray-200 
                rounded-2xl 
                p-8 
                flex 
                flex-col 
                gap-4 
                hover:shadow-md 
                transition
              "
            >
              <div className="p-4 bg-blue-50 rounded-xl w-fit">
                <Icon className="w-7 h-7 text-blue-600" />
              </div>
  
              <h3 className="text-xl">{title}</h3>
  
              <p className="text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    );
    }