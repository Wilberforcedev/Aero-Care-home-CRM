import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  MessageSquare, 
  Droplet, 
  User as UserIcon, 
  Clock, 
  Smile, 
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { CareLog, Resident, User, CareLogType, MoodType } from '../types';

interface CareLogsModuleProps {
  careLogs: CareLog[];
  residents: Resident[];
  currentUser: User;
  onAddCareLog: (log: Omit<CareLog, 'id'>) => void;
  onSelectResident: (resident: Resident) => void;
}

export const CareLogsModule: React.FC<CareLogsModuleProps> = ({
  careLogs,
  residents,
  currentUser,
  onAddCareLog,
  onSelectResident
}) => {
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedResidentId, setSelectedResidentId] = useState<string>('All');
  const [showAddForm, setShowAddForm] = useState(false);

  // Form State
  const [formResidentId, setFormResidentId] = useState(residents[0]?.id || '');
  const [formType, setFormType] = useState<CareLogType>('General Note');
  const [formContent, setFormContent] = useState('');
  const [formMood, setFormMood] = useState<MoodType>('Calm & Content');
  const [formFluidMl, setFormFluidMl] = useState('');

  const filteredLogs = careLogs.filter(log => {
    const matchType = selectedType === 'All' || log.type === selectedType;
    const matchResident = selectedResidentId === 'All' || log.residentId === selectedResidentId;
    return matchType && matchResident;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = residents.find(r => r.id === formResidentId);
    if (!res || !formContent.trim()) return;

    onAddCareLog({
      residentId: res.id,
      residentName: res.name,
      room: res.room,
      timestamp: new Date().toISOString(),
      type: formType,
      content: formContent.trim(),
      staffName: currentUser.name,
      staffRole: currentUser.role,
      mood: formMood,
      fluidAmountMl: formFluidMl ? parseInt(formFluidMl, 10) : undefined
    });

    setFormContent('');
    setFormFluidMl('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-gray-900 tracking-tight">Shift Care Logs & Observations</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Continuous real-time observations, hygiene logs, nutrition/fluid tracking, and emotional wellbeing.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2.5 bg-[#042416] hover:bg-[#083a24] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-xs self-start sm:self-auto"
        >
          <Plus size={15} />
          <span>{showAddForm ? 'Close Entry Form' : 'Log New Observation'}</span>
        </button>
      </div>

      {/* Add Observation Form Drawer/Box */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl border border-emerald-300 shadow-md space-y-4 animate-in fade-in">
          <h3 className="text-sm font-extrabold text-[#042416] uppercase tracking-wider flex items-center gap-2">
            <FileText size={16} className="text-[#106E4E]" />
            <span>Record Care Observation</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-gray-600 font-bold mb-1">Resident</label>
              <select
                value={formResidentId}
                onChange={(e) => setFormResidentId(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border rounded-xl font-semibold text-gray-800"
              >
                {residents.map(r => (
                  <option key={r.id} value={r.id}>{r.name} (Room {r.room})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-600 font-bold mb-1">Care Category</label>
              <select
                value={formType}
                onChange={(e) => setFormType(e.target.value as CareLogType)}
                className="w-full p-2.5 bg-gray-50 border rounded-xl font-semibold text-gray-800"
              >
                <option value="General Note">General Note</option>
                <option value="Hygiene & Bathing">Hygiene & Bathing</option>
                <option value="Nutrition & Fluid">Nutrition & Fluid</option>
                <option value="Repositioning">Repositioning</option>
                <option value="Behaviour & Mood">Behaviour & Mood</option>
                <option value="Night Check">Night Check</option>
                <option value="Family Visit">Family Visit</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-600 font-bold mb-1">Mood State</label>
              <select
                value={formMood}
                onChange={(e) => setFormMood(e.target.value as MoodType)}
                className="w-full p-2.5 bg-gray-50 border rounded-xl font-semibold text-gray-800"
              >
                <option value="Calm & Content">Calm & Content</option>
                <option value="Cheerful & Active">Cheerful & Active</option>
                <option value="Anxious / Agitated">Anxious / Agitated</option>
                <option value="Withdrawn">Withdrawn</option>
                <option value="Expressing Pain">Expressing Pain</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-600 font-bold mb-1 text-xs">Observation Details</label>
            <textarea
              rows={3}
              value={formContent}
              onChange={(e) => setFormContent(e.target.value)}
              placeholder="Describe observation, assistance provided, dietary consumption, or skin condition..."
              className="w-full p-3 bg-gray-50 border rounded-xl text-xs font-medium text-gray-800 outline-none focus:ring-2 focus:ring-[#042416]"
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2 text-xs">
              <label className="text-gray-500 font-bold">Fluid Intake (optional ml):</label>
              <input
                type="number"
                value={formFluidMl}
                onChange={(e) => setFormFluidMl(e.target.value)}
                placeholder="200"
                className="w-24 p-2 bg-gray-50 border rounded-lg text-xs"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#042416] text-white rounded-xl text-xs font-bold shadow-md"
              >
                Save Care Log
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-wrap items-center gap-3 text-xs">
        <div className="flex items-center gap-2">
          <label className="font-bold text-gray-500">Filter Resident:</label>
          <select
            value={selectedResidentId}
            onChange={(e) => setSelectedResidentId(e.target.value)}
            className="p-2 bg-gray-50 border rounded-xl font-semibold"
          >
            <option value="All">All Residents</option>
            {residents.map(r => (
              <option key={r.id} value={r.id}>{r.name} (Room {r.room})</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="font-bold text-gray-500">Care Category:</label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="p-2 bg-gray-50 border rounded-xl font-semibold"
          >
            <option value="All">All Categories</option>
            <option value="General Note">General Note</option>
            <option value="Hygiene & Bathing">Hygiene & Bathing</option>
            <option value="Nutrition & Fluid">Nutrition & Fluid</option>
            <option value="Repositioning">Repositioning</option>
            <option value="Behaviour & Mood">Behaviour & Mood</option>
            <option value="Night Check">Night Check</option>
            <option value="Family Visit">Family Visit</option>
          </select>
        </div>
      </div>

      {/* Feed List */}
      <div className="space-y-3">
        {filteredLogs.map(log => {
          const resident = residents.find(r => r.id === log.residentId);

          return (
            <div key={log.id} className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2.5">
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => resident && onSelectResident(resident)}
                    className="font-black text-gray-900 text-sm hover:text-[#106E4E] transition-colors"
                  >
                    {log.residentName} <span className="text-gray-400 font-normal text-xs">(Room {log.room})</span>
                  </button>
                  <span className="px-2.5 py-0.5 bg-emerald-50 text-[#042416] border border-emerald-200 text-xs font-bold rounded-lg">
                    {log.type}
                  </span>
                  {log.mood && (
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-[10px] font-bold rounded-full">
                      {log.mood}
                    </span>
                  )}
                </div>

                <span className="text-xs text-gray-400 font-medium">
                  {new Date(log.timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                </span>
              </div>

              <p className="text-gray-800 text-xs font-medium leading-relaxed">{log.content}</p>

              <div className="flex justify-between items-center text-[11px] text-gray-400 pt-1">
                <span>Signed by: <strong className="text-gray-700">{log.staffName}</strong> ({log.staffRole})</span>
                {log.fluidAmountMl && (
                  <span className="text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    +{log.fluidAmountMl} ml recorded
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
