'use client';

import { useState } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import { registerSchema } from '@/utils/schemas';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employer',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setServerError('');

    // Zod Client Validation
    const validation = registerSchema.safeParse(formData);

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      // validation.error
      validation.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0] as string] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      await axiosInstance.post('/auth/register', formData);
      alert('Registration Successful! Please Login.');
      window.location.href = '/login';
    } catch (err: any) {
      setServerError(err.response?.data?.message || 'Registration failed!');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow-md text-xs">
      <h2 className="text-lg font-bold text-center mb-4">Register Account</h2>

      {serverError && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded border border-red-300">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block font-medium mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${errors.name ? 'border-red-500' : 'border-slate-300'}`}
            placeholder="Enter full name"
          />
          {errors.name && <p className="text-red-500 text-[11px] mt-0.5">{errors.name}</p>}
        </div>

        <div>
          <label className="block font-medium mb-1">Email Address</label>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${errors.email ? 'border-red-500' : 'border-slate-300'}`}
            placeholder="Enter email address"
          />
          {errors.email && <p className="text-red-500 text-[11px] mt-0.5">{errors.email}</p>}
        </div>

        <div>
          <label className="block font-medium mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${errors.password ? 'border-red-500' : 'border-slate-300'}`}
            placeholder="Enter password"
          />
          {errors.password && <p className="text-red-500 text-[11px] mt-0.5">{errors.password}</p>}
        </div>

        <div>
          <label className="block font-medium mb-1">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-2 border border-slate-300 rounded"
          >
            <option value="employer">Employer</option>
            <option value="housemaid">Housemaid</option>
            <option value="admin">Admin</option>
          </select>
          {errors.role && <p className="text-red-500 text-[11px] mt-0.5">{errors.role}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 mt-2"
        >
          Register
        </button>
      </form>
    </div>
  );
}