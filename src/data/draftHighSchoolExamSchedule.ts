import { SchoolDocument } from '../types/document';

/** Working draft only; not an approved replacement for Plan 52. */
export const DRAFT_SCHEDULE_ADJUSTMENT: SchoolDocument = {
  id: 'draft-ktdg-52-high-school-sessions',
  type: 'plan',
  typeLabel: 'Dự thảo',
  documentNumber: 'DỰ THẢO - CHƯA BAN HÀNH',
  title: 'LỊCH KIỂM TRA ĐỊNH KỲ',
  subTitle: 'Phương án phân ca kiểm tra giữa kỳ cấp THPT - năm học 2026 - 2027',
  signDate: 'Đồng Tháp, ngày 06 tháng 10 năm 2026',
  createdDate: '2026-10-06T00:00:00.000Z',
  issuingAuthorityTop: 'SỞ GDĐT TỈNH ĐỒNG THÁP',
  issuingAuthority: 'TRƯỜNG THCS VÀ THPT\nĐỐC BINH KIỀU',
  signerRole: 'DỰ THẢO - TRÌNH BAN GIÁM HIỆU XEM XÉT',
  signerName: '',
  sourceDirective: 'Phương án dự thảo điều chỉnh lịch kiểm tra tại Kế hoạch số 52/KH-THCS&THPTĐBK; chưa được phê duyệt.',
  sourceDirectiveFullText: 'Thời khóa biểu và cách phân môn trong bảng là phương án tổ chức do nhà trường xây dựng theo đặc thù môn học lựa chọn và đề nghị chuyên môn; văn bản Bộ/Sở không ấn định lịch ngày, giờ cụ thể này. Cần tổ chuyên môn rà soát và Hiệu trưởng phê duyệt trước khi ban hành.',
  legalBases: [],
  sections: [
    {
      heading: 'LƯU Ý VỀ TÍNH CHẤT DỰ THẢO',
      content: 'Hai bảng dưới đây được tách riêng theo nhóm khối: Khối 11–12 kiểm tra buổi sáng; Khối 10 kiểm tra buổi chiều. Thứ Năm, các cặp Hóa học/GDKT&PL và Tin học/Công nghệ là các môn lựa chọn: học sinh chỉ dự kiểm tra môn mình học; cần bố trí đề và phòng kiểm tra tương ứng, có thể cùng khung giờ. Đây là phương án dự thảo, không phải lịch đã ban hành. Khung giờ trong bảng theo thời lượng bài kiểm tra và bố trí nghỉ giữa các môn; đề nghị tổ chuyên môn xác nhận môn học thực tế của từng khối, phòng thi và nhân sự trước khi trình Hiệu trưởng.'
    },
    { heading: 'PHỤ LỤC I: LỊCH KIỂM TRA GIỮA HỌC KỲ I - KHỐI 11, 12 (BUỔI SÁNG)', content: '' },
    { heading: 'PHỤ LỤC II: LỊCH KIỂM TRA GIỮA HỌC KỲ I - KHỐI 10 (BUỔI CHIỀU)', content: '' },
    { heading: 'PHỤ LỤC III: LỊCH KIỂM TRA GIỮA HỌC KỲ II - KHỐI 11, 12 (BUỔI SÁNG)', content: '' },
    { heading: 'PHỤ LỤC IV: LỊCH KIỂM TRA GIỮA HỌC KỲ II - KHỐI 10 (BUỔI CHIỀU)', content: '' }
  ],
  recipients: [],
  status: 'draft'
};

const examDays = [
  {
    weekday: 'Thứ Hai', dateI: '02/11/2026', dateII: '08/03/2027', exams: [
      { subject: 'Ngữ văn', duration: '90 phút', timeMorning: '7h30 - 9h00', timeAfternoon: '13h30 - 15h00', note: 'Tự luận' },
      { subject: 'Vật lí', duration: '50 phút', timeMorning: '9h30 - 10h20', timeAfternoon: '15h30 - 16h20', note: 'Theo ma trận, đặc tả đã được phê duyệt' }
    ]
  },
  {
    weekday: 'Thứ Ba', dateI: '03/11/2026', dateII: '09/03/2027', exams: [
      { subject: 'Toán', duration: '90 phút', timeMorning: '7h30 - 9h00', timeAfternoon: '13h30 - 15h00', note: 'Theo ma trận, đặc tả đã được phê duyệt' },
      { subject: 'Sinh học', duration: '50 phút', timeMorning: '9h30 - 10h20', timeAfternoon: '15h30 - 16h20', note: 'Theo ma trận, đặc tả đã được phê duyệt' }
    ]
  },
  {
    weekday: 'Thứ Tư', dateI: '04/11/2026', dateII: '10/03/2027', exams: [
      { subject: 'Tiếng Anh', duration: '60 phút', timeMorning: '7h30 - 8h30', timeAfternoon: '13h30 - 14h30', note: 'Theo ma trận, đặc tả đã được phê duyệt' },
      { subject: 'Địa lí', duration: '50 phút', timeMorning: '9h00 - 9h50', timeAfternoon: '15h00 - 15h50', note: 'Theo ma trận, đặc tả đã được phê duyệt' }
    ]
  },
  {
    weekday: 'Thứ Năm', dateI: '05/11/2026', dateII: '11/03/2027', exams: [
      { subject: 'Hóa học hoặc GDKT&PL (theo môn học sinh lựa chọn)', duration: '50 phút', timeMorning: '7h30 - 8h20', timeAfternoon: '13h30 - 14h20', note: 'Cùng khung giờ, phòng và đề riêng theo môn lựa chọn' },
      { subject: 'Tin học hoặc Công nghệ (theo môn học sinh lựa chọn)', duration: '50 phút', timeMorning: '8h50 - 9h40', timeAfternoon: '14h50 - 15h40', note: 'Cùng khung giờ, phòng và đề riêng theo môn lựa chọn' }
    ]
  },
  {
    weekday: 'Thứ Sáu', dateI: '06/11/2026', dateII: '12/03/2027', exams: [
      { subject: 'Lịch sử', duration: '50 phút', timeMorning: '7h30 - 8h20', timeAfternoon: '13h30 - 14h20', note: 'Theo ma trận, đặc tả đã được phê duyệt' }
    ]
  }
];

const buildGradeTable = (semester: 1 | 2, gradeLabel: '11, 12' | '10') => {
  const isMorning = gradeLabel === '11, 12';
  const session = isMorning ? 'Sáng' : 'Chiều';
  const rows = examDays.flatMap((day) => day.exams.map((exam) => {
    const date = semester === 1 ? day.dateI : day.dateII;
    const time = isMorning ? exam.timeMorning : exam.timeAfternoon;
    return `| ${day.weekday}, ${date} | ${session} | ${time} | ${exam.subject} | ${gradeLabel} | ${exam.duration} | ${exam.note} |`;
  }));
  const fromDate = semester === 1 ? '02/11' : '08/03';
  const toDate = semester === 1 ? '06/11/2026' : '12/03/2027';

  return [
    `Địa điểm: Điểm chính. Đối tượng: Khối ${gradeLabel}. Buổi kiểm tra: ${session.toLowerCase()}.`,
    '',
    '| Thứ, ngày | Buổi | Thời gian làm bài | Môn kiểm tra | Khối lớp | Thời lượng | Ghi chú |',
    '|:----------|:----:|:-----------------:|:------------|:--------:|:----------:|:--------|',
    ...rows,
    '',
    '* Lưu ý tổ chức:',
    '- Học sinh chỉ kiểm tra môn lựa chọn mình đang học; riêng các môn ghép lựa chọn cần bố trí phòng và đề kiểm tra riêng, dù cùng khung giờ.',
    '- Học sinh có mặt trước giờ phát đề tối thiểu 20 phút để ổn định vị trí và nghe phổ biến quy chế.',
    `- Các môn kiểm tra tại lớp thực hiện theo thời khóa biểu chính khóa từ ngày ${fromDate} đến ngày ${toDate}.`,
    '- Ngày, ca và giờ trong bảng là phương án dự thảo của nhà trường; tổ chuyên môn rà soát theo kế hoạch dạy học thực tế và trình Hiệu trưởng phê duyệt trước khi ban hành.'
  ].join('\n');
};

DRAFT_SCHEDULE_ADJUSTMENT.sections[1].content = buildGradeTable(1, '11, 12');
DRAFT_SCHEDULE_ADJUSTMENT.sections[2].content = buildGradeTable(1, '10');
DRAFT_SCHEDULE_ADJUSTMENT.sections[3].content = buildGradeTable(2, '11, 12');
DRAFT_SCHEDULE_ADJUSTMENT.sections[4].content = buildGradeTable(2, '10');
