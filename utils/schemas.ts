import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  role: z.enum(['admin', 'employer', 'housemaid'], {
    message: 'Please select a valid role',
  }),
});

export type RegisterFormData = z.infer<typeof registerSchema>;