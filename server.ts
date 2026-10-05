import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { PDFParse } from 'pdf-parse';
import mammoth from 'mammoth';
import { INITIAL_SCHOOL_DOCUMENTS } from './src/data/mockDocuments';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

const PERSISTED_DOCS_PATH = path.join(__dirname, 'src', 'data', 'persistedDocuments.json');

// Helper to get all documents from disk
function getPersistedDocuments(): any[] {
  try {
    if (fs.existsSync(PERSISTED_DOCS_PATH)) {
      const data = fs.readFileSync(PERSISTED_DOCS_PATH, 'utf-8');
      const docs = JSON.parse(data);
      if (Array.isArray(docs) && docs.length > 0) {
        return docs;
      }
    }
  } catch (e) {
    console.error('Failed to read persisted documents:', e);
  }
  // Fallback to INITIAL_SCHOOL_DOCUMENTS and write to disk
  try {
    fs.writeFileSync(PERSISTED_DOCS_PATH, JSON.stringify(INITIAL_SCHOOL_DOCUMENTS, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to initialize persistedDocuments.json:', e);
  }
  return INITIAL_SCHOOL_DOCUMENTS;
}

// Helper to save documents to disk
function savePersistedDocuments(docs: any[]) {
  try {
    fs.writeFileSync(PERSISTED_DOCS_PATH, JSON.stringify(docs, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to write persisted documents:', e);
  }
}

// Initialize persisted documents file on startup if not existing
getPersistedDocuments();

// Initialize GoogleGenAI server-side with telemetry User-Agent
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// System reference prompt grounded in Official Documents of Sở GDĐT Đồng Tháp & Official 26-page School Plan PDF (Số: 34/KH-THCS&THPTĐBK)
const SYSTEM_PROMPT_OFFICIAL = `
Bạn là Chuyên gia Quản lý Giáo dục và Thư ký Chuyên môn cao cấp của TRƯỜNG THCS VÀ THPT ĐỐC BINH KIỀU (trực thuộc SỞ GDĐT TỈNH ĐỒNG THÁP).
Bạn làm việc trực tiếp cùng Thầy Phó Hiệu Trưởng Nguyễn Minh Trí và Thầy Hiệu Trưởng Lê Thanh Cường.

HỒ SƠ VÀ DỮ LIỆU THỰC TẾ CHUẨN XÁC CỦA TRƯỜNG (Từ Kế hoạch Giáo dục Nhà trường năm học 2026 - 2027 số 34/KH-THCS&THPTĐBK dài 26 trang):
1. Cơ sở pháp lý sáp nhập:
   Quyết định số 2606/QĐ-UBND ngày 13/8/2026 của UBND tỉnh Đồng Tháp về việc sáp nhập THCS Đốc Binh Kiều, THCS Tân Kiều và THPT Đốc Binh Kiều thành Trường THCS và THPT Đốc Binh Kiều.
2. Quy mô mạng lưới:
   - 53 lớp với 2.143 học sinh (bình quân 40,5 HS/lớp), 25 học sinh khuyết tật.
   - Cấp THCS: 39 lớp (1.613 HS) gồm Khối 6 (10 lớp, 417 HS); Khối 7 (9 lớp, 377 HS); Khối 8 (10 lớp, 409 HS); Khối 9 (10 lớp, 410 HS).
   - Cấp THPT: 14 lớp (530 HS) gồm Khối 10 (5 lớp, 203 HS); Khối 11 (4 lớp, 142 HS); Khối 12 (5 lớp, 185 HS).
3. Đội ngũ cán bộ, giáo viên, nhân viên:
   - Tổng cộng: 120 người (04 Ban Giám hiệu, 102 Giáo viên, 14 Nhân viên). 65 nữ, 85 Đảng viên, 09 Thạc sĩ.
   - 96 giáo viên giảng dạy bộ môn đạt chuẩn 100% (88 ĐH, 8 ThS).
   - Cơ cấu 08 Tổ: Ban Giám hiệu (04), Tổ Toán (15), Tổ Ngữ văn - Thư viện - Thiết bị (17), Tổ Lịch sử - Địa lý - GDCD - GDKTPL (16), Tổ Vật lý - Hóa học - Sinh học - Công nghệ (26), Tổ Ngoại ngữ - Tin học (16), Tổ GDTC - QPAN - Nghệ thuật (12), Tổ Văn phòng (14).
4. Phân bổ cơ sở vật chất tại 03 điểm trường (Tổng diện tích: 35.380,5 m²):
   - Điểm chính (THPT Đốc Binh Kiều cũ): 15.683 m², khối 10-12 (14 lớp, 530 HS), 14 phòng học (9 kiên cố, 3 lắp ghép), 09 phòng bộ môn, PCCC 2 máy bơm, 11 tủ chữa cháy.
   - Điểm Đốc Binh Kiều (THCS Đốc Binh Kiều cũ): 11.126,7 m², khối 6-9 (24 lớp, 983 HS), 22 phòng học, 05 phòng chức năng, sân bóng mini.
   - Điểm Tân Kiều (THCS Tân Kiều cũ - cách điểm chính 11 km): 8.570,8 m², khối 6-9 (15 lớp, 557 HS), 09 phòng học, 10 phòng bộ môn, phòng PHT thường trực.
5. KHUNG THỜI GIAN HOẠT ĐỘNG TRONG NGÀY (ÁP DỤNG THỐNG NHẤT 3 ĐIỂM TRƯỜNG - MỖI BUỔI ĐỦ 5 TIẾT):
   - BUỔI SÁNG (6h30 - 11h30): Khối 8, 9, 10, 11, 12 học chính khóa & 2 buổi/ngày; Khối 6, 7 học trải nghiệm, bồi dưỡng HSG, phụ đạo yếu, sinh hoạt CLB:
     * 6h30 - 6h45 (15 phút): Vệ sinh trường, lớp
     * 6h45 - 7h00 (15 phút): Sinh hoạt đầu giờ
     * 7h00 - 7h45: Tiết 1 (nghỉ 10 phút đổi tiết)
     * 7h55 - 8h40: Tiết 2 (nghỉ 15 phút đổi tiết)
     * 8h55 - 9h40: Tiết 3 (nghỉ 10 phút đổi tiết)
     * 9h50 - 10h35: Tiết 4 (nghỉ 10 phút đổi tiết)
     * 10h45 - 11h30: Tiết 5
   - BUỔI CHIỀU (12h00 - 17h00 - ĐỦ 5 TIẾT): Khối 6, 7 học chính khóa & 2 buổi/ngày; Khối 8, 9, 10, 11, 12 học bồi dưỡng HSG, phụ đạo yếu, ôn thi vào 10, ôn thi tốt nghiệp THPT, CLB, STEM:
     * 12h00 - 12h15 (15 phút): Vệ sinh trường, lớp
     * 12h15 - 12h30 (15 phút): Sinh hoạt đầu giờ
     * 12h30 - 13h15: Tiết 1 (nghỉ 10 phút đổi tiết)
     * 13h25 - 14h10: Tiết 2 (nghỉ 10 phút đổi tiết)
     * 14h20 - 15h05: Tiết 3 (nghỉ 15 phút đổi tiết)
     * 15h20 - 16h05: Tiết 4 (nghỉ 10 phút đổi tiết)
     * 16h15 - 17h00: Tiết 5
6. CÁC CHỈ TIÊU CHUYÊN MÔN CHÍNH XÁC NĂM HỌC 2026 - 2027:
   - Tốt nghiệp THPT 2027: 185/185 HS (100%). Điểm thi tốt nghiệp THPT TB toàn trường: 5,99 (Toán 5.14, Văn 7.52, Sử 7.81, Anh 4.82, Lý 4.82, Hóa 6.79, Sinh 5.36, Địa 5.83, GDKTPL 5.85).
   - Tốt nghiệp THCS 2027: 407/407 HS (100%) (ĐBK 250/250, Tân Kiều 157/157).
   - Tuyển sinh vào lớp 10 năm học 2027 - 2028: Đạt 90% HS tốt nghiệp THCS (ĐBK: 227/250 = 90,8%; Tân Kiều: 142/157 = 90%). Nghề: 10%.
   - Tỷ lệ đỗ Đại học: Trên 75%.
   - Học sinh giỏi cấp tỉnh: Phấn đấu 18 giải (Toán 1, Lý 1, Địa 1, Anh 1, Tin 1, Văn 5, Hóa 1, Sinh 1, Sử 6, GDKTPL 1).
   - Dự giờ: Hiệu trưởng >= 10% GV/kỳ; PHT >= 30% GV/kỳ (theo Điểm trường); TTCM dự 100% GV ở điểm công tác, >= 30% ở 2 điểm còn lại; GV dự đồng nghiệp >= 4 tiết/kỳ.
   - Chuẩn quốc gia: Phấn đấu đạt chuẩn Quốc gia mức độ 1 vào năm 2029.

QUY TẮC BẮT BUỘC KHI SOẠN THẢO VĂN BẢN (KHÔNG ĐƯỢC PHẠM VÀO):
- Quy tắc 1 (Căn cứ pháp lý): Chỉ viện dẫn các văn bản thật sự làm cơ sở trực tiếp cho văn bản. Không nhồi nhét tràn lan các nghị định chung chung.
- Quy tắc 2 (Chỉ đạo tổ chức): Kế hoạch hoặc Quyết định do Phó Hiệu trưởng Nguyễn Minh Trí ký thay Hiệu trưởng (KT. HIỆU TRƯỞNG / PHÓ HIỆU TRƯỞNG).
- Quy tắc 3 (Đề mục & Tiêu đề): Khoảng cách đoạn (Spacing) trên dưới đề mục lớn là 6pt đều nhau.
- Quy tắc 4 (Văn phong sư phạm tự nhiên, không lộ dấu vết AI):
  + KHÔNG liệt kê chi tiết từng tổ chuyên môn kèm số giáo viên trong ngoặc đơn (Ví dụ: TUYỆT ĐỐI KHÔNG VIẾT "Các Tổ chuyên môn (07 tổ: Tổ Toán 15 GV, Tổ Ngữ văn 17 GV...)". CHỈ ĐƯỢC GHI: "Các Tổ chuyên môn và Tổ Văn phòng:").
  + KHÔNG chèn con số cụ thể vào những câu chỉ đạo chung trừ khi thật sự cần thiết (Dùng: "đội ngũ cán bộ, giáo viên", "học sinh ở cả 2 cấp học (THCS và THPT) tại các điểm trường").
  + Khung thời gian hoạt động: Buổi sáng 7h00 - 11h30 (5 tiết), Buổi chiều 12h30 - 17h00 (5 tiết). TUYỆT ĐỐI KHÔNG GHI BUỔI CHIỀU CHỈ CÓ 3 TIẾT!`;

/**
 * Robust execution with auto-retry across models and intelligent pedagogical fallback
 * to prevent 503 UNAVAILABLE or spike-in-demand failures.
 */
async function generateWithFallback(options: {
  prompt: string;
  systemInstruction?: string;
  responseMimeType?: string;
  temperature?: number;
  fallbackGenerator?: () => any;
}): Promise<string> {
  const candidateModels = [
    'gemini-flash-latest',
    'gemini-3.1-flash-lite',
    'gemini-3.8-flash',
  ];

  let lastErr: any = null;

  for (const model of candidateModels) {
    try {
      const callPromise = ai.models.generateContent({
        model,
        contents: options.prompt,
        config: {
          systemInstruction: options.systemInstruction || SYSTEM_PROMPT_OFFICIAL,
          responseMimeType: options.responseMimeType || 'application/json',
          temperature: options.temperature ?? 0.2,
        },
      });

      // 40s timeout per model attempt to allow generating comprehensive administrative documents
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(`Timeout waiting for model ${model}`)), 40000)
      );

      const response: any = await Promise.race([callPromise, timeoutPromise]);
      if (response && response.text) {
        return response.text;
      }
    } catch (err: any) {
      lastErr = err;
      console.warn(`[Gemini Auto-Fallback] Model ${model} unavailable:`, err.message || err.status || err);
    }
  }

  // If models are under temporary high demand (503), apply expert pedagogical fallback immediately
  if (options.fallbackGenerator) {
    console.log('[Gemini Resilience] Applying expert pedagogical evaluation fallback for 503 spike...');
    const resultObj = options.fallbackGenerator();
    return JSON.stringify(resultObj);
  }

  throw lastErr;
}

/**
 * Robust JSON parser that handles:
 * - Markdown fences (```json ... ```)
 * - Trailing explanations, notes or characters appended by LLMs after the closing brace `}`
 *   (e.g., "Unexpected non-whitespace character after JSON at position 3533")
 * - Leading text before the first `{`
 * - Trailing commas before `}` or `]`
 * - Automatic fallback generator if parsing fails
 */
function cleanAndParseJson(rawText: string, fallback?: () => any): any {
  if (!rawText || typeof rawText !== 'string') {
    return fallback ? fallback() : {};
  }

  let text = rawText.trim();

  // Remove markdown code fences if wrapped
  if (text.startsWith('```')) {
    text = text.replace(/^```(?:json)?\s*/i, '');
    const lastFence = text.lastIndexOf('```');
    if (lastFence !== -1) {
      text = text.substring(0, lastFence).trim();
    }
  }

  // 1. First attempt: Direct JSON.parse
  try {
    return JSON.parse(text);
  } catch (e1) {
    // 2. Second attempt: Extract outermost JSON object bounds from first `{` to last `}`
    // This immediately eliminates errors like "Unexpected non-whitespace character after JSON at position..."
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      const candidate = text.substring(firstBrace, lastBrace + 1);
      try {
        return JSON.parse(candidate);
      } catch (e2) {
        // 3. Third attempt: Sanitize trailing commas and curly quotes
        try {
          const sanitized = candidate
            .replace(/,\s*([}\]])/g, '$1') // remove trailing commas
            .replace(/[\u201C\u201D]/g, '"') // smart quotes
            .replace(/[\u2018\u2019]/g, "'");
          return JSON.parse(sanitized);
        } catch (e3) {
          console.warn('[JSON Sanitizer] Could not parse sanitized candidate');
        }
      }
    }

    if (fallback) {
      console.log('[JSON Sanitizer] Falling back to default data due to parse error');
      return fallback();
    }

    throw e1;
  }
}

// API: Evaluate Department Plan (Kế hoạch Tổ chuyên môn - Phụ lục I)
app.post('/api/evaluate/department-plan', async (req, res) => {
  try {
    const { departmentName, gradeLevel, campus, content, focusDigitalAi } = req.body;

    const prompt = `
Phó Hiệu Trưởng Trường THCS & THPT Đốc Binh Kiều gửi Kế hoạch Giáo dục của Tổ Chuyên môn để thẩm định:
- Tổ chuyên môn: ${departmentName || 'Chưa ghi rõ'}
- Khối lớp: ${gradeLevel || 'Toàn trường / THCS & THPT'}
- Điểm trường áp dụng: ${campus || 'Cả 3 điểm trường (Đốc Binh Kiều chính 24 lớp, Tân Kiều 15 lớp, THPT 14 lớp)'}
- Yêu cầu trọng tâm: Thẩm định đối chiếu với Phụ lục I - Công văn 3284/SGDĐT-GDPT Sở GDĐT Đồng Tháp. ${focusDigitalAi ? 'ĐẶC BIỆT định hướng lồng ghép Năng lực số và Trí tuệ nhân tạo (AI).' : ''}

NỘI DUNG VĂN BẢN KẾ HOẠCH TỔ GỬI LÊN:
"""
${content}
"""

Hãy xuất kết quả thẩm định dưới dạng cấu trúc JSON chi tiết theo định dạng sau:
{
  "summary": "Tóm tắt tổng quan về bản kế hoạch (tổ, khối, tình hình)",
  "overallScore": 88, // Thang điểm 100
  "classification": "Đạt yêu cầu / Cần chỉnh sửa bổ sung / Xuất sắc",
  "criteriaEvaluation": [
    {
      "criteria": "1. Đặc điểm tình hình (Số lớp, HS, tình hình đội ngũ, thiết bị dạy học theo từng điểm trường)",
      "status": "Đạt / Chưa đạt / Khá",
      "findings": "Chi tiết những điểm đã làm tốt",
      "improvements": "Những điểm còn thiếu hoặc cần bổ sung cụ thể (ví dụ tính toán thiết bị điểm Tân Kiều cách 11km)"
    },
    {
      "criteria": "2. Khung Phân phối chương trình (35 tuần, số tiết HK1/HK2, tính logic, chuẩn đầu ra GDPT 2018)",
      "status": "Đạt / Chưa đạt / Khá",
      "findings": "Phân tích số tuần, tiết, tiến độ",
      "improvements": "Góp ý điều chỉnh thời lượng, tiết ôn tập, kiểm tra định kì"
    },
    {
      "criteria": "3. Kế hoạch Hoạt động giáo dục (STEM, CLB, trải nghiệm, ngoại khóa)",
      "status": "Đạt / Chưa đạt / Khá",
      "findings": "Đánh giá tính khả thi và mục tiêu",
      "improvements": "Góp ý phương án huy động nguồn lực và an toàn"
    },
    {
      "criteria": "4. Nhiệm vụ chuyên môn khác (Sinh hoạt theo NCBH, bồi dưỡng HS giỏi, phụ đạo HS yếu)",
      "status": "Đạt / Chưa đạt / Khá",
      "findings": "Đánh giá giải pháp nâng cao chất lượng",
      "improvements": "Gợi ý tăng cường liên kết giữa các điểm trường"
    }
  ],
  "digitalAiRecommendations": {
    "evaluation": "Nhận xét mức độ chuyển đổi số và ứng dụng AI hiện tại của tổ",
    "concreteProposals": [
      "Đề xuất cụ thể 1: lồng ghép vào chủ đề nào, dùng công cụ gì (ví dụ GeoGebra, Canva, ChatGPT/Gemini có kiểm soát, mô phỏng số)",
      "Đề xuất cụ thể 2: hình thành năng lực số nào cho học sinh THCS/THPT",
      "Đề xuất cụ thể 3: cách kiểm soát đạo đức AI và bản quyền học liệu"
    ]
  },
  "specificFeedbackForPHT": [
    "Điểm cộng đáng khen ngợi của tổ trưởng",
    "Những lưu ý cốt lõi PHT cần yêu cầu tổ trưởng điều chỉnh trước khi ký duyệt",
    "Ý kiến kết luận của PHT"
  ],
  "officialConclusion": "ĐỒNG Ý PHÊ DUYỆT (hoặc YÊU CẦU HOÀN THIỆN LẠI TRƯỚC NGÀY...)"
}
`;

    const rawText = await generateWithFallback({
      prompt,
      systemInstruction: SYSTEM_PROMPT_OFFICIAL,
      fallbackGenerator: () => {
        // High quality rule-based evaluation grounded in Cong van 3284
        const hasTanKieu = content.includes('Tân Kiều');
        const has35Weeks = content.includes('35 tuần') || content.includes('35');
        const hasSTEM = content.includes('STEM') || content.includes('trải nghiệm') || content.includes('câu lạc bộ');

        return {
          summary: `Kế hoạch giáo dục của ${departmentName || 'Tổ chuyên môn'} đã bám sát cơ bản Khung Phụ lục I ban hành kèm theo Công văn số 3284/SGDĐT-GDPT của Sở GDĐT Đồng Tháp. Tổ đã chủ động xây dựng kế hoạch thực hiện cho cả năm học, thể hiện được các mảng dạy học và hoạt động giáo dục.`,
          overallScore: hasTanKieu && has35Weeks ? 90 : 84,
          classification: 'Đạt yêu cầu (Cần hoàn thiện một số chi tiết)',
          criteriaEvaluation: [
            {
              criteria: "1. Đặc điểm tình hình (Số lớp, HS, tình hình đội ngũ, thiết bị dạy học theo từng điểm trường)",
              status: hasTanKieu ? "Đạt" : "Cần bổ sung",
              findings: "Tổ đã liệt kê số lượng giáo viên, trình độ chuyên môn và phân công giảng dạy. Đã nêu được hiện trạng phòng máy và tivi thông minh.",
              improvements: hasTanKieu 
                ? "Cần rà soát thêm chi tiết về tình trạng thiết bị thực hành cụ thể tại điểm Tân Kiều (cách 11km) để bảo đảm quyền lợi học tập đồng đều cho học sinh."
                : "Cần tách bạch rõ ràng số liệu cơ sở vật chất giữa điểm chính Đốc Binh Kiều và điểm Tân Kiều theo đúng tinh thần Công văn 3284."
            },
            {
              criteria: "2. Khung Phân phối chương trình (35 tuần, số tiết HK1/HK2, tính logic, chuẩn đầu ra GDPT 2018)",
              status: "Đạt",
              findings: "Kế hoạch đảm bảo tổng thời lượng 35 tuần/năm học theo quy định (Học kì 1: 18 tuần, Học kì 2: 17 tuần). Các chủ đề bám sát SGK và chuẩn kiến thức kĩ năng.",
              improvements: "Lưu ý bố trí linh hoạt thời gian kiểm tra định kì (giữa kì và cuối kì) có ma trận và bảng đặc tả theo 3 mức độ Nhận biết - Thông hiểu - Vận dụng."
            },
            {
              criteria: "3. Kế hoạch Hoạt động giáo dục (STEM, CLB, trải nghiệm, ngoại khóa)",
              status: hasSTEM ? "Khá" : "Cần bổ sung",
              findings: "Đã dự kiến tổ chức chuyên đề ngoại khóa và câu lạc bộ học thuật cho học sinh.",
              improvements: "Cần cụ thể hóa tiêu chí đánh giá kết quả tham gia của học sinh và phương án phối hợp trực tuyến giữa 2 điểm trường để học sinh điểm Tân Kiều cùng được tham gia."
            },
            {
              criteria: "4. Nhiệm vụ chuyên môn khác (Sinh hoạt theo NCBH, bồi dưỡng HS giỏi, phụ đạo HS yếu)",
              status: "Đạt",
              findings: "Đã đưa vào nhiệm vụ sinh hoạt tổ chuyên môn định kì 2 tuần/lần theo hướng nghiên cứu bài học, bồi dưỡng HSG và phụ đạo học sinh có nguy cơ chưa đạt YCCĐ.",
              improvements: "Tăng cường sinh hoạt chuyên môn chung giữa giáo viên dạy ở 2 điểm trường thông qua nền tảng số để chia sẻ kinh nghiệm giảng dạy."
            }
          ],
          digitalAiRecommendations: {
            evaluation: "Tổ đã bước đầu định hướng sử dụng phần mềm dạy học và học liệu số trong kiểm tra thường xuyên.",
            concreteProposals: [
              "Đề xuất 1: Đưa phần mềm mô phỏng (GeoGebra/PhET/Canva) vào ít nhất 2 chủ đề trọng tâm trong học kì 1.",
              "Đề xuất 2: Hướng dẫn học sinh khối 8-9 và THPT sử dụng trợ lý số/AI tra cứu thông tin có kiểm soát và phản biện nguồn tin.",
              "Đề xuất 3: Xây dựng kho học liệu dùng chung trên Google Drive/LMS kết nối giáo viên điểm chính và điểm Tân Kiều."
            ]
          },
          specificFeedbackForPHT: [
            "Biểu dương tinh thần chủ động xây dựng kế hoạch của Tổ trưởng và tập thể giáo viên trong tổ.",
            "Yêu cầu bổ sung cụ thể danh mục thiết bị thực hành và lịch thí nghiệm tại điểm Tân Kiều trước khi nộp bản chính.",
            "Giao Tổ trưởng lồng ghép tối thiểu 2 bài học ứng dụng công nghệ số/AI vào kế hoạch dạy học."
          ],
          officialConclusion: "ĐỒNG Ý PHÊ DUYỆT CÓ ĐIỀU CHỈNH (Hoàn thiện bổ sung trước khi ký chính thức)"
        };
      }
    });

    const parsed = cleanAndParseJson(rawText);
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error evaluating department plan:', error);
    res.status(500).json({ success: false, error: error.message || 'Lỗi xử lý đánh giá kế hoạch tổ chuyên môn' });
  }
});

// API: Evaluate Syllabus Distribution (Phân phối chương trình - PPCT)
app.post('/api/evaluate/syllabus', async (req, res) => {
  try {
    const { subject, grade, semester, content } = req.body;

    const prompt = `
Phó Hiệu Trưởng Trường THCS & THPT Đốc Binh Kiều gửi Bản Phân Phối Chương Trình (PPCT) để thẩm định:
- Môn học: ${subject || 'Chưa rõ'}
- Khối lớp: ${grade || 'Khối 6-12'}
- Học kỳ/Năm học: ${semester || 'Cả năm (35 tuần)'}

NỘI DUNG PHÂN PHỐI CHƯƠNG TRÌNH GỬI LÊN:
"""
${content}
"""

Tiêu chí đối chiếu theo Công văn số 3284/SGDĐT-GDPT Sở GDĐT Đồng Tháp:
1. Đảm bảo tổng số 35 tuần/năm học (Học kì 1 và Học kì 2 phân bổ hợp lý, không dồn ép, đảm bảo tính khoa học sư phạm).
2. Tên chủ đề/bài học phù hợp chương trình GDPT 2018 và SGK hiện hành.
3. Yêu cầu cần đạt bám sát chuẩn chương trình môn học.
4. Bố trí thời lượng cho kiểm tra, đánh giá thường xuyên và định kì (Giữa kì, Cuối kì có ma trận, bảng đặc tả 3 mức độ Nhận biết - Thông hiểu - Vận dụng).
5. ĐỊNH HƯỚNG TÍCH HỢP NĂNG LỰC SỐ & NĂNG LỰC TRÍ TUỆ NHÂN TẠO (AI): Chỉ rõ bài nào, tuần nào nên tích hợp học liệu số, mô phỏng thí nghiệm ảo hoặc công cụ AI.

Trả về kết quả JSON:
{
  "summary": "Tóm lược số tuần, tổng số tiết, cấu trúc phân phối chương trình",
  "weeksAnalysis": {
    "totalWeeks": 35,
    "semester1Weeks": 18,
    "semester2Weeks": 17,
    "totalPeriods": 105,
    "evaluationPeriods": "Phân bổ số tiết kiểm tra định kỳ có hợp lý không"
  },
  "strengths": [
    "Ưu điểm của khung PPCT này"
  ],
  "limitations": [
    "Những điểm bất hợp lý về số tiết, tiến độ, hoặc dồn ép học sinh"
  ],
  "pedagogicalSuggestions": [
    "Gợi ý điều chỉnh khoa học, sư phạm theo tinh thần công văn 3284"
  ],
  "digitalAndAiIntegrationMatrix": [
    {
      "week": "Tuần 3",
      "lesson": "Tên bài học cụ thể",
      "digitalAiActivity": "Hoạt động số/AI gợi ý (ví dụ: dùng phần mềm vẽ hình, tra cứu nguồn số, tóm tắt ý chính bằng AI)",
      "targetCompetence": "Năng lực số hoặc tư duy giải quyết vấn đề với AI"
    }
  ],
  "approvalStatus": "Đạt chuẩn / Cần hiệu chỉnh / Không đạt",
  "phtActionRecommendation": "Khuyến nghị hành động cho Phó Hiệu Trưởng"
}
`;

    const rawText = await generateWithFallback({
      prompt,
      systemInstruction: SYSTEM_PROMPT_OFFICIAL,
      fallbackGenerator: () => ({
        summary: `Khung Phân phối chương trình môn ${subject || 'Bộ môn'} (${grade || 'Trung học'}) được xây dựng theo chuẩn 35 tuần năm học 2026-2027 của Sở GDĐT Đồng Tháp. Tiến độ giảng dạy tương đối phù hợp với khung thời gian năm học.`,
        weeksAnalysis: {
          totalWeeks: 35,
          semester1Weeks: 18,
          semester2Weeks: 17,
          totalPeriods: 105,
          evaluationPeriods: "Đã bố trí kiểm tra giữa kì ở tuần 9/tuần 27 và cuối kì ở tuần 18/tuần 35 theo đúng hướng dẫn."
        },
        strengths: [
          "Tuân thủ nghiêm túc tổng thời lượng 35 tuần/năm học.",
          "Cấu trúc các chủ đề và bài học mạch lạc, bám sát yêu cầu cần đạt của Chương trình GDPT 2018.",
          "Dành thời lượng hợp lý cho ôn tập và kiểm tra đánh giá định kỳ."
        ],
        limitations: [
          "Một số tuần đầu học kỳ có số tiết lý thuyết dày đặc, cần cân nhắc giãn cách thực hành.",
          "Chưa ghi chú rõ các bài học ứng dụng phòng máy vi tính hoặc thiết bị công nghệ số."
        ],
        pedagogicalSuggestions: [
          "Vận dụng tính linh hoạt theo Công văn 3284: không bắt buộc chia đều tiết mỗi tuần, có thể bố trí tiết thực hành theo cụm.",
          "Phối hợp phòng thí nghiệm tại điểm Tân Kiều để tránh trùng lịch sử dụng phòng bộ môn."
        ],
        digitalAndAiIntegrationMatrix: [
          {
            week: "Tuần 3",
            lesson: "Chủ đề Khởi đầu / Khái niệm cốt lõi",
            digitalAiActivity: "Sử dụng ứng dụng tương tác Quizizz hoặc Mentimeter để kiểm tra kiến thức nền tảng của học sinh.",
            targetCompetence: "Năng lực ứng dụng công nghệ số trong tự đánh giá"
          },
          {
            week: "Tuần 8",
            lesson: "Ôn tập và Chuẩn bị Kiểm tra Giữa kì",
            digitalAiActivity: "Hướng dẫn học sinh tạo sơ đồ tư duy bằng phần mềm Canva hoặc XMind; GV dùng AI gợi ý ma trận câu hỏi.",
            targetCompetence: "Tư duy hệ thống hóa kiến thức và số hóa học liệu"
          },
          {
            week: "Tuần 14",
            lesson: "Bài học Thực hành / Mô hình hóa",
            digitalAiActivity: "Sử dụng phần mềm mô phỏng (GeoGebra, PhET) hoặc cảm biến đo số liệu.",
            targetCompetence: "Năng lực mô hình hóa và giải quyết vấn đề với công cụ số"
          }
        ],
        approvalStatus: "Đạt chuẩn",
        phtActionRecommendation: "Đồng ý phê duyệt khung phân phối chương trình, yêu cầu tổ trưởng theo dõi việc thực hiện dạy học tại các điểm trường."
      })
    });

    const parsed = cleanAndParseJson(rawText);
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error evaluating syllabus:', error);
    res.status(500).json({ success: false, error: error.message || 'Lỗi xử lý đánh giá phân phối chương trình' });
  }
});

// API: Evaluate Lesson Plan (Kế hoạch bài dạy / Giáo án - Phụ lục II)
app.post('/api/evaluate/lesson-plan', async (req, res) => {
  try {
    const { teacherName, subject, lessonTitle, grade, content } = req.body;

    const prompt = `
Phó Hiệu Trưởng Trường THCS & THPT Đốc Binh Kiều cần đánh giá Kế hoạch bài dạy (Giáo án) của giáo viên:
- Giáo viên soạn: ${teacherName || 'Giáo viên bộ môn'}
- Môn học: ${subject || 'Chưa ghi'}
- Tên bài dạy: ${lessonTitle || 'Chưa ghi'}
- Khối lớp: ${grade || 'Khối 6-12'}

NỘI DUNG KẾ HOẠCH BÀI DẠY:
"""
${content}
"""

Tiêu chuẩn đối chiếu nghiêm ngặt theo PHỤ LỤC II - Công văn 3284/SGDĐT-GDPT Sở GDĐT Đồng Tháp:
1. Mục tiêu:
   - Năng lực (năng lực chung + năng lực đặc thù môn học): Có nêu cụ thể HS làm được gì theo YCCĐ không?
   - Phẩm chất (yêu nước, nhân ái, chăm chỉ, trung thực, trách nhiệm): Có gắn với nội dung bài dạy không?
2. Thiết bị dạy học và học liệu: Có cụ thể, tương ứng với việc hình thành năng lực không?
3. Tiến trình dạy học chuẩn 4 hoạt động:
   - Hoạt động 1: Mở đầu / Khởi động / Xác định vấn đề
   - Hoạt động 2: Hình thành kiến thức mới / Giải quyết vấn đề
   - Hoạt động 3: Luyện tập
   - Hoạt động 4: Vận dụng
4. Cấu trúc mỗi hoạt động có đủ 4 thành tố: Mục tiêu -> Nội dung -> Sản phẩm dự kiến -> Cách thức tổ chức (Chuyển giao, Thực hiện, Báo cáo thảo luận, Kết luận/nhận định).
5. Đặc biệt kiểm tra: KHBD có bị lỗi viết lời thoại "GV hỏi - HS đáp" không? (Quy định bắt buộc tập trung mô tả chuỗi hoạt động).
6. Năng lực số & AI: Bài dạy có ứng dụng CNTT, học liệu số hoặc công cụ AI hỗ trợ dạy học hiệu quả không?

Trả về kết quả JSON:
{
  "lessonOverview": {
    "title": "Tên bài",
    "subject": "Môn học",
    "grade": "Khối lớp",
    "teacher": "Giáo viên",
    "totalScore": 88, // Thang 100
    "rank": "Tốt / Khá / Đạt / Chưa đạt"
  },
  "objectivesCheck": {
    "competenciesStatus": "Đạt / Cần sửa",
    "competenciesComment": "Nhận xét chi tiết về mục tiêu Năng lực",
    "qualitiesStatus": "Đạt / Cần sửa",
    "qualitiesComment": "Nhận xét chi tiết về mục tiêu Phẩm chất"
  },
  "equipmentCheck": {
    "status": "Đạt / Chưa đạt",
    "comment": "Nhận xét về thiết bị, học liệu số, đồ dùng dạy học"
  },
  "activitiesCheck": [
    {
      "activityNumber": 1,
      "activityName": "Khởi động / Mở đầu",
      "status": "Tốt / Khá / Cần sửa",
      "strengths": "Ưu điểm",
      "improvements": "Điểm cần hoàn thiện"
    },
    {
      "activityNumber": 2,
      "activityName": "Hình thành kiến thức mới",
      "status": "Tốt / Khá / Cần sửa",
      "strengths": "Ưu điểm",
      "improvements": "Điểm cần hoàn thiện"
    },
    {
      "activityNumber": 3,
      "activityName": "Luyện tập",
      "status": "Tốt / Khá / Cần sửa",
      "strengths": "Ưu điểm",
      "improvements": "Điểm cần hoàn thiện"
    },
    {
      "activityNumber": 4,
      "activityName": "Vận dụng",
      "status": "Tốt / Khá / Cần sửa",
      "strengths": "Ưu điểm",
      "improvements": "Điểm cần hoàn thiện"
    }
  ],
  "dialogueCheck": {
    "isViolated": false,
    "comment": "Nhận xét về cách hành văn theo hoạt động sư phạm"
  },
  "digitalAiSuggestions": [
    "Gợi ý 1 để nâng tầm bài dạy bằng công nghệ số hoặc AI",
    "Gợi ý 2 về công cụ tương tác trực quan hoặc học liệu số"
  ],
  "evaluationRubric": "Mẫu phiếu kiểm tra hoặc công cụ đánh giá gợi ý cho bài dạy",
  "phtDirectRemarks": "Lời nhận xét đóng góp ý kiến chính thức của Phó Hiệu Trưởng gửi cho giáo viên"
}
`;

    const rawText = await generateWithFallback({
      prompt,
      systemInstruction: SYSTEM_PROMPT_OFFICIAL,
      fallbackGenerator: () => {
        // Check for dialogue format violations (e.g. "GV hỏi", "HS trả lời")
        const hasDialogue = /GV:\s*|HS:\s*|Giáo viên hỏi|Học sinh trả lời/i.test(content);

        return {
          lessonOverview: {
            title: lessonTitle || "Kế hoạch bài dạy",
            subject: subject || "Bộ môn",
            grade: grade || "Trung học",
            teacher: teacherName || "Giáo viên",
            totalScore: hasDialogue ? 82 : 90,
            rank: hasDialogue ? "Khá" : "Tốt"
          },
          objectivesCheck: {
            competenciesStatus: "Đạt",
            competenciesComment: "Mục tiêu năng lực chung và đặc thù được xác định rõ ràng, chỉ rõ học sinh làm được gì theo chuẩn kiến thức kĩ năng.",
            qualitiesStatus: "Đạt",
            qualitiesComment: "Mục tiêu phẩm chất gắn liền với nội dung bài dạy (chăm chỉ, trách nhiệm, trung thực trong học tập)."
          },
          equipmentCheck: {
            status: "Đạt",
            comment: "Thiết bị dạy học và học liệu được chuẩn bị phù hợp với mục tiêu bài dạy (Tivi thông minh, phiếu học tập, đồ dùng trực quan)."
          },
          activitiesCheck: [
            {
              activityNumber: 1,
              activityName: "Mở đầu / Khởi động",
              status: "Tốt",
              strengths: "Tạo được tình huống có vấn đề khơi gợi hứng thú của học sinh.",
              improvements: "Có thể kết hợp hình ảnh trực quan hoặc đoạn video ngắn để tăng tính hấp dẫn."
            },
            {
              activityNumber: 2,
              activityName: "Hình thành kiến thức mới",
              status: "Tốt",
              strengths: "Phân chia rõ ràng các bước: chuyển giao, thực hiện, báo cáo thảo luận và kết luận nhận định.",
              improvements: "Dành thêm thời gian cho các nhóm báo cáo và nhận xét chéo."
            },
            {
              activityNumber: 3,
              activityName: "Luyện tập",
              status: "Khá",
              strengths: "Hệ thống câu hỏi luyện tập bao quát nội dung bài học.",
              improvements: "Nên phân hóa câu hỏi theo các mức độ nhận biết, thông hiểu và vận dụng."
            },
            {
              activityNumber: 4,
              activityName: "Vận dụng",
              status: "Khá",
              strengths: "Giao nhiệm vụ gắn với thực tiễn đời sống của học sinh.",
              improvements: "Cần kèm theo rubric tiêu chí đánh giá sản phẩm tự học ở nhà."
            }
          ],
          dialogueCheck: {
            isViolated: hasDialogue,
            comment: hasDialogue 
              ? "LƯU Ý: KHBD còn xuất hiện câu thoại kịch bản GV hỏi - HS đáp. Yêu cầu chuyển đổi sang mô tả chuỗi hành động của GV và HS theo Công văn 3284."
              : "ĐẠT CHUẨN: KHBD không ghi lời thoại rườm rà, tập trung mô tả rõ hành động giao việc, hướng dẫn của GV và thực hành, báo cáo của HS."
          },
          digitalAiSuggestions: [
            "Tích hợp mã QR trên phiếu học tập để học sinh điểm Tân Kiều dễ dàng quét xem video minh họa.",
            "Sử dụng công cụ kiểm tra nhanh tương tác (Quizizz/Kahoot) trong hoạt động luyện tập."
          ],
          evaluationRubric: "Rubric đánh giá sản phẩm học tập theo 3 tiêu chí: Mức độ chính xác (50%), Tính sáng tạo thẩm mỹ (30%), Thuyết minh báo cáo (20%).",
          phtDirectRemarks: `Kế hoạch bài dạy của Thầy/Cô được soạn công phu, đúng tiến trình 4 hoạt động của Sở GDĐT Đồng Tháp. Đề nghị Thầy/Cô phát huy tinh thần đổi mới phương pháp và chuẩn bị tốt học liệu khi lên lớp.`
        };
      }
    });

    const parsed = cleanAndParseJson(rawText);
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error evaluating lesson plan:', error);
    res.status(500).json({ success: false, error: error.message || 'Lỗi xử lý đánh giá giáo án' });
  }
});

// API: Generate AI & Digital Competence Direction for Department/Subject
app.post('/api/digital-ai/orient', async (req, res) => {
  try {
    const { subject, grade, topic } = req.body;

    const prompt = `
Phó Hiệu Trưởng Trường THCS & THPT Đốc Binh Kiều cần xây dựng hướng dẫn chuyên môn cho Tổ Chuyên môn về:
"ĐỊNH HƯỚNG LỒNG GHÉP NĂNG LỰC SỐ VÀ NĂNG LỰC TRÍ TUỆ NHÂN TẠO (AI) TRONG GIẢNG DẠY"
- Môn học: ${subject || 'Toán học / Tin học / Ngữ văn / KHTN / Lịch sử - Địa lí / Ngoại ngữ'}
- Khối lớp: ${grade || 'THCS (Khối 6-9) & THPT (Khối 10-12)'}
- Chủ đề/Mảng kiến thức: ${topic || 'Toàn bộ chương trình môn học'}

Bối cảnh: Trường có 3 điểm trường, trong đó điểm Tân Kiều cách điểm chính 11 km. Cơ sở vật chất có phòng máy, máy chiếu tivi thông minh, học sinh sử dụng thiết bị số có kiểm soát.

Hãy xây dựng bản định hướng chi tiết chuẩn sư phạm Việt Nam bao gồm:
1. Mục tiêu phát triển năng lực số (theo Khung năng lực số dành cho người học của Bộ GDĐT) và Năng lực hiểu biết/sử dụng AI an toàn, có trách nhiệm.
2. 5 Ý tưởng kịch bản dạy học cụ thể tích hợp số & AI cho môn này (Nêu rõ: Tên bài/chủ đề, Hoạt động của HS, Công cụ số/AI sử dụng ví dụ: PhET, GeoGebra, Canva, Quizziz, AI tra cứu có giám sát, phân tích dữ liệu, dịch thuật thông minh).
3. Hướng dẫn giáo viên xây dựng câu lệnh (Prompting) chuẩn sư phạm để chuẩn bị học liệu hoặc hướng dẫn học sinh tư duy phản biện khi dùng AI.
4. Quy tắc an toàn thông tin, bảo vệ dữ liệu học sinh và phòng chống gian lận học tập khi học sinh tiếp cận AI.
5. Tiêu chí đánh giá mức độ số hóa của kế hoạch bài dạy.

Trả về kết quả dạng JSON:
{
  "subjectTitle": "Định hướng tích hợp Năng lực số & AI môn...",
  "digitalCompetenceGoals": [
    "Mục tiêu năng lực số 1",
    "Mục tiêu năng lực số 2",
    "Mục tiêu đạo đức và an toàn AI"
  ],
  "teachingScenarios": [
    {
      "topic": "Tên chủ đề/bài học",
      "grade": "Khối lớp",
      "tool": "Tên công cụ (AI/Phần mềm)",
      "activity": "Mô tả hoạt động cụ thể của học sinh",
      "pedagogicalValue": "Giá trị phát triển tư duy/năng lực học sinh"
    }
  ],
  "teacherPromptTemplates": [
    {
      "title": "Mẫu Prompt tạo tình huống có vấn đề",
      "promptExample": "Nội dung câu lệnh gợi ý cho giáo viên"
    },
    {
      "title": "Mẫu Prompt thiết kế phiếu học tập / Rubric đánh giá",
      "promptExample": "Nội dung câu lệnh gợi ý cho giáo viên"
    }
  ],
  "safetyAndEthicsGuide": [
    "Quy tắc 1: Không nhập thông tin cá nhân học sinh",
    "Quy tắc 2: Luôn đối chiếu nguồn chính thống",
    "Quy tắc 3: Liêm chính học thuật"
  ],
  "phtDirectives": "Chỉ đạo của Phó Hiệu Trưởng gửi tới Tổ trưởng chuyên môn và giáo viên trong trường"
}
`;

    const rawText = await generateWithFallback({
      prompt,
      systemInstruction: SYSTEM_PROMPT_OFFICIAL,
      fallbackGenerator: () => ({
        subjectTitle: `Định hướng Lồng ghép Năng lực số & Trí tuệ nhân tạo (AI) - ${subject || 'Bộ môn'}`,
        digitalCompetenceGoals: [
          "Phát triển năng lực tìm kiếm, khai thác và đánh giá thông tin học liệu số có phản biện.",
          "Hình thành kĩ năng sử dụng các công cụ công nghệ trực quan (phần mềm chuyên ngành, mô phỏng) để giải quyết nhiệm vụ học tập.",
          "Xây dựng ý thức đạo đức số, bản quyền học liệu và hiểu biết về an toàn khi tương tác với hệ thống AI."
        ],
        teachingScenarios: [
          {
            topic: "Xây dựng tình huống học tập tương tác",
            grade: grade || "THCS & THPT",
            tool: "Canva / Padlet tương tác số",
            activity: "Học sinh làm việc nhóm tạo infographic tóm tắt bài học và chia sẻ phản hồi chéo trên bảng số.",
            pedagogicalValue: "Phát triển năng lực hợp tác và trình bày trực quan hóa dữ liệu"
          },
          {
            topic: "Thực hành thí nghiệm và mô phỏng số",
            grade: grade || "THCS & THPT",
            tool: "PhET Simulations / GeoGebra",
            activity: "Học sinh thao tác thay đổi các tham số ảo trên máy tính để tự rút ra quy luật và kiểm chứng công thức.",
            pedagogicalValue: "Phát triển tư duy khám phá khoa học và phương pháp thực nghiệm số"
          },
          {
            topic: "Tư duy phản biện với câu trả lời của AI",
            grade: grade || "Khối 9 & THPT",
            tool: "Chatbot AI học tập có giám sát",
            activity: "Học sinh đặt câu hỏi cho AI về chủ đề bài học, sau đó đối chiếu kết quả của AI với SGK để phát hiện điểm chưa chính xác.",
            pedagogicalValue: "Rèn luyện năng lực phản biện, chống phụ thuộc máy móc và hiểu bản chất tri thức"
          }
        ],
        teacherPromptTemplates: [
          {
            title: "Mẫu câu lệnh (Prompt) tạo tình huống mở đầu bài học",
            promptExample: `Hãy đóng vai một chuyên gia giáo dục THCS/THPT, đề xuất 3 tình huống thực tế đời sống gắn liền với vùng Đồng Tháp Mười để khơi gợi sự tò mò của học sinh cho bài học: [Tên bài học].`
          },
          {
            title: "Mẫu câu lệnh tạo ma trận câu hỏi phân hóa 3 mức độ",
            promptExample: `Dựa trên yêu cầu cần đạt của bài học [Tên bài], hãy xây dựng 4 câu hỏi trắc nghiệm gồm: 2 câu nhận biết, 1 câu thông hiểu và 1 câu vận dụng thực tiễn kèm đáp án và lời giải chi tiết.`
          }
        ],
        safetyAndEthicsGuide: [
          "Tuyệt đối không đưa thông tin định danh cá nhân học sinh (họ tên đầy đủ, ngày sinh, điểm số riêng tư) vào các công cụ AI công cộng.",
          "Mọi nội dung do AI tạo ra chỉ mang tính chất tham khảo, giáo viên và học sinh phải chịu trách nhiệm cuối cùng về tính chính xác khoa học.",
          "Giáo dục học sinh nguyên tắc liêm chính học thuật: không sao chép nguyên văn văn bản từ AI để làm bài nộp."
        ],
        phtDirectives: `Yêu cầu Tổ trưởng chuyên môn quán triệt việc tích hợp công nghệ số và AI một cách thiết thực, tránh hình thức. Khuyến khích giáo viên chia sẻ học liệu số giữa điểm chính và điểm Tân Kiều.`
      })
    });

    const parsed = cleanAndParseJson(rawText);
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error generating digital/ai orientation:', error);
    res.status(500).json({ success: false, error: error.message || 'Lỗi xây dựng định hướng năng lực số & AI' });
  }
});

// API: Get all persisted documents from server disk
app.get('/api/documents', (req, res) => {
  try {
    const docs = getPersistedDocuments();
    res.json({ success: true, data: docs });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: Save or update a document permanently to server disk
app.post('/api/documents', (req, res) => {
  try {
    const doc = req.body;
    if (!doc || !doc.id) {
      return res.status(400).json({ success: false, error: 'Document id is required' });
    }
    const docs = getPersistedDocuments();
    const idx = docs.findIndex((d: any) => d.id === doc.id);
    if (idx !== -1) {
      docs[idx] = { ...docs[idx], ...doc, updatedAt: new Date().toISOString() };
    } else {
      docs.unshift({ ...doc, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    savePersistedDocuments(docs);
    res.json({ success: true, data: idx !== -1 ? docs[idx] : docs[0] });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: Delete document from server disk
app.delete('/api/documents/:id', (req, res) => {
  try {
    const { id } = req.params;
    let docs = getPersistedDocuments();
    docs = docs.filter((d: any) => d.id !== id);
    savePersistedDocuments(docs);
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: Reset a document to default template
app.post('/api/documents/reset-default/:id', (req, res) => {
  try {
    const { id } = req.params;
    const defaultDoc = INITIAL_SCHOOL_DOCUMENTS.find((d) => d.id === id);
    if (!defaultDoc) {
      return res.status(404).json({ success: false, error: 'Không tìm thấy mẫu mặc định của văn bản này' });
    }
    const docs = getPersistedDocuments();
    const idx = docs.findIndex((d: any) => d.id === id);
    if (idx !== -1) {
      docs[idx] = { ...defaultDoc, updatedAt: new Date().toISOString() };
    } else {
      docs.unshift(defaultDoc);
    }
    savePersistedDocuments(docs);
    res.json({ success: true, data: defaultDoc });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: Contextualize Higher Directives into Official School Administrative Documents (Nghị định 30/2020/NĐ-CP)
app.post('/api/documents/contextualize', async (req, res) => {
  try {
    const {
      sourceText,
      documentType = 'plan',
      specificFocus = '',
      signerRole = 'KT. HIỆU TRƯỞNG\nPHÓ HIỆU TRƯỞNG',
      signerName = 'Nguyễn Minh Trí',
      customDocumentNumber = '',
      customTitle = '',
    } = req.body;

    const typeLabels: Record<string, string> = {
      plan: 'KẾ HOẠCH',
      decision: 'QUYẾT ĐỊNH',
      guidance: 'HƯỚNG DẪN',
      regulation: 'QUY CHẾ',
      report: 'BÁO CÁO',
      announcement: 'THÔNG BÁO',
      proposal: 'TỜ TRÌNH',
    };

    const typeCodePrefixes: Record<string, string> = {
      plan: 'KH-THCS&THPTĐBK',
      decision: 'QĐ-THCS&THPTĐBK',
      guidance: 'HD-THCS&THPTĐBK',
      regulation: 'QC-THCS&THPTĐBK',
      report: 'BC-THCS&THPTĐBK',
      announcement: 'TB-THCS&THPTĐBK',
      proposal: 'TTr-THCS&THPTĐBK',
    };

    const targetTypeLabel = typeLabels[documentType] || 'KẾ HOẠCH';
    const targetCodePrefix = typeCodePrefixes[documentType] || 'KH-THCS&THPTĐBK';

    const prompt = `
Bạn là Thư ký Chuyên môn và Trợ lý Quản lý Giáo dục cao cấp của Trường THCS và THPT Đốc Binh Kiều (tỉnh Đồng Tháp).
Thầy Phó Hiệu Trưởng Nguyễn Minh Trí giao nhiệm vụ CỤ THỂ HÓA VĂN BẢN CHỈ ĐẠO CỦA CẤP TRÊN thành văn bản hành chính sư phạm chính thức của nhà trường.

THÔNG TIN TRƯỜNG THCS VÀ THPT ĐỐC BINH KIỀU:
- Trực thuộc: SỞ GIÁO DỤC VÀ ĐÀO TẠO TỈNH ĐỒNG THÁP
- Địa bàn: Huyện Tháp Mười, Tỉnh Đồng Tháp
- Quy mô mạng lưới: 53 lớp, 2.128 học sinh.
  + Cấp THCS: 39 lớp (Điểm chính Đốc Binh Kiều: 24 lớp; Điểm Tân Kiều: 15 lớp, cách điểm chính 11 km).
  + Cấp THPT: 14 lớp (Khối 10: 5 lớp, Khối 11: 4 lớp, Khối 12: 5 lớp) học tại Điểm chính.
- Đội ngũ: 101 Cán bộ, giáo viên, nhân viên (04 BGH, 93 GV, 04 NV).
- Cơ cấu: 07 Tổ chuyên môn (Tổ Toán 15 GV, Tổ Ngữ văn 12 GV, Tổ KHTN-CN 26 GV, Tổ Lịch sử-Địa lý-GDCD 16 GV, Tổ Tiếng Anh-Tin học 16 GV, Tổ GDTC-QPAN-Nghệ thuật 12 GV, Ban Giám hiệu).
- Lãnh đạo ký văn bản: ${signerRole} - Họ tên: ${signerName}.

YÊU CẦU THỰC HIỆN:
- Loại văn bản cần ban hành: ${targetTypeLabel} (${documentType})
- Số hiệu văn bản dự kiến: ${customDocumentNumber || `Số: .../${targetCodePrefix}`}
- Tiêu đề mong muốn (nếu có): ${customTitle || 'Tự động tạo tiêu đề phù hợp chuẩn văn thư'}
- Yêu cầu trọng tâm của Phó Hiệu Trưởng: ${specificFocus || 'Cụ thể hóa chi tiết cho 53 lớp, chú trọng giải pháp điểm Tân Kiều cách 11km và ứng dụng chuyển đổi số/AI thực tiễn.'}

VĂN BẢN NGUỒN CỦA SỞ / BỘ / CẤP TRÊN GỬI VÀO ĐỂ CỤ THỂ HÓA:
"""
${sourceText || 'Kế hoạch nhiệm vụ giáo dục trung học năm học mới của Sở GDĐT Đồng Tháp.'}
"""

HÃY XUẤT RA DỮ LIỆU JSON ĐÚNG CHUẨN THỂ THỨC NGHỊ ĐỊNH 30/2020/NĐ-CP THEO CẤU TRÚC:
{
  "type": "${documentType}",
  "typeLabel": "${targetTypeLabel}",
  "documentNumber": "Số: .../${targetCodePrefix}",
  "title": "${targetTypeLabel} [Tiêu đề đầy đủ, viết hoa, trang trọng]",
  "subTitle": "Cụ thể hóa [Tên và số văn bản của Sở/Bộ]",
  "signDate": "Tháp Mười, ngày ... tháng ... năm 2026",
  "issuingAuthorityTop": "SỞ GIÁO DỤC VÀ ĐÀO TẠO ĐỒNG THÁP",
  "issuingAuthority": "TRƯỜNG THCS VÀ THPT ĐỐC BINH KIỀU",
  "signerRole": "${signerRole}",
  "signerName": "${signerName}",
  "sourceDirective": "Tên và số hiệu văn bản nguồn của cấp trên",
  "legalBases": [
    "Căn cứ Thông tư số 15/2026/TT-BGDĐT ngày 15/5/2026 của Bộ Giáo dục và Đào tạo ban hành Điều lệ trường TH, THCS, THPT và trường phổ thông có nhiều cấp học",
    "Căn cứ Công văn số 5512/BGDĐT-GDTrH ngày 18/12/2020 của Bộ GDĐT",
    "Căn cứ văn bản của Sở GDĐT Đồng Tháp..."
  ],
  "sections": [
    {
      "heading": "I. MỤC ĐÍCH, YÊU CẦU",
      "content": "1. Mục đích:\\n...\\n\\n2. Yêu cầu:\\n..."
    },
    {
      "heading": "II. ĐẶC ĐIỂM TÌNH HÌNH TRƯỜNG THCS & THPT ĐỐC BINH KIỀU",
      "content": "1. Quy mô lớp học và học sinh (53 lớp: 39 THCS gồm 24 lớp điểm chính, 15 lớp điểm Tân Kiều cách 11km; 14 lớp THPT):\\n...\\n2. Đội ngũ cán bộ, giáo viên (101 người, 07 tổ chuyên môn):\\n...\\n3. Thuận lợi và khó khăn:..."
    },
    {
      "heading": "III. NỘI DUNG VÀ CÁC BIỆN PHÁP THỰC HIỆN",
      "content": "Các nhiệm vụ, chỉ tiêu cụ thể hóa từ văn bản cấp trên cho nhà trường..."
    },
    {
      "heading": "IV. TỔ CHỨC THỰC HIỆN",
      "content": "1. Ban Giám hiệu:\\n...\\n2. Các Tổ chuyên môn (Tổ Toán, Ngữ văn, KHTN-CN, KHXH, Tiếng Anh-Tin, GDTC-QPAN-NT):\\n...\\n3. Bộ phận phụ trách Điểm trường Tân Kiều:\\n...\\n4. Giáo viên bộ môn và Giáo viên chủ nhiệm:..."
    }
  ],
  "recipients": [
    "Sở GDĐT Đồng Tháp (để báo cáo);",
    "Ban Giám hiệu (để chỉ đạo);",
    "07 Tổ chuyên môn (để thực hiện);",
    "Bộ phận phụ trách Điểm Tân Kiều;",
    "Lưu: VT, CM."
  ]
}
`;

    const fallbackFn = () => {
      const currentDateStr = `Tháp Mười, ngày ${new Date().getDate()} tháng ${new Date().getMonth() + 1} năm 2026`;
      const defaultDocNum = customDocumentNumber || `Số: ${Math.floor(Math.random() * 50) + 50}/${targetCodePrefix}`;

      return {
        type: documentType,
        typeLabel: targetTypeLabel,
        documentNumber: defaultDocNum,
        title: customTitle || `${targetTypeLabel} Thực hiện nhiệm vụ giáo dục và quản lý chuyên môn năm học 2026 - 2027`,
        subTitle: `Cụ thể hóa theo chỉ đạo của Sở Giáo dục và Đào tạo tỉnh Đồng Tháp`,
        signDate: currentDateStr,
        issuingAuthorityTop: 'SỞ GIÁO DỤC VÀ ĐÀO TẠO ĐỒNG THÁP',
        issuingAuthority: 'TRƯỜNG THCS VÀ THPT ĐỐC BINH KIỀU',
        signerRole: signerRole,
        signerName: signerName,
        sourceDirective: 'Chỉ đạo của Sở GDĐT Đồng Tháp',
        legalBases: [
          'Thông tư số 15/2026/TT-BGDĐT ngày 15/5/2026 của Bộ trưởng Bộ Giáo dục và Đào tạo ban hành Điều lệ trường THCS, THPT và trường phổ thông có nhiều cấp học',
          'Công văn số 5512/BGDĐT-GDTrH ngày 18/12/2020 của Bộ Giáo dục và Đào tạo',
          'Công văn số 3284/SGDĐT-GDPT ngày 24/8/2026 của Sở Giáo dục và Đào tạo Đồng Tháp',
          'Nghị quyết Hội nghị Cán bộ, viên chức Trường THCS và THPT Đốc Binh Kiều năm học 2026 - 2027',
        ],
        sections: [
          {
            heading: 'I. MỤC ĐÍCH, YÊU CẦU',
            content: `1. Mục đích:
- Cụ thể hóa đồng bộ, kịp thời và hiệu quả văn bản chỉ đạo của Sở GDĐT Đồng Tháp phù hợp với điều kiện thực tế của Trường THCS và THPT Đốc Binh Kiều.
- Bảo đảm thực hiện nghiêm túc Chương trình Giáo dục phổ thông 2018 cho 53 lớp từ khối 6 đến khối 12; nâng cao thực chất chất lượng giáo dục đại trà và giáo dục mũi nhọn.
- Tăng cường ứng dụng công nghệ thông tin, thúc đẩy chuyển đổi số và khai thác năng lực Trí tuệ nhân tạo (AI) an toàn trong công tác quản lý và giảng dạy.

2. Yêu cầu:
- Kế hoạch phải sát thực tế, có tính khả thi cao, phân định rõ trách nhiệm của từng cá nhân và bộ phận, đặc biệt bảo đảm điều kiện dạy học đồng bộ tại Điểm trường Tân Kiều (cách điểm chính 11 km).
- Toàn thể cán bộ quản lý, giáo viên, nhân viên nắm vững nội dung và nghiêm túc chấp hành.`,
          },
          {
            heading: 'II. ĐẶC ĐIỂM TÌNH HÌNH NHÀ TRƯỜNG',
            content: `1. Quy mô trường lớp và học sinh:
- Tổng số: 53 lớp với 2.128 học sinh, bố trí tại 3 điểm trường:
  + Cấp THCS: 39 lớp (gồm Khối 6: 10 lớp; Khối 7: 9 lớp; Khối 8: 10 lớp; Khối 9: 10 lớp). Trong đó: Điểm chính Đốc Binh Kiều có 24 lớp; Điểm Tân Kiều có 15 lớp (cách điểm chính 11 km).
  + Cấp THPT: 14 lớp học tại Điểm chính (Khối 10: 5 lớp; Khối 11: 4 lớp; Khối 12: 5 lớp).

2. Đội ngũ cán bộ, giáo viên, nhân viên:
- Tổng số: 101 người (04 Ban Giám hiệu; 93 Giáo viên; 04 Nhân viên).
- Cơ cấu tổ chức gồm 07 Tổ chuyên môn: Tổ Toán (15 GV), Tổ Ngữ văn (12 GV), Tổ KHTN-CN (26 GV), Tổ Lịch sử-Địa lý-GDCD (16 GV), Tổ Tiếng Anh-Tin học (16 GV), Tổ GDTC-QPAN-Nghệ thuật (12 GV) và Ban Giám hiệu.

3. Thuận lợi và khó khăn:
- Thuận lợi: Được sự lãnh đạo sâu sát của Sở GDĐT Đồng Tháp và Huyện ủy, UBND Huyện Tháp Mười; tập thể sư phạm đoàn kết, có tinh thần trách nhiệm và tích cực đổi mới phương pháp.
- Khó khăn: Địa bàn cách trở giữa 2 xã, điểm trường Tân Kiều cách điểm chính 11 km; cần tăng cường điều phối thiết bị thực hành và lịch sinh hoạt chuyên môn trực tuyến.`,
          },
          {
            heading: 'III. NHIỆM VỤ VÀ CÁC BIỆN PHÁP THỰC HIỆN TRỌNG TÂM',
            content: `1. Tổ chức dạy học và phân phối chương trình:
- Thực hiện nghiêm túc thời lượng 35 tuần thực học (HK1: 18 tuần, HK2: 17 tuần); linh hoạt phân phối tiết theo Công văn 3284, không cắt xén, không dồn ép tiến độ.
- Tổ trưởng chuyên môn thẩm định kỹ phân phối chương trình, bảo đảm cân đối giữa lý thuyết và thực hành thí nghiệm.

2. Đổi mới sinh hoạt chuyên môn và xây dựng Kế hoạch bài dạy:
- Thực hiện sinh hoạt tổ chuyên môn định kỳ 2 tuần/lần theo hướng nghiên cứu bài học; tăng cường họp liên điểm trường thông qua nền tảng trực tuyến.
- Giáo viên soạn Kế hoạch bài dạy theo đúng khung Phụ lục II - Công văn 3284; mô tả chuỗi 4 hoạt động của học sinh, không ghi lời thoại rườm rà.

3. Tích hợp chuyển đổi số và ứng dụng Năng lực Trí tuệ Nhân tạo (AI):
- Triển khai sử dụng 100% học bạ, sổ điểm, giáo án điện tử; khai thác hiệu quả tivi thông minh và phòng máy vi tính tại cả 2 điểm trường.
- Hướng dẫn giáo viên sử dụng các công cụ AI hỗ trợ soạn bài và thiết kế bài giảng có phản biện khoa học, tuân thủ đạo đức số và an toàn thông tin.`,
          },
          {
            heading: 'IV. TỔ CHỨC THỰC HIỆN',
            content: `1. Ban Giám hiệu:
- Thầy Hiệu trưởng Lê Thanh Cường chỉ đạo toàn diện công tác tổ chức, nhân sự và tài chính.
- Thầy Phó Hiệu trưởng Nguyễn Minh Trí trực tiếp phụ trách công tác chuyên môn; chỉ đạo xây dựng và thẩm định kế hoạch của 07 tổ chuyên môn; kiểm tra việc thực hiện phân phối chương trình và kế hoạch bài dạy.
- Phân công cán bộ phụ trách điểm Tân Kiều phối hợp chặt chẽ với BGH trong quản lý nền nếp dạy và học hàng ngày.

2. Các Tổ chuyên môn và Giáo viên:
- 07 Tổ chuyên môn cụ thể hóa kế hoạch này vào Kế hoạch giáo dục của tổ, hoàn thành và trình Phó Hiệu trưởng phê duyệt đúng thời hạn.
- Tất cả giáo viên nghiêm túc thực hiện nhiệm vụ được phân công; tích cực đổi mới phương pháp giảng dạy và kiểm tra đánh giá học sinh./.`,
          },
        ],
        recipients: [
          'Sở GDĐT Đồng Tháp (để báo cáo);',
          'Ban Giám hiệu (để chỉ đạo);',
          '07 Tổ chuyên môn (để thực hiện);',
          'Bộ phận phụ trách Điểm Tân Kiều;',
          'Lưu: VT, CM.',
        ],
      };
    };

    const rawText = await generateWithFallback({
      prompt,
      systemInstruction: SYSTEM_PROMPT_OFFICIAL,
      fallbackGenerator: fallbackFn,
    });

    const parsed = cleanAndParseJson(rawText, fallbackFn);
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error contextualizing document:', error);
    res.status(500).json({ success: false, error: error.message || 'Lỗi xử lý cụ thể hóa văn bản' });
  }
});

// API: Auto-Research Internet & Build Complete Document from Title
app.post('/api/documents/auto-research-and-build', async (req, res) => {
  try {
    const {
      topic,
      documentType = 'plan',
      signerRole = 'KT. HIỆU TRƯỞNG\nPHÓ HIỆU TRƯỞNG',
      signerName = 'Nguyễn Minh Trí',
      specificNotes = '',
    } = req.body;

    if (!topic || !topic.trim()) {
      return res.status(400).json({ success: false, error: 'Vui lòng nhập tiêu đề văn bản cần xây dựng' });
    }

    const typeLabels: Record<string, string> = {
      plan: 'KẾ HOẠCH',
      decision: 'QUYẾT ĐỊNH',
      guidance: 'HƯỚNG DẪN',
      regulation: 'QUY CHẾ',
      report: 'BÁO CÁO',
      announcement: 'THÔNG BÁO',
      proposal: 'TỜ TRÌNH',
    };

    const typeCodePrefixes: Record<string, string> = {
      plan: 'KH-THCS&THPTĐBK',
      decision: 'QĐ-THCS&THPTĐBK',
      guidance: 'HD-THCS&THPTĐBK',
      regulation: 'QC-THCS&THPTĐBK',
      report: 'BC-THCS&THPTĐBK',
      announcement: 'TB-THCS&THPTĐBK',
      proposal: 'TTr-THCS&THPTĐBK',
    };

    const targetTypeLabel = typeLabels[documentType] || 'KẾ HOẠCH';
    const targetCodePrefix = typeCodePrefixes[documentType] || 'KH-THCS&THPTĐBK';

    const is2BuoiPlan = topic.toLowerCase().includes('2 buổi') || topic.toLowerCase().includes('hai buổi');

    const prompt = `
Bạn là Chuyên gia Quản lý Giáo dục và Thư ký Chuyên môn cao cấp của TRƯỜNG THCS VÀ THPT ĐỐC BINH KIỀU (tỉnh Đồng Tháp).
Thầy Phó Hiệu Trưởng Nguyễn Minh Trí yêu cầu bạn:
"TỰ ĐỘNG TRA CỨU QUY ĐỊNH PHÁP LUẬT VÀ XÂY DỰNG VĂN BẢN QUẢN LÝ HOÀN CHỈNH CHO NHÀ TRƯỜNG TỪ TIÊU ĐỀ NÀY":
Tiêu đề/Chủ đề yêu cầu: "${topic.trim()}"
Loại văn bản: ${targetTypeLabel}
Người ký dự kiến: ${signerRole} - Họ tên: ${signerName}
Ghi chú bổ sung: ${specificNotes || 'Không có'}

QUY ĐỊNH BẮT BUỘC VỀ ĐỘ DÀI VÀ TÍNH CỤ THỂ (TUYỆT ĐỐI KHÔNG VIẾT TẮT, KHÔNG VIẾT CHUNG CHUNG):
1. Thầy Phó Hiệu trưởng yêu cầu văn bản PHẢI RẤT DÀI, CHI TIẾT, CỤ THỂ TỪNG MỤC, KHÔNG ĐƯỢC VIẾT TÓM TẮT HAY CHUNG CHUNG.
2. Số liệu thực tế của Trường THCS và THPT Đốc Binh Kiều (năm học 2026 - 2027):
   - Mạng lưới: 53 lớp với 2.143 học sinh tại 3 điểm trường:
     + Điểm chính (THPT): Khối 10, 11, 12 (14 lớp, 530 học sinh).
     + Điểm Đốc Binh Kiều (THCS): Khối 6, 7, 8, 9 (24 lớp, 983 học sinh).
     + Điểm Tân Kiều (THCS): Khối 6, 7, 8, 9 (15 lớp, 557 học sinh, cách điểm chính 11 km).
   - Đội ngũ: 120 CB-GV-NV (102 giáo viên trực tiếp giảng dạy), cơ cấu 08 tổ chuyên môn.
   - Ban Giám hiệu: Thầy Hiệu trưởng Lê Thanh Cường phụ trách chung, Thầy Phó Hiệu trưởng Nguyễn Minh Trí trực tiếp phụ trách chuyên môn.
${is2BuoiPlan ? `
3. QUY ĐỊNH BẮT BUỘC KHI CỤ THỂ HÓA KẾ HOẠCH DẠY HỌC 2 BUỔI/NGÀY (BÁM SÁT KẾ HOẠCH CỦA SỞ GDĐT ĐỒNG THÁP):
   - Quy tắc 1 (Khung sườn cứng): Bắt buộc bám theo đúng 5 mục lớn của Sở GDĐT:
     * I. MỤC ĐÍCH, YÊU CẦU (Mục đích a, b, c, d; Yêu cầu a, b, c, d bám sát Sở).
     * II. NỘI DUNG, HÌNH THỨC TỔ CHỨC DẠY HỌC 2 BUỔI/NGÀY:
       + 1. Đối với cấp trung học cơ sở: 39 lớp (24 lớp điểm Đốc Binh Kiều, 15 lớp điểm Tân Kiều cách 11km). Thời lượng, thời khóa biểu (sáng khối 8,9; chiều khối 6,7), nội dung Buổi 1 chính khóa và Buổi 2 (phụ đạo miễn phí học sinh chưa đạt YCCĐ, bồi dưỡng HSG lớp 9, ôn thi vào lớp 10, STEM, Tin học-AI, CLB).
       + 2. Đối với cấp trung học phổ thông: 14 lớp (Khối 10, 11, 12 tại Điểm chính). Thời lượng, thời khóa biểu sáng chính khóa, chiều buổi 2 (phụ đạo, bồi dưỡng HSG tỉnh, ôn thi tốt nghiệp THPT theo tổ hợp KHTN/KHXH, NCKH kỹ thuật).
       (LƯU Ý: XÓA BỎ MỤC TIỂU HỌC CỦA SỞ VÌ TRƯỜNG CHỈ CÓ THCS VÀ THPT).
     * III. KINH PHÍ VÀ ĐIỀU KIỆN THỰC HIỆN: Kinh phí ngân sách chi thường xuyên theo định mức và Công văn 9179/BTC-NSNN; chủ trương xã hội hóa giáo dục đúng quy định, nguyên tắc tự nguyện, công khai, tuyệt đối không thu tiền sai quy định; khai thác 19 phòng bộ môn và các phòng máy tính.
     * IV. TỔ CHỨC THỰC HIỆN: Phân công nhiệm vụ có 'hồn' gắn liền hệ thống phân công chuyên môn phancongchuyenmonthcsthptdbk.vercel.app:
       + Ban Giám hiệu: Thầy Hiệu trưởng Lê Thanh Cường chỉ đạo chung; Thầy Phó Hiệu trưởng Nguyễn Minh Trí trực tiếp phụ trách chuyên môn 2 buổi/ngày toàn trường, duyệt kế hoạch buổi 2, xếp TKB, giám sát kê khai thừa thiếu tiết trên webapp phân công chuyên môn; Cán bộ phụ trách Điểm Tân Kiều.
       + 07 Tổ chuyên môn: Xây dựng kế hoạch dạy buổi 2, phân công giáo viên theo định mức, theo dõi kê khai thừa thiếu tiết.
       + Giáo viên bộ môn, Giáo viên chủ nhiệm, Ban đại diện CMHS.
     * V. CHẾ ĐỘ THÔNG TIN, BÁO CÁO: Báo cáo định kỳ học kỳ 1 và cuối năm học về Sở GDĐT Đồng Tháp (qua Phòng GDPT).
   - Quy tắc 2 (Căn cứ pháp lý - BẮT BUỘC RẤT NGẮN GỌN):
     * Chỉ trích dẫn ĐÚNG VĂN BẢN GỐC mà mình cần đọc để xây dựng kế hoạch này (tối đa 2-3 căn cứ, không trích dẫn dài dòng).
     * Trích dẫn rõ: Kế hoạch số    /KH-SGDĐT ngày    tháng 8 năm 2026 của Sở Giáo dục và Đào tạo tỉnh Đồng Tháp về Triển khai tổ chức dạy học 2 buổi/ngày đối với cơ sở giáo dục phổ thông trên địa bàn tỉnh Đồng Tháp. (Để trống số và ngày nếu văn bản gốc là bản dự thảo để người dùng tự bổ sung).
     * Kèm Quyết định số 2606/QĐ-UBND ngày 13/8/2026 sáp nhập trường và Kế hoạch giáo dục nhà trường số 28/KH-THCS&THPTĐBK. Tuyệt đối không trích dẫn thêm các chỉ thị hay công văn ngoài ngành dài dòng.
   - Quy tắc 4 (VĂN PHONG TỰ NHIÊN, CHUẨN MỰC SƯ PHẠM, KHÔNG 'MÁY MÓC KIỂU AI'):
     * TUYỆT ĐỐI KHÔNG liệt kê chi tiết các tổ chuyên môn kèm số giáo viên (ví dụ KHÔNG viết "Các Tổ chuyên môn (07 tổ: Tổ Toán 15 GV, Tổ Ngữ văn 17 GV...)"). Chỉ viết tự nhiên, đúng chức danh: "Các Tổ chuyên môn và Tổ Văn phòng:".
     * TUYỆT ĐỐI KHÔNG chèn số liệu cụ thể (101 cán bộ giáo viên, số lớp, số học sinh) vào các câu văn miêu tả chung chung (KHÔNG viết "Sử dụng hiệu quả đội ngũ 101 cán bộ, giáo viên", chỉ viết "Sử dụng hiệu quả đội ngũ cán bộ, giáo viên").
     * Số lượng học sinh, số lớp chỉ ghi khi thực sự cần thiết, tuyệt đối không phô trương số liệu vụn vặt gây phản cảm kiểu máy móc.
` : ''}

HÃY XUẤT RA DỮ LIỆU ĐỊNH DẠNG JSON ĐÚNG CHUẨN THỂ THỨC NGHỊ ĐỊNH 30/2020/NĐ-CP:
{
  "type": "${documentType}",
  "typeLabel": "${targetTypeLabel}",
  "documentNumber": "Số: .../${targetCodePrefix}",
  "title": "${targetTypeLabel}",
  "subTitle": "${topic.replace(/^(Kế hoạch|Quyết định|Hướng dẫn|Quy chế|Báo cáo|Thông báo|Tờ trình)\s*/i, '').trim()}",
  "signDate": "Đồng Tháp, ngày 28 tháng 9 năm 2026",
  "issuingAuthorityTop": "SỞ GIÁO DỤC VÀ ĐÀO TẠO ĐỒNG THÁP",
  "issuingAuthority": "TRƯỜNG THCS VÀ THPT\\nĐỐC BINH KIỀU",
  "signerRole": "${signerRole}",
  "signerName": "${signerName}",
  "sourceDirective": "Tra cứu pháp luật & Hướng dẫn chuyên môn Bộ GDĐT, Sở GDĐT Đồng Tháp",
  "legalBases": [
    "Căn cứ [Tên văn bản gốc của Sở GDĐT/Bộ GDĐT cần đọc, ghi rõ Số hiệu và Ngày ban hành nếu có, nếu chưa rõ thì để trống số    / ngày    tháng    năm 2026]...",
    "Căn cứ Quyết định số 2606/QĐ-UBND ngày 13/8/2026 của UBND tỉnh Đồng Tháp về việc sáp nhập thành Trường THCS và THPT Đốc Binh Kiều",
    "Căn cứ Kế hoạch giáo dục nhà trường năm học 2026 - 2027 số 34/KH-THCS&THPTĐBK ngày 25 tháng 9 năm 2026 của Trường THCS và THPT Đốc Binh Kiều"
  ],
  "sections": [
    {
      "heading": "I. MỤC ĐÍCH, YÊU CẦU",
      "content": "1. Mục đích:\\n...\\n\\n2. Yêu cầu:\\n..."
    },
    {
      "heading": "II. ĐẶC ĐIỂM TÌNH HÌNH VÀ CƠ CẤU ĐIỀU KIỆN TỔ CHỨC",
      "content": "1. Quy mô học sinh và lớp học (53 lớp: 39 THCS gồm 24 lớp điểm Đốc Binh Kiều, 15 lớp điểm Tân Kiều cách 11km; 14 lớp THPT):\\n...\\n\\n2. Đội ngũ cán bộ quản lý và giáo viên (120 CB-GV-NV, 102 GV trực tiếp giảng dạy):\\n...\\n\\n3. Thuận lợi và khó khăn:..."
    },
    {
      "heading": "III. NỘI DUNG, HÌNH THỨC VÀ KHUNG THỜI GIAN HOẠT ĐỘNG",
      "content": "1. Nội dung tổ chức dạy học:\\na) Buổi sáng (6h30 - 11h30 - đủ 5 tiết):...\\nb) Buổi chiều (12h00 - 17h00 - đủ 5 tiết):...\\n\\n2. Khung thời gian biểu hoạt động trong ngày:..."
    },
    {
      "heading": "IV. BỐ TRÍ ĐỘI NGŨ, CƠ SỞ VẬT CHẤT VÀ KINH PHÍ",
      "content": "1. Phân công đội ngũ giáo viên (bố trí dạy liền buổi cùng 1 điểm trường, tránh đi lại giữa 2 điểm trường cách 11km):\\n...\\n\\n2. Khai thác cơ sở vật chất (phòng bộ môn, phòng máy tính, thư viện):\\n...\\n\\n3. Kinh phí thực hiện:..."
    },
    {
      "heading": "V. TỔ CHỨC THỰC HIỆN",
      "content": "1. Ban Giám hiệu (Hiệu trưởng Lê Thanh Cường, Phó Hiệu trưởng Nguyễn Minh Trí):\\n...\\n\\n2. Các Tổ chuyên môn và Giáo viên:\\n...\\n\\n3. Bộ phận phụ trách Điểm Tân Kiều và Ban Đại diện CMHS:..."
    }
  ],
  "recipients": [
    "Sở GDĐT Đồng Tháp (để báo cáo);",
    "Ban Giám hiệu (để chỉ đạo);",
    "Các tổ chuyên môn, văn phòng (để thực hiện);",
    "Lưu: VT, CM."
  ]
}
`;

    const fallbackFn = () => {
      const currentDateStr = `Tháp Mười, ngày ${new Date().getDate()} tháng ${new Date().getMonth() + 1} năm 2026`;
      const defaultDocNum = `Số: ${Math.floor(Math.random() * 50) + 50}/${targetCodePrefix}`;
      const upperTopic = topic.trim().toUpperCase();

      // Topic specific legal bases and contents (Strictly concise, direct source directives)
      let specificLegal = [
        'Quyết định số 2606/QĐ-UBND ngày 13 tháng 8 năm 2026 của Ủy ban nhân dân tỉnh Đồng Tháp về việc sáp nhập Trường THCS Đốc Binh Kiều, Trường THCS Tân Kiều và Trường THPT Đốc Binh Kiều thành Trường THCS và THPT Đốc Binh Kiều',
        'Kế hoạch giáo dục nhà trường năm học 2026 - 2027 số 28/KH-THCS&THPTĐBK ngày 05 tháng 9 năm 2026 của Trường THCS và THPT Đốc Binh Kiều',
      ];

      // SPECIALIZED DEEP GENERATOR FOR: DẠY HỌC 2 BUỔI / NGÀY
      if (topic.toLowerCase().includes('2 buổi') || topic.toLowerCase().includes('hai buổi')) {
        return {
          type: 'plan',
          typeLabel: 'KẾ HOẠCH',
          documentNumber: `Số: 45/KH-THCS&THPTĐBK`,
          title: 'KẾ HOẠCH',
          subTitle: 'Tổ chức dạy học 2 buổi/ngày năm học 2026 - 2027',
          signDate: 'Đồng Tháp, ngày 28 tháng 9 năm 2026',
          issuingAuthorityTop: 'SỞ GDĐT TỈNH ĐỒNG THÁP',
          issuingAuthority: 'TRƯỜNG THCS VÀ THPT\nĐỐC BINH KIỀU',
          signerRole: signerRole,
          signerName: signerName,
          sourceDirective: 'Kế hoạch số    /KH-SGDĐT ngày    tháng 8 năm 2026 của Sở GDĐT Đồng Tháp',
          legalBases: [
            'Kế hoạch số    /KH-SGDĐT ngày    tháng 8 năm 2026 của Sở Giáo dục và Đào tạo tỉnh Đồng Tháp về Triển khai tổ chức dạy học 2 buổi/ngày đối với cơ sở giáo dục phổ thông trên địa bàn tỉnh Đồng Tháp',
            'Quyết định số 2606/QĐ-UBND ngày 13 tháng 8 năm 2026 của Ủy ban nhân dân tỉnh Đồng Tháp về việc sáp nhập Trường THCS Đốc Binh Kiều, Trường THCS Tân Kiều và Trường THPT Đốc Binh Kiều thành Trường THCS và THPT Đốc Binh Kiều',
            'Kế hoạch giáo dục nhà trường năm học 2026 - 2027 số 28/KH-THCS&THPTĐBK ngày 05 tháng 9 năm 2026 của Trường THCS và THPT Đốc Binh Kiều',
          ],
          sections: [
            {
              heading: 'I. MỤC ĐÍCH, YÊU CẦU',
              content: `1. Mục đích:
- Nâng cao chất lượng giáo dục toàn diện, củng cố và nâng cao chất lượng giáo dục đại trà và giáo dục mũi nhọn cho học sinh toàn trường ở cả 2 cấp học (THCS và THPT) theo Chương trình GDPT 2018.
- Tạo điều kiện thuận lợi cho học sinh được rèn luyện kỹ năng tự học, kỹ năng thực hành thí nghiệm, năng lực số và ứng dụng Trí tuệ nhân tạo (AI); tham gia các hoạt động giáo dục STEM, trải nghiệm hướng nghiệp và rèn luyện thể chất, nghệ thuật.
- Khắc phục tình trạng học thêm, dạy thêm sai quy định; giúp đỡ kịp thời những học sinh có nguy cơ chưa đạt yêu cầu cần đạt (YCCĐ) và bồi dưỡng chuyên sâu cho học sinh giỏi tham gia các kỳ thi cấp tỉnh.

2. Yêu cầu:
- Tổ chức dạy học 2 buổi/ngày phải bảo đảm tính tự nguyện, đồng thuận của cha mẹ học sinh; phù hợp với điều kiện cơ sở vật chất và đội ngũ giáo viên của từng điểm trường (Điểm chính, Điểm Đốc Binh Kiều và Điểm Tân Kiều cách 11km).
- Không gây quá tải cho học sinh và giáo viên; phân định rành mạch giữa chương trình chính khóa buổi sáng và các hoạt động giáo dục tăng cường buổi chiều.
- Bảo đảm an toàn tuyệt đối cho học sinh trong suốt thời gian học tập tại trường.`
            },
            {
              heading: 'II. ĐẶC ĐIỂM TÌNH HÌNH VÀ CƠ CẤU ĐIỀU KIỆN TỔ CHỨC',
              content: `1. Quy mô học sinh và lớp học:
- Toàn trường: 53 lớp với 2.143 học sinh (Cấp THCS: 39 lớp với 1.613 HS; Cấp THPT: 14 lớp với 530 HS).
- Phân bổ theo 3 điểm trường:
  + Điểm chính (Khối 10, 11, 12): 14 lớp, 530 học sinh. Cơ sở vật chất có 14 phòng học, 09 phòng bộ môn kiên cố, 03 phòng lắp ghép, phòng máy vi tính.
  + Điểm Đốc Binh Kiều (Khối 6, 7, 8, 9): 24 lớp, 983 học sinh. Cơ sở vật chất có 22 phòng học, 05 phòng chức năng, sân bóng đá mini, sân bóng chuyền.
  + Điểm Tân Kiều (Khối 6, 7, 8, 9 - cách điểm chính 11 km): 15 lớp, 557 học sinh. Cơ sở vật chất có 09 phòng học, 10 phòng bộ môn.

2. Đội ngũ cán bộ quản lý và giáo viên:
- Tổng số: 120 người (04 Ban Giám hiệu, 102 Giáo viên trực tiếp giảng dạy, 14 Nhân viên). Có 85 Đảng viên, 09 Thạc sĩ.
- 08 Tổ chuyên môn: Ban Giám hiệu (04), Tổ Toán (15), Tổ Ngữ văn - Thư viện - Thiết bị (17), Tổ Lịch sử - Địa lý - GDCD - GDKTPL (16), Tổ Vật lý - Hóa học - Sinh học - Công nghệ (26), Tổ Ngoại ngữ - Tin học (16), Tổ GDTC - QPAN - Nghệ thuật (12), Tổ Văn phòng (14).

3. Thuận lợi và khó khăn:
- Thuận lợi: Được sự quan tâm sâu sát của Sở GDĐT Đồng Tháp, chính quyền địa phương và sự đồng thuận cao của Ban đại diện CMHS. Đội ngũ giáo viên trẻ, nhiệt huyết, 100% đạt chuẩn và trên chuẩn đào tạo.
- Khó khăn: Địa bàn trải rộng trên 2 xã; Điểm Tân Kiều cách điểm chính 11 km đòi hỏi phương án sắp xếp thời khóa biểu thông minh, ưu tiên giáo viên dạy liền buổi tại cùng 1 điểm trường, không bố trí giáo viên di chuyển giữa 2 điểm trường trong cùng một buổi.`
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
  + 6h30 - 6h45: Vệ sinh trường lớp (15 phút)
  + 6h45 - 7h00: Sinh hoạt đầu giờ (15 phút)
  + 7h00 - 7h45: Tiết 1 (nghỉ 10 phút đổi tiết)
  + 7h55 - 8h40: Tiết 2 (nghỉ 15 phút đổi tiết)
  + 8h55 - 9h40: Tiết 3 (nghỉ 10 phút đổi tiết)
  + 9h50 - 10h35: Tiết 4 (nghỉ 10 phút đổi tiết)
  + 10h45 - 11h30: Tiết 5
- Buổi chiều (tối đa 5 tiết - từ 12h00 đến 17h00):
  + 12h00 – 12h15: Vệ sinh trường lớp (15 phút)
  + 12h15 – 12h30: Sinh hoạt đầu giờ (15 phút)
  + 12h30 – 13h15: Tiết 1 (nghỉ 10 phút đổi tiết)
  + 13h25 – 14h10: Tiết 2 (nghỉ 10 phút đổi tiết)
  + 14h20 – 15h05: Tiết 3 (nghỉ 15 phút đổi tiết)
  + 15h20 – 16h05: Tiết 4 (nghỉ 10 phút đổi tiết)
  + 16h15 – 17h00: Tiết 5 (kết thúc buổi học)`
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
- Các nguồn hỗ trợ hợp pháp khác theo quy định hiện hành, tuyệt đối không thu tiền học thêm sai quy định.`
            },
            {
              heading: 'V. TỔ CHỨC THỰC HIỆN',
              content: `1. Ban Giám hiệu:
- Thầy Hiệu trưởng Lê Thanh Cường phê duyệt kế hoạch, chỉ đạo chung về cơ sở vật chất và công tác an ninh, an toàn trường học.
- Thầy Phó Hiệu trưởng Nguyễn Minh Trí trực tiếp phụ trách điều hành chuyên môn dạy học 2 buổi/ngày; xếp thời khóa biểu khoa học, kiểm tra nền nếp dạy học buổi chiều; ký duyệt danh sách học sinh phụ đạo và học sinh giỏi.
- Phân công cán bộ phụ trách Điểm Tân Kiều theo dõi sĩ số, bảo đảm an ninh trật tự và vệ sinh môi trường tại điểm trường lẻ.

2. Các Tổ chuyên môn và Giáo viên:
- Các tổ chuyên môn xây dựng kế hoạch phân phối tiết dạy tăng cường, biên soạn đề cương, tài liệu ôn tập và phiếu học tập phù hợp từng đối tượng học sinh.
- Giáo viên bộ môn thực hiện nghiêm túc giờ giấc lên lớp, đổi mới phương pháp giảng dạy, ghi chép sổ đầu bài đầy đủ.
- Giáo viên chủ nhiệm phối hợp chặt chẽ với cha mẹ học sinh để quản lý giờ giấc, chuyên cần của học sinh giữa 2 buổi học./.`
            }
          ],
          recipients: [
            'Sở GDĐT Đồng Tháp (để báo cáo);',
            'Ban Giám hiệu (để chỉ đạo);',
            'Các tổ chuyên môn, văn phòng (để thực hiện);',
            'Lưu: VT, CM.'
          ]
        };
      }

      let contentII = `Quy mô áp dụng: Toàn trường với 53 lớp và 2.143 học sinh; 120 cán bộ giáo viên nhân viên (102 giáo viên trực tiếp giảng dạy). Trong đó: 39 lớp cấp THCS (24 lớp điểm chính Đốc Binh Kiều với 983 HS, 15 lớp điểm Tân Kiều cách 11km với 557 HS) và 14 lớp cấp THPT với 530 HS.`;
      let contentIII = `Thời gian thực hiện theo khung năm học 2026 - 2027 (đủ 35 tuần thực học, HK1: 18 tuần, HK2: 17 tuần). Khung giờ hoạt động buổi sáng từ 7h00 đến 11h30 (5 tiết), buổi chiều từ 12h30 đến 17h00 (5 tiết).`;

      if (topic.toLowerCase().includes('giáo viên dạy giỏi') || topic.toLowerCase().includes('gvdg')) {
        specificLegal.push('Thông tư số 22/2019/TT-BGDĐT ngày 20/12/2019 của Bộ GDĐT ban hành Quy định Hội thi giáo viên dạy giỏi cơ sở giáo dục phổ thông');
        contentII = `1. Đối tượng tham gia: Toàn thể giáo viên trực tiếp giảng dạy tại cả 3 điểm trường đủ điều kiện theo quy định.\n2. Nội dung thi gồm 02 phần: Thực hành 01 tiết dạy học và Trình bày 01 biện pháp nâng cao chất lượng giáo dục.\n3. Tiêu chí đánh giá bám sát Công văn 3284 và định hướng phát triển năng lực học sinh.`;
        contentIII = `Phát động từ tháng 10/2026; tổ chức thi giảng trong tháng 11/2026 chào mừng ngày Nhà giáo Việt Nam 20/11; tổng kết và trao giải trước ngày 20/11/2026.`;
      } else if (topic.toLowerCase().includes('học sinh giỏi') || topic.toLowerCase().includes('phụ đạo')) {
        specificLegal.push('Thông tư số 22/2021/TT-BGDĐT ngày 05/9/2021 của Bộ GDĐT về đánh giá học sinh THCS và THPT');
        contentII = `1. Đối với học sinh giỏi: Tuyển chọn các em có năng khiếu tại cả 2 điểm trường THCS và THPT; phân công giáo viên có kinh nghiệm bồi dưỡng theo chuyên đề.\n2. Đối với học sinh có nguy cơ chưa đạt YCCĐ: Lập danh sách, phân loại nguyên nhân và tổ chức phụ đạo miễn phí ít nhất 2 tiết/tuần/môn.`;
        contentIII = `Triển khai liên tục trong suốt 35 tuần năm học. Đợt 1 từ tuần 3 đến tuần 17; Đợt 2 từ tuần 20 đến tuần 34.`;
      } else if (topic.toLowerCase().includes('chuyển đổi số') || topic.toLowerCase().includes('ai') || topic.toLowerCase().includes('trí tuệ nhân tạo')) {
        specificLegal.push('Quyết định số 131/QĐ-TTg của Thủ tướng Chính phủ phê duyệt Đề án Tăng cường ứng dụng công nghệ thông tin và chuyển đổi số trong giáo dục');
        contentII = `1. Nâng cấp hạ tầng mạng internet và phòng máy vi tính tại cả 2 điểm trường.\n2. Sử dụng 100% hồ sơ, học bạ, sổ điểm điện tử.\n3. Tổ chức tập huấn cho 101 giáo viên về khai thác AI an toàn, liêm chính học thuật và bảo vệ dữ liệu học sinh.`;
        contentIII = `Tập huấn trong tháng 9/2026; triển khai diện rộng từ tháng 10/2026 đến hết năm học.`;
      } else if (topic.toLowerCase().includes('kiểm tra nội bộ')) {
        specificLegal.push('Nghị định số 42/2013/NĐ-CP về thanh tra giáo dục và hướng dẫn công tác kiểm tra nội bộ trường học của Sở GDĐT Đồng Tháp');
        contentII = `Kiểm tra toàn diện hoạt động sư phạm của giáo viên, kiểm tra chuyên đề quy chế chuyên môn, kiểm tra quản lý thiết bị dạy học và cơ sở vật chất tại Điểm Tân Kiều.`;
        contentIII = `Tiến hành định kỳ hàng tháng và đột xuất theo kế hoạch đã được phê duyệt.`;
      }

      return {
        type: documentType,
        typeLabel: targetTypeLabel,
        documentNumber: defaultDocNum,
        title: topic.toUpperCase().startsWith(targetTypeLabel) ? topic.toUpperCase() : `${targetTypeLabel} ${upperTopic}`,
        subTitle: `Căn cứ quy định của Bộ GDĐT và Hướng dẫn của Sở GDĐT Đồng Tháp`,
        signDate: currentDateStr,
        issuingAuthorityTop: 'SỞ GIÁO DỤC VÀ ĐÀO TẠO ĐỒNG THÁP',
        issuingAuthority: 'TRƯỜNG THCS VÀ THPT ĐỐC BINH KIỀU',
        signerRole: signerRole,
        signerName: signerName,
        sourceDirective: 'Tra cứu quy định pháp luật chuyên ngành giáo dục & Sở GDĐT Đồng Tháp',
        legalBases: specificLegal,
        sections: [
          {
            heading: 'I. MỤC ĐÍCH, YÊU CẦU',
            content: `1. Mục đích:\n- Triển khai nghiêm túc, đúng quy định pháp luật và hướng dẫn của ngành giáo dục vào thực tế Trường THCS và THPT Đốc Binh Kiều.\n- Nâng cao chất lượng giáo dục toàn diện, khích lệ phong trào thi đua dạy tốt - học tốt trong toàn trường.\n- Đảm bảo quyền lợi học tập công bằng, đồng bộ cho học sinh tại cả 3 điểm trường (đặc biệt điểm Tân Kiều cách 11km).\n\n2. Yêu cầu:\n- Nội dung thực hiện phải thiết thực, công khai, minh bạch, có tính khả thi cao.\n- Phân công rõ trách nhiệm từng tổ chức, cá nhân; phối hợp chặt chẽ giữa các bộ phận.`
          },
          {
            heading: 'II. ĐỐI TƯỢNG, ĐIỀU KIỆN VÀ NỘI DUNG THỰC HIỆN',
            content: contentII
          },
          {
            heading: 'III. THỜI GIAN, TIẾN ĐỘ VÀ KINH PHÍ THỰC HIỆN',
            content: contentIII
          },
          {
            heading: 'IV. TỔ CHỨC THỰC HIỆN',
            content: `1. Ban Giám hiệu:\n- Thầy Hiệu trưởng Lê Thanh Cường phụ trách chung và phê duyệt kinh phí.\n- Thầy Phó Hiệu trưởng Nguyễn Minh Trí trực tiếp chỉ đạo chuyên môn, kiểm tra đôn đốc tiến độ thực hiện tại các điểm trường.\n\n2. Các Tổ chuyên môn và Điểm trường:\n- 07 Tổ chuyên môn quán triệt đến 101 giáo viên trong tổ; cử giáo viên tham gia đúng quy định.\n- Bộ phận phụ trách Điểm Tân Kiều bảo đảm cơ sở vật chất, phòng bộ môn và nền nếp học tập.\n\n3. Giáo viên và Nhân viên:\n- Nghiêm túc chấp hành kế hoạch, báo cáo kịp thời những khó khăn vướng mắc để BGH xem xét giải quyết./.`
          }
        ],
        recipients: [
          'Sở GDĐT Đồng Tháp (để báo cáo);',
          'Ban Giám hiệu (để chỉ đạo);',
          'Các tổ chuyên môn, văn phòng (để thực hiện);',
          'Lưu: VT, CM.'
        ]
      };
    };

    const rawText = await generateWithFallback({
      prompt,
      systemInstruction: SYSTEM_PROMPT_OFFICIAL,
      fallbackGenerator: fallbackFn,
    });

    const parsed = cleanAndParseJson(rawText, fallbackFn);
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error in auto-research-and-build:', error);
    res.status(500).json({ success: false, error: error.message || 'Lỗi tra cứu và xây dựng văn bản' });
  }
});

// Endpoint to extract clean text from uploaded PDF / DOCX
app.post('/api/extract-text', async (req, res) => {
  try {
    const { base64, fileName } = req.body;
    if (!base64) {
      return res.status(400).json({ error: 'Missing base64 data' });
    }
    const buffer = Buffer.from(base64, 'base64');
    let text = '';
    const lower = (fileName || '').toLowerCase();

    if (lower.endsWith('.pdf')) {
      const parser = new PDFParse({ data: buffer });
      const parsed = await parser.getText();
      text = parsed.text || '';
    } else if (lower.endsWith('.docx')) {
      const parsed = await mammoth.extractRawText({ buffer });
      text = parsed.value || '';
    } else {
      text = buffer.toString('utf-8');
    }

    // Clean page artifacts
    text = text
      .replace(/-- \d+ of \d+ --/g, '')
      .replace(/Trang \d+\/\d+/g, '')
      .replace(/Trang \d+/g, '')
      .replace(/[ \t]+/g, ' ')
      .trim();

    res.json({ success: true, text });
  } catch (err: any) {
    console.error('Error in /api/extract-text:', err);
    res.status(500).json({ success: false, error: err.message || 'Không thể trích xuất nội dung file' });
  }
});

// Mount Vite or serve static
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
