import React from 'react';
import { X, Settings, RotateCcw, ShieldCheck, Database, Sliders } from 'lucide-react';
import { User } from '../types';
import { can } from '../services/auth';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetData: () => void;
  currentUser: User;
  profileDisplayMode: 'drawer' | 'modal';
  onToggleProfileDisplayMode: (mode: 'drawer' | 'modal') => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onResetData,
  currentUser,
  profileDisplayMode,
  onToggleProfileDisplayMode
}) => {
  if (!isOpen) return null;

  const canManage = can(currentUser, 'manageSettings');

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-5">
        <div className="flex justify-between items-center border-b pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 text-[#042416] rounded-xl">
              <Settings size={18} />
            </div>
            <div>
              <h3 className="font-black text-gray-900 text-base">Aero System Settings</h3>
              <p className="text-xs text-gray-500">Configuration & workflow preferences</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 p-1">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          {/* Profile View Preference */}
          <div className="space-y-1.5 p-3.5 bg-gray-50 rounded-2xl border">
            <label className="block text-gray-700 font-bold flex items-center gap-1.5">
              <Sliders size={14} className="text-[#106E4E]" />
              <span>Resident Profile Workflow Mode</span>
            </label>
            <p className="text-gray-500 text-[11px]">
              Choose how the Resident Profile appears when clicking on any resident from the directory:
            </p>
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => onToggleProfileDisplayMode('drawer')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${
                  profileDisplayMode === 'drawer'
                    ? 'bg-[#042416] text-white border-[#042416] shadow-xs'
                    : 'bg-white text-gray-700 border-gray-200'
                }`}
              >
                Slide-in Panel (Drawer)
              </button>
              <button
                type="button"
                onClick={() => onToggleProfileDisplayMode('modal')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${
                  profileDisplayMode === 'modal'
                    ? 'bg-[#042416] text-white border-[#042416] shadow-xs'
                    : 'bg-white text-gray-700 border-gray-200'
                }`}
              >
                Centered Overlay Modal
              </button>
            </div>
          </div>

          {/* Compliance & Storage */}
          <div className="space-y-2 p-3.5 bg-emerald-50/50 rounded-2xl border border-emerald-100">
            <div className="flex items-center gap-2 text-emerald-900 font-bold">
              <ShieldCheck size={16} />
              <span>NHS / CQC Audit Compliance</span>
            </div>
            <p className="text-[11px] text-emerald-800 leading-relaxed">
              Care logs, medication sign-offs, and fall incident records are timestamped with staff signature attribution and encrypted in local persistent session cache.
            </p>
          </div>

          {/* Reset Demo Data */}
          <div className="pt-2">
            <button
              onClick={() => {
                if (confirm('Reset all demo data back to default initial state?')) {
                  onResetData();
                  onClose();
                }
              }}
              disabled={!canManage}
              className={`w-full py-2.5 bg-gray-100 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-gray-700 font-bold rounded-xl border border-gray-200 transition-colors flex items-center justify-center gap-2 ${!canManage ? 'opacity-40 cursor-not-allowed' : ''}`}
              title={canManage ? 'Reset Demo Clinical Records' : 'Requires Manage Settings permission (Manager only)'}
            >
              <RotateCcw size={14} />
              <span>Reset Demo Clinical Records</span>
            </button>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-[#042416] text-white rounded-xl font-bold text-xs shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
