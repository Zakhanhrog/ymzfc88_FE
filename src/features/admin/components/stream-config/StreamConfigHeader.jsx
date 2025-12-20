import { Button } from '../../../../components/ui/Button';
import { Plus } from 'lucide-react';

const StreamConfigHeader = ({ onCreate }) => {
  return (
    <div className="flex justify-end items-center">
      <Button
        onClick={onCreate}
        className="gap-2 bg-[#4CAF50] text-white hover:bg-[#45a049] rounded-2xl"
      >
        <Plus className="h-4 w-4" />
        Thêm Stream Config
      </Button>
    </div>
  );
};

export default StreamConfigHeader;

