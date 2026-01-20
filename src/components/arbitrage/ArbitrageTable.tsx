import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { ArbitrageOpportunity } from '@/pages/Index';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface ArbitrageTableProps {
  opportunities: ArbitrageOpportunity[];
}

export default function ArbitrageTable({ opportunities }: ArbitrageTableProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Card className="bg-[#16213e]/50 border-2 border-[#0f3460] backdrop-blur-sm overflow-hidden">
      <div className="p-6 border-b border-[#0f3460]">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Icon name="Search" className="text-[#00ff00]" />
          Найденные вилки ({opportunities.length})
        </h2>
      </div>

      <div className="overflow-x-auto">
        {opportunities.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <Icon name="SearchX" className="mx-auto mb-4 text-gray-600" size={64} />
            <p className="text-xl">Вилки не найдены</p>
            <p className="text-sm mt-2">Запустите сканирование или измените фильтры</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-[#0f3460] hover:bg-transparent">
                <TableHead className="text-gray-300">Время</TableHead>
                <TableHead className="text-gray-300">Тип</TableHead>
                <TableHead className="text-gray-300">Спорт / Лига</TableHead>
                <TableHead className="text-gray-300">Событие</TableHead>
                <TableHead className="text-gray-300">Прибыль</TableHead>
                <TableHead className="text-gray-300">Ставка 1</TableHead>
                <TableHead className="text-gray-300">Ставка 2</TableHead>
                <TableHead className="text-gray-300">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {opportunities.map(opp => (
                <TableRow
                  key={opp.id}
                  className="border-[#0f3460] hover:bg-[#1a1a2e]/50 transition-colors"
                >
                  <TableCell className="text-gray-300 font-mono text-sm">
                    {formatTime(opp.timestamp)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        opp.type === 'live'
                          ? 'bg-red-600 hover:bg-red-700'
                          : 'bg-blue-600 hover:bg-blue-700'
                      }
                    >
                      {opp.type === 'live' ? (
                        <>
                          <Icon name="Radio" size={12} className="mr-1" />
                          LIVE
                        </>
                      ) : (
                        <>
                          <Icon name="Calendar" size={12} className="mr-1" />
                          Prematch
                        </>
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-white font-semibold">{opp.sport}</div>
                    <div className="text-gray-400 text-sm">{opp.league}</div>
                  </TableCell>
                  <TableCell className="text-white font-medium min-w-[200px]">
                    {opp.event}
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-[#00ff00] text-black font-bold text-base px-3 py-1">
                      +{opp.profit.toFixed(2)}%
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="bg-[#0f3460] p-3 rounded-lg border border-[#00ff00]/30 min-w-[180px]">
                      <div className="text-xs text-gray-400">{opp.bets[0].bookmaker}</div>
                      <div className="text-white font-bold text-lg mt-1">
                        {opp.bets[0].outcome} @ {opp.bets[0].odds}
                      </div>
                      <div className="text-[#f39c12] font-semibold mt-1">
                        {opp.bets[0].stake.toFixed(0)} ₽
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="bg-[#0f3460] p-3 rounded-lg border border-[#00ff00]/30 min-w-[180px]">
                      <div className="text-xs text-gray-400">{opp.bets[1].bookmaker}</div>
                      <div className="text-white font-bold text-lg mt-1">
                        {opp.bets[1].outcome} @ {opp.bets[1].odds}
                      </div>
                      <div className="text-[#f39c12] font-semibold mt-1">
                        {opp.bets[1].stake.toFixed(0)} ₽
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(opp.event)}
                      className="border-[#00ff00] text-[#00ff00] hover:bg-[#00ff00] hover:text-black"
                    >
                      <Icon name="Copy" size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </Card>
  );
}
