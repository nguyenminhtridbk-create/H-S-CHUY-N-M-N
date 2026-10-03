import schoolDataRaw from './schoolStaffData.json';

export interface RawDepartment {
  id: string;
  name: string;
  code: string;
  color?: string;
}

export interface RawSubject {
  id: string;
  name: string;
  shortName: string;
  departmentId: string;
  defaultPeriods?: Record<string, number>;
  color?: string;
}

export interface RawClass {
  id: string;
  name: string;
  grade: string;
  level: string; // "THCS" | "THPT"
  campus: string; // "THPTDBK" | "THCSDBK" | "THCSTK"
  track?: string;
  studentCount?: number;
  homeroomTeacherId?: string;
  roomNumber?: string;
}

export interface RawTeacher {
  id: string;
  name: string;
  code: string;
  gender: string;
  birthDate?: string;
  campus: string; // "THPTDBK" | "THCSDBK" | "THCSTK"
  departmentId: string;
  primarySubjectId?: string;
  role: string;
  customReductionPeriods?: number;
  baseStandardPeriods?: number;
  notes?: string;
}

export interface RawAssignment {
  id: string;
  classId: string;
  subjectId: string;
  teacherId: string;
  periodsPerWeek?: number;
  note?: string;
}

export interface SchoolStaffData {
  departments: RawDepartment[];
  subjects: RawSubject[];
  classes: RawClass[];
  teachers: RawTeacher[];
  assignments: RawAssignment[];
}

export const SCHOOL_DATA: SchoolStaffData = schoolDataRaw as SchoolStaffData;

export function getCampusDisplayName(campusCode?: string): string {
  if (!campusCode) return 'Chưa rõ';
  if (campusCode === 'THPTDBK' || campusCode.includes('THPT')) return 'Điểm chính (THPT)';
  if (campusCode === 'THCSDBK' || campusCode.includes('DBK')) return 'Điểm Đốc Binh Kiều (THCS)';
  if (campusCode === 'THCSTK' || campusCode.includes('TK')) return 'Điểm Tân Kiều (11km)';
  return campusCode;
}

export function getRoleDisplayName(role?: string): string {
  if (!role) return 'Giáo viên';
  switch (role) {
    case 'HieuTruong': return 'Hiệu trưởng';
    case 'PhoHieuTruong': return 'Phó Hiệu trưởng';
    case 'ToTruong': return 'Tổ trưởng chuyên môn';
    case 'ToPho': return 'Tổ phó chuyên môn';
    case 'PhoCap': return 'Phó Cấp';
    case 'TongPhuTrachDoi': return 'Tổng Phụ trách Đội';
    case 'ConNho': return 'Giáo viên (con nhỏ)';
    case 'GVBM': return 'Giáo viên bộ môn';
    default: return role;
  }
}

export function getTeacherAssignments(teacherId: string) {
  const teacher = SCHOOL_DATA.teachers.find(t => t.id === teacherId);
  if (!teacher) return [];

  const rawAsgns = SCHOOL_DATA.assignments.filter(a => a.teacherId === teacherId);
  return rawAsgns.map(a => {
    const cls = SCHOOL_DATA.classes.find(c => c.id === a.classId);
    const sub = SCHOOL_DATA.subjects.find(s => s.id === a.subjectId);
    return {
      ...a,
      className: cls ? cls.name : a.classId,
      classGrade: cls ? cls.grade : '',
      classCampus: cls ? cls.campus : '',
      subjectName: sub ? sub.name : a.subjectId,
      periods: a.periodsPerWeek || 0,
    };
  });
}

export function getHomeroomClass(teacherId: string): RawClass | undefined {
  return SCHOOL_DATA.classes.find(c => c.homeroomTeacherId === teacherId);
}
