import { Resident, Medication, CareLog, VitalsRecord, Incident, Shift } from '../types';
import { MOCK_RESIDENTS, MOCK_MEDICATIONS, MOCK_CARE_LOGS, MOCK_VITALS, MOCK_INCIDENTS, MOCK_SHIFTS } from '../data/mockData';

const KEYS = {
  RESIDENTS: 'aero_crm_residents_v2',
  MEDICATIONS: 'aero_crm_medications_v2',
  CARE_LOGS: 'aero_crm_care_logs_v2',
  VITALS: 'aero_crm_vitals_v2',
  INCIDENTS: 'aero_crm_incidents_v2',
  SHIFTS: 'aero_crm_shifts_v2'
};

export const storageService = {
  getResidents(): Resident[] {
    try {
      const data = localStorage.getItem(KEYS.RESIDENTS);
      return data ? JSON.parse(data) : MOCK_RESIDENTS;
    } catch {
      return MOCK_RESIDENTS;
    }
  },
  saveResidents(residents: Resident[]) {
    try {
      localStorage.setItem(KEYS.RESIDENTS, JSON.stringify(residents));
    } catch (e) {
      console.error(e);
    }
  },

  getMedications(): Medication[] {
    try {
      const data = localStorage.getItem(KEYS.MEDICATIONS);
      return data ? JSON.parse(data) : MOCK_MEDICATIONS;
    } catch {
      return MOCK_MEDICATIONS;
    }
  },
  saveMedications(meds: Medication[]) {
    try {
      localStorage.setItem(KEYS.MEDICATIONS, JSON.stringify(meds));
    } catch (e) {
      console.error(e);
    }
  },

  getCareLogs(): CareLog[] {
    try {
      const data = localStorage.getItem(KEYS.CARE_LOGS);
      return data ? JSON.parse(data) : MOCK_CARE_LOGS;
    } catch {
      return MOCK_CARE_LOGS;
    }
  },
  saveCareLogs(logs: CareLog[]) {
    try {
      localStorage.setItem(KEYS.CARE_LOGS, JSON.stringify(logs));
    } catch (e) {
      console.error(e);
    }
  },

  getVitals(): VitalsRecord[] {
    try {
      const data = localStorage.getItem(KEYS.VITALS);
      return data ? JSON.parse(data) : MOCK_VITALS;
    } catch {
      return MOCK_VITALS;
    }
  },
  saveVitals(vitals: VitalsRecord[]) {
    try {
      localStorage.setItem(KEYS.VITALS, JSON.stringify(vitals));
    } catch (e) {
      console.error(e);
    }
  },

  getIncidents(): Incident[] {
    try {
      const data = localStorage.getItem(KEYS.INCIDENTS);
      return data ? JSON.parse(data) : MOCK_INCIDENTS;
    } catch {
      return MOCK_INCIDENTS;
    }
  },
  saveIncidents(incidents: Incident[]) {
    try {
      localStorage.setItem(KEYS.INCIDENTS, JSON.stringify(incidents));
    } catch (e) {
      console.error(e);
    }
  },

  getShifts(): Shift[] {
    try {
      const data = localStorage.getItem(KEYS.SHIFTS);
      return data ? JSON.parse(data) : MOCK_SHIFTS;
    } catch {
      return MOCK_SHIFTS;
    }
  },
  saveShifts(shifts: Shift[]) {
    try {
      localStorage.setItem(KEYS.SHIFTS, JSON.stringify(shifts));
    } catch (e) {
      console.error(e);
    }
  },

  resetDefaults() {
    localStorage.removeItem(KEYS.RESIDENTS);
    localStorage.removeItem(KEYS.MEDICATIONS);
    localStorage.removeItem(KEYS.CARE_LOGS);
    localStorage.removeItem(KEYS.VITALS);
    localStorage.removeItem(KEYS.INCIDENTS);
    localStorage.removeItem(KEYS.SHIFTS);
  }
};
