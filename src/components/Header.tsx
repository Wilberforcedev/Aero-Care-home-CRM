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
  Sparkles
} from 'lucide-react';
import { User, Resident } from '../types';

interface HeaderProps {
  activeTab: string;
  currentUser: User;
  residents: Resident[];
  onOpenFluidModal: () => void;
  onOpenVitalsModal: () => void;
  onOpenCareNoteModal: () => void;
  onOpenIncidentModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  currentUser,
  residents,
  onOpenFluidModal,
  onOpenVitalsModal,
  onOpenCareNoteModal,
  onOpenIncidentModal
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard': return { title: 'Shift Handover & Operations', desc: 'Active resident observations, MAR drug round status, and critical alerts.' };
      case 'residents': return { title: 'Resident Care Directory', desc: 'Manage resident demographic records, clinical care plans, and emergency NOK contacts.' };
      case 'mar': return { title: 'Electronic MAR (eMAR)', desc: 'Controlled administration, dual sign-off, and round adherence tracking.' };
      case 'logs': return { title: 'Daily Care Logs & Shift Observations', desc: 'Real-time timeline of personal hygiene, nutrition, mobility, and mood notes.' };
      case 'incidents': return { title: 'Incidents & Safeguarding', desc: 'Accident logging, clinical body mapping, investigation tracking, and CQC compliance.' };
      case 'roster': return { title: 'Duty Roster & Shift Allocation', desc: 'Wing staff assignments, nurse cover, and attendance monitoring.' };
      default: return { title: 'Aero Care Home CRM', desc: 'Digital care management suite.' };
    }
  };

  const { title, desc } = getTabTitle();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0 shadow-2xs">
      <div>
        <h1 className="text-xl font-black text-gray-900 tracking-tight">{title}</h1>
        <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
      </div>

      {/* Right side status & action buttons */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Live Clock & Shift Badge */}
        <div className="bg-emerald-50/70 border border-emerald-200/80 px-3 py-1.5 rounded-2xl flex items-center gap-2.5 text-xs">
          <Clock size={15} className="text-[#106E4E]" />
          <div>
            <div className="font-black text-[#042416]">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
            <div className="text-[10px] text-gray-500 font-medium">
              {currentTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
            </div>
          </div>
          <div className="h-6 w-px bg-emerald-200" />
          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider bg-emerald-100/80 px-2 py-0.5 rounded-full">
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
            className="px-2.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors border border-emerald-200/70 active:scale-95"
            title="Record Vitals"
          >
            <Activity size={14} />
            <span className="hidden sm:inline">Vitals</span>
          </button>

          <button
            onClick={onOpenCareNoteModal}
            className="px-2.5 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors border border-purple-200/70 active:scale-95"
            title="Add Care Note"
          >
            <FileText size={14} />
            <span className="hidden sm:inline">Note</span>
          </button>

          <button
            onClick={onOpenIncidentModal}
            className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs active:scale-95"
            title="Report Incident / Fall"
          >
            <AlertTriangle size={14} />
            <span className="hidden sm:inline">Report Incident</span>
          </button>
        </div>
      </div>
    </header>
  );
};
