import { Card, Button, Tag } from '../../../components/ui';
import { Icon } from '@iconify/react';

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
    <Card className="hover:shadow-lg transition-shadow mb-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="flex items-center gap-2 mb-2">
            <Tag color="blue">{match.league}</Tag>
            {match.status === 'live' && (
              <Tag color="error">
                <div className="flex items-center gap-1">
                  <Icon icon="mdi:play-circle" />
                  <span>LIVE</span>
                </div>
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
          <div className="grid grid-cols-3 gap-2">
            <Button size="sm" variant="outline" className="flex flex-col items-center">
              <div className="text-xs">Thắng</div>
              <div className="font-semibold">{match.odds.home}</div>
            </Button>
            <Button size="sm" variant="outline" className="flex flex-col items-center">
              <div className="text-xs">Hòa</div>
              <div className="font-semibold">{match.odds.draw}</div>
            </Button>
            <Button size="sm" variant="outline" className="flex flex-col items-center">
              <div className="text-xs">Thua</div>
              <div className="font-semibold">{match.odds.away}</div>
            </Button>
          </div>
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
          <Icon icon="mdi:trophy" className="text-blue-600 text-xl" />
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
