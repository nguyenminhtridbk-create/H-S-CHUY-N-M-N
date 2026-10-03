import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  MapPin, 
  BookOpen, 
  Award, 
  GraduationCap, 
  CheckCircle, 
  Building2, 
  ExternalLink,
  ChevronRight,
  Layers,
  ArrowRight,
  Calendar
} from 'lucide-react';
import { 
  SCHOOL_DATA, 
  getCampusDisplayName, 
  getRoleDisplayName, 
  getTeacherAssignments,
  getHomeroomClass,
  RawTeacher,
  RawDepartment
} from '../data/schoolStaffHelper';

interface TeacherDirectoryTabProps {
  onSelectTeacherForLessonPlan: (teacherName: string, subject: string, grade: string, campus: string) => void;
  onSelectDepartmentForPlan: (deptName: string, campus: string) => void;
}

export const TeacherDirectoryTab: React.FC<TeacherDirectoryTabProps> = ({
  onSelectTeacherForLessonPlan,
  onSelectDepartmentForPlan,
}) => {
  const [selectedDeptId, setSelectedDeptId] = useState<string>('ALL');
  const [selectedCampus, setSelectedCampus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'teachers' | 'classes'>('teachers');
  const [activeTeacher, setActiveTeacher] = useState<RawTeacher | null>(null);

  // Filter teachers
  const filteredTeachers = SCHOOL_DATA.teachers.filter(teacher => {
    const matchesDept = selectedDeptId === 'ALL' || teacher.departmentId === selectedDeptId;
    const matchesCampus = selectedCampus === 'ALL' || teacher.campus === selectedCampus;
    const matchesSearch = 
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (teacher.notes && teacher.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesDept && matchesCampus && matchesSearch;
  });

  // Filter classes
  const filteredClasses = SCHOOL_DATA.classes.filter(cls => {
    const matchesCampus = selectedCampus === 'ALL' || cls.campus === selectedCampus;
    const matchesSearch = 
      cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.grade.includes(searchQuery);
    return matchesCampus && matchesSearch;
  });

  const getSubjectName = (subjectId?: string) => {
    if (!subjectId) return 'Chưa phân';
    const sub = SCHOOL_DATA.subjects.find(s => s.id === subjectId);
    return sub ? sub.name : subjectId;
  };

  const getDepartmentName = (deptId: string) => {
    const d = SCHOOL_DATA.departments.find(dept => dept.id === deptId);
    return d ? d.name : deptId;
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              <span>Hệ Thống Phân Công Chuyên Môn</span>
            </span>
            <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded">
              101 Cán bộ - Giáo viên • 53 Lớp • 7 Tổ
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1">
            Tra Cứu Đội Ngũ Giáo Viên & Phân Công Giảng Dạy Toàn Trường
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Dữ liệu đồng bộ trực tiếp từ hệ thống điều hành phân công chuyên môn Trường THCS & THPT Đốc Binh Kiều.
          </p>
        </div>

        <a
          href="https://phancongchuyenmonthcsthptdbk.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow transition shrink-0"
        >
          <span>Xem web Phân công chuyên môn gốc</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* 7 Departments Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 text-xs">
        <button
          onClick={() => setSelectedDeptId('ALL')}
          className={`p-2.5 rounded-xl border text-left transition-all ${
            selectedDeptId === 'ALL'
              ? 'bg-blue-900 text-white border-blue-900 shadow-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:border-blue-400'
          }`}
        >
          <span className="font-bold block text-sm">{SCHOOL_DATA.teachers.length} GV</span>
          <span className="text-[11px] truncate block opacity-90">Toàn trường (7 Tổ)</span>
        </button>

        {SCHOOL_DATA.departments.map(dept => {
          const count = SCHOOL_DATA.teachers.filter(t => t.departmentId === dept.id).length;
          const isSelected = selectedDeptId === dept.id;
          return (
            <button
              key={dept.id}
              onClick={() => setSelectedDeptId(dept.id)}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'
              }`}
            >
              <div className="flex items-center justify-between mb-0.5">
                <span className="font-black text-sm">{count} GV</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-slate-100 text-slate-600 group-hover:bg-white">
                  {dept.code}
                </span>
              </div>
              <span className="text-[11px] font-medium line-clamp-1 block leading-tight">
                {dept.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter and Switch bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3">
        <div className="flex items-center gap-3 flex-1 flex-wrap">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên giáo viên, mã, môn dạy, lớp..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Campus Filter */}
          <div className="min-w-[170px]">
            <select
              value={selectedCampus}
              onChange={(e) => setSelectedCampus(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">Tất cả 3 Điểm trường</option>
              <option value="THPTDBK">Điểm chính (THPT - 14 lớp)</option>
              <option value="THCSDBK">Điểm Đốc Binh Kiều (24 lớp)</option>
              <option value="THCSTK">Điểm Tân Kiều (15 lớp - 11km)</option>
            </select>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg self-start md:self-auto">
          <button
            onClick={() => setViewMode('teachers')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
              viewMode === 'teachers' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Theo Giáo Viên ({filteredTeachers.length})
          </button>
          <button
            onClick={() => setViewMode('classes')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
              viewMode === 'classes' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Theo 53 Lớp Học ({filteredClasses.length})
          </button>
        </div>
      </div>

      {/* Main Content: Teachers View */}
      {viewMode === 'teachers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredTeachers.map(teacher => {
            const assignments = getTeacherAssignments(teacher.id);
            const homeroom = getHomeroomClass(teacher.id);
            const isLeader = teacher.role && teacher.role !== 'GVBM' && teacher.role !== 'GiaoVien';

            return (
              <div
                key={teacher.id}
                className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top: Name, Code & Badge */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="font-bold text-slate-900 text-sm">{teacher.name}</h4>
                        <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                          {teacher.code}
                        </span>
                      </div>
                      <p className="text-[11px] text-blue-700 font-medium mt-0.5">
                        {getDepartmentName(teacher.departmentId)}
                      </p>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                      teacher.role === 'ToTruong'
                        ? 'bg-amber-100 text-amber-900 border border-amber-200'
                        : teacher.role === 'ToPho'
                        ? 'bg-purple-100 text-purple-900 border border-purple-200'
                        : teacher.role.includes('HieuTruong')
                        ? 'bg-blue-100 text-blue-900 border border-blue-200 font-black'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {getRoleDisplayName(teacher.role)}
                    </span>
                  </div>

                  {/* Info Meta */}
                  <div className="space-y-1 text-xs text-slate-600 mb-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <div className="flex justify-between items-center text-[11px]">
                      <span>Chuyên môn chính:</span>
                      <strong className="text-slate-800">{getSubjectName(teacher.primarySubjectId)}</strong>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                      <span>Điểm trường công tác:</span>
                      <span className="text-blue-800 font-semibold">{getCampusDisplayName(teacher.campus)}</span>
                    </div>
                    {homeroom && (
                      <div className="flex justify-between items-center text-[11px] text-emerald-800">
                        <span>Chủ nhiệm lớp:</span>
                        <strong className="bg-emerald-100 px-1.5 py-0.2 rounded font-bold">
                          {homeroom.name} ({getCampusDisplayName(homeroom.campus)})
                        </strong>
                      </div>
                    )}
                  </div>

                  {/* Teaching Classes */}
                  <div className="mb-3">
                    <span className="text-[11px] font-bold text-slate-700 block mb-1">
                      Các lớp phụ trách giảng dạy ({assignments.length} phân công):
                    </span>
                    {assignments.length === 0 ? (
                      <span className="text-[11px] text-slate-400 italic">Chưa có phân công tiết</span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {assignments.map((asgn, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded text-[11px] bg-indigo-50 text-indigo-900 border border-indigo-100 font-medium"
                            title={`${asgn.subjectName} - ${asgn.periods} tiết/tuần`}
                          >
                            {asgn.className} ({asgn.subjectName})
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Quick Action for Vice Principal */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      const firstAsgn = assignments[0];
                      const subj = firstAsgn ? firstAsgn.subjectName : getSubjectName(teacher.primarySubjectId);
                      const grade = firstAsgn ? `Khối ${firstAsgn.classGrade}` : 'Khối 8';
                      onSelectTeacherForLessonPlan(teacher.name, subj, grade, getCampusDisplayName(teacher.campus));
                    }}
                    className="flex-1 py-1.5 px-2 bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition"
                  >
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Thẩm định Giáo án</span>
                  </button>

                  {isLeader && (
                    <button
                      onClick={() => {
                        onSelectDepartmentForPlan(getDepartmentName(teacher.departmentId), getCampusDisplayName(teacher.campus));
                      }}
                      className="py-1.5 px-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition"
                      title="Thẩm định Kế hoạch Giáo dục của Tổ"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Kế hoạch Tổ</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Classes View (53 Lớp) */}
      {viewMode === 'classes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredClasses.map(cls => {
            const hrTeacher = SCHOOL_DATA.teachers.find(t => t.id === cls.homeroomTeacherId);
            const classAsgns = SCHOOL_DATA.assignments.filter(a => a.classId === cls.id);

            return (
              <div
                key={cls.id}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 font-black text-sm flex items-center justify-center">
                      {cls.name}
                    </span>
                    <div>
                      <h4 className="font-bold text-slate-800 text-xs">Khối {cls.grade} ({cls.level})</h4>
                      <span className="text-[11px] text-slate-500">{getCampusDisplayName(cls.campus)}</span>
                    </div>
                  </div>
                  <span className="text-[11px] bg-slate-100 px-2 py-0.5 rounded font-medium text-slate-700">
                    {cls.studentCount ? `${cls.studentCount} HS` : ''} {cls.roomNumber || ''}
                  </span>
                </div>

                <div className="text-xs text-slate-700">
                  <span className="text-slate-500">Giáo viên chủ nhiệm: </span>
                  <strong className="text-emerald-800">
                    {hrTeacher ? `${hrTeacher.name} (${hrTeacher.code})` : 'Chưa phân công'}
                  </strong>
                </div>

                <div className="text-xs">
                  <span className="text-slate-500 block mb-1">
                    Đội ngũ giáo viên giảng dạy ({classAsgns.length} môn):
                  </span>
                  <div className="max-h-36 overflow-y-auto space-y-1 pr-1">
                    {classAsgns.map((a, idx) => {
                      const t = SCHOOL_DATA.teachers.find(tch => tch.id === a.teacherId);
                      const s = SCHOOL_DATA.subjects.find(sub => sub.id === a.subjectId);
                      return (
                        <div key={idx} className="flex justify-between items-center text-[11px] bg-slate-50 p-1.5 rounded">
                          <span className="font-semibold text-slate-800">{s ? s.name : a.subjectId}</span>
                          <span className="text-blue-700">{t ? t.name : a.teacherId}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
