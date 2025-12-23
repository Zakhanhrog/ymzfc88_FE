import React, { useState, useEffect } from 'react';
import { message } from '../../../utils/notification';
import { adminBannerService } from '../services/adminBannerService';
import BannerHeader from './banner/BannerHeader';
import BannerSection from './banner/BannerSection';
import BannerModal from './banner/BannerModal';
import { Card } from '../../../components/ui/Card';

const AdminBannerManagement = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [editingBanner, setEditingBanner] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const bannerTypes = [
    { value: 'MAIN_BANNER', label: 'Banner chính (4:1) - Tối đa 5 cái', aspectRatio: '4:1', maxCount: 5 },
    { value: 'SIDEBAR_BANNER', label: 'Banner sidebar (2:3) - Tối đa 3 cái', aspectRatio: '2:3', maxCount: 3 }
  ];

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    setLoading(true);
    try {
      const response = await adminBannerService.getAllBanners(0, 100, 'displayOrder', 'asc');
      if (response.success) {
        const banners = response.data.content || response.data || [];
        setBanners(banners);
      }
    } catch (error) {
      console.error('Error loading banners:', error);
      message.error(error.message || 'Lỗi khi tải danh sách banner');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingBanner(null);
    setModalMode('create');
    setModalVisible(true);
  };

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setModalMode('edit');
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await adminBannerService.deleteBanner(id);
      message.success('Xóa banner thành công');
      loadBanners();
    } catch (error) {
      console.error('Error deleting banner:', error);
      message.error(error.response?.data?.message || error.message || 'Lỗi khi xóa banner');
    }
  };

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      if (modalMode === 'edit' && editingBanner) {
        await adminBannerService.updateBanner(editingBanner.id, formData);
        message.success('Cập nhật banner thành công');
      } else {
        await adminBannerService.createBanner(formData);
        message.success('Tạo banner thành công');
      }
      
      setModalVisible(false);
      setEditingBanner(null);
      loadBanners();
    } catch (error) {
      console.error('Error saving banner:', error);
      message.error(error.response?.data?.message || error.message || 'Lỗi khi lưu banner');
    } finally {
      setSubmitting(false);
    }
  };

  const getBannersByType = (type) => {
    return banners.filter(banner => banner.bannerType === type);
  };

  const getAspectRatioInfo = (bannerType) => {
    const type = bannerTypes.find(t => t.value === bannerType);
    return type ? type.aspectRatio : '1:1';
  };

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl bg-white p-4 shadow-sm">
        <BannerHeader onCreate={handleCreate} />

        <div className="mt-6 space-y-6">
          {/* Banner chính */}
          <BannerSection
            title="Banner chính (4:1) - Tối đa 5 cái"
            banners={getBannersByType('MAIN_BANNER')}
            aspectRatio="4:1"
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {/* Banner sidebar */}
          <BannerSection
            title="Banner sidebar (2:3) - Tối đa 3 cái"
            banners={getBannersByType('SIDEBAR_BANNER')}
            aspectRatio="2:3"
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </Card>

      <BannerModal
        open={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingBanner(null);
        }}
        mode={modalMode}
        banner={editingBanner}
        bannerTypes={bannerTypes}
        onSubmit={handleSubmit}
        loading={submitting}
      />
    </div>
  );
};

export default AdminBannerManagement;
