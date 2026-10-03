import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  X, 
  Printer, 
  Copy, 
  Check, 
  Sparkles, 
  Search, 
  ZoomIn, 
  ZoomOut,
  Maximize2,
  Minimize2,
  FileCheck
} from 'lucide-react';
import { DepartmentDirective } from '../types/document';

interface AdministrativeDirectiveViewerModalProps {
  directive: DepartmentDirective;
  onClose: () => void;
  onContextualize: (directive: DepartmentDirective) => void;
}

interface ParsedDocument {
  authorityTop: string;
  authorityMain: string;
  documentNumber: string;
  mottoTop: string;
  mottoSub: string;
  signDate: string;
  titleType: string;
  titleSubject: string;
  kinhGui: string;
  legalBases: string[];
  bodyItems: {
    type: 'heading-roman' | 'heading-article' | 'heading-number' | 'heading-subnumber' | 'bullet' | 'transition' | 'paragraph';
    text: string;
  }[];
  noiNhan: string[];
  signerRole: string;
  signerName: string;
}

export const AdministrativeDirectiveViewerModal: React.FC<AdministrativeDirectiveViewerModalProps> = ({
  directive,
  onClose,
  onContextualize,
}) => {
  const [fontSizePt, setFontSizePt] = useState<number>(14); // 13pt - 18pt
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFullWidth, setIsFullWidth] = useState(false);

  // Copy full content
  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(directive.fullContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      alert('Không thể sao chép văn bản.');
    }
  };

  // Print
  const handlePrint = () => {
    window.print();
  };

  // Comprehensive Decree 30 administrative parser with seamless line joining
  const parsedDoc: ParsedDocument = useMemo(() => {
    // 1. Clean artifacts and normalize whitespace
    let clean = (directive.fullContent || '')
      .replace(/-- \d+ of \d+ --/g, '')
      .replace(/Trang \d+\/\d+/g, '')
      .replace(/Trang \d+/g, '')
      .replace(/\.([A-ZÀÁẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬĐÈÉẺẼẸÊẾỀỂỄỆÌÍỈĨỊÒÓỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÙÚỦŨỤƯỨỪỬỮỰỲÝỶỸỴ])/g, '. $1')
      .replace(/[ \t]+/g, ' ');

    const rawLines = clean.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);

    // Initial metadata defaults
    let authorityTop = '';
    let authorityMain = directive.issuingAuthority || 'SỞ GIÁO DỤC VÀ ĐÀO TẠO TỈNH ĐỒNG THÁP';
    let documentNumber = directive.documentNumber || 'Số: .../SGDĐT';
    let signDate = directive.signDate || 'Đồng Tháp, ngày ... tháng ... năm ...';
    let titleType = '';
    let titleSubject = '';
    let kinhGui = '';
    const legalBases: string[] = [];
    const bodyItems: { type: 'heading-roman' | 'heading-article' | 'heading-number' | 'heading-subnumber' | 'bullet' | 'transition' | 'paragraph'; text: string }[] = [];
    const noiNhan: string[] = [];
    const signerRoleLines: string[] = [];
    let signerName = '';

    // Standard authority mapping
    const upperAuth = authorityMain.toUpperCase();
    if (upperAuth.includes('SỞ GDĐT') || upperAuth.includes('SỞ GIÁO DỤC')) {
      authorityTop = 'UBND TỈNH ĐỒNG THÁP';
      authorityMain = 'SỞ GIÁO DỤC VÀ ĐÀO TẠO';
    } else if (upperAuth.includes('BỘ GIÁO DỤC')) {
      authorityTop = 'CHÍNH PHỦ NƯỚC CHXHCN VIỆT NAM';
      authorityMain = 'BỘ GIÁO DỤC VÀ ĐÀO TẠO';
    } else if (upperAuth.includes('UBND TỈNH')) {
      authorityTop = '';
      authorityMain = 'ỦY BAN NHÂN DÂN TỈNH ĐỒNG THÁP';
    }

    // Signer defaults
    if (directive.signer) {
      if (directive.signer.includes('Nguyễn Phương Toàn')) {
        signerRoleLines.push('KT. GIÁM ĐỐC', 'PHÓ GIÁM ĐỐC');
        signerName = 'Nguyễn Phương Toàn';
      } else if (directive.signer.includes('Huỳnh Minh Tuấn')) {
        signerRoleLines.push('KT. CHỦ TỊCH', 'PHÓ CHỦ TỊCH');
        signerName = 'Huỳnh Minh Tuấn';
      } else if (directive.signer.includes('Phạm Thiện Nghĩa')) {
        signerRoleLines.push('TM. ỦY BAN NHÂN DÂN', 'CHỦ TỊCH');
        signerName = 'Phạm Thiện Nghĩa';
      } else if (directive.signer.includes('Huỳnh Thanh Hùng')) {
        signerRoleLines.push('KT. GIÁM ĐỐC', 'PHÓ GIÁM ĐỐC');
        signerName = 'Huỳnh Thanh Hùng';
      } else if (directive.signer.includes('Lê Thanh Cường')) {
        signerRoleLines.push('HIỆU TRƯỞNG');
        signerName = 'Lê Thanh Cường';
      } else if (directive.signer.includes('Nguyễn Kim Sơn')) {
        signerRoleLines.push('BỘ TRƯỞNG');
        signerName = 'Nguyễn Kim Sơn';
      } else if (directive.signer.includes('Phạm Ngọc Thưởng')) {
        signerRoleLines.push('KT. BỘ TRƯỞNG', 'THỨ TRƯỞNG');
        signerName = 'Phạm Ngọc Thưởng';
      }
    }

    // State machine parser with continuous block accumulation
    let currentItem: {
      type: 'heading-roman' | 'heading-article' | 'heading-number' | 'bullet' | 'transition' | 'paragraph';
      text: string;
    } | null = null;

    let currentLegal = '';
    let stage: 'header' | 'title' | 'legal' | 'body' | 'footer' = 'header';

    const flushCurrentItem = () => {
      if (currentItem && currentItem.text.trim()) {
        bodyItems.push(currentItem);
        currentItem = null;
      }
    };

    const flushLegal = () => {
      if (currentLegal.trim()) {
        legalBases.push(currentLegal.trim());
        currentLegal = '';
      }
    };

    for (let i = 0; i < rawLines.length; i++) {
      const line = rawLines[i];

      // Drop standalone page numbers (e.g. "2", "3", "4" from PDF page headers)
      if (/^[0-9]+$/.test(line)) continue;
      if (/^--\s*[0-9]+\s*of\s*[0-9]+\s*--$/i.test(line)) continue;

      // 1. HEADER STAGE: Skip interleaved raw top lines or capture official numbers
      if (stage === 'header') {
        if (/^Số\s*:\s*[0-9A-Za-z\/\-\.\s]+/i.test(line)) {
          documentNumber = line;
          continue;
        }
        if (/^(Đồng Tháp|Hà Nội),\s*ngày\s+/i.test(line)) {
          signDate = line;
          continue;
        }
        // Công văn / Về việc subject detection
        if (/^(V\/v|Về việc)\s+/i.test(line)) {
          titleType = 'CÔNG VĂN';
          titleSubject = line.replace(/^(V\/v|Về việc)\s*/i, '');
          stage = 'title';
          continue;
        }
        if (/^(KẾ HOẠCH|QUYẾT ĐỊNH|THÔNG TƯ|CÔNG VĂN|HƯỚNG DẪN|THÔNG BÁO)$/i.test(line)) {
          titleType = line.toUpperCase();
          stage = 'title';
          continue;
        }
        // If line is title-like (e.g. "KẾ HOẠCH Triển khai...")
        if (/^(KẾ HOẠCH|QUYẾT ĐỊNH|THÔNG TƯ|CÔNG VĂN|HƯỚNG DẪN|THÔNG BÁO)\s+/i.test(line)) {
          const match = line.match(/^(KẾ HOẠCH|QUYẾT ĐỊNH|THÔNG TƯ|CÔNG VĂN|HƯỚNG DẪN|THÔNG BÁO)\s+(.*)/i);
          if (match) {
            titleType = match[1].toUpperCase();
            titleSubject = match[2];
            stage = 'title';
            continue;
          }
        }
        if (/^Kính gửi\s*:/i.test(line)) {
          stage = 'body';
          kinhGui = line;
          continue;
        }
        if (/^Căn cứ\s+/i.test(line)) {
          stage = 'legal';
          currentLegal = line;
          continue;
        }
        // Skip raw redundant header lines (CỘNG HÒA, Độc lập, UBND...)
        continue;
      }

      // 2. TITLE STAGE: Collect subject lines until Căn cứ / Kính gửi
      if (stage === 'title') {
        if (/^Căn cứ\s+/i.test(line)) {
          stage = 'legal';
          currentLegal = line;
          continue;
        }
        if (/^Kính gửi\s*:/i.test(line)) {
          stage = 'body';
          kinhGui = line;
          continue;
        }
        if (/^(Theo đề nghị|Thực hiện|Nhằm)/i.test(line) || /^(I|II|III)\.\s+/i.test(line)) {
          stage = 'body';
          currentItem = { type: 'paragraph', text: line };
          continue;
        }
        // Accumulate title subject
        titleSubject = titleSubject ? titleSubject + ' ' + line : line;
        continue;
      }

      // 3. LEGAL STAGE: Collect all "Căn cứ..." sentences
      if (stage === 'legal') {
        if (/^Căn cứ\s+/i.test(line)) {
          flushLegal();
          currentLegal = line;
          continue;
        }
        // If continuation of current legal base (not a heading, and previous didn't end with ';')
        if (currentLegal && !/^(I|II|III|IV|V|VI|VII|VIII|IX|X)\.\s+/i.test(line) && !/^(Chương|Điều|[0-9]+\.)/i.test(line) && !/^Theo đề nghị/i.test(line) && !/^Kính gửi/i.test(line)) {
          if (currentLegal.endsWith('-')) {
            currentLegal = currentLegal.slice(0, -1) + line;
          } else {
            currentLegal += ' ' + line;
          }
          if (line.endsWith(';')) {
            flushLegal();
          }
          continue;
        }
        // Legal section finished
        flushLegal();
        stage = 'body';
        // Fall through to body processing
      }

      // 4. BODY & FOOTER STAGE
      if (stage === 'body' || stage === 'footer') {
        // Detect "Nơi nhận:"
        if (/^Nơi nhận\s*:/i.test(line)) {
          flushCurrentItem();
          stage = 'footer';
          continue;
        }

        // If in footer
        if (stage === 'footer') {
          if (/^(KT\.|TM\.|GIÁM ĐỐC|HIỆU TRƯỞNG|CHỦ TỊCH|BỘ TRƯỞNG|PHÓ GIÁM ĐỐC|PHÓ CHỦ TỊCH)/i.test(line)) {
            signerRoleLines.push(line);
            continue;
          }
          if (line.startsWith('-') || line.startsWith('+')) {
            noiNhan.push(line);
            continue;
          }
          // Person's name (ends of document)
          if (/^[A-ZÀÁẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬĐÈÉẺẼẸÊẾỀỂỄỆÌÍỈĨỊÒÓỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÙÚỦŨỤƯỨỪỬỮỰỲÝỶỸỴ][a-zàáảãạăắằẳẵặâấầẩẫậđèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵ\s]+$/.test(line)) {
            if (!signerRoleLines.includes(line)) {
              signerName = line;
            }
            continue;
          }
          if (noiNhan.length > 0 && !noiNhan[noiNhan.length - 1].endsWith(';')) {
            noiNhan[noiNhan.length - 1] += ' ' + line;
            continue;
          }
        }

        // Kính gửi
        if (/^Kính gửi\s*:/i.test(line)) {
          flushCurrentItem();
          kinhGui = line;
          continue;
        }

        // Căn cứ inside body stage
        if (/^Căn cứ\s+/i.test(line)) {
          flushCurrentItem();
          stage = 'legal';
          currentLegal = line;
          continue;
        }

        // Roman heading (I., II., III...)
        if (/^(I|II|III|IV|V|VI|VII|VIII|IX|X)\.\s+/i.test(line)) {
          flushCurrentItem();
          bodyItems.push({ type: 'heading-roman', text: line });
          continue;
        }

        // Article heading (Điều 1., Chương I...)
        if (/^(Chương\s+[IVXLCDM]+|Điều\s+[0-9]+)/i.test(line)) {
          flushCurrentItem();
          bodyItems.push({ type: 'heading-article', text: line });
          continue;
        }

        // Multi-level numbered subheadings (2.1., 2.2., 1.1., 2.2.1...)
        if (/^[0-9]+(\.[0-9]+)+\.?\s+/.test(line)) {
          flushCurrentItem();
          bodyItems.push({ type: 'heading-subnumber', text: line });
          continue;
        }

        // Numbered heading (1., 2., 3...)
        if (/^[0-9]+\.\s+/.test(line)) {
          flushCurrentItem();
          bodyItems.push({ type: 'heading-number', text: line });
          continue;
        }

        // Bullet / point items (a), b), -, +)
        if (/^([a-zđ]\)|\-|\+)\s+/i.test(line)) {
          flushCurrentItem();
          currentItem = { type: 'bullet', text: line };
          continue;
        }

        // Transitional paragraph (Theo đề nghị...)
        if (/^Theo đề nghị\s+/i.test(line)) {
          flushCurrentItem();
          bodyItems.push({ type: 'transition', text: line });
          continue;
        }

        // Continuation line: Append to current bullet or current paragraph seamlessly!
        if (!currentItem) {
          currentItem = { type: 'paragraph', text: line };
        } else {
          if (currentItem.text.endsWith('-')) {
            currentItem.text = currentItem.text.slice(0, -1) + line;
          } else {
            currentItem.text += ' ' + line;
          }
        }
      }
    }
    flushLegal();
    flushCurrentItem();

    // Fallbacks if title not extracted cleanly from content
    if (!titleType) {
      if (directive.title.includes('Kế hoạch') || directive.title.includes('KẾ HOẠCH')) titleType = 'KẾ HOẠCH';
      else if (directive.title.includes('Quyết định') || directive.title.includes('QUYẾT ĐỊNH')) titleType = 'QUYẾT ĐỊNH';
      else if (directive.title.includes('Công văn') || directive.title.includes('CÔNG VĂN')) titleType = 'CÔNG VĂN';
      else if (directive.title.includes('Thông tư') || directive.title.includes('THÔNG TƯ')) titleType = 'THÔNG TƯ';
      else if (directive.title.includes('Hướng dẫn') || directive.title.includes('HƯỚNG DẪN')) titleType = 'HƯỚNG DẪN';
      else titleType = 'VĂN BẢN CHỈ ĐẠO';

      titleSubject = directive.title.replace(/^(Kế hoạch|Quyết định|Công văn|Thông tư|Hướng dẫn)\s*/i, '');
    }

    // Default recipients if not found in text
    if (noiNhan.length === 0) {
      noiNhan.push(
        '- Ban Giám đốc Sở (để báo cáo);',
        '- Các phòng chuyên môn thuộc Sở;',
        '- Các cơ sở giáo dục trên địa bàn tỉnh;',
        '- Lưu: VT, GDPT.'
      );
    }

    // Signer role fallback
    const finalSignerRole = signerRoleLines.length > 0 ? signerRoleLines.join('\n') : 'KT. GIÁM ĐỐC\nPHÓ GIÁM ĐỐC';
    const finalSignerName = signerName || 'Nguyễn Phương Toàn';

    return {
      authorityTop,
      authorityMain,
      documentNumber,
      mottoTop: 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM',
      mottoSub: 'Độc lập - Tự do - Hạnh phúc',
      signDate,
      titleType,
      titleSubject,
      kinhGui,
      legalBases,
      bodyItems,
      noiNhan,
      signerRole: finalSignerRole,
      signerName: finalSignerName,
    };
  }, [directive]);

  // Helper to highlight search query
  const renderTextWithHighlight = (text: string) => {
    if (!searchQuery.trim()) return text;
    const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === searchQuery.toLowerCase() ? (
        <mark key={index} className="bg-amber-300 text-slate-900 rounded-xs px-0.5 font-bold">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white print:static print:z-auto">
      <div className={`bg-white rounded-2xl shadow-2xl flex flex-col border border-slate-200 transition-all duration-200 ${
        isFullWidth ? 'max-w-[98vw] w-[98vw] h-[96vh]' : 'max-w-5xl w-full h-[92vh]'
      }`}>
        
        {/* TOP TOOLBAR - CONTROL & UTILITIES */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white rounded-t-2xl flex flex-wrap items-center justify-between gap-3 shrink-0 print:hidden">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-blue-600/30 border border-blue-400/30 rounded-lg text-amber-300">
              <Building2 className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold px-2 py-0.5 bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded">
                  {parsedDoc.documentNumber}
                </span>
                <span className="text-xs text-slate-300 font-medium">
                  {parsedDoc.authorityMain}
                </span>
              </div>
              <h3 className="font-bold text-sm text-white line-clamp-1 max-w-xl mt-0.5">
                {parsedDoc.titleType}: {parsedDoc.titleSubject}
              </h3>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm từ khóa trong văn bản..."
                className="pl-8 pr-2.5 py-1 text-xs rounded-lg bg-slate-800/80 text-white placeholder-slate-400 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-400 w-36 sm:w-48"
              />
            </div>

            {/* Font size adjuster */}
            <div className="flex items-center bg-slate-800/80 border border-slate-700 rounded-lg p-0.5 text-xs text-slate-200">
              <button
                onClick={() => setFontSizePt((prev) => Math.max(12, prev - 1))}
                className="p-1 hover:bg-slate-700 rounded text-slate-300"
                title="Giảm cỡ chữ"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="px-1.5 font-mono text-[11px] font-bold text-amber-300">
                {fontSizePt}pt
              </span>
              <button
                onClick={() => setFontSizePt((prev) => Math.min(18, prev + 1))}
                className="p-1 hover:bg-slate-700 rounded text-slate-300"
                title="Tăng cỡ chữ"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Full width toggle */}
            <button
              onClick={() => setIsFullWidth(!isFullWidth)}
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs hidden sm:flex items-center"
              title={isFullWidth ? 'Thu nhỏ khung nhìn' : 'Mở rộng khung nhìn'}
            >
              {isFullWidth ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>

            {/* Copy button */}
            <button
              onClick={handleCopyText}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center gap-1.5"
              title="Sao chép toàn văn văn bản"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? 'Đã chép' : 'Sao chép'}</span>
            </button>

            {/* Print button */}
            <button
              onClick={handlePrint}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center gap-1.5"
              title="In văn bản hoặc Lưu file PDF"
            >
              <Printer className="w-3.5 h-3.5 text-slate-300" />
              <span className="hidden sm:inline">In / PDF</span>
            </button>

            {/* Contextualize action */}
            <button
              onClick={() => {
                onClose();
                onContextualize(directive);
              }}
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
              title="Xây dựng kế hoạch trường từ chỉ đạo này"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Cụ thể hóa thành KH trường</span>
            </button>

            {/* Close button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition"
              title="Đóng cửa sổ"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* DOCUMENT PREVIEW CANVAS (100% PURE WHITE CANVAS THROUGHOUT ENTIRE SCROLL) */}
        <div className="flex-1 overflow-y-auto bg-white p-4 sm:p-8 flex justify-center print:bg-white print:p-0">
          <div
            className="bg-white text-slate-900 border border-slate-200 shadow-sm sm:shadow-md print:border-none print:shadow-none w-full max-w-[850px] p-6 sm:p-14 min-h-full"
            style={{
              fontFamily: '"Times New Roman", Times, serif',
              fontSize: `${fontSizePt}pt`,
              lineHeight: '1.45',
            }}
          >
            {/* ================= 1. HEADER 2 CỘT CHUẨN NGHỊ ĐỊNH 30/2020/NĐ-CP ================= */}
            <div className="grid grid-cols-12 gap-3 pb-3 items-start border-b border-slate-100">
              {/* CỘT TRÁI: CƠ QUAN BAN HÀNH & SỐ HIỆU */}
              <div className="col-span-5 text-center flex flex-col items-center">
                {parsedDoc.authorityTop && (
                  <span className="text-[12pt] font-normal uppercase tracking-tight text-slate-800">
                    {parsedDoc.authorityTop}
                  </span>
                )}
                <strong className="text-[12pt] font-bold uppercase tracking-tight text-slate-900 mt-0.5">
                  {parsedDoc.authorityMain}
                </strong>
                {/* Nét gạch dưới cơ quan ban hành: 1/3 đến 1/2 chiều dài dòng chữ */}
                <div className="w-20 border-b-2 border-slate-900 mt-1 mb-2"></div>

                {/* Số và ký hiệu văn bản */}
                <span className="text-[13pt] font-normal text-slate-800">
                  {parsedDoc.documentNumber}
                </span>
              </div>

              {/* CỘT PHẢI: QUỐC HIỆU, TIÊU NGỮ & ĐỊA DANH NGÀY THÁNG */}
              <div className="col-span-7 text-center flex flex-col items-center">
                <strong className="text-[12.5pt] font-bold uppercase tracking-tight text-slate-900">
                  {parsedDoc.mottoTop}
                </strong>
                <strong className="text-[13.5pt] font-bold tracking-tight text-slate-900 mt-0.5">
                  {parsedDoc.mottoSub}
                </strong>
                {/* Nét gạch ngang liền dưới toàn bộ tiêu ngữ */}
                <div className="w-44 border-b border-slate-900 mt-1 mb-2"></div>

                {/* Địa danh và thời gian ban hành văn bản (chữ nghiêng) */}
                <span className="text-[13pt] italic text-slate-700">
                  {parsedDoc.signDate}
                </span>
              </div>
            </div>

            {/* ================= 2. TIÊU ĐỀ VĂN BẢN VÀ TRÍCH YẾU ================= */}
            <div className="py-6 text-center space-y-1">
              <h1 className="text-[15pt] font-bold uppercase tracking-wide text-slate-950">
                {parsedDoc.titleType}
              </h1>
              {parsedDoc.titleSubject && (
                <h2 className="text-[13.5pt] font-bold text-slate-900 max-w-2xl mx-auto leading-snug">
                  {parsedDoc.titleSubject}
                </h2>
              )}
              <div className="w-24 border-b-2 border-slate-900 mx-auto pt-2"></div>
            </div>

            {/* ================= 3. KÍNH GỬI (NẾU CÓ) ================= */}
            {parsedDoc.kinhGui && (
              <div className="pb-3 text-[13.5pt]">
                <strong>{renderTextWithHighlight(parsedDoc.kinhGui)}</strong>
              </div>
            )}

            {/* ================= 4. CĂN CỨ PHÁP LÝ ================= */}
            {parsedDoc.legalBases.length > 0 && (
              <div className="space-y-1.5 pb-4 text-justify">
                {parsedDoc.legalBases.map((base, idx) => (
                  <p key={idx} className="italic text-[13pt] text-slate-800 leading-[1.4] pl-6 -indent-6 text-justify">
                    {renderTextWithHighlight(base)}
                  </p>
                ))}
              </div>
            )}

            {/* ================= 5. NỘI DUNG VĂN BẢN ĐÃ ĐƯỢC LIÊN KẾT ĐOẠN HOÀN CHỈNH ================= */}
            <div className="space-y-2 text-justify text-slate-900 leading-[1.45]">
              {parsedDoc.bodyItems.map((item, idx) => {
                // Đề mục La Mã chính (I., II., III., IV...)
                if (item.type === 'heading-roman') {
                  return (
                    <h2
                      key={idx}
                      className="text-[14.5pt] font-bold uppercase text-slate-950 pt-5 pb-1 tracking-tight"
                    >
                      {renderTextWithHighlight(item.text)}
                    </h2>
                  );
                }

                // Điều khoản hoặc Chương
                if (item.type === 'heading-article') {
                  return (
                    <h3
                      key={idx}
                      className="text-[14pt] font-bold text-slate-950 pt-3 pb-0.5 tracking-tight"
                    >
                      {renderTextWithHighlight(item.text)}
                    </h3>
                  );
                }

                // Mục số cấp 1 (1., 2., 3...)
                if (item.type === 'heading-number') {
                  return (
                    <h4
                      key={idx}
                      className="text-[14pt] font-bold text-slate-950 pt-3 pb-0.5 indent-4"
                    >
                      {renderTextWithHighlight(item.text)}
                    </h4>
                  );
                }

                // Mục số cấp 2 (2.1., 2.2., 1.1...)
                if (item.type === 'heading-subnumber') {
                  return (
                    <h5
                      key={idx}
                      className="text-[13.5pt] font-bold text-slate-900 pt-2 pb-0.5 indent-6"
                    >
                      {renderTextWithHighlight(item.text)}
                    </h5>
                  );
                }

                // Điểm a), b), c) hoặc gạch đầu dòng (Hanging indent chuẩn hành chính)
                if (item.type === 'bullet') {
                  return (
                    <p key={idx} className="pl-6 -indent-6 text-slate-900 leading-[1.45] text-justify">
                      {renderTextWithHighlight(item.text)}
                    </p>
                  );
                }

                // Câu chuyển tiếp (Theo đề nghị...)
                if (item.type === 'transition') {
                  return (
                    <p key={idx} className="indent-8 italic text-slate-800 leading-[1.45] text-justify">
                      {renderTextWithHighlight(item.text)}
                    </p>
                  );
                }

                // Đoạn văn thông thường: thụt đầu dòng 1 - 1.27 cm chuẩn Nghị định 30, canh đều 2 bên
                return (
                  <p key={idx} className="indent-8 text-slate-900 leading-[1.45] text-justify">
                    {renderTextWithHighlight(item.text)}
                  </p>
                );
              })}
            </div>

            {/* ================= 6. FOOTER 2 CỘT CHUẨN NGHỊ ĐỊNH 30: NƠI NHẬN & CHỮ KÝ ================= */}
            <div className="grid grid-cols-12 gap-4 pt-10 mt-8 border-t border-slate-100 items-start break-inside-avoid">
              {/* Nơi nhận (Cột trái) */}
              <div className="col-span-6 text-left space-y-1">
                <span className="text-[12pt] font-bold italic text-slate-900 block">
                  Nơi nhận:
                </span>
                <ul className="text-[11pt] space-y-0.5 text-slate-700 leading-tight">
                  {parsedDoc.noiNhan.map((nn, idx) => (
                    <li key={idx} className="pl-1">
                      {renderTextWithHighlight(nn)}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Chức vụ và Người ký (Cột phải) */}
              <div className="col-span-6 text-center flex flex-col items-center">
                {/* Thẩm quyền / Quyền hạn người ký */}
                <strong className="text-[13pt] font-bold uppercase tracking-tight text-slate-900 whitespace-pre-line leading-tight">
                  {parsedDoc.signerRole}
                </strong>

                {/* Khoảng trống ký tên trang trọng (80px) */}
                <div className="h-20 flex items-center justify-center">
                  <span className="text-slate-300 font-serif italic text-xs select-none">
                    (Đã ký số điện tử)
                  </span>
                </div>

                {/* Họ tên người ký */}
                <strong className="text-[13.5pt] font-bold text-slate-950 tracking-tight">
                  {parsedDoc.signerName}
                </strong>
              </div>
            </div>

          </div>
        </div>

        {/* BOTTOM FOOTER BAR */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 rounded-b-2xl flex flex-wrap justify-between items-center gap-3 shrink-0 print:hidden">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <FileCheck className="w-4 h-4 text-emerald-600" />
            <span>
              Văn bản chỉ đạo chính thức lưu trữ trên hệ thống · Khổ A4 chuẩn Nghị định 30/2020/NĐ-CP
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-100 rounded-xl text-xs font-semibold text-slate-700 transition"
            >
              Đóng
            </button>

            <button
              onClick={() => {
                onClose();
                onContextualize(directive);
              }}
              className="px-4 py-2 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Xây dựng kế hoạch cho trường từ văn bản này</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
