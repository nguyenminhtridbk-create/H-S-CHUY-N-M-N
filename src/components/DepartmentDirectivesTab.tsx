import React, { useState, useRef, useEffect } from 'react';
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
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  FolderPlus,
  FolderX,
  Layers,
  Tag
} from 'lucide-react';
import { DepartmentDirective, SchoolDocument } from '../types/document';
import { DirectiveCategory, DEFAULT_DIRECTIVE_CATEGORIES } from '../data/categories';
import { extractTextFromFile } from '../utils/fileReader';
import { AdministrativeDirectiveViewerModal } from './AdministrativeDirectiveViewerModal';

interface DepartmentDirectivesTabProps {
  directives: DepartmentDirective[];
  schoolDocuments: SchoolDocument[];
  onAddDirective: (directive: DepartmentDirective) => void;
  onDeleteDirective: (id: string) => void;
  onContextualizeDirective: (directive: DepartmentDirective) => void;
  onViewSchoolDocument: (doc: SchoolDocument) => void;
  onOpenUploadModal?: () => void;
  categories?: DirectiveCategory[];
  onAddCategory?: (name: string, desc?: string) => Promise<DirectiveCategory | null>;
  onDeleteCategory?: (id: string) => void;
}

export const DepartmentDirectivesTab: React.FC<DepartmentDirectivesTabProps> = ({
  directives,
  schoolDocuments,
  onAddDirective,
  onDeleteDirective,
  onContextualizeDirective,
  onViewSchoolDocument,
  onOpenUploadModal,
  categories = DEFAULT_DIRECTIVE_CATEGORIES,
  onAddCategory,
  onDeleteCategory,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [selectedDirectiveForView, setSelectedDirectiveForView] = useState<DepartmentDirective | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Category creation modal
  const [isNewCategoryModalOpen, setIsNewCategoryModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [creatingCategory, setCreatingCategory] = useState(false);

  // Category Dropdown state
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  // Category horizontal scroll ref
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const [canCatScrollLeft, setCanCatScrollLeft] = useState(false);
  const [canCatScrollRight, setCanCatScrollRight] = useState(false);

  // New Directive Form State
  const [newDocNumber, setNewDocNumber] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newTopic, setNewTopic] = useState('Hồ sơ sổ sách điện tử');
  const [newAuthority, setNewAuthority] = useState('SỞ GDĐT TỈNH ĐỒNG THÁP');
  const [newSignDate, setNewSignDate] = useState('Đồng Tháp, ngày 28 tháng 8 năm 2026');
  const [newSigner, setNewSigner] = useState('KT. GIÁM ĐỐC - PHÓ GIÁM ĐỐC Nguyễn Phương Toàn');
  const [newSummary, setNewSummary] = useState('');
  const [newFullContent, setNewFullContent] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [readingFile, setReadingFile] = useState(false);

  // Check scroll state for categories
  const checkCategoryScroll = () => {
    if (categoryScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = categoryScrollRef.current;
      setCanCatScrollLeft(scrollLeft > 10);
      setCanCatScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkCategoryScroll();
    window.addEventListener('resize', checkCategoryScroll);
    return () => window.removeEventListener('resize', checkCategoryScroll);
  }, [categories]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setIsCategoryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleScrollCatLeft = () => {
    if (categoryScrollRef.current) {
      categoryScrollRef.current.scrollBy({ left: -240, behavior: 'smooth' });
      setTimeout(checkCategoryScroll, 250);
    }
  };

  const handleScrollCatRight = () => {
    if (categoryScrollRef.current) {
      categoryScrollRef.current.scrollBy({ left: 240, behavior: 'smooth' });
      setTimeout(checkCategoryScroll, 250);
    }
  };

  // Submit new category
  const handleCreateCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    try {
      setCreatingCategory(true);
      if (onAddCategory) {
        const added = await onAddCategory(newCatName.trim(), newCatDesc.trim());
        if (added) {
          setSelectedTopic(added.name);
        }
      } else {
        setSelectedTopic(newCatName.trim());
      }
      setNewCatName('');
      setNewCatDesc('');
      setIsNewCategoryModalOpen(false);
      setTimeout(checkCategoryScroll, 200);
    } catch (err) {
      console.error('Failed to create category:', err);
    } finally {
      setCreatingCategory(false);
    }
  };

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

        <div className="flex items-center gap-2 flex-wrap shrink-0">
          {onOpenUploadModal && (
            <button
              onClick={onOpenUploadModal}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition"
              title="Tải lên Word/PDF bóc tách trực tiếp không tốn token AI"
            >
              <Upload className="w-4 h-4" />
              <span>Tải lên file (Word / PDF) - 0 Token AI</span>
            </button>
          )}

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm văn bản của Sở</span>
          </button>
        </div>
      </div>

      {/* TOPIC / CATEGORY NAVIGATION BAR WITH HORIZONTAL SCROLL & DROPDOWN */}
      <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm space-y-2">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-blue-600" />
              Danh mục chuyên đề:
            </span>
            <span className="text-[11px] text-slate-400">
              ({categories.length - 1} danh mục)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Dropdown Category Switcher */}
            <div className="relative" ref={categoryDropdownRef}>
              <button
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 flex items-center gap-1.5 transition"
                title="Xổ xuống chọn nhanh danh mục văn bản"
              >
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                <span>Xổ xuống chọn:</span>
                <span className="font-bold text-blue-800 max-w-[150px] truncate">
                  {categories.find(c => c.name === selectedTopic || c.id === selectedTopic)?.label || selectedTopic}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isCategoryDropdownOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-30 max-h-80 overflow-y-auto">
                  <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase border-b border-slate-100 mb-1">
                    Danh sách các danh mục
                  </div>
                  {categories.map((c) => {
                    const count = c.id === 'all' 
                      ? directives.length 
                      : directives.filter((d) => d.topic === c.name || d.topic === c.id).length;
                    const isSelected = selectedTopic === c.id || selectedTopic === c.name;
                    return (
                      <button
                        key={c.id}
                        onClick={() => {
                          setSelectedTopic(c.name);
                          setIsCategoryDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition ${
                          isSelected ? 'bg-blue-50 text-blue-800 font-bold' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span className="truncate">{c.label}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-blue-200 text-blue-900 font-bold' : 'bg-slate-100 text-slate-500'}`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                  <div className="border-t border-slate-100 mt-1 pt-1 px-2">
                    <button
                      onClick={() => {
                        setIsCategoryDropdownOpen(false);
                        setIsNewCategoryModalOpen(true);
                      }}
                      className="w-full px-2.5 py-1.5 text-xs text-blue-700 font-bold bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center justify-center gap-1.5 transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Tạo danh mục mới...</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Button to Create New Category directly */}
            <button
              onClick={() => setIsNewCategoryModalOpen(true)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-sm transition active:scale-95"
              title="Tạo danh mục mới để đưa văn bản vào"
            >
              <FolderPlus className="w-3.5 h-3.5 text-white" />
              <span>+ Tạo danh mục mới</span>
            </button>
          </div>
        </div>

        {/* Horizontal Category Scroll Container with Arrow Buttons */}
        <div className="flex items-center gap-1.5 pt-1">
          {/* Scroll Left Button */}
          <button
            onClick={handleScrollCatLeft}
            disabled={!canCatScrollLeft}
            title="Cuộn danh mục sang trái"
            className={`p-1.5 rounded-lg border text-slate-600 transition shrink-0 ${
              canCatScrollLeft
                ? 'bg-slate-100 hover:bg-blue-600 hover:text-white border-slate-300 cursor-pointer shadow-xs'
                : 'opacity-30 border-transparent cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Category Pills Container */}
          <div 
            ref={categoryScrollRef}
            onScroll={checkCategoryScroll}
            className="flex-1 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar scrollbar-none scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categories.map((t) => {
              const isSelected = selectedTopic === t.id || selectedTopic === t.name;
              const count = t.id === 'all' 
                ? directives.length 
                : directives.filter((d) => d.topic === t.name || d.topic === t.id).length;

              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedTopic(t.name)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 shrink-0 ${
                    isSelected
                      ? 'bg-blue-700 text-white shadow-xs'
                      : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  <span>{t.label}</span>
                  {t.id !== 'all' && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isSelected ? 'bg-blue-800 text-blue-100' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {count}
                    </span>
                  )}
                  {t.isCustom && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" title="Danh mục do Thầy tạo"></span>
                  )}
                </button>
              );
            })}

            {/* Inline Quick Add Category Button */}
            <button
              onClick={() => setIsNewCategoryModalOpen(true)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap text-blue-700 bg-blue-50 hover:bg-blue-100 border border-dashed border-blue-300 flex items-center gap-1 shrink-0 transition"
              title="Tạo thêm danh mục mới"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm tab danh mục</span>
            </button>
          </div>

          {/* Scroll Right Button */}
          <button
            onClick={handleScrollCatRight}
            disabled={!canCatScrollRight}
            title="Cuộn danh mục sang phải"
            className={`p-1.5 rounded-lg border text-slate-600 transition shrink-0 ${
              canCatScrollRight
                ? 'bg-slate-100 hover:bg-blue-600 hover:text-white border-slate-300 cursor-pointer shadow-xs'
                : 'opacity-30 border-transparent cursor-not-allowed'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
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

      {/* Empty State when category has no directives */}
      {filteredDirectives.length === 0 && (
        <div className="bg-white rounded-xl border border-dashed border-slate-300 p-8 text-center space-y-4">
          <div className="w-14 h-14 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-center mx-auto text-blue-600">
            <FolderX className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="font-bold text-slate-800 text-sm md:text-base">
              Chưa có văn bản trong danh mục "{selectedTopic === 'all' ? 'này' : selectedTopic}"
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Thầy có thể đưa văn bản vào danh mục này bằng cách tải tệp Word / PDF lên hoặc thêm văn bản thủ công ngay bên dưới.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 flex-wrap pt-2">
            {onOpenUploadModal && (
              <button
                onClick={onOpenUploadModal}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition active:scale-95"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Tải tệp Word / PDF vào danh mục này</span>
              </button>
            )}
            <button
              onClick={() => {
                setNewTopic(selectedTopic !== 'all' ? selectedTopic : 'Hồ sơ sổ sách điện tử');
                setIsAddModalOpen(true);
              }}
              className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm văn bản thủ công</span>
            </button>
          </div>
        </div>
      )}

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

      {/* MODAL: CREATE NEW CATEGORY */}
      {isNewCategoryModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-sm sm:text-base">Tạo Danh Mục Mới Cho Văn Bản</h3>
              </div>
              <button
                onClick={() => setIsNewCategoryModalOpen(false)}
                className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCategorySubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tên danh mục mới / Tab chuyên đề: <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="VD: Chuyên môn, Đoàn thanh niên, Chủ nhiệm, Khảo thí..."
                  className="w-full text-xs rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                  autoFocus
                  required
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Danh mục này sẽ xuất hiện thành một tab mới trên giao diện và trong cửa sổ tải lên tệp.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mô tả / Ghi chú (Tùy chọn):
                </label>
                <textarea
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  placeholder="Ghi chú về mục đích hoặc loại văn bản trong danh mục này..."
                  rows={2}
                  className="w-full text-xs rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewCategoryModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={creatingCategory || !newCatName.trim()}
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition active:scale-95"
                >
                  <Check className="w-4 h-4 text-white" />
                  <span>{creatingCategory ? 'Đang tạo...' : 'Tạo danh mục & Chọn ngay'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 1: VIEW FULL CONTENT OF SỞ'S DIRECTIVE - OFFICIAL DECREE 30 FORMAT */}
      {selectedDirectiveForView && (
        <AdministrativeDirectiveViewerModal
          directive={selectedDirectiveForView}
          onClose={() => setSelectedDirectiveForView(null)}
          onContextualize={(dir) => {
            setSelectedDirectiveForView(null);
            onContextualizeDirective(dir);
          }}
        />
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
                    onChange={(e) => {
                      if (e.target.value === '__NEW__') {
                        setIsNewCategoryModalOpen(true);
                      } else {
                        setNewTopic(e.target.value);
                      }
                    }}
                    className="w-full text-xs font-medium rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  >
                    {categories.filter(c => c.id !== 'all').map((c) => (
                      <option key={c.id} value={c.name}>{c.label}</option>
                    ))}
                    <option value="__NEW__">+ Tạo danh mục mới...</option>
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
