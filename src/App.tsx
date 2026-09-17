import React, { useState, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { ResidentDirectory } from './components/ResidentDirectory';
import { ResidentProfile } from './components/ResidentProfile';
import { MARModule } from './components/MARModule';
import { CareLogsModule } from './components/CareLogsModule';
import { IncidentsModule } from './components/IncidentsModule';
import { RosterModule } from './components/RosterModule';
import { FluidModal, VitalsModal } from './components/RapidEntryModals';
import { NewResidentModal } from './components/NewResidentModal';
import { SettingsModal } from './components/SettingsModal';
import { storageService } from './services/storageService';
import { CURRENT_USER } from './data/mockData';
import { 
  Resident, 
  Medication, 
  CareLog, 
  VitalsRecord, 
  Incident, 
  Shift, 
  User 
} from './types';

export function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(CURRENT_USER);
  const [activeTab, setActiveTab] = useState<string>('residents');

  // Application Data States (backed by storageService)
  const [residents, setResidents] = useState<Resident[]>(() => storageService.getResidents());
  const [medications, setMedications] = useState<Medication[]>(() => storageService.getMedications());
  const [careLogs, setCareLogs] = useState<CareLog[]>(() => storageService.getCareLogs());
  const [vitals, setVitals] = useState<VitalsRecord[]>(() => storageService.getVitals());
  const [incidents, setIncidents] = useState<Incident[]>(() => storageService.getIncidents());
  const [shifts, setShifts] = useState<Shift[]>(() => storageService.getShifts());

  // Slide-in / Overlay Resident Profile State
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null);
  const [profileDisplayMode, setProfileDisplayMode] = useState<'drawer' | 'modal'>('drawer');

  // Modal Control States
  const [fluidModalResident, setFluidModalResident] = useState<Resident | null>(null);
  const [isFluidModalOpen, setIsFluidModalOpen] = useState(false);

  const [vitalsModalResident, setVitalsModalResident] = useState<Resident | null>(null);
  const [isVitalsModalOpen, setIsVitalsModalOpen] = useState(false);

  const [isIncidentModalOpen, setIsIncidentModalOpen] = useState(false);
  const [isNewResidentModalOpen, setIsNewResidentModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Sync back to local storage whenever states change
  useEffect(() => {
    storageService.saveResidents(residents);
  }, [residents]);

  useEffect(() => {
    storageService.saveMedications(medications);
  }, [medications]);

  useEffect(() => {
    storageService.saveCareLogs(careLogs);
  }, [careLogs]);

  useEffect(() => {
    storageService.saveVitals(vitals);
  }, [vitals]);

  useEffect(() => {
    storageService.saveIncidents(incidents);
  }, [incidents]);

  useEffect(() => {
    storageService.saveShifts(shifts);
  }, [shifts]);

  // If resident was updated (e.g. fluid added), keep selectedResident fresh
  useEffect(() => {
    if (selectedResident) {
      const refreshed = residents.find(r => r.id === selectedResident.id);
      if (refreshed) {
        setSelectedResident(refreshed);
      }
    }
  }, [residents]);

  // Handlers
  const handleSelectResident = (resident: Resident) => {
    setSelectedResident(resident);
  };

  const handleCloseResidentProfile = () => {
    setSelectedResident(null);
  };

  const handleAddCareLog = (newLogData: Omit<CareLog, 'id'>) => {
    const newLog: CareLog = {
      ...newLogData,
      id: `log-${Date.now()}`
    };
    setCareLogs(prev => [newLog, ...prev]);

    // If fluid was recorded in the care log, update resident fluid total
    if (newLogData.fluidAmountMl && newLogData.fluidAmountMl > 0) {
      setResidents(prev => prev.map(r => {
        if (r.id === newLogData.residentId) {
          return {
            ...r,
            todayFluidIntakeMl: r.todayFluidIntakeMl + newLogData.fluidAmountMl!
          };
        }
        return r;
      }));
    }
  };

  const handleFluidSubmit = (residentId: string, amountMl: number, fluidType: string) => {
    const targetRes = residents.find(r => r.id === residentId);
    if (!targetRes) return;

    // Update resident intake
    setResidents(prev => prev.map(r => {
      if (r.id === residentId) {
        return {
          ...r,
          todayFluidIntakeMl: r.todayFluidIntakeMl + amountMl
        };
      }
      return r;
    }));

    // Add corresponding care log
    const log: CareLog = {
      id: `log-${Date.now()}`,
      residentId,
      residentName: targetRes.name,
      room: targetRes.room,
      timestamp: new Date().toISOString(),
      type: 'Nutrition & Fluid',
      content: `Served ${amountMl} ml of ${fluidType}. Consumed comfortably with no coughing or aspiration signs.`,
      staffName: currentUser?.name || 'Staff',
      staffRole: currentUser?.role || 'Caregiver',
      fluidAmountMl: amountMl,
      mood: 'Calm & Content'
    };
    setCareLogs(prev => [log, ...prev]);
  };

  const handleVitalsSubmit = (newVitals: Omit<VitalsRecord, 'id'>) => {
    const record: VitalsRecord = {
      ...newVitals,
      id: `vit-${Date.now()}`
    };
    setVitals(prev => [record, ...prev]);

    // Also add a care log note for audit
    const res = residents.find(r => r.id === newVitals.residentId);
    if (res) {
      const summaryParts = [];
      if (newVitals.bpSystolic) summaryParts.push(`BP ${newVitals.bpSystolic}/${newVitals.bpDiastolic}`);
      if (newVitals.pulse) summaryParts.push(`Pulse ${newVitals.pulse} bpm`);
      if (newVitals.tempC) summaryParts.push(`Temp ${newVitals.tempC}°C`);
      if (newVitals.oxygenSat) summaryParts.push(`SpO2 ${newVitals.oxygenSat}%`);
      if (newVitals.bloodGlucose) summaryParts.push(`Glucose ${newVitals.bloodGlucose} mmol`);

      const log: CareLog = {
        id: `log-${Date.now()}`,
        residentId: res.id,
        residentName: res.name,
        room: res.room,
        timestamp: new Date().toISOString(),
        type: 'General Note',
        content: `Vital signs recorded: ${summaryParts.join(', ')}. All within baseline parameters.`,
        staffName: currentUser?.name || 'Staff',
        staffRole: currentUser?.role || 'Caregiver',
        mood: 'Calm & Content'
      };
      setCareLogs(prev => [log, ...prev]);
    }
  };

  const handleUpdateMedicationStatus = (medId: string, status: 'Given' | 'Refused' | 'Omitted') => {
    setMedications(prev => prev.map(m => {
      if (m.id === medId) {
        return { ...m, status };
      }
      return m;
    }));

    // Check if resident still has meds due
    const med = medications.find(m => m.id === medId);
    if (med) {
      const remainingDue = medications.filter(m => m.residentId === med.residentId && m.id !== medId && m.status === 'Due').length;
      setResidents(prev => prev.map(r => {
        if (r.id === med.residentId) {
          return {
            ...r,
            medsStatus: remainingDue === 0 ? 'Completed' : 'Due Now'
          };
        }
        return r;
      }));

      // Add Care Log entry for MAR sign-off
      const log: CareLog = {
        id: `log-${Date.now()}`,
        residentId: med.residentId,
        residentName: med.residentName,
        room: med.room,
        timestamp: new Date().toISOString(),
        type: 'General Note',
        content: `eMAR: ${med.name} (${med.dosage}) administered and signed off as "${status}".`,
        staffName: currentUser?.name || 'Staff',
        staffRole: currentUser?.role || 'Caregiver'
      };
      setCareLogs(prev => [log, ...prev]);
    }
  };

  const handleAddIncident = (newIncData: Omit<Incident, 'id'>) => {
    const inc: Incident = {
      ...newIncData,
      id: `inc-${Date.now()}`
    };
    setIncidents(prev => [inc, ...prev]);

    // Update resident status if needed
    setResidents(prev => prev.map(r => {
      if (r.id === newIncData.residentId) {
        return {
          ...r,
          status: 'Needs Care',
          riskLevel: newIncData.severity === 'Critical' ? 'Critical' : 'High'
        };
      }
      return r;
    }));
  };

  const handleAddResident = (newRes: Resident) => {
    setResidents(prev => [newRes, ...prev]);
    setSelectedResident(newRes);
  };

  const handleResetData = () => {
    storageService.resetDefaults();
    setResidents(storageService.getResidents());
    setMedications(storageService.getMedications());
    setCareLogs(storageService.getCareLogs());
    setVitals(storageService.getVitals());
    setIncidents(storageService.getIncidents());
    setShifts(storageService.getShifts());
    setSelectedResident(null);
  };

  // If no user is logged in, show the 3D LoginPage
  if (!currentUser) {
    return <LoginPage onLogin={(user) => setCurrentUser(user)} />;
  }

  return (
    <div className="flex h-screen bg-[#F8F9FA] text-gray-900 overflow-hidden font-sans">
      {/* Primary Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onLogout={() => setCurrentUser(null)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header
          activeTab={activeTab}
          currentUser={currentUser}
          residents={residents}
          onOpenFluidModal={() => {
            setFluidModalResident(residents[0] || null);
            setIsFluidModalOpen(true);
          }}
          onOpenVitalsModal={() => {
            setVitalsModalResident(residents[0] || null);
            setIsVitalsModalOpen(true);
          }}
          onOpenCareNoteModal={() => {
            setActiveTab('logs');
          }}
          onOpenIncidentModal={() => {
            setIsIncidentModalOpen(true);
          }}
        />

        {/* Dynamic Main Body with smooth scroll */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && (
              <DashboardView
                residents={residents}
                medications={medications}
                careLogs={careLogs}
                incidents={incidents}
                currentUser={currentUser}
                onSelectResident={handleSelectResident}
                onNavigateTab={(tab) => setActiveTab(tab)}
                onOpenFluidModal={(res) => {
                  setFluidModalResident(res);
                  setIsFluidModalOpen(true);
                }}
                onOpenVitalsModal={(res) => {
                  setVitalsModalResident(res);
                  setIsVitalsModalOpen(true);
                }}
              />
            )}

            {activeTab === 'residents' && (
              <ResidentDirectory
                residents={residents}
                onSelectResident={handleSelectResident}
                onOpenFluidModal={(res) => {
                  setFluidModalResident(res);
                  setIsFluidModalOpen(true);
                }}
                onOpenVitalsModal={(res) => {
                  setVitalsModalResident(res);
                  setIsVitalsModalOpen(true);
                }}
                onOpenCareNoteModal={(res) => {
                  setSelectedResident(res);
                }}
                onNewResidentClick={() => setIsNewResidentModalOpen(true)}
              />
            )}

            {activeTab === 'mar' && (
              <MARModule
                medications={medications}
                residents={residents}
                currentUser={currentUser}
                onUpdateMedicationStatus={handleUpdateMedicationStatus}
                onSelectResident={handleSelectResident}
              />
            )}

            {activeTab === 'logs' && (
              <CareLogsModule
                careLogs={careLogs}
                residents={residents}
                currentUser={currentUser}
                onAddCareLog={handleAddCareLog}
                onSelectResident={handleSelectResident}
              />
            )}

            {activeTab === 'incidents' && (
              <IncidentsModule
                incidents={incidents}
                residents={residents}
                currentUser={currentUser}
                onAddIncident={handleAddIncident}
                onSelectResident={handleSelectResident}
              />
            )}

            {activeTab === 'roster' && (
              <RosterModule
                shifts={shifts}
                currentUser={currentUser}
              />
            )}
          </div>
        </main>
      </div>

      {/* SLIDE-IN PANEL / OVERLAY: ResidentProfile Component */}
      {selectedResident && (
        <ResidentProfile
          resident={selectedResident}
          isOpen={Boolean(selectedResident)}
          onClose={handleCloseResidentProfile}
          medications={medications}
          careLogs={careLogs}
          vitals={vitals}
          incidents={incidents}
          currentUser={currentUser}
          displayMode={profileDisplayMode}
          onAddCareLog={handleAddCareLog}
          onOpenFluidModal={(res) => {
            setFluidModalResident(res);
            setIsFluidModalOpen(true);
          }}
          onOpenVitalsModal={(res) => {
            setVitalsModalResident(res);
            setIsVitalsModalOpen(true);
          }}
          onOpenCareNoteModal={(res) => {
            // Handled inline in the ResidentProfile notes tab
          }}
        />
      )}

      {/* Rapid Action Modals */}
      <FluidModal
        resident={fluidModalResident}
        residents={residents}
        isOpen={isFluidModalOpen}
        onClose={() => {
          setIsFluidModalOpen(false);
          setFluidModalResident(null);
        }}
        onSubmit={handleFluidSubmit}
      />

      <VitalsModal
        resident={vitalsModalResident}
        residents={residents}
        isOpen={isVitalsModalOpen}
        onClose={() => {
          setIsVitalsModalOpen(false);
          setVitalsModalResident(null);
        }}
        onSubmit={handleVitalsSubmit}
        currentUser={currentUser}
      />

      <NewResidentModal
        isOpen={isNewResidentModalOpen}
        onClose={() => setIsNewResidentModalOpen(false)}
        onAddResident={handleAddResident}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onResetData={handleResetData}
        profileDisplayMode={profileDisplayMode}
        onToggleProfileDisplayMode={setProfileDisplayMode}
      />
    </div>
  );
}
export default App;
