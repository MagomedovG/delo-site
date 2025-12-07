"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SidebarItem({ label,link }:{label:string; link:string;}) {
  const pathname = usePathname();
    const active = pathname === `/admin${link}`
    return (
        <Link
            href={`/admin${link}`}
            className={`/admin${link} w-full text-left px-3 py-2 rounded-lg transition ${
                active
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
                }`
            }
        >
            {label}
        </Link>
    );
}