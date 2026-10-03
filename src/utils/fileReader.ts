// @ts-ignore
import mammoth from 'mammoth';

export async function extractTextFromFile(file: File): Promise<string> {
  const fileName = file.name.toLowerCase();

  // 1. Try server-side extraction for PDF & DOCX using full PDF parser
  if (fileName.endsWith('.pdf') || fileName.endsWith('.docx')) {
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

      if (res.ok) {
        const data = await res.json();
        if (data.text) {
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
      throw new Error(`Không thể đọc nội dung file docx: ${err.message || 'Lỗi không xác định'}`);
    }
  }

  // 3. Handle plain text files (.txt, .md, .csv, .json, etc.)
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve((e.target?.result as string) || '');
    };
    reader.onerror = () => {
      reject(new Error('Lỗi khi đọc file văn bản.'));
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
