
import React, { useState } from 'react';
import GlassCard from '../components/GlassCard';
import { QrCode, Mail, Lock, LogIn, AlertCircle } from 'lucide-react';

interface LoginProps {
  onLogin: (identifier: string, pass: string) => boolean;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLoginSubmit = () => {
    const success = onLogin(identifier, password);
    if (!success) {
      setError('Kredensial tidak valid. Silakan cek kembali.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-black relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-30">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-600/20 blur-[150px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-sm text-center">
        <div className="mb-8 inline-block p-4 rounded-3xl glass border-purple-500/30">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.5)]">
            <span className="font-orbitron font-bold text-2xl">UH</span>
          </div>
        </div>

        <h1 className="text-3xl font-orbitron font-bold mb-2 tracking-tight">
          UNKLAB <span className="text-purple-500">SISTEM</span>
        </h1>
        <p className="text-gray-400 text-xs mb-10 tracking-[0.3em] uppercase opacity-60">Protokol Absensi v2.0</p>

        <div className="space-y-6">
          <GlassCard className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 text-red-400 text-[10px] font-orbitron bg-red-500/10 p-2 rounded-lg border border-red-500/20">
                <AlertCircle size={14} />
                {error}
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="text" 
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="ID SISWA / USERNAME" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-purple-500 text-sm font-orbitron placeholder:text-gray-600"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="KUNCI AKSES" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-purple-500 text-sm font-orbitron placeholder:text-gray-600"
              />
            </div>
            <button 
              onClick={handleLoginSubmit}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl font-orbitron font-bold tracking-widest flex items-center justify-center gap-2 glow-hover"
            >
              <LogIn size={20} />
              AUTENTIKASI
            </button>
          </GlassCard>

          <p className="mt-8 text-gray-600 text-[10px] font-orbitron uppercase tracking-widest leading-relaxed">
            © 2024 UNKLAB Highschool.<br/>Akses Terbatas untuk Personel Terdaftar.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
