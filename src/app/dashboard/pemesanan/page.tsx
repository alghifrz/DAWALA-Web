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

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'confirmed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'confirmed': return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
        </svg>
      );
      case 'pending': return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      );
      case 'cancelled': return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
        </svg>
      );
      default: return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-left mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-green-800">Pemesanan Saya</h1>
              <p className="text-gray-600">Kelola dan pantau status pemesanan wisata Anda</p>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat data pemesanan...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {data.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-green-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Belum ada pemesanan</h3>
                <p className="text-gray-500 mb-4">Anda belum memiliki pemesanan wisata</p>
                <button 
                  onClick={() => router.push('/dashboard/paket-wisata')}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Jelajahi Paket Wisata
                </button>
              </div>
            ) : (
              data.map((item) => (
                <div
                  key={item.id_pemesanan}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group"
                  onClick={() => setSelected(item)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-xl text-green-900 mb-2 group-hover:text-green-700 transition-colors">
                          {item.paket?.nama_paket || `Paket ${item.id_paket_wisata}`}
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(item.status_pemesanan)}`}>
                            {getStatusIcon(item.status_pemesanan)} {item.status_pemesanan}
                          </span>
                          <span className="text-sm text-gray-500">
                            #{item.id_pemesanan.slice(-8).toUpperCase()}
                          </span>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center">
                            <span className="text-green-600 mr-2">📅</span>
                            Tanggal: {new Date(item.tanggal_pemesanan).toLocaleDateString('id-ID', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                          {item.catatan_opsional && (
                            <div className="flex items-start">
                              <svg className="w-4 h-4 text-green-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                              </svg>
                              <span className="line-clamp-1">{item.catatan_opsional}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-red-600 text-2xl">
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>
                        </svg>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-green-600 text-sm font-medium group-hover:text-green-700 transition-colors">
                        Lihat detail →
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      {/* Modal detail pemesanan */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto">
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
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-xl">Detail Pemesanan</h3>
                  <p className="text-white/80 text-sm">
                    #{selected.id_pemesanan.slice(-8).toUpperCase()}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <h4 className="font-semibold text-green-900 text-lg mb-2">
                  {selected.paket?.nama_paket || `Paket ${selected.id_paket_wisata}`}
                </h4>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(selected.status_pemesanan)}`}>
                    {getStatusIcon(selected.status_pemesanan)} {selected.status_pemesanan}
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <span className="text-green-600 mr-3 text-lg">📅</span>
                  <span className="font-medium">Tanggal Wisata:</span>
                  <span className="ml-2">
                    {new Date(selected.tanggal_pemesanan).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                
                {selected.catatan_opsional && (
                  <div className="text-gray-600">
                    <div className="flex items-start mb-2">
                      <svg className="w-5 h-5 text-green-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                      </svg>
                      <span className="font-medium">Catatan:</span>
                    </div>
                    <div className="ml-8 p-3 bg-gray-50 rounded-lg text-sm">
                      {selected.catatan_opsional}
                    </div>
                  </div>
                )}
                
                <div className="border-t pt-3 mt-4">
                  <h5 className="font-medium text-gray-700 mb-2">Informasi Pemesanan</h5>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div>Dibuat: {new Date(selected.created_at).toLocaleString('id-ID')}</div>
                    <div>Update terakhir: {new Date(selected.updated_at).toLocaleString('id-ID')}</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  Informasi Penting
                </h4>
                <p className="text-sm text-green-700">
                  Pastikan Anda tiba di lokasi meeting point 30 menit sebelum waktu keberangkatan. 
                  Hubungi kami jika ada perubahan atau kendala.
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
