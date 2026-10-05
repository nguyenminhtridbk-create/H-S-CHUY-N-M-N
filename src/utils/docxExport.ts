import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  UnderlineType,
} from 'docx';
import { SchoolDocument } from '../types/document';

export async function exportDocumentToDocx(doc: SchoolDocument): Promise<void> {
  const noBorder = {
    top: { style: BorderStyle.NONE, size: 0, color: 'auto' },
    bottom: { style: BorderStyle.NONE, size: 0, color: 'auto' },
    left: { style: BorderStyle.NONE, size: 0, color: 'auto' },
    right: { style: BorderStyle.NONE, size: 0, color: 'auto' },
    insideHorizontal: { style: BorderStyle.NONE, size: 0, color: 'auto' },
    insideVertical: { style: BorderStyle.NONE, size: 0, color: 'auto' },
  };

  const cellNoBorder = {
    top: { style: BorderStyle.NONE, size: 0, color: 'auto' },
    bottom: { style: BorderStyle.NONE, size: 0, color: 'auto' },
    left: { style: BorderStyle.NONE, size: 0, color: 'auto' },
    right: { style: BorderStyle.NONE, size: 0, color: 'auto' },
  };

  // Header 2-column table conforming to Vietnamese State Administration Standards & Decree 30/2020/NĐ-CP
  const headerTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: noBorder,
    rows: [
      // Hàng 1: Cơ quan ban hành (trái) và Quốc hiệu, Tiêu ngữ (phải)
      new TableRow({
        children: [
          // Left: Cơ quan ban hành (Font 12.5-13pt = size 25-26)
          new TableCell({
            width: { size: 38, type: WidthType.PERCENTAGE },
            borders: cellNoBorder,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: doc.issuingAuthorityTop || 'SỞ GIÁO DỤC VÀ ĐÀO TẠO ĐỒNG THÁP',
                    size: 25, // 12.5pt
                    font: 'Times New Roman',
                  }),
                ],
                spacing: { after: 20 },
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: 'TRƯỜNG THCS VÀ THPT',
                    bold: true,
                    size: 25, // 12.5pt
                    font: 'Times New Roman',
                  }),
                ],
                spacing: { after: 10 },
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: 'ĐỐC BINH KIỀU',
                    bold: true,
                    size: 25, // 12.5pt
                    font: 'Times New Roman',
                  }),
                ],
                spacing: { after: 10 },
              }),
              // Đường kẻ ngang dưới tên đơn vị: dài 1/3 - 1/2 độ dài tên, có khoảng cách không đè dấu nặng
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: '────────',
                    size: 14, // 7pt nét thanh mảnh
                    font: 'Times New Roman',
                  }),
                ],
                spacing: { before: 20, after: 40 },
              }),
            ],
          }),
          // Right: Quốc hiệu, Tiêu ngữ (Font 12.5 & 13.5pt rộng 62% để không bao giờ bị nhảy chữ NAM)
          new TableCell({
            width: { size: 62, type: WidthType.PERCENTAGE },
            borders: cellNoBorder,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM',
                    bold: true,
                    size: 25, // 12.5pt chuẩn Nghị định 30 (12-13pt), vừa vặn tuyệt đối 1 hàng
                    font: 'Times New Roman',
                  }),
                ],
                spacing: { after: 20 },
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: 'Độc lập - Tự do - Hạnh phúc',
                    bold: true,
                    size: 27, // 13.5pt
                    font: 'Times New Roman',
                  }),
                ],
                spacing: { after: 10 },
              }),
              // Đường kẻ ngang dưới Tiêu ngữ: dài bằng độ dài dòng chữ, có khoảng cách hở không đè dấu nặng
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: '──────────────────────────',
                    size: 14, // 7pt nét thanh mảnh
                    font: 'Times New Roman',
                  }),
                ],
                spacing: { before: 20, after: 40 },
              }),
            ],
          }),
        ],
      }),
      // Hàng 2: Số ký hiệu văn bản (trái) và Địa danh, Ngày tháng năm (phải) - NGANG BẰNG NHAU TUYỆT ĐỐI
      new TableRow({
        children: [
          new TableCell({
            width: { size: 38, type: WidthType.PERCENTAGE },
            borders: cellNoBorder,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: doc.documentNumber || 'Số:    /KH-THCS&THPTĐBK',
                    size: 25, // 12.5pt
                    font: 'Times New Roman',
                  }),
                ],
                spacing: { before: 20, after: 20 },
              }),
            ],
          }),
          new TableCell({
            width: { size: 62, type: WidthType.PERCENTAGE },
            borders: cellNoBorder,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: doc.signDate || 'Đồng Tháp, ngày 28 tháng 9 năm 2026',
                    italics: true,
                    size: 27, // 13.5pt
                    font: 'Times New Roman',
                  }),
                ],
                spacing: { before: 20, after: 20 },
              }),
            ],
          }),
        ],
      }),
    ],
  });

  const docChildren: (Paragraph | Table)[] = [
    headerTable,
    new Paragraph({ spacing: { before: 180, after: 120 } }),
    // Document Title: KẾ HOẠCH (size 30 = 15pt bold)
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: doc.title.toUpperCase(),
          bold: true,
          size: 30, // 15pt
          font: 'Times New Roman',
        }),
      ],
      spacing: { before: 80, after: 40 },
    }),
  ];

  // Subtitle / Trích yếu: e.g. "Tổ chức dạy học 2 buổi/ngày năm học 2026 - 2027" (size 28 = 14pt bold, có đường kẻ hở không đè dấu nặng)
  if (doc.subTitle) {
    docChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: doc.subTitle,
            bold: true,
            size: 28, // 14pt
            font: 'Times New Roman',
          }),
        ],
        spacing: { after: 10 },
      }),
      // Đường kẻ ngang dưới trích yếu: dài 1/3 - 1/2 độ dài dòng chữ theo NĐ 30, hở ra không đè lên dấu nặng
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: '────────────────',
            size: 14, // 7pt nét thanh mảnh
            font: 'Times New Roman',
          }),
        ],
        spacing: { before: 20, after: 200 },
      })
    );
  } else {
    docChildren.push(new Paragraph({ spacing: { after: 180 } }));
  }

  // Legal bases: Indent 1.27cm (720 twips), font 14pt (size 28), italic, justified
  if (doc.legalBases && doc.legalBases.length > 0) {
    doc.legalBases.forEach((base, idx) => {
      const fullText = base.startsWith('Căn cứ') ? base : `Căn cứ ${base}`;
      const isLast = idx === doc.legalBases.length - 1;
      let formattedText = fullText;
      if (isLast) {
        if (!formattedText.endsWith('.')) formattedText = formattedText.replace(/;$/, '') + '.';
      } else {
        if (!formattedText.endsWith(';')) formattedText = formattedText.replace(/\.$/, '') + ';';
      }

      docChildren.push(
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun({
              text: formattedText,
              size: 28, // 14pt
              font: 'Times New Roman',
            }),
          ],
          indent: { firstLine: 567 }, // 1.0cm indent
          spacing: { line: 280, after: 60 },
        })
      );
    });
  }

  // Transition phrase if plan
  if (doc.type === 'plan') {
    docChildren.push(
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({
            text: `Nay Trường THCS và THPT Đốc Binh Kiều xây dựng ${doc.subTitle ? (doc.subTitle.toLowerCase().startsWith('kế hoạch') ? doc.subTitle : `Kế hoạch ${doc.subTitle.toLowerCase()}`) : (doc.title.toLowerCase().startsWith('kế hoạch') ? doc.title : `Kế hoạch ${doc.title.toLowerCase()}`)} như sau:`,
            size: 28, // 14pt
            font: 'Times New Roman',
          }),
        ],
        indent: { firstLine: 720 },
        spacing: { line: 280, after: 120 },
      })
    );
  }

  // Sections
  doc.sections.forEach((sec) => {
    // Heading: Roman numeral heading bold 14pt (thụt đầu dòng 1.0cm = 567 twips bằng với các mục số; giãn đoạn trên 6pt = 120 twips, dưới 6pt = 120 twips đều nhau)
    docChildren.push(
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({
            text: sec.heading,
            bold: true,
            size: 28, // 14pt
            font: 'Times New Roman',
          }),
        ],
        indent: { firstLine: 567 }, // Thụt đầu dòng 1.0cm bằng với các mục số và đoạn văn
        spacing: { before: 120, after: 120 },
      })
    );

    // Content paragraphs
    const paragraphs = sec.content.split('\n').filter((p) => p.trim().length > 0);
    paragraphs.forEach((pText) => {
      const trimmed = pText.trim();
      const isPlusBullet = trimmed.startsWith('+');
      const isDashBullet = trimmed.startsWith('-');
      const isNumbered = /^\d+(\.\d+)*\./.test(trimmed);
      const isLetterSub = /^[a-zđ]\)/i.test(trimmed);

      let indentConfig;
      if (isPlusBullet) {
        indentConfig = { firstLine: 850 }; // 1.5cm first line indent only, subsequent lines align to normal margin
      } else if (isDashBullet) {
        indentConfig = { firstLine: 567 }; // 1.0cm first line indent only, subsequent lines align to normal margin
      } else {
        indentConfig = { firstLine: 567 }; // 1.0cm indent for paragraphs, numbered items, and letter items
      }

      docChildren.push(
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun({
              text: trimmed,
              size: 28, // 14pt
              font: 'Times New Roman',
              bold: isNumbered ? true : undefined, // Numbered items like 1. Mục đích: are bold; a), b)... are normal
            }),
          ],
          indent: indentConfig,
          spacing: { line: 280, before: isNumbered ? 120 : 40, after: 60 },
        })
      );
    });
  });

  // Footer: Recipients (Left 11-12pt) & Signer (Right 13-14pt bold)
  const signerLines = (doc.signerRole || 'HIỆU TRƯỞNG').split('\n');
  const footerTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: noBorder,
    rows: [
      new TableRow({
        children: [
          // Left: Nơi nhận (Font 12pt bold italic, list items 11pt)
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            borders: cellNoBorder,
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'Nơi nhận:',
                    bold: true,
                    italics: true,
                    size: 24, // 12pt
                    font: 'Times New Roman',
                  }),
                ],
                spacing: { after: 20 },
              }),
              ...(doc.recipients && doc.recipients.length > 0
                ? doc.recipients.map((r) => {
                    const text = r.startsWith('-') ? r : `- ${r}`;
                    if (text.includes('Lưu:')) {
                      return '- Lưu: VT, Tr.';
                    }
                    return text;
                  })
                : [
                    '- Sở GDĐT Đồng Tháp (để báo cáo);',
                    '- Hiệu trưởng (để chỉ đạo);',
                    '- Các Phó Hiệu trưởng (để phối hợp);',
                    '- Các tổ chuyên môn, tổ văn phòng (để thực hiện);',
                    '- Ban ĐD Cha mẹ học sinh (để phối hợp);',
                    '- Đoàn trường, Đội TNTP (để phối hợp);',
                    '- Lưu: VT, Tr.',
                  ]
              ).map(
                (r) =>
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: r,
                        size: 22, // 11pt
                        font: 'Times New Roman',
                      }),
                    ],
                    spacing: { line: 220, after: 20 },
                  })
              ),
            ],
          }),
          // Right: Chức vụ & Họ tên người ký
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            borders: cellNoBorder,
            children: [
              ...signerLines.map(
                (line, idx) =>
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({
                        text: line.toUpperCase(),
                        bold: true,
                        size: idx === 0 && line.includes('KT.') ? 26 : 28, // 13-14pt
                        font: 'Times New Roman',
                      }),
                    ],
                    spacing: { after: 20 },
                  })
              ),
              // Blank spacing for signature & seal: Enter xuống thêm các hàng rộng rãi để Thầy ký và đóng dấu
              new Paragraph({ children: [new TextRun({ text: '' })], spacing: { line: 280 } }),
              new Paragraph({ children: [new TextRun({ text: '' })], spacing: { line: 280 } }),
              new Paragraph({ children: [new TextRun({ text: '' })], spacing: { line: 280 } }),
              new Paragraph({ children: [new TextRun({ text: '' })], spacing: { line: 280 } }),
              new Paragraph({ children: [new TextRun({ text: '' })], spacing: { line: 280 } }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: doc.signerName || 'Nguyễn Minh Trí',
                    bold: true,
                    size: 28, // 14pt
                    font: 'Times New Roman',
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  docChildren.push(
    new Paragraph({ spacing: { before: 200, after: 100 } }),
    footerTable
  );

  // Document setup: Standard A4 margins according to Nghị định 30/2020/NĐ-CP
  // Lề trên: 20mm (1134 twips)
  // Lề dưới: 20mm (1134 twips)
  // Lề trái: 30mm (1701 twips - để đóng tập hồ sơ)
  // Lề phải: 15mm - 20mm (850 twips)
  const docxFile = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1134, // 20mm (2 cm)
              bottom: 1134, // 20mm (2 cm)
              left: 1701, // 30mm (3 cm - lề trái)
              right: 1134, // 20mm (2 cm - lề phải)
            },
          },
        },
        children: docChildren,
      },
    ],
  });

  const blob = await Packer.toBlob(docxFile);
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  const safeFilename = `${doc.type.toUpperCase()}_${(doc.subTitle || doc.title).replace(/[^a-zA-Z0-9\u00C0-\u024F\u1E00-\u1EFF]/g, '_').substring(0, 40)}.docx`;
  anchor.download = safeFilename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
