'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

interface Pemesanan {
  id_pemesanan: string;
  id_paket_wisata: string;
  tanggal_pemesanan: string;
  status_pemesanan: string;
  catatan_opsional?: string;
  created_at: string;
  updated_at: string;
  paket?: { nama_paket: string; };
}

export default function PemesananSayaPage() {
  const [data, setData] = useState<Pemesanan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Pemesanan|null>(null);
  const [rawData, setRawData] = useState<any>(null);
  const [userId, setUserId] = useState<string|null>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user?.id) {
        setUserId(data.user.id);
      } else {
        router.replace('/auth');
      }
    });
  }, [router]);

  useEffect(() => {
    if (!userId) return;
    const fetchData = async () => {
      setLoading(true);
      let query = supabase
        .from('pemesanan')
        .select('id_pemesanan, id_paket_wisata, tanggal_pemesanan, status_pemesanan, catatan_opsional, created_at, updated_at, paket_wisata(nama_paket)')
        .eq('user_id', userId);
      const { data, error } = await query;
      setRawData(data);
      if (!error && data) setData(data as Pemesanan[]);
      setLoading(false);
    };
    fetchData();
  }, [userId]);

  const closeModal = () => setSelected(null);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-green-800">Pemesanan Saya</h2>
      {loading ? (
        <div className="text-center py-10 text-gray-500">Memuat data...</div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {data.length === 0 ? (
            <div className="col-span-full text-center text-gray-400">Belum ada pemesanan.</div>
          ) : (
            data.map((item) => (
              <button
                key={item.id_pemesanan}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition flex flex-col text-left cursor-pointer focus:outline-none p-6"
                onClick={() => setSelected(item)}
              >
                <div className="font-bold text-lg mb-2 text-green-900">{item.paket?.nama_paket || item.id_paket_wisata}</div>
                <div className="text-gray-600 text-sm mb-1">Tanggal: {new Date(item.tanggal_pemesanan).toLocaleDateString()}</div>
                <div className="text-xs text-gray-500 mb-1">Status: <span className={item.status_pemesanan === 'confirmed' ? 'text-green-700' : item.status_pemesanan === 'pending' ? 'text-yellow-700' : 'text-red-700'}>{item.status_pemesanan}</span></div>
                {item.catatan_opsional && <div className="text-xs text-gray-500">Catatan: {item.catatan_opsional}</div>}
              </button>
            ))
          )}
        </div>
      )}
      {/* Modal detail pemesanan */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg max-w-lg w-full p-6 relative animate-fadeIn">
            <button onClick={closeModal} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-2xl font-bold">&times;</button>
            <div className="font-bold text-xl mb-2 text-green-900">{selected.paket?.nama_paket || selected.id_paket_wisata}</div>
            <div className="mb-1 text-xs text-gray-500">Tanggal: {new Date(selected.tanggal_pemesanan).toLocaleString()}</div>
            <div className="mb-1 text-xs text-gray-500">Status: <span className={selected.status_pemesanan === 'confirmed' ? 'text-green-700' : selected.status_pemesanan === 'pending' ? 'text-yellow-700' : 'text-red-700'}>{selected.status_pemesanan}</span></div>
            {selected.catatan_opsional && <div className="mb-1 text-xs text-gray-500">Catatan: {selected.catatan_opsional}</div>}
            <div className="mb-1 text-xs text-gray-400">Dibuat: {new Date(selected.created_at).toLocaleString()}</div>
            <div className="mb-1 text-xs text-gray-400">Update terakhir: {new Date(selected.updated_at).toLocaleString()}</div>
          </div>
        </div>
      )}
      {rawData && (
        <pre className="mt-8 p-4 bg-gray-100 text-xs rounded overflow-x-auto">{JSON.stringify(rawData, null, 2)}</pre>
      )}
    </div>
  );
}
