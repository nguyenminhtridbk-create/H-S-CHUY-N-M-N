// @ts-ignore
import mammoth from 'mammoth';

export async function extractTextFromFile(file: File): Promise<string> {
  const fileName = file.name.toLowerCase();

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

  // Handle plain text files (.txt, .md, .csv, .json, etc.)
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve((e.target?.result as string) || '');
    };
    reader.onerror = (e) => {
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
