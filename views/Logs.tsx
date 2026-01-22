
import React, { useState } from 'react';
import { AttendanceRecord, AttendanceStatus, UserProfile, UserRole } from '../types';
import GlassCard from '../components/GlassCard';
import { STATUS_COLORS } from '../constants';
import { Download, Filter, Search, Share2, ArrowRight } from 'lucide-react';

interface LogsProps {
  logs: AttendanceRecord[];
  currentUser: UserProfile;
}

const Logs: React.FC<LogsProps> = ({ logs, currentUser }) => {
  const [filter, setFilter] = useState<AttendanceStatus | 'SEMUA'>('SEMUA');

  const displayLogs = currentUser.role === UserRole.TEACHER 
    ? logs 
    : logs.filter(l => l.userId === currentUser.id);

  const filteredLogs = filter === 'SEMUA' 
    ? displayLogs 
    : displayLogs.filter(l => l.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-[10px] font-orbitron uppercase tracking-[0.2em] text-purple-400 mb-1">Akses Database</h2>
          <h1 className="text-3xl font-orbitron font-bold tracking-tight">LOG SISTEM</h1>
        </div>
        <button className="p-3 glass rounded-2xl hover:bg-white/10 transition-colors">
          <Download size={20} />
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {['SEMUA', ...Object.values(AttendanceStatus)].map((status) => (
          <button 
            key={status}
            onClick={() => setFilter(status as any)}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-[10px] font-orbitron tracking-widest transition-all ${filter === status ? 'bg-purple-600 shadow-[0_0_10px_#a855f7]' : 'glass text-gray-500'}`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredLogs.map((log) => (
          <GlassCard key={log.id} className="p-4 border-l-4 group transition-all">
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="text-[9px] font-orbitron text-gray-500 uppercase tracking-widest">{log.date}</span>
                <h4 className="text-sm font-bold">{log.userName}</h4>
              </div>
              <div className={`px-3 py-1 rounded-full border text-[8px] font-orbitron uppercase tracking-widest ${STATUS_COLORS[log.status]}`}>
                {log.status}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex gap-6">
                <div>
                  <p className="text-[8px] font-orbitron text-gray-500 uppercase">Check-In</p>
                  <p className="text-xs font-bold text-green-400">{log.timeIn || '--:--'}</p>
                </div>
                <div>
                  <p className="text-[8px] font-orbitron text-gray-500 uppercase">Check-Out</p>
                  <p className="text-xs font-bold text-red-400">{log.timeOut || '--:--'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                <Share2 size={14} className="hover:text-purple-400 cursor-pointer" />
                <ArrowRight size={14} />
              </div>
            </div>
          </GlassCard>
        ))}

        {filteredLogs.length === 0 && (
          <div className="py-20 text-center space-y-4 opacity-30">
            <Search size={40} className="mx-auto" />
            <p className="font-orbitron text-[10px] tracking-[0.3em] uppercase">Data Tidak Ditemukan</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Logs;
