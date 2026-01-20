import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { ArbitrageOpportunity } from '@/pages/Index';
import * as XLSX from 'xlsx';

interface HistoryPanelProps {
  history: ArbitrageOpportunity[];
  onClear: () => void;
}

export default function HistoryPanel({ history, onClear }: HistoryPanelProps) {
  const exportToExcel = () => {
    const data = history.map(opp => ({
      'Время': new Date(opp.timestamp).toLocaleString('ru-RU'),
      'Тип': opp.type === 'live' ? 'LIVE' : 'Prematch',
      'Спорт': opp.sport,
      'Лига': opp.league,
      'Событие': opp.event,
      'Прибыль %': opp.profit.toFixed(2),
      'БК 1': opp.bets[0].bookmaker,
      'Исход 1': opp.bets[0].outcome,
      'Коэф 1': opp.bets[0].odds,
      'Ставка 1': opp.bets[0].stake.toFixed(2),
      'БК 2': opp.bets[1].bookmaker,
      'Исход 2': opp.bets[1].outcome,
      'Коэф 2': opp.bets[1].odds,
      'Ставка 2': opp.bets[1].stake.toFixed(2),
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Вилки');

    const colWidths = [
      { wch: 20 }, // Время
      { wch: 10 }, // Тип
      { wch: 12 }, // Спорт
      { wch: 20 }, // Лига
      { wch: 30 }, // Событие
      { wch: 10 }, // Прибыль
      { wch: 15 }, // БК 1
      { wch: 10 }, // Исход 1
      { wch: 8 },  // Коэф 1
      { wch: 12 }, // Ставка 1
      { wch: 15 }, // БК 2
      { wch: 10 }, // Исход 2
      { wch: 8 },  // Коэф 2
      { wch: 12 }, // Ставка 2
    ];
    ws['!cols'] = colWidths;

    const fileName = `arbitrage_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  const totalProfit = history.reduce((sum, opp) => {
    const bet1Return = opp.bets[0].stake * opp.bets[0].odds;
    const bet2Return = opp.bets[1].stake * opp.bets[1].odds;
    const totalStake = opp.bets[0].stake + opp.bets[1].stake;
    const profit = Math.max(bet1Return, bet2Return) - totalStake;
    return sum + profit;
  }, 0);

  return (
    <Card className="bg-[#16213e]/50 border-2 border-[#0f3460] p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Icon name="History" className="text-[#00ff00]" />
            История вилок
          </h2>
          <p className="text-gray-400 mt-1">
            Всего найдено: {history.length} | Потенциальная прибыль: {totalProfit.toFixed(2)} ₽
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={exportToExcel}
            disabled={history.length === 0}
            className="bg-[#00ff00] text-black hover:bg-[#00cc00] font-bold"
          >
            <Icon name="Download" className="mr-2" />
            Экспорт в Excel
          </Button>
          <Button
            onClick={onClear}
            disabled={history.length === 0}
            variant="outline"
            className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
          >
            <Icon name="Trash2" className="mr-2" />
            Очистить
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#0f3460] p-4 rounded-lg border border-[#00ff00]/30">
          <div className="text-gray-400 text-sm mb-1">Live вилки</div>
          <div className="text-3xl font-bold text-red-500">
            {history.filter(h => h.type === 'live').length}
          </div>
        </div>
        <div className="bg-[#0f3460] p-4 rounded-lg border border-[#00ff00]/30">
          <div className="text-gray-400 text-sm mb-1">Prematch вилки</div>
          <div className="text-3xl font-bold text-blue-500">
            {history.filter(h => h.type === 'prematch').length}
          </div>
        </div>
        <div className="bg-[#0f3460] p-4 rounded-lg border border-[#00ff00]/30">
          <div className="text-gray-400 text-sm mb-1">Средняя прибыль</div>
          <div className="text-3xl font-bold text-[#f39c12]">
            {history.length > 0
              ? (history.reduce((sum, h) => sum + h.profit, 0) / history.length).toFixed(2)
              : '0.00'}
            %
          </div>
        </div>
      </div>
    </Card>
  );
}
