import MuslimProDashboard from "@/components/MuslimProDashboard";
import BottomNav from "@/components/BottomNav";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-foreground flex flex-col items-center pb-24 relative overflow-hidden">
      <div className="z-10 w-full md:max-w-md w-full">
        <MuslimProDashboard />
        <BottomNav />
      </div>
    </main>
  );
}
