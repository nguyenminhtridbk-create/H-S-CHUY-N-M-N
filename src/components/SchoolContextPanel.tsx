import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Users, 
  Layers, 
  Save, 
  Check, 
  Info,
  Calendar,
  Sparkles,
  School,
  Clock,
  Award,
  BookOpen,
  FileText
} from 'lucide-react';
import { SCHOOL_OFFICIAL_PROFILE } from '../data/schoolOfficialData';

interface SchoolContextPanelProps {
  customFacts: string;
  onUpdateCustomFacts: (facts: string) => void;
  onViewSchoolPlanDoc?: () => void;
}

export const SchoolContextPanel: React.FC<SchoolContextPanelProps> = ({
  customFacts,
  onUpdateCustomFacts,
  onViewSchoolPlanDoc,
}) => {
  const [localFacts, setLocalFacts] = useState(customFacts);
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState<'overview' | 'schedule' | 'targets' | 'subjects'>('overview');

  const handleSave = () => {
    onUpdateCustomFacts(localFacts);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-blue-100 text-blue-900 text-xs font-bold rounded flex items-center gap-1">
              <School className="w-3.5 h-3.5" />
              <span>Hồ Sơ & Chỉ Tiêu Chuyên Môn Nhà Trường</span>
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Kế hoạch số 34/KH-THCS&THPTĐBK (25/9/2026)
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1">
            Trường THCS & THPT Đốc Binh Kiều (Sở GDĐT tỉnh Đồng Tháp)
          </h2>
          <p className="text-xs text-slate-600 mt-0.5 max-w-3xl">
            Sáp nhập từ 3 trường: THCS Đốc Binh Kiều, THCS Tân Kiều và THPT Đốc Binh Kiều theo Quyết định 2606/QĐ-UBND ngày 13/8/2026 của UBND tỉnh Đồng Tháp. Quy mô 53 lớp, 2.143 học sinh, 120 CB-GV-NV tại 3 điểm trường.
          </p>
        </div>

        {onViewSchoolPlanDoc && (
          <button
            onClick={onViewSchoolPlanDoc}
            className="shrink-0 px-3.5 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
          >
            <FileText className="w-4 h-4" />
            <span>Xem Kế hoạch Giáo dục Nhà trường (Bản đầy đủ)</span>
          </button>
        )}
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-200 gap-2 bg-white px-4 pt-2 rounded-t-xl">
        <button
          onClick={() => setActiveSection('overview')}
          className={`px-3 py-2 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition ${
            activeSection === 'overview'
              ? 'border-blue-700 text-blue-700 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>1. Quy mô & 3 Điểm trường</span>
        </button>
        <button
          onClick={() => setActiveSection('schedule')}
          className={`px-3 py-2 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition ${
            activeSection === 'schedule'
              ? 'border-blue-700 text-blue-700 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>2. Khung giờ trong ngày (Sáng 5 tiết - Chiều 5 tiết)</span>
        </button>
        <button
          onClick={() => setActiveSection('targets')}
          className={`px-3 py-2 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition ${
            activeSection === 'targets'
              ? 'border-blue-700 text-blue-700 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>3. Chỉ tiêu chuyên môn 2026-2027</span>
        </button>
        <button
          onClick={() => setActiveSection('subjects')}
          className={`px-3 py-2 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition ${
            activeSection === 'subjects'
              ? 'border-blue-700 text-blue-700 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>4. 08 Tổ & 96 GV Bộ môn</span>
        </button>
      </div>

      {/* Section 1: Overview & Campuses */}
      {activeSection === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Main Campus */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>Điểm Chính (THPT Đốc Binh Kiều cũ)</span>
              </h3>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                14 Lớp THPT (530 HS)
              </span>
            </div>
            <div className="text-xs text-slate-600 space-y-1">
              <p>• <strong>Diện tích</strong>: 15.683 m².</p>
              <p>• <strong>Học sinh</strong>: Khối 10 (5 lớp, 203 HS), Khối 11 (4 lớp, 142 HS), Khối 12 (5 lớp, 185 HS).</p>
              <p>• <strong>Cơ sở vật chất</strong>: Khu hiệu bộ; 09 phòng học kiên cố, 03 phòng lắp ghép; 09 phòng học bộ môn; Thư viện; 3 khu vệ sinh 3 tầng; hệ thống PCCC 2 máy bơm, 11 tủ chữa cháy vách tường.</p>
            </div>
          </div>

          {/* Doc Binh Kieu Campus */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-600" />
                <span>Điểm Đốc Binh Kiều (THCS cũ)</span>
              </h3>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                24 Lớp THCS (983 HS)
              </span>
            </div>
            <div className="text-xs text-slate-600 space-y-1">
              <p>• <strong>Diện tích</strong>: 11.126,7 m².</p>
              <p>• <strong>Học sinh</strong>: Khối 6 (6 lớp), Khối 7 (6 lớp), Khối 8 (6 lớp), Khối 9 (6 lớp).</p>
              <p>• <strong>Cơ sở vật chất</strong>: 22 phòng học; 05 phòng chức năng; 01 nhà công vụ; sân bóng đá mini, sân bóng chuyền, khu tập luyện GDTC.</p>
            </div>
          </div>

          {/* Tan Kieu Campus */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Điểm Tân Kiều (THCS Tân Kiều cũ)</span>
              </h3>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                15 Lớp THCS (557 HS)
              </span>
            </div>
            <div className="text-xs text-slate-600 space-y-1">
              <p>• <strong>Khoảng cách</strong>: Cách điểm chính <strong>11 km</strong> (xã Tân Kiều).</p>
              <p>• <strong>Diện tích</strong>: 8.570,8 m².</p>
              <p>• <strong>Học sinh</strong>: Khối 6 (4 lớp), Khối 7 (3 lớp), Khối 8 (4 lớp), Khối 9 (4 lớp).</p>
              <p>• <strong>Cơ sở vật chất</strong>: 09 phòng học; 10 phòng bộ môn (tiếng Anh, đa năng, tin học, KHTN 2 phòng, KHXH, công nghệ); 10 phòng làm việc và sinh hoạt, có phòng Ban Giám hiệu thường trực.</p>
            </div>
          </div>
        </div>
      )}

      {/* Section 2: Daily Schedule (Both Morning and Afternoon have 5 periods!) */}
      {activeSection === 'schedule' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Morning Schedule */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-3">
            <div className="border-b border-slate-100 pb-2">
              <h3 className="font-bold text-blue-900 text-sm flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Buổi Sáng (6h30 - 11h30 - ĐỦ 5 TIẾT)</span>
              </h3>
              <p className="text-[11px] text-slate-600 mt-1">
                <strong>Chính khóa:</strong> Khối 8, 9, 10, 11, 12 và chương trình dạy học 2 buổi/ngày.<br />
                <strong>Buổi 2:</strong> Dạy học trải nghiệm, bồi dưỡng HSG, phụ đạo yếu, sinh hoạt CLB đối với khối 6, 7.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b">
                  <tr>
                    <th className="py-1.5 px-2">Thời gian</th>
                    <th className="py-1.5 px-2">Nội dung</th>
                    <th className="py-1.5 px-2">Đổi tiết</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {SCHOOL_OFFICIAL_PROFILE.dailySchedule.morning.slots.map((s, idx) => (
                    <tr key={idx} className={s.content.includes('tiết') ? 'bg-blue-50/30' : ''}>
                      <td className="py-1.5 px-2 font-mono text-slate-700 font-semibold">{s.time}</td>
                      <td className="py-1.5 px-2 text-slate-800 font-medium">{s.content}</td>
                      <td className="py-1.5 px-2 text-slate-500">{s.rest || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Afternoon Schedule */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-3">
            <div className="border-b border-slate-100 pb-2">
              <h3 className="font-bold text-amber-900 text-sm flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Buổi Chiều (12h00 - 17h00 - ĐỦ 5 TIẾT)</span>
              </h3>
              <p className="text-[11px] text-slate-600 mt-1">
                <strong>Chính khóa:</strong> Khối 6, 7 và chương trình dạy học 2 buổi/ngày.<br />
                <strong>Buổi 2:</strong> Bồi dưỡng HSG, phụ đạo yếu, ôn thi vào lớp 10, ôn thi tốt nghiệp THPT, CLB, STEM đối với các khối 8, 9, 10, 11, 12.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b">
                  <tr>
                    <th className="py-1.5 px-2">Thời gian</th>
                    <th className="py-1.5 px-2">Nội dung</th>
                    <th className="py-1.5 px-2">Đổi tiết</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {SCHOOL_OFFICIAL_PROFILE.dailySchedule.afternoon.slots.map((s, idx) => (
                    <tr key={idx} className={s.content.includes('tiết') ? 'bg-amber-50/30' : ''}>
                      <td className="py-1.5 px-2 font-mono text-slate-700 font-semibold">{s.time}</td>
                      <td className="py-1.5 px-2 text-slate-800 font-medium">{s.content}</td>
                      <td className="py-1.5 px-2 text-slate-500">{s.rest || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Section 3: Key Academic Targets */}
      {activeSection === 'targets' && (
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="border-b pb-2 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Award className="w-4 h-4 text-purple-600" />
                <span>Hệ Thống Chỉ Tiêu Chuyên Môn Trọng Tâm Năm Học 2026 - 2027</span>
              </h3>
              <p className="text-xs text-slate-500">
                Trích từ Mục IV - Một số chỉ tiêu cơ bản trong Kế hoạch số 34/KH-THCS&THPTĐBK
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded bg-purple-100 text-purple-800 font-bold">
              Mục tiêu Chuẩn Quốc Gia mức độ 1 (2029)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase block">Tốt nghiệp THPT 2027</span>
              <p className="text-base font-bold text-blue-900">{SCHOOL_OFFICIAL_PROFILE.keyAcademicTargets.graduationTHPTTarget}</p>
              <p className="text-[11px] text-slate-600">Điểm TB toàn trường phấn đấu: <strong>5,99 điểm</strong> (Văn 7,52; Sử 7,81; Hóa 6,79; Toán 5,14; Lý 4,82...)</p>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase block">Tốt nghiệp THCS 2027</span>
              <p className="text-base font-bold text-emerald-900">{SCHOOL_OFFICIAL_PROFILE.keyAcademicTargets.graduationTHCSTarget}</p>
              <p className="text-[11px] text-slate-600">ĐBK: 250/250 (100%), Tân Kiều: 157/157 (100%).</p>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase block">Tuyển sinh vào lớp 10 THPT</span>
              <p className="text-base font-bold text-amber-900">{SCHOOL_OFFICIAL_PROFILE.keyAcademicTargets.grade10AdmissionTarget}</p>
              <p className="text-[11px] text-slate-600">Tuyển sinh trường nghề: 10% HS tốt nghiệp THCS.</p>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase block">Tỷ lệ đỗ Đại học</span>
              <p className="text-base font-bold text-indigo-900">{SCHOOL_OFFICIAL_PROFILE.keyAcademicTargets.universityAdmissionTarget}</p>
              <p className="text-[11px] text-slate-600">Năm 2025-2026 đạt 70%, phấn đấu tăng trưởng vững chắc.</p>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase block">Học sinh giỏi cấp tỉnh</span>
              <p className="text-base font-bold text-rose-900">{SCHOOL_OFFICIAL_PROFILE.keyAcademicTargets.provincialHSGPrizesTarget}</p>
              <p className="text-[11px] text-slate-600">Toán 1, Lý 1, Địa 1, Anh 1, Tin 1, Văn 5, Hóa 1, Sinh 1, Sử 6, GDKTPL 1.</p>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase block">Chỉ tiêu dự giờ chuyên môn</span>
              <p className="text-xs font-bold text-slate-900">• HT: ≥10% GV/kỳ | PHT: ≥30% GV/kỳ</p>
              <p className="text-[11px] text-slate-600">• TTCM: 100% GV ở điểm công tác, ≥30% GV ở 2 điểm còn lại.<br />• GV bộ môn: dự giờ ít nhất 04 tiết/học kỳ.</p>
            </div>
          </div>
        </div>
      )}

      {/* Section 4: Departments & Subject Teachers */}
      {activeSection === 'subjects' && (
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="border-b pb-2 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <Users className="w-4 h-4 text-blue-600" />
              <span>Đội Ngũ 120 Cán Bộ, Giáo Viên, Nhân Viên & 96 GV Bộ Môn</span>
            </h3>
            <span className="text-xs text-slate-500">
              100% đạt chuẩn đào tạo (88 ĐH, 8 Thạc sĩ)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-center">
            {SCHOOL_OFFICIAL_PROFILE.departments.map((dept) => (
              <div key={dept.id} className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                <span className="text-lg font-bold text-blue-900 block">{dept.count}</span>
                <span className="text-[11px] font-semibold text-slate-700 block leading-tight">{dept.name}</span>
                <span className="text-[10px] text-slate-500 block mt-1">{dept.female} Nữ • {dept.partyMembers} ĐV</span>
              </div>
            ))}
          </div>

          <div className="mt-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase mb-2">Thống kê chi tiết 96 Giáo viên theo bộ môn:</h4>
            <div className="flex flex-wrap gap-2">
              {SCHOOL_OFFICIAL_PROFILE.subjectTeachersCount.map((subj) => (
                <span key={subj.subject} className="px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-xs text-slate-800 font-medium">
                  <strong>{subj.subject}</strong>: {subj.count} GV {subj.master > 0 && `(${subj.master} ThS)`}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Custom Notes from Vice Principal */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-600" />
            <h3 className="font-semibold text-sm text-slate-800">
              Ghi Chú Bổ Sung Thông Tin Của Trường (AI sẽ bám sát vào đây khi cụ thể hóa văn bản)
            </h3>
          </div>
          <button
            onClick={handleSave}
            className="px-3 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold flex items-center gap-1.5 transition"
          >
            {saved ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Save className="w-3.5 h-3.5" />}
            <span>{saved ? 'Đã lưu ghi chú' : 'Lưu ghi chú này'}</span>
          </button>
        </div>

        <p className="text-xs text-slate-500">
          Thầy có thể cập nhật thêm bất kỳ thông tin thực tế nào tại đây. Khi sinh văn bản mới, AI sẽ đọc toàn bộ dữ liệu này và dữ liệu Kế hoạch số 34/KH-THCS&THPTĐBK để văn bản hoàn toàn khớp với thực tế nhà trường.
        </p>

        <textarea
          value={localFacts}
          onChange={(e) => setLocalFacts(e.target.value)}
          rows={5}
          placeholder="Thầy có thể bổ sung thông tin thực tế nhà trường tại đây..."
          className="w-full text-xs rounded-lg border border-slate-300 p-3 font-mono leading-relaxed focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>
    </div>
  );
};
