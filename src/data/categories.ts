export interface DirectiveCategory {
  id: string;
  name: string;
  label: string;
  description?: string;
  isCustom?: boolean;
}

export const DEFAULT_DIRECTIVE_CATEGORIES: DirectiveCategory[] = [
  { id: 'all', name: 'Tất cả chuyên đề', label: 'Tất cả chuyên đề' },
  { id: 'Hồ sơ sổ sách điện tử', name: 'Hồ sơ sổ sách điện tử', label: 'Hồ sơ sổ sách điện tử' },
  { id: '2 buổi / ngày', name: '2 buổi / ngày', label: '2 buổi / ngày' },
  { id: 'Khung năng lực số & AI', name: 'Khung năng lực số & AI', label: 'Khung năng lực số & AI' },
  { id: 'Kiểm tra đánh giá', name: 'Kiểm tra đánh giá', label: 'Kiểm tra đánh giá' },
  { id: 'Hướng nghiệp & Phân luồng', name: 'Hướng nghiệp & Phân luồng', label: 'Hướng nghiệp & Phân luồng' },
  { id: 'Dạy thêm học thêm', name: 'Dạy thêm học thêm', label: 'Dạy thêm học thêm' },
  { id: 'Nhiệm vụ chung năm học', name: 'Nhiệm vụ chung năm học', label: 'Nhiệm vụ năm học' },
];
