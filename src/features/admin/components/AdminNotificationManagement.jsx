import React, { useState, useEffect } from 'react';
import { message } from '../../../utils/notification';
import notificationService from '../../notification/services/notificationService';
import { adminService } from '../services/adminService';
import NotificationStats from './notification/NotificationStats';
import NotificationTable from './notification/NotificationTable';
import NotificationModal from './notification/NotificationModal';

const AdminNotificationManagement = () => {
  const [notifications, setNotifications] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 });

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
      message.error(error.message || 'Lỗi khi tải danh sách thông báo');
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
        message.success('Gửi thông báo thành công!');
        setCreateModalVisible(false);
        loadNotifications();
      } else {
        message.error(response.message || 'Lỗi khi gửi thông báo');
      }
    } catch (error) {
      message.error(error.message || 'Lỗi khi gửi thông báo');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    setLoading(true);
    try {
      const response = await notificationService.deleteNotification(notificationId);
      if (response.success) {
        message.success('Xóa thông báo thành công!');
        loadNotifications();
      } else {
        message.error(response.message || 'Lỗi khi xóa thông báo');
      }
    } catch (error) {
      message.error(error.message || 'Lỗi khi xóa thông báo');
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

  return (
    <div className="space-y-6">
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
