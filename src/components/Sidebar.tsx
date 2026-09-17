import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Pill, 
  FileText, 
  AlertTriangle, 
  CalendarDays, 
  LogOut, 
  HeartPulse,
  Settings,
  ShieldCheck
} from 'lucide-react';
import { User } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: User;
  onLogout: () => void;
  onOpenSettings?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onLogout,
  onOpenSettings
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Shift Dashboard', icon: LayoutDashboard },
    { id: 'residents', label: 'Residents Directory', icon: Users, badge: '6' },
    { id: 'mar', label: 'Digital MAR', icon: Pill, badge: 'Round Due' },
    { id: 'logs', label: 'Care Logs', icon: FileText },
    { id: 'incidents', label: 'Incidents & Safety', icon: AlertTriangle, badgeAlert: true },
    { id: 'roster', label: 'Staff Roster', icon: CalendarDays },
  ];

  return (
    <aside className="w-64 bg-[#042416] text-white flex flex-col justify-between shrink-0 select-none border-r border-white/10">
      {/* Brand Header */}
      <div>
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0a3a25] to-[#168a62] flex items-center justify-center shadow-md border border-white/20">
              <HeartPulse className="text-emerald-200 w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-wider leading-none text-white font-serif">AERO</h1>
              <p className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest mt-0.5">CARE HOME CRM</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {onOpenSettings && (
              <button
                onClick={onOpenSettings}
                className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title="System Settings"
              >
                <Settings size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all ${
                  isActive
                    ? 'bg-[#106E4E] text-white shadow-md font-bold'
                    : 'text-emerald-100/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className={isActive ? 'text-white' : 'text-emerald-300'} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-white/10 text-emerald-200'
                  }`}>
                    {item.badge}
                  </span>
                )}
                {item.badgeAlert && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer User Info */}
      <div className="p-4 border-t border-white/10 space-y-3 bg-[#021a10]">
        <div className="flex items-center gap-3">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-10 h-10 rounded-xl object-cover border border-emerald-400/40 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
            <p className="text-[10px] text-emerald-300 truncate">{currentUser.role}</p>
            <p className="text-[9px] text-emerald-100/50 mt-0.5">{currentUser.shift}</p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-emerald-200 transition-colors border border-white/5 active:scale-98"
        >
          <LogOut size={14} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
