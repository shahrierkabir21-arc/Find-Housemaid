import Navbar from '@/components/Navbar';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="p-6 max-w-3xl mx-auto w-full flex-1">{children}</main>
        <footer className="bg-slate-800 text-white text-center p-3 text-xs">
          © SmartHouseMaid.com — Moderated Recruitment System
        </footer>
      </body>
    </html>
  );
}