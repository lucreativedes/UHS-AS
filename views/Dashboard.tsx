
import React, { useEffect, useState } from 'react';
import { UserProfile, AttendanceRecord, AttendanceStatus, UserRole } from '../types';
import GlassCard from '../components/GlassCard';
import ProgressBar from '../components/ProgressBar';
import { Zap, Cpu, Clock, ChevronRight } from 'lucide-react';
import { getAttendanceInsights } from '../services/geminiService';

interface DashboardProps {
  user: UserProfile;
  logs: AttendanceRecord[];
}

const Dashboard: React.FC<DashboardProps> = ({ user, logs }) => {
  const [aiMessage, setAiMessage] = useState<string>("MENGINISIALISASI SISTEM...");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    const fetchInsight = async () => {
      const userLogs = logs.filter(l => l.userId === user.id);
      const msg = await getAttendanceInsights(user, userLogs);
      setAiMessage(msg || "SISTEM NORMAL.");
    };
    fetchInsight();
    return () => clearInterval(timer);
  }, [user, logs]);

  const userLogs = logs.filter(l => l.userId === user.id);
  const stats = {
    present: userLogs.filter(l => l.status === AttendanceStatus.PRESENT).length,
    sick: userLogs.filter(l => l.status === AttendanceStatus.SICK).length,
    permission: userLogs.filter(l => l.status === AttendanceStatus.PERMISSION).length,
  };

  const presentRate = userLogs.length > 0 ? Math.round((stats.present / userLogs.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-[10px] font-orbitron uppercase tracking-[0.2em] text-purple-400 mb-1">
            {user.role === UserRole.TEACHER ? 'Otoritas: Operator Utama' : 'Otoritas: Unit Subjek'}
          </h2>
          <h1 className="text-2xl font-orbitron font-bold">HALO, {user.fullName.split(' ')[0]}</h1>
        </div>
        <div className="w-12 h-12 rounded-2xl glass border-white/20 flex flex-col items-center justify-center">
          <Zap className="text-yellow-400" size={18} />
          <span className="text-[8px] font-orbitron mt-0.5">SYNC</span>
        </div>
      </div>

      {/* Clock HUD */}
      <GlassCard className="py-4 flex flex-col items-center border-blue-500/20">
        <div className="flex items-center gap-2 text-blue-400 mb-1">
          <Clock size={16} />
          <span className="text-[10px] font-orbitron tracking-widest uppercase">Waktu Sistem</span>
        </div>
        <div className="text-4xl font-orbitron font-bold tracking-tighter">
          {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </div>
        <div className="text-[10px] font-orbitron text-gray-500 mt-1 uppercase">
          {currentTime.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </GlassCard>

      <GlassCard glowColor="purple" className="relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-2 opacity-10">
          <Cpu size={50} />
        </div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
          <span className="text-[9px] font-orbitron text-purple-300 uppercase tracking-widest">Analisis AI Core</span>
        </div>
        <p className="text-sm italic leading-relaxed text-gray-200">"{aiMessage}"</p>
      </GlassCard>

      <div className="grid grid-cols-2 gap-4">
        <GlassCard className="p-4" glowColor="green">
          <p className="text-[9px] font-orbitron text-gray-500 mb-1 uppercase tracking-widest">Kehadiran</p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-orbitron font-bold text-green-400">{stats.present}</span>
            <span className="text-[9px] mb-1 opacity-50 uppercase">Siklus</span>
          </div>
        </GlassCard>
        <GlassCard className="p-4" glowColor="none">
          <p className="text-[9px] font-orbitron text-gray-500 mb-1 uppercase tracking-widest">Rasio Presensi</p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-orbitron font-bold">{presentRate}%</span>
          </div>
        </GlassCard>
      </div>

      <GlassCard className="space-y-6">
        <ProgressBar 
          value={presentRate} 
          label="Integritas Akademik" 
          colorClass="bg-green-500" 
          glowClass="shadow-[0_0_10px_#22c55e]" 
        />
        <ProgressBar 
          value={user.role === UserRole.TEACHER ? 100 : 88} 
          label="Konektivitas Node" 
          colorClass="bg-blue-500" 
          glowClass="shadow-[0_0_10px_#3b82f6]" 
        />
      </GlassCard>

      <button className="w-full py-4 glass border-white/10 rounded-2xl flex items-center justify-between px-6 group hover:border-purple-500/50 transition-all">
        <span className="text-xs font-orbitron uppercase tracking-widest group-hover:text-purple-400 transition-colors">Unduh Laporan Sistem</span>
        <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};

export default Dashboard;
