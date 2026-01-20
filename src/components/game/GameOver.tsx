import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface GameOverProps {
  score: number;
  onRestart: () => void;
  type: 'gameover' | 'victory';
}

export default function GameOver({ score, onRestart, type }: GameOverProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] bg-gradient-to-br from-[#16213e] to-[#0f3460] border-8 border-[#e94560] rounded-lg p-12 shadow-2xl animate-scale-in">
      <div className="text-center space-y-8">
        {type === 'victory' ? (
          <>
            <h1 className="text-8xl font-bold text-[#00ff00] pixel-text tracking-wider drop-shadow-[0_4px_12px_rgba(0,255,0,0.8)] animate-pulse">
              ПОБЕДА! 🏆
            </h1>
            <p className="text-3xl text-[#f39c12] pixel-text">
              ЕГОР ПОВЕРЖЕН!
            </p>
          </>
        ) : (
          <>
            <h1 className="text-8xl font-bold text-[#ff0000] pixel-text tracking-wider drop-shadow-[0_4px_12px_rgba(255,0,0,0.8)]">
              GAME OVER
            </h1>
            <p className="text-3xl text-white pixel-text">
              Попробуй ещё раз!
            </p>
          </>
        )}

        <div className="bg-[#1a1a2e] p-8 rounded-lg border-4 border-[#f39c12] space-y-4">
          <h3 className="text-2xl font-bold text-[#0ea5e9] pixel-text">ФИНАЛЬНЫЙ СЧЁТ</h3>
          <p className="text-6xl font-bold text-white pixel-text">{score}</p>
        </div>

        <Button
          onClick={onRestart}
          size="lg"
          className="text-3xl px-12 py-8 bg-[#e94560] hover:bg-[#f39c12] text-white font-bold pixel-text border-4 border-white shadow-lg hover:scale-110 transition-transform duration-200"
        >
          <Icon name="RotateCcw" className="mr-3" size={32} />
          ИГРАТЬ СНОВА
        </Button>
      </div>
    </div>
  );
}
