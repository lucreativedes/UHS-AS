
import React, { useState } from 'react';
import { UserProfile, AttendanceRecord, AttendanceStatus, UserRole } from '../types';
import GlassCard from '../components/GlassCard';
import { Users, UserPlus, Lock, ShieldCheck, ChevronRight, X } from 'lucide-react';
import { CLASSES } from '../constants';

interface TeacherViewProps {
  students: UserProfile[];
  logs: AttendanceRecord[];
  onAddStudent: (student: UserProfile) => void;
}

const TeacherView: React.FC<TeacherViewProps> = ({ students, logs, onAddStudent }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newId, setNewId] = useState('');
  const [newPass, setNewPass] = useState('');
  const [newClass, setNewClass] = useState('12A');

  const handleAdd = () => {
    if (!newName || !newId || !newPass) return;
    onAddStudent({
      id: `usr_${Date.now()}`,
      fullName: newName,
      studentId: newId,
      password: newPass,
      role: UserRole.STUDENT,
      class: newClass,
      dob: '2006-01-01',
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newName}`
    });
    setShowAddForm(false);
    setNewName('');
    setNewId('');
    setNewPass('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-[10px] font-orbitron uppercase tracking-[0.2em] text-purple-400 mb-1">Manajer Unit</h2>
          <h1 className="text-3xl font-orbitron font-bold tracking-tight">KONTROL ADMIN</h1>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="p-3 bg-purple-600 rounded-2xl shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:scale-105 transition-all"
        >
          <UserPlus size={20} />
        </button>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
          <GlassCard className="w-full max-w-sm space-y-4 relative border-purple-500/50">
            <button 
              onClick={() => setShowAddForm(false)}
              className="absolute top-4 right-4 text-gray-500"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-orbitron font-bold mb-4 uppercase text-purple-400">Daftar Subjek Baru</h2>
            
            <input 
              type="text" 
              placeholder="Nama Lengkap" 
              value={newName}
              onChange={e => setNewName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm font-orbitron"
            />
            <input 
              type="text" 
              placeholder="ID Siswa (Nomor Induk)" 
              value={newId}
              onChange={e => setNewId(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm font-orbitron"
            />
            <div className="relative">
              <input 
                type="text" 
                placeholder="Kunci Akses (Password)" 
                value={newPass}
                onChange={e => setNewPass(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm font-orbitron"
              />
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            </div>
            
            <select 
              value={newClass}
              onChange={e => setNewClass(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm font-orbitron text-white"
            >
              {CLASSES.map(c => <option key={c} value={c} className="bg-black text-white">{c}</option>)}
            </select>

            <button 
              onClick={handleAdd}
              className="w-full py-4 bg-purple-600 rounded-2xl font-orbitron font-bold tracking-widest mt-4"
            >
              DAFTARKAN UNIT
            </button>
          </GlassCard>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-xs font-orbitron uppercase tracking-widest text-gray-500 pl-1">Manifest Siswa Terdaftar</h3>
        <div className="grid gap-3">
          {students.map((student) => {
            const isOnline = logs.some(l => l.userId === student.id && l.date === new Date().toISOString().split('T')[0]);
            return (
              <GlassCard key={student.id} className="p-4 flex items-center justify-between group hover:border-purple-500/30 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 bg-white/5">
                    <img src={student.avatarUrl} alt="avatar" className="w-full h-full object-cover grayscale" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">{student.fullName}</h4>
                    <p className="text-[9px] font-orbitron text-gray-500 uppercase">{student.class} • {student.studentId}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-gray-600'}`} />
                  <ChevronRight size={16} className="text-gray-600 group-hover:text-purple-400" />
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>

      <GlassCard className="bg-blue-600/10 border-blue-500/20 flex items-center gap-4 py-5">
        <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center border-blue-500/40">
          <ShieldCheck className="text-blue-400" size={24} />
        </div>
        <div>
          <p className="text-[10px] font-orbitron text-gray-500 uppercase tracking-widest">Enkripsi Data</p>
          <p className="text-xs font-bold text-white">PROTOKOL KEAMANAN AKTIF</p>
        </div>
      </GlassCard>
    </div>
  );
};

export default TeacherView;
