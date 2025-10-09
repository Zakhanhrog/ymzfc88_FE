import { Spinner } from '../ui';

const Loading = ({ size = 'lg', tip = 'Đang tải...' }) => {
  return (
    <div className="flex justify-center items-center min-h-[200px]">
      <Spinner size={size} tip={tip} />
    </div>
  );
};

export default Loading;
