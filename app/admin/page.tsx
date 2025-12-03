import ChartCategories from "@/components/admin/ChartCategories";
import ChartIncome from "@/components/admin/ChartIncome";
import ChartUsersGrowth from "@/components/admin/ChartUsersGrowth";
import { Card, CardContent } from "@/components/ui/card";
import { User, CheckCircle, BarChart3, FileText } from "lucide-react";


function StatCard({ icon, label, value, diff, negative }:any) {
    return (
    <Card className="p-4">
    <CardContent className="flex flex-col gap-2">
    <div className="flex items-center gap-2 text-gray-500">{icon}{label}</div>
    <div className="text-2xl font-semibold">{value}</div>
    <div className={`text-sm ${negative ? "text-red-500" : "text-green-500"}`}>{diff} от прошлого периода</div>
    </CardContent>
    </Card>
    );
}

export default function AdminHomePage(){
    return (
        <main className="flex-1 p-6 space-y-6">


{/* Header */}
            <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">Панель мониторинга</h1>
            <div className="flex items-center gap-3">
            <div className="text-right">
            <p className="font-medium">Алексей Петров</p>
            <p className="text-sm text-gray-500">admin@mail.ru</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-300" />
            </div>
            </div>


            {/* Stats grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <StatCard icon={<FileText />} label="Новые задачи" value="847" diff="+12.5%" />
            <StatCard icon={<User />} label="Активные пользователи" value="2,341" diff="+8.2%" />
            <StatCard icon={<CheckCircle />} label="Завершённые задачи" value="1,523" diff="+15.3%" />
            <StatCard icon={<BarChart3 />} label="Средний чек" value="₽3,850" diff="+2.8%" />
            <StatCard icon={<BarChart3 />} label="Общий объём транзакций" value="₽98,450" diff="-3.1%" negative />
            <StatCard icon={<FileText />} label="Жалобы / споры" value="23" diff="+5.4%" />
            </div>


            {/* Charts placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-4">
                    <CardContent>
                        <ChartUsersGrowth />
                    </CardContent>
                </Card>


                <Card className="p-4">
                    <CardContent>
                        <ChartCategories />
                    </CardContent>
                </Card>
            </div>


            <Card className="p-4">
                <CardContent>
                    <ChartIncome />
                </CardContent>
            </Card>


        </main>
    )
}