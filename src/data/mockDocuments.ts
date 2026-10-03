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
    sourceDirectiveId: 'directive-5208',
    sourceDirective: 'Công văn số 5208/BGDĐT-GDPT và Hướng dẫn số 1061/HD-SGDĐT Sở GDĐT Đồng Tháp',
    legalBases: [
      'Thông tư số 32/2018/TT-BGDĐT ngày 26/12/2018 của Bộ GDĐT ban hành Chương trình GDPT',
      'Thông tư số 15/2026/TT-BGDĐT ngày 24/3/2026 của Bộ GDĐT ban hành Điều lệ trường TH, THCS, THPT và trường phổ thông có nhiều cấp học',
      'Công văn số 5208/BGDĐT-GDPT ngày 07/8/2026 của Bộ GDĐT về hướng dẫn thực hiện nhiệm vụ GDPT năm học 2026 - 2027',
      'Hướng dẫn số 1061/HD-SGDĐT ngày 28/8/2026 của Sở GDĐT tỉnh Đồng Tháp về thực hiện nhiệm vụ giáo dục phổ thông năm học 2026 - 2027',
      'Quyết định số 2606/QĐ-UBND ngày 13/8/2026 của UBND tỉnh Đồng Tháp về việc sáp nhập thành Trường THCS và THPT Đốc Binh Kiều',
      'Nghị quyết Hội nghị Cán bộ, viên chức Trường THCS và THPT Đốc Binh Kiều năm học 2026 - 2027',
    ],
    sections: [
      {
        heading: 'I. MỤC ĐÍCH, YÊU CẦU',
        content: `1. Mục đích:
- Nâng cao chất lượng giáo dục toàn diện, củng cố và nâng cao chất lượng giáo dục đại trà và giáo dục mũi nhọn cho học sinh toàn trường ở cả 2 cấp học (THCS và THPT).
- Tạo điều kiện thuận lợi cho học sinh được rèn luyện kỹ năng tự học, kỹ năng thực hành thí nghiệm, năng lực số và ứng dụng Trí tuệ nhân tạo (AI); tham gia các hoạt động giáo dục STEM, trải nghiệm hướng nghiệp và rèn luyện thể chất, nghệ thuật.
- Khắc phục tình trạng học thêm, dạy thêm sai quy định; giúp đỡ kịp thời những học sinh có nguy cơ chưa đạt yêu cầu cần đạt (YCCĐ) và bồi dưỡng chuyên sâu cho học sinh giỏi tham gia các kỳ thi cấp tỉnh.

2. Yêu cầu:
- Tổ chức dạy học 2 buổi/ngày phải bảo đảm tính tự nguyện, đồng thuận của cha mẹ học sinh; phù hợp với điều kiện cơ sở vật chất và đội ngũ giáo viên của từng điểm trường (Điểm chính, Điểm Đốc Binh Kiều và Điểm Tân Kiều cách 11km).
- Không gây quá tải cho học sinh và giáo viên; phân định rành mạch giữa chương trình chính khóa và các hoạt động giáo dục tăng cường buổi thứ 2.
- Bảo đảm an toàn tuyệt đối cho học sinh trong suốt thời gian học tập tại trường.`,
      },
      {
        heading: 'II. ĐẶC ĐIỂM TÌNH HÌNH VÀ CƠ CẤU ĐIỀU KIỆN TỔ CHỨC',
        content: `1. Quy mô học sinh và lớp học:
- Toàn trường: 53 lớp với 2.143 học sinh (Cấp THCS: 39 lớp với 1.613 HS; Cấp THPT: 14 lớp với 530 HS).
- Phân bổ theo 3 điểm trường:
  + Điểm chính (Khối 10, 11, 12): 14 lớp, 530 học sinh. Có 12 phòng học kiên cố, 09 phòng bộ môn, phòng máy tính.
  + Điểm Đốc Binh Kiều (Khối 6, 7, 8, 9): 24 lớp, 983 học sinh. Có 22 phòng học, sân bóng đá mini, sân bóng chuyền.
  + Điểm Tân Kiều (Khối 6, 7, 8, 9 - cách điểm chính 11 km): 15 lớp, 557 học sinh. Có 09 phòng học, 10 phòng bộ môn.

2. Thuận lợi và khó khăn:
- Thuận lợi: Được sự quan tâm của Sở GDĐT Đồng Tháp, chính quyền địa phương và sự đồng thuận cao của Ban đại diện cha mẹ học sinh. Đội ngũ giáo viên gồm 102 thầy cô có năng lực chuyên môn vững vàng, 100% đạt chuẩn và trên chuẩn.
- Khó khăn: Địa bàn trải rộng trên 2 xã; Điểm Tân Kiều cách điểm chính 11 km đòi hỏi phương án điều phối lịch học linh hoạt để tránh giáo viên phải di chuyển nhiều lần trong ngày giữa các điểm trường; cơ sở vật chất phòng bộ môn tại điểm Tân Kiều cần tiếp tục bổ sung vật tư tiêu hao.`,
      },
      {
        heading: 'III. NỘI DUNG, HÌNH THỨC VÀ KHUNG THỜI GIAN HOẠT ĐỘNG 2 BUỔI/NGÀY',
        content: `1. Nội dung tổ chức dạy học:
a) Buổi sáng (Chính khóa khối 8, 9, 10, 11, 12 và tăng cường khối 6, 7):
- Thực hiện đầy đủ chương trình các môn học bắt buộc và môn học lựa chọn theo Chương trình GDPT 2018.
- Bố trí các môn có tính tư duy cao vào các tiết đầu buổi sáng.
b) Buổi chiều (Chính khóa khối 6, 7 và tăng cường khối 8, 9, 10, 11, 12):
- Hoạt động 1: Củng cố kiến thức, phụ đạo học sinh có nguy cơ chưa đạt YCCĐ các môn Toán, Ngữ văn, Tiếng Anh, KHTN (hoàn toàn miễn phí, không thu tiền của học sinh).
- Hoạt động 2: Bồi dưỡng học sinh giỏi lớp 9 và khối 10, 11, 12 chuẩn bị kỳ thi chọn HSG cấp tỉnh Đồng Tháp.
- Hoạt động 3: Giáo dục STEM, trải nghiệm hướng nghiệp, hoạt động câu lạc bộ Tin học - Trí tuệ nhân tạo (AI), câu lạc bộ Văn học, Tiếng Anh giao tiếp.
- Hoạt động 4: Rèn luyện thể dục thể thao (bóng đá, bóng chuyền, cầu lông, điền kinh) và văn hóa nghệ thuật.

2. Khung thời gian biểu hoạt động trong ngày (Áp dụng thống nhất cho cả 3 điểm trường):
- Buổi sáng (tối đa 5 tiết):
  + 6h30 - 6h45: Vệ sinh trường lớp
  + 6h45 - 7h00: Sinh hoạt đầu giờ
  + 7h00 - 7h45: Tiết 1 (nghỉ 10 phút)
  + 7h55 - 8h40: Tiết 2 (nghỉ 15 phút)
  + 8h55 - 9h40: Tiết 3 (nghỉ 10 phút)
  + 9h50 - 10h35: Tiết 4 (nghỉ 10 phút)
  + 10h45 - 11h30: Tiết 5
- Buổi chiều (tối đa 3 tiết):
  + 14h20 - 15h05: Tiết 1 (nghỉ 15 phút)
  + 15h20 - 16h05: Tiết 2 (nghỉ 10 phút)
  + 16h15 - 17h00: Tiết 3 (nghỉ kết thúc)`,
      },
      {
        heading: 'IV. BỐ TRÍ ĐỘI NGŨ, CƠ SỞ VẬT CHẤT VÀ KINH PHÍ',
        content: `1. Phân công đội ngũ giáo viên:
- Ban Giám hiệu phân công giáo viên giảng dạy đúng chuyên ngành đào tạo, bảo đảm định mức tiết dạy theo quy định của Bộ GDĐT và Nghị định của Chính phủ.
- Ưu tiên bố trí giáo viên dạy liền buổi tại cùng một điểm trường (đặc biệt các giáo viên được phân công giảng dạy tại Điểm Tân Kiều), tránh tình trạng sáng dạy điểm Đốc Binh Kiều, chiều dạy điểm Tân Kiều trong cùng một ngày.

2. Khai thác cơ sở vật chất:
- Tận dụng tối đa 09 phòng bộ môn tại Điểm chính, 22 phòng học tại Điểm Đốc Binh Kiều và 10 phòng bộ môn tại Điểm Tân Kiều.
- Mở cửa phòng máy vi tính và thư viện trong suốt các buổi chiều để học sinh tự học, tra cứu tài liệu số và nghiên cứu khoa học dưới sự hướng dẫn của giáo viên quản lý.

3. Kinh phí thực hiện:
- Nguồn ngân sách nhà nước cấp chi thường xuyên theo định mức học sinh.
- Các nguồn hỗ trợ hợp pháp khác theo quy định hiện hành, tuyệt đối không thu tiền học thêm sai quy định.`,
      },
      {
        heading: 'V. TỔ CHỨC THỰC HIỆN',
        content: `1. Ban Giám hiệu:
- Thầy Hiệu trưởng Lê Thanh Cường phê duyệt kế hoạch, chỉ đạo chung về cơ sở vật chất và công tác an ninh, an toàn trường học.
- Thầy Phó Hiệu trưởng Nguyễn Minh Trí trực tiếp phụ trách điều hành chuyên môn dạy học 2 buổi/ngày; xếp thời khóa biểu khoa học, kiểm tra nền nếp dạy học buổi chiều; ký duyệt danh sách học sinh phụ đạo và học sinh giỏi.
- Phân công cán bộ phụ trách Điểm Tân Kiều theo dõi sĩ số, bảo đảm an ninh trật tự và vệ sinh môi trường tại điểm trường lẻ.

2. Các Tổ chuyên môn và Giáo viên:
- 08 Tổ chuyên môn xây dựng kế hoạch phân phối tiết dạy tăng cường, biên soạn đề cương, tài liệu ôn tập và phiếu học tập phù hợp từng đối tượng học sinh.
- Giáo viên bộ môn thực hiện nghiêm túc giờ giấc lên lớp, đổi mới phương pháp giảng dạy, ghi chép sổ đầu bài đầy đủ.
- Giáo viên chủ nhiệm phối hợp chặt chẽ với cha mẹ học sinh để quản lý giờ giấc, chuyên cần của học sinh giữa 2 buổi học./.`,
      },
    ],
    recipients: [
      'Sở GDĐT Đồng Tháp (báo cáo);',
      'Hiệu trưởng, các Phó Hiệu trưởng;',
      '08 Tổ chuyên môn, Tổ Văn phòng;',
      'Bộ phận phụ trách Điểm Tân Kiều;',
      'Ban Đại diện CMHS trường;',
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
