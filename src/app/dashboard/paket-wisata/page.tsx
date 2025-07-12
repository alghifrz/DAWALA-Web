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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-left mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0H8M8 10h8v10H8V10z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-green-800">Paket Wisata Edukatif</h1>
              <p className="text-gray-600">Jelajahi keindahan alam sambil belajar tentang keberlanjutan</p>
            </div>
          </div>
        </div>
        
        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            Cari Paket Wisata
          </h3>
          <div className="max-w-md mx-auto">
            <label className="block text-sm font-medium text-gray-700 mb-2">Nama Paket</label>
            <input
              type="text"
              placeholder="Cari nama paket wisata..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-300 focus:border-green-400 transition-all"
            />
          </div>
        </div>

        {/* Paket Wisata Cards */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat data paket wisata...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <div className="bg-green-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0H8M8 10h8v10H8V10z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Tidak ada paket wisata ditemukan</h3>
                <p className="text-gray-500">Coba ubah kata kunci pencarian</p>
              </div>
            ) : (
              data.map((item) => (
                <div
                  key={item.id_paket_wisata}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer group"
                  onClick={() => { setSelected(item); setFotoIdx(0); }}
                >
                  <div className="relative">
                    <img
                      src={item.foto && item.foto.length > 0 ? item.foto[0] : '/file.svg'}
                      alt={item.nama_paket}
                      className="h-48 w-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                        {item.durasi}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                        Rp{item.harga.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-xl mb-2 text-green-900 group-hover:text-green-700 transition-colors">
                      {item.nama_paket}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.deskripsi}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-green-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                        </svg>
                        Edukatif
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-green-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
                        </svg>
                        Sustainable
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      {/* Modal detail paket wisata */}
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
                    alt={selected.nama_paket}
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0H8M8 10h8v10H8V10z"/>
                    </svg>
                  </div>
                </div>
              )}
              
              {/* Price and Duration tags */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-lg font-bold">
                  Rp{selected.harga.toLocaleString()}
                </span>
                <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
                  {selected.durasi}
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="font-bold text-2xl mb-3 text-green-900">{selected.nama_paket}</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">{selected.deskripsi}</p>
              
              {/* Fasilitas */}
              {selected.fasilitas && selected.fasilitas.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                    <span className="text-green-600 mr-2">🏨</span>
                    Fasilitas
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selected.fasilitas.map((fasilitas, idx) => (
                      <span key={idx} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                        {fasilitas}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Poin Edukasi */}
              {selected.poin_edukasi && selected.poin_edukasi.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                    <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                    </svg>
                    Poin Edukasi
                  </h4>
                  <div className="space-y-2">
                    {selected.poin_edukasi.map((poin, idx) => (
                      <div key={idx} className="flex items-start">
                        <span className="text-green-600 mr-2 mt-1">•</span>
                        <span className="text-gray-700">{poin}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
                  </svg>
                  Wisata Edukatif & Berkelanjutan
                </h4>
                <p className="text-sm text-blue-700">
                  Nikmati pengalaman wisata yang tidak hanya menyenangkan, tetapi juga memberikan edukasi tentang keberlanjutan dan kelestarian lingkungan.
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
