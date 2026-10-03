import React from 'react';
import { X, FileText, CheckCircle, AlertCircle, BookOpen, ExternalLink, ShieldCheck } from 'lucide-react';
import { OFFICIAL_DOCUMENTS_INFO } from '../data/mockTemplates';

interface OfficialLegalRefModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OfficialLegalRefModal: React.FC<OfficialLegalRefModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-700/80 flex items-center justify-center text-amber-300">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Căn cứ Pháp lý & Chuẩn Hướng dẫn Chuyên môn</h2>
              <p className="text-xs text-blue-200">
                Công văn số {OFFICIAL_DOCUMENTS_INFO.dispatchNumber} ngày {OFFICIAL_DOCUMENTS_INFO.issueDate} của Sở GDĐT Đồng Tháp
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-blue-200 hover:text-white p-1 rounded-lg hover:bg-blue-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700">
          {/* Dispatch Notice Card */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-amber-900 text-sm">
                  CÔNG VĂN SỐ 3284/SGDĐT-GDPT — SỞ GDĐT ĐỒNG THÁP
                </h3>
                <p className="text-xs text-amber-800 mt-1">
                  V/v hướng dẫn xây dựng và tổ chức thực hiện kế hoạch giáo dục của nhà trường cấp trung học. 
                  Người ký: <span className="font-semibold">KT. Giám đốc - Phó Giám đốc Nguyễn Phương Toàn</span> (Ký ngày 24/8/2026).
                </p>
                <div className="mt-2 text-xs text-amber-900/90 space-y-1">
                  <p>• Căn cứ Thông tư số 15/2026/TT-BGDĐT ngày 24/3/2026 của Bộ GDĐT ban hành Điều lệ trường TH, THCS, THPT và trường phổ thông có nhiều cấp học.</p>
                  <p>• Trên cơ sở nội dung Công văn số 5512/BGDĐT-GDTrH ngày 18/12/2020 của Bộ GDĐT.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Phụ lục I Details */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/60">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2.5 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-md">
                Phụ lục I
              </span>
              <h4 className="font-bold text-slate-800 text-sm">
                KẾ HOẠCH GIÁO DỤC CỦA TỔ CHUYÊN MÔN
              </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="font-semibold text-blue-900">I. ĐẶC ĐIỂM TÌNH HÌNH</span>
                <ul className="mt-1 list-disc list-inside text-slate-600 space-y-0.5">
                  <li>1. Số lớp, Số học sinh, Số HS học chuyên đề lựa chọn.</li>
                  <li>2. Tình hình đội ngũ (Họ tên, chức vụ, trình độ, chuẩn nghề nghiệp, công việc phân công).</li>
                  <li>3. Thiết bị dạy học cụ thể theo từng điểm trường (bài thí nghiệm, thực hành).</li>
                </ul>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="font-semibold text-blue-900">II. KẾ HOẠCH DẠY HỌC</span>
                <ul className="mt-1 list-disc list-inside text-slate-600 space-y-0.5">
                  <li>1. Phân phối chương trình: Cả năm 35 tuần (số tiết HK1 và HK2).</li>
                  <li>Bảng: TT, Chủ đề/Bài học, Số tiết, Yêu cầu cần đạt chuẩn GDPT.</li>
                  <li>2. Chuyên đề học tập lựa chọn (khối 10, 11, 12 THPT).</li>
                </ul>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="font-semibold text-blue-900">III. HOẠT ĐỘNG GIÁO DỤC</span>
                <ul className="mt-1 list-disc list-inside text-slate-600 space-y-0.5">
                  <li>Chủ đề/chuyên đề, số tiết, yêu cầu cần đạt.</li>
                  <li>Thời điểm, địa điểm (phòng TN, sân chơi, thực địa,...).</li>
                  <li>Chủ trì / Phối hợp (STEM, câu lạc bộ, trải nghiệm).</li>
                </ul>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="font-semibold text-blue-900">IV. NHIỆM VỤ KHÁC</span>
                <ul className="mt-1 list-disc list-inside text-slate-600 space-y-0.5">
                  <li>Sinh hoạt tổ/nhóm chuyên môn theo hướng nghiên cứu bài học.</li>
                  <li>Sinh hoạt cụm chuyên môn, bồi dưỡng học sinh giỏi.</li>
                  <li>Hỗ trợ học sinh chưa đạt chuẩn, nghiên cứu khoa học.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Phụ lục II Details */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/60">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-md">
                Phụ lục II
              </span>
              <h4 className="font-bold text-slate-800 text-sm">
                KHUNG KẾ HOẠCH BÀI DẠY (GIÁO ÁN)
              </h4>
            </div>
            <div className="space-y-3 text-xs">
              <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1.5">
                <p>
                  <strong className="text-slate-800">I. MỤC TIÊU:</strong> Năng lực (nêu cụ thể HS làm được gì theo YCCĐ của môn học) và Phẩm chất (yêu cầu hành vi, thái độ gắn liền với nội dung bài học).
                </p>
                <p>
                  <strong className="text-slate-800">II. THIẾT BỊ DẠY HỌC & HỌC LIỆU:</strong> Nêu rõ thiết bị, đồ dùng, học liệu số phục vụ trực tiếp cho hoạt động của học sinh.
                </p>
                <p>
                  <strong className="text-slate-800">III. TIẾN TRÌNH DẠY HỌC (4 HOẠT ĐỘNG BẮT BUỘC):</strong>
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-1">
                  <div className="p-2 bg-slate-50 rounded border border-slate-200 text-center font-medium">
                    1. Mở đầu / Khởi động
                  </div>
                  <div className="p-2 bg-slate-50 rounded border border-slate-200 text-center font-medium">
                    2. Hình thành kiến thức
                  </div>
                  <div className="p-2 bg-slate-50 rounded border border-slate-200 text-center font-medium">
                    3. Luyện tập
                  </div>
                  <div className="p-2 bg-slate-50 rounded border border-slate-200 text-center font-medium">
                    4. Vận dụng
                  </div>
                </div>
                <div className="p-2.5 bg-amber-50 rounded border border-amber-200 text-amber-900 mt-2">
                  <strong>* LƯU Ý SƯ PHẠM BẮT BUỘC TỪ SỞ GDĐT:</strong> Mỗi hoạt động phải thể hiện: Tên, thời gian, Mục tiêu, Nội dung, Sản phẩm dự kiến, và Cách thức tổ chức. 
                  <span className="font-bold underline ml-1">Tuyệt đối không nêu cụ thể lời thoại rườm rà của GV và HS</span>; tập trung mô tả rõ hành động giao việc, hướng dẫn, nhận xét của GV và hành động đọc, viết, thực hành, báo cáo của HS.
                </div>
              </div>
            </div>
          </div>

          {/* Quy định Kiểm tra Đánh giá Định kỳ (Ma trận 3 mức độ) */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/60">
            <h4 className="font-bold text-slate-800 text-sm mb-2">
              KẾ HOẠCH KIỂM TRA ĐÁNH GIÁ ĐỊNH KÌ THEO CÔNG VĂN 3284
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
              <div className="bg-white p-2.5 rounded border border-slate-200">
                <span className="font-bold text-blue-700">1. Nhận biết</span>
                <p className="text-slate-600 mt-1">Nhận ra, nhớ lại thông tin đã học hoặc mô tả đúng kiến thức, kĩ năng.</p>
              </div>
              <div className="bg-white p-2.5 rounded border border-slate-200">
                <span className="font-bold text-indigo-700">2. Thông hiểu</span>
                <p className="text-slate-600 mt-1">Giải thích, diễn đạt theo ý hiểu cá nhân, so sánh, áp dụng trực tiếp kiến thức.</p>
              </div>
              <div className="bg-white p-2.5 rounded border border-slate-200">
                <span className="font-bold text-purple-700">3. Vận dụng</span>
                <p className="text-slate-600 mt-1">Sử dụng kiến thức, kĩ năng để giải quyết vấn đề đặt ra trong các tình huống thực tiễn.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-100 rounded-b-2xl border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-sm transition"
          >
            Đã hiểu & Đóng cửa sổ
          </button>
        </div>
      </div>
    </div>
  );
};
