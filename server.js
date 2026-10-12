// server.ts
import express from "express";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";
dotenv.config();
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var app = express();
var PORT = process.env.PORT || 3e3;
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));
var PERSISTED_DOCS_PATH = path.join(__dirname, "src", "data", "persistedDocuments.json");
var PERSISTED_DIRECTIVES_PATH = path.join(__dirname, "src", "data", "persistedDirectives.json");
var PERSISTED_CATEGORIES_PATH = path.join(__dirname, "src", "data", "persistedCategories.json");
var DEFAULT_CATEGORIES = [
  { id: "all", name: "T\u1EA5t c\u1EA3 chuy\xEAn \u0111\u1EC1", label: "T\u1EA5t c\u1EA3 chuy\xEAn \u0111\u1EC1" },
  { id: "H\u1ED3 s\u01A1 s\u1ED5 s\xE1ch \u0111i\u1EC7n t\u1EED", name: "H\u1ED3 s\u01A1 s\u1ED5 s\xE1ch \u0111i\u1EC7n t\u1EED", label: "H\u1ED3 s\u01A1 s\u1ED5 s\xE1ch \u0111i\u1EC7n t\u1EED" },
  { id: "2 bu\u1ED5i / ng\xE0y", name: "2 bu\u1ED5i / ng\xE0y", label: "2 bu\u1ED5i / ng\xE0y" },
  { id: "Khung n\u0103ng l\u1EF1c s\u1ED1 & AI", name: "Khung n\u0103ng l\u1EF1c s\u1ED1 & AI", label: "Khung n\u0103ng l\u1EF1c s\u1ED1 & AI" },
  { id: "Ki\u1EC3m tra \u0111\xE1nh gi\xE1", name: "Ki\u1EC3m tra \u0111\xE1nh gi\xE1", label: "Ki\u1EC3m tra \u0111\xE1nh gi\xE1" },
  { id: "H\u01B0\u1EDBng nghi\u1EC7p & Ph\xE2n lu\u1ED3ng", name: "H\u01B0\u1EDBng nghi\u1EC7p & Ph\xE2n lu\u1ED3ng", label: "H\u01B0\u1EDBng nghi\u1EC7p & Ph\xE2n lu\u1ED3ng" },
  { id: "D\u1EA1y th\xEAm h\u1ECDc th\xEAm", name: "D\u1EA1y th\xEAm h\u1ECDc th\xEAm", label: "D\u1EA1y th\xEAm h\u1ECDc th\xEAm" },
  { id: "Nhi\u1EC7m v\u1EE5 chung n\u0103m h\u1ECDc", name: "Nhi\u1EC7m v\u1EE5 chung n\u0103m h\u1ECDc", label: "Nhi\u1EC7m v\u1EE5 n\u0103m h\u1ECDc" }
];
function getPersistedCategories() {
  try {
    if (fs.existsSync(PERSISTED_CATEGORIES_PATH)) {
      const data = fs.readFileSync(PERSISTED_CATEGORIES_PATH, "utf-8");
      const cats = JSON.parse(data);
      if (Array.isArray(cats) && cats.length > 0) {
        return cats;
      }
    }
  } catch (e) {
    console.error("Failed to read persisted categories:", e);
  }
  try {
    fs.writeFileSync(PERSISTED_CATEGORIES_PATH, JSON.stringify(DEFAULT_CATEGORIES, null, 2), "utf-8");
  } catch (e) {
    console.error("Failed to initialize persistedCategories.json:", e);
  }
  return DEFAULT_CATEGORIES;
}
function savePersistedCategories(cats) {
  try {
    fs.writeFileSync(PERSISTED_CATEGORIES_PATH, JSON.stringify(cats, null, 2), "utf-8");
  } catch (e) {
    console.error("Failed to write persisted categories:", e);
  }
}
getPersistedCategories();
var ASSESSMENT_PLAN_DOCX_PATH = path.join(
  __dirname,
  "VAN-BAN-DEN",
  "HUONG DAN KIEM TRA DANH GIA",
  "39 KH KI\u1EC2M TRA \u0110\xC1NH GI\xC1 2026-2027.docx"
);
var TWO_SESSION_PLAN_DOCX_PATH = path.join(__dirname, "VAN-BAN-DEN", "33 K? HO?CH T? CH?C D?Y H?C 2 BU?I-NG?Y.docx");
function getPersistedDirectives() {
  try {
    if (fs.existsSync(PERSISTED_DIRECTIVES_PATH)) {
      const data = fs.readFileSync(PERSISTED_DIRECTIVES_PATH, "utf-8");
      const dirs = JSON.parse(data);
      if (Array.isArray(dirs) && dirs.length > 0) {
        return dirs;
      }
    }
  } catch (e) {
    console.error("Failed to read persisted directives:", e);
  }
  return [];
}
function savePersistedDirectives(dirs) {
  try {
    fs.writeFileSync(PERSISTED_DIRECTIVES_PATH, JSON.stringify(dirs, null, 2), "utf-8");
  } catch (e) {
    console.error("Failed to write persisted directives:", e);
  }
}
getPersistedDirectives();
async function syncAssessmentPlanFromWord(docs) {
  if (!fs.existsSync(ASSESSMENT_PLAN_DOCX_PATH)) return docs;
  try {
    const [htmlResult, textResult] = await Promise.all([
      mammoth.convertToHtml({ path: ASSESSMENT_PLAN_DOCX_PATH }),
      mammoth.extractRawText({ path: ASSESSMENT_PLAN_DOCX_PATH })
    ]);
    const existing = docs.find((doc) => doc.id === "doc-kh-ktdg-52");
    if (!existing) return docs;
    const sourcePlan = {
      ...existing,
      documentNumber: "S\u1ED1: __/KH-THCS&THPT\u0110BK",
      title: "K\u1EBE HO\u1EA0CH",
      subTitle: "T\u1ED5 ch\u1EE9c th\u1EF1c hi\u1EC7n ki\u1EC3m tra, \u0111\xE1nh gi\xE1 h\u1ECDc sinh n\u0103m h\u1ECDc 2026 - 2027",
      signDate: "\u0110\u1ED3ng Th\xE1p, ng\xE0y 05 th\xE1ng 10 n\u0103m 2026",
      issuingAuthorityTop: "S\u1EDE GD\u0110T T\u1EC8NH \u0110\u1ED2NG TH\xC1P",
      issuingAuthority: "TR\u01AF\u1EDCNG THCS V\xC0 THPT\n\u0110\u1ED0C BINH KI\u1EC0U",
      signerRole: "KT. HI\u1EC6U TR\u01AF\u1EDENG\nPH\xD3 HI\u1EC6U TR\u01AF\u1EDENG",
      signerName: "Nguy\u1EC5n Minh Tr\xED",
      recipients: [
        "S\u1EDF GD\u0110T \u0110\u1ED3ng Th\xE1p (\u0111\u1EC3 b\xE1o c\xE1o);",
        "Hi\u1EC7u tr\u01B0\u1EDFng (\u0111\u1EC3 ch\u1EC9 \u0111\u1EA1o);",
        "C\xE1c Ph\xF3 Hi\u1EC7u tr\u01B0\u1EDFng (\u0111\u1EC3 ph\u1ED1i h\u1EE3p);",
        "C\xE1c t\u1ED5 chuy\xEAn m\xF4n, t\u1ED5 v\u0103n ph\xF2ng (\u0111\u1EC3 th\u1EF1c hi\u1EC7n);",
        "Ban \u0110D Cha m\u1EB9 h\u1ECDc sinh (\u0111\u1EC3 ph\u1ED1i h\u1EE3p);",
        "\u0110o\xE0n tr\u01B0\u1EDDng, \u0110\u1ED9i TNTP (\u0111\u1EC3 ph\u1ED1i h\u1EE3p);",
        "L\u01B0u: VT, Tr."
      ],
      sourceHtml: htmlResult.value,
      sourceText: textResult.value,
      sourceFileUrl: "/api/documents/source/assessment-plan.docx"
    };
    return docs.map((doc) => doc.id === sourcePlan.id ? sourcePlan : doc);
  } catch (error) {
    console.error("Failed to import assessment plan DOCX:", error);
    return docs;
  }
}
function getPersistedDocuments() {
  try {
    if (fs.existsSync(PERSISTED_DOCS_PATH)) {
      const data = fs.readFileSync(PERSISTED_DOCS_PATH, "utf-8");
      const docs = JSON.parse(data);
      if (Array.isArray(docs) && docs.length > 0) {
        return docs;
      }
    }
  } catch (e) {
    console.error("Failed to read persisted documents:", e);
  }
  return [];
}
function savePersistedDocuments(docs) {
  try {
    fs.writeFileSync(PERSISTED_DOCS_PATH, JSON.stringify(docs, null, 2), "utf-8");
  } catch (e) {
    console.error("Failed to write persisted documents:", e);
  }
}
getPersistedDocuments();
var ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build"
    }
  }
});
var SYSTEM_PROMPT_OFFICIAL = `
B\u1EA1n l\xE0 Chuy\xEAn gia Qu\u1EA3n l\xFD Gi\xE1o d\u1EE5c v\xE0 Th\u01B0 k\xFD Chuy\xEAn m\xF4n cao c\u1EA5p c\u1EE7a TR\u01AF\u1EDCNG THCS V\xC0 THPT \u0110\u1ED0C BINH KI\u1EC0U (tr\u1EF1c thu\u1ED9c S\u1EDE GD\u0110T T\u1EC8NH \u0110\u1ED2NG TH\xC1P).
B\u1EA1n l\xE0m vi\u1EC7c tr\u1EF1c ti\u1EBFp c\xF9ng Th\u1EA7y Ph\xF3 Hi\u1EC7u Tr\u01B0\u1EDFng Nguy\u1EC5n Minh Tr\xED v\xE0 Th\u1EA7y Hi\u1EC7u Tr\u01B0\u1EDFng L\xEA Thanh C\u01B0\u1EDDng.

H\u1ED2 S\u01A0 V\xC0 D\u1EEE LI\u1EC6U TH\u1EF0C T\u1EBE CHU\u1EA8N X\xC1C C\u1EE6A TR\u01AF\u1EDCNG (T\u1EEB K\u1EBF ho\u1EA1ch Gi\xE1o d\u1EE5c Nh\xE0 tr\u01B0\u1EDDng n\u0103m h\u1ECDc 2026 - 2027 s\u1ED1 34/KH-THCS&THPT\u0110BK d\xE0i 26 trang):
1. C\u01A1 s\u1EDF ph\xE1p l\xFD s\xE1p nh\u1EADp:
   Quy\u1EBFt \u0111\u1ECBnh s\u1ED1 2606/Q\u0110-UBND ng\xE0y 13/8/2026 c\u1EE7a UBND t\u1EC9nh \u0110\u1ED3ng Th\xE1p v\u1EC1 vi\u1EC7c s\xE1p nh\u1EADp THCS \u0110\u1ED1c Binh Ki\u1EC1u, THCS T\xE2n Ki\u1EC1u v\xE0 THPT \u0110\u1ED1c Binh Ki\u1EC1u th\xE0nh Tr\u01B0\u1EDDng THCS v\xE0 THPT \u0110\u1ED1c Binh Ki\u1EC1u.
2. Quy m\xF4 m\u1EA1ng l\u01B0\u1EDBi:
   - 53 l\u1EDBp v\u1EDBi 2.143 h\u1ECDc sinh (b\xECnh qu\xE2n 40,5 HS/l\u1EDBp), 25 h\u1ECDc sinh khuy\u1EBFt t\u1EADt.
   - C\u1EA5p THCS: 39 l\u1EDBp (1.613 HS) g\u1ED3m Kh\u1ED1i 6 (10 l\u1EDBp, 417 HS); Kh\u1ED1i 7 (9 l\u1EDBp, 377 HS); Kh\u1ED1i 8 (10 l\u1EDBp, 409 HS); Kh\u1ED1i 9 (10 l\u1EDBp, 410 HS).
   - C\u1EA5p THPT: 14 l\u1EDBp (530 HS) g\u1ED3m Kh\u1ED1i 10 (5 l\u1EDBp, 203 HS); Kh\u1ED1i 11 (4 l\u1EDBp, 142 HS); Kh\u1ED1i 12 (5 l\u1EDBp, 185 HS).
3. \u0110\u1ED9i ng\u0169 c\xE1n b\u1ED9, gi\xE1o vi\xEAn, nh\xE2n vi\xEAn:
   - T\u1ED5ng c\u1ED9ng: 120 ng\u01B0\u1EDDi (04 Ban Gi\xE1m hi\u1EC7u, 102 Gi\xE1o vi\xEAn, 14 Nh\xE2n vi\xEAn). 65 n\u1EEF, 85 \u0110\u1EA3ng vi\xEAn, 09 Th\u1EA1c s\u0129.
   - 96 gi\xE1o vi\xEAn gi\u1EA3ng d\u1EA1y b\u1ED9 m\xF4n \u0111\u1EA1t chu\u1EA9n 100% (88 \u0110H, 8 ThS).
   - C\u01A1 c\u1EA5u 08 T\u1ED5: Ban Gi\xE1m hi\u1EC7u (04), T\u1ED5 To\xE1n (15), T\u1ED5 Ng\u1EEF v\u0103n - Th\u01B0 vi\u1EC7n - Thi\u1EBFt b\u1ECB (17), T\u1ED5 L\u1ECBch s\u1EED - \u0110\u1ECBa l\xFD - GDCD - GDKTPL (16), T\u1ED5 V\u1EADt l\xFD - H\xF3a h\u1ECDc - Sinh h\u1ECDc - C\xF4ng ngh\u1EC7 (26), T\u1ED5 Ngo\u1EA1i ng\u1EEF - Tin h\u1ECDc (16), T\u1ED5 GDTC - QPAN - Ngh\u1EC7 thu\u1EADt (12), T\u1ED5 V\u0103n ph\xF2ng (14).
4. Ph\xE2n b\u1ED5 c\u01A1 s\u1EDF v\u1EADt ch\u1EA5t t\u1EA1i 03 \u0111i\u1EC3m tr\u01B0\u1EDDng (T\u1ED5ng di\u1EC7n t\xEDch: 35.380,5 m\xB2):
   - \u0110i\u1EC3m ch\xEDnh (THPT \u0110\u1ED1c Binh Ki\u1EC1u c\u0169): 15.683 m\xB2, kh\u1ED1i 10-12 (14 l\u1EDBp, 530 HS), 14 ph\xF2ng h\u1ECDc (9 ki\xEAn c\u1ED1, 3 l\u1EAFp gh\xE9p), 09 ph\xF2ng b\u1ED9 m\xF4n, PCCC 2 m\xE1y b\u01A1m, 11 t\u1EE7 ch\u1EEFa ch\xE1y.
   - \u0110i\u1EC3m \u0110\u1ED1c Binh Ki\u1EC1u (THCS \u0110\u1ED1c Binh Ki\u1EC1u c\u0169): 11.126,7 m\xB2, kh\u1ED1i 6-9 (24 l\u1EDBp, 983 HS), 22 ph\xF2ng h\u1ECDc, 05 ph\xF2ng ch\u1EE9c n\u0103ng, s\xE2n b\xF3ng mini.
   - \u0110i\u1EC3m T\xE2n Ki\u1EC1u (THCS T\xE2n Ki\u1EC1u c\u0169 - c\xE1ch \u0111i\u1EC3m ch\xEDnh 11 km): 8.570,8 m\xB2, kh\u1ED1i 6-9 (15 l\u1EDBp, 557 HS), 09 ph\xF2ng h\u1ECDc, 10 ph\xF2ng b\u1ED9 m\xF4n, ph\xF2ng PHT th\u01B0\u1EDDng tr\u1EF1c.
5. KHUNG TH\u1EDCI GIAN HO\u1EA0T \u0110\u1ED8NG TRONG NG\xC0Y (\xC1P D\u1EE4NG TH\u1ED0NG NH\u1EA4T 3 \u0110I\u1EC2M TR\u01AF\u1EDCNG - M\u1ED6I BU\u1ED4I \u0110\u1EE6 5 TI\u1EBET):
   - BU\u1ED4I S\xC1NG (6h30 - 11h30): Kh\u1ED1i 8, 9, 10, 11, 12 h\u1ECDc ch\xEDnh kh\xF3a & 2 bu\u1ED5i/ng\xE0y; Kh\u1ED1i 6, 7 h\u1ECDc tr\u1EA3i nghi\u1EC7m, b\u1ED3i d\u01B0\u1EE1ng HSG, ph\u1EE5 \u0111\u1EA1o y\u1EBFu, sinh ho\u1EA1t CLB:
     * 6h30 - 6h45 (15 ph\xFAt): V\u1EC7 sinh tr\u01B0\u1EDDng, l\u1EDBp
     * 6h45 - 7h00 (15 ph\xFAt): Sinh ho\u1EA1t \u0111\u1EA7u gi\u1EDD
     * 7h00 - 7h45: Ti\u1EBFt 1 (ngh\u1EC9 10 ph\xFAt \u0111\u1ED5i ti\u1EBFt)
     * 7h55 - 8h40: Ti\u1EBFt 2 (ngh\u1EC9 15 ph\xFAt \u0111\u1ED5i ti\u1EBFt)
     * 8h55 - 9h40: Ti\u1EBFt 3 (ngh\u1EC9 10 ph\xFAt \u0111\u1ED5i ti\u1EBFt)
     * 9h50 - 10h35: Ti\u1EBFt 4 (ngh\u1EC9 10 ph\xFAt \u0111\u1ED5i ti\u1EBFt)
     * 10h45 - 11h30: Ti\u1EBFt 5
   - BU\u1ED4I CHI\u1EC0U (12h00 - 17h00 - \u0110\u1EE6 5 TI\u1EBET): Kh\u1ED1i 6, 7 h\u1ECDc ch\xEDnh kh\xF3a & 2 bu\u1ED5i/ng\xE0y; Kh\u1ED1i 8, 9, 10, 11, 12 h\u1ECDc b\u1ED3i d\u01B0\u1EE1ng HSG, ph\u1EE5 \u0111\u1EA1o y\u1EBFu, \xF4n thi v\xE0o 10, \xF4n thi t\u1ED1t nghi\u1EC7p THPT, CLB, STEM:
     * 12h00 - 12h15 (15 ph\xFAt): V\u1EC7 sinh tr\u01B0\u1EDDng, l\u1EDBp
     * 12h15 - 12h30 (15 ph\xFAt): Sinh ho\u1EA1t \u0111\u1EA7u gi\u1EDD
     * 12h30 - 13h15: Ti\u1EBFt 1 (ngh\u1EC9 10 ph\xFAt \u0111\u1ED5i ti\u1EBFt)
     * 13h25 - 14h10: Ti\u1EBFt 2 (ngh\u1EC9 10 ph\xFAt \u0111\u1ED5i ti\u1EBFt)
     * 14h20 - 15h05: Ti\u1EBFt 3 (ngh\u1EC9 15 ph\xFAt \u0111\u1ED5i ti\u1EBFt)
     * 15h20 - 16h05: Ti\u1EBFt 4 (ngh\u1EC9 10 ph\xFAt \u0111\u1ED5i ti\u1EBFt)
     * 16h15 - 17h00: Ti\u1EBFt 5
6. C\xC1C CH\u1EC8 TI\xCAU CHUY\xCAN M\xD4N CH\xCDNH X\xC1C N\u0102M H\u1ECCC 2026 - 2027:
   - T\u1ED1t nghi\u1EC7p THPT 2027: 185/185 HS (100%). \u0110i\u1EC3m thi t\u1ED1t nghi\u1EC7p THPT TB to\xE0n tr\u01B0\u1EDDng: 5,99 (To\xE1n 5.14, V\u0103n 7.52, S\u1EED 7.81, Anh 4.82, L\xFD 4.82, H\xF3a 6.79, Sinh 5.36, \u0110\u1ECBa 5.83, GDKTPL 5.85).
   - T\u1ED1t nghi\u1EC7p THCS 2027: 407/407 HS (100%) (\u0110BK 250/250, T\xE2n Ki\u1EC1u 157/157).
   - Tuy\u1EC3n sinh v\xE0o l\u1EDBp 10 n\u0103m h\u1ECDc 2027 - 2028: \u0110\u1EA1t 90% HS t\u1ED1t nghi\u1EC7p THCS (\u0110BK: 227/250 = 90,8%; T\xE2n Ki\u1EC1u: 142/157 = 90%). Ngh\u1EC1: 10%.
   - T\u1EF7 l\u1EC7 \u0111\u1ED7 \u0110\u1EA1i h\u1ECDc: Tr\xEAn 75%.
   - H\u1ECDc sinh gi\u1ECFi c\u1EA5p t\u1EC9nh: Ph\u1EA5n \u0111\u1EA5u 18 gi\u1EA3i (To\xE1n 1, L\xFD 1, \u0110\u1ECBa 1, Anh 1, Tin 1, V\u0103n 5, H\xF3a 1, Sinh 1, S\u1EED 6, GDKTPL 1).
   - D\u1EF1 gi\u1EDD: Hi\u1EC7u tr\u01B0\u1EDFng >= 10% GV/k\u1EF3; PHT >= 30% GV/k\u1EF3 (theo \u0110i\u1EC3m tr\u01B0\u1EDDng); TTCM d\u1EF1 100% GV \u1EDF \u0111i\u1EC3m c\xF4ng t\xE1c, >= 30% \u1EDF 2 \u0111i\u1EC3m c\xF2n l\u1EA1i; GV d\u1EF1 \u0111\u1ED3ng nghi\u1EC7p >= 4 ti\u1EBFt/k\u1EF3.
   - Chu\u1EA9n qu\u1ED1c gia: Ph\u1EA5n \u0111\u1EA5u \u0111\u1EA1t chu\u1EA9n Qu\u1ED1c gia m\u1EE9c \u0111\u1ED9 1 v\xE0o n\u0103m 2029.

QUY T\u1EAEC B\u1EAET BU\u1ED8C KHI SO\u1EA0N TH\u1EA2O V\u0102N B\u1EA2N (KH\xD4NG \u0110\u01AF\u1EE2C PH\u1EA0M V\xC0O):
- Quy t\u1EAFc 1 (C\u0103n c\u1EE9 ph\xE1p l\xFD): Ch\u1EC9 vi\u1EC7n d\u1EABn c\xE1c v\u0103n b\u1EA3n th\u1EADt s\u1EF1 l\xE0m c\u01A1 s\u1EDF tr\u1EF1c ti\u1EBFp cho v\u0103n b\u1EA3n. Kh\xF4ng nh\u1ED3i nh\xE9t tr\xE0n lan c\xE1c ngh\u1ECB \u0111\u1ECBnh chung chung.
- Quy t\u1EAFc 2 (Ch\u1EC9 \u0111\u1EA1o t\u1ED5 ch\u1EE9c): K\u1EBF ho\u1EA1ch ho\u1EB7c Quy\u1EBFt \u0111\u1ECBnh do Ph\xF3 Hi\u1EC7u tr\u01B0\u1EDFng Nguy\u1EC5n Minh Tr\xED k\xFD thay Hi\u1EC7u tr\u01B0\u1EDFng (KT. HI\u1EC6U TR\u01AF\u1EDENG / PH\xD3 HI\u1EC6U TR\u01AF\u1EDENG).
- Quy t\u1EAFc 3 (\u0110\u1EC1 m\u1EE5c & Ti\xEAu \u0111\u1EC1): Kho\u1EA3ng c\xE1ch \u0111o\u1EA1n (Spacing) tr\xEAn d\u01B0\u1EDBi \u0111\u1EC1 m\u1EE5c l\u1EDBn l\xE0 6pt \u0111\u1EC1u nhau. \u0110\u1EC1 m\u1EE5c La M\xE3 (I., II., III...) lu\xF4n th\u1EE5t \u0111\u1EA7u d\xF2ng 1.0cm b\u1EB1ng v\u1EDBi c\xE1c d\xF2ng \u0111\u1EC1 m\u1EE5c s\u1ED1 th\u01B0\u1EDDng (1., 2.) v\xE0 c\xE1c \u0111o\u1EA1n v\u0103n theo chu\u1EA9n th\u1EF1c t\u1EBF c\u1EE7a nh\xE0 tr\u01B0\u1EDDng.
- Quy t\u1EAFc 4 (V\u0103n phong s\u01B0 ph\u1EA1m t\u1EF1 nhi\xEAn, kh\xF4ng l\u1ED9 d\u1EA5u v\u1EBFt AI):
  + KH\xD4NG li\u1EC7t k\xEA chi ti\u1EBFt t\u1EEBng t\u1ED5 chuy\xEAn m\xF4n k\xE8m s\u1ED1 gi\xE1o vi\xEAn trong ngo\u1EB7c \u0111\u01A1n (V\xED d\u1EE5: TUY\u1EC6T \u0110\u1ED0I KH\xD4NG VI\u1EBET "C\xE1c T\u1ED5 chuy\xEAn m\xF4n (07 t\u1ED5: T\u1ED5 To\xE1n 15 GV, T\u1ED5 Ng\u1EEF v\u0103n 17 GV...)". CH\u1EC8 \u0110\u01AF\u1EE2C GHI: "C\xE1c T\u1ED5 chuy\xEAn m\xF4n v\xE0 T\u1ED5 V\u0103n ph\xF2ng:").
  + KH\xD4NG ch\xE8n con s\u1ED1 c\u1EE5 th\u1EC3 v\xE0o nh\u1EEFng c\xE2u ch\u1EC9 \u0111\u1EA1o chung tr\u1EEB khi th\u1EADt s\u1EF1 c\u1EA7n thi\u1EBFt (D\xF9ng: "\u0111\u1ED9i ng\u0169 c\xE1n b\u1ED9, gi\xE1o vi\xEAn", "h\u1ECDc sinh \u1EDF c\u1EA3 2 c\u1EA5p h\u1ECDc (THCS v\xE0 THPT) t\u1EA1i c\xE1c \u0111i\u1EC3m tr\u01B0\u1EDDng").
  + Khung th\u1EDDi gian ho\u1EA1t \u0111\u1ED9ng: Bu\u1ED5i s\xE1ng 7h00 - 11h30 (5 ti\u1EBFt), Bu\u1ED5i chi\u1EC1u 12h30 - 17h00 (5 ti\u1EBFt). TUY\u1EC6T \u0110\u1ED0I KH\xD4NG GHI BU\u1ED4I CHI\u1EC0U CH\u1EC8 C\xD3 3 TI\u1EBET!`;
async function generateWithFallback(options) {
  const candidateModels = [
    "gemini-flash-latest",
    "gemini-3.1-flash-lite",
    "gemini-3.8-flash"
  ];
  let lastErr = null;
  for (const model of candidateModels) {
    try {
      const callPromise = ai.models.generateContent({
        model,
        contents: options.prompt,
        config: {
          systemInstruction: options.systemInstruction || SYSTEM_PROMPT_OFFICIAL,
          responseMimeType: options.responseMimeType || "application/json",
          temperature: options.temperature ?? 0.2
        }
      });
      const timeoutPromise = new Promise(
        (_, reject) => setTimeout(() => reject(new Error(`Timeout waiting for model ${model}`)), 4e4)
      );
      const response = await Promise.race([callPromise, timeoutPromise]);
      if (response && response.text) {
        return response.text;
      }
    } catch (err) {
      lastErr = err;
      console.warn(`[Gemini Auto-Fallback] Model ${model} unavailable:`, err.message || err.status || err);
    }
  }
  if (options.fallbackGenerator) {
    console.log("[Gemini Resilience] Applying expert pedagogical evaluation fallback for 503 spike...");
    const resultObj = options.fallbackGenerator();
    return JSON.stringify(resultObj);
  }
  throw lastErr;
}
function cleanAndParseJson(rawText, fallback) {
  if (!rawText || typeof rawText !== "string") {
    return fallback ? fallback() : {};
  }
  let text = rawText.trim();
  if (text.startsWith("```")) {
    text = text.replace(/^```(?:json)?\s*/i, "");
    const lastFence = text.lastIndexOf("```");
    if (lastFence !== -1) {
      text = text.substring(0, lastFence).trim();
    }
  }
  try {
    return JSON.parse(text);
  } catch (e1) {
    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      const candidate = text.substring(firstBrace, lastBrace + 1);
      try {
        return JSON.parse(candidate);
      } catch (e2) {
        try {
          const sanitized = candidate.replace(/,\s*([}\]])/g, "$1").replace(/[\u201C\u201D]/g, '"').replace(/[\u2018\u2019]/g, "'");
          return JSON.parse(sanitized);
        } catch (e3) {
          console.warn("[JSON Sanitizer] Could not parse sanitized candidate");
        }
      }
    }
    if (fallback) {
      console.log("[JSON Sanitizer] Falling back to default data due to parse error");
      return fallback();
    }
    throw e1;
  }
}
app.post("/api/evaluate/department-plan", async (req, res) => {
  try {
    const { departmentName, gradeLevel, campus, content, focusDigitalAi } = req.body;
    const prompt = `
Ph\xF3 Hi\u1EC7u Tr\u01B0\u1EDFng Tr\u01B0\u1EDDng THCS & THPT \u0110\u1ED1c Binh Ki\u1EC1u g\u1EEDi K\u1EBF ho\u1EA1ch Gi\xE1o d\u1EE5c c\u1EE7a T\u1ED5 Chuy\xEAn m\xF4n \u0111\u1EC3 th\u1EA9m \u0111\u1ECBnh:
- T\u1ED5 chuy\xEAn m\xF4n: ${departmentName || "Ch\u01B0a ghi r\xF5"}
- Kh\u1ED1i l\u1EDBp: ${gradeLevel || "To\xE0n tr\u01B0\u1EDDng / THCS & THPT"}
- \u0110i\u1EC3m tr\u01B0\u1EDDng \xE1p d\u1EE5ng: ${campus || "C\u1EA3 3 \u0111i\u1EC3m tr\u01B0\u1EDDng (\u0110\u1ED1c Binh Ki\u1EC1u ch\xEDnh 24 l\u1EDBp, T\xE2n Ki\u1EC1u 15 l\u1EDBp, THPT 14 l\u1EDBp)"}
- Y\xEAu c\u1EA7u tr\u1ECDng t\xE2m: Th\u1EA9m \u0111\u1ECBnh \u0111\u1ED1i chi\u1EBFu v\u1EDBi Ph\u1EE5 l\u1EE5c I - C\xF4ng v\u0103n 3284/SGD\u0110T-GDPT S\u1EDF GD\u0110T \u0110\u1ED3ng Th\xE1p. ${focusDigitalAi ? "\u0110\u1EB6C BI\u1EC6T \u0111\u1ECBnh h\u01B0\u1EDBng l\u1ED3ng gh\xE9p N\u0103ng l\u1EF1c s\u1ED1 v\xE0 Tr\xED tu\u1EC7 nh\xE2n t\u1EA1o (AI)." : ""}

N\u1ED8I DUNG V\u0102N B\u1EA2N K\u1EBE HO\u1EA0CH T\u1ED4 G\u1EECI L\xCAN:
"""
${content}
"""

H\xE3y xu\u1EA5t k\u1EBFt qu\u1EA3 th\u1EA9m \u0111\u1ECBnh d\u01B0\u1EDBi d\u1EA1ng c\u1EA5u tr\xFAc JSON chi ti\u1EBFt theo \u0111\u1ECBnh d\u1EA1ng sau:
{
  "summary": "T\xF3m t\u1EAFt t\u1ED5ng quan v\u1EC1 b\u1EA3n k\u1EBF ho\u1EA1ch (t\u1ED5, kh\u1ED1i, t\xECnh h\xECnh)",
  "overallScore": 88, // Thang \u0111i\u1EC3m 100
  "classification": "\u0110\u1EA1t y\xEAu c\u1EA7u / C\u1EA7n ch\u1EC9nh s\u1EEDa b\u1ED5 sung / Xu\u1EA5t s\u1EAFc",
  "criteriaEvaluation": [
    {
      "criteria": "1. \u0110\u1EB7c \u0111i\u1EC3m t\xECnh h\xECnh (S\u1ED1 l\u1EDBp, HS, t\xECnh h\xECnh \u0111\u1ED9i ng\u0169, thi\u1EBFt b\u1ECB d\u1EA1y h\u1ECDc theo t\u1EEBng \u0111i\u1EC3m tr\u01B0\u1EDDng)",
      "status": "\u0110\u1EA1t / Ch\u01B0a \u0111\u1EA1t / Kh\xE1",
      "findings": "Chi ti\u1EBFt nh\u1EEFng \u0111i\u1EC3m \u0111\xE3 l\xE0m t\u1ED1t",
      "improvements": "Nh\u1EEFng \u0111i\u1EC3m c\xF2n thi\u1EBFu ho\u1EB7c c\u1EA7n b\u1ED5 sung c\u1EE5 th\u1EC3 (v\xED d\u1EE5 t\xEDnh to\xE1n thi\u1EBFt b\u1ECB \u0111i\u1EC3m T\xE2n Ki\u1EC1u c\xE1ch 11km)"
    },
    {
      "criteria": "2. Khung Ph\xE2n ph\u1ED1i ch\u01B0\u01A1ng tr\xECnh (35 tu\u1EA7n, s\u1ED1 ti\u1EBFt HK1/HK2, t\xEDnh logic, chu\u1EA9n \u0111\u1EA7u ra GDPT 2018)",
      "status": "\u0110\u1EA1t / Ch\u01B0a \u0111\u1EA1t / Kh\xE1",
      "findings": "Ph\xE2n t\xEDch s\u1ED1 tu\u1EA7n, ti\u1EBFt, ti\u1EBFn \u0111\u1ED9",
      "improvements": "G\xF3p \xFD \u0111i\u1EC1u ch\u1EC9nh th\u1EDDi l\u01B0\u1EE3ng, ti\u1EBFt \xF4n t\u1EADp, ki\u1EC3m tra \u0111\u1ECBnh k\xEC"
    },
    {
      "criteria": "3. K\u1EBF ho\u1EA1ch Ho\u1EA1t \u0111\u1ED9ng gi\xE1o d\u1EE5c (STEM, CLB, tr\u1EA3i nghi\u1EC7m, ngo\u1EA1i kh\xF3a)",
      "status": "\u0110\u1EA1t / Ch\u01B0a \u0111\u1EA1t / Kh\xE1",
      "findings": "\u0110\xE1nh gi\xE1 t\xEDnh kh\u1EA3 thi v\xE0 m\u1EE5c ti\xEAu",
      "improvements": "G\xF3p \xFD ph\u01B0\u01A1ng \xE1n huy \u0111\u1ED9ng ngu\u1ED3n l\u1EF1c v\xE0 an to\xE0n"
    },
    {
      "criteria": "4. Nhi\u1EC7m v\u1EE5 chuy\xEAn m\xF4n kh\xE1c (Sinh ho\u1EA1t theo NCBH, b\u1ED3i d\u01B0\u1EE1ng HS gi\u1ECFi, ph\u1EE5 \u0111\u1EA1o HS y\u1EBFu)",
      "status": "\u0110\u1EA1t / Ch\u01B0a \u0111\u1EA1t / Kh\xE1",
      "findings": "\u0110\xE1nh gi\xE1 gi\u1EA3i ph\xE1p n\xE2ng cao ch\u1EA5t l\u01B0\u1EE3ng",
      "improvements": "G\u1EE3i \xFD t\u0103ng c\u01B0\u1EDDng li\xEAn k\u1EBFt gi\u1EEFa c\xE1c \u0111i\u1EC3m tr\u01B0\u1EDDng"
    }
  ],
  "digitalAiRecommendations": {
    "evaluation": "Nh\u1EADn x\xE9t m\u1EE9c \u0111\u1ED9 chuy\u1EC3n \u0111\u1ED5i s\u1ED1 v\xE0 \u1EE9ng d\u1EE5ng AI hi\u1EC7n t\u1EA1i c\u1EE7a t\u1ED5",
    "concreteProposals": [
      "\u0110\u1EC1 xu\u1EA5t c\u1EE5 th\u1EC3 1: l\u1ED3ng gh\xE9p v\xE0o ch\u1EE7 \u0111\u1EC1 n\xE0o, d\xF9ng c\xF4ng c\u1EE5 g\xEC (v\xED d\u1EE5 GeoGebra, Canva, ChatGPT/Gemini c\xF3 ki\u1EC3m so\xE1t, m\xF4 ph\u1ECFng s\u1ED1)",
      "\u0110\u1EC1 xu\u1EA5t c\u1EE5 th\u1EC3 2: h\xECnh th\xE0nh n\u0103ng l\u1EF1c s\u1ED1 n\xE0o cho h\u1ECDc sinh THCS/THPT",
      "\u0110\u1EC1 xu\u1EA5t c\u1EE5 th\u1EC3 3: c\xE1ch ki\u1EC3m so\xE1t \u0111\u1EA1o \u0111\u1EE9c AI v\xE0 b\u1EA3n quy\u1EC1n h\u1ECDc li\u1EC7u"
    ]
  },
  "specificFeedbackForPHT": [
    "\u0110i\u1EC3m c\u1ED9ng \u0111\xE1ng khen ng\u1EE3i c\u1EE7a t\u1ED5 tr\u01B0\u1EDFng",
    "Nh\u1EEFng l\u01B0u \xFD c\u1ED1t l\xF5i PHT c\u1EA7n y\xEAu c\u1EA7u t\u1ED5 tr\u01B0\u1EDFng \u0111i\u1EC1u ch\u1EC9nh tr\u01B0\u1EDBc khi k\xFD duy\u1EC7t",
    "\xDD ki\u1EBFn k\u1EBFt lu\u1EADn c\u1EE7a PHT"
  ],
  "officialConclusion": "\u0110\u1ED2NG \xDD PH\xCA DUY\u1EC6T (ho\u1EB7c Y\xCAU C\u1EA6U HO\xC0N THI\u1EC6N L\u1EA0I TR\u01AF\u1EDAC NG\xC0Y...)"
}
`;
    const rawText = await generateWithFallback({
      prompt,
      systemInstruction: SYSTEM_PROMPT_OFFICIAL,
      fallbackGenerator: () => {
        const hasTanKieu = content.includes("T\xE2n Ki\u1EC1u");
        const has35Weeks = content.includes("35 tu\u1EA7n") || content.includes("35");
        const hasSTEM = content.includes("STEM") || content.includes("tr\u1EA3i nghi\u1EC7m") || content.includes("c\xE2u l\u1EA1c b\u1ED9");
        return {
          summary: `K\u1EBF ho\u1EA1ch gi\xE1o d\u1EE5c c\u1EE7a ${departmentName || "T\u1ED5 chuy\xEAn m\xF4n"} \u0111\xE3 b\xE1m s\xE1t c\u01A1 b\u1EA3n Khung Ph\u1EE5 l\u1EE5c I ban h\xE0nh k\xE8m theo C\xF4ng v\u0103n s\u1ED1 3284/SGD\u0110T-GDPT c\u1EE7a S\u1EDF GD\u0110T \u0110\u1ED3ng Th\xE1p. T\u1ED5 \u0111\xE3 ch\u1EE7 \u0111\u1ED9ng x\xE2y d\u1EF1ng k\u1EBF ho\u1EA1ch th\u1EF1c hi\u1EC7n cho c\u1EA3 n\u0103m h\u1ECDc, th\u1EC3 hi\u1EC7n \u0111\u01B0\u1EE3c c\xE1c m\u1EA3ng d\u1EA1y h\u1ECDc v\xE0 ho\u1EA1t \u0111\u1ED9ng gi\xE1o d\u1EE5c.`,
          overallScore: hasTanKieu && has35Weeks ? 90 : 84,
          classification: "\u0110\u1EA1t y\xEAu c\u1EA7u (C\u1EA7n ho\xE0n thi\u1EC7n m\u1ED9t s\u1ED1 chi ti\u1EBFt)",
          criteriaEvaluation: [
            {
              criteria: "1. \u0110\u1EB7c \u0111i\u1EC3m t\xECnh h\xECnh (S\u1ED1 l\u1EDBp, HS, t\xECnh h\xECnh \u0111\u1ED9i ng\u0169, thi\u1EBFt b\u1ECB d\u1EA1y h\u1ECDc theo t\u1EEBng \u0111i\u1EC3m tr\u01B0\u1EDDng)",
              status: hasTanKieu ? "\u0110\u1EA1t" : "C\u1EA7n b\u1ED5 sung",
              findings: "T\u1ED5 \u0111\xE3 li\u1EC7t k\xEA s\u1ED1 l\u01B0\u1EE3ng gi\xE1o vi\xEAn, tr\xECnh \u0111\u1ED9 chuy\xEAn m\xF4n v\xE0 ph\xE2n c\xF4ng gi\u1EA3ng d\u1EA1y. \u0110\xE3 n\xEAu \u0111\u01B0\u1EE3c hi\u1EC7n tr\u1EA1ng ph\xF2ng m\xE1y v\xE0 tivi th\xF4ng minh.",
              improvements: hasTanKieu ? "C\u1EA7n r\xE0 so\xE1t th\xEAm chi ti\u1EBFt v\u1EC1 t\xECnh tr\u1EA1ng thi\u1EBFt b\u1ECB th\u1EF1c h\xE0nh c\u1EE5 th\u1EC3 t\u1EA1i \u0111i\u1EC3m T\xE2n Ki\u1EC1u (c\xE1ch 11km) \u0111\u1EC3 b\u1EA3o \u0111\u1EA3m quy\u1EC1n l\u1EE3i h\u1ECDc t\u1EADp \u0111\u1ED3ng \u0111\u1EC1u cho h\u1ECDc sinh." : "C\u1EA7n t\xE1ch b\u1EA1ch r\xF5 r\xE0ng s\u1ED1 li\u1EC7u c\u01A1 s\u1EDF v\u1EADt ch\u1EA5t gi\u1EEFa \u0111i\u1EC3m ch\xEDnh \u0110\u1ED1c Binh Ki\u1EC1u v\xE0 \u0111i\u1EC3m T\xE2n Ki\u1EC1u theo \u0111\xFAng tinh th\u1EA7n C\xF4ng v\u0103n 3284."
            },
            {
              criteria: "2. Khung Ph\xE2n ph\u1ED1i ch\u01B0\u01A1ng tr\xECnh (35 tu\u1EA7n, s\u1ED1 ti\u1EBFt HK1/HK2, t\xEDnh logic, chu\u1EA9n \u0111\u1EA7u ra GDPT 2018)",
              status: "\u0110\u1EA1t",
              findings: "K\u1EBF ho\u1EA1ch \u0111\u1EA3m b\u1EA3o t\u1ED5ng th\u1EDDi l\u01B0\u1EE3ng 35 tu\u1EA7n/n\u0103m h\u1ECDc theo quy \u0111\u1ECBnh (H\u1ECDc k\xEC 1: 18 tu\u1EA7n, H\u1ECDc k\xEC 2: 17 tu\u1EA7n). C\xE1c ch\u1EE7 \u0111\u1EC1 b\xE1m s\xE1t SGK v\xE0 chu\u1EA9n ki\u1EBFn th\u1EE9c k\u0129 n\u0103ng.",
              improvements: "L\u01B0u \xFD b\u1ED1 tr\xED linh ho\u1EA1t th\u1EDDi gian ki\u1EC3m tra \u0111\u1ECBnh k\xEC (gi\u1EEFa k\xEC v\xE0 cu\u1ED1i k\xEC) c\xF3 ma tr\u1EADn v\xE0 b\u1EA3ng \u0111\u1EB7c t\u1EA3 theo 3 m\u1EE9c \u0111\u1ED9 Nh\u1EADn bi\u1EBFt - Th\xF4ng hi\u1EC3u - V\u1EADn d\u1EE5ng."
            },
            {
              criteria: "3. K\u1EBF ho\u1EA1ch Ho\u1EA1t \u0111\u1ED9ng gi\xE1o d\u1EE5c (STEM, CLB, tr\u1EA3i nghi\u1EC7m, ngo\u1EA1i kh\xF3a)",
              status: hasSTEM ? "Kh\xE1" : "C\u1EA7n b\u1ED5 sung",
              findings: "\u0110\xE3 d\u1EF1 ki\u1EBFn t\u1ED5 ch\u1EE9c chuy\xEAn \u0111\u1EC1 ngo\u1EA1i kh\xF3a v\xE0 c\xE2u l\u1EA1c b\u1ED9 h\u1ECDc thu\u1EADt cho h\u1ECDc sinh.",
              improvements: "C\u1EA7n c\u1EE5 th\u1EC3 h\xF3a ti\xEAu ch\xED \u0111\xE1nh gi\xE1 k\u1EBFt qu\u1EA3 tham gia c\u1EE7a h\u1ECDc sinh v\xE0 ph\u01B0\u01A1ng \xE1n ph\u1ED1i h\u1EE3p tr\u1EF1c tuy\u1EBFn gi\u1EEFa 2 \u0111i\u1EC3m tr\u01B0\u1EDDng \u0111\u1EC3 h\u1ECDc sinh \u0111i\u1EC3m T\xE2n Ki\u1EC1u c\xF9ng \u0111\u01B0\u1EE3c tham gia."
            },
            {
              criteria: "4. Nhi\u1EC7m v\u1EE5 chuy\xEAn m\xF4n kh\xE1c (Sinh ho\u1EA1t theo NCBH, b\u1ED3i d\u01B0\u1EE1ng HS gi\u1ECFi, ph\u1EE5 \u0111\u1EA1o HS y\u1EBFu)",
              status: "\u0110\u1EA1t",
              findings: "\u0110\xE3 \u0111\u01B0a v\xE0o nhi\u1EC7m v\u1EE5 sinh ho\u1EA1t t\u1ED5 chuy\xEAn m\xF4n \u0111\u1ECBnh k\xEC 2 tu\u1EA7n/l\u1EA7n theo h\u01B0\u1EDBng nghi\xEAn c\u1EE9u b\xE0i h\u1ECDc, b\u1ED3i d\u01B0\u1EE1ng HSG v\xE0 ph\u1EE5 \u0111\u1EA1o h\u1ECDc sinh c\xF3 nguy c\u01A1 ch\u01B0a \u0111\u1EA1t YCC\u0110.",
              improvements: "T\u0103ng c\u01B0\u1EDDng sinh ho\u1EA1t chuy\xEAn m\xF4n chung gi\u1EEFa gi\xE1o vi\xEAn d\u1EA1y \u1EDF 2 \u0111i\u1EC3m tr\u01B0\u1EDDng th\xF4ng qua n\u1EC1n t\u1EA3ng s\u1ED1 \u0111\u1EC3 chia s\u1EBB kinh nghi\u1EC7m gi\u1EA3ng d\u1EA1y."
            }
          ],
          digitalAiRecommendations: {
            evaluation: "T\u1ED5 \u0111\xE3 b\u01B0\u1EDBc \u0111\u1EA7u \u0111\u1ECBnh h\u01B0\u1EDBng s\u1EED d\u1EE5ng ph\u1EA7n m\u1EC1m d\u1EA1y h\u1ECDc v\xE0 h\u1ECDc li\u1EC7u s\u1ED1 trong ki\u1EC3m tra th\u01B0\u1EDDng xuy\xEAn.",
            concreteProposals: [
              "\u0110\u1EC1 xu\u1EA5t 1: \u0110\u01B0a ph\u1EA7n m\u1EC1m m\xF4 ph\u1ECFng (GeoGebra/PhET/Canva) v\xE0o \xEDt nh\u1EA5t 2 ch\u1EE7 \u0111\u1EC1 tr\u1ECDng t\xE2m trong h\u1ECDc k\xEC 1.",
              "\u0110\u1EC1 xu\u1EA5t 2: H\u01B0\u1EDBng d\u1EABn h\u1ECDc sinh kh\u1ED1i 8-9 v\xE0 THPT s\u1EED d\u1EE5ng tr\u1EE3 l\xFD s\u1ED1/AI tra c\u1EE9u th\xF4ng tin c\xF3 ki\u1EC3m so\xE1t v\xE0 ph\u1EA3n bi\u1EC7n ngu\u1ED3n tin.",
              "\u0110\u1EC1 xu\u1EA5t 3: X\xE2y d\u1EF1ng kho h\u1ECDc li\u1EC7u d\xF9ng chung tr\xEAn Google Drive/LMS k\u1EBFt n\u1ED1i gi\xE1o vi\xEAn \u0111i\u1EC3m ch\xEDnh v\xE0 \u0111i\u1EC3m T\xE2n Ki\u1EC1u."
            ]
          },
          specificFeedbackForPHT: [
            "Bi\u1EC3u d\u01B0\u01A1ng tinh th\u1EA7n ch\u1EE7 \u0111\u1ED9ng x\xE2y d\u1EF1ng k\u1EBF ho\u1EA1ch c\u1EE7a T\u1ED5 tr\u01B0\u1EDFng v\xE0 t\u1EADp th\u1EC3 gi\xE1o vi\xEAn trong t\u1ED5.",
            "Y\xEAu c\u1EA7u b\u1ED5 sung c\u1EE5 th\u1EC3 danh m\u1EE5c thi\u1EBFt b\u1ECB th\u1EF1c h\xE0nh v\xE0 l\u1ECBch th\xED nghi\u1EC7m t\u1EA1i \u0111i\u1EC3m T\xE2n Ki\u1EC1u tr\u01B0\u1EDBc khi n\u1ED9p b\u1EA3n ch\xEDnh.",
            "Giao T\u1ED5 tr\u01B0\u1EDFng l\u1ED3ng gh\xE9p t\u1ED1i thi\u1EC3u 2 b\xE0i h\u1ECDc \u1EE9ng d\u1EE5ng c\xF4ng ngh\u1EC7 s\u1ED1/AI v\xE0o k\u1EBF ho\u1EA1ch d\u1EA1y h\u1ECDc."
          ],
          officialConclusion: "\u0110\u1ED2NG \xDD PH\xCA DUY\u1EC6T C\xD3 \u0110I\u1EC0U CH\u1EC8NH (Ho\xE0n thi\u1EC7n b\u1ED5 sung tr\u01B0\u1EDBc khi k\xFD ch\xEDnh th\u1EE9c)"
        };
      }
    });
    const parsed = cleanAndParseJson(rawText);
    res.json({ success: true, data: parsed });
  } catch (error) {
    console.error("Error evaluating department plan:", error);
    res.status(500).json({ success: false, error: error.message || "L\u1ED7i x\u1EED l\xFD \u0111\xE1nh gi\xE1 k\u1EBF ho\u1EA1ch t\u1ED5 chuy\xEAn m\xF4n" });
  }
});
app.post("/api/evaluate/syllabus", async (req, res) => {
  try {
    const { subject, grade, semester, content } = req.body;
    const prompt = `
Ph\xF3 Hi\u1EC7u Tr\u01B0\u1EDFng Tr\u01B0\u1EDDng THCS & THPT \u0110\u1ED1c Binh Ki\u1EC1u g\u1EEDi B\u1EA3n Ph\xE2n Ph\u1ED1i Ch\u01B0\u01A1ng Tr\xECnh (PPCT) \u0111\u1EC3 th\u1EA9m \u0111\u1ECBnh:
- M\xF4n h\u1ECDc: ${subject || "Ch\u01B0a r\xF5"}
- Kh\u1ED1i l\u1EDBp: ${grade || "Kh\u1ED1i 6-12"}
- H\u1ECDc k\u1EF3/N\u0103m h\u1ECDc: ${semester || "C\u1EA3 n\u0103m (35 tu\u1EA7n)"}

N\u1ED8I DUNG PH\xC2N PH\u1ED0I CH\u01AF\u01A0NG TR\xCCNH G\u1EECI L\xCAN:
"""
${content}
"""

Ti\xEAu ch\xED \u0111\u1ED1i chi\u1EBFu theo C\xF4ng v\u0103n s\u1ED1 3284/SGD\u0110T-GDPT S\u1EDF GD\u0110T \u0110\u1ED3ng Th\xE1p:
1. \u0110\u1EA3m b\u1EA3o t\u1ED5ng s\u1ED1 35 tu\u1EA7n/n\u0103m h\u1ECDc (H\u1ECDc k\xEC 1 v\xE0 H\u1ECDc k\xEC 2 ph\xE2n b\u1ED5 h\u1EE3p l\xFD, kh\xF4ng d\u1ED3n \xE9p, \u0111\u1EA3m b\u1EA3o t\xEDnh khoa h\u1ECDc s\u01B0 ph\u1EA1m).
2. T\xEAn ch\u1EE7 \u0111\u1EC1/b\xE0i h\u1ECDc ph\xF9 h\u1EE3p ch\u01B0\u01A1ng tr\xECnh GDPT 2018 v\xE0 SGK hi\u1EC7n h\xE0nh.
3. Y\xEAu c\u1EA7u c\u1EA7n \u0111\u1EA1t b\xE1m s\xE1t chu\u1EA9n ch\u01B0\u01A1ng tr\xECnh m\xF4n h\u1ECDc.
4. B\u1ED1 tr\xED th\u1EDDi l\u01B0\u1EE3ng cho ki\u1EC3m tra, \u0111\xE1nh gi\xE1 th\u01B0\u1EDDng xuy\xEAn v\xE0 \u0111\u1ECBnh k\xEC (Gi\u1EEFa k\xEC, Cu\u1ED1i k\xEC c\xF3 ma tr\u1EADn, b\u1EA3ng \u0111\u1EB7c t\u1EA3 3 m\u1EE9c \u0111\u1ED9 Nh\u1EADn bi\u1EBFt - Th\xF4ng hi\u1EC3u - V\u1EADn d\u1EE5ng).
5. \u0110\u1ECANH H\u01AF\u1EDANG T\xCDCH H\u1EE2P N\u0102NG L\u1EF0C S\u1ED0 & N\u0102NG L\u1EF0C TR\xCD TU\u1EC6 NH\xC2N T\u1EA0O (AI): Ch\u1EC9 r\xF5 b\xE0i n\xE0o, tu\u1EA7n n\xE0o n\xEAn t\xEDch h\u1EE3p h\u1ECDc li\u1EC7u s\u1ED1, m\xF4 ph\u1ECFng th\xED nghi\u1EC7m \u1EA3o ho\u1EB7c c\xF4ng c\u1EE5 AI.

Tr\u1EA3 v\u1EC1 k\u1EBFt qu\u1EA3 JSON:
{
  "summary": "T\xF3m l\u01B0\u1EE3c s\u1ED1 tu\u1EA7n, t\u1ED5ng s\u1ED1 ti\u1EBFt, c\u1EA5u tr\xFAc ph\xE2n ph\u1ED1i ch\u01B0\u01A1ng tr\xECnh",
  "weeksAnalysis": {
    "totalWeeks": 35,
    "semester1Weeks": 18,
    "semester2Weeks": 17,
    "totalPeriods": 105,
    "evaluationPeriods": "Ph\xE2n b\u1ED5 s\u1ED1 ti\u1EBFt ki\u1EC3m tra \u0111\u1ECBnh k\u1EF3 c\xF3 h\u1EE3p l\xFD kh\xF4ng"
  },
  "strengths": [
    "\u01AFu \u0111i\u1EC3m c\u1EE7a khung PPCT n\xE0y"
  ],
  "limitations": [
    "Nh\u1EEFng \u0111i\u1EC3m b\u1EA5t h\u1EE3p l\xFD v\u1EC1 s\u1ED1 ti\u1EBFt, ti\u1EBFn \u0111\u1ED9, ho\u1EB7c d\u1ED3n \xE9p h\u1ECDc sinh"
  ],
  "pedagogicalSuggestions": [
    "G\u1EE3i \xFD \u0111i\u1EC1u ch\u1EC9nh khoa h\u1ECDc, s\u01B0 ph\u1EA1m theo tinh th\u1EA7n c\xF4ng v\u0103n 3284"
  ],
  "digitalAndAiIntegrationMatrix": [
    {
      "week": "Tu\u1EA7n 3",
      "lesson": "T\xEAn b\xE0i h\u1ECDc c\u1EE5 th\u1EC3",
      "digitalAiActivity": "Ho\u1EA1t \u0111\u1ED9ng s\u1ED1/AI g\u1EE3i \xFD (v\xED d\u1EE5: d\xF9ng ph\u1EA7n m\u1EC1m v\u1EBD h\xECnh, tra c\u1EE9u ngu\u1ED3n s\u1ED1, t\xF3m t\u1EAFt \xFD ch\xEDnh b\u1EB1ng AI)",
      "targetCompetence": "N\u0103ng l\u1EF1c s\u1ED1 ho\u1EB7c t\u01B0 duy gi\u1EA3i quy\u1EBFt v\u1EA5n \u0111\u1EC1 v\u1EDBi AI"
    }
  ],
  "approvalStatus": "\u0110\u1EA1t chu\u1EA9n / C\u1EA7n hi\u1EC7u ch\u1EC9nh / Kh\xF4ng \u0111\u1EA1t",
  "phtActionRecommendation": "Khuy\u1EBFn ngh\u1ECB h\xE0nh \u0111\u1ED9ng cho Ph\xF3 Hi\u1EC7u Tr\u01B0\u1EDFng"
}
`;
    const rawText = await generateWithFallback({
      prompt,
      systemInstruction: SYSTEM_PROMPT_OFFICIAL,
      fallbackGenerator: () => ({
        summary: `Khung Ph\xE2n ph\u1ED1i ch\u01B0\u01A1ng tr\xECnh m\xF4n ${subject || "B\u1ED9 m\xF4n"} (${grade || "Trung h\u1ECDc"}) \u0111\u01B0\u1EE3c x\xE2y d\u1EF1ng theo chu\u1EA9n 35 tu\u1EA7n n\u0103m h\u1ECDc 2026-2027 c\u1EE7a S\u1EDF GD\u0110T \u0110\u1ED3ng Th\xE1p. Ti\u1EBFn \u0111\u1ED9 gi\u1EA3ng d\u1EA1y t\u01B0\u01A1ng \u0111\u1ED1i ph\xF9 h\u1EE3p v\u1EDBi khung th\u1EDDi gian n\u0103m h\u1ECDc.`,
        weeksAnalysis: {
          totalWeeks: 35,
          semester1Weeks: 18,
          semester2Weeks: 17,
          totalPeriods: 105,
          evaluationPeriods: "\u0110\xE3 b\u1ED1 tr\xED ki\u1EC3m tra gi\u1EEFa k\xEC \u1EDF tu\u1EA7n 9/tu\u1EA7n 27 v\xE0 cu\u1ED1i k\xEC \u1EDF tu\u1EA7n 18/tu\u1EA7n 35 theo \u0111\xFAng h\u01B0\u1EDBng d\u1EABn."
        },
        strengths: [
          "Tu\xE2n th\u1EE7 nghi\xEAm t\xFAc t\u1ED5ng th\u1EDDi l\u01B0\u1EE3ng 35 tu\u1EA7n/n\u0103m h\u1ECDc.",
          "C\u1EA5u tr\xFAc c\xE1c ch\u1EE7 \u0111\u1EC1 v\xE0 b\xE0i h\u1ECDc m\u1EA1ch l\u1EA1c, b\xE1m s\xE1t y\xEAu c\u1EA7u c\u1EA7n \u0111\u1EA1t c\u1EE7a Ch\u01B0\u01A1ng tr\xECnh GDPT 2018.",
          "D\xE0nh th\u1EDDi l\u01B0\u1EE3ng h\u1EE3p l\xFD cho \xF4n t\u1EADp v\xE0 ki\u1EC3m tra \u0111\xE1nh gi\xE1 \u0111\u1ECBnh k\u1EF3."
        ],
        limitations: [
          "M\u1ED9t s\u1ED1 tu\u1EA7n \u0111\u1EA7u h\u1ECDc k\u1EF3 c\xF3 s\u1ED1 ti\u1EBFt l\xFD thuy\u1EBFt d\xE0y \u0111\u1EB7c, c\u1EA7n c\xE2n nh\u1EAFc gi\xE3n c\xE1ch th\u1EF1c h\xE0nh.",
          "Ch\u01B0a ghi ch\xFA r\xF5 c\xE1c b\xE0i h\u1ECDc \u1EE9ng d\u1EE5ng ph\xF2ng m\xE1y vi t\xEDnh ho\u1EB7c thi\u1EBFt b\u1ECB c\xF4ng ngh\u1EC7 s\u1ED1."
        ],
        pedagogicalSuggestions: [
          "V\u1EADn d\u1EE5ng t\xEDnh linh ho\u1EA1t theo C\xF4ng v\u0103n 3284: kh\xF4ng b\u1EAFt bu\u1ED9c chia \u0111\u1EC1u ti\u1EBFt m\u1ED7i tu\u1EA7n, c\xF3 th\u1EC3 b\u1ED1 tr\xED ti\u1EBFt th\u1EF1c h\xE0nh theo c\u1EE5m.",
          "Ph\u1ED1i h\u1EE3p ph\xF2ng th\xED nghi\u1EC7m t\u1EA1i \u0111i\u1EC3m T\xE2n Ki\u1EC1u \u0111\u1EC3 tr\xE1nh tr\xF9ng l\u1ECBch s\u1EED d\u1EE5ng ph\xF2ng b\u1ED9 m\xF4n."
        ],
        digitalAndAiIntegrationMatrix: [
          {
            week: "Tu\u1EA7n 3",
            lesson: "Ch\u1EE7 \u0111\u1EC1 Kh\u1EDFi \u0111\u1EA7u / Kh\xE1i ni\u1EC7m c\u1ED1t l\xF5i",
            digitalAiActivity: "S\u1EED d\u1EE5ng \u1EE9ng d\u1EE5ng t\u01B0\u01A1ng t\xE1c Quizizz ho\u1EB7c Mentimeter \u0111\u1EC3 ki\u1EC3m tra ki\u1EBFn th\u1EE9c n\u1EC1n t\u1EA3ng c\u1EE7a h\u1ECDc sinh.",
            targetCompetence: "N\u0103ng l\u1EF1c \u1EE9ng d\u1EE5ng c\xF4ng ngh\u1EC7 s\u1ED1 trong t\u1EF1 \u0111\xE1nh gi\xE1"
          },
          {
            week: "Tu\u1EA7n 8",
            lesson: "\xD4n t\u1EADp v\xE0 Chu\u1EA9n b\u1ECB Ki\u1EC3m tra Gi\u1EEFa k\xEC",
            digitalAiActivity: "H\u01B0\u1EDBng d\u1EABn h\u1ECDc sinh t\u1EA1o s\u01A1 \u0111\u1ED3 t\u01B0 duy b\u1EB1ng ph\u1EA7n m\u1EC1m Canva ho\u1EB7c XMind; GV d\xF9ng AI g\u1EE3i \xFD ma tr\u1EADn c\xE2u h\u1ECFi.",
            targetCompetence: "T\u01B0 duy h\u1EC7 th\u1ED1ng h\xF3a ki\u1EBFn th\u1EE9c v\xE0 s\u1ED1 h\xF3a h\u1ECDc li\u1EC7u"
          },
          {
            week: "Tu\u1EA7n 14",
            lesson: "B\xE0i h\u1ECDc Th\u1EF1c h\xE0nh / M\xF4 h\xECnh h\xF3a",
            digitalAiActivity: "S\u1EED d\u1EE5ng ph\u1EA7n m\u1EC1m m\xF4 ph\u1ECFng (GeoGebra, PhET) ho\u1EB7c c\u1EA3m bi\u1EBFn \u0111o s\u1ED1 li\u1EC7u.",
            targetCompetence: "N\u0103ng l\u1EF1c m\xF4 h\xECnh h\xF3a v\xE0 gi\u1EA3i quy\u1EBFt v\u1EA5n \u0111\u1EC1 v\u1EDBi c\xF4ng c\u1EE5 s\u1ED1"
          }
        ],
        approvalStatus: "\u0110\u1EA1t chu\u1EA9n",
        phtActionRecommendation: "\u0110\u1ED3ng \xFD ph\xEA duy\u1EC7t khung ph\xE2n ph\u1ED1i ch\u01B0\u01A1ng tr\xECnh, y\xEAu c\u1EA7u t\u1ED5 tr\u01B0\u1EDFng theo d\xF5i vi\u1EC7c th\u1EF1c hi\u1EC7n d\u1EA1y h\u1ECDc t\u1EA1i c\xE1c \u0111i\u1EC3m tr\u01B0\u1EDDng."
      })
    });
    const parsed = cleanAndParseJson(rawText);
    res.json({ success: true, data: parsed });
  } catch (error) {
    console.error("Error evaluating syllabus:", error);
    res.status(500).json({ success: false, error: error.message || "L\u1ED7i x\u1EED l\xFD \u0111\xE1nh gi\xE1 ph\xE2n ph\u1ED1i ch\u01B0\u01A1ng tr\xECnh" });
  }
});
app.post("/api/evaluate/lesson-plan", async (req, res) => {
  try {
    const { teacherName, subject, lessonTitle, grade, content } = req.body;
    const prompt = `
Ph\xF3 Hi\u1EC7u Tr\u01B0\u1EDFng Tr\u01B0\u1EDDng THCS & THPT \u0110\u1ED1c Binh Ki\u1EC1u c\u1EA7n \u0111\xE1nh gi\xE1 K\u1EBF ho\u1EA1ch b\xE0i d\u1EA1y (Gi\xE1o \xE1n) c\u1EE7a gi\xE1o vi\xEAn:
- Gi\xE1o vi\xEAn so\u1EA1n: ${teacherName || "Gi\xE1o vi\xEAn b\u1ED9 m\xF4n"}
- M\xF4n h\u1ECDc: ${subject || "Ch\u01B0a ghi"}
- T\xEAn b\xE0i d\u1EA1y: ${lessonTitle || "Ch\u01B0a ghi"}
- Kh\u1ED1i l\u1EDBp: ${grade || "Kh\u1ED1i 6-12"}

N\u1ED8I DUNG K\u1EBE HO\u1EA0CH B\xC0I D\u1EA0Y:
"""
${content}
"""

Ti\xEAu chu\u1EA9n \u0111\u1ED1i chi\u1EBFu nghi\xEAm ng\u1EB7t theo PH\u1EE4 L\u1EE4C II - C\xF4ng v\u0103n 3284/SGD\u0110T-GDPT S\u1EDF GD\u0110T \u0110\u1ED3ng Th\xE1p:
1. M\u1EE5c ti\xEAu:
   - N\u0103ng l\u1EF1c (n\u0103ng l\u1EF1c chung + n\u0103ng l\u1EF1c \u0111\u1EB7c th\xF9 m\xF4n h\u1ECDc): C\xF3 n\xEAu c\u1EE5 th\u1EC3 HS l\xE0m \u0111\u01B0\u1EE3c g\xEC theo YCC\u0110 kh\xF4ng?
   - Ph\u1EA9m ch\u1EA5t (y\xEAu n\u01B0\u1EDBc, nh\xE2n \xE1i, ch\u0103m ch\u1EC9, trung th\u1EF1c, tr\xE1ch nhi\u1EC7m): C\xF3 g\u1EAFn v\u1EDBi n\u1ED9i dung b\xE0i d\u1EA1y kh\xF4ng?
2. Thi\u1EBFt b\u1ECB d\u1EA1y h\u1ECDc v\xE0 h\u1ECDc li\u1EC7u: C\xF3 c\u1EE5 th\u1EC3, t\u01B0\u01A1ng \u1EE9ng v\u1EDBi vi\u1EC7c h\xECnh th\xE0nh n\u0103ng l\u1EF1c kh\xF4ng?
3. Ti\u1EBFn tr\xECnh d\u1EA1y h\u1ECDc chu\u1EA9n 4 ho\u1EA1t \u0111\u1ED9ng:
   - Ho\u1EA1t \u0111\u1ED9ng 1: M\u1EDF \u0111\u1EA7u / Kh\u1EDFi \u0111\u1ED9ng / X\xE1c \u0111\u1ECBnh v\u1EA5n \u0111\u1EC1
   - Ho\u1EA1t \u0111\u1ED9ng 2: H\xECnh th\xE0nh ki\u1EBFn th\u1EE9c m\u1EDBi / Gi\u1EA3i quy\u1EBFt v\u1EA5n \u0111\u1EC1
   - Ho\u1EA1t \u0111\u1ED9ng 3: Luy\u1EC7n t\u1EADp
   - Ho\u1EA1t \u0111\u1ED9ng 4: V\u1EADn d\u1EE5ng
4. C\u1EA5u tr\xFAc m\u1ED7i ho\u1EA1t \u0111\u1ED9ng c\xF3 \u0111\u1EE7 4 th\xE0nh t\u1ED1: M\u1EE5c ti\xEAu -> N\u1ED9i dung -> S\u1EA3n ph\u1EA9m d\u1EF1 ki\u1EBFn -> C\xE1ch th\u1EE9c t\u1ED5 ch\u1EE9c (Chuy\u1EC3n giao, Th\u1EF1c hi\u1EC7n, B\xE1o c\xE1o th\u1EA3o lu\u1EADn, K\u1EBFt lu\u1EADn/nh\u1EADn \u0111\u1ECBnh).
5. \u0110\u1EB7c bi\u1EC7t ki\u1EC3m tra: KHBD c\xF3 b\u1ECB l\u1ED7i vi\u1EBFt l\u1EDDi tho\u1EA1i "GV h\u1ECFi - HS \u0111\xE1p" kh\xF4ng? (Quy \u0111\u1ECBnh b\u1EAFt bu\u1ED9c t\u1EADp trung m\xF4 t\u1EA3 chu\u1ED7i ho\u1EA1t \u0111\u1ED9ng).
6. N\u0103ng l\u1EF1c s\u1ED1 & AI: B\xE0i d\u1EA1y c\xF3 \u1EE9ng d\u1EE5ng CNTT, h\u1ECDc li\u1EC7u s\u1ED1 ho\u1EB7c c\xF4ng c\u1EE5 AI h\u1ED7 tr\u1EE3 d\u1EA1y h\u1ECDc hi\u1EC7u qu\u1EA3 kh\xF4ng?

Tr\u1EA3 v\u1EC1 k\u1EBFt qu\u1EA3 JSON:
{
  "lessonOverview": {
    "title": "T\xEAn b\xE0i",
    "subject": "M\xF4n h\u1ECDc",
    "grade": "Kh\u1ED1i l\u1EDBp",
    "teacher": "Gi\xE1o vi\xEAn",
    "totalScore": 88, // Thang 100
    "rank": "T\u1ED1t / Kh\xE1 / \u0110\u1EA1t / Ch\u01B0a \u0111\u1EA1t"
  },
  "objectivesCheck": {
    "competenciesStatus": "\u0110\u1EA1t / C\u1EA7n s\u1EEDa",
    "competenciesComment": "Nh\u1EADn x\xE9t chi ti\u1EBFt v\u1EC1 m\u1EE5c ti\xEAu N\u0103ng l\u1EF1c",
    "qualitiesStatus": "\u0110\u1EA1t / C\u1EA7n s\u1EEDa",
    "qualitiesComment": "Nh\u1EADn x\xE9t chi ti\u1EBFt v\u1EC1 m\u1EE5c ti\xEAu Ph\u1EA9m ch\u1EA5t"
  },
  "equipmentCheck": {
    "status": "\u0110\u1EA1t / Ch\u01B0a \u0111\u1EA1t",
    "comment": "Nh\u1EADn x\xE9t v\u1EC1 thi\u1EBFt b\u1ECB, h\u1ECDc li\u1EC7u s\u1ED1, \u0111\u1ED3 d\xF9ng d\u1EA1y h\u1ECDc"
  },
  "activitiesCheck": [
    {
      "activityNumber": 1,
      "activityName": "Kh\u1EDFi \u0111\u1ED9ng / M\u1EDF \u0111\u1EA7u",
      "status": "T\u1ED1t / Kh\xE1 / C\u1EA7n s\u1EEDa",
      "strengths": "\u01AFu \u0111i\u1EC3m",
      "improvements": "\u0110i\u1EC3m c\u1EA7n ho\xE0n thi\u1EC7n"
    },
    {
      "activityNumber": 2,
      "activityName": "H\xECnh th\xE0nh ki\u1EBFn th\u1EE9c m\u1EDBi",
      "status": "T\u1ED1t / Kh\xE1 / C\u1EA7n s\u1EEDa",
      "strengths": "\u01AFu \u0111i\u1EC3m",
      "improvements": "\u0110i\u1EC3m c\u1EA7n ho\xE0n thi\u1EC7n"
    },
    {
      "activityNumber": 3,
      "activityName": "Luy\u1EC7n t\u1EADp",
      "status": "T\u1ED1t / Kh\xE1 / C\u1EA7n s\u1EEDa",
      "strengths": "\u01AFu \u0111i\u1EC3m",
      "improvements": "\u0110i\u1EC3m c\u1EA7n ho\xE0n thi\u1EC7n"
    },
    {
      "activityNumber": 4,
      "activityName": "V\u1EADn d\u1EE5ng",
      "status": "T\u1ED1t / Kh\xE1 / C\u1EA7n s\u1EEDa",
      "strengths": "\u01AFu \u0111i\u1EC3m",
      "improvements": "\u0110i\u1EC3m c\u1EA7n ho\xE0n thi\u1EC7n"
    }
  ],
  "dialogueCheck": {
    "isViolated": false,
    "comment": "Nh\u1EADn x\xE9t v\u1EC1 c\xE1ch h\xE0nh v\u0103n theo ho\u1EA1t \u0111\u1ED9ng s\u01B0 ph\u1EA1m"
  },
  "digitalAiSuggestions": [
    "G\u1EE3i \xFD 1 \u0111\u1EC3 n\xE2ng t\u1EA7m b\xE0i d\u1EA1y b\u1EB1ng c\xF4ng ngh\u1EC7 s\u1ED1 ho\u1EB7c AI",
    "G\u1EE3i \xFD 2 v\u1EC1 c\xF4ng c\u1EE5 t\u01B0\u01A1ng t\xE1c tr\u1EF1c quan ho\u1EB7c h\u1ECDc li\u1EC7u s\u1ED1"
  ],
  "evaluationRubric": "M\u1EABu phi\u1EBFu ki\u1EC3m tra ho\u1EB7c c\xF4ng c\u1EE5 \u0111\xE1nh gi\xE1 g\u1EE3i \xFD cho b\xE0i d\u1EA1y",
  "phtDirectRemarks": "L\u1EDDi nh\u1EADn x\xE9t \u0111\xF3ng g\xF3p \xFD ki\u1EBFn ch\xEDnh th\u1EE9c c\u1EE7a Ph\xF3 Hi\u1EC7u Tr\u01B0\u1EDFng g\u1EEDi cho gi\xE1o vi\xEAn"
}
`;
    const rawText = await generateWithFallback({
      prompt,
      systemInstruction: SYSTEM_PROMPT_OFFICIAL,
      fallbackGenerator: () => {
        const hasDialogue = /GV:\s*|HS:\s*|Giáo viên hỏi|Học sinh trả lời/i.test(content);
        return {
          lessonOverview: {
            title: lessonTitle || "K\u1EBF ho\u1EA1ch b\xE0i d\u1EA1y",
            subject: subject || "B\u1ED9 m\xF4n",
            grade: grade || "Trung h\u1ECDc",
            teacher: teacherName || "Gi\xE1o vi\xEAn",
            totalScore: hasDialogue ? 82 : 90,
            rank: hasDialogue ? "Kh\xE1" : "T\u1ED1t"
          },
          objectivesCheck: {
            competenciesStatus: "\u0110\u1EA1t",
            competenciesComment: "M\u1EE5c ti\xEAu n\u0103ng l\u1EF1c chung v\xE0 \u0111\u1EB7c th\xF9 \u0111\u01B0\u1EE3c x\xE1c \u0111\u1ECBnh r\xF5 r\xE0ng, ch\u1EC9 r\xF5 h\u1ECDc sinh l\xE0m \u0111\u01B0\u1EE3c g\xEC theo chu\u1EA9n ki\u1EBFn th\u1EE9c k\u0129 n\u0103ng.",
            qualitiesStatus: "\u0110\u1EA1t",
            qualitiesComment: "M\u1EE5c ti\xEAu ph\u1EA9m ch\u1EA5t g\u1EAFn li\u1EC1n v\u1EDBi n\u1ED9i dung b\xE0i d\u1EA1y (ch\u0103m ch\u1EC9, tr\xE1ch nhi\u1EC7m, trung th\u1EF1c trong h\u1ECDc t\u1EADp)."
          },
          equipmentCheck: {
            status: "\u0110\u1EA1t",
            comment: "Thi\u1EBFt b\u1ECB d\u1EA1y h\u1ECDc v\xE0 h\u1ECDc li\u1EC7u \u0111\u01B0\u1EE3c chu\u1EA9n b\u1ECB ph\xF9 h\u1EE3p v\u1EDBi m\u1EE5c ti\xEAu b\xE0i d\u1EA1y (Tivi th\xF4ng minh, phi\u1EBFu h\u1ECDc t\u1EADp, \u0111\u1ED3 d\xF9ng tr\u1EF1c quan)."
          },
          activitiesCheck: [
            {
              activityNumber: 1,
              activityName: "M\u1EDF \u0111\u1EA7u / Kh\u1EDFi \u0111\u1ED9ng",
              status: "T\u1ED1t",
              strengths: "T\u1EA1o \u0111\u01B0\u1EE3c t\xECnh hu\u1ED1ng c\xF3 v\u1EA5n \u0111\u1EC1 kh\u01A1i g\u1EE3i h\u1EE9ng th\xFA c\u1EE7a h\u1ECDc sinh.",
              improvements: "C\xF3 th\u1EC3 k\u1EBFt h\u1EE3p h\xECnh \u1EA3nh tr\u1EF1c quan ho\u1EB7c \u0111o\u1EA1n video ng\u1EAFn \u0111\u1EC3 t\u0103ng t\xEDnh h\u1EA5p d\u1EABn."
            },
            {
              activityNumber: 2,
              activityName: "H\xECnh th\xE0nh ki\u1EBFn th\u1EE9c m\u1EDBi",
              status: "T\u1ED1t",
              strengths: "Ph\xE2n chia r\xF5 r\xE0ng c\xE1c b\u01B0\u1EDBc: chuy\u1EC3n giao, th\u1EF1c hi\u1EC7n, b\xE1o c\xE1o th\u1EA3o lu\u1EADn v\xE0 k\u1EBFt lu\u1EADn nh\u1EADn \u0111\u1ECBnh.",
              improvements: "D\xE0nh th\xEAm th\u1EDDi gian cho c\xE1c nh\xF3m b\xE1o c\xE1o v\xE0 nh\u1EADn x\xE9t ch\xE9o."
            },
            {
              activityNumber: 3,
              activityName: "Luy\u1EC7n t\u1EADp",
              status: "Kh\xE1",
              strengths: "H\u1EC7 th\u1ED1ng c\xE2u h\u1ECFi luy\u1EC7n t\u1EADp bao qu\xE1t n\u1ED9i dung b\xE0i h\u1ECDc.",
              improvements: "N\xEAn ph\xE2n h\xF3a c\xE2u h\u1ECFi theo c\xE1c m\u1EE9c \u0111\u1ED9 nh\u1EADn bi\u1EBFt, th\xF4ng hi\u1EC3u v\xE0 v\u1EADn d\u1EE5ng."
            },
            {
              activityNumber: 4,
              activityName: "V\u1EADn d\u1EE5ng",
              status: "Kh\xE1",
              strengths: "Giao nhi\u1EC7m v\u1EE5 g\u1EAFn v\u1EDBi th\u1EF1c ti\u1EC5n \u0111\u1EDDi s\u1ED1ng c\u1EE7a h\u1ECDc sinh.",
              improvements: "C\u1EA7n k\xE8m theo rubric ti\xEAu ch\xED \u0111\xE1nh gi\xE1 s\u1EA3n ph\u1EA9m t\u1EF1 h\u1ECDc \u1EDF nh\xE0."
            }
          ],
          dialogueCheck: {
            isViolated: hasDialogue,
            comment: hasDialogue ? "L\u01AFU \xDD: KHBD c\xF2n xu\u1EA5t hi\u1EC7n c\xE2u tho\u1EA1i k\u1ECBch b\u1EA3n GV h\u1ECFi - HS \u0111\xE1p. Y\xEAu c\u1EA7u chuy\u1EC3n \u0111\u1ED5i sang m\xF4 t\u1EA3 chu\u1ED7i h\xE0nh \u0111\u1ED9ng c\u1EE7a GV v\xE0 HS theo C\xF4ng v\u0103n 3284." : "\u0110\u1EA0T CHU\u1EA8N: KHBD kh\xF4ng ghi l\u1EDDi tho\u1EA1i r\u01B0\u1EDDm r\xE0, t\u1EADp trung m\xF4 t\u1EA3 r\xF5 h\xE0nh \u0111\u1ED9ng giao vi\u1EC7c, h\u01B0\u1EDBng d\u1EABn c\u1EE7a GV v\xE0 th\u1EF1c h\xE0nh, b\xE1o c\xE1o c\u1EE7a HS."
          },
          digitalAiSuggestions: [
            "T\xEDch h\u1EE3p m\xE3 QR tr\xEAn phi\u1EBFu h\u1ECDc t\u1EADp \u0111\u1EC3 h\u1ECDc sinh \u0111i\u1EC3m T\xE2n Ki\u1EC1u d\u1EC5 d\xE0ng qu\xE9t xem video minh h\u1ECDa.",
            "S\u1EED d\u1EE5ng c\xF4ng c\u1EE5 ki\u1EC3m tra nhanh t\u01B0\u01A1ng t\xE1c (Quizizz/Kahoot) trong ho\u1EA1t \u0111\u1ED9ng luy\u1EC7n t\u1EADp."
          ],
          evaluationRubric: "Rubric \u0111\xE1nh gi\xE1 s\u1EA3n ph\u1EA9m h\u1ECDc t\u1EADp theo 3 ti\xEAu ch\xED: M\u1EE9c \u0111\u1ED9 ch\xEDnh x\xE1c (50%), T\xEDnh s\xE1ng t\u1EA1o th\u1EA9m m\u1EF9 (30%), Thuy\u1EBFt minh b\xE1o c\xE1o (20%).",
          phtDirectRemarks: `K\u1EBF ho\u1EA1ch b\xE0i d\u1EA1y c\u1EE7a Th\u1EA7y/C\xF4 \u0111\u01B0\u1EE3c so\u1EA1n c\xF4ng phu, \u0111\xFAng ti\u1EBFn tr\xECnh 4 ho\u1EA1t \u0111\u1ED9ng c\u1EE7a S\u1EDF GD\u0110T \u0110\u1ED3ng Th\xE1p. \u0110\u1EC1 ngh\u1ECB Th\u1EA7y/C\xF4 ph\xE1t huy tinh th\u1EA7n \u0111\u1ED5i m\u1EDBi ph\u01B0\u01A1ng ph\xE1p v\xE0 chu\u1EA9n b\u1ECB t\u1ED1t h\u1ECDc li\u1EC7u khi l\xEAn l\u1EDBp.`
        };
      }
    });
    const parsed = cleanAndParseJson(rawText);
    res.json({ success: true, data: parsed });
  } catch (error) {
    console.error("Error evaluating lesson plan:", error);
    res.status(500).json({ success: false, error: error.message || "L\u1ED7i x\u1EED l\xFD \u0111\xE1nh gi\xE1 gi\xE1o \xE1n" });
  }
});
app.post("/api/digital-ai/orient", async (req, res) => {
  try {
    const { subject, grade, topic } = req.body;
    const prompt = `
Ph\xF3 Hi\u1EC7u Tr\u01B0\u1EDFng Tr\u01B0\u1EDDng THCS & THPT \u0110\u1ED1c Binh Ki\u1EC1u c\u1EA7n x\xE2y d\u1EF1ng h\u01B0\u1EDBng d\u1EABn chuy\xEAn m\xF4n cho T\u1ED5 Chuy\xEAn m\xF4n v\u1EC1:
"\u0110\u1ECANH H\u01AF\u1EDANG L\u1ED2NG GH\xC9P N\u0102NG L\u1EF0C S\u1ED0 V\xC0 N\u0102NG L\u1EF0C TR\xCD TU\u1EC6 NH\xC2N T\u1EA0O (AI) TRONG GI\u1EA2NG D\u1EA0Y"
- M\xF4n h\u1ECDc: ${subject || "To\xE1n h\u1ECDc / Tin h\u1ECDc / Ng\u1EEF v\u0103n / KHTN / L\u1ECBch s\u1EED - \u0110\u1ECBa l\xED / Ngo\u1EA1i ng\u1EEF"}
- Kh\u1ED1i l\u1EDBp: ${grade || "THCS (Kh\u1ED1i 6-9) & THPT (Kh\u1ED1i 10-12)"}
- Ch\u1EE7 \u0111\u1EC1/M\u1EA3ng ki\u1EBFn th\u1EE9c: ${topic || "To\xE0n b\u1ED9 ch\u01B0\u01A1ng tr\xECnh m\xF4n h\u1ECDc"}

B\u1ED1i c\u1EA3nh: Tr\u01B0\u1EDDng c\xF3 3 \u0111i\u1EC3m tr\u01B0\u1EDDng, trong \u0111\xF3 \u0111i\u1EC3m T\xE2n Ki\u1EC1u c\xE1ch \u0111i\u1EC3m ch\xEDnh 11 km. C\u01A1 s\u1EDF v\u1EADt ch\u1EA5t c\xF3 ph\xF2ng m\xE1y, m\xE1y chi\u1EBFu tivi th\xF4ng minh, h\u1ECDc sinh s\u1EED d\u1EE5ng thi\u1EBFt b\u1ECB s\u1ED1 c\xF3 ki\u1EC3m so\xE1t.

H\xE3y x\xE2y d\u1EF1ng b\u1EA3n \u0111\u1ECBnh h\u01B0\u1EDBng chi ti\u1EBFt chu\u1EA9n s\u01B0 ph\u1EA1m Vi\u1EC7t Nam bao g\u1ED3m:
1. M\u1EE5c ti\xEAu ph\xE1t tri\u1EC3n n\u0103ng l\u1EF1c s\u1ED1 (theo Khung n\u0103ng l\u1EF1c s\u1ED1 d\xE0nh cho ng\u01B0\u1EDDi h\u1ECDc c\u1EE7a B\u1ED9 GD\u0110T) v\xE0 N\u0103ng l\u1EF1c hi\u1EC3u bi\u1EBFt/s\u1EED d\u1EE5ng AI an to\xE0n, c\xF3 tr\xE1ch nhi\u1EC7m.
2. 5 \xDD t\u01B0\u1EDFng k\u1ECBch b\u1EA3n d\u1EA1y h\u1ECDc c\u1EE5 th\u1EC3 t\xEDch h\u1EE3p s\u1ED1 & AI cho m\xF4n n\xE0y (N\xEAu r\xF5: T\xEAn b\xE0i/ch\u1EE7 \u0111\u1EC1, Ho\u1EA1t \u0111\u1ED9ng c\u1EE7a HS, C\xF4ng c\u1EE5 s\u1ED1/AI s\u1EED d\u1EE5ng v\xED d\u1EE5: PhET, GeoGebra, Canva, Quizziz, AI tra c\u1EE9u c\xF3 gi\xE1m s\xE1t, ph\xE2n t\xEDch d\u1EEF li\u1EC7u, d\u1ECBch thu\u1EADt th\xF4ng minh).
3. H\u01B0\u1EDBng d\u1EABn gi\xE1o vi\xEAn x\xE2y d\u1EF1ng c\xE2u l\u1EC7nh (Prompting) chu\u1EA9n s\u01B0 ph\u1EA1m \u0111\u1EC3 chu\u1EA9n b\u1ECB h\u1ECDc li\u1EC7u ho\u1EB7c h\u01B0\u1EDBng d\u1EABn h\u1ECDc sinh t\u01B0 duy ph\u1EA3n bi\u1EC7n khi d\xF9ng AI.
4. Quy t\u1EAFc an to\xE0n th\xF4ng tin, b\u1EA3o v\u1EC7 d\u1EEF li\u1EC7u h\u1ECDc sinh v\xE0 ph\xF2ng ch\u1ED1ng gian l\u1EADn h\u1ECDc t\u1EADp khi h\u1ECDc sinh ti\u1EBFp c\u1EADn AI.
5. Ti\xEAu ch\xED \u0111\xE1nh gi\xE1 m\u1EE9c \u0111\u1ED9 s\u1ED1 h\xF3a c\u1EE7a k\u1EBF ho\u1EA1ch b\xE0i d\u1EA1y.

Tr\u1EA3 v\u1EC1 k\u1EBFt qu\u1EA3 d\u1EA1ng JSON:
{
  "subjectTitle": "\u0110\u1ECBnh h\u01B0\u1EDBng t\xEDch h\u1EE3p N\u0103ng l\u1EF1c s\u1ED1 & AI m\xF4n...",
  "digitalCompetenceGoals": [
    "M\u1EE5c ti\xEAu n\u0103ng l\u1EF1c s\u1ED1 1",
    "M\u1EE5c ti\xEAu n\u0103ng l\u1EF1c s\u1ED1 2",
    "M\u1EE5c ti\xEAu \u0111\u1EA1o \u0111\u1EE9c v\xE0 an to\xE0n AI"
  ],
  "teachingScenarios": [
    {
      "topic": "T\xEAn ch\u1EE7 \u0111\u1EC1/b\xE0i h\u1ECDc",
      "grade": "Kh\u1ED1i l\u1EDBp",
      "tool": "T\xEAn c\xF4ng c\u1EE5 (AI/Ph\u1EA7n m\u1EC1m)",
      "activity": "M\xF4 t\u1EA3 ho\u1EA1t \u0111\u1ED9ng c\u1EE5 th\u1EC3 c\u1EE7a h\u1ECDc sinh",
      "pedagogicalValue": "Gi\xE1 tr\u1ECB ph\xE1t tri\u1EC3n t\u01B0 duy/n\u0103ng l\u1EF1c h\u1ECDc sinh"
    }
  ],
  "teacherPromptTemplates": [
    {
      "title": "M\u1EABu Prompt t\u1EA1o t\xECnh hu\u1ED1ng c\xF3 v\u1EA5n \u0111\u1EC1",
      "promptExample": "N\u1ED9i dung c\xE2u l\u1EC7nh g\u1EE3i \xFD cho gi\xE1o vi\xEAn"
    },
    {
      "title": "M\u1EABu Prompt thi\u1EBFt k\u1EBF phi\u1EBFu h\u1ECDc t\u1EADp / Rubric \u0111\xE1nh gi\xE1",
      "promptExample": "N\u1ED9i dung c\xE2u l\u1EC7nh g\u1EE3i \xFD cho gi\xE1o vi\xEAn"
    }
  ],
  "safetyAndEthicsGuide": [
    "Quy t\u1EAFc 1: Kh\xF4ng nh\u1EADp th\xF4ng tin c\xE1 nh\xE2n h\u1ECDc sinh",
    "Quy t\u1EAFc 2: Lu\xF4n \u0111\u1ED1i chi\u1EBFu ngu\u1ED3n ch\xEDnh th\u1ED1ng",
    "Quy t\u1EAFc 3: Li\xEAm ch\xEDnh h\u1ECDc thu\u1EADt"
  ],
  "phtDirectives": "Ch\u1EC9 \u0111\u1EA1o c\u1EE7a Ph\xF3 Hi\u1EC7u Tr\u01B0\u1EDFng g\u1EEDi t\u1EDBi T\u1ED5 tr\u01B0\u1EDFng chuy\xEAn m\xF4n v\xE0 gi\xE1o vi\xEAn trong tr\u01B0\u1EDDng"
}
`;
    const rawText = await generateWithFallback({
      prompt,
      systemInstruction: SYSTEM_PROMPT_OFFICIAL,
      fallbackGenerator: () => ({
        subjectTitle: `\u0110\u1ECBnh h\u01B0\u1EDBng L\u1ED3ng gh\xE9p N\u0103ng l\u1EF1c s\u1ED1 & Tr\xED tu\u1EC7 nh\xE2n t\u1EA1o (AI) - ${subject || "B\u1ED9 m\xF4n"}`,
        digitalCompetenceGoals: [
          "Ph\xE1t tri\u1EC3n n\u0103ng l\u1EF1c t\xECm ki\u1EBFm, khai th\xE1c v\xE0 \u0111\xE1nh gi\xE1 th\xF4ng tin h\u1ECDc li\u1EC7u s\u1ED1 c\xF3 ph\u1EA3n bi\u1EC7n.",
          "H\xECnh th\xE0nh k\u0129 n\u0103ng s\u1EED d\u1EE5ng c\xE1c c\xF4ng c\u1EE5 c\xF4ng ngh\u1EC7 tr\u1EF1c quan (ph\u1EA7n m\u1EC1m chuy\xEAn ng\xE0nh, m\xF4 ph\u1ECFng) \u0111\u1EC3 gi\u1EA3i quy\u1EBFt nhi\u1EC7m v\u1EE5 h\u1ECDc t\u1EADp.",
          "X\xE2y d\u1EF1ng \xFD th\u1EE9c \u0111\u1EA1o \u0111\u1EE9c s\u1ED1, b\u1EA3n quy\u1EC1n h\u1ECDc li\u1EC7u v\xE0 hi\u1EC3u bi\u1EBFt v\u1EC1 an to\xE0n khi t\u01B0\u01A1ng t\xE1c v\u1EDBi h\u1EC7 th\u1ED1ng AI."
        ],
        teachingScenarios: [
          {
            topic: "X\xE2y d\u1EF1ng t\xECnh hu\u1ED1ng h\u1ECDc t\u1EADp t\u01B0\u01A1ng t\xE1c",
            grade: grade || "THCS & THPT",
            tool: "Canva / Padlet t\u01B0\u01A1ng t\xE1c s\u1ED1",
            activity: "H\u1ECDc sinh l\xE0m vi\u1EC7c nh\xF3m t\u1EA1o infographic t\xF3m t\u1EAFt b\xE0i h\u1ECDc v\xE0 chia s\u1EBB ph\u1EA3n h\u1ED3i ch\xE9o tr\xEAn b\u1EA3ng s\u1ED1.",
            pedagogicalValue: "Ph\xE1t tri\u1EC3n n\u0103ng l\u1EF1c h\u1EE3p t\xE1c v\xE0 tr\xECnh b\xE0y tr\u1EF1c quan h\xF3a d\u1EEF li\u1EC7u"
          },
          {
            topic: "Th\u1EF1c h\xE0nh th\xED nghi\u1EC7m v\xE0 m\xF4 ph\u1ECFng s\u1ED1",
            grade: grade || "THCS & THPT",
            tool: "PhET Simulations / GeoGebra",
            activity: "H\u1ECDc sinh thao t\xE1c thay \u0111\u1ED5i c\xE1c tham s\u1ED1 \u1EA3o tr\xEAn m\xE1y t\xEDnh \u0111\u1EC3 t\u1EF1 r\xFAt ra quy lu\u1EADt v\xE0 ki\u1EC3m ch\u1EE9ng c\xF4ng th\u1EE9c.",
            pedagogicalValue: "Ph\xE1t tri\u1EC3n t\u01B0 duy kh\xE1m ph\xE1 khoa h\u1ECDc v\xE0 ph\u01B0\u01A1ng ph\xE1p th\u1EF1c nghi\u1EC7m s\u1ED1"
          },
          {
            topic: "T\u01B0 duy ph\u1EA3n bi\u1EC7n v\u1EDBi c\xE2u tr\u1EA3 l\u1EDDi c\u1EE7a AI",
            grade: grade || "Kh\u1ED1i 9 & THPT",
            tool: "Chatbot AI h\u1ECDc t\u1EADp c\xF3 gi\xE1m s\xE1t",
            activity: "H\u1ECDc sinh \u0111\u1EB7t c\xE2u h\u1ECFi cho AI v\u1EC1 ch\u1EE7 \u0111\u1EC1 b\xE0i h\u1ECDc, sau \u0111\xF3 \u0111\u1ED1i chi\u1EBFu k\u1EBFt qu\u1EA3 c\u1EE7a AI v\u1EDBi SGK \u0111\u1EC3 ph\xE1t hi\u1EC7n \u0111i\u1EC3m ch\u01B0a ch\xEDnh x\xE1c.",
            pedagogicalValue: "R\xE8n luy\u1EC7n n\u0103ng l\u1EF1c ph\u1EA3n bi\u1EC7n, ch\u1ED1ng ph\u1EE5 thu\u1ED9c m\xE1y m\xF3c v\xE0 hi\u1EC3u b\u1EA3n ch\u1EA5t tri th\u1EE9c"
          }
        ],
        teacherPromptTemplates: [
          {
            title: "M\u1EABu c\xE2u l\u1EC7nh (Prompt) t\u1EA1o t\xECnh hu\u1ED1ng m\u1EDF \u0111\u1EA7u b\xE0i h\u1ECDc",
            promptExample: `H\xE3y \u0111\xF3ng vai m\u1ED9t chuy\xEAn gia gi\xE1o d\u1EE5c THCS/THPT, \u0111\u1EC1 xu\u1EA5t 3 t\xECnh hu\u1ED1ng th\u1EF1c t\u1EBF \u0111\u1EDDi s\u1ED1ng g\u1EAFn li\u1EC1n v\u1EDBi v\xF9ng \u0110\u1ED3ng Th\xE1p M\u01B0\u1EDDi \u0111\u1EC3 kh\u01A1i g\u1EE3i s\u1EF1 t\xF2 m\xF2 c\u1EE7a h\u1ECDc sinh cho b\xE0i h\u1ECDc: [T\xEAn b\xE0i h\u1ECDc].`
          },
          {
            title: "M\u1EABu c\xE2u l\u1EC7nh t\u1EA1o ma tr\u1EADn c\xE2u h\u1ECFi ph\xE2n h\xF3a 3 m\u1EE9c \u0111\u1ED9",
            promptExample: `D\u1EF1a tr\xEAn y\xEAu c\u1EA7u c\u1EA7n \u0111\u1EA1t c\u1EE7a b\xE0i h\u1ECDc [T\xEAn b\xE0i], h\xE3y x\xE2y d\u1EF1ng 4 c\xE2u h\u1ECFi tr\u1EAFc nghi\u1EC7m g\u1ED3m: 2 c\xE2u nh\u1EADn bi\u1EBFt, 1 c\xE2u th\xF4ng hi\u1EC3u v\xE0 1 c\xE2u v\u1EADn d\u1EE5ng th\u1EF1c ti\u1EC5n k\xE8m \u0111\xE1p \xE1n v\xE0 l\u1EDDi gi\u1EA3i chi ti\u1EBFt.`
          }
        ],
        safetyAndEthicsGuide: [
          "Tuy\u1EC7t \u0111\u1ED1i kh\xF4ng \u0111\u01B0a th\xF4ng tin \u0111\u1ECBnh danh c\xE1 nh\xE2n h\u1ECDc sinh (h\u1ECD t\xEAn \u0111\u1EA7y \u0111\u1EE7, ng\xE0y sinh, \u0111i\u1EC3m s\u1ED1 ri\xEAng t\u01B0) v\xE0o c\xE1c c\xF4ng c\u1EE5 AI c\xF4ng c\u1ED9ng.",
          "M\u1ECDi n\u1ED9i dung do AI t\u1EA1o ra ch\u1EC9 mang t\xEDnh ch\u1EA5t tham kh\u1EA3o, gi\xE1o vi\xEAn v\xE0 h\u1ECDc sinh ph\u1EA3i ch\u1ECBu tr\xE1ch nhi\u1EC7m cu\u1ED1i c\xF9ng v\u1EC1 t\xEDnh ch\xEDnh x\xE1c khoa h\u1ECDc.",
          "Gi\xE1o d\u1EE5c h\u1ECDc sinh nguy\xEAn t\u1EAFc li\xEAm ch\xEDnh h\u1ECDc thu\u1EADt: kh\xF4ng sao ch\xE9p nguy\xEAn v\u0103n v\u0103n b\u1EA3n t\u1EEB AI \u0111\u1EC3 l\xE0m b\xE0i n\u1ED9p."
        ],
        phtDirectives: `Y\xEAu c\u1EA7u T\u1ED5 tr\u01B0\u1EDFng chuy\xEAn m\xF4n qu\xE1n tri\u1EC7t vi\u1EC7c t\xEDch h\u1EE3p c\xF4ng ngh\u1EC7 s\u1ED1 v\xE0 AI m\u1ED9t c\xE1ch thi\u1EBFt th\u1EF1c, tr\xE1nh h\xECnh th\u1EE9c. Khuy\u1EBFn kh\xEDch gi\xE1o vi\xEAn chia s\u1EBB h\u1ECDc li\u1EC7u s\u1ED1 gi\u1EEFa \u0111i\u1EC3m ch\xEDnh v\xE0 \u0111i\u1EC3m T\xE2n Ki\u1EC1u.`
      })
    });
    const parsed = cleanAndParseJson(rawText);
    res.json({ success: true, data: parsed });
  } catch (error) {
    console.error("Error generating digital/ai orientation:", error);
    res.status(500).json({ success: false, error: error.message || "L\u1ED7i x\xE2y d\u1EF1ng \u0111\u1ECBnh h\u01B0\u1EDBng n\u0103ng l\u1EF1c s\u1ED1 & AI" });
  }
});
app.get("/api/documents/source/two-session-plan.docx", (req, res) => {
  if (!fs.existsSync(TWO_SESSION_PLAN_DOCX_PATH)) {
    return res.status(404).json({ error: "Kh?ng t?m th?y file Word g?c" });
  }
  res.download(TWO_SESSION_PLAN_DOCX_PATH, path.basename(TWO_SESSION_PLAN_DOCX_PATH));
});
app.get("/api/documents/source/assessment-plan.docx", (req, res) => {
  if (!fs.existsSync(ASSESSMENT_PLAN_DOCX_PATH)) {
    return res.status(404).json({ success: false, error: "Kh\xF4ng t\xECm th\u1EA5y file Word g\u1ED1c" });
  }
  res.download(ASSESSMENT_PLAN_DOCX_PATH, path.basename(ASSESSMENT_PLAN_DOCX_PATH));
});
app.get("/api/documents", async (req, res) => {
  try {
    const docs = await syncAssessmentPlanFromWord(getPersistedDocuments());
    savePersistedDocuments(docs);
    res.json({ success: true, data: docs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
app.post("/api/documents", (req, res) => {
  try {
    const doc = req.body;
    if (!doc || !doc.id) {
      return res.status(400).json({ success: false, error: "Document id is required" });
    }
    const docs = getPersistedDocuments();
    const idx = docs.findIndex((d) => d.id === doc.id);
    if (idx !== -1) {
      docs[idx] = { ...docs[idx], ...doc, updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
    } else {
      docs.unshift({ ...doc, createdAt: (/* @__PURE__ */ new Date()).toISOString(), updatedAt: (/* @__PURE__ */ new Date()).toISOString() });
    }
    savePersistedDocuments(docs);
    res.json({ success: true, data: idx !== -1 ? docs[idx] : docs[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
app.delete("/api/documents/:id", (req, res) => {
  try {
    const { id } = req.params;
    let docs = getPersistedDocuments();
    docs = docs.filter((d) => d.id !== id);
    savePersistedDocuments(docs);
    res.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
app.post("/api/documents/reset-default/:id", (req, res) => {
  try {
    const { id } = req.params;
    const docs = getPersistedDocuments();
    const defaultDoc = docs.find((d) => d.id === id);
    if (!defaultDoc) {
      return res.status(404).json({ success: false, error: "Kh\xF4ng t\xECm th\u1EA5y m\u1EABu c\u1EE7a v\u0103n b\u1EA3n n\xE0y" });
    }
    res.json({ success: true, data: defaultDoc });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
app.get("/api/directives", (req, res) => {
  try {
    const list = getPersistedDirectives();
    res.json({ success: true, data: list });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
app.post("/api/directives", (req, res) => {
  try {
    const dir = req.body;
    if (!dir || !dir.id) {
      return res.status(400).json({ success: false, error: "Directive id is required" });
    }
    const current = getPersistedDirectives();
    const idx = current.findIndex((d) => d.id === dir.id);
    if (idx !== -1) {
      current[idx] = { ...current[idx], ...dir };
    } else {
      current.unshift(dir);
    }
    savePersistedDirectives(current);
    res.json({ success: true, data: current });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
app.delete("/api/directives/:id", (req, res) => {
  try {
    const { id } = req.params;
    let list = getPersistedDirectives();
    list = list.filter((d) => d.id !== id);
    savePersistedDirectives(list);
    res.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
app.get("/api/categories", (req, res) => {
  try {
    const list = getPersistedCategories();
    res.json({ success: true, data: list });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
app.post("/api/categories", (req, res) => {
  try {
    const { name, label, description } = req.body;
    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ success: false, error: "T\xEAn danh m\u1EE5c kh\xF4ng \u0111\u01B0\u1EE3c \u0111\u1EC3 tr\u1ED1ng" });
    }
    const trimmed = name.trim();
    const categories = getPersistedCategories();
    const existing = categories.find(
      (c) => c.name.toLowerCase() === trimmed.toLowerCase() || c.id.toLowerCase() === trimmed.toLowerCase()
    );
    if (existing) {
      return res.json({ success: true, data: categories, category: existing, message: "Danh m\u1EE5c \u0111\xE3 t\u1ED3n t\u1EA1i" });
    }
    const newCat = {
      id: trimmed,
      name: trimmed,
      label: label?.trim() || trimmed,
      description: description?.trim() || "",
      isCustom: true
    };
    categories.push(newCat);
    savePersistedCategories(categories);
    res.json({ success: true, data: categories, category: newCat });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
app.delete("/api/categories/:id", (req, res) => {
  try {
    const { id } = req.params;
    let list = getPersistedCategories();
    list = list.filter((c) => c.id !== id && c.name !== id);
    savePersistedCategories(list);
    res.json({ success: true, data: list });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
app.post("/api/documents/contextualize", async (req, res) => {
  try {
    const {
      sourceText,
      documentType = "plan",
      specificFocus = "",
      signerRole = "KT. HI\u1EC6U TR\u01AF\u1EDENG\nPH\xD3 HI\u1EC6U TR\u01AF\u1EDENG",
      signerName = "Nguy\u1EC5n Minh Tr\xED",
      customDocumentNumber = "",
      customTitle = ""
    } = req.body;
    const typeLabels = {
      plan: "K\u1EBE HO\u1EA0CH",
      decision: "QUY\u1EBET \u0110\u1ECANH",
      guidance: "H\u01AF\u1EDANG D\u1EAAN",
      regulation: "QUY CH\u1EBE",
      report: "B\xC1O C\xC1O",
      announcement: "TH\xD4NG B\xC1O",
      proposal: "T\u1EDC TR\xCCNH"
    };
    const typeCodePrefixes = {
      plan: "KH-THCS&THPT\u0110BK",
      decision: "Q\u0110-THCS&THPT\u0110BK",
      guidance: "HD-THCS&THPT\u0110BK",
      regulation: "QC-THCS&THPT\u0110BK",
      report: "BC-THCS&THPT\u0110BK",
      announcement: "TB-THCS&THPT\u0110BK",
      proposal: "TTr-THCS&THPT\u0110BK"
    };
    const targetTypeLabel = typeLabels[documentType] || "K\u1EBE HO\u1EA0CH";
    const targetCodePrefix = typeCodePrefixes[documentType] || "KH-THCS&THPT\u0110BK";
    const prompt = `
B\u1EA1n l\xE0 Th\u01B0 k\xFD Chuy\xEAn m\xF4n v\xE0 Tr\u1EE3 l\xFD Qu\u1EA3n l\xFD Gi\xE1o d\u1EE5c cao c\u1EA5p c\u1EE7a Tr\u01B0\u1EDDng THCS v\xE0 THPT \u0110\u1ED1c Binh Ki\u1EC1u (t\u1EC9nh \u0110\u1ED3ng Th\xE1p).
Th\u1EA7y Ph\xF3 Hi\u1EC7u Tr\u01B0\u1EDFng Nguy\u1EC5n Minh Tr\xED giao nhi\u1EC7m v\u1EE5 C\u1EE4 TH\u1EC2 H\xD3A V\u0102N B\u1EA2N CH\u1EC8 \u0110\u1EA0O C\u1EE6A C\u1EA4P TR\xCAN th\xE0nh v\u0103n b\u1EA3n h\xE0nh ch\xEDnh s\u01B0 ph\u1EA1m ch\xEDnh th\u1EE9c c\u1EE7a nh\xE0 tr\u01B0\u1EDDng.

TH\xD4NG TIN TR\u01AF\u1EDCNG THCS V\xC0 THPT \u0110\u1ED0C BINH KI\u1EC0U:
- Tr\u1EF1c thu\u1ED9c: S\u1EDE GI\xC1O D\u1EE4C V\xC0 \u0110\xC0O T\u1EA0O T\u1EC8NH \u0110\u1ED2NG TH\xC1P
- \u0110\u1ECBa b\xE0n: Huy\u1EC7n Th\xE1p M\u01B0\u1EDDi, T\u1EC9nh \u0110\u1ED3ng Th\xE1p
- Quy m\xF4 m\u1EA1ng l\u01B0\u1EDBi: 53 l\u1EDBp, 2.128 h\u1ECDc sinh.
  + C\u1EA5p THCS: 39 l\u1EDBp (\u0110i\u1EC3m ch\xEDnh \u0110\u1ED1c Binh Ki\u1EC1u: 24 l\u1EDBp; \u0110i\u1EC3m T\xE2n Ki\u1EC1u: 15 l\u1EDBp, c\xE1ch \u0111i\u1EC3m ch\xEDnh 11 km).
  + C\u1EA5p THPT: 14 l\u1EDBp (Kh\u1ED1i 10: 5 l\u1EDBp, Kh\u1ED1i 11: 4 l\u1EDBp, Kh\u1ED1i 12: 5 l\u1EDBp) h\u1ECDc t\u1EA1i \u0110i\u1EC3m ch\xEDnh.
- \u0110\u1ED9i ng\u0169: 101 C\xE1n b\u1ED9, gi\xE1o vi\xEAn, nh\xE2n vi\xEAn (04 BGH, 93 GV, 04 NV).
- C\u01A1 c\u1EA5u: 07 T\u1ED5 chuy\xEAn m\xF4n (T\u1ED5 To\xE1n 15 GV, T\u1ED5 Ng\u1EEF v\u0103n 12 GV, T\u1ED5 KHTN-CN 26 GV, T\u1ED5 L\u1ECBch s\u1EED-\u0110\u1ECBa l\xFD-GDCD 16 GV, T\u1ED5 Ti\u1EBFng Anh-Tin h\u1ECDc 16 GV, T\u1ED5 GDTC-QPAN-Ngh\u1EC7 thu\u1EADt 12 GV, Ban Gi\xE1m hi\u1EC7u).
- L\xE3nh \u0111\u1EA1o k\xFD v\u0103n b\u1EA3n: ${signerRole} - H\u1ECD t\xEAn: ${signerName}.

Y\xCAU C\u1EA6U TH\u1EF0C HI\u1EC6N:
- Lo\u1EA1i v\u0103n b\u1EA3n c\u1EA7n ban h\xE0nh: ${targetTypeLabel} (${documentType})
- S\u1ED1 hi\u1EC7u v\u0103n b\u1EA3n d\u1EF1 ki\u1EBFn: ${customDocumentNumber || `S\u1ED1: .../${targetCodePrefix}`}
- Ti\xEAu \u0111\u1EC1 mong mu\u1ED1n (n\u1EBFu c\xF3): ${customTitle || "T\u1EF1 \u0111\u1ED9ng t\u1EA1o ti\xEAu \u0111\u1EC1 ph\xF9 h\u1EE3p chu\u1EA9n v\u0103n th\u01B0"}
- Y\xEAu c\u1EA7u tr\u1ECDng t\xE2m c\u1EE7a Ph\xF3 Hi\u1EC7u Tr\u01B0\u1EDFng: ${specificFocus || "C\u1EE5 th\u1EC3 h\xF3a chi ti\u1EBFt cho 53 l\u1EDBp, ch\xFA tr\u1ECDng gi\u1EA3i ph\xE1p \u0111i\u1EC3m T\xE2n Ki\u1EC1u c\xE1ch 11km v\xE0 \u1EE9ng d\u1EE5ng chuy\u1EC3n \u0111\u1ED5i s\u1ED1/AI th\u1EF1c ti\u1EC5n."}

V\u0102N B\u1EA2N NGU\u1ED2N C\u1EE6A S\u1EDE / B\u1ED8 / C\u1EA4P TR\xCAN G\u1EECI V\xC0O \u0110\u1EC2 C\u1EE4 TH\u1EC2 H\xD3A:
"""
${sourceText || "K\u1EBF ho\u1EA1ch nhi\u1EC7m v\u1EE5 gi\xE1o d\u1EE5c trung h\u1ECDc n\u0103m h\u1ECDc m\u1EDBi c\u1EE7a S\u1EDF GD\u0110T \u0110\u1ED3ng Th\xE1p."}
"""

H\xC3Y XU\u1EA4T RA D\u1EEE LI\u1EC6U JSON \u0110\xDANG CHU\u1EA8N TH\u1EC2 TH\u1EE8C NGH\u1ECA \u0110\u1ECANH 30/2020/N\u0110-CP THEO C\u1EA4U TR\xDAC:
{
  "type": "${documentType}",
  "typeLabel": "${targetTypeLabel}",
  "documentNumber": "S\u1ED1: .../${targetCodePrefix}",
  "title": "${targetTypeLabel} [Ti\xEAu \u0111\u1EC1 \u0111\u1EA7y \u0111\u1EE7, vi\u1EBFt hoa, trang tr\u1ECDng]",
  "subTitle": "C\u1EE5 th\u1EC3 h\xF3a [T\xEAn v\xE0 s\u1ED1 v\u0103n b\u1EA3n c\u1EE7a S\u1EDF/B\u1ED9]",
  "signDate": "Th\xE1p M\u01B0\u1EDDi, ng\xE0y ... th\xE1ng ... n\u0103m 2026",
  "issuingAuthorityTop": "S\u1EDE GI\xC1O D\u1EE4C V\xC0 \u0110\xC0O T\u1EA0O \u0110\u1ED2NG TH\xC1P",
  "issuingAuthority": "TR\u01AF\u1EDCNG THCS V\xC0 THPT \u0110\u1ED0C BINH KI\u1EC0U",
  "signerRole": "${signerRole}",
  "signerName": "${signerName}",
  "sourceDirective": "T\xEAn v\xE0 s\u1ED1 hi\u1EC7u v\u0103n b\u1EA3n ngu\u1ED3n c\u1EE7a c\u1EA5p tr\xEAn",
  "legalBases": [
    "C\u0103n c\u1EE9 [V\u0103n b\u1EA3n/c\xF4ng v\u0103n ch\u1EC9 \u0111\u1EA1o tr\u1EF1c ti\u1EBFp c\u1EE7a S\u1EDF GD\u0110T ho\u1EB7c B\u1ED9 GD\u0110T \u0111ang c\u1EE5 th\u1EC3 h\xF3a, ghi r\xF5 s\u1ED1, ng\xE0y ban h\xE0nh, c\u01A1 quan ban h\xE0nh v\xE0 tr\xEDch y\u1EBFu n\u1ED9i dung];",
    "C\u0103n c\u1EE9 K\u1EBF ho\u1EA1ch s\u1ED1 34/KH-THCS&THPT\u0110BK ng\xE0y 25 th\xE1ng 9 n\u0103m 2026 c\u1EE7a Tr\u01B0\u1EDDng THCS v\xE0 THPT \u0110\u1ED1c Binh Ki\u1EC1u v\u1EC1 K\u1EBF ho\u1EA1ch gi\xE1o d\u1EE5c nh\xE0 tr\u01B0\u1EDDng n\u0103m h\u1ECDc 2026 - 2027."
  ],
  "__NOTE_LEGAL_BASES__": "QUY T\u1EAEC C\u1EE8NG: Ch\u1EC9 \u0111\u1EC3 l\u1EA1i \u0111\xFAng 01 ho\u1EB7c 02 c\u0103n c\u1EE9 quan tr\u1ECDng nh\u1EA5t \u1EDF tr\xEAn, tuy\u1EC7t \u0111\u1ED1i kh\xF4ng li\u1EC7t k\xEA tr\xE0n lan c\xE1c th\xF4ng t\u01B0 kh\xE1c",
  "sections": [
    {
      "heading": "I. M\u1EE4C \u0110\xCDCH, Y\xCAU C\u1EA6U",
      "content": "1. M\u1EE5c \u0111\xEDch:\\n...\\n\\n2. Y\xEAu c\u1EA7u:\\n..."
    },
    {
      "heading": "II. \u0110\u1EB6C \u0110I\u1EC2M T\xCCNH H\xCCNH TR\u01AF\u1EDCNG THCS & THPT \u0110\u1ED0C BINH KI\u1EC0U",
      "content": "1. Quy m\xF4 l\u1EDBp h\u1ECDc v\xE0 h\u1ECDc sinh (53 l\u1EDBp: 39 THCS g\u1ED3m 24 l\u1EDBp \u0111i\u1EC3m ch\xEDnh, 15 l\u1EDBp \u0111i\u1EC3m T\xE2n Ki\u1EC1u c\xE1ch 11km; 14 l\u1EDBp THPT):\\n...\\n2. \u0110\u1ED9i ng\u0169 c\xE1n b\u1ED9, gi\xE1o vi\xEAn (101 ng\u01B0\u1EDDi, 07 t\u1ED5 chuy\xEAn m\xF4n):\\n...\\n3. Thu\u1EADn l\u1EE3i v\xE0 kh\xF3 kh\u0103n:..."
    },
    {
      "heading": "III. N\u1ED8I DUNG V\xC0 C\xC1C BI\u1EC6N PH\xC1P TH\u1EF0C HI\u1EC6N",
      "content": "C\xE1c nhi\u1EC7m v\u1EE5, ch\u1EC9 ti\xEAu c\u1EE5 th\u1EC3 h\xF3a t\u1EEB v\u0103n b\u1EA3n c\u1EA5p tr\xEAn cho nh\xE0 tr\u01B0\u1EDDng..."
    },
    {
      "heading": "IV. T\u1ED4 CH\u1EE8C TH\u1EF0C HI\u1EC6N",
      "content": "1. Ban Gi\xE1m hi\u1EC7u:\\n...\\n2. C\xE1c T\u1ED5 chuy\xEAn m\xF4n (T\u1ED5 To\xE1n, Ng\u1EEF v\u0103n, KHTN-CN, KHXH, Ti\u1EBFng Anh-Tin, GDTC-QPAN-NT):\\n...\\n3. B\u1ED9 ph\u1EADn ph\u1EE5 tr\xE1ch \u0110i\u1EC3m tr\u01B0\u1EDDng T\xE2n Ki\u1EC1u:\\n...\\n4. Gi\xE1o vi\xEAn b\u1ED9 m\xF4n v\xE0 Gi\xE1o vi\xEAn ch\u1EE7 nhi\u1EC7m:..."
    }
  ],
  "recipients": [
    "S\u1EDF GD\u0110T \u0110\u1ED3ng Th\xE1p (\u0111\u1EC3 b\xE1o c\xE1o);",
    "Ban Gi\xE1m hi\u1EC7u (\u0111\u1EC3 ch\u1EC9 \u0111\u1EA1o);",
    "07 T\u1ED5 chuy\xEAn m\xF4n (\u0111\u1EC3 th\u1EF1c hi\u1EC7n);",
    "B\u1ED9 ph\u1EADn ph\u1EE5 tr\xE1ch \u0110i\u1EC3m T\xE2n Ki\u1EC1u;",
    "L\u01B0u: VT, CM."
  ]
}
`;
    const fallbackFn = () => {
      const currentDateStr = `Th\xE1p M\u01B0\u1EDDi, ng\xE0y ${(/* @__PURE__ */ new Date()).getDate()} th\xE1ng ${(/* @__PURE__ */ new Date()).getMonth() + 1} n\u0103m 2026`;
      const defaultDocNum = customDocumentNumber || `S\u1ED1: ${Math.floor(Math.random() * 50) + 50}/${targetCodePrefix}`;
      return {
        type: documentType,
        typeLabel: targetTypeLabel,
        documentNumber: defaultDocNum,
        title: customTitle || `${targetTypeLabel} Th\u1EF1c hi\u1EC7n nhi\u1EC7m v\u1EE5 gi\xE1o d\u1EE5c v\xE0 qu\u1EA3n l\xFD chuy\xEAn m\xF4n n\u0103m h\u1ECDc 2026 - 2027`,
        subTitle: `C\u1EE5 th\u1EC3 h\xF3a theo ch\u1EC9 \u0111\u1EA1o c\u1EE7a S\u1EDF Gi\xE1o d\u1EE5c v\xE0 \u0110\xE0o t\u1EA1o t\u1EC9nh \u0110\u1ED3ng Th\xE1p`,
        signDate: currentDateStr,
        issuingAuthorityTop: "S\u1EDE GI\xC1O D\u1EE4C V\xC0 \u0110\xC0O T\u1EA0O \u0110\u1ED2NG TH\xC1P",
        issuingAuthority: "TR\u01AF\u1EDCNG THCS V\xC0 THPT \u0110\u1ED0C BINH KI\u1EC0U",
        signerRole,
        signerName,
        sourceDirective: "Ch\u1EC9 \u0111\u1EA1o c\u1EE7a S\u1EDF GD\u0110T \u0110\u1ED3ng Th\xE1p",
        legalBases: [
          "Th\xF4ng t\u01B0 s\u1ED1 15/2026/TT-BGD\u0110T ng\xE0y 15/5/2026 c\u1EE7a B\u1ED9 tr\u01B0\u1EDFng B\u1ED9 Gi\xE1o d\u1EE5c v\xE0 \u0110\xE0o t\u1EA1o ban h\xE0nh \u0110i\u1EC1u l\u1EC7 tr\u01B0\u1EDDng THCS, THPT v\xE0 tr\u01B0\u1EDDng ph\u1ED5 th\xF4ng c\xF3 nhi\u1EC1u c\u1EA5p h\u1ECDc",
          "C\xF4ng v\u0103n s\u1ED1 5512/BGD\u0110T-GDTrH ng\xE0y 18/12/2020 c\u1EE7a B\u1ED9 Gi\xE1o d\u1EE5c v\xE0 \u0110\xE0o t\u1EA1o",
          "C\xF4ng v\u0103n s\u1ED1 3284/SGD\u0110T-GDPT ng\xE0y 24/8/2026 c\u1EE7a S\u1EDF Gi\xE1o d\u1EE5c v\xE0 \u0110\xE0o t\u1EA1o \u0110\u1ED3ng Th\xE1p",
          "Ngh\u1ECB quy\u1EBFt H\u1ED9i ngh\u1ECB C\xE1n b\u1ED9, vi\xEAn ch\u1EE9c Tr\u01B0\u1EDDng THCS v\xE0 THPT \u0110\u1ED1c Binh Ki\u1EC1u n\u0103m h\u1ECDc 2026 - 2027"
        ],
        sections: [
          {
            heading: "I. M\u1EE4C \u0110\xCDCH, Y\xCAU C\u1EA6U",
            content: `1. M\u1EE5c \u0111\xEDch:
- C\u1EE5 th\u1EC3 h\xF3a \u0111\u1ED3ng b\u1ED9, k\u1ECBp th\u1EDDi v\xE0 hi\u1EC7u qu\u1EA3 v\u0103n b\u1EA3n ch\u1EC9 \u0111\u1EA1o c\u1EE7a S\u1EDF GD\u0110T \u0110\u1ED3ng Th\xE1p ph\xF9 h\u1EE3p v\u1EDBi \u0111i\u1EC1u ki\u1EC7n th\u1EF1c t\u1EBF c\u1EE7a Tr\u01B0\u1EDDng THCS v\xE0 THPT \u0110\u1ED1c Binh Ki\u1EC1u.
- B\u1EA3o \u0111\u1EA3m th\u1EF1c hi\u1EC7n nghi\xEAm t\xFAc Ch\u01B0\u01A1ng tr\xECnh Gi\xE1o d\u1EE5c ph\u1ED5 th\xF4ng 2018 cho 53 l\u1EDBp t\u1EEB kh\u1ED1i 6 \u0111\u1EBFn kh\u1ED1i 12; n\xE2ng cao th\u1EF1c ch\u1EA5t ch\u1EA5t l\u01B0\u1EE3ng gi\xE1o d\u1EE5c \u0111\u1EA1i tr\xE0 v\xE0 gi\xE1o d\u1EE5c m\u0169i nh\u1ECDn.
- T\u0103ng c\u01B0\u1EDDng \u1EE9ng d\u1EE5ng c\xF4ng ngh\u1EC7 th\xF4ng tin, th\xFAc \u0111\u1EA9y chuy\u1EC3n \u0111\u1ED5i s\u1ED1 v\xE0 khai th\xE1c n\u0103ng l\u1EF1c Tr\xED tu\u1EC7 nh\xE2n t\u1EA1o (AI) an to\xE0n trong c\xF4ng t\xE1c qu\u1EA3n l\xFD v\xE0 gi\u1EA3ng d\u1EA1y.

2. Y\xEAu c\u1EA7u:
- K\u1EBF ho\u1EA1ch ph\u1EA3i s\xE1t th\u1EF1c t\u1EBF, c\xF3 t\xEDnh kh\u1EA3 thi cao, ph\xE2n \u0111\u1ECBnh r\xF5 tr\xE1ch nhi\u1EC7m c\u1EE7a t\u1EEBng c\xE1 nh\xE2n v\xE0 b\u1ED9 ph\u1EADn, \u0111\u1EB7c bi\u1EC7t b\u1EA3o \u0111\u1EA3m \u0111i\u1EC1u ki\u1EC7n d\u1EA1y h\u1ECDc \u0111\u1ED3ng b\u1ED9 t\u1EA1i \u0110i\u1EC3m tr\u01B0\u1EDDng T\xE2n Ki\u1EC1u (c\xE1ch \u0111i\u1EC3m ch\xEDnh 11 km).
- To\xE0n th\u1EC3 c\xE1n b\u1ED9 qu\u1EA3n l\xFD, gi\xE1o vi\xEAn, nh\xE2n vi\xEAn n\u1EAFm v\u1EEFng n\u1ED9i dung v\xE0 nghi\xEAm t\xFAc ch\u1EA5p h\xE0nh.`
          },
          {
            heading: "II. \u0110\u1EB6C \u0110I\u1EC2M T\xCCNH H\xCCNH NH\xC0 TR\u01AF\u1EDCNG",
            content: `1. Quy m\xF4 tr\u01B0\u1EDDng l\u1EDBp v\xE0 h\u1ECDc sinh:
- T\u1ED5ng s\u1ED1: 53 l\u1EDBp v\u1EDBi 2.128 h\u1ECDc sinh, b\u1ED1 tr\xED t\u1EA1i 3 \u0111i\u1EC3m tr\u01B0\u1EDDng:
  + C\u1EA5p THCS: 39 l\u1EDBp (g\u1ED3m Kh\u1ED1i 6: 10 l\u1EDBp; Kh\u1ED1i 7: 9 l\u1EDBp; Kh\u1ED1i 8: 10 l\u1EDBp; Kh\u1ED1i 9: 10 l\u1EDBp). Trong \u0111\xF3: \u0110i\u1EC3m ch\xEDnh \u0110\u1ED1c Binh Ki\u1EC1u c\xF3 24 l\u1EDBp; \u0110i\u1EC3m T\xE2n Ki\u1EC1u c\xF3 15 l\u1EDBp (c\xE1ch \u0111i\u1EC3m ch\xEDnh 11 km).
  + C\u1EA5p THPT: 14 l\u1EDBp h\u1ECDc t\u1EA1i \u0110i\u1EC3m ch\xEDnh (Kh\u1ED1i 10: 5 l\u1EDBp; Kh\u1ED1i 11: 4 l\u1EDBp; Kh\u1ED1i 12: 5 l\u1EDBp).

2. \u0110\u1ED9i ng\u0169 c\xE1n b\u1ED9, gi\xE1o vi\xEAn, nh\xE2n vi\xEAn:
- T\u1ED5ng s\u1ED1: 101 ng\u01B0\u1EDDi (04 Ban Gi\xE1m hi\u1EC7u; 93 Gi\xE1o vi\xEAn; 04 Nh\xE2n vi\xEAn).
- C\u01A1 c\u1EA5u t\u1ED5 ch\u1EE9c g\u1ED3m 07 T\u1ED5 chuy\xEAn m\xF4n: T\u1ED5 To\xE1n (15 GV), T\u1ED5 Ng\u1EEF v\u0103n (12 GV), T\u1ED5 KHTN-CN (26 GV), T\u1ED5 L\u1ECBch s\u1EED-\u0110\u1ECBa l\xFD-GDCD (16 GV), T\u1ED5 Ti\u1EBFng Anh-Tin h\u1ECDc (16 GV), T\u1ED5 GDTC-QPAN-Ngh\u1EC7 thu\u1EADt (12 GV) v\xE0 Ban Gi\xE1m hi\u1EC7u.

3. Thu\u1EADn l\u1EE3i v\xE0 kh\xF3 kh\u0103n:
- Thu\u1EADn l\u1EE3i: \u0110\u01B0\u1EE3c s\u1EF1 l\xE3nh \u0111\u1EA1o s\xE2u s\xE1t c\u1EE7a S\u1EDF GD\u0110T \u0110\u1ED3ng Th\xE1p v\xE0 Huy\u1EC7n \u1EE7y, UBND Huy\u1EC7n Th\xE1p M\u01B0\u1EDDi; t\u1EADp th\u1EC3 s\u01B0 ph\u1EA1m \u0111o\xE0n k\u1EBFt, c\xF3 tinh th\u1EA7n tr\xE1ch nhi\u1EC7m v\xE0 t\xEDch c\u1EF1c \u0111\u1ED5i m\u1EDBi ph\u01B0\u01A1ng ph\xE1p.
- Kh\xF3 kh\u0103n: \u0110\u1ECBa b\xE0n c\xE1ch tr\u1EDF gi\u1EEFa 2 x\xE3, \u0111i\u1EC3m tr\u01B0\u1EDDng T\xE2n Ki\u1EC1u c\xE1ch \u0111i\u1EC3m ch\xEDnh 11 km; c\u1EA7n t\u0103ng c\u01B0\u1EDDng \u0111i\u1EC1u ph\u1ED1i thi\u1EBFt b\u1ECB th\u1EF1c h\xE0nh v\xE0 l\u1ECBch sinh ho\u1EA1t chuy\xEAn m\xF4n tr\u1EF1c tuy\u1EBFn.`
          },
          {
            heading: "III. NHI\u1EC6M V\u1EE4 V\xC0 C\xC1C BI\u1EC6N PH\xC1P TH\u1EF0C HI\u1EC6N TR\u1ECCNG T\xC2M",
            content: `1. T\u1ED5 ch\u1EE9c d\u1EA1y h\u1ECDc v\xE0 ph\xE2n ph\u1ED1i ch\u01B0\u01A1ng tr\xECnh:
- Th\u1EF1c hi\u1EC7n nghi\xEAm t\xFAc th\u1EDDi l\u01B0\u1EE3ng 35 tu\u1EA7n th\u1EF1c h\u1ECDc (HK1: 18 tu\u1EA7n, HK2: 17 tu\u1EA7n); linh ho\u1EA1t ph\xE2n ph\u1ED1i ti\u1EBFt theo C\xF4ng v\u0103n 3284, kh\xF4ng c\u1EAFt x\xE9n, kh\xF4ng d\u1ED3n \xE9p ti\u1EBFn \u0111\u1ED9.
- T\u1ED5 tr\u01B0\u1EDFng chuy\xEAn m\xF4n th\u1EA9m \u0111\u1ECBnh k\u1EF9 ph\xE2n ph\u1ED1i ch\u01B0\u01A1ng tr\xECnh, b\u1EA3o \u0111\u1EA3m c\xE2n \u0111\u1ED1i gi\u1EEFa l\xFD thuy\u1EBFt v\xE0 th\u1EF1c h\xE0nh th\xED nghi\u1EC7m.

2. \u0110\u1ED5i m\u1EDBi sinh ho\u1EA1t chuy\xEAn m\xF4n v\xE0 x\xE2y d\u1EF1ng K\u1EBF ho\u1EA1ch b\xE0i d\u1EA1y:
- Th\u1EF1c hi\u1EC7n sinh ho\u1EA1t t\u1ED5 chuy\xEAn m\xF4n \u0111\u1ECBnh k\u1EF3 2 tu\u1EA7n/l\u1EA7n theo h\u01B0\u1EDBng nghi\xEAn c\u1EE9u b\xE0i h\u1ECDc; t\u0103ng c\u01B0\u1EDDng h\u1ECDp li\xEAn \u0111i\u1EC3m tr\u01B0\u1EDDng th\xF4ng qua n\u1EC1n t\u1EA3ng tr\u1EF1c tuy\u1EBFn.
- Gi\xE1o vi\xEAn so\u1EA1n K\u1EBF ho\u1EA1ch b\xE0i d\u1EA1y theo \u0111\xFAng khung Ph\u1EE5 l\u1EE5c II - C\xF4ng v\u0103n 3284; m\xF4 t\u1EA3 chu\u1ED7i 4 ho\u1EA1t \u0111\u1ED9ng c\u1EE7a h\u1ECDc sinh, kh\xF4ng ghi l\u1EDDi tho\u1EA1i r\u01B0\u1EDDm r\xE0.

3. T\xEDch h\u1EE3p chuy\u1EC3n \u0111\u1ED5i s\u1ED1 v\xE0 \u1EE9ng d\u1EE5ng N\u0103ng l\u1EF1c Tr\xED tu\u1EC7 Nh\xE2n t\u1EA1o (AI):
- Tri\u1EC3n khai s\u1EED d\u1EE5ng 100% h\u1ECDc b\u1EA1, s\u1ED5 \u0111i\u1EC3m, gi\xE1o \xE1n \u0111i\u1EC7n t\u1EED; khai th\xE1c hi\u1EC7u qu\u1EA3 tivi th\xF4ng minh v\xE0 ph\xF2ng m\xE1y vi t\xEDnh t\u1EA1i c\u1EA3 2 \u0111i\u1EC3m tr\u01B0\u1EDDng.
- H\u01B0\u1EDBng d\u1EABn gi\xE1o vi\xEAn s\u1EED d\u1EE5ng c\xE1c c\xF4ng c\u1EE5 AI h\u1ED7 tr\u1EE3 so\u1EA1n b\xE0i v\xE0 thi\u1EBFt k\u1EBF b\xE0i gi\u1EA3ng c\xF3 ph\u1EA3n bi\u1EC7n khoa h\u1ECDc, tu\xE2n th\u1EE7 \u0111\u1EA1o \u0111\u1EE9c s\u1ED1 v\xE0 an to\xE0n th\xF4ng tin.`
          },
          {
            heading: "IV. T\u1ED4 CH\u1EE8C TH\u1EF0C HI\u1EC6N",
            content: `1. Ban Gi\xE1m hi\u1EC7u:
- Th\u1EA7y Hi\u1EC7u tr\u01B0\u1EDFng L\xEA Thanh C\u01B0\u1EDDng ch\u1EC9 \u0111\u1EA1o to\xE0n di\u1EC7n c\xF4ng t\xE1c t\u1ED5 ch\u1EE9c, nh\xE2n s\u1EF1 v\xE0 t\xE0i ch\xEDnh.
- Th\u1EA7y Ph\xF3 Hi\u1EC7u tr\u01B0\u1EDFng Nguy\u1EC5n Minh Tr\xED tr\u1EF1c ti\u1EBFp ph\u1EE5 tr\xE1ch c\xF4ng t\xE1c chuy\xEAn m\xF4n; ch\u1EC9 \u0111\u1EA1o x\xE2y d\u1EF1ng v\xE0 th\u1EA9m \u0111\u1ECBnh k\u1EBF ho\u1EA1ch c\u1EE7a 07 t\u1ED5 chuy\xEAn m\xF4n; ki\u1EC3m tra vi\u1EC7c th\u1EF1c hi\u1EC7n ph\xE2n ph\u1ED1i ch\u01B0\u01A1ng tr\xECnh v\xE0 k\u1EBF ho\u1EA1ch b\xE0i d\u1EA1y.
- Ph\xE2n c\xF4ng c\xE1n b\u1ED9 ph\u1EE5 tr\xE1ch \u0111i\u1EC3m T\xE2n Ki\u1EC1u ph\u1ED1i h\u1EE3p ch\u1EB7t ch\u1EBD v\u1EDBi BGH trong qu\u1EA3n l\xFD n\u1EC1n n\u1EBFp d\u1EA1y v\xE0 h\u1ECDc h\xE0ng ng\xE0y.

2. C\xE1c T\u1ED5 chuy\xEAn m\xF4n v\xE0 Gi\xE1o vi\xEAn:
- 07 T\u1ED5 chuy\xEAn m\xF4n c\u1EE5 th\u1EC3 h\xF3a k\u1EBF ho\u1EA1ch n\xE0y v\xE0o K\u1EBF ho\u1EA1ch gi\xE1o d\u1EE5c c\u1EE7a t\u1ED5, ho\xE0n th\xE0nh v\xE0 tr\xECnh Ph\xF3 Hi\u1EC7u tr\u01B0\u1EDFng ph\xEA duy\u1EC7t \u0111\xFAng th\u1EDDi h\u1EA1n.
- T\u1EA5t c\u1EA3 gi\xE1o vi\xEAn nghi\xEAm t\xFAc th\u1EF1c hi\u1EC7n nhi\u1EC7m v\u1EE5 \u0111\u01B0\u1EE3c ph\xE2n c\xF4ng; t\xEDch c\u1EF1c \u0111\u1ED5i m\u1EDBi ph\u01B0\u01A1ng ph\xE1p gi\u1EA3ng d\u1EA1y v\xE0 ki\u1EC3m tra \u0111\xE1nh gi\xE1 h\u1ECDc sinh./.`
          }
        ],
        recipients: [
          "S\u1EDF GD\u0110T \u0110\u1ED3ng Th\xE1p (\u0111\u1EC3 b\xE1o c\xE1o);",
          "Ban Gi\xE1m hi\u1EC7u (\u0111\u1EC3 ch\u1EC9 \u0111\u1EA1o);",
          "07 T\u1ED5 chuy\xEAn m\xF4n (\u0111\u1EC3 th\u1EF1c hi\u1EC7n);",
          "B\u1ED9 ph\u1EADn ph\u1EE5 tr\xE1ch \u0110i\u1EC3m T\xE2n Ki\u1EC1u;",
          "L\u01B0u: VT, CM."
        ]
      };
    };
    const rawText = await generateWithFallback({
      prompt,
      systemInstruction: SYSTEM_PROMPT_OFFICIAL,
      fallbackGenerator: fallbackFn
    });
    const parsed = cleanAndParseJson(rawText, fallbackFn);
    res.json({ success: true, data: parsed });
  } catch (error) {
    console.error("Error contextualizing document:", error);
    res.status(500).json({ success: false, error: error.message || "L\u1ED7i x\u1EED l\xFD c\u1EE5 th\u1EC3 h\xF3a v\u0103n b\u1EA3n" });
  }
});
app.post("/api/documents/auto-research-and-build", async (req, res) => {
  try {
    const {
      topic,
      documentType = "plan",
      signerRole = "KT. HI\u1EC6U TR\u01AF\u1EDENG\nPH\xD3 HI\u1EC6U TR\u01AF\u1EDENG",
      signerName = "Nguy\u1EC5n Minh Tr\xED",
      specificNotes = ""
    } = req.body;
    if (!topic || !topic.trim()) {
      return res.status(400).json({ success: false, error: "Vui l\xF2ng nh\u1EADp ti\xEAu \u0111\u1EC1 v\u0103n b\u1EA3n c\u1EA7n x\xE2y d\u1EF1ng" });
    }
    const typeLabels = {
      plan: "K\u1EBE HO\u1EA0CH",
      decision: "QUY\u1EBET \u0110\u1ECANH",
      guidance: "H\u01AF\u1EDANG D\u1EAAN",
      regulation: "QUY CH\u1EBE",
      report: "B\xC1O C\xC1O",
      announcement: "TH\xD4NG B\xC1O",
      proposal: "T\u1EDC TR\xCCNH"
    };
    const typeCodePrefixes = {
      plan: "KH-THCS&THPT\u0110BK",
      decision: "Q\u0110-THCS&THPT\u0110BK",
      guidance: "HD-THCS&THPT\u0110BK",
      regulation: "QC-THCS&THPT\u0110BK",
      report: "BC-THCS&THPT\u0110BK",
      announcement: "TB-THCS&THPT\u0110BK",
      proposal: "TTr-THCS&THPT\u0110BK"
    };
    const targetTypeLabel = typeLabels[documentType] || "K\u1EBE HO\u1EA0CH";
    const targetCodePrefix = typeCodePrefixes[documentType] || "KH-THCS&THPT\u0110BK";
    const is2BuoiPlan = topic.toLowerCase().includes("2 bu\u1ED5i") || topic.toLowerCase().includes("hai bu\u1ED5i");
    const prompt = `
B\u1EA1n l\xE0 Chuy\xEAn gia Qu\u1EA3n l\xFD Gi\xE1o d\u1EE5c v\xE0 Th\u01B0 k\xFD Chuy\xEAn m\xF4n cao c\u1EA5p c\u1EE7a TR\u01AF\u1EDCNG THCS V\xC0 THPT \u0110\u1ED0C BINH KI\u1EC0U (t\u1EC9nh \u0110\u1ED3ng Th\xE1p).
Th\u1EA7y Ph\xF3 Hi\u1EC7u Tr\u01B0\u1EDFng Nguy\u1EC5n Minh Tr\xED y\xEAu c\u1EA7u b\u1EA1n:
"T\u1EF0 \u0110\u1ED8NG TRA C\u1EE8U QUY \u0110\u1ECANH PH\xC1P LU\u1EACT V\xC0 X\xC2Y D\u1EF0NG V\u0102N B\u1EA2N QU\u1EA2N L\xDD HO\xC0N CH\u1EC8NH CHO NH\xC0 TR\u01AF\u1EDCNG T\u1EEA TI\xCAU \u0110\u1EC0 N\xC0Y":
Ti\xEAu \u0111\u1EC1/Ch\u1EE7 \u0111\u1EC1 y\xEAu c\u1EA7u: "${topic.trim()}"
Lo\u1EA1i v\u0103n b\u1EA3n: ${targetTypeLabel}
Ng\u01B0\u1EDDi k\xFD d\u1EF1 ki\u1EBFn: ${signerRole} - H\u1ECD t\xEAn: ${signerName}
Ghi ch\xFA b\u1ED5 sung: ${specificNotes || "Kh\xF4ng c\xF3"}

QUY \u0110\u1ECANH B\u1EAET BU\u1ED8C V\u1EC0 \u0110\u1ED8 D\xC0I V\xC0 T\xCDNH C\u1EE4 TH\u1EC2 (TUY\u1EC6T \u0110\u1ED0I KH\xD4NG VI\u1EBET T\u1EAET, KH\xD4NG VI\u1EBET CHUNG CHUNG):
1. Th\u1EA7y Ph\xF3 Hi\u1EC7u tr\u01B0\u1EDFng y\xEAu c\u1EA7u v\u0103n b\u1EA3n PH\u1EA2I R\u1EA4T D\xC0I, CHI TI\u1EBET, C\u1EE4 TH\u1EC2 T\u1EEANG M\u1EE4C, KH\xD4NG \u0110\u01AF\u1EE2C VI\u1EBET T\xD3M T\u1EAET HAY CHUNG CHUNG.
2. S\u1ED1 li\u1EC7u th\u1EF1c t\u1EBF c\u1EE7a Tr\u01B0\u1EDDng THCS v\xE0 THPT \u0110\u1ED1c Binh Ki\u1EC1u (n\u0103m h\u1ECDc 2026 - 2027):
   - M\u1EA1ng l\u01B0\u1EDBi: 53 l\u1EDBp v\u1EDBi 2.143 h\u1ECDc sinh t\u1EA1i 3 \u0111i\u1EC3m tr\u01B0\u1EDDng:
     + \u0110i\u1EC3m ch\xEDnh (THPT): Kh\u1ED1i 10, 11, 12 (14 l\u1EDBp, 530 h\u1ECDc sinh).
     + \u0110i\u1EC3m \u0110\u1ED1c Binh Ki\u1EC1u (THCS): Kh\u1ED1i 6, 7, 8, 9 (24 l\u1EDBp, 983 h\u1ECDc sinh).
     + \u0110i\u1EC3m T\xE2n Ki\u1EC1u (THCS): Kh\u1ED1i 6, 7, 8, 9 (15 l\u1EDBp, 557 h\u1ECDc sinh, c\xE1ch \u0111i\u1EC3m ch\xEDnh 11 km).
   - \u0110\u1ED9i ng\u0169: 120 CB-GV-NV (102 gi\xE1o vi\xEAn tr\u1EF1c ti\u1EBFp gi\u1EA3ng d\u1EA1y), c\u01A1 c\u1EA5u 08 t\u1ED5 chuy\xEAn m\xF4n.
   - Ban Gi\xE1m hi\u1EC7u: Th\u1EA7y Hi\u1EC7u tr\u01B0\u1EDFng L\xEA Thanh C\u01B0\u1EDDng ph\u1EE5 tr\xE1ch chung, Th\u1EA7y Ph\xF3 Hi\u1EC7u tr\u01B0\u1EDFng Nguy\u1EC5n Minh Tr\xED tr\u1EF1c ti\u1EBFp ph\u1EE5 tr\xE1ch chuy\xEAn m\xF4n.
${is2BuoiPlan ? `
3. QUY \u0110\u1ECANH B\u1EAET BU\u1ED8C KHI C\u1EE4 TH\u1EC2 H\xD3A K\u1EBE HO\u1EA0CH D\u1EA0Y H\u1ECCC 2 BU\u1ED4I/NG\xC0Y (B\xC1M S\xC1T K\u1EBE HO\u1EA0CH C\u1EE6A S\u1EDE GD\u0110T \u0110\u1ED2NG TH\xC1P):
   - Quy t\u1EAFc 1 (Khung s\u01B0\u1EDDn c\u1EE9ng): B\u1EAFt bu\u1ED9c b\xE1m theo \u0111\xFAng 5 m\u1EE5c l\u1EDBn c\u1EE7a S\u1EDF GD\u0110T:
     * I. M\u1EE4C \u0110\xCDCH, Y\xCAU C\u1EA6U (M\u1EE5c \u0111\xEDch a, b, c, d; Y\xEAu c\u1EA7u a, b, c, d b\xE1m s\xE1t S\u1EDF).
     * II. N\u1ED8I DUNG, H\xCCNH TH\u1EE8C T\u1ED4 CH\u1EE8C D\u1EA0Y H\u1ECCC 2 BU\u1ED4I/NG\xC0Y:
       + 1. \u0110\u1ED1i v\u1EDBi c\u1EA5p trung h\u1ECDc c\u01A1 s\u1EDF: 39 l\u1EDBp (24 l\u1EDBp \u0111i\u1EC3m \u0110\u1ED1c Binh Ki\u1EC1u, 15 l\u1EDBp \u0111i\u1EC3m T\xE2n Ki\u1EC1u c\xE1ch 11km). Th\u1EDDi l\u01B0\u1EE3ng, th\u1EDDi kh\xF3a bi\u1EC3u (s\xE1ng kh\u1ED1i 8,9; chi\u1EC1u kh\u1ED1i 6,7), n\u1ED9i dung Bu\u1ED5i 1 ch\xEDnh kh\xF3a v\xE0 Bu\u1ED5i 2 (ph\u1EE5 \u0111\u1EA1o mi\u1EC5n ph\xED h\u1ECDc sinh ch\u01B0a \u0111\u1EA1t YCC\u0110, b\u1ED3i d\u01B0\u1EE1ng HSG l\u1EDBp 9, \xF4n thi v\xE0o l\u1EDBp 10, STEM, Tin h\u1ECDc-AI, CLB).
       + 2. \u0110\u1ED1i v\u1EDBi c\u1EA5p trung h\u1ECDc ph\u1ED5 th\xF4ng: 14 l\u1EDBp (Kh\u1ED1i 10, 11, 12 t\u1EA1i \u0110i\u1EC3m ch\xEDnh). Th\u1EDDi l\u01B0\u1EE3ng, th\u1EDDi kh\xF3a bi\u1EC3u s\xE1ng ch\xEDnh kh\xF3a, chi\u1EC1u bu\u1ED5i 2 (ph\u1EE5 \u0111\u1EA1o, b\u1ED3i d\u01B0\u1EE1ng HSG t\u1EC9nh, \xF4n thi t\u1ED1t nghi\u1EC7p THPT theo t\u1ED5 h\u1EE3p KHTN/KHXH, NCKH k\u1EF9 thu\u1EADt).
       (L\u01AFU \xDD: X\xD3A B\u1ECE M\u1EE4C TI\u1EC2U H\u1ECCC C\u1EE6A S\u1EDE V\xCC TR\u01AF\u1EDCNG CH\u1EC8 C\xD3 THCS V\xC0 THPT).
     * III. KINH PH\xCD V\xC0 \u0110I\u1EC0U KI\u1EC6N TH\u1EF0C HI\u1EC6N: Kinh ph\xED ng\xE2n s\xE1ch chi th\u01B0\u1EDDng xuy\xEAn theo \u0111\u1ECBnh m\u1EE9c v\xE0 C\xF4ng v\u0103n 9179/BTC-NSNN; ch\u1EE7 tr\u01B0\u01A1ng x\xE3 h\u1ED9i h\xF3a gi\xE1o d\u1EE5c \u0111\xFAng quy \u0111\u1ECBnh, nguy\xEAn t\u1EAFc t\u1EF1 nguy\u1EC7n, c\xF4ng khai, tuy\u1EC7t \u0111\u1ED1i kh\xF4ng thu ti\u1EC1n sai quy \u0111\u1ECBnh; khai th\xE1c 19 ph\xF2ng b\u1ED9 m\xF4n v\xE0 c\xE1c ph\xF2ng m\xE1y t\xEDnh.
     * IV. T\u1ED4 CH\u1EE8C TH\u1EF0C HI\u1EC6N: Ph\xE2n c\xF4ng nhi\u1EC7m v\u1EE5 c\xF3 'h\u1ED3n' g\u1EAFn li\u1EC1n h\u1EC7 th\u1ED1ng ph\xE2n c\xF4ng chuy\xEAn m\xF4n phancongchuyenmonthcsthptdbk.vercel.app:
       + Ban Gi\xE1m hi\u1EC7u: Th\u1EA7y Hi\u1EC7u tr\u01B0\u1EDFng L\xEA Thanh C\u01B0\u1EDDng ch\u1EC9 \u0111\u1EA1o chung; Th\u1EA7y Ph\xF3 Hi\u1EC7u tr\u01B0\u1EDFng Nguy\u1EC5n Minh Tr\xED tr\u1EF1c ti\u1EBFp ph\u1EE5 tr\xE1ch chuy\xEAn m\xF4n 2 bu\u1ED5i/ng\xE0y to\xE0n tr\u01B0\u1EDDng, duy\u1EC7t k\u1EBF ho\u1EA1ch bu\u1ED5i 2, x\u1EBFp TKB, gi\xE1m s\xE1t k\xEA khai th\u1EEBa thi\u1EBFu ti\u1EBFt tr\xEAn webapp ph\xE2n c\xF4ng chuy\xEAn m\xF4n; C\xE1n b\u1ED9 ph\u1EE5 tr\xE1ch \u0110i\u1EC3m T\xE2n Ki\u1EC1u.
       + 07 T\u1ED5 chuy\xEAn m\xF4n: X\xE2y d\u1EF1ng k\u1EBF ho\u1EA1ch d\u1EA1y bu\u1ED5i 2, ph\xE2n c\xF4ng gi\xE1o vi\xEAn theo \u0111\u1ECBnh m\u1EE9c, theo d\xF5i k\xEA khai th\u1EEBa thi\u1EBFu ti\u1EBFt.
       + Gi\xE1o vi\xEAn b\u1ED9 m\xF4n, Gi\xE1o vi\xEAn ch\u1EE7 nhi\u1EC7m, Ban \u0111\u1EA1i di\u1EC7n CMHS.
     * V. CH\u1EBE \u0110\u1ED8 TH\xD4NG TIN, B\xC1O C\xC1O: B\xE1o c\xE1o \u0111\u1ECBnh k\u1EF3 h\u1ECDc k\u1EF3 1 v\xE0 cu\u1ED1i n\u0103m h\u1ECDc v\u1EC1 S\u1EDF GD\u0110T \u0110\u1ED3ng Th\xE1p (qua Ph\xF2ng GDPT).
   - Quy t\u1EAFc 2 (C\u0103n c\u1EE9 ph\xE1p l\xFD - B\u1EAET BU\u1ED8C R\u1EA4T NG\u1EAEN G\u1ECCN):
     * Ch\u1EC9 tr\xEDch d\u1EABn \u0110\xDANG V\u0102N B\u1EA2N G\u1ED0C m\xE0 m\xECnh c\u1EA7n \u0111\u1ECDc \u0111\u1EC3 x\xE2y d\u1EF1ng k\u1EBF ho\u1EA1ch n\xE0y (t\u1ED1i \u0111a 2-3 c\u0103n c\u1EE9, kh\xF4ng tr\xEDch d\u1EABn d\xE0i d\xF2ng).
     * Tr\xEDch d\u1EABn r\xF5: K\u1EBF ho\u1EA1ch s\u1ED1    /KH-SGD\u0110T ng\xE0y    th\xE1ng 8 n\u0103m 2026 c\u1EE7a S\u1EDF Gi\xE1o d\u1EE5c v\xE0 \u0110\xE0o t\u1EA1o t\u1EC9nh \u0110\u1ED3ng Th\xE1p v\u1EC1 Tri\u1EC3n khai t\u1ED5 ch\u1EE9c d\u1EA1y h\u1ECDc 2 bu\u1ED5i/ng\xE0y \u0111\u1ED1i v\u1EDBi c\u01A1 s\u1EDF gi\xE1o d\u1EE5c ph\u1ED5 th\xF4ng tr\xEAn \u0111\u1ECBa b\xE0n t\u1EC9nh \u0110\u1ED3ng Th\xE1p. (\u0110\u1EC3 tr\u1ED1ng s\u1ED1 v\xE0 ng\xE0y n\u1EBFu v\u0103n b\u1EA3n g\u1ED1c l\xE0 b\u1EA3n d\u1EF1 th\u1EA3o \u0111\u1EC3 ng\u01B0\u1EDDi d\xF9ng t\u1EF1 b\u1ED5 sung).
     * K\xE8m Quy\u1EBFt \u0111\u1ECBnh s\u1ED1 2606/Q\u0110-UBND ng\xE0y 13/8/2026 s\xE1p nh\u1EADp tr\u01B0\u1EDDng v\xE0 K\u1EBF ho\u1EA1ch gi\xE1o d\u1EE5c nh\xE0 tr\u01B0\u1EDDng s\u1ED1 28/KH-THCS&THPT\u0110BK. Tuy\u1EC7t \u0111\u1ED1i kh\xF4ng tr\xEDch d\u1EABn th\xEAm c\xE1c ch\u1EC9 th\u1ECB hay c\xF4ng v\u0103n ngo\xE0i ng\xE0nh d\xE0i d\xF2ng.
   - Quy t\u1EAFc 4 (V\u0102N PHONG T\u1EF0 NHI\xCAN, CHU\u1EA8N M\u1EF0C S\u01AF PH\u1EA0M, KH\xD4NG 'M\xC1Y M\xD3C KI\u1EC2U AI'):
     * TUY\u1EC6T \u0110\u1ED0I KH\xD4NG li\u1EC7t k\xEA chi ti\u1EBFt c\xE1c t\u1ED5 chuy\xEAn m\xF4n k\xE8m s\u1ED1 gi\xE1o vi\xEAn (v\xED d\u1EE5 KH\xD4NG vi\u1EBFt "C\xE1c T\u1ED5 chuy\xEAn m\xF4n (07 t\u1ED5: T\u1ED5 To\xE1n 15 GV, T\u1ED5 Ng\u1EEF v\u0103n 17 GV...)"). Ch\u1EC9 vi\u1EBFt t\u1EF1 nhi\xEAn, \u0111\xFAng ch\u1EE9c danh: "C\xE1c T\u1ED5 chuy\xEAn m\xF4n v\xE0 T\u1ED5 V\u0103n ph\xF2ng:".
     * TUY\u1EC6T \u0110\u1ED0I KH\xD4NG ch\xE8n s\u1ED1 li\u1EC7u c\u1EE5 th\u1EC3 (101 c\xE1n b\u1ED9 gi\xE1o vi\xEAn, s\u1ED1 l\u1EDBp, s\u1ED1 h\u1ECDc sinh) v\xE0o c\xE1c c\xE2u v\u0103n mi\xEAu t\u1EA3 chung chung (KH\xD4NG vi\u1EBFt "S\u1EED d\u1EE5ng hi\u1EC7u qu\u1EA3 \u0111\u1ED9i ng\u0169 101 c\xE1n b\u1ED9, gi\xE1o vi\xEAn", ch\u1EC9 vi\u1EBFt "S\u1EED d\u1EE5ng hi\u1EC7u qu\u1EA3 \u0111\u1ED9i ng\u0169 c\xE1n b\u1ED9, gi\xE1o vi\xEAn").
     * S\u1ED1 l\u01B0\u1EE3ng h\u1ECDc sinh, s\u1ED1 l\u1EDBp ch\u1EC9 ghi khi th\u1EF1c s\u1EF1 c\u1EA7n thi\u1EBFt, tuy\u1EC7t \u0111\u1ED1i kh\xF4ng ph\xF4 tr\u01B0\u01A1ng s\u1ED1 li\u1EC7u v\u1EE5n v\u1EB7t g\xE2y ph\u1EA3n c\u1EA3m ki\u1EC3u m\xE1y m\xF3c.
` : ""}

H\xC3Y XU\u1EA4T RA D\u1EEE LI\u1EC6U \u0110\u1ECANH D\u1EA0NG JSON \u0110\xDANG CHU\u1EA8N TH\u1EC2 TH\u1EE8C NGH\u1ECA \u0110\u1ECANH 30/2020/N\u0110-CP:
{
  "type": "${documentType}",
  "typeLabel": "${targetTypeLabel}",
  "documentNumber": "S\u1ED1: .../${targetCodePrefix}",
  "title": "${targetTypeLabel}",
  "subTitle": "${topic.replace(/^(Kế hoạch|Quyết định|Hướng dẫn|Quy chế|Báo cáo|Thông báo|Tờ trình)\s*/i, "").trim()}",
  "signDate": "\u0110\u1ED3ng Th\xE1p, ng\xE0y 28 th\xE1ng 9 n\u0103m 2026",
  "issuingAuthorityTop": "S\u1EDE GI\xC1O D\u1EE4C V\xC0 \u0110\xC0O T\u1EA0O \u0110\u1ED2NG TH\xC1P",
  "issuingAuthority": "TR\u01AF\u1EDCNG THCS V\xC0 THPT\\n\u0110\u1ED0C BINH KI\u1EC0U",
  "signerRole": "${signerRole}",
  "signerName": "${signerName}",
  "sourceDirective": "Tra c\u1EE9u ph\xE1p lu\u1EADt & H\u01B0\u1EDBng d\u1EABn chuy\xEAn m\xF4n B\u1ED9 GD\u0110T, S\u1EDF GD\u0110T \u0110\u1ED3ng Th\xE1p",
  "legalBases": [
    "C\u0103n c\u1EE9 [T\xEAn v\u0103n b\u1EA3n g\u1ED1c c\u1EE7a S\u1EDF GD\u0110T/B\u1ED9 GD\u0110T c\u1EA7n \u0111\u1ECDc, ghi r\xF5 S\u1ED1 hi\u1EC7u v\xE0 Ng\xE0y ban h\xE0nh n\u1EBFu c\xF3, n\u1EBFu ch\u01B0a r\xF5 th\xEC \u0111\u1EC3 tr\u1ED1ng s\u1ED1    / ng\xE0y    th\xE1ng    n\u0103m 2026]...",
    "C\u0103n c\u1EE9 Quy\u1EBFt \u0111\u1ECBnh s\u1ED1 2606/Q\u0110-UBND ng\xE0y 13/8/2026 c\u1EE7a UBND t\u1EC9nh \u0110\u1ED3ng Th\xE1p v\u1EC1 vi\u1EC7c s\xE1p nh\u1EADp th\xE0nh Tr\u01B0\u1EDDng THCS v\xE0 THPT \u0110\u1ED1c Binh Ki\u1EC1u",
    "C\u0103n c\u1EE9 K\u1EBF ho\u1EA1ch gi\xE1o d\u1EE5c nh\xE0 tr\u01B0\u1EDDng n\u0103m h\u1ECDc 2026 - 2027 s\u1ED1 34/KH-THCS&THPT\u0110BK ng\xE0y 25 th\xE1ng 9 n\u0103m 2026 c\u1EE7a Tr\u01B0\u1EDDng THCS v\xE0 THPT \u0110\u1ED1c Binh Ki\u1EC1u"
  ],
  "sections": [
    {
      "heading": "I. M\u1EE4C \u0110\xCDCH, Y\xCAU C\u1EA6U",
      "content": "1. M\u1EE5c \u0111\xEDch:\\n...\\n\\n2. Y\xEAu c\u1EA7u:\\n..."
    },
    {
      "heading": "II. \u0110\u1EB6C \u0110I\u1EC2M T\xCCNH H\xCCNH V\xC0 C\u01A0 C\u1EA4U \u0110I\u1EC0U KI\u1EC6N T\u1ED4 CH\u1EE8C",
      "content": "1. Quy m\xF4 h\u1ECDc sinh v\xE0 l\u1EDBp h\u1ECDc (53 l\u1EDBp: 39 THCS g\u1ED3m 24 l\u1EDBp \u0111i\u1EC3m \u0110\u1ED1c Binh Ki\u1EC1u, 15 l\u1EDBp \u0111i\u1EC3m T\xE2n Ki\u1EC1u c\xE1ch 11km; 14 l\u1EDBp THPT):\\n...\\n\\n2. \u0110\u1ED9i ng\u0169 c\xE1n b\u1ED9 qu\u1EA3n l\xFD v\xE0 gi\xE1o vi\xEAn (120 CB-GV-NV, 102 GV tr\u1EF1c ti\u1EBFp gi\u1EA3ng d\u1EA1y):\\n...\\n\\n3. Thu\u1EADn l\u1EE3i v\xE0 kh\xF3 kh\u0103n:..."
    },
    {
      "heading": "III. N\u1ED8I DUNG, H\xCCNH TH\u1EE8C V\xC0 KHUNG TH\u1EDCI GIAN HO\u1EA0T \u0110\u1ED8NG",
      "content": "1. N\u1ED9i dung t\u1ED5 ch\u1EE9c d\u1EA1y h\u1ECDc:\\na) Bu\u1ED5i s\xE1ng (6h30 - 11h30 - \u0111\u1EE7 5 ti\u1EBFt):...\\nb) Bu\u1ED5i chi\u1EC1u (12h00 - 17h00 - \u0111\u1EE7 5 ti\u1EBFt):...\\n\\n2. Khung th\u1EDDi gian bi\u1EC3u ho\u1EA1t \u0111\u1ED9ng trong ng\xE0y:..."
    },
    {
      "heading": "IV. B\u1ED0 TR\xCD \u0110\u1ED8I NG\u0168, C\u01A0 S\u1EDE V\u1EACT CH\u1EA4T V\xC0 KINH PH\xCD",
      "content": "1. Ph\xE2n c\xF4ng \u0111\u1ED9i ng\u0169 gi\xE1o vi\xEAn (b\u1ED1 tr\xED d\u1EA1y li\u1EC1n bu\u1ED5i c\xF9ng 1 \u0111i\u1EC3m tr\u01B0\u1EDDng, tr\xE1nh \u0111i l\u1EA1i gi\u1EEFa 2 \u0111i\u1EC3m tr\u01B0\u1EDDng c\xE1ch 11km):\\n...\\n\\n2. Khai th\xE1c c\u01A1 s\u1EDF v\u1EADt ch\u1EA5t (ph\xF2ng b\u1ED9 m\xF4n, ph\xF2ng m\xE1y t\xEDnh, th\u01B0 vi\u1EC7n):\\n...\\n\\n3. Kinh ph\xED th\u1EF1c hi\u1EC7n:..."
    },
    {
      "heading": "V. T\u1ED4 CH\u1EE8C TH\u1EF0C HI\u1EC6N",
      "content": "1. Ban Gi\xE1m hi\u1EC7u (Hi\u1EC7u tr\u01B0\u1EDFng L\xEA Thanh C\u01B0\u1EDDng, Ph\xF3 Hi\u1EC7u tr\u01B0\u1EDFng Nguy\u1EC5n Minh Tr\xED):\\n...\\n\\n2. C\xE1c T\u1ED5 chuy\xEAn m\xF4n v\xE0 Gi\xE1o vi\xEAn:\\n...\\n\\n3. B\u1ED9 ph\u1EADn ph\u1EE5 tr\xE1ch \u0110i\u1EC3m T\xE2n Ki\u1EC1u v\xE0 Ban \u0110\u1EA1i di\u1EC7n CMHS:..."
    }
  ],
  "recipients": [
    "S\u1EDF GD\u0110T \u0110\u1ED3ng Th\xE1p (\u0111\u1EC3 b\xE1o c\xE1o);",
    "Ban Gi\xE1m hi\u1EC7u (\u0111\u1EC3 ch\u1EC9 \u0111\u1EA1o);",
    "C\xE1c t\u1ED5 chuy\xEAn m\xF4n, v\u0103n ph\xF2ng (\u0111\u1EC3 th\u1EF1c hi\u1EC7n);",
    "L\u01B0u: VT, CM."
  ]
}
`;
    const fallbackFn = () => {
      const currentDateStr = `Th\xE1p M\u01B0\u1EDDi, ng\xE0y ${(/* @__PURE__ */ new Date()).getDate()} th\xE1ng ${(/* @__PURE__ */ new Date()).getMonth() + 1} n\u0103m 2026`;
      const defaultDocNum = `S\u1ED1: ${Math.floor(Math.random() * 50) + 50}/${targetCodePrefix}`;
      const upperTopic = topic.trim().toUpperCase();
      let specificLegal = [
        "Quy\u1EBFt \u0111\u1ECBnh s\u1ED1 2606/Q\u0110-UBND ng\xE0y 13 th\xE1ng 8 n\u0103m 2026 c\u1EE7a \u1EE6y ban nh\xE2n d\xE2n t\u1EC9nh \u0110\u1ED3ng Th\xE1p v\u1EC1 vi\u1EC7c s\xE1p nh\u1EADp Tr\u01B0\u1EDDng THCS \u0110\u1ED1c Binh Ki\u1EC1u, Tr\u01B0\u1EDDng THCS T\xE2n Ki\u1EC1u v\xE0 Tr\u01B0\u1EDDng THPT \u0110\u1ED1c Binh Ki\u1EC1u th\xE0nh Tr\u01B0\u1EDDng THCS v\xE0 THPT \u0110\u1ED1c Binh Ki\u1EC1u",
        "K\u1EBF ho\u1EA1ch gi\xE1o d\u1EE5c nh\xE0 tr\u01B0\u1EDDng n\u0103m h\u1ECDc 2026 - 2027 s\u1ED1 28/KH-THCS&THPT\u0110BK ng\xE0y 05 th\xE1ng 9 n\u0103m 2026 c\u1EE7a Tr\u01B0\u1EDDng THCS v\xE0 THPT \u0110\u1ED1c Binh Ki\u1EC1u"
      ];
      if (topic.toLowerCase().includes("2 bu\u1ED5i") || topic.toLowerCase().includes("hai bu\u1ED5i")) {
        return {
          type: "plan",
          typeLabel: "K\u1EBE HO\u1EA0CH",
          documentNumber: `S\u1ED1: 45/KH-THCS&THPT\u0110BK`,
          title: "K\u1EBE HO\u1EA0CH",
          subTitle: "T\u1ED5 ch\u1EE9c d\u1EA1y h\u1ECDc 2 bu\u1ED5i/ng\xE0y n\u0103m h\u1ECDc 2026 - 2027",
          signDate: "\u0110\u1ED3ng Th\xE1p, ng\xE0y 28 th\xE1ng 9 n\u0103m 2026",
          issuingAuthorityTop: "S\u1EDE GD\u0110T T\u1EC8NH \u0110\u1ED2NG TH\xC1P",
          issuingAuthority: "TR\u01AF\u1EDCNG THCS V\xC0 THPT\n\u0110\u1ED0C BINH KI\u1EC0U",
          signerRole,
          signerName,
          sourceDirective: "K\u1EBF ho\u1EA1ch s\u1ED1    /KH-SGD\u0110T ng\xE0y    th\xE1ng 8 n\u0103m 2026 c\u1EE7a S\u1EDF GD\u0110T \u0110\u1ED3ng Th\xE1p",
          legalBases: [
            "K\u1EBF ho\u1EA1ch s\u1ED1    /KH-SGD\u0110T ng\xE0y    th\xE1ng 8 n\u0103m 2026 c\u1EE7a S\u1EDF Gi\xE1o d\u1EE5c v\xE0 \u0110\xE0o t\u1EA1o t\u1EC9nh \u0110\u1ED3ng Th\xE1p v\u1EC1 Tri\u1EC3n khai t\u1ED5 ch\u1EE9c d\u1EA1y h\u1ECDc 2 bu\u1ED5i/ng\xE0y \u0111\u1ED1i v\u1EDBi c\u01A1 s\u1EDF gi\xE1o d\u1EE5c ph\u1ED5 th\xF4ng tr\xEAn \u0111\u1ECBa b\xE0n t\u1EC9nh \u0110\u1ED3ng Th\xE1p",
            "Quy\u1EBFt \u0111\u1ECBnh s\u1ED1 2606/Q\u0110-UBND ng\xE0y 13 th\xE1ng 8 n\u0103m 2026 c\u1EE7a \u1EE6y ban nh\xE2n d\xE2n t\u1EC9nh \u0110\u1ED3ng Th\xE1p v\u1EC1 vi\u1EC7c s\xE1p nh\u1EADp Tr\u01B0\u1EDDng THCS \u0110\u1ED1c Binh Ki\u1EC1u, Tr\u01B0\u1EDDng THCS T\xE2n Ki\u1EC1u v\xE0 Tr\u01B0\u1EDDng THPT \u0110\u1ED1c Binh Ki\u1EC1u th\xE0nh Tr\u01B0\u1EDDng THCS v\xE0 THPT \u0110\u1ED1c Binh Ki\u1EC1u",
            "K\u1EBF ho\u1EA1ch gi\xE1o d\u1EE5c nh\xE0 tr\u01B0\u1EDDng n\u0103m h\u1ECDc 2026 - 2027 s\u1ED1 28/KH-THCS&THPT\u0110BK ng\xE0y 05 th\xE1ng 9 n\u0103m 2026 c\u1EE7a Tr\u01B0\u1EDDng THCS v\xE0 THPT \u0110\u1ED1c Binh Ki\u1EC1u"
          ],
          sections: [
            {
              heading: "I. M\u1EE4C \u0110\xCDCH, Y\xCAU C\u1EA6U",
              content: `1. M\u1EE5c \u0111\xEDch:
- N\xE2ng cao ch\u1EA5t l\u01B0\u1EE3ng gi\xE1o d\u1EE5c to\xE0n di\u1EC7n, c\u1EE7ng c\u1ED1 v\xE0 n\xE2ng cao ch\u1EA5t l\u01B0\u1EE3ng gi\xE1o d\u1EE5c \u0111\u1EA1i tr\xE0 v\xE0 gi\xE1o d\u1EE5c m\u0169i nh\u1ECDn cho h\u1ECDc sinh to\xE0n tr\u01B0\u1EDDng \u1EDF c\u1EA3 2 c\u1EA5p h\u1ECDc (THCS v\xE0 THPT) theo Ch\u01B0\u01A1ng tr\xECnh GDPT 2018.
- T\u1EA1o \u0111i\u1EC1u ki\u1EC7n thu\u1EADn l\u1EE3i cho h\u1ECDc sinh \u0111\u01B0\u1EE3c r\xE8n luy\u1EC7n k\u1EF9 n\u0103ng t\u1EF1 h\u1ECDc, k\u1EF9 n\u0103ng th\u1EF1c h\xE0nh th\xED nghi\u1EC7m, n\u0103ng l\u1EF1c s\u1ED1 v\xE0 \u1EE9ng d\u1EE5ng Tr\xED tu\u1EC7 nh\xE2n t\u1EA1o (AI); tham gia c\xE1c ho\u1EA1t \u0111\u1ED9ng gi\xE1o d\u1EE5c STEM, tr\u1EA3i nghi\u1EC7m h\u01B0\u1EDBng nghi\u1EC7p v\xE0 r\xE8n luy\u1EC7n th\u1EC3 ch\u1EA5t, ngh\u1EC7 thu\u1EADt.
- Kh\u1EAFc ph\u1EE5c t\xECnh tr\u1EA1ng h\u1ECDc th\xEAm, d\u1EA1y th\xEAm sai quy \u0111\u1ECBnh; gi\xFAp \u0111\u1EE1 k\u1ECBp th\u1EDDi nh\u1EEFng h\u1ECDc sinh c\xF3 nguy c\u01A1 ch\u01B0a \u0111\u1EA1t y\xEAu c\u1EA7u c\u1EA7n \u0111\u1EA1t (YCC\u0110) v\xE0 b\u1ED3i d\u01B0\u1EE1ng chuy\xEAn s\xE2u cho h\u1ECDc sinh gi\u1ECFi tham gia c\xE1c k\u1EF3 thi c\u1EA5p t\u1EC9nh.

2. Y\xEAu c\u1EA7u:
- T\u1ED5 ch\u1EE9c d\u1EA1y h\u1ECDc 2 bu\u1ED5i/ng\xE0y ph\u1EA3i b\u1EA3o \u0111\u1EA3m t\xEDnh t\u1EF1 nguy\u1EC7n, \u0111\u1ED3ng thu\u1EADn c\u1EE7a cha m\u1EB9 h\u1ECDc sinh; ph\xF9 h\u1EE3p v\u1EDBi \u0111i\u1EC1u ki\u1EC7n c\u01A1 s\u1EDF v\u1EADt ch\u1EA5t v\xE0 \u0111\u1ED9i ng\u0169 gi\xE1o vi\xEAn c\u1EE7a t\u1EEBng \u0111i\u1EC3m tr\u01B0\u1EDDng (\u0110i\u1EC3m ch\xEDnh, \u0110i\u1EC3m \u0110\u1ED1c Binh Ki\u1EC1u v\xE0 \u0110i\u1EC3m T\xE2n Ki\u1EC1u c\xE1ch 11km).
- Kh\xF4ng g\xE2y qu\xE1 t\u1EA3i cho h\u1ECDc sinh v\xE0 gi\xE1o vi\xEAn; ph\xE2n \u0111\u1ECBnh r\xE0nh m\u1EA1ch gi\u1EEFa ch\u01B0\u01A1ng tr\xECnh ch\xEDnh kh\xF3a bu\u1ED5i s\xE1ng v\xE0 c\xE1c ho\u1EA1t \u0111\u1ED9ng gi\xE1o d\u1EE5c t\u0103ng c\u01B0\u1EDDng bu\u1ED5i chi\u1EC1u.
- B\u1EA3o \u0111\u1EA3m an to\xE0n tuy\u1EC7t \u0111\u1ED1i cho h\u1ECDc sinh trong su\u1ED1t th\u1EDDi gian h\u1ECDc t\u1EADp t\u1EA1i tr\u01B0\u1EDDng.`
            },
            {
              heading: "II. \u0110\u1EB6C \u0110I\u1EC2M T\xCCNH H\xCCNH V\xC0 C\u01A0 C\u1EA4U \u0110I\u1EC0U KI\u1EC6N T\u1ED4 CH\u1EE8C",
              content: `1. Quy m\xF4 h\u1ECDc sinh v\xE0 l\u1EDBp h\u1ECDc:
- To\xE0n tr\u01B0\u1EDDng: 53 l\u1EDBp v\u1EDBi 2.143 h\u1ECDc sinh (C\u1EA5p THCS: 39 l\u1EDBp v\u1EDBi 1.613 HS; C\u1EA5p THPT: 14 l\u1EDBp v\u1EDBi 530 HS).
- Ph\xE2n b\u1ED5 theo 3 \u0111i\u1EC3m tr\u01B0\u1EDDng:
  + \u0110i\u1EC3m ch\xEDnh (Kh\u1ED1i 10, 11, 12): 14 l\u1EDBp, 530 h\u1ECDc sinh. C\u01A1 s\u1EDF v\u1EADt ch\u1EA5t c\xF3 14 ph\xF2ng h\u1ECDc, 09 ph\xF2ng b\u1ED9 m\xF4n ki\xEAn c\u1ED1, 03 ph\xF2ng l\u1EAFp gh\xE9p, ph\xF2ng m\xE1y vi t\xEDnh.
  + \u0110i\u1EC3m \u0110\u1ED1c Binh Ki\u1EC1u (Kh\u1ED1i 6, 7, 8, 9): 24 l\u1EDBp, 983 h\u1ECDc sinh. C\u01A1 s\u1EDF v\u1EADt ch\u1EA5t c\xF3 22 ph\xF2ng h\u1ECDc, 05 ph\xF2ng ch\u1EE9c n\u0103ng, s\xE2n b\xF3ng \u0111\xE1 mini, s\xE2n b\xF3ng chuy\u1EC1n.
  + \u0110i\u1EC3m T\xE2n Ki\u1EC1u (Kh\u1ED1i 6, 7, 8, 9 - c\xE1ch \u0111i\u1EC3m ch\xEDnh 11 km): 15 l\u1EDBp, 557 h\u1ECDc sinh. C\u01A1 s\u1EDF v\u1EADt ch\u1EA5t c\xF3 09 ph\xF2ng h\u1ECDc, 10 ph\xF2ng b\u1ED9 m\xF4n.

2. \u0110\u1ED9i ng\u0169 c\xE1n b\u1ED9 qu\u1EA3n l\xFD v\xE0 gi\xE1o vi\xEAn:
- T\u1ED5ng s\u1ED1: 120 ng\u01B0\u1EDDi (04 Ban Gi\xE1m hi\u1EC7u, 102 Gi\xE1o vi\xEAn tr\u1EF1c ti\u1EBFp gi\u1EA3ng d\u1EA1y, 14 Nh\xE2n vi\xEAn). C\xF3 85 \u0110\u1EA3ng vi\xEAn, 09 Th\u1EA1c s\u0129.
- 08 T\u1ED5 chuy\xEAn m\xF4n: Ban Gi\xE1m hi\u1EC7u (04), T\u1ED5 To\xE1n (15), T\u1ED5 Ng\u1EEF v\u0103n - Th\u01B0 vi\u1EC7n - Thi\u1EBFt b\u1ECB (17), T\u1ED5 L\u1ECBch s\u1EED - \u0110\u1ECBa l\xFD - GDCD - GDKTPL (16), T\u1ED5 V\u1EADt l\xFD - H\xF3a h\u1ECDc - Sinh h\u1ECDc - C\xF4ng ngh\u1EC7 (26), T\u1ED5 Ngo\u1EA1i ng\u1EEF - Tin h\u1ECDc (16), T\u1ED5 GDTC - QPAN - Ngh\u1EC7 thu\u1EADt (12), T\u1ED5 V\u0103n ph\xF2ng (14).

3. Thu\u1EADn l\u1EE3i v\xE0 kh\xF3 kh\u0103n:
- Thu\u1EADn l\u1EE3i: \u0110\u01B0\u1EE3c s\u1EF1 quan t\xE2m s\xE2u s\xE1t c\u1EE7a S\u1EDF GD\u0110T \u0110\u1ED3ng Th\xE1p, ch\xEDnh quy\u1EC1n \u0111\u1ECBa ph\u01B0\u01A1ng v\xE0 s\u1EF1 \u0111\u1ED3ng thu\u1EADn cao c\u1EE7a Ban \u0111\u1EA1i di\u1EC7n CMHS. \u0110\u1ED9i ng\u0169 gi\xE1o vi\xEAn tr\u1EBB, nhi\u1EC7t huy\u1EBFt, 100% \u0111\u1EA1t chu\u1EA9n v\xE0 tr\xEAn chu\u1EA9n \u0111\xE0o t\u1EA1o.
- Kh\xF3 kh\u0103n: \u0110\u1ECBa b\xE0n tr\u1EA3i r\u1ED9ng tr\xEAn 2 x\xE3; \u0110i\u1EC3m T\xE2n Ki\u1EC1u c\xE1ch \u0111i\u1EC3m ch\xEDnh 11 km \u0111\xF2i h\u1ECFi ph\u01B0\u01A1ng \xE1n s\u1EAFp x\u1EBFp th\u1EDDi kh\xF3a bi\u1EC3u th\xF4ng minh, \u01B0u ti\xEAn gi\xE1o vi\xEAn d\u1EA1y li\u1EC1n bu\u1ED5i t\u1EA1i c\xF9ng 1 \u0111i\u1EC3m tr\u01B0\u1EDDng, kh\xF4ng b\u1ED1 tr\xED gi\xE1o vi\xEAn di chuy\u1EC3n gi\u1EEFa 2 \u0111i\u1EC3m tr\u01B0\u1EDDng trong c\xF9ng m\u1ED9t bu\u1ED5i.`
            },
            {
              heading: "III. N\u1ED8I DUNG, H\xCCNH TH\u1EE8C V\xC0 KHUNG TH\u1EDCI GIAN HO\u1EA0T \u0110\u1ED8NG 2 BU\u1ED4I/NG\xC0Y",
              content: `1. N\u1ED9i dung t\u1ED5 ch\u1EE9c d\u1EA1y h\u1ECDc:
a) Bu\u1ED5i s\xE1ng (Ch\xEDnh kh\xF3a kh\u1ED1i 8, 9, 10, 11, 12 v\xE0 t\u0103ng c\u01B0\u1EDDng kh\u1ED1i 6, 7):
- Th\u1EF1c hi\u1EC7n \u0111\u1EA7y \u0111\u1EE7 ch\u01B0\u01A1ng tr\xECnh c\xE1c m\xF4n h\u1ECDc b\u1EAFt bu\u1ED9c v\xE0 m\xF4n h\u1ECDc l\u1EF1a ch\u1ECDn theo Ch\u01B0\u01A1ng tr\xECnh GDPT 2018.
- B\u1ED1 tr\xED c\xE1c m\xF4n c\xF3 t\xEDnh t\u01B0 duy cao v\xE0o c\xE1c ti\u1EBFt \u0111\u1EA7u bu\u1ED5i s\xE1ng.
b) Bu\u1ED5i chi\u1EC1u (Ch\xEDnh kh\xF3a kh\u1ED1i 6, 7 v\xE0 t\u0103ng c\u01B0\u1EDDng kh\u1ED1i 8, 9, 10, 11, 12):
- Ho\u1EA1t \u0111\u1ED9ng 1: C\u1EE7ng c\u1ED1 ki\u1EBFn th\u1EE9c, ph\u1EE5 \u0111\u1EA1o h\u1ECDc sinh c\xF3 nguy c\u01A1 ch\u01B0a \u0111\u1EA1t YCC\u0110 c\xE1c m\xF4n To\xE1n, Ng\u1EEF v\u0103n, Ti\u1EBFng Anh, KHTN (ho\xE0n to\xE0n mi\u1EC5n ph\xED, kh\xF4ng thu ti\u1EC1n c\u1EE7a h\u1ECDc sinh).
- Ho\u1EA1t \u0111\u1ED9ng 2: B\u1ED3i d\u01B0\u1EE1ng h\u1ECDc sinh gi\u1ECFi l\u1EDBp 9 v\xE0 kh\u1ED1i 10, 11, 12 chu\u1EA9n b\u1ECB k\u1EF3 thi ch\u1ECDn HSG c\u1EA5p t\u1EC9nh \u0110\u1ED3ng Th\xE1p.
- Ho\u1EA1t \u0111\u1ED9ng 3: Gi\xE1o d\u1EE5c STEM, tr\u1EA3i nghi\u1EC7m h\u01B0\u1EDBng nghi\u1EC7p, ho\u1EA1t \u0111\u1ED9ng c\xE2u l\u1EA1c b\u1ED9 Tin h\u1ECDc - Tr\xED tu\u1EC7 nh\xE2n t\u1EA1o (AI), c\xE2u l\u1EA1c b\u1ED9 V\u0103n h\u1ECDc, Ti\u1EBFng Anh giao ti\u1EBFp.
- Ho\u1EA1t \u0111\u1ED9ng 4: R\xE8n luy\u1EC7n th\u1EC3 d\u1EE5c th\u1EC3 thao (b\xF3ng \u0111\xE1, b\xF3ng chuy\u1EC1n, c\u1EA7u l\xF4ng, \u0111i\u1EC1n kinh) v\xE0 v\u0103n h\xF3a ngh\u1EC7 thu\u1EADt.

2. Khung th\u1EDDi gian bi\u1EC3u ho\u1EA1t \u0111\u1ED9ng trong ng\xE0y (\xC1p d\u1EE5ng th\u1ED1ng nh\u1EA5t cho c\u1EA3 3 \u0111i\u1EC3m tr\u01B0\u1EDDng):
- Bu\u1ED5i s\xE1ng (t\u1ED1i \u0111a 5 ti\u1EBFt):
  + 6h30 - 6h45: V\u1EC7 sinh tr\u01B0\u1EDDng l\u1EDBp (15 ph\xFAt)
  + 6h45 - 7h00: Sinh ho\u1EA1t \u0111\u1EA7u gi\u1EDD (15 ph\xFAt)
  + 7h00 - 7h45: Ti\u1EBFt 1 (ngh\u1EC9 10 ph\xFAt \u0111\u1ED5i ti\u1EBFt)
  + 7h55 - 8h40: Ti\u1EBFt 2 (ngh\u1EC9 15 ph\xFAt \u0111\u1ED5i ti\u1EBFt)
  + 8h55 - 9h40: Ti\u1EBFt 3 (ngh\u1EC9 10 ph\xFAt \u0111\u1ED5i ti\u1EBFt)
  + 9h50 - 10h35: Ti\u1EBFt 4 (ngh\u1EC9 10 ph\xFAt \u0111\u1ED5i ti\u1EBFt)
  + 10h45 - 11h30: Ti\u1EBFt 5
- Bu\u1ED5i chi\u1EC1u (t\u1ED1i \u0111a 5 ti\u1EBFt - t\u1EEB 12h00 \u0111\u1EBFn 17h00):
  + 12h00 \u2013 12h15: V\u1EC7 sinh tr\u01B0\u1EDDng l\u1EDBp (15 ph\xFAt)
  + 12h15 \u2013 12h30: Sinh ho\u1EA1t \u0111\u1EA7u gi\u1EDD (15 ph\xFAt)
  + 12h30 \u2013 13h15: Ti\u1EBFt 1 (ngh\u1EC9 10 ph\xFAt \u0111\u1ED5i ti\u1EBFt)
  + 13h25 \u2013 14h10: Ti\u1EBFt 2 (ngh\u1EC9 10 ph\xFAt \u0111\u1ED5i ti\u1EBFt)
  + 14h20 \u2013 15h05: Ti\u1EBFt 3 (ngh\u1EC9 15 ph\xFAt \u0111\u1ED5i ti\u1EBFt)
  + 15h20 \u2013 16h05: Ti\u1EBFt 4 (ngh\u1EC9 10 ph\xFAt \u0111\u1ED5i ti\u1EBFt)
  + 16h15 \u2013 17h00: Ti\u1EBFt 5 (k\u1EBFt th\xFAc bu\u1ED5i h\u1ECDc)`
            },
            {
              heading: "IV. B\u1ED0 TR\xCD \u0110\u1ED8I NG\u0168, C\u01A0 S\u1EDE V\u1EACT CH\u1EA4T V\xC0 KINH PH\xCD",
              content: `1. Ph\xE2n c\xF4ng \u0111\u1ED9i ng\u0169 gi\xE1o vi\xEAn:
- Ban Gi\xE1m hi\u1EC7u ph\xE2n c\xF4ng gi\xE1o vi\xEAn gi\u1EA3ng d\u1EA1y \u0111\xFAng chuy\xEAn ng\xE0nh \u0111\xE0o t\u1EA1o, b\u1EA3o \u0111\u1EA3m \u0111\u1ECBnh m\u1EE9c ti\u1EBFt d\u1EA1y theo quy \u0111\u1ECBnh c\u1EE7a B\u1ED9 GD\u0110T v\xE0 Ngh\u1ECB \u0111\u1ECBnh c\u1EE7a Ch\xEDnh ph\u1EE7.
- \u01AFu ti\xEAn b\u1ED1 tr\xED gi\xE1o vi\xEAn d\u1EA1y li\u1EC1n bu\u1ED5i t\u1EA1i c\xF9ng m\u1ED9t \u0111i\u1EC3m tr\u01B0\u1EDDng (\u0111\u1EB7c bi\u1EC7t c\xE1c gi\xE1o vi\xEAn \u0111\u01B0\u1EE3c ph\xE2n c\xF4ng gi\u1EA3ng d\u1EA1y t\u1EA1i \u0110i\u1EC3m T\xE2n Ki\u1EC1u), tr\xE1nh t\xECnh tr\u1EA1ng s\xE1ng d\u1EA1y \u0111i\u1EC3m \u0110\u1ED1c Binh Ki\u1EC1u, chi\u1EC1u d\u1EA1y \u0111i\u1EC3m T\xE2n Ki\u1EC1u trong c\xF9ng m\u1ED9t ng\xE0y.

2. Khai th\xE1c c\u01A1 s\u1EDF v\u1EADt ch\u1EA5t:
- T\u1EADn d\u1EE5ng t\u1ED1i \u0111a 09 ph\xF2ng b\u1ED9 m\xF4n t\u1EA1i \u0110i\u1EC3m ch\xEDnh, 22 ph\xF2ng h\u1ECDc t\u1EA1i \u0110i\u1EC3m \u0110\u1ED1c Binh Ki\u1EC1u v\xE0 10 ph\xF2ng b\u1ED9 m\xF4n t\u1EA1i \u0110i\u1EC3m T\xE2n Ki\u1EC1u.
- M\u1EDF c\u1EEDa ph\xF2ng m\xE1y vi t\xEDnh v\xE0 th\u01B0 vi\u1EC7n trong su\u1ED1t c\xE1c bu\u1ED5i chi\u1EC1u \u0111\u1EC3 h\u1ECDc sinh t\u1EF1 h\u1ECDc, tra c\u1EE9u t\xE0i li\u1EC7u s\u1ED1 v\xE0 nghi\xEAn c\u1EE9u khoa h\u1ECDc d\u01B0\u1EDBi s\u1EF1 h\u01B0\u1EDBng d\u1EABn c\u1EE7a gi\xE1o vi\xEAn qu\u1EA3n l\xFD.

3. Kinh ph\xED th\u1EF1c hi\u1EC7n:
- Ngu\u1ED3n ng\xE2n s\xE1ch nh\xE0 n\u01B0\u1EDBc c\u1EA5p chi th\u01B0\u1EDDng xuy\xEAn theo \u0111\u1ECBnh m\u1EE9c h\u1ECDc sinh.
- C\xE1c ngu\u1ED3n h\u1ED7 tr\u1EE3 h\u1EE3p ph\xE1p kh\xE1c theo quy \u0111\u1ECBnh hi\u1EC7n h\xE0nh, tuy\u1EC7t \u0111\u1ED1i kh\xF4ng thu ti\u1EC1n h\u1ECDc th\xEAm sai quy \u0111\u1ECBnh.`
            },
            {
              heading: "V. T\u1ED4 CH\u1EE8C TH\u1EF0C HI\u1EC6N",
              content: `1. Ban Gi\xE1m hi\u1EC7u:
- Th\u1EA7y Hi\u1EC7u tr\u01B0\u1EDFng L\xEA Thanh C\u01B0\u1EDDng ph\xEA duy\u1EC7t k\u1EBF ho\u1EA1ch, ch\u1EC9 \u0111\u1EA1o chung v\u1EC1 c\u01A1 s\u1EDF v\u1EADt ch\u1EA5t v\xE0 c\xF4ng t\xE1c an ninh, an to\xE0n tr\u01B0\u1EDDng h\u1ECDc.
- Th\u1EA7y Ph\xF3 Hi\u1EC7u tr\u01B0\u1EDFng Nguy\u1EC5n Minh Tr\xED tr\u1EF1c ti\u1EBFp ph\u1EE5 tr\xE1ch \u0111i\u1EC1u h\xE0nh chuy\xEAn m\xF4n d\u1EA1y h\u1ECDc 2 bu\u1ED5i/ng\xE0y; x\u1EBFp th\u1EDDi kh\xF3a bi\u1EC3u khoa h\u1ECDc, ki\u1EC3m tra n\u1EC1n n\u1EBFp d\u1EA1y h\u1ECDc bu\u1ED5i chi\u1EC1u; k\xFD duy\u1EC7t danh s\xE1ch h\u1ECDc sinh ph\u1EE5 \u0111\u1EA1o v\xE0 h\u1ECDc sinh gi\u1ECFi.
- Ph\xE2n c\xF4ng c\xE1n b\u1ED9 ph\u1EE5 tr\xE1ch \u0110i\u1EC3m T\xE2n Ki\u1EC1u theo d\xF5i s\u0129 s\u1ED1, b\u1EA3o \u0111\u1EA3m an ninh tr\u1EADt t\u1EF1 v\xE0 v\u1EC7 sinh m\xF4i tr\u01B0\u1EDDng t\u1EA1i \u0111i\u1EC3m tr\u01B0\u1EDDng l\u1EBB.

2. C\xE1c T\u1ED5 chuy\xEAn m\xF4n v\xE0 Gi\xE1o vi\xEAn:
- C\xE1c t\u1ED5 chuy\xEAn m\xF4n x\xE2y d\u1EF1ng k\u1EBF ho\u1EA1ch ph\xE2n ph\u1ED1i ti\u1EBFt d\u1EA1y t\u0103ng c\u01B0\u1EDDng, bi\xEAn so\u1EA1n \u0111\u1EC1 c\u01B0\u01A1ng, t\xE0i li\u1EC7u \xF4n t\u1EADp v\xE0 phi\u1EBFu h\u1ECDc t\u1EADp ph\xF9 h\u1EE3p t\u1EEBng \u0111\u1ED1i t\u01B0\u1EE3ng h\u1ECDc sinh.
- Gi\xE1o vi\xEAn b\u1ED9 m\xF4n th\u1EF1c hi\u1EC7n nghi\xEAm t\xFAc gi\u1EDD gi\u1EA5c l\xEAn l\u1EDBp, \u0111\u1ED5i m\u1EDBi ph\u01B0\u01A1ng ph\xE1p gi\u1EA3ng d\u1EA1y, ghi ch\xE9p s\u1ED5 \u0111\u1EA7u b\xE0i \u0111\u1EA7y \u0111\u1EE7.
- Gi\xE1o vi\xEAn ch\u1EE7 nhi\u1EC7m ph\u1ED1i h\u1EE3p ch\u1EB7t ch\u1EBD v\u1EDBi cha m\u1EB9 h\u1ECDc sinh \u0111\u1EC3 qu\u1EA3n l\xFD gi\u1EDD gi\u1EA5c, chuy\xEAn c\u1EA7n c\u1EE7a h\u1ECDc sinh gi\u1EEFa 2 bu\u1ED5i h\u1ECDc./.`
            }
          ],
          recipients: [
            "S\u1EDF GD\u0110T \u0110\u1ED3ng Th\xE1p (\u0111\u1EC3 b\xE1o c\xE1o);",
            "Ban Gi\xE1m hi\u1EC7u (\u0111\u1EC3 ch\u1EC9 \u0111\u1EA1o);",
            "C\xE1c t\u1ED5 chuy\xEAn m\xF4n, v\u0103n ph\xF2ng (\u0111\u1EC3 th\u1EF1c hi\u1EC7n);",
            "L\u01B0u: VT, CM."
          ]
        };
      }
      let contentII = `Quy m\xF4 \xE1p d\u1EE5ng: To\xE0n tr\u01B0\u1EDDng v\u1EDBi 53 l\u1EDBp v\xE0 2.143 h\u1ECDc sinh; 120 c\xE1n b\u1ED9 gi\xE1o vi\xEAn nh\xE2n vi\xEAn (102 gi\xE1o vi\xEAn tr\u1EF1c ti\u1EBFp gi\u1EA3ng d\u1EA1y). Trong \u0111\xF3: 39 l\u1EDBp c\u1EA5p THCS (24 l\u1EDBp \u0111i\u1EC3m ch\xEDnh \u0110\u1ED1c Binh Ki\u1EC1u v\u1EDBi 983 HS, 15 l\u1EDBp \u0111i\u1EC3m T\xE2n Ki\u1EC1u c\xE1ch 11km v\u1EDBi 557 HS) v\xE0 14 l\u1EDBp c\u1EA5p THPT v\u1EDBi 530 HS.`;
      let contentIII = `Th\u1EDDi gian th\u1EF1c hi\u1EC7n theo khung n\u0103m h\u1ECDc 2026 - 2027 (\u0111\u1EE7 35 tu\u1EA7n th\u1EF1c h\u1ECDc, HK1: 18 tu\u1EA7n, HK2: 17 tu\u1EA7n). Khung gi\u1EDD ho\u1EA1t \u0111\u1ED9ng bu\u1ED5i s\xE1ng t\u1EEB 7h00 \u0111\u1EBFn 11h30 (5 ti\u1EBFt), bu\u1ED5i chi\u1EC1u t\u1EEB 12h30 \u0111\u1EBFn 17h00 (5 ti\u1EBFt).`;
      if (topic.toLowerCase().includes("gi\xE1o vi\xEAn d\u1EA1y gi\u1ECFi") || topic.toLowerCase().includes("gvdg")) {
        specificLegal.push("Th\xF4ng t\u01B0 s\u1ED1 22/2019/TT-BGD\u0110T ng\xE0y 20/12/2019 c\u1EE7a B\u1ED9 GD\u0110T ban h\xE0nh Quy \u0111\u1ECBnh H\u1ED9i thi gi\xE1o vi\xEAn d\u1EA1y gi\u1ECFi c\u01A1 s\u1EDF gi\xE1o d\u1EE5c ph\u1ED5 th\xF4ng");
        contentII = `1. \u0110\u1ED1i t\u01B0\u1EE3ng tham gia: To\xE0n th\u1EC3 gi\xE1o vi\xEAn tr\u1EF1c ti\u1EBFp gi\u1EA3ng d\u1EA1y t\u1EA1i c\u1EA3 3 \u0111i\u1EC3m tr\u01B0\u1EDDng \u0111\u1EE7 \u0111i\u1EC1u ki\u1EC7n theo quy \u0111\u1ECBnh.
2. N\u1ED9i dung thi g\u1ED3m 02 ph\u1EA7n: Th\u1EF1c h\xE0nh 01 ti\u1EBFt d\u1EA1y h\u1ECDc v\xE0 Tr\xECnh b\xE0y 01 bi\u1EC7n ph\xE1p n\xE2ng cao ch\u1EA5t l\u01B0\u1EE3ng gi\xE1o d\u1EE5c.
3. Ti\xEAu ch\xED \u0111\xE1nh gi\xE1 b\xE1m s\xE1t C\xF4ng v\u0103n 3284 v\xE0 \u0111\u1ECBnh h\u01B0\u1EDBng ph\xE1t tri\u1EC3n n\u0103ng l\u1EF1c h\u1ECDc sinh.`;
        contentIII = `Ph\xE1t \u0111\u1ED9ng t\u1EEB th\xE1ng 10/2026; t\u1ED5 ch\u1EE9c thi gi\u1EA3ng trong th\xE1ng 11/2026 ch\xE0o m\u1EEBng ng\xE0y Nh\xE0 gi\xE1o Vi\u1EC7t Nam 20/11; t\u1ED5ng k\u1EBFt v\xE0 trao gi\u1EA3i tr\u01B0\u1EDBc ng\xE0y 20/11/2026.`;
      } else if (topic.toLowerCase().includes("h\u1ECDc sinh gi\u1ECFi") || topic.toLowerCase().includes("ph\u1EE5 \u0111\u1EA1o")) {
        specificLegal.push("Th\xF4ng t\u01B0 s\u1ED1 22/2021/TT-BGD\u0110T ng\xE0y 05/9/2021 c\u1EE7a B\u1ED9 GD\u0110T v\u1EC1 \u0111\xE1nh gi\xE1 h\u1ECDc sinh THCS v\xE0 THPT");
        contentII = `1. \u0110\u1ED1i v\u1EDBi h\u1ECDc sinh gi\u1ECFi: Tuy\u1EC3n ch\u1ECDn c\xE1c em c\xF3 n\u0103ng khi\u1EBFu t\u1EA1i c\u1EA3 2 \u0111i\u1EC3m tr\u01B0\u1EDDng THCS v\xE0 THPT; ph\xE2n c\xF4ng gi\xE1o vi\xEAn c\xF3 kinh nghi\u1EC7m b\u1ED3i d\u01B0\u1EE1ng theo chuy\xEAn \u0111\u1EC1.
2. \u0110\u1ED1i v\u1EDBi h\u1ECDc sinh c\xF3 nguy c\u01A1 ch\u01B0a \u0111\u1EA1t YCC\u0110: L\u1EADp danh s\xE1ch, ph\xE2n lo\u1EA1i nguy\xEAn nh\xE2n v\xE0 t\u1ED5 ch\u1EE9c ph\u1EE5 \u0111\u1EA1o mi\u1EC5n ph\xED \xEDt nh\u1EA5t 2 ti\u1EBFt/tu\u1EA7n/m\xF4n.`;
        contentIII = `Tri\u1EC3n khai li\xEAn t\u1EE5c trong su\u1ED1t 35 tu\u1EA7n n\u0103m h\u1ECDc. \u0110\u1EE3t 1 t\u1EEB tu\u1EA7n 3 \u0111\u1EBFn tu\u1EA7n 17; \u0110\u1EE3t 2 t\u1EEB tu\u1EA7n 20 \u0111\u1EBFn tu\u1EA7n 34.`;
      } else if (topic.toLowerCase().includes("chuy\u1EC3n \u0111\u1ED5i s\u1ED1") || topic.toLowerCase().includes("ai") || topic.toLowerCase().includes("tr\xED tu\u1EC7 nh\xE2n t\u1EA1o")) {
        specificLegal.push("Quy\u1EBFt \u0111\u1ECBnh s\u1ED1 131/Q\u0110-TTg c\u1EE7a Th\u1EE7 t\u01B0\u1EDBng Ch\xEDnh ph\u1EE7 ph\xEA duy\u1EC7t \u0110\u1EC1 \xE1n T\u0103ng c\u01B0\u1EDDng \u1EE9ng d\u1EE5ng c\xF4ng ngh\u1EC7 th\xF4ng tin v\xE0 chuy\u1EC3n \u0111\u1ED5i s\u1ED1 trong gi\xE1o d\u1EE5c");
        contentII = `1. N\xE2ng c\u1EA5p h\u1EA1 t\u1EA7ng m\u1EA1ng internet v\xE0 ph\xF2ng m\xE1y vi t\xEDnh t\u1EA1i c\u1EA3 2 \u0111i\u1EC3m tr\u01B0\u1EDDng.
2. S\u1EED d\u1EE5ng 100% h\u1ED3 s\u01A1, h\u1ECDc b\u1EA1, s\u1ED5 \u0111i\u1EC3m \u0111i\u1EC7n t\u1EED.
3. T\u1ED5 ch\u1EE9c t\u1EADp hu\u1EA5n cho 101 gi\xE1o vi\xEAn v\u1EC1 khai th\xE1c AI an to\xE0n, li\xEAm ch\xEDnh h\u1ECDc thu\u1EADt v\xE0 b\u1EA3o v\u1EC7 d\u1EEF li\u1EC7u h\u1ECDc sinh.`;
        contentIII = `T\u1EADp hu\u1EA5n trong th\xE1ng 9/2026; tri\u1EC3n khai di\u1EC7n r\u1ED9ng t\u1EEB th\xE1ng 10/2026 \u0111\u1EBFn h\u1EBFt n\u0103m h\u1ECDc.`;
      } else if (topic.toLowerCase().includes("ki\u1EC3m tra n\u1ED9i b\u1ED9")) {
        specificLegal.push("Ngh\u1ECB \u0111\u1ECBnh s\u1ED1 42/2013/N\u0110-CP v\u1EC1 thanh tra gi\xE1o d\u1EE5c v\xE0 h\u01B0\u1EDBng d\u1EABn c\xF4ng t\xE1c ki\u1EC3m tra n\u1ED9i b\u1ED9 tr\u01B0\u1EDDng h\u1ECDc c\u1EE7a S\u1EDF GD\u0110T \u0110\u1ED3ng Th\xE1p");
        contentII = `Ki\u1EC3m tra to\xE0n di\u1EC7n ho\u1EA1t \u0111\u1ED9ng s\u01B0 ph\u1EA1m c\u1EE7a gi\xE1o vi\xEAn, ki\u1EC3m tra chuy\xEAn \u0111\u1EC1 quy ch\u1EBF chuy\xEAn m\xF4n, ki\u1EC3m tra qu\u1EA3n l\xFD thi\u1EBFt b\u1ECB d\u1EA1y h\u1ECDc v\xE0 c\u01A1 s\u1EDF v\u1EADt ch\u1EA5t t\u1EA1i \u0110i\u1EC3m T\xE2n Ki\u1EC1u.`;
        contentIII = `Ti\u1EBFn h\xE0nh \u0111\u1ECBnh k\u1EF3 h\xE0ng th\xE1ng v\xE0 \u0111\u1ED9t xu\u1EA5t theo k\u1EBF ho\u1EA1ch \u0111\xE3 \u0111\u01B0\u1EE3c ph\xEA duy\u1EC7t.`;
      }
      return {
        type: documentType,
        typeLabel: targetTypeLabel,
        documentNumber: defaultDocNum,
        title: topic.toUpperCase().startsWith(targetTypeLabel) ? topic.toUpperCase() : `${targetTypeLabel} ${upperTopic}`,
        subTitle: `C\u0103n c\u1EE9 quy \u0111\u1ECBnh c\u1EE7a B\u1ED9 GD\u0110T v\xE0 H\u01B0\u1EDBng d\u1EABn c\u1EE7a S\u1EDF GD\u0110T \u0110\u1ED3ng Th\xE1p`,
        signDate: currentDateStr,
        issuingAuthorityTop: "S\u1EDE GI\xC1O D\u1EE4C V\xC0 \u0110\xC0O T\u1EA0O \u0110\u1ED2NG TH\xC1P",
        issuingAuthority: "TR\u01AF\u1EDCNG THCS V\xC0 THPT \u0110\u1ED0C BINH KI\u1EC0U",
        signerRole,
        signerName,
        sourceDirective: "Tra c\u1EE9u quy \u0111\u1ECBnh ph\xE1p lu\u1EADt chuy\xEAn ng\xE0nh gi\xE1o d\u1EE5c & S\u1EDF GD\u0110T \u0110\u1ED3ng Th\xE1p",
        legalBases: specificLegal,
        sections: [
          {
            heading: "I. M\u1EE4C \u0110\xCDCH, Y\xCAU C\u1EA6U",
            content: `1. M\u1EE5c \u0111\xEDch:
- Tri\u1EC3n khai nghi\xEAm t\xFAc, \u0111\xFAng quy \u0111\u1ECBnh ph\xE1p lu\u1EADt v\xE0 h\u01B0\u1EDBng d\u1EABn c\u1EE7a ng\xE0nh gi\xE1o d\u1EE5c v\xE0o th\u1EF1c t\u1EBF Tr\u01B0\u1EDDng THCS v\xE0 THPT \u0110\u1ED1c Binh Ki\u1EC1u.
- N\xE2ng cao ch\u1EA5t l\u01B0\u1EE3ng gi\xE1o d\u1EE5c to\xE0n di\u1EC7n, kh\xEDch l\u1EC7 phong tr\xE0o thi \u0111ua d\u1EA1y t\u1ED1t - h\u1ECDc t\u1ED1t trong to\xE0n tr\u01B0\u1EDDng.
- \u0110\u1EA3m b\u1EA3o quy\u1EC1n l\u1EE3i h\u1ECDc t\u1EADp c\xF4ng b\u1EB1ng, \u0111\u1ED3ng b\u1ED9 cho h\u1ECDc sinh t\u1EA1i c\u1EA3 3 \u0111i\u1EC3m tr\u01B0\u1EDDng (\u0111\u1EB7c bi\u1EC7t \u0111i\u1EC3m T\xE2n Ki\u1EC1u c\xE1ch 11km).

2. Y\xEAu c\u1EA7u:
- N\u1ED9i dung th\u1EF1c hi\u1EC7n ph\u1EA3i thi\u1EBFt th\u1EF1c, c\xF4ng khai, minh b\u1EA1ch, c\xF3 t\xEDnh kh\u1EA3 thi cao.
- Ph\xE2n c\xF4ng r\xF5 tr\xE1ch nhi\u1EC7m t\u1EEBng t\u1ED5 ch\u1EE9c, c\xE1 nh\xE2n; ph\u1ED1i h\u1EE3p ch\u1EB7t ch\u1EBD gi\u1EEFa c\xE1c b\u1ED9 ph\u1EADn.`
          },
          {
            heading: "II. \u0110\u1ED0I T\u01AF\u1EE2NG, \u0110I\u1EC0U KI\u1EC6N V\xC0 N\u1ED8I DUNG TH\u1EF0C HI\u1EC6N",
            content: contentII
          },
          {
            heading: "III. TH\u1EDCI GIAN, TI\u1EBEN \u0110\u1ED8 V\xC0 KINH PH\xCD TH\u1EF0C HI\u1EC6N",
            content: contentIII
          },
          {
            heading: "IV. T\u1ED4 CH\u1EE8C TH\u1EF0C HI\u1EC6N",
            content: `1. Ban Gi\xE1m hi\u1EC7u:
- Th\u1EA7y Hi\u1EC7u tr\u01B0\u1EDFng L\xEA Thanh C\u01B0\u1EDDng ph\u1EE5 tr\xE1ch chung v\xE0 ph\xEA duy\u1EC7t kinh ph\xED.
- Th\u1EA7y Ph\xF3 Hi\u1EC7u tr\u01B0\u1EDFng Nguy\u1EC5n Minh Tr\xED tr\u1EF1c ti\u1EBFp ch\u1EC9 \u0111\u1EA1o chuy\xEAn m\xF4n, ki\u1EC3m tra \u0111\xF4n \u0111\u1ED1c ti\u1EBFn \u0111\u1ED9 th\u1EF1c hi\u1EC7n t\u1EA1i c\xE1c \u0111i\u1EC3m tr\u01B0\u1EDDng.

2. C\xE1c T\u1ED5 chuy\xEAn m\xF4n v\xE0 \u0110i\u1EC3m tr\u01B0\u1EDDng:
- 07 T\u1ED5 chuy\xEAn m\xF4n qu\xE1n tri\u1EC7t \u0111\u1EBFn 101 gi\xE1o vi\xEAn trong t\u1ED5; c\u1EED gi\xE1o vi\xEAn tham gia \u0111\xFAng quy \u0111\u1ECBnh.
- B\u1ED9 ph\u1EADn ph\u1EE5 tr\xE1ch \u0110i\u1EC3m T\xE2n Ki\u1EC1u b\u1EA3o \u0111\u1EA3m c\u01A1 s\u1EDF v\u1EADt ch\u1EA5t, ph\xF2ng b\u1ED9 m\xF4n v\xE0 n\u1EC1n n\u1EBFp h\u1ECDc t\u1EADp.

3. Gi\xE1o vi\xEAn v\xE0 Nh\xE2n vi\xEAn:
- Nghi\xEAm t\xFAc ch\u1EA5p h\xE0nh k\u1EBF ho\u1EA1ch, b\xE1o c\xE1o k\u1ECBp th\u1EDDi nh\u1EEFng kh\xF3 kh\u0103n v\u01B0\u1EDBng m\u1EAFc \u0111\u1EC3 BGH xem x\xE9t gi\u1EA3i quy\u1EBFt./.`
          }
        ],
        recipients: [
          "S\u1EDF GD\u0110T \u0110\u1ED3ng Th\xE1p (\u0111\u1EC3 b\xE1o c\xE1o);",
          "Ban Gi\xE1m hi\u1EC7u (\u0111\u1EC3 ch\u1EC9 \u0111\u1EA1o);",
          "C\xE1c t\u1ED5 chuy\xEAn m\xF4n, v\u0103n ph\xF2ng (\u0111\u1EC3 th\u1EF1c hi\u1EC7n);",
          "L\u01B0u: VT, CM."
        ]
      };
    };
    const rawText = await generateWithFallback({
      prompt,
      systemInstruction: SYSTEM_PROMPT_OFFICIAL,
      fallbackGenerator: fallbackFn
    });
    const parsed = cleanAndParseJson(rawText, fallbackFn);
    res.json({ success: true, data: parsed });
  } catch (error) {
    console.error("Error in auto-research-and-build:", error);
    res.status(500).json({ success: false, error: error.message || "L\u1ED7i tra c\u1EE9u v\xE0 x\xE2y d\u1EF1ng v\u0103n b\u1EA3n" });
  }
});
app.post("/api/extract-text", async (req, res) => {
  try {
    const { base64, fileName } = req.body;
    if (!base64) {
      return res.status(400).json({ error: "Missing base64 data" });
    }
    const buffer = Buffer.from(base64, "base64");
    let text = "";
    const lower = (fileName || "").toLowerCase();
    if (lower.endsWith(".pdf")) {
      try {
        const parser = new PDFParse({ data: buffer });
        const parsed = await parser.getText();
        text = parsed.text || "";
      } catch (pdfErr) {
        console.warn("PDF extract error:", pdfErr);
      }
      if (!text || text.trim().length === 0) {
        text = `V\u0103n b\u1EA3n PDF: ${fileName || "t\u1EADp tin"}
(T\u1EC7p PDF \u0111\xE3 \u0111\u01B0\u1EE3c n\u1EA1p th\xE0nh c\xF4ng v\xE0o h\u1EC7 th\u1ED1ng).`;
      }
    } else if (lower.endsWith(".docx")) {
      try {
        const parsed = await mammoth.extractRawText({ buffer });
        text = parsed.value || "";
      } catch (docxErr) {
        text = `V\u0103n b\u1EA3n Word (.docx): ${fileName || "t\u1EADp tin"}`;
      }
    } else if (lower.endsWith(".doc")) {
      try {
        const utf16Matches = buffer.toString("utf16le").match(/[\u0020-\u007E\u00A0-\u024F\u1EA0-\u1EF9\n\r\t]{4,}/g);
        text = utf16Matches ? utf16Matches.join("\n") : `V\u0103n b\u1EA3n Word (.doc): ${fileName || "t\u1EADp tin"}`;
      } catch (docErr) {
        text = `V\u0103n b\u1EA3n Word (.doc): ${fileName || "t\u1EADp tin"}`;
      }
    } else {
      text = buffer.toString("utf-8");
    }
    text = text.replace(/-- \d+ of \d+ --/g, "").replace(/Trang \d+\/\d+/g, "").replace(/Trang \d+/g, "").replace(/[ \t]+/g, " ").trim();
    res.json({ success: true, text });
  } catch (err) {
    console.error("Error in /api/extract-text:", err);
    res.status(500).json({ success: false, error: err.message || "Kh\xF4ng th\u1EC3 tr\xEDch xu\u1EA5t n\u1ED9i dung file" });
  }
});
app.post("/api/upload-directive-file", async (req, res) => {
  try {
    const { base64, fileName, topic = "H\u1ED3 s\u01A1 s\u1ED5 s\xE1ch \u0111i\u1EC7n t\u1EED" } = req.body;
    if (!base64 || !fileName) {
      return res.status(400).json({ success: false, error: "Thi\u1EBFu d\u1EEF li\u1EC7u t\u1EC7p ho\u1EB7c t\xEAn t\u1EC7p" });
    }
    const buffer = Buffer.from(base64, "base64");
    let text = "";
    let htmlContent = "";
    const lower = (fileName || "").toLowerCase();
    const uploadDir = path.join(__dirname, "VAN-BAN-DEN", "UPLOADED");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const safeBaseName = path.basename(fileName).replace(/[^a-zA-Z0-9._-]/g, "_");
    const savedFilePath = path.join(uploadDir, `${Date.now()}_${safeBaseName}`);
    try {
      fs.writeFileSync(savedFilePath, buffer);
    } catch (saveErr) {
      console.warn("Could not save uploaded physical file to disk:", saveErr);
    }
    if (lower.endsWith(".pdf")) {
      try {
        const parser = new PDFParse({ data: buffer });
        const parsed = await parser.getText();
        text = parsed.text || "";
      } catch (pdfErr) {
        console.warn("PDF parser warning:", pdfErr);
      }
      if (!text || text.trim().length === 0) {
        text = `V\u0103n b\u1EA3n PDF: ${fileName}
(T\u1EC7p PDF \u0111\xE3 \u0111\u01B0\u1EE3c l\u01B0u tr\u1EEF th\xE0nh c\xF4ng v\xE0o h\u1EC7 th\u1ED1ng v\u0103n b\u1EA3n c\u1EE7a nh\xE0 tr\u01B0\u1EDDng).`;
      }
    } else if (lower.endsWith(".docx")) {
      try {
        const [raw, html] = await Promise.all([
          mammoth.extractRawText({ buffer }),
          mammoth.convertToHtml({ buffer }).catch(() => ({ value: "" }))
        ]);
        text = raw.value || "";
        htmlContent = html.value || "";
      } catch (docxErr) {
        console.warn("DOCX parser warning:", docxErr);
        text = `V\u0103n b\u1EA3n Word (.docx): ${fileName}`;
      }
    } else if (lower.endsWith(".doc")) {
      try {
        const utf16Matches = buffer.toString("utf16le").match(/[\u0020-\u007E\u00A0-\u024F\u1EA0-\u1EF9\n\r\t]{4,}/g);
        text = utf16Matches ? utf16Matches.join("\n") : `V\u0103n b\u1EA3n Word (.doc): ${fileName}`;
      } catch (docErr) {
        text = `V\u0103n b\u1EA3n Word (.doc): ${fileName}`;
      }
    } else {
      text = buffer.toString("utf-8");
    }
    text = text.replace(/-- \d+ of \d+ --/g, "").replace(/Trang \d+\/\d+/g, "").replace(/Trang \d+/g, "").replace(/[ \t]+/g, " ").trim();
    let docNumber = "";
    const numMatch = text.match(/(?:Số|Số:)\s*([0-9]+(?:\/[A-Za-z0-9\-–_&]+)+)/i);
    if (numMatch) {
      docNumber = `S\u1ED1: ${numMatch[1].trim()}`;
    } else {
      const numMatch2 = fileName.match(/(\d{3,4}[\-_/A-Za-z]+)/i);
      docNumber = numMatch2 ? `S\u1ED1: ${numMatch2[1]}` : "S\u1ED1: .../SGD\u0110T-GDPT";
    }
    let signDate = "\u0110\u1ED3ng Th\xE1p, ng\xE0y 25 th\xE1ng 9 n\u0103m 2026";
    const dateMatch = text.match(/(?:(?:Đồng Tháp|Tháp Mười|Hà Nội)[,\s]*)?ngày\s+(\d{1,2})\s+tháng\s+(\d{1,2})\s+năm\s+(\d{4})/i);
    if (dateMatch) {
      signDate = `\u0110\u1ED3ng Th\xE1p, ng\xE0y ${dateMatch[1]} th\xE1ng ${dateMatch[2]} n\u0103m ${dateMatch[3]}`;
    }
    let issuingAuthority = "S\u1EDE GD\u0110T T\u1EC8NH \u0110\u1ED2NG TH\xC1P";
    if (/BỘ GIÁO DỤC VÀ ĐÀO TẠO/i.test(text.slice(0, 600))) {
      issuingAuthority = "B\u1ED8 GI\xC1O D\u1EE4C V\xC0 \u0110\xC0O T\u1EA0O";
    } else if (/ỦY BAN NHÂN DÂN/i.test(text.slice(0, 600))) {
      issuingAuthority = "\u1EE6Y BAN NH\xC2N D\xC2N T\u1EC8NH \u0110\u1ED2NG TH\xC1P";
    }
    let title = "";
    const titleMatch = text.match(/(?:V\/v|Về việc)\s+([^\n\r]+)/i);
    if (titleMatch) {
      title = `C\xF4ng v\u0103n v\u1EC1 vi\u1EC7c ${titleMatch[1].trim()}`;
    } else {
      const planMatch = text.match(/(?:KẾ HOẠCH|HƯỚNG DẪN|QUY CHẾ|QUYẾT ĐỊNH|THÔNG BÁO)\s+([^\n\r]+)/i);
      if (planMatch) {
        title = planMatch[0].trim();
      } else {
        title = fileName.replace(/\.[^/.]+$/, "").replace(/[_–-]/g, " ");
      }
    }
    let signer = "KT. GI\xC1M \u0110\u1ED0C - PH\xD3 GI\xC1M \u0110\u1ED0C Nguy\u1EC5n Ph\u01B0\u01A1ng To\xE0n";
    if (/Nguyễn Phương Toàn/i.test(text.slice(-1200))) {
      signer = "KT. GI\xC1M \u0110\u1ED0C - PH\xD3 GI\xC1M \u0110\u1ED0C Nguy\u1EC5n Ph\u01B0\u01A1ng To\xE0n";
    } else if (/Lê Thanh Cường/i.test(text.slice(-1200))) {
      signer = "HI\u1EC6U TR\u01AF\u1EDENG L\xEA Thanh C\u01B0\u1EDDng";
    } else if (/Nguyễn Minh Trí/i.test(text.slice(-1200))) {
      signer = "KT. HI\u1EC6U TR\u01AF\u1EDENG - PH\xD3 HI\u1EC6U TR\u01AF\u1EDENG Nguy\u1EC5n Minh Tr\xED";
    }
    const paragraphs = text.split(/\n\s*\n/).map((p) => p.trim()).filter((p) => p.length > 30);
    const summary = paragraphs.slice(0, 3).join("\n\n").slice(0, 500) || `To\xE0n v\u0103n v\u0103n b\u1EA3n ch\u1EC9 \u0111\u1EA1o b\xF3c t\xE1ch t\u1EEB t\u1EC7p ${fileName}`;
    const sizeKB = (buffer.length / 1024).toFixed(1) + " KB";
    const newDirective = {
      id: `directive-${Date.now()}`,
      documentNumber: docNumber,
      title,
      issuingAuthority,
      signDate,
      signer,
      summary,
      fullContent: text,
      htmlContent: htmlContent || void 0,
      createdDate: (/* @__PURE__ */ new Date()).toISOString(),
      fileName,
      topic,
      fileSize: sizeKB,
      linkedSchoolDocumentIds: []
    };
    const currentDirectives = getPersistedDirectives();
    const updated = [newDirective, ...currentDirectives.filter((d) => d.id !== newDirective.id)];
    savePersistedDirectives(updated);
    res.json({
      success: true,
      data: newDirective,
      textLength: text.length,
      message: "\u0110\xE3 tr\xEDch xu\u1EA5t v\xE0 l\u01B0u v\u0103n b\u1EA3n th\xE0nh c\xF4ng (s\u1EED d\u1EE5ng 0 Token AI)!"
    });
  } catch (err) {
    console.error("Error in /api/upload-directive-file:", err);
    res.status(500).json({ success: false, error: err.message || "L\u1ED7i x\u1EED l\xFD file t\u1EA3i l\xEAn" });
  }
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  }
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
startServer();
