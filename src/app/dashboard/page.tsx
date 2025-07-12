'use client';
import Link from 'next/link';

export default function DashboardPage() {
  const features = [
    {
      href: '/dashboard/kuliner',
      title: 'Kuliner Halal Lokal',
      description: 'Nikmati cita rasa autentik kuliner halal',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
        </svg>
      ),
      color: 'bg-green-600'
    },
    {
      href: '/dashboard/tempat-ibadah',
      title: 'Tempat Ibadah',
      description: 'Temukan tempat ibadah yang nyaman',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
        </svg>
      ),
      color: 'bg-green-600'
    },
    {
      href: '/dashboard/homestay',
      title: 'Homestay Ramah Muslim',
      description: 'Menginap nyaman dengan fasilitas ramah muslim',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
        </svg>
      ),
      color: 'bg-green-600'
    },
    {
      href: '/dashboard/paket-wisata',
      title: 'Paket Wisata Edukatif',
      description: 'Jelajahi keindahan alam sambil belajar',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0H8M8 10h8v10H8V10z"/>
        </svg>
      ),
      color: 'bg-green-600'
    },
    {
      href: '/dashboard/edukasi',
      title: 'Edukasi Rantai Pasok Hijau',
      description: 'Pelajari tentang keberlanjutan',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
        </svg>
      ),
      color: 'bg-green-600'
    },
    {
      href: '/dashboard/pemesanan-saya',
      title: 'Pemesanan Saya',
      description: 'Kelola dan pantau pemesanan Anda',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
      ),
      color: 'bg-green-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-left mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-green-600 p-3 rounded-full">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2c-4.97 0-9 4.03-9 9 0 4.17 2.84 7.67 6.69 8.69L12 22l2.31-2.31C18.16 18.67 21 15.17 21 11c0-4.97-4.03-9-9-9zm0 16c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zm-1-11h2v6h-2zm0 8h2v2h-2z"/>
              </svg>
            </div>
            <h1 className="text-5xl font-bold text-green-800">
              Selamat Datang di Dawala
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl">
            Desa Wisata Alamendah - Destinasi wisata halal yang menawarkan pengalaman 
            autentik dengan nilai-nilai keberlanjutan dan kearifan lokal
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <Link
              key={index}
              href={feature.href}
              className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:scale-105 transition-all duration-300 aspect-square min-h-0"
            >
              <div className={`absolute inset-0 bg-green-100 opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
              <div className="relative p-6 h-full flex flex-col justify-center">
                <div className="text-center">
                  <div className={`text-white mb-4 ${feature.color} w-12 h-12 rounded-full flex items-center justify-center mx-auto`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold text-green-900 mb-2 group-hover:text-green-700 transition-colors leading-tight">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-xs leading-relaxed mb-3">
                    {feature.description}
                  </p>
                  <span className="inline-flex items-center text-green-600 font-medium group-hover:text-green-700 transition-colors text-sm">
                    Jelajahi
                    <svg className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-green-600 mb-3 flex justify-center">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
              </svg>
            </div>
            <h3 className="font-bold text-green-900 mb-2">Wisata Halal</h3>
            <p className="text-gray-600 text-sm">
              Destinasi wisata yang ramah muslim dengan fasilitas lengkap
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-green-600 mb-3 flex justify-center">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h3 className="font-bold text-green-900 mb-2">Berkelanjutan</h3>
            <p className="text-gray-600 text-sm">
              Turisme berkelanjutan yang menjaga kelestarian alam dan budaya
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-green-600 mb-3 flex justify-center">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
            </div>
            <h3 className="font-bold text-green-900 mb-2">Edukatif</h3>
            <p className="text-gray-600 text-sm">
              Pengalaman wisata yang kaya akan edukasi dan pembelajaran
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
