'use client';

import { supabase } from '@/lib/supabaseClient';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CheckSessionRedirect from './_checkSession';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'success' | 'error' | ''>('');
  const router = useRouter();

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setMessage('');
    setType('');
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setMessage('');
    setType('');
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) {
      setMessage(error.message);
      setType('error');
    }
    setLoading(false);
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setType('');
    if (!isLogin && password.length < 6) {
      setMessage('Password minimal 6 karakter');
      setType('error');
      setLoading(false);
      return;
    }
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setMessage(error.message);
        setType('error');
      } else {
        setMessage('Login berhasil!');
        setType('success');
        router.push('/');
      }
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setMessage(error.message);
        setType('error');
      } else {
        setMessage('Registrasi berhasil! Silakan cek email Anda untuk verifikasi.');
        setType('success');
      }
    }
    setLoading(false);
  };

  return (
    <>
      <CheckSessionRedirect />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-green-100 w-full max-w-md">
          {/* Header with Brand */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-green-600 rounded-full p-3">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Dawala</h1>
            <p className="text-gray-600 text-sm">Desa Wisata Alamendah</p>
          </div>

          <h2 className="text-xl font-semibold text-center mb-6 text-gray-700">
            {isLogin ? 'Masuk ke Akun' : 'Buat Akun Baru'}
          </h2>

          {/* Google Auth Button */}
          <button
            onClick={handleGoogleAuth}
            disabled={loading}
            className="w-full py-3 px-4 rounded-lg border border-gray-300 bg-white mb-4 font-medium hover:bg-gray-50 transition flex items-center justify-center gap-3 shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {loading ? 'Memuat...' : 'Lanjutkan dengan Google'}
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">atau</span>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailAuth}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
                Email
              </label>
              <input
                type="email"
                placeholder="contoh@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full py-3 px-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Password
              </label>
              <input
                type="password"
                placeholder="Minimal 6 karakter"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full py-3 px-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Memuat...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  {isLogin ? 'Masuk' : 'Daftar'}
                </>
              )}
            </button>
          </form>

          {/* Toggle Login/Register */}
          <div className="text-center mt-6 pt-4 border-t border-gray-200">
            <span className="text-gray-600 text-sm">
              {isLogin ? 'Belum punya akun?' : 'Sudah punya akun?'}
            </span>
            <button
              onClick={() => { setIsLogin(!isLogin); resetForm(); }}
              className="ml-2 text-green-600 hover:text-green-700 font-medium text-sm hover:underline transition"
            >
              {isLogin ? 'Daftar disini' : 'Masuk disini'}
            </button>
          </div>

          {/* Message */}
          {message && (
            <div className={`mt-4 p-4 rounded-lg text-center font-medium border ${
              type === 'success' 
                ? 'bg-green-50 text-green-700 border-green-200' 
                : 'bg-red-50 text-red-700 border-red-200'
            }`}>
              <div className="flex items-center justify-center gap-2">
                {type === 'success' ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                )}
                <span className="text-sm">{message}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}