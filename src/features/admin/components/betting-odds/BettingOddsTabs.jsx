import Tabs from '../../../../components/ui/Tabs';

const BettingOddsTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    {
      key: 'MIEN_BAC',
      label: 'Miền Bắc'
    },
    {
      key: 'MIEN_TRUNG_NAM',
      label: 'Miền Trung & Nam'
    }
  ];

  return (
    <Tabs
      activeKey={activeTab}
      onChange={onTabChange}
      items={tabs}
      className="mb-0"
      tabBarClassName="border-0 gap-2"
      contentClassName="hidden"
    />
  );
};

export default BettingOddsTabs;

