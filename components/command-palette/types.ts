import { LucideIcon } from 'lucide-react';

export type CommandType = 'NAV' | 'ACTION' | 'PRODUCT' | 'CUSTOMER';

export interface SearchResult {
  id: string;
  type: CommandType;
  section: string;
  label: string;
  sub?: string;
  icon: LucideIcon;
  action?: () => void; // Optional custom action callback
}

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (id: string) => void;
}