'use client'
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation"

export default function MessagesPanel() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  if (pathname === "/" || pathname === "/login" || pathname === "/register") return null

  return (
    <div className="fixed flex flex-col items-end gap-6 bottom-0 right-4 z-50">
       {pathname !== "/create-task" && <div className="">
            <Button
            onClick={() => router.push("/create-task")}
            size="lg"
            className="h-14 px-6 bg-blue-600 hover:bg-blue-700 shadow-xl rounded-full flex items-center gap-2"
            >
            <Plus className="h-5 w-5" />
            Создать задачу
            </Button>
        </div>}
        <motion.div
            initial={false}
            animate={{ height: open ? "50vh" : "48px", width: open ? "320px" : "280px" }}
            className="bg-white border-blue-600 border border-b-0 shadow-xl rounded-tl-2xl rounded-tr-2xl overflow-hidden flex flex-col"
        >
            <div
                className="flex items-center justify-between px-4 h-12 bg-gray-100 cursor-pointer select-none"
                onClick={() => setOpen(!open)}
            >
                <span className="font-semibold text-gray-700">Сообщения</span>
                {open ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
            </div>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 overflow-y-auto p-4 space-y-3 text-sm"
                    >
                        <div className="text-gray-500">Тут появится история сообщений...</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    </div>
  );
}
