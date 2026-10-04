import { SchoolDocument } from '../types/document';

export const INITIAL_SCHOOL_DOCUMENTS: SchoolDocument[] = [
  {
    id: 'doc-kh-gd-34',
    type: 'plan',
    typeLabel: 'Kế hoạch',
    documentNumber: 'Số: 34/KH-THCS&THPTĐBK',
    title: 'KẾ HOẠCH',
    subTitle: 'Giáo dục Nhà trường năm học 2026 - 2027',
    signDate: 'Đồng Tháp, ngày 25 tháng 9 năm 2026',
    createdDate: new Date('2026-09-25').toISOString(),
    issuingAuthorityTop: 'SỞ GDĐT TỈNH ĐỒNG THÁP',
    issuingAuthority: 'TRƯỜNG THCS VÀ THPT\nĐỐC BINH KIỀU',
    signerRole: 'HIỆU TRƯỞNG',
    signerName: 'Lê Thanh Cường',
    sourceDirectiveId: 'directive-1061',
    sourceDirective: 'Hướng dẫn số 1061/HD-SGDĐT ngày 28/8/2026 của Sở GDĐT tỉnh Đồng Tháp',
    legalBases: [
      'Thông tư số 32/2018/TT-BGDĐT ngày 26 tháng 12 năm 2018 của Bộ Giáo dục và Đào tạo (GDĐT) ban hành Chương trình giáo dục phổ thông (CTGDPT)',
      'Thông tư số 22/2021/TT-BGDĐT ngày 20/07/2021 của Bộ GDĐT quy định về đánh giá học sinh THCS và học sinh THPT',
      'Thông tư số 13/2022/TT-BGDĐT ngày 03 tháng 8 năm 2022 của Bộ GDĐT về sửa đổi, bổ sung một số nội dung trong CTGDPT',
      'Thông tư số 15/2026/TT-BGDĐT ngày 24 tháng 3 năm 2026 của Bộ GDĐT ban hành Điều lệ trường tiểu học, trường trung học cơ sở, trường trung học phổ thông và trường phổ thông có nhiều cấp học',
      'Thông tư số 57/2026/TT-BGDĐT ngày 07 tháng 7 năm 2026 của Bộ GDĐT quy định về bảo đảm chất lượng giáo dục đối với cơ sở giáo dục mầm non, cơ sở giáo dục phổ thông, cơ sở giáo dục thường xuyên; công nhận đạt chuẩn quốc gia đối với trường mầm non và trường phổ thông',
      'Thông tư số 70/2026/TT-BGDĐT ngày 22 tháng 8 năm 2026 của Bộ GDĐT Quy định về quản lý và sử dụng học bạ số trong các cơ sở giáo dục phổ thông và cơ sở giáo dục thường xuyên',
      'Quyết định số 2644/QĐ-UBND ngày 17 tháng 8 năm 2026 của Ủy ban nhân dân tỉnh Đồng Tháp về việc ban hành khung kế hoạch thời gian năm học 2026-2027',
      'Công văn số 5208/BGDĐT-GDPT ngày 07 tháng 8 năm 2026 của Bộ GDĐT về việc hướng dẫn thực hiện nhiệm vụ giáo dục phổ thông năm học 2026 - 2027',
      'Hướng dẫn số 1061/HD-SGDĐT ngày 28 tháng 8 năm 2026 của Sở Giáo dục và Đào tạo tỉnh Đồng Tháp về việc thực hiện nhiệm vụ giáo dục phổ thông năm học 2026 - 2027',
      'Quyết định số 2606/QĐ-UBND ngày 13/8/2026 của Ủy ban nhân dân tỉnh Đồng Tháp về việc sáp nhập Trường Trung học cơ sở Đốc Binh Kiều, Trường Trung học cơ sở Tân Kiều và Trường Trung học phổ thông Đốc Binh Kiều thành Trường Trung học cơ sở và Trung học phổ thông Đốc Binh Kiều',
      'Tình hình thực tế về cơ sở vật chất, đội ngũ cán bộ quản lý, giáo viên, nhân viên và học sinh của nhà trường',
    ],
    sections: [
      {
        heading: 'I. ĐẶC ĐIỂM, ĐIỀU KIỆN THỰC HIỆN CHƯƠNG TRÌNH NĂM HỌC',
        content: `1. Đặc điểm tình hình kinh tế, văn hóa, xã hội, giáo dục địa phương:
Trong những năm qua, xã Đốc Binh Kiều đã có sự phát triển mạnh mẽ về kinh tế, xã hội, tạo điều kiện cho nhân dân quan tâm hơn đến việc học tập của con em.
Chất lượng, hiệu quả giáo dục của các đơn vị trước sáp nhập đã có những bước chuyển biến rõ rệt, tỉ lệ học sinh thi đỗ vào các trường Đại học - Cao đẳng ngày càng tăng, có nhiều em đạt giải trong các kỳ thi cấp tỉnh, cấp quốc gia.
Sự phát triển mạnh mẽ của công nghệ thông tin, chuyển đổi số tạo điều kiện thuận lợi cho việc triển khai Chương trình Giáo dục phổ thông 2018 và đổi mới phương pháp dạy học, kiểm tra đánh giá.
Chính sách của Đảng và Nhà nước về đổi mới căn bản, toàn diện giáo dục, đặc biệt là việc thực hiện Chính quyền địa phương hai cấp, tạo ra cơ hội để nhà trường được quan tâm, đầu tư và phát triển.

2. Đặc điểm nhà trường:
2.1. Quy mô học sinh năm học 2026 - 2027:
- Toàn trường có 53 lớp với 2.143 học sinh (bình quân 40,5 học sinh/lớp), 25 học sinh khuyết tật. Cụ thể:
  + Cấp THCS (39 lớp - 1.613 học sinh): Khối 6 có 10 lớp (417 HS, 6 HS khuyết tật); Khối 7 có 9 lớp (377 HS, 6 HS khuyết tật); Khối 8 có 10 lớp (409 HS, 7 HS khuyết tật); Khối 9 có 10 lớp (410 HS, 3 HS khuyết tật).
  + Cấp THPT (14 lớp - 530 học sinh): Khối 10 có 5 lớp (203 HS, 1 HS khuyết tật); Khối 11 có 4 lớp (142 HS, 2 HS khuyết tật); Khối 12 có 5 lớp (185 HS).
2.2. Đội ngũ cán bộ, giáo viên, nhân viên:
- Tổng số: 120 người. Trong đó: Ban Giám hiệu 04; Giáo viên 102; Nhân viên 14. Có 85 Đảng viên, 09 Thạc sĩ.
- Cơ cấu 08 Tổ: Ban Giám hiệu (04), Tổ Toán (15), Tổ Ngữ văn - Thư viện - Thiết bị (17), Tổ Lịch sử - Địa lý - GDCD - GDKTPL (16), Tổ Vật lý - Hóa học - Sinh học - Công nghệ (26), Tổ Ngoại ngữ - Tin học (16), Tổ GDTC - QPAN - Nghệ thuật (12), Tổ Văn phòng (14).
2.3. Cơ sở vật chất tại 03 điểm trường:
- Nhà trường có 03 điểm trường với tổng diện tích khuôn viên 35.380,5 m²:
  + Điểm chính (THPT Đốc Binh Kiều cũ): 15.683 m², khối 10-12, 14 phòng học, 09 phòng bộ môn kiên cố, 03 phòng lắp ghép, hệ thống PCCC vách tường 02 máy bơm, 11 tủ chữa cháy.
  + Điểm Đốc Binh Kiều (THCS Đốc Binh Kiều cũ): 11.126,7 m², khối 6-9, 22 phòng học, 05 phòng chức năng, 01 nhà công vụ, sân bóng đá mini, sân bóng chuyền.
  + Điểm Tân Kiều (THCS Tân Kiều cũ - cách điểm chính 11 km): 8.570,8 m², khối 6-9, 09 phòng học, 10 phòng bộ môn, 10 phòng làm việc và sinh hoạt, có phòng PHT thường trực.`,
      },
      {
        heading: 'II. NHIỆM VỤ TRỌNG TÂM NĂM HỌC 2026 - 2027',
        content: `Một là, nâng cao năng lực, hiệu quả trong công tác quản lý, điều hành Nhà trường đảm bảo kỷ cương, kỷ luật thông qua việc thực hiện Nghị quyết 71-NQ/TW ngày 22/8/2025 của Bộ Chính trị về đột phá phát triển giáo dục và đào tạo; Luật Nhà giáo; Luật Giáo dục.
Hai là, tiếp tục triển khai chương trình GDPT 2018, dạy học phân hoá, nâng cao chất lượng đầu ra, tích hợp giáo dục STEM, trải nghiệm thực tế. Tổ chức kiểm tra, đánh giá theo định hướng phát triển phẩm chất – năng lực của học sinh.
Ba là, nâng cao chất lượng đội ngũ, chủ động cập nhật, thực hiện các nội dung liên quan đến Luật Nhà giáo và các văn bản sửa đổi về giáo dục khi có hiệu lực, bảo đảm quyền lợi và trách nhiệm của nhà giáo, chuẩn nghề nghiệp, đạo đức nhà giáo.
Bốn là, chuyển đổi số và dữ liệu số giáo dục, hoàn thiện hồ sơ, học bạ điện tử, học bạ số; sử dụng nền tảng số dùng chung theo hướng dẫn của cấp trên; tăng cường học liệu số, bài giảng mở; bảo đảm an toàn thông tin. Tăng cường giáo dục kỹ năng số cho học sinh.
Năm là, bồi dưỡng đội tuyển học sinh giỏi, nghiên cứu khoa học kỹ thuật; phụ đạo, hỗ trợ học sinh yếu; phát triển câu lạc bộ học thuật – nghệ thuật – thể thao. Tăng cường dạy học ngoại ngữ, đặc biệt Tiếng Anh gắn với ứng dụng CNTT.
Sáu là, xây dựng văn hóa học đường – trường học hạnh phúc, an toàn. Phòng, chống bạo lực học đường; chăm sóc sức khỏe tinh thần; kỹ năng số, kỹ năng an toàn PCCC, ATGT, phòng chống đuối nước, thiên tai. Thực hiện tốt công tác tư vấn tâm lý; phối hợp chặt chẽ với cha mẹ học sinh và chính quyền địa phương.
Bảy là, phấn đấu thực hiện các tiêu chí trường đạt chuẩn quốc gia mức độ 1 vào năm 2029.`,
      },
      {
        heading: 'III. CÁC NHIỆM VỤ VÀ GIẢI PHÁP CỤ THỂ NĂM HỌC 2026 - 2027',
        content: `1. Công tác chính trị tư tưởng:
- Tổ chức học tập, quán triệt nghị quyết, chỉ thị của Đảng, pháp luật Nhà nước. Tiếp tục học tập và làm theo tư tưởng, đạo đức, phong cách Hồ Chí Minh.
- Thực hiện tốt các cuộc vận động: "Mỗi thầy, cô giáo là tấm gương đạo đức, tự học và sáng tạo", "Đổi mới, sáng tạo trong dạy và học".
- Xây dựng trường học hạnh phúc, phát động phong trào đoàn kết, kỷ cương, trách nhiệm trong tập thể sư phạm.

2. Thực hiện Chương trình GDPT 2018 bảo đảm chất lượng và hiệu quả:
- Tổ chức dạy học các môn học và hoạt động giáo dục theo Chương trình GDPT 2018, điều chỉnh phù hợp với điều kiện thực tế nhà trường.
- Chuẩn bị cơ sở vật chất, giáo viên để thực hiện dạy học 2 buổi/ngày phù hợp theo điều kiện nhà trường tại cả 3 điểm trường.
- Tổ chức các nhóm môn học lựa chọn và chuyên đề học tập: tư vấn học sinh, cha mẹ học sinh chọn môn theo năng lực, sở trường và định hướng nghề nghiệp.
- Đổi mới phương pháp dạy học theo hướng phát triển năng lực, phẩm chất; chú trọng giáo dục STEM, nghiên cứu khoa học, trải nghiệm sáng tạo.

3. Đổi mới phương pháp, hình thức dạy học, kiểm tra đánh giá và phát triển năng lực số:
- 100% giáo viên đổi mới phương pháp dạy học, không đọc chép, không viết lời thoại rườm rà "GV hỏi - HS đáp", tập trung chuỗi 4 hoạt động học của học sinh.
- Đa dạng hóa kiểm tra đánh giá: vấn đáp, viết, thực hành, dự án, sản phẩm học tập; 100% đề kiểm tra định kỳ có ma trận và bảng đặc tả.
- Triển khai học bạ số, hồ sơ điện tử, hệ thống quản lý học tập trực tuyến LMS kết nối 3 điểm trường. Khai thác ứng dụng Trí tuệ nhân tạo (AI) an toàn trong quản lý và dạy học.`,
      },
      {
        heading: 'IV. KHUNG KẾ HOẠCH THỜI GIAN VÀ KHUNG THỜI GIAN HOẠT ĐỘNG TRONG NGÀY',
        content: `1. Khung thời gian thực hiện năm học:
- Tựu trường: Khối 9, 12 ngày 22/8/2026; Khối 6, 7, 8, 10, 11 ngày 28/8/2026.
- Khai giảng: 05/9/2026.
- Học kỳ 1: 18 tuần thực học từ 07/9/2026 đến 10/01/2027.
- Học kỳ 2: 17 tuần thực học từ 11/01/2027 đến 23/5/2027.
- Kết thúc năm học chậm nhất ngày 31/5/2027.

2. Khung thời gian hoạt động trong ngày (Áp dụng thống nhất cho cả 3 điểm trường):
- Buổi sáng: Khối 8, 9, 10, 11, 12 học chính khóa và chương trình 2 buổi/ngày; Khối 6, 7 học trải nghiệm, bồi dưỡng HSG, phụ đạo yếu:
  + 6h30 - 6h45: Vệ sinh trường, lớp (15 phút)
  + 6h45 - 7h00: Sinh hoạt đầu giờ (15 phút)
  + 7h00 - 7h45: Học tiết 1 (nghỉ 10 phút đổi tiết)
  + 7h55 - 8h40: Học tiết 2 (nghỉ 15 phút đổi tiết)
  + 8h55 - 9h40: Học tiết 3 (nghỉ 10 phút đổi tiết)
  + 9h50 - 10h35: Học tiết 4 (nghỉ 10 phút đổi tiết)
  + 10h45 - 11h30: Học tiết 5
- Buổi chiều: Khối 6, 7 học chính khóa và chương trình 2 buổi/ngày; Khối 8, 9, 10, 11, 12 học bồi dưỡng HSG, phụ đạo, CLB:
  + 14h20 - 15h05: Học tiết 1 (nghỉ 15 phút đổi tiết)
  + 15h20 - 16h05: Học tiết 2 (nghỉ 10 phút đổi tiết)
  + 16h15 - 17h00: Học tiết 3`,
      },
      {
        heading: 'V. TỔ CHỨC THỰC HIỆN',
        content: `1. Ban Giám hiệu:
- Thầy Hiệu trưởng Lê Thanh Cường phụ trách chung, chỉ đạo tài chính, tổ chức và đối ngoại.
- Thầy Phó Hiệu trưởng Nguyễn Minh Trí trực tiếp phụ trách chuyên môn toàn trường; ký duyệt kế hoạch các tổ chuyên môn, duyệt đề kiểm tra định kỳ; theo dõi, thẩm định Kế hoạch bài dạy của giáo viên.
- Phân công cán bộ Ban Giám hiệu thường trực tại Điểm trường Tân Kiều để nắm bắt tình hình và kịp thời giải quyết các vướng mắc chuyên môn.

2. Các Tổ chuyên môn và Giáo viên:
- Hoàn thành Kế hoạch giáo dục của Tổ trước ngày 05/9/2026 gửi Phó Hiệu trưởng phê duyệt.
- Duy trì nền nếp sinh hoạt chuyên môn định kỳ 2 tuần/lần theo hướng nghiên cứu bài học; tăng cường họp trực tuyến kết nối điểm chính và điểm Tân Kiều.
- Giáo viên nghiêm túc thực hiện phân công chuyên môn, giảng dạy đúng phân phối chương trình, tích cực ứng dụng học liệu số.

Trong quá trình thực hiện, nếu có khó khăn, vướng mắc, các tập thể và cá nhân cần báo cáo về Lãnh đạo nhà trường để được hướng dẫn./.`,
      },
    ],
    recipients: [
      'Sở GDĐT Đồng Tháp (báo cáo);',
      'Hiệu trưởng, các Phó Hiệu trưởng;',
      'Các tổ chuyên môn, tổ văn phòng;',
      'Đoàn – Hội – Đội;',
      'Lưu: VT.',
    ],
    status: 'official',
  },
  {
    id: 'doc-kh-2buoi',
    type: 'plan',
    typeLabel: 'Kế hoạch',
    documentNumber: 'Số: 45/KH-THCS&THPTĐBK',
    title: 'KẾ HOẠCH',
    subTitle: 'Tổ chức dạy học 2 buổi/ngày năm học 2026 - 2027',
    signDate: 'Đồng Tháp, ngày 28 tháng 9 năm 2026',
    createdDate: new Date('2026-09-28').toISOString(),
    issuingAuthorityTop: 'SỞ GDĐT TỈNH ĐỒNG THÁP',
    issuingAuthority: 'TRƯỜNG THCS VÀ THPT\nĐỐC BINH KIỀU',
    signerRole: 'KT. HIỆU TRƯỞNG\nPHÓ HIỆU TRƯỞNG',
    signerName: 'Nguyễn Minh Trí',
    sourceDirectiveId: 'directive-1251-ubnd',
    sourceDirective: 'Kế hoạch số 1251/KH-UBND ngày 17/8/2026 của UBND tỉnh Đồng Tháp và Kế hoạch triển khai của Sở GDĐT',
    legalBases: [
      'Thông tư số 32/2018/TT-BGDĐT ngày 26 tháng 12 năm 2018 của Bộ trưởng Bộ Giáo dục và Đào tạo ban hành Chương trình giáo dục phổ thông',
      'Công văn số 5208/BGDĐT-GDPT ngày 07 tháng 8 năm 2026 của Bộ Giáo dục và Đào tạo về việc tổ chức dạy học 2 buổi/ngày cấp trung học cơ sở và cấp trung học phổ thông',
      'Kế hoạch của Sở Giáo dục và Đào tạo tỉnh Đồng Tháp về Triển khai tổ chức dạy học 2 buổi/ngày đối với cơ sở giáo dục phổ thông trên địa bàn tỉnh Đồng Tháp',
      'Quyết định số 2606/QĐ-UBND ngày 13 tháng 8 năm 2026 của Ủy ban nhân dân tỉnh Đồng Tháp về việc sáp nhập Trường THCS Đốc Binh Kiều, Trường THCS Tân Kiều và Trường THPT Đốc Binh Kiều thành Trường THCS và THPT Đốc Binh Kiều',
      'Kế hoạch giáo dục nhà trường năm học 2026 - 2027 số 28/KH-THCS&THPTĐBK ngày 05 tháng 9 năm 2026 của Trường THCS và THPT Đốc Binh Kiều',
    ],
    sections: [
      {
        heading: 'I. MỤC ĐÍCH, YÊU CẦU',
        content: `1. Mục đích:
a) Tổ chức thực hiện nghiêm túc, hiệu quả Kế hoạch của Sở Giáo dục và Đào tạo tỉnh Đồng Tháp về tổ chức dạy học 2 buổi/ngày; nâng cao chất lượng giáo dục toàn diện cho 2.143 học sinh ở cả 2 cấp học (THCS và THPT) tại 3 điểm trường của Trường THCS và THPT Đốc Binh Kiều.
b) Nâng cao chất lượng các hoạt động giáo dục toàn diện về Đức - Trí - Thể - Mỹ, bao gồm: giáo dục đạo đức, kỹ năng sống, giáo dục STEM/STEAM, giáo dục văn hóa đọc, văn hóa học đường, giáo dục thể chất, nghệ thuật, giáo dục tài chính; phát triển năng lực ngoại ngữ, năng lực số, năng lực trí tuệ nhân tạo (AI); hình thành ý thức và thói quen tự học suốt đời cho học sinh.
c) Nâng cao chất lượng giờ học chính khóa; khắc phục triệt để tình trạng dạy thêm, học thêm không đúng quy định; xây dựng môi trường giáo dục lành mạnh, an toàn, bảo đảm công bằng trong tiếp cận giáo dục giữa điểm trường chính và điểm trường lẻ.
d) Sử dụng hiệu quả đội ngũ 101 cán bộ, giáo viên và cơ sở vật chất hiện có tại 3 điểm trường (Điểm chính THPT, Điểm THCS Đốc Binh Kiều, Điểm THCS Tân Kiều); phát huy tối đa tinh thần đổi mới phương pháp dạy học và kiểm tra, đánh giá theo hướng phát triển năng lực, phẩm chất người học.

2. Yêu cầu:
a) Thực hiện hiệu quả mục tiêu Chương trình GDPT 2018, bảo đảm về thời lượng dạy học các môn học và tổ chức các hoạt động giáo dục; không gây quá tải, phù hợp tâm sinh lý lứa tuổi và sức khỏe của học sinh THCS và THPT.
b) Bảo đảm quyền lợi, đáp ứng nhu cầu, nguyện vọng học tập của học sinh; phù hợp với điều kiện thực tế của từng điểm trường và địa phương 2 xã Đốc Binh Kiều và Tân Kiều; thực hiện hiệu quả chủ trương xã hội hóa giáo dục bảo đảm nguyên tắc tự nguyện, công khai, minh bạch, đúng quy định của pháp luật.
c) Tổ chức thực hiện dạy học 2 buổi/ngày bảo đảm sử dụng hiệu quả cơ sở vật chất (phòng học, 19 phòng học bộ môn, phòng máy vi tính, sân thể thao) và phân công đội ngũ giáo viên hợp lý; phát huy vai trò chủ động, sáng tạo của 07 tổ chuyên môn.
d) Thời lượng dạy học buổi 1 và buổi 2 trong tuần thực hiện linh hoạt trong sắp xếp thời khóa biểu; phân định rành mạch giữa chương trình chính khóa và các hoạt động giáo dục tăng cường buổi thứ 2; bảo đảm an toàn giao thông cho học sinh và giáo viên khi di chuyển giữa các điểm trường.`,
      },
      {
        heading: 'II. NỘI DUNG, HÌNH THỨC TỔ CHỨC DẠY HỌC 2 BUỔI/NGÀY',
        content: `Nội dung, hình thức tổ chức dạy học 2 buổi/ngày tại Trường THCS và THPT Đốc Binh Kiều được triển khai thực hiện nghiêm túc theo Kế hoạch số 1251/KH-UBND của UBND tỉnh Đồng Tháp và văn bản chỉ đạo của Sở Giáo dục và Đào tạo, cụ thể đối với 2 cấp học như sau:

1. Đối với cấp trung học cơ sở (Quy mô: 39 lớp với 1.613 học sinh tại 2 điểm trường):
a) Thời lượng và bố trí thời gian:
- Tổ chức dạy học 2 buổi/ngày cho học sinh cấp THCS tại 2 điểm: Điểm THCS Đốc Binh Kiều (24 lớp, 983 HS) và Điểm THCS Tân Kiều (15 lớp, 557 HS - cách điểm chính 11 km).
- Bố trí thời gian học tập 6 ngày/tuần (từ thứ Hai đến thứ Bảy), mỗi ngày không quá 7 tiết học, mỗi tiết 45 phút.
- Khung thời gian học tập trong ngày:
  + Buổi sáng (tối đa 5 tiết, từ 7h00 đến 11h30): Bố trí dạy học chính khóa đối với Khối 8 và Khối 9; tổ chức các hoạt động bồi dưỡng, phụ đạo, trải nghiệm buổi 2 đối với Khối 6 và Khối 7.
  + Buổi chiều (tối đa 3 tiết, từ 14h20 đến 17h00): Bố trí dạy học chính khóa đối với Khối 6 và Khối 7; tổ chức các hoạt động buổi 2 (phụ đạo, bồi dưỡng HSG, CLB) đối với Khối 8 và Khối 9.
b) Nội dung và hình thức dạy học:
- Buổi 1 (Chính khóa): Thực hiện đầy đủ kế hoạch giáo dục môn học và hoạt động giáo dục theo Chương trình GDPT 2018 ban hành kèm theo Thông tư số 32/2018/TT-BGDĐT.
- Buổi 2 (Tăng cường & Phát triển năng lực):
  + Tổ chức ôn tập, phụ đạo củng cố kiến thức cho học sinh có nguy cơ chưa đạt yêu cầu cần đạt (YCCĐ) các môn Toán, Ngữ văn, Tiếng Anh, Khoa học tự nhiên (hoàn toàn miễn phí, không thu tiền học sinh).
  + Bồi dưỡng học sinh giỏi lớp 9 tham gia kỳ thi chọn HSG cấp huyện và cấp tỉnh Đồng Tháp.
  + Tổ chức ôn tập, củng cố kiến thức trọng tâm cho học sinh lớp 9 chuẩn bị kỳ thi tuyển sinh vào lớp 10 THPT.
  + Tổ chức hoạt động giáo dục STEM/STEAM, câu lạc bộ Tin học - Trí tuệ nhân tạo (AI), hoạt động trải nghiệm hướng nghiệp, giáo dục kỹ năng sống, an toàn giao thông, văn hóa đọc tại thư viện trường, rèn luyện thể dục thể thao (bóng đá, bóng chuyền, cầu lông, điền kinh) và văn nghệ.
- Đa dạng hóa hình thức tổ chức dạy học: Phân chia nhóm học sinh theo năng lực, trình độ; tổ chức câu lạc bộ theo sở thích; tăng cường thời lượng tự học có hướng dẫn của giáo viên bộ môn tại thư viện và phòng bộ môn.

2. Đối với cấp trung học phổ thông (Quy mô: 14 lớp với 530 học sinh tại Điểm chính):
a) Thời lượng và bố trí thời gian:
- Tổ chức dạy học 2 buổi/ngày cho học sinh Khối 10 (5 lớp, 203 HS), Khối 11 (4 lớp, 142 HS), Khối 12 (5 lớp, 185 HS) tại Điểm trường chính.
- Bố trí thời gian học tập 6 ngày/tuần, mỗi ngày không quá 7 tiết học, mỗi tiết 45 phút.
- Khung thời gian:
  + Buổi sáng (tối đa 5 tiết, từ 7h00 đến 11h30): Dạy học toàn bộ chương trình chính khóa các môn bắt buộc và cụm chuyên đề lựa chọn.
  + Buổi chiều (tối đa 3 tiết, từ 14h20 đến 17h00, 3-4 buổi/tuần): Dạy học buổi 2 theo định hướng phân hóa và năng khiếu.
b) Nội dung và hình thức dạy học:
- Buổi 1 (Chính khóa): Hoàn thành đầy đủ chuẩn kiến thức, kỹ năng của Chương trình GDPT 2018; bảo đảm tiến độ phân phối chương trình của các tổ chuyên môn.
- Buổi 2 (Tăng cường & Chuyên sâu):
  + Tổ chức phụ đạo, giúp đỡ học sinh chưa đạt chuẩn ở các môn Toán, Ngữ văn, Tiếng Anh, Vật lý, Hóa học, Sinh học, Lịch sử, Địa lý.
  + Bồi dưỡng chuyên sâu các đội tuyển học sinh giỏi cấp tỉnh khối 10, 11, 12 ở các môn văn hóa.
  + Tổ chức ôn tập thi Tốt nghiệp THPT cho học sinh Khối 12 theo 2 nhóm định hướng nghề nghiệp: Tổ hợp Khoa học tự nhiên và Tổ hợp Khoa học xã hội.
  + Tổ chức nghiên cứu khoa học kỹ thuật dành cho học sinh trung học; giáo dục STEM; câu lạc bộ chuyển đổi số và ứng dụng AI; tư vấn tâm lý học đường và hướng nghiệp - phân luồng sau THPT; các hoạt động tình nguyện, rèn luyện thể chất, giáo dục quốc phòng và an ninh.
- Đa dạng hóa hình thức tổ chức: Học theo nhóm nguyện vọng tổ hợp môn thi; sinh hoạt chuyên đề tại phòng thí nghiệm, phòng máy vi tính; hướng dẫn tự học kết hợp học tập trực tuyến trên hệ thống quản lý học tập số của nhà trường.`,
      },
      {
        heading: 'III. KINH PHÍ VÀ ĐIỀU KIỆN THỰC HIỆN',
        content: `1. Kinh phí từ ngân sách nhà nước:
- Nhà trường chủ động sử dụng nguồn ngân sách chi thường xuyên được giao hằng năm theo định mức học sinh để chi trả cho các hoạt động dạy học 2 buổi/ngày theo đúng hướng dẫn tại Công văn số 9179/BTC-NSNN của Bộ Tài chính và quy chế chi tiêu nội bộ của đơn vị.
- Ưu tiên bố trí kinh phí phục vụ mua sắm vật tư tiêu hao thực hành thí nghiệm, tài liệu ôn tập, duy trì đường truyền Internet tốc độ cao, hỗ trợ giáo viên tham gia bồi dưỡng học sinh giỏi và phụ đạo học sinh yếu kém.

2. Nguồn lực xã hội hóa giáo dục:
- Huy động các nguồn tài trợ, đóng góp tự nguyện hợp pháp từ cha mẹ học sinh, các tổ chức, cựu học sinh, doanh nghiệp trên địa bàn theo đúng quy định tại Thông tư số 16/2018/TT-BGDĐT.
- Thực hiện nghiêm túc nguyên tắc tự nguyện, công khai, dân chủ, minh bạch; tuyệt đối không cào bằng, không quy định mức thu bình quân, không lợi dụng danh nghĩa ban đại diện cha mẹ học sinh để thu tiền trái quy định; không thu bất kỳ khoản tiền nào ngoài danh mục cho phép.

3. Điều kiện bảo đảm về cơ sở vật chất:
- Khai thác tối đa hiệu suất sử dụng của 14 phòng học và 09 phòng bộ môn kiên cố tại Điểm chính; 22 phòng học tại Điểm Đốc Binh Kiều; 09 phòng học và 10 phòng bộ môn tại Điểm Tân Kiều.
- Mở cửa toàn bộ hệ thống phòng máy vi tính, thư viện tại cả 3 điểm trường trong suốt các buổi chiều để phục vụ học sinh tự học, đọc sách, nghiên cứu tài liệu số và khai thác học liệu điện tử.`,
      },
      {
        heading: 'IV. TỔ CHỨC THỰC HIỆN',
        content: `Để kế hoạch dạy học 2 buổi/ngày đạt chất lượng thực chất và hiệu quả cao, nhà trường phân công trách nhiệm cụ thể, xuyên suốt gắn liền với hệ thống điều hành chuyên môn của đơn vị như sau:

1. Ban Giám hiệu:
- Thầy Hiệu trưởng Lê Thanh Cường: Lãnh đạo, chỉ đạo chung toàn diện; chịu trách nhiệm trước Sở GDĐT về việc tổ chức dạy học 2 buổi/ngày của đơn vị; phê duyệt kế hoạch, quyết định phân công nhiệm vụ; bảo đảm kinh phí, cơ sở vật chất, an ninh trật tự và an toàn trường học tại cả 3 điểm trường.
- Thầy Phó Hiệu trưởng Nguyễn Minh Trí:
  + Trực tiếp phụ trách chỉ đạo, điều hành công tác chuyên môn dạy học 2 buổi/ngày đối với cả 2 cấp THCS và THPT trên toàn trường.
  + Trực tiếp xây dựng, điều chỉnh thời khóa biểu 53 lớp khoa học, hợp lý, bảo đảm không gây quá tải cho học sinh và giáo viên; ưu tiên sắp xếp lịch dạy cho giáo viên liền buổi tại cùng một điểm trường để giảm thiểu việc di chuyển giữa các điểm trường (đặc biệt Điểm Tân Kiều cách điểm chính 11 km).
  + Phê duyệt kế hoạch dạy học buổi 2 của 07 tổ chuyên môn; ký duyệt danh sách học sinh phụ đạo và học sinh giỏi; chỉ đạo việc đổi mới kiểm tra, đánh giá thường xuyên.
  + Giám sát chặt chẽ phân công giảng dạy, theo dõi việc kê khai thừa - thiếu tiết hàng tuần và tổng hợp kê khai tiết của 101 cán bộ, giáo viên trên hệ thống quản lý chuyên môn trực tuyến của nhà trường (https://phancongchuyenmonthcsthptdbk.vercel.app/), bảo đảm công khai, minh bạch, đúng định mức quy định.
  + Thường xuyên kiểm tra, đôn đốc nền nếp dạy học buổi chiều tại 3 điểm trường; kịp thời tháo gỡ những khó khăn, vướng mắc phát sinh trong quá trình triển khai.
- Cán bộ phụ trách Điểm Tân Kiều: Thường trực quản lý nền nếp, theo dõi sĩ số học sinh, kiểm tra cơ sở vật chất, thiết bị dạy học và an ninh trường học tại điểm lẻ Tân Kiều; báo cáo định kỳ về Ban Giám hiệu.

2. Các Tổ chuyên môn (07 tổ: Tổ Toán 15 GV, Tổ Ngữ văn 17 GV, Tổ KHXH 16 GV, Tổ KHTN-CN 26 GV, Tổ Tiếng Anh - Tin học 16 GV, Tổ GDTC-QPAN-NT 12 GV, Tổ Văn phòng 14 NV):
- Căn cứ kế hoạch này, từng tổ chuyên môn tổ chức họp thống nhất, xây dựng Kế hoạch dạy học 2 buổi/ngày chi tiết cho từng môn học thuộc tổ phụ trách; xác định rõ nội dung củng cố, phụ đạo và nội dung bồi dưỡng nâng cao.
- Phân công giáo viên trong tổ giảng dạy buổi 2 đúng chuyên môn đào tạo, công bằng, phù hợp với định mức tiết dạy được giao; theo dõi và hướng dẫn giáo viên thực hiện kê khai giờ dạy trung thực, chính xác hàng tuần trên hệ thống phân công chuyên môn.
- Tổ chức sinh hoạt chuyên môn định kỳ theo nghiên cứu bài học; biên soạn hệ thống phiếu học tập, đề cương ôn tập, tài liệu bồi dưỡng HSG và ngân hàng câu hỏi kiểm tra phân hóa theo năng lực học sinh.

3. Giáo viên bộ môn:
- Thực hiện nghiêm túc kế hoạch dạy học buổi 2 đã được phê duyệt; lên lớp đúng giờ, chuẩn bị giáo án chu đáo, quản lý học sinh nghiêm túc trong suốt tiết học; ghi chép sổ đầu bài đầy đủ, chính xác.
- Đổi mới mạnh mẽ phương pháp dạy học, tăng cường tương tác, phát huy tính tích cực, chủ động của học sinh; tuyệt đối không cắt xén nội dung chương trình chính khóa để chuyển sang dạy vào buổi 2.
- Thường xuyên rà soát, nắm chắc năng lực từng học sinh trong lớp; kịp thời động viên, hỗ trợ học sinh có học lực yếu kém để giúp các em tiến bộ; đồng thời bồi dưỡng những em có năng khiếu.
- Thực hiện cập nhật kết quả đánh giá, nhận xét học sinh trên hệ thống hồ sơ sổ sách điện tử đúng tiến độ quy định.

4. Giáo viên chủ nhiệm:
- Phối hợp chặt chẽ với cha mẹ học sinh để thông báo rõ ràng thời khóa biểu học tập 2 buổi/ngày; nắm chắc hoàn cảnh gia đình, điều kiện đi lại của từng học sinh trong lớp.
- Quản lý chặt chẽ sĩ số học sinh, điểm danh đầu giờ mỗi buổi học; kịp thời liên hệ với gia đình khi học sinh vắng học không rõ lý do; giáo dục học sinh ý thức chấp hành an toàn giao thông, giữ gìn vệ sinh và an ninh trật tự trong giờ nghỉ giữa 2 buổi.
- Lập danh sách học sinh có nhu cầu tham gia phụ đạo, bồi dưỡng hoặc tham gia các câu lạc bộ buổi 2 gửi về Ban Giám hiệu (qua Phó Hiệu trưởng Nguyễn Minh Trí) phê duyệt.

5. Ban Đại diện Cha mẹ học sinh và các Đoàn thể trong nhà trường:
- Ban Đại diện Cha mẹ học sinh: Phối hợp cùng nhà trường tuyên truyền, tạo sự đồng thuận cao; tạo điều kiện thuận lợi nhất về phương tiện đi lại, phương án ăn trưa/nghỉ trưa an toàn cho học sinh học 2 buổi/ngày.
- Đoàn Thanh niên, Đội Thiếu niên: Tổ chức các hoạt động văn hóa, văn nghệ, giải thể thao học đường, câu lạc bộ sở thích, các buổi sinh hoạt chuyên đề bổ ích vào các buổi chiều, tạo sân chơi lành mạnh giúp học sinh phát triển toàn diện.`,
      },
      {
        heading: 'V. CHẾ ĐỘ THÔNG TIN, BÁO CÁO',
        content: `1. Chế độ thông tin, báo cáo:
- Định kỳ hằng tuần, các Tổ trưởng chuyên môn tổng hợp tình hình thực hiện dạy học buổi 2 và tình hình kê khai tiết dạy của giáo viên trong tổ, báo cáo Phó Hiệu trưởng phụ trách chuyên môn qua giao ban chuyên môn.
- Nhà trường thực hiện nghiêm túc chế độ báo cáo kết quả tổ chức dạy học 2 buổi/ngày về Sở Giáo dục và Đào tạo Đồng Tháp (qua Phòng Giáo dục Phổ thông, Email: giaoducphothong@dongthap.edu.vn) theo đúng quy định:
  + Báo cáo sơ kết Học kỳ I trước ngày 15 tháng 01 năm 2027.
  + Báo cáo tổng kết năm học trước ngày 30 tháng 5 năm 2027.
  + Báo cáo đột xuất khi có yêu cầu của cơ quan quản lý cấp trên.

2. Khen thưởng và kiểm tra, giám sát:
- Ban Giám hiệu tổ chức kiểm tra định kỳ và đột xuất nền nếp dạy học buổi 2 tại cả 3 điểm trường; kịp thời chấn chỉnh các biểu hiện dạy thêm, học thêm sai quy định hoặc gây quá tải cho học sinh.
- Kết quả thực hiện kế hoạch dạy học 2 buổi/ngày là một trong những tiêu chí quan trọng để đánh giá, xếp loại thi đua của các tổ chuyên môn, cán bộ quản lý và giáo viên vào cuối học kỳ và cuối năm học 2026 - 2027./.`,
      },
    ],
    recipients: [
      'Sở GDĐT Đồng Tháp (để báo cáo);',
      'UBND huyện Tháp Mười (để báo cáo);',
      'UBND xã Đốc Binh Kiều, UBND xã Tân Kiều (để phối hợp);',
      'Ban Giám hiệu trường (để chỉ đạo);',
      '07 Tổ chuyên môn, Tổ Văn phòng (để thực hiện);',
      'Bộ phận phụ trách Điểm Tân Kiều (để thực hiện);',
      'Ban Đại diện Cha mẹ học sinh trường (để phối hợp);',
      'Lưu: VT, CM.',
    ],
    status: 'official',
  },
  {
    id: 'doc-qd-105',
    type: 'decision',
    typeLabel: 'Quyết định',
    documentNumber: 'Số: 105/QĐ-THCS&THPTĐBK',
    title: 'QUYẾT ĐỊNH',
    subTitle: 'Ban hành Quy chế hoạt động chuyên môn và quản lý hồ sơ sổ sách điện tử',
    signDate: 'Đồng Tháp, ngày 02 tháng 9 năm 2026',
    createdDate: new Date('2026-09-02').toISOString(),
    issuingAuthorityTop: 'SỞ GDĐT TỈNH ĐỒNG THÁP',
    issuingAuthority: 'TRƯỜNG THCS VÀ THPT\nĐỐC BINH KIỀU',
    signerRole: 'HIỆU TRƯỞNG',
    signerName: 'Lê Thanh Cường',
    legalBases: [
      'Thông tư số 15/2026/TT-BGDĐT ngày 24/3/2026 của Bộ trưởng Bộ GDĐT ban hành Điều lệ trường TH, THCS, THPT và trường phổ thông có nhiều cấp học',
      'Thông tư số 70/2026/TT-BGDĐT ngày 22/8/2026 của Bộ GDĐT Quy định về quản lý và sử dụng học bạ số trong các cơ sở giáo dục phổ thông',
      'Quyết định số 2606/QĐ-UBND ngày 13/8/2026 của UBND tỉnh Đồng Tháp về việc sáp nhập thành Trường THCS và THPT Đốc Binh Kiều',
      'Xét đề nghị của Phó Hiệu trưởng phụ trách chuyên môn Trường THCS và THPT Đốc Binh Kiều',
    ],
    sections: [
      {
        heading: 'QUYẾT ĐỊNH:',
        content: `Điều 1. Ban hành kèm theo Quyết định này "Quy chế hoạt động chuyên môn và quản lý hồ sơ, sổ sách điện tử" của Trường THCS và THPT Đốc Binh Kiều áp dụng cho năm học 2026 - 2027.

Điều 2. Quy chế này quy định chi tiết về:
1. Chế độ làm việc, định mức tiết dạy, sinh hoạt tổ chuyên môn định kỳ 2 tuần/lần theo nghiên cứu bài học.
2. Quy định quản lý hồ sơ sổ sách hoàn toàn trên môi trường số (học bạ số, sổ điểm điện tử, giáo án điện tử có ký duyệt số, không in ấn hồ sơ giấy hình thức).
3. Quy định về ra đề kiểm tra định kỳ có ma trận, bảng đặc tả và phân công trách nhiệm bảo đảm chất lượng dạy học đồng bộ tại cả 3 điểm trường (Đốc Binh Kiều và Tân Kiều cách 11km).

Điều 3. Các ông (bà) Phó Hiệu trưởng, Tổ trưởng các Tổ chuyên môn, Trưởng các bộ phận đoàn thể và toàn thể cán bộ, giáo viên, nhân viên Trường THCS và THPT Đốc Binh Kiều chịu trách nhiệm thi hành Quyết định này kể từ ngày ký./.`,
      },
    ],
    recipients: [
      'Như Điều 3 (để thi hành);',
      'Sở GDĐT Đồng Tháp (báo cáo);',
      'BGH trường;',
      'Lưu: VT, CM.',
    ],
    status: 'official',
  },
];
