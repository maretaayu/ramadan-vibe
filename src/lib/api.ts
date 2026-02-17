import { ApiResponse, PrayerData } from "@/types";

const ALADHAN_API_BASE_URL = "https://api.aladhan.com/v1";

export async function getPrayerTimes(city: string, country: string, lat?: number, long?: number): Promise<PrayerData | null> {
    try {
        const timestamp = Math.floor(Date.now() / 1000);
        // Method 20 is Kemenag (Ministry of Religious Affairs of Indonesia)
        let url = `${ALADHAN_API_BASE_URL}/timingsByCity/${timestamp}?city=${city}&country=${country}&method=20`;

        if (lat && long) {
            url = `${ALADHAN_API_BASE_URL}/timings/${timestamp}?latitude=${lat}&longitude=${long}&method=20`;
        }

        const response = await fetch(url, { next: { revalidate: 3600 } });

        if (!response.ok) {
            throw new Error("Failed to fetch prayer times");
        }

        const data: ApiResponse = await response.json();
        return data.data;
    } catch (error) {
        console.error("Error fetching prayer times:", error);
        return null;
    }
}

export async function getHijriDate(date: string): Promise<string | null> {
    // Implementation to fetch Hijri date if needed separately, 
    // but getPrayerTimes already includes it.
    return null;
}
