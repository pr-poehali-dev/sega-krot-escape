import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface StartScreenProps {
  onStart: () => void;
}

export default function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] bg-gradient-to-br from-[#16213e] to-[#0f3460] border-8 border-[#e94560] rounded-lg p-12 pixel-borders shadow-2xl">
      <div className="text-center space-y-8 animate-fade-in">
        <h1 className="text-7xl font-bold text-[#f39c12] pixel-text tracking-wider drop-shadow-[0_4px_8px_rgba(233,69,96,0.6)]">
          ПОБЕГ ОТ КРОТОВ
        </h1>
        
        <div className="text-2xl text-white space-y-3 pixel-text">
          <p className="text-[#0ea5e9]">🦸 Главный герой с топором</p>
          <p className="text-[#ec4899]">🐹 Прыщавые кроты атакуют!</p>
          <p className="text-[#a855f7]">🐰 Зайцы с длинными зубами</p>
          <p className="text-[#ef4444]">👹 БОСС ЕГОР ждёт!</p>
        </div>

        <div className="bg-[#1a1a2e] p-6 rounded-lg border-4 border-[#e94560] space-y-2">
          <h3 className="text-xl font-bold text-[#f39c12] pixel-text mb-4">УПРАВЛЕНИЕ</h3>
          <div className="text-white space-y-2 text-lg pixel-text">
            <p><span className="text-[#0ea5e9]">← →</span> / <span className="text-[#0ea5e9]">A D</span> - Движение</p>
            <p><span className="text-[#ec4899]">↑</span> / <span className="text-[#ec4899]">W</span> - Прыжок</p>
            <p><span className="text-[#f39c12]">ПРОБЕЛ</span> - Атака топором</p>
          </div>
        </div>

        <Button
          onClick={onStart}
          size="lg"
          className="text-3xl px-12 py-8 bg-[#e94560] hover:bg-[#f39c12] text-white font-bold pixel-text border-4 border-white shadow-lg hover:scale-110 transition-transform duration-200"
        >
          <Icon name="Play" className="mr-3" size={32} />
          НАЧАТЬ ИГРУ
        </Button>

        <p className="text-sm text-gray-400 pixel-text">16-BIT SEGA MEGA DRIVE STYLE</p>
      </div>
    </div>
  );
}
