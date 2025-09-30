import { Spin } from 'antd';

const Loading = ({ size = 'large', tip = 'Đang tải...' }) => {
  return (
    <div className="flex justify-center items-center min-h-[200px]">
      <Spin size={size} tip={tip} />
    </div>
  );
};

export default Loading;
