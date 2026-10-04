import { SchoolDocument } from '../types/document';

/**
 * Standard School Profile of Trường THCS & THPT Đốc Binh Kiều
 * Sourced directly from the official 26-page Kế hoạch Giáo dục Nhà trường năm học 2026-2027
 * (Số: 34/KH-THCS&THPTĐBK ngày 25/9/2026 do Hiệu trưởng Lê Thanh Cường ký)
 */
export const SCHOOL_OFFICIAL_PROFILE = {
  name: 'TRƯỜNG THCS VÀ THPT ĐỐC BINH KIỀU',
  authorityTop: 'SỞ GDĐT TỈNH ĐỒNG THÁP',
  documentNumber: 'Số: 34/KH-THCS&THPTĐBK',
  signDate: 'Đồng Tháp, ngày 25 tháng 9 năm 2026',
  principal: 'Lê Thanh Cường',
  vicePrincipalAcademics: 'Nguyễn Minh Trí',
  mergeDecision: 'Quyết định số 2606/QĐ-UBND ngày 13/8/2026 của UBND tỉnh Đồng Tháp về việc sáp nhập Trường THCS Đốc Binh Kiều, Trường THCS Tân Kiều và Trường THPT Đốc Binh Kiều thành Trường THCS và THPT Đốc Binh Kiều.',
  
  // 1. Quy mô học sinh năm học 2026 - 2027 (53 lớp, 2.143 HS, 25 HS khuyết tật)
  studentsByGrade: [
    { grade: 6, classes: 10, students: 417, avgPerClass: 41.7, disabled: 6 },
    { grade: 7, classes: 9, students: 377, avgPerClass: 41.9, disabled: 6 },
    { grade: 8, classes: 10, students: 409, avgPerClass: 40.9, disabled: 7 },
    { grade: 9, classes: 10, students: 410, avgPerClass: 41.0, disabled: 3 },
    { grade: 10, classes: 5, students: 203, avgPerClass: 40.6, disabled: 1 },
    { grade: 11, classes: 4, students: 142, avgPerClass: 35.0, disabled: 2 },
    { grade: 12, classes: 5, students: 185, avgPerClass: 37.0, disabled: 0 },
  ],
  totalClasses: 53,
  totalStudents: 2143,
  disabledStudents: 25,
  avgStudentsPerClass: 40.5,

  // 2. Đội ngũ cán bộ, giáo viên, nhân viên (Tổng: 120 người, 65 nữ, 85 Đảng viên, 9 Thạc sĩ)
  totalStaff: 120,
  principals: 4,
  teachers: 102,
  staff: 14,
  femaleStaff: 65,
  partyMembers: 85,
  masterDegreeCount: 9,

  // 08 Tổ chuyên môn và văn phòng
  departments: [
    { id: 'bgh', name: 'Ban Giám hiệu', count: 4, female: 0, partyMembers: 4, masters: 1, leader: 'Lê Thanh Cường (HT), Nguyễn Minh Trí (PHT-CM)' },
    { id: 'toan', name: 'Tổ Toán', count: 15, female: 4, partyMembers: 11, masters: 0 },
    { id: 'van_tv_tb', name: 'Tổ Ngữ văn - Thư viện - Thiết bị', count: 17, female: 12, partyMembers: 16, masters: 2 },
    { id: 'khxh', name: 'Tổ Lịch sử - Địa lý - GDCD - GDKTPL', count: 16, female: 11, partyMembers: 10, masters: 2 },
    { id: 'khtn_cn', name: 'Tổ Vật lý - Hóa học - Sinh học - Công nghệ', count: 26, female: 17, partyMembers: 19, masters: 3 },
    { id: 'nn_tin', name: 'Tổ Ngoại ngữ - Tin học', count: 16, female: 9, partyMembers: 10, masters: 1 },
    { id: 'gdtc_qpan_nt', name: 'Tổ GDTC - QPAN - Nghệ thuật', count: 12, female: 4, partyMembers: 11, masters: 0 },
    { id: 'vanphong', name: 'Tổ Văn phòng', count: 14, female: 8, partyMembers: 4, masters: 0 }
  ],

  // Thống kê chi tiết theo chuyên môn (96 GV giảng dạy bộ môn)
  subjectTeachersCount: [
    { subject: 'Toán', count: 15, bachelor: 15, master: 0 },
    { subject: 'Ngữ văn', count: 11, bachelor: 9, master: 2 },
    { subject: 'Lịch sử', count: 6, bachelor: 5, master: 1 },
    { subject: 'Địa lý', count: 6, bachelor: 5, master: 1 },
    { subject: 'GDCD/GDKTPL', count: 4, bachelor: 4, master: 0 },
    { subject: 'Vật lý', count: 5, bachelor: 3, master: 2 },
    { subject: 'Hóa học', count: 6, bachelor: 5, master: 1 },
    { subject: 'Sinh học', count: 10, bachelor: 10, master: 0 },
    { subject: 'Công nghệ', count: 5, bachelor: 5, master: 0 },
    { subject: 'Tin học', count: 6, bachelor: 6, master: 0 },
    { subject: 'Tiếng Anh', count: 10, bachelor: 9, master: 1 },
    { subject: 'GDTC', count: 7, bachelor: 7, master: 0 },
    { subject: 'GDQPAN', count: 1, bachelor: 1, master: 0 },
    { subject: 'Âm nhạc', count: 2, bachelor: 2, master: 0 },
    { subject: 'Mỹ thuật', count: 2, bachelor: 2, master: 0 },
  ],

  // 3. Cơ sở vật chất 03 điểm trường (Tổng diện tích: 35.380,5 m²)
  campuses: [
    {
      id: 'main',
      name: 'Điểm chính (THPT Đốc Binh Kiều cũ)',
      grades: 'Khối 10, 11, 12',
      classes: 14,
      students: 530,
      area: '15.683 m²',
      facilities: '01 Phòng Hiệu trưởng; 02 Phòng Phó Hiệu trưởng; 01 Văn phòng; 01 Phòng bảo vệ; 01 Phòng Đảng - đoàn thể; 01 Phòng họp toàn thể; 01 Phòng nghỉ GV; 06 Phòng tổ CM; 01 Phòng Y tế; 09 phòng học kiên cố, 03 phòng lắp ghép; 09 phòng bộ môn (Âm nhạc, Mỹ thuật, Vật lý - CN, Tin học, Ngoại ngữ, Đa chức năng, Hóa học, Sinh học, KHXH); Thư viện; PCCC 2 máy bơm chữa cháy, 11 tủ chữa cháy, lăng, vòi.'
    },
    {
      id: 'dbk',
      name: 'Điểm Đốc Binh Kiều (THCS Đốc Binh Kiều cũ)',
      grades: 'Khối 6, 7, 8, 9',
      classes: 24,
      students: 983,
      area: '11.126,7 m²',
      facilities: 'Khu làm việc BGH, Văn phòng, phòng Họp, Y tế, Đoàn - Đội; 22 phòng học; 05 phòng chức năng; 01 nhà công vụ, 02 khu vệ sinh; sân bóng đá mini, sân bóng chuyền, khu vực tập luyện GDTC.'
    },
    {
      id: 'tankieu',
      name: 'Điểm Tân Kiều (THCS Tân Kiều cũ - cách điểm chính 11 km)',
      grades: 'Khối 6, 7, 8, 9',
      classes: 15,
      students: 557,
      area: '8.570,8 m²',
      facilities: '09 phòng học; 10 phòng bộ môn (thiết bị dùng chung: 1, tiếng Anh: 1, đa năng: 1, Mỹ thuật: 1, Âm nhạc: 1, tin học: 1, KHTN: 2, KHXH: 1, công nghệ: 1); 10 phòng làm việc và sinh hoạt (Phòng HT: 1, PHT: 2, Đoàn thể: 1, Truyền thống: 1, sinh hoạt CM: 2, họp: 1, văn phòng: 1, YTHĐ: 1), 1 kho và 1 nhà bảo vệ; 2 WC học sinh, 2 WC giáo viên.'
    }
  ],

  // 4. Khung thời gian hoạt động trong ngày (ÁP DỤNG THỐNG NHẤT 3 ĐIỂM TRƯỜNG - MỖI BUỔI 5 TIẾT)
  dailySchedule: {
    morning: {
      title: 'Buổi sáng (6h30 - 11h30)',
      target: 'Chính khóa khối 8, 9, 10, 11, 12 và chương trình dạy học 2 buổi/ngày (nếu có); dạy học trải nghiệm, bồi dưỡng HSG, phụ đạo yếu, sinh hoạt CLB đối với khối 6, 7',
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
      title: 'Buổi chiều (12h00 - 17h00)',
      target: 'Chính khóa khối 6, 7 và chương trình dạy học 2 buổi/ngày (nếu có); dạy học trải nghiệm, bồi dưỡng HSG, phụ đạo yếu, sinh hoạt CLB đối với các khối còn lại (khối 8, 9, 10, 11, 12)',
      slots: [
        { time: '12h00 - 12h15', duration: '15 phút', content: 'Vệ sinh trường, lớp', rest: '' },
        { time: '12h15 - 12h30', duration: '15 phút', content: 'Sinh hoạt đầu giờ', rest: '' },
        { time: '12h30 - 13h15', duration: '45 phút', content: 'Học tiết 1', rest: '10 phút' },
        { time: '13h25 - 14h10', duration: '45 phút', content: 'Học tiết 2', rest: '10 phút' },
        { time: '14h20 - 15h05', duration: '45 phút', content: 'Học tiết 3', rest: '15 phút' },
        { time: '15h20 - 16h05', duration: '45 phút', content: 'Học tiết 4', rest: '10 phút' },
        { time: '16h15 - 17h00', duration: '45 phút', content: 'Học tiết 5', rest: '' }
      ]
    }
  },

  // 5. Khung thời gian năm học 2026 - 2027
  academicYearTimeline: {
    backToSchoolGrades9_12: '22/8/2026',
    backToSchoolOtherGrades: '28/8/2026',
    openingCeremony: '05/9/2026',
    term1: {
      weeks: 18,
      start: '07/9/2026',
      end: '10/01/2027'
    },
    term2: {
      weeks: 17,
      start: '11/01/2027',
      end: '23/5/2027'
    },
    endOfYear: '31/5/2027'
  },

  // 6. Các chỉ tiêu chuyên môn trọng điểm năm học 2026 - 2027
  keyAcademicTargets: {
    graduationTHPTTarget: '185/185 (100%)',
    graduationTHCSTarget: '407/407 (100%) (Điểm ĐBK: 250/250, Điểm Tân Kiều: 157/157)',
    grade10AdmissionTarget: 'Đạt 90% HS tốt nghiệp THCS (ĐBK: 227/250 = 90,8%; Tân Kiều: 142/157 = 90%)',
    vocationalAdmissionTarget: '10% trên tổng số học sinh tốt nghiệp THCS',
    universityAdmissionTarget: 'Trên 75% học sinh đỗ Đại học',
    provincialHSGPrizesTarget: '18 giải (Toán 01, Vật lý 01, Địa lý 01, Tiếng Anh 01, Tin học 01, Ngữ văn 05, Hóa học 01, Sinh học 01, Lịch sử 06, GDKTPL 01)',
    thptGraduationExamAvgScoreTarget: 5.99,
    subjectExamTargetAvg: {
      Toan: 5.14,
      NguVan: 7.52,
      LichSu: 7.81,
      TiengAnh: 4.82,
      VatLy: 4.82,
      HoaHoc: 6.79,
      SinhHoc: 5.36,
      DiaLy: 5.83,
      GDKTPL: 5.85
    },
    // Mục tiêu học tập khối 10-12: Tốt 36,04%, Khá 44,72%, Đạt 18,30%, Chưa đạt 0,94%
    highSchoolLearningTarget: { tot: 36.04, kha: 44.72, dat: 18.30, chuaDat: 0.94 },
    // Mục tiêu rèn luyện khối 10-12: Tốt 96,04%, Khá 3,96%
    highSchoolConductTarget: { tot: 96.04, kha: 3.96, dat: 0, chuaDat: 0 },
    // Mục tiêu học tập khối 6-9: Tốt 31,26%, Khá 34,65%, Đạt 33,33%, Chưa đạt 0,75%
    middleSchoolLearningTarget: { tot: 31.26, kha: 34.65, dat: 33.33, chuaDat: 0.75 },
    // Mục tiêu rèn luyện khối 6-9: Tốt 91,64%, Khá 6,42%, Đạt 1,95%
    middleSchoolConductTarget: { tot: 91.64, kha: 6.42, dat: 1.95, chuaDat: 0 },
    // Danh hiệu học sinh
    studentAwardsTarget: {
      middleSchool: { excellent: 204, good: 293 },
      highSchool: { excellent: 35, good: 156 }
    },
    // Quy định chỉ tiêu dự giờ
    observationRules: {
      principal: 'Ít nhất 10% giáo viên/học kỳ',
      vicePrincipal: 'Ít nhất 30% giáo viên/học kỳ (theo Điểm trường)',
      departmentHead: '100% giáo viên trong tổ ở điểm công tác, ít nhất 30% giáo viên ở 2 điểm còn lại',
      deputyDepartmentHead: 'Ít nhất 100% giáo viên trong tổ theo điểm trường mình đang công tác',
      teacher: 'Ít nhất 04 tiết/học kỳ'
    },
    // Đánh giá viên chức và thi đua
    staffEvaluation: {
      excellentCompleted: '20%',
      goodCompleted: '80%',
      teacherStandardsGood: '70%',
      teacherStandardsFair: '25%',
      teacherStandardsPass: '5%',
      skknRatio: 'Tối thiểu 40% số sáng kiến so với số lượng GV, NV trong tổ'
    },
    schoolAccreditationGoal: 'Đạt chuẩn Quốc gia mức độ 1 vào năm 2029'
  }
};
