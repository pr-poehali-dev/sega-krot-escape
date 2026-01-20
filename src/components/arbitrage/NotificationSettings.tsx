import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import Icon from '@/components/ui/icon';

interface NotificationSettingsProps {
  soundEnabled: boolean;
  minProfitForNotification: number;
  onSoundToggle: (enabled: boolean) => void;
  onMinProfitChange: (value: number) => void;
}

export default function NotificationSettings({
  soundEnabled,
  minProfitForNotification,
  onSoundToggle,
  onMinProfitChange,
}: NotificationSettingsProps) {
  return (
    <Card className="bg-[#16213e]/50 border-2 border-[#0f3460] p-6 backdrop-blur-sm">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Icon name="Bell" className="text-[#00ff00]" />
        Настройки уведомлений
      </h2>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-white text-lg">Звуковые уведомления</Label>
            <p className="text-gray-400 text-sm">
              Воспроизводить звук при обнаружении новых вилок
            </p>
          </div>
          <Switch checked={soundEnabled} onCheckedChange={onSoundToggle} />
        </div>

        <div className="space-y-3">
          <Label className="text-white text-lg">
            Минимальная прибыль для уведомления: {minProfitForNotification}%
          </Label>
          <p className="text-gray-400 text-sm">
            Уведомления будут приходить только для вилок с прибылью выше этого порога
          </p>
          <Slider
            value={[minProfitForNotification]}
            onValueChange={([value]) => onMinProfitChange(value)}
            min={1}
            max={10}
            step={0.5}
            className="mt-2"
          />
        </div>

        <div className="bg-[#0f3460] p-4 rounded-lg border border-[#f39c12]/30">
          <div className="flex items-start gap-3">
            <Icon name="Info" className="text-[#f39c12] mt-1" size={20} />
            <div>
              <p className="text-white font-semibold mb-1">Совет по настройке</p>
              <p className="text-gray-400 text-sm">
                Рекомендуем установить минимальную прибыль 3-5% для получения наиболее 
                выгодных вилок и избежания лишних уведомлений
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
