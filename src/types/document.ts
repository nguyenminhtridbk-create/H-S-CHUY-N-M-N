export type DocumentType = 
  | 'plan'        // Kế hoạch (KH)
  | 'decision'    // Quyết định (QĐ)
  | 'guidance'    // Hướng dẫn (HD) / Công văn (CV)
  | 'regulation'  // Quy chế / Quy định (QC/QĐ)
  | 'report'      // Báo cáo (BC)
  | 'announcement'// Thông báo (TB)
  | 'proposal';   // Tờ trình (TTr)

export interface DocumentSection {
  heading: string; // e.g. "I. ĐẶC ĐIỂM, ĐIỀU KIỆN THỰC HIỆN CHƯƠNG TRÌNH NĂM HỌC"
  content: string; // Paragraphs
  subsections?: {
    title: string;
    content: string;
  }[];
}

/**
 * Văn bản chỉ đạo của Sở GDĐT / Bộ GDĐT gửi về trường
 */
export interface DepartmentDirective {
  id: string;
  documentNumber: string; // "Số: 1061/HD-SGDĐT", "Số: 3284/SGDĐT-GDPT", v.v.
  title: string; // Tên văn bản chỉ đạo
  issuingAuthority: string; // "SỞ GDĐT TỈNH ĐỒNG THÁP"
  signDate: string; // "Đồng Tháp, ngày 28 tháng 8 năm 2026"
  signer: string; // "KT. GIÁM ĐỐC - PHÓ GIÁM ĐỐC Nguyễn Phương Toàn"
  summary: string; // Tóm tắt tinh thần chỉ đạo
  fullContent: string; // Toàn văn văn bản của Sở
  createdDate: string;
  fileName?: string; // Tên tệp đính kèm nếu có (.docx, .pdf)
  topic?: string; // Chuyên đề (2 buổi/ngày, Hướng nghiệp & phân luồng, Khung năng lực số, Kiểm tra đánh giá, Dạy thêm học thêm, Hồ sơ sổ sách...)
  fileSize?: string; // Kích thước file gốc
  linkedSchoolDocumentIds?: string[]; // Danh sách ID các văn bản của trường đã được cụ thể hóa từ chỉ đạo này
}

/**
 * Văn bản hành chính của Trường THCS và THPT Đốc Binh Kiều
 * Chuẩn thể thức Nghị định 30/2020/NĐ-CP và mẫu Kế hoạch giáo dục 25 trang của trường
 */
export interface SchoolDocument {
  id: string;
  type: DocumentType;
  typeLabel: string; // "Kế hoạch", "Quyết định", "Hướng dẫn", v.v.
  documentNumber: string; // "Số: 34/KH-THCS&THPTĐBK" hoặc "Số:    /KH-THCS&THPTĐBK"
  title: string; // "KẾ HOẠCH"
  subTitle?: string; // "Giáo dục Nhà trường năm học 2026 - 2027" hoặc "Tổ chức dạy học 2 buổi/ngày năm học 2026 - 2027"
  signDate: string; // "Đồng Tháp, ngày 25 tháng 9 năm 2026"
  createdDate: string;
  issuingAuthorityTop: string; // "SỞ GDĐT TỈNH ĐỒNG THÁP"
  issuingAuthority: string; // "TRƯỜNG THCS VÀ THPT\nĐỐC BINH KIỀU"
  signerRole: string; // "HIỆU TRƯỞNG" hoặc "KT. HIỆU TRƯỞNG\nPHÓ HIỆU TRƯỞNG"
  signerName: string; // "Lê Thanh Cường" hoặc "Nguyễn Minh Trí"
  sourceDirectiveId?: string; // ID của văn bản Sở liên kết
  sourceDirective?: string; // Trích dẫn tên văn bản của Sở
  sourceDirectiveFullText?: string; // Toàn văn chỉ đạo của Sở được lưu kèm
  legalBases: string[]; // Các căn cứ pháp lý (Thông tư 32/2018, Thông tư 22/2021, Thông tư 15/2026, QĐ 2606...)
  sections: DocumentSection[];
  recipients: string[]; // Nơi nhận
  notes?: string;
  updatedAt?: string;
  status: 'draft' | 'reviewed' | 'official';
}

export interface DocumentTypeOption {
  type: DocumentType;
  label: string;
  codePrefix: string;
  description: string;
  iconName: string;
  defaultSigner: string;
}

export const DOCUMENT_TYPES: DocumentTypeOption[] = [
  {
    type: 'plan',
    label: 'Kế hoạch (KH)',
    codePrefix: '/KH-THCS&THPTĐBK',
    description: 'Kế hoạch giáo dục nhà trường, kế hoạch dạy học 2 buổi/ngày, bồi dưỡng phụ đạo, kiểm tra nội bộ, STEM...',
    iconName: 'CalendarCheck',
    defaultSigner: 'HIỆU TRƯỞNG',
  },
  {
    type: 'decision',
    label: 'Quyết định (QĐ)',
    codePrefix: '/QĐ-THCS&THPTĐBK',
    description: 'Quyết định ban hành Quy chế chuyên môn, thành lập Tổ chuyên môn, phân công nhiệm vụ, Hội đồng kiểm tra...',
    iconName: 'FileCheck',
    defaultSigner: 'HIỆU TRƯỞNG',
  },
  {
    type: 'guidance',
    label: 'Hướng dẫn / Công văn (HD/CV)',
    codePrefix: '/HD-THCS&THPTĐBK',
    description: 'Hướng dẫn sinh hoạt tổ chuyên môn NCBH, hướng dẫn soạn giáo án 4 hoạt động, kiểm tra đánh giá...',
    iconName: 'BookOpen',
    defaultSigner: 'KT. HIỆU TRƯỞNG\nPHÓ HIỆU TRƯỞNG',
  },
  {
    type: 'regulation',
    label: 'Quy chế / Quy định (QC)',
    codePrefix: '/QC-THCS&THPTĐBK',
    description: 'Quy chế hoạt động chuyên môn, quy chế kiểm tra đánh giá, quy định hồ sơ sổ sách điện tử...',
    iconName: 'ShieldCheck',
    defaultSigner: 'HIỆU TRƯỞNG',
  },
  {
    type: 'report',
    label: 'Báo cáo (BC)',
    codePrefix: '/BC-THCS&THPTĐBK',
    description: 'Báo cáo sơ kết học kỳ, tổng kết năm học, báo cáo chuyên đề gửi Sở GDĐT...',
    iconName: 'BarChart3',
    defaultSigner: 'HIỆU TRƯỞNG',
  },
  {
    type: 'announcement',
    label: 'Thông báo (TB)',
    codePrefix: '/TB-THCS&THPTĐBK',
    description: 'Thông báo lịch kiểm tra định kỳ, hội nghị chuyên môn, phân công dạy thay...',
    iconName: 'Bell',
    defaultSigner: 'KT. HIỆU TRƯỞNG\nPHÓ HIỆU TRƯỞNG',
  },
  {
    type: 'proposal',
    label: 'Tờ trình (TTr)',
    codePrefix: '/TTr-THCS&THPTĐBK',
    description: 'Tờ trình gửi Sở GDĐT Đồng Tháp đề xuất thiết bị, nhân sự, kinh phí...',
    iconName: 'Send',
    defaultSigner: 'HIỆU TRƯỞNG',
  },
];
