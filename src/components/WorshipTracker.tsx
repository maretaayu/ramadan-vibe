"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CheckCircle2 } from "lucide-react";

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
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Load from local storage on mount
        const saved = localStorage.getItem("worshipTasks");
        if (saved) {
            setTasks(JSON.parse(saved));
        } else {
            setTasks(DEFAULT_TASKS);
        }
        setMounted(true);
    }, []);

    useEffect(() => {
        // Save to local storage whenever tasks change
        if (mounted) {
            localStorage.setItem("worshipTasks", JSON.stringify(tasks));
        }
    }, [tasks, mounted]);

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
            <div className="p-6 pb-2">
                <h2 className="text-xl font-bold text-slate-800">Daily Checklist</h2>
                <h3 className="text-lg font-bold text-violet-600">Ramadan Activity</h3>
                <p className="text-xs text-muted-foreground mt-1">
                    Plan And Make It Easy To Track Activities In The Month Of Ramadan
                </p>
            </div>

            <CardContent className="grid gap-3 p-6 pt-2">
                <div className="flex items-center justify-between mb-4">
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
