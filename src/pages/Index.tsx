import { useState, useEffect, useCallback } from 'react';
import ArbitrageScanner from '../components/arbitrage/ArbitrageScanner';
import FilterPanel from '../components/arbitrage/FilterPanel';
import ArbitrageTable from '../components/arbitrage/ArbitrageTable';
import StatsPanel from '../components/arbitrage/StatsPanel';
import HistoryPanel from '../components/arbitrage/HistoryPanel';
import NotificationSettings from '../components/arbitrage/NotificationSettings';
import NotificationSound from '../components/arbitrage/NotificationSound';
import { fetchArbitrageOpportunities } from '../lib/api';

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
  const [history, setHistory] = useState<ArbitrageOpportunity[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [minProfitForNotification, setMinProfitForNotification] = useState(3);
  const [playSound, setPlaySound] = useState(false);

  const fetchOpportunities = useCallback(async () => {
    const data = await fetchArbitrageOpportunities();
    if (data.length > 0) {
      const enabledBookmakerNames = bookmakers.filter(b => b.enabled).map(b => b.name);
      
      const filtered = data.filter((opp: ArbitrageOpportunity) => {
        const hasEnabledBookmakers = opp.bets.every(bet => 
          enabledBookmakerNames.includes(bet.bookmaker)
        );
        const meetsProfit = opp.profit >= filters.minProfit && opp.profit <= filters.maxProfit;
        const meetsType = filters.eventType === 'all' || opp.type === filters.eventType;
        return hasEnabledBookmakers && meetsProfit && meetsType;
      });

      const newOpps = filtered.map((opp: any) => ({
        ...opp,
        timestamp: new Date(opp.timestamp)
      }));

      if (newOpps.length > 0) {
        setOpportunities(prev => [...newOpps, ...prev].slice(0, 50));
        setHistory(prev => [...newOpps, ...prev]);

        const hasHighProfit = newOpps.some((opp: ArbitrageOpportunity) => 
          opp.profit >= minProfitForNotification
        );
        if (soundEnabled && hasHighProfit) {
          setPlaySound(true);
        }
      }
    }
  }, [bookmakers, filters, soundEnabled, minProfitForNotification]);

  useEffect(() => {
    if (isScanning) {
      fetchOpportunities();
      const interval = setInterval(fetchOpportunities, 3000);
      return () => clearInterval(interval);
    }
  }, [isScanning, fetchOpportunities]);



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

        <NotificationSettings
          soundEnabled={soundEnabled}
          minProfitForNotification={minProfitForNotification}
          onSoundToggle={setSoundEnabled}
          onMinProfitChange={setMinProfitForNotification}
        />

        <HistoryPanel history={history} onClear={() => setHistory([])} />

        <ArbitrageTable opportunities={filteredOpportunities} />

        <NotificationSound play={playSound} onEnded={() => setPlaySound(false)} />
      </div>
    </div>
  );
}