import React, { useState } from 'react';
import { 
  Pill, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Clock, 
  Search, 
  Filter, 
  ShieldCheck, 
  User as UserIcon,
  ChevronRight
} from 'lucide-react';
import { Medication, Resident, User } from '../types';
import { can, eligibleWitnesses } from '../services/auth';

interface MARModuleProps {
  medications: Medication[];
  residents: Resident[];
  currentUser: User;
  onUpdateMedicationStatus: (medId: string, status: 'Given' | 'Refused' | 'Omitted', secondSignature?: string) => void;
  onSelectResident: (resident: Resident) => void;
}

export const MARModule: React.FC<MARModuleProps> = ({
  medications,
  residents,
  currentUser,
  onUpdateMedicationStatus,
  onSelectResident
}) => {
  const [selectedSlot, setSelectedSlot] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [signingMed, setSigningMed] = useState<Medication | null>(null);
  const [signStatus, setSignStatus] = useState<'Given' | 'Refused' | 'Omitted'>('Given');
  const [witnessName, setWitnessName] = useState('');

  const canAdminister = can(currentUser, 'administerMeds');
  const witnesses = eligibleWitnesses(currentUser.id);

  const timeSlots = [
    'All',
    'Morning (08:00)',
    'Lunch (12:00)',
    'Tea (17:00)',
    'Night (21:00)',
    'PRN (As Needed)'
  ];

  const filteredMeds = medications.filter(m => {
    const matchSlot = selectedSlot === 'All' || m.timeSlot === selectedSlot;
    const matchSearch = 
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.residentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.room.includes(searchTerm);
    return matchSlot && matchSearch;
  });

  const handleConfirmSign = () => {
    if (!signingMed) return;
    if (signingMed.controlledDrug && !witnessName.trim()) return;
    onUpdateMedicationStatus(
      signingMed.id,
      signStatus,
      signingMed.controlledDrug ? witnessName.trim() : undefined
    );
    setSigningMed(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Electronic MAR (eMAR) Drug Rounds</h2>
            <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">
              Live Safe Administration
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Strict 5 Rights of Medication Administration. Registered Nurse or Senior Carer dual sign-off.
          </p>
        </div>

        <div className="text-xs text-gray-500 flex items-center gap-2 bg-emerald-50 px-3 py-2 rounded-2xl border border-emerald-200">
          <ShieldCheck className="text-emerald-700" size={16} />
          <span>Active Dispenser: <strong>{currentUser.name}</strong> ({currentUser.role})</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap gap-1.5">
          {timeSlots.map(slot => (
            <button
              key={slot}
              onClick={() => setSelectedSlot(slot)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                selectedSlot === slot
                  ? 'bg-[#042416] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {slot}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <input
            type="text"
            placeholder="Search drug or resident..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#042416]"
          />
        </div>
      </div>

      {/* Medication Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMeds.map(med => {
          const resident = residents.find(r => r.id === med.residentId);

          return (
            <div key={med.id} className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs flex flex-col justify-between space-y-3">
              <div>
                <div className="flex justify-between items-start">
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-800 text-[10px] font-black rounded-lg border border-blue-200">
                    {med.timeSlot}
                  </span>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-lg border ${
                    med.status === 'Given' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                    med.status === 'Refused' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                    med.status === 'Omitted' ? 'bg-rose-50 text-rose-800 border-rose-200' :
                    'bg-gray-100 text-gray-800 border-gray-200'
                  }`}>
                    {med.status}
                  </span>
                </div>

                <h3 className="font-extrabold text-gray-900 text-base mt-2">{med.name}</h3>
                <p className="text-xs font-bold text-[#106E4E]">{med.dosage} • {med.route}</p>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{med.instructions}</p>

                {med.controlledDrug && (
                  <div className="mt-2 p-1.5 bg-amber-50 border border-amber-200 rounded-lg text-[10px] font-bold text-amber-900 flex items-center gap-1.5">
                    <ShieldCheck size={13} className="text-amber-700" />
                    <span>Controlled Drug (CD Schedule 2) - Dual Sign-off</span>
                  </div>
                )}
              </div>

              {/* Resident identity and Action */}
              <div className="pt-3 border-t border-gray-100 space-y-2.5">
                <div 
                  onClick={() => resident && onSelectResident(resident)}
                  className="flex items-center justify-between p-2 rounded-xl bg-gray-50 hover:bg-emerald-50 cursor-pointer transition-colors"
                >
                  <div className="text-xs">
                    <p className="font-bold text-gray-900">{med.residentName}</p>
                    <p className="text-[11px] text-gray-500">Room {med.room}</p>
                  </div>
                  <span className="text-[11px] text-emerald-800 font-bold flex items-center gap-0.5">
                    Profile <ChevronRight size={13} />
                  </span>
                </div>

                {med.status === 'Due' ? (
                  <button
                    onClick={() => { setSigningMed(med); setSignStatus('Given'); setWitnessName(''); }}
                    disabled={!canAdminister}
                    className={`w-full py-2 bg-[#042416] hover:bg-[#083a24] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 ${!canAdminister ? 'opacity-40 cursor-not-allowed' : ''}`}
                    title={canAdminister ? 'Administer / Sign Off' : 'Requires Administer Meds permission'}
                  >
                    <CheckCircle2 size={14} />
                    <span>{canAdminister ? 'Administer / Sign Off' : 'Sign-off Restricted'}</span>
                  </button>
                ) : (
                  <div className="text-center py-1.5 bg-gray-50 text-gray-500 text-xs font-semibold rounded-xl">
                    Signed off as {med.status}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Signing Modal */}
      {signingMed && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-black text-gray-900">MAR Administration Sign-off</h3>
            
            <div className="p-3 bg-gray-50 rounded-2xl border text-xs space-y-1">
              <p className="font-bold text-gray-900 text-sm">{signingMed.name} ({signingMed.dosage})</p>
              <p className="text-gray-600">Resident: <strong>{signingMed.residentName}</strong> (Room {signingMed.room})</p>
              <p className="text-gray-500">{signingMed.instructions}</p>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="block text-gray-700 font-bold">Administration Outcome:</label>
              <div className="flex gap-2">
                {(['Given', 'Refused', 'Omitted'] as const).map(status => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setSignStatus(status)}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${
                      signStatus === status
                        ? 'bg-[#042416] text-white border-[#042416]'
                        : 'bg-gray-50 text-gray-700 border-gray-200'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {signingMed.controlledDrug && (
              <div className="space-y-1 text-xs">
                <label className="block text-gray-700 font-bold">Dual Witness Staff (CD Schedule):</label>
                {witnesses.length === 0 ? (
                  <p className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl font-medium text-amber-900">
                    No other authorized witness is available on this shift. A Controlled Drug cannot be signed off alone.
                  </p>
                ) : (
                  <select
                    value={witnessName}
                    onChange={(e) => setWitnessName(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border rounded-xl font-medium"
                  >
                    <option value="">Select second authorized staff…</option>
                    {witnesses.map(w => (
                      <option key={w.id} value={`${w.name} (${w.role})`}>
                        {w.name} — {w.role}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSigningMed(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSign}
                disabled={Boolean(signingMed.controlledDrug && !witnessName.trim())}
                className="px-4 py-2 bg-[#042416] text-white rounded-xl font-bold text-xs shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Confirm MAR Sign-off
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
