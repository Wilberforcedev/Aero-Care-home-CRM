export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type ResidentStatus = 'Stable' | 'Needs Care' | 'Review Required' | 'Hospital Transfer';
export type MedsStatus = 'Completed' | 'Due Now' | 'Pending' | 'Overdue';
export type IncidentSeverity = 'Low' | 'Medium' | 'High' | 'Critical';
export type CareLogType = 
  | 'General Note'
  | 'Hygiene & Bathing'
  | 'Nutrition & Fluid'
  | 'Repositioning'
  | 'Behaviour & Mood'
  | 'Night Check'
  | 'Family Visit'
  | 'GP / Professional Visit';

export type MoodType = 
  | 'Calm & Content'
  | 'Cheerful & Active'
  | 'Anxious / Agitated'
  | 'Withdrawn'
  | 'Expressing Pain';

export interface DietaryInfo {
  texture: string;
  fluidThickener: boolean;
  diabetic: boolean;
  allergies: string[];
  likes: string;
  dislikes: string;
}

export interface Resident {
  id: string;
  name: string;
  preferredName?: string;
  room: string;
  wing: 'Oak Wing (Ground)' | 'Cedar Wing (1st Fl)' | 'Maple Wing (Memory)';
  dob: string;
  nhsNumber: string;
  admissionDate: string;
  riskLevel: RiskLevel;
  status: ResidentStatus;
  medsStatus: MedsStatus;
  dnacpr: boolean;
  fallRiskScore: number;
  waterlowScore: number;
  keyNotes: string;
  dietary: DietaryInfo;
  gpName: string;
  gpPhone: string;
  gpSurgery?: string;
  nokName: string;
  nokRelation: string;
  nokPhone: string;
  nokEmail?: string;
  nokAddress?: string;
  medicalConditions: string[];
  mobilityNeeds: string;
  sensoryNeeds: string;
  nightRoutine: string;
  photoUrl?: string;
  primaryCarer: string;
  fluidTargetMl: number;
  todayFluidIntakeMl: number;
}

export interface User {
  id: string;
  name: string;
  role: 'Senior Caregiver' | 'Registered Nurse' | 'Manager' | 'Care Assistant';
  email: string;
  avatar: string;
  shift: string;
}

export interface Medication {
  id: string;
  residentId: string;
  residentName: string;
  room: string;
  name: string;
  dosage: string;
  route: string;
  frequency: string;
  timeSlot: 'Morning (08:00)' | 'Lunch (12:00)' | 'Tea (17:00)' | 'Night (21:00)' | 'PRN (As Needed)';
  instructions: string;
  status: 'Given' | 'Due' | 'Refused' | 'Omitted';
  controlledDrug: boolean;
  stockRemaining: number;
}

export interface MARRecord {
  id: string;
  medicationId: string;
  residentId: string;
  scheduledTime: string;
  administeredTime?: string;
  status: 'Given' | 'Refused' | 'Omitted' | 'Pending';
  administeredBy?: string;
  notes?: string;
}

export interface CareLog {
  id: string;
  residentId: string;
  residentName: string;
  room: string;
  timestamp: string;
  type: CareLogType;
  content: string;
  staffName: string;
  staffRole: string;
  mood?: MoodType;
  fluidAmountMl?: number;
}

export interface VitalsRecord {
  id: string;
  residentId: string;
  residentName: string;
  timestamp: string;
  bpSystolic?: number;
  bpDiastolic?: number;
  pulse?: number;
  tempC?: number;
  oxygenSat?: number;
  bloodGlucose?: number;
  weightKg?: number;
  staffName: string;
}

export interface Incident {
  id: string;
  residentId: string;
  residentName: string;
  room: string;
  type: 'Fall' | 'Medication Error' | 'Skin Tear' | 'Challenging Behaviour' | 'Unexplained Bruising' | 'Near Miss';
  severity: IncidentSeverity;
  time: string;
  description: string;
  immediateActions: string;
  reportedBy: string;
  status: 'Open Investigation' | 'Manager Review' | 'Resolved & Closed';
  bodyMapArea?: string;
  witness?: string;
}

export interface Shift {
  id: string;
  staffName: string;
  role: string;
  date: string;
  shiftType: 'Day (07:00-19:00)' | 'Morning (07:00-15:00)' | 'Evening (14:30-22:00)' | 'Night (21:30-07:30)';
  startTime: string;
  endTime: string;
  assignedWing: string;
  status: 'On Duty' | 'Scheduled' | 'Completed' | 'Leave';
}
