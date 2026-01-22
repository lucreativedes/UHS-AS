
import { UserRole, AttendanceStatus, AttendanceRecord, UserProfile } from './types';

export const CLASSES = ['12A', '12B', '12C', '12D', '12E'];

export const INITIAL_STUDENTS: UserProfile[] = [
  {
    id: 'usr_123',
    fullName: 'Jovan Nathaniel',
    studentId: '10502210001',
    password: 'password123',
    role: UserRole.STUDENT,
    class: '12A',
    dob: '2006-05-15',
    avatarUrl: 'https://picsum.photos/seed/jovan/200/200'
  }
];

export const STATUS_COLORS = {
  [AttendanceStatus.PRESENT]: 'text-green-400 border-green-500/50 bg-green-500/10',
  [AttendanceStatus.SICK]: 'text-blue-400 border-blue-500/50 bg-blue-500/10',
  [AttendanceStatus.PERMISSION]: 'text-yellow-400 border-yellow-500/50 bg-yellow-500/10',
  [AttendanceStatus.ABSENT]: 'text-red-400 border-red-500/50 bg-red-500/10',
};
