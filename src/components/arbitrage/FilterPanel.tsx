import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Bookmaker } from '@/pages/Index';

interface FilterPanelProps {
  bookmakers: Bookmaker[];
  filters: {
    minProfit: number;
    maxProfit: number;
    eventType: 'all' | 'live' | 'prematch';
    sports: string[];
  };
  onToggleBookmaker: (id: string) => void;
  onFiltersChange: (filters: any) => void;
}

export default function FilterPanel({
  bookmakers,
  filters,
  onToggleBookmaker,
  onFiltersChange,
}: FilterPanelProps) {
  const sports = ['Футбол', 'Теннис', 'Баскетбол', 'Хоккей', 'Волейбол'];

  const toggleSport = (sport: string) => {
    const newSports = filters.sports.includes(sport)
      ? filters.sports.filter(s => s !== sport)
      : [...filters.sports, sport];
    onFiltersChange({ ...filters, sports: newSports });
  };

  return (
    <Card className="bg-[#16213e]/50 border-2 border-[#0f3460] p-6 backdrop-blur-sm">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Icon name="Filter" className="text-[#00ff00]" />
        Фильтры
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <div>
            <Label className="text-white mb-3 block text-lg">Букмекеры</Label>
            <div className="flex flex-wrap gap-2">
              {bookmakers.map(bk => (
                <Badge
                  key={bk.id}
                  onClick={() => onToggleBookmaker(bk.id)}
                  className={`cursor-pointer text-sm px-4 py-2 transition-all ${
                    bk.enabled
                      ? 'bg-[#00ff00] text-black hover:bg-[#00cc00]'
                      : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                  }`}
                >
                  {bk.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="text-white mb-3 block text-lg">
              Процент прибыли: {filters.minProfit}% - {filters.maxProfit}%
            </Label>
            <div className="space-y-4">
              <div>
                <Label className="text-gray-400 text-sm">Минимум: {filters.minProfit}%</Label>
                <Slider
                  value={[filters.minProfit]}
                  onValueChange={([value]) =>
                    onFiltersChange({ ...filters, minProfit: value })
                  }
                  min={0}
                  max={20}
                  step={0.5}
                  className="mt-2"
                />
              </div>
              <div>
                <Label className="text-gray-400 text-sm">Максимум: {filters.maxProfit}%</Label>
                <Slider
                  value={[filters.maxProfit]}
                  onValueChange={([value]) =>
                    onFiltersChange({ ...filters, maxProfit: value })
                  }
                  min={0}
                  max={20}
                  step={0.5}
                  className="mt-2"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="text-white mb-3 block text-lg">Тип события</Label>
            <div className="flex gap-2">
              <Button
                onClick={() => onFiltersChange({ ...filters, eventType: 'all' })}
                variant={filters.eventType === 'all' ? 'default' : 'outline'}
                className={
                  filters.eventType === 'all'
                    ? 'bg-[#00ff00] text-black hover:bg-[#00cc00]'
                    : ''
                }
              >
                Все
              </Button>
              <Button
                onClick={() => onFiltersChange({ ...filters, eventType: 'live' })}
                variant={filters.eventType === 'live' ? 'default' : 'outline'}
                className={
                  filters.eventType === 'live'
                    ? 'bg-red-600 hover:bg-red-700'
                    : ''
                }
              >
                <Icon name="Radio" className="mr-1" size={16} />
                Live
              </Button>
              <Button
                onClick={() => onFiltersChange({ ...filters, eventType: 'prematch' })}
                variant={filters.eventType === 'prematch' ? 'default' : 'outline'}
                className={
                  filters.eventType === 'prematch'
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : ''
                }
              >
                <Icon name="Calendar" className="mr-1" size={16} />
                Prematch
              </Button>
            </div>
          </div>

          <div>
            <Label className="text-white mb-3 block text-lg">Виды спорта</Label>
            <div className="flex flex-wrap gap-2">
              {sports.map(sport => (
                <Badge
                  key={sport}
                  onClick={() => toggleSport(sport)}
                  className={`cursor-pointer text-sm px-3 py-2 transition-all ${
                    filters.sports.includes(sport) || filters.sports.length === 0
                      ? 'bg-[#f39c12] text-black hover:bg-[#d68910]'
                      : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                  }`}
                >
                  {sport}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
