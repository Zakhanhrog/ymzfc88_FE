import { useState, useEffect } from 'react';
import { Gift, Plus } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import Alert from '../../../components/ui/Alert';
import PromotionCard from './promotion/PromotionCard';
import PromotionModal from './promotion/PromotionModal';
import promotionService from '../../../services/promotionService';
import { message } from '../../../utils/notification';

const PromotionManagement = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);
  const [error, setError] = useState('');

  const loadPromotions = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await promotionService.getAllPromotions();
      setPromotions(response);
    } catch (error) {
      setError('Không thể tải danh sách khuyến mãi: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await promotionService.deletePromotion(id);
      message.success('Xóa khuyến mãi thành công!');
      loadPromotions();
    } catch (error) {
      message.error('Lỗi: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await promotionService.togglePromotionStatus(id);
      message.success('Cập nhật trạng thái thành công!');
      loadPromotions();
    } catch (error) {
      message.error('Lỗi: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleCreate = () => {
    setEditingPromotion(null);
    setModalVisible(true);
  };

  const handleEdit = (promotion) => {
    setEditingPromotion(promotion);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setEditingPromotion(null);
  };

  const handleSuccess = () => {
    loadPromotions();
  };

  useEffect(() => {
    loadPromotions();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-[#4CAF50] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert
          type="error"
          description={error}
          closable
          onClose={() => setError('')}
          className="rounded-2xl"
        />
      )}

      {/* Promotions Grid */}
      {promotions.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {promotions.map((promotion) => (
            <PromotionCard
              key={promotion.id}
              promotion={promotion}
              onEdit={handleEdit}
              onToggleStatus={handleToggleStatus}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm p-12">
          <div className="text-center">
            <Gift className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-500 mb-2">Chưa có khuyến mãi nào</h3>
            <p className="text-sm text-gray-400 mb-4">Hãy thêm khuyến mãi đầu tiên</p>
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Thêm khuyến mãi
            </Button>
          </div>
        </div>
      )}

      {/* Modal */}
      <PromotionModal
        open={modalVisible}
        onClose={handleModalClose}
        promotion={editingPromotion}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default PromotionManagement;
