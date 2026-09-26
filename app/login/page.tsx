'use client';
import { useState } from 'react';
import axiosInstance from '@/utils/axiosInstance';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) return alert('Fill all fields!');
    try {
      const res = await axiosInstance.post('/auth/login', form);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      window.location.href = `/dashboard/${res.data.user.role}`;
    } catch (err) {
      alert('Invalid Email or Password!');
    }
  };

  return (
    <div className="max-w-xs mx-auto border p-5 bg-white rounded shadow-sm my-10 space-y-3">
      <h2 className="text-lg font-bold text-center">User Login</h2>
      <form onSubmit={handleLogin} className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="Email"
          required
          className="border p-2 rounded text-xs outline-none"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          required
          className="border p-2 rounded text-xs outline-none"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded text-xs font-bold">Login</button>
      </form>
    </div>
  );
}