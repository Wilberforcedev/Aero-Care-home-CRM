import React, { useState } from 'react';
import { CalendarDays, Clock, UserCheck, ShieldCheck, Plus, CheckCircle2 } from 'lucide-react';
import { Shift, User } from '../types';

interface RosterModuleProps {
  shifts: Shift[];
  currentUser: User;
}

export const RosterModule: React.FC<RosterModuleProps> = ({
  shifts,
  currentUser
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-gray-900 tracking-tight">Staff Duty Roster & Allocations</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Shift rotas, registered nurse cover, and wing caregiver allocations.
          </p>
        </div>

        <div className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5">
          <CheckCircle2 size={15} /> Safe Staffing Level: Compliant
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {shifts.map(shift => (
          <div key={shift.id} className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs space-y-3">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold bg-blue-50 text-blue-800 px-2 py-0.5 rounded-lg border border-blue-200">
                {shift.shiftType}
              </span>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase rounded-full">
                {shift.status}
              </span>
            </div>

            <div>
              <h3 className="font-extrabold text-gray-900 text-base">{shift.staffName}</h3>
              <p className="text-xs font-bold text-[#106E4E]">{shift.role}</p>
              <p className="text-xs text-gray-500 mt-1">{shift.assignedWing}</p>
            </div>

            <div className="pt-2 border-t text-[11px] text-gray-400 flex items-center gap-1.5">
              <Clock size={13} />
              <span>{shift.startTime} - {shift.endTime}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
