'use client';

import { useEffect, useState } from 'react';
import axiosInstance from '@/utils/axiosInstance';

interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // ১. সেশন থেকে ইউজারের ডাটা চেক করা
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      window.location.href = '/login';
      return;
    }

    const parsedUser = JSON.parse(storedUser);

    // ২. ডাটাবেজ থেকে নির্দিষ্ট ইউজারের রেজিস্টার্ড তথ্য ফেচ করা
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get(`/users/${parsedUser.id}`);
        setProfile(res.data);
      } catch (error) {
        console.error('Failed to fetch profile from DB, using session:', error);
        // এপিআই সাময়িক ব্যর্থ হলে সেশনের ডাটা দেখাবে
        setProfile(parsedUser);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div className="text-center py-10 text-xs text-slate-500">Loading profile...</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg border border-slate-200 shadow-sm space-y-4">
      <div className="border-b pb-3">
        <h1 className="text-xl font-bold text-slate-800">My Profile</h1>
        <p className="text-xs text-slate-500">Registered Account Details</p>
      </div>

      {profile ? (
        <div className="space-y-3 text-xs">
          {/* Registered Name */}
          <div className="flex justify-between items-center py-2 border-b border-slate-100">
            <span className="font-semibold text-slate-600">Full Name:</span>
            <span className="text-slate-900 font-bold">{profile.name || 'N/A'}</span>
          </div>

          {/* Registered Email */}
          <div className="flex justify-between items-center py-2 border-b border-slate-100">
            <span className="font-semibold text-slate-600">Email Address:</span>
            <span className="text-slate-900 font-bold">{profile.email || 'N/A'}</span>
          </div>

          {/* Role */}
          <div className="flex justify-between items-center py-2">
            <span className="font-semibold text-slate-600">Account Role:</span>
            <span className="capitalize bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded text-[11px]">
              {profile.role}
            </span>
          </div>
        </div>
      ) : (
        <p className="text-xs text-red-500">Profile data not found.</p>
      )}
    </div>
  );
}