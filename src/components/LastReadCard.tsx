"use client";

import { useLastRead } from "@/hooks/useLastRead";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

export default function LastReadCard() {
    const { bookmark, mounted } = useLastRead();

    if (!mounted) return null;

    if (!bookmark) {
        return (
            <Link href="/quran/1">
                <Card className="bg-white dark:bg-slate-900 border-violet-100 dark:border-violet-900/20 hover:border-violet-300 dark:hover:border-violet-700 transition-all cursor-pointer mb-6 group shadow-sm">
                    <CardContent className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-full text-violet-600 dark:text-violet-400 group-hover:bg-violet-600 group-hover:text-white transition-colors">
                                <BookOpen className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs text-violet-600 dark:text-violet-400 font-bold uppercase tracking-wider">
                                    Start Reading
                                </p>
                                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">
                                    Al-Fatiha
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    The Opening
                                </p>
                            </div>
                        </div>
                        <div className="text-violet-300 dark:text-violet-600 group-hover:translate-x-1 transition-transform">
                            →
                        </div>
                    </CardContent>
                </Card>
            </Link>
        );
    }

    return (
        <Link href={`/quran/${bookmark.surahId}`}>
            <Card className="bg-white dark:bg-slate-900/50 border-violet-100 dark:border-white/5 hover:border-violet-300 dark:hover:border-violet-500/30 transition-all cursor-pointer mb-6 group shadow-sm">
                <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-violet-100 dark:bg-violet-500/10 rounded-full text-violet-600 dark:text-violet-300 group-hover:bg-violet-600 group-hover:text-white transition-colors">
                            <BookOpen className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs text-violet-600 dark:text-violet-300 font-bold uppercase tracking-wider">
                                Continue Reading
                            </p>
                            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">
                                {bookmark.surahName}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Ayah {bookmark.ayahNumber}
                            </p>
                        </div>
                    </div>
                    <div className="text-violet-300 dark:text-violet-600 group-hover:translate-x-1 transition-transform">
                        →
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
