'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface TempatIbadah {
  id_tempat_ibadah: string;
  nama: string;
  jam_buka: string;
  fasilitas: string[];
  lokasi: string;
}
interface Lokasi { id: string; nama: string; }

export default function TempatIbadahPage() {
  const [data, setData] = useState<TempatIbadah[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [lokasi, setLokasi] = useState('');
  const [lokasiList, setLokasiList] = useState<Lokasi[]>([]);
  const [rawData, setRawData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      let query = supabase
        .from('tempat_ibadah')
        .select('id_tempat_ibadah, nama, jam_buka, fasilitas, lokasi');
      if (lokasi) query = query.eq('lokasi', lokasi);
      if (search) query = query.ilike('nama', `%${search}%`);
      const { data, error } = await query;
      setRawData(data);
      if (!error && data) setData(data as TempatIbadah[]);
      setLoading(false);
    };
    fetchData();
  }, [lokasi, search]);

  useEffect(() => {
    const fetchLokasi = async () => {
      const { data: lokasiData } = await supabase.from('lokasi').select('id_lokasi, nama');
      setLokasiList(lokasiData?.map((l: any) => ({ id: l.id_lokasi, nama: l.nama })) || []);
    };
    fetchLokasi();
  }, []);

  const getLokasiNama = (id: string) => lokasiList.find(l => l.id === id)?.nama || '-';

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-green-800">Tempat Ibadah</h2>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Cari nama tempat ibadah..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full md:w-1/2 focus:ring-2 focus:ring-green-300"
        />
        <select
          value={lokasi}
          onChange={e => setLokasi(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full md:w-1/3 focus:ring-2 focus:ring-green-300"
        >
          <option value="">Semua Lokasi</option>
          {lokasiList.map((l) => (
            <option key={l.id} value={l.id}>{l.nama}</option>
          ))}
        </select>
      </div>
      {loading ? (
        <div className="text-center py-10 text-gray-500">Memuat data...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {data.length === 0 ? (
            <div className="col-span-full text-center text-gray-400">Tidak ada data tempat ibadah ditemukan.</div>
          ) : (
            data.map((item) => (
              <div key={item.id_tempat_ibadah} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition flex flex-col">
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-bold text-lg mb-1 text-green-900">{item.nama}</h3>
                  <div className="text-xs text-gray-500 mb-1">Lokasi: {getLokasiNama(item.lokasi)}</div>
                  <div className="text-xs text-gray-500 mb-1">Jam buka: {item.jam_buka}</div>
                  <div className="text-xs text-gray-500 mb-1">Fasilitas: {item.fasilitas?.join(', ')}</div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      {rawData && (
        <pre className="mt-8 p-4 bg-gray-100 text-xs rounded overflow-x-auto">{JSON.stringify(rawData, null, 2)}</pre>
      )}
    </div>
  );
}
