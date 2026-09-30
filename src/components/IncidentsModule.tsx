import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Plus, 
  ShieldAlert, 
  FileCheck, 
  CheckCircle2, 
  Clock, 
  User, 
  ChevronRight,
  HelpCircle
} from 'lucide-react';
import { Incident, Resident, User as StaffUser } from '../types';
import { can } from '../services/auth';

interface IncidentsModuleProps {
  incidents: Incident[];
  residents: Resident[];
  currentUser: StaffUser;
  onAddIncident: (inc: Omit<Incident, 'id'>) => void;
  onSelectResident: (resident: Resident) => void;
}

export const IncidentsModule: React.FC<IncidentsModuleProps> = ({
  incidents,
  residents,
  currentUser,
  onAddIncident,
  onSelectResident
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const canReport = can(currentUser, 'reportIncident');

  // Form State
  const [resId, setResId] = useState(residents[0]?.id || '');
  const [type, setType] = useState<any>('Fall');
  const [severity, setSeverity] = useState<any>('Medium');
  const [desc, setDesc] = useState('');
  const [immediateActions, setImmediateActions] = useState('');
  const [bodyMap, setBodyMap] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = residents.find(r => r.id === resId);
    if (!res || !desc.trim()) return;

    onAddIncident({
      residentId: res.id,
      residentName: res.name,
      room: res.room,
      type,
      severity,
      time: 'Just now',
      description: desc.trim(),
      immediateActions: immediateActions.trim() || 'First aid administered, GP notified, neurological checks logged.',
      reportedBy: `${currentUser.name} (${currentUser.role})`,
      status: 'Manager Review',
      bodyMapArea: bodyMap || 'None noted'
    });

    setDesc('');
    setImmediateActions('');
    setBodyMap('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Incidents & Safeguarding</h2>
            <span className="px-2.5 py-0.5 bg-rose-100 text-rose-800 text-xs font-bold rounded-full">
              CQC Regulation 18
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Document accidents, near misses, skin tears, and falls with full clinical audit trail.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          disabled={!canReport}
          className={`px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-xs self-start sm:self-auto active:scale-95 ${!canReport ? 'opacity-40 cursor-not-allowed' : ''}`}
          title={canReport ? 'Report Incident / Fall' : 'Requires Report Incident permission'}
        >
          <Plus size={15} />
          <span>Report Incident / Fall</span>
        </button>
      </div>

      {/* Incident List */}
      <div className="space-y-4">
        {incidents.map(inc => {
          const resident = residents.find(r => r.id === inc.residentId);

          return (
            <div key={inc.id} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3">
                <div className="flex items-center gap-2.5">
                  <span className={`px-2.5 py-1 text-xs font-black uppercase rounded-xl border ${
                    inc.severity === 'Critical' ? 'bg-rose-600 text-white border-rose-600' :
                    inc.severity === 'High' ? 'bg-amber-100 text-amber-900 border-amber-300' :
                    'bg-blue-50 text-blue-900 border-blue-200'
                  }`}>
                    {inc.type} • {inc.severity} Severity
                  </span>

                  <button
                    onClick={() => resident && onSelectResident(resident)}
                    className="font-black text-gray-900 text-sm hover:text-[#106E4E] transition-colors"
                  >
                    {inc.residentName} (Room {inc.room})
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">{inc.time}</span>
                  <span className="px-2.5 py-0.5 bg-gray-100 text-gray-700 font-bold text-xs rounded-full">
                    {inc.status}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="font-bold text-gray-500">Incident Event Description:</span>
                  <p className="text-gray-900 font-medium mt-0.5 bg-gray-50 p-3 rounded-xl border leading-relaxed">
                    {inc.description}
                  </p>
                </div>

                <div>
                  <span className="font-bold text-gray-500">Immediate Actions & Safeguarding Protocol Taken:</span>
                  <p className="text-gray-800 font-medium mt-0.5 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100 leading-relaxed">
                    {inc.immediateActions}
                  </p>
                </div>

                {inc.bodyMapArea && (
                  <div className="text-[11px] text-gray-500">
                    Body Map Assessment: <strong className="text-gray-800">{inc.bodyMapArea}</strong>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-gray-100 flex justify-between items-center text-[11px] text-gray-400">
                <span>Investigating / Reported by: <strong className="text-gray-700">{inc.reportedBy}</strong></span>
                {resident && (
                  <button
                    onClick={() => onSelectResident(resident)}
                    className="text-[#106E4E] font-bold hover:underline flex items-center gap-0.5"
                  >
                    Open Resident Profile <ChevronRight size={13} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Report Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
              <AlertTriangle className="text-rose-600" size={18} />
              <span>Report Clinical Incident or Fall</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-600 font-bold mb-1">Resident Involved</label>
                  <select
                    value={resId}
                    onChange={(e) => setResId(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border rounded-xl font-semibold"
                  >
                    {residents.map(r => (
                      <option key={r.id} value={r.id}>{r.name} (Room {r.room})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-600 font-bold mb-1">Incident Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border rounded-xl font-semibold"
                  >
                    <option value="Fall">Fall (Unassisted / Slip)</option>
                    <option value="Near Miss">Near Miss</option>
                    <option value="Skin Tear">Skin Tear / Bruise</option>
                    <option value="Medication Error">Medication Error</option>
                    <option value="Aggression / Agitation">Aggression / Agitation</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-600 font-bold mb-1">Severity Rating</label>
                <div className="flex gap-2">
                  {(['Low', 'Medium', 'High', 'Critical'] as const).map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSeverity(s)}
                      className={`flex-1 py-1.5 rounded-xl font-bold border transition-all ${
                        severity === s
                          ? s === 'Critical' ? 'bg-rose-600 text-white border-rose-600' : 'bg-[#042416] text-white border-[#042416]'
                          : 'bg-gray-50 text-gray-700 border-gray-200'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-600 font-bold mb-1">What happened? (Chronological description)</label>
                <textarea
                  rows={3}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Detail location, resident position found, equipment involved..."
                  className="w-full p-2.5 bg-gray-50 border rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-600 font-bold mb-1">Immediate Actions Taken & First Aid</label>
                <textarea
                  rows={2}
                  value={immediateActions}
                  onChange={(e) => setImmediateActions(e.target.value)}
                  placeholder="Neuro checks completed, ice pack applied, GP or 111 contacted, family notified..."
                  className="w-full p-2.5 bg-gray-50 border rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-600 font-bold mb-1">Body Map / Injury Area (optional)</label>
                <input
                  type="text"
                  value={bodyMap}
                  onChange={(e) => setBodyMap(e.target.value)}
                  placeholder="e.g., Superficial skin redness to left elbow"
                  className="w-full p-2 bg-gray-50 border rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 text-white rounded-xl font-bold text-xs shadow-md"
                >
                  Submit Incident Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
