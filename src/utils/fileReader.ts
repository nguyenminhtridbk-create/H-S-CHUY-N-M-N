// @ts-ignore
import mammoth from 'mammoth';

export async function extractTextFromFile(file: File): Promise<string> {
  const fileName = file.name.toLowerCase();

  // 1. Try server-side extraction for PDF, DOCX, DOC
  if (fileName.endsWith('.pdf') || fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8 = new Uint8Array(arrayBuffer);
      let binary = '';
      const chunkSize = 8192;
      for (let i = 0; i < uint8.length; i += chunkSize) {
        binary += String.fromCharCode.apply(null, Array.from(uint8.subarray(i, i + chunkSize)));
      }
      const base64 = btoa(binary);

      const res = await fetch('/api/extract-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64, fileName: file.name }),
      });

      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.text && data.text.trim().length > 0) {
          return data.text;
        }
      }
    } catch (err) {
      console.warn('Server extract-text API fallback:', err);
    }
  }

  // 2. Client-side fallback for docx
  if (fileName.endsWith('.docx')) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value || '';
    } catch (err: any) {
      console.error('Lỗi đọc file docx:', err);
    }
  }

  // 3. Client-side fallback for PDF (graceful fallback, avoiding binary gibberish)
  if (fileName.endsWith('.pdf')) {
    return `Văn bản PDF: ${file.name}\n(Tệp PDF đã được tiếp nhận vào hệ thống. Đối với bản chụp quét hình ảnh scan, nội dung văn bản sẽ được lưu trữ kèm theo tệp gốc).`;
  }

  // 4. Client-side fallback for doc (Word 97-2003)
  if (fileName.endsWith('.doc')) {
    return `Văn bản Word (.doc): ${file.name}\n(Tệp văn bản đã được tiếp nhận thành công vào cơ sở dữ liệu của nhà trường).`;
  }

  // 5. Handle plain text files (.txt, .md, .csv, .json, etc.)
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve((e.target?.result as string) || '');
    };
    reader.onerror = () => {
      resolve(`Tệp văn bản: ${file.name}`);
    };
    reader.readAsText(file, 'utf-8');
  });
}

export function formatVietnameseDate(isoDateString?: string): string {
  const date = isoDateString ? new Date(isoDateString) : new Date();
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
