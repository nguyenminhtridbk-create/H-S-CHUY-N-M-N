import React, { useState } from 'react';
import { 
  FileUp, 
  Sparkles, 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  Copy, 
  Save, 
  Printer, 
  RotateCcw, 
  Building, 
  Cpu, 
  ArrowRight,
  BookOpen,
  Award
} from 'lucide-react';
import { extractTextFromFile } from '../utils/fileReader';
import { SCHOOL_CAMPUSES, SCHOOL_DEPARTMENTS, SAMPLE_DEPARTMENT_PLAN } from '../data/mockTemplates';
import { DepartmentPlanEvaluation } from '../types';
import { SCHOOL_DATA } from '../data/schoolStaffHelper';

interface DepartmentPlanTabProps {
  onSaveToArchive: (item: DepartmentPlanEvaluation) => void;
  prefilledDepartment?: {
    departmentName: string;
    campus: string;
  } | null;
}

export const DepartmentPlanTab: React.FC<DepartmentPlanTabProps> = ({ onSaveToArchive, prefilledDepartment }) => {
  const realDeptList = SCHOOL_DATA.departments.map(d => d.name);
  const [departmentName, setDepartmentName] = useState(prefilledDepartment?.departmentName || realDeptList[1] || 'Tổ Toán');
  const [campus, setCampus] = useState(prefilledDepartment?.campus || 'Áp dụng cả 3 điểm trường (Đốc Binh Kiều, Tân Kiều, THPT)');

  React.useEffect(() => {
    if (prefilledDepartment) {
      if (prefilledDepartment.departmentName) setDepartmentName(prefilledDepartment.departmentName);
      if (prefilledDepartment.campus) setCampus(prefilledDepartment.campus);
    }
  }, [prefilledDepartment]);
  const [gradeLevel, setGradeLevel] = useState('Khối 6-9 THCS & Khối 10-12 THPT (53 Lớp)');
  const [focusDigitalAi, setFocusDigitalAi] = useState(true);
  const [content, setContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DepartmentPlanEvaluation | null>(null);
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

  // Load Sample Plan
  const handleLoadSample = () => {
    setContent(SAMPLE_DEPARTMENT_PLAN);
    setFileName('Ke_hoach_To_Toan_Tin_2026_2027.docx (Mẫu)');
    setDepartmentName('Tổ Toán - Tin học');
  };

  // Evaluate Plan
  const handleEvaluate = async () => {
    if (!content.trim()) {
      setError('Vui lòng tải lên file hoặc dán nội dung Kế hoạch giáo dục của Tổ chuyên môn vào khung.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSavedSuccess(false);

      const response = await fetch('/api/evaluate/department-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          departmentName,
          campus,
          gradeLevel,
          content,
          focusDigitalAi,
        }),
      });

      const resData = await response.json();
      if (!resData.success) {
        throw new Error(resData.error || 'Lỗi xử lý đánh giá');
      }

      const evalData: DepartmentPlanEvaluation = {
        id: 'dp-' + Date.now(),
        date: new Date().toISOString(),
        departmentName,
        gradeLevel,
        campus,
        overallScore: resData.data.overallScore || 85,
        classification: resData.data.classification || 'Đạt yêu cầu',
        summary: resData.data.summary || '',
        criteriaEvaluation: resData.data.criteriaEvaluation || [],
        digitalAiRecommendations: resData.data.digitalAiRecommendations || { evaluation: '', concreteProposals: [] },
        specificFeedbackForPHT: resData.data.specificFeedbackForPHT || [],
        officialConclusion: resData.data.officialConclusion || 'ĐỒNG Ý PHÊ DUYỆT',
        status: resData.data.overallScore >= 80 ? 'approved' : 'request_changes'
      };

      setResult(evalData);
    } catch (err: any) {
      let msg = err.message || 'Không thể đánh giá kế hoạch';
      if (typeof msg === 'string' && (msg.includes('503') || msg.includes('UNAVAILABLE') || msg.includes('demand'))) {
        msg = 'Hệ thống AI đang tiếp nhận lưu lượng tăng cao đột biến tạm thời từ máy chủ. Thầy vui lòng bấm lại nút "Thẩm Định Kế Hoạch Tổ Ngay" để hệ thống tự động hoàn tất đánh giá qua máy chủ dự phòng.';
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (result) {
      onSaveToArchive(result);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Intro Heading */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded">
              Phụ lục I
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              Thẩm Định Kế Hoạch Giáo Dục Của Tổ Chuyên Môn
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Đối chiếu chuẩn mực Công văn số 3284/SGDĐT-GDPT ngày 24/8/2026 của Sở GDĐT Đồng Tháp. Kiểm tra tính đồng bộ 3 điểm trường và định hướng lồng ghép Năng lực số & AI.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleLoadSample}
            type="button"
            className="px-3 py-1.5 rounded-lg border border-blue-300 text-blue-700 bg-blue-50/70 hover:bg-blue-100 text-xs font-medium flex items-center gap-1.5 transition"
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-600" />
            <span>Tải Kế hoạch mẫu (Tổ Toán - Tin)</span>
          </button>
        </div>
      </div>

      {/* Input Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Metadata & Controls */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-semibold text-sm text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Building className="w-4 h-4 text-blue-600" />
            <span>Thông tin Tổ Chuyên môn</span>
          </h3>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Tổ chuyên môn:
            </label>
            <select
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
              className="w-full text-xs rounded-lg border-slate-300 border p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {realDeptList.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Điểm trường áp dụng:
            </label>
            <select
              value={campus}
              onChange={(e) => setCampus(e.target.value)}
              className="w-full text-xs rounded-lg border-slate-300 border p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="Áp dụng cả 3 điểm trường (Đốc Binh Kiều, Tân Kiều, THPT)">
                Toàn trường (3 điểm trường - 53 lớp)
              </option>
              <option value="Điểm chính Đốc Binh Kiều (24 lớp)">
                Điểm chính Đốc Binh Kiều (24 lớp)
              </option>
              <option value="Điểm Tân Kiều (15 lớp - cách 11km)">
                Điểm Tân Kiều (15 lớp - cách điểm chính 11 km)
              </option>
              <option value="Điểm THPT Đốc Binh Kiều (14 lớp)">
                Điểm THPT Đốc Binh Kiều (14 lớp Khối 10-12)
              </option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Khối lớp thực hiện:
            </label>
            <input
              type="text"
              value={gradeLevel}
              onChange={(e) => setGradeLevel(e.target.value)}
              className="w-full text-xs rounded-lg border-slate-300 border p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* AI & Digital Toggle */}
          <div className="bg-indigo-50/70 p-3 rounded-xl border border-indigo-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-indigo-600" />
                <span>Định hướng Năng lực số & AI</span>
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={focusDigitalAi}
                  onChange={(e) => setFocusDigitalAi(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-8 h-4 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
            <p className="text-[11px] text-indigo-700 leading-relaxed">
              Yêu cầu AI phân tích sâu khả năng tích hợp công nghệ số, phần mềm dạy học và trí tuệ nhân tạo (AI) vào các chủ đề bài học và hoạt động giáo dục STEM của tổ.
            </p>
          </div>

          {/* File Upload Box */}
          <div className="pt-2 border-t border-slate-100">
            <label className="block text-xs font-medium text-slate-700 mb-2">
              Tải lên file văn bản (.docx, .txt):
            </label>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-blue-200 hover:border-blue-400 bg-blue-50/30 hover:bg-blue-50/60 rounded-xl p-4 cursor-pointer transition text-center">
              <FileUp className="w-6 h-6 text-blue-500 mb-1" />
              <span className="text-xs font-medium text-blue-900">
                {fileName ? fileName : 'Bấm để chọn file Word (.docx) hoặc kéo thả'}
              </span>
              <span className="text-[10px] text-slate-400 mt-1">
                Hệ thống tự động trích xuất nội dung văn bản
              </span>
              <input
                type="file"
                accept=".docx,.txt,.md"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Middle/Right Column: Text Content Editor */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-slate-600" />
              <span>Nội dung Kế hoạch giáo dục của Tổ chuyên môn:</span>
            </label>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>{content.length > 0 ? `${content.length} ký tự` : 'Chưa có nội dung'}</span>
              {content && (
                <button
                  onClick={() => setContent('')}
                  className="text-slate-400 hover:text-red-600 text-xs ml-2"
                >
                  Xóa trắng
                </button>
              )}
            </div>
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Dán toàn bộ văn bản Kế hoạch giáo dục của tổ chuyên môn gửi lên (hoặc tải file Word ở khung bên trái)..."
            className="w-full flex-1 min-h-[300px] text-xs font-mono p-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-y leading-relaxed bg-slate-50/50 focus:bg-white transition"
          />

          <div className="mt-4 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 italic">
              * Khuyến nghị: Kế hoạch nên có đủ 4 phần (I. Đặc điểm tình hình; II. Kế hoạch dạy học; III. Hoạt động giáo dục; IV. Nhiệm vụ khác) theo chuẩn Phụ lục I.
            </span>
            <button
              onClick={handleEvaluate}
              disabled={loading || !content.trim()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white text-xs font-bold shadow-md hover:shadow-lg disabled:opacity-50 transition flex items-center gap-2 shrink-0"
            >
              {loading ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin" />
                  <span>Đang đối chiếu thẩm định...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Thẩm Định Kế Hoạch Tổ Ngay</span>
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

      {/* Results View */}
      {result && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 space-y-6 animate-in fade-in duration-300">
          {/* Top Score Banner */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center font-black text-2xl text-amber-400">
                {result.overallScore}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm">KẾT QUẢ THẨM ĐỊNH KẾ HOẠCH TỔ: {result.departmentName}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    result.overallScore >= 80 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {result.classification}
                  </span>
                </div>
                <p className="text-xs text-blue-200 mt-0.5">
                  Áp dụng: {result.campus} • Đánh giá theo chuẩn Công văn 3284 Sở GDĐT Đồng Tháp
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
              <button
                onClick={handleSave}
                className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow transition"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{savedSuccess ? 'Đã lưu hồ sơ!' : 'Lưu vào Hồ sơ'}</span>
              </button>
              <button
                onClick={handlePrint}
                className="px-3.5 py-2 rounded-lg bg-blue-800 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow transition"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>In Biên Bản</span>
              </button>
            </div>
          </div>

          {/* Overview Summary */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs leading-relaxed text-slate-700">
            <span className="font-bold text-slate-900 block mb-1">TỔNG QUAN ĐÁNH GIÁ:</span>
            {result.summary}
          </div>

          {/* 4 Criteria Matrix (Phụ lục I) */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-600" />
              <span>ĐỐI CHIẾU 4 TIÊU CHÍ BẮT BUỘC THEO PHỤ LỤC I (CÔNG VĂN 3284):</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.criteriaEvaluation.map((crit, idx) => (
                <div key={idx} className="border border-slate-200 rounded-xl p-4 bg-white shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-xs text-blue-900">{crit.criteria}</h4>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        crit.status.includes('Đạt') || crit.status.includes('Khá') 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {crit.status}
                      </span>
                    </div>

                    <div className="text-xs space-y-2 mt-2">
                      <div className="bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-100 text-slate-700">
                        <strong className="text-emerald-900 block mb-0.5 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                          <span>Ưu điểm đã thể hiện:</span>
                        </strong>
                        <p>{crit.findings}</p>
                      </div>

                      <div className="bg-amber-50/60 p-2.5 rounded-lg border border-amber-100 text-slate-700">
                        <strong className="text-amber-900 block mb-0.5 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          <span>Điểm cần bổ sung / hoàn thiện:</span>
                        </strong>
                        <p>{crit.improvements}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI & Digital Competence Special Direction */}
          <div className="border border-indigo-200 bg-gradient-to-br from-indigo-50/60 to-blue-50/60 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-indigo-600 text-white">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-indigo-950">
                  ĐỊNH HƯỚNG LỒNG GHÉP NĂNG LỰC SỐ VÀ TRÍ TUỆ NHÂN TẠO (AI) CHO TỔ
                </h4>
                <p className="text-xs text-indigo-700">
                  Đổi mới phương pháp dạy học gắn với chuyển đổi số & AI có đạo đức cho 3 điểm trường Đốc Binh Kiều & Tân Kiều
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-700 mb-3 bg-white/80 p-3 rounded-lg border border-indigo-100">
              <strong className="text-indigo-900">Đánh giá hiện trạng của tổ: </strong>
              {result.digitalAiRecommendations?.evaluation}
            </p>

            <div className="space-y-2">
              <span className="text-xs font-bold text-indigo-900">Các đề xuất cụ thể lồng ghép vào kế hoạch:</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {result.digitalAiRecommendations?.concreteProposals?.map((prop, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-xl border border-indigo-100 shadow-sm text-xs text-slate-700 flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-800 font-bold flex items-center justify-center shrink-0 text-[11px] mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="leading-relaxed">{prop}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* PHT Feedback and Official Conclusion */}
          <div className="border border-slate-300 rounded-xl p-5 bg-white space-y-4">
            <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
              <h4 className="font-bold text-sm text-slate-900">
                Ý KIẾN KẾT LUẬN CỦA PHÓ HIỆU TRƯỞNG PHỤ TRÁCH CHUYÊN MÔN
              </h4>
              <span className="text-xs text-slate-500 font-medium">Trường THCS & THPT Đốc Binh Kiều</span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-700">
              <span className="font-semibold text-slate-800">Những yêu cầu tổ trưởng cần điều chỉnh:</span>
              <ul className="space-y-1 list-disc list-inside">
                {result.specificFeedbackForPHT?.map((fb, idx) => (
                  <li key={idx} className="text-slate-700 leading-relaxed">{fb}</li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 rounded-lg bg-blue-50 border border-blue-200 text-xs font-bold text-blue-900 flex items-center justify-between">
              <span>KẾT LUẬN CHUYÊN MÔN:</span>
              <span className="text-sm text-blue-950 font-black uppercase">
                {result.officialConclusion}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
