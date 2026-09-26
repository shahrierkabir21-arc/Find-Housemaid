import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="text-center py-10 space-y-2">
      <h1 className="text-xl font-bold text-red-600">404 - Page Not Found</h1>
      <Link href="/" className="text-xs text-blue-600 underline">Back to Home</Link>
    </div>
  );
}