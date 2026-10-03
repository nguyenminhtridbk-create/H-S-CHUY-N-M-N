import React, { useState } from 'react';
import { 
  FileText, 
  Upload, 
  Sparkles, 
  Copy, 
  Check, 
  ArrowRight, 
  FileCode, 
  Building2, 
  Calendar,
  AlertCircle,
  BookOpen,
  Send,
  HelpCircle,
  FileCheck,
  RefreshCw,
  Globe,
  Search,
  CheckCircle2,
  Award,
  Cpu,
  BookmarkCheck
} from 'lucide-react';
import { extractTextFromFile } from '../utils/fileReader';
import { DOCUMENT_TYPES, DocumentType, SchoolDocument, DepartmentDirective } from '../types/document';

interface DocumentBuilderTabProps {
  onDocumentGenerated: (doc: SchoolDocument) => void;
  prefilledDirective?: DepartmentDirective | null;
  onClearPrefilledDirective?: () => void;
}

const QUICK_TITLE_SUGGESTIONS = [
  {
    title: 'Kế hoạch tổ chức dạy học 2 buổi/ngày năm học 2026 - 2027',
    type: 'plan' as DocumentType,
    tag: 'Dạy học 2 buổi/ngày',
  },
  {
    title: 'Kế hoạch tổ chức Hội thi Giáo viên dạy giỏi cấp trường năm học 2026 - 2027',
    type: 'plan' as DocumentType,
    tag: 'Thi đua',
  },
  {
    title: 'Kế hoạch bồi dưỡng học sinh giỏi và phụ đạo học sinh có nguy cơ chưa đạt YCCĐ',
    type: 'plan' as DocumentType,
    tag: 'Chất lượng',
  },
  {
    title: 'Kế hoạch chuyển đổi số và nâng cao năng lực ứng dụng Trí tuệ nhân tạo (AI) trong dạy học',
    type: 'plan' as DocumentType,
    tag: 'Công nghệ & AI',
  },
  {
    title: 'Kế hoạch kiểm tra nội bộ trường học năm học 2026 - 2027',
    type: 'plan' as DocumentType,
    tag: 'Quản lý',
  },
  {
    title: 'Kế hoạch liên kết chuyên môn và luân chuyển thiết bị giữa Điểm chính và Điểm Tân Kiều (cách 11km)',
    type: 'plan' as DocumentType,
    tag: 'Điểm trường',
  },
  {
    title: 'Kế hoạch tổ chức Hoạt động trải nghiệm, hướng nghiệp và Giáo dục STEM năm học 2026 - 2027',
    type: 'plan' as DocumentType,
    tag: 'STEM',
  },
  {
    title: 'Quyết định ban hành Quy chế hoạt động chuyên môn và quản lý hồ sơ sổ sách điện tử',
    type: 'decision' as DocumentType,
    tag: 'Quy chế',
  },
  {
    title: 'Hướng dẫn xây dựng Kế hoạch bài dạy 4 hoạt động và sinh hoạt tổ chuyên môn theo NCBH',
    type: 'guidance' as DocumentType,
    tag: 'Chuyên môn',
  },
];

export const DocumentBuilderTab: React.FC<DocumentBuilderTabProps> = ({ 
  onDocumentGenerated,
  prefilledDirective,
  onClearPrefilledDirective,
}) => {
  // Modes: auto_research (Khuyên dùng) | upload (Văn bản Sở) | chat_sync (Từ chat AI Studio)
  const [activeMode, setActiveMode] = useState<'auto_research' | 'upload' | 'chat_sync'>(
    prefilledDirective ? 'upload' : 'auto_research'
  );
  
  // Auto-research state
  const [researchTopic, setResearchTopic] = useState('Kế hoạch tổ chức dạy học 2 buổi/ngày năm học 2026 - 2027');
  const [researchNotes, setResearchNotes] = useState('');

  // Common configuration
  const [documentType, setDocumentType] = useState<DocumentType>('plan');
  const [signerRole, setSignerRole] = useState<'PHT' | 'HT'>('PHT');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Upload state
  const [sourceText, setSourceText] = useState(prefilledDirective ? prefilledDirective.fullContent : '');
  const [fileName, setFileName] = useState(prefilledDirective ? (prefilledDirective.fileName || prefilledDirective.documentNumber) : '');
  const [customDocNumber, setCustomDocNumber] = useState('');
  const [customTitle, setCustomTitle] = useState(prefilledDirective ? prefilledDirective.title : '');
  const [specificFocus, setSpecificFocus] = useState(
    'Cụ thể hóa chi tiết cho 53 lớp, đặc biệt chú ý bố trí thực hành tại Điểm Tân Kiều (cách 11km), phân công trách nhiệm BGH, 07 tổ chuyên môn và đẩy mạnh chuyển đổi số/AI.'
  );

  // Sync when prefilledDirective changes
  React.useEffect(() => {
    if (prefilledDirective) {
      setActiveMode('upload');
      setSourceText(prefilledDirective.fullContent);
      setFileName(prefilledDirective.fileName || prefilledDirective.documentNumber);
      setCustomTitle(prefilledDirective.title);
      setCustomDocNumber('Số: .../KH-THCS&THPTĐBK');
    }
  }, [prefilledDirective]);

  // Chat Sync state
  const [chatPastedContent, setChatPastedContent] = useState('');
  const [promptCopied, setPromptCopied] = useState(false);

  // Handler: Auto-research internet and build document (NEW FEATURE)
  const handleAutoResearchAndBuild = async () => {
    if (!researchTopic.trim()) {
      setError('Vui lòng nhập tiêu đề văn bản cần xây dựng');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const signerRoleText = signerRole === 'PHT' ? 'KT. HIỆU TRƯỞNG\nPHÓ HIỆU TRƯỞNG' : 'HIỆU TRƯỞNG';
      const signerNameText = signerRole === 'PHT' ? 'Nguyễn Minh Trí' : 'Lê Thanh Cường';

      const response = await fetch('/api/documents/auto-research-and-build', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: researchTopic,
          documentType,
          signerRole: signerRoleText,
          signerName: signerNameText,
          specificNotes: researchNotes,
        }),
      });

      const resData = await response.json();
      if (!resData.success) {
        throw new Error(resData.error || 'Lỗi khi tra cứu và xây dựng văn bản');
      }

      const is2Buoi = researchTopic.toLowerCase().includes('2 buổi') || researchTopic.toLowerCase().includes('hai buổi');

      const generatedDoc: SchoolDocument = {
        id: 'doc-' + Date.now(),
        type: resData.data.type || documentType,
        typeLabel: resData.data.typeLabel || 'Kế hoạch',
        documentNumber: resData.data.documentNumber || (is2Buoi ? 'Số: 45/KH-THCS&THPTĐBK' : `Số: .../${documentType.toUpperCase()}-THCS&THPTĐBK`),
        title: resData.data.title || (is2Buoi ? 'KẾ HOẠCH' : researchTopic.toUpperCase()),
        subTitle: resData.data.subTitle || (is2Buoi ? 'Tổ chức dạy học 2 buổi/ngày năm học 2026 - 2027' : undefined),
        signDate: resData.data.signDate || `Đồng Tháp, ngày 28 tháng 9 năm 2026`,
        createdDate: new Date().toISOString(),
        issuingAuthorityTop: resData.data.issuingAuthorityTop || 'SỞ GIÁO DỤC VÀ ĐÀO TẠO ĐỒNG THÁP',
        issuingAuthority: resData.data.issuingAuthority || 'TRƯỜNG THCS VÀ THPT\nĐỐC BINH KIỀU',
        signerRole: resData.data.signerRole || signerRoleText,
        signerName: resData.data.signerName || signerNameText,
        sourceDirectiveId: is2Buoi ? 'directive-2buoi-sgddt' : undefined,
        sourceDirective: is2Buoi 
          ? 'Công văn số 2890/SGDĐT-GDPT ngày 05/9/2026 của Sở GDĐT Đồng Tháp' 
          : resData.data.sourceDirective,
        sourceDirectiveFullText: is2Buoi
          ? `SỞ GIÁO DỤC VÀ ĐÀO TẠO TỈNH ĐỒNG THÁP\nSố: 2890/SGDĐT-GDPT\nĐồng Tháp, ngày 05 tháng 9 năm 2026\nV/v hướng dẫn tổ chức dạy học 2 buổi/ngày cấp trung học năm học 2026 - 2027\n\n1. Nguyên tắc tổ chức: Bảo đảm tính tự nguyện, đồng thuận của cha mẹ học sinh, bố trí giáo viên dạy liền buổi cùng 1 điểm trường, nghiêm cấm thu tiền sai quy định.\n2. Phân bổ: Buổi sáng tối đa 5 tiết (từ 7h00); Buổi chiều tối đa 3 tiết (từ 14h20 - 17h00) gồm: củng cố phụ đạo yếu miễn phí, bồi dưỡng HSG, giáo dục STEM/kỹ năng số/AI, thể dục thể thao.`
          : undefined,
        legalBases: resData.data.legalBases || [],
        sections: resData.data.sections || [],
        recipients: resData.data.recipients || ['Sở GDĐT Đồng Tháp (báo cáo);', 'Hiệu trưởng, các Phó Hiệu trưởng;', '08 Tổ chuyên môn, Tổ Văn phòng;', 'Bộ phận phụ trách Điểm Tân Kiều;', 'Ban Đại diện CMHS trường;', 'Lưu: VT, CM.'],
        status: 'draft',
      };

      onDocumentGenerated(generatedDoc);
    } catch (err: any) {
      let msg = err.message || 'Không thể tra cứu và tạo văn bản';
      if (typeof msg === 'string' && (msg.includes('503') || msg.includes('UNAVAILABLE') || msg.includes('demand'))) {
        msg = 'Máy chủ AI đang có lượng truy cập tăng đột biến. Thầy vui lòng bấm lại một lần nữa để nhận văn bản qua máy chủ dự phòng.';
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // File Upload Handler (Mode 2)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      setError(null);
      setFileName(file.name);
      const text = await extractTextFromFile(file);
      setSourceText(text);
    } catch (err: any) {
      setError(err.message || 'Lỗi khi đọc tệp văn bản');
    } finally {
      setLoading(false);
    }
  };

  // Sample Directive of Dong Thap
  const handleLoadSampleDirective = () => {
    setFileName('Cong_van_3284_SGDDT_GDPT_Dong_Thap.docx');
    setSourceText(`SỞ GIÁO DỤC VÀ ĐÀO TẠO ĐỒNG THÁP
Số: 3284/SGDĐT-GDPT
V/v hướng dẫn xây dựng và tổ chức thực hiện kế hoạch giáo dục của nhà trường cấp trung học năm học 2026 - 2027
Đồng Tháp, ngày 24 tháng 8 năm 2026

Kính gửi: Hiệu trưởng các trường có cấp THCS, THPT trên địa bàn tỉnh.

Căn cứ Thông tư số 15/2026/TT-BGDĐT ban hành Điều lệ trường TH, THCS, THPT và trường phổ thông có nhiều cấp học;
Căn cứ Công văn 5512/BGDĐT-GDTrH của Bộ GDĐT;
Sở GDĐT Đồng Tháp hướng dẫn các cơ sở giáo dục trung học xây dựng Kế hoạch giáo dục nhà trường năm học 2026-2027 với các nội dung trọng tâm:
1. Đảm bảo khung thời gian 35 tuần thực học (Học kỳ I: 18 tuần, Học kỳ II: 17 tuần).
2. Xây dựng Kế hoạch giáo dục của Tổ chuyên môn theo Phụ lục I và Kế hoạch bài dạy theo Phụ lục II ban hành kèm theo công văn này. Tuyệt đối không ghi lời thoại rườm rà "GV hỏi - HS đáp".
3. Tăng cường chuyển đổi số, tổ chức sinh hoạt tổ chuyên môn theo nghiên cứu bài học và bồi dưỡng học sinh giỏi, phụ đạo học sinh có nguy cơ chưa đạt YCCĐ.
4. Đẩy mạnh giáo dục STEM, trải nghiệm hướng nghiệp và khai thác ứng dụng Trí tuệ nhân tạo (AI) an toàn trong dạy học.
Yêu cầu các trường cụ thể hóa kế hoạch phù hợp với điều kiện thực tế của từng đơn vị và từng điểm trường lẻ (nếu có).

KT. GIÁM ĐỐC
PHÓ GIÁM ĐỐC
Nguyễn Phương Toàn (đã ký)`);
  };

  // Generate Document via API (Mode 2)
  const handleGenerateFromDirective = async () => {
    if (!sourceText.trim()) {
      setError('Vui lòng tải lên tệp hoặc dán nội dung văn bản của Sở/Bộ vào ô bên dưới.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const signerRoleText = signerRole === 'PHT' ? 'KT. HIỆU TRƯỞNG\nPHÓ HIỆU TRƯỞNG' : 'HIỆU TRƯỞNG';
      const signerNameText = signerRole === 'PHT' ? 'Nguyễn Minh Trí' : 'Lê Thanh Cường';

      const response = await fetch('/api/documents/contextualize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceText,
          documentType,
          specificFocus,
          signerRole: signerRoleText,
          signerName: signerNameText,
          customDocumentNumber: customDocNumber,
          customTitle,
        }),
      });

      const resData = await response.json();
      if (!resData.success) {
        throw new Error(resData.error || 'Lỗi khi cụ thể hóa văn bản');
      }

      const generatedDoc: SchoolDocument = {
        id: 'doc-' + Date.now(),
        type: resData.data.type || documentType,
        typeLabel: resData.data.typeLabel || 'Kế hoạch',
        documentNumber: resData.data.documentNumber || `Số: .../${documentType.toUpperCase()}-THCS&THPTĐBK`,
        title: resData.data.title || 'VĂN BẢN QUẢN LÝ GIÁO DỤC',
        subTitle: resData.data.subTitle,
        signDate: resData.data.signDate || `Tháp Mười, ngày ${new Date().getDate()} tháng ${new Date().getMonth() + 1} năm 2026`,
        createdDate: new Date().toISOString(),
        issuingAuthorityTop: resData.data.issuingAuthorityTop || 'SỞ GIÁO DỤC VÀ ĐÀO TẠO ĐỒNG THÁP',
        issuingAuthority: resData.data.issuingAuthority || 'TRƯỜNG THCS VÀ THPT\nĐỐC BINH KIỀU',
        signerRole: resData.data.signerRole || signerRoleText,
        signerName: resData.data.signerName || signerNameText,
        sourceDirectiveId: prefilledDirective?.id,
        sourceDirective: prefilledDirective ? `${prefilledDirective.documentNumber} - ${prefilledDirective.title}` : (resData.data.sourceDirective || 'Chỉ đạo của Sở GDĐT Đồng Tháp'),
        sourceDirectiveFullText: prefilledDirective?.fullContent || sourceText,
        legalBases: resData.data.legalBases || [],
        sections: resData.data.sections || [],
        recipients: resData.data.recipients || ['Sở GDĐT Đồng Tháp (báo cáo);', 'Hiệu trưởng, các Phó Hiệu trưởng;', '08 Tổ chuyên môn;', 'Điểm Tân Kiều;', 'Lưu: VT, CM.'],
        status: 'draft',
      };

      onDocumentGenerated(generatedDoc);
    } catch (err: any) {
      let msg = err.message || 'Không thể cụ thể hóa văn bản';
      if (typeof msg === 'string' && (msg.includes('503') || msg.includes('UNAVAILABLE') || msg.includes('demand'))) {
        msg = 'Máy chủ AI đang có lượng truy cập tăng đột biến. Thầy vui lòng bấm lại một lần nữa để nhận văn bản qua máy chủ dự phòng.';
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Parse Chat Content (Mode 3)
  const handleParseChatSync = () => {
    if (!chatPastedContent.trim()) {
      setError('Vui lòng dán nội dung văn bản bạn đã tạo trong AI Studio Chat.');
      return;
    }

    try {
      setError(null);
      let parsedDoc: Partial<SchoolDocument> = {};

      if (chatPastedContent.trim().startsWith('{') && chatPastedContent.trim().endsWith('}')) {
        try {
          parsedDoc = JSON.parse(chatPastedContent.trim());
        } catch {
          // fallback
        }
      }

      if (!parsedDoc.title) {
        const lines = chatPastedContent.split('\n').map(l => l.trim()).filter(Boolean);
        const titleLine = lines.find(l => l.toUpperCase().includes('KẾ HOẠCH') || l.toUpperCase().includes('QUYẾT ĐỊNH') || l.toUpperCase().includes('HƯỚNG DẪN')) || lines[0] || 'VĂN BẢN TRƯỜNG THCS VÀ THPT ĐỐC BINH KIỀU';
        
        parsedDoc = {
          type: documentType,
          typeLabel: DOCUMENT_TYPES.find(d => d.type === documentType)?.label || 'Kế hoạch',
          documentNumber: `Số: ${Math.floor(Math.random() * 50) + 50}/KH-THCS&THPTĐBK`,
          title: titleLine.replace(/^#+\s*/, ''),
          subTitle: 'Cụ thể hóa văn bản chỉ đạo của cấp trên',
          signDate: `Tháp Mười, ngày ${new Date().getDate()} tháng ${new Date().getMonth() + 1} năm 2026`,
          issuingAuthorityTop: 'SỞ GIÁO DỤC VÀ ĐÀO TẠO ĐỒNG THÁP',
          issuingAuthority: 'TRƯỜNG THCS VÀ THPT ĐỐC BINH KIỀU',
          signerRole: signerRole === 'PHT' ? 'KT. HIỆU TRƯỞNG\nPHÓ HIỆU TRƯỞNG' : 'HIỆU TRƯỞNG',
          signerName: signerRole === 'PHT' ? 'Nguyễn Minh Trí' : 'Lê Thanh Cường',
          legalBases: [
            'Thông tư số 15/2026/TT-BGDĐT ban hành Điều lệ trường TH, THCS, THPT và trường phổ thông có nhiều cấp học',
            'Công văn số 3284/SGDĐT-GDPT ngày 24/8/2026 của Sở GDĐT Đồng Tháp'
          ],
          sections: [
            {
              heading: 'NỘI DUNG VĂN BẢN CỤ THỂ HÓA',
              content: chatPastedContent
            }
          ],
          recipients: [
            'Sở GDĐT Đồng Tháp (để b/c);',
            'BGH trường;',
            '07 Tổ chuyên môn;',
            'Điểm Tân Kiều;',
            'Lưu: VT, CM.'
          ]
        };
      }

      const completeDoc: SchoolDocument = {
        id: 'doc-' + Date.now(),
        type: parsedDoc.type || documentType,
        typeLabel: parsedDoc.typeLabel || 'Kế hoạch',
        documentNumber: parsedDoc.documentNumber || `Số: .../KH-THCS&THPTĐBK`,
        title: parsedDoc.title || 'VĂN BẢN TRƯỜNG THCS VÀ THPT ĐỐC BINH KIỀU',
        subTitle: parsedDoc.subTitle,
        signDate: parsedDoc.signDate || `Tháp Mười, ngày ${new Date().getDate()} tháng ${new Date().getMonth() + 1} năm 2026`,
        createdDate: new Date().toISOString(),
        issuingAuthorityTop: parsedDoc.issuingAuthorityTop || 'SỞ GIÁO DỤC VÀ ĐÀO TẠO ĐỒNG THÁP',
        issuingAuthority: parsedDoc.issuingAuthority || 'TRƯỜNG THCS VÀ THPT ĐỐC BINH KIỀU',
        signerRole: parsedDoc.signerRole || (signerRole === 'PHT' ? 'KT. HIỆU TRƯỞNG\nPHÓ HIỆU TRƯỞNG' : 'HIỆU TRƯỞNG'),
        signerName: parsedDoc.signerName || (signerRole === 'PHT' ? 'Nguyễn Minh Trí' : 'Lê Thanh Cường'),
        legalBases: parsedDoc.legalBases || [],
        sections: parsedDoc.sections || [{ heading: 'NỘI DUNG', content: chatPastedContent }],
        recipients: parsedDoc.recipients || ['BGH;', '07 Tổ chuyên môn;', 'Lưu: VT, CM.'],
        status: 'draft'
      };

      onDocumentGenerated(completeDoc);
    } catch (e: any) {
      setError('Lỗi khi phân tích nội dung dán vào: ' + e.message);
    }
  };

  const samplePromptForChat = `Hãy đóng vai Thư ký Chuyên môn Trường THCS và THPT Đốc Binh Kiều (huyện Tháp Mười, tỉnh Đồng Tháp).
Cụ thể hóa văn bản chỉ đạo sau đây thành một [KẾ HOẠCH / QUYẾT ĐỊNH / HƯỚNG DẪN] chính thức của nhà trường theo Nghị định 30/2020/NĐ-CP:
- Quy mô trường: 53 lớp (39 THCS gồm 24 lớp điểm Đốc Binh Kiều, 15 lớp điểm Tân Kiều cách 11km; 14 lớp THPT).
- Đội ngũ: 101 cán bộ, giáo viên (07 tổ chuyên môn).
- Người ký: Thầy Nguyễn Minh Trí (KT. Hiệu trưởng / Phó Hiệu trưởng).
- Nội dung chỉ đạo cần cụ thể hóa:
[DÁN VĂN BẢN CỦA SỞ / BỘ VÀO ĐÂY]`;

  const handleCopyChatPrompt = async () => {
    try {
      await navigator.clipboard.writeText(samplePromptForChat);
      setPromptCopied(true);
      setTimeout(() => setPromptCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Introduction Card */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 bg-blue-100 text-blue-900 text-xs font-bold rounded flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" />
              <span>Trợ Lý Xây Dựng Văn Bản Quản Lý Giáo Dục</span>
            </span>
            <span className="text-xs text-slate-500">
              Trường THCS & THPT Đốc Binh Kiều · Chuẩn Nghị định 30/2020/NĐ-CP
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1">
            Xây Dựng Văn Bản Quản Lý Cho Trường Đốc Binh Kiều
          </h2>
          <p className="text-xs text-slate-600 mt-0.5 max-w-3xl">
            Tự động tra cứu quy định pháp luật trên Internet hoặc đọc văn bản của Sở/Bộ để xây dựng Kế hoạch, Quyết định, Hướng dẫn, Quy chế bám sát 53 lớp, 3 điểm trường và 101 giáo viên.
          </p>
        </div>

        <button
          onClick={handleLoadSampleDirective}
          className="px-3.5 py-2 rounded-lg border border-blue-300 text-blue-800 bg-blue-50/70 hover:bg-blue-100 text-xs font-semibold flex items-center gap-1.5 transition shrink-0"
        >
          <BookOpen className="w-3.5 h-3.5 text-blue-700" />
          <span>Tải mẫu Công văn 3284 Sở GDĐT</span>
        </button>
      </div>

      {/* Prefilled Directive Banner */}
      {prefilledDirective && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs text-amber-950 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-200 flex items-center justify-center shrink-0 text-amber-900 font-bold">
              Sở
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider font-bold text-amber-800">
                Đang cụ thể hóa từ văn bản của Sở GDĐT:
              </span>
              <p className="font-bold text-sm text-slate-900">
                {prefilledDirective.documentNumber}: {prefilledDirective.title}
              </p>
            </div>
          </div>
          {onClearPrefilledDirective && (
            <button
              onClick={onClearPrefilledDirective}
              className="px-3 py-1.5 bg-white border border-amber-400 hover:bg-amber-100 text-amber-900 rounded-lg text-xs font-semibold transition shrink-0"
            >
              Hủy liên kết này
            </button>
          )}
        </div>
      )}

      {/* Mode Selector Tabs (3 Modes) */}
      <div className="flex border-b border-slate-200 flex-wrap">
        {/* Mode 1: Auto Research by Title (NEW) */}
        <button
          onClick={() => setActiveMode('auto_research')}
          className={`py-2.5 px-4 font-semibold text-xs border-b-2 flex items-center gap-2 transition ${
            activeMode === 'auto_research'
              ? 'border-blue-700 text-blue-900 bg-blue-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Globe className="w-4 h-4 text-blue-600" />
          <span>1. Tự Động Tra Cứu Internet & Xây Dựng Từ Tiêu Đề (Khuyên dùng)</span>
          <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded text-[10px] font-bold">Mới</span>
        </button>

        {/* Mode 2: Upload Directive File */}
        <button
          onClick={() => setActiveMode('upload')}
          className={`py-2.5 px-4 font-semibold text-xs border-b-2 flex items-center gap-2 transition ${
            activeMode === 'upload'
              ? 'border-blue-700 text-blue-900 bg-blue-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Upload className="w-4 h-4 text-slate-600" />
          <span>2. Tải lên hoặc dán văn bản của Sở / Bộ</span>
        </button>

        {/* Mode 3: Sync from AI Studio Chat */}
        <button
          onClick={() => setActiveMode('chat_sync')}
          className={`py-2.5 px-4 font-semibold text-xs border-b-2 flex items-center gap-2 transition ${
            activeMode === 'chat_sync'
              ? 'border-blue-700 text-blue-900 bg-blue-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileCode className="w-4 h-4 text-emerald-600" />
          <span>3. Nhập nhanh từ Trò Chuyện AI Studio Chat</span>
        </button>
      </div>

      {/* MODE 1: AUTO RESEARCH INTERNET & BUILD BY TITLE (User Request) */}
      {activeMode === 'auto_research' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Settings & Document Type */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-semibold text-sm text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
                <FileCheck className="w-4 h-4 text-blue-600" />
                <span>Thiết lập văn bản</span>
              </h3>

              {/* Document Type Radio */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700">
                  Loại văn bản:
                </label>
                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                  {DOCUMENT_TYPES.map((dt) => (
                    <label
                      key={dt.type}
                      className={`flex items-start gap-2 p-2 rounded-lg border cursor-pointer transition ${
                        documentType === dt.type
                          ? 'bg-blue-50/80 border-blue-500 text-blue-900'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="autoDocType"
                        checked={documentType === dt.type}
                        onChange={() => setDocumentType(dt.type)}
                        className="mt-0.5 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="text-xs">
                        <strong className="block font-bold">{dt.label}</strong>
                        <span className="text-[10px] text-slate-500 line-clamp-1">{dt.description}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Signer Selection */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <label className="block text-xs font-semibold text-slate-700">
                  Người ký văn bản:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSignerRole('PHT')}
                    className={`p-2 rounded-lg border text-left text-xs transition ${
                      signerRole === 'PHT'
                        ? 'bg-blue-600 text-white border-blue-600 font-semibold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="block text-[11px] opacity-80">KT. Hiệu trưởng</span>
                    <span className="font-bold">PHT. Nguyễn Minh Trí</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSignerRole('HT')}
                    className={`p-2 rounded-lg border text-left text-xs transition ${
                      signerRole === 'HT'
                        ? 'bg-blue-600 text-white border-blue-600 font-semibold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="block text-[11px] opacity-80">Thủ trưởng</span>
                    <span className="font-bold">HT. Lê Thanh Cường</span>
                  </button>
                </div>
              </div>

              {/* Specific Notes */}
              <div className="pt-2 border-t border-slate-100 space-y-1.5">
                <label className="block text-[11px] font-semibold text-slate-600">
                  Ghi chú riêng của Thầy (nếu có):
                </label>
                <textarea
                  value={researchNotes}
                  onChange={(e) => setResearchNotes(e.target.value)}
                  rows={3}
                  className="w-full text-xs rounded-lg border border-slate-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Ví dụ: chú trọng giáo viên điểm Tân Kiều, tổ chức trong tháng 11, trao giải trước 20/11..."
                />
              </div>
            </div>

            {/* Right: Title Input & Quick Suggestions */}
            <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="font-semibold text-sm text-slate-800 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-600" />
                    <span>Nhập tiêu đề văn bản cần làm (AI tự tra cứu Internet và xây dựng)</span>
                  </h3>
                  <span className="text-xs text-blue-700 font-medium">Chỉ cần nhập tên, AI làm hết</span>
                </div>

                {/* Main Topic Input Field */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800">
                    Tiêu đề hoặc chủ đề văn bản:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={researchTopic}
                      onChange={(e) => setResearchTopic(e.target.value)}
                      placeholder="Ví dụ: Kế hoạch tổ chức Hội thi Giáo viên dạy giỏi cấp trường năm học 2026 - 2027"
                      className="w-full text-sm font-semibold text-slate-900 rounded-xl border-2 border-blue-400 p-3 pr-10 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-blue-50/20"
                    />
                    <Search className="w-5 h-5 text-blue-500 absolute right-3 top-3.5" />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Hệ thống sẽ tự động tra cứu các Thông tư của Bộ GDĐT, Hướng dẫn của Sở GDĐT Đồng Tháp và thể thức Nghị định 30 để soạn thảo đầy đủ.
                  </p>
                </div>

                {/* Quick Topic Suggestions */}
                <div className="space-y-2 pt-2">
                  <span className="block text-xs font-semibold text-slate-600">
                    Hoặc chọn nhanh tiêu đề mẫu thường dùng trong trường học:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {QUICK_TITLE_SUGGESTIONS.map((sug, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setResearchTopic(sug.title);
                          setDocumentType(sug.type);
                        }}
                        className={`p-2.5 rounded-lg border text-left text-xs transition flex flex-col justify-between gap-1 group ${
                          researchTopic === sug.title
                            ? 'bg-blue-50 border-blue-500 text-blue-900 shadow-2xs font-medium'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span className="line-clamp-2 text-[12px] group-hover:text-blue-700 font-medium">
                          {sug.title}
                        </span>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-0.5">
                          <span className="px-1.5 py-0.2 bg-slate-100 rounded text-slate-600 font-medium">
                            {sug.tag}
                          </span>
                          <span>·</span>
                          <span className="text-blue-600 font-semibold">{sug.type.toUpperCase()}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Error Box */}
                {error && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                    <span>{error}</span>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3">
                <span className="text-xs text-slate-500">
                  Tự động tích hợp số liệu 53 lớp, 101 GV và Điểm Tân Kiều cách 11km.
                </span>

                <button
                  onClick={handleAutoResearchAndBuild}
                  disabled={loading || !researchTopic.trim()}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 hover:from-blue-800 hover:to-indigo-900 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                      <span>Đang tra cứu quy định & Xây dựng văn bản...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>TRA CỨU INTERNET & XÂY DỰNG VĂN BẢN TỰ ĐỘNG</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: File Upload & Contextualize */}
      {activeMode === 'upload' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-semibold text-sm text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
              <FileCheck className="w-4 h-4 text-blue-600" />
              <span>1. Chọn loại văn bản cần ban hành</span>
            </h3>

            <div className="space-y-2">
              {DOCUMENT_TYPES.map((dt) => (
                <label
                  key={dt.type}
                  className={`flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer transition ${
                    documentType === dt.type
                      ? 'bg-blue-50/70 border-blue-500 text-blue-900'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="docType"
                    checked={documentType === dt.type}
                    onChange={() => setDocumentType(dt.type)}
                    className="mt-0.5 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="text-xs">
                    <strong className="block font-bold">{dt.label}</strong>
                    <span className="text-[11px] text-slate-500 line-clamp-1">{dt.description}</span>
                  </div>
                </label>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                Người ký văn bản:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSignerRole('PHT')}
                  className={`p-2 rounded-lg border text-left text-xs transition ${
                    signerRole === 'PHT'
                      ? 'bg-blue-600 text-white border-blue-600 font-semibold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="block text-[11px] opacity-80">KT. Hiệu trưởng</span>
                  <span className="font-bold">PHT. Nguyễn Minh Trí</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSignerRole('HT')}
                  className={`p-2 rounded-lg border text-left text-xs transition ${
                    signerRole === 'HT'
                      ? 'bg-blue-600 text-white border-blue-600 font-semibold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="block text-[11px] opacity-80">Thủ trưởng</span>
                  <span className="font-bold">HT. Lê Thanh Cường</span>
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                  Số hiệu văn bản (để trống nếu tạo tự động):
                </label>
                <input
                  type="text"
                  value={customDocNumber}
                  onChange={(e) => setCustomDocNumber(e.target.value)}
                  placeholder="Ví dụ: Số: 89/KH-THCS&THPTĐBK"
                  className="w-full text-xs rounded-lg border border-slate-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                  Yêu cầu trọng tâm của Phó Hiệu Trưởng:
                </label>
                <textarea
                  value={specificFocus}
                  onChange={(e) => setSpecificFocus(e.target.value)}
                  rows={3}
                  className="w-full text-xs rounded-lg border border-slate-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Ghi chú thêm: chú trọng điểm Tân Kiều, mốc thời gian, kiểm tra..."
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-2">
                <h3 className="font-semibold text-sm text-slate-800 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-blue-600" />
                  <span>2. Nội dung văn bản của Sở GDĐT Đồng Tháp / Bộ GDĐT</span>
                </h3>

                <label className="cursor-pointer px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-xs text-slate-700 flex items-center gap-1.5 transition">
                  <Upload className="w-3.5 h-3.5 text-slate-500" />
                  <span>{fileName ? `Đổi file (${fileName})` : 'Tải tệp Word (.docx, .txt)'}</span>
                  <input
                    type="file"
                    accept=".docx,.txt,.doc"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center text-[11px] text-slate-500">
                  <span>Dán toàn văn chỉ đạo, kế hoạch hoặc hướng dẫn cấp trên vào đây:</span>
                  <span>{sourceText.length} ký tự</span>
                </div>
                <textarea
                  value={sourceText}
                  onChange={(e) => setSourceText(e.target.value)}
                  rows={14}
                  placeholder="Dán toàn văn kế hoạch, công văn, chỉ đạo của Sở GDĐT Đồng Tháp hoặc Bộ GDĐT vào đây..."
                  className="w-full text-xs rounded-lg border border-slate-300 p-3 font-mono leading-relaxed focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50"
                />
              </div>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3">
              <span className="text-xs text-slate-500">
                Hệ thống sẽ đối chiếu thông tin 53 lớp, 101 GV để tạo bản thảo hoàn chỉnh.
              </span>

              <button
                onClick={handleGenerateFromDirective}
                disabled={loading}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Đang cụ thể hóa văn bản cho trường...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>CỤ THỂ HÓA CHO TRƯỜNG ĐỐC BINH KIỀU NGAY</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODE 3: Sync from AI Studio Chat */}
      {activeMode === 'chat_sync' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-semibold text-sm text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
              <HelpCircle className="w-4 h-4 text-emerald-600" />
              <span>Hướng dẫn cụ thể hóa từ AI Studio Chat</span>
            </h3>

            <div className="space-y-3 text-xs text-slate-600">
              <p>
                <strong>Bước 1:</strong> Sao chép mẫu câu lệnh bên dưới và gửi vào khung chat AI Studio kèm văn bản chỉ đạo của Sở/Bộ.
              </p>
              <p>
                <strong>Bước 2:</strong> Sau khi AI trong khung chat tạo ra văn bản, bạn sao chép toàn bộ nội dung đó.
              </p>
              <p>
                <strong>Bước 3:</strong> Dán vào ô bên phải và bấm <em>"Đưa Lên Trình Soạn Thảo & Xuất File"</em> để xem trên mẫu A4, chỉnh sửa và tải tệp Word (.docx).
              </p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold text-slate-700 uppercase">Mẫu câu lệnh gửi AI Studio:</span>
                <button
                  onClick={handleCopyChatPrompt}
                  className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-[11px] font-semibold text-slate-700 flex items-center gap-1 transition"
                >
                  {promptCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{promptCopied ? 'Đã chép' : 'Sao chép'}</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-600 font-mono whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                {samplePromptForChat}
              </p>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <h3 className="font-semibold text-sm text-slate-800 flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-emerald-600" />
                  <span>Dán nội dung từ AI Studio Chat vào đây</span>
                </h3>
                <span className="text-xs text-slate-400">Hỗ trợ định dạng văn bản thường, Markdown hoặc JSON</span>
              </div>

              <textarea
                value={chatPastedContent}
                onChange={(e) => setChatPastedContent(e.target.value)}
                rows={16}
                placeholder="Dán toàn bộ văn bản hoặc kết quả AI Studio vừa tạo ra vào đây..."
                className="w-full text-xs rounded-lg border border-slate-300 p-3 font-mono leading-relaxed focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50/50"
              />

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={handleParseChatSync}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition"
              >
                <FileCheck className="w-4 h-4 text-emerald-200" />
                <span>ĐƯA LÊN TRÌNH SOẠN THẢO & XUẤT FILE NGAY</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
