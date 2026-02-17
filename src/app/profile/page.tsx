"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, User, TrendingUp, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WorshipTask {
    id: string;
    label: string;
    completed: boolean;
}

export default function ProfilePage() {
    const router = useRouter();
    const [worshipStats, setWorshipStats] = useState({
        today: 0,
        streak: 3, // Mock streak for now
        totalComplete: 0
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load worship stats
        const savedTasks = localStorage.getItem("worshipTasks");
        if (savedTasks) {
            const tasks: WorshipTask[] = JSON.parse(savedTasks);
            const total = tasks.length;
            const completed = tasks.filter(t => t.completed).length;
            const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

            setWorshipStats(prev => ({
                ...prev,
                today: percentage,
                totalComplete: completed
            }));
        }



        setLoading(false);
    }, []);



    const weeklyProgress = [
        { day: "Mon", value: 80 },
        { day: "Tue", value: 65 },
        { day: "Wed", value: 90 },
        { day: "Thu", value: 40 },
        { day: "Fri", value: 75 },
        { day: "Sat", value: 85 },
        { day: "Sun", value: worshipStats.today }, // Today
    ];

    return (
        <main className="min-h-screen bg-slate-50 text-slate-800 pb-24">
            {/* Header */}
            <div className="bg-white sticky top-0 z-30 shadow-sm border-b border-slate-100">
                <div className="max-w-md mx-auto px-6 py-4 flex items-center justify-between">
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full hover:bg-slate-100 -ml-2">
                        <ArrowLeft className="w-6 h-6" />
                    </Button>
                    <h1 className="text-lg font-bold">Profile & Insights</h1>
                    <div className="w-10" />
                </div>
            </div>

            <div className="max-w-md mx-auto px-6 py-6 space-y-6">

                {/* User Profile Card */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="h-16 w-16 rounded-full bg-violet-100 flex items-center justify-center text-violet-600">
                        <User className="w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Ramadan User</h2>
                        <p className="text-sm text-slate-500">Yogyakarta, Indonesia</p>
                    </div>
                </div>



                {/* Daily Worship Insight */}
                <div className="grid grid-cols-2 gap-4">
                    <Card className="border-slate-100 shadow-sm">
                        <CardContent className="p-5 flex flex-col items-center justify-center text-center">
                            <div className="h-10 w-10 icon-bg-violet mb-2 rounded-full flex items-center justify-center bg-violet-50 text-violet-600">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                            <span className="text-2xl font-bold text-slate-800">{worshipStats.today}%</span>
                            <span className="text-xs text-slate-500">Today's Worship</span>
                        </CardContent>
                    </Card>
                    <Card className="border-slate-100 shadow-sm">
                        <CardContent className="p-5 flex flex-col items-center justify-center text-center">
                            <div className="h-10 w-10 icon-bg-emerald mb-2 rounded-full flex items-center justify-center bg-emerald-50 text-emerald-600">
                                <Calendar className="w-5 h-5" />
                            </div>
                            <span className="text-2xl font-bold text-slate-800">{worshipStats.streak} Days</span>
                            <span className="text-xs text-slate-500">Current Streak</span>
                        </CardContent>
                    </Card>
                </div>

                {/* Ramadan Consistency Heatmap */}
                <Card className="border-slate-100 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-bold flex items-center justify-between">
                            <span>Ramadan Consistency</span>
                            <span className="text-xs font-normal text-slate-500">Last 30 Days</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-wrap gap-1.5 justify-center">
                                {Array.from({ length: 30 }).map((_, i) => {
                                    // Mock data generation: mostly high, some low
                                    // Randomize slightly but keep it looking "good"
                                    const value = i === 29 ? worshipStats.today : Math.floor(Math.random() * 100);
                                    let colorClass = "bg-slate-100";
                                    if (value > 0) colorClass = "bg-violet-200";
                                    if (value >= 40) colorClass = "bg-violet-400";
                                    if (value >= 70) colorClass = "bg-violet-600";
                                    if (value === 100) colorClass = "bg-violet-800";

                                    return (
                                        <div
                                            key={i}
                                            className={`w-8 h-8 rounded-md ${colorClass} transition-all hover:scale-110 cursor-pointer relative group`}
                                        >
                                            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10 transition-opacity">
                                                Day {i + 1}: {value}%
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Legend */}
                            <div className="flex items-center justify-end gap-2 text-[10px] text-slate-400">
                                <span>Less</span>
                                <div className="w-2.5 h-2.5 rounded-sm bg-slate-100"></div>
                                <div className="w-2.5 h-2.5 rounded-sm bg-violet-200"></div>
                                <div className="w-2.5 h-2.5 rounded-sm bg-violet-400"></div>
                                <div className="w-2.5 h-2.5 rounded-sm bg-violet-600"></div>
                                <div className="w-2.5 h-2.5 rounded-sm bg-violet-800"></div>
                                <span>More</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </main>
    );
}
