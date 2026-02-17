"use client";

import { Home, BookOpen, User, Compass } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
    const pathname = usePathname();

    const navItems = [
        { label: "Home", icon: Home, href: "/" },
        { label: "Quran", icon: BookOpen, href: "/quran" },
        { label: "Qibla", icon: Compass, href: "/qibla" },
    ];

    return (
        <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
            <nav className="bg-white/90 backdrop-blur-xl border border-white/20 shadow-2xl shadow-slate-200/50 rounded-full px-6 py-3 pointer-events-auto flex items-center gap-8 md:hidden">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`relative flex flex-col items-center justify-center w-10 h-10 transition-all duration-300 group`}
                        >
                            <span className={`absolute -top-8 bg-slate-800 text-white text-[10px] py-1 px-2 rounded-md opacity-0 transition-opacity duration-300 ${isActive ? "" : "group-hover:opacity-100"}`}>
                                {item.label}
                            </span>

                            <div className={`absolute inset-0 bg-violet-100 rounded-full scale-0 transition-transform duration-300 ${isActive ? "scale-100" : "group-hover:scale-75"}`}></div>

                            <item.icon
                                className={`w-5 h-5 z-10 transition-colors duration-300 ${isActive ? "text-violet-600 fill-violet-600/20" : "text-slate-400 group-hover:text-violet-500"}`}
                                strokeWidth={isActive ? 2.5 : 2}
                            />
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
