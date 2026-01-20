import { useState, useEffect } from 'react';
import ArbitrageScanner from '../components/arbitrage/ArbitrageScanner';
import FilterPanel from '../components/arbitrage/FilterPanel';
import ArbitrageTable from '../components/arbitrage/ArbitrageTable';
import StatsPanel from '../components/arbitrage/StatsPanel';

export interface Bookmaker {
  id: string;
  name: string;
  enabled: boolean;
}

export interface ArbitrageOpportunity {
  id: string;
  sport: string;
  league: string;
  event: string;
  type: 'live' | 'prematch';
  profit: number;
  timestamp: Date;
  bets: {
    bookmaker: string;
    outcome: string;
    odds: number;
    stake: number;
  }[];
}

export default function Index() {
  const [bookmakers, setBookmakers] = useState<Bookmaker[]>([
    { id: 'bet365', name: 'Bet365', enabled: true },
    { id: 'fonbet', name: 'Фонбет', enabled: true },
    { id: 'winline', name: 'Winline', enabled: true },
    { id: '1xbet', name: '1xBet', enabled: true },
    { id: 'marathon', name: 'Marathon', enabled: true },
    { id: 'baltbet', name: 'BaltBet', enabled: true },
    { id: 'liga', name: 'Лига Ставок', enabled: true },
    { id: 'parimatch', name: 'Parimatch', enabled: true },
  ]);

  const [filters, setFilters] = useState({
    minProfit: 2,
    maxProfit: 20,
    eventType: 'all' as 'all' | 'live' | 'prematch',
    sports: [] as string[],
  });

  const [opportunities, setOpportunities] = useState<ArbitrageOpportunity[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    if (isScanning) {
      const interval = setInterval(() => {
        generateMockOpportunities();
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isScanning, filters, bookmakers]);

  const generateMockOpportunities = () => {
    const sports = ['Футбол', 'Теннис', 'Баскетбол', 'Хоккей', 'Волейбол'];
    const leagues = ['Премьер-лига', 'Лига чемпионов', 'ATP', 'NBA', 'КХЛ'];
    const teams = [
      ['Спартак', 'Зенит'],
      ['Реал', 'Барселона'],
      ['Федерер', 'Надаль'],
      ['Лейкерс', 'Селтикс'],
      ['ЦСКА', 'СКА'],
    ];

    const enabledBookmakers = bookmakers.filter(b => b.enabled);
    if (enabledBookmakers.length < 2) return;

    const newOpportunities: ArbitrageOpportunity[] = [];

    for (let i = 0; i < Math.floor(Math.random() * 3) + 1; i++) {
      const sportIndex = Math.floor(Math.random() * sports.length);
      const profit = parseFloat((Math.random() * (filters.maxProfit - filters.minProfit) + filters.minProfit).toFixed(2));
      const type = Math.random() > 0.6 ? 'live' : 'prematch';

      if (filters.eventType !== 'all' && filters.eventType !== type) continue;

      const bk1 = enabledBookmakers[Math.floor(Math.random() * enabledBookmakers.length)];
      let bk2 = enabledBookmakers[Math.floor(Math.random() * enabledBookmakers.length)];
      while (bk2.id === bk1.id && enabledBookmakers.length > 1) {
        bk2 = enabledBookmakers[Math.floor(Math.random() * enabledBookmakers.length)];
      }

      const odds1 = parseFloat((1.5 + Math.random() * 2).toFixed(2));
      const odds2 = parseFloat((1.5 + Math.random() * 2).toFixed(2));

      const totalStake = 10000;
      const stake1 = parseFloat((totalStake / (1 + odds1 / odds2)).toFixed(2));
      const stake2 = parseFloat((totalStake - stake1).toFixed(2));

      newOpportunities.push({
        id: `arb-${Date.now()}-${i}`,
        sport: sports[sportIndex],
        league: leagues[sportIndex],
        event: `${teams[sportIndex][0]} - ${teams[sportIndex][1]}`,
        type,
        profit,
        timestamp: new Date(),
        bets: [
          {
            bookmaker: bk1.name,
            outcome: 'П1',
            odds: odds1,
            stake: stake1,
          },
          {
            bookmaker: bk2.name,
            outcome: 'П2',
            odds: odds2,
            stake: stake2,
          },
        ],
      });
    }

    setOpportunities(prev => [...newOpportunities, ...prev].slice(0, 50));
  };

  const toggleBookmaker = (id: string) => {
    setBookmakers(prev =>
      prev.map(bk => (bk.id === id ? { ...bk, enabled: !bk.enabled } : bk))
    );
  };

  const filteredOpportunities = opportunities.filter(opp => {
    if (filters.eventType !== 'all' && opp.type !== filters.eventType) return false;
    if (filters.sports.length > 0 && !filters.sports.includes(opp.sport)) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#16213e] text-white">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#00ff00] to-[#f39c12] bg-clip-text text-transparent">
              ArbitrageScanner Pro
            </h1>
            <p className="text-gray-400 mt-1">Сканер вилок в букмекерских конторах</p>
          </div>
          <ArbitrageScanner isScanning={isScanning} onToggle={() => setIsScanning(!isScanning)} />
        </div>

        <StatsPanel
          totalOpportunities={filteredOpportunities.length}
          avgProfit={
            filteredOpportunities.length > 0
              ? filteredOpportunities.reduce((sum, opp) => sum + opp.profit, 0) /
                filteredOpportunities.length
              : 0
          }
          liveCount={filteredOpportunities.filter(o => o.type === 'live').length}
          prematchCount={filteredOpportunities.filter(o => o.type === 'prematch').length}
        />

        <FilterPanel
          bookmakers={bookmakers}
          filters={filters}
          onToggleBookmaker={toggleBookmaker}
          onFiltersChange={setFilters}
        />

        <ArbitrageTable opportunities={filteredOpportunities} />
      </div>
    </div>
  );
}
