
import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, AttendanceRecord, AttendanceStatus, UserRole } from '../types';
import GlassCard from '../components/GlassCard';
import { QrCode, ClipboardList, Thermometer, CheckCircle2, Camera, RefreshCw } from 'lucide-react';

interface AttendanceProps {
  user: UserProfile;
  logs: AttendanceRecord[];
  onRecordAdded: (record: AttendanceRecord) => void;
}

const Attendance: React.FC<AttendanceProps> = ({ user, logs, onRecordAdded }) => {
  const [view, setView] = useState<'options' | 'scan' | 'manual'>('options');
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const today = new Date().toISOString().split('T')[0];
  const userTodayLog = logs.find(l => l.userId === user.id && l.date === today);
  
  const hasCheckedIn = !!userTodayLog?.timeIn;
  const hasCheckedOut = !!userTodayLog?.timeOut;

  // Fix: Defined startScan function to initiate the scanning process
  const startScan = () => {
    setView('scan');
    setScanStatus('scanning');
  };

  // Aktifkan kamera saat masuk ke mode scan
  useEffect(() => {
    let stream: MediaStream | null = null;

    if (view === 'scan' && scanStatus === 'scanning') {
      const startCamera = async () => {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' }, // Kamera belakang
            audio: false 
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          
          // Simulasi scan otomatis setelah 3 detik melihat feed kamera
          setTimeout(() => {
            handleScanSuccess();
          }, 3500);
        } catch (err) {
          console.error("Gagal akses kamera:", err);
          setScanStatus('error');
        }
      };
      startCamera();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [view, scanStatus]);

  const handleScanSuccess = () => {
    setScanStatus('success');
    setTimeout(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      
      if (!hasCheckedIn) {
        onRecordAdded({
          id: `rec_${user.id}_${today}`,
          userId: user.id,
          userName: user.fullName,
          date: today,
          timeIn: timeStr,
          status: AttendanceStatus.PRESENT
        });
      } else {
        onRecordAdded({ 
          ...userTodayLog!,
          timeOut: timeStr 
        }); 
      }
      
      setView('options');
      setScanStatus('idle');
    }, 1500);
  };

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
              src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=123456&color=000&bgcolor=fff" 
              alt="Attendance QR"
              className="w-56 h-56"
            />
          </div>
          <h3 className="text-xl font-orbitron font-bold text-white mb-2 tracking-widest uppercase">Token Aktif: 123456</h3>
          <p className="text-[10px] font-orbitron text-gray-500 uppercase max-w-[240px] leading-relaxed">
            Siswa harus memindai kode ini melalui aplikasi mereka untuk mencatat kehadiran.
          </p>
        </GlassCard>

        <div className="grid grid-cols-2 gap-4">
          <GlassCard className="p-4 flex flex-col items-center border-green-500/20">
            <span className="text-[8px] font-orbitron text-gray-500 mb-1 uppercase">Sistem</span>
            <span className="text-xs font-bold text-green-400">AKTIF</span>
          </GlassCard>
          <GlassCard className="p-4 flex flex-col items-center">
            <span className="text-[8px] font-orbitron text-gray-500 mb-1 uppercase">Server</span>
            <span className="text-xs font-bold text-white uppercase">TERHUBUNG</span>
          </GlassCard>
        </div>
      </div>
    );
  }

  if (view === 'scan') {
    return (
      <div className="flex flex-col h-full space-y-6 animate-in zoom-in duration-300">
        <div className="flex-1 glass border-2 border-purple-500/30 rounded-[3rem] relative overflow-hidden flex flex-col items-center justify-center bg-black">
          {scanStatus === 'scanning' ? (
            <div className="w-full h-full relative">
              {/* Kamera Feed Sebenarnya */}
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-full h-full object-cover rounded-[2.8rem]"
              />
              
              {/* Overlay Scanner */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="w-64 h-64 border-2 border-white/30 rounded-3xl relative">
                  <div className="scan-line absolute left-0 w-full" />
                  
                  {/* Corner Brackets */}
                  <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-purple-500" />
                  <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-purple-500" />
                  <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-purple-500" />
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-purple-500" />
                </div>
                
                <div className="mt-10 text-center">
                  <h3 className="text-lg font-orbitron font-bold text-white mb-2 drop-shadow-lg">MEMINDAI...</h3>
                  <p className="text-[10px] font-orbitron text-purple-300 uppercase tracking-[0.2em] bg-black/40 px-3 py-1 rounded-full">Arahkan ke QR Guru</p>
                </div>
              </div>
            </div>
          ) : scanStatus === 'error' ? (
            <div className="p-8 text-center space-y-4">
              <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto border border-red-500/50">
                <Camera size={32} className="text-red-500" />
              </div>
              <h3 className="text-xl font-orbitron font-bold text-red-500">KAMERA GAGAL</h3>
              <p className="text-xs text-gray-400">Pastikan izin kamera sudah diizinkan di browser Anda.</p>
              <button 
                onClick={() => setScanStatus('scanning')}
                className="px-6 py-2 glass rounded-xl text-xs font-orbitron flex items-center gap-2 mx-auto"
              >
                <RefreshCw size={14} /> COBA LAGI
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center animate-in zoom-in duration-300">
              <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,197,94,0.3)] border border-green-500/50">
                <CheckCircle2 className="text-green-500" size={48} />
              </div>
              <h3 className="text-2xl font-orbitron font-bold text-green-400 tracking-widest uppercase">TERVERIFIKASI</h3>
              <p className="text-[10px] font-orbitron text-gray-500 mt-2 uppercase">Log Terkirim ke Pusat Data</p>
            </div>
          )}
        </div>
        <button 
          onClick={() => setView('options')}
          className="py-4 glass border-white/10 rounded-2xl font-orbitron text-[10px] tracking-[0.2em] text-gray-500"
        >
          KEMBALI KE MENU
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
          onClick={() => !hasCheckedOut && startScan()}
        >
          <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center mb-6 transition-all duration-500 ${hasCheckedIn && !hasCheckedOut ? 'bg-blue-500/10 border border-blue-500/30' : 'bg-purple-500/10 border border-purple-500/30 group-hover:scale-110'}`}>
            <QrCode size={48} className={`${hasCheckedIn && !hasCheckedOut ? 'text-blue-400' : 'text-purple-400'}`} />
          </div>
          
          <h3 className="text-xl font-orbitron font-bold mb-2 uppercase tracking-widest">
            {hasCheckedOut ? 'SIKLUS SELESAI' : (hasCheckedIn ? 'ABSEN PULANG' : 'ABSEN MASUK')}
          </h3>
          
          <p className="text-[10px] text-gray-400 leading-relaxed max-w-[220px] uppercase tracking-tighter">
            {hasCheckedOut ? 'Siklus kehadiran hari ini lengkap.' : (hasCheckedIn ? 'Klik untuk scan QR Pulang.' : 'Buka kamera untuk scan QR Guru.')}
          </p>
        </GlassCard>

        {!hasCheckedIn && (
          <div className="grid grid-cols-2 gap-4">
            <GlassCard className="flex flex-col items-center py-6 cursor-pointer hover:border-blue-500/50 transition-all">
              <Thermometer size={24} className="text-blue-400 mb-2" />
              <span className="text-[10px] font-orbitron uppercase">Sakit</span>
            </GlassCard>
            <GlassCard className="flex flex-col items-center py-6 cursor-pointer hover:border-yellow-500/50 transition-all">
              <ClipboardList size={24} className="text-yellow-400 mb-2" />
              <span className="text-[10px] font-orbitron uppercase">Izin</span>
            </GlassCard>
          </div>
        )}
      </div>

      {hasCheckedIn && (
        <GlassCard className={`flex items-center gap-4 py-4 ${hasCheckedOut ? 'bg-zinc-900/40' : 'bg-green-500/5 border-green-500/20'}`}>
          <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/40">
            <CheckCircle2 size={20} className="text-green-500" />
          </div>
          <div className="flex-1">
            <p className="text-[9px] font-orbitron text-gray-500 uppercase">Log {today}</p>
            <div className="flex gap-4 mt-0.5 font-orbitron">
               <div><span className="text-[8px] text-gray-600">IN:</span> <span className="text-xs text-white">{userTodayLog?.timeIn}</span></div>
               {hasCheckedOut && <div><span className="text-[8px] text-gray-600">OUT:</span> <span className="text-xs text-white">{userTodayLog?.timeOut}</span></div>}
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
};

export default Attendance;
