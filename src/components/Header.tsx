import React, { useState, useRef, useEffect } from 'react';
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
  Upload,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Check,
  Layers,
  Menu
} from 'lucide-react';

interface HeaderProps {
  onOpenLegalModal: () => void;
  onOpenUploadModal?: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  hasActiveDocument?: boolean;
}

interface TabItem {
  id: string;
  name: string;
  shortName: string;
  icon: React.ReactNode;
  desc: string;
  badge?: string;
  accentColor: string;
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenLegalModal, 
  onOpenUploadModal,
  activeTab, 
  setActiveTab,
  hasActiveDocument = false,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const TABS: TabItem[] = [
    {
      id: 'builder',
      name: '1. Xây Dựng Văn Bản (Tra Cứu / Cụ Thể Hóa)',
      shortName: '1. Xây Dựng Văn Bản',
      icon: <Sparkles className="w-4 h-4 text-amber-300" />,
      desc: 'Tra cứu chỉ đạo Sở, cụ thể hóa thành kế hoạch trường theo chuẩn NĐ 30',
      accentColor: 'from-amber-500/20 to-blue-500/20',
    },
    {
      id: 'editor',
      name: '2. Xem & Xuất File (Chuẩn A4 / Word .docx)',
      shortName: '2. Xem & Xuất File',
      icon: <Edit3 className="w-4 h-4 text-sky-300" />,
      desc: 'Xem trang A4 chuẩn hành chính, chỉnh sửa và xuất file Word .docx / in PDF',
      badge: hasActiveDocument ? 'Đang mở văn bản' : undefined,
      accentColor: 'from-sky-500/20 to-indigo-500/20',
    },
    {
      id: 'directives',
      name: '3. Chỉ Đạo Của Sở (Lưu sẵn trên webapp)',
      shortName: '3. Chỉ Đạo Của Sở',
      icon: <FolderOpen className="w-4 h-4 text-amber-300" />,
      desc: 'Kho công văn, hướng dẫn của Sở GDĐT Đồng Tháp đã bóc tách sẵn',
      accentColor: 'from-yellow-500/20 to-amber-500/20',
    },
    {
      id: 'archive',
      name: '4. Kho Văn Bản Của Trường',
      shortName: '4. Kho Văn Bản Trường',
      icon: <FolderArchive className="w-4 h-4 text-emerald-300" />,
      desc: 'Lưu trữ toàn bộ các kế hoạch, quyết định chính thức đã ban hành',
      accentColor: 'from-emerald-500/20 to-teal-500/20',
    },
    {
      id: 'school_profile',
      name: '5. Dữ Liệu Trường & Đội Ngũ (120 CB-GV-NV)',
      shortName: '5. Dữ Liệu & Đội Ngũ',
      icon: <Users className="w-4 h-4 text-purple-300" />,
      desc: 'Hồ sơ 53 lớp, 3 điểm trường, 102 giáo viên và tổ chuyên môn',
      accentColor: 'from-purple-500/20 to-pink-500/20',
    },
  ];

  const currentTabObj = TABS.find((t) => t.id === activeTab) || TABS[0];

  // Check scroll position to show indicators
  const checkScroll = () => {
    if (navScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = navScrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleScrollLeft = () => {
    if (navScrollRef.current) {
      navScrollRef.current.scrollBy({ left: -260, behavior: 'smooth' });
      setTimeout(checkScroll, 250);
    }
  };

  const handleScrollRight = () => {
    if (navScrollRef.current) {
      navScrollRef.current.scrollBy({ left: 260, behavior: 'smooth' });
      setTimeout(checkScroll, 250);
    }
  };

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    setIsDropdownOpen(false);
  };

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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm border border-emerald-400/40 transition active:scale-95"
              title="Tải lên tệp Word/PDF của Sở - Trích xuất tự động không tốn Quota AI"
            >
              <Upload className="w-3.5 h-3.5 text-white" />
              <span>Tải lên văn bản (Word / PDF)</span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] bg-emerald-700/80 rounded font-normal text-emerald-100">0 Quota AI</span>
            </button>
          )}

          <button
            onClick={onOpenLegalModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-900/60 hover:bg-blue-800 text-blue-100 border border-blue-700/50 shadow-sm transition active:scale-95"
            title="Xem căn cứ pháp lý: Nghị định 30, Thông tư 15, Quyết định 2606 sáp nhập trường..."
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-300" />
            <span>Căn cứ pháp lý & Chuẩn thể thức</span>
          </button>
        </div>
      </div>

      {/* Navigation Bar with Horizontal Scrolling & Dropdown Tab Selector */}
      <div className="bg-slate-950/85 border-t border-slate-800/80 backdrop-blur-md relative">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 flex items-center justify-between gap-1 sm:gap-2">
          
          {/* Left Scroll Button */}
          <button
            onClick={handleScrollLeft}
            disabled={!canScrollLeft}
            title="Cuộn các tab sang trái"
            className={`p-1.5 rounded-lg border text-slate-300 transition shrink-0 ${
              canScrollLeft
                ? 'bg-slate-900/90 hover:bg-blue-600 hover:text-white border-slate-700 cursor-pointer shadow-sm'
                : 'opacity-30 border-transparent cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Scrollable Tabs Container */}
          <div 
            ref={navScrollRef}
            onScroll={checkScroll}
            className="flex-1 overflow-x-auto scroll-smooth py-1.5 flex space-x-1.5 no-scrollbar scrollbar-none"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleSelectTab(tab.id)}
                  className={`px-3.5 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap transition text-xs font-semibold shrink-0 group ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md ring-1 ring-blue-400/40'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/90'
                  }`}
                >
                  <span className="shrink-0">{tab.icon}</span>
                  <span>{tab.name}</span>
                  {tab.id === 'editor' && hasActiveDocument && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Đang có văn bản đang mở"></span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Scroll Button */}
          <button
            onClick={handleScrollRight}
            disabled={!canScrollRight}
            title="Cuộn các tab sang phải"
            className={`p-1.5 rounded-lg border text-slate-300 transition shrink-0 ${
              canScrollRight
                ? 'bg-slate-900/90 hover:bg-blue-600 hover:text-white border-slate-700 cursor-pointer shadow-sm'
                : 'opacity-30 border-transparent cursor-not-allowed'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Quick Dropdown Tab Selector Button */}
          <div className="relative shrink-0" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition border shadow-sm ${
                isDropdownOpen
                  ? 'bg-blue-700 text-white border-blue-400'
                  : 'bg-slate-900 hover:bg-slate-800 text-amber-300 border-amber-500/40 hover:border-amber-400'
              }`}
              title="Xổ xuống chọn tab nhanh không cần kéo cuộn"
            >
              <Layers className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden md:inline">Xổ xuống chọn tab:</span>
              <span className="text-white max-w-[110px] sm:max-w-[140px] truncate">
                {currentTabObj.shortName}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Floating Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-slate-900/95 border border-slate-700 rounded-xl shadow-2xl backdrop-blur-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span className="font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    Chuyển nhanh danh mục tab
                  </span>
                  <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">
                    5 phân hệ chính
                  </span>
                </div>

                <div className="py-1 space-y-1">
                  {TABS.map((tab, idx) => {
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => handleSelectTab(tab.id)}
                        className={`w-full text-left px-3 py-2.5 rounded-lg flex items-start gap-3 transition group ${
                          isActive
                            ? 'bg-blue-600/90 text-white shadow-sm'
                            : 'hover:bg-slate-800/80 text-slate-200'
                        }`}
                      >
                        <div className="mt-0.5 p-1.5 rounded-md bg-slate-950/60 border border-white/10 shrink-0">
                          {tab.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-bold truncate">
                              {tab.name}
                            </span>
                            {isActive && (
                              <Check className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5 group-hover:text-slate-300">
                            {tab.desc}
                          </p>
                          {tab.badge && (
                            <span className="inline-block mt-1 text-[10px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded font-medium">
                              ● {tab.badge}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Bottom Quick Tools */}
                <div className="pt-2 mt-1 border-t border-slate-800 flex items-center justify-between gap-2 px-1">
                  {onOpenUploadModal && (
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        onOpenUploadModal();
                      }}
                      className="flex-1 px-2.5 py-1.5 bg-emerald-700/80 hover:bg-emerald-600 text-white rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1.5 transition"
                    >
                      <Upload className="w-3 h-3" />
                      <span>Tải file Word/PDF</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      onOpenLegalModal();
                    }}
                    className="flex-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1.5 transition"
                  >
                    <BookOpen className="w-3 h-3 text-amber-300" />
                    <span>Căn cứ pháp lý</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

