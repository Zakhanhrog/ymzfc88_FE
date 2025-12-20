import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import notificationService from '../../notification/services/notificationService';
import { adminService } from '../services/adminService';
import NotificationStats from './notification/NotificationStats';
import NotificationTable from './notification/NotificationTable';
import NotificationModal from './notification/NotificationModal';
import Alert from '../../../components/ui/Alert';

const AdminNotificationManagement = () => {
  const [notifications, setNotifications] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 });
  const [notification, setNotification] = useState(null);

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    broadcast: 0,
    individual: 0,
  });

  useEffect(() => {
    loadNotifications();
    loadUsers();
  }, [pagination.current, pagination.pageSize]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const response = await notificationService.getAllNotifications(
        pagination.current - 1,
        pagination.pageSize
      );

      if (response.success && response.data) {
        setNotifications(response.data.content);
        setPagination(prev => ({
          ...prev,
          total: response.data.totalElements,
        }));

        // Calculate stats
        const broadcast = response.data.content.filter(n => !n.targetUserId).length;
        setStats({
          total: response.data.totalElements,
          broadcast: broadcast,
          individual: response.data.totalElements - broadcast,
        });
      }
    } catch (error) {
      showNotification('Lỗi khi tải danh sách thông báo: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await adminService.getAllUsers();
      if (response.success && response.data) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const handleCreateNotification = async (notificationData) => {
    setLoading(true);
    try {
      const response = await notificationService.createNotification(notificationData);

      if (response.success) {
        showNotification('Gửi thông báo thành công!', 'success');
        setCreateModalVisible(false);
        loadNotifications();
      } else {
        showNotification('Lỗi khi gửi thông báo: ' + (response.message || 'Unknown error'), 'error');
      }
    } catch (error) {
      showNotification('Lỗi khi gửi thông báo: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    setLoading(true);
    try {
      const response = await notificationService.deleteNotification(notificationId);
      if (response.success) {
        showNotification('Xóa thông báo thành công!', 'success');
        loadNotifications();
      } else {
        showNotification('Lỗi khi xóa thông báo: ' + (response.message || 'Unknown error'), 'error');
      }
    } catch (error) {
      showNotification('Lỗi khi xóa thông báo: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (newPage, newPageSize) => {
    setPagination({
      current: newPage,
      pageSize: newPageSize || pagination.pageSize,
      total: pagination.total
    });
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
  };

  useEffect(() => {
    let timer;
    if (notification) {
      timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [notification]);

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

      <NotificationStats stats={stats} />

      <NotificationTable
        notifications={notifications}
        loading={loading}
        pagination={pagination}
        onPageChange={handleTableChange}
        onDelete={handleDeleteNotification}
        onCreate={() => setCreateModalVisible(true)}
      />

      <NotificationModal
        open={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        users={users}
        onSubmit={handleCreateNotification}
        loading={loading}
      />
    </div>
  );
};

export default AdminNotificationManagement;
