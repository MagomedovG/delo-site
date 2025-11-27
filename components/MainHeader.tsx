import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import LogoutButton from "./LogoutButton";
import { MessageCircle, Search } from "lucide-react";
import { Input } from "./ui/input";
import Link from "next/link";
export default function MainHeader({children}:{children: React.ReactNode}){
    const router = useRouter();
    const onViewOffers = true
    const pathname = usePathname();

    const isMessages = pathname === "/home/messages"
    // if (pathname === "/" || pathname === "/login" || pathname === "/register") return null

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Link href="/">
              <h1 className="text-2xl font-semibold text-blue-600">Delo</h1>
            </Link>
            <div className="flex gap-2">
              {
                isMessages ? 
                <Button className="cursor-pointer" variant="outline" size="sm" onClick={() => router.push("/home")}>
                    Смотреть задачи
                </Button>
                : 
                <Button className="cursor-pointer" variant="outline" size="sm" onClick={() => router.push("/home/messages")}>
                    Сообщения <MessageCircle />
                </Button>
              }
              {onViewOffers && (
                <Button className="cursor-pointer" variant="outline" size="sm" onClick={() => router.push("/my-offers")}>
                  Отклики
                </Button>
              )}
              <Button className="cursor-pointer" variant="ghost" size="sm" onClick={() => router.push("/my-profile")}>
                Профиль
              </Button>
              <LogoutButton/>
             
            </div>
          </div>
          {children}

        </div>
      </header>
    )
}