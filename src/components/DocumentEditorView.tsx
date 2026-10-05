import React, { useState } from 'react';
import { 
  Download, 
  Printer, 
  Copy, 
  Check, 
  Save, 
  Edit3, 
  FileText, 
  Building2, 
  Calendar, 
  Sparkles, 
  ChevronLeft, 
  ExternalLink, 
  BookOpen, 
  X, 
  FileCheck,
  RotateCcw
} from 'lucide-react';
import { SchoolDocument } from '../types/document';
import { exportDocumentToDocx } from '../utils/docxExport';
import { AdministrativeDirectiveViewerModal } from './AdministrativeDirectiveViewerModal';

/**
 * Auto-expanding seamless textarea that inherits Times New Roman,
 * with no boxy borders and auto-resizing height as the user types.
 */
const AutoExpandingTextarea: React.FC<{
  value: string;
  onChange: (val: string) => void;
  className?: string;
  style?: React.CSSProperties;
  placeholder?: string;
}> = ({ value, onChange, className = '', style, placeholder }) => {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const resize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  React.useEffect(() => {
    resize();
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => {
        onChange(e.target.value);
        resize();
      }}
      placeholder={placeholder}
      rows={1}
      style={{
        fontFamily: '"Times New Roman", Times, serif',
        ...style,
      }}
      className={`w-full resize-none overflow-hidden bg-transparent border-0 outline-none p-0 m-0 transition-colors ${className}`}
    />
  );
};

interface DocumentEditorViewProps {
  document: SchoolDocument;
  onUpdateDocument: (doc: SchoolDocument) => void;
  onSaveToArchive: (doc: SchoolDocument) => void;
  onBack?: () => void;
  onViewSourceDirective?: (directiveTitle: string, fullContent?: string) => void;
  onResetToDefault?: (docId: string) => void;
}

export const DocumentEditorView: React.FC<DocumentEditorViewProps> = ({
  document: initialDoc,
  onUpdateDocument,
  onSaveToArchive,
  onBack,
  onViewSourceDirective,
  onResetToDefault,
}) => {
  const [doc, setDoc] = useState<SchoolDocument>(initialDoc);
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showSourceModal, setShowSourceModal] = useState(false);

  // Sync when initialDoc changes
  React.useEffect(() => {
    setDoc(initialDoc);
  }, [initialDoc]);

  // Handle Save
  const handleSave = () => {
    onUpdateDocument(doc);
    onSaveToArchive(doc);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  // Handle Copy full text for pasting into iDesk / VnResource
  const handleCopyText = async () => {
    try {
      let fullText = `${doc.issuingAuthorityTop || 'SỞ GDĐT TỈNH ĐỒNG THÁP'}\n${doc.issuingAuthority}\n${doc.documentNumber}\n\n`;
      fullText += `CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM\nĐộc lập - Tự do - Hạnh phúc\n${doc.signDate}\n\n`;
      fullText += `${doc.title.toUpperCase()}\n`;
      if (doc.subTitle) fullText += `${doc.subTitle}\n\n`;

      if (doc.legalBases?.length) {
        fullText += doc.legalBases.map(b => b.startsWith('Căn cứ') ? `${b}.` : `Căn cứ ${b}.`).join('\n') + '\n\n';
      }

      doc.sections.forEach(sec => {
        fullText += `${sec.heading}\n${sec.content}\n\n`;
      });

      fullText += `Nơi nhận:\n${doc.recipients.map(r => r.startsWith('-') ? r : `- ${r}`).join('\n')}\n\n`;
      fullText += `${doc.signerRole}\n\n\n${doc.signerName}`;

      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  // Handle Export Word
  const handleExportWord = async () => {
    try {
      setIsDownloading(true);
      await exportDocumentToDocx(doc);
    } catch (e) {
      console.error('Failed to export word', e);
    } finally {
      setIsDownloading(false);
    }
  };

  // Handle Print
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Top Action Toolbar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3 print:hidden">
        <div className="flex items-center gap-2">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition"
              title="Quay lại"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-slate-900 text-sm font-mono">{doc.documentNumber}</span>
              <span className="text-slate-400">·</span>
              <span className="text-xs text-blue-700 font-semibold">{doc.typeLabel}</span>
              {doc.sourceDirective && (
                <>
                  <span className="text-slate-400">·</span>
                  <span className="text-xs text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200 font-medium">
                    Cụ thể hóa từ: {doc.sourceDirective}
                  </span>
                </>
              )}
            </div>
            <p className="text-xs text-slate-600 truncate max-w-lg mt-0.5 font-medium">
              {doc.subTitle ? `${doc.title} - ${doc.subTitle}` : doc.title}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* View Source Directive of So GDDT if available */}
          {doc.sourceDirective && (
            <button
              onClick={() => {
                if (onViewSourceDirective) {
                  onViewSourceDirective(doc.sourceDirective || '', doc.sourceDirectiveFullText);
                } else {
                  setShowSourceModal(true);
                }
              }}
              className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-semibold flex items-center gap-1.5 transition"
              title="Xem văn bản chỉ đạo gốc của Sở GDĐT để đối chiếu"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-700" />
              <span>Xem văn bản gốc của Sở</span>
            </button>
          )}

          {/* Toggle Edit mode */}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow-2xs ${
              isEditing 
                ? 'bg-amber-500 text-white' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Đang sửa trên Word' : 'Chỉnh sửa'}</span>
          </button>

          {/* Reset to default template if needed */}
          {onResetToDefault && (
            <button
              onClick={() => {
                if (window.confirm(`Thầy có chắc chắn muốn khôi phục văn bản "${doc.title}" về bản mẫu gốc ban đầu không?\n\nLưu ý: Mọi chỉnh sửa của Thầy trên văn bản này sẽ được hoàn tác về bản mẫu gốc.`)) {
                  onResetToDefault(doc.id);
                }
              }}
              className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 text-xs font-medium flex items-center gap-1.5 transition"
              title="Khôi phục lại bản mẫu gốc ban đầu"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Khôi phục mẫu gốc</span>
            </button>
          )}

          {/* Copy Text */}
          <button
            onClick={handleCopyText}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition"
            title="Sao chép toàn văn để dán vào iDesk / VnResource"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Đã sao chép' : 'Sao chép'}</span>
          </button>

          {/* Print / PDF */}
          <button
            onClick={handlePrint}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition"
            title="In trực tiếp hoặc Lưu dạng file PDF chuẩn A4"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>In / PDF</span>
          </button>

          {/* Save permanently to Server & Archive */}
          <button
            onClick={handleSave}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow-2xs ${
              savedSuccess
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300'
            }`}
            title="Lưu vĩnh viễn văn bản vào hệ thống máy chủ và trình duyệt"
          >
            {savedSuccess ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            <span>{savedSuccess ? 'Đã lưu vĩnh viễn!' : 'Lưu văn bản'}</span>
          </button>

          {/* Download Word DOCX */}
          <button
            onClick={handleExportWord}
            disabled={isDownloading}
            className="px-4 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isDownloading ? 'Đang xuất...' : 'Tải file Word (.docx)'}</span>
          </button>
        </div>
      </div>

      {/* Editing Mode Banner Guide */}
      {isEditing && (
        <div className="bg-amber-50 border border-amber-200 text-amber-950 rounded-xl px-4 py-2.5 flex items-center justify-between gap-3 text-xs shadow-2xs print:hidden animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>Chế độ chỉnh sửa tự nhiên như Microsoft Word:</strong> Thầy chỉ cần nhấp chuột trực tiếp vào bất kỳ dòng chữ nào trên trang để sửa. Font chữ luôn là <strong>Times New Roman 14pt</strong>, căn lề và thụt đầu dòng tự nhiên, không có khung viền hộp gò bó. Chỉnh sửa xong, Thầy bấm nút <strong>"Lưu văn bản"</strong> ở trên!
            </span>
          </div>
          <button
            onClick={() => setIsEditing(false)}
            className="px-3 py-1 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 rounded font-semibold shrink-0 transition"
          >
            Hoàn tất xem trước
          </button>
        </div>
      )}

      {/* A4 Paper Document Canvas - Strict Decree 30/2020/NĐ-CP Typography */}
      <div className="bg-slate-200/70 p-4 sm:p-8 rounded-xl flex justify-center overflow-x-auto print:bg-white print:p-0">
        <style dangerouslySetInnerHTML={{ __html: `
          @page {
            size: A4 portrait;
            margin-top: 2cm;
            margin-bottom: 2cm;
            margin-left: 3cm;
            margin-right: 2cm;
          }
          @media print {
            body { background: white !important; }
            .print\\:hidden { display: none !important; }
          }
        ` }} />

        <div 
          className="bg-white text-slate-900 shadow-md print:shadow-none w-full max-w-[850px] min-h-[1130px] text-[14pt] leading-[1.4] transition-all"
          style={{
            fontFamily: '"Times New Roman", Times, serif',
            lineHeight: '1.4',
            paddingTop: '2cm',
            paddingBottom: '2cm',
            paddingLeft: '3cm',
            paddingRight: '2cm',
            boxSizing: 'border-box',
          }}
        >
          {/* Header 2-column table conforming to Decree 30 and School Sample */}
          <div className="grid grid-cols-12 gap-x-4 gap-y-2 pb-2 items-start">
            {/* Hàng 1 - Trái: Cơ quan ban hành (Font 13pt) */}
            <div className="col-span-5 text-center flex flex-col items-center">
              {/* Sở GDĐT Đồng Tháp: Font 13, chữ đứng, in hoa, không đậm */}
              <span className="text-[13pt] font-normal uppercase tracking-tight">
                {doc.issuingAuthorityTop || 'SỞ GIÁO DỤC VÀ ĐÀO TẠO ĐỒNG THÁP'}
              </span>

              {/* Trường THCS và THPT: Font 13, chữ đứng, in hoa, ĐẬM */}
              <strong className="text-[13pt] font-bold uppercase tracking-tight mt-0.5">
                TRƯỜNG THCS VÀ THPT
              </strong>

              {/* ĐỐC BINH KIỀU: Font 13, in hoa, ĐẬM */}
              <strong className="text-[13pt] font-bold uppercase tracking-tight">
                ĐỐC BINH KIỀU
              </strong>

              {/* Gạch chân dưới ĐỐC BINH KIỀU: dài 1/3 đến 1/2 dòng chữ, cách hở không đè dấu nặng */}
              <div className="w-20 border-b-2 border-slate-900 mt-1.5 mb-1"></div>
            </div>

            {/* Hàng 1 - Phải: Quốc hiệu, Tiêu ngữ (Font 12.5 & 14pt) */}
            <div className="col-span-7 text-center flex flex-col items-center">
              {/* CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM: Font 12.5, in hoa, đứng, ĐẬM, không ngắt dòng */}
              <strong className="text-[12.5pt] font-bold uppercase tracking-tight whitespace-nowrap">
                CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
              </strong>

              {/* Độc lập - Tự do - Hạnh phúc: Font 14, in thường, đứng, ĐẬM */}
              <div className="inline-block mt-0.5">
                <strong className="text-[14pt] font-bold">
                  Độc lập - Tự do - Hạnh phúc
                </strong>
                {/* Gạch chân dưới Tiêu ngữ: dài bằng 100% dòng chữ, cách hở không đè dấu nặng */}
                <div className="w-full border-b-2 border-slate-900 mt-1.5 mb-1"></div>
              </div>
            </div>

            {/* Hàng 2 - Trái: Số, ký hiệu (CÙNG HÀNG NGANG BẰNG VỚI NGÀY THÁNG NĂM) */}
            <div className="col-span-5 text-center flex flex-col items-center justify-center">
              {isEditing ? (
                <input
                  type="text"
                  value={doc.documentNumber}
                  onChange={(e) => setDoc({ ...doc, documentNumber: e.target.value })}
                  style={{ fontFamily: '"Times New Roman", Times, serif' }}
                  className="text-[13pt] text-center font-normal bg-transparent border-0 border-b border-dashed border-slate-300 focus:border-blue-500 focus:bg-blue-50/20 outline-none px-1 py-0.5 w-full transition"
                  placeholder="Số:    /KH-THCS&THPTĐBK"
                />
              ) : (
                <span className="text-[13pt] font-normal">
                  {doc.documentNumber || 'Số:    /KH-THCS&THPTĐBK'}
                </span>
              )}
            </div>

            {/* Hàng 2 - Phải: Địa danh và ngày tháng năm (CÙNG HÀNG NGANG BẰNG VỚI SỐ KÝ HIỆU, CANH GIỮA) */}
            <div className="col-span-7 text-center flex flex-col items-center justify-center">
              {isEditing ? (
                <input
                  type="text"
                  value={doc.signDate}
                  onChange={(e) => setDoc({ ...doc, signDate: e.target.value })}
                  style={{ fontFamily: '"Times New Roman", Times, serif' }}
                  className="text-[13.5pt] italic text-center bg-transparent border-0 border-b border-dashed border-slate-300 focus:border-blue-500 focus:bg-blue-50/20 outline-none px-1 py-0.5 w-full transition"
                  placeholder="Đồng Tháp, ngày... tháng... năm..."
                />
              ) : (
                <span className="text-[13.5pt] italic text-center block">
                  {doc.signDate || 'Đồng Tháp, ngày 28 tháng 9 năm 2026'}
                </span>
              )}
            </div>
          </div>

          {/* Document Title & Subtitle */}
          <div className="text-center my-6">
            {isEditing ? (
              <div className="space-y-1">
                <input
                  type="text"
                  value={doc.title}
                  onChange={(e) => setDoc({ ...doc, title: e.target.value })}
                  style={{ fontFamily: '"Times New Roman", Times, serif' }}
                  className="text-[15pt] sm:text-[16pt] font-bold text-center uppercase tracking-wide w-full bg-transparent border-0 border-b border-dashed border-slate-300 focus:border-blue-500 focus:bg-blue-50/20 outline-none py-0.5 transition"
                />
                <div className="mt-1">
                  <input
                    type="text"
                    value={doc.subTitle || ''}
                    onChange={(e) => setDoc({ ...doc, subTitle: e.target.value })}
                    placeholder="Trích yếu nội dung..."
                    style={{ fontFamily: '"Times New Roman", Times, serif' }}
                    className="text-[14pt] font-bold text-center w-full bg-transparent border-0 border-b border-dashed border-slate-300 focus:border-blue-500 focus:bg-blue-50/20 outline-none py-0.5 transition"
                  />
                  <div className="w-36 border-b-2 border-slate-900 mx-auto mt-1.5"></div>
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-[15pt] sm:text-[16pt] font-bold uppercase tracking-wide">
                  {doc.title}
                </h1>
                {doc.subTitle && (
                  <div className="mt-1">
                    <span className="text-[14pt] font-bold inline-block">
                      {doc.subTitle}
                    </span>
                    {/* Gạch chân dưới trích yếu: dài 1/3 dòng chữ, cách hở không đè dấu nặng */}
                    <div className="w-36 border-b-2 border-slate-900 mx-auto mt-1.5"></div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Legal Bases: Indented 1.0cm, font 14pt regular (chữ thường đứng, không in nghiêng), text-justify */}
          {isEditing ? (
            <div className="space-y-1.5 mb-2 text-justify">
              {doc.legalBases?.map((base, idx) => (
                <div key={idx} className="group relative flex items-start">
                  <AutoExpandingTextarea
                    value={base.startsWith('Căn cứ') ? base : `Căn cứ ${base}`}
                    onChange={(val) => {
                      const newBases = [...(doc.legalBases || [])];
                      newBases[idx] = val;
                      setDoc({ ...doc, legalBases: newBases });
                    }}
                    className="indent-[1cm] text-[14pt] leading-[1.4] text-slate-900 font-normal not-italic text-justify hover:bg-blue-50/15 focus:bg-blue-50/25 rounded-xs"
                    placeholder="Nhập căn cứ pháp lý..."
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newBases = (doc.legalBases || []).filter((_, i) => i !== idx);
                      setDoc({ ...doc, legalBases: newBases });
                    }}
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 text-xs p-1 ml-1 transition"
                    title="Xóa căn cứ này"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  setDoc({
                    ...doc,
                    legalBases: [...(doc.legalBases || []), 'Căn cứ '],
                  });
                }}
                className="text-xs text-blue-700 hover:text-blue-900 font-medium flex items-center gap-1 mt-1 pl-4 transition"
              >
                + Thêm căn cứ mới
              </button>
            </div>
          ) : (
            doc.legalBases && doc.legalBases.length > 0 && (
              <div className="space-y-1.5 mb-2 text-justify">
                {doc.legalBases.map((base, idx) => {
                  const fullText = base.startsWith('Căn cứ') ? base : `Căn cứ ${base}`;
                  const isLast = idx === doc.legalBases.length - 1;
                  let formattedText = fullText;
                  if (isLast) {
                    if (!formattedText.endsWith('.')) formattedText = formattedText.replace(/;$/, '') + '.';
                  } else {
                    if (!formattedText.endsWith(';')) formattedText = formattedText.replace(/\.$/, '') + ';';
                  }

                  return (
                    <p key={idx} className="indent-[1cm] text-[14pt] leading-[1.4] text-slate-900 font-normal not-italic text-justify">
                      {formattedText}
                    </p>
                  );
                })}
              </div>
            )
          )}

          {/* Transition phrase if plan */}
          {doc.type === 'plan' && (
            <p className="indent-[1cm] text-[14pt] leading-[1.4] text-slate-900 mb-3 font-normal text-justify">
              Nay Trường THCS và THPT Đốc Binh Kiều xây dựng {doc.subTitle ? (doc.subTitle.toLowerCase().startsWith('kế hoạch') ? doc.subTitle : `Kế hoạch ${doc.subTitle.toLowerCase()}`) : (doc.title.toLowerCase().startsWith('kế hoạch') ? doc.title : `Kế hoạch ${doc.title.toLowerCase()}`)} như sau:
            </p>
          )}

          {/* Sections Body: Roman Numeral Headings, Numbered items, Indent 1.0cm */}
          <div className="space-y-3 text-justify">
            {doc.sections.map((section, sIdx) => (
              <div key={sIdx} className="space-y-1">
                {isEditing ? (
                  <div className="group relative">
                    <input
                      type="text"
                      value={section.heading}
                      onChange={(e) => {
                        const newSections = [...doc.sections];
                        newSections[sIdx].heading = e.target.value;
                        setDoc({ ...doc, sections: newSections });
                      }}
                      style={{ fontFamily: '"Times New Roman", Times, serif', textIndent: '1cm' }}
                      className="font-bold text-[14pt] uppercase tracking-normal text-slate-950 my-[6pt] indent-[1cm] pl-0 w-full bg-transparent border-0 border-b border-dashed border-transparent hover:border-slate-300 focus:border-blue-400 focus:bg-blue-50/20 outline-none transition"
                    />
                  </div>
                ) : (
                  <h2 className="font-bold text-[14pt] uppercase tracking-normal text-slate-950 my-[6pt] indent-[1cm] pl-0 text-justify">
                    {section.heading}
                  </h2>
                )}

                {isEditing ? (
                  <AutoExpandingTextarea
                    value={section.content}
                    onChange={(val) => {
                      const newSections = [...doc.sections];
                      newSections[sIdx].content = val;
                      setDoc({ ...doc, sections: newSections });
                    }}
                    className="text-[14pt] leading-[1.4] text-justify text-slate-900 font-normal hover:bg-blue-50/10 focus:bg-blue-50/20 rounded-xs p-1"
                    placeholder="Nhập nội dung cho phần này..."
                  />
                ) : (
                  <div className="space-y-2">
                    {section.content.split('\n').map((paragraph, pIdx) => {
                      const trimmed = paragraph.trim();
                      if (!trimmed) return <div key={pIdx} className="h-1.5" />;
                      
                      // 1. Dấu cộng cấp 2 (sub-bullet): + ... (chỉ thụt đầu hàng 1.5cm, từ hàng thứ 2 canh đều lề trái bình thường)
                      if (trimmed.startsWith('+')) {
                        return (
                          <p
                            key={pIdx}
                            className="indent-[1.5cm] pl-0 text-[14pt] leading-[1.4] text-justify text-slate-900 font-normal"
                          >
                            {trimmed}
                          </p>
                        );
                      }

                      // 2. Dấu gạch ngang cấp 1 (bullet): - ... (chỉ thụt đầu hàng 1.0cm, từ hàng thứ 2 canh đều lề trái bình thường)
                      if (trimmed.startsWith('-')) {
                        return (
                          <p
                            key={pIdx}
                            className="indent-[1cm] pl-0 text-[14pt] leading-[1.4] text-justify text-slate-900 font-normal"
                          >
                            {trimmed}
                          </p>
                        );
                      }

                      // 3. Số thứ tự: 1. , 2. , 1.1. (In đậm, thụt 1.0cm, từ hàng thứ 2 canh đều lề trái)
                      const isNumbered = /^\d+(\.\d+)*\./.test(trimmed);
                      if (isNumbered) {
                        return (
                          <p
                            key={pIdx}
                            className="indent-[1cm] pl-0 text-[14pt] leading-[1.4] text-justify text-slate-900 font-bold"
                          >
                            {trimmed}
                          </p>
                        );
                      }

                      // 4. Tiểu mục chữ cái: a), b)... (chữ thường, thụt 1.0cm)
                      const isLetterSub = /^[a-zđ]\)/i.test(trimmed);
                      if (isLetterSub) {
                        return (
                          <p
                            key={pIdx}
                            className="indent-[1cm] pl-0 text-[14pt] leading-[1.4] text-justify text-slate-900 font-normal"
                          >
                            {trimmed}
                          </p>
                        );
                      }

                      // 5. Đoạn văn xuôi thông thường (thụt 1.0cm)
                      return (
                        <p
                          key={pIdx}
                          className="indent-[1cm] pl-0 text-[14pt] leading-[1.4] text-justify text-slate-900 font-normal"
                        >
                          {trimmed}
                        </p>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}

            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
                  const nextRoman = romanNumerals[doc.sections.length] || `${doc.sections.length + 1}`;
                  setDoc({
                    ...doc,
                    sections: [
                      ...doc.sections,
                      { heading: `${nextRoman}. MỤC MỚI`, content: '1. Nội dung chi tiết...' },
                    ],
                  });
                }}
                className="w-full py-2 border-2 border-dashed border-blue-200 hover:border-blue-400 text-blue-700 hover:text-blue-900 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition mt-4"
              >
                + Thêm phần mục La Mã mới
              </button>
            )}
          </div>

          {/* Footer 2-column layout: Nơi nhận (Trái) & Chữ ký (Phải) */}
          <div className="grid grid-cols-12 gap-4 mt-8 pt-4 items-start">
            {/* Left: Nơi nhận (Font 12pt in đậm, nghiêng; các mục con Font 11pt đứng thường) */}
            <div className="col-span-6 text-left">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[12pt] font-bold italic tracking-tight">
                  Nơi nhận:
                </span>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => {
                      setDoc({
                        ...doc,
                        recipients: [
                          'Sở GDĐT Đồng Tháp (để báo cáo);',
                          'Hiệu trưởng (để chỉ đạo);',
                          'Các Phó Hiệu trưởng (để phối hợp);',
                          'Ban Giám hiệu (để chỉ đạo);',
                          'Các tổ chuyên môn, văn phòng (để thực hiện);',
                          'Lưu: VT, CM.',
                        ],
                      });
                    }}
                    className="text-[10.5px] px-2 py-0.5 rounded bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 font-semibold transition"
                    title="Lọc bỏ bớt các nơi nhận ngoài thẩm quyền"
                  >
                    🧹 Chuẩn hóa nơi nhận
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-1.5">
                  <AutoExpandingTextarea
                    value={doc.recipients.join('\n')}
                    onChange={(val) => setDoc({ ...doc, recipients: val.split('\n') })}
                    className="text-[11pt] leading-[1.3] text-slate-800 font-normal hover:bg-blue-50/15 focus:bg-blue-50/25 p-1 rounded-xs"
                    placeholder="Mỗi dòng là một nơi nhận..."
                  />
                  <div className="flex items-center gap-1 flex-wrap text-[10px] text-slate-500">
                    <span className="font-medium text-slate-600">Thêm nhanh:</span>
                    <button
                      type="button"
                      onClick={() => {
                        if (!doc.recipients.some(r => r.includes('Sở GDĐT'))) {
                          setDoc({ ...doc, recipients: ['Sở GDĐT Đồng Tháp (để báo cáo);', ...doc.recipients] });
                        }
                      }}
                      className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                    >
                      + Sở GDĐT
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!doc.recipients.some(r => r.includes('Ban Giám hiệu'))) {
                          setDoc({ ...doc, recipients: [...doc.recipients, 'Ban Giám hiệu (để chỉ đạo);'] });
                        }
                      }}
                      className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                    >
                      + Ban Giám hiệu
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!doc.recipients.some(r => r.includes('chuyên môn'))) {
                          setDoc({ ...doc, recipients: [...doc.recipients, 'Các tổ chuyên môn, văn phòng (để thực hiện);'] });
                        }
                      }}
                      className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                    >
                      + Các tổ chuyên môn
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!doc.recipients.some(r => r.includes('Lưu:'))) {
                          setDoc({ ...doc, recipients: [...doc.recipients, 'Lưu: VT, Tr.'] });
                        }
                      }}
                      className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                    >
                      + Lưu: VT, Tr.
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-0.5 text-[11pt] leading-[1.3] text-slate-800">
                  {doc.recipients.map((rec, rIdx) => (
                    <span key={rIdx} className="block text-[11pt] font-normal">
                      {rec.startsWith('-') ? rec : `- ${rec}`}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Chức vụ & Họ tên người ký */}
            <div className="col-span-6 text-center flex flex-col items-center justify-between min-h-[170px]">
              {isEditing ? (
                <div className="w-full space-y-1">
                  <input
                    type="text"
                    value={doc.signerRole}
                    onChange={(e) => setDoc({ ...doc, signerRole: e.target.value })}
                    style={{ fontFamily: '"Times New Roman", Times, serif' }}
                    className="text-[13pt] font-bold uppercase text-center w-full bg-transparent border-0 border-b border-dashed border-slate-300 focus:border-blue-500 focus:bg-blue-50/20 outline-none py-0.5 transition"
                    placeholder="KT. HIỆU TRƯỞNG / PHÓ HIỆU TRƯỞNG"
                  />
                  <div className="h-24" />
                  <input
                    type="text"
                    value={doc.signerName}
                    onChange={(e) => setDoc({ ...doc, signerName: e.target.value })}
                    style={{ fontFamily: '"Times New Roman", Times, serif' }}
                    className="text-[14pt] font-bold text-center w-full bg-transparent border-0 border-b border-dashed border-slate-300 focus:border-blue-500 focus:bg-blue-50/20 outline-none py-0.5 transition"
                    placeholder="Họ và tên người ký"
                  />
                </div>
              ) : (
                <>
                  <div>
                    {doc.signerRole.split('\n').map((line, idx) => (
                      <strong
                        key={idx}
                        className={`block uppercase font-bold ${
                          idx === 0 && line.includes('KT.') ? 'text-[13pt]' : 'text-[14pt]'
                        }`}
                      >
                        {line}
                      </strong>
                    ))}
                  </div>

                  {/* Space for physical signature / seal: Enter xuống thêm 2 hàng rộng rãi để ký và đóng dấu */}
                  <div className="h-28 print:h-36" />

                  <strong className="text-[14pt] font-bold tracking-tight text-slate-950">
                    {doc.signerName}
                  </strong>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Source Directive View Modal */}
      {showSourceModal && (
        <AdministrativeDirectiveViewerModal
          directive={{
            id: doc.sourceDirectiveId || 'directive-source',
            documentNumber: doc.sourceDirective || 'Văn bản chỉ đạo của Sở GDĐT',
            title: doc.sourceDirective || 'Chỉ đạo của Sở Giáo dục và Đào tạo Đồng Tháp',
            issuingAuthority: 'SỞ GIÁO DỤC VÀ ĐÀO TẠO TỈNH ĐỒNG THÁP',
            signDate: 'Đồng Tháp',
            signer: 'KT. GIÁM ĐỐC - PHÓ GIÁM ĐỐC Nguyễn Phương Toàn',
            summary: doc.sourceDirective || '',
            fullContent: doc.sourceDirectiveFullText || doc.sourceDirective || 'Văn bản liên kết từ chỉ đạo của Sở GDĐT.',
            createdDate: new Date().toISOString(),
          }}
          onClose={() => setShowSourceModal(false)}
          onContextualize={() => setShowSourceModal(false)}
        />
      )}
    </div>
  );
};
