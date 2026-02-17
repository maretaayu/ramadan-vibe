"use client";

import { useEffect, useState } from "react";
import { getPrayerTimes } from "@/lib/api";
import { PrayerData } from "@/types";
import { Loader2, MapPin, Bell, Cloud, Moon, Sun, Sunset, BookOpen, Crown, MoreHorizontal, MessageSquare, ChevronRight, Share2, Copy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "./ui/button";
import WorshipTracker from "./WorshipTracker";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useLastRead } from "@/hooks/useLastRead";
import { ModeToggle } from "@/components/mode-toggle";

export default function MuslimProDashboard() {
    const { bookmark, mounted } = useLastRead();
    const [prayerData, setPrayerData] = useState<PrayerData | null>(null);
    const [loading, setLoading] = useState(true);
    const [city, setCity] = useState("Jakarta");
    const [country, setCountry] = useState("Indonesia");
    const [coords, setCoords] = useState<{ lat: number; long: number } | null>(null);

    const [nextPrayer, setNextPrayer] = useState<{ name: string; time: string } | null>(null);
    const [timeRemaining, setTimeRemaining] = useState<string>("");

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setCoords({ lat: latitude, long: longitude });
                    setCity("Locating...");
                },
                (error) => {
                    console.error("Geolocation error:", error);
                }
            );
        }
    }, []);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const data = await getPrayerTimes(city, country, coords?.lat, coords?.long);
            setPrayerData(data);

            // Reverse Geocode to get the real city name
            if (coords) {
                try {
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.long}`);
                    const locationData = await res.json();
                    // Try to find the most relevant city name
                    const realCity = locationData.address.city ||
                        locationData.address.town ||
                        locationData.address.village ||
                        locationData.address.county ||
                        "My Location";
                    setCity(realCity);
                } catch (e) {
                    console.error("Reverse geocoding failed", e);
                    setCity("My Location");
                }
            }

            setLoading(false);
        }
        fetchData();
    }, [country, coords]); // removed 'city' dependency to avoid loop if we setCity inside

    useEffect(() => {
        if (!prayerData) return;

        const updateTimer = () => {
            const now = new Date();
            const timings = prayerData.timings;
            const prayerList = [
                { name: "Imsak", time: timings.Imsak },
                { name: "Fajr", time: timings.Fajr },
                { name: "Dhuhr", time: timings.Dhuhr },
                { name: "Asr", time: timings.Asr },
                { name: "Maghrib", time: timings.Maghrib },
                { name: "Isha", time: timings.Isha },
            ];

            const currentTimeMinutes = now.getHours() * 60 + now.getMinutes();
            let upcoming = null;

            for (const prayer of prayerList) {
                const [h, m] = prayer.time.split(":").map(Number);
                const prayerTimeMinutes = h * 60 + m;
                if (prayerTimeMinutes > currentTimeMinutes) {
                    upcoming = prayer;
                    break;
                }
            }
            if (!upcoming) upcoming = prayerList[0];
            setNextPrayer(upcoming);

            const [h, m] = upcoming.time.split(":").map(Number);
            let diff = (h * 60 + m) - currentTimeMinutes;
            if (diff < 0) diff += 24 * 60;

            const hours = Math.floor(diff / 60);
            const mins = diff % 60;

            setTimeRemaining(`${hours}h ${mins}m`);
        };

        updateTimer();
        const interval = setInterval(updateTimer, 60000);
        return () => clearInterval(interval);
    }, [prayerData]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!prayerData) return <div>Failed to load</div>;

    const features = [
        { name: "Quran", icon: BookOpen },
        { name: "Dua", icon: MessageSquare },
        { name: "Tasbih", icon: MoreHorizontal },
        { name: "Salah", icon: Sun },
        { name: "Hadith", icon: BookOpen },
    ];

    return (
        <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-50 pb-24 transition-colors duration-300">

            {/* Organic Fluid Hero Section */}
            <div className="relative bg-gradient-to-br from-[#4c1d95] via-[#6d28d9] to-[#8b5cf6] text-white rounded-b-[40px] shadow-xl overflow-hidden pt-12 pb-8 px-6 mb-6">
                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 mix-blend-overlay"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl -ml-12 -mb-12 mix-blend-screen"></div>
                <div className="absolute top-20 right-[-10px] opacity-10 transform rotate-12">
                    <Moon className="w-48 h-48 text-white" />
                </div>

                {/* Top Bar: Date & Location & Toggle */}
                <div className="relative z-10 flex justify-between items-center mb-6">
                    <div>
                        <p className="text-[10px] font-bold text-violet-200 uppercase tracking-widest">
                            Today
                        </p>
                        <p className="text-sm font-bold text-white leading-tight">
                            {prayerData.date.hijri.month.en} {prayerData.date.hijri.day}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Location Pill */}
                        <div className="flex items-center gap-1.5 h-9 bg-white/10 px-3 rounded-full backdrop-blur-md border border-white/10 hover:bg-white/20 transition-colors cursor-pointer">
                            <MapPin className="w-3.5 h-3.5 text-amber-300" />
                            <span className="text-[11px] font-medium text-white">{city}</span>
                        </div>

                        {/* Theme Toggle - Matches Location Pill Style */}
                        <ModeToggle className="h-9 w-9 rounded-full bg-white/10 border border-white/10 text-white hover:bg-white/20 hover:text-white" />
                    </div>
                </div>

                {/* Main Countdown & Prayer Focus */}
                <div className="relative z-10 text-center mb-8">
                    <p className="text-sm font-medium text-violet-100 mb-1">
                        {nextPrayer?.name === 'Imsak' ? 'Sehri Ends' : 'Upcoming Prayer'}
                    </p>
                    <div className="inline-flex items-baseline justify-center gap-2 mb-2">
                        <h1 className="text-5xl font-black tracking-tighter drop-shadow-lg">
                            {nextPrayer?.name}
                        </h1>
                        <span className="text-2xl font-light text-violet-200">
                            {nextPrayer?.time}
                        </span>
                    </div>
                    <div className="inline-block bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10">
                        <p className="text-xs font-semibold text-white flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                            {timeRemaining} remaining
                        </p>
                    </div>
                </div>

                {/* Prayer Strip (Integrated but stylized) */}
                <div className="relative z-10 flex justify-between items-center bg-white/10 backdrop-blur-lg rounded-2xl p-3 border border-white/5">
                    {['Imsak', 'Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((name) => {
                        const time = prayerData.timings[name as keyof typeof prayerData.timings];
                        const isNext = nextPrayer?.name === name;
                        return (
                            <div key={name} className="flex flex-col items-center gap-1">
                                <span className={`text-[10px] font-medium ${isNext ? 'text-amber-300' : 'text-violet-200'}`}>{name}</span>
                                <span className={`text-[10px] font-bold ${isNext ? 'text-white scale-110' : 'text-white/80'}`}>{time}</span>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Content Body */}
            <div className="px-5 space-y-6">

                {/* Quran Progress (Floating Pill Style) */}
                {/* Quran Progress (Floating Pill Style) */}
                {mounted && (
                    <Link href={bookmark ? `/quran/${bookmark.surahId}#ayah-${bookmark.ayahNumber}` : "/quran/1"} className="block">
                        <div className="bg-white dark:bg-slate-900/50 border border-transparent dark:border-white/5 rounded-3xl p-4 shadow-sm flex items-center gap-4 relative overflow-hidden group cursor-pointer hover:shadow-md transition-all">
                            <div className="h-12 w-12 rounded-full bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center shrikh-0">
                                <BookOpen className="w-5 h-5 text-violet-600 dark:text-violet-300" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                                        {bookmark ? "Continue Reading" : "Start Reading"}
                                    </h3>
                                    {bookmark && <span className="text-[10px] font-bold text-violet-600 dark:text-violet-300 bg-violet-50 dark:bg-violet-500/10 px-2 py-0.5 rounded-full">10%</span>}
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                                    {bookmark ? `${bookmark.surahName}, Ayah ${bookmark.ayahNumber}` : "Al-Fatiha, The Opening"}
                                </p>
                                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div className={`h-full bg-violet-600 dark:bg-violet-400 rounded-full group-hover:w-[15%] transition-all duration-500 ${bookmark ? "w-[10%]" : "w-0"}`}></div>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors" />
                        </div>
                    </Link>
                )}

                {/* Features Grid (Soft & Clean) */}
                <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-3 px-1 text-sm">Explore</h3>
                    <div className="grid grid-cols-4 gap-4">
                        {features.slice(0, 4).map((feature, i) => (
                            <div key={i} className="flex flex-col items-center gap-2 group cursor-pointer">
                                <div className="h-14 w-14 rounded-[20px] bg-white dark:bg-slate-900/50 border border-slate-50 dark:border-white/5 flex items-center justify-center shadow-sm group-hover:scale-105 group-hover:shadow-md transition-all duration-300">
                                    <feature.icon className="w-6 h-6 text-violet-600 dark:text-violet-300 stroke-[1.5]" />
                                </div>
                                <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400">{feature.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Daily Moments (Large Card) */}
                <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-3 px-1 text-sm">Daily Inspiration</h3>
                    <div className="bg-gradient-to-br from-fuchsia-500 to-violet-600 dark:from-fuchsia-900 dark:to-violet-900 rounded-3xl p-5 text-white shadow-lg relative overflow-hidden transition-all">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-3 opacity-90">
                                <Crown className="w-4 h-4 text-amber-300" />
                                <span className="text-xs font-bold uppercase tracking-wider">Verse of the Day</span>
                            </div>
                            <blockquote className="text-lg font-medium leading-relaxed mb-4">
                                "Indeed, with hardship [will be] ease."
                            </blockquote>
                            <div className="flex justify-between items-end">
                                <p className="text-xs opacity-80">Surah Al-Sharh, 94:6</p>
                                <div className="flex gap-2">
                                    <Button size="icon" className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 text-white border-0">
                                        <Copy className="w-3.5 h-3.5" />
                                    </Button>
                                    <Button size="icon" className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 text-white border-0">
                                        <Share2 className="w-3.5 h-3.5" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Worship Tracker Entry Point */}
            <Sheet>
                <SheetTrigger asChild>
                    <div className="mx-6 mt-4 bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm flex items-center justify-between cursor-pointer active:scale-95 transition-transform group border border-transparent dark:border-slate-800">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400 group-hover:scale-110 transition-transform">
                                <CheckCircle2 className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Daily Tracker</h3>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400">Track your worship</p>
                            </div>
                        </div>
                        <Button size="sm" variant="ghost" className="text-violet-600 dark:text-violet-400 font-bold text-xs hover:bg-violet-50 dark:hover:bg-violet-900/20">
                            Open
                        </Button>
                    </div>
                </SheetTrigger>
                <SheetContent side="bottom" className="rounded-t-[30px] h-[80vh] p-0 bg-background border-t border-border">
                    <div className="p-6 pb-0">
                        <SheetHeader className="mb-4 text-left">
                            <SheetTitle className="text-xl font-bold text-foreground">Daily Worship & Activity</SheetTitle>
                        </SheetHeader>
                    </div>
                    <div className="overflow-y-auto h-full pb-20 px-0">
                        <WorshipTracker />
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}
