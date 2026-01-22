
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  History, 
  User, 
  QrCode,
  ShieldCheck
} from 'lucide-react';
import { UserRole, AppTab, UserProfile, AttendanceRecord, AttendanceStatus } from './types';
import { INITIAL_STUDENTS, CLASSES } from './constants';

// Views
import Login from './views/Login';
import Dashboard from './views/Dashboard';
import Attendance from './views/Attendance';
import Logs from './views/Logs';
import Profile from './views/Profile';
import TeacherView from './views/TeacherView';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');
  const [students, setStudents] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('unklab_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });
  const [logs, setLogs] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('unklab_logs');
    return saved ? JSON.parse(saved) : [];
  });

  // Persistence
  useEffect(() => {
    localStorage.setItem('unklab_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('unklab_logs', JSON.stringify(logs));
  }, [logs]);

  // Auth logic
  const handleLogin = (identifier: string, pass: string) => {
    if (identifier === 'ADMIN123' && pass === 'ADMIN123') {
      setCurrentUser({
        id: 'admin_1',
        fullName: 'Operator Utama',
        studentId: 'ADMIN123',
        role: UserRole.TEACHER,
        class: 'Sistem Pusat',
        dob: '-',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'
      });
      setIsLoggedIn(true);
      setActiveTab('dashboard');
      return true;
    }

    const student = students.find(s => (s.studentId === identifier || s.fullName === identifier) && s.password === pass);
    if (student) {
      setCurrentUser(student);
      setIsLoggedIn(true);
      setActiveTab('dashboard');
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setActiveTab('dashboard');
  };

  const syncAttendance = (record: AttendanceRecord) => {
    setLogs(prev => {
      const exists = prev.find(l => l.id === record.id);
      if (exists) {
        return prev.map(l => l.id === record.id ? record : l);
      }
      return [record, ...prev];
    });
  };

  const updateProfile = (updatedUser: UserProfile) => {
    setCurrentUser(updatedUser);
    setStudents(prev => prev.map(s => s.id === updatedUser.id ? updatedUser : s));
  };

  const addNewStudent = (newStudent: UserProfile) => {
    setStudents(prev => [...prev, newStudent]);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    if (!currentUser) return null;

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard user={currentUser} logs={logs} />;
      case 'attendance':
        return <Attendance user={currentUser} logs={logs} onRecordAdded={syncAttendance} />;
      case 'logs':
        return <Logs logs={logs} currentUser={currentUser} />;
      case 'profile':
        return <Profile user={currentUser} onUpdate={updateProfile} onLogout={handleLogout} />;
      case 'teacher':
        return <TeacherView students={students} logs={logs} onAddStudent={addNewStudent} />;
      default:
        return <Dashboard user={currentUser} logs={logs} />;
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Beranda', icon: LayoutDashboard },
    { id: 'attendance', label: 'Absen', icon: QrCode },
    { id: 'logs', label: 'Riwayat', icon: History },
    { id: 'profile', label: 'Profil', icon: User },
  ];

  const finalNavItems = currentUser?.role === UserRole.TEACHER 
    ? [...navItems.slice(0, 2), { id: 'teacher', label: 'Admin', icon: ShieldCheck }, navItems[3]]
    : navItems;

  return (
    <div className="min-h-screen pb-24 max-w-md mx-auto relative overflow-hidden flex flex-col bg-black">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_20%,_rgba(168,85,247,0.15),_transparent_70%)]" />
      </div>

      <main className="flex-1 p-5 relative z-10 pt-10">
        {renderContent()}
      </main>

      <nav className="fixed bottom-6 left-4 right-4 z-50">
        <div className="glass flex items-center justify-around p-3 rounded-3xl border border-white/20 shadow-2xl">
          {finalNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as AppTab)}
                className={`relative flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-300 ${
                  isActive ? 'text-purple-400 scale-110' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <Icon size={22} className={isActive ? 'drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]' : ''} />
                <span className={`text-[9px] font-orbitron mt-1 uppercase tracking-tighter ${isActive ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute -bottom-1 w-1 h-1 bg-purple-500 rounded-full shadow-[0_0_8px_#a855f7]" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default App;
