"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/dashboard/kuliner", label: "Kuliner Halal" },
  { href: "/dashboard/tempat-ibadah", label: "Tempat Ibadah" },
  { href: "/dashboard/homestay", label: "Homestay" },
  { href: "/dashboard/paket-wisata", label: "Paket Wisata" },
  { href: "/dashboard/edukasi", label: "Edukasi" },
  { href: "/dashboard/pemesanan-saya", label: "Pemesanan Saya" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data?.user || null));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    return () => { listener?.subscription.unsubscribe(); };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
  };

  return (
    <nav className="w-full bg-white/80 dark:bg-gray-900/80 shadow-sm sticky top-0 z-50 backdrop-blur">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-bold text-green-700 tracking-tight">
          Dawala
        </Link>
        <div className="flex gap-2 sm:gap-4 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors text-sm ${
                pathname === link.href
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                  : "hover:bg-green-50 dark:hover:bg-green-800"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
        {user ? (
          <button
            onClick={handleLogout}
            className="ml-2 px-4 py-1.5 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition text-sm"
          >
            Keluar
          </button>
        ) : (
          <Link
            href="/auth"
            className="ml-2 px-4 py-1.5 rounded bg-green-600 text-white font-semibold hover:bg-green-700 transition text-sm"
          >
            Masuk
          </Link>
        )}
      </div>
    </nav>
  );
}
