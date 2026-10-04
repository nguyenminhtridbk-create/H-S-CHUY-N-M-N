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
Toàn trường có 53 lớp với 2.143 học sinh (bình quân 40,5 học sinh/lớp), 25 học sinh khuyết tật:
- Cấp THCS (39 lớp - 1.613 học sinh):
  + Khối 6: 10 lớp, 417 học sinh (bình quân 41,7 HS/lớp), 6 học sinh khuyết tật.
  + Khối 7: 9 lớp, 377 học sinh (bình quân 41,9 HS/lớp), 6 học sinh khuyết tật.
  + Khối 8: 10 lớp, 409 học sinh (bình quân 40,9 HS/lớp), 7 học sinh khuyết tật.
  + Khối 9: 10 lớp, 410 học sinh (bình quân 41,0 HS/lớp), 3 học sinh khuyết tật.
- Cấp THPT (14 lớp - 530 học sinh):
  + Khối 10: 5 lớp, 203 học sinh (bình quân 40,6 HS/lớp), 1 học sinh khuyết tật.
  + Khối 11: 4 lớp, 142 học sinh (bình quân 35,0 HS/lớp), 2 học sinh khuyết tật.
  + Khối 12: 5 lớp, 185 học sinh (bình quân 37,0 HS/lớp).

2.2. Đội ngũ cán bộ, giáo viên, nhân viên:
Tổng số 120 người, trong đó: Ban Giám hiệu 04; Giáo viên 102; Nhân viên 14. Nữ 65 người; Đảng viên 85 người; Trình độ Thạc sĩ 09 người.
- Phân bổ theo 08 tổ:
  + Ban Giám hiệu: 4 người (4 Đảng viên, 1 ThS).
  + Tổ Toán: 15 người (4 nữ, 11 Đảng viên).
  + Tổ Ngữ văn - Thư viện - Thiết bị: 17 người (12 nữ, 16 Đảng viên, 2 ThS).
  + Tổ Lịch sử - Địa lý - GDCD - GDKTPL: 16 người (11 nữ, 10 Đảng viên, 2 ThS).
  + Tổ Vật lý - Hóa học - Sinh học - Công nghệ: 26 người (17 nữ, 19 Đảng viên, 3 ThS).
  + Tổ Ngoại ngữ - Tin học: 16 người (9 nữ, 10 Đảng viên, 1 ThS).
  + Tổ GDTC - QPAN - Nghệ thuật: 12 người (4 nữ, 11 Đảng viên).
  + Tổ Văn phòng: 14 người (8 nữ, 4 Đảng viên).
- Thống kê chuyên môn: 96 giáo viên giảng dạy bộ môn đạt chuẩn 100% (88 Đại học, 8 Thạc sĩ).

2.3. Cơ sở vật chất tại 03 điểm trường (Tổng diện tích khuôn viên: 35.380,5 m²):
- Điểm chính (THPT Đốc Binh Kiều cũ): 15.683 m², khối 10-12 (14 lớp, 530 HS). Gồm khu hiệu bộ; 09 phòng học kiên cố, 03 phòng lắp ghép; 09 phòng học bộ môn; thư viện; 3 khu vệ sinh học sinh riêng biệt; hệ thống PCCC 02 máy bơm, 11 tủ chữa cháy vách tường.
- Điểm Đốc Binh Kiều (THCS Đốc Binh Kiều cũ): 11.126,7 m², khối 6-9 (24 lớp, 983 HS). Gồm khu làm việc BGH và Văn phòng; 22 phòng học; 05 phòng chức năng; 01 nhà công vụ; sân bóng đá mini, sân bóng chuyền, khu tập luyện GDTC.
- Điểm Tân Kiều (THCS Tân Kiều cũ - cách điểm chính 11 km): 8.570,8 m², khối 6-9 (15 lớp, 557 HS). Gồm 09 phòng học; 10 phòng bộ môn; 10 phòng làm việc và sinh hoạt, có phòng Ban Giám hiệu thường trực.

2.4. Đánh giá chất lượng giáo dục năm học 2025 - 2026:
- Học sinh đỗ tốt nghiệp THPT năm 2026: 151/151 học sinh (100%).
- Học sinh tốt nghiệp THCS năm 2026: 361/362 học sinh (99,72%). Trong đó: Điểm Đốc Binh Kiều 249/249 (100%), Điểm Tân Kiều 112/113 (99,12%).
- Tuyển sinh vào lớp 10 năm học 2026 - 2027: 313/361 học sinh (86,7%).
- Tỷ lệ học sinh đỗ Đại học đạt 70%.
- Học sinh giỏi cấp tỉnh đạt 11 giải (Ngữ văn: 1 ba, 3 KK; Hóa học: 1 KK; Lịch sử: 1 nhì, 3 ba, 1 KK; GDKTPL: 1 KK).`,
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
- Thực hiện tốt các cuộc vận động: "Mỗi thầy, cô giáo là tấm gương đạo đức, tự học và sáng tạo", "Đổi mới, sáng tạo trong dạy và học". Mỗi cán bộ, giáo viên, nhân viên là một tuyên truyền viên về việc xây dựng hình ảnh nhà trường.
- Xây dựng trường học hạnh phúc, phát động phong trào đoàn kết, kỷ cương, trách nhiệm trong tập thể sư phạm.

2. Thực hiện Chương trình GDPT 2018 bảo đảm chất lượng và hiệu quả:
- Tổ chức dạy học các môn học và hoạt động giáo dục theo Chương trình GDPT 2018, điều chỉnh phù hợp với điều kiện thực tế nhà trường.
- Chuẩn bị cơ sở vật chất, giáo viên để thực hiện dạy học 2 buổi/ngày phù hợp theo điều kiện nhà trường tại cả 3 điểm trường.
- Tổ chức các nhóm môn học lựa chọn và chuyên đề học tập: tư vấn học sinh, cha mẹ học sinh chọn môn theo năng lực, sở trường và định hướng nghề nghiệp.
- Đổi mới phương pháp dạy học theo hướng phát triển năng lực, phẩm chất; chú trọng giáo dục STEM, nghiên cứu khoa học, trải nghiệm sáng tạo.

3. Tăng cường các điều kiện để đảm bảo chất lượng:
- Phòng học: Rà soát, sắp xếp hợp lý, thuận lợi cho học sinh.
- Cơ sở vật chất, thiết bị, học liệu: Đầu tư, nâng cấp, khai thác hiệu quả phòng học, phòng bộ môn, phòng thực hành. Ứng dụng CNTT, xây dựng kho học liệu số phục vụ dạy học và kiểm tra, đánh giá.
- Đội ngũ giáo viên, cán bộ quản lý: Bảo đảm đủ giáo viên cho tất cả các môn học. Bồi dưỡng thường xuyên, nâng cao năng lực dạy học tích hợp, ngoại ngữ. Hướng tới tiếng Anh là ngôn ngữ thứ hai trong trường.

4. Thực hiện hiệu quả các phương pháp, hình thức tổ chức dạy học, kiểm tra đánh giá, hướng nghiệp, phân luồng và phát triển năng lực số:
- 100% giáo viên đổi mới phương pháp dạy học, tăng cường hoạt động trải nghiệm, dạy học dự án.
- Đa dạng hóa kiểm tra đánh giá: vấn đáp, viết, thực hành, quan sát, sản phẩm học tập. 100% đề kiểm tra định kỳ có ma trận và bảng đặc tả.
- Nâng cao chất lượng giáo dục hướng nghiệp, phân luồng sau THCS và THPT.
- Phát triển năng lực số: Triển khai học bạ số, hồ sơ điện tử, hệ thống quản lý học tập trực tuyến. Ứng dụng AI và dữ liệu lớn trong quản lý, tư vấn hướng nghiệp, cá nhân hóa học tập. Bảo đảm an toàn thông tin và dữ liệu cá nhân.

5. Nâng cao chất lượng phổ cập giáo dục và thực hiện công bằng trong tiếp cận giáo dục:
- Thực hiện giáo dục hòa nhập đối với 25 học sinh khuyết tật; xây dựng và triển khai kế hoạch giáo dục cá nhân.
- Quan tâm hỗ trợ học sinh dân tộc thiểu số và học sinh có hoàn cảnh khó khăn.

6. Tiếp tục đổi mới công tác quản lý trong nhà trường:
- Đổi mới quản trị trường học: Dân chủ, kỷ cương, thân thiện, an toàn; lấy chất lượng làm thước đo.
- Quản lý chương trình và kế hoạch giáo dục: Đẩy mạnh kiểm tra nội bộ, sinh hoạt chuyên môn theo nghiên cứu bài học.
- Chuẩn bị điều kiện ban đầu để trường đạt chuẩn Quốc gia mức độ 1 vào năm 2029.`,
      },
      {
        heading: 'IV. MỘT SỐ CHỈ TIÊU CƠ BẢN NĂM HỌC 2026 - 2027',
        content: `1. Chỉ tiêu nâng cao chất lượng dạy học:
a) Mục tiêu học tập và rèn luyện:
- Khối 10-12 (530 học sinh):
  + Học tập: Tốt 36,04% (191 HS); Khá 44,72% (237 HS); Đạt 18,30% (97 HS); Chưa đạt dưới 0,94% (5 HS).
  + Rèn luyện: Tốt 96,04% (509 HS); Khá 3,96% (21 HS); không có học sinh Chưa đạt.
  + Danh hiệu: 35 học sinh xuất sắc, 156 học sinh giỏi.
- Khối 6-9 (1.590 học sinh tại điểm Đốc Binh Kiều và Tân Kiều):
  + Học tập: Tốt 31,26% (497 HS); Khá 34,65% (551 HS); Đạt 33,33% (530 HS); Chưa đạt 0,75% (12 HS).
  + Rèn luyện: Tốt 91,64% (1.457 HS); Khá 6,42% (102 HS); Đạt 1,95% (31 HS); không có học sinh Chưa đạt.
  + Danh hiệu: 204 học sinh xuất sắc, 293 học sinh giỏi.

b) Chỉ tiêu thi tốt nghiệp và tuyển sinh:
- Tốt nghiệp THPT năm 2027: 185/185 học sinh (tỉ lệ 100%).
- Điểm trung bình thi tốt nghiệp THPT năm 2027: Phấn đấu đạt 5,99 điểm toàn trường (Toán 5,14; Ngữ văn 7,52; Lịch sử 7,81; Tiếng Anh 4,82; Vật lí 4,82; Hóa học 6,79; Sinh học 5,36; Địa lí 5,83; GDKT&PL 5,85).
- Tốt nghiệp THCS năm 2027: 407/407 học sinh (tỉ lệ 100%). Trong đó: Điểm Đốc Binh Kiều 250/250 (100%), Điểm Tân Kiều 157/157 (100%).
- Tuyển sinh vào lớp 10 năm học 2027 - 2028: Đạt 90% số học sinh tốt nghiệp THCS (Điểm Đốc Binh Kiều 227/250 = 90,8%; Điểm Tân Kiều 142/157 = 90%).
- Tuyển sinh vào các trường nghề: 10% học sinh tốt nghiệp THCS.
- Tỷ lệ học sinh đỗ Đại học: Đạt trên 75%.
- Học sinh giỏi cấp tỉnh: Phấn đấu đạt 18 giải (Toán: 01, Vật lý: 01, Địa lý: 01, Tiếng Anh: 01, Tin học: 01, Ngữ văn: 05, Hóa học: 01, Sinh học: 01, Lịch sử: 06, GDKTPL: 01).

2. Chỉ tiêu nâng cao chất lượng đội ngũ cán bộ, giáo viên, nhân viên:
- 100% giáo viên đạt chuẩn trình độ chuyên môn đào tạo; phấn đấu 01 giáo viên đăng ký học sau đại học trong năm học 2026-2027.
- Chuẩn nghề nghiệp: 100% giáo viên đạt chuẩn trở lên (70% Tốt, 25% Khá, 5% Đạt).
- Đánh giá viên chức: 100% hoàn thành nhiệm vụ trở lên (20% Hoàn thành xuất sắc nhiệm vụ, 80% Hoàn thành tốt nhiệm vụ).
- Viết sáng kiến kinh nghiệm: Mỗi tổ phấn đấu đạt tối thiểu 40% số sáng kiến so với số lượng giáo viên, nhân viên trong tổ.
- Quy định dự giờ, thao giảng:
  + Hiệu trưởng: dự giờ ít nhất 10% giáo viên/học kỳ.
  + Phó Hiệu trưởng: dự giờ ít nhất 30% giáo viên/học kỳ (theo Điểm trường phụ trách).
  + Tổ trưởng chuyên môn: dự giờ 100% giáo viên trong tổ ở điểm trường công tác, ít nhất 30% giáo viên ở 2 điểm còn lại.
  + Tổ phó chuyên môn: dự giờ ít nhất 100% giáo viên trong tổ theo điểm trường mình đang công tác.
  + Giáo viên dự giờ đồng nghiệp: ít nhất 04 tiết/học kỳ.
  + Tổ chuyên môn tổ chức dạy minh họa: 01 tiết/học kỳ; xây dựng ít nhất 01 bài học/chuyên đề nghiên cứu/môn học/học kỳ.
  + Mỗi tổ đăng ký ít nhất 01 giáo viên tham gia thi Giáo viên dạy giỏi cấp tỉnh.
- Công tác phát triển Đảng: Phấn đấu kết nạp 02 học sinh vào Đảng Cộng sản Việt Nam.

3. Chỉ tiêu thi đua, khen thưởng:
- Tập thể: Phấn đấu Trường THCS và THPT Đốc Binh Kiều đạt danh hiệu Tập thể lao động xuất sắc.
- Khen thưởng: 06 cá nhân được tặng Bằng khen của UBND tỉnh Đồng Tháp.
- Cấp trường: 100% CB-GV-NV hoàn thành tốt nhiệm vụ trở lên (20% Lao động xuất sắc, 70% Lao động tiên tiến).`,
      },
      {
        heading: 'V. KHUNG KẾ HOẠCH THỜI GIAN VÀ KHUNG THỜI GIAN HOẠT ĐỘNG TRONG NGÀY',
        content: `1. Khung thời gian thực hiện chương trình:
- Tựu trường: Khối 9 và Khối 12 ngày 22/8/2026; Khối 6, 7, 8, 10 và 11 ngày 28/8/2026.
- Khai giảng: Ngày 05/9/2026.
- Học kỳ 1 (18 tuần thực học): Từ ngày 07/9/2026 đến ngày 10/01/2027.
- Học kỳ 2 (17 tuần thực học): Từ ngày 11/01/2027 đến ngày 23/5/2027.
- Hoàn tất hồ sơ, tổng kết năm học: Từ ngày 24/5/2027 đến ngày 30/5/2027. Kết thúc năm học chậm nhất ngày 31/5/2027.

2. Khung thời gian hoạt động trong ngày (Áp dụng thống nhất cho cả 3 điểm trường - MỖI BUỔI 5 TIẾT):
a) Buổi sáng (Từ 6h30 đến 11h30):
Thực hiện chương trình chính khóa đối với khối 8, 9, 10, 11, 12 và chương trình dạy học 2 buổi/ngày (nếu có), dạy học trải nghiệm, bồi dưỡng học sinh giỏi, phụ đạo học sinh yếu, sinh hoạt các câu lạc bộ đối với khối 6, 7.
- 6h30 - 6h45 (15 phút): Vệ sinh trường, lớp.
- 6h45 - 7h00 (15 phút): Sinh hoạt đầu giờ.
- 7h00 - 7h45 (45 phút): Học tiết 1 (nghỉ 10 phút đổi tiết).
- 7h55 - 8h40 (45 phút): Học tiết 2 (nghỉ 15 phút đổi tiết).
- 8h55 - 9h40 (45 phút): Học tiết 3 (nghỉ 10 phút đổi tiết).
- 9h50 - 10h35 (45 phút): Học tiết 4 (nghỉ 10 phút đổi tiết).
- 10h45 - 11h30 (45 phút): Học tiết 5.

b) Buổi chiều (Từ 12h00 đến 17h00):
Thực hiện chương trình chính khóa đối với khối 6, 7 và chương trình dạy học 2 buổi/ngày (nếu có), dạy học trải nghiệm, bồi dưỡng học sinh giỏi, phụ đạo học sinh yếu, sinh hoạt các câu lạc bộ đối với các khối còn lại (khối 8, 9, 10, 11, 12).
- 12h00 – 12h15 (15 phút): Vệ sinh trường, lớp.
- 12h15 – 12h30 (15 phút): Sinh hoạt đầu giờ.
- 12h30 – 13h15 (45 phút): Học tiết 1 (nghỉ 10 phút đổi tiết).
- 13h25 – 14h10 (45 phút): Học tiết 2 (nghỉ 10 phút đổi tiết).
- 14h20 – 15h05 (45 phút): Học tiết 3 (nghỉ 15 phút đổi tiết).
- 15h20 – 16h05 (45 phút): Học tiết 4 (nghỉ 10 phút đổi tiết).
- 16h15 – 17h00 (45 phút): Học tiết 5.`,
      },
      {
        heading: 'VI. TỔ CHỨC THỰC HIỆN',
        content: `1. Ban Giám hiệu:
- Thầy Hiệu trưởng Lê Thanh Cường: Lãnh đạo, điều hành chung toàn diện hoạt động của nhà trường; chịu trách nhiệm trước Sở GDĐT về thực hiện kế hoạch giáo dục.
- Thầy Phó Hiệu trưởng Nguyễn Minh Trí: Trực tiếp phụ trách chỉ đạo chuyên môn toàn trường; ký duyệt kế hoạch các tổ chuyên môn, thời khóa biểu, duyệt đề kiểm tra định kỳ; theo dõi, thẩm định Kế hoạch bài dạy của giáo viên.
- Phân công cán bộ Ban Giám hiệu thường trực tại Điểm Tân Kiều để nắm bắt tình hình và kịp thời giải quyết các vướng mắc chuyên môn.

2. Các Tổ chuyên môn và Tổ Văn phòng:
- Căn cứ Kế hoạch giáo dục nhà trường, từng tổ xây dựng Kế hoạch dạy học môn học và Kế hoạch giáo dục của tổ trước ngày 05/9/2026 gửi Phó Hiệu trưởng phê duyệt.
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
    sourceDirectiveId: 'directive-2buoi-sgddt',
    sourceDirective: 'Kế hoạch số    /KH-SGDĐT ngày    tháng 8 năm 2026 của Sở Giáo dục và Đào tạo tỉnh Đồng Tháp',
    legalBases: [
      'Kế hoạch số    /KH-SGDĐT ngày    tháng 8 năm 2026 của Sở Giáo dục và Đào tạo tỉnh Đồng Tháp về Triển khai tổ chức dạy học 2 buổi/ngày đối với cơ sở giáo dục phổ thông trên địa bàn tỉnh Đồng Tháp',
    ],
    sections: [
      {
        heading: 'I. MỤC ĐÍCH, YÊU CẦU',
        content: `1. Mục đích:
a) Tổ chức thực hiện nghiêm túc, hiệu quả Kế hoạch của Sở Giáo dục và Đào tạo tỉnh Đồng Tháp về tổ chức dạy học 2 buổi/ngày; nâng cao chất lượng giáo dục toàn diện cho học sinh ở cả 2 cấp học (THCS và THPT) tại các điểm trường của Trường THCS và THPT Đốc Binh Kiều.
b) Nâng cao chất lượng các hoạt động giáo dục toàn diện về Đức - Trí - Thể - Mỹ, bao gồm: giáo dục đạo đức, kỹ năng sống, giáo dục STEM/STEAM, giáo dục văn hóa đọc, văn hóa học đường, giáo dục thể chất, nghệ thuật, giáo dục tài chính; phát triển năng lực ngoại ngữ, năng lực số, năng lực trí tuệ nhân tạo (AI); hình thành ý thức và thói quen tự học suốt đời cho học sinh.
c) Nâng cao chất lượng giờ học chính khóa; khắc phục triệt để tình trạng dạy thêm, học thêm không đúng quy định; xây dựng môi trường giáo dục lành mạnh, an toàn, bảo đảm công bằng trong tiếp cận giáo dục giữa điểm trường chính và điểm trường lẻ.
d) Sử dụng hiệu quả đội ngũ cán bộ, giáo viên và cơ sở vật chất hiện có tại các điểm trường; phát huy tối đa tinh thần đổi mới phương pháp dạy học và kiểm tra, đánh giá theo hướng phát triển năng lực, phẩm chất người học.

2. Yêu cầu:
a) Thực hiện hiệu quả mục tiêu Chương trình GDPT 2018, bảo đảm về thời lượng dạy học các môn học và tổ chức các hoạt động giáo dục; không gây quá tải, phù hợp tâm sinh lý lứa tuổi và sức khỏe của học sinh THCS và THPT.
b) Bảo đảm quyền lợi, đáp ứng nhu cầu, nguyện vọng học tập của học sinh; phù hợp với điều kiện thực tế của từng điểm trường và địa phương; thực hiện hiệu quả chủ trương xã hội hóa giáo dục bảo đảm nguyên tắc tự nguyện, công khai, minh bạch, đúng quy định của pháp luật.
c) Tổ chức thực hiện dạy học 2 buổi/ngày bảo đảm sử dụng hiệu quả cơ sở vật chất (phòng học, phòng bộ môn, phòng máy vi tính, sân thể thao) và phân công đội ngũ giáo viên hợp lý; phát huy vai trò chủ động, sáng tạo của các tổ chuyên môn.
d) Thời lượng dạy học buổi 1 và buổi 2 trong tuần thực hiện linh hoạt trong sắp xếp thời khóa biểu; phân định rành mạch giữa chương trình chính khóa và các hoạt động giáo dục tăng cường buổi thứ 2; bảo đảm an toàn giao thông cho học sinh và giáo viên khi di chuyển giữa các điểm trường.`,
      },
      {
        heading: 'II. NỘI DUNG, HÌNH THỨC TỔ CHỨC DẠY HỌC 2 BUỔI/NGÀY',
        content: `Nội dung, hình thức tổ chức dạy học 2 buổi/ngày tại Trường THCS và THPT Đốc Binh Kiều được triển khai thực hiện nghiêm túc theo Kế hoạch của Sở Giáo dục và Đào tạo và Kế hoạch giáo dục nhà trường số 34/KH-THCS&THPTĐBK, cụ thể đối với 2 cấp học như sau:

1. Đối với cấp trung học cơ sở:
a) Thời lượng và bố trí thời gian:
- Tổ chức dạy học 2 buổi/ngày cho học sinh cấp THCS tại Điểm THCS Đốc Binh Kiều (khối 6-9) và Điểm THCS Tân Kiều (khối 6-9).
- Bố trí thời gian học tập 6 ngày/tuần (từ thứ Hai đến thứ Bảy), mỗi ngày không quá 7 tiết học, mỗi tiết 45 phút theo đúng khung thời gian hoạt động trong ngày đã được nhà trường ban hành thống nhất:
  + Đối với Khối 6 và Khối 7: Buổi chiều học chương trình chính khóa (từ 12h30 đến 17h00, tối đa 5 tiết); buổi sáng tham gia các hoạt động giáo dục 2 buổi/ngày (từ 7h00 đến 11h30) gồm dạy học trải nghiệm, bồi dưỡng học sinh giỏi, phụ đạo học sinh yếu, sinh hoạt các câu lạc bộ.
  + Đối với Khối 8 và Khối 9: Buổi sáng học chương trình chính khóa (từ 7h00 đến 11h30, tối đa 5 tiết); buổi chiều tham gia các hoạt động giáo dục 2 buổi/ngày (từ 12h30 đến 17h00) gồm bồi dưỡng học sinh giỏi, phụ đạo học sinh yếu, ôn tập tuyển sinh lớp 10, sinh hoạt câu lạc bộ và giáo dục STEM.
b) Nội dung và hình thức dạy học:
- Buổi 1 (Chính khóa): Thực hiện đầy đủ kế hoạch giáo dục môn học và hoạt động giáo dục theo Chương trình GDPT 2018 ban hành kèm theo Thông tư số 32/2018/TT-BGDĐT.
- Buổi 2 (Tăng cường & Phát triển năng lực):
  + Tổ chức ôn tập, phụ đạo củng cố kiến thức cho học sinh có nguy cơ chưa đạt yêu cầu cần đạt (YCCĐ) các môn Toán, Ngữ văn, Tiếng Anh, Khoa học tự nhiên (hoàn toàn miễn phí, không thu tiền học sinh).
  + Bồi dưỡng học sinh giỏi lớp 9 tham gia kỳ thi chọn HSG cấp huyện và cấp tỉnh Đồng Tháp (phấn đấu cùng toàn trường đạt 18 giải cấp tỉnh).
  + Tổ chức ôn tập, củng cố kiến thức trọng tâm cho học sinh lớp 9 chuẩn bị kỳ thi tuyển sinh vào lớp 10 THPT (mục tiêu tuyển sinh vào lớp 10 đạt 90%).
  + Tổ chức hoạt động giáo dục STEM/STEAM, câu lạc bộ Tin học - Trí tuệ nhân tạo (AI), hoạt động trải nghiệm hướng nghiệp, giáo dục kỹ năng sống, an toàn giao thông, văn hóa đọc tại thư viện trường, rèn luyện thể dục thể thao và văn nghệ.
- Đa dạng hóa hình thức tổ chức dạy học: Phân chia nhóm học sinh theo năng lực, trình độ; tổ chức câu lạc bộ theo sở thích; tăng cường thời lượng tự học có hướng dẫn của giáo viên bộ môn tại thư viện và phòng bộ môn.

2. Đối với cấp trung học phổ thông:
a) Thời lượng và bố trí thời gian:
- Tổ chức dạy học 2 buổi/ngày cho học sinh Khối 10, Khối 11, Khối 12 tại Điểm trường chính.
- Bố trí thời gian học tập 6 ngày/tuần, mỗi ngày không quá 7 tiết học, mỗi tiết 45 phút.
- Khung thời gian:
  + Buổi sáng (từ 7h00 đến 11h30, tối đa 5 tiết): Dạy học toàn bộ chương trình chính khóa các môn bắt buộc và cụm chuyên đề lựa chọn.
  + Buổi chiều (từ 12h30 đến 17h00, tối đa 3-4 tiết, bố trí 3-4 buổi/tuần): Dạy học buổi 2 theo định hướng phân hóa, ôn thi tốt nghiệp THPT và bồi dưỡng năng khiếu.
b) Nội dung và hình thức dạy học:
- Buổi 1 (Chính khóa): Hoàn thành đầy đủ chuẩn kiến thức, kỹ năng của Chương trình GDPT 2018; bảo đảm tiến độ phân phối chương trình của các tổ chuyên môn.
- Buổi 2 (Tăng cường & Chuyên sâu):
  + Tổ chức phụ đạo, giúp đỡ học sinh chưa đạt chuẩn ở các môn Toán, Ngữ văn, Tiếng Anh, Vật lý, Hóa học, Sinh học, Lịch sử, Địa lý.
  + Bồi dưỡng chuyên sâu các đội tuyển học sinh giỏi cấp tỉnh khối 10, 11, 12 ở các môn văn hóa (phấn đấu đạt giải cấp tỉnh theo chỉ tiêu 18 giải của trường).
  + Tổ chức ôn tập thi Tốt nghiệp THPT năm 2027 cho học sinh Khối 12 (mục tiêu tốt nghiệp 100%, điểm trung bình toàn trường đạt 5,99 điểm, tỷ lệ đỗ Đại học trên 75%) theo 2 nhóm định hướng nghề nghiệp: Tổ hợp Khoa học tự nhiên và Tổ hợp Khoa học xã hội.
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
- Khai thác tối đa hiệu suất sử dụng của các phòng học và phòng bộ môn kiên cố tại các điểm trường.
- Mở cửa toàn bộ hệ thống phòng máy vi tính, thư viện tại các điểm trường trong suốt các buổi chiều để phục vụ học sinh tự học, đọc sách, nghiên cứu tài liệu số và khai thác học liệu điện tử.`,
      },
      {
        heading: 'IV. TỔ CHỨC THỰC HIỆN',
        content: `Để kế hoạch dạy học 2 buổi/ngày đạt chất lượng thực chất và hiệu quả cao, nhà trường phân công trách nhiệm cụ thể, xuyên suốt gắn liền với hệ thống điều hành chuyên môn của đơn vị như sau:

1. Ban Giám hiệu:
- Thầy Hiệu trưởng Lê Thanh Cường: Lãnh đạo, chỉ đạo chung toàn diện; chịu trách nhiệm trước Sở GDĐT về việc tổ chức dạy học 2 buổi/ngày của đơn vị; phê duyệt kế hoạch, quyết định phân công nhiệm vụ; bảo đảm kinh phí, cơ sở vật chất, an ninh trật tự và an toàn trường học tại các điểm trường.
- Thầy Phó Hiệu trưởng Nguyễn Minh Trí:
  + Trực tiếp phụ trách chỉ đạo, điều hành công tác chuyên môn dạy học 2 buổi/ngày đối với cả 2 cấp THCS và THPT trên toàn trường.
  + Trực tiếp xây dựng, điều chỉnh thời khóa biểu các lớp khoa học, hợp lý, bảo đảm không gây quá tải cho học sinh và giáo viên; ưu tiên sắp xếp lịch dạy cho giáo viên liền buổi tại cùng một điểm trường để giảm thiểu việc di chuyển giữa các điểm trường.
  + Phê duyệt kế hoạch dạy học buổi 2 của các tổ chuyên môn; ký duyệt danh sách học sinh phụ đạo và học sinh giỏi; chỉ đạo việc đổi mới kiểm tra, đánh giá thường xuyên.
  + Giám sát chặt chẽ phân công giảng dạy, theo dõi việc kê khai thừa - thiếu tiết hàng tuần và tổng hợp kê khai tiết của cán bộ, giáo viên trên hệ thống quản lý chuyên môn trực tuyến của nhà trường (https://phancongchuyenmonthcsthptdbk.vercel.app/), bảo đảm công khai, minh bạch, đúng định mức quy định.
  + Thường xuyên kiểm tra, đôn đốc nền nếp dạy học buổi chiều tại các điểm trường; kịp thời tháo gỡ những khó khăn, vướng mắc phát sinh trong quá trình triển khai.
- Cán bộ phụ trách Điểm Tân Kiều: Thường trực quản lý nền nếp, theo dõi sĩ số học sinh, kiểm tra cơ sở vật chất, thiết bị dạy học và an ninh trường học tại điểm Tân Kiều; báo cáo định kỳ về Ban Giám hiệu.

2. Các Tổ chuyên môn và Tổ Văn phòng:
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
- Cuối mỗi học kỳ và kết thúc năm học, Ban Giám hiệu tổ chức họp sơ kết, tổng kết đánh giá rút kinh nghiệm công tác dạy học 2 buổi/ngày; biểu dương, khen thưởng các tập thể, cá nhân có thành tích xuất sắc; đồng thời báo cáo kết quả thực hiện về Sở Giáo dục và Đào tạo tỉnh Đồng Tháp theo quy định.

2. Hiệu lực thi hành:
- Kế hoạch này có hiệu lực thi hành kể từ ngày ký và được áp dụng trong toàn thể cán bộ quản lý, giáo viên, nhân viên và học sinh Trường THCS và THPT Đốc Binh Kiều trong năm học 2026 - 2027.
- Trong quá trình triển khai thực hiện, nếu có khó khăn, vướng mắc phát sinh vượt thẩm quyền giải quyết, các tổ chuyên môn, cá nhân phản ánh kịp thời về Ban Giám hiệu (qua Phó Hiệu trưởng Nguyễn Minh Trí) để xem xét, điều chỉnh cho phù hợp với thực tiễn./.`,
      },
    ],
    recipients: [
      'Sở GDĐT Đồng Tháp (để báo cáo);',
      'Hiệu trưởng (để chỉ đạo);',
      'Các Phó Hiệu trưởng (để phối hợp);',
      'Các tổ chuyên môn, văn phòng (để thực hiện);',
      'Ban ĐD Cha mẹ học sinh (để phối hợp);',
      'Đoàn trường, Đội TNTP (để phối hợp);',
      'Lưu: VT, CM.',
    ],
    status: 'draft',
  },
];
