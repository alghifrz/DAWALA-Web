'use client';

import { supabase } from '@/lib/supabaseClient';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6">{isLogin ? 'Login' : 'Registrasi'}</h2>
        <button
          onClick={handleGoogleAuth}
          disabled={loading}
          className="w-full py-2 rounded-md border border-gray-300 bg-white mb-4 font-medium hover:bg-gray-50 transition"
        >
          {loading ? 'Loading...' : 'Lanjutkan dengan Google'}
        </button>
        <div className="text-center my-3 text-gray-400">atau</div>
        <form onSubmit={handleEmailAuth}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full py-2 px-3 mb-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full py-2 px-3 mb-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition mb-2"
          >
            {loading ? 'Loading...' : isLogin ? 'Login' : 'Registrasi'}
          </button>
        </form>
        <div className="text-center mt-2">
          <span>{isLogin ? 'Belum punya akun?' : 'Sudah punya akun?'}</span>
          <button
            onClick={() => { setIsLogin(!isLogin); resetForm(); }}
            className="ml-2 text-blue-600 hover:underline font-medium"
          >
            {isLogin ? 'Registrasi' : 'Login'}
          </button>
        </div>
        {message && (
          <div className={`mt-4 p-3 rounded-md text-center font-medium ${type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
} 