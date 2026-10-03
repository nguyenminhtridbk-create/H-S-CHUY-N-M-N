import { SchoolDocument } from '../types/document';

/**
 * Standard School Profile of Trường THCS & THPT Đốc Binh Kiều
 * Sourced directly from the official 25-page Kế hoạch Giáo dục Nhà trường năm học 2026-2027
 */
export const SCHOOL_OFFICIAL_PROFILE = {
  name: 'TRƯỜNG THCS VÀ THPT ĐỐC BINH KIỀU',
  authorityTop: 'SỞ GDĐT TỈNH ĐỒNG THÁP',
  mergeDecision: 'Quyết định số 2606/QĐ-UBND ngày 13/8/2026 của UBND tỉnh Đồng Tháp về việc sáp nhập THCS Đốc Binh Kiều, THCS Tân Kiều và THPT Đốc Binh Kiều thành Trường THCS và THPT Đốc Binh Kiều.',
  totalClasses: 53,
  totalStudents: 2143,
  disabledStudents: 25,
  totalStaff: 120,
  principals: 4,
  teachers: 102,
  staff: 14,
  masterDegreeCount: 9,
  partyMembers: 85,
  campuses: [
    {
      name: 'Điểm chính (THPT Đốc Binh Kiều cũ)',
      grades: 'Khối 10, 11, 12',
      classes: 14,
      students: 530,
      area: '15.683 m²',
      facilities: '01 Phòng HT, 02 Phòng PHT, 01 Văn phòng, 01 Y tế, 06 phòng tổ CM, 09 phòng bộ môn kiên cố, 03 phòng lắp ghép, thư viện, PCCC vách tường 2 máy bơm.'
    },
    {
      name: 'Điểm Đốc Binh Kiều (THCS Đốc Binh Kiều cũ)',
      grades: 'Khối 6, 7, 8, 9',
      classes: 24,
      students: 983,
      area: '11.126,7 m²',
      facilities: 'Khu làm việc BGH & VP, 22 phòng học, 05 phòng chức năng, 01 nhà công vụ, sân bóng đá mini, sân bóng chuyền.'
    },
    {
      name: 'Điểm Tân Kiều (THCS Tân Kiều cũ - cách điểm chính 11 km)',
      grades: 'Khối 6, 7, 8, 9',
      classes: 15,
      students: 557,
      area: '8.570,8 m²',
      facilities: '9 phòng học, 10 phòng bộ môn (tiếng Anh, đa năng, tin học, KHTN 2 phòng, KHXH, công nghệ), 10 phòng làm việc sinh hoạt, phòng PHT thường trực.'
    }
  ],
  departments: [
    { name: 'Ban Giám hiệu', count: 4, leader: 'Lê Thanh Cường (HT), Nguyễn Minh Trí (PHT-CM)' },
    { name: 'Tổ Toán', count: 15 },
    { name: 'Tổ Ngữ văn - Thư viện - Thiết bị', count: 17 },
    { name: 'Tổ Lịch sử - Địa lý - GDCD - GDKTPL', count: 16 },
    { name: 'Tổ Vật lý - Hóa học - Sinh học - Công nghệ', count: 26 },
    { name: 'Tổ Ngoại ngữ - Tin học', count: 16 },
    { name: 'Tổ GDTC - QPAN - Nghệ thuật', count: 12 },
    { name: 'Tổ Văn phòng', count: 14 }
  ],
  dailySchedule: {
    morning: {
      target: 'Khối 8, 9, 10, 11, 12 học chính khóa & 2 buổi/ngày; Khối 6, 7 học trải nghiệm, bồi dưỡng HSG, phụ đạo yếu, CLB',
      slots: [
        { time: '6h30 - 6h45', duration: '15 phút', content: 'Vệ sinh trường, lớp', rest: '' },
        { time: '6h45 - 7h00', duration: '15 phút', content: 'Sinh hoạt đầu giờ', rest: '' },
        { time: '7h00 - 7h45', duration: '45 phút', content: 'Học tiết 1', rest: '10 phút' },
        { time: '7h55 - 8h40', duration: '45 phút', content: 'Học tiết 2', rest: '15 phút' },
        { time: '8h55 - 9h40', duration: '45 phút', content: 'Học tiết 3', rest: '10 phút' },
        { time: '9h50 - 10h35', duration: '45 phút', content: 'Học tiết 4', rest: '10 phút' },
        { time: '10h45 - 11h30', duration: '45 phút', content: 'Học tiết 5', rest: '' }
      ]
    },
    afternoon: {
      target: 'Khối 6, 7 học chính khóa & 2 buổi/ngày; Khối 8, 9, 10, 11, 12 học bồi dưỡng HSG, phụ đạo, trải nghiệm, CLB',
      slots: [
        { time: '14h20 - 15h05', duration: '45 phút', content: 'Học tiết 1', rest: '15 phút' },
        { time: '15h20 - 16h05', duration: '45 phút', content: 'Học tiết 2', rest: '10 phút' },
        { time: '16h15 - 17h00', duration: '45 phút', content: 'Học tiết 3', rest: '' }
      ]
    }
  }
};
