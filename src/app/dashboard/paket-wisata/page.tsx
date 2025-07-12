'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface PaketWisata {
  id_paket_wisata: string;
  nama_paket: string;
  deskripsi: string;
  durasi: string;
  harga: number;
  fasilitas: string[];
  poin_edukasi: string[];
  foto: string[];
}

export default function PaketWisataPage() {
  const [data, setData] = useState<PaketWisata[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<PaketWisata|null>(null);
  const [fotoIdx, setFotoIdx] = useState(0);
  const [rawData, setRawData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      let query = supabase
        .from('paket_wisata')
        .select('id_paket_wisata, nama_paket, deskripsi, durasi, harga, fasilitas, poin_edukasi, foto');
      if (search) query = query.ilike('nama_paket', `%${search}%`);
      const { data, error } = await query;
      setRawData(data);
      if (!error && data) setData(data as PaketWisata[]);
      setLoading(false);
    };
    fetchData();
  }, [search]);

  const closeModal = () => { setSelected(null); setFotoIdx(0); };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-green-800">Paket Wisata Edukatif</h2>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Cari nama paket wisata..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full md:w-1/2 focus:ring-2 focus:ring-green-300"
        />
      </div>
      {loading ? (
        <div className="text-center py-10 text-gray-500">Memuat data...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {data.length === 0 ? (
            <div className="col-span-full text-center text-gray-400">Tidak ada paket wisata ditemukan.</div>
          ) : (
            data.map((item) => (
              <button
                key={item.id_paket_wisata}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition flex flex-col text-left cursor-pointer focus:outline-none"
                onClick={() => { setSelected(item); setFotoIdx(0); }}
              >
                <img
                  src={item.foto && item.foto.length > 0 ? item.foto[0] : '/file.svg'}
                  alt={item.nama_paket}
                  className="h-40 w-full object-cover bg-gray-100"
                />
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-bold text-lg mb-1 text-green-900">{item.nama_paket}</h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item.deskripsi}</p>
                  <div className="text-xs text-gray-500 mb-1">Durasi: {item.durasi}</div>
                  <div className="text-xs text-gray-500 mb-1">Harga: Rp{item.harga.toLocaleString()}</div>
                </div>
              </button>
            ))
          )}
        </div>
      )}
      {/* Modal detail paket wisata */}
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
                    alt={selected.nama_paket}
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
            <h3 className="font-bold text-2xl mb-2 text-green-900">{selected.nama_paket}</h3>
            <div className="mb-2 text-sm text-gray-600">{selected.deskripsi}</div>
            <div className="mb-1 text-xs text-gray-500">Durasi: {selected.durasi}</div>
            <div className="mb-1 text-xs text-gray-500">Harga: Rp{selected.harga.toLocaleString()}</div>
            <div className="mb-1 text-xs text-gray-500">Fasilitas: {selected.fasilitas?.join(', ')}</div>
            <div className="mb-1 text-xs text-gray-500">Poin Edukasi: {selected.poin_edukasi?.join(', ')}</div>
          </div>
        </div>
      )}
      {rawData && (
        <pre className="mt-8 p-4 bg-gray-100 text-xs rounded overflow-x-auto">{JSON.stringify(rawData, null, 2)}</pre>
      )}
    </div>
  );
}
