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
      if (lokasi) {
        // Coba filter berdasarkan nama lokasi langsung atau ID
        const selectedLokasi = lokasiList.find(l => l.id === lokasi);
        if (selectedLokasi) {
          query = query.or(`lokasi.eq.${lokasi},lokasi.eq.${selectedLokasi.nama}`);
        } else {
          query = query.eq('lokasi', lokasi);
        }
      }
      if (search) query = query.ilike('nama', `%${search}%`);
      const { data, error } = await query;
      setRawData(data); // debug
      if (!error && data) {
        console.log('Data kuliner:', data); // Debug log
        console.log('Lokasi list:', lokasiList); // Debug log
        setData(data as Kuliner[]);
      }
      setLoading(false);
    };
    fetchData();
  }, [jenis, lokasi, search, lokasiList]);

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
  const getLokasiNama = (lokasi: string) => {
    // Jika lokasi kosong atau null, return default
    if (!lokasi || lokasi.trim() === '') {
      return '-';
    }
    
    // Jika lokasi sudah berupa string nama yang valid (bukan ID), return as is
    if (lokasi && !lokasi.includes('-') && lokasi.length > 2) {
      return lokasi;
    }
    
    // Jika lokasi adalah ID (format seperti id_lokasi), cari di lokasiList
    const foundLokasi = lokasiList.find(l => l.id === lokasi);
    if (foundLokasi) {
      return foundLokasi.nama;
    }
    
    // Fallback: return original value
    return lokasi;
  };

  // Modal close
  const closeModal = () => { setSelected(null); setFotoIdx(0); };

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
              <h1 className="text-4xl font-bold text-green-800">Kuliner Halal Lokal</h1>
              <p className="text-gray-600">Nikmati cita rasa autentik kuliner halal Alamendah</p>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nama Kuliner</label>
              <input
                type="text"
                placeholder="Cari nama kuliner..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-300 focus:border-green-400 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Kuliner</label>
              <div className="relative">
                <select
                  value={jenis}
                  onChange={e => setJenis(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-green-300 focus:border-green-400 transition-all appearance-none bg-white"
                >
                  <option value="">Semua Jenis</option>
                  {jenisList.map((j) => (
                    <option key={j.id} value={j.id}>{j.nama}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                  </svg>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Lokasi</label>
              <div className="relative">
                <select
                  value={lokasi}
                  onChange={e => setLokasi(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-green-300 focus:border-green-400 transition-all appearance-none bg-white"
                >
                  <option value="">Semua Lokasi</option>
                  {lokasiList.map((l) => (
                    <option key={l.id} value={l.id}>{l.nama}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Kuliner Cards */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat data kuliner...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <div className="bg-green-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Tidak ada kuliner ditemukan</h3>
                <p className="text-gray-500">Coba ubah kata kunci atau filter pencarian</p>
              </div>
            ) : (
              data.map((item) => (
                <div
                  key={item.id_kuliner}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer group"
                  onClick={() => { setSelected(item); setFotoIdx(0); }}
                >
                  <div className="relative">
                    <img
                      src={item.foto && item.foto.length > 0 ? item.foto[0] : '/file.svg'}
                      alt={item.nama}
                      className="h-48 w-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${item.status === 'halal' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {item.status === 'halal' ? (
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                          </svg>
                        ) : (
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                          </svg>
                        )}
                        {item.status === 'halal' ? 'Halal' : 'Non-Halal'}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700">
                        {getJenisNama(item.id_jenis)}
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
                        <span className="text-xs text-red-500 ml-2">({item.lokasi})</span>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <svg className="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        {item.jam_buka}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      {/* Modal detail kuliner */}
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                    </svg>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 ${selected.status === 'halal' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {selected.status === 'halal' ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  )}
                  {selected.status === 'halal' ? 'Halal' : 'Non-Halal'}
                </span>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                  {getJenisNama(selected.id_jenis)}
                </span>
              </div>
              
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
                  <span className="text-xs text-red-500 ml-2">({selected.lokasi})</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span className="font-medium">Jam Buka:</span>
                  <span className="ml-2">{selected.jam_buka}</span>
                </div>
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
