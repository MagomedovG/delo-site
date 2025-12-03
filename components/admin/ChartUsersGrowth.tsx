export default function ChartUsersGrowth() {
    const data = [
        { label: "Янв", value: 120 },
        { label: "Фев", value: 180 },
        { label: "Мар", value: 250 },
        { label: "Апр", value: 320 },
        { label: "Май", value: 410 },
        { label: "Июн", value: 520 },
    ];
    
    
    return (
    <div>
        <h2 className="text-lg font-semibold mb-4">Динамика роста пользователей</h2>
        <div className="space-y-4">
            {data.map((item) => (
                <div key={item.label} className="flex items-center gap-4">
                    <div className="w-10 text-gray-600">{item.label}</div>
                    <div className="flex-1 h-4 bg-gray-200 rounded-full relative overflow-hidden">
                        <div
                            className="h-full bg-blue-500 rounded-full transition-all"
                            style={{ width: `${(item.value / 520) * 100}%` }}
                        />
                        <span className="absolute right-2 top-[-22px] text-xs text-blue-700 font-semibold">
                            {item.value}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    </div>
    );
    }