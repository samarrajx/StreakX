export default function OfflinePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#050507] text-white px-6 text-center">
      <img src="/icons/icon-192.png" alt="StreakX" className="w-20 h-20 mb-6 opacity-60" />
      <h1 className="text-2xl font-bold font-outfit mb-2">You're offline</h1>
      <p className="text-white/50 text-sm max-w-xs">
        StreakX needs a connection to sync your streak. Come back when you're connected.
      </p>
    </main>
  );
}
