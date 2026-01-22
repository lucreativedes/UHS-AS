
export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  ADMIN = 'ADMIN'
}

export enum AttendanceStatus {
  PRESENT = 'HADIR',
  SICK = 'SAKIT',
  PERMISSION = 'IZIN',
  ABSENT = 'ALPA'
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  userName: string;
  date: string;
  timeIn?: string;
  timeOut?: string;
  status: AttendanceStatus;
  note?: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  studentId: string;
  password?: string;
  role: UserRole;
  class: string;
  dob: string;
  avatarUrl: string;
}

export type AppTab = 'dashboard' | 'attendance' | 'logs' | 'profile' | 'teacher';
