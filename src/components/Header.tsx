import React, { useState, useEffect } from 'react';
import { 
  Droplet, 
  Activity, 
  FileText, 
  AlertTriangle, 
  Clock, 
  Bell, 
  Plus, 
  ShieldCheck,
  Calendar,
  Sparkles,
  Menu
} from 'lucide-react';
import { User, Resident } from '../types';
import { can } from '../services/auth';

interface HeaderProps {
  activeTab: string;
  currentUser: User;
  residents: Resident[];
  onOpenFluidModal: () => void;
  onOpenVitalsModal: () => void;
  onOpenCareNoteModal: () => void;
  onOpenIncidentModal: () => void;
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  currentUser,
  residents,
  onOpenFluidModal,
  onOpenVitalsModal,
  onOpenCareNoteModal,
  onOpenIncidentModal,
  onMenuClick
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard': return { title: 'Shift overview', desc: 'Resident priorities, medication records and care activity.' };
      case 'residents': return { title: 'Residents', desc: 'Resident profiles, care plans and important contacts.' };
      case 'mar': return { title: 'Medication records', desc: 'Scheduled doses, administration records and checks.' };
      case 'logs': return { title: 'Daily care notes', desc: 'A timeline of personal care, nutrition, mobility and mood.' };
      case 'incidents': return { title: 'Incidents & safety', desc: 'Record and follow up incidents and safeguarding concerns.' };
      case 'roster': return { title: 'Staff rota', desc: 'Shift assignments, wing cover and attendance.' };
      default: return { title: 'Aero Care Home CRM', desc: 'Digital care management suite.' };
    }
  };

  const { title, desc } = getTabTitle();

  const canVitals = can(currentUser, 'recordVitals');
  const canNote = can(currentUser, 'writeCareLog');
  const canIncident = can(currentUser, 'reportIncident');
  const lockedClass = 'opacity-40 cursor-not-allowed';

  return (
    <header className="z-10 flex shrink-0 flex-col justify-between gap-3 border-b border-slate-200 bg-white/95 px-4 py-3.5 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button onClick={onMenuClick} className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 lg:hidden" aria-label="Open navigation"><Menu size={19} /></button>
        <div className="min-w-0">
          <h1 className="truncate text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">{title}</h1>
          <p className="mt-0.5 hidden text-xs text-slate-500 sm:block">{desc}</p>
        </div>
      </div>

      {/* Right side status & action buttons */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Live Clock & Shift Badge */}
        <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs">
          <Clock size={15} className="text-emerald-700" />
          <div>
            <div className="font-bold text-slate-800">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
            <div className="text-[10px] text-gray-500 font-medium">
              {currentTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
            </div>
          </div>
          <div className="h-6 w-px bg-slate-200" />
          <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800 ring-1 ring-slate-200">
            {currentUser.shift.split(' ')[0]}
          </span>
        </div>

        {/* Rapid Entry Action Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenFluidModal}
            className="px-2.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors border border-blue-200/70 active:scale-95"
            title="Log Fluid Intake"
          >
            <Droplet size={14} />
            <span className="hidden sm:inline">Fluid</span>
          </button>

          <button
            onClick={onOpenVitalsModal}
            disabled={!canVitals}
            className={`px-2.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors border border-emerald-200/70 active:scale-95 ${!canVitals ? lockedClass : ''}`}
            title={canVitals ? 'Record Vitals' : 'Requires Record Vitals permission'}
          >
            <Activity size={14} />
            <span className="hidden sm:inline">Vitals</span>
          </button>

          <button
            onClick={onOpenCareNoteModal}
            disabled={!canNote}
            className={`px-2.5 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors border border-purple-200/70 active:scale-95 ${!canNote ? lockedClass : ''}`}
            title={canNote ? 'Add Care Note' : 'Requires Write Care Log permission'}
          >
            <FileText size={14} />
            <span className="hidden sm:inline">Note</span>
          </button>

          <button
            onClick={onOpenIncidentModal}
            disabled={!canIncident}
            className={`px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs active:scale-95 ${!canIncident ? lockedClass : ''}`}
            title={canIncident ? 'Report Incident / Fall' : 'Requires Report Incident permission'}
          >
            <AlertTriangle size={14} />
            <span className="hidden sm:inline">Report Incident</span>
          </button>
        </div>
      </div>
    </header>
  );
};
