import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  UserPlus, 
  ChevronRight, 
  Droplet, 
  Activity, 
  FileText, 
  Pill, 
  AlertTriangle, 
  HeartPulse, 
  ShieldAlert,
  LayoutGrid,
  List,
  Eye,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { Resident, RiskLevel, ResidentStatus } from '../types';

interface ResidentDirectoryProps {
  residents: Resident[];
  onSelectResident: (resident: Resident) => void;
  onOpenFluidModal: (resident: Resident) => void;
  onOpenVitalsModal: (resident: Resident) => void;
  onOpenCareNoteModal: (resident: Resident) => void;
  onNewResidentClick?: () => void;
}

export const ResidentDirectory: React.FC<ResidentDirectoryProps> = ({
  residents,
  onSelectResident,
  onOpenFluidModal,
  onOpenVitalsModal,
  onOpenCareNoteModal,
  onNewResidentClick
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWing, setSelectedWing] = useState<string>('All');
  const [selectedRisk, setSelectedRisk] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const filteredResidents = useMemo(() => {
    return residents.filter(r => {
      const matchSearch = 
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.nhsNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.preferredName && r.preferredName.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchWing = selectedWing === 'All' || r.wing.includes(selectedWing);
      const matchRisk = selectedRisk === 'All' || r.riskLevel === selectedRisk;
      const matchStatus = selectedStatus === 'All' || r.status === selectedStatus;

      return matchSearch && matchWing && matchRisk && matchStatus;
    });
  }, [residents, searchTerm, selectedWing, selectedRisk, selectedStatus]);

  // Calculate age helper
  const getAge = (dob: string) => {
    if (!dob) return 'N/A';
    const birth = new Date(dob);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
    return age;
  };

  return (
    <div className="space-y-6">
      {/* Directory Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-gray-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Resident Directory & Profiles</h2>
            <span className="px-2.5 py-0.5 bg-[#042416] text-white text-xs font-bold rounded-full">
              {filteredResidents.length} of {residents.length}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Click any resident card to open their comprehensive clinical profile drawer and care timeline.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                viewMode === 'grid' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-800'
              }`}
              title="Grid Cards View"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                viewMode === 'table' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-800'
              }`}
              title="Table Directory View"
            >
              <List size={15} />
            </button>
          </div>

          {onNewResidentClick && (
            <button
              onClick={onNewResidentClick}
              className="px-4 py-2.5 bg-[#042416] hover:bg-[#083a24] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm transition-all active:scale-95"
            >
              <UserPlus size={15} />
              <span>Admit New Resident</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search by name, room (101), NHS..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#042416] focus:bg-white outline-none font-medium text-gray-800"
          />
        </div>

        {/* Wing Filter */}
        <div className="flex items-center gap-2">
          <label className="text-gray-500 font-bold shrink-0">Wing:</label>
          <select
            value={selectedWing}
            onChange={(e) => setSelectedWing(e.target.value)}
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-800 outline-none focus:ring-2 focus:ring-[#042416]"
          >
            <option value="All">All Wings (Full Facility)</option>
            <option value="Oak">Oak Wing (Ground Floor)</option>
            <option value="Cedar">Cedar Wing (1st Floor)</option>
            <option value="Maple">Maple Wing (Memory Unit)</option>
          </select>
        </div>

        {/* Risk Level Filter */}
        <div className="flex items-center gap-2">
          <label className="text-gray-500 font-bold shrink-0">Risk:</label>
          <select
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-800 outline-none focus:ring-2 focus:ring-[#042416]"
          >
            <option value="All">All Risk Profiles</option>
            <option value="Critical">Critical Risk</option>
            <option value="High">High Risk</option>
            <option value="Medium">Medium Risk</option>
            <option value="Low">Low Risk</option>
          </select>
        </div>

        {/* Care Status Filter */}
        <div className="flex items-center gap-2">
          <label className="text-gray-500 font-bold shrink-0">Status:</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-800 outline-none focus:ring-2 focus:ring-[#042416]"
          >
            <option value="All">All Care Statuses</option>
            <option value="Stable">Stable</option>
            <option value="Needs Care">Needs Care</option>
            <option value="Review Required">Review Required</option>
          </select>
        </div>
      </div>

      {/* Residents Display Area */}
      {filteredResidents.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-gray-200 shadow-xs space-y-3">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
            <Search size={22} />
          </div>
          <h3 className="text-base font-bold text-gray-900">No matching residents found</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Try adjusting your search criteria or resetting filters to view all residents.
          </p>
          <button
            onClick={() => { setSearchTerm(''); setSelectedWing('All'); setSelectedRisk('All'); setSelectedStatus('All'); }}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID CARDS VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredResidents.map((resident) => {
            const fluidPercent = Math.min(100, Math.round((resident.todayFluidIntakeMl / resident.fluidTargetMl) * 100));

            return (
              <div
                key={resident.id}
                onClick={() => onSelectResident(resident)}
                className="bg-white rounded-3xl border border-gray-200 hover:border-emerald-600/50 shadow-xs hover:shadow-xl transition-all duration-200 cursor-pointer overflow-hidden flex flex-col group relative"
              >
                {/* Top Accent Strip based on Risk */}
                <div className={`h-1.5 w-full ${
                  resident.riskLevel === 'Critical' ? 'bg-rose-500' :
                  resident.riskLevel === 'High' ? 'bg-amber-500' :
                  resident.riskLevel === 'Medium' ? 'bg-blue-500' :
                  'bg-emerald-600'
                }`} />

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  {/* Resident Identity */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#042416] flex items-center justify-center text-xl font-black border border-emerald-200/60 overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                        {resident.photoUrl ? (
                          <img src={resident.photoUrl} alt={resident.name} className="w-full h-full object-cover" />
                        ) : (
                          <span>{resident.name.charAt(0)}</span>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-extrabold text-gray-900 group-hover:text-[#106E4E] transition-colors text-base leading-tight">
                            {resident.name}
                          </h3>
                        </div>
                        <p className="text-xs text-gray-500 font-medium">
                          Room <strong className="text-gray-900 font-bold">{resident.room}</strong> • {getAge(resident.dob)} yrs
                        </p>
                        <p className="text-[11px] text-emerald-800 font-semibold truncate max-w-[160px]">
                          {resident.wing.split('(')[0]}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-full ${
                        resident.riskLevel === 'Critical' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                        resident.riskLevel === 'High' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                        'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}>
                        {resident.riskLevel}
                      </span>
                      {resident.dnacpr && (
                        <span className="px-1.5 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 text-[9px] font-bold rounded">
                          DNACPR
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Key Care Notes Brief */}
                  <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                    <p className="text-[11px] text-gray-600 line-clamp-2 leading-relaxed">
                      "{resident.keyNotes}"
                    </p>
                  </div>

                  {/* Daily Hydration Status & Meds Due */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-gray-500 font-medium flex items-center gap-1">
                        <Droplet size={12} className="text-blue-500" /> Hydration Today:
                      </span>
                      <span className="font-bold text-gray-800">
                        {resident.todayFluidIntakeMl} / {resident.fluidTargetMl} ml ({fluidPercent}%)
                      </span>
                    </div>

                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          fluidPercent >= 100 ? 'bg-emerald-500' : fluidPercent >= 60 ? 'bg-blue-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${fluidPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Actions & Slide-over indicator */}
                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-bold text-[#106E4E] flex items-center gap-0.5 group-hover:underline">
                      <span>Open Profile Drawer</span>
                      <ArrowUpRight size={13} />
                    </span>

                    {/* Quick Shift Shortcut buttons */}
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onOpenFluidModal(resident)}
                        className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
                        title="Log Fluid"
                      >
                        <Droplet size={14} />
                      </button>
                      <button
                        onClick={() => onOpenVitalsModal(resident)}
                        className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition-colors"
                        title="Record Vitals"
                      >
                        <Activity size={14} />
                      </button>
                      <button
                        onClick={() => onOpenCareNoteModal(resident)}
                        className="p-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition-colors"
                        title="Add Care Note"
                      >
                        <FileText size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* COMPACT TABLE DIRECTORY VIEW */
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b text-gray-600 font-bold">
                <tr>
                  <th className="p-4">Resident</th>
                  <th className="p-4">Room & Wing</th>
                  <th className="p-4">Age / DOB</th>
                  <th className="p-4">NHS Identifier</th>
                  <th className="p-4">Risk / DNACPR</th>
                  <th className="p-4">MAR Status</th>
                  <th className="p-4">Hydration Progress</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredResidents.map(resident => {
                  const fluidPercent = Math.min(100, Math.round((resident.todayFluidIntakeMl / resident.fluidTargetMl) * 100));

                  return (
                    <tr 
                      key={resident.id}
                      onClick={() => onSelectResident(resident)}
                      className="hover:bg-emerald-50/40 cursor-pointer transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#042416] flex items-center justify-center font-bold overflow-hidden shrink-0 border">
                            {resident.photoUrl ? (
                              <img src={resident.photoUrl} alt={resident.name} className="w-full h-full object-cover" />
                            ) : (
                              resident.name.charAt(0)
                            )}
                          </div>
                          <div>
                            <p className="font-extrabold text-gray-900 text-sm">{resident.name}</p>
                            <p className="text-[11px] text-gray-500">{resident.preferredName ? `"${resident.preferredName}"` : 'Resident'}</p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <p className="font-bold text-gray-900">Room {resident.room}</p>
                        <p className="text-[11px] text-emerald-800">{resident.wing.split('(')[0]}</p>
                      </td>

                      <td className="p-4">
                        <p className="font-semibold text-gray-800">{getAge(resident.dob)} yrs</p>
                        <p className="text-[11px] text-gray-400">{resident.dob}</p>
                      </td>

                      <td className="p-4 font-mono font-bold text-gray-700">
                        {resident.nhsNumber}
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 text-[10px] font-black uppercase rounded-full ${
                            resident.riskLevel === 'Critical' ? 'bg-rose-100 text-rose-800' :
                            resident.riskLevel === 'High' ? 'bg-amber-100 text-amber-800' :
                            'bg-emerald-100 text-emerald-800'
                          }`}>
                            {resident.riskLevel}
                          </span>
                          {resident.dnacpr && (
                            <span className="px-1.5 py-0.5 bg-rose-100 text-rose-800 text-[9px] font-bold rounded">
                              DNACPR
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="p-4">
                        <span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border ${
                          resident.medsStatus === 'Due Now' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                          resident.medsStatus === 'Overdue' ? 'bg-rose-50 text-rose-800 border-rose-200' :
                          'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}>
                          {resident.medsStatus}
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="w-32 space-y-1">
                          <div className="flex justify-between text-[10px] text-gray-500 font-semibold">
                            <span>{resident.todayFluidIntakeMl} ml</span>
                            <span>{fluidPercent}%</span>
                          </div>
                          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${fluidPercent >= 100 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                              style={{ width: `${fluidPercent}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="p-4 text-right">
                        <span className="px-3 py-1.5 bg-[#042416] text-white rounded-xl text-xs font-bold inline-flex items-center gap-1 shadow-xs">
                          <span>View Profile</span>
                          <ChevronRight size={13} />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
