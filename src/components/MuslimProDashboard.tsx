"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getPrayerTimes } from "@/lib/api";
import { PrayerData } from "@/types";
import { Loader2, MapPin, Bell, Cloud, Moon, Sun, Sunset, BookOpen, Crown, MoreHorizontal, MessageSquare, ChevronRight, Share2, Copy, Compass } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "./ui/button";
import WorshipTracker from "./WorshipTracker";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { CheckCircle2 } from "lucide-react";
import { useLastRead } from "@/hooks/useLastRead";

export default function MuslimProDashboard() {
    const { bookmark, mounted } = useLastRead();
    const [prayerData, setPrayerData] = useState<PrayerData | null>(null);
    const [loading, setLoading] = useState(true);
    const [city, setCity] = useState("Yogyakarta");
    const [country, setCountry] = useState("Indonesia");
    const [coords, setCoords] = useState<{ lat: number; long: number } | null>({ lat: -7.7956, long: 110.3695 });

    const [nextPrayer, setNextPrayer] = useState<{ name: string; time: string } | null>(null);
    const [timeRemaining, setTimeRemaining] = useState<string>("");
    const [worshipProgress, setWorshipProgress] = useState(0);
    const [worshipHistory, setWorshipHistory] = useState<Record<string, number>>({});

    useEffect(() => {
        const calculateProgress = () => {
            // Calculate Today's Progress
            const savedTasks = localStorage.getItem("worshipTasks");
            if (savedTasks) {
                const tasks = JSON.parse(savedTasks);
                if (Array.isArray(tasks) && tasks.length > 0) {
                    const completed = tasks.filter((t: any) => t.completed).length;
                    setWorshipProgress(Math.round((completed / tasks.length) * 100));
                }
            }

            // Load History
            const history = localStorage.getItem("worshipHistory");
            if (history) {
                setWorshipHistory(JSON.parse(history));
            }
        };

        calculateProgress();
        // Poll for changes in case Sheet updates localStorage
        const interval = setInterval(calculateProgress, 1000);
        return () => clearInterval(interval);
    }, []);

    /*
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
    */

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const data = await getPrayerTimes(city, country, coords?.lat, coords?.long);
            setPrayerData(data);

            /*
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
            */

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
        { name: "Quran", icon: BookOpen, href: "/quran" },
        { name: "Dua", icon: MessageSquare, href: "/dua" },
        { name: "Tasbih", icon: MoreHorizontal, href: "/tasbih" },
        { name: "Qibla", icon: Compass, href: "/qibla" },
        { name: "Hadith", icon: BookOpen, href: "/hadith" },
    ];

    return (
        <div className="w-full min-h-screen bg-slate-50 text-slate-800 pb-24">

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

            {/* Features Menu - Overlapping & Premium */}
            <div className="px-6 -mt-8 relative z-20 mb-6">
                <div className="bg-white rounded-[24px] p-4 shadow-xl shadow-slate-200/50 border border-slate-100 mx-auto">
                    <div className="flex justify-between items-center px-2">
                        {features.map((feature, i) => (
                            <Link key={i} href={feature.href} className="flex flex-col items-center gap-2 group cursor-pointer">
                                <div className="h-12 w-12 rounded-2xl bg-violet-50 flex items-center justify-center group-hover:bg-violet-100 transition-colors">
                                    <feature.icon className="w-5 h-5 text-violet-600" />
                                </div>
                                <span className="text-[10px] font-medium text-slate-600 group-hover:text-violet-600 transition-colors">{feature.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content Body */}
            <div className="px-5 space-y-6">

                {/* Worship Tracker Entry Point */}
                <Sheet>
                    <SheetTrigger asChild>
                        <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4 cursor-pointer active:scale-95 transition-transform group border border-transparent">
                            <div className="h-10 w-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 group-hover:scale-110 transition-transform shrink-0">
                                <CheckCircle2 className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-1.5">
                                    <h3 className="text-sm font-bold text-slate-800">Daily Tracker</h3>
                                    <span className="text-[10px] font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full">
                                        {worshipProgress}%
                                    </span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-violet-600 rounded-full transition-all duration-500 ease-out"
                                        style={{ width: `${worshipProgress}%` }}
                                    ></div>
                                </div>
                            </div>
                            <Button size="sm" variant="ghost" className="text-violet-600 font-bold text-xs hover:bg-violet-50 shrink-0">
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

                {/* Quran Progress (Floating Pill Style) */}
                {/* Quran Progress (Floating Pill Style) */}
                {mounted && (
                    <Link href={bookmark ? `/quran/${bookmark.surahId}#ayah-${bookmark.ayahNumber}` : "/quran/1"} className="block">
                        <div className="bg-gradient-to-br from-violet-50 to-fuchsia-50 border border-violet-100 rounded-3xl p-4 shadow-sm flex items-center gap-4 relative overflow-hidden group cursor-pointer hover:shadow-md transition-all">
                            <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm border border-violet-100">
                                <BookOpen className="w-5 h-5 text-violet-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-800 text-sm">
                                    {bookmark ? "Continue Reading" : "Start Reading"}
                                </h3>
                                <p className="text-xs text-slate-500">
                                    {bookmark ? `${bookmark.surahName}, Ayah ${bookmark.ayahNumber}` : "Al-Fatiha, The Opening"}
                                </p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-violet-600 transition-colors" />
                        </div>
                    </Link>
                )}

                {/* Features Grid (Soft & Clean) */}


                {/* Daily Moments (Large Card) */}
                <div>
                    <h3 className="font-bold text-slate-800 mb-3 px-1 text-sm">Daily Inspiration</h3>
                    <div className="bg-gradient-to-br from-fuchsia-500 to-violet-600 rounded-3xl p-5 text-white shadow-lg relative overflow-hidden transition-all">
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

                {/* Ramadan Consistency Heatmap (GitHub Style) */}
                <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-bold text-slate-800">Ramadan Consistency</h3>
                        <span className="text-[10px] text-slate-400">Last 30 Days</span>
                    </div>

                    <div className="flex flex-col gap-3">
                        <div className="flex flex-wrap gap-2 justify-center">
                            {Array.from({ length: 30 }).map((_, i) => {
                                // Calculate date for this square (30 days ago to today)
                                const date = new Date();
                                date.setDate(date.getDate() - (29 - i));
                                const dateKey = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');

                                // Get value from history, or use live state for today
                                const isToday = i === 29;
                                const value = isToday ? worshipProgress : (worshipHistory[dateKey] || 0);

                                let colorClass = "bg-slate-100";
                                if (value > 0) colorClass = "bg-violet-200";
                                if (value >= 40) colorClass = "bg-violet-400";
                                if (value >= 70) colorClass = "bg-violet-600";
                                if (value === 100) colorClass = "bg-violet-800";

                                return (
                                    <div
                                        key={i}
                                        className={`w-5 h-5 rounded-md ${colorClass} transition-all hover:scale-110 cursor-pointer relative group`}
                                    >
                                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10 transition-opacity">
                                            {date.toLocaleDateString("id-ID", { day: 'numeric', month: 'short' })}: {value}%
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex items-center justify-end gap-1.5 text-[9px] text-slate-400 mt-2">
                            <span>Less</span>
                            <div className="w-2.5 h-2.5 rounded-sm bg-slate-100"></div>
                            <div className="w-2.5 h-2.5 rounded-sm bg-violet-200"></div>
                            <div className="w-2.5 h-2.5 rounded-sm bg-violet-400"></div>
                            <div className="w-2.5 h-2.5 rounded-sm bg-violet-600"></div>
                            <div className="w-2.5 h-2.5 rounded-sm bg-violet-800"></div>
                            <span>More</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Worship Tracker Entry Point */}

        </div>
    );
}
