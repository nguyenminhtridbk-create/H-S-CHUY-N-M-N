import React from 'react';
import { 
  Building2, 
  FileText, 
  FolderArchive, 
  Edit3, 
  School, 
  Users, 
  Download,
  BookOpen,
  Sparkles,
  HelpCircle,
  FolderOpen,
  Upload
} from 'lucide-react';

interface HeaderProps {
  onOpenLegalModal: () => void;
  onOpenUploadModal?: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  hasActiveDocument?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenLegalModal, 
  onOpenUploadModal,
  activeTab, 
  setActiveTab,
  hasActiveDocument = false,
}) => {
  return (
    <header className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white shadow-lg sticky top-0 z-40 border-b border-blue-900/60">
      {/* Top Administrative Bar */}
      <div className="max-w-7xl mx-auto px-4 py-1.5 flex flex-wrap justify-between items-center text-[11px] border-b border-white/10 text-slate-300">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-amber-300">SỞ GDĐT TỈNH ĐỒNG THÁP</span>
          <span>·</span>
          <span className="text-slate-200">UBND HUYỆN THÁP MƯỜI</span>
        </div>
        <div className="hidden sm:block font-medium tracking-wide text-slate-300">
          CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM — Độc lập • Tự do • Hạnh phúc
        </div>
        <div className="text-sky-300 font-medium">
          Chuẩn thể thức Nghị định 30/2020/NĐ-CP & Kế hoạch Giáo dục Nhà trường
        </div>
      </div>

      {/* Main Header Brand */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-blue-800/80 border border-blue-400/30 flex items-center justify-center shadow-inner text-amber-300 shrink-0">
            <School className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg md:text-xl font-bold tracking-tight text-white">
                TRƯỜNG THCS VÀ THPT ĐỐC BINH KIỀU
              </h1>
              <span className="text-xs px-2 py-0.5 rounded bg-blue-900/80 text-blue-200 border border-blue-700/60 font-medium">
                53 Lớp · 3 Điểm trường · 120 CB-GV-NV
              </span>
            </div>
            <p className="text-xs text-blue-200 mt-0.5 flex items-center gap-1.5 flex-wrap">
              <span className="text-white font-medium">Hệ Thống Xây Dựng & Cụ Thể Hóa Văn Bản Quản Lý Giáo Dục</span>
              <span>·</span>
              <span className="text-sky-300 font-medium">Thầy Phó Hiệu trưởng Nguyễn Minh Trí</span>
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 self-stretch md:self-auto justify-end flex-wrap">
          {onOpenUploadModal && (
            <button
              onClick={onOpenUploadModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm border border-emerald-400/40 transition"
              title="Tải lên tệp Word/PDF của Sở - Trích xuất tự động không tốn Quota AI"
            >
              <Upload className="w-3.5 h-3.5 text-white" />
              <span>Tải lên văn bản (Word / PDF)</span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] bg-emerald-700/80 rounded font-normal text-emerald-100">0 Quota AI</span>
            </button>
          )}

          <button
            onClick={onOpenLegalModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-900/60 hover:bg-blue-800 text-blue-100 border border-blue-700/50 shadow-sm transition"
            title="Xem căn cứ pháp lý: Nghị định 30, Thông tư 15, Quyết định 2606 sáp nhập trường..."
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-300" />
            <span>Căn cứ pháp lý & Chuẩn thể thức</span>
          </button>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="bg-slate-950/80 border-t border-slate-800/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 flex overflow-x-auto no-scrollbar">
          <nav className="flex space-x-1 py-1.5 text-xs font-semibold">
            {/* Tab 1: Builder */}
            <button
              onClick={() => setActiveTab('builder')}
              className={`px-3.5 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap transition ${
                activeTab === 'builder'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>1. Xây Dựng Văn Bản (Tra Cứu / Cụ Thể Hóa)</span>
            </button>

            {/* Tab 2: Editor / View */}
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-3.5 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap transition ${
                activeTab === 'editor'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Edit3 className="w-4 h-4 text-sky-300" />
              <span>2. Xem & Xuất File (Chuẩn A4 / Word .docx)</span>
              {hasActiveDocument && (
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              )}
            </button>

            {/* Tab 3: Directives from Department */}
            <button
              onClick={() => setActiveTab('directives')}
              className={`px-3.5 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap transition ${
                activeTab === 'directives'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FolderOpen className="w-4 h-4 text-amber-300" />
              <span>3. Chỉ Đạo Của Sở (Lưu sẵn trên webapp)</span>
            </button>

            {/* Tab 4: Archive */}
            <button
              onClick={() => setActiveTab('archive')}
              className={`px-3.5 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap transition ${
                activeTab === 'archive'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FolderArchive className="w-4 h-4 text-emerald-300" />
              <span>4. Kho Văn Bản Của Trường</span>
            </button>

            {/* Tab 5: School Staff & Profile */}
            <button
              onClick={() => setActiveTab('school_profile')}
              className={`px-3.5 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap transition ${
                activeTab === 'school_profile'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Users className="w-4 h-4 text-purple-300" />
              <span>5. Dữ Liệu Trường & Đội Ngũ (120 CB-GV-NV)</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
