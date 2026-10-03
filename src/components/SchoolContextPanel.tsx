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
  School
} from 'lucide-react';
import { SCHOOL_DATA } from '../data/schoolStaffHelper';

interface SchoolContextPanelProps {
  customFacts: string;
  onUpdateCustomFacts: (facts: string) => void;
}

export const SchoolContextPanel: React.FC<SchoolContextPanelProps> = ({
  customFacts,
  onUpdateCustomFacts,
}) => {
  const [localFacts, setLocalFacts] = useState(customFacts);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onUpdateCustomFacts(localFacts);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-blue-100 text-blue-900 text-xs font-bold rounded flex items-center gap-1">
            <School className="w-3.5 h-3.5" />
            <span>Hồ Sơ Thực Tế Nhà Trường</span>
          </span>
          <span className="text-xs text-slate-500">
            Dữ liệu làm căn cứ cụ thể hóa văn bản hành chính sư phạm
          </span>
        </div>
        <h2 className="text-lg font-bold text-slate-900 mt-1">
          Trường THCS & THPT Đốc Binh Kiều (Đồng Tháp)
        </h2>
        <p className="text-xs text-slate-600 mt-0.5 max-w-3xl">
          Thông tin cơ sở vật chất, mạng lưới lớp học và đội ngũ giáo viên được hệ thống tự động đưa vào các văn bản Kế hoạch, Quyết định, Hướng dẫn của trường.
        </p>
      </div>

      {/* 3 Core Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Campus 1 & 3: Main Campus */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>Điểm Chính (Đốc Binh Kiều)</span>
            </h3>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
              38 Lớp
            </span>
          </div>
          <div className="text-xs text-slate-600 space-y-1">
            <p>• <strong>24 lớp THCS</strong>: Khối 6 (6 lớp), Khối 7 (6 lớp), Khối 8 (6 lớp), Khối 9 (6 lớp).</p>
            <p>• <strong>14 lớp THPT</strong>: Khối 10 (5 lớp), Khối 11 (4 lớp), Khối 12 (5 lớp).</p>
            <p className="text-slate-500 text-[11px]">Văn phòng BGH, hội đồng sư phạm, phòng máy vi tính và khu thực hành.</p>
          </div>
        </div>

        {/* Campus 2: Tan Kieu Campus */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Điểm Trường Tân Kiều</span>
            </h3>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              15 Lớp THCS
            </span>
          </div>
          <div className="text-xs text-slate-600 space-y-1">
            <p>• <strong>Cách điểm chính: 11 km</strong> (Xã Tân Kiều).</p>
            <p>• <strong>15 lớp THCS</strong>: Khối 6 (4 lớp: 6A7-6A10), Khối 7 (3 lớp: 7A7-7A9), Khối 8 (4 lớp: 8A7-8A10), Khối 9 (4 lớp: 9A7-9A10).</p>
            <p className="text-slate-500 text-[11px]">Cần chú ý điều phối luân chuyển giáo viên, thiết bị thí nghiệm và sinh hoạt chuyên môn trực tuyến.</p>
          </div>
        </div>

        {/* Staff & Departments */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
              <Users className="w-4 h-4 text-purple-600" />
              <span>Đội Ngũ Sư Phạm</span>
            </h3>
            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
              101 Cán bộ - GV
            </span>
          </div>
          <div className="text-xs text-slate-600 space-y-1">
            <p>• <strong>04 Ban Giám hiệu</strong>: HT. Lê Thanh Cường, PHT. Nguyễn Minh Trí, PHT. Phan Thanh Thảo, PHT. Nguyễn Thanh Tòng.</p>
            <p>• <strong>07 Tổ chuyên môn</strong>: Toán (15 GV), Văn (12 GV), KHTN-CN (26 GV), KHXH (16 GV), Ngoại ngữ-Tin (16 GV), GDTC-QPAN-NT (12 GV).</p>
          </div>
        </div>
      </div>

      {/* Custom Notes from Vice Principal */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-600" />
            <h3 className="font-semibold text-sm text-slate-800">
              Ghi Chú Thêm Thông Tin Riêng Của Trường (Cập nhật từ từ theo ý Thầy)
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
          Thầy có thể ghi thêm bất kỳ thông tin cụ thể nào ở đây (ví dụ: số lượng máy tính phòng vi tính, các chỉ tiêu đăng ký thi đua, lịch công tác tuần, ban cán sự, v.v.). Khi cụ thể hóa văn bản, AI sẽ tự động đọc các ghi chú này để đưa vào nội dung cho chuẩn xác.
        </p>

        <textarea
          value={localFacts}
          onChange={(e) => setLocalFacts(e.target.value)}
          rows={7}
          placeholder="Ví dụ: 
- Năm học 2026-2027 toàn trường phấn đấu: 100% đỗ tốt nghiệp THPT, 15 giải HSG cấp tỉnh.
- Điểm Tân Kiều có 1 phòng máy 24 máy vi tính, 1 phòng thực hành KHTN.
- Khối 10, 11 học chương trình GDPT 2018 với 3 chuyên đề học tập lựa chọn Toán - Lí - Hóa."
          className="w-full text-xs rounded-lg border border-slate-300 p-3 font-mono leading-relaxed focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>
    </div>
  );
};
