export interface LunchOption {
  id: string;
  name: string;
  emoji: string;
  color: string;
  enabled: boolean;
}

export interface PresetMenu {
  id: string;
  title: string;
  icon: string;
  options: Array<{ name: string; emoji: string; color: string }>;
}
