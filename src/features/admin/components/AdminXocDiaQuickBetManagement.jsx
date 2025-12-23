import { useEffect, useMemo, useState } from 'react';
import { message } from '../../../utils/notification';
import adminXocDiaQuickBetService from '../services/adminXocDiaQuickBetService';
import XocDiaQuickBetHeader from './xoc-dia-quick-bet/XocDiaQuickBetHeader';
import XocDiaQuickBetTable from './xoc-dia-quick-bet/XocDiaQuickBetTable';
import XocDiaQuickBetStats from './xoc-dia-quick-bet/XocDiaQuickBetStats';

const AdminXocDiaQuickBetManagement = () => {
  const [quickBets, setQuickBets] = useState([]);
  const [editedQuickBets, setEditedQuickBets] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    loadQuickBets();
  }, []);

  const sortedQuickBets = useMemo(
    () =>
      [...quickBets].sort((a, b) => {
        if (a.layoutGroup === b.layoutGroup) {
          return (a.displayOrder ?? 0) - (b.displayOrder ?? 0);
        }
        return a.layoutGroup.localeCompare(b.layoutGroup);
      }),
    [quickBets]
  );

  const loadQuickBets = async () => {
    try {
      setLoading(true);
      const response = await adminXocDiaQuickBetService.getAll();
      if (response.success) {
        const data = (response.data || []).map((item) => ({
          ...item,
          layoutGroup: (item.layoutGroup || 'TOP').toUpperCase(),
          payoutMultiplier: Number(item.payoutMultiplier),
          feeRate: item.feeRate != null ? Number(item.feeRate) : null,
          pattern: item.pattern || '',
        }));
        setQuickBets(data);
        const initialEdited = {};
        data.forEach((item) => {
          initialEdited[item.id] = { ...item };
        });
        setEditedQuickBets(initialEdited);
      } else {
        message.error(response.message || 'Không thể tải cấu hình quick bet');
      }
    } catch (error) {
      console.error('Load quick bet configs error:', error);
      message.error(error.message || 'Không thể tải cấu hình quick bet');
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    if (editMode) {
      const resetEdited = {};
      quickBets.forEach((item) => {
        resetEdited[item.id] = { ...item };
      });
      setEditedQuickBets(resetEdited);
    }
    setEditMode((prev) => !prev);
  };

  const handleFieldChange = (id, field, value) => {
    setEditedQuickBets((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: field === 'payoutMultiplier' ? value : value,
      },
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = Object.values(editedQuickBets).map((item) => ({
        id: item.id,
        code: item.code.trim(),
        name: item.name.trim(),
        description: item.description?.trim() || '',
        payoutMultiplier: Number(item.payoutMultiplier),
        feeRate: item.feeRate != null && item.feeRate !== '' ? Number(item.feeRate) : null,
        pattern: item.pattern?.trim() || '',
        layoutGroup: (item.layoutGroup || 'TOP').toUpperCase(),
        displayOrder: Number(item.displayOrder ?? 0),
        isActive: Boolean(item.isActive),
      }));

      for (const config of payload) {
        if (!config.code || !config.name) {
          message.error('Mã và tên quick bet không được để trống');
          setSaving(false);
          return;
        }
        if (Number.isNaN(config.payoutMultiplier) || config.payoutMultiplier <= 0) {
          message.error(`Tỷ lệ của ${config.name} phải lớn hơn 0`);
          setSaving(false);
          return;
        }
        if (Number.isNaN(config.displayOrder) || config.displayOrder < 0) {
          message.error(`Thứ tự hiển thị của ${config.name} phải từ 0 trở lên`);
          setSaving(false);
          return;
        }
      }

      const response = await adminXocDiaQuickBetService.batchUpdate(payload);
      if (response.success) {
        message.success(response.message || 'Đã lưu thay đổi');
        setEditMode(false);
        await loadQuickBets();
      } else {
        message.error(response.message || 'Không thể lưu thay đổi');
      }
    } catch (error) {
      console.error('Save quick bet configs error:', error);
      message.error(error.message || 'Không thể lưu thay đổi');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <div className="flex justify-end items-center mb-4">
          <XocDiaQuickBetHeader
            editMode={editMode}
            saving={saving}
            loading={loading}
            onEditToggle={handleEditToggle}
            onSaveChanges={handleSave}
            onRefresh={loadQuickBets}
          />
        </div>

        <XocDiaQuickBetTable
          quickBets={sortedQuickBets}
          editMode={editMode}
          editedQuickBets={editedQuickBets}
          loading={loading}
          onFieldChange={handleFieldChange}
        />
      </div>

      <XocDiaQuickBetStats quickBets={quickBets} />
    </div>
  );
};

export default AdminXocDiaQuickBetManagement;


