import React, { useState } from 'react';
import { 
  Building2, 
  FileText, 
  Upload, 
  Plus, 
  Search, 
  Eye, 
  Sparkles, 
  ArrowRight, 
  Check, 
  Calendar, 
  Trash2, 
  ExternalLink, 
  BookOpen, 
  Link2, 
  FileCheck,
  Save,
  X
} from 'lucide-react';
import { DepartmentDirective, SchoolDocument } from '../types/document';
import { extractTextFromFile } from '../utils/fileReader';

interface DepartmentDirectivesTabProps {
  directives: DepartmentDirective[];
  schoolDocuments: SchoolDocument[];
  onAddDirective: (directive: DepartmentDirective) => void;
  onDeleteDirective: (id: string) => void;
  onContextualizeDirective: (directive: DepartmentDirective) => void;
  onViewSchoolDocument: (doc: SchoolDocument) => void;
}

export const DepartmentDirectivesTab: React.FC<DepartmentDirectivesTabProps> = ({
  directives,
  schoolDocuments,
  onAddDirective,
  onDeleteDirective,
  onContextualizeDirective,
  onViewSchoolDocument,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [selectedDirectiveForView, setSelectedDirectiveForView] = useState<DepartmentDirective | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Directive Form State
  const [newDocNumber, setNewDocNumber] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newTopic, setNewTopic] = useState('2 buổi / ngày');
  const [newAuthority, setNewAuthority] = useState('SỞ GDĐT TỈNH ĐỒNG THÁP');
  const [newSignDate, setNewSignDate] = useState('Đồng Tháp, ngày 28 tháng 8 năm 2026');
  const [newSigner, setNewSigner] = useState('KT. GIÁM ĐỐC - PHÓ GIÁM ĐỐC Nguyễn Phương Toàn');
  const [newSummary, setNewSummary] = useState('');
  const [newFullContent, setNewFullContent] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [readingFile, setReadingFile] = useState(false);

  // Topics list
  const TOPICS = [
    { id: 'all', label: 'Tất cả chuyên đề' },
    { id: '2 buổi / ngày', label: '2 buổi / ngày' },
    { id: 'Hướng nghiệp & Phân luồng', label: 'Hướng nghiệp & Phân luồng' },
    { id: 'Khung năng lực số', label: 'Khung năng lực số' },
    { id: 'Kiểm tra đánh giá', label: 'Kiểm tra đánh giá' },
    { id: 'Dạy thêm học thêm', label: 'Dạy thêm học thêm' },
    { id: 'Hồ sơ sổ sách điện tử', label: 'Hồ sơ sổ sách điện tử' },
    { id: 'Nhiệm vụ chung năm học', label: 'Nhiệm vụ năm học' },
  ];

  // Filter
  const filteredDirectives = directives.filter((d) => {
    const matchesSearch =
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.documentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTopic = selectedTopic === 'all' || d.topic === selectedTopic;
    return matchesSearch && matchesTopic;
  });

  // Handle File Upload for New Directive
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setReadingFile(true);
      setUploadedFileName(file.name);
      const text = await extractTextFromFile(file);
      setNewFullContent(text);
      if (!newTitle) {
        setNewTitle(file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '));
      }
    } catch (err: any) {
      alert('Không thể đọc file: ' + err.message);
    } finally {
      setReadingFile(false);
    }
  };

  // Submit New Directive
  const handleSaveDirective = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newFullContent.trim()) {
      alert('Vui lòng nhập tiêu đề và nội dung văn bản của Sở');
      return;
    }

    const createdDirective: DepartmentDirective = {
      id: 'directive-' + Date.now(),
      documentNumber: newDocNumber || 'Số: .../SGDĐT',
      title: newTitle.trim(),
      topic: newTopic,
      issuingAuthority: newAuthority.trim(),
      signDate: newSignDate.trim(),
      signer: newSigner.trim(),
      summary: newSummary.trim() || newTitle.trim(),
      fullContent: newFullContent.trim(),
      createdDate: new Date().toISOString(),
      fileName: uploadedFileName,
      linkedSchoolDocumentIds: [],
    };

    onAddDirective(createdDirective);
    setIsAddModalOpen(false);

    // Reset form
    setNewDocNumber('');
    setNewTitle('');
    setNewSummary('');
    setNewFullContent('');
    setUploadedFileName('');
  };

  // Find linked documents of school for this directive
  const getLinkedSchoolDocs = (directive: DepartmentDirective) => {
    return schoolDocuments.filter(
      (sd) =>
        sd.sourceDirectiveId === directive.id ||
        (sd.sourceDirective && sd.sourceDirective.includes(directive.documentNumber)) ||
        (directive.linkedSchoolDocumentIds && directive.linkedSchoolDocumentIds.includes(sd.id))
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-xs font-bold rounded flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" />
              <span>Văn Bản Chỉ Đạo Của Sở GDĐT & Cấp Trên</span>
            </span>
            <span className="text-xs px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-medium">
              ✓ Đã đồng bộ 6 chuyên đề từ thư mục VAN-BAN-DEN
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1.5">
            Kho Chỉ Đạo Của Sở & Cụ Thể Hóa Thành Kế Hoạch Của Trường
          </h2>
          <p className="text-xs text-slate-600 mt-0.5 max-w-3xl">
            Các văn bản chỉ đạo của Sở GDĐT Đồng Tháp và Bộ GDĐT được số hóa sẵn theo từng nội dung. Khi Thầy/Cô bấm <strong>"Xây dựng kế hoạch cho trường"</strong>, hệ thống tự động đưa đúng tinh thần chỉ đạo của Sở vào mẫu văn bản chuẩn Nghị định 30 của trường THCS & THPT Đốc Binh Kiều.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm văn bản của Sở lên webapp</span>
        </button>
      </div>

      {/* Kiến trúc tối ưu & Giải đáp kỹ thuật */}
      <div className="bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-slate-50 border border-blue-200/80 rounded-xl p-4 text-xs text-slate-700 shadow-2xs space-y-2">
        <div className="flex items-center gap-2 font-bold text-blue-900 text-sm">
          <BookOpen className="w-4 h-4 text-blue-700" />
          <span>Giải pháp lưu trữ tối ưu: Dữ liệu văn bản có cấu trúc trên WebApp</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-600">
          <div className="bg-white/90 p-3 rounded-lg border border-blue-100">
            <span className="font-semibold text-slate-800 block mb-1">
              1. Có nên để file PDF thô trong thư mục hay chuyển lên WebApp?
            </span>
            <p className="leading-relaxed">
              <strong>Nên chuyển nội dung thành dữ liệu có cấu trúc sẵn trên WebApp</strong> theo 6 chuyên đề (như đang hiển thị bên dưới). Nhờ đó, Thầy/Cô và đồng nghiệp xem được ngay lập tức trên máy tính/điện thoại không cần tải file nặng, tìm kiếm tức thì và 1-click tạo kế hoạch trường.
            </p>
          </div>
          <div className="bg-white/90 p-3 rounded-lg border border-blue-100">
            <span className="font-semibold text-slate-800 block mb-1">
              2. Để file trong thư mục có gây nặng GitHub hoặc WebApp không?
            </span>
            <p className="leading-relaxed">
              <strong>Có</strong>: Thư mục chứa các file scan PDF nặng tới <strong>~45 MB</strong> (trong đó có 2 file &gt;11MB và nhiều file trùng lặp). Nếu bundle vào WebApp sẽ làm ứng dụng tải chậm. Khi chuyển sang text trên WebApp, dung lượng chỉ còn <strong>~350 KB</strong> (nhẹ hơn 100 lần), GitHub và WebApp chạy siêu mượt.
            </p>
          </div>
        </div>
      </div>

      {/* Topic Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {TOPICS.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelectedTopic(t.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
              selectedTopic === t.id
                ? 'bg-blue-700 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            <span>{t.label}</span>
            {t.id !== 'all' && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  selectedTopic === t.id ? 'bg-blue-800 text-blue-100' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {directives.filter((d) => d.topic === t.id).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo số hiệu văn bản của Sở (1251, 998, 195, 471, 3223, 3635, 1061...), tiêu đề, nội dung..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <span className="text-xs text-slate-500 whitespace-nowrap font-medium">
          {filteredDirectives.length} văn bản
        </span>
      </div>

      {/* Directives List */}
      <div className="space-y-4">
        {filteredDirectives.map((directive) => {
          const linkedDocs = getLinkedSchoolDocs(directive);

          return (
            <div
              key={directive.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition space-y-4"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold px-2.5 py-0.5 bg-amber-50 text-amber-900 border border-amber-200 rounded">
                      {directive.documentNumber}
                    </span>
                    {directive.topic && (
                      <span className="text-xs font-semibold px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded">
                        {directive.topic}
                      </span>
                    )}
                    <span className="text-xs text-slate-500">{directive.issuingAuthority}</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs text-slate-500">{directive.signDate}</span>
                    {directive.fileSize && (
                      <span className="text-[11px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                        Tệp gốc: {directive.fileSize}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm md:text-base leading-snug">
                    {directive.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setSelectedDirectiveForView(directive)}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    <span>Xem toàn văn của Sở</span>
                  </button>

                  <button
                    onClick={() => onContextualizeDirective(directive)}
                    className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Xây dựng kế hoạch cho trường</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Summary */}
              <p className="text-xs text-slate-600 line-clamp-3 bg-slate-50/70 p-3 rounded-lg border border-slate-100 leading-relaxed">
                {directive.summary}
              </p>

              {/* Linked School Documents */}
              <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-slate-700 flex items-center gap-1">
                    <Link2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Văn bản của trường đã cụ thể hóa từ chỉ đạo này:</span>
                  </span>

                  {linkedDocs.length === 0 ? (
                    <span className="text-slate-400 italic">Chưa có văn bản cụ thể hóa</span>
                  ) : (
                    linkedDocs.map((sd) => (
                      <button
                        key={sd.id}
                        onClick={() => onViewSchoolDocument(sd)}
                        className="px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 font-medium flex items-center gap-1 transition"
                      >
                        <FileCheck className="w-3 h-3 text-blue-700" />
                        <span>{sd.documentNumber} ({sd.subTitle || sd.title})</span>
                        <ExternalLink className="w-3 h-3 text-blue-500" />
                      </button>
                    ))
                  )}
                </div>

                <button
                  onClick={() => {
                    if (confirm(`Thầy có chắc muốn xóa văn bản chỉ đạo "${directive.title}" khỏi webapp?`)) {
                      onDeleteDirective(directive.id);
                    }
                  }}
                  className="text-slate-400 hover:text-rose-600 p-1 rounded transition self-end sm:self-auto"
                  title="Xóa văn bản này"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL 1: VIEW FULL CONTENT OF SỞ'S DIRECTIVE */}
      {selectedDirectiveForView && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col border border-slate-200">
            {/* Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-blue-950 to-indigo-950 text-white rounded-t-2xl flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs text-amber-300">
                  <span className="font-bold">{selectedDirectiveForView.issuingAuthority}</span>
                  <span>·</span>
                  <span>{selectedDirectiveForView.documentNumber}</span>
                </div>
                <h3 className="font-bold text-base mt-0.5">{selectedDirectiveForView.title}</h3>
              </div>
              <button
                onClick={() => setSelectedDirectiveForView(null)}
                className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-4 font-mono text-xs text-slate-800 leading-relaxed bg-slate-50/50">
              <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-slate-800">
                {selectedDirectiveForView.fullContent}
              </pre>
            </div>

            {/* Footer Actions */}
            <div className="px-6 py-3 bg-white border-t border-slate-200 rounded-b-2xl flex justify-between items-center">
              <span className="text-xs text-slate-500">
                Ký bởi: {selectedDirectiveForView.signer}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedDirectiveForView(null)}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700"
                >
                  Đóng
                </button>
                <button
                  onClick={() => {
                    const dir = selectedDirectiveForView;
                    setSelectedDirectiveForView(null);
                    onContextualizeDirective(dir);
                  }}
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Xây dựng văn bản của trường từ chỉ đạo này</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD NEW DIRECTIVE FROM SỞ */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col border border-slate-200">
            <div className="px-6 py-4 bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-base">Thêm Văn Bản Chỉ Đạo Của Sở Lên Webapp</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveDirective} className="p-6 overflow-y-auto space-y-4">
              {/* File upload shortcut */}
              <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h4 className="text-xs font-bold text-blue-900">Tải tệp văn bản của Sở (.docx, .pdf, .txt)</h4>
                  <p className="text-[11px] text-blue-700">Hệ thống sẽ tự động đọc nội dung đưa vào ô soạn thảo bên dưới.</p>
                </div>

                <label className="cursor-pointer px-3.5 py-2 bg-white hover:bg-blue-100 border border-blue-300 rounded-lg text-xs font-semibold text-blue-800 flex items-center gap-1.5 transition">
                  <Upload className="w-3.5 h-3.5 text-blue-600" />
                  <span>{readingFile ? 'Đang đọc tệp...' : uploadedFileName ? `Đã chọn (${uploadedFileName})` : 'Chọn tệp từ máy tính'}</span>
                  <input
                    type="file"
                    accept=".docx,.txt,.doc"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Số hiệu văn bản:
                  </label>
                  <input
                    type="text"
                    value={newDocNumber}
                    onChange={(e) => setNewDocNumber(e.target.value)}
                    placeholder="Ví dụ: Số: 1061/HD-SGDĐT"
                    className="w-full text-xs rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Cơ quan ban hành:
                  </label>
                  <input
                    type="text"
                    value={newAuthority}
                    onChange={(e) => setNewAuthority(e.target.value)}
                    placeholder="Ví dụ: SỞ GDĐT TỈNH ĐỒNG THÁP"
                    className="w-full text-xs rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Chuyên đề (Danh mục):
                  </label>
                  <select
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    className="w-full text-xs font-medium rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  >
                    <option value="2 buổi / ngày">2 buổi / ngày</option>
                    <option value="Hướng nghiệp & Phân luồng">Hướng nghiệp & Phân luồng</option>
                    <option value="Khung năng lực số">Khung năng lực số</option>
                    <option value="Kiểm tra đánh giá">Kiểm tra đánh giá</option>
                    <option value="Dạy thêm học thêm">Dạy thêm học thêm</option>
                    <option value="Hồ sơ sổ sách điện tử">Hồ sơ sổ sách điện tử</option>
                    <option value="Nhiệm vụ chung năm học">Nhiệm vụ chung năm học</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Người ký:
                  </label>
                  <input
                    type="text"
                    value={newSigner}
                    onChange={(e) => setNewSigner(e.target.value)}
                    placeholder="Ví dụ: KT. GIÁM ĐỐC - PHÓ GIÁM ĐỐC Nguyễn Phương Toàn"
                    className="w-full text-xs rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tiêu đề văn bản của Sở:
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ví dụ: Hướng dẫn tổ chức dạy học 2 buổi/ngày năm học 2026 - 2027"
                  className="w-full text-xs font-semibold rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Địa danh & Ngày tháng ban hành:
                </label>
                <input
                  type="text"
                  value={newSignDate}
                  onChange={(e) => setNewSignDate(e.target.value)}
                  placeholder="Ví dụ: Đồng Tháp, ngày 28 tháng 8 năm 2026"
                  className="w-full text-xs rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tóm tắt tinh thần chỉ đạo:
                </label>
                <textarea
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  rows={2}
                  placeholder="Tóm tắt ngắn gọn các nội dung chính để dễ tìm kiếm sau này..."
                  className="w-full text-xs rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Toàn văn văn bản chỉ đạo của Sở:
                </label>
                <textarea
                  value={newFullContent}
                  onChange={(e) => setNewFullContent(e.target.value)}
                  rows={8}
                  placeholder="Dán toàn văn chỉ đạo của Sở vào đây..."
                  className="w-full text-xs rounded-lg border border-slate-300 p-3 font-mono leading-relaxed focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Lưu vào webapp</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
