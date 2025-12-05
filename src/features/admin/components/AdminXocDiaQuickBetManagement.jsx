import { useEffect, useMemo, useState } from 'react';
import { Icon } from '@iconify/react';
import adminXocDiaQuickBetService from '../services/adminXocDiaQuickBetService';

const layoutGroupOptions = [
  { value: 'TOP', label: 'Hàng trên' },
  { value: 'BOTTOM', label: 'Hàng dưới' },
];

const formatRatio = (value) => {
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return value;
  const formatted = Number.isInteger(numeric)
    ? numeric.toFixed(0)
    : numeric.toFixed(2).replace(/\.?0+$/, '');
  return `1 : ${formatted}`;
};

const AdminXocDiaQuickBetManagement = () => {
  const [quickBets, setQuickBets] = useState([]);
  const [editedQuickBets, setEditedQuickBets] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [notification, setNotification] = useState(null);

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

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

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
        showNotification('error', response.message || 'Không thể tải cấu hình quick bet');
      }
    } catch (error) {
      console.error('Load quick bet configs error:', error);
      showNotification('error', 'Không thể tải cấu hình quick bet');
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
          showNotification('error', 'Mã và tên quick bet không được để trống');
          setSaving(false);
          return;
        }
        if (Number.isNaN(config.payoutMultiplier) || config.payoutMultiplier <= 0) {
          showNotification('error', `Tỷ lệ của ${config.name} phải lớn hơn 0`);
          setSaving(false);
          return;
        }
        if (Number.isNaN(config.displayOrder) || config.displayOrder < 0) {
          showNotification('error', `Thứ tự hiển thị của ${config.name} phải từ 0 trở lên`);
          setSaving(false);
          return;
        }
      }

      const response = await adminXocDiaQuickBetService.batchUpdate(payload);
      if (response.success) {
        showNotification('success', response.message || 'Đã lưu thay đổi');
        setEditMode(false);
        await loadQuickBets();
      } else {
        showNotification('error', response.message || 'Không thể lưu thay đổi');
      }
    } catch (error) {
      console.error('Save quick bet configs error:', error);
      showNotification('error', error.message || 'Không thể lưu thay đổi');
    } finally {
      setSaving(false);
    }
  };

  const totalActive = quickBets.filter((item) => item.isActive).length;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Xóc Đĩa - Cấu hình Quick Bet</h1>
          <p className="text-sm text-gray-600">
            Quản lý tỷ lệ cược và thứ tự hiển thị cho các lựa chọn Quick Bet trong game Xóc Đĩa.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleEditToggle}
            className="inline-flex items-center gap-2 rounded-lg border border-emerald-600 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
          >
            <Icon icon={editMode ? 'mdi:close-circle' : 'mdi:pencil'} className="h-4 w-4" />
            {editMode ? 'Hủy chỉnh sửa' : 'Chỉnh sửa'}
          </button>

          <button
            type="button"
            onClick={loadQuickBets}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            disabled={loading}
          >
            <Icon icon="mdi:refresh" className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Tải lại
          </button>

          {editMode && (
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={saving}
            >
              <Icon icon="mdi:content-save" className="h-4 w-4" />
              {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          )}
        </div>
      </header>

      {notification && (
        <div
          className={`flex items-center gap-2 rounded-lg border px-4 py-3 text-sm ${
            notification.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border-red-200 bg-red-50 text-red-700'
          }`}
        >
          <Icon
            icon={notification.type === 'success' ? 'mdi:check-circle' : 'mdi:alert-circle'}
            className="h-5 w-5"
          />
          <span>{notification.message}</span>
        </div>
      )}

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Danh sách Quick Bet</h2>
            <p className="text-sm text-gray-500">
              Tổng {quickBets.length} mục | Active {totalActive} | Inactive {quickBets.length - totalActive}
            </p>
          </div>
          {loading && (
            <div className="inline-flex items-center gap-2 text-sm text-gray-500">
              <Icon icon="mdi:loading" className="h-4 w-4 animate-spin" />
              Đang tải dữ liệu...
            </div>
          )}
        </div>

        {sortedQuickBets.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center gap-3 px-6 py-12 text-gray-500">
            <Icon icon="mdi:database-off" className="h-12 w-12" />
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-700">Chưa có cấu hình</h3>
              <p className="text-sm text-gray-500">
                Hãy nhấn &quot;Chỉnh sửa&quot; để thêm quick bet đầu tiên cho game Xóc Đĩa.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Mã
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Tên hiển thị
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Tỷ lệ (1 ăn)
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Tỷ lệ phế
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Nhóm hiển thị
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Thứ tự
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Pattern
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Trạng thái
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Mô tả
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {sortedQuickBets.map((item) => {
                  const editing = editedQuickBets[item.id] || {};

                  return (
                    <tr key={item.id}>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                        {editMode ? (
                          <input
                            type="text"
                            value={editing.code || ''}
                            onChange={(e) => handleFieldChange(item.id, 'code', e.target.value)}
                            className="w-32 rounded border border-gray-300 px-2 py-1 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                        ) : (
                          <span className="font-semibold uppercase text-gray-700">{item.code}</span>
                        )}
                      </td>

                      <td className="px-4 py-3 text-sm text-gray-900">
                        {editMode ? (
                          <input
                            type="text"
                            value={editing.name || ''}
                            onChange={(e) => handleFieldChange(item.id, 'name', e.target.value)}
                            className="w-40 rounded border border-gray-300 px-2 py-1 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                        ) : (
                          <span className="font-medium text-gray-800">{item.name}</span>
                        )}
                        <div className="text-xs text-gray-500">{formatRatio(item.payoutMultiplier)}</div>
                      </td>

                      <td className="px-4 py-3 text-sm text-gray-900">
                        {editMode ? (
                          <input
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={editing.payoutMultiplier ?? ''}
                            onChange={(e) => handleFieldChange(item.id, 'payoutMultiplier', e.target.value)}
                            className="w-28 rounded border border-gray-300 px-2 py-1 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                        ) : (
                          <span className="font-semibold text-emerald-700">{formatRatio(item.payoutMultiplier)}</span>
                        )}
                      </td>

                      <td className="px-4 py-3 text-sm text-gray-900">
                        {editMode ? (
                          <input
                            type="number"
                            min="0"
                            max="1"
                            step="0.0001"
                            value={editing.feeRate != null ? editing.feeRate : ''}
                            onChange={(e) => handleFieldChange(item.id, 'feeRate', e.target.value === '' ? null : e.target.value)}
                            placeholder="0.03 = 3%"
                            className="w-28 rounded border border-gray-300 px-2 py-1 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                        ) : (
                          <span className="font-semibold text-gray-700">
                            {item.feeRate != null && item.feeRate > 0
                              ? `${(item.feeRate * 100).toFixed(2)}%`
                              : '—'}
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3 text-sm text-gray-900">
                        {editMode ? (
                          <select
                            value={editing.layoutGroup || 'TOP'}
                            onChange={(e) => handleFieldChange(item.id, 'layoutGroup', e.target.value)}
                            className="w-28 rounded border border-gray-300 px-2 py-1 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          >
                            {layoutGroupOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase text-emerald-700">
                            {item.layoutGroup === 'TOP' ? 'Hàng trên' : 'Hàng dưới'}
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3 text-sm text-gray-900">
                        {editMode ? (
                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={editing.displayOrder ?? 0}
                            onChange={(e) => handleFieldChange(item.id, 'displayOrder', e.target.value)}
                            className="w-20 rounded border border-gray-300 px-2 py-1 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                        ) : (
                          <span className="font-semibold text-gray-700">{item.displayOrder}</span>
                        )}
                      </td>

                      <td className="px-4 py-3 text-sm text-gray-900">
                        {editMode ? (
                          <input
                            type="text"
                            value={editing.pattern || ''}
                            onChange={(e) => handleFieldChange(item.id, 'pattern', e.target.value)}
                            placeholder="Ví dụ: white,white,red,red"
                            className="w-48 rounded border border-gray-300 px-2 py-1 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                        ) : (
                          <span className="font-mono text-xs text-gray-600">{item.pattern || '—'}</span>
                        )}
                      </td>

                      <td className="px-4 py-3 text-sm text-gray-900">
                        {editMode ? (
                          <label className="inline-flex cursor-pointer items-center gap-2">
                            <input
                              type="checkbox"
                              checked={Boolean(editing.isActive)}
                              onChange={(e) => handleFieldChange(item.id, 'isActive', e.target.checked)}
                              className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                            />
                            <span className="text-sm">Active</span>
                          </label>
                        ) : (
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                              item.isActive
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {item.isActive ? 'Active' : 'Inactive'}
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3 text-sm text-gray-900">
                        {editMode ? (
                          <textarea
                            value={editing.description || ''}
                            onChange={(e) => handleFieldChange(item.id, 'description', e.target.value)}
                            rows={2}
                            className="w-56 rounded border border-gray-300 px-2 py-1 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            placeholder="Mô tả hiển thị ở backend"
                          />
                        ) : (
                          <p className="text-sm text-gray-600">{item.description || '—'}</p>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminXocDiaQuickBetManagement;


