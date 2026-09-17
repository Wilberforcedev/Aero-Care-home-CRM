import React from 'react';
import { 
  Users, 
  Pill, 
  AlertTriangle, 
  Droplet, 
  Activity, 
  HeartPulse, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { Resident, Medication, CareLog, Incident, User } from '../types';

interface DashboardViewProps {
  residents: Resident[];
  medications: Medication[];
  careLogs: CareLog[];
  incidents: Incident[];
  currentUser: User;
  onSelectResident: (resident: Resident) => void;
  onNavigateTab: (tab: string) => void;
  onOpenFluidModal: (resident: Resident) => void;
  onOpenVitalsModal: (resident: Resident) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  residents,
  medications,
  careLogs,
  incidents,
  currentUser,
  onSelectResident,
  onNavigateTab,
  onOpenFluidModal,
  onOpenVitalsModal
}) => {
  const highRiskResidents = residents.filter(r => r.riskLevel === 'Critical' || r.riskLevel === 'High');
  const medsDue = medications.filter(m => m.status === 'Due');
  const lowFluidResidents = residents.filter(r => (r.todayFluidIntakeMl / r.fluidTargetMl) < 0.5);

  return (
    <div className="space-y-6">
      {/* Morning Shift Handover Summary Banner */}
      <div className="bg-gradient-to-r from-[#042416] via-[#083a24] to-[#106e4e] text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-emerald-400/20 text-emerald-200 border border-emerald-400/30 text-[10px] font-black uppercase tracking-wider rounded-full">
                Active Morning Shift Handover
              </span>
              <span className="text-xs text-emerald-100/70">
                Staff on duty: {currentUser.name} ({currentUser.role})
              </span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white">
              Good morning, {currentUser.name.split(' ')[0]}
            </h2>
            <p className="text-xs text-emerald-100/80 max-w-2xl leading-relaxed">
              All 6 residents accounted for. James Wilson is under 24-hr post-fall observation in Room 102. 
              Margaret Bennett (Room 301) requires continuous comfort checks and 2-hourly repositioning.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onNavigateTab('mar')}
              className="px-4 py-2.5 bg-white text-[#042416] hover:bg-emerald-50 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-1.5"
            >
              <Pill size={15} />
              <span>Start 08:00 MAR Round ({medsDue.length} due)</span>
            </button>
            <button
              onClick={() => onNavigateTab('residents')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all border border-white/20 active:scale-95 flex items-center gap-1.5"
            >
              <Users size={15} />
              <span>Resident Profiles</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => onNavigateTab('residents')}
          className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs hover:border-emerald-500 cursor-pointer transition-all space-y-1"
        >
          <div className="flex justify-between items-center text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Total Residents</span>
            <Users size={18} className="text-[#106E4E]" />
          </div>
          <p className="text-3xl font-black text-gray-900">{residents.length}</p>
          <p className="text-[11px] text-emerald-800 font-semibold">All facility beds occupied</p>
        </div>

        <div 
          onClick={() => onNavigateTab('residents')}
          className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs hover:border-amber-500 cursor-pointer transition-all space-y-1"
        >
          <div className="flex justify-between items-center text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">High / Critical Risk</span>
            <AlertTriangle size={18} className="text-amber-500" />
          </div>
          <p className="text-3xl font-black text-amber-600">{highRiskResidents.length}</p>
          <p className="text-[11px] text-amber-800 font-semibold">Strict transfer & hoist protocols</p>
        </div>

        <div 
          onClick={() => onNavigateTab('mar')}
          className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs hover:border-blue-500 cursor-pointer transition-all space-y-1"
        >
          <div className="flex justify-between items-center text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Morning Meds Due</span>
            <Pill size={18} className="text-blue-600" />
          </div>
          <p className="text-3xl font-black text-blue-600">{medsDue.length}</p>
          <p className="text-[11px] text-blue-800 font-semibold">Morning 08:00 round active</p>
        </div>

        <div 
          onClick={() => onNavigateTab('residents')}
          className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs hover:border-rose-500 cursor-pointer transition-all space-y-1"
        >
          <div className="flex justify-between items-center text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Hydration Watch</span>
            <Droplet size={18} className="text-rose-500" />
          </div>
          <p className="text-3xl font-black text-rose-600">{lowFluidResidents.length}</p>
          <p className="text-[11px] text-rose-800 font-semibold">&lt; 50% target consumed</p>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Priority Residents Attention List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h3 className="text-base font-black text-gray-900 tracking-tight flex items-center gap-2">
                  <HeartPulse size={18} className="text-[#106E4E]" />
                  <span>High-Attention Residents (Shift Watchlist)</span>
                </h3>
                <p className="text-xs text-gray-500">Click any resident to open their profile overlay</p>
              </div>
              <button
                onClick={() => onNavigateTab('residents')}
                className="text-xs font-bold text-[#106E4E] hover:underline flex items-center gap-1"
              >
                <span>View All 6</span>
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="space-y-3">
              {highRiskResidents.map(resident => {
                const fluidPercent = Math.min(100, Math.round((resident.todayFluidIntakeMl / resident.fluidTargetMl) * 100));

                return (
                  <div
                    key={resident.id}
                    onClick={() => onSelectResident(resident)}
                    className="p-4 bg-gray-50/80 hover:bg-emerald-50/50 rounded-2xl border border-gray-200 hover:border-emerald-300 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-white text-[#042416] flex items-center justify-center font-bold text-base overflow-hidden shrink-0 border border-gray-200 shadow-2xs">
                        {resident.photoUrl ? (
                          <img src={resident.photoUrl} alt={resident.name} className="w-full h-full object-cover" />
                        ) : (
                          resident.name.charAt(0)
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-gray-900 text-sm group-hover:text-[#106E4E] transition-colors">
                            {resident.name}
                          </h4>
                          <span className={`px-2 py-0.5 text-[10px] font-black uppercase rounded-full ${
                            resident.riskLevel === 'Critical' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {resident.riskLevel}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Room <strong className="text-gray-800">{resident.room}</strong> • {resident.wing.split('(')[0]}
                        </p>
                        <p className="text-[11px] text-gray-600 line-clamp-1 italic mt-0.5">
                          "{resident.keyNotes}"
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <div className="text-right hidden sm:block text-xs">
                        <p className="font-bold text-gray-800">{resident.todayFluidIntakeMl} ml</p>
                        <p className="text-[10px] text-gray-500">{fluidPercent}% hydration</p>
                      </div>
                      <span className="px-3 py-1.5 bg-white group-hover:bg-[#042416] group-hover:text-white text-gray-700 text-xs font-bold rounded-xl border border-gray-200 shadow-2xs transition-all flex items-center gap-1">
                        <span>Profile</span>
                        <ArrowUpRight size={13} />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Shift Care Notes Feed */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h3 className="text-base font-black text-gray-900 tracking-tight flex items-center gap-2">
                  <FileText size={18} className="text-[#106E4E]" />
                  <span>Recent Shift Observations & Logs</span>
                </h3>
                <p className="text-xs text-gray-500">Live feed of notes logged across all wings</p>
              </div>
              <button
                onClick={() => onNavigateTab('logs')}
                className="text-xs font-bold text-[#106E4E] hover:underline flex items-center gap-1"
              >
                <span>Full Timeline</span>
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="space-y-2.5">
              {careLogs.slice(0, 3).map(log => (
                <div key={log.id} className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 text-xs space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#042416] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/70">
                      {log.residentName} (Room {log.room}) • {log.type}
                    </span>
                    <span className="text-[11px] text-gray-400">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-gray-700 font-medium leading-relaxed">{log.content}</p>
                  <p className="text-[10px] text-gray-400 pt-0.5">By {log.staffName} ({log.staffRole})</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Quick Safeguarding & MAR Rounds */}
        <div className="space-y-6">
          {/* Safeguarding Alert Card */}
          <div className="bg-rose-50 border border-rose-200 p-5 rounded-3xl space-y-3">
            <div className="flex items-center gap-2 text-rose-800">
              <AlertTriangle size={18} className="text-rose-600" />
              <h3 className="text-xs font-black uppercase tracking-wider">Safeguarding & Incident Watch</h3>
            </div>
            {incidents.length > 0 && (
              <div className="bg-white p-3.5 rounded-2xl border border-rose-200 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="font-bold text-rose-700">{incidents[0].residentName} (Rm {incidents[0].room})</span>
                  <span className="text-[10px] font-bold text-rose-900 bg-rose-100 px-1.5 py-0.5 rounded">
                    {incidents[0].type}
                  </span>
                </div>
                <p className="text-gray-700 text-[11px]">{incidents[0].description}</p>
                <p className="text-[10px] text-gray-500 font-semibold pt-1">
                  Status: <strong className="text-amber-800">{incidents[0].status}</strong>
                </p>
              </div>
            )}
            <button
              onClick={() => onNavigateTab('incidents')}
              className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors text-center"
            >
              Open Incidents Module
            </button>
          </div>

          {/* Quick Handover Shift Checklist */}
          <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#042416] flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#106E4E]" />
              <span>Shift Handover Checklist</span>
            </h3>

            <div className="space-y-2 text-xs">
              <label className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-gray-50 cursor-pointer">
                <input type="checkbox" defaultChecked className="mt-0.5 rounded text-[#042416] focus:ring-0" />
                <span className="text-gray-700">Night shift verbal handover received & signed</span>
              </label>

              <label className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-gray-50 cursor-pointer">
                <input type="checkbox" defaultChecked className="mt-0.5 rounded text-[#042416] focus:ring-0" />
                <span className="text-gray-700">All 6 residents counted & visually checked</span>
              </label>

              <label className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-gray-50 cursor-pointer">
                <input type="checkbox" className="mt-0.5 rounded text-[#042416] focus:ring-0" />
                <span className="text-gray-700">Morning 08:00 MAR drug rounds administered</span>
              </label>

              <label className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-gray-50 cursor-pointer">
                <input type="checkbox" className="mt-0.5 rounded text-[#042416] focus:ring-0" />
                <span className="text-gray-700">Breakfast hydration logs updated in system</span>
              </label>

              <label className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-gray-50 cursor-pointer">
                <input type="checkbox" className="mt-0.5 rounded text-[#042416] focus:ring-0" />
                <span className="text-gray-700">2-hourly pressure ulcer repositioning verified</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
