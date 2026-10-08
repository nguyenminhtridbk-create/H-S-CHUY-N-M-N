import React, { useState, useRef } from 'react';
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Sparkles, 
  Copy, 
  Check, 
  FolderPlus, 
  ArrowRight, 
  Cpu, 
  FileCheck,
  RefreshCw,
  Building2,
  Calendar,
  Layers
} from 'lucide-react';
import { DepartmentDirective } from '../types/document';
import { DirectiveCategory, DEFAULT_DIRECTIVE_CATEGORIES } from '../data/categories';

interface UploadDirectiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDirectiveSaved: (directive: DepartmentDirective) => void;
  onContextualizeNow?: (directive: DepartmentDirective) => void;
  categories?: DirectiveCategory[];
  onAddCategory?: (name: string, desc?: string) => Promise<DirectiveCategory | null>;
  defaultTopic?: string;
}

export const UploadDirectiveModal: React.FC<UploadDirectiveModalProps> = ({
  isOpen,
  onClose,
  onDirectiveSaved,
  onContextualizeNow,
  categories = DEFAULT_DIRECTIVE_CATEGORIES,
  onAddCategory,
  defaultTopic,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Parsed metadata
  const [extractedDirective, setExtractedDirective] = useState<DepartmentDirective | null>(null);
  const [docNumber, setDocNumber] = useState('');
  const [title, setTitle] = useState('');
  const [signDate, setSignDate] = useState('');
  const [issuingAuthority, setIssuingAuthority] = useState('SỞ GDĐT TỈNH ĐỒNG THÁP');
  const [signer, setSigner] = useState('');
  const [topic, setTopic] = useState(defaultTopic || 'Hồ sơ sổ sách điện tử');
  const [previewContent, setPreviewContent] = useState('');

  // Inline category creation
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCatInput, setNewCatInput] = useState('');
  const [savingCategory, setSavingCategory] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleCreateCategoryQuick = async () => {
    if (!newCatInput.trim()) return;
    try {
      setSavingCategory(true);
      if (onAddCategory) {
        const added = await onAddCategory(newCatInput.trim());
        if (added) {
          setTopic(added.name);
        }
      } else {
        setTopic(newCatInput.trim());
      }
      setNewCatInput('');
      setIsCreatingCategory(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSavingCategory(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      processFile(droppedFile);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const processFile = async (selectedFile: File) => {
    const lowerName = selectedFile.name.toLowerCase();
    if (!lowerName.endsWith('.docx') && !lowerName.endsWith('.pdf') && !lowerName.endsWith('.doc') && !lowerName.endsWith('.txt')) {
      setError('Chỉ hỗ trợ tệp định dạng Word (.docx), PDF (.pdf) hoặc văn bản (.txt).');
      return;
    }

    try {
      setFile(selectedFile);
      setUploading(true);
      setError(null);
      setExtractedDirective(null);

      // Convert file to base64
      const arrayBuffer = await selectedFile.arrayBuffer();
      const uint8 = new Uint8Array(arrayBuffer);
      let binary = '';
      const chunkSize = 8192;
      for (let i = 0; i < uint8.length; i += chunkSize) {
        binary += String.fromCharCode.apply(null, Array.from(uint8.subarray(i, i + chunkSize)));
      }
      const base64 = btoa(binary);

      // Send to server-side parser (Zero AI Token cost!)
      const res = await fetch('/api/upload-directive-file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          base64,
          fileName: selectedFile.name,
          topic,
        }),
      });

      const resData = await res.json();
      if (!resData.success || !resData.data) {
        throw new Error(resData.error || 'Không thể trích xuất nội dung văn bản.');
      }

      const dir: DepartmentDirective = resData.data;
      setExtractedDirective(dir);
      setDocNumber(dir.documentNumber || '');
      setTitle(dir.title || '');
      setSignDate(dir.signDate || '');
      setIssuingAuthority(dir.issuingAuthority || 'SỞ GDĐT TỈNH ĐỒNG THÁP');
      setSigner(dir.signer || '');
      setTopic(dir.topic || 'Hồ sơ sổ sách điện tử');
      setPreviewContent(dir.fullContent || '');
    } catch (err: any) {
      console.error('File parsing error:', err);
      setError(err.message || 'Lỗi khi đọc và bóc tách tệp.');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveToDirectives = () => {
    if (!extractedDirective) return;
    const finalDirective: DepartmentDirective = {
      ...extractedDirective,
      documentNumber: docNumber.trim() || extractedDirective.documentNumber,
      title: title.trim() || extractedDirective.title,
      signDate: signDate.trim() || extractedDirective.signDate,
      issuingAuthority: issuingAuthority.trim() || extractedDirective.issuingAuthority,
      signer: signer.trim() || extractedDirective.signer,
      topic: topic,
    };

    onDirectiveSaved(finalDirective);
    onClose();
  };

  const handleContextualizeAndDraft = () => {
    if (!extractedDirective) return;
    const finalDirective: DepartmentDirective = {
      ...extractedDirective,
      documentNumber: docNumber.trim() || extractedDirective.documentNumber,
      title: title.trim() || extractedDirective.title,
      signDate: signDate.trim() || extractedDirective.signDate,
      issuingAuthority: issuingAuthority.trim() || extractedDirective.issuingAuthority,
      signer: signer.trim() || extractedDirective.signer,
      topic: topic,
    };

    onDirectiveSaved(finalDirective);
    if (onContextualizeNow) {
      onContextualizeNow(finalDirective);
    }
    onClose();
  };

  const handleCopyText = () => {
    if (!previewContent) return;
    navigator.clipboard.writeText(previewContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setFile(null);
    setExtractedDirective(null);
    setPreviewContent('');
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 px-6 py-4 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/50 border border-blue-400/40 flex items-center justify-center text-amber-300 shadow-inner">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-wide">
                  Tải Lên Văn Bản Chỉ Đạo Đến (Word / PDF)
                </h3>
                <span className="text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                  <Cpu className="w-3 h-3" />
                  Tiêu tốn 0 Quota AI
                </span>
              </div>
              <p className="text-xs text-blue-200 mt-0.5">
                Thuật toán trích xuất cục bộ: bóc tách chữ thô, số hiệu, ngày ban hành và lưu trữ trực tiếp vào hệ thống
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5 text-sm text-slate-700">
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-start gap-2.5 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Lỗi xử lý tệp văn bản:</p>
                <p>{error}</p>
              </div>
            </div>
          )}

          {/* Upload Area when no file extracted yet */}
          {!extractedDirective && (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition flex flex-col items-center justify-center gap-3 ${
                isDragging 
                  ? 'border-blue-500 bg-blue-50/60 scale-[0.99]' 
                  : 'border-slate-300 hover:border-blue-500 hover:bg-slate-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".docx,.pdf,.doc,.txt"
                onChange={handleFileInputChange}
                className="hidden"
              />
              <div className="w-16 h-16 rounded-2xl bg-blue-100/80 text-blue-700 flex items-center justify-center shadow-sm">
                {uploading ? (
                  <RefreshCw className="w-8 h-8 animate-spin" />
                ) : (
                  <Upload className="w-8 h-8" />
                )}
              </div>
              <div>
                <p className="text-base font-bold text-slate-800">
                  {uploading ? 'Đang đọc và trích xuất nội dung văn bản...' : 'Kéo thả tệp vào đây hoặc bấm để chọn tệp'}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Hỗ trợ định dạng: <span className="font-semibold text-slate-700">Microsoft Word (.docx)</span>, <span className="font-semibold text-slate-700">PDF (.pdf)</span>, hoặc <span className="font-semibold text-slate-700">Văn bản (.txt)</span>
                </p>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-[11px] font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                <span>Toàn bộ quá trình bóc tách chạy bằng code máy chủ — Không tốn hạn mức Gemini Quota của Thầy!</span>
              </div>
            </div>
          )}

          {/* Extracted Details & Editing */}
          {extractedDirective && (
            <div className="space-y-4">
              {/* Top Banner Success */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-emerald-800 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Đã đọc thành công tệp <strong>{file?.name}</strong> ({extractedDirective.fileSize}) — Trích xuất được <strong>{previewContent.length.toLocaleString('vi-VN')} ký tự</strong>.
                  </span>
                </div>
                <button
                  onClick={handleReset}
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  Chọn tệp khác
                </button>
              </div>

              {/* Form Metadata Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Số hiệu văn bản (Tự động nhận diện):
                  </label>
                  <input
                    type="text"
                    value={docNumber}
                    onChange={(e) => setDocNumber(e.target.value)}
                    placeholder="VD: Số: 3635/SGDĐT-GDPT"
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ngày ban hành:
                  </label>
                  <input
                    type="text"
                    value={signDate}
                    onChange={(e) => setSignDate(e.target.value)}
                    placeholder="VD: Đồng Tháp, ngày 15 tháng 9 năm 2026"
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Trích yếu nội dung / Tên văn bản chỉ đạo:
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="VD: Hướng dẫn sử dụng hồ sơ, sổ sách điện tử tại các cơ sở giáo dục phổ thông"
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Cơ quan ban hành:
                  </label>
                  <input
                    type="text"
                    value={issuingAuthority}
                    onChange={(e) => setIssuingAuthority(e.target.value)}
                    placeholder="SỞ GDĐT TỈNH ĐỒNG THÁP"
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">
                      Danh mục / Chuyên đề:
                    </label>
                    {!isCreatingCategory && (
                      <button
                        type="button"
                        onClick={() => setIsCreatingCategory(true)}
                        className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        + Tạo danh mục mới
                      </button>
                    )}
                  </div>

                  {isCreatingCategory ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={newCatInput}
                        onChange={(e) => setNewCatInput(e.target.value)}
                        placeholder="Nhập tên danh mục mới..."
                        className="flex-1 px-2.5 py-1.5 text-xs bg-white border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={handleCreateCategoryQuick}
                        disabled={savingCategory || !newCatInput.trim()}
                        className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold shrink-0"
                      >
                        {savingCategory ? 'Lưu...' : 'Lưu & Chọn'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsCreatingCategory(false);
                          setNewCatInput('');
                        }}
                        className="px-2 py-1.5 border border-slate-300 text-slate-600 hover:bg-slate-100 rounded-lg text-xs shrink-0"
                      >
                        Hủy
                      </button>
                    </div>
                  ) : (
                    <select
                      value={topic}
                      onChange={(e) => {
                        if (e.target.value === '__NEW__') {
                          setIsCreatingCategory(true);
                        } else {
                          setTopic(e.target.value);
                        }
                      }}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    >
                      {categories.filter(c => c.id !== 'all').map((c) => (
                        <option key={c.id} value={c.name}>{c.label}</option>
                      ))}
                      <option value="__NEW__">+ Tạo danh mục mới...</option>
                    </select>
                  )}
                </div>
              </div>

              {/* Text Preview Box */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    <span>Nội dung văn bản đã bóc tách (Xem trước):</span>
                  </label>
                  <button
                    onClick={handleCopyText}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Đã sao chép' : 'Sao chép nội dung'}</span>
                  </button>
                </div>
                <div className="h-44 overflow-y-auto bg-slate-900 text-slate-200 p-3.5 rounded-xl text-xs font-mono border border-slate-800 whitespace-pre-wrap leading-relaxed select-text">
                  {previewContent.slice(0, 3000)}
                  {previewContent.length > 3000 && (
                    <span className="text-amber-400 font-sans italic block mt-2">
                      ... (Văn bản còn { (previewContent.length - 3000).toLocaleString('vi-VN') } ký tự tiếp theo đã được trích xuất an toàn)
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-wrap justify-between items-center gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-xl transition"
          >
            Đóng
          </button>

          {extractedDirective && (
            <div className="flex items-center gap-2.5">
              <button
                onClick={handleSaveToDirectives}
                className="px-4 py-2 text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl shadow-sm transition flex items-center gap-1.5"
              >
                <FolderPlus className="w-4 h-4 text-blue-600" />
                <span>1. Lưu vào Kho Chỉ Đạo Sở</span>
              </button>

              <button
                onClick={handleContextualizeAndDraft}
                className="px-5 py-2 text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-md transition flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>2. Tạo Kế Hoạch Của Trường Ngay</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
