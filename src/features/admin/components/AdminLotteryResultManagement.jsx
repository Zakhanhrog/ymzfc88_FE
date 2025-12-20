import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import adminLotteryResultService from '../services/adminLotteryResultService';
import LotteryResultFilters from './lottery-result/LotteryResultFilters';
import LotteryResultTable from './lottery-result/LotteryResultTable';
import LotteryResultModal from './lottery-result/LotteryResultModal';
import Alert from '../../../components/ui/Alert';

const AdminLotteryResultManagement = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filterRegion, setFilterRegion] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // create, edit, view
  const [selectedResult, setSelectedResult] = useState(null);
  const [notification, setNotification] = useState(null);
  
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
          
          // Lấy ngày hôm nay để check kết quả
          const today = new Date().toISOString().split('T')[0];
          const todayResults = results.filter(r => r.drawDate === today);
          const todayMienBacCount = todayResults.filter(r => r.region === 'mienBac').length;
          const todayProvinceCount = todayResults.filter(r => r.region === 'mienTrungNam').length;
          
          console.log(`📊 Kết quả hôm nay (${today}): Miền Bắc: ${todayMienBacCount}, Tỉnh: ${todayProvinceCount}`);
          
          // Nếu thiếu kết quả hôm nay, trigger auto-import
          if (todayMienBacCount === 0 || todayProvinceCount === 0) {
            console.log('🔄 Thiếu kết quả hôm nay, đang tự động import...');
            console.log(`Miền Bắc: ${todayMienBacCount}, Tỉnh: ${todayProvinceCount}`);
            
            const importResponse = await adminLotteryResultService.triggerAutoImportToday();
            if (importResponse.success) {
              console.log('✅ [DEBUG] Auto-import hôm nay thành công:', importResponse.message);
              console.log('📊 [DEBUG] Imported data:', importResponse.data);
              // Reload danh sách sau khi import
              setTimeout(() => {
                loadResults();
              }, 2000);
            } else {
              console.warn('⚠️ [DEBUG] Auto-import hôm nay thất bại:', importResponse.message);
            }
          } else {
            console.log('✅ Đã có đủ kết quả hôm nay, không cần import');
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
      message.success(response.message);
      setNotification({ type: 'success', message: response.message });
      loadResults();
    } else {
      message.error(response.message);
      setNotification({ type: 'error', message: response.message });
    }
  };

  const handlePublish = async (id) => {
    if (!window.confirm('Bạn có chắc muốn công bố kết quả này? Sau khi công bố, kết quả sẽ được dùng để check cược.')) {
      return;
    }

    const response = await adminLotteryResultService.publishResult(id);
    if (response.success) {
      message.success(response.message);
      setNotification({ type: 'success', message: response.message });
      loadResults();
    } else {
      message.error(response.message);
      setNotification({ type: 'error', message: response.message });
    }
  };

  const handleUnpublish = async (id) => {
    if (!window.confirm('Bạn có chắc muốn hủy công bố kết quả này?')) {
      return;
    }

    const response = await adminLotteryResultService.unpublishResult(id);
    if (response.success) {
      message.success(response.message);
      setNotification({ type: 'success', message: response.message });
      loadResults();
    } else {
      message.error(response.message);
      setNotification({ type: 'error', message: response.message });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validate JSON
      JSON.parse(formData.results);
    } catch (error) {
      message.error('JSON kết quả không hợp lệ: ' + error.message);
      setNotification({ type: 'error', message: 'JSON kết quả không hợp lệ: ' + error.message });
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
      message.success(response.message);
      setNotification({ type: 'success', message: response.message });
      setShowModal(false);
      loadResults();
    } else {
      message.error(response.message);
      setNotification({ type: 'error', message: response.message });
    }
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleRegionChange = (region) => {
    const template = region === 'mienBac' 
      ? adminLotteryResultService.getMienBacTemplate()
      : adminLotteryResultService.getMienTrungNamTemplate();
    
    setFormData(prev => ({
      ...prev,
      region,
      province: region === 'mienBac' ? '' : prev.province,
      results: JSON.stringify(template, null, 2)
    }));
  };

  const handleFormDataChange = (newFormData) => {
    setFormData(newFormData);
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
    
    // Nếu date đã là string format YYYY-MM-DD thì parse trực tiếp
    if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
      const [year, month, day] = date.split('-');
      return `${day}/${month}/${year}`;
    }
    
    // Nếu là Date object hoặc ISO string, convert với timezone VN
    try {
      const dateObj = new Date(date);
      // Sử dụng timezone Asia/Ho_Chi_Minh để tránh lỗi conversion
      return dateObj.toLocaleDateString('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error, date);
      return date.toString();
    }
  };


  return (
    <div className="space-y-6">
      {notification && (
        <Alert
          type={notification.type}
          message={notification.message}
          closable
          onClose={() => setNotification(null)}
        />
      )}

      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <LotteryResultFilters
          filterRegion={filterRegion}
          onFilterChange={(value) => {
            setFilterRegion(value);
            setCurrentPage(0);
          }}
          onCreate={handleCreate}
        />

        <div className="mt-4">
          <LotteryResultTable
            results={results}
            loading={loading}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onPublish={handlePublish}
            onUnpublish={handleUnpublish}
                    />
                  </div>
                </div>

      <LotteryResultModal
        open={showModal}
        mode={modalMode}
        result={selectedResult}
        formData={formData}
        onClose={() => {
          setShowModal(false);
          setSelectedResult(null);
        }}
        onSubmit={handleSubmit}
        onFormDataChange={handleFormDataChange}
        onRegionChange={handleRegionChange}
      />
    </div>
  );
};

export default AdminLotteryResultManagement;

