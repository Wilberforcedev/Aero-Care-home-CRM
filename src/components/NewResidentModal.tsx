import React, { useState } from 'react';
import { X, UserPlus, HeartPulse, CheckCircle2 } from 'lucide-react';
import { Resident, RiskLevel } from '../types';

interface NewResidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddResident: (res: Resident) => void;
}

export const NewResidentModal: React.FC<NewResidentModalProps> = ({
  isOpen,
  onClose,
  onAddResident
}) => {
  const [name, setName] = useState('');
  const [preferredName, setPreferredName] = useState('');
  const [room, setRoom] = useState('');
  const [wing, setWing] = useState<'Oak Wing (Ground)' | 'Cedar Wing (1st Fl)' | 'Maple Wing (Memory)'>('Oak Wing (Ground)');
  const [dob, setDob] = useState('1940-01-01');
  const [nhsNumber, setNhsNumber] = useState('999 000 1122');
  const [riskLevel, setRiskLevel] = useState<RiskLevel>('Medium');
  const [dnacpr, setDnacpr] = useState(false);
  const [nokName, setNokName] = useState('');
  const [nokRelation, setNokRelation] = useState('');
  const [nokPhone, setNokPhone] = useState('');
  const [nokEmail, setNokEmail] = useState('');
  const [dietaryTexture, setDietaryTexture] = useState('Standard Regular (IDDSI 7)');
  const [fluidThickener, setFluidThickener] = useState(false);
  const [allergies, setAllergies] = useState('');
  const [keyNotes, setKeyNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !room) return;

    const newRes: Resident = {
      id: `res-${Date.now()}`,
      name: name.trim(),
      preferredName: preferredName.trim() || undefined,
      room: room.trim(),
      wing,
      dob,
      nhsNumber: nhsNumber.trim(),
      admissionDate: new Date().toISOString().split('T')[0],
      riskLevel,
      status: 'Stable',
      medsStatus: 'Pending',
      dnacpr,
      fallRiskScore: riskLevel === 'Critical' ? 18 : riskLevel === 'High' ? 14 : 6,
      waterlowScore: 10,
      dietary: {
        texture: dietaryTexture,
        fluidThickener,
        diabetic: false,
        allergies: allergies.split(',').map(s => s.trim()).filter(Boolean),
        likes: 'Prefers mild warm meals and fruit teas',
        dislikes: 'None recorded'
      },
      gpName: 'Dr. Alistair Finch',
      gpPhone: '020 8445 1092',
      gpSurgery: 'Highland Medical Practice, London',
      nokName: nokName.trim() || 'Primary Relative',
      nokRelation: nokRelation.trim() || 'Family',
      nokPhone: nokPhone.trim() || '07700 900000',
      nokEmail: nokEmail.trim() || undefined,
      medicalConditions: ['Under Clinical Admission Assessment'],
      mobilityNeeds: 'Assessment required upon initial settling in.',
      sensoryNeeds: 'Visual and auditory checks underway.',
      nightRoutine: 'Gentle 2-hourly safety check.',
      photoUrl: '',
      primaryCarer: 'Sarah Jenkins',
      fluidTargetMl: 1500,
      todayFluidIntakeMl: 0,
      keyNotes: keyNotes.trim() || 'Newly admitted resident. Complete baseline admission assessments.'
    };

    onAddResident(newRes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl p-6 shadow-2xl space-y-4 my-8">
        <div className="flex justify-between items-center border-b pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 text-emerald-900 rounded-xl">
              <UserPlus size={18} />
            </div>
            <div>
              <h3 className="font-black text-gray-900 text-base">Admit New Resident</h3>
              <p className="text-xs text-gray-500">Create comprehensive clinical intake profile</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 p-1">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-600 font-bold mb-1">Full Legal Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Dorothy Harrison"
                required
                className="w-full p-2.5 bg-gray-50 border rounded-xl font-bold"
              />
            </div>

            <div>
              <label className="block text-gray-600 font-bold mb-1">Preferred Name</label>
              <input
                type="text"
                value={preferredName}
                onChange={(e) => setPreferredName(e.target.value)}
                placeholder="e.g. Dot"
                className="w-full p-2.5 bg-gray-50 border rounded-xl"
              />
            </div>

            <div>
              <label className="block text-gray-600 font-bold mb-1">Allocated Room # *</label>
              <input
                type="text"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                placeholder="e.g. 206"
                required
                className="w-full p-2.5 bg-gray-50 border rounded-xl font-bold"
              />
            </div>

            <div>
              <label className="block text-gray-600 font-bold mb-1">Wing Location</label>
              <select
                value={wing}
                onChange={(e) => setWing(e.target.value as any)}
                className="w-full p-2.5 bg-gray-50 border rounded-xl font-semibold"
              >
                <option value="Oak Wing (Ground)">Oak Wing (Ground)</option>
                <option value="Cedar Wing (1st Fl)">Cedar Wing (1st Fl)</option>
                <option value="Maple Wing (Memory)">Maple Wing (Memory)</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-600 font-bold mb-1">Date of Birth</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full p-2 bg-gray-50 border rounded-xl font-medium"
              />
            </div>

            <div>
              <label className="block text-gray-600 font-bold mb-1">NHS Number</label>
              <input
                type="text"
                value={nhsNumber}
                onChange={(e) => setNhsNumber(e.target.value)}
                placeholder="999 000 1122"
                className="w-full p-2.5 bg-gray-50 border rounded-xl font-mono"
              />
            </div>
          </div>

          <div className="p-3.5 bg-gray-50 rounded-2xl border space-y-3">
            <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider">Emergency Contact (Next of Kin)</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="block text-gray-500 text-[11px] font-bold mb-1">Contact Name</label>
                <input
                  type="text"
                  value={nokName}
                  onChange={(e) => setNokName(e.target.value)}
                  placeholder="e.g. Mark Harrison"
                  className="w-full p-2 bg-white border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-500 text-[11px] font-bold mb-1">Relationship</label>
                <input
                  type="text"
                  value={nokRelation}
                  onChange={(e) => setNokRelation(e.target.value)}
                  placeholder="e.g. Son / Guardian"
                  className="w-full p-2 bg-white border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-500 text-[11px] font-bold mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={nokPhone}
                  onChange={(e) => setNokPhone(e.target.value)}
                  placeholder="07700 900123"
                  className="w-full p-2 bg-white border rounded-lg"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-600 font-bold mb-1">Clinical Risk Rating</label>
              <select
                value={riskLevel}
                onChange={(e) => setRiskLevel(e.target.value as RiskLevel)}
                className="w-full p-2.5 bg-gray-50 border rounded-xl font-semibold"
              >
                <option value="Low">Low Risk</option>
                <option value="Medium">Medium Risk</option>
                <option value="High">High Risk</option>
                <option value="Critical">Critical Risk</option>
              </select>
            </div>

            <div className="flex items-center gap-3 pt-6">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800">
                <input
                  type="checkbox"
                  checked={dnacpr}
                  onChange={(e) => setDnacpr(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-0 w-4 h-4"
                />
                <span>DNACPR Order Active</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-gray-600 font-bold mb-1">Allergies (comma separated)</label>
            <input
              type="text"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              placeholder="e.g. Penicillin, Peanuts"
              className="w-full p-2.5 bg-gray-50 border rounded-xl"
            />
          </div>

          <div>
            <label className="block text-gray-600 font-bold mb-1">Initial Care / Mobility Notes</label>
            <textarea
              rows={2}
              value={keyNotes}
              onChange={(e) => setKeyNotes(e.target.value)}
              placeholder="Key notes for care staff during initial handover..."
              className="w-full p-2.5 bg-gray-50 border rounded-xl"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#042416] hover:bg-[#083a24] text-white rounded-xl font-bold shadow-md"
            >
              Complete Admission
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
