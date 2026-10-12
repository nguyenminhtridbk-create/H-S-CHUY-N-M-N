// src/data/emulationRulesData.ts
// QUY ĐỊNH THI ĐUA VIÊN CHỨC MỚI TRƯỜNG THCS VÀ THPT ĐỐC BINH KIỀU
// Căn cứ chuẩn: Nghị định 233/2026/NĐ-CP của Chính phủ về đánh giá xếp loại chất lượng viên chức
// Tích hợp và kế thừa toàn diện từ 3 trường sáp nhập:
// 1. THPT Đốc Binh Kiều (KLLĐ-QCCM, công thức TBCM, nề nếp kỷ luật, chấm thi sai sót)
// 2. THCS Đốc Binh Kiều (điểm lệch, vnedu, BHYT, duy trì sĩ số, hoạt động Đội, ĐDDH)
// 3. THCS Tân Kiều (16 tiêu chuẩn điều kiện, tuyển sinh 10, bồi dưỡng HSG, chuyên trách)

export interface EmulationCriterion {
  id: string;
  code: string;
  title: string;
  maxScore: number;
  category: 'common' | 'duty' | 'bonus' | 'penalty' | 'severe';
  categoryTitle: string;
  scope: 'all' | 'teacher' | 'homeroom' | 'staff' | 'leader';
  description: string;
  sourceOrigin: string;
  subCriteria?: {
    id: string;
    text: string;
    score: number;
    ruleDetail?: string;
  }[];
}

export interface PenaltyItem {
  id: string;
  code: string;
  violation: string;
  penaltyScore: number; // Điểm trừ (dương hoặc âm)
  unit: string; // 'lần', 'tiết', 'ngày', 'học sinh', 'vụ'...
  category: 'discipline' | 'teaching' | 'records' | 'homeroom' | 'ethics' | 'severe';
  categoryLabel: string;
  conditionNote: string;
  sourceSchool: string;
  isDisqualifying?: boolean; // Khống chế xếp loại thấp nhất (Không hoàn thành nhiệm vụ)
}

export interface BonusItem {
  id: string;
  code: string;
  achievement: string;
  bonusScore: number;
  unit: string;
  category: 'student_prize' | 'teacher_prize' | 'exam_10_tn' | 'movement_donation' | 'duty_honor';
  categoryLabel: string;
  detail: string;
  sourceSchool: string;
}

// KHUNG TIÊU CHÍ CHUẨN THANG ĐIỂM 100 (NGHỊ ĐỊNH 233)
// Nhóm 1: Tiêu chí chung: Tối đa 30 điểm
// Nhóm 2: Kết quả thực hiện nhiệm vụ chuyên môn: Tối đa 70 điểm
// Điểm thưởng: Tối đa 20 điểm cộng thêm
export const EMULATION_CRITERIA_LIST: EmulationCriterion[] = [
  // --- NHÓM I: KHUNG TIÊU CHÍ CHUNG (30 ĐIỂM) - NGHỊ ĐỊNH 233 ---
  {
    id: 'crit-1',
    code: 'I.1',
    title: 'Chính trị tư tưởng',
    maxScore: 10,
    category: 'common',
    categoryTitle: 'Khung Tiêu Chí Chung (Tối đa 30 điểm)',
    scope: 'all',
    sourceOrigin: 'NĐ 233',
    description: 'Chấp hành nghiêm đường lối của Đảng, chính sách pháp luật Nhà nước; lập trường tư tưởng kiên định, không dao động; đặt lợi ích tập thể lên trên cá nhân; tham gia học tập chính trị, nghị quyết đầy đủ.',
    subCriteria: [
      { id: '1.1', text: 'Chấp hành chủ trương, đường lối, nghị quyết của Đảng, pháp luật của Nhà nước và quy định của Ngành GD&ĐT', score: 3 },
      { id: '1.2', text: 'Bản lĩnh chính trị vững vàng, kiên định lập trường, bảo vệ uy tín nhà trường và ngành giáo dục', score: 2.5 },
      { id: '1.3', text: 'Đặt lợi ích quốc gia, nhân dân và tập thể nhà trường lên trên lợi ích cá nhân; tinh thần trách nhiệm cao', score: 2.5 },
      { id: '1.4', text: 'Tích cực học tập chính trị hè, nghị quyết và bồi dưỡng thường xuyên theo kế hoạch', score: 2 }
    ]
  },
  {
    id: 'crit-2',
    code: 'I.2',
    title: 'Đạo đức, lối sống & Đạo đức nhà giáo',
    maxScore: 10,
    category: 'common',
    categoryTitle: 'Khung Tiêu Chí Chung (Tối đa 30 điểm)',
    scope: 'all',
    sourceOrigin: 'Tổng hợp 3 trường & NĐ 233',
    description: 'Thực hiện chuẩn mực đạo đức nhà giáo theo Thông tư 06/2019/TT-BGDĐT; không tiêu cực, lãng phí; sống trung thực, giản dị; giữ gìn đoàn kết nội bộ; thương yêu, tôn trọng nhân cách học sinh.',
    subCriteria: [
      { id: '2.1', text: 'Thực hiện chuẩn mực đạo đức nghề nghiệp, lối sống lành mạnh, trung thực, khiêm tốn, văn minh', score: 3 },
      { id: '2.2', text: 'Xây dựng khối đoàn kết nội bộ sư phạm (kết nối thân ái giữa 3 điểm trường và 2 cấp học)', score: 3 },
      { id: '2.3', text: 'Thương yêu, công bằng, tôn trọng nhân cách người học; không trù dập, không xúc phạm danh dự/thân thể học sinh', score: 2.5 },
      { id: '2.4', text: 'Không tiêu cực, không lợi dụng vị trí để trục lợi; không tham gia tệ nạn xã hội', score: 1.5 }
    ]
  },
  {
    id: 'crit-3',
    code: 'I.3',
    title: 'Tác phong, lề lối làm việc & Kỷ luật kỷ cương lao động',
    maxScore: 10,
    category: 'common',
    categoryTitle: 'Khung Tiêu Chí Chung (Tối đa 30 điểm)',
    scope: 'all',
    sourceOrigin: 'Tổng hợp 3 trường & NĐ 233',
    description: 'Chấp hành sự phân công của Ban Giám hiệu và Tổ trưởng; thực hiện ngày giờ công nghiêm túc; văn hóa công sở (trang phục, thẻ viên chức); không sử dụng điện thoại việc riêng trong giờ lên lớp.',
    subCriteria: [
      { id: '3.1', text: 'Chấp hành nghiêm túc sự phân công của BGH và Tổ chuyên môn (kể cả điều động dạy liền buổi tại các điểm trường)', score: 3 },
      { id: '3.2', text: 'Đảm bảo ngày giờ công, không bỏ tiết, không đi trễ về sớm trong các tiết dạy, buổi họp, chào cờ, lễ hội', score: 3 },
      { id: '3.3', text: 'Văn hóa công sở chuẩn mực: Trang phục đúng quy định, đeo thẻ viên chức, ứng xử chuẩn mực trên môi trường số/mạng xã hội', score: 2 },
      { id: '3.4', text: 'Thực hiện chế độ thông tin, báo cáo trung thực, kịp thời theo yêu cầu quản lý', score: 2 }
    ]
  },

  // --- NHÓM II: KẾT QUẢ THỰC HIỆN NHIỆM VỤ CHUYÊN MÔN (70 ĐIỂM) ---
  {
    id: 'crit-4',
    code: 'II.1',
    title: 'Thực hiện kế hoạch giáo dục, quy chế chuyên môn & tiến độ PPCT',
    maxScore: 20,
    category: 'duty',
    categoryTitle: 'Nhiệm Vụ Chuyên Môn & Giáo Dục (Tối đa 70 điểm)',
    scope: 'teacher',
    sourceOrigin: 'THPT ĐBK & THCS Tân Kiều',
    description: 'Giảng dạy đúng phân phối chương trình, không cắt xén, không dồn ép; dạy đủ 35 tuần thực học; thực hiện đầy đủ tiết thí nghiệm - thực hành; quản lý tốt nền nếp lớp học.',
    subCriteria: [
      { id: '4.1', text: 'Dạy đúng tiến độ PPCT và kế hoạch giáo dục môn học; không tùy tiện dồn ép hay cắt xén nội dung', score: 6 },
      { id: '4.2', text: 'Thực hiện nghiêm túc 100% tiết thực hành, thí nghiệm tại các phòng bộ môn của cả 3 điểm trường', score: 5 },
      { id: '4.3', text: 'Đổi mới phương pháp dạy học theo hướng phát triển năng lực, tích cực hóa hoạt động của học sinh (không đọc - chép)', score: 5 },
      { id: '4.4', text: 'Quản lý tốt trật tự, kỷ cương lớp học, không để học sinh làm ồn hoặc lang thang trong giờ học', score: 4 }
    ]
  },
  {
    id: 'crit-5',
    code: 'II.2',
    title: 'Hồ sơ sổ sách điện tử (vnEdu, Kế hoạch bài dạy số) & Chuyển đổi số',
    maxScore: 15,
    category: 'duty',
    categoryTitle: 'Nhiệm Vụ Chuyên Môn & Giáo Dục (Tối đa 70 điểm)',
    scope: 'teacher',
    sourceOrigin: 'THCS ĐBK & Chỉ đạo Sở',
    description: 'Thực hiện 100% hồ sơ điện tử theo Công văn 3635/SGDĐT-GDPT: Nộp giáo án vnEdu đúng hạn; vào sổ điểm, học bạ điện tử kịp thời; ghi chép sổ đầu bài đầy đủ; ứng dụng công nghệ và AI an toàn.',
    subCriteria: [
      { id: '5.1', text: 'Kế hoạch bài dạy (Giáo án) được phê duyệt đúng hạn trên vnEdu trước 02 ngày lên lớp; đúng khung Phụ lục Công văn 3284', score: 5 },
      { id: '5.2', text: 'Cập nhật sổ điểm cá nhân, sổ điểm điện tử, học bạ số đầy đủ, đúng tiến độ quy định của chuyên môn', score: 4 },
      { id: '5.3', text: 'Ký và ghi chép sổ đầu bài đầy đủ, chính xác, kịp thời sau mỗi tiết dạy', score: 3 },
      { id: '5.4', text: 'Ứng dụng hiệu quả học liệu số, tivi thông minh và công cụ AI hỗ trợ giảng dạy có kiểm chứng khoa học', score: 3 }
    ]
  },
  {
    id: 'crit-6',
    code: 'II.3',
    title: 'Chất lượng giảng dạy, kiểm tra đánh giá & không lệch điểm',
    maxScore: 15,
    category: 'duty',
    categoryTitle: 'Nhiệm Vụ Chuyên Môn & Giáo Dục (Tối đa 70 điểm)',
    scope: 'teacher',
    sourceOrigin: 'THPT ĐBK & THCS ĐBK',
    description: 'Đánh giá học sinh công bằng, khách quan theo Thông tư 22/2021/TT-BGDĐT; đủ số cột kiểm tra; đề kiểm tra ma trận chuẩn; không có sự chênh lệch bất thường giữa điểm thường xuyên và điểm kiểm tra định kỳ.',
    subCriteria: [
      { id: '6.1', text: 'Đủ số cột kiểm tra thường xuyên và định kỳ; ra đề bám sát ma trận, bản đặc tả; hướng dẫn chấm chính xác', score: 5 },
      { id: '6.2', text: 'Chấm thi công bằng, khách quan, chính xác (không sai sót tỷ lệ điểm khi đối soát bài thi tập trung)', score: 4 },
      { id: '6.3', text: 'Kiểm soát độ lệch điểm: Điểm TBM cả năm so với TB điểm thi HK không chênh lệch quá 2.0 điểm', score: 3 },
      { id: '6.4', text: 'Chất lượng bộ môn đạt chỉ tiêu đầu năm: Tỷ lệ học sinh đạt yêu cầu cần đạt (YCCĐ) theo kế hoạch của trường', score: 3 }
    ]
  },
  {
    id: 'crit-7',
    code: 'II.4',
    title: 'Công tác chủ nhiệm lớp, duy trì sĩ số & phối hợp giáo dục',
    maxScore: 10,
    category: 'duty',
    categoryTitle: 'Nhiệm Vụ Chuyên Môn & Giáo Dục (Tối đa 70 điểm)',
    scope: 'homeroom',
    sourceOrigin: 'Tổng hợp 3 trường',
    description: 'Quản lý tốt nề nếp lớp học; duy trì 100% sĩ số học sinh; tích cực vận động học sinh có nguy cơ bỏ học (đặc biệt học sinh có hoàn cảnh khó khăn tại điểm Tân Kiều); vận động BHYT đạt >= 95%; xếp hạng thi đua lớp tốt.',
    subCriteria: [
      { id: '7.1', text: 'Duy trì sĩ số học sinh lớp chủ nhiệm, có biên bản phối hợp phụ huynh vận động học sinh có nguy cơ nghỉ học', score: 3 },
      { id: '7.2', text: 'Vận động học sinh tham gia Bảo hiểm y tế đạt từ 95% đến 100%', score: 2.5 },
      { id: '7.3', text: 'Quản lý nề nếp thi đua tuần, tháng; giáo dục đạo đức học sinh; không để xảy ra bạo lực học đường, quay clip phát tán mạng', score: 2.5 },
      { id: '7.4', text: 'Phối hợp chặt chẽ với cha mẹ học sinh và các giáo viên bộ môn; tổ chức sinh hoạt 15 phút đầu giờ và tiết HĐTN-HN hiệu quả', score: 2 }
    ]
  },
  {
    id: 'crit-8',
    code: 'II.5',
    title: 'Sinh hoạt tổ chuyên môn, dự giờ thăm lớp & bồi dưỡng học sinh',
    maxScore: 10,
    category: 'duty',
    categoryTitle: 'Nhiệm Vụ Chuyên Môn & Giáo Dục (Tối đa 70 điểm)',
    scope: 'teacher',
    sourceOrigin: 'THCS ĐBK & THCS Tân Kiều',
    description: 'Tham gia sinh hoạt chuyên môn theo nghiên cứu bài học (2 tuần/lần, kết nối liên điểm); dự giờ đủ số tiết quy định; thao giảng/hội giảng; phụ đạo miễn phí học sinh có nguy cơ chưa đạt YCCĐ và bồi dưỡng HSG.',
    subCriteria: [
      { id: '8.1', text: 'Tham gia đầy đủ sinh hoạt tổ/nhóm chuyên môn theo định hướng nghiên cứu bài học; tích cực thảo luận chuyên đề', score: 3 },
      { id: '8.2', text: 'Thực hiện đầy đủ chỉ tiêu dự giờ thăm lớp (ít nhất 01 tiết/giáo viên trong tổ/năm) và tham gia thao giảng, hội giảng', score: 3 },
      { id: '8.3', text: 'Tích cực phụ đạo miễn phí cho học sinh có nguy cơ chưa đạt YCCĐ theo kế hoạch dạy học 2 buổi/ngày', score: 2 },
      { id: '8.4', text: 'Sử dụng hiệu quả thiết bị dạy học số và tự làm đồ dùng dạy học phục vụ bài giảng', score: 2 }
    ]
  }
];

// TIÊU CHÍ RIÊNG CHO NHÂN VIÊN VĂN PHÒNG & BỘ PHẬN CHUYÊN TRÁCH (THANG ĐIỂM 100)
export const STAFF_EMULATION_CRITERIA: EmulationCriterion[] = [
  {
    id: 'staff-1',
    code: 'I',
    title: 'Khung tiêu chí chung (Chính trị, Đạo đức, Tác phong)',
    maxScore: 30,
    category: 'common',
    categoryTitle: 'Khung Tiêu Chí Chung (30 điểm)',
    scope: 'staff',
    sourceOrigin: 'NĐ 233',
    description: 'Chính trị tư tưởng (10đ), Đạo đức lối sống (10đ), Tác phong văn hóa công vụ và giờ giấc làm việc (10đ).',
  },
  {
    id: 'staff-2',
    code: 'II.1',
    title: 'Thực hiện chức trách, vị trí việc làm chuyên môn được giao',
    maxScore: 35,
    category: 'duty',
    categoryTitle: 'Thực Hiện Nhiệm Vụ Chuyên Môn (70 điểm)',
    scope: 'staff',
    sourceOrigin: 'THCS ĐBK & THCS Tân Kiều',
    description: 'Hoàn thành khối lượng, chất lượng công việc theo đúng vị trí (Kế toán - Tài chính, Văn thư - Lưu trữ, Thư viện, Thiết bị thí nghiệm, Y tế học đường, Công nghệ thông tin, Bảo vệ). Báo cáo chính xác, kịp thời, không sai sót.',
  },
  {
    id: 'staff-3',
    code: 'II.2',
    title: 'Quản lý tài sản, cơ sở vật chất, hồ sơ sổ sách và phục vụ giảng dạy',
    maxScore: 20,
    category: 'duty',
    categoryTitle: 'Thực Hiện Nhiệm Vụ Chuyên Môn (70 điểm)',
    scope: 'staff',
    sourceOrigin: 'Tổng hợp 3 trường',
    description: 'Bảo quản tốt cơ sở vật chất tại cả 3 điểm trường; chuẩn bị thiết bị hóa chất an toàn; cấp phát sách báo kịp thời; vào sổ văn bản iOffice trong ngày; công khai tài chính minh bạch.',
  },
  {
    id: 'staff-4',
    code: 'II.3',
    title: 'Kỷ luật ngày giờ công, trực trường và an toàn cơ quan',
    maxScore: 15,
    category: 'duty',
    categoryTitle: 'Thực Hiện Nhiệm Vụ Chuyên Môn (70 điểm)',
    scope: 'staff',
    sourceOrigin: 'THCS ĐBK & THPT ĐBK',
    description: 'Thực hiện lịch trực cơ quan nghiêm túc (ngày lễ, hè, trực đêm); bảo đảm an ninh trật tự, phòng cháy chữa cháy và cảnh quan sư phạm xanh - sạch - đẹp.',
  }
];

// BẢNG QUY ĐỊNH CÁC LỖI VI PHẠM VÀ MỨC ĐIỂM TRỪ CHI TIẾT
// Kế thừa tinh hoa từ cả 3 trường và định lượng khoa học
export const PENALTY_RULES: PenaltyItem[] = [
  // --- A. VI PHẠM NGHIÊM TRỌNG: KHỐNG CHẾ XẾP LOẠI THẤP NHẤT (NĐ 233) ---
  {
    id: 'pen-sev-1',
    code: 'SEV-01',
    violation: 'Vi phạm nghiêm trọng về tư tưởng chính trị, phát ngôn sai trái, vi phạm chủ trương của Đảng, pháp luật của Nhà nước',
    penaltyScore: -100,
    unit: 'vụ',
    category: 'severe',
    categoryLabel: 'Vi Phạm Nghiêm Trọng (Khống Chế Xếp Loại Thấp Nhất)',
    conditionNote: 'Khống chế xếp loại KHÔNG HOÀN THÀNH NHIỆM VỤ, không xét thi đua và kỷ luật theo quy định pháp luật.',
    sourceSchool: 'Nghị định 233 & Yêu cầu chỉ đạo',
    isDisqualifying: true
  },
  {
    id: 'pen-sev-2',
    code: 'SEV-02',
    violation: 'Vi phạm nghiêm trọng đạo đức nhà giáo: Xúc phạm danh dự, nhân phẩm hoặc xâm phạm thân thể học sinh, đồng nghiệp (có kết luận xác minh)',
    penaltyScore: -100,
    unit: 'vụ',
    category: 'severe',
    categoryLabel: 'Vi Phạm Nghiêm Trọng (Khống Chế Xếp Loại Thấp Nhất)',
    conditionNote: 'Khống chế xếp loại KHÔNG HOÀN THÀNH NHIỆM VỤ, hạ bậc thi đua tối đa.',
    sourceSchool: 'Nghị định 233 & Yêu cầu chỉ đạo',
    isDisqualifying: true
  },
  {
    id: 'pen-sev-3',
    code: 'SEV-03',
    violation: 'Bị xử lý kỷ luật từ hình thức Khiển trách trở lên trong năm học',
    penaltyScore: -100,
    unit: 'lần',
    category: 'severe',
    categoryLabel: 'Vi Phạm Nghiêm Trọng (Khống Chế Xếp Loại Thấp Nhất)',
    conditionNote: 'Khống chế xếp loại KHÔNG HOÀN THÀNH NHIỆM VỤ theo Điều 13 Nghị định 233/2026/NĐ-CP.',
    sourceSchool: 'Nghị định 233/2026/NĐ-CP',
    isDisqualifying: true
  },
  {
    id: 'pen-sev-4',
    code: 'SEV-04',
    violation: 'Tổ chức hoặc tham gia dạy thêm sai quy định bị cấp có thẩm quyền lập biên bản hoặc kiểm tra xử lý',
    penaltyScore: -100,
    unit: 'lần',
    category: 'severe',
    categoryLabel: 'Vi Phạm Nghiêm Trọng (Khống Chế Xếp Loại Thấp Nhất)',
    conditionNote: 'Khống chế xếp loại KHÔNG HOÀN THÀNH NHIỆM VỤ, không xét thi đua năm học.',
    sourceSchool: 'THCS ĐBK & THCS Tân Kiều & THPT ĐBK',
    isDisqualifying: true
  },
  {
    id: 'pen-sev-5',
    code: 'SEV-05',
    violation: 'Vi phạm quy chế thi cử, gian lận sửa điểm, lộ đề kiểm tra hoặc đánh giá sai lệch kết quả học sinh mang tính chất nghiêm trọng',
    penaltyScore: -100,
    unit: 'vụ',
    category: 'severe',
    categoryLabel: 'Vi Phạm Nghiêm Trọng (Khống Chế Xếp Loại Thấp Nhất)',
    conditionNote: 'Khống chế xếp loại KHÔNG HOÀN THÀNH NHIỆM VỤ.',
    sourceSchool: 'THPT ĐBK & THCS Tân Kiều',
    isDisqualifying: true
  },
  {
    id: 'pen-sev-6',
    code: 'SEV-06',
    violation: 'Gây rối, chia rẽ mất đoàn kết nội bộ nghiêm trọng; kích động khiếu kiện trái quy định gây khủng hoảng truyền thông',
    penaltyScore: -100,
    unit: 'vụ',
    category: 'severe',
    categoryLabel: 'Vi Phạm Nghiêm Trọng (Khống Chế Xếp Loại Thấp Nhất)',
    conditionNote: 'Khống chế xếp loại KHÔNG HOÀN THÀNH NHIỆM VỤ.',
    sourceSchool: 'THCS ĐBK & THCS Tân Kiều',
    isDisqualifying: true
  },

  // --- B. KỶ LUẬT LAO ĐỘNG & NGÀY GIỜ CÔNG (KLLĐ) ---
  {
    id: 'pen-disc-1',
    code: 'KLLĐ-01',
    violation: 'Bỏ tiết giảng dạy không có lý do (hoặc bỏ tiết sinh hoạt lớp/họp GVCN)',
    penaltyScore: -5,
    unit: 'tiết',
    category: 'discipline',
    categoryLabel: 'Kỷ Luật Lao Động & Ngày Giờ Công',
    conditionNote: 'Lần 1 trừ 5đ/tiết. Lần 2 trừ 10đ/tiết. Có 02 biên bản của BGH không xét thi đua cả năm.',
    sourceSchool: 'THCS ĐBK & THPT ĐBK'
  },
  {
    id: 'pen-disc-2',
    code: 'KLLĐ-02',
    violation: 'Vào trễ hoặc ra sớm tiết dạy, buổi lễ, sinh hoạt dưới cờ (từ 5 đến 15 phút)',
    penaltyScore: -1,
    unit: 'lần',
    category: 'discipline',
    categoryLabel: 'Kỷ Luật Lao Động & Ngày Giờ Công',
    conditionNote: 'Trễ từ 15-20 phút: trừ 2đ/lần. Trễ quá 20 phút: trừ 4đ/lần. Nếu trễ từ 5 lần trở lên hạ một bậc thi đua.',
    sourceSchool: 'THPT ĐBK & THCS ĐBK'
  },
  {
    id: 'pen-disc-3',
    code: 'KLLĐ-03',
    violation: 'Vắng họp Hội đồng sư phạm, Đại hội, Khai giảng, Tổng kết không có lý do (hoặc bỏ về giữa chừng)',
    penaltyScore: -5,
    unit: 'lần',
    category: 'discipline',
    categoryLabel: 'Kỷ Luật Lao Động & Ngày Giờ Công',
    conditionNote: 'Nếu vắng có phép: trừ 1đ/lần (tính từ lần thứ 2).',
    sourceSchool: 'THCS ĐBK & THPT ĐBK & THCS Tân Kiều'
  },
  {
    id: 'pen-disc-4',
    code: 'KLLĐ-04',
    violation: 'Vắng sinh hoạt dưới cờ đầu tuần không có lý do',
    penaltyScore: -3,
    unit: 'lần',
    category: 'discipline',
    categoryLabel: 'Kỷ Luật Lao Động & Ngày Giờ Công',
    conditionNote: 'Vắng có phép tính từ lần 2 trừ 0.5đ/lần.',
    sourceSchool: 'THPT ĐBK & THCS ĐBK'
  },
  {
    id: 'pen-disc-5',
    code: 'KLLĐ-05',
    violation: 'Tự ý đổi tiết, nhờ dạy thay không báo cáo Tổ trưởng và Ban Giám hiệu',
    penaltyScore: -3,
    unit: 'lần',
    category: 'discipline',
    categoryLabel: 'Kỷ Luật Lao Động & Ngày Giờ Công',
    conditionNote: 'Trừ điểm cả người nhờ và người dạy thay (mỗi người 3đ).',
    sourceSchool: 'THCS ĐBK & THPT ĐBK'
  },
  {
    id: 'pen-disc-6',
    code: 'KLLĐ-06',
    violation: 'Vắng lớp bồi dưỡng chính trị hè, tập huấn chuyên môn các cấp không có lý do',
    penaltyScore: -5,
    unit: 'buổi',
    category: 'discipline',
    categoryLabel: 'Kỷ Luật Lao Động & Ngày Giờ Công',
    conditionNote: 'Vắng không phép cả đợt tập huấn Sở/Cụm thì không được xếp loại Tốt hoặc Xuất sắc.',
    sourceSchool: 'THCS ĐBK & THPT ĐBK & THCS Tân Kiều'
  },
  {
    id: 'pen-disc-7',
    code: 'KLLĐ-07',
    violation: 'Nghỉ việc riêng có phép cộng dồn quá 15 ngày trong năm học (trừ thai sản, nằm viện có giấy bác sĩ)',
    penaltyScore: -10,
    unit: 'năm',
    category: 'discipline',
    categoryLabel: 'Kỷ Luật Lao Động & Ngày Giờ Công',
    conditionNote: 'Khống chế tối đa xếp loại Hoàn thành nhiệm vụ.',
    sourceSchool: 'THPT ĐBK & THCS Tân Kiều'
  },

  // --- C. QUY CHẾ CHUYÊN MÔN & GIẢNG DẠY (QCCM) ---
  {
    id: 'pen-teach-1',
    code: 'QCCM-01',
    violation: 'Cắt xén hoặc dồn ép phân phối chương trình môn học sai quy định',
    penaltyScore: -5,
    unit: 'lần',
    category: 'teaching',
    categoryLabel: 'Quy Chế Chuyên Môn & Giảng Dạy',
    conditionNote: 'Có biên bản kiểm tra chuyên môn nhắc nhở.',
    sourceSchool: 'THCS Tân Kiều & THPT ĐBK'
  },
  {
    id: 'pen-teach-2',
    code: 'QCCM-02',
    violation: 'Không thực hiện hoặc bỏ các tiết thực hành, thí nghiệm theo phân phối chương trình',
    penaltyScore: -3,
    unit: 'tiết',
    category: 'teaching',
    categoryLabel: 'Quy Chế Chuyên Môn & Giảng Dạy',
    conditionNote: 'Trừ khi có lý do khách quan về hỏng hóc thiết bị đã báo cáo BGH.',
    sourceSchool: 'THCS Tân Kiều'
  },
  {
    id: 'pen-teach-3',
    code: 'QCCM-03',
    violation: 'Đuổi học sinh ra khỏi lớp sai quy định (để học sinh đi lang thang bên ngoài hoặc xuống căn tin)',
    penaltyScore: -2,
    unit: 'lần',
    category: 'teaching',
    categoryLabel: 'Quy Chế Chuyên Môn & Giảng Dạy',
    conditionNote: 'Nếu gây hậu quả nghiêm trọng trừ 5đ và xử lý kỷ luật.',
    sourceSchool: 'THCS ĐBK & THPT ĐBK'
  },
  {
    id: 'pen-teach-4',
    code: 'QCCM-04',
    violation: 'Sử dụng điện thoại di động vì mục đích cá nhân trong giờ lên lớp giảng dạy hoặc dự giờ',
    penaltyScore: -2,
    unit: 'lần',
    category: 'teaching',
    categoryLabel: 'Quy Chế Chuyên Môn & Giảng Dạy',
    conditionNote: 'Có biên bản ghi nhận của BGH hoặc Ban thanh tra nhân dân.',
    sourceSchool: 'THPT ĐBK'
  },
  {
    id: 'pen-teach-5',
    code: 'QCCM-05',
    violation: 'Để học sinh gây ồn ào mất trật tự hoặc đánh nhau trong giờ dạy mà không xử lý kịp thời',
    penaltyScore: -2,
    unit: 'lần',
    category: 'teaching',
    categoryLabel: 'Quy Chế Chuyên Môn & Giảng Dạy',
    conditionNote: 'Từ lần nhắc nhở thứ 2 trở lên trừ 3đ/lần.',
    sourceSchool: 'THPT ĐBK'
  },
  {
    id: 'pen-teach-6',
    code: 'QCCM-06',
    violation: 'Không dự giờ đủ số tiết quy định theo kế hoạch tổ chuyên môn (dưới 1 tiết/giáo viên/năm)',
    penaltyScore: -2,
    unit: 'tiết thiếu',
    category: 'teaching',
    categoryLabel: 'Quy Chế Chuyên Môn & Giảng Dạy',
    conditionNote: 'Bỏ thao giảng, hội giảng của trường/tổ: trừ 5đ/tiết.',
    sourceSchool: 'THCS ĐBK & THPT ĐBK'
  },
  {
    id: 'pen-teach-7',
    code: 'QCCM-07',
    violation: 'Không đăng ký mượn đồ dùng, thiết bị dạy học trên hệ thống phần mềm quản lý thiết bị',
    penaltyScore: -3,
    unit: 'học kỳ',
    category: 'teaching',
    categoryLabel: 'Quy Chế Chuyên Môn & Giảng Dạy',
    conditionNote: 'Căn cứ số liệu phần mềm quản lý thiết bị của nhân viên thiết bị cung cấp.',
    sourceSchool: 'THCS ĐBK'
  },

  // --- D. HỒ SƠ SỔ SÁCH & ĐÁNH GIÁ HỌC SINH (HSSS) ---
  {
    id: 'pen-rec-1',
    code: 'HSSS-01',
    violation: 'Không nộp Kế hoạch bài dạy (Giáo án) lên hệ thống vnEdu theo quy định',
    penaltyScore: -5,
    unit: 'lần',
    category: 'records',
    categoryLabel: 'Hồ Sơ Sổ Sách Điện Tử & Đánh Giá',
    conditionNote: 'Nộp trễ so với quy định chuyên môn trừ 2đ/lần.',
    sourceSchool: 'THCS ĐBK & THPT ĐBK'
  },
  {
    id: 'pen-rec-2',
    code: 'HSSS-02',
    violation: 'Kế hoạch bài dạy sơ sài, sao chép nguyên mẫu, không thể hiện chuỗi hoạt động học sinh',
    penaltyScore: -1,
    unit: 'tiết kiểm tra',
    category: 'records',
    categoryLabel: 'Hồ Sơ Sổ Sách Điện Tử & Đánh Giá',
    conditionNote: 'Căn cứ biên bản kiểm tra hồ sơ giáo án của Tổ trưởng hoặc BGH.',
    sourceSchool: 'THPT ĐBK & THCS Tân Kiều'
  },
  {
    id: 'pen-rec-3',
    code: 'HSSS-03',
    violation: 'Vào điểm, vào học bạ điện tử chậm tiến độ theo kế hoạch chuyên môn',
    penaltyScore: -2,
    unit: 'lần',
    category: 'records',
    categoryLabel: 'Hồ Sơ Sổ Sách Điện Tử & Đánh Giá',
    conditionNote: 'Căn cứ nhật ký trên phần mềm vnEdu do Phó Hiệu trưởng chuyên môn cung cấp.',
    sourceSchool: 'THCS ĐBK & THPT ĐBK'
  },
  {
    id: 'pen-rec-4',
    code: 'HSSS-04',
    violation: 'Thiếu cột điểm kiểm tra thường xuyên hoặc định kỳ sau thời hạn quy định 01 tuần',
    penaltyScore: -3,
    unit: 'lớp',
    category: 'records',
    categoryLabel: 'Hồ Sơ Sổ Sách Điện Tử & Đánh Giá',
    conditionNote: 'Thiếu cột điểm cuối năm không sửa chữa: Khống chế xếp loại Hoàn thành nhiệm vụ.',
    sourceSchool: 'THCS ĐBK & THPT ĐBK'
  },
  {
    id: 'pen-rec-5',
    code: 'HSSS-05',
    violation: 'Không ký, không phê sổ đầu bài hoặc ghi chép thiếu thông tin tiết dạy',
    penaltyScore: -1,
    unit: 'lần',
    category: 'records',
    categoryLabel: 'Hồ Sơ Sổ Sách Điện Tử & Đánh Giá',
    conditionNote: 'Từ lần thứ 3 trở lên trừ 2đ/lần.',
    sourceSchool: 'THPT ĐBK'
  },
  {
    id: 'pen-rec-6',
    code: 'HSSS-06',
    violation: 'Ra đề kiểm tra định kỳ sai sót ma trận, sai đáp án dẫn đến phải sửa điểm hoặc kiểm tra lại',
    penaltyScore: -3,
    unit: 'lần',
    category: 'records',
    categoryLabel: 'Hồ Sơ Sổ Sách Điện Tử & Đánh Giá',
    conditionNote: 'Nếu hủy kết quả thi của học sinh phải hạ một bậc thi đua.',
    sourceSchool: 'THPT ĐBK'
  },
  {
    id: 'pen-rec-7',
    code: 'HSSS-07',
    violation: 'Chấm thi sai sót lệch điểm khi chấm kiểm tra lại bài thi học kỳ',
    penaltyScore: -2,
    unit: 'bài lệch',
    category: 'records',
    categoryLabel: 'Hồ Sơ Sổ Sách Điện Tử & Đánh Giá',
    conditionNote: 'Lệch từ 0.5 - 1.0đ: trừ 2đ/bài; Lệch 1.0 - 2.0đ: trừ 4đ/bài; Lệch > 2.0đ: trừ 6đ/bài.',
    sourceSchool: 'THCS ĐBK & THPT ĐBK'
  },
  {
    id: 'pen-rec-8',
    code: 'HSSS-08',
    violation: 'Độ lệch điểm: Điểm TBM cuối năm lệch bất thường so với điểm thi học kỳ (lệch lớn hơn 2.5 điểm)',
    penaltyScore: -3,
    unit: 'môn/khối',
    category: 'records',
    categoryLabel: 'Hồ Sơ Sổ Sách Điện Tử & Đánh Giá',
    conditionNote: 'Không áp dụng cho các môn đánh giá bằng nhận xét.',
    sourceSchool: 'THCS ĐBK'
  },

  // --- E. CÔNG TÁC CHỦ NHIỆM LỚP & NỀ NẾP (GVCN) ---
  {
    id: 'pen-hom-1',
    code: 'CN-01',
    violation: 'Lớp chủ nhiệm có học sinh bỏ học mà GVCN không đi vận động (không có biên bản)',
    penaltyScore: -5,
    unit: 'học sinh',
    category: 'homeroom',
    categoryLabel: 'Công Tác Chủ Nhiệm Lớp',
    conditionNote: 'Nếu có biên bản phối hợp phụ huynh và chính quyền địa phương đầy đủ: trừ 1đ/học sinh.',
    sourceSchool: 'THCS ĐBK & THPT ĐBK & THCS Tân Kiều'
  },
  {
    id: 'pen-hom-2',
    code: 'CN-02',
    violation: 'Thu Bảo hiểm y tế học sinh lớp chủ nhiệm đạt dưới 95%',
    penaltyScore: -1,
    unit: 'mỗi 1% thiếu',
    category: 'homeroom',
    categoryLabel: 'Công Tác Chủ Nhiệm Lớp',
    conditionNote: 'Cứ mỗi 1% dưới 95% trừ 1 điểm (đạt từ 95% trở lên không trừ).',
    sourceSchool: 'THCS ĐBK'
  },
  {
    id: 'pen-hom-3',
    code: 'CN-03',
    violation: 'Học sinh lớp chủ nhiệm đánh nhau, vi phạm bạo lực học đường hoặc quay clip đăng tải lên mạng xã hội',
    penaltyScore: -5,
    unit: 'vụ',
    category: 'homeroom',
    categoryLabel: 'Công Tác Chủ Nhiệm Lớp',
    conditionNote: 'Căn cứ biên bản xử lý kỷ luật học sinh của nhà trường.',
    sourceSchool: 'THCS ĐBK'
  },
  {
    id: 'pen-hom-4',
    code: 'CN-04',
    violation: 'Lớp chủ nhiệm không tham gia các phong trào, hội thi tập thể bắt buộc của trường/Đoàn/Đội',
    penaltyScore: -3,
    unit: 'hội thi',
    category: 'homeroom',
    categoryLabel: 'Công Tác Chủ Nhiệm Lớp',
    conditionNote: 'Không hướng dẫn học sinh lao động vệ sinh trường lớp trừ 2đ/lần.',
    sourceSchool: 'THCS ĐBK & THPT ĐBK'
  },

  // --- F. VĂN HÓA CÔNG SỞ & ĐOÀN THỂ ---
  {
    id: 'pen-eth-1',
    code: 'VHCS-01',
    violation: 'Không đeo thẻ viên chức, sai trang phục quy định (thứ 2 nữ mặc áo dài, nam áo sơ mi có thắt lưng)',
    penaltyScore: -1,
    unit: 'lần',
    category: 'ethics',
    categoryLabel: 'Văn Hóa Công Sở & Quy Định Khác',
    conditionNote: 'Từ lần thứ 3 trở lên trừ 2đ/lần.',
    sourceSchool: 'THPT ĐBK & THCS ĐBK'
  },
  {
    id: 'pen-eth-2',
    code: 'VHCS-02',
    violation: 'Hút thuốc lá trong khuôn viên nhà trường hoặc nơi công cộng khi tham gia hoạt động giáo dục',
    penaltyScore: -5,
    unit: 'lần',
    category: 'ethics',
    categoryLabel: 'Văn Hóa Công Sở & Quy Định Khác',
    conditionNote: 'Xây dựng môi trường trường học không khói thuốc.',
    sourceSchool: 'THCS ĐBK'
  },
  {
    id: 'pen-eth-3',
    code: 'VHCS-03',
    violation: 'Không chấp hành nhiệm vụ đột xuất hoặc phân công điều động của nhà trường',
    penaltyScore: -5,
    unit: 'lần',
    category: 'ethics',
    categoryLabel: 'Văn Hóa Công Sở & Quy Định Khác',
    conditionNote: 'Tùy tính chất mức độ trừ từ 3 đến 5 điểm.',
    sourceSchool: 'THPT ĐBK & THCS Tân Kiều'
  }
];

// BẢNG QUY ĐỊNH ĐIỂM THƯỞNG KHUYẾN KHÍCH (TỐI ĐA 20 ĐIỂM CỘNG THÊM)
export const BONUS_RULES: BonusItem[] = [
  // 1. Học sinh giỏi & Hội thi chuyên môn
  {
    id: 'bon-1',
    code: 'THUONG-01',
    achievement: 'Bồi dưỡng học sinh giỏi văn hóa đạt giải Cấp Cụm / Cấp Huyện (nếu có tổ chức)',
    bonusScore: 5,
    unit: 'giải',
    category: 'student_prize',
    categoryLabel: 'Bồi Dưỡng Học Sinh Giỏi & Hội Thi Sáng Tạo',
    detail: 'Giải Nhất: 6đ; Giải Nhì: 5đ; Giải Ba: 4đ; Giải Khuyến khích: 3đ.',
    sourceSchool: 'THCS ĐBK & THCS Tân Kiều'
  },
  {
    id: 'bon-2',
    code: 'THUONG-02',
    achievement: 'Bồi dưỡng học sinh giỏi văn hóa đạt giải Cấp Tỉnh',
    bonusScore: 10,
    unit: 'giải',
    category: 'student_prize',
    categoryLabel: 'Bồi Dưỡng Học Sinh Giỏi & Hội Thi Sáng Tạo',
    detail: 'Giải Nhất: 15đ; Giải Nhì: 12đ; Giải Ba: 10đ; Giải Khuyến khích: 8đ.',
    sourceSchool: 'THCS ĐBK & THCS Tân Kiều'
  },
  {
    id: 'bon-3',
    code: 'THUONG-03',
    achievement: 'Bồi dưỡng học sinh đạt giải Cấp Toàn Quốc (hoặc dự thi quốc gia)',
    bonusScore: 20,
    unit: 'giải',
    category: 'student_prize',
    categoryLabel: 'Bồi Dưỡng Học Sinh Giỏi & Hội Thi Sáng Tạo',
    detail: 'Tham gia vòng quốc gia: 10đ; Đạt giải quốc gia: 20đ.',
    sourceSchool: 'THCS ĐBK'
  },
  {
    id: 'bon-4',
    code: 'THUONG-04',
    achievement: 'Hướng dẫn học sinh đạt giải Sáng tạo KHKT, STEM, Ý tưởng khởi nghiệp các cấp',
    bonusScore: 8,
    unit: 'sản phẩm',
    category: 'student_prize',
    categoryLabel: 'Bồi Dưỡng Học Sinh Giỏi & Hội Thi Sáng Tạo',
    detail: 'Tính điểm tương đương giải HSG văn hóa. Giải tập thể tính gấp đôi.',
    sourceSchool: 'THCS ĐBK & THCS Tân Kiều'
  },

  // 2. Giáo viên dạy giỏi & Danh hiệu nghề nghiệp
  {
    id: 'bon-5',
    code: 'THUONG-05',
    achievement: 'Đạt danh hiệu Giáo viên dạy giỏi / Giáo viên chủ nhiệm giỏi Cấp Trường',
    bonusScore: 5,
    unit: 'danh hiệu',
    category: 'teacher_prize',
    categoryLabel: 'Giáo Viên Dạy Giỏi & Danh Hiệu Sư Phạm',
    detail: 'Căn cứ quyết định công nhận của Hiệu trưởng.',
    sourceSchool: 'THCS Tân Kiều'
  },
  {
    id: 'bon-6',
    code: 'THUONG-06',
    achievement: 'Đạt danh hiệu Giáo viên dạy giỏi Cấp Huyện / Cấp Xã',
    bonusScore: 10,
    unit: 'danh hiệu',
    category: 'teacher_prize',
    categoryLabel: 'Giáo Viên Dạy Giỏi & Danh Hiệu Sư Phạm',
    detail: 'Căn cứ quyết định khen thưởng của cấp có thẩm quyền.',
    sourceSchool: 'THCS ĐBK & THCS Tân Kiều'
  },
  {
    id: 'bon-7',
    code: 'THUONG-07',
    achievement: 'Đạt danh hiệu Giáo viên dạy giỏi Cấp Tỉnh hoặc danh hiệu "Viên phấn vàng"',
    bonusScore: 15,
    unit: 'danh hiệu',
    category: 'teacher_prize',
    categoryLabel: 'Giáo Viên Dạy Giỏi & Danh Hiệu Sư Phạm',
    detail: 'GVDG cấp Tỉnh: 15đ; Viên phấn vàng: 20đ.',
    sourceSchool: 'THCS ĐBK & THCS Tân Kiều'
  },
  {
    id: 'bon-8',
    code: 'THUONG-08',
    achievement: 'Có Sáng kiến kinh nghiệm (SKKN) được công nhận hiệu quả áp dụng cấp ngành / cấp tỉnh',
    bonusScore: 10,
    unit: 'sáng kiến',
    category: 'teacher_prize',
    categoryLabel: 'Giáo Viên Dạy Giỏi & Danh Hiệu Sư Phạm',
    detail: 'Cấp cơ sở: 5đ; Cấp tỉnh: 10đ.',
    sourceSchool: 'Nghị định 233 & Luật TĐKT'
  },

  // 3. Thi tuyển sinh 10 & Thi tốt nghiệp THPT
  {
    id: 'bon-9',
    code: 'THUONG-09',
    achievement: 'Giảng dạy các môn thi tuyển sinh vào lớp 10 có tỷ lệ học sinh đỗ cao vượt chỉ tiêu (cấp THCS)',
    bonusScore: 10,
    unit: 'môn/năm',
    category: 'exam_10_tn',
    categoryLabel: 'Kết Quả Tuyển Sinh Lớp 10 & Thi Tốt Nghiệp THPT',
    detail: 'Môn Văn, Toán đạt tỷ lệ trên 75% đỗ: +10đ; Tiếng Anh trên 65%: +10đ (chia đều nếu nhiều GV dạy).',
    sourceSchool: 'THCS Tân Kiều'
  },
  {
    id: 'bon-10',
    code: 'THUONG-10',
    achievement: 'Giảng dạy khối 12 có tỷ lệ tốt nghiệp THPT và điểm bình quân bài thi cao hơn mặt bằng tỉnh (cấp THPT)',
    bonusScore: 10,
    unit: 'môn/năm',
    category: 'exam_10_tn',
    categoryLabel: 'Kết Quả Tuyển Sinh Lớp 10 & Thi Tốt Nghiệp THPT',
    detail: 'Khuyến khích giáo viên trực tiếp ôn tập khối 12 đạt kết quả xuất sắc.',
    sourceSchool: 'THPT ĐBK'
  },

  // 4. Công tác chủ nhiệm & Duy trì sĩ số
  {
    id: 'bon-11',
    code: 'THUONG-11',
    achievement: 'GVCN duy trì 100% sĩ số học sinh cả năm học (không có học sinh bỏ học)',
    bonusScore: 5,
    unit: 'năm',
    category: 'duty_honor',
    categoryLabel: 'Thành Tích Chủ Nhiệm & Hoạt Động Đoàn Thể',
    detail: 'Bảo đảm duy trì sĩ số học sinh, đặc biệt tại điểm Tân Kiều.',
    sourceSchool: 'THCS ĐBK & THCS Tân Kiều'
  },
  {
    id: 'bon-12',
    code: 'THUONG-12',
    achievement: 'GVCN vận động BHYT học sinh đạt 100%',
    bonusScore: 3,
    unit: 'năm',
    category: 'duty_honor',
    categoryLabel: 'Thành Tích Chủ Nhiệm & Hoạt Động Đoàn Thể',
    detail: 'Đạt 96% - 99%: +2đ; Đạt 100%: +3đ.',
    sourceSchool: 'THCS ĐBK'
  },
  {
    id: 'bon-13',
    code: 'THUONG-13',
    achievement: 'Lớp chủ nhiệm đạt giải Nhất, Nhì trong các phong trào thi đua tuần, văn nghệ, TDTT của trường',
    bonusScore: 3,
    unit: 'giải',
    category: 'duty_honor',
    categoryLabel: 'Thành Tích Chủ Nhiệm & Hoạt Động Đoàn Thể',
    detail: 'Giải Nhất: 3đ; Giải Nhì: 2đ; Giải Ba: 1đ.',
    sourceSchool: 'THCS ĐBK & THCS Tân Kiều'
  },

  // 5. Phong trào, từ thiện & Hiến máu nhân đạo
  {
    id: 'bon-14',
    code: 'THUONG-14',
    achievement: 'Tham gia phong trào Hiến máu nhân đạo (có giấy chứng nhận)',
    bonusScore: 10,
    unit: 'lần',
    category: 'movement_donation',
    categoryLabel: 'Phong Trào Tình Nguyện & Nghĩa Cử Nhân Ái',
    detail: 'Lan tỏa tinh thần tương thân tương ái trong tập thể sư phạm.',
    sourceSchool: 'THCS ĐBK & THCS Tân Kiều'
  },
  {
    id: 'bon-15',
    code: 'THUONG-15',
    achievement: 'Thực hiện việc làm nghĩa hiệp, cứu giúp người gặp nạn hoặc hoạt động từ thiện được xã hội biểu dương',
    bonusScore: 10,
    unit: 'lần',
    category: 'movement_donation',
    categoryLabel: 'Phong Trào Tình Nguyện & Nghĩa Cử Nhân Ái',
    detail: 'Được các cấp chính quyền tặng giấy khen hoặc thư khen.',
    sourceSchool: 'THCS Tân Kiều'
  },
  {
    id: 'bon-16',
    code: 'THUONG-16',
    achievement: 'Cán bộ kiêm nhiệm (Tổ trưởng, TKHĐ, Bí thư Đoàn, Tổng phụ trách Đội) hoàn thành xuất sắc nhiệm vụ',
    bonusScore: 5,
    unit: 'năm',
    category: 'duty_honor',
    categoryLabel: 'Thành Tích Chủ Nhiệm & Hoạt Động Đoàn Thể',
    detail: 'Tổ chức đoàn thể được cấp trên xếp loại Vững mạnh xuất sắc.',
    sourceSchool: 'THCS ĐBK & THPT ĐBK & THCS Tân Kiều'
  }
];

// NGUYÊN TẮC XẾP LOẠI CHUẨN NGHỊ ĐỊNH 233/2026/NĐ-CP
export const RATING_STANDARDS = [
  {
    level: 'HTXSNV',
    title: 'HOÀN THÀNH XUẤT SẮC NHIỆM VỤ',
    scoreRange: 'Từ 90 đến 100 điểm (và điểm thưởng)',
    minScore: 90,
    maxScore: 120,
    quota: 'Không vượt quá 20% tổng số viên chức Hoàn thành tốt nhiệm vụ của trường',
    conditions: [
      'Điểm đánh giá từ 90 điểm trở lên.',
      'Không có tiêu chí nào bị đánh giá không đạt.',
      'Không có vi phạm bị trừ điểm kỷ luật lao động hoặc hồ sơ sổ sách.',
      'Có ít nhất 01 sáng kiến, giải pháp đổi mới được áp dụng hiệu quả HOẶC bồi dưỡng học sinh đạt giải cấp tỉnh/huyện trở lên HOẶC đạt giải giáo viên dạy giỏi.',
      'Tỷ lệ khống chế theo Nghị định 233: Tối đa 20% số viên chức Hoàn thành tốt.'
    ],
    color: 'emerald'
  },
  {
    level: 'HTTNV',
    title: 'HOÀN THÀNH TỐT NHIỆM VỤ',
    scoreRange: 'Từ 70 đến dưới 90 điểm',
    minScore: 70,
    maxScore: 89.9,
    quota: 'Không khống chế tỷ lệ',
    conditions: [
      'Điểm đánh giá từ 70 điểm đến dưới 90 điểm.',
      'Các tiêu chí chuyên môn đạt tiến độ và yêu cầu.',
      'Không vi phạm kỷ luật từ hình thức khiển trách trở lên.',
      'Hoàn thành đầy đủ hồ sơ sổ sách và tiến độ chương trình.'
    ],
    color: 'blue'
  },
  {
    level: 'HTNV',
    title: 'HOÀN THÀNH NHIỆM VỤ',
    scoreRange: 'Từ 50 đến dưới 70 điểm',
    minScore: 50,
    maxScore: 69.9,
    quota: 'Không khống chế tỷ lệ',
    conditions: [
      'Điểm đánh giá từ 50 điểm đến dưới 70 điểm.',
      'Có một số thiếu sót nhỏ trong thực hiện nhiệm vụ đã được nhắc nhở khắc phục.',
      'Nghỉ việc riêng có phép từ 15 ngày trở lên hoặc có vi phạm trừ điểm ở mức độ vừa phải.'
    ],
    color: 'amber'
  },
  {
    level: 'KHTNV',
    title: 'KHÔNG HOÀN THÀNH NHIỆM VỤ (Xếp loại thấp nhất)',
    scoreRange: 'Dưới 50 điểm HOẶC vi phạm nghiêm trọng',
    minScore: 0,
    maxScore: 49.9,
    quota: 'Theo thực tế vi phạm',
    conditions: [
      'Điểm đánh giá dưới 50 điểm.',
      'HOẶC vi phạm nghiêm trọng về tư tưởng chính trị, đạo đức nhà giáo, lối sống.',
      'HOẶC bị xử lý kỷ luật từ Khiển trách trở lên trong năm đánh giá.',
      'HOẶC vi phạm dạy thêm học thêm trái quy định bị cơ quan chức năng lập biên bản/xử lý.',
      'HOẶC vi phạm nghiêm trọng quy chế thi cử, gian lận trong kiểm tra đánh giá học sinh.',
      'HOẶC gây mất đoàn kết nội bộ nghiêm trọng, kích động khiếu kiện trái quy định.'
    ],
    color: 'rose'
  }
];

// MA TRẬN ĐỐI CHIẾU TIẾP THU TỪ 3 TRƯỜNG CŨ VÀ NGHỊ ĐỊNH 233
export const COMPARISON_MATRIX = [
  {
    aspect: 'Khung thang điểm tổng quát',
    nd233: 'Quy định thang điểm 100: 30 điểm tiêu chí chung + 70 điểm kết quả thực hiện nhiệm vụ.',
    thptDbk: 'Quỹ điểm KLLĐ-QCCM 20đ + Tính điểm TBCM (hệ số 3) + Điểm CN (7.4 đến 10đ). Khá phức tạp với các công thức toán học.',
    thcsDbk: 'Bảng điểm 100đ: Chính sách PL 20đ + Điểm lệch 20đ + Kỷ luật & Chuyên môn 60đ + Điểm ưu tiên cộng thêm.',
    thcsTanKieu: '16 Tiêu chuẩn điều kiện + Thang điểm 100 tiêu chuẩn chung + 90 điểm chuyên môn + Điểm thưởng.',
    adoptedSolution: 'Chuẩn hóa tuyệt đối theo thang điểm 100 của Nghị định 233 (30đ chung + 70đ chuyên môn + tối đa 20đ thưởng) để bảo đảm tính pháp lý cao nhất.'
  },
  {
    aspect: 'Xử lý vi phạm nghiêm trọng (Đạo đức & Chính trị)',
    nd233: 'Xếp loại Không hoàn thành nhiệm vụ nếu suy thoái chính trị, đạo đức hoặc bị kỷ luật từ khiển trách trở lên.',
    thptDbk: 'Khống chế thi đua, hạ bậc thi đua hoặc xếp loại C/D đối với các trường hợp bị tố cáo có xác minh.',
    thcsDbk: 'Bị khống chế không xét thi đua khi vi phạm đạo đức nhà giáo, luật giao thông, mất đoàn kết.',
    thcsTanKieu: 'Quy định 16 tiêu chuẩn điều kiện tiên quyết: vi phạm đạo đức, chính trị là "Không xếp loại" và "Không xét thi đua".',
    adoptedSolution: 'Quy định cứng theo chỉ đạo của Phó Hiệu trưởng: Vi phạm nghiêm trọng về đạo đức nhà giáo, tư tưởng chính trị bị xếp loại THẤP NHẤT (Không hoàn thành nhiệm vụ), đồng thời không xét thi đua.'
  },
  {
    aspect: 'Hồ sơ sổ sách điện tử (vnEdu)',
    nd233: 'Yêu cầu ứng dụng công nghệ thông tin, chuyển đổi số và sản phẩm công việc cụ thể.',
    thptDbk: 'Trừ điểm trễ học bạ (-0.5đ), thiếu HSSS (-1đ/loại), giáo án sơ sài (-0.25đ/tiết).',
    thcsDbk: 'Trừ điểm không nộp giáo án vnEdu (-10đ), nộp trễ (-2đ), vào sổ điểm chậm (-2đ), thiếu cột điểm (-5đ).',
    thcsTanKieu: 'Trừ điểm thiếu hồ sơ (-5đ/loại), nộp chậm (-1đ/ngày), nộp sai (-2đ/lần).',
    adoptedSolution: 'Cập nhật theo Công văn 3635/SGDĐT-GDPT của Sở GDĐT: Sử dụng 100% hồ sơ số trên vnEdu, trừ điểm rõ ràng cho từng hành vi chậm trễ hoặc bỏ nộp.'
  },
  {
    aspect: 'Kiểm soát chênh lệch điểm & Chấm thi',
    nd233: 'Đánh giá dựa trên kết quả thực chất và minh bạch.',
    thptDbk: 'Trừ điểm khi chấm thi sai sót theo tỷ lệ % (từ 0.1đ đến 3.0đ); tỷ lệ điểm dưới 5 quá cao hoặc điểm liệt.',
    thcsDbk: 'Quy định mức độ lệch giữa TBM và điểm thi HK: lệch > 2.5đ bị trừ 3đ; chấm lại bài thi lệch điểm bị trừ từ 2đ đến 6đ/bài.',
    thcsTanKieu: 'Chỉ tiêu điểm TBM >= 5.0 đạt 98.5%; điểm thi HKII >= 5.0 đạt từ 70% trở lên.',
    adoptedSolution: 'Tích hợp cả 2 cơ chế: Kiểm soát độ lệch giữa TBM và điểm thi HK (ngừa bệnh thành tích) và trừ điểm khi chấm thi sai sót qua đối soát chéo.'
  },
  {
    aspect: 'Công tác chủ nhiệm & Duy trì sĩ số',
    nd233: 'Đánh giá qua hiệu quả thực hiện nhiệm vụ kiêm nhiệm được phân công.',
    thptDbk: 'Hệ số chênh lệch học lực đầu năm giữa các lớp và hệ số giữa các khối 10, 11, 12; trừ 1đ/HS bỏ học.',
    thcsDbk: 'Trừ 10đ/HS bỏ học không vận động; BHYT dưới 95% trừ 1đ/%; thi đua tuần, lao động.',
    thcsTanKieu: 'Tiêu chuẩn điều kiện không có HS bỏ học không phép; cộng 5đ nếu không có HS bỏ học.',
    adoptedSolution: 'Áp dụng cho cả 2 cấp: Duy trì 100% sĩ số (+5đ), có HS bỏ học không vận động (-5đ đến -10đ), BHYT >= 95%, không để bạo lực học đường/quay clip (-5đ).'
  },
  {
    aspect: 'Bồi dưỡng học sinh giỏi & Phong trào',
    nd233: 'Khuyến khích sáng kiến, thành tích xuất sắc vượt trội làm căn cứ xét hoàn thành xuất sắc.',
    thptDbk: 'Cộng điểm thưởng vào kết quả THTĐ hoặc TBCM cho các phong trào.',
    thcsDbk: 'Cộng điểm chi tiết cho HSG cụm (12-15đ), tỉnh (16-22đ), quốc gia (10-20đ); GVDG xã 20đ, tỉnh 30đ, Viên phấn vàng 40đ; Hiến máu 5đ.',
    thcsTanKieu: 'Bảng điểm thưởng phong trào bắt buộc và không bắt buộc; GVDG trường 10đ, xã 20đ, tỉnh 40đ; Tuyển sinh 10 (+/-10đ); Hiến máu 10đ.',
    adoptedSolution: 'Hợp nhất thành bảng điểm thưởng khoa học (tối đa 20đ cộng thêm) gồm HSG, GVDG, Tuyển sinh 10, Tốt nghiệp THPT, STEM, Hiến máu nhân đạo (10đ).'
  },
  {
    aspect: 'Đặc thù trường liên cấp 3 điểm trường',
    nd233: 'Phù hợp đặc thù cơ quan, đơn vị sự nghiệp.',
    thptDbk: 'Áp dụng cho cấp THPT.',
    thcsDbk: 'Áp dụng cho THCS điểm Đốc Binh Kiều.',
    thcsTanKieu: 'Áp dụng cho THCS điểm Tân Kiều.',
    adoptedSolution: 'Thống nhất cho cả 53 lớp và 120 CB-GV-NV: Ưu tiên điều kiện công tác cho giáo viên dạy tại điểm Tân Kiều cách 11km; sinh hoạt chuyên môn trực tuyến liên điểm.'
  }
];
