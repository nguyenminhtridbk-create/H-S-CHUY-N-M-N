import React, { useState } from 'react';
import { 
  Award, 
  Search, 
  Filter, 
  Trash2, 
  Eye, 
  Printer, 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  Building2, 
  Calendar, 
  Download,
  BookOpen
} from 'lucide-react';
import { formatVietnameseDate } from '../utils/fileReader';

interface ArchiveItem {
  id: string;
  type: 'department-plan' | 'syllabus' | 'lesson-plan';
  title: string;
  date: string;
  department?: string;
  campus?: string;
  score?: number;
  status: string;
  details: any;
}

interface ArchiveManagementTabProps {
  items: ArchiveItem[];
  onDeleteItem: (id: string) => void;
  onUpdateStatus: (id: string, newStatus: string) => void;
}

export const ArchiveManagementTab: React.FC<ArchiveManagementTabProps> = ({
  items,
  onDeleteItem,
  onUpdateStatus,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [campusFilter, setCampusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [selectedItem, setSelectedItem] = useState<ArchiveItem | null>(null);

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.department && item.department.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCampus =
      campusFilter === 'ALL' ||
      (item.campus && item.campus.toLowerCase().includes(campusFilter.toLowerCase()));

    const matchesType = typeFilter === 'ALL' || item.type === typeFilter;

    return matchesSearch && matchesCampus && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-cyan-100 text-cyan-800 text-xs font-bold rounded">
              Lưu Trữ Chuyên Môn
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              Sổ Tay Quản Lý Hồ Sơ Chuyên Môn 3 Điểm Trường
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Tổng hợp hồ sơ kế hoạch tổ, phân phối chương trình và giáo án đã thẩm định phục vụ công tác thanh tra, kiểm tra chuyên môn và điều hành của Phó Hiệu Trưởng.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-3.5 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow transition"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>In Sổ Theo Dõi Chuyên Môn</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm theo tên bài, giáo viên, tổ..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Campus Filter */}
          <div>
            <select
              value={campusFilter}
              onChange={(e) => setCampusFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">Tất cả điểm trường (53 lớp)</option>
              <option value="Đốc Binh Kiều">Điểm Đốc Binh Kiều (24 lớp)</option>
              <option value="Tân Kiều">Điểm Tân Kiều (15 lớp - cách 11km)</option>
              <option value="THPT">Khối THPT (14 lớp)</option>
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">Tất cả loại hồ sơ</option>
              <option value="department-plan">Kế hoạch Tổ Chuyên môn (Phụ lục I)</option>
              <option value="syllabus">Phân phối chương trình (35 tuần)</option>
              <option value="lesson-plan">Kế hoạch bài dạy (Giáo án - Phụ lục II)</option>
            </select>
          </div>
        </div>
      </div>

      {/* List Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">Loại Hồ Sơ</th>
                <th className="p-3">Tiêu Đề / Hồ Sơ Thẩm Định</th>
                <th className="p-3">Điểm Trường / Đơn Vị</th>
                <th className="p-3">Ngày Thẩm Định</th>
                <th className="p-3 text-center">Điểm / Đánh Giá</th>
                <th className="p-3 text-center">Trạng Thái</th>
                <th className="p-3 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    Chưa có hồ sơ nào được lưu trong sổ tay. Hãy thực hiện thẩm định ở các tab phía trên và bấm "Lưu vào Hồ sơ".
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition">
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.type === 'department-plan'
                          ? 'bg-blue-100 text-blue-800'
                          : item.type === 'syllabus'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-pink-100 text-pink-800'
                      }`}>
                        {item.type === 'department-plan' ? 'Kế hoạch Tổ' : item.type === 'syllabus' ? 'PPCT 35 Tuần' : 'Giáo án (KHBD)'}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-slate-800 max-w-xs truncate">
                      {item.title}
                    </td>
                    <td className="p-3 text-slate-600">
                      {item.campus || 'Cả 3 điểm trường'}
                    </td>
                    <td className="p-3 text-slate-500">
                      {formatVietnameseDate(item.date)}
                    </td>
                    <td className="p-3 text-center font-bold">
                      {item.score ? (
                        <span className="text-blue-700 font-black">{item.score}/100</span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status.includes('Duyệt') || item.status.includes('Đạt') || item.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedItem(item)}
                          className="p-1.5 rounded hover:bg-blue-100 text-blue-700 transition"
                          title="Xem chi tiết biên bản"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteItem(item.id)}
                          className="p-1.5 rounded hover:bg-red-100 text-red-600 transition"
                          title="Xóa hồ sơ"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 bg-slate-900 text-white rounded-t-2xl flex items-center justify-between">
              <div>
                <span className="text-xs text-blue-300 font-semibold">CHI TIẾT HỒ SƠ LƯU TRỮ CHUYÊN MÔN</span>
                <h3 className="text-sm font-bold text-white mt-0.5">{selectedItem.title}</h3>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-slate-400 hover:text-white p-1 rounded"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-500">Ngày ghi nhận:</span>
                  <p className="font-semibold">{formatVietnameseDate(selectedItem.date)}</p>
                </div>
                <div>
                  <span className="text-slate-500">Trạng thái phê duyệt:</span>
                  <p className="font-semibold text-emerald-700">{selectedItem.status}</p>
                </div>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-slate-900 block">Nội dung chi tiết kết quả thẩm định:</span>
                <pre className="p-4 bg-slate-100 rounded-xl font-mono text-[11px] text-slate-800 whitespace-pre-wrap max-h-96 overflow-y-auto">
                  {JSON.stringify(selectedItem.details, null, 2)}
                </pre>
              </div>
            </div>

            <div className="px-6 py-3 bg-slate-50 rounded-b-2xl border-t border-slate-200 flex justify-between items-center">
              <button
                onClick={() => window.print()}
                className="px-3.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-medium flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>In bản lưu</span>
              </button>
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-1.5 bg-blue-700 text-white rounded-lg text-xs font-semibold hover:bg-blue-800 transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
