import React from 'react';
import { MapPin, Users, Building2, Cpu, Compass, AlertCircle } from 'lucide-react';
import { SCHOOL_CAMPUSES } from '../data/mockTemplates';

export const SchoolOverviewBar: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-4 mb-6">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Left: General Stats */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800 text-sm">HỆ THỐNG MẠNG LƯỚI TRƯỜNG THCS & THPT ĐỐC BINH KIỀU</span>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full font-medium">Năm học 2026 - 2027</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Tổng số <strong className="text-slate-800">53 lớp</strong> (39 lớp THCS Khối 6-9 & 14 lớp THPT Khối 10-12) phân bổ trên 3 địa bàn riêng biệt:
            </p>
          </div>
        </div>

        {/* Right: Quick Alert for Campus Distance */}
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 text-xs px-3 py-1.5 rounded-lg">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Điểm Tân Kiều cách điểm chính 11 km: Chú trọng tính khả thi về thiết bị và công nghệ số khi duyệt kế hoạch!</span>
        </div>
      </div>

      {/* 3 Campuses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 pt-3 border-t border-slate-100 text-xs">
        {SCHOOL_CAMPUSES.map((campus, idx) => (
          <div 
            key={campus.id} 
            className="p-2.5 rounded-lg border border-slate-200/70 bg-slate-50 hover:bg-white hover:border-blue-300 transition-all"
          >
            <div className="flex items-center justify-between font-semibold text-slate-800 mb-1">
              <div className="flex items-center gap-1.5 text-blue-900">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span>{campus.name}</span>
              </div>
              <span className="bg-white border border-slate-200 px-2 py-0.5 rounded font-bold text-blue-700">
                {campus.classCount} Lớp
              </span>
            </div>
            <div className="text-slate-600 flex justify-between items-center text-[11px] mb-1">
              <span>{campus.grades}</span>
              <span className="text-amber-700 font-medium">{campus.distanceFromMainCampus}</span>
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed line-clamp-1">
              {campus.locationNote}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
