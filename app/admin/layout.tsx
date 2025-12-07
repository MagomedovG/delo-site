import SidebarItem from "@/components/admin/SideBarItem";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";


export default function AdminLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>){
    return(
        <section className="flex min-h-screen bg-[#F5F7FA]">
            <aside className="w-64 flex flex-col items-center gap-6 bg-white border-r p-4 space-y-2">
                <Link href="/home"><Logo size={60}/></Link>
                <nav className="flex flex-col">
                    <SidebarItem label="Панель мониторинга" link="" />
                    <SidebarItem label="Управление задачами" link="/tasks"/>
                    <SidebarItem label="Управление пользователями" link="/users"/>
                    <SidebarItem label="Жалобы и модерация" link="/reports"/>
                    <SidebarItem label="Финансы и транзакции" link="/finance"/>
                    <SidebarItem label="Аналитика и отчёты" link="/analytics"/>
                    <SidebarItem label="Настройки платформы" link="/settings"/>
                </nav>
                <Button variant="secondary" className="mt-6 w-full text-orange-900">Выйти</Button>
            </aside>
            {children}
        </section>
    )
}