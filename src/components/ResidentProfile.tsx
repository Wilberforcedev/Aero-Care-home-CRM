import React, { useState, useEffect } from 'react';
import { 
  X, 
  User as UserIcon, 
  Phone, 
  Mail,
  MapPin,
  ShieldAlert, 
  FileText, 
  Pill, 
  Activity, 
  Droplet, 
  AlertTriangle, 
  Printer, 
  Plus,
  HeartPulse,
  Clock,
  Sparkles,
  Moon,
  Eye,
  CheckCircle2,
  Send,
  MessageSquare,
  Stethoscope,
  ChevronRight,
  Maximize2,
  Minimize2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { 
  Resident, 
  Medication, 
  MARRecord, 
  CareLog, 
  VitalsRecord, 
  Incident,
  User,
  CareLogType,
  MoodType
} from '../types';
import { computeNews2 } from '../services/clinical';

export interface ResidentProfileProps {
  resident: Resident;
  isOpen: boolean;
  onClose: () => void;
  medications: Medication[];
  marRecords?: MARRecord[];
  careLogs: CareLog[];
  vitals: VitalsRecord[];
  incidents: Incident[];
  onOpenFluidModal: (resident: Resident) => void;
  onOpenVitalsModal: (resident: Resident) => void;
  onOpenCareNoteModal: (resident: Resident) => void;
  onAddCareLog?: (log: Omit<CareLog, 'id'>) => void;
  currentUser?: User | null;
  /** Whether to render as slide-in right panel or centered overlay modal */
  displayMode?: 'drawer' | 'modal';
}

export const ResidentProfile: React.FC<ResidentProfileProps> = ({
  resident,
  isOpen,
  onClose,
  medications,
  marRecords,
  careLogs,
  vitals,
  incidents,
  onOpenFluidModal,
  onOpenVitalsModal,
  onOpenCareNoteModal,
  onAddCareLog,
  currentUser,
  displayMode = 'drawer'
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'medical' | 'careplan' | 'notes' | 'mar' | 'vitals' | 'incidents'>('overview');
  const [isExpanded, setIsExpanded] = useState(false);

  // Form state for inline staff note posting
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteType, setNewNoteType] = useState<CareLogType>('General Note');
  const [newNoteMood, setNewNoteMood] = useState<MoodType>('Calm & Content');
  const [isPostingNote, setIsPostingNote] = useState(false);
  const [noteSuccess, setNoteSuccess] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const residentMeds = medications.filter(m => m.residentId === resident.id);
  const residentLogs = careLogs.filter(l => l.residentId === resident.id);
  const residentVitals = vitals.filter(v => v.residentId === resident.id);
  const residentIncidents = incidents.filter(i => i.residentId === resident.id);
  const residentMarRecords = (marRecords || []).filter(r => r.residentId === resident.id);

  // Age calculation
  const calculateAge = (dobString: string) => {
    if (!dobString) return 'N/A';
    const birthDate = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handlePrint = () => {
    window.print();
  };

  const handlePostStaffNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim() || !onAddCareLog) return;

    setIsPostingNote(true);
    onAddCareLog({
      residentId: resident.id,
      residentName: resident.name,
      room: resident.room,
      timestamp: new Date().toISOString(),
      type: newNoteType,
      content: newNoteContent.trim(),
      staffName: currentUser?.name || 'Sarah Jenkins',
      staffRole: currentUser?.role || 'Senior Caregiver',
      mood: newNoteMood
    });

    setNewNoteContent('');
    setIsPostingNote(false);
    setNoteSuccess(true);
    setTimeout(() => setNoteSuccess(false), 3000);
  };

  const fluidPercent = Math.min(100, Math.round((resident.todayFluidIntakeMl / resident.fluidTargetMl) * 100));

  // Determine container styling based on displayMode and expanded state
  const isDrawer = displayMode === 'drawer' && !isExpanded;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300 flex justify-end"
      aria-labelledby="resident-profile-heading"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop clickable to close */}
      <div 
        className="absolute inset-0 cursor-pointer" 
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-in Panel / Overlay Container */}
      <div 
        className={`relative z-10 bg-[#F8F9FA] shadow-2xl flex flex-col h-full border-l border-gray-200 transition-all duration-300 ease-in-out ${
          isDrawer 
            ? 'w-full md:w-[750px] lg:w-[860px] animate-in slide-in-from-right' 
            : 'w-full max-w-5xl mx-auto my-auto h-[95vh] rounded-3xl border border-gray-200 animate-in zoom-in-95'
        }`}
      >
        {/* Sticky Top Header Banner */}
        <div className="bg-[#042416] text-white p-5 md:p-6 shrink-0 relative shadow-md">
          {/* Action buttons (Expand / Close) */}
          <div className="absolute top-4 right-4 flex items-center gap-1.5 z-20">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl transition-colors hidden md:flex items-center justify-center"
              title={isExpanded ? 'Collapse to Slide Panel' : 'Expand Full Screen'}
            >
              {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl transition-colors flex items-center justify-center"
              title="Close Profile (Esc)"
            >
              <X size={20} />
            </button>
          </div>

          {/* Resident Identity Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pr-16">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white text-[#042416] flex items-center justify-center text-2xl sm:text-3xl font-black shadow-xl overflow-hidden shrink-0 border-2 border-emerald-400/30">
              {resident.photoUrl ? (
                <img src={resident.photoUrl} alt={resident.name} className="w-full h-full object-cover" />
              ) : (
                <span>{resident.name.charAt(0)}</span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 id="resident-profile-heading" className="text-xl sm:text-2xl font-extrabold tracking-tight text-white truncate">
                  {resident.name}
                </h2>
                {resident.preferredName && (
                  <span className="text-emerald-300 text-xs italic font-medium bg-white/10 px-2.5 py-0.5 rounded-full border border-white/15">
                    "{resident.preferredName}"
                  </span>
                )}
              </div>

              <p className="text-xs text-emerald-100/90 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="font-semibold text-white">Room {resident.room}</span>
                <span>•</span>
                <span>{resident.wing}</span>
                <span>•</span>
                <span>{calculateAge(resident.dob)} yrs ({resident.dob})</span>
                <span>•</span>
                <span className="font-mono text-emerald-200">NHS: {resident.nhsNumber}</span>
              </p>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-1.5 shrink-0">
              <span className={`px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider rounded-full shadow-xs ${
                resident.riskLevel === 'Critical' ? 'bg-rose-600 text-white animate-pulse' :
                resident.riskLevel === 'High' ? 'bg-amber-500 text-white' :
                'bg-emerald-600 text-white'
              }`}>
                {resident.riskLevel} Risk
              </span>

              {resident.dnacpr ? (
                <span className="px-2.5 py-0.5 bg-rose-900/90 text-rose-200 border border-rose-500/80 text-[10px] font-bold rounded-full">
                  DNACPR Active
                </span>
              ) : (
                <span className="px-2.5 py-0.5 bg-emerald-900/60 text-emerald-200 border border-emerald-500/40 text-[10px] font-bold rounded-full">
                  Full CPR
                </span>
              )}
            </div>
          </div>

          {/* Quick Action Ribbon */}
          <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-emerald-300 font-semibold flex items-center gap-1 mr-1">
              <Sparkles size={13} /> Quick Shift Actions:
            </span>
            <button
              onClick={() => onOpenFluidModal(resident)}
              className="px-2.5 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 rounded-xl font-bold flex items-center gap-1.5 transition-colors border border-blue-400/30 active:scale-95"
            >
              <Droplet size={13} /> Log Fluid
            </button>
            <button
              onClick={() => onOpenVitalsModal(resident)}
              className="px-2.5 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 rounded-xl font-bold flex items-center gap-1.5 transition-colors border border-emerald-400/30 active:scale-95"
            >
              <Activity size={13} /> Record Vitals
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className="px-2.5 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 rounded-xl font-bold flex items-center gap-1.5 transition-colors border border-purple-400/30 active:scale-95"
            >
              <Plus size={13} /> Add Note
            </button>
            <button
              onClick={handlePrint}
              className="px-2.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold flex items-center gap-1.5 transition-colors ml-auto active:scale-95"
              title="Print Resident Summary"
            >
              <Printer size={13} /> Print
            </button>
          </div>
        </div>

        {/* Profile Section Navigation Tabs */}
        <div className="bg-white border-b border-gray-200 px-4 sm:px-6 flex gap-1 sm:gap-2 overflow-x-auto shrink-0 shadow-xs">
          {[
            { id: 'overview', label: 'Personal & Contacts', icon: UserIcon },
            { id: 'medical', label: 'Medical & Allergies', icon: Stethoscope },
            { id: 'careplan', label: 'Care Plan & Dietary', icon: FileText },
            { id: 'notes', label: `Staff Notes (${residentLogs.length})`, icon: MessageSquare },
            { id: 'mar', label: `MAR Meds (${residentMeds.length})`, icon: Pill },
            { id: 'vitals', label: `Vitals (${residentVitals.length})`, icon: Activity },
            { id: 'incidents', label: `Incidents (${residentIncidents.length})`, icon: AlertTriangle }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  isActive
                    ? 'border-[#042416] text-[#042416] bg-emerald-50/50'
                    : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* 1. PERSONAL INFORMATION & CONTACTS TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Details */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#042416] flex items-center gap-2 pb-2 border-b">
                    <UserIcon size={16} className="text-[#106E4E]" />
                    <span>Personal Details & Demographics</span>
                  </h3>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-gray-400 font-medium">Full Name</p>
                      <p className="font-bold text-gray-900 text-sm">{resident.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-medium">Preferred Name</p>
                      <p className="font-bold text-gray-800 text-sm">{resident.preferredName || 'None'}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-medium">Date of Birth</p>
                      <p className="font-bold text-gray-800">{resident.dob} ({calculateAge(resident.dob)} yrs)</p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-medium">NHS Identifier</p>
                      <p className="font-mono font-bold text-gray-800">{resident.nhsNumber}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-medium">Admission Date</p>
                      <p className="font-bold text-gray-800">{resident.admissionDate}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-medium">Room & Assigned Wing</p>
                      <p className="font-bold text-emerald-800">Room {resident.room} ({resident.wing})</p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-medium">Key Care Worker</p>
                      <p className="font-bold text-gray-800">{resident.primaryCarer}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-medium">Care Status</p>
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {resident.status}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <p className="text-xs font-bold text-gray-700 mb-1">Key Shift Guidance:</p>
                    <p className="text-xs text-gray-700 italic bg-gray-50 p-3 rounded-xl border border-gray-100 leading-relaxed">
                      "{resident.keyNotes}"
                    </p>
                  </div>
                </div>

                {/* Emergency Contact & GP Surgery */}
                <div className="space-y-4">
                  {/* Emergency Contact */}
                  <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#042416] flex items-center gap-2 pb-2 border-b">
                      <Phone size={16} className="text-[#106E4E]" />
                      <span>Primary Emergency Contact (Next of Kin)</span>
                    </h3>

                    <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-100 space-y-2 text-xs">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-black text-gray-900 text-sm">{resident.nokName}</p>
                          <p className="text-emerald-800 font-semibold">{resident.nokRelation}</p>
                        </div>
                        <span className="px-2 py-0.5 bg-emerald-700 text-white font-bold text-[10px] rounded-md uppercase">
                          Next of Kin
                        </span>
                      </div>

                      <div className="pt-1 space-y-1.5">
                        <p className="text-gray-800 font-bold flex items-center gap-2">
                          <Phone size={14} className="text-emerald-700" />
                          <a href={`tel:${resident.nokPhone}`} className="hover:underline text-emerald-900">
                            {resident.nokPhone}
                          </a>
                        </p>
                        {resident.nokEmail && (
                          <p className="text-gray-700 flex items-center gap-2">
                            <Mail size={14} className="text-emerald-700" />
                            <span>{resident.nokEmail}</span>
                          </p>
                        )}
                        {resident.nokAddress && (
                          <p className="text-gray-700 flex items-center gap-2 pt-0.5">
                            <MapPin size={14} className="text-emerald-700 shrink-0" />
                            <span>{resident.nokAddress}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Registered GP */}
                  <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#042416] flex items-center gap-2 pb-2 border-b">
                      <Stethoscope size={16} className="text-[#106E4E]" />
                      <span>Medical Practice & Registered GP</span>
                    </h3>

                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1 text-xs">
                      <p className="font-bold text-gray-900 text-sm">{resident.gpName}</p>
                      <p className="text-gray-600 font-medium">{resident.gpSurgery || 'NHS Registered Care Practice'}</p>
                      <p className="text-gray-700 font-semibold flex items-center gap-2 pt-1">
                        <Phone size={13} className="text-gray-500" />
                        <a href={`tel:${resident.gpPhone}`} className="text-emerald-800 hover:underline">
                          {resident.gpPhone}
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. MEDICAL HISTORY & ALLERGIES TAB */}
          {activeTab === 'medical' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Allergies & Alerts */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-2 pb-2 border-b">
                    <ShieldAlert size={16} className="text-rose-600" />
                    <span>Allergies & Adverse Reactions</span>
                  </h3>

                  {resident.dietary.allergies && resident.dietary.allergies.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {resident.dietary.allergies.map((allergy, i) => (
                        <span 
                          key={i} 
                          className="px-3 py-1.5 bg-rose-100 text-rose-800 border border-rose-300 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs"
                        >
                          <AlertTriangle size={13} className="text-rose-600" />
                          <span>ALLERGY: {allergy}</span>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
                      <CheckCircle2 size={16} /> No Known Drug Allergies (NKDA)
                    </div>
                  )}
                </div>

                {/* Resuscitation & Clinical Risk Scores */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#042416] flex items-center gap-2 pb-2 border-b">
                    <HeartPulse size={16} className="text-[#106E4E]" />
                    <span>Resuscitation & Risk Assessments</span>
                  </h3>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-gray-50 rounded-xl border">
                      <p className="text-gray-400 font-medium">Resuscitation (DNACPR)</p>
                      <p className={`font-black text-sm mt-0.5 ${resident.dnacpr ? 'text-rose-600' : 'text-emerald-700'}`}>
                        {resident.dnacpr ? 'DNACPR IN PLACE' : 'FULL CPR ACTIVE'}
                      </p>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-xl border">
                      <p className="text-gray-400 font-medium">Fall Risk Rating</p>
                      <p className="font-bold text-gray-900 text-sm mt-0.5">
                        Score {resident.fallRiskScore} / 20 ({resident.riskLevel})
                      </p>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-xl border col-span-2">
                      <p className="text-gray-400 font-medium">Waterlow Pressure Ulcer Risk</p>
                      <p className="font-bold text-gray-900 text-xs mt-0.5">
                        Score: {resident.waterlowScore} ({resident.waterlowScore >= 15 ? 'High Risk - Repositioning Plan Active' : 'Moderate Risk'})
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Diagnoses & Chronic Conditions */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#042416] flex items-center gap-2 pb-2 border-b">
                  <Stethoscope size={16} className="text-[#106E4E]" />
                  <span>Medical Diagnoses & Clinical History</span>
                </h3>

                {resident.medicalConditions && resident.medicalConditions.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {resident.medicalConditions.map((cond, idx) => (
                      <div key={idx} className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center gap-2.5 text-xs font-bold text-gray-800">
                        <div className="w-2 h-2 rounded-full bg-[#106E4E]"></div>
                        <span>{cond}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">No specific chronic conditions cataloged.</p>
                )}
              </div>
            </div>
          )}

          {/* 3. CARE PLAN SUMMARY & DIETARY TAB */}
          {activeTab === 'careplan' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* IDDSI Dietary Profile */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-2 pb-2 border-b">
                    <FileText size={16} />
                    <span>IDDSI Dietary & Swallowing Plan</span>
                  </h3>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between py-1.5 border-b">
                      <span className="text-gray-500 font-medium">Food Texture Stage:</span>
                      <span className="font-bold text-gray-900 bg-gray-100 px-2.5 py-0.5 rounded-lg">{resident.dietary.texture}</span>
                    </div>

                    <div className="flex justify-between py-1.5 border-b">
                      <span className="text-gray-500 font-medium">Fluid Thickener:</span>
                      <span className={`font-bold ${resident.dietary.fluidThickener ? 'text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200' : 'text-gray-800'}`}>
                        {resident.dietary.fluidThickener ? 'Level 2 Thickened Fluids Required' : 'Normal / Thin Fluids'}
                      </span>
                    </div>

                    <div className="flex justify-between py-1.5 border-b">
                      <span className="text-gray-500 font-medium">Diabetic Plan:</span>
                      <span className="font-bold text-gray-800">{resident.dietary.diabetic ? 'Yes (Controlled Sugar)' : 'No'}</span>
                    </div>

                    <div className="pt-1">
                      <p className="text-gray-500 font-bold">Preferences & Dislikes:</p>
                      <p className="text-gray-800 italic mt-1 bg-gray-50 p-2.5 rounded-xl border">
                        {resident.dietary.likes || 'None recorded'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Fluid Target & Hydration Progress */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-blue-800 flex items-center gap-2 pb-2 border-b">
                    <Droplet size={16} className="text-blue-600" />
                    <span>Hydration Target & Daily Progress</span>
                  </h3>

                  <div className="space-y-3">
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs text-gray-500 font-medium">Today's Total Intake</span>
                      <span className="text-xl font-black text-gray-900">
                        {resident.todayFluidIntakeMl} <span className="text-xs text-gray-500 font-normal">/ {resident.fluidTargetMl} ml</span>
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-100 h-3.5 rounded-full overflow-hidden p-0.5 border border-gray-200">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          fluidPercent >= 100 ? 'bg-emerald-500' : fluidPercent >= 60 ? 'bg-blue-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${fluidPercent}%` }}
                      ></div>
                    </div>

                    <div className="flex justify-between text-[11px] font-bold text-gray-500 pt-1">
                      <span>0 ml</span>
                      <span className="text-blue-700">{fluidPercent}% Completed</span>
                      <span>{resident.fluidTargetMl} ml</span>
                    </div>

                    <button
                      onClick={() => onOpenFluidModal(resident)}
                      className="w-full py-2 bg-blue-50 text-blue-800 hover:bg-blue-100 rounded-xl text-xs font-bold border border-blue-200 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Plus size={14} /> Log Fluid Serving
                    </button>
                  </div>
                </div>
              </div>

              {/* Mobility, Sensory & Night Routine Plans */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-600 flex items-center gap-1.5">
                    <Activity size={15} className="text-[#106E4E]" /> Mobility & Transfers
                  </h4>
                  <p className="text-xs text-gray-800 font-medium leading-relaxed bg-gray-50 p-2.5 rounded-xl border">
                    {resident.mobilityNeeds || 'Independent mobility.'}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-600 flex items-center gap-1.5">
                    <Eye size={15} className="text-blue-600" /> Sensory & Communication
                  </h4>
                  <p className="text-xs text-gray-800 font-medium leading-relaxed bg-gray-50 p-2.5 rounded-xl border">
                    {resident.sensoryNeeds || 'No specific sensory aids needed.'}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-600 flex items-center gap-1.5">
                    <Moon size={15} className="text-purple-600" /> Night Routine & Settling
                  </h4>
                  <p className="text-xs text-gray-800 font-medium leading-relaxed bg-gray-50 p-2.5 rounded-xl border">
                    {resident.nightRoutine || 'Standard night check routine.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 4. STAFF NOTES & TIMELINE TAB */}
          {activeTab === 'notes' && (
            <div className="space-y-6">
              {/* Form to Post New Note */}
              <form onSubmit={handlePostStaffNote} className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-xs space-y-3.5">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-[#042416] uppercase tracking-wider flex items-center gap-2">
                    <MessageSquare size={16} className="text-[#106E4E]" />
                    <span>Record New Staff Update / Shift Care Note</span>
                  </h3>
                  {noteSuccess && (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                      <CheckCircle2 size={13} /> Note Saved to Log!
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-gray-500 font-bold mb-1">Care Category</label>
                    <select
                      value={newNoteType}
                      onChange={(e) => setNewNoteType(e.target.value as CareLogType)}
                      className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl font-medium text-gray-800 outline-none focus:ring-2 focus:ring-[#042416]"
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
                    <label className="block text-gray-500 font-bold mb-1">Resident Mood State</label>
                    <select
                      value={newNoteMood}
                      onChange={(e) => setNewNoteMood(e.target.value as MoodType)}
                      className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl font-medium text-gray-800 outline-none focus:ring-2 focus:ring-[#042416]"
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
                  <textarea
                    rows={3}
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                    placeholder={`Enter shift observation for ${resident.name} (e.g., resident settled comfortably, enjoyed morning walk, skin checked)...`}
                    className="w-full p-3 text-xs bg-gray-50 border border-gray-300 rounded-xl font-medium text-gray-800 outline-none focus:ring-2 focus:ring-[#042416]"
                    required
                  />
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-gray-400">
                    Signing as: <strong>{currentUser?.name || 'Sarah Jenkins'}</strong> ({currentUser?.role || 'Senior Caregiver'})
                  </span>
                  <button
                    type="submit"
                    disabled={isPostingNote || !newNoteContent.trim()}
                    className="px-4 py-2 bg-[#042416] hover:bg-[#083a24] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all disabled:opacity-50 active:scale-95"
                  >
                    <Send size={13} />
                    <span>Save Note</span>
                  </button>
                </div>
              </form>

              {/* Timeline Feed */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Care Logs Timeline ({residentLogs.length} updates)
                </h3>

                {residentLogs.length === 0 ? (
                  <div className="text-center py-8 bg-white rounded-2xl border text-xs text-gray-400">
                    No care notes recorded yet for {resident.name}.
                  </div>
                ) : (
                  residentLogs.map(log => (
                    <div key={log.id} className="p-4 bg-white rounded-2xl border border-gray-200 text-xs space-y-2 shadow-2xs">
                      <div className="flex justify-between items-center border-b pb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#042416] bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-100">
                            {log.type}
                          </span>
                          {log.mood && (
                            <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full">
                              {log.mood}
                            </span>
                          )}
                        </div>
                        <span className="text-gray-400 font-medium">
                          {new Date(log.timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                        </span>
                      </div>

                      <p className="text-gray-800 font-medium leading-relaxed">{log.content}</p>

                      <div className="flex justify-between items-center text-[11px] text-gray-400 pt-1">
                        <span>Logged by: <strong>{log.staffName}</strong> ({log.staffRole})</span>
                        {log.fluidAmountMl && (
                          <span className="text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded">
                            +{log.fluidAmountMl} ml fluid
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* 5. MAR (MEDICATIONS) TAB */}
          {activeTab === 'mar' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600">Active Prescriptions ({residentMeds.length})</h3>
                <span className="text-xs text-emerald-800 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  MAR Round Status: {resident.medsStatus}
                </span>
              </div>

              {residentMeds.length === 0 ? (
                <div className="text-center py-8 bg-white rounded-2xl border text-xs text-gray-400">
                  No active prescriptions on record for this resident.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {residentMeds.map(m => (
                    <div key={m.id} className="p-4 bg-white rounded-2xl border border-gray-200 shadow-xs space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-gray-900 text-sm">{m.name}</h4>
                          <p className="text-xs font-bold text-[#106E4E]">{m.dosage} • {m.route}</p>
                        </div>
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-800 font-bold text-[10px] rounded-lg border border-blue-200">
                          {m.timeSlot}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">{m.instructions}</p>
                      <div className="flex justify-between items-center text-[10px] text-gray-400 pt-2 border-t">
                        <span>Stock Remaining: <strong>{m.stockRemaining}</strong> doses</span>
                        {m.controlledDrug && (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-900 font-bold rounded">
                            Controlled Drug (CD)
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* eMAR Administration History */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-3">
                  eMAR Administration History ({residentMarRecords.length})
                </h3>
                {residentMarRecords.length === 0 ? (
                  <p className="text-xs text-gray-400 py-4 text-center">
                    No administrations signed off yet for this resident.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-gray-50 border-b text-gray-600">
                        <tr>
                          <th className="p-2.5">Date/Time</th>
                          <th className="p-2.5">Medication</th>
                          <th className="p-2.5">Outcome</th>
                          <th className="p-2.5">Administered By</th>
                          <th className="p-2.5">Second Signature</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {residentMarRecords.map(rec => {
                          const med = medications.find(m => m.id === rec.medicationId);
                          return (
                            <tr key={rec.id} className="hover:bg-gray-50">
                              <td className="p-2.5 font-bold text-gray-900 whitespace-nowrap">
                                {rec.administeredTime
                                  ? new Date(rec.administeredTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })
                                  : '-'}
                              </td>
                              <td className="p-2.5 font-semibold text-gray-800">
                                {med ? `${med.name} (${med.dosage})` : rec.medicationId}
                              </td>
                              <td className="p-2.5">
                                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-lg border ${
                                  rec.status === 'Given' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                                  rec.status === 'Refused' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                                  rec.status === 'Omitted' ? 'bg-rose-50 text-rose-800 border-rose-200' :
                                  'bg-gray-100 text-gray-700 border-gray-200'
                                }`}>
                                  {rec.status}
                                </span>
                              </td>
                              <td className="p-2.5 text-gray-600">{rec.administeredBy || '-'}</td>
                              <td className="p-2.5 text-gray-600">{rec.secondSignature || '-'}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
          {activeTab === 'vitals' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-xs text-gray-800 uppercase tracking-wider">Recorded Vital Signs History</h3>
                  <button
                    onClick={() => onOpenVitalsModal(resident)}
                    className="px-3 py-1 bg-[#042416] text-white rounded-lg text-xs font-bold hover:bg-[#083a24] transition-colors flex items-center gap-1"
                  >
                    <Plus size={13} /> Record New Vitals
                  </button>
                </div>

                {residentVitals.length === 0 ? (
                  <p className="text-xs text-gray-400 py-6 text-center">No vital signs logged yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-gray-50 border-b text-gray-600">
                        <tr>
                          <th className="p-3">Date/Time</th>
                          <th className="p-3">Blood Pressure</th>
                          <th className="p-3">Pulse</th>
                          <th className="p-3">Temp (°C)</th>
                          <th className="p-3">SpO2 (%)</th>
                          <th className="p-3">Glucose</th>
                          <th className="p-3">NEWS2</th>
                          <th className="p-3">Recorded By</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {residentVitals.map(v => {
                          const news = computeNews2(v);
                          const newsClass =
                            news.level === 'High' ? 'bg-rose-100 text-rose-800 border-rose-200' :
                            news.level === 'Low-medium' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                            news.level === 'Low' ? 'bg-yellow-50 text-yellow-800 border-yellow-200' :
                            'bg-emerald-50 text-emerald-800 border-emerald-200';
                          return (
                          <tr key={v.id} className="hover:bg-gray-50">
                            <td className="p-3 font-bold text-gray-900">
                              {new Date(v.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                            </td>
                            <td className="p-3 font-semibold text-gray-800">{v.bpSystolic ? `${v.bpSystolic}/${v.bpDiastolic}` : '-'}</td>
                            <td className="p-3 font-semibold text-gray-800">{v.pulse ? `${v.pulse} bpm` : '-'}</td>
                            <td className="p-3 font-semibold text-gray-800">{v.tempC ? `${v.tempC} °C` : '-'}</td>
                            <td className="p-3 font-semibold text-gray-800">{v.oxygenSat ? `${v.oxygenSat}%` : '-'}</td>
                            <td className="p-3 font-semibold text-gray-800">{v.bloodGlucose ? `${v.bloodGlucose} mmol` : '-'}</td>
                            <td className="p-3">
                              <span
                                className={`px-2 py-0.5 text-[10px] font-black rounded-lg border ${newsClass}`}
                                title={news.triggers.length ? news.triggers.map(t => `${t.parameter} ${t.value} (+${t.points})`).join(', ') : 'No parameters scored above normal'}
                              >
                                {news.score} · {news.level}
                              </span>
                            </td>
                            <td className="p-3 text-gray-500">{v.staffName}</td>
                          </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 7. INCIDENTS TAB */}
          {activeTab === 'incidents' && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600">Documented Incidents & Safeguarding ({residentIncidents.length})</h3>
              {residentIncidents.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-2xl border text-xs text-gray-400">
                  No incident reports recorded for {resident.name}.
                </div>
              ) : (
                residentIncidents.map(inc => (
                  <div key={inc.id} className="p-4 bg-white rounded-2xl border border-rose-200 text-xs space-y-2 shadow-2xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-rose-800 bg-rose-50 px-2.5 py-0.5 rounded-lg border border-rose-100">
                        {inc.type} ({inc.severity})
                      </span>
                      <span className="font-bold text-gray-500">{inc.status}</span>
                    </div>
                    <p className="text-gray-800 font-medium">{inc.description}</p>
                    <p className="text-[11px] text-gray-500">Immediate Action: {inc.immediateActions}</p>
                    <p className="text-[10px] text-gray-400 pt-1">Reported by: {inc.reportedBy} • {inc.time}</p>
                  </div>
                ))
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
