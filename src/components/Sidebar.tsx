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
  ShieldCheck,
  X
} from 'lucide-react';
import { User } from '../types';
import { can } from '../services/auth';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: User;
  onLogout: () => void;
  onOpenSettings?: () => void;
  mobileOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onLogout,
  onOpenSettings,
  mobileOpen,
  onClose
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Shift overview', icon: LayoutDashboard },
    { id: 'residents', label: 'Residents', icon: Users },
    { id: 'mar', label: 'Medication records', icon: Pill },
    { id: 'logs', label: 'Daily care notes', icon: FileText },
    { id: 'incidents', label: 'Incidents & safety', icon: AlertTriangle },
    { id: 'roster', label: 'Staff rota', icon: CalendarDays },
  ];

  return (
    <>
      {mobileOpen && <button aria-label="Close navigation" onClick={onClose} className="fixed inset-0 z-40 bg-slate-950/35 backdrop-blur-[2px] lg:hidden" />}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-[278px] shrink-0 select-none flex-col justify-between border-r border-slate-200 bg-white text-slate-800 shadow-xl transition-transform duration-200 lg:static lg:z-auto lg:translate-x-0 lg:shadow-none ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div>
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-[19px]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-800 text-white shadow-sm shadow-emerald-900/20">
              <HeartPulse className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-[15px] font-extrabold leading-tight tracking-tight text-slate-900">Aero Care</h1>
              <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[.17em] text-emerald-700">Resident services</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {onOpenSettings && can(currentUser, 'manageSettings') && <button onClick={onOpenSettings} className="rounded-xl p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-emerald-800" title="System settings" aria-label="System settings"><Settings size={17} /></button>}
            <button onClick={onClose} className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 lg:hidden" aria-label="Close navigation"><X size={18} /></button>
          </div>
        </div>

        <nav aria-label="Main navigation" className="px-3 py-6">
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[.16em] text-slate-400">Care workspace</p>
          <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); onClose(); }}
                aria-current={isActive ? 'page' : undefined}
                className={`group flex w-full items-center gap-3.5 rounded-xl px-3.5 py-3 text-left text-[13px] transition-all ${
                  isActive
                    ? 'bg-emerald-50 font-bold text-emerald-900 ring-1 ring-inset ring-emerald-100'
                    : 'font-medium text-slate-600 hover:bg-slate-50 hover:text-emerald-900'
                }`}
              >
                <Icon size={18} strokeWidth={isActive ? 2.3 : 1.8} className={isActive ? 'text-emerald-800' : 'text-slate-400 group-hover:text-emerald-700'} />
                <span>{item.label}</span>
              </button>
            );
          })}
          </div>
        </nav>
      </div>

      <div className="space-y-3 border-t border-slate-100 p-4">
        <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
          <img src={currentUser.avatar} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-white" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold text-slate-900">{currentUser.name}</p>
            <p className="mt-0.5 truncate text-[10px] text-slate-500">{currentUser.role}</p>
            <p className="mt-1 truncate text-[9px] font-semibold text-emerald-800">{currentUser.shift}</p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-600 transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
        >
          <LogOut size={14} />
          <span>Sign Out</span>
        </button>
      </div>
      </aside>
    </>
  );
};
