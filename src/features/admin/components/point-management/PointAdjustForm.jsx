import { useState } from 'react';
import { Card, CardContent } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import Select from '../../../../components/ui/Select';
import StatCard from '../../analytics/components/StatCard';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';

const PointAdjustForm = ({
  users,
  selectedUser,
  userPoints,
  loading,
  onSubmit,
  onUserSelect
}) => {
  const [formData, setFormData] = useState({
    userId: '',
    type: 'ADD',
    points: '',
    description: ''
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.userId) newErrors.userId = 'Vui lòng chọn người dùng';
    if (!formData.points) newErrors.points = 'Vui lòng nhập số điểm';
    else if (parseInt(formData.points) < 1) newErrors.points = 'Số điểm phải >= 1';
    if (!formData.description) newErrors.description = 'Vui lòng nhập lý do điều chỉnh';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      userId: parseInt(formData.userId),
      points: parseInt(formData.points),
      type: formData.type,
      description: formData.description
    });

    setFormData(prev => ({ ...prev, points: '', description: '' }));
    setErrors({});
  };

  const handleUserChange = (userId) => {
    const user = users.find(u => u.id.toString() === userId);
    setFormData(prev => ({ ...prev, userId }));
    if (user) {
      onUserSelect(user);
    }
  };

  const userOptions = users.map(user => ({
    label: `${user.username} - ${user.fullName || 'N/A'} (ID: ${user.id})`,
    value: user.id.toString()
  }));

  const formatPoints = (points) => {
    return new Intl.NumberFormat('vi-VN').format(Math.abs(points || 0));
  };

  return (
    <Card className="rounded-lg">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Điều chỉnh điểm người dùng</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Chọn người dùng <span className="text-red-500">*</span>
                {loading && <span className="text-blue-500 ml-2">(Đang tải...)</span>}
              </label>
              <Select
                value={formData.userId}
                onChange={handleUserChange}
                options={[
                  { label: loading ? 'Đang tải danh sách...' : users.length === 0 ? 'Không có người dùng nào' : '-- Chọn người dùng --', value: '' },
                  ...userOptions
                ]}
                disabled={loading}
                bordered
                className={errors.userId ? 'border-red-500' : ''}
              />
              {errors.userId && <p className="text-red-500 text-xs mt-1">{errors.userId}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Loại điều chỉnh <span className="text-red-500">*</span>
              </label>
              <Select
                value={formData.type}
                onChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                options={[
                  { label: 'Cộng điểm', value: 'ADD' },
                  { label: 'Trừ điểm', value: 'SUBTRACT' }
                ]}
                bordered
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Số điểm <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                min="1"
                value={formData.points}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, points: e.target.value }));
                  if (errors.points) setErrors(prev => ({ ...prev, points: '' }));
                }}
                placeholder="Nhập số điểm"
                error={errors.points}
              />
              {errors.points && <p className="text-red-500 text-xs mt-1">{errors.points}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Lý do điều chỉnh <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.description}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, description: e.target.value }));
                  if (errors.description) setErrors(prev => ({ ...prev, description: '' }));
                }}
                placeholder="Nhập lý do điều chỉnh"
                error={errors.description}
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>
          </div>

          {userPoints && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard
                title="Tổng điểm hiện tại"
                value={formatPoints(userPoints.totalPoints)}
                icon={Wallet}
                bgColor="bg-blue-600"
                textColor="text-white"
              />
              <StatCard
                title="Tổng điểm đã nhận"
                value={formatPoints(userPoints.lifetimeEarned)}
                icon={TrendingUp}
                bgColor="bg-green-600"
                textColor="text-white"
              />
              <StatCard
                title="Tổng điểm đã dùng"
                value={formatPoints(userPoints.lifetimeSpent)}
                icon={TrendingDown}
                bgColor="bg-orange-600"
                textColor="text-white"
              />
            </div>
          )}

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#4CAF50] text-white hover:bg-[#45a049]"
            >
              {loading ? 'Đang xử lý...' : 'Điều chỉnh điểm'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PointAdjustForm;

