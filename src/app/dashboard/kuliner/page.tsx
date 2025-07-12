'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface Kuliner {
  id_kuliner: string;
  nama: string;
  deskripsi: string;
  status: string;
  jam_buka: string;
  foto: string[];
  id_jenis: string;
  lokasi: string;
  jenis_nama?: string;
  lokasi_nama?: string;
}
interface Jenis { id: string; nama: string; }
interface Lokasi { id: string; nama: string; }

export default function KulinerPage() {
  const [data, setData] = useState<Kuliner[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [jenis, setJenis] = useState('');
  const [lokasi, setLokasi] = useState('');
  const [jenisList, setJenisList] = useState<Jenis[]>([]);
  const [lokasiList, setLokasiList] = useState<Lokasi[]>([]);
  const [rawData, setRawData] = useState<any>(null);
  const [selected, setSelected] = useState<Kuliner|null>(null);
  const [fotoIdx, setFotoIdx] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      let query = supabase
        .from('kuliner')
        .select('id_kuliner, nama, deskripsi, status, jam_buka, foto, id_jenis, lokasi');
      if (jenis) query = query.eq('id_jenis', jenis);
      if (lokasi) query = query.eq('lokasi', lokasi);
      if (search) query = query.ilike('nama', `%${search}%`);
      const { data, error } = await query;
      setRawData(data); // debug
      if (!error && data) {
        setData(data as Kuliner[]);
      }
      setLoading(false);
    };
    fetchData();
  }, [jenis, lokasi, search]);

  useEffect(() => {
    // Fetch jenis & lokasi list for filter
    const fetchFilters = async () => {
      const { data: jenisData } = await supabase.from('jenis').select('id_jenis, nama');
      const { data: lokasiData } = await supabase.from('lokasi').select('id_lokasi, nama');
      setJenisList(jenisData?.map((j: any) => ({ id: j.id_jenis, nama: j.nama })) || []);
      setLokasiList(lokasiData?.map((l: any) => ({ id: l.id_lokasi, nama: l.nama })) || []);
    };
    fetchFilters();
  }, []);

  // Helper untuk dapatkan nama jenis/lokasi dari id
  const getJenisNama = (id: string) => jenisList.find(j => j.id === id)?.nama || '-';
  const getLokasiNama = (id: string) => lokasiList.find(l => l.id === id)?.nama || '-';

  // Modal close
  const closeModal = () => { setSelected(null); setFotoIdx(0); };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-green-800">Kuliner Halal Lokal</h2>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Cari nama kuliner..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full md:w-1/3 focus:ring-2 focus:ring-green-300"
        />
        <select
          value={jenis}
          onChange={e => setJenis(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full md:w-1/4 focus:ring-2 focus:ring-green-300"
        >
          <option value="">Semua Jenis</option>
          {jenisList.map((j) => (
            <option key={j.id} value={j.id}>{j.nama}</option>
          ))}
        </select>
        <select
          value={lokasi}
          onChange={e => setLokasi(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full md:w-1/4 focus:ring-2 focus:ring-green-300"
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
            <div className="col-span-full text-center text-gray-400">Tidak ada data kuliner ditemukan.</div>
          ) : (
            data.map((item) => (
              <button
                key={item.id_kuliner}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition flex flex-col text-left cursor-pointer focus:outline-none"
                onClick={() => { setSelected(item); setFotoIdx(0); }}
              >
                <img
                  src={item.foto && item.foto.length > 0 ? item.foto[0] : '/file.svg'}
                  alt={item.nama}
                  className="h-40 w-full object-cover bg-gray-100"
                />
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${item.status === 'halal' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{item.status}</span>
                    <span className="text-xs text-gray-500">{getJenisNama(item.id_jenis)}</span>
                  </div>
                  <h3 className="font-bold text-lg mb-1 text-green-900">{item.nama}</h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item.deskripsi}</p>
                  <div className="text-xs text-gray-500 mb-1">Lokasi: {getLokasiNama(item.lokasi)}</div>
                  <div className="text-xs text-gray-500 mb-1">Jam buka: {item.jam_buka}</div>
                </div>
              </button>
            ))
          )}
        </div>
      )}
      {/* Modal detail kuliner */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg max-w-lg w-full p-6 relative animate-fadeIn">
            <button onClick={closeModal} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-2xl font-bold">&times;</button>
            <div className="mb-4">
              {/* Carousel foto */}
              {selected.foto && selected.foto.length > 0 ? (
                <div className="relative">
                  <img
                    src={selected.foto[fotoIdx]}
                    alt={selected.nama}
                    className="h-56 w-full object-cover rounded-lg bg-gray-100"
                  />
                  {selected.foto.length > 1 && (
                    <div className="absolute inset-0 flex items-center justify-between px-2">
                      <button
                        onClick={() => setFotoIdx((prev) => prev === 0 ? selected.foto.length - 1 : prev - 1)}
                        className="bg-white/80 rounded-full p-1 text-xl shadow hover:bg-white"
                        aria-label="Sebelumnya"
                      >&lt;</button>
                      <button
                        onClick={() => setFotoIdx((prev) => prev === selected.foto.length - 1 ? 0 : prev + 1)}
                        className="bg-white/80 rounded-full p-1 text-xl shadow hover:bg-white"
                        aria-label="Selanjutnya"
                      >&gt;</button>
                    </div>
                  )}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                    {selected.foto.map((_, idx) => (
                      <span key={idx} className={`inline-block w-2 h-2 rounded-full ${fotoIdx === idx ? 'bg-green-600' : 'bg-gray-300'}`}></span>
                    ))}
                  </div>
                </div>
              ) : (
                <img src="/file.svg" alt="No foto" className="h-56 w-full object-cover rounded-lg bg-gray-100" />
              )}
            </div>
            <h3 className="font-bold text-2xl mb-2 text-green-900">{selected.nama}</h3>
            <div className="mb-2 text-sm text-gray-600">{selected.deskripsi}</div>
            <div className="mb-1 text-xs text-gray-500">Status: <span className={selected.status === 'halal' ? 'text-green-700' : 'text-red-700'}>{selected.status}</span></div>
            <div className="mb-1 text-xs text-gray-500">Jenis: {getJenisNama(selected.id_jenis)}</div>
            <div className="mb-1 text-xs text-gray-500">Lokasi: {getLokasiNama(selected.lokasi)}</div>
            <div className="mb-1 text-xs text-gray-500">Jam buka: {selected.jam_buka}</div>
          </div>
        </div>
      )}
      {rawData && (
        <pre className="mt-8 p-4 bg-gray-100 text-xs rounded overflow-x-auto">{JSON.stringify(rawData, null, 2)}</pre>
      )}
    </div>
  );
}
