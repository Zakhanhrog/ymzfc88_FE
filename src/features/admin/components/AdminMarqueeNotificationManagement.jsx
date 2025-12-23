import React, { useState, useEffect } from 'react';
import { message } from '../../../utils/notification';
import { marqueeNotificationService } from '../services/adminMarqueeNotificationService';
import MarqueeNotificationTable from './marquee-notification/MarqueeNotificationTable';
import MarqueeNotificationModal from './marquee-notification/MarqueeNotificationModal';

const AdminMarqueeNotificationManagement = () => {
  const [marqueeNotifications, setMarqueeNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [editingItem, setEditingItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    loadMarqueeNotifications();
  }, []);

  const loadMarqueeNotifications = async (page = 1, keyword = '') => {
    setLoading(true);
    try {
      const response = await marqueeNotificationService.getMarqueeNotifications(page - 1, 10, keyword);
      if (response.success) {
        setMarqueeNotifications(response.data.content);
        setPagination(prev => ({
          ...prev,
          current: page,
          total: response.data.totalElements
        }));
      } else {
        message.error(response.message || 'Lỗi khi tải danh sách thông báo');
      }
    } catch (error) {
      message.error(error.message || 'Lỗi khi tải danh sách thông báo');
      console.error('Error loading marquee notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingItem(null);
    setModalMode('create');
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingItem(record);
    setModalMode('edit');
    setModalVisible(true);
  };

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      if (modalMode === 'edit' && editingItem) {
        await marqueeNotificationService.updateMarqueeNotification(editingItem.id, formData);
        message.success('Cập nhật thông báo thành công');
      } else {
        await marqueeNotificationService.createMarqueeNotification(formData);
        message.success('Tạo thông báo thành công');
      }
      
      setModalVisible(false);
      setEditingItem(null);
      loadMarqueeNotifications(pagination.current, searchKeyword);
    } catch (error) {
      message.error(error.message || 'Lỗi khi lưu thông báo');
      console.error('Error saving marquee notification:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await marqueeNotificationService.deleteMarqueeNotification(id);
      message.success('Xóa thông báo thành công');
      loadMarqueeNotifications(pagination.current, searchKeyword);
    } catch (error) {
      message.error(error.message || 'Lỗi khi xóa thông báo');
      console.error('Error deleting marquee notification:', error);
    }
  };

  const handleToggleActive = async (id) => {
    try {
      await marqueeNotificationService.toggleActiveStatus(id);
      message.success('Thay đổi trạng thái thành công');
      loadMarqueeNotifications(pagination.current, searchKeyword);
    } catch (error) {
      message.error(error.message || 'Lỗi khi thay đổi trạng thái');
      console.error('Error toggling active status:', error);
    }
  };

  const handleSearch = (value) => {
    setSearchKeyword(value);
    loadMarqueeNotifications(1, value);
  };

  const handlePageChange = (newPage, newPageSize) => {
    const pageSize = newPageSize || pagination.pageSize;
    setPagination(prev => ({
      ...prev,
      current: newPage,
      pageSize
    }));
    loadMarqueeNotifications(newPage, searchKeyword);
  };

  return (
    <div className="space-y-6">
      <MarqueeNotificationTable
        notifications={marqueeNotifications}
        loading={loading}
        pagination={pagination}
        searchKeyword={searchKeyword}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleActive={handleToggleActive}
        onCreate={handleCreate}
      />

      <MarqueeNotificationModal
        open={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingItem(null);
        }}
        mode={modalMode}
        notification={editingItem}
        onSubmit={handleSubmit}
        loading={submitting}
      />
    </div>
  );
};

export default AdminMarqueeNotificationManagement;
