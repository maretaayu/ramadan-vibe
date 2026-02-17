"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface WorshipTask {
    id: string;
    label: string;
    completed: boolean;
}

const DEFAULT_TASKS: WorshipTask[] = [
    { id: "fajr", label: "Fajr Prayer", completed: false },
    { id: "dhuhr", label: "Dhuhr Prayer", completed: false },
    { id: "asr", label: "Asr Prayer", completed: false },
    { id: "maghrib", label: "Maghrib Prayer", completed: false },
    { id: "isha", label: "Isha Prayer", completed: false },
    { id: "tarawih", label: "Tarawih Prayer", completed: false },
    { id: "quran", label: "Read Quran", completed: false },
    { id: "dhikr", label: "Morning/Evening Dhikr", completed: false },
];

export default function WorshipTracker() {
    const [tasks, setTasks] = useState<WorshipTask[]>([]);
    const [fastingStatus, setFastingStatus] = useState<boolean>(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Load from local storage on mount
        const saved = localStorage.getItem("worshipTasks");
        if (saved) {
            setTasks(JSON.parse(saved));
        } else {
            setTasks(DEFAULT_TASKS);
        }

        const savedFasting = localStorage.getItem("fastingStatus");
        if (savedFasting) {
            setFastingStatus(savedFasting === "true");
        }

        setMounted(true);
    }, []);

    useEffect(() => {
        // Save to local storage whenever tasks change
        if (mounted) {
            localStorage.setItem("worshipTasks", JSON.stringify(tasks));

            // Also update history for today
            const today = new Date();
            const dateKey = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');

            const history = JSON.parse(localStorage.getItem("worshipHistory") || "{}");
            const progress = Math.round((tasks.filter((t) => t.completed).length / tasks.length) * 100);

            history[dateKey] = progress;
            localStorage.setItem("worshipHistory", JSON.stringify(history));
        }
    }, [tasks, mounted]);

    const toggleFasting = (checked: boolean) => {
        setFastingStatus(checked);
        localStorage.setItem("fastingStatus", String(checked));
    };

    const toggleTask = (id: string) => {
        setTasks((prev) =>
            prev.map((task) =>
                task.id === id ? { ...task, completed: !task.completed } : task
            )
        );
    };

    if (!mounted) return null;

    const progress = Math.round(
        (tasks.filter((t) => t.completed).length / tasks.length) * 100
    );

    return (
        <Card className="w-full bg-transparent border-none shadow-none mt-0 rounded-none overflow-visible">
            <CardContent className="grid gap-3 p-6 pt-2">

                {/* Fasting Tracker Section */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 mb-4 border border-amber-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-200/20 rounded-full blur-xl -mr-6 -mt-6"></div>
                    <div className="relative z-10 flex justify-between items-center mb-3">
                        <div>
                            <h3 className="font-bold text-base text-amber-900">Daily Fasting</h3>
                            <p className="text-[11px] text-amber-700/80">Track your Sawm today</p>
                        </div>
                        <Switch
                            checked={fastingStatus}
                            onCheckedChange={toggleFasting}
                            className="data-[state=checked]:bg-amber-500 scale-90 origin-right"
                        />
                    </div>

                    {fastingStatus ? (
                        <div className="bg-white/60 backdrop-blur-sm p-3 rounded-xl flex items-center gap-3 border border-amber-100/50">
                            <span className="text-xl">🌙</span>
                            <div>
                                <p className="text-xs font-bold text-amber-800">Fasting Active</p>
                                <p className="text-[10px] text-amber-600 leading-tight">May Allah accept your fast.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white/60 backdrop-blur-sm p-3 rounded-xl flex items-center gap-3 text-slate-500 border border-slate-100/50">
                            <AlertCircle className="w-4 h-4" />
                            <p className="text-xs">Not fasting today</p>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">Today</span>
                    <span className="text-xs font-mono text-violet-600 font-bold">{progress}% Completed</span>
                </div>
                {tasks.map((task) => (
                    <div
                        key={task.id}
                        className={`flex items-center space-x-3 p-3 rounded-xl transition-all ${task.completed ? "bg-violet-50" : "hover:bg-slate-50"}`}
                    >
                        <Checkbox
                            id={task.id}
                            checked={task.completed}
                            onCheckedChange={() => toggleTask(task.id)}
                            className="w-5 h-5 border-2 rounded-full border-muted-foreground data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600"
                        />
                        <Label
                            htmlFor={task.id}
                            className={`flex-1 cursor-pointer font-medium text-sm ${task.completed ? "text-slate-400 line-through decoration-violet-300" : "text-slate-700"
                                }`}
                        >
                            {task.label}
                        </Label>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
