import React, { useState } from 'react';
import { X, Droplet, Activity, FileText, CheckCircle2, HeartPulse, Sparkles } from 'lucide-react';
import { Resident, User, CareLog, VitalsRecord, CareLogType, MoodType } from '../types';

// FLUID MODAL
interface FluidModalProps {
  resident: Resident | null;
  residents: Resident[];
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (residentId: string, amountMl: number, fluidType: string) => void;
}

export const FluidModal: React.FC<FluidModalProps> = ({
  resident,
  residents,
  isOpen,
  onClose,
  onSubmit
}) => {
  const [selectedResId, setSelectedResId] = useState(resident?.id || residents[0]?.id || '');
  const [amount, setAmount] = useState(200);
  const [beverage, setBeverage] = useState('Cup of Tea');

  if (!isOpen) return null;

  const activeRes = residents.find(r => r.id === (resident?.id || selectedResId)) || residents[0];

  const presets = [150, 200, 250, 300];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(activeRes.id, amount, beverage);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex justify-between items-center border-b pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
              <Droplet size={18} />
            </div>
            <div>
              <h3 className="font-black text-gray-900 text-sm">Log Fluid Intake</h3>
              <p className="text-xs text-gray-500">{activeRes.name} (Room {activeRes.room})</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 p-1">
            <X size={18} />
          </button>
        </div>

        {activeRes.dietary.fluidThickener && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs font-bold text-amber-900">
            ⚠️ Dysphagia Protocol: Must serve with Level 2 Fluid Thickener
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-gray-600 font-bold mb-1">Serving Amount (ml)</label>
            <div className="grid grid-cols-4 gap-2 mb-2">
              {presets.map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setAmount(p)}
                  className={`py-2 rounded-xl font-bold border transition-all ${
                    amount === p
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-gray-50 text-gray-700 border-gray-200'
                  }`}
                >
                  {p} ml
                </button>
              ))}
            </div>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full p-2.5 bg-gray-50 border rounded-xl font-bold text-gray-900"
              min={10}
              max={1000}
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 font-bold mb-1">Beverage Type</label>
            <select
              value={beverage}
              onChange={(e) => setBeverage(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border rounded-xl font-semibold text-gray-800"
            >
              <option value="Cup of Tea">Cup of Tea / Coffee</option>
              <option value="Fresh Water">Fresh Water</option>
              <option value="Fruit Squash / Juice">Fruit Squash / Juice</option>
              <option value="Warm Milk / Cocoa">Warm Milk / Cocoa</option>
              <option value="Nutritional Supplement Drink">Nutritional Supplement Drink (Fortisip)</option>
              <option value="Soup / Broth">Soup / Broth</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md"
            >
              Record {amount} ml Intake
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// VITALS MODAL
interface VitalsModalProps {
  resident: Resident | null;
  residents: Resident[];
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (vitals: Omit<VitalsRecord, 'id'>) => void;
  currentUser: User;
}

export const VitalsModal: React.FC<VitalsModalProps> = ({
  resident,
  residents,
  isOpen,
  onClose,
  onSubmit,
  currentUser
}) => {
  const [selectedResId, setSelectedResId] = useState(resident?.id || residents[0]?.id || '');
  const [bpSystolic, setBpSystolic] = useState('120');
  const [bpDiastolic, setBpDiastolic] = useState('80');
  const [pulse, setPulse] = useState('72');
  const [tempC, setTempC] = useState('36.6');
  const [oxygenSat, setOxygenSat] = useState('98');
  const [respirationRate, setRespirationRate] = useState('16');
  const [oxygenSupplement, setOxygenSupplement] = useState(false);
  const [avpu, setAvpu] = useState<'A' | 'V' | 'P' | 'U'>('A');
  const [bloodGlucose, setBloodGlucose] = useState('');

  if (!isOpen) return null;

  const activeRes = residents.find(r => r.id === (resident?.id || selectedResId)) || residents[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      residentId: activeRes.id,
      residentName: activeRes.name,
      timestamp: new Date().toISOString(),
      bpSystolic: bpSystolic ? Number(bpSystolic) : undefined,
      bpDiastolic: bpDiastolic ? Number(bpDiastolic) : undefined,
      pulse: pulse ? Number(pulse) : undefined,
      tempC: tempC ? Number(tempC) : undefined,
      oxygenSat: oxygenSat ? Number(oxygenSat) : undefined,
      respirationRate: respirationRate ? Number(respirationRate) : undefined,
      oxygenSupplement,
      avpu,
      bloodGlucose: bloodGlucose ? Number(bloodGlucose) : undefined,
      staffName: currentUser.name
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex justify-between items-center border-b pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
              <Activity size={18} />
            </div>
            <div>
              <h3 className="font-black text-gray-900 text-sm">Record Clinical Vital Signs</h3>
              <p className="text-xs text-gray-500">{activeRes.name} (Room {activeRes.room})</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 p-1">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-600 font-bold mb-1">Blood Pressure (Systolic / Diastolic)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="120"
                  value={bpSystolic}
                  onChange={(e) => setBpSystolic(e.target.value)}
                  className="w-full p-2 bg-gray-50 border rounded-xl font-bold text-center"
                />
                <span className="text-gray-400 font-bold">/</span>
                <input
                  type="number"
                  placeholder="80"
                  value={bpDiastolic}
                  onChange={(e) => setBpDiastolic(e.target.value)}
                  className="w-full p-2 bg-gray-50 border rounded-xl font-bold text-center"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-600 font-bold mb-1">Heart Pulse (BPM)</label>
              <input
                type="number"
                value={pulse}
                onChange={(e) => setPulse(e.target.value)}
                placeholder="72"
                className="w-full p-2 bg-gray-50 border rounded-xl font-bold text-center"
              />
            </div>

            <div>
              <label className="block text-gray-600 font-bold mb-1">Body Temperature (°C)</label>
              <input
                type="number"
                step="0.1"
                value={tempC}
                onChange={(e) => setTempC(e.target.value)}
                placeholder="36.6"
                className="w-full p-2 bg-gray-50 border rounded-xl font-bold text-center"
              />
            </div>

            <div>
              <label className="block text-gray-600 font-bold mb-1">Oxygen Saturation SpO2 (%)</label>
              <input
                type="number"
                value={oxygenSat}
                onChange={(e) => setOxygenSat(e.target.value)}
                placeholder="98"
                className="w-full p-2 bg-gray-50 border rounded-xl font-bold text-center"
              />
            </div>

            <div>
              <label className="block text-gray-600 font-bold mb-1">Respiration Rate (/min)</label>
              <input
                type="number"
                value={respirationRate}
                onChange={(e) => setRespirationRate(e.target.value)}
                placeholder="16"
                className="w-full p-2 bg-gray-50 border rounded-xl font-bold text-center"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-600 font-bold mb-1">Consciousness (AVPU)</label>
              <select
                value={avpu}
                onChange={(e) => setAvpu(e.target.value as 'A' | 'V' | 'P' | 'U')}
                className="w-full p-2 bg-gray-50 border rounded-xl font-semibold text-gray-800"
              >
                <option value="A">A — Alert</option>
                <option value="V">V — Voice</option>
                <option value="P">P — Pain</option>
                <option value="U">U — Unresponsive</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-600 font-bold mb-1">Oxygen Delivery</label>
              <button
                type="button"
                onClick={() => setOxygenSupplement(o => !o)}
                className={`w-full p-2 rounded-xl font-bold border transition-all ${
                  oxygenSupplement
                    ? 'bg-amber-500 text-white border-amber-500'
                    : 'bg-gray-50 text-gray-700 border-gray-200'
                }`}
              >
                {oxygenSupplement ? 'On supplemental O2' : 'Room air'}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-gray-600 font-bold mb-1">Blood Glucose (mmol/L - optional)</label>
            <input
              type="number"
              step="0.1"
              value={bloodGlucose}
              onChange={(e) => setBloodGlucose(e.target.value)}
              placeholder="e.g. 5.8"
              className="w-full p-2 bg-gray-50 border rounded-xl font-medium"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
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
              Save Vital Signs
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
