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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-left mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-green-800">Edukasi Rantai Pasok Hijau</h1>
              <p className="text-gray-600">Pelajari tentang keberlanjutan dan praktik ramah lingkungan</p>
            </div>
          </div>
        </div>
        
        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            Cari Konten Edukasi
          </h3>
          <div className="max-w-md mx-auto">
            <label className="block text-sm font-medium text-gray-700 mb-2">Kata Kunci</label>
            <input
              type="text"
              placeholder="Cari narasi edukasi..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-300 focus:border-green-400 transition-all"
            />
          </div>
        </div>

        {/* Edukasi Content */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat konten edukasi...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {data.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-green-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Tidak ada konten edukasi ditemukan</h3>
                <p className="text-gray-500">Coba ubah kata kunci pencarian</p>
              </div>
            ) : (
              data.map((item, index) => (
                <div
                  key={item.id_rantai_pasok_hijau}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group"
                  onClick={() => setSelected(item)}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-green-900 group-hover:text-green-700 transition-colors">
                            Edukasi Rantai Pasok Hijau #{item.id_rantai_pasok_hijau.slice(-4)}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {new Date(item.created_at).toLocaleDateString('id-ID', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="text-emerald-600 text-2xl">
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      </div>
                    </div>
                    <div className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                      {item.konten}
                    </div>
                    <div className="mt-4 text-right">
                      <span className="text-green-600 text-sm font-medium group-hover:text-green-700 transition-colors">
                        Baca selengkapnya →
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      {/* Modal detail edukasi */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="relative bg-gradient-to-r from-green-400 to-green-600 rounded-t-2xl p-6">
              <button 
                onClick={closeModal} 
                className="absolute top-4 right-4 bg-white/80 hover:bg-white rounded-full p-2 text-gray-600 hover:text-red-500 transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
              
              <div className="flex items-center gap-4 text-white">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-xl">Edukasi Rantai Pasok Hijau</h3>
                  <p className="text-white/80 text-sm">
                    #{selected.id_rantai_pasok_hijau.slice(-4)} • {new Date(selected.created_at).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="prose prose-sm max-w-none">
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {selected.konten}
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                  </svg>
                  Tentang Rantai Pasok Hijau
                </h4>
                <p className="text-sm text-green-700">
                  Rantai pasok hijau adalah pendekatan berkelanjutan dalam mengelola alur produk dari hulu hingga hilir 
                  dengan mempertimbangkan dampak lingkungan dan sosial.
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
