'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const data = localStorage.getItem('user');
    if (data) setUser(JSON.parse(data));
  }, []);

  const logout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <nav className="bg-slate-800 text-white p-4 flex justify-between items-center text-sm">
      <Link href="/" className="font-bold text-base text-blue-400">
        SmartHouseMaid.com
      </Link>

      <div className="flex gap-4 items-center">
        {user ? (
          <>
            {/* Authenticated Links */}
            <Link href="/jobs">Approved Jobs</Link>
            <Link href="/maids">Approved Maids</Link>

            {/* 🟢 Profile Button (For Admin, Employer, Housemaid) */}
            <Link
              href="/profile"
              className="bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded text-xs font-semibold"
            >
              Profile
            </Link>

            {/* Role Dashboard Button */}
            <Link
              href={`/dashboard/${user.role}`}
              className="bg-blue-600 px-3 py-1 rounded text-xs font-semibold"
            >
              {user.role} Dashboard
            </Link>

            <button
              onClick={logout}
              className="bg-red-500 px-2.5 py-1 rounded text-xs"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            {/* Unauthenticated Links */}
            <Link href="/login">Login</Link>
            <Link
              href="/register"
              className="bg-blue-600 px-3 py-1 rounded text-xs"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}