import { Button } from '../../../../components/ui/Button';
import { Edit, Save, X, Loader2 } from 'lucide-react';

const BettingOddsHeader = ({ 
  editMode, 
  saving, 
  loading,
  onEditToggle, 
  onSaveChanges 
}) => {
  return (
    <div className="flex justify-end gap-2">
      {editMode ? (
        <>
          <Button
            variant="outline"
            onClick={onEditToggle}
            disabled={saving}
            className="rounded-2xl"
          >
            <X className="h-4 w-4 mr-2" />
            Hủy
          </Button>
          <Button
            onClick={onSaveChanges}
            disabled={saving}
            className="gap-2 bg-[#4CAF50] text-white hover:bg-[#45a049] rounded-2xl"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Đang lưu...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Lưu thay đổi
              </>
            )}
          </Button>
        </>
      ) : (
        <Button
          onClick={onEditToggle}
          disabled={loading}
          className="gap-2 bg-yellow-500 text-white hover:bg-yellow-600 rounded-2xl"
        >
          <Edit className="h-4 w-4" />
          Chỉnh sửa
        </Button>
      )}
    </div>
  );
};

export default BettingOddsHeader;

