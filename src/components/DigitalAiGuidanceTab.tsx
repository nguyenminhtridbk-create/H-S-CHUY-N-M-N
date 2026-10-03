import React, { useState } from 'react';
import { 
  Sparkles, 
  Cpu, 
  ShieldCheck, 
  RotateCcw, 
  Copy, 
  CheckCircle, 
  Printer, 
  BookOpen, 
  Layers, 
  Lightbulb, 
  Terminal,
  Share2
} from 'lucide-react';
import { DigitalAiGuidance } from '../types';
import { SCHOOL_DEPARTMENTS } from '../data/mockTemplates';

export const DigitalAiGuidanceTab: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState('Khoa học Tự nhiên (Vật lí, Hóa học, Sinh học)');
  const [targetGrade, setTargetGrade] = useState('Khối 6-9 THCS (39 lớp cả 2 điểm Đốc Binh Kiều & Tân Kiều)');
  const [customTopic, setCustomTopic] = useState('Tích hợp các bài thực hành, thí nghiệm mô phỏng và dự án STEM');
  const [loading, setLoading] = useState(false);
  const [guidance, setGuidance] = useState<DigitalAiGuidance | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Generate Digital & AI Guidance
  const handleGenerate = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch('/api/digital-ai/orient', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: selectedSubject,
          grade: targetGrade,
          topic: customTopic,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Lỗi khi tạo định hướng năng lực số');
      }

      setGuidance(data.data);
    } catch (err: any) {
      setError(err.message || 'Lỗi xử lý');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!guidance) return;
    const textToCopy = `ĐỊNH HƯỚNG CHUYÊN MÔN CỦA PHÓ HIỆU TRƯỞNG
TRƯỜNG THCS & THPT ĐỐC BINH KIỀU
Chủ đề: ${guidance.subjectTitle}
${guidance.phtDirectives}

I. MỤC TIÊU NĂNG LỰC SỐ & AI:
${guidance.digitalCompetenceGoals.map((g, i) => `${i + 1}. ${g}`).join('\n')}

II. CÁC KỊCH BẢN DẠY HỌC MINH HỌA:
${guidance.teachingScenarios.map((s, i) => `Bài ${i + 1}: ${s.topic} (${s.grade}) - Công cụ: ${s.tool}\nHoạt động: ${s.activity}\nGiá trị phát triển: ${s.pedagogicalValue}`).join('\n\n')}

III. QUY TẮC ĐẠO ĐỨC & AN TOÀN:
${guidance.safetyAndEthicsGuide.map((e, i) => `${i + 1}. ${e}`).join('\n')}`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-indigo-100 text-indigo-800 text-xs font-bold rounded flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5" />
              <span>Chuyển Đổi Số & AI 2026</span>
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              Công Cụ Định Hướng Lồng Ghép Năng Lực Số & Trí Tuệ Nhân Tạo (AI) Cho Các Tổ
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Dành riêng cho Phó Hiệu Trưởng để chỉ đạo, gợi ý kịch bản sư phạm cụ thể và ban hành hướng dẫn thực thi cho giáo viên tại 3 điểm trường Đốc Binh Kiều & Tân Kiều.
          </p>
        </div>
      </div>

      {/* Control Panel */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Chọn Môn học / Tổ chuyên môn:
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full text-xs rounded-lg border-slate-300 border p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              {SCHOOL_DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
              <option value="Môn Ngữ văn (Tất cả các khối)">Môn Ngữ văn (Đọc hiểu, viết văn bản, sáng tạo nội dung số)</option>
              <option value="Môn Tiếng Anh (Ngoại ngữ)">Môn Tiếng Anh (Luyện nói, chatbot đối thoại, thuyết trình)</option>
              <option value="Môn Lịch sử & Địa lí">Môn Lịch sử & Địa lí (Bản đồ số GIS, bảo tàng ảo 3D)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Khối lớp & Điểm trường:
            </label>
            <select
              value={targetGrade}
              onChange={(e) => setTargetGrade(e.target.value)}
              className="w-full text-xs rounded-lg border-slate-300 border p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="Khối 6-9 THCS (39 lớp cả 2 điểm Đốc Binh Kiều & Tân Kiều)">
                THCS: Khối 6-9 (39 lớp cả 2 điểm Đốc Binh Kiều & Tân Kiều)
              </option>
              <option value="Điểm Tân Kiều (15 lớp - tối ưu thiết bị truyền dẫn và di động)">
                Điểm Tân Kiều (15 lớp - tối ưu thiết bị di động/offline)
              </option>
              <option value="Khối 10-12 THPT (14 lớp học chuyên đề sâu)">
                THPT: Khối 10-12 (14 lớp học chuyên đề nâng cao)
              </option>
              <option value="Toàn trường (Cả THCS và THPT 53 lớp)">
                Toàn trường (Cả 53 lớp)
              </option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Chủ đề trọng tâm cần lồng ghép:
            </label>
            <input
              type="text"
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              placeholder="VD: Bài thực hành, vẽ đồ thị, kiểm tra thường xuyên..."
              className="w-full text-xs rounded-lg border-slate-300 border p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-100">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-700 to-purple-700 hover:from-indigo-800 hover:to-purple-800 text-white text-xs font-bold shadow-md hover:shadow-lg disabled:opacity-50 transition flex items-center gap-2"
          >
            {loading ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin" />
                <span>Đang thiết kế kịch bản sư phạm AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Xuất Bản Định Hướng Năng Lực Số & AI</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
            {error}
          </div>
        )}
      </div>

      {/* Generated Results */}
      {guidance && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 space-y-6 animate-in fade-in duration-300">
          {/* Header Action */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-900 text-white">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  HƯỚNG DẪN CHUYÊN MÔN PHT
                </span>
                <span className="text-xs text-indigo-300">THCS & THPT Đốc Binh Kiều</span>
              </div>
              <h3 className="text-base font-bold mt-1 text-white">
                {guidance.subjectTitle}
              </h3>
            </div>

            <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
              <button
                onClick={handleCopy}
                className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow transition"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? 'Đã sao chép!' : 'Sao chép văn bản'}</span>
              </button>
              <button
                onClick={() => window.print()}
                className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow transition"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>In Hướng Dẫn</span>
              </button>
            </div>
          </div>

          {/* PHT Directive Callout */}
          <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-950">
            <span className="font-bold text-indigo-900 block mb-1">
              CHỈ ĐẠO CỦA PHÓ HIỆU TRƯỞNG GỬI TỔ TRƯỞNG VÀ GIÁO VIÊN:
            </span>
            <p className="leading-relaxed italic">{guidance.phtDirectives}</p>
          </div>

          {/* Section 1: Digital Competence Goals */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/60">
            <h4 className="font-bold text-xs text-slate-900 uppercase mb-2 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>1. Mục Tiêu Phát Triển Năng Lực Số & Tư Duy AI Cho Học Sinh:</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {guidance.digitalCompetenceGoals.map((goal, idx) => (
                <div key={idx} className="bg-white p-3 rounded-lg border border-slate-200 text-xs text-slate-700 shadow-sm flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center shrink-0 text-[11px] mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="leading-relaxed">{goal}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: 5 Concrete Teaching Scenarios */}
          <div>
            <h4 className="font-bold text-xs text-slate-900 uppercase mb-3 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>2. Gợi Ý Kịch Bản Dạy Học Lồng Ghép Số Hóa & AI Cụ Thể:</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {guidance.teachingScenarios.map((sc, idx) => (
                <div key={idx} className="border border-indigo-100 rounded-xl p-4 bg-white shadow-sm hover:border-indigo-300 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-indigo-900">{sc.topic}</span>
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 font-semibold rounded text-[11px]">
                        {sc.grade}
                      </span>
                    </div>

                    <div className="bg-slate-50 p-2 rounded border border-slate-200 text-[11px] text-slate-600 mb-2">
                      <strong className="text-slate-800">Công cụ số/AI: </strong>
                      <span className="text-purple-700 font-bold">{sc.tool}</span>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed mb-2">
                      <strong>Hoạt động của HS: </strong>{sc.activity}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 text-[11px] text-emerald-800 font-medium">
                    🎯 Giá trị sư phạm: {sc.pedagogicalValue}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Prompt Templates for Teachers */}
          <div className="border border-purple-200 bg-purple-50/40 rounded-xl p-4">
            <h4 className="font-bold text-xs text-purple-950 uppercase mb-3 flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-purple-600" />
              <span>3. Mẫu Câu Lệnh (Prompt) Sư Phạm Chuẩn Để Giáo Viên Chuẩn Bị Bài Giảng:</span>
            </h4>
            <div className="space-y-3">
              {guidance.teacherPromptTemplates.map((pt, idx) => (
                <div key={idx} className="bg-white p-3.5 rounded-lg border border-purple-200 shadow-sm text-xs">
                  <span className="font-bold text-purple-900 block mb-1">
                    {pt.title}:
                  </span>
                  <div className="bg-slate-900 text-emerald-400 p-2.5 rounded font-mono text-[11px] select-all overflow-x-auto">
                    {pt.promptExample}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Ethics and AI Safety */}
          <div className="border border-amber-200 bg-amber-50/50 rounded-xl p-4">
            <h4 className="font-bold text-xs text-amber-950 uppercase mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>4. Quy Tắc Đạo Đức, Bảo Vệ Dữ Liệu Học Sinh & Liêm Chính Học Thuật Khi Dùng AI:</span>
            </h4>
            <ul className="space-y-1 text-xs text-amber-900 list-disc list-inside">
              {guidance.safetyAndEthicsGuide.map((guide, idx) => (
                <li key={idx} className="leading-relaxed">{guide}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
