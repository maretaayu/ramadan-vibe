"use client";

import { Home, BookOpen, User, Settings, Star } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
    const pathname = usePathname();

    const navItems = [
        { label: "Home", icon: Home, href: "/" },
        { label: "Quran", icon: BookOpen, href: "/quran" },
        { label: "Worship", icon: Star, href: "/worship" }, // Changed icon to Star for now
        { label: "Profile", icon: User, href: "/profile" },     // Placeholder
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border pb-safe pt-2 px-6 z-50 md:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <div className="flex justify-around items-center h-16">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`flex flex-col items-center gap-1 transition-colors ${isActive ? "text-primary" : "text-muted-foreground hover:text-primary/70"
                                }`}
                        >
                            <item.icon className={`w-6 h-6 ${isActive ? "fill-primary/20" : ""}`} />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
