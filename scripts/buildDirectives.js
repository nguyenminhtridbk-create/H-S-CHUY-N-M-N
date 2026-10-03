import { PDFParse } from 'pdf-parse';
import mammoth from 'mammoth';
import fs from 'fs';

async function extract(path) {
  if (!fs.existsSync(path)) {
    console.warn('File does not exist:', path);
    return '';
  }
  try {
    if (path.endsWith('.docx')) {
      const res = await mammoth.extractRawText({ path });
      return res.value.trim();
    }
    if (path.endsWith('.pdf')) {
      const buf = fs.readFileSync(path);
      const parser = new PDFParse({ data: buf });
      const res = await parser.getText();
      return res.text.trim();
    }
  } catch (err) {
    console.error('Error extracting:', path, err.message);
  }
  return '';
}

async function build() {
  console.log('Extracting all files from VAN-BAN-DEN...');
  const docs = [];

  // 1. KH 1251 UBND
  const t1251 = await extract('./VAN-BAN-DEN/2 BUỔI - NGÀY/1251 kehoachtrienkhaidayhoc2buoitrenngay_signed_signed_signed.pdf');
  docs.push({
    id: 'directive-1251-ubnd',
    documentNumber: 'Số: 1251/KH-UBND',
    title: 'Kế hoạch tổ chức dạy học 2 buổi/ngày đối với cơ sở giáo dục phổ thông trên địa bàn tỉnh Đồng Tháp',
    issuingAuthority: 'ỦY BAN NHÂN DÂN TỈNH ĐỒNG THÁP',
    signDate: 'Đồng Tháp, ngày 17 tháng 8 năm 2026',
    signer: 'KT. CHỦ TỊCH - PHÓ CHỦ TỊCH Huỳnh Minh Tuấn',
    topic: '2 buổi / ngày',
    fileSize: '606 KB (Bản scan PDF có ký số)',
    summary: 'Kế hoạch khung của UBND tỉnh Đồng Tháp về tổ chức dạy học 2 buổi/ngày trên toàn tỉnh: nguyên tắc tự nguyện, không gây quá tải, không thu tiền trái quy định; quy định khung thời gian sáng tối đa 5 tiết, chiều tối đa 3 tiết; bố trí ngân sách và cơ sở vật chất.',
    fullContent: t1251,
    createdDate: new Date('2026-08-17').toISOString(),
    fileName: '1251 kehoachtrienkhaidayhoc2buoitrenngay_signed_signed_signed.pdf',
    linkedSchoolDocumentIds: ['doc-kh-2buoi']
  });

  // 2. KH 2 buoi SGDDT
  const t2buoiSgd = await extract('./VAN-BAN-DEN/2 BUỔI - NGÀY/KH TRIEN KHAI TO CHUC DAY 2 BUOI TREN NGAY CSGDPT_27-8.docx');
  docs.push({
    id: 'directive-2buoi-sgddt',
    documentNumber: 'Số: 2890/KH-SGDĐT',
    title: 'Kế hoạch triển khai tổ chức dạy học 2 buổi/ngày đối với cơ sở giáo dục phổ thông trên địa bàn tỉnh Đồng Tháp (Sở GDĐT)',
    issuingAuthority: 'SỞ GIÁO DỤC VÀ ĐÀO TẠO TỈNH ĐỒNG THÁP',
    signDate: 'Đồng Tháp, ngày 27 tháng 8 năm 2026',
    signer: 'KT. GIÁM ĐỐC - PHÓ GIÁM ĐỐC Nguyễn Phương Toàn',
    topic: '2 buổi / ngày',
    fileSize: '2.7 MB (Bản Word DOCX & Bản scan PDF)',
    summary: 'Kế hoạch cụ thể của Sở GDĐT hướng dẫn các trường THCS, THPT: phân bổ nội dung buổi 1 (chính khóa) và buổi 2 (phụ đạo yếu miễn phí, bồi dưỡng HSG, GD STEM, CLB văn thể mỹ), thời khóa biểu, kinh phí chi trả chế độ giáo viên.',
    fullContent: t2buoiSgd,
    createdDate: new Date('2026-08-27').toISOString(),
    fileName: 'KH TRIEN KHAI TO CHUC DAY 2 BUOI TREN NGAY CSGDPT_27-8.docx',
    linkedSchoolDocumentIds: ['doc-kh-2buoi']
  });

  // 3. QD 87 UBND DTHT
  const tQd87 = await extract('./VAN-BAN-DEN/DẠY THÊM HỌC THÊM/QD 87-2026-BAN HANH QUY DINH DTHT.pdf');
  docs.push({
    id: 'directive-qd87-ubnd',
    documentNumber: 'Số: 87/2026/QĐ-UBND',
    title: 'Quyết định ban hành Quy định về dạy thêm, học thêm trên địa bàn tỉnh Đồng Tháp',
    issuingAuthority: 'ỦY BAN NHÂN DÂN TỈNH ĐỒNG THÁP',
    signDate: 'Đồng Tháp, ngày 31 tháng 7 năm 2026',
    signer: 'TM. ỦY BAN NHÂN DÂN - CHỦ TỊCH Phạm Thiện Nghĩa',
    topic: 'Dạy thêm học thêm',
    fileSize: '338 KB (Quyết định quy phạm pháp luật UBND Tỉnh)',
    summary: 'Quy định chi tiết về dạy thêm, học thêm trong nhà trường và ngoài nhà trường trên địa bàn tỉnh Đồng Tháp: nguyên tắc, các trường hợp không được dạy thêm, hồ sơ cấp phép, cơ sở vật chất, mức thu và quản lý tiền dạy thêm.',
    fullContent: tQd87,
    createdDate: new Date('2026-07-31').toISOString(),
    fileName: 'QD 87-2026-BAN HANH QUY DINH DTHT.pdf',
    linkedSchoolDocumentIds: []
  });

  // 4. CV 3223 SGDDT DTHT
  const tCv3223 = await extract('./VAN-BAN-DEN/DẠY THÊM HỌC THÊM/CV 3223-TANG CUONG QUAN LY DTHT-TCCB.pdf');
  docs.push({
    id: 'directive-cv3223-sgddt',
    documentNumber: 'Số: 3223/SGDĐT-TCCB',
    title: 'Công văn về việc tăng cường công tác quản lý về dạy thêm, học thêm trên địa bàn tỉnh Đồng Tháp',
    issuingAuthority: 'SỞ GIÁO DỤC VÀ ĐÀO TẠO TỈNH ĐỒNG THÁP',
    signDate: 'Đồng Tháp, ngày 02 tháng 9 năm 2026',
    signer: 'KT. GIÁM ĐỐC - PHÓ GIÁM ĐỐC Nguyễn Phương Toàn',
    topic: 'Dạy thêm học thêm',
    fileSize: '279 KB (Công văn Sở GDĐT)',
    summary: 'Chỉ đạo tăng cường công tác thanh tra, kiểm tra, xử lý vi phạm về dạy thêm, học thêm; trách nhiệm người đứng đầu cơ sở giáo dục; công khai đường dây nóng tiếp nhận phản ánh của cha mẹ học sinh.',
    fullContent: tCv3223,
    createdDate: new Date('2026-09-02').toISOString(),
    fileName: 'CV 3223-TANG CUONG QUAN LY DTHT-TCCB.pdf',
    linkedSchoolDocumentIds: []
  });

  // 5. TT 19 BGDDT DTHT
  docs.push({
    id: 'directive-tt19-bgddt',
    documentNumber: 'Số: 19/2026/TT-BGDĐT',
    title: 'Thông tư sửa đổi, bổ sung một số điều của Quy định về dạy thêm, học thêm (Thông tư 29/2024/TT-BGDĐT)',
    issuingAuthority: 'BỘ GIÁO DỤC VÀ ĐÀO TẠO',
    signDate: 'Hà Nội, ngày 31 tháng 3 năm 2026',
    signer: 'BỘ TRƯỞNG BỘ GIÁO DỤC VÀ ĐÀO TẠO Nguyễn Kim Sơn',
    topic: 'Dạy thêm học thêm',
    fileSize: '1.4 MB (Thông tư Bộ GDĐT)',
    summary: 'Quy định pháp lý của Bộ GDĐT về dạy thêm học thêm: sửa đổi các quy định về thời lượng, đối tượng, trách nhiệm của nhà trường và giáo viên; nghiêm cấm việc dạy thêm học sinh chính khóa khi chưa được cấp có thẩm quyền phê duyệt.',
    fullContent: `BỘ GIÁO DỤC VÀ ĐÀO TẠO\nSố: 19/2026/TT-BGDĐT\nHà Nội, ngày 31 tháng 3 năm 2026\n\nTHÔNG TƯ\nSửa đổi, bổ sung một số điều của Quy định về dạy thêm, học thêm ban hành kèm theo Thông tư số 29/2024/TT-BGDĐT ngày 30 tháng 12 năm 2024 của Bộ trưởng Bộ Giáo dục và Đào tạo\n\nCăn cứ Luật Giáo dục ngày 14 tháng 6 năm 2019;\nCăn cứ Nghị định số 86/2022/NĐ-CP ngày 24 tháng 10 năm 2022 của Chính phủ quy định chức năng, nhiệm vụ, quyền hạn và cơ cấu tổ chức của Bộ Giáo dục và Đào tạo;\nTheo đề nghị của Vụ trưởng Vụ Giáo dục Trung học;\nBộ trưởng Bộ Giáo dục và Đào tạo ban hành Thông tư sửa đổi, bổ sung một số điều của Quy định về dạy thêm, học thêm ban hành kèm theo Thông tư số 29/2024/TT-BGDĐT:\n\nĐiều 1. Sửa đổi, bổ sung một số điều của Quy định về dạy thêm, học thêm:\n1. Nguyên tắc tổ chức dạy thêm, học thêm:\n- Hoạt động dạy thêm, học thêm chỉ được tổ chức khi học sinh có nhu cầu học thêm, tự nguyện học thêm và được cha mẹ hoặc người giám hộ đồng ý.\n- Không được dùng bất kỳ hình thức nào để ép buộc học sinh học thêm.\n- Không cắt giảm nội dung chương trình giáo dục phổ thông chính khóa để đưa vào giờ dạy thêm; không dạy thêm trước những nội dung trong chương trình giáo dục phổ thông chính khóa.\n- Đối tượng học thêm là học sinh có nhu cầu củng cố, bổ sung kiến thức hoặc nâng cao kiến thức, kỹ năng; được xếp vào các lớp dạy thêm theo trình độ của học sinh.\n- Thời lượng, thời gian và địa điểm dạy thêm, học thêm phải phù hợp với tâm sinh lý lứa tuổi, bảo đảm sức khỏe của học sinh, tuân thủ quy định của pháp luật về an ninh, trật tự, vệ sinh môi trường, an toàn trường học và phòng cháy, chữa cháy.\n\n2. Các trường hợp không được dạy thêm:\n- Không dạy thêm đối với học sinh đã được nhà trường tổ chức dạy học 2 buổi/ngày.\n- Không dạy thêm đối với học sinh tiểu học, trừ các trường hợp: bồi dưỡng về nghệ thuật, thể dục thể thao, rèn luyện kỹ năng sống.\n- Cơ sở giáo dục công lập không được tổ chức dạy thêm, học thêm có thu tiền ngoài các hoạt động giáo dục theo kế hoạch giáo dục của nhà trường đã được cấp thẩm quyền phê duyệt.\n- Giáo viên đang hưởng lương từ quỹ lương của đơn vị sự nghiệp công lập không được tổ chức dạy thêm ngoài nhà trường có thu tiền; không được dạy thêm ngoài nhà trường có thu tiền đối với học sinh mà giáo viên đang dạy chính khóa khi chưa được sự đồng ý bằng văn bản của Thủ trưởng cơ quan quản lý giáo viên.\n\nĐiều 2. Trách nhiệm của Thủ trưởng cơ sở giáo dục:\n- Chịu trách nhiệm toàn diện trước cơ quan quản lý cấp trên và trước pháp luật về việc tổ chức dạy thêm, học thêm trong nhà trường và việc giáo viên của đơn vị tham gia dạy thêm ngoài nhà trường.\n- Kịp thời kiểm tra, giám sát, xử lý nghiêm cán bộ, giáo viên vi phạm quy định về dạy thêm, học thêm.\n\nĐiều 3. Hiệu lực thi hành:\nThông tư này có hiệu lực thi hành kể từ ngày ban hành.`,
    createdDate: new Date('2026-03-31').toISOString(),
    fileName: 'TT 19-2026-DIEU CHINH TT29 VE DTHT.pdf',
    linkedSchoolDocumentIds: []
  });

  // 6. CV 3635 HSSS
  const tCv3635 = await extract('./VAN-BAN-DEN/HỒ SƠ SỔ SÁCH ĐIỆN TỬ/CV 3635-HD SU DUNG HSSS DIEN TU NAM HOC 2026-2027.pdf');
  docs.push({
    id: 'directive-cv3635-sgddt',
    documentNumber: 'Số: 3635/SGDĐT-GDPT',
    title: 'Công văn hướng dẫn sử dụng hồ sơ, sổ sách điện tử tại các cơ sở giáo dục phổ thông kể từ năm học 2026 - 2027',
    issuingAuthority: 'SỞ GIÁO DỤC VÀ ĐÀO TẠO TỈNH ĐỒNG THÁP',
    signDate: 'Đồng Tháp, ngày 10 tháng 9 năm 2026',
    signer: 'KT. GIÁM ĐỐC - PHÓ GIÁM ĐỐC Nguyễn Phương Toàn',
    topic: 'Hồ sơ sổ sách điện tử',
    fileSize: '328 KB (Bản scan PDF có ký số)',
    summary: 'Hướng dẫn chuẩn hóa việc sử dụng hồ sơ, sổ sách điện tử: học bạ số, sổ điểm điện tử, sổ theo dõi đánh giá, giáo án điện tử; triển khai chữ ký số cá nhân cho 100% cán bộ giáo viên; các hồ sơ đã số hóa không bắt buộc in ra giấy.',
    fullContent: tCv3635,
    createdDate: new Date('2026-09-10').toISOString(),
    fileName: 'CV 3635-HD SU DUNG HSSS DIEN TU NAM HOC 2026-2027.pdf',
    linkedSchoolDocumentIds: []
  });

  // 7. CV 471 KTDG
  const tCv471 = await extract('./VAN-BAN-DEN/HUONG DAN KIEM TRA DANH GIA/CV HD KTDG CAP THCS, THPT.docx');
  docs.push({
    id: 'directive-cv471-sgddt',
    documentNumber: 'Số: 471/SGDĐT-GDPT',
    title: 'Công văn hướng dẫn thực hiện kiểm tra, đánh giá đối với cấp THCS, THPT',
    issuingAuthority: 'SỞ GIÁO DỤC VÀ ĐÀO TẠO TỈNH ĐỒNG THÁP',
    signDate: 'Đồng Tháp, ngày 15 tháng 9 năm 2025',
    signer: 'KT. GIÁM ĐỐC - PHÓ GIÁM ĐỐC Nguyễn Phương Toàn',
    topic: 'Kiểm tra đánh giá',
    fileSize: '49 KB (Bản Word DOCX & Bản scan PDF 922 KB)',
    summary: 'Chỉ đạo toàn diện quy trình kiểm tra, đánh giá định kỳ và thường xuyên theo Thông tư 22/2021/TT-BGDĐT: cấu trúc ma trận, bản đặc tả đề kiểm tra, phân bổ 3 mức độ nhận thức (Nhận biết 40%, Thông hiểu 30%, Vận dụng 30%), đa dạng hóa hình thức đánh giá.',
    fullContent: tCv471,
    createdDate: new Date('2025-09-15').toISOString(),
    fileName: 'CV HD KTDG CAP THCS, THPT.docx',
    linkedSchoolDocumentIds: []
  });

  // 8. PLI CV 471 Ma tran
  const tPli = await extract('./VAN-BAN-DEN/HUONG DAN KIEM TRA DANH GIA/PLI-MA TRAN KEM CV 471.docx');
  docs.push({
    id: 'directive-pli-ktdg',
    documentNumber: 'Phụ lục I (CV 471/SGDĐT)',
    title: 'Phụ lục I: Ma trận đề kiểm tra giữa kì / cuối kì cấp THCS, THPT',
    issuingAuthority: 'SỞ GIÁO DỤC VÀ ĐÀO TẠO TỈNH ĐỒNG THÁP',
    signDate: 'Đồng Tháp, ngày 15 tháng 9 năm 2025',
    signer: 'SỞ GDĐT ĐỒNG THÁP',
    topic: 'Kiểm tra đánh giá',
    fileSize: '29 KB (Biểu mẫu chuẩn DOCX)',
    summary: 'Biểu mẫu chuẩn khung ma trận đề kiểm tra định kỳ của tỉnh Đồng Tháp: bảng phân phối số tiết, số câu trắc nghiệm (nhiều lựa chọn, đúng sai, trả lời ngắn), tự luận và tổng điểm tỉ lệ % theo 3 mức độ nhận thức.',
    fullContent: tPli,
    createdDate: new Date('2025-09-15').toISOString(),
    fileName: 'PLI-MA TRAN KEM CV 471.docx',
    linkedSchoolDocumentIds: []
  });

  // 9. PLII CV 471 Bang dac ta
  const tPlii = await extract('./VAN-BAN-DEN/HUONG DAN KIEM TRA DANH GIA/PLII-BANG DAC TA KEM CV 471.docx');
  docs.push({
    id: 'directive-plii-ktdg',
    documentNumber: 'Phụ lục II (CV 471/SGDĐT)',
    title: 'Phụ lục II: Bảng đặc tả đề kiểm tra giữa kì / cuối kì cấp THCS, THPT',
    issuingAuthority: 'SỞ GIÁO DỤC VÀ ĐÀO TẠO TỈNH ĐỒNG THÁP',
    signDate: 'Đồng Tháp, ngày 15 tháng 9 năm 2025',
    signer: 'SỞ GDĐT ĐỒNG THÁP',
    topic: 'Kiểm tra đánh giá',
    fileSize: '28 KB (Biểu mẫu chuẩn DOCX)',
    summary: 'Biểu mẫu chuẩn khung bảng đặc tả đề kiểm tra định kỳ: quy định chi tiết Chủ đề/Chương, Đơn vị kiến thức, Yêu cầu cần đạt tương ứng từng câu hỏi ở các mức độ Nhận biết, Thông hiểu, Vận dụng.',
    fullContent: tPlii,
    createdDate: new Date('2025-09-15').toISOString(),
    fileName: 'PLII-BANG DAC TA KEM CV 471.docx',
    linkedSchoolDocumentIds: []
  });

  // 10. KH 831 UBND Huong nghiep
  const t831 = await extract('./VAN-BAN-DEN/HƯỚNG NGHIỆP VÀ PHÂN LUỒNG/KH 831-HUONG NGHIEP VA PHAN LUONG.pdf');
  docs.push({
    id: 'directive-kh831-ubnd',
    documentNumber: 'Số: 831/KH-UBND',
    title: 'Kế hoạch thực hiện quy định về hướng nghiệp và phân luồng trong giáo dục trên địa bàn tỉnh Đồng Tháp',
    issuingAuthority: 'ỦY BAN NHÂN DÂN TỈNH ĐỒNG THÁP',
    signDate: 'Đồng Tháp, ngày 07 tháng 6 năm 2026',
    signer: 'KT. CHỦ TỊCH - PHÓ CHỦ TỊCH Huỳnh Minh Tuấn',
    topic: 'Hướng nghiệp & Phân luồng',
    fileSize: '1.2 MB (Bản scan PDF có ký số)',
    summary: 'Kế hoạch tổng thể của UBND tỉnh Đồng Tháp thực hiện Đề án phân luồng và hướng nghiệp: chỉ tiêu phân luồng học sinh sau THCS và THPT vào giáo dục nghề nghiệp, chính sách học phí, liên kết đào tạo nghề trên địa bàn tỉnh.',
    fullContent: t831,
    createdDate: new Date('2026-06-07').toISOString(),
    fileName: 'KH 831-HUONG NGHIEP VA PHAN LUONG.pdf',
    linkedSchoolDocumentIds: []
  });

  // 11. KH 998 SGDDT Huong nghiep
  const t998 = await extract('./VAN-BAN-DEN/HƯỚNG NGHIỆP VÀ PHÂN LUỒNG/KH  -HUONG NGHIEP VA PHAN LUONG-SGD.docx');
  docs.push({
    id: 'directive-kh998-sgddt',
    documentNumber: 'Số: 998/KH-SGDĐT',
    title: 'Kế hoạch triển khai thực hiện quy định về hướng nghiệp và phân luồng trong giáo dục của ngành Giáo dục tỉnh Đồng Tháp',
    issuingAuthority: 'SỞ GIÁO DỤC VÀ ĐÀO TẠO TỈNH ĐỒNG THÁP',
    signDate: 'Đồng Tháp, ngày 10 tháng 9 năm 2026',
    signer: 'KT. GIÁM ĐỐC - PHÓ GIÁM ĐỐC Nguyễn Phương Toàn',
    topic: 'Hướng nghiệp & Phân luồng',
    fileSize: '47 KB (Bản Word DOCX & Bản scan PDF 190 KB)',
    summary: 'Kế hoạch thực hiện của Sở GDĐT Đồng Tháp: nhiệm vụ của trường phổ thông trong tư vấn hướng nghiệp, khảo sát nguyện vọng học sinh lớp 9 và 12, phối hợp với các cơ sở GDNN (Trường TC Tháp Mười, CĐ Cộng đồng...) tổ chức ngày hội trải nghiệm nghề.',
    fullContent: t998,
    createdDate: new Date('2026-09-10').toISOString(),
    fileName: 'KH  -HUONG NGHIEP VA PHAN LUONG-SGD.docx',
    linkedSchoolDocumentIds: []
  });

  // 12. TT 16 BGDDT Huong nghiep
  docs.push({
    id: 'directive-tt16-bgddt',
    documentNumber: 'Số: 16/2026/TT-BGDĐT',
    title: 'Thông tư quy định về hướng nghiệp và phân luồng trong giáo dục',
    issuingAuthority: 'BỘ GIÁO DỤC VÀ ĐÀO TẠO',
    signDate: 'Hà Nội, ngày 24 tháng 3 năm 2026',
    signer: 'BỘ TRƯỞNG BỘ GIÁO DỤC VÀ ĐÀO TẠO Nguyễn Kim Sơn',
    topic: 'Hướng nghiệp & Phân luồng',
    fileSize: '5.3 MB (Thông tư Bộ GDĐT)',
    summary: 'Thông tư của Bộ GDĐT quy định tiêu chuẩn, nhiệm vụ, hình thức tổ chức giáo dục hướng nghiệp và định hướng phân luồng học sinh trong hệ thống giáo dục quốc dân; trách nhiệm của cơ sở giáo dục phổ thông và giáo viên phụ trách.',
    fullContent: `BỘ GIÁO DỤC VÀ ĐÀO TẠO\nSố: 16/2026/TT-BGDĐT\nHà Nội, ngày 24 tháng 3 năm 2026\n\nTHÔNG TƯ\nQuy định về hướng nghiệp và phân luồng trong giáo dục\n\nCăn cứ Luật Giáo dục ngày 14 tháng 6 năm 2019;\nCăn cứ Luật Giáo dục nghề nghiệp ngày 27 tháng 11 năm 2014;\nCăn cứ Nghị định số 86/2022/NĐ-CP ngày 24 tháng 10 năm 2022 của Chính phủ quy định chức năng, nhiệm vụ, quyền hạn và cơ cấu tổ chức của Bộ Giáo dục và Đào tạo;\nBộ trưởng Bộ Giáo dục và Đào tạo ban hành Thông tư Quy định về hướng nghiệp và phân luồng trong giáo dục:\n\nChương I: QUY ĐỊNH CHUNG\nĐiều 1. Phạm vi điều chỉnh và đối tượng áp dụng:\n1. Thông tư này quy định về mục tiêu, nguyên tắc, nội dung, hình thức và điều kiện bảo đảm thực hiện hướng nghiệp và phân luồng trong giáo dục phổ thông và giáo dục thường xuyên.\n2. Áp dụng đối với trường trung học cơ sở, trường trung học phổ thông, trường phổ thông có nhiều cấp học, trung tâm giáo dục thường xuyên, trung tâm giáo dục nghề nghiệp - giáo dục thường xuyên.\n\nĐiều 2. Nguyên tắc hướng nghiệp và phân luồng:\n1. Tôn trọng quyền tự do lựa chọn nghề nghiệp, ngành học của người học dựa trên năng lực, sở trường, sở thích và điều kiện kinh tế gia đình.\n2. Bảo đảm tính liên thông, linh hoạt và công bằng trong tiếp cận cơ hội học tập suốt đời.\n3. Gắn kết chặt chẽ giữa nhà trường với thị trường lao động, doanh nghiệp và các cơ sở giáo dục nghề nghiệp.\n\nChương II: NỘI DUNG VÀ HÌNH THỨC HƯỚNG NGHIỆP, PHÂN LUỒNG\nĐiều 3. Nội dung hướng nghiệp:\n- Cung cấp thông tin thị trường lao động, xu hướng ngành nghề tương lai, kỹ năng số và công nghệ mới.\n- Khảo sát, đánh giá năng lực, tính cách, phẩm chất và xu hướng nghề nghiệp của học sinh.\n- Rèn luyện kỹ năng mềm, kỹ năng tìm kiếm việc làm, kỹ năng khởi nghiệp và định hướng lộ trình học tập.\n\nĐiều 4. Hình thức tổ chức:\n- Dạy học tích hợp trong chương trình môn học chính khóa và Hoạt động trải nghiệm, hướng nghiệp.\n- Sinh hoạt dưới cờ, sinh hoạt lớp, ngày hội hướng nghiệp, hội thảo chuyên đề nghề nghiệp.\n- Tổ chức cho học sinh tham quan, trải nghiệm thực tế tại các trường cao đẳng, trung cấp nghề và doanh nghiệp.\n- Tư vấn trực tiếp (1-1) hoặc tư vấn nhóm cho học sinh và cha mẹ học sinh cuối cấp.\n\nChương III: TỔ CHỨC THỰC HIỆN\n- Cơ sở giáo dục thành lập Tổ tư vấn hướng nghiệp và phân luồng học sinh do Ban Giám hiệu trực tiếp chỉ đạo.\n- Phối hợp chặt chẽ với cơ sở giáo dục nghề nghiệp trên địa bàn để thực hiện công tác phân luồng hiệu quả.`,
    createdDate: new Date('2026-03-24').toISOString(),
    fileName: 'TT 16-2026-QUY DINH VE HUONG NGHIEP VA PHAN LUONG-BGD.pdf',
    linkedSchoolDocumentIds: []
  });

  // 13. CV 3456 BGDDT Khung NLS
  const t3456 = await extract('./VAN-BAN-DEN/KHUNG NĂNG LỰC SỐ/3456_BGDDT_GDPT_signed.pdf');
  docs.push({
    id: 'directive-cv3456-bgddt',
    documentNumber: 'Số: 3456/BGDĐT-GDPT',
    title: 'Công văn hướng dẫn triển khai thực hiện khung năng lực số cho học sinh phổ thông và học viên GDTX',
    issuingAuthority: 'BỘ GIÁO DỤC VÀ ĐÀO TẠO',
    signDate: 'Hà Nội, ngày 27 tháng 6 năm 2025',
    signer: 'KT. BỘ TRƯỞNG - THỨ TRƯỞNG Phạm Ngọc Thưởng',
    topic: 'Khung năng lực số',
    fileSize: '11 MB (Công văn Bộ GDĐT có chữ ký số)',
    summary: 'Văn bản cốt lõi của Bộ GDĐT hướng dẫn chi tiết việc triển khai Thông tư 02/2025/TT-BGDĐT: tích hợp 6 miền năng lực số vào các môn học và hoạt động giáo dục, tiêu chí đánh giá năng lực số học sinh theo từng khối lớp từ Tiểu học đến THPT.',
    fullContent: t3456,
    createdDate: new Date('2025-06-27').toISOString(),
    fileName: '3456_BGDDT_GDPT_signed.pdf',
    linkedSchoolDocumentIds: []
  });

  // 14. KH 195 SGDDT Khung NLS
  const t195 = await extract('./VAN-BAN-DEN/KHUNG NĂNG LỰC SỐ/KH_TRIEN_KHAI_KHUNG_NANG_LUC_SO_DANG_DU_THAO.docx');
  docs.push({
    id: 'directive-kh195-sgddt',
    documentNumber: 'Số: 195/KH-SGDĐT',
    title: 'Kế hoạch triển khai thực hiện khung năng lực số cho học sinh phổ thông và học viên GDTX trên địa bàn tỉnh Đồng Tháp',
    issuingAuthority: 'SỞ GIÁO DỤC VÀ ĐÀO TẠO TỈNH ĐỒNG THÁP',
    signDate: 'Đồng Tháp, ngày 12 tháng 9 năm 2025',
    signer: 'KT. GIÁM ĐỐC - PHÓ GIÁM ĐỐC Huỳnh Thanh Hùng',
    topic: 'Khung năng lực số',
    fileSize: '74 KB (Bản Word DOCX & Bản scan PDF 1.05 MB)',
    summary: 'Kế hoạch thực hiện của Sở GDĐT Đồng Tháp: gắn Khung năng lực số với phong trào “Bình dân học vụ số” của Tỉnh ủy; quy định lộ trình tập huấn 100% giáo viên, trang bị phòng máy, phần mềm học tập số và kiểm tra năng lực số định kỳ.',
    fullContent: t195,
    createdDate: new Date('2025-09-12').toISOString(),
    fileName: 'KH_TRIEN_KHAI_KHUNG_NANG_LUC_SO_DANG_DU_THAO.docx',
    linkedSchoolDocumentIds: []
  });

  // 15. Thong bao NLS Truong
  const tTb = await extract('./VAN-BAN-DEN/KHUNG NĂNG LỰC SỐ/Thông báo.docx');
  docs.push({
    id: 'directive-tb-nls-truong',
    documentNumber: 'Thông báo nội bộ',
    title: 'Thông báo về việc triển khai thực hiện khung năng lực số cho học sinh phổ thông và kế hoạch tập huấn giáo viên',
    issuingAuthority: 'TRƯỜNG THCS VÀ THPT ĐỐC BINH KIỀU',
    signDate: 'Đốc Binh Kiều, ngày 10 tháng 11 năm 2025',
    signer: 'HIỆU TRƯỞNG Lê Thanh Cường',
    topic: 'Khung năng lực số',
    fileSize: '15 KB (Bản Word DOCX nội bộ)',
    summary: 'Thông báo triển khai tập huấn nội bộ cho cán bộ quản lý và giáo viên Trường Đốc Binh Kiều sau đợt tập huấn của Sở GDĐT: thời gian, địa điểm, thành phần tham dự, chuẩn bị máy tính xách tay và tài liệu số.',
    fullContent: tTb,
    createdDate: new Date('2025-11-10').toISOString(),
    fileName: 'Thông báo.docx',
    linkedSchoolDocumentIds: []
  });

  // 16. HD 1061 Nhiem vu nam hoc
  docs.push({
    id: 'directive-1061',
    documentNumber: 'Số: 1061/HD-SGDĐT',
    title: 'Hướng dẫn thực hiện nhiệm vụ giáo dục phổ thông năm học 2026 - 2027',
    issuingAuthority: 'SỞ GDĐT TỈNH ĐỒNG THÁP',
    signDate: 'Đồng Tháp, ngày 28 tháng 8 năm 2026',
    signer: 'KT. GIÁM ĐỐC - PHÓ GIÁM ĐỐC Nguyễn Phương Toàn',
    topic: 'Nhiệm vụ chung năm học',
    fileSize: '450 KB (Hướng dẫn của Sở GDĐT)',
    summary: 'Chỉ đạo toàn diện các cơ sở giáo dục trung học trên địa bàn tỉnh Đồng Tháp về khung kế hoạch thời gian 35 tuần, đổi mới phương pháp dạy học, nâng cao chất lượng giáo dục mũi nhọn và đại trà, tổ chức dạy học 2 buổi/ngày, tăng cường chuyển đổi số và phát triển năng lực AI cho học sinh.',
    fullContent: `SỞ GIÁO DỤC VÀ ĐÀO TẠO TỈNH ĐỒNG THÁP\nSố: 1061/HD-SGDĐT\nĐồng Tháp, ngày 28 tháng 8 năm 2026\n\nHƯỚNG DẪN\nThực hiện nhiệm vụ giáo dục phổ thông năm học 2026 - 2027\n\nCăn cứ Thông tư số 32/2018/TT-BGDĐT ban hành Chương trình Giáo dục phổ thông;\nCăn cứ Thông tư số 15/2026/TT-BGDĐT ban hành Điều lệ trường phổ thông có nhiều cấp học;\nCăn cứ Quyết định số 2644/QĐ-UBND ngày 17/8/2026 của UBND tỉnh Đồng Tháp về khung kế hoạch thời gian năm học 2026 - 2027;\nSở Giáo dục và Đào tạo Đồng Tháp hướng dẫn các trường THCS, THPT và trường phổ thông nhiều cấp học thực hiện nhiệm vụ trọng tâm:\n\n1. Thực hiện nghiêm túc kế hoạch thời gian năm học:\n- Toàn ngành thực hiện đủ 35 tuần thực học (Học kỳ I: 18 tuần từ 07/9/2026 đến 10/01/2027; Học kỳ II: 17 tuần từ 11/01/2027 đến 23/5/2027).\n- Kết thúc năm học chậm nhất ngày 31/5/2027.\n\n2. Tổ chức dạy học 2 buổi/ngày linh hoạt, hiệu quả:\n- Khuyến khích các trường có đủ điều kiện về phòng học, đội ngũ tổ chức dạy học 2 buổi/ngày.\n- Buổi 1: Giảng dạy chương trình chính khóa theo chuẩn kiến thức kỹ năng của GDPT 2018.\n- Buổi 2: Tổ chức phụ đạo học sinh có nguy cơ chưa đạt YCCĐ; bồi dưỡng học sinh giỏi; tổ chức hoạt động trải nghiệm, giáo dục STEM, câu lạc bộ thể thao, nghệ thuật và kỹ năng số.\n- Tuyệt đối không dồn ép học sinh, không thu tiền trái quy định, đảm bảo sự tự nguyện và đồng thuận của cha mẹ học sinh.\n\n3. Đổi mới kiểm tra đánh giá và ứng dụng Năng lực số/AI:\n- Đa dạng hóa hình thức kiểm tra đánh giá: vấn đáp, viết, thực hành, dự án học tập.\n- 100% đề kiểm tra định kỳ có ma trận, bảng đặc tả theo 3 mức độ Nhận biết - Thông hiểu - Vận dụng.\n- Khai thác học bạ số, sổ điểm điện tử, đưa Trí tuệ nhân tạo (AI) vào quản trị và đổi mới phương pháp giảng dạy có đạo đức và kiểm soát.\n\nYêu cầu Hiệu trưởng các cơ sở giáo dục trung học xây dựng Kế hoạch giáo dục nhà trường chi tiết, phù hợp với đặc thù từng điểm trường và đội ngũ của đơn vị.`,
    createdDate: new Date('2026-08-28').toISOString(),
    fileName: 'Huong_dan_1061_SGDDT_Dong_Thap.pdf',
    linkedSchoolDocumentIds: ['doc-kh-gd-34', 'doc-kh-2buoi']
  });

  // 17. CV 3284 SGDDT KHGD
  docs.push({
    id: 'directive-3284',
    documentNumber: 'Số: 3284/SGDĐT-GDPT',
    title: 'Công văn hướng dẫn xây dựng và tổ chức thực hiện kế hoạch giáo dục của nhà trường năm học 2026 - 2027',
    issuingAuthority: 'SỞ GIÁO DỤC VÀ ĐÀO TẠO TỈNH ĐỒNG THÁP',
    signDate: 'Đồng Tháp, ngày 24 tháng 8 năm 2026',
    signer: 'KT. GIÁM ĐỐC - PHÓ GIÁM ĐỐC Nguyễn Phương Toàn',
    topic: 'Kế hoạch giáo dục nhà trường',
    fileSize: '520 KB (Công văn hướng dẫn khung kế hoạch 5512)',
    summary: 'Hướng dẫn chuẩn mực cấu trúc kế hoạch giáo dục của tổ chuyên môn (Phụ lục I) và kế hoạch bài dạy 4 hoạt động của giáo viên (Phụ lục II), đẩy mạnh sinh hoạt chuyên môn theo nghiên cứu bài học.',
    fullContent: `SỞ GIÁO DỤC VÀ ĐÀO TẠO TỈNH ĐỒNG THÁP\nSố: 3284/SGDĐT-GDPT\nĐồng Tháp, ngày 24 tháng 8 năm 2026\n\nV/v hướng dẫn xây dựng và tổ chức thực hiện kế hoạch giáo dục của nhà trường năm học 2026 - 2027\n\nCăn cứ Thông tư số 32/2018/TT-BGDĐT ngày 26/12/2018 của Bộ GDĐT;\nCăn cứ Công văn số 5512/BGDĐT-GDTrH ngày 18/12/2020 của Bộ GDĐT;\nSở GDĐT Đồng Tháp hướng dẫn các cơ sở giáo dục trung học:\n\n1. Xây dựng Kế hoạch giáo dục của nhà trường:\n- Đảm bảo tính khoa học, sư phạm và phù hợp với thực tiễn cơ sở vật chất, năng lực đội ngũ và học sinh của từng điểm trường.\n- Phân phối thời lượng hợp lý giữa các môn học, hoạt động trải nghiệm, hướng nghiệp và các nội dung giáo dục địa phương tỉnh Đồng Tháp.\n\n2. Kế hoạch dạy học của tổ chuyên môn và giáo viên:\n- Thực hiện đúng khung kế hoạch bài dạy theo CV 5512 gồm 4 bước: (1) Xác định vấn đề/nhiệm vụ học tập, (2) Hình thành kiến thức mới, (3) Luyện tập, (4) Vận dụng.\n- Đẩy mạnh sinh hoạt chuyên môn dựa trên nghiên cứu bài học, ứng dụng học liệu số và công cụ AI hỗ trợ soạn giảng.`,
    createdDate: new Date('2026-08-24').toISOString(),
    fileName: 'CV_3284_Huong_dan_KHGD_SGDDT.pdf',
    linkedSchoolDocumentIds: ['doc-kh-gd-34']
  });

  console.log('Total unique directives collected:', docs.length);
  
  const tsContent = `import { DepartmentDirective } from '../types/document';\n\nexport const INITIAL_DEPARTMENT_DIRECTIVES: DepartmentDirective[] = ${JSON.stringify(docs, null, 2)};\n`;

  fs.writeFileSync('./src/data/mockDirectives.ts', tsContent, 'utf-8');
  console.log('Successfully written to ./src/data/mockDirectives.ts!');
  console.log('File size:', (fs.statSync('./src/data/mockDirectives.ts').size / 1024).toFixed(1), 'KB');
}

build().catch(console.error);
