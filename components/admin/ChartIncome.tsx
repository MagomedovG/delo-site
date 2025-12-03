export default function ChartIncome() {
    const data = [
        { label: "Янв", value: 45000 },
        { label: "Фев", value: 52000 },
        { label: "Мар", value: 61000 },
        { label: "Апр", value: 73000 },
        { label: "Май", value: 85000 },
        { label: "Июн", value: 98000 },
    ];
    
    
    return (
    <div>
        <h2 className="text-lg font-semibold mb-4">Доход платформы</h2>
        <div className="space-y-4">
            {data.map((item) => (
            <div key={item.label} className="flex items-center gap-4">
                <div className="w-10 text-gray-600">{item.label}</div>
                <div className="flex-1 h-5 bg-gray-200 rounded-full relative overflow-hidden">
                    <div
                        className="h-full bg-blue-500 rounded-full transition-all"
                        style={{ width: `${(item.value / 98000) * 100}%` }}
                    />
                    <span className="absolute right-2 top-[-24px] text-xs text-blue-700 font-semibold whitespace-nowrap">
                        ₽{item.value.toLocaleString()}
                    </span>
                </div>
            </div>
            ))}
        </div>
    </div>
    );
    }