import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface ArbitrageScannerProps {
  isScanning: boolean;
  onToggle: () => void;
}

export default function ArbitrageScanner({ isScanning, onToggle }: ArbitrageScannerProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        {isScanning && (
          <div className="flex items-center gap-2 bg-green-500/20 px-4 py-2 rounded-lg border border-green-500">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="text-green-400 font-semibold">Сканирование активно</span>
          </div>
        )}
      </div>
      <Button
        onClick={onToggle}
        size="lg"
        className={`font-bold text-lg ${
          isScanning
            ? 'bg-red-600 hover:bg-red-700'
            : 'bg-green-600 hover:bg-green-700'
        }`}
      >
        <Icon name={isScanning ? 'Square' : 'Play'} className="mr-2" />
        {isScanning ? 'Остановить' : 'Запустить сканирование'}
      </Button>
    </div>
  );
}
