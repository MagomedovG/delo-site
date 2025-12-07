import Image from "next/image";
import Link from "next/link";
import {
  UserPlus,
  Package,
  Clock3,
  Shield,
  CheckCircle2,
  Zap,
  Wallet,
  TrendingUp
} from "lucide-react";
import Logo from "../Logo";

export default function MainSection() {
  return (
    <main className="w-full min-h-screen bg-white text-[#0B1423]">
      {/* Header */}
      <header className="w-full border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            {/* <div className="w-8 h-8 bg-blue-600 rounded-lg" /> */}
            <Logo size={60}/>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/login" className="hover:opacity-70">Вход</Link>
            <Link href="/register" className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700">Регистрация</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 pt-16 pb-10 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            DELO — платформа, <br /> где решаются дела
          </h1>
          <p className="text-gray-600 mb-8 max-w-md">
            Публикуйте задачи или выполняйте их — безопасно, быстро и с гарантией результата
          </p>
          <div className="flex flex-wrap gap-4 mb-6">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center gap-2">
              Разместить задание →
            </button>
            <button className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 flex items-center gap-2">
              Стать исполнителем →
            </button>
          </div>
          <div className="flex gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">15 000+ решённых дел</div>
            <div className="flex items-center gap-2">20 городов России</div>
          </div>
        </div>

        {/* Right Card */}
        {/* <div className="flex justify-center w-full">
          <div className="bg-blue-600 hover:bg-blue-700 shadow-2xl rounded-3xl p-6 w-full ">
            <div className="flex gap-4 border rounded-2xl p-4 mb-4 bg-white">
              <div className="flex justify-center items-center">
                <div className="p-4 bg-blue-50  rounded-xl w-fit">
                  <Package className="w-7 h-7 text-blue-600" />
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-1">Доставка документов</h3>
                <p className="text-sm text-gray-600 mb-2">Нужно доставить договор...</p>
                <span className="font-semibold">500 ₽</span>
              </div>
            </div>
            <div className="border rounded-2xl p-4 bg-green-50">
              <p className="text-sm text-gray-600 mb-1">3 исполнителя откликнулись</p>
              <span className="font-semibold">Выберите подходящего</span>
            </div>
          </div>
        </div> */}
      </section>

      {/* For customers & performers */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12">
          {/* Для заказчиков */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Для заказчиков</h2>
            <div className="space-y-6">
              {[
                {
                  title: "Экономьте время",
                  text: "Не тратьте часы на поиск исполнителей. Просто опубликуйте задачу — отклики будут в течение 15 минут",
                  icon:Clock3
                },
                {
                  title: "Безопасная оплата",
                  text: "Деньги защищены до подтверждения работы. Платите только за результат, который вас устроил",
                  icon:Shield
                },
                {
                  title: "Выбирайте лучших",
                  text: "Рейтинги, отзывы и портфолио помогут найти проверенного профессионала для вашей задачи",
                  icon:UserPlus
                },
                {
                  title: "Гарантия результата",
                  text: "Поддержка платформы поможет решить любой спор. Ваши интересы защищены",
                  icon:CheckCircle2
                },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="p-4 bg-blue-50 rounded-xl w-fit">
                    <item.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{item.title}</h4>
                    <p className="text-gray-600 text-sm">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="px-6 py-3 mt-8 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center gap-2">
              Разместить первое задание →
            </button>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-6">Для исполнителей</h2>
            <div className="space-y-6">
              {[
                {
                  title: "Поток заказов",
                  text: "Забудьте о поиске клиентов. Получайте заказы каждый день в удобном приложении",
                  icon:Zap
                },
                {
                  title: "Гарантия оплаты",
                  text: "Деньги уже забронированы. Выполните работу — получите оплату сразу после подтверждения",
                  icon:Wallet
                },
                {
                  title: "Гибкий график",
                  text: "Работайте когда удобно. Выбирайте задачи по своему расписанию и навыкам",
                  icon:Clock3
                },
                {
                  title: "Рост дохода",
                  text: "Каждый выполненный заказ повышает ваш рейтинг и привлекает больше клиентов",
                  icon:TrendingUp
                },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="p-4 bg-blue-50 rounded-xl w-fit">
                    <item.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{item.title}</h4>
                    <p className="text-gray-600 text-sm">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="px-6 py-3 mt-8 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center gap-2">
              Начать зарабатывать →
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
