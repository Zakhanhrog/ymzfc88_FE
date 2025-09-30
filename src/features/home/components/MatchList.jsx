import { Card, Row, Col, Button, Tag, Divider } from 'antd';
import { PlayCircleOutlined, TrophyOutlined } from '@ant-design/icons';

const MatchCard = ({ match }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card 
      className="hover:shadow-lg transition-shadow mb-4"
      size="small"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Tag color="blue">{match.league}</Tag>
            {match.status === 'live' && (
              <Tag color="red" icon={<PlayCircleOutlined />}>
                LIVE
              </Tag>
            )}
          </div>
          
          <div className="text-lg font-semibold mb-1">
            {match.homeTeam} vs {match.awayTeam}
          </div>
          
          <div className="text-gray-500 text-sm">
            {formatDate(match.date)}
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-sm text-gray-600 mb-2">Tỷ lệ cược</div>
          <Row gutter={8}>
            <Col span={8}>
              <Button size="small" className="w-full">
                <div className="text-xs">Thắng</div>
                <div className="font-semibold">{match.odds.home}</div>
              </Button>
            </Col>
            <Col span={8}>
              <Button size="small" className="w-full">
                <div className="text-xs">Hòa</div>
                <div className="font-semibold">{match.odds.draw}</div>
              </Button>
            </Col>
            <Col span={8}>
              <Button size="small" className="w-full">
                <div className="text-xs">Thua</div>
                <div className="font-semibold">{match.odds.away}</div>
              </Button>
            </Col>
          </Row>
        </div>
      </div>
    </Card>
  );
};

const MatchList = ({ matches, title = "Trận đấu hot" }) => {
  return (
    <Card 
      title={
        <div className="flex items-center gap-2">
          <TrophyOutlined className="text-blue-600" />
          <span>{title}</span>
        </div>
      }
      className="h-full"
    >
      {matches && matches.length > 0 ? (
        matches.map(match => (
          <MatchCard key={match.id} match={match} />
        ))
      ) : (
        <div className="text-center text-gray-500 py-8">
          Không có trận đấu nào
        </div>
      )}
    </Card>
  );
};

export default MatchList;
