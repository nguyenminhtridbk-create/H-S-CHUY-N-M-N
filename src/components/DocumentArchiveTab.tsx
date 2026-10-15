import React, { useState } from 'react';
import { 
  FolderArchive, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Trash2, 
  Calendar, 
  Building2, 
  FileText, 
  CheckCircle, 
  Clock,
  Printer,
  ChevronRight,
  Award,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { SchoolDocument, DOCUMENT_TYPES } from '../types/document';
import { exportDocumentToDocx } from '../utils/docxExport';

interface DocumentArchiveTabProps {
  documents: SchoolDocument[];
  onSelectDocument: (doc: SchoolDocument) => void;
  onDeleteDocument: (id: string) => void;
  onOpenCreateNew: () => void;
}

export const DocumentArchiveTab: React.FC<DocumentArchiveTabProps> = ({
  documents,
  onSelectDocument,
  onDeleteDocument,
  onOpenCreateNew,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');

  const filteredDocs = documents.filter((doc) => {
    const matchesType = selectedType === 'ALL' || doc.type === selectedType;
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.documentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.subTitle && doc.subTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      doc.signerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getTypeLabel = (type: string) => {
    const found = DOCUMENT_TYPES.find((d) => d.type === type);
    return found ? found.label : type;
  };

  const handleQuickDownload = async (e: React.MouseEvent, doc: SchoolDocument) => {
    e.stopPropagation();
    if (doc.sourceFileUrl) {
      const link = document.createElement('a');
      link.href = doc.sourceFileUrl;
      link.download = `${doc.id}.docx`;
      link.click();
      return;
    }
    await exportDocumentToDocx(doc);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-blue-100 text-blue-900 text-xs font-bold rounded flex items-center gap-1">
              <FolderArchive className="w-3.5 h-3.5" />
              <span>Kho Văn Bản Quản Lý Trường Học</span>
            </span>
            <span className="text-xs text-slate-500">
              Tổng số {documents.length} văn bản đã cụ thể hóa
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1">
            Sổ Lưu Trữ & Quản Lý Văn Bản Ban Hành
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Lưu trữ tập trung các Kế hoạch, Quyết định, Hướng dẫn, Quy chế của Trường THCS & THPT Đốc Binh Kiều.
          </p>
        </div>

        <button
          onClick={onOpenCreateNew}
          className="px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow transition shrink-0"
        >
          <FileText className="w-4 h-4" />
          <span>Cụ thể hóa văn bản mới</span>
        </button>
      </div>

      {/* Featured Regulations Spotlight */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Spotlight 1: Quy chế Kiểm tra Đánh giá học sinh (Tam Nông chuyển thể) */}
        {documents.find(d => d.id === 'doc-qc-ktdg-dbk') && (() => {
          const ktdgDoc = documents.find(d => d.id === 'doc-qc-ktdg-dbk')!;
          return (
            <div className="bg-gradient-to-br from-amber-900/90 via-slate-900 to-amber-950 text-white rounded-2xl p-5 border border-amber-500/40 shadow-md relative overflow-hidden flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 flex items-center gap-1 shadow-xs">
                    <Sparkles className="w-3 h-3" />
                    CHUẨN TAM NÔNG CHUYỂN THỂ
                  </span>
                  <span className="text-2xs font-mono text-amber-200/80">{ktdgDoc.documentNumber}</span>
                </div>
                <h3 className="font-extrabold text-white text-base leading-snug">
                  Quy Chế Kiểm Tra, Đánh Giá Học Sinh Năm Học 2026 - 2027
                </h3>
                <p className="text-xs text-amber-100/80 line-clamp-2">
                  Giữ nguyên phần cứng 9 Chương, 27 Điều từ THPT Tam Nông; sửa đổi câu từ thích ứng trường liên cấp THCS & THPT và 3 điểm trường Đốc Binh Kiều.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectDocument(ktdgDoc)}
                  className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 shadow cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Xem A4 & Chỉnh sửa</span>
                </button>
                <button
                  onClick={(e) => handleQuickDownload(e, ktdgDoc)}
                  className="px-3.5 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs font-semibold border border-white/20 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-amber-300" />
                  <span>Tải Word (.docx)</span>
                </button>
              </div>
            </div>
          );
        })()}

        {/* Spotlight 2: Quy chế Thi đua 100đ Chuẩn NĐ 233 */}
        {documents.find(d => d.id === 'doc-qc-thidua-233') && (() => {
          const emulDoc = documents.find(d => d.id === 'doc-qc-thidua-233')!;
          return (
            <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 text-white rounded-2xl p-5 border border-indigo-500/40 shadow-md relative overflow-hidden flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-400 text-slate-950 flex items-center gap-1 shadow-xs">
                    <Award className="w-3 h-3" />
                    CHUẨN NGHỊ ĐỊNH 233/2026
                  </span>
                  <span className="text-2xs font-mono text-indigo-200/80">{emulDoc.documentNumber}</span>
                </div>
                <h3 className="font-extrabold text-white text-base leading-snug">
                  Quy Chế & Biểu Điểm Thi Đua Viên Chức (100 Điểm)
                </h3>
                <p className="text-xs text-indigo-100/80 line-clamp-2">
                  Đồng bộ 3 nhóm đánh giá, cơ chế GVCN & GVBM, ngưỡng chất lượng, bảng cộng/trừ chi tiết và minh chứng 100% lượng hóa.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectDocument(emulDoc)}
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-bold transition flex items-center gap-1.5 shadow cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Xem A4 & Chỉnh sửa</span>
                </button>
                <button
                  onClick={(e) => handleQuickDownload(e, emulDoc)}
                  className="px-3.5 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs font-semibold border border-white/20 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-indigo-300" />
                  <span>Tải Word (.docx)</span>
                </button>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3">
        <div className="flex items-center gap-3 flex-1 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo số hiệu, tiêu đề, người ký..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Type Filter */}
          <div className="min-w-[180px]">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">Tất cả loại văn bản ({documents.length})</option>
              {DOCUMENT_TYPES.map((dt) => (
                <option key={dt.type} value={dt.type}>
                  {dt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Documents Grid / List */}
      {filteredDocs.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
          <FolderArchive className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-700 text-sm">Không tìm thấy văn bản phù hợp</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Không có văn bản nào khớp với bộ lọc. Thầy có thể tạo văn bản mới bằng cách tải lên chỉ đạo của Sở/Bộ.
          </p>
          <button
            onClick={onOpenCreateNew}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5"
          >
            <span>Bắt đầu cụ thể hóa văn bản</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              onClick={() => onSelectDocument(doc)}
              className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs hover:shadow-md hover:border-blue-400 transition cursor-pointer flex flex-col justify-between group"
            >
              <div>
                {/* Header Tag and Document Number */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-800 font-bold border border-blue-100">
                      {doc.documentNumber}
                    </span>
                    {doc.id === 'doc-qc-ktdg-dbk' && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                        Khung Tam Nông
                      </span>
                    )}
                    {doc.id === 'doc-qc-thidua-233' && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-900 border border-indigo-300">
                        Chuẩn NĐ 233
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-500 shrink-0">{getTypeLabel(doc.type)}</span>
                </div>

                {/* Title */}
                <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 group-hover:text-blue-700 transition">
                  {doc.title}
                </h3>

                {/* Subtitle / Source */}
                {doc.subTitle && (
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1 italic">
                    {doc.subTitle}
                  </p>
                )}

                {/* Metadata */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Ngày ban hành:</span>
                    <span>{doc.signDate.replace('Tháp Mười, ', '')}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Người ký:</span>
                    <strong className="text-slate-800">{doc.signerName}</strong>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Số phần/mục:</span>
                    <span>{doc.sections.length} phần nội dung</span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-blue-600 group-hover:underline flex items-center gap-1">
                  <span>Mở xem & In</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => handleQuickDownload(e, doc)}
                    className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg transition"
                    title="Tải nhanh file Word (.docx)"
                  >
                    <Download className="w-4 h-4 text-blue-700" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Thầy có chắc muốn xóa văn bản "${doc.title}" khỏi kho lưu trữ?`)) {
                        onDeleteDocument(doc.id);
                      }
                    }}
                    className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition"
                    title="Xóa văn bản này"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
