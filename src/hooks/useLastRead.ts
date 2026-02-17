"use client";

import { useState, useEffect } from "react";

export interface Bookmark {
    surahId: number;
    ayahNumber: number;
    surahName: string;
    totalAyahs?: number;
}

export function useLastRead() {
    const [bookmark, setBookmark] = useState<Bookmark | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const loadBookmark = () => {
            const saved = localStorage.getItem("quranBookmark");
            if (saved) {
                try {
                    setBookmark(JSON.parse(saved));
                } catch (e) {
                    console.error("Failed to parse bookmark", e);
                }
            }
        };

        loadBookmark();

        // Listen for storage events (cross-tab)
        window.addEventListener("storage", loadBookmark);

        return () => {
            window.removeEventListener("storage", loadBookmark);
        };
    }, []);

    return { bookmark, mounted };
}
