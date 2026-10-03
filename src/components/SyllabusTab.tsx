import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  RotateCcw, 
  CheckCircle, 
  AlertTriangle, 
  Save, 
  Printer, 
  FileUp, 
  BookOpen, 
  Cpu, 
  Calendar,
  Layers
} from 'lucide-react';
import { extractTextFromFile } from '../utils/fileReader';
import { SAMPLE_SYLLABUS } from '../data/mockTemplates';
import { SyllabusEvaluation } from '../types';

interface SyllabusTabProps {
  onSaveToArchive?: (item: any) => void;
}

export const SyllabusTab: React.FC<SyllabusTabProps> = ({ onSaveToArchive }) => {
  const [subject, setSubject] = useState('Toán học');
  const [grade, setGrade] = useState('Khối 8');
  const [semester, setSemester] = useState('Cả năm (35 tuần: HK1 18 tuần - HK2 17 tuần)');
  const [content, setContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SyllabusEvaluation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // File Upload Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      setError(null);
      setFileName(file.name);
      const text = await extractTextFromFile(file);
      setContent(text);
    } catch (err: any) {
      setError(err.message || 'Lỗi khi đọc file');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadSample = () => {
    setContent(SAMPLE_SYLLABUS);
    setFileName('Phan_phoi_chuong_trinh_Toan_8.docx (Mẫu)');
    setSubject('Toán học');
    setGrade('Khối 8');
  };

  const handleEvaluate = async () => {
    if (!content.trim()) {
      setError('Vui lòng tải file hoặc dán khung Phân phối chương trình vào ô bên dưới.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSavedSuccess(false);

      const response = await fetch('/api/evaluate/syllabus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          grade,
          semester,
          content,
        }),
      });

      const resData = await response.json();
      if (!resData.success) {
        throw new Error(resData.error || 'Lỗi xử lý đánh giá phân phối chương trình');
      }

      const evalData: SyllabusEvaluation = {
        id: 'syl-' + Date.now(),
        date: new Date().toISOString(),
        subject,
        grade,
        semester,
        summary: resData.data.summary || '',
        weeksAnalysis: resData.data.weeksAnalysis || {
          totalWeeks: 35,
          semester1Weeks: 18,
          semester2Weeks: 17,
          totalPeriods: 105,
          evaluationPeriods: ''
        },
        strengths: resData.data.strengths || [],
        limitations: resData.data.limitations || [],
        pedagogicalSuggestions: resData.data.pedagogicalSuggestions || [],
        digitalAndAiIntegrationMatrix: resData.data.digitalAndAiIntegrationMatrix || [],
        approvalStatus: resData.data.approvalStatus || 'Đạt chuẩn',
        phtActionRecommendation: resData.data.phtActionRecommendation || 'Đồng ý phê duyệt'
      };

      setResult(evalData);
    } catch (err: any) {
      let msg = err.message || 'Không thể đánh giá PPCT';
      if (typeof msg === 'string' && (msg.includes('503') || msg.includes('UNAVAILABLE') || msg.includes('demand'))) {
        msg = 'Hệ thống AI đang tiếp nhận lưu lượng tăng cao đột biến tạm thời từ máy chủ. Thầy vui lòng bấm lại nút "Đánh Giá PPCT & Tạo Ma Trận AI" để hoàn tất qua cơ chế dự phòng.';
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (result && onSaveToArchive) {
      onSaveToArchive({
        id: result.id,
        type: 'syllabus',
        title: `PPCT môn ${result.subject} ${result.grade}`,
        date: result.date,
        status: result.approvalStatus,
        details: result
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded">
              Khung 35 Tuần
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              Đánh Giá Phân Phối Chương Trình (PPCT) & Định Hướng Tích Hợp AI
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Kiểm tra tính khoa học sư phạm theo Công văn 3284 Sở GDĐT Đồng Tháp: 35 tuần chuẩn (HK1: 18 tuần, HK2: 17 tuần), phân bổ kiểm tra định kỳ 3 mức độ và ma trận tích hợp số & AI.
          </p>
        </div>

        <button
          onClick={handleLoadSample}
          type="button"
          className="px-3 py-1.5 rounded-lg border border-emerald-300 text-emerald-700 bg-emerald-50/70 hover:bg-emerald-100 text-xs font-medium flex items-center gap-1.5 transition"
        >
          <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
          <span>Tải mẫu PPCT (Toán 8 - 35 tuần)</span>
        </button>
      </div>

      {/* Form and Input Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls Column */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-semibold text-sm text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Layers className="w-4 h-4 text-emerald-600" />
            <span>Thông tin Phân phối chương trình</span>
          </h3>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Môn học / Hoạt động giáo dục:
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="VD: Toán học, KHTN, Ngữ văn, Lịch sử - Địa lí, Tiếng Anh..."
              className="w-full text-xs rounded-lg border-slate-300 border p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Khối lớp:
            </label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full text-xs rounded-lg border-slate-300 border p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="Khối 6">Khối 6 (THCS - 39 lớp tổng cả trường)</option>
              <option value="Khối 7">Khối 7 (THCS)</option>
              <option value="Khối 8">Khối 8 (THCS)</option>
              <option value="Khối 9">Khối 9 (THCS)</option>
              <option value="Khối 10">Khối 10 (THPT - 14 lớp)</option>
              <option value="Khối 11">Khối 11 (THPT)</option>
              <option value="Khối 12">Khối 12 (THPT)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Kế hoạch thời gian:
            </label>
            <input
              type="text"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="w-full text-xs rounded-lg border-slate-300 border p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Upload Box */}
          <div className="pt-2 border-t border-slate-100">
            <label className="block text-xs font-medium text-slate-700 mb-2">
              Tải file PPCT (.docx, .txt):
            </label>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-emerald-200 hover:border-emerald-400 bg-emerald-50/30 hover:bg-emerald-50/60 rounded-xl p-4 cursor-pointer transition text-center">
              <FileUp className="w-6 h-6 text-emerald-500 mb-1" />
              <span className="text-xs font-medium text-emerald-900">
                {fileName ? fileName : 'Bấm để tải file Word hoặc kéo thả'}
              </span>
              <span className="text-[10px] text-slate-400 mt-1">
                Tự động trích xuất bảng phân phối 35 tuần
              </span>
              <input
                type="file"
                accept=".docx,.txt,.md"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-[11px] text-slate-600 space-y-1">
            <span className="font-bold text-slate-800 block">Lưu ý Công văn 3284 Đồng Tháp:</span>
            <p>• Tổng 35 tuần/năm học.</p>
            <p>• Không bắt buộc dạy ở tất cả các tuần, không bắt buộc chia đều tiết/tuần.</p>
            <p>• Bố trí thời lượng phù hợp điều kiện phòng máy, đồ dùng giữa 3 điểm trường.</p>
          </div>
        </div>

        {/* Content Box */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-slate-600" />
              <span>Nội dung Khung Phân phối chương trình:</span>
            </label>
            <span className="text-xs text-slate-500">
              {content.length > 0 ? `${content.length} ký tự` : 'Chưa có nội dung'}
            </span>
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Dán bảng phân phối chương trình của tổ (Tuần, tiết, tên chủ đề/bài học, thời lượng kiểm tra đánh giá)..."
            className="w-full flex-1 min-h-[300px] text-xs font-mono p-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-y leading-relaxed bg-slate-50/50 focus:bg-white transition"
          />

          <div className="mt-4 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 italic">
              * Hệ thống sẽ tự động đối chiếu số tuần và đề xuất các điểm lồng ghép AI/năng lực số cho từng bài.
            </span>
            <button
              onClick={handleEvaluate}
              disabled={loading || !content.trim()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 text-white text-xs font-bold shadow-md hover:shadow-lg disabled:opacity-50 transition flex items-center gap-2 shrink-0"
            >
              {loading ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin" />
                  <span>Đang rà soát đối chiếu PPCT...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Đánh Giá PPCT & Tạo Ma Trận AI</span>
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>

      {/* Result Section */}
      {result && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 space-y-6 animate-in fade-in duration-300">
          {/* Top Banner */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-slate-900 via-emerald-950 to-teal-950 text-white">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-600/30 border border-emerald-400/40 flex items-center justify-center font-bold text-amber-300">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm">
                    KẾT QUẢ RÀ SOÁT PPCT MÔN: {result.subject} ({result.grade})
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {result.approvalStatus}
                  </span>
                </div>
                <p className="text-xs text-emerald-200 mt-0.5">
                  Phân bổ 35 tuần chuẩn Sở GDĐT Đồng Tháp • Tiến độ và thời lượng kiểm tra đánh giá định kỳ
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
              <button
                onClick={handleSave}
                className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow transition"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{savedSuccess ? 'Đã lưu!' : 'Lưu kết quả'}</span>
              </button>
              <button
                onClick={() => window.print()}
                className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow transition"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>In Biên Bản</span>
              </button>
            </div>
          </div>

          {/* Time Weeks Analysis Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block">Tổng số tuần thực dạy:</span>
              <span className="text-lg font-bold text-slate-800">{result.weeksAnalysis?.totalWeeks || 35} Tuần</span>
              <span className="text-[10px] text-emerald-600 block mt-0.5">Chuẩn quy định</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block">Học kì 1:</span>
              <span className="text-lg font-bold text-slate-800">{result.weeksAnalysis?.semester1Weeks || 18} Tuần</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">18 tuần thực học</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block">Học kì 2:</span>
              <span className="text-lg font-bold text-slate-800">{result.weeksAnalysis?.semester2Weeks || 17} Tuần</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">17 tuần thực học</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block">Kiểm tra định kì:</span>
              <span className="text-xs font-semibold text-slate-700 block mt-1 leading-snug">
                {result.weeksAnalysis?.evaluationPeriods || 'Bố trí tuần 9 & 18 (HK1), 27 & 35 (HK2)'}
              </span>
            </div>
          </div>

          {/* Strengths & Limitations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-100">
              <h4 className="font-bold text-emerald-900 mb-2 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Ưu điểm của phân phối chương trình:</span>
              </h4>
              <ul className="space-y-1 list-disc list-inside text-slate-700">
                {result.strengths.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>

            <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-100">
              <h4 className="font-bold text-amber-900 mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Hạn chế hoặc điểm cần lưu ý:</span>
              </h4>
              <ul className="space-y-1 list-disc list-inside text-slate-700">
                {result.limitations.map((l, idx) => (
                  <li key={idx}>{l}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Pedagogical Suggestions */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <h4 className="font-bold text-slate-900 mb-2">
              GỢI Ý ĐIỀU CHỈNH SƯ PHẠM (ĐẢM BẢO TÍNH KHOA HỌC & ĐẶC THÙ 3 ĐIỂM TRƯỜNG):
            </h4>
            <ul className="space-y-1.5 list-disc list-inside text-slate-700">
              {result.pedagogicalSuggestions.map((sug, idx) => (
                <li key={idx} className="leading-relaxed">{sug}</li>
              ))}
            </ul>
          </div>

          {/* AI & DIGITAL INTEGRATION MATRIX */}
          <div className="border border-indigo-200 bg-gradient-to-br from-indigo-50/60 to-purple-50/40 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-indigo-600 text-white">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-indigo-950">
                  MA TRẬN GỢI Ý TÍCH HỢP NĂNG LỰC SỐ VÀ TRÍ TUỆ NHÂN TẠO (AI) VÀO PPCT
                </h4>
                <p className="text-xs text-indigo-700">
                  Chỉ đạo của Phó Hiệu Trưởng giúp giáo viên biết chính xác bài nào nên đưa công nghệ hoặc công cụ AI vào tổ chức dạy học
                </p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-indigo-200 bg-white">
              <table className="w-full text-xs text-left">
                <thead className="bg-indigo-100/60 text-indigo-950 font-bold border-b border-indigo-200">
                  <tr>
                    <th className="p-2.5 w-20">Tuần</th>
                    <th className="p-2.5 w-1/4">Tên Bài Học / Chủ Đề</th>
                    <th className="p-2.5">Hoạt Động Số / AI Gợi Ý</th>
                    <th className="p-2.5 w-1/4">Năng Lực Mục Tiêu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-indigo-100">
                  {result.digitalAndAiIntegrationMatrix.map((item, idx) => (
                    <tr key={idx} className="hover:bg-indigo-50/30">
                      <td className="p-2.5 font-bold text-indigo-900">{item.week}</td>
                      <td className="p-2.5 font-medium text-slate-800">{item.lesson}</td>
                      <td className="p-2.5 text-slate-700">{item.digitalAiActivity}</td>
                      <td className="p-2.5 text-indigo-800 font-medium">{item.targetCompetence}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Official Recommendation */}
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs flex items-center justify-between text-emerald-950 font-semibold">
            <span>Ý KIẾN KẾT LUẬN CỦA PHÓ HIỆU TRƯỞNG:</span>
            <span className="text-sm font-bold text-emerald-900">{result.phtActionRecommendation}</span>
          </div>
        </div>
      )}
    </div>
  );
};
