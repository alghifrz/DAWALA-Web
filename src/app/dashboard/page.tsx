'use client';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Dashboard Wisatawan</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/dashboard/kuliner" className="dashboard-card">Kuliner Halal Lokal</Link>
        <Link href="/dashboard/tempat-ibadah" className="dashboard-card">Tempat Ibadah</Link>
        <Link href="/dashboard/homestay" className="dashboard-card">Homestay Ramah Muslim</Link>
        <Link href="/dashboard/paket-wisata" className="dashboard-card">Paket Wisata Edukatif</Link>
        <Link href="/dashboard/edukasi" className="dashboard-card">Edukasi Rantai Pasok Hijau</Link>
        <Link href="/dashboard/pemesanan-saya" className="dashboard-card">Pemesanan Saya</Link>
      </div>
      <style jsx>{`
        .dashboard-card {
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f9fafb;
          border-radius: 1rem;
          padding: 2rem;
          font-size: 1.25rem;
          font-weight: 600;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          transition: box-shadow 0.2s;
        }
        .dashboard-card:hover {
          box-shadow: 0 4px 16px rgba(0,0,0,0.08);
          background: #f3f4f6;
        }
      `}</style>
    </main>
  );
}
