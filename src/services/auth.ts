import { User } from '../types';

/**
 * Demo-grade, client-side authentication + role-based access control.
 *
 * IMPORTANT: this runs entirely in the browser. Passwords are verified against
 * salted SHA-256 hashes (no plaintext is stored in the account directory), but
 * any client-side gate can be bypassed by a determined user with devtools. This
 * is suitable for a prototype/demo only — real PHI access control requires
 * server-side authentication and authorization.
 */

export type Permission =
  | 'viewResidents'
  | 'logFluid'
  | 'writeCareLog'
  | 'recordVitals'
  | 'administerMeds'
  | 'witnessControlledDrug'
  | 'reportIncident'
  | 'admitResident'
  | 'manageRoster'
  | 'manageSettings';

interface StaffAccount extends User {
  passwordHash: string;
}

const SALT = 'aero-demo-salt-v1';

// Hashes are SHA-256(`${SALT}:${email}:${password}`). Demo passwords are shown
// on the login screen; the plaintext is NOT kept here.
const STAFF_ACCOUNTS: StaffAccount[] = [
  {
    id: 'stf-1',
    name: 'Sarah Jenkins',
    role: 'Senior Caregiver',
    email: 's.jenkins@aerocare.com',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    shift: 'Morning (07:00-15:00)',
    passwordHash: 'fff8fd2924d71268b6c9d5556c8b2e20050101b51566f0a1c7bddfe393650b56'
  },
  {
    id: 'stf-2',
    name: 'Michael Vance',
    role: 'Registered Nurse',
    email: 'm.vance@aerocare.com',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200',
    shift: 'Morning (07:00-15:00)',
    passwordHash: 'de1a14853231aad8032633ff063dee54a0bfe832230af9ffcad9d87012119e8f'
  },
  {
    id: 'stf-mgr',
    name: 'Dr. Eleanor Ross',
    role: 'Manager',
    email: 'e.ross@aerocare.com',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200',
    shift: 'General Duty',
    passwordHash: '24bf8ca57009bfa8587055df7df8420e5b3f9911787d10e681c8635073fe5e96'
  }
];

const ALL_PERMISSIONS: Permission[] = [
  'viewResidents', 'logFluid', 'writeCareLog', 'recordVitals',
  'administerMeds', 'witnessControlledDrug', 'reportIncident',
  'admitResident', 'manageRoster', 'manageSettings'
];

const ROLE_PERMISSIONS: Record<User['role'], Permission[]> = {
  'Manager': ALL_PERMISSIONS,
  'Registered Nurse': [
    'viewResidents', 'logFluid', 'writeCareLog', 'recordVitals',
    'administerMeds', 'witnessControlledDrug', 'reportIncident'
  ],
  'Senior Caregiver': [
    'viewResidents', 'logFluid', 'writeCareLog', 'recordVitals',
    'administerMeds', 'reportIncident'
  ],
  'Care Assistant': [
    'viewResidents', 'logFluid', 'writeCareLog'
  ]
};

/** Public view of staff (no password hash) for use in selectors/demos. */
export const STAFF_DIRECTORY: User[] = STAFF_ACCOUNTS.map(({ passwordHash, ...user }) => user);

export function can(user: User | null | undefined, permission: Permission): boolean {
  if (!user) return false;
  return ROLE_PERMISSIONS[user.role]?.includes(permission) ?? false;
}

/** Staff eligible to act as the second (witness) signatory for a Controlled Drug. */
export function eligibleWitnesses(excludeUserId?: string): User[] {
  return STAFF_DIRECTORY.filter(u => u.id !== excludeUserId && can(u, 'witnessControlledDrug'));
}

async function sha256Hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/** Verify credentials. Resolves to the signed-in user, or null if invalid. */
export async function login(email: string, password: string): Promise<User | null> {
  const account = STAFF_ACCOUNTS.find(a => a.email.toLowerCase() === email.trim().toLowerCase());
  if (!account) return null;
  const hash = await sha256Hex(`${SALT}:${account.email.toLowerCase()}:${password}`);
  if (hash !== account.passwordHash) return null;
  const { passwordHash, ...user } = account;
  return user;
}

const SESSION_KEY = 'aero_crm_session_v1';

export function persistSession(user: User): void {
  try {
    localStorage.setItem(SESSION_KEY, user.id);
  } catch {
    /* storage unavailable — session simply won't persist */
  }
}

export function loadSession(): User | null {
  try {
    const id = localStorage.getItem(SESSION_KEY);
    if (!id) return null;
    const account = STAFF_ACCOUNTS.find(a => a.id === id);
    if (!account) return null;
    const { passwordHash, ...user } = account;
    return user;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
}
