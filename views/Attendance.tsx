
import React, { useState, useEffect } from 'react';
import { UserProfile, AttendanceRecord, AttendanceStatus, UserRole } from '../types';
import GlassCard from '../components/GlassCard';
import { QrCode, ClipboardList, Thermometer, CheckCircle2, Scan, Camera } from 'lucide-react';

interface AttendanceProps {
  user: UserProfile;
  logs: AttendanceRecord[];
  onRecordAdded: (record: AttendanceRecord) => void;
}

const Attendance: React.FC<AttendanceProps> = ({ user, logs, onRecordAdded }) => {
  const [view, setView] = useState<'options' | 'scan' | 'manual'>('options');
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
  
  const today = new Date().toISOString().split('T')[0];
  const userTodayLog = logs.find(l => l.userId === user.id && l.date === today);
  
  const hasCheckedIn = !!userTodayLog?.timeIn;
  const hasCheckedOut = !!userTodayLog?.timeOut;

  const startScan = () => {
    if (hasCheckedOut) return;
    setView('scan');
    setScanStatus('scanning');
    
    // Simulasi deteksi QR TOKEN "123456"
    setTimeout(() => {
      setScanStatus('success');
      setTimeout(() => {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        
        if (!hasCheckedIn) {
          // PROSES ABSEN MASUK
          onRecordAdded({
            id: `rec_${user.id}_${today}`,
            userId: user.id,
            userName: user.fullName,
            date: today,
            timeIn: timeStr,
            status: AttendanceStatus.PRESENT
          });
        } else {
          // PROSES ABSEN PULANG
          onRecordAdded({ 
            ...userTodayLog!,
            timeOut: timeStr 
          }); 
        }
        
        setView('options');
        setScanStatus('idle');
      }, 1500);
    }, 2500);
  };

  // TAMPILAN GURU: Menampilkan QR Code 123456
  if (user.role === UserRole.TEACHER) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div>
          <h2 className="text-[10px] font-orbitron uppercase tracking-[0.2em] text-purple-400 mb-1">Terminal Operator Utama</h2>
          <h1 className="text-3xl font-orbitron font-bold">QR ABSENSI</h1>
        </div>

        <GlassCard glowColor="purple" className="flex flex-col items-center py-12 text-center">
          <div className="p-4 bg-white rounded-3xl mb-8 shadow-[0_0_40px_rgba(168,85,247,0.3)]">
            <img 
              src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=123456&color=000&bgcolor=fff" 
              alt="Attendance QR"
              className="w-48 h-48"
            />
          </div>
          <h3 className="text-xl font-orbitron font-bold text-white mb-2 tracking-widest uppercase">Token Aktif: 123456</h3>
          <p className="text-[10px] font-orbitron text-gray-500 uppercase max-w-[240px] leading-relaxed">
            Mintalah siswa untuk memindai kode ini untuk mencatat waktu kehadiran mereka secara otomatis.
          </p>
        </GlassCard>

        <div className="flex gap-4">
          <GlassCard className="flex-1 p-4 flex flex-col items-center border-green-500/20">
            <span className="text-[8px] font-orbitron text-gray-500 mb-1 uppercase">Sistem</span>
            <span className="text-xs font-bold text-green-400">ONLINE</span>
          </GlassCard>
          <GlassCard className="flex-1 p-4 flex flex-col items-center">
            <span className="text-[8px] font-orbitron text-gray-500 mb-1 uppercase">Node</span>
            <span className="text-xs font-bold text-white uppercase">PUSAT DATA</span>
          </GlassCard>
        </div>
      </div>
    );
  }

  // TAMPILAN SISWA: Scanner (Kamera)
  if (view === 'scan') {
    return (
      <div className="flex flex-col h-full space-y-6 animate-in zoom-in duration-300">
        <div className="flex-1 glass border-2 border-purple-500/30 rounded-[3rem] relative overflow-hidden flex flex-col items-center justify-center bg-zinc-950">
          {/* Simulasi Kamera HUD */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full border-[20px] border-black" />
            <div className="grid grid-cols-4 grid-rows-4 h-full w-full">
               {[...Array(16)].map((_, i) => <div key={i} className="border border-white/5" />)}
            </div>
          </div>

          {scanStatus === 'scanning' ? (
            <>
              <div className="w-64 h-64 border-2 border-dashed border-purple-500/40 rounded-3xl flex items-center justify-center relative">
                <Camera size={48} className="text-purple-500/20" />
                <div className="scan-line absolute left-0 w-full" />
                
                {/* Lensa Simbolis */}
                <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-purple-500" />
                <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-purple-500" />
                <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-purple-500" />
                <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-purple-500" />
              </div>
              <div className="mt-12 text-center relative z-10">
                <h3 className="text-xl font-orbitron font-bold tracking-widest text-white mb-2 animate-pulse">MENYALAKAN KAMERA...</h3>
                <p className="text-[9px] font-orbitron text-purple-400/60 uppercase tracking-[0.3em]">Arahkan Lensa ke QR Operator</p>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center animate-in zoom-in duration-300">
              <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,197,94,0.3)] border border-green-500/50">
                <CheckCircle2 className="text-green-500" size={48} />
              </div>
              <h3 className="text-2xl font-orbitron font-bold text-green-400 tracking-widest uppercase">AUTENTIKASI BERHASIL</h3>
              <p className="text-[10px] font-orbitron text-gray-500 mt-2 uppercase">Waktu Terdaftar: {new Date().toLocaleTimeString('id-ID')}</p>
            </div>
          )}
        </div>
        <button 
          onClick={() => setView('options')}
          className="py-4 glass border-white/10 rounded-2xl font-orbitron text-[10px] tracking-[0.2em] text-gray-500 hover:text-white transition-colors"
        >
          BATALKAN PROSES SCAN
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-[10px] font-orbitron uppercase tracking-[0.2em] text-purple-400 mb-1">Terminal Subjek Siswa</h2>
        <h1 className="text-3xl font-orbitron font-bold">AKSES ABSENSI</h1>
      </div>

      <div className="grid gap-6">
        <GlassCard 
          glowColor={hasCheckedOut ? "none" : (hasCheckedIn ? "blue" : "purple")}
          className={`flex flex-col items-center text-center p-10 group transition-all relative overflow-hidden ${hasCheckedOut ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:border-purple-500/50 active:scale-95'}`}
          onClick={startScan}
        >
          <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center mb-6 transition-all duration-500 ${hasCheckedIn && !hasCheckedOut ? 'bg-blue-500/10 border border-blue-500/30 rotate-45 group-hover:rotate-90' : 'bg-purple-500/10 border border-purple-500/30 group-hover:scale-110'}`}>
            <QrCode size={48} className={`${hasCheckedIn && !hasCheckedOut ? 'text-blue-400 -rotate-45 group-hover:-rotate-90' : 'text-purple-400'} transition-all`} />
          </div>
          
          <h3 className="text-xl font-orbitron font-bold mb-2 uppercase tracking-widest">
            {hasCheckedOut ? 'SIKLUS SELESAI' : (hasCheckedIn ? 'ABSEN PULANG' : 'ABSEN MASUK')}
          </h3>
          
          <p className="text-[10px] text-gray-500 leading-relaxed max-w-[220px] uppercase tracking-tighter">
            {hasCheckedOut ? 'Anda telah mencatat kehadiran masuk dan pulang hari ini.' : (hasCheckedIn ? 'Klik untuk memindai QR Pulang guna mengakhiri sesi hari ini.' : 'Buka kamera untuk memindai kode QR Operator di Terminal Sekolah.')}
          </p>

          {hasCheckedOut && (
            <div className="mt-4 px-3 py-1 bg-white/5 rounded-full border border-white/10">
               <span className="text-[8px] font-orbitron text-gray-400 uppercase tracking-widest">Terkunci hingga hari esok</span>
            </div>
          )}
        </GlassCard>

        {!hasCheckedIn && (
          <div className="grid grid-cols-2 gap-4">
            <GlassCard 
              className="flex flex-col items-center text-center py-6 cursor-pointer group hover:border-blue-500/50 transition-all"
              onClick={() => setView('manual')}
            >
              <Thermometer size={24} className="text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-orbitron uppercase tracking-widest">Status Sakit</span>
            </GlassCard>
            <GlassCard 
              className="flex flex-col items-center text-center py-6 cursor-pointer group hover:border-yellow-500/50 transition-all"
              onClick={() => setView('manual')}
            >
              <ClipboardList size={24} className="text-yellow-400 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-orbitron uppercase tracking-widest">Status Izin</span>
            </GlassCard>
          </div>
        )}
      </div>

      {hasCheckedIn && (
        <GlassCard className={`flex items-center gap-4 py-4 ${hasCheckedOut ? 'bg-zinc-900/40 opacity-60' : 'bg-green-500/5 border-green-500/20'}`}>
          <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/40">
            <CheckCircle2 size={20} className="text-green-500" />
          </div>
          <div className="flex-1">
            <p className="text-[9px] font-orbitron text-gray-500 uppercase tracking-widest">Log Kehadiran {today}</p>
            <div className="flex gap-4 mt-0.5">
               <div>
                 <span className="text-[8px] font-orbitron text-gray-600 uppercase">Masuk:</span>
                 <p className="text-xs font-bold text-white ml-1 inline">{userTodayLog?.timeIn || '--:--'}</p>
               </div>
               {hasCheckedOut && (
                 <div>
                   <span className="text-[8px] font-orbitron text-gray-600 uppercase">Pulang:</span>
                   <p className="text-xs font-bold text-white ml-1 inline">{userTodayLog?.timeOut || '--:--'}</p>
                 </div>
               )}
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
};

export default Attendance;
