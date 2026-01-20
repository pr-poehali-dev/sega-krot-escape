import { useEffect, useRef } from 'react';

interface NotificationSoundProps {
  play: boolean;
  onEnded: () => void;
}

export default function NotificationSound({ play, onEnded }: NotificationSoundProps) {
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (play) {
      playNotificationSound();
    }
  }, [play]);

  const playNotificationSound = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.5);

    oscillator.onended = () => {
      onEnded();
    };
  };

  return null;
}
