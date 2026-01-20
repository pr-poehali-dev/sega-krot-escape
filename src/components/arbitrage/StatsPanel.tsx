import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface StatsPanelProps {
  totalOpportunities: number;
  avgProfit: number;
  liveCount: number;
  prematchCount: number;
}

export default function StatsPanel({
  totalOpportunities,
  avgProfit,
  liveCount,
  prematchCount,
}: StatsPanelProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="bg-gradient-to-br from-[#16213e] to-[#0f3460] border-2 border-[#00ff00]/30 p-6 hover:border-[#00ff00] transition-all">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm mb-1">Всего вилок</p>
            <p className="text-4xl font-bold text-white">{totalOpportunities}</p>
          </div>
          <Icon name="TrendingUp" className="text-[#00ff00]" size={40} />
        </div>
      </Card>

      <Card className="bg-gradient-to-br from-[#16213e] to-[#0f3460] border-2 border-[#f39c12]/30 p-6 hover:border-[#f39c12] transition-all">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm mb-1">Средняя прибыль</p>
            <p className="text-4xl font-bold text-[#f39c12]">
              {avgProfit.toFixed(2)}%
            </p>
          </div>
          <Icon name="Percent" className="text-[#f39c12]" size={40} />
        </div>
      </Card>

      <Card className="bg-gradient-to-br from-[#16213e] to-[#0f3460] border-2 border-red-500/30 p-6 hover:border-red-500 transition-all">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm mb-1">Live события</p>
            <p className="text-4xl font-bold text-red-500">{liveCount}</p>
          </div>
          <Icon name="Radio" className="text-red-500" size={40} />
        </div>
      </Card>

      <Card className="bg-gradient-to-br from-[#16213e] to-[#0f3460] border-2 border-blue-500/30 p-6 hover:border-blue-500 transition-all">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm mb-1">Prematch события</p>
            <p className="text-4xl font-bold text-blue-500">{prematchCount}</p>
          </div>
          <Icon name="Calendar" className="text-blue-500" size={40} />
        </div>
      </Card>
    </div>
  );
}
