
import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types';
import GlassCard from '../components/GlassCard';
import { LogOut, Edit3, Save, ShieldCheck, QrCode } from 'lucide-react';

interface ProfileProps {
  user: UserProfile;
  onUpdate: (user: UserProfile) => void;
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdate, onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.fullName);
  const [id, setId] = useState(user.studentId);
  const [className, setClassName] = useState(user.class);

  const handleSave = () => {
    onUpdate({
      ...user,
      fullName: name,
      studentId: id,
      class: className
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-[10px] font-orbitron uppercase tracking-[0.2em] text-purple-400 mb-1">Identifikasi Unit</h2>
          <h1 className="text-3xl font-orbitron font-bold">PROFIL</h1>
        </div>
        <button 
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className={`p-3 rounded-2xl transition-all ${isEditing ? 'bg-green-600 shadow-[0_0_15px_rgba(34,197,94,0.4)]' : 'glass border-white/20'}`}
        >
          {isEditing ? <Save size={20} /> : <Edit3 size={20} />}
        </button>
      </div>

      {/* Futuristic ID Card */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-[2.5rem] blur-xl opacity-50" />
        <GlassCard className="relative overflow-hidden p-0 rounded-[2.5rem] border-white/20 bg-black/60 shadow-2xl">
          <div className="p-8">
            <div className="flex justify-between items-start mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 p-[1px]">
                <div className="w-full h-full rounded-2xl bg-black flex items-center justify-center p-1.5">
                  <div className="w-full h-full rounded-xl overflow-hidden border border-white/10">
                    <img src={user.avatarUrl} alt="avatar" className="w-full h-full object-cover grayscale contrast-125" />
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="font-orbitron font-bold text-xl tracking-tighter">UNKLAB</span>
                <p className="text-[8px] font-orbitron text-purple-500 tracking-[0.3em] uppercase">Highschool Div.</p>
              </div>
            </div>

            <div className="space-y-5 mb-8">
              <div>
                <p className="text-[8px] font-orbitron text-gray-500 uppercase tracking-[0.2em] mb-1">Penamaan Unit</p>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={name} 
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-white/10 border border-purple-500/50 rounded-lg px-2 py-1 text-sm font-orbitron text-white outline-none"
                  />
                ) : (
                  <p className="text-xl font-orbitron font-bold text-white uppercase">{user.fullName}</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[8px] font-orbitron text-gray-500 uppercase tracking-[0.2em] mb-1">Identitas Siswa</p>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={id} 
                      onChange={e => setId(e.target.value)}
                      className="w-full bg-white/10 border border-purple-500/50 rounded-lg px-2 py-1 text-xs font-orbitron text-white outline-none"
                    />
                  ) : (
                    <p className="text-sm font-orbitron font-bold text-gray-200">{user.studentId}</p>
                  )}
                </div>
                <div>
                  <p className="text-[8px] font-orbitron text-gray-500 uppercase tracking-[0.2em] mb-1">Penempatan Node</p>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={className} 
                      onChange={e => setClassName(e.target.value)}
                      className="w-full bg-white/10 border border-purple-500/50 rounded-lg px-2 py-1 text-xs font-orbitron text-white outline-none"
                    />
                  ) : (
                    <p className="text-sm font-orbitron font-bold text-gray-200">{user.class}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-white/10">
              <div className="flex gap-1.5">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className={`h-1 w-5 rounded-full ${i < 3 ? 'bg-purple-500' : 'bg-white/10'}`} />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-purple-400" />
                <span className="text-[9px] font-orbitron tracking-widest text-purple-400 uppercase">Terverifikasi</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 py-3 px-8 flex justify-between items-center">
            <div className="flex gap-2">
              <div className="w-6 h-4 bg-white/5 rounded-sm" />
              <div className="w-16 h-4 bg-white/5 rounded-sm" />
            </div>
            <span className="text-[8px] font-orbitron text-gray-600">PROTIK: 2024-2025</span>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <GlassCard className="p-4 flex flex-col items-center gap-2">
          <QrCode size={20} className="text-blue-400" />
          <span className="text-[10px] font-orbitron uppercase text-gray-500">Node Sync</span>
          <span className="text-xs font-bold font-orbitron">TERKONEKSI</span>
        </GlassCard>
        <GlassCard className="p-4 flex flex-col items-center gap-2">
          <ShieldCheck size={20} className="text-green-400" />
          <span className="text-[10px] font-orbitron uppercase text-gray-500">Security</span>
          <span className="text-xs font-bold font-orbitron">LEVEL 1</span>
        </GlassCard>
      </div>

      <button 
        onClick={onLogout}
        className="w-full py-5 glass border-red-500/20 rounded-3xl flex items-center justify-center gap-4 group hover:bg-red-500/10 transition-all active:scale-95"
      >
        <LogOut size={20} className="text-red-500 group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-orbitron tracking-[0.2em] uppercase text-red-500">Terminasi Sesi</span>
      </button>
    </div>
  );
};

export default Profile;
