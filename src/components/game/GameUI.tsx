import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { GameState } from '@/pages/Index';

interface GameUIProps {
  health: number;
  score: number;
  level: number;
  gameState: GameState;
  onPause: () => void;
  onResume: () => void;
}

export default function GameUI({
  health,
  score,
  level,
  gameState,
  onPause,
  onResume,
}: GameUIProps) {
  return (
    <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-10">
      <div className="space-y-2">
        <div className="bg-[#1a1a2e] border-4 border-[#e94560] rounded-lg p-3 pixel-text">
          <div className="text-[#f39c12] text-sm mb-1">ЗДОРОВЬЕ</div>
          <div className="w-48 h-6 bg-[#0f3460] border-2 border-white rounded">
            <div
              className="h-full bg-gradient-to-r from-[#00ff00] to-[#ff0000] transition-all duration-300 rounded"
              style={{ width: `${health}%` }}
            />
          </div>
          <div className="text-white text-xs mt-1">{Math.round(health)} / 100</div>
        </div>

        <div className="bg-[#1a1a2e] border-4 border-[#f39c12] rounded-lg p-3 pixel-text">
          <div className="text-[#0ea5e9] text-sm">ОЧКИ</div>
          <div className="text-white text-2xl font-bold">{score}</div>
        </div>

        <div className="bg-[#1a1a2e] border-4 border-[#ec4899] rounded-lg p-3 pixel-text">
          <div className="text-[#a855f7] text-sm">УРОВЕНЬ</div>
          <div className="text-white text-2xl font-bold">{level} / 3</div>
        </div>
      </div>

      <div>
        {gameState === 'playing' ? (
          <Button
            onClick={onPause}
            className="bg-[#e94560] hover:bg-[#f39c12] border-4 border-white pixel-text"
            size="lg"
          >
            <Icon name="Pause" className="mr-2" />
            ПАУЗА
          </Button>
        ) : (
          <Button
            onClick={onResume}
            className="bg-[#00ff00] hover:bg-[#0ea5e9] text-black border-4 border-white pixel-text"
            size="lg"
          >
            <Icon name="Play" className="mr-2" />
            ПРОДОЛЖИТЬ
          </Button>
        )}
      </div>
    </div>
  );
}
