export const OFFICIAL_DOCUMENTS_INFO = {
  dispatchNumber: "3284/SGDĐT-GDPT",
  issueDate: "24/8/2026",
  issuer: "Sở Giáo dục và Đào tạo tỉnh Đồng Tháp",
  signee: "KT. Giám đốc - Phó Giám đốc Nguyễn Phương Toàn",
  basis: [
    "Thông tư số 15/2026/TT-BGDĐT ngày 24/3/2026 của Bộ GDĐT ban hành Điều lệ trường TH, THCS, THPT và trường nhiều cấp học",
    "Công văn số 5512/BGDĐT-GDTrH ngày 18/12/2020 của Bộ GDĐT về việc xây dựng và tổ chức thực hiện kế hoạch giáo dục"
  ],
  annexes: [
    {
      code: "Phụ lục I",
      title: "Kế hoạch giáo dục của Tổ chuyên môn",
      sections: [
        "I. Đặc điểm tình hình (Số lớp, số học sinh, tình hình đội ngũ, thiết bị dạy học)",
        "II. Kế hoạch dạy học (1. Khung phân phối chương trình 35 tuần; 2. Chuyên đề lựa chọn cấp THPT)",
        "III. Kế hoạch tổ chức các hoạt động giáo dục (STEM, CLB, trải nghiệm,...)",
        "IV. Nhiệm vụ khác (Sinh hoạt tổ theo NCBH, bồi dưỡng HSG, hỗ trợ HS yếu, NCKH,...)"
      ]
    },
    {
      code: "Phụ lục II",
      title: "Khung Kế hoạch bài dạy (Giáo án)",
      sections: [
        "I. Mục tiêu (1. Năng lực chung và đặc thù; 2. Phẩm chất gắn với nội dung bài)",
        "II. Thiết bị dạy học và học liệu (Cụ thể, phù hợp hoạt động học)",
        "III. Tiến trình dạy học (HĐ 1: Xác định vấn đề/Mở đầu; HĐ 2: Hình thành kiến thức mới; HĐ 3: Luyện tập; HĐ 4: Vận dụng)",
        "IV. Phụ lục (Công cụ kiểm tra, rubric, bảng kiểm)",
        "Lưu ý cốt lõi: Không viết lời thoại GV-HS; mô tả hành động GV giao nhiệm vụ, hướng dẫn, nhận xét và HS thực hiện, thảo luận, báo cáo."
      ]
    }
  ]
};

export const SCHOOL_CAMPUSES = [
  {
    id: "dbk-main",
    name: "Điểm chính Đốc Binh Kiều (THCS)",
    classCount: 24,
    grades: "Khối 6, 7, 8, 9",
    locationNote: "Khu vực trung tâm Đốc Binh Kiều, điều kiện phòng máy và TV tương đối đầy đủ",
    distanceFromMainCampus: "0 km (Điểm trung tâm)"
  },
  {
    id: "tan-kieu",
    name: "Điểm trường Tân Kiều (THCS)",
    classCount: 15,
    grades: "Khối 6, 7, 8, 9",
    locationNote: "Khu vực Tân Kiều, cơ sở vật chất phòng bộ môn còn cần tối ưu, kết nối mạng cần đồng bộ",
    distanceFromMainCampus: "Cách điểm chính 11 km"
  },
  {
    id: "dbk-highschool",
    name: "Điểm THPT Đốc Binh Kiều",
    classCount: 14,
    grades: "Khối 10, 11, 12",
    locationNote: "14 lớp cấp THPT học chương trình GDPT 2018 với các tổ hợp môn lựa chọn và chuyên đề",
    distanceFromMainCampus: "Khuôn viên trung tâm THPT"
  }
];

export const SCHOOL_DEPARTMENTS = [
  "Tổ Toán - Tin học",
  "Tổ Khoa học Tự nhiên (Vật lí, Hóa học, Sinh học)",
  "Tổ Ngữ văn",
  "Tổ Lịch sử - Địa lí - GDCD (KHXH)",
  "Tổ Ngoại ngữ (Tiếng Anh)",
  "Tổ Công nghệ - Nghệ thuật (Âm nhạc, Mĩ thuật)",
  "Tổ Giáo dục thể chất - GDQP-AN"
];

// Sample Template 1: Kế hoạch Giáo dục Tổ chuyên môn (Phụ lục I)
export const SAMPLE_DEPARTMENT_PLAN = `TRƯỜNG THCS VÀ THPT ĐỐC BINH KIỀU
TỔ: TOÁN - TIN HỌC

CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập – Tự do – Hạnh phúc

KẾ HOẠCH GIÁO DỤC CỦA TỔ CHUYÊN MÔN
MÔN HỌC: TOÁN HỌC & TIN HỌC - NĂM HỌC 2026 - 2027
(Kèm theo Công văn số 3284/SGDĐT-GDPT ngày 24/8/2026 của Sở GDĐT Đồng Tháp)

Căn cứ Kế hoạch số 45/KH-THCSTHPTDBK ngày 05/9/2026 của Trường THCS & THPT Đốc Binh Kiều; Tổ Toán - Tin học xây dựng kế hoạch giáo dục năm học 2026 - 2027 như sau:

I. ĐẶC ĐIỂM TÌNH HÌNH
1. Số lớp: 
- Cấp THCS: 39 lớp (Điểm Đốc Binh Kiều: 24 lớp; Điểm Tân Kiều: 15 lớp).
- Cấp THPT: 14 lớp (Khối 10: 5 lớp, Khối 11: 5 lớp, Khối 12: 4 lớp).
- Tổng số học sinh: 1.980 học sinh. Số học sinh học chuyên đề học tập lựa chọn Toán: 280 học sinh.

2. Tình hình đội ngũ:
- Tổng số giáo viên: 18 giáo viên (Toán: 14 GV, Tin học: 4 GV).
- Trình độ chuyên môn: 100% đạt chuẩn Đại học trở lên, trong đó có 3 Thạc sĩ.
- Phân công: 10 GV dạy điểm chính Đốc Binh Kiều, 5 GV dạy tại điểm Tân Kiều (cách 11km), 3 GV dạy chéo THPT.

3. Thiết bị dạy học:
- Điểm chính Đốc Binh Kiều: 02 phòng máy vi tính (80 máy kết nối Internet), 24 phòng học đều trang bị Tivi 65 inch thông minh.
- Điểm Tân Kiều: 01 phòng máy vi tính (35 máy), 15 phòng học trang bị máy chiếu/TV tương tác.

II. KẾ HOẠCH DẠY HỌC
1. Phân phối chương trình:
- Môn Toán THCS: Cả năm 35 tuần (140 tiết); Học kì 1: 18 tuần (72 tiết); Học kì 2: 17 tuần (68 tiết).
- Môn Tin học THCS: Cả năm 35 tuần (35 tiết); Học kì 1: 18 tiết; Học kì 2: 17 tiết.
- Các chủ đề được xây dựng theo SGK Kết nối tri thức với cuộc sống và Cánh Diều, đảm bảo chuẩn kiến thức kỹ năng.

2. Chuyên đề lựa chọn cấp THPT:
- Chuyên đề Toán 10: 35 tiết/năm.
- Chuyên đề Tin học 10 (Định hướng Tin học ứng dụng và Khoa học máy tính): 35 tiết.

III. KẾ HOẠCH TỔ CHỨC CÁC HOẠT ĐỘNG GIÁO DỤC
1. Hoạt động Ngày hội Toán học và STEM ứng dụng:
- Thời gian: Tháng 11/2026. Địa điểm: Sân trường cơ sở chính và kết nối trực tuyến với điểm Tân Kiều.
- Chủ đề: "Toán học quanh ta & Mô hình hóa bằng công nghệ số".
2. Câu lạc bộ "Em yêu Lập trình & Sáng tạo Số":
- Sinh hoạt 2 tuần/lần, hướng dẫn học sinh tiếp cận lập trình Scratch, Python và nhận diện cơ chế Trí tuệ nhân tạo (AI cơ bản).

IV. NHIỆM VỤ KHÁC:
- Sinh hoạt tổ chuyên môn: 2 tuần/lần, tập trung nghiên cứu bài học, phân tích hoạt động học của học sinh.
- Ứng dụng CNTT: Khuyến khích giáo viên dùng GeoGebra, Quizizz, Google Form kiểm tra thường xuyên.
- Bồi dưỡng học sinh giỏi khối 9 và khối 12; Phụ đạo học sinh có nguy cơ chưa đạt YCCĐ tại điểm Tân Kiều.`;

// Sample Template 2: Phân phối chương trình môn Toán khối 8
export const SAMPLE_SYLLABUS = `PHÂN PHỐI CHƯƠNG TRÌNH MÔN TOÁN - LỚP 8
NĂM HỌC 2026 - 2027 (ÁP DỤNG TRƯỜNG THCS & THPT ĐỐC BINH KIỀU)
Cả năm: 35 tuần (140 tiết)
Học kì 1: 18 tuần x 4 tiết/tuần = 72 tiết
Học kì 2: 17 tuần x 4 tiết/tuần = 68 tiết

--- HỌC KÌ 1 (18 TUẦN - 72 TIẾT) ---
Tuần 1:
- Tiết 1, 2: Đơn thức và đa thức nhiều biến. Thu gọn đa thức.
- Tiết 3, 4: Các phép tính cộng, trừ đa thức nhiều biến.
Tuần 2:
- Tiết 5, 6: Phép nhân đa thức.
- Tiết 7, 8: Phép chia đa thức cho đơn thức. Luyện tập chung.
Tuần 3:
- Tiết 9, 10: Hằng đẳng thức đáng nhớ (Bình phương của một tổng và một hiệu).
- Tiết 11, 12: Hiệu hai bình phương. Lập phương của một tổng, một hiệu.
Tuần 4:
- Tiết 13, 14: Tổng và hiệu của hai lập phương. Luyện tập hằng đẳng thức.
- Tiết 15, 16: Phân tích đa thức thành nhân tử bằng phương pháp đặt nhân tử chung và dùng hằng đẳng thức.
Tuần 9:
- Tiết 35, 36: Ôn tập giữa học kì 1.
- Tiết 37, 38: KIỂM TRA ĐÁNH GIÁ GIỮA HỌC KÌ 1 (Thời gian: 90 phút).
Tuần 18:
- Tiết 69, 70: Ôn tập học kì 1.
- Tiết 71, 72: KIỂM TRA ĐÁNH GIÁ CUỐI HỌC KÌ 1.

--- HỌC KÌ 2 (17 TUẦN - 68 TIẾT) ---
Tuần 19 - Tuần 26: Phân thức đại số, Phương trình bậc nhất một ẩn và giải bài toán bằng cách lập phương trình.
Tuần 27:
- Tiết 103, 104: Ôn tập giữa học kì 2.
- Tiết 105, 106: KIỂM TRA ĐÁNH GIÁ GIỮA HỌC KÌ 2.
Tuần 28 - Tuần 34: Định lí Thalès trong tam giác, Hình đồng dạng, Một số yếu tố xác suất thống kê.
Tuần 35:
- Tiết 137, 138: KIỂM TRA ĐÁNH GIÁ CUỐI HỌC KÌ 2.
- Tiết 139, 140: Đánh giá, tổng kết chương trình năm học.`;

// Sample Template 3: Kế hoạch bài dạy chuẩn Phụ lục II
export const SAMPLE_LESSON_PLAN = `TRƯỜNG THCS VÀ THPT ĐỐC BINH KIỀU
TỔ: KHOA HỌC TỰ NHIÊN
HỌ VÀ TÊN GIÁO VIÊN: TRẦN THỊ NGỌC MAI

KẾ HOẠCH BÀI DẠY (GIÁO ÁN)
Môn học: Khoa học tự nhiên; Lớp: 8
TÊN BÀI DẠY: BÀI 15: TÁC DỤNG CỦA CHẤT LỎNG LÊN VẬT ĐẶT TRONG NÓ (LỰC ĐẨY ARCHIMEDES)
Thời gian thực hiện: 02 tiết

I. MỤC TIÊU:
1. Về năng lực:
- Năng lực KHTN:
  + Nêu được lực đẩy Archimedes xuất hiện khi một vật nhúng chìm trong chất lỏng.
  + Viết được công thức tính độ lớn lực đẩy Archimedes: F_A = d.V và giải thích được các đại lượng.
  + Đề xuất và tiến hành được thí nghiệm kiểm chứng sự phụ thuộc của lực đẩy vào trọng lượng riêng của chất lỏng và thể tích phần chất lỏng bị vật chiếm chỗ.
- Năng lực chung:
  + Năng lực tự chủ và tự học: Tự nghiên cứu tài liệu hướng dẫn thí nghiệm trên phiếu học tập số hóa.
  + Năng lực giao tiếp và hợp tác: Hoạt động nhóm hiệu quả, phân công ghi chép và báo cáo kết quả đo lường.

2. Về phẩm chất:
- Chăm chỉ: Chủ động thực hiện thí nghiệm, ghi chép số liệu khách quan, trung thực.
- Trách nhiệm: Giữ gìn an toàn đồ dùng phòng thí nghiệm tại điểm trường; bảo quản thiết bị đo.

II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU:
1. Giáo viên:
- 06 bộ thí nghiệm thực hành cho 6 nhóm (lực kế, bình tràn, cốc đong, quả nặng kim loại, nước sạch, nước muối).
- Bài giảng trình chiếu tương tác trên Tivi, video mô phỏng nguyên lý tàu ngầm lặn nổi.
- Phiếu học tập số dạng mã QR (hoặc in giấy cho điểm Tân Kiều nếu đường truyền yếu).
2. Học sinh:
- Đọc trước bài trong SGK, chuẩn bị sổ tay ghi chép.

III. TIẾN TRÌNH DẠY HỌC:
1. Hoạt động 1: Mở đầu / Khởi động (7 phút)
a) Mục tiêu: Kích thích sự tò mò của HS về hiện tượng vật nổi trong nước và chìm trong không khí.
b) Nội dung: Quan sát hình ảnh con tàu bằng thép nặng hàng ngàn tấn vẫn nổi trên mặt biển nhưng hòn đá nhỏ lại chìm.
c) Sản phẩm: Câu hỏi thắc mắc của học sinh về nguyên nhân giúp con tàu nổi.
d) Tổ chức thực hiện:
- GV chiếu hình ảnh tàu thủy và giao nhiệm vụ: "Hãy dự đoán vì sao tàu thép khổng lồ lại nổi trên biển?".
- HS suy nghĩ độc lập trong 1 phút, thảo luận cặp đôi.
- Đại diện 2 cặp HS phát biểu dự đoán.
- GV ghi nhận ý kiến, chưa khẳng định đúng sai, dẫn dắt vào bài mới.

2. Hoạt động 2: Hình thành kiến thức mới (48 phút)
* Hoạt động 2.1: Tìm hiểu về lực đẩy của chất lỏng lên vật (Lực đẩy Archimedes)
a) Mục tiêu: Xác định được phương, chiều và sự tồn tại của lực đẩy Archimedes.
b) Nội dung: Tiến hành thí nghiệm đo trọng lượng vật ngoài không khí (P) và trong nước (P1).
c) Sản phẩm: Bảng số liệu thí nghiệm của các nhóm chỉ ra P1 < P, rút ra kết luận F_A = P - P1.
d) Tổ chức thực hiện:
- GV giao dụng cụ thí nghiệm và phiếu học tập cho các nhóm.
- Các nhóm phân công nhóm trưởng điều hành, thư ký ghi số liệu. GV quan sát, hướng dẫn các nhóm gặp khó khăn.
- Đại diện nhóm 1 và nhóm 4 lên bảng trình bày kết quả đo; các nhóm khác nhận xét, đối chiếu.
- GV chuẩn hóa kiến thức: Lực đẩy có phương thẳng đứng, chiều từ dưới lên trên.

* Hoạt động 2.2: Xác định độ lớn của lực đẩy Archimedes
- Tương tự tiến hành thí nghiệm với bình tràn và nước muối, dẫn xuất công thức F_A = d.V.

3. Hoạt động 3: Luyện tập (20 phút)
a) Mục tiêu: Vận dụng công thức F_A = d.V để tính toán và giải thích hiện tượng.
b) Nội dung: Trả lời 4 câu hỏi trắc nghiệm tương tác trên ứng dụng Quizizz/Plickers và 1 bài tập tính toán.
c) Sản phẩm: Kết quả bài tập trên vở và bảng điểm tương tác nhóm.
d) Tổ chức thực hiện:
- GV trình chiếu câu hỏi trên Tivi, HS quét mã hoặc giơ bảng chọn đáp án.
- GV phân tích câu trả lời có nhiều học sinh chọn nhầm.

4. Hoạt động 4: Vận dụng (15 phút)
a) Mục tiêu: Vận dụng kiến thức giải thích nguyên lý thiết kế áo phao cứu sinh và tàu ngầm.
b) Nội dung: Nhiệm vụ về nhà thiết kế mô hình tàu ngầm mini từ vỏ chai nhựa và ống tiêm.
c) Sản phẩm: Video hoặc ảnh chụp mô hình tàu ngầm mini nộp lên nhóm học tập.
d) Tổ chức thực hiện:
- GV giao nhiệm vụ rõ ràng về tiêu chí sản phẩm (rubric kèm theo).
- HS ghi nhận yêu cầu và có thể thảo luận nhóm thực hiện ngoài giờ lên lớp.

IV. PHỤ LỤC:
- Bảng rubric chấm điểm mô hình tàu ngầm mini (Tiêu chí: Hoạt động chìm nổi được: 4 điểm; Tính sáng tạo thẩm mỹ: 3 điểm; Thuyết minh nguyên lý: 3 điểm).`;
