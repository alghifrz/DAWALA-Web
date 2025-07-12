'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface Edukasi {
  id_rantai_pasok_hijau: string;
  konten: string;
  created_at: string;
}

export default function EdukasiPage() {
  const [data, setData] = useState<Edukasi[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Edukasi|null>(null);
  const [rawData, setRawData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      let query = supabase
        .from('rantai_pasok_hijau')
        .select('id_rantai_pasok_hijau, konten, created_at');
      if (search) query = query.ilike('konten', `%${search}%`);
      const { data, error } = await query;
      setRawData(data);
      if (!error && data) setData(data as Edukasi[]);
      setLoading(false);
    };
    fetchData();
  }, [search]);

  const closeModal = () => setSelected(null);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-green-800">Edukasi Rantai Pasok Hijau</h2>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Cari narasi edukasi..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full md:w-1/2 focus:ring-2 focus:ring-green-300"
        />
      </div>
      {loading ? (
        <div className="text-center py-10 text-gray-500">Memuat data...</div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {data.length === 0 ? (
            <div className="col-span-full text-center text-gray-400">Tidak ada konten edukasi ditemukan.</div>
          ) : (
            data.map((item) => (
              <button
                key={item.id_rantai_pasok_hijau}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition flex flex-col text-left cursor-pointer focus:outline-none p-6"
                onClick={() => setSelected(item)}
              >
                <div className="font-bold text-lg mb-2 text-green-900">Edukasi #{item.id_rantai_pasok_hijau.slice(-4)}</div>
                <div className="text-gray-600 text-sm line-clamp-3">{item.konten}</div>
                <div className="text-xs text-gray-400 mt-2">{new Date(item.created_at).toLocaleDateString()}</div>
              </button>
            ))
          )}
        </div>
      )}
      {/* Modal detail edukasi */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg max-w-lg w-full p-6 relative animate-fadeIn">
            <button onClick={closeModal} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-2xl font-bold">&times;</button>
            <div className="mb-2 text-xs text-gray-400">{new Date(selected.created_at).toLocaleString()}</div>
            <div className="font-bold text-xl mb-4 text-green-900">Edukasi #{selected.id_rantai_pasok_hijau.slice(-4)}</div>
            <div className="text-gray-700 whitespace-pre-line text-sm">{selected.konten}</div>
          </div>
        </div>
      )}
      {rawData && (
        <pre className="mt-8 p-4 bg-gray-100 text-xs rounded overflow-x-auto">{JSON.stringify(rawData, null, 2)}</pre>
      )}
    </div>
  );
}
