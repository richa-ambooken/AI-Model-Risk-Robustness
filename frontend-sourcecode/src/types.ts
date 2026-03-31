export type View = 'login' | 'dashboard' | 'simulation' | 'metrics';

export interface NavItem {
  id: View;
  label: string;
  icon: string;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { id: 'simulation', label: 'Simulation', icon: 'Activity' },
  { id: 'metrics', label: 'Metrics', icon: 'BarChart3' },
];
