import React, { useState, useEffect } from 'react';
import adminLotteryResultService from '../services/adminLotteryResultService';
import LotteryResultFormTable from '../../../components/admin/LotteryResultFormTable';

const AdminLotteryResultManagement = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filterRegion, setFilterRegion] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // create, edit, view
  const [selectedResult, setSelectedResult] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    region: 'mienBac',
    province: '',
    drawDate: '',
    results: '',
    status: 'DRAFT'
  });

  useEffect(() => {
    loadResults();
  }, [currentPage, filterRegion]);

  // Auto-load khi vào trang lần đầu
  useEffect(() => {
    const checkAndAutoLoad = async () => {
      try {
        // Check xem có đủ kết quả chưa
        const response = await adminLotteryResultService.getAllLotteryResults(0, 100);
        if (response.success && response.data) {
          const results = response.data.content || [];
          
          // Đếm số lượng kết quả theo region/province
          const mienBacCount = results.filter(r => r.region === 'mienBac').length;
          const provinceCount = results.filter(r => r.region === 'mienTrungNam').length;
          
          // Nếu thiếu kết quả, trigger auto-import
          if (mienBacCount === 0 || provinceCount < 5) {
            console.log('🔄 Thiếu kết quả, đang tự động import...');
            console.log(`Miền Bắc: ${mienBacCount}, Tỉnh: ${provinceCount}/5`);
            
            const importResponse = await adminLotteryResultService.triggerAutoImport();
            if (importResponse.success) {
              console.log('✅ Auto-import thành công:', importResponse.message);
              // Reload danh sách sau khi import
              setTimeout(() => {
                loadResults();
              }, 2000);
            } else {
              console.warn('⚠️ Auto-import thất bại:', importResponse.message);
            }
          } else {
            console.log('✅ Đã có đủ kết quả, không cần import');
          }
        }
      } catch (error) {
        console.error('❌ Lỗi khi check auto-load:', error);
      }
    };

    // Chỉ chạy khi vào trang lần đầu (không có filter)
    if (!filterRegion) {
      checkAndAutoLoad();
    }
  }, []); // Chỉ chạy 1 lần khi component mount

  const loadResults = async () => {
    setLoading(true);
    try {
      let response;
      if (filterRegion) {
        if (filterRegion === 'mienBac') {
          response = await adminLotteryResultService.getLotteryResultsByRegion(
            'mienBac', 
            currentPage, 
            20
          );
        } else {
          // Các tỉnh Miền Trung Nam - sử dụng API mới
          response = await adminLotteryResultService.getLotteryResultsByProvince(
            filterRegion, 
            currentPage, 
            20
          );
        }
      } else {
        response = await adminLotteryResultService.getAllLotteryResults(currentPage, 20);
      }

      if (response.success && response.data) {
        setResults(response.data.content || []);
        setTotalPages(response.data.totalPages || 0);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    // Set default region based on current filter
    const defaultRegion = filterRegion === 'mienBac' ? 'mienBac' : 'mienTrungNam';
    const defaultProvince = filterRegion === 'mienBac' ? '' : filterRegion;
    
    const template = defaultRegion === 'mienBac' 
      ? adminLotteryResultService.getMienBacTemplate()
      : adminLotteryResultService.getMienTrungNamTemplate();
    
    setFormData({
      region: defaultRegion,
      province: defaultProvince,
      drawDate: new Date().toISOString().split('T')[0],
      results: JSON.stringify(template, null, 2),
      status: 'DRAFT'
    });
    setModalMode('create');
    setSelectedResult(null);
    setShowModal(true);
  };

  const handleEdit = (result) => {
    setFormData({
      region: result.region,
      province: result.province || '',
      drawDate: result.drawDate,
      results: result.results,
      status: result.status
    });
    setModalMode('edit');
    setSelectedResult(result);
    setShowModal(true);
  };

  const handleView = (result) => {
    setSelectedResult(result);
    setModalMode('view');
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa kết quả này?')) {
      return;
    }

    const response = await adminLotteryResultService.deleteLotteryResult(id);
    if (response.success) {
      alert(response.message);
      loadResults();
    } else {
      alert(response.message);
    }
  };

  const handlePublish = async (id) => {
    if (!window.confirm('Bạn có chắc muốn công bố kết quả này? Sau khi công bố, kết quả sẽ được dùng để check cược.')) {
      return;
    }

    const response = await adminLotteryResultService.publishResult(id);
    if (response.success) {
      alert(response.message);
      loadResults();
    } else {
      alert(response.message);
    }
  };

  const handleUnpublish = async (id) => {
    if (!window.confirm('Bạn có chắc muốn hủy công bố kết quả này?')) {
      return;
    }

    const response = await adminLotteryResultService.unpublishResult(id);
    if (response.success) {
      alert(response.message);
      loadResults();
    } else {
      alert(response.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validate JSON
      JSON.parse(formData.results);
    } catch (error) {
      alert('JSON kết quả không hợp lệ: ' + error.message);
      return;
    }

    let response;
    if (modalMode === 'create') {
      response = await adminLotteryResultService.createLotteryResult(formData);
    } else if (modalMode === 'edit') {
      response = await adminLotteryResultService.updateLotteryResult(
        selectedResult.id, 
        formData
      );
    }

    if (response.success) {
      alert(response.message);
      setShowModal(false);
      loadResults();
    } else {
      alert(response.message);
    }
  };

  const handleRegionChange = (region) => {
    const template = region === 'mienBac' 
      ? adminLotteryResultService.getMienBacTemplate()
      : adminLotteryResultService.getMienTrungNamTemplate();
    
    setFormData({
      ...formData,
      region,
      province: region === 'mienBac' ? '' : formData.province,
      results: JSON.stringify(template, null, 2)
    });
  };

  // Handle results change from form table
  const handleResultsChange = (jsonResults) => {
    setFormData({
      ...formData,
      results: jsonResults
    });
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('vi-VN');
  };

  const getStatusBadge = (status) => {
    if (status === 'PUBLISHED') {
      return <span className="px-2 py-1 bg-green-500 text-white rounded text-sm">Đã công bố</span>;
    } else {
      return <span className="px-2 py-1 bg-yellow-500 text-white rounded text-sm">Nháp</span>;
    }
  };

  const provinces = [
    { value: 'gialai', label: 'Gia Lai' },
    { value: 'binhduong', label: 'Bình Dương' },
    { value: 'ninhthuan', label: 'Ninh Thuận' },
    { value: 'travinh', label: 'Trà Vinh' },
    { value: 'vinhlong', label: 'Vĩnh Long' }
  ];

  const getProvinceName = (provinceCode) => {
    if (!provinceCode) return '-';
    const province = provinces.find(p => p.value === provinceCode);
    return province ? province.label : provinceCode;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý kết quả xổ số</h1>
        <button
          onClick={handleCreate}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Tạo kết quả mới
        </button>
      </div>

      {/* Filter */}
      <div className="mb-4 flex gap-4">
        <select
          value={filterRegion}
          onChange={(e) => {
            setFilterRegion(e.target.value);
            setCurrentPage(0);
          }}
          className="border rounded px-3 py-2"
        >
          <option value="">Tất cả vùng miền</option>
          <option value="mienBac">Miền Bắc</option>
          <option value="gialai">Gia Lai</option>
          <option value="binhduong">Bình Dương</option>
          <option value="ninhthuan">Ninh Thuận</option>
          <option value="travinh">Trà Vinh</option>
          <option value="vinhlong">Vĩnh Long</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-8">Đang tải...</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">ID</th>
                  <th className="border p-2">Vùng miền</th>
                  <th className="border p-2">Tỉnh</th>
                  <th className="border p-2">Ngày quay</th>
                  <th className="border p-2">Trạng thái</th>
                  <th className="border p-2">Ngày tạo</th>
                  <th className="border p-2">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {results.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      Chưa có kết quả nào
                    </td>
                  </tr>
                ) : (
                  results.map((result) => (
                    <tr key={result.id} className="hover:bg-gray-50">
                      <td className="border p-2 text-center">{result.id}</td>
                      <td className="border p-2">
                        {result.region === 'mienBac' ? 'Miền Bắc' : 'Miền Trung Nam'}
                      </td>
                      <td className="border p-2">
                        {result.region === 'mienBac' ? '-' : getProvinceName(result.province)}
                      </td>
                      <td className="border p-2">{formatDate(result.drawDate)}</td>
                      <td className="border p-2 text-center">
                        {getStatusBadge(result.status)}
                      </td>
                      <td className="border p-2">{formatDate(result.createdAt)}</td>
                      <td className="border p-2">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleView(result)}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded text-sm"
                          >
                            Xem
                          </button>
                          <button
                            onClick={() => handleEdit(result)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded text-sm"
                          >
                            Sửa
                          </button>
                          {result.status === 'DRAFT' ? (
                            <button
                              onClick={() => handlePublish(result.id)}
                              className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-sm"
                            >
                              Công bố
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUnpublish(result.id)}
                              className="bg-orange-500 hover:bg-orange-600 text-white px-2 py-1 rounded text-sm"
                            >
                              Hủy CB
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(result.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm"
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              <button
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Trước
              </button>
              <span className="px-3 py-1">
                Trang {currentPage + 1} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                disabled={currentPage >= totalPages - 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Sau
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {modalMode === 'create' && 'Tạo kết quả mới'}
              {modalMode === 'edit' && 'Sửa kết quả'}
              {modalMode === 'view' && 'Xem kết quả'}
            </h2>

            {modalMode === 'view' ? (
              <div>
                <div className="mb-4">
                  <strong>Vùng miền:</strong> {selectedResult.region === 'mienBac' ? 'Miền Bắc' : 'Miền Trung Nam'}
                </div>
                <div className="mb-4">
                  <strong>Tỉnh:</strong> {selectedResult.region === 'mienBac' ? '-' : getProvinceName(selectedResult.province)}
                </div>
                <div className="mb-4">
                  <strong>Ngày quay:</strong> {formatDate(selectedResult.drawDate)}
                </div>
                <div className="mb-4">
                  <strong>Trạng thái:</strong> {getStatusBadge(selectedResult.status)}
                </div>
                <div className="mb-4">
                  <strong>Kết quả:</strong>
                  <div className="mt-2">
                    <LotteryResultFormTable
                      initialResults={selectedResult.results}
                      isEditing={false}
                      isReadOnly={true}
                    />
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                >
                  Đóng
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block mb-2 font-semibold">Vùng miền *</label>
                  <select
                    value={formData.region}
                    onChange={(e) => handleRegionChange(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    required
                  >
                    <option value="mienBac">Miền Bắc</option>
                    <option value="mienTrungNam">Miền Trung Nam</option>
                  </select>
                </div>

                {formData.region === 'mienTrungNam' && (
                  <div className="mb-4">
                    <label className="block mb-2 font-semibold">Tỉnh *</label>
                    <select
                      value={formData.province}
                      onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                      required
                    >
                      <option value="">-- Chọn tỉnh --</option>
                      {provinces.map((p) => (
                        <option key={p.value} value={p.value}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="mb-4">
                  <label className="block mb-2 font-semibold">Ngày quay *</label>
                  <input
                    type="date"
                    value={formData.drawDate}
                    onChange={(e) => setFormData({ ...formData, drawDate: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block mb-2 font-semibold">Kết quả xổ số *</label>
                  <LotteryResultFormTable
                    initialResults={formData.results}
                    onResultsChange={handleResultsChange}
                    isEditing={modalMode === 'edit'}
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Nhập số vào các ô tương ứng với từng giải thưởng. Các ô trống sẽ không được lưu.
                  </p>
                </div>

                <div className="mb-4">
                  <label className="block mb-2 font-semibold">Trạng thái *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                    required
                  >
                    <option value="DRAFT">Nháp (chưa dùng để check)</option>
                    <option value="PUBLISHED">Đã công bố (dùng để check)</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    {modalMode === 'create' ? 'Tạo' : 'Cập nhật'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                  >
                    Hủy
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLotteryResultManagement;

