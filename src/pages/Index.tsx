import { useState, useEffect, useCallback } from 'react';
import GameCanvas from '../components/game/GameCanvas';
import GameUI from '../components/game/GameUI';
import StartScreen from '../components/game/StartScreen';
import GameOver from '../components/game/GameOver';

export type GameState = 'start' | 'playing' | 'paused' | 'gameover' | 'victory';

export interface Player {
  x: number;
  y: number;
  health: number;
  isAttacking: boolean;
  direction: 'left' | 'right';
  velocityY: number;
  isJumping: boolean;
}

export interface Enemy {
  id: number;
  type: 'mole' | 'rabbit' | 'boss';
  x: number;
  y: number;
  health: number;
  direction: 'left' | 'right';
  velocityX: number;
}

export default function Index() {
  const [gameState, setGameState] = useState<GameState>('start');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [player, setPlayer] = useState<Player>({
    x: 100,
    y: 300,
    health: 100,
    isAttacking: false,
    direction: 'right',
    velocityY: 0,
    isJumping: false,
  });
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [keys, setKeys] = useState<Set<string>>(new Set());

  const startGame = useCallback(() => {
    setGameState('playing');
    setScore(0);
    setLevel(1);
    setPlayer({
      x: 100,
      y: 300,
      health: 100,
      isAttacking: false,
      direction: 'right',
      velocityY: 0,
      isJumping: false,
    });
    spawnEnemies(1);
  }, []);

  const spawnEnemies = useCallback((currentLevel: number) => {
    const newEnemies: Enemy[] = [];
    
    if (currentLevel < 3) {
      const enemyCount = currentLevel * 3;
      for (let i = 0; i < enemyCount; i++) {
        newEnemies.push({
          id: Date.now() + i,
          type: Math.random() > 0.5 ? 'mole' : 'rabbit',
          x: 400 + i * 150,
          y: 300,
          health: 30,
          direction: 'left',
          velocityX: -1 - Math.random(),
        });
      }
    } else {
      newEnemies.push({
        id: Date.now(),
        type: 'boss',
        x: 600,
        y: 280,
        health: 200,
        direction: 'left',
        velocityX: -0.5,
      });
    }
    
    setEnemies(newEnemies);
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    setKeys(prev => new Set(prev).add(e.key));
    
    if (e.key === ' ' && gameState === 'playing') {
      e.preventDefault();
      setPlayer(prev => ({ ...prev, isAttacking: true }));
      setTimeout(() => {
        setPlayer(prev => ({ ...prev, isAttacking: false }));
      }, 200);
    }
  }, [gameState]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    setKeys(prev => {
      const newKeys = new Set(prev);
      newKeys.delete(e.key);
      return newKeys;
    });
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameLoop = setInterval(() => {
      setPlayer(prev => {
        let newX = prev.x;
        let newY = prev.y;
        let newVelocityY = prev.velocityY;
        let newIsJumping = prev.isJumping;
        let newDirection = prev.direction;

        if (keys.has('ArrowLeft') || keys.has('a')) {
          newX = Math.max(0, prev.x - 3);
          newDirection = 'left';
        }
        if (keys.has('ArrowRight') || keys.has('d')) {
          newX = Math.min(750, prev.x + 3);
          newDirection = 'right';
        }

        if ((keys.has('ArrowUp') || keys.has('w') || keys.has(' ')) && !prev.isJumping) {
          newVelocityY = -12;
          newIsJumping = true;
        }

        newVelocityY += 0.6;
        newY += newVelocityY;

        if (newY >= 300) {
          newY = 300;
          newVelocityY = 0;
          newIsJumping = false;
        }

        return {
          ...prev,
          x: newX,
          y: newY,
          velocityY: newVelocityY,
          isJumping: newIsJumping,
          direction: newDirection,
        };
      });

      setEnemies(prev => {
        return prev.map(enemy => {
          let newX = enemy.x + enemy.velocityX;
          let newDirection = enemy.direction;

          if (newX <= 0 || newX >= 750) {
            newDirection = newDirection === 'left' ? 'right' : 'left';
            enemy.velocityX *= -1;
            newX = Math.max(0, Math.min(750, newX));
          }

          return { ...enemy, x: newX, direction: newDirection };
        }).filter(enemy => enemy.health > 0);
      });

      if (player.isAttacking) {
        setEnemies(prev => {
          const hitEnemies = prev.map(enemy => {
            const distance = Math.abs(player.x - enemy.x);
            const verticalDistance = Math.abs(player.y - enemy.y);
            
            if (distance < 60 && verticalDistance < 50) {
              const newHealth = enemy.health - 10;
              if (newHealth <= 0) {
                setScore(s => s + (enemy.type === 'boss' ? 500 : 100));
              }
              return { ...enemy, health: newHealth };
            }
            return enemy;
          });
          return hitEnemies;
        });
      }

      setEnemies(prev => {
        prev.forEach(enemy => {
          const distance = Math.abs(player.x - enemy.x);
          const verticalDistance = Math.abs(player.y - enemy.y);
          
          if (distance < 40 && verticalDistance < 40 && !player.isAttacking) {
            setPlayer(p => {
              const newHealth = Math.max(0, p.health - 0.5);
              if (newHealth <= 0) {
                setGameState('gameover');
              }
              return { ...p, health: newHealth };
            });
          }
        });
        return prev;
      });

      if (enemies.length === 0 && gameState === 'playing') {
        if (level >= 3) {
          setGameState('victory');
        } else {
          const newLevel = level + 1;
          setLevel(newLevel);
          setScore(s => s + 500);
          spawnEnemies(newLevel);
        }
      }
    }, 1000 / 60);

    return () => clearInterval(gameLoop);
  }, [gameState, keys, player.isAttacking, player.x, player.y, enemies.length, level, spawnEnemies]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0f1e] to-[#1a1a2e] flex items-center justify-center p-4">
      <div className="relative">
        {gameState === 'start' && <StartScreen onStart={startGame} />}
        {gameState === 'gameover' && (
          <GameOver score={score} onRestart={startGame} type="gameover" />
        )}
        {gameState === 'victory' && (
          <GameOver score={score} onRestart={startGame} type="victory" />
        )}
        {(gameState === 'playing' || gameState === 'paused') && (
          <>
            <GameUI
              health={player.health}
              score={score}
              level={level}
              gameState={gameState}
              onPause={() => setGameState('paused')}
              onResume={() => setGameState('playing')}
            />
            <GameCanvas player={player} enemies={enemies} />
          </>
        )}
      </div>
    </div>
  );
}