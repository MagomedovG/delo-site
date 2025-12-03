import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
function SidebarItem({ label, active }:{label:string; active?:boolean}) {
    return (
        <button
            className={`w-full text-left px-3 py-2 rounded-lg transition ${
                active
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
                }`
            }
        >
            {label}
        </button>
    );
}

export default function AdminLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>){
    return(
        <section className="flex min-h-screen bg-[#F5F7FA]">
            <aside className="w-64 flex flex-col items-center gap-6 bg-white border-r p-4 space-y-2">
                <Logo size={60}/>
                <nav className="space-y-1">
                    <SidebarItem label="Панель мониторинга" active />
                    <SidebarItem label="Управление задачами" />
                    <SidebarItem label="Управление пользователями" />
                    <SidebarItem label="Жалобы и модерация" />
                    <SidebarItem label="Финансы и транзакции" />
                    <SidebarItem label="Аналитика и отчёты" />
                    <SidebarItem label="Настройки платформы" />
                </nav>
                <Button variant="secondary" className="mt-6 w-full text-orange-900">Выйти</Button>
            </aside>
            {children}
        </section>
    )
}