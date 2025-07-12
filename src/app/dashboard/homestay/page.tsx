'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface Homestay {
  id_homestay: string;
  nama: string;
  deskripsi: string;
  harga: number;
  kontak: string;
  foto: string[];
  lokasi: string;
}
interface Lokasi { id: string; nama: string; }

export default function HomestayPage() {
  const [data, setData] = useState<Homestay[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [lokasi, setLokasi] = useState('');
  const [lokasiList, setLokasiList] = useState<Lokasi[]>([]);
  const [selected, setSelected] = useState<Homestay|null>(null);
  const [fotoIdx, setFotoIdx] = useState(0);
  const [rawData, setRawData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      let query = supabase
        .from('homestay')
        .select('id_homestay, nama, deskripsi, harga, kontak, foto, lokasi');
      if (lokasi) query = query.eq('lokasi', lokasi);
      if (search) query = query.ilike('nama', `%${search}%`);
      const { data, error } = await query;
      setRawData(data);
      if (!error && data) setData(data as Homestay[]);
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

  const closeModal = () => { setSelected(null); setFotoIdx(0); };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-left mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-green-800">Homestay Ramah Muslim</h1>
              <p className="text-gray-600">Menginap nyaman dengan fasilitas ramah muslim di Alamendah</p>
            </div>
          </div>
        </div>
        
        {/* Filter Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            Cari & Filter
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nama Homestay</label>
              <input
                type="text"
                placeholder="Cari nama homestay..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-300 focus:border-green-400 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Lokasi</label>
              <select
                value={lokasi}
                onChange={e => setLokasi(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-300 focus:border-green-400 transition-all"
              >
                <option value="">Semua Lokasi</option>
                {lokasiList.map((l) => (
                  <option key={l.id} value={l.id}>{l.nama}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Homestay Cards */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat data homestay...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <div className="bg-green-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Tidak ada homestay ditemukan</h3>
                <p className="text-gray-500">Coba ubah kata kunci atau filter pencarian</p>
              </div>
            ) : (
              data.map((item) => (
                <div
                  key={item.id_homestay}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer group"
                  onClick={() => { setSelected(item); setFotoIdx(0); }}
                >
                  <div className="relative">
                    <img
                      src={item.foto && item.foto.length > 0 ? item.foto[0] : '/file.svg'}
                      alt={item.nama}
                      className="h-48 w-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                        Rp{item.harga.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-xl mb-2 text-green-900 group-hover:text-green-700 transition-colors">
                      {item.nama}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.deskripsi}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-gray-500">
                        <svg className="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                        {getLokasiNama(item.lokasi)}
                      </div>
                      <div className="flex items-center text-gray-500">
                        <span className="text-green-600 mr-2">📞</span>
                        {item.kontak}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      {/* Modal detail homestay */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <button 
                onClick={closeModal} 
                className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white rounded-full p-2 text-gray-600 hover:text-red-500 transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
              
              {/* Carousel foto */}
              {selected.foto && selected.foto.length > 0 ? (
                <div className="relative">
                  <img
                    src={selected.foto[fotoIdx]}
                    alt={selected.nama}
                    className="h-64 w-full object-cover rounded-t-2xl"
                  />
                  {selected.foto.length > 1 && (
                    <>
                      <button
                        onClick={() => setFotoIdx((prev) => prev === 0 ? selected.foto.length - 1 : prev - 1)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                        aria-label="Sebelumnya"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                        </svg>
                      </button>
                      <button
                        onClick={() => setFotoIdx((prev) => prev === selected.foto.length - 1 ? 0 : prev + 1)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                        aria-label="Selanjutnya"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                      </button>
                    </>
                  )}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {selected.foto.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setFotoIdx(idx)}
                        className={`w-3 h-3 rounded-full transition-all ${fotoIdx === idx ? 'bg-white' : 'bg-white/50'}`}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-64 w-full bg-gray-100 rounded-t-2xl flex items-center justify-center">
                  <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                    </svg>
                  </div>
                </div>
              )}
              
              {/* Price tag */}
              <div className="absolute top-4 left-4">
                <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-lg font-bold">
                  Rp{selected.harga.toLocaleString()}
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="font-bold text-2xl mb-3 text-green-900">{selected.nama}</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">{selected.deskripsi}</p>
              
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  <span className="font-medium">Lokasi:</span>
                  <span className="ml-2">{getLokasiNama(selected.lokasi)}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <span className="text-green-600 mr-3 text-lg">📞</span>
                  <span className="font-medium">Kontak:</span>
                  <span className="ml-2">{selected.kontak}</span>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">✨ Homestay Ramah Muslim</h4>
                <p className="text-sm text-green-700">
                  Tempat menginap yang menyediakan fasilitas dan suasana yang ramah bagi wisatawan muslim
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {rawData && (
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Debug Data</h3>
          <pre className="bg-gray-50 p-4 text-xs rounded-lg overflow-x-auto border">
            {JSON.stringify(rawData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
