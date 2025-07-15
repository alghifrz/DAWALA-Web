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
interface Fasilitas { id: string; nama: string; }

export default function TempatIbadahPage() {
  const [data, setData] = useState<TempatIbadah[]>([]);
  const [showFasilitasDropdown, setShowFasilitasDropdown] = useState(false); // State untuk dropdown custom fasilitas

  // Tutup dropdown fasilitas jika klik di luar
  useEffect(() => {
    if (!showFasilitasDropdown) return;
    function handleClick(e: MouseEvent) {
      const dropdown = document.getElementById('fasilitas-dropdown');
      if (dropdown && !dropdown.contains(e.target as Node)) {
        setShowFasilitasDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showFasilitasDropdown]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [lokasi, setLokasi] = useState('');
  const [lokasiList, setLokasiList] = useState<Lokasi[]>([]);
  const [rawData, setRawData] = useState<any>(null);
  const [selected, setSelected] = useState<TempatIbadah | null>(null);
  const [fasilitasList, setFasilitasList] = useState<Fasilitas[]>([]);
  const [fasilitasFilter, setFasilitasFilter] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Query tempat_ibadah + join fasilitas
      let base = supabase
        .from('tempat_ibadah')
        .select(`id_tempat_ibadah, nama, jam_buka, lokasi, tempat_ibadah_fasilitas:fasilitas_tempat_ibadah(id_fasilitas_tempat_ibadah, fasilitas_tempat_ibadah: nama)`);
      if (lokasi) base = base.eq('lokasi', lokasi);
      if (search) base = base.ilike('nama', `%${search}%`);
      const { data, error } = await base;
      let result: TempatIbadah[] = [];
      if (!error && data) {
        result = (data as any[]).map((item) => ({
          id_tempat_ibadah: item.id_tempat_ibadah,
          nama: item.nama,
          jam_buka: item.jam_buka,
          lokasi: item.lokasi,
          fasilitas: (item.tempat_ibadah_fasilitas || []).map((f: any) => f.fasilitas_tempat_ibadah),
        }));
        // Filter by fasilitas jika ada
        if (fasilitasFilter.length > 0) {
          result = result.filter((t) => fasilitasFilter.every(f => t.fasilitas.includes(f)));
        }
      }
      setRawData(data);
      setData(result);
      setLoading(false);
    };
    fetchData();
  }, [lokasi, search, fasilitasFilter]);

  useEffect(() => {
    const fetchLokasi = async () => {
      const { data: lokasiData } = await supabase.from('lokasi').select('id_lokasi, nama');
      setLokasiList(lokasiData?.map((l: any) => ({ id: l.id_lokasi, nama: l.nama })) || []);
    };
    const fetchFasilitas = async () => {
      const { data: fasilitasData } = await supabase.from('fasilitas_tempat_ibadah').select('id_fasilitas_tempat_ibadah, nama');
      setFasilitasList(fasilitasData?.map((f: any) => ({ id: f.nama, nama: f.nama })) || []);
    };
    fetchLokasi();
    fetchFasilitas();
  }, []);

  // Jika lokasi berupa nama langsung (bukan id), tampilkan stringnya
  const getLokasiNama = (lokasi: string) => {
    // Jika lokasi ditemukan di list id, tampilkan nama dari list
    const found = lokasiList.find(l => l.id === lokasi);
    if (found) return found.nama;
    // Jika lokasi string dan bukan id, tampilkan langsung
    if (typeof lokasi === 'string' && lokasi.length > 0) return lokasi;
    return '-';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-left mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-green-800">Tempat Ibadah</h1>
              <p className="text-gray-600">Temukan tempat ibadah yang nyaman dan suci di Alamendah</p>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Nama Tempat Ibadah</label>
              <input
                type="text"
                placeholder="Cari nama tempat ibadah..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-300 focus:border-green-400 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Lokasi</label>
              <div className="relative">
                <select
                  value={lokasi}
                  onChange={e => setLokasi(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 pr-4 focus:ring-2 focus:ring-green-300 focus:border-green-400 transition-all appearance-none bg-white"
                >
                  <option value="">Semua Lokasi</option>
                  {lokasiList.map((l) => (
                    <option key={l.id} value={l.id}>{l.nama}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                  </svg>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fasilitas</label>
              <div className="relative">
                <button
                  type="button"
                  className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 pr-4 text-left bg-white focus:ring-2 focus:ring-green-300 focus:border-green-400 transition-all flex items-center justify-between"
                  onClick={() => setShowFasilitasDropdown(v => !v)}
                >
                  <span className="truncate text-gray-700">
                    {fasilitasFilter.length === 0
                      ? 'Pilih fasilitas...'
                      : fasilitasList.filter(f => fasilitasFilter.includes(f.nama)).map(f => f.nama).join(', ')}
                  </span>
                  <svg className="w-4 h-4 text-gray-400 ml-2 mr-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>
                {showFasilitasDropdown && (
                  <div id="fasilitas-dropdown" className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-56 overflow-y-auto">
                    {fasilitasList.length === 0 && (
                      <div className="p-3 text-gray-400 text-sm">Tidak ada data fasilitas</div>
                    )}
                    {fasilitasList.map((f) => (
                      <label key={f.id} className="flex items-center px-3 py-2 hover:bg-green-50 cursor-pointer gap-2">
                        <input
                          type="checkbox"
                          checked={fasilitasFilter.includes(f.nama)}
                          onChange={e => {
                            if (e.target.checked) {
                              setFasilitasFilter([...fasilitasFilter, f.nama]);
                            } else {
                              setFasilitasFilter(fasilitasFilter.filter(val => val !== f.nama));
                            }
                          }}
                          className="accent-green-600 rounded mr-2"
                        />
                        <span className="text-gray-700 text-sm">{f.nama}</span>
                      </label>
                    ))}
                  </div>
                )}
                <div className="text-xs text-gray-400 mt-1">(Pilih lebih dari satu untuk filter kombinasi)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tempat Ibadah Cards */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat data tempat ibadah...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <div className="bg-green-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Tidak ada tempat ibadah ditemukan</h3>
                <p className="text-gray-500">Coba ubah kata kunci atau filter pencarian</p>
              </div>
            ) : (
              data.map((item) => (
                <div
                  key={item.id_tempat_ibadah}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer group"
                  onClick={() => setSelected(item)}
                >
                  <div className="relative bg-green-600 h-32">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-xl mb-3 text-green-900 group-hover:text-green-700 transition-colors">
                      {item.nama}
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-gray-600">
                        <svg className="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                        {getLokasiNama(item.lokasi)}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <svg className="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        {item.jam_buka}
                      </div>
                      {item.fasilitas && item.fasilitas.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {item.fasilitas.slice(0, 3).map((fasilitas, idx) => (
                            <span key={idx} className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                              {fasilitas}
                            </span>
                          ))}
                          {item.fasilitas.length > 3 && (
                            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                              +{item.fasilitas.length - 3} lainnya
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Modal detail tempat ibadah */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto relative" onClick={e => e.stopPropagation()}>
            <div className="relative bg-green-600 h-32 rounded-t-2xl">
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 bg-white/80 hover:bg-white rounded-full p-2 text-gray-600 hover:text-red-500 transition-all z-10"
                aria-label="Tutup"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                  </svg>
                </div>
              </div>
            </div>
            <div className="p-6">
              <h3 className="font-bold text-2xl mb-4 text-green-900">{selected.nama}</h3>
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
                  <svg className="w-5 h-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span className="font-medium">Jam Buka:</span>
                  <span className="ml-2">{selected.jam_buka}</span>
                </div>
                {selected.fasilitas && selected.fasilitas.length > 0 && (
                  <div className="text-gray-600">
                    <div className="flex items-center mb-2">
                      <svg className="w-5 h-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                      </svg>
                      <span className="font-medium">Fasilitas:</span>
                    </div>
                    <div className="flex flex-wrap gap-2 ml-8">
                      {selected.fasilitas.map((fasilitas, idx) => (
                        <span key={idx} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                          {fasilitas}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
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