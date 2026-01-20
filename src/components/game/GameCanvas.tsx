import { useEffect, useRef } from 'react';
import { Player, Enemy } from '@/pages/Index';

interface GameCanvasProps {
  player: Player;
  enemies: Enemy[];
}

export default function GameCanvas({ player, enemies }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#0f3460';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#16213e';
    for (let i = 0; i < 800; i += 80) {
      ctx.fillRect(i, 350, 70, 20);
    }

    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 370, 800, 30);

    enemies.forEach(enemy => {
      if (enemy.type === 'mole') {
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(enemy.x, enemy.y, 30, 35);
        
        ctx.fillStyle = '#FF69B4';
        for (let i = 0; i < 3; i++) {
          ctx.fillRect(enemy.x + 8 + i * 8, enemy.y + 5, 4, 4);
        }
        
        ctx.fillStyle = '#000';
        ctx.fillRect(enemy.x + 8, enemy.y + 15, 5, 5);
        ctx.fillRect(enemy.x + 17, enemy.y + 15, 5, 5);
        
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(enemy.x - 5, enemy.y + 10, 8, 8);
        ctx.fillRect(enemy.x + 27, enemy.y + 10, 8, 8);
      } else if (enemy.type === 'rabbit') {
        ctx.fillStyle = '#D3D3D3';
        ctx.fillRect(enemy.x, enemy.y, 30, 40);
        
        ctx.fillStyle = '#FFC0CB';
        ctx.fillRect(enemy.x + 2, enemy.y - 15, 8, 20);
        ctx.fillRect(enemy.x + 20, enemy.y - 15, 8, 20);
        
        ctx.fillStyle = '#000';
        ctx.fillRect(enemy.x + 8, enemy.y + 12, 4, 4);
        ctx.fillRect(enemy.x + 18, enemy.y + 12, 4, 4);
        
        ctx.fillStyle = '#FFF';
        const toothDir = enemy.direction === 'left' ? -1 : 1;
        ctx.fillRect(enemy.x + 15 + toothDir * 5, enemy.y + 22, 6, 15);
        ctx.fillRect(enemy.x + 15 + toothDir * 12, enemy.y + 22, 6, 15);
      } else if (enemy.type === 'boss') {
        ctx.fillStyle = '#2F4F4F';
        ctx.fillRect(enemy.x, enemy.y - 20, 40, 80);
        
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(enemy.x + 10, enemy.y - 35, 20, 20);
        
        ctx.fillStyle = '#FF1493';
        for (let i = 0; i < 8; i++) {
          const px = enemy.x + 5 + (i % 4) * 10;
          const py = enemy.y - 30 + Math.floor(i / 4) * 10;
          ctx.fillRect(px, py, 5, 5);
        }
        
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(enemy.x + 12, enemy.y - 25, 6, 6);
        ctx.fillRect(enemy.x + 22, enemy.y - 25, 6, 6);
        
        ctx.fillStyle = '#8B0000';
        ctx.fillRect(enemy.x + 8, enemy.y, 24, 6);
        
        if (enemy.health > 0) {
          ctx.fillStyle = '#FF0000';
          ctx.fillRect(enemy.x, enemy.y - 45, 40, 4);
          ctx.fillStyle = '#00FF00';
          ctx.fillRect(enemy.x, enemy.y - 45, (enemy.health / 200) * 40, 4);
        }
      }
    });

    ctx.fillStyle = '#FF6347';
    ctx.fillRect(player.x, player.y, 35, 45);
    
    ctx.fillStyle = '#FFE4B5';
    ctx.fillRect(player.x + 8, player.y, 19, 20);
    
    ctx.fillStyle = '#000';
    ctx.fillRect(player.x + 10, player.y + 8, 5, 5);
    ctx.fillRect(player.x + 20, player.y + 8, 5, 5);
    
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(player.x + 12, player.y + 15, 11, 3);

    if (player.isAttacking) {
      const axeX = player.direction === 'right' ? player.x + 35 : player.x - 25;
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(axeX, player.y + 15, 25, 6);
      ctx.fillStyle = '#C0C0C0';
      const bladeX = player.direction === 'right' ? axeX + 20 : axeX;
      ctx.fillRect(bladeX, player.y + 5, 15, 20);
    }

  }, [player, enemies]);

  return (
    <div className="border-8 border-[#e94560] rounded-lg overflow-hidden shadow-2xl">
      <canvas
        ref={canvasRef}
        width={800}
        height={400}
        className="block bg-[#0f3460]"
      />
    </div>
  );
}
