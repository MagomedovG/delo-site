export default function DeloHowItWorks() {
    return (
    <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Как работает DELO</h2>
        <p className="text-gray-600 mb-16">Простой процесс от задачи до результата</p>
    
    
        <div className="grid md:grid-cols-2 gap-16 text-left">
            {/* Заказчик */}
            <div>
                <h3 className="text-2xl  mb-8 text-center md:text-left">Для заказчика</h3>
            
            
                {[
                {
                num: 1,
                title: "Опишите дело",
                text: "Укажите категорию, локацию, бюджет, сроки и детали. Можно прикрепить фото",
                },
                {
                num: 2,
                title: "Получите отклики",
                text: "Исполнители предлагают свои услуги. Вы видите их рейтинг, отзывы и статус верификации",
                },
                {
                num: 3,
                title: "Выберите и общайтесь",
                text: "Чат открывается только после подтверждения исполнителя",
                },
                {
                num: 4,
                title: "Оплатите после результата",
                text: "Средства временно удерживаются на платформе. После подтверждения деньги переводятся исполнителю",
                },
                ].map((item) => (
                <div key={item.num} className="flex gap-4 mb-8">
                        <div className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full font-semibold">
                            {item.num}
                        </div>
                    <div>
                        <h4 className="mb-1">{item.title}</h4>
                        <p className="text-gray-600 text-sm leading-relaxed">{item.text}</p>
                    </div>
                </div>
                ))}
            </div>
            
            
            {/* Исполнитель */}
            <div>
                <h3 className="text-2xl mb-8 text-center md:text-left">Для исполнителя</h3>
            
            
                {[
                {
                num: 1,
                title: "Зарегистрируйтесь и укажите навыки",
                text: "Выберите категории и пройдите базовую верификацию",
                },
                {
                num: 2,
                title: "Находите дела",
                text: "Смотрите ленту или получайте уведомления о новых задачах рядом с вами",
                },
                {
                num: 3,
                title: "Выполняйте и получайте оплату",
                text: "Общение в защищенном чате, оплата после подтверждения",
                },
                {
                num: 4,
                title: "Растите репутацию",
                text: "Каждый отзыв повышает рейтинг и видимость",
                },
                ].map((item) => (
                <div key={item.num} className="flex gap-4 mb-8">
                    <div className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full font-semibold">
                        {item.num}
                    </div>
                    <div>
                        <h4 className="mb-1">{item.title}</h4>
                        <p className="text-gray-600 text-sm leading-relaxed">{item.text}</p>
                    </div>
                </div>
                ))}
            </div>
        </div>
    </section>
    );
    }