import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="text-center py-12 space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">Smart Housemaid Platform</h1>
      <p className="text-xs text-slate-600 max-w-sm mx-auto">
        Safe & Admin moderated system for employers and housemaids.
      </p>
      <div className="flex justify-center gap-3 pt-2">
        <Link href="/jobs" className="bg-blue-600 text-white px-4 py-2 rounded text-xs font-bold">Approved Jobs</Link>
        <Link href="/maids" className="bg-emerald-600 text-white px-4 py-2 rounded text-xs font-bold">Approved Maids</Link>
      </div>
    </div>
  );
}