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
  FileCheck
} from 'lucide-react';
import { SchoolDocument } from '../types/document';
import { exportDocumentToDocx } from '../utils/docxExport';

interface DocumentEditorViewProps {
  document: SchoolDocument;
  onUpdateDocument: (doc: SchoolDocument) => void;
  onSaveToArchive: (doc: SchoolDocument) => void;
  onBack?: () => void;
  onViewSourceDirective?: (directiveTitle: string, fullContent?: string) => void;
}

export const DocumentEditorView: React.FC<DocumentEditorViewProps> = ({
  document: initialDoc,
  onUpdateDocument,
  onSaveToArchive,
  onBack,
  onViewSourceDirective,
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
            <p className="text-xs text-slate-600 truncate max-w-lg mt-0.5">
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
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
              isEditing 
                ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Đang chỉnh sửa' : 'Chỉnh sửa'}</span>
          </button>

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

          {/* Save to Archive */}
          <button
            onClick={handleSave}
            className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-medium flex items-center gap-1.5 transition"
          >
            {savedSuccess ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Save className="w-3.5 h-3.5" />}
            <span>{savedSuccess ? 'Đã lưu' : 'Lưu vào Kho'}</span>
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

      {/* A4 Paper Document Canvas - Strict Decree 30/2020/NĐ-CP Typography */}
      <div className="bg-slate-200/70 p-4 sm:p-8 rounded-xl flex justify-center overflow-x-auto print:bg-white print:p-0">
        <div 
          className="bg-white text-slate-900 shadow-md print:shadow-none w-full max-w-[850px] min-h-[1130px] p-8 sm:p-14 text-[14pt] leading-[1.35] transition-all"
          style={{
            fontFamily: '"Times New Roman", Times, serif',
            lineHeight: '1.35',
          }}
        >
          {/* Header 2-column table conforming to Decree 30 and School Sample */}
          <div className="grid grid-cols-12 gap-4 pb-2 items-start">
            {/* Left Header: Cơ quan ban hành (Font 13pt) */}
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

              {/* Gạch chân dưới ĐỐC BINH KIỀU: dài 1/3 đến 1/2 dòng chữ */}
              <div className="w-20 border-b-2 border-slate-900 mt-1 mb-2"></div>

              {/* Số, ký hiệu: Font 13, chữ thường, đứng */}
              {isEditing ? (
                <input
                  type="text"
                  value={doc.documentNumber}
                  onChange={(e) => setDoc({ ...doc, documentNumber: e.target.value })}
                  className="text-[13pt] text-center font-normal border border-slate-300 rounded px-2 py-0.5 w-full"
                />
              ) : (
                <span className="text-[13pt] font-normal">
                  {doc.documentNumber || 'Số:    /KH-THCS&THPTĐBK'}
                </span>
              )}
            </div>

            {/* Right Header: Quốc hiệu, Tiêu ngữ, Địa danh & Ngày tháng (Font 13 & 14pt) */}
            <div className="col-span-7 text-center flex flex-col items-center">
              {/* CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM: Font 13, in hoa, đứng, ĐẬM */}
              <strong className="text-[13pt] font-bold uppercase tracking-tight">
                CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
              </strong>

              {/* Độc lập - Tự do - Hạnh phúc: Font 14, in thường, đứng, ĐẬM */}
              <div className="inline-block mt-0.5">
                <strong className="text-[14pt] font-bold">
                  Độc lập - Tự do - Hạnh phúc
                </strong>
                {/* Gạch chân dưới Tiêu ngữ: dài bằng 100% dòng chữ */}
                <div className="w-full border-b-2 border-slate-900 mt-0.5"></div>
              </div>

              {/* Địa danh và ngày tháng năm: Font 13.5-14pt, chữ thường, NGHIÊNG */}
              {isEditing ? (
                <input
                  type="text"
                  value={doc.signDate}
                  onChange={(e) => setDoc({ ...doc, signDate: e.target.value })}
                  className="text-[13.5pt] italic text-right border border-slate-300 rounded px-2 py-0.5 mt-2 w-full"
                />
              ) : (
                <span className="text-[13.5pt] italic self-end pr-2 mt-2">
                  {doc.signDate || 'Đồng Tháp, ngày 28 tháng 9 năm 2026'}
                </span>
              )}
            </div>
          </div>

          {/* Document Title & Subtitle */}
          <div className="text-center my-6">
            {isEditing ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={doc.title}
                  onChange={(e) => setDoc({ ...doc, title: e.target.value })}
                  className="text-[15pt] font-bold text-center uppercase w-full border border-slate-300 rounded p-1"
                />
                <input
                  type="text"
                  value={doc.subTitle || ''}
                  onChange={(e) => setDoc({ ...doc, subTitle: e.target.value })}
                  placeholder="Trích yếu nội dung (VD: Tổ chức dạy học 2 buổi/ngày năm học 2026 - 2027)"
                  className="text-[14pt] font-bold text-center w-full border border-slate-300 rounded p-1"
                />
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
                    {/* Gạch chân dưới trích yếu: dài 1/3 dòng chữ */}
                    <div className="w-36 border-b-2 border-slate-900 mx-auto mt-1"></div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Legal Bases: Indented 1.27cm, font 14pt, text-justify */}
          {doc.legalBases && doc.legalBases.length > 0 && (
            <div className="space-y-1.5 mb-5 text-justify">
              {doc.legalBases.map((base, idx) => {
                const fullText = base.startsWith('Căn cứ') ? base : `Căn cứ ${base}`;
                const isLast = idx === doc.legalBases.length - 1;
                // Nghị định 30: các căn cứ kết thúc bằng dấu chấm phẩy (;), căn cứ cuối cùng kết thúc bằng dấu chấm (.)
                let formattedText = fullText;
                if (isLast) {
                  if (!formattedText.endsWith('.')) formattedText = formattedText.replace(/;$/, '') + '.';
                } else {
                  if (!formattedText.endsWith(';')) formattedText = formattedText.replace(/\.$/, '') + ';';
                }

                return (
                  <p key={idx} className="indent-[1.27cm] text-[14pt] leading-[1.35] text-slate-900 italic">
                    {formattedText}
                  </p>
                );
              })}
            </div>
          )}

          {/* Transition phrase if plan */}
          {doc.type === 'plan' && (
            <p className="indent-[1.27cm] text-[14pt] leading-[1.35] text-slate-900 mb-4 font-normal text-justify">
              Trường THCS và THPT Đốc Binh Kiều xây dựng {doc.subTitle || doc.title} như sau:
            </p>
          )}

          {/* Sections Body: Roman Numeral Headings, Numbered items, Indent 1.27cm */}
          <div className="space-y-5 text-justify">
            {doc.sections.map((section, sIdx) => (
              <div key={sIdx} className="space-y-2">
                {isEditing ? (
                  <input
                    type="text"
                    value={section.heading}
                    onChange={(e) => {
                      const newSections = [...doc.sections];
                      newSections[sIdx].heading = e.target.value;
                      setDoc({ ...doc, sections: newSections });
                    }}
                    className="font-bold text-[14pt] uppercase border border-slate-300 rounded px-2 py-1 w-full"
                  />
                ) : (
                  <h2 className="font-bold text-[14pt] uppercase tracking-normal text-slate-950 mt-4 mb-2">
                    {section.heading}
                  </h2>
                )}

                {isEditing ? (
                  <textarea
                    value={section.content}
                    onChange={(e) => {
                      const newSections = [...doc.sections];
                      newSections[sIdx].content = e.target.value;
                      setDoc({ ...doc, sections: newSections });
                    }}
                    rows={10}
                    className="w-full text-[13.5pt] border border-slate-300 rounded p-2 font-mono leading-relaxed"
                  />
                ) : (
                  <div className="space-y-2">
                    {section.content.split('\n').map((paragraph, pIdx) => {
                      const trimmed = paragraph.trim();
                      if (!trimmed) return <div key={pIdx} className="h-1.5" />;
                      
                      const isBullet = trimmed.startsWith('-') || trimmed.startsWith('+');
                      const isNumberHeader = /^\d+(\.\d+)*\./.test(trimmed);
                      const isLetterHeader = /^[a-z]\)/i.test(trimmed);

                      return (
                        <p
                          key={pIdx}
                          className={`${
                            isBullet ? 'pl-[1.27cm]' : 'indent-[1.27cm]'
                          } ${
                            isNumberHeader && !trimmed.includes(':') 
                              ? 'font-bold text-slate-950' 
                              : isLetterHeader 
                              ? 'font-semibold text-slate-900' 
                              : 'text-slate-900'
                          } text-[14pt] leading-[1.35] text-justify`}
                        >
                          {trimmed}
                        </p>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Footer: Recipients (Left 11-12pt) & Signer (Right 13-14pt bold) */}
          <div className="grid grid-cols-12 gap-4 mt-12 pt-4 items-start border-t border-slate-200">
            {/* Left: Nơi nhận */}
            <div className="col-span-6 text-left">
              <strong className="text-[12pt] font-bold italic block mb-1">
                Nơi nhận:
              </strong>
              {isEditing ? (
                <textarea
                  value={doc.recipients.join('\n')}
                  onChange={(e) => setDoc({ ...doc, recipients: e.target.value.split('\n') })}
                  rows={6}
                  className="w-full text-[11pt] border border-slate-300 rounded p-1"
                />
              ) : (
                <div className="space-y-0.5 text-[11pt] leading-tight text-slate-800">
                  {doc.recipients.map((rec, rIdx) => (
                    <span key={rIdx} className="block">
                      {rec.startsWith('-') ? rec : `- ${rec}`}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Chức vụ & Họ tên người ký */}
            <div className="col-span-6 text-center flex flex-col items-center justify-between min-h-[170px]">
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

              {/* Space for physical signature / seal (40-50px) */}
              <div className="my-6 text-xs text-slate-300 select-none print:my-12">
                (Ký, ghi rõ họ tên và đóng dấu)
              </div>

              <strong className="text-[14pt] font-bold tracking-tight text-slate-950">
                {doc.signerName}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Source Directive View Modal */}
      {showSourceModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-amber-50 border-b border-amber-200 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-800" />
                <h3 className="font-bold text-amber-950 text-base">
                  Văn Bản Chỉ Đạo Gốc Của Sở GDĐT Đồng Tháp
                </h3>
              </div>
              <button
                onClick={() => setShowSourceModal(false)}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-amber-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase">Căn cứ nguồn:</span>
                <p className="font-semibold text-slate-900 mt-1">{doc.sourceDirective}</p>
              </div>

              {doc.sourceDirectiveFullText ? (
                <div>
                  <h4 className="font-bold text-slate-800 mb-2">Toàn văn văn bản của Sở được lưu trong hệ thống:</h4>
                  <div className="p-4 bg-amber-50/40 rounded-xl border border-amber-200 font-mono text-xs whitespace-pre-wrap leading-relaxed text-slate-800">
                    {doc.sourceDirectiveFullText}
                  </div>
                </div>
              ) : (
                <p className="text-slate-500 italic">
                  Văn bản này được liên kết thông qua số hiệu văn bản của Sở GDĐT Đồng Tháp. Thầy có thể mở tab "3. Chỉ Đạo Của Sở" để xem chi tiết hoặc tải thêm văn bản mới.
                </p>
              )}
            </div>

            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setShowSourceModal(false)}
                className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold shadow"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
