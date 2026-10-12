import React, { useState, useMemo } from 'react';
import { 
  Award, 
  ShieldCheck, 
  FileText, 
  Calculator, 
  Table, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  Download, 
  ExternalLink, 
  Filter, 
  Search, 
  Sparkles, 
  Check, 
  X, 
  Plus, 
  Minus, 
  RefreshCw, 
  ChevronRight, 
  ChevronDown, 
  School, 
  Building2, 
  BookOpen, 
  Users, 
  Clock, 
  HeartHandshake, 
  Printer,
  FileCheck,
  AlertOctagon,
  Scale,
  FileQuestion,
  GraduationCap,
  Briefcase,
  Loader2
} from 'lucide-react';
import { 
  EMULATION_CRITERIA_LIST, 
  STAFF_EMULATION_CRITERIA, 
  LEADER_EMULATION_CRITERIA,
  EVIDENCE_GUIDELINES,
  PENALTY_RULES, 
  BONUS_RULES, 
  RATING_STANDARDS, 
  COMPARISON_MATRIX,
  EmulationCriterion,
  PenaltyItem,
  BonusItem
} from '../data/emulationRulesData';
import { OFFICIAL_EMULATION_DOCUMENT } from '../data/officialEmulationDocument';
import { exportDocumentToDocx } from '../utils/docxExport';
import { SchoolDocument } from '../types/document';

interface EmulationRulesTabProps {
  onOpenInEditor?: (doc: SchoolDocument) => void;
  onSaveToArchive?: (doc: SchoolDocument) => void;
}

export const EmulationRulesTab: React.FC<EmulationRulesTabProps> = ({
  onOpenInEditor,
  onSaveToArchive,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'criteria' | 'calculator' | 'regulation' | 'matrix' | 'evidence' | 'qna'>('criteria');
  const [criteriaType, setCriteriaType] = useState<'teacher' | 'leader' | 'staff'>('teacher');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'common' | 'duty' | 'penalty' | 'bonus'>('all');
  const [isExportingDocx, setIsExportingDocx] = useState(false);

  // --- Calculator State ---
  const [calcRole, setCalcRole] = useState<'teacher' | 'homeroom' | 'leader' | 'staff'>('teacher');
  const [calcCampus, setCalcCampus] = useState<'chinh_thpt' | 'dbk_thcs' | 'tankieu_thcs'>('chinh_thpt');
  const [teacherName, setTeacherName] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('Tổ Toán');

  // Criteria scores in calculator (key: critId, value: achieved score)
  const [calcCommonScore, setCalcCommonScore] = useState<number>(30); // Default full 30
  const [calcDutyScore, setCalcDutyScore] = useState<number>(70); // Default full 70
  const [selectedPenalties, setSelectedPenalties] = useState<{ [penId: string]: number }>({});
  const [selectedBonuses, setSelectedBonuses] = useState<{ [bonId: string]: number }>({});
  const [hasSevereViolation, setHasSevereViolation] = useState<boolean>(false);
  const [severeViolationReason, setSevereViolationReason] = useState<string>('');

  // Search filtered criteria
  const filteredCriteria = useMemo(() => {
    let list: EmulationCriterion[] = EMULATION_CRITERIA_LIST;
    if (criteriaType === 'leader') {
      list = LEADER_EMULATION_CRITERIA;
    } else if (criteriaType === 'staff') {
      list = STAFF_EMULATION_CRITERIA;
    }
    return list.filter(item => {
      const matchSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = categoryFilter === 'all' || 
                       (categoryFilter === 'common' && item.category === 'common') ||
                       (categoryFilter === 'duty' && item.category === 'duty');
      return matchSearch && matchCat;
    });
  }, [criteriaType, searchTerm, categoryFilter]);

  // Filtered penalties
  const filteredPenalties = useMemo(() => {
    return PENALTY_RULES.filter(p => {
      const matchSearch = p.violation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.categoryLabel.toLowerCase().includes(searchTerm.toLowerCase());
      return matchSearch;
    });
  }, [searchTerm]);

  // Filtered bonuses
  const filteredBonuses = useMemo(() => {
    return BONUS_RULES.filter(b => {
      const matchSearch = b.achievement.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.categoryLabel.toLowerCase().includes(searchTerm.toLowerCase());
      return matchSearch;
    });
  }, [searchTerm]);

  // Calculate total penalty deduction
  const totalPenaltyDeduction = useMemo(() => {
    let total = 0;
    Object.entries(selectedPenalties).forEach(([id, count]) => {
      const item = PENALTY_RULES.find(p => p.id === id);
      if (item && count > 0) {
        total += Math.abs(item.penaltyScore) * count;
      }
    });
    return total;
  }, [selectedPenalties]);

  // Calculate total bonus addition (capped at 20 as per rule)
  const rawBonusScore = useMemo(() => {
    let total = 0;
    Object.entries(selectedBonuses).forEach(([id, count]) => {
      const item = BONUS_RULES.find(b => b.id === id);
      if (item && count > 0) {
        total += item.bonusScore * count;
      }
    });
    return total;
  }, [selectedBonuses]);

  const cappedBonusScore = Math.min(rawBonusScore, 20);

  // Final calculated score
  const finalCalculatedScore = useMemo(() => {
    const base = calcCommonScore + calcDutyScore;
    const finalScore = Math.max(0, base - totalPenaltyDeduction) + cappedBonusScore;
    return Math.round(finalScore * 10) / 10;
  }, [calcCommonScore, calcDutyScore, totalPenaltyDeduction, cappedBonusScore]);

  // Evaluation classification
  const calculatedRating = useMemo(() => {
    if (hasSevereViolation) {
      return {
        level: 'KHTNV',
        title: 'KHÔNG HOÀN THÀNH NHIỆM VỤ',
        badgeColor: 'bg-red-600 text-white border-red-700',
        note: 'BỊ KHỐNG CHẾ XẾP LOẠI THẤP NHẤT DO VI PHẠM NGHIÊM TRỌNG VỀ ĐẠO ĐỨC NHÀ GIÁO HOẶC TƯ TƯỞNG CHÍNH TRỊ (Theo Nghị định 233 & chỉ đạo nhà trường).'
      };
    }
    if (finalCalculatedScore >= 90) {
      return {
        level: 'HTXSNV',
        title: 'HOÀN THÀNH XUẤT SẮC NHIỆM VỤ',
        badgeColor: 'bg-emerald-600 text-white border-emerald-700',
        note: 'Đạt từ 90 điểm trở lên. Đủ điều kiện bình xét danh hiệu Xuất sắc (khống chế tối đa 20% số viên chức Hoàn thành tốt theo NĐ 233).'
      };
    }
    if (finalCalculatedScore >= 70) {
      return {
        level: 'HTTNV',
        title: 'HOÀN THÀNH TỐT NHIỆM VỤ',
        badgeColor: 'bg-blue-600 text-white border-blue-700',
        note: 'Đạt từ 70 đến dưới 90 điểm. Đạt chuẩn mức Hoàn thành tốt nhiệm vụ.'
      };
    }
    if (finalCalculatedScore >= 50) {
      return {
        level: 'HTNV',
        title: 'HOÀN THÀNH NHIỆM VỤ',
        badgeColor: 'bg-amber-600 text-white border-amber-700',
        note: 'Đạt từ 50 đến dưới 70 điểm. Cần khắc phục một số hạn chế trong năm học tiếp theo.'
      };
    }
    return {
      level: 'KHTNV',
      title: 'KHÔNG HOÀN THÀNH NHIỆM VỤ',
      badgeColor: 'bg-red-600 text-white border-red-700',
      note: 'Dưới 50 điểm. Xếp loại không hoàn thành nhiệm vụ.'
    };
  }, [finalCalculatedScore, hasSevereViolation]);

  // Handler: create official school document object
  const createOfficialDocumentObject = (): SchoolDocument => {
    return OFFICIAL_EMULATION_DOCUMENT;
  };

  const handleDownloadDocxDirectly = async () => {
    setIsExportingDocx(true);
    try {
      const doc = createOfficialDocumentObject();
      await exportDocumentToDocx(doc);
    } catch (err) {
      console.error('Lỗi khi tải file Word:', err);
    } finally {
      setIsExportingDocx(false);
    }
  };

  const handleOpenDocInEditor = () => {
    const doc = createOfficialDocumentObject();
    if (onOpenInEditor) {
      onOpenInEditor(doc);
    }
  };

  const handleSaveDocToArchive = () => {
    const doc = createOfficialDocumentObject();
    if (onSaveToArchive) {
      onSaveToArchive(doc);
    }
    // Also save via API
    fetch('/api/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(doc),
    }).catch(e => console.error(e));
  };

  const renderOfficialSectionContent = (content: string) => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let tableLines: string[] = [];

    const flushTable = (key: number) => {
      if (tableLines.length === 0) return null;
      const cleanLines = tableLines.filter(tl => !tl.includes('---'));
      const rows = cleanLines.map(tl => tl.split('|').map(c => c.trim()).slice(1, -1));
      tableLines = [];
      if (rows.length === 0) return null;
      const header = rows[0];
      const dataRows = rows.slice(1);
      return (
        <div key={`table-${key}`} className="overflow-x-auto my-3 rounded-lg border border-slate-300 shadow-xs">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-100 text-slate-900 font-bold border-b border-slate-300">
              <tr>
                {header.map((col, cIdx) => (
                  <th key={cIdx} className="p-2.5 border border-slate-300 text-center font-bold bg-slate-100">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataRows.map((r, rIdx) => (
                <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}>
                  {r.map((cell, cIdx) => {
                    const isCenter = cIdx === 0 || cell.length <= 6 || (/^\d/.test(cell) && cell.length < 15);
                    return (
                      <td key={cIdx} className={`p-2.5 border border-slate-300 align-top whitespace-pre-line text-slate-800 ${isCenter ? 'text-center font-medium' : 'text-left'}`}>
                        {cell}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    };

    let blockIdx = 0;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();
      if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
        tableLines.push(trimmed);
      } else {
        if (tableLines.length > 0) {
          const t = flushTable(blockIdx++);
          if (t) elements.push(t);
        }
        if (trimmed.length > 0) {
          const isBoldHeading = trimmed.startsWith('**') && trimmed.endsWith('**');
          const isNumbered = /^\d+\.\s/.test(trimmed) || trimmed.startsWith('Điều ');
          elements.push(
            <p key={`p-${blockIdx++}`} className={`leading-relaxed text-slate-800 my-1.5 ${isBoldHeading || isNumbered ? 'font-semibold text-slate-900' : ''}`}>
              {trimmed}
            </p>
          );
        }
      }
    }
    if (tableLines.length > 0) {
      const t = flushTable(blockIdx++);
      if (t) elements.push(t);
    }
    return elements;
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white p-6 sm:p-8 rounded-2xl shadow-xl relative overflow-hidden border border-indigo-800/40">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-amber-500/10 via-blue-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-400/20 text-amber-300 border border-amber-400/30">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>CHUẨN NGHỊ ĐỊNH 233/2026/NĐ-CP & SÁP NHẬP 3 TRƯỜNG</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              Quy Chế & Biểu Điểm Thi Đua Viên Chức Mới
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Trường THCS và THPT Đốc Binh Kiều (53 lớp, 120 CB-GV-NV, 3 điểm trường). Hợp nhất khoa học từ 3 bản quy định cũ của{' '}
              <strong className="text-amber-300">THPT Đốc Binh Kiều</strong>,{' '}
              <strong className="text-emerald-300">THCS Đốc Binh Kiều</strong> và{' '}
              <strong className="text-sky-300">THCS Tân Kiều</strong> theo thang điểm 100 chuẩn Nghị định 233.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-300">
              <span className="bg-indigo-900/60 px-2.5 py-1 rounded-md border border-indigo-700/50 flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-indigo-300" /> Thang điểm 100: 30đ chung + 70đ chuyên môn
              </span>
              <span className="bg-rose-900/50 px-2.5 py-1 rounded-md border border-rose-700/50 text-rose-200 flex items-center gap-1.5">
                <AlertOctagon className="w-3.5 h-3.5 text-rose-300" /> Vi phạm nghiêm trọng: Xếp loại thấp nhất
              </span>
              <span className="bg-emerald-900/50 px-2.5 py-1 rounded-md border border-emerald-700/50 text-emerald-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-300" /> Thưởng tối đa +20 điểm
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
            <button
              onClick={handleDownloadDocxDirectly}
              disabled={isExportingDocx}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02] cursor-pointer disabled:opacity-70"
            >
              {isExportingDocx ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>{isExportingDocx ? 'Đang tạo file Word...' : 'Tải File Word (.docx) Đầy Đủ'}</span>
            </button>
            <button
              onClick={handleOpenDocInEditor}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow transition-all hover:scale-[1.01]"
            >
              <FileText className="w-4 h-4" />
              Mở Xem Trên Khung A4
            </button>
            <button
              onClick={handleSaveDocToArchive}
              className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs border border-white/20 transition-all"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Lưu Vào Kho Văn Bản
            </button>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-1.5 flex flex-wrap gap-1.5">
        <button
          onClick={() => setActiveSubTab('criteria')}
          className={`flex-1 min-w-[150px] py-2.5 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeSubTab === 'criteria'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Table className="w-4 h-4" />
          1. Biểu Điểm Chi Tiết (100đ)
        </button>

        <button
          onClick={() => setActiveSubTab('calculator')}
          className={`flex-1 min-w-[150px] py-2.5 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeSubTab === 'calculator'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Calculator className="w-4 h-4" />
          2. Máy Tính Chấm Điểm Thử Nghiệm
        </button>

        <button
          onClick={() => setActiveSubTab('regulation')}
          className={`flex-1 min-w-[150px] py-2.5 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeSubTab === 'regulation'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          3. Toàn Văn Quyết Định & Quy Chế
        </button>

        <button
          onClick={() => setActiveSubTab('matrix')}
          className={`flex-1 min-w-[150px] py-2.5 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeSubTab === 'matrix'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Scale className="w-4 h-4" />
          4. Ma Trận Đối Chiếu (3 Trường & NĐ 233)
        </button>

        <button
          onClick={() => setActiveSubTab('evidence')}
          className={`flex-1 min-w-[150px] py-2.5 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeSubTab === 'evidence'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileQuestion className="w-4 h-4" />
          5. Hướng Dẫn Minh Chứng (Tránh Cảm Tính)
        </button>

        <button
          onClick={() => setActiveSubTab('qna')}
          className={`flex-1 min-w-[150px] py-2.5 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeSubTab === 'qna'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          6. Giải Đáp 7 Vấn Đề (BGH Lưu Ý)
        </button>
      </div>

      {/* --- SUBTAB 1: BIỂU ĐIỂM CHI TIẾT --- */}
      {activeSubTab === 'criteria' && (
        <div className="space-y-6">
          {/* Controls bar */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Đối tượng:</span>
              <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1 flex-wrap gap-1">
                <button
                  onClick={() => setCriteriaType('teacher')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    criteriaType === 'teacher'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  Giáo viên giảng dạy (102 người)
                </button>
                <button
                  onClick={() => setCriteriaType('leader')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    criteriaType === 'leader'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  Tổ trưởng / Tổ phó / Lãnh đạo (CBQL)
                </button>
                <button
                  onClick={() => setCriteriaType('staff')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    criteriaType === 'staff'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  Nhân viên Văn phòng (14 người)
                </button>
              </div>

              <div className="h-5 w-px bg-slate-200 mx-1 hidden sm:block" />

              <span className="text-xs font-bold text-slate-700">Bộ lọc:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as any)}
                className="text-xs font-medium border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="all">Tất cả các phần</option>
                <option value="common">Khung tiêu chí chung (30đ)</option>
                <option value="duty">Chuyên môn & nhiệm vụ (70đ)</option>
              </select>
            </div>

            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm tiêu chí, từ khóa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* CRITERIA LIST */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
                {criteriaType === 'teacher' 
                  ? 'BẢNG TIÊU CHÍ ĐÁNH GIÁ GIÁO VIÊN GIẢNG DẠY' 
                  : criteriaType === 'leader'
                  ? 'BẢNG TIÊU CHÍ ĐÁNH GIÁ TỔ TRƯỞNG, TỔ PHÓ & CÁN BỘ QUẢN LÝ'
                  : 'BẢNG TIÊU CHÍ ĐÁNH GIÁ NHÂN VIÊN VĂN PHÒNG'} (THANG ĐIỂM 100 CHUẨN NĐ 233)
              </h2>
              <span className="text-xs font-medium text-slate-500">
                Hiển thị {filteredCriteria.length} tiêu chí
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {filteredCriteria.map((crit) => (
                <div
                  key={crit.id}
                  className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:border-blue-400 transition-all"
                >
                  <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 bg-slate-50/70 border-b border-slate-100">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                          {crit.code}
                        </span>
                        <span className="text-xs font-medium text-slate-500 bg-slate-200/80 px-2 py-0.5 rounded">
                          Nguồn: {crit.sourceOrigin}
                        </span>
                        <span className="text-xs font-semibold text-slate-600">
                          {crit.categoryTitle}
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 pt-1">
                        {crit.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {crit.description}
                      </p>
                    </div>

                    <div className="shrink-0 flex items-center sm:flex-col sm:items-end justify-between sm:justify-start gap-1">
                      <span className="text-xs font-medium text-slate-500">Điểm tối đa</span>
                      <span className="text-lg font-black text-blue-700 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
                        {crit.maxScore} điểm
                      </span>
                    </div>
                  </div>

                  {crit.subCriteria && crit.subCriteria.length > 0 && (
                    <div className="p-4 bg-white space-y-2">
                      <div className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                        Chi tiết các tiêu chí thành phần:
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
                        {crit.subCriteria.map((sub) => (
                          <div
                            key={sub.id}
                            className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/50 flex items-start justify-between gap-2 text-xs"
                          >
                            <span className="text-slate-700 flex-1 leading-snug">
                              <strong className="text-slate-900">{sub.id}.</strong> {sub.text}
                            </span>
                            <span className="font-bold text-blue-700 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs shrink-0">
                              {sub.score}đ
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* PENALTY RULES SECTION */}
          <div className="bg-white rounded-2xl shadow-sm border border-red-200 p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-red-100 pb-3">
              <div>
                <h2 className="text-base font-extrabold text-red-900 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  BẢNG ĐIỂM TRỪ CHI TIẾT & VI PHẠM NGHIÊM TRỌNG (HỢP NHẤT 3 TRƯỜNG)
                </h2>
                <p className="text-xs text-red-700 pt-0.5">
                  Vi phạm nghiêm trọng về đạo đức/chính trị bị khống chế xếp loại Không hoàn thành nhiệm vụ. Các lỗi khác trừ điểm rõ ràng theo từng lần/tiết.
                </p>
              </div>
              <span className="text-xs font-bold text-red-700 bg-red-100 px-3 py-1 rounded-full">
                {PENALTY_RULES.length} danh mục vi phạm
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-red-50/80 text-red-950 border-b border-red-200 font-bold">
                    <th className="p-3 w-16">Mã</th>
                    <th className="p-3">Hành vi vi phạm quy chế</th>
                    <th className="p-3 w-32">Mức trừ điểm</th>
                    <th className="p-3">Quy tắc áp dụng & Ghi chú xử lý</th>
                    <th className="p-3 w-28">Nguồn tiếp thu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPenalties.map((pen) => (
                    <tr
                      key={pen.id}
                      className={
                        pen.isDisqualifying
                          ? 'bg-rose-50/70 hover:bg-rose-100/70 font-medium'
                          : 'hover:bg-slate-50'
                      }
                    >
                      <td className="p-3 font-mono font-bold text-slate-700">
                        {pen.code}
                      </td>
                      <td className="p-3 text-slate-900">
                        {pen.isDisqualifying && (
                          <span className="inline-block px-2 py-0.5 text-2xs font-bold uppercase rounded bg-red-600 text-white mr-1.5">
                            Nghiêm trọng
                          </span>
                        )}
                        {pen.violation}
                      </td>
                      <td className="p-3 font-bold text-rose-700 whitespace-nowrap">
                        {pen.isDisqualifying ? (
                          <span className="text-rose-700 font-extrabold">Khống chế thấp nhất</span>
                        ) : (
                          `${pen.penaltyScore}đ / ${pen.unit}`
                        )}
                      </td>
                      <td className="p-3 text-slate-600">
                        {pen.conditionNote}
                      </td>
                      <td className="p-3 text-slate-500 whitespace-nowrap text-2xs">
                        {pen.sourceSchool}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* BONUS RULES SECTION */}
          <div className="bg-white rounded-2xl shadow-sm border border-emerald-200 p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-100 pb-3">
              <div>
                <h2 className="text-base font-extrabold text-emerald-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                  BẢNG ĐIỂM THƯỞNG KHUYẾN KHÍCH (TỐI ĐA +20 ĐIỂM CỘNG THÊM)
                </h2>
                <p className="text-xs text-emerald-700 pt-0.5">
                  Khích lệ giáo viên bồi dưỡng HSG các cấp, đạt GVDG, kết quả tuyển sinh 10 / tốt nghiệp THPT và các nghĩa cử nhân ái.
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                {BONUS_RULES.length} danh mục khen thưởng
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-emerald-50/80 text-emerald-950 border-b border-emerald-200 font-bold">
                    <th className="p-3 w-20">Mã</th>
                    <th className="p-3">Thành tích / Hoạt động được cộng thưởng</th>
                    <th className="p-3 w-28">Điểm thưởng</th>
                    <th className="p-3">Chi tiết & Cách tính</th>
                    <th className="p-3 w-28">Nguồn tiếp thu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBonuses.map((bon) => (
                    <tr key={bon.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-slate-700">
                        {bon.code}
                      </td>
                      <td className="p-3 font-medium text-slate-900">
                        {bon.achievement}
                      </td>
                      <td className="p-3 font-bold text-emerald-700 whitespace-nowrap">
                        +{bon.bonusScore}đ / {bon.unit}
                      </td>
                      <td className="p-3 text-slate-600">
                        {bon.detail}
                      </td>
                      <td className="p-3 text-slate-500 whitespace-nowrap text-2xs">
                        {bon.sourceSchool}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- SUBTAB 2: MÁY TÍNH CHẤM ĐIỂM THỬ NGHIỆM --- */}
      {activeSubTab === 'calculator' && (
        <div className="space-y-6">
          {/* Header of Calculator */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-indigo-600" />
                Công Cụ Tự Chấm Điểm & Dự Báo Xếp Loại (Nghị định 233)
              </h2>
              <p className="text-xs text-slate-600 pt-1">
                Nhập thông tin, điều chỉnh điểm tiêu chí, tích chọn số lỗi vi phạm hoặc thành tích đạt được để kiểm tra kết quả ngay lập tức.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setCalcCommonScore(30);
                  setCalcDutyScore(70);
                  setSelectedPenalties({});
                  setSelectedBonuses({});
                  setHasSevereViolation(false);
                  setSevereViolationReason('');
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Đặt lại mặc định
              </button>
            </div>
          </div>

          {/* Profile input */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-white p-4 rounded-xl border border-slate-200">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Họ và tên viên chức:
              </label>
              <input
                type="text"
                placeholder="VD: Nguyễn Văn A"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tổ chuyên môn:
              </label>
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Tổ Toán">Tổ Toán (15 GV)</option>
                <option value="Tổ Ngữ văn">Tổ Ngữ văn (12 GV)</option>
                <option value="Tổ KHTN-CN">Tổ KHTN - Công nghệ (26 GV)</option>
                <option value="Tổ Lịch sử-Địa lý-GDCD">Tổ Lịch sử - Địa lý - GDCD (16 GV)</option>
                <option value="Tổ Tiếng Anh-Tin học">Tổ Tiếng Anh - Tin học (16 GV)</option>
                <option value="Tổ GDTC-QPAN-Nghệ thuật">Tổ GDTC - QPAN - Nghệ thuật (12 GV)</option>
                <option value="Tổ Văn phòng">Tổ Văn phòng (14 NV)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Vị trí công tác / Vai trò:
              </label>
              <select
                value={calcRole}
                onChange={(e) => setCalcRole(e.target.value as any)}
                className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500"
              >
                <option value="teacher">Giáo viên bộ môn</option>
                <option value="homeroom">Giáo viên chủ nhiệm lớp</option>
                <option value="leader">Tổ trưởng / Bí thư Đoàn / TPT Đội</option>
                <option value="staff">Nhân viên Văn phòng - Chuyên trách</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Điểm trường giảng dạy:
              </label>
              <select
                value={calcCampus}
                onChange={(e) => setCalcCampus(e.target.value as any)}
                className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500"
              >
                <option value="chinh_thpt">Điểm chính (Cấp THPT - 14 lớp)</option>
                <option value="dbk_thcs">Điểm Đốc Binh Kiều (Cấp THCS - 24 lớp)</option>
                <option value="tankieu_thcs">Điểm Tân Kiều (Cấp THCS - 15 lớp, cách 11km)</option>
              </select>
            </div>
          </div>

          {/* REALTIME SCORE DASHBOARD CARD */}
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl shadow-lg border border-indigo-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-800/60 pb-4">
              <div>
                <span className="text-2xs font-bold uppercase tracking-wider text-indigo-300">
                  DỰ BÁO KẾT QUẢ ĐÁNH GIÁ NĂM HỌC 2026 - 2027
                </span>
                <h3 className="text-xl font-black text-white pt-1">
                  {teacherName || 'Viên chức chưa đặt tên'} - {selectedGroup}
                </h3>
                <p className="text-xs text-slate-300">
                  {calcRole === 'homeroom' ? 'Giáo viên Chủ nhiệm' : calcRole === 'staff' ? 'Nhân viên Văn phòng' : 'Giáo viên bộ môn'} •{' '}
                  {calcCampus === 'tankieu_thcs' ? 'Điểm Tân Kiều (cách 11km)' : calcCampus === 'dbk_thcs' ? 'Điểm Đốc Binh Kiều (THCS)' : 'Điểm chính (THPT)'}
                </p>
              </div>

              {/* Final score pill */}
              <div className="text-right flex items-center sm:flex-col sm:items-end justify-between sm:justify-start gap-2">
                <span className="text-xs text-slate-300">Tổng điểm thi đua</span>
                <div className="text-3xl font-black text-amber-400">
                  {hasSevereViolation ? '0.0' : finalCalculatedScore}{' '}
                  <span className="text-xs text-slate-300 font-normal">/ 100đ</span>
                </div>
              </div>
            </div>

            {/* Classification Banner */}
            <div className={`p-4 rounded-xl border flex items-start gap-3 ${calculatedRating.badgeColor}`}>
              <ShieldCheck className="w-6 h-6 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold tracking-wider uppercase opacity-90">
                  XẾP LOẠI CHẤT LƯỢNG (THEO NGHỊ ĐỊNH 233):
                </div>
                <div className="text-lg font-black tracking-tight pt-0.5">
                  {calculatedRating.title}
                </div>
                <div className="text-xs opacity-95 pt-1">
                  {calculatedRating.note}
                </div>
              </div>
            </div>

            {/* Score Breakdown Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
              <div className="bg-white/10 p-2.5 rounded-lg border border-white/10">
                <div className="text-slate-300 text-2xs">1. Tiêu chí chung (max 30)</div>
                <div className="text-base font-bold text-white pt-0.5">{calcCommonScore} điểm</div>
              </div>
              <div className="bg-white/10 p-2.5 rounded-lg border border-white/10">
                <div className="text-slate-300 text-2xs">2. Chuyên môn (max 70)</div>
                <div className="text-base font-bold text-white pt-0.5">{calcDutyScore} điểm</div>
              </div>
              <div className="bg-white/10 p-2.5 rounded-lg border border-white/10">
                <div className="text-slate-300 text-2xs">3. Điểm thưởng (max +20)</div>
                <div className="text-base font-bold text-emerald-400 pt-0.5">+{cappedBonusScore} điểm</div>
              </div>
              <div className="bg-white/10 p-2.5 rounded-lg border border-white/10">
                <div className="text-slate-300 text-2xs">4. Tổng điểm trừ</div>
                <div className="text-base font-bold text-rose-400 pt-0.5">-{totalPenaltyDeduction} điểm</div>
              </div>
            </div>
          </div>

          {/* SEVERE VIOLATION OVERRIDE SWITCH */}
          <div className="bg-rose-50 border border-rose-300 p-4 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-rose-600" />
                <span className="text-xs font-bold text-rose-900">
                  Kiểm tra điều kiện khống chế loại THẤP NHẤT (Điều 6 Quy chế & NĐ 233):
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasSevereViolation}
                  onChange={(e) => setHasSevereViolation(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
                <span className="ml-2 text-xs font-bold text-rose-700">
                  {hasSevereViolation ? 'CÓ VI PHẠM NGHIÊM TRỌNG' : 'Không có vi phạm'}
                </span>
              </label>
            </div>
            {hasSevereViolation && (
              <div className="pt-2">
                <input
                  type="text"
                  placeholder="Ghi rõ lý do vi phạm (VD: Vi phạm nghiêm trọng đạo đức nhà giáo / Kỷ luật khiển trách / Dạy thêm trái quy định)..."
                  value={severeViolationReason}
                  onChange={(e) => setSevereViolationReason(e.target.value)}
                  className="w-full text-xs p-2 rounded border border-rose-300 bg-white focus:ring-2 focus:ring-rose-500"
                />
                <p className="text-2xs text-rose-600 font-medium pt-1">
                  * Theo quy định cứng, trường hợp này bị khóa kết quả ở mức: KHÔNG HOÀN THÀNH NHIỆM VỤ, không xét thi đua.
                </p>
              </div>
            )}
          </div>

          {/* TWO EDIT PANELS: PENALTIES & BONUSES */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Penalty Checklist */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Minus className="w-4 h-4 text-rose-600" />
                  Ghi Nhận Lỗi Vi Phạm (Bị Trừ Điểm)
                </h4>
                <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                  Tổng trừ: -{totalPenaltyDeduction}đ
                </span>
              </div>

              <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                {PENALTY_RULES.filter(p => !p.isDisqualifying).map((pen) => {
                  const count = selectedPenalties[pen.id] || 0;
                  return (
                    <div
                      key={pen.id}
                      className={`p-2.5 rounded-lg border text-xs flex items-center justify-between gap-3 transition-all ${
                        count > 0 ? 'bg-rose-50/70 border-rose-300' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex-1 pr-2">
                        <div className="font-semibold text-slate-900">{pen.violation}</div>
                        <div className="text-2xs text-slate-500 pt-0.5">
                          Trừ {Math.abs(pen.penaltyScore)}đ / {pen.unit} • {pen.categoryLabel}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => {
                            if (count > 0) {
                              setSelectedPenalties({ ...selectedPenalties, [pen.id]: count - 1 });
                            }
                          }}
                          disabled={count === 0}
                          className="w-6 h-6 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold flex items-center justify-center disabled:opacity-40"
                        >
                          -
                        </button>
                        <span className="w-6 text-center font-bold text-slate-800">{count}</span>
                        <button
                          onClick={() => {
                            setSelectedPenalties({ ...selectedPenalties, [pen.id]: count + 1 });
                          }}
                          className="w-6 h-6 rounded bg-rose-600 hover:bg-rose-700 text-white font-bold flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bonus Checklist */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-emerald-600" />
                  Ghi Nhận Thành Tích (Cộng Điểm Thưởng)
                </h4>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Tổng thưởng: +{cappedBonusScore}đ (max +20)
                </span>
              </div>

              <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                {BONUS_RULES.map((bon) => {
                  const count = selectedBonuses[bon.id] || 0;
                  return (
                    <div
                      key={bon.id}
                      className={`p-2.5 rounded-lg border text-xs flex items-center justify-between gap-3 transition-all ${
                        count > 0 ? 'bg-emerald-50/70 border-emerald-300' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex-1 pr-2">
                        <div className="font-semibold text-slate-900">{bon.achievement}</div>
                        <div className="text-2xs text-slate-500 pt-0.5">
                          Cộng +{bon.bonusScore}đ / {bon.unit} • {bon.detail}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => {
                            if (count > 0) {
                              setSelectedBonuses({ ...selectedBonuses, [bon.id]: count - 1 });
                            }
                          }}
                          disabled={count === 0}
                          className="w-6 h-6 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold flex items-center justify-center disabled:opacity-40"
                        >
                          -
                        </button>
                        <span className="w-6 text-center font-bold text-slate-800">{count}</span>
                        <button
                          onClick={() => {
                            setSelectedBonuses({ ...selectedBonuses, [bon.id]: count + 1 });
                          }}
                          className="w-6 h-6 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- SUBTAB 3: TOÀN VĂN QUYẾT ĐỊNH & QUY CHẾ HÀNH CHÍNH (A4) --- */}
      {activeSubTab === 'regulation' && (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Toàn Văn Văn Bản Hành Chính (Chuẩn Nghị Định 30/2020/NĐ-CP & Thang Điểm 100)
              </h3>
              <p className="text-xs text-slate-500">
                Ban hành kèm Quyết định số 15/QĐ-THCS&THPTĐBK (Toàn văn 9 Chương, 18 Điều, 3 Phụ Lục chi tiết đồng bộ 100% với file Word .docx).
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleDownloadDocxDirectly}
                disabled={isExportingDocx}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all disabled:opacity-70 cursor-pointer"
              >
                {isExportingDocx ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Download className="w-3.5 h-3.5" />
                )}
                <span>{isExportingDocx ? 'Đang xuất Word...' : 'Tải File Word (.docx) Đầy Đủ'}</span>
              </button>
              <button
                onClick={handleOpenDocInEditor}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                Mở Trong Trình Soạn Thảo (A4)
              </button>
            </div>
          </div>

          {/* Official A4 Document Paper View */}
          <div className="bg-white max-w-4xl mx-auto shadow-md border border-slate-300 p-8 sm:p-12 text-slate-900 font-serif leading-relaxed space-y-6 rounded-lg">
            {/* Header: Quốc hiệu & Cơ quan ban hành */}
            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-200 text-center text-xs">
              <div>
                <div className="font-semibold text-slate-700">{OFFICIAL_EMULATION_DOCUMENT.issuingAuthorityTop}</div>
                <div className="font-bold text-slate-900 uppercase">TRƯỜNG THCS VÀ THPT ĐỐC BINH KIỀU</div>
                <div className="font-mono text-slate-600 mt-1">{OFFICIAL_EMULATION_DOCUMENT.documentNumber}</div>
              </div>
              <div>
                <div className="font-bold text-slate-900">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                <div className="font-bold text-slate-900">Độc lập - Tự do - Hạnh phúc</div>
                <div className="italic text-slate-600 mt-1">{OFFICIAL_EMULATION_DOCUMENT.signDate}</div>
              </div>
            </div>

            {/* Title */}
            <div className="text-center space-y-2 py-2">
              <h2 className="text-base sm:text-lg font-black uppercase text-slate-950 tracking-wide">
                {OFFICIAL_EMULATION_DOCUMENT.title}
              </h2>
              <p className="text-xs sm:text-sm font-bold text-slate-800">
                {OFFICIAL_EMULATION_DOCUMENT.subTitle}
              </p>
              <div className="font-bold text-xs uppercase pt-2 text-slate-700">
                HIỆU TRƯỞNG TRƯỜNG THCS VÀ THPT ĐỐC BINH KIỀU
              </div>
            </div>

            {/* Legal bases */}
            <div className="text-xs space-y-1.5 italic text-slate-700 text-justify">
              {OFFICIAL_EMULATION_DOCUMENT.legalBases?.map((base, idx) => (
                <p key={idx}>{base}</p>
              ))}
            </div>

            {/* All Sections & Appendices */}
            <div className="space-y-8 pt-4 border-t-2 border-slate-300">
              {OFFICIAL_EMULATION_DOCUMENT.sections.map((sec, sIdx) => (
                <div key={sIdx} className="space-y-3 pt-6 border-t border-slate-200 first:border-t-0 first:pt-0">
                  <h3 className="font-black uppercase text-slate-950 text-sm tracking-wide bg-slate-100 p-2.5 rounded-lg border border-slate-300 text-center">
                    {sec.heading}
                  </h3>
                  <div className="text-xs space-y-2 text-justify">
                    {renderOfficialSectionContent(sec.content)}
                  </div>
                </div>
              ))}
            </div>

            {/* Signatures & Recipients Footer */}
            <div className="grid grid-cols-2 gap-4 pt-8 border-t-2 border-slate-300 text-xs">
              <div className="space-y-1 text-2xs text-slate-600">
                <div className="font-bold uppercase text-slate-800">Nơi nhận:</div>
                {OFFICIAL_EMULATION_DOCUMENT.recipients?.map((rec, rIdx) => (
                  <div key={rIdx}>- {rec}</div>
                ))}
              </div>
              <div className="text-center space-y-12">
                <div>
                  <div className="font-bold text-slate-900 uppercase">HIỆU TRƯỞNG</div>
                  <div className="text-2xs text-slate-500">(Ký số, đóng dấu)</div>
                </div>
                <div className="font-bold text-slate-950 uppercase text-sm">
                  {OFFICIAL_EMULATION_DOCUMENT.signerName}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- SUBTAB 4: MA TRẬN ĐỐI CHIẾU --- */}
      {activeSubTab === 'matrix' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Scale className="w-5 h-5 text-purple-600" />
              Bảng Ma Trận Kế Thừa & Dung Hòa (3 Trường Cũ & Nghị Định 233)
            </h2>
            <p className="text-xs text-slate-600 pt-1">
              Báo cáo khoa học giải trình căn cứ xây dựng biểu điểm mới để thông qua Hội đồng sư phạm và Hội nghị Cán bộ Viên chức trường THCS và THPT Đốc Binh Kiều.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {COMPARISON_MATRIX.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:border-purple-300 transition-all"
              >
                <div className="p-4 bg-slate-50 border-b border-slate-100 font-bold text-sm text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-800 text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  {item.aspect}
                </div>

                <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-blue-50/60 border border-blue-100 space-y-1">
                    <span className="font-bold text-blue-900 uppercase text-2xs block">
                      1. Chuẩn Nghị Định 233:
                    </span>
                    <p className="text-slate-700 leading-relaxed">{item.nd233}</p>
                  </div>

                  <div className="p-3 rounded-lg bg-amber-50/60 border border-amber-100 space-y-1">
                    <span className="font-bold text-amber-900 uppercase text-2xs block">
                      2. THPT Đốc Binh Kiều (Cũ):
                    </span>
                    <p className="text-slate-700 leading-relaxed">{item.thptDbk}</p>
                  </div>

                  <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-100 space-y-1">
                    <span className="font-bold text-emerald-900 uppercase text-2xs block">
                      3. THCS Đốc Binh Kiều (Cũ):
                    </span>
                    <p className="text-slate-700 leading-relaxed">{item.thcsDbk}</p>
                  </div>

                  <div className="p-3 rounded-lg bg-sky-50/60 border border-sky-100 space-y-1">
                    <span className="font-bold text-sky-900 uppercase text-2xs block">
                      4. THCS Tân Kiều (Cũ):
                    </span>
                    <p className="text-slate-700 leading-relaxed">{item.thcsTanKieu}</p>
                  </div>
                </div>

                <div className="p-3.5 bg-purple-50/70 border-t border-purple-100 text-xs flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-purple-950">
                      Phương án lựa chọn chuẩn hóa cho Trường THCS và THPT Đốc Binh Kiều:
                    </span>
                    <p className="text-purple-900 pt-0.5 leading-relaxed font-medium">
                      {item.adoptedSolution}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- SUBTAB 5: HƯỚNG DẪN MINH CHỨNG ĐÁNH GIÁ (TRÁNH CẢM TÍNH) --- */}
      {activeSubTab === 'evidence' && (
        <div className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-amber-600 text-white rounded-lg shrink-0 mt-0.5">
                <FileQuestion className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm md:text-base font-bold text-amber-950">
                  HƯỚNG DẪN XÁC ĐỊNH MINH CHỨNG ĐÁNH GIÁ THI ĐUA (CÂU HỎI SỐ 7)
                </h3>
                <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                  Giải quyết triệt để vấn đề: <em>"Lấy gì làm căn cứ để chấm cho thầy cô được 5.0 điểm Đổi mới PPDH, hồ sơ, sĩ số cuối năm mà không bị cảm tính?"</em> - Mọi điểm số đều gắn liền với sản phẩm và nguồn minh chứng lưu trữ cụ thể.
                </p>
              </div>
            </div>
            <span className="shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg bg-amber-200/80 text-amber-900 border border-amber-300">
              Minh bạch 100%
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {EVIDENCE_GUIDELINES.map((eg, idx) => (
              <div
                key={eg.id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-3 hover:border-amber-400 transition-all"
              >
                <div className="flex items-start justify-between gap-2 pb-2 border-b border-slate-100">
                  <div className="space-y-0.5">
                    <span className="text-2xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Tiêu chí #{idx + 1}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 pt-1 leading-snug">
                      {eg.criterionName}
                    </h4>
                  </div>
                  <span className="text-xs font-black text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 shrink-0">
                    {eg.maxScore} điểm
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-bold text-slate-700">Loại hình minh chứng:</span>
                    <p className="text-slate-900 font-medium mt-0.5 bg-slate-50 p-2 rounded border border-slate-100">
                      {eg.evidenceType}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-2xs">
                    <div className="bg-blue-50/70 p-2 rounded border border-blue-100">
                      <span className="font-bold text-blue-900 block">Nơi lưu trữ minh chứng:</span>
                      <span className="text-slate-700">{eg.storageLocation}</span>
                    </div>
                    <div className="bg-emerald-50/70 p-2 rounded border border-emerald-100">
                      <span className="font-bold text-emerald-900 block">Phương thức thẩm định:</span>
                      <span className="text-slate-700">{eg.verificationMethod}</span>
                    </div>
                  </div>

                  <div className="pt-1 space-y-1.5">
                    <span className="font-bold text-slate-800 block text-2xs uppercase tracking-wide">
                      Hướng dẫn chi tiết cách chấm & kiểm tra chéo:
                    </span>
                    <ul className="space-y-1">
                      {eg.detailedGuide.map((step, sIdx) => (
                        <li key={sIdx} className="flex items-start gap-1.5 text-xs text-slate-600 leading-relaxed">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- SUBTAB 6: GIẢI ĐÁP TOÀN BỘ 7 CÂU HỎI QUAN TRỌNG CỦA BGH --- */}
      {activeSubTab === 'qna' && (
        <div className="space-y-5">
          <div className="bg-teal-50 border border-teal-200 rounded-xl p-5 flex items-start gap-3">
            <div className="p-2.5 bg-teal-600 text-white rounded-lg shrink-0 mt-0.5">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-teal-950">
                BẢN GIẢI TRÌNH & HƯỚNG DẪN 7 NỘI DUNG TRỌNG TÂM CỦA BAN GIÁM HIỆU
              </h3>
              <p className="text-xs text-teal-800 mt-1 leading-relaxed">
                Căn cứ Nghị định 233/NĐ-CP, Nghị định 368/2026/NĐ-CP, Luật Viên chức 129/2025/QH15 và thực tiễn sáp nhập 3 trường (THPT Đốc Binh Kiều, THCS Đốc Binh Kiều, THCS Tân Kiều).
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Câu 1 */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-teal-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                  1
                </span>
                <h4 className="text-sm font-bold text-slate-900">
                  Phân nhóm đánh giá 70 điểm chuyên môn (Lãnh đạo/Tổ trưởng/Tổ phó - Giáo viên - Nhân viên)
                </h4>
              </div>
              <div className="text-xs text-slate-700 space-y-2 bg-slate-50 p-3.5 rounded-lg border border-slate-100 leading-relaxed">
                <p>
                  <strong>Thầy/cô nhớ hoàn toàn chính xác!</strong> Theo Nghị định 233, Nghị định 368/2026/NĐ-CP và Luật Viên chức 129/2025/QH15, đánh giá viên chức bắt buộc phải gắn liền với bản mô tả vị trí việc làm. Khung 100 điểm được phân chia thống nhất: <strong>30 điểm Tiêu chí chung</strong> và <strong>70 điểm Tiêu chí chuyên môn</strong>.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1">
                  <div className="bg-indigo-50/80 p-3 rounded-lg border border-indigo-200">
                    <span className="font-bold text-indigo-900 block mb-1">1. Lãnh đạo, Tổ trưởng, Tổ phó (70đ)</span>
                    <ul className="list-disc pl-4 space-y-1 text-slate-700">
                      <li>Chuyên môn/giảng dạy cá nhân: 35đ</li>
                      <li>Năng lực quản lý điều hành tổ: 25đ</li>
                      <li>Xếp loại tập thể tổ/đoàn thể: 10đ</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50/80 p-3 rounded-lg border border-blue-200">
                    <span className="font-bold text-blue-900 block mb-1">2. Giáo viên trực tiếp dạy (70đ)</span>
                    <ul className="list-disc pl-4 space-y-1 text-slate-700">
                      <li>QCCM, tiến độ PPCT, HSSS: 30đ</li>
                      <li>Chất lượng bộ môn & chuẩn điểm: 25đ</li>
                      <li>Đổi mới PPDH, SHCM theo NCBH: 15đ</li>
                    </ul>
                  </div>
                  <div className="bg-emerald-50/80 p-3 rounded-lg border border-emerald-200">
                    <span className="font-bold text-emerald-900 block mb-1">3. Nhân viên Văn phòng (70đ)</span>
                    <ul className="list-disc pl-4 space-y-1 text-slate-700">
                      <li>Kế hoạch công tác vị trí việc làm: 20đ</li>
                      <li>Hồ sơ nghiệp vụ chuyên môn ngành dọc: 20đ</li>
                      <li>Tiến độ, độ chính xác phục vụ: 20đ</li>
                      <li>Bồi dưỡng & sáng kiến cải tiến: 10đ</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Câu 2 */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-teal-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                  2
                </span>
                <h4 className="text-sm font-bold text-slate-900">
                  Xếp hạng thi đua GVCN: Nên đưa vào xếp loại viên chức hay để riêng? Phương án tối ưu
                </h4>
              </div>
              <div className="text-xs text-slate-700 space-y-2 bg-slate-50 p-3.5 rounded-lg border border-slate-100 leading-relaxed">
                <p>
                  <strong>Phương án tối ưu:</strong> Tách bạch giữa <em>Trách nhiệm quản lý lớp (thuộc thang điểm 70)</em> và <em>Xếp hạng thi đua phong trào toàn trường (thuộc Điểm thưởng & Danh hiệu thi đua)</em>.
                </p>
                <div className="bg-white p-3 rounded border border-slate-200 space-y-1">
                  <p><strong>- Trong 70 điểm chuyên môn chuẩn:</strong> Dành 15 điểm định lượng cho công tác hoàn thành trách nhiệm chủ nhiệm (duy trì sĩ số, cập nhật vnEdu, liên lạc cha mẹ học sinh, sổ chủ nhiệm). Làm tròn trách nhiệm thì hưởng trọn điểm.</p>
                  <p><strong>- Xếp hạng thi đua GVCN tuần/học kỳ (1 đến 13):</strong> Dùng làm căn cứ tính <strong>Điểm Thưởng (Cộng điểm)</strong> từ +1.0đ đến +3.0đ và là điều kiện tiên quyết để xét danh hiệu <strong>Chiến sĩ thi đua cơ sở</strong> và <strong>Giáo viên chủ nhiệm giỏi</strong>.</p>
                </div>
              </div>
            </div>

            {/* Câu 3 */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-teal-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                  3
                </span>
                <h4 className="text-sm font-bold text-slate-900">
                  Học sinh vi phạm nhiều hoặc lớp không tham gia phong trào thì GVCN bị xử lý ra sao?
                </h4>
              </div>
              <div className="text-xs text-slate-700 space-y-2 bg-slate-50 p-3.5 rounded-lg border border-slate-100 leading-relaxed">
                <ul className="space-y-1.5 list-disc pl-4">
                  <li><strong>Học sinh bị kỷ luật cấp trường:</strong> Học sinh bị khiển trách cấp trường: trừ <strong>2.0đ/HS</strong>; Học sinh bị cảnh cáo hoặc đình chỉ học tập: trừ <strong>5.0đ/HS</strong>.</li>
                  <li><strong>Lớp có từ 02 học sinh trở lên bị xử lý kỷ luật tạm dừng học tập:</strong> GVCN <strong>không được xếp loại Hoàn thành xuất sắc nhiệm vụ</strong>.</li>
                  <li><strong>Lớp không tham gia phong trào bắt buộc do trường/Đoàn/Đội phát động:</strong> Trừ <strong>3.0 điểm/phong trào</strong>.</li>
                  <li><strong>Lớp bỏ lao động theo kế hoạch phân công:</strong> Trừ <strong>5.0 điểm/buổi</strong>.</li>
                  <li><em>Điều kiện miễn trừ/giảm nhẹ:</em> Nếu GVCN có sổ theo dõi, đã lập biên bản làm việc với phụ huynh từ 02 lần trở lên và báo cáo kịp thời với BGH thì được giảm 50% mức trừ điểm.</li>
                </ul>
              </div>
            </div>

            {/* Câu 4 */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-teal-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                  4
                </span>
                <h4 className="text-sm font-bold text-slate-900">
                  Cơ chế công bằng: GV chủ nhiệm nhiều việc, dễ bị trừ điểm vs GV không chủ nhiệm
                </h4>
              </div>
              <div className="text-xs text-slate-700 space-y-2 bg-slate-50 p-3.5 rounded-lg border border-slate-100 leading-relaxed">
                <p>
                  <strong>Giải pháp 3 lớp bảo vệ công bằng tuyệt đối:</strong>
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-1">
                  <div className="p-2.5 bg-amber-50 rounded border border-amber-200">
                    <span className="font-bold text-amber-950 block">1. Tiêu chí chuyên môn thay thế (15đ)</span>
                    <p className="mt-1 text-slate-600">GV không làm chủ nhiệm phải thực hiện: Phụ đạo HS yếu kém (5đ); Ban coi/chấm thi, làm ĐDDH (5đ); Quản sinh, hỗ trợ phong trào trường (5đ). Không tham gia bị trừ 5 - 10đ.</p>
                  </div>
                  <div className="p-2.5 bg-rose-50 rounded border border-rose-200">
                    <span className="font-bold text-rose-950 block">2. Khống chế trần xếp loại (Cap Policy)</span>
                    <p className="mt-1 text-slate-600">GV chỉ dạy thuần túy không kiêm nhiệm chủ nhiệm hoặc đoàn thể thì cuối năm <strong>chỉ xếp tối đa Hoàn thành tốt nhiệm vụ (Loại B)</strong>, không xét Xuất sắc (trừ khi đạt GVDG tỉnh hoặc giải QG).</p>
                  </div>
                  <div className="p-2.5 bg-emerald-50 rounded border border-emerald-200">
                    <span className="font-bold text-emerald-950 block">3. Điểm cộng độc quyền cho GVCN</span>
                    <p className="mt-1 text-slate-600">Duy trì sĩ số 100%: <strong>+5.0đ</strong>; BHYT đạt 100%: <strong>+5.0đ</strong>; Lớp đạt Top 1, 2, 3 trường: <strong>+1.5đ đến +3.0đ</strong>.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Câu 5 */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-teal-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                  5
                </span>
                <h4 className="text-sm font-bold text-slate-900">
                  Kết quả chuyên môn: Tỷ lệ thế nào là cao/thấp? Ngưỡng đánh giá định lượng rõ ràng
                </h4>
              </div>
              <div className="text-xs text-slate-700 space-y-2 bg-slate-50 p-3.5 rounded-lg border border-slate-100 leading-relaxed">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-2.5 bg-white rounded border border-slate-200">
                    <span className="font-bold text-blue-900 block mb-1">Môn Toán, Ngữ văn, Tiếng Anh:</span>
                    <ul className="space-y-1">
                      <li>• Tỷ lệ Đạt &gt;= 95%: Đạt chuẩn (trọn điểm 10/10).</li>
                      <li>• Tỷ lệ Đạt 85% - 94.9%: Trừ 2.0 điểm.</li>
                      <li>• Tỷ lệ Đạt 70% - 84.9%: Trừ 5.0 điểm.</li>
                      <li>• Tỷ lệ Đạt &lt; 70%: <strong>Quá thấp / Yếu</strong>, trừ 10.0 điểm và không xếp loại Xuất sắc.</li>
                    </ul>
                  </div>
                  <div className="p-2.5 bg-white rounded border border-slate-200">
                    <span className="font-bold text-emerald-900 block mb-1">Các môn học còn lại (KHTN, Tin, Sử, Địa...):</span>
                    <ul className="space-y-1">
                      <li>• Tỷ lệ Đạt &gt;= 98%: Đạt chuẩn (trọn điểm).</li>
                      <li>• Tỷ lệ Đạt 90% - 97.9%: Trừ 2.0 điểm.</li>
                      <li>• Tỷ lệ Đạt &lt; 90%: Trừ 5.0 điểm.</li>
                      <li>• Điểm liệt (&lt; 2.0đ) định kỳ &gt; 5%: Trừ 1.0đ/lớp/lần.</li>
                    </ul>
                  </div>
                </div>
                <div className="p-2.5 bg-amber-50 rounded border border-amber-200">
                  <span className="font-bold text-amber-950 block">Ngưỡng thi Tuyển sinh 10 & Tốt nghiệp THPT:</span>
                  <p className="mt-0.5">Điểm môn thi đạt bằng hoặc cao hơn trung bình Tỉnh/Cụm: <strong>Cộng 10.0 điểm</strong>; Thấp hơn mặt bằng tỉnh trên 1.0 điểm: <strong>Trừ 10.0 điểm</strong>.</p>
                </div>
              </div>
            </div>

            {/* Câu 6 */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-teal-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                  6
                </span>
                <h4 className="text-sm font-bold text-slate-900">
                  Bảng điểm cộng chi tiết: Hội thi phong trào thể thao, văn nghệ và Học sinh giỏi các cấp
                </h4>
              </div>
              <div className="text-xs text-slate-700 space-y-2 bg-slate-50 p-3.5 rounded-lg border border-slate-100 leading-relaxed overflow-x-auto">
                <table className="w-full text-left border-collapse border border-slate-300 text-2xs sm:text-xs">
                  <thead>
                    <tr className="bg-slate-200 text-slate-900">
                      <th className="p-2 border border-slate-300 font-bold">Nội dung hội thi</th>
                      <th className="p-2 border border-slate-300 font-bold text-center">Giải Nhất</th>
                      <th className="p-2 border border-slate-300 font-bold text-center">Giải Nhì</th>
                      <th className="p-2 border border-slate-300 font-bold text-center">Giải Ba</th>
                      <th className="p-2 border border-slate-300 font-bold text-center">Giải KK</th>
                      <th className="p-2 border border-slate-300 font-bold text-center">Tham gia</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2 border border-slate-300 font-semibold">HSG Văn hóa, KHKT, STEM Cụm/Huyện</td>
                      <td className="p-2 border border-slate-300 text-center font-bold text-blue-700">+15đ</td>
                      <td className="p-2 border border-slate-300 text-center">+14đ</td>
                      <td className="p-2 border border-slate-300 text-center">+13đ</td>
                      <td className="p-2 border border-slate-300 text-center">+12đ</td>
                      <td className="p-2 border border-slate-300 text-center text-slate-500">+2đ</td>
                    </tr>
                    <tr className="bg-blue-50/50">
                      <td className="p-2 border border-slate-300 font-semibold">HSG Văn hóa, KHKT, STEM Cấp Tỉnh</td>
                      <td className="p-2 border border-slate-300 text-center font-bold text-blue-700">+22đ</td>
                      <td className="p-2 border border-slate-300 text-center font-bold text-blue-700">+20đ</td>
                      <td className="p-2 border border-slate-300 text-center">+18đ</td>
                      <td className="p-2 border border-slate-300 text-center">+16đ</td>
                      <td className="p-2 border border-slate-300 text-center text-slate-500">+5đ</td>
                    </tr>
                    <tr className="bg-amber-50/50">
                      <td className="p-2 border border-slate-300 font-semibold">HSG Văn hóa, KHKT Toàn Quốc (Quốc Gia)</td>
                      <td className="p-2 border border-slate-300 text-center font-black text-rose-700">+45đ</td>
                      <td className="p-2 border border-slate-300 text-center font-black text-rose-700">+40đ</td>
                      <td className="p-2 border border-slate-300 text-center font-black text-rose-700">+35đ</td>
                      <td className="p-2 border border-slate-300 text-center font-bold text-rose-700">+30đ</td>
                      <td className="p-2 border border-slate-300 text-center text-rose-700">+15đ</td>
                    </tr>
                    <tr>
                      <td className="p-2 border border-slate-300 font-semibold">Phong trào HKPĐ, TDTT, Ca múa hát cấp Cụm</td>
                      <td className="p-2 border border-slate-300 text-center font-bold text-emerald-700">+6đ</td>
                      <td className="p-2 border border-slate-300 text-center">+5đ</td>
                      <td className="p-2 border border-slate-300 text-center">+4đ</td>
                      <td className="p-2 border border-slate-300 text-center">+3đ</td>
                      <td className="p-2 border border-slate-300 text-center text-slate-500">+1đ</td>
                    </tr>
                    <tr className="bg-emerald-50/50">
                      <td className="p-2 border border-slate-300 font-semibold">Phong trào HKPĐ, TDTT, Ca múa hát Cấp Tỉnh</td>
                      <td className="p-2 border border-slate-300 text-center font-bold text-emerald-700">+20đ</td>
                      <td className="p-2 border border-slate-300 text-center font-bold text-emerald-700">+16đ</td>
                      <td className="p-2 border border-slate-300 text-center">+12đ</td>
                      <td className="p-2 border border-slate-300 text-center">+8đ</td>
                      <td className="p-2 border border-slate-300 text-center text-slate-500">+4đ</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Câu 7 */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-teal-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                  7
                </span>
                <h4 className="text-sm font-bold text-slate-900">
                  Hệ thống minh chứng xét thi đua (Căn cứ chấm 5.0đ Đổi mới PPDH, hồ sơ, sĩ số)
                </h4>
              </div>
              <div className="text-xs text-slate-700 space-y-2 bg-slate-50 p-3.5 rounded-lg border border-slate-100 leading-relaxed">
                <p>
                  Đã được tích hợp đầy đủ vào <strong>Mục 5. Hướng Dẫn Minh Chứng</strong> ngay trên thanh công cụ phía trên. Mọi giáo viên và tổ trưởng chuyên môn đều có thể tra cứu chính xác nơi lưu trữ và thẩm định: Kế hoạch bài dạy vnEdu theo CV 5512, Biên bản dự giờ xếp loại Tốt, sản phẩm học tập số, log xuất điểm hệ thống và sổ theo dõi chuyên cần.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
