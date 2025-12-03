export default function ChartCategories() {
    const data = [
        { label: "Ремонт", value: 450 },
        { label: "Доставка", value: 320 },
        { label: "Уборка", value: 280 },
        { label: "IT", value: 210 },
        { label: "Красота", value: 180 },
        { label: "Прочее", value: 140 },
    ];
    
    
    return (
    <div>
        <h2 className="text-lg font-semibold mb-4">Активность по категориям</h2>
        <div className="space-y-4">
            {data.map((item) => (
                <div key={item.label}>
                    <div className="flex justify-between pb-1 text-gray-700 text-sm">
                        <span>{item.label}</span>
                        <span>{item.value}</span>
                    </div>
                    <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${(item.value / 450) * 100}%` }}
                        />
                    </div>
                </div>
            ))}
        </div>
    </div>
    );
    }