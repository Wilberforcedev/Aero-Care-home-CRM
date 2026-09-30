/**
 * NEWS2 (National Early Warning Score 2) calculator.
 * Implements standard Royal College of Physicians thresholds. Only parameters
 * that are actually present are scored, so a partial set still yields a usable
 * (if incomplete) total.
 */

export type NewsInput = {
  respirationRate?: number;
  oxygenSat?: number;
  oxygenSupplement?: boolean;
  bpSystolic?: number;
  pulse?: number;
  tempC?: number;
  avpu?: 'A' | 'V' | 'P' | 'U';
};

export type NewsTrigger = {
  parameter: string;
  value: string;
  points: number;
};

export type NewsResult = {
  score: number;
  level: 'Very low' | 'Low' | 'Low-medium' | 'High';
  response: string;
  monitoring: string;
  triggers: NewsTrigger[];
  hasSingleThree: boolean;
  complete: boolean;
};

const ALL_PARAMS = ['respirationRate', 'oxygenSat', 'bpSystolic', 'pulse', 'tempC', 'avpu'] as const;

function scoreResp(v?: number): number {
  if (v == null) return 0;
  if (v <= 8) return 3;
  if (v <= 11) return 1;
  if (v <= 20) return 0;
  if (v <= 24) return 2;
  return 3;
}

function scoreSpO2(v?: number): number {
  if (v == null) return 0;
  if (v <= 91) return 3;
  if (v <= 93) return 2;
  if (v <= 95) return 1;
  return 0;
}

function scoreBp(v?: number): number {
  if (v == null) return 0;
  if (v <= 90) return 3;
  if (v <= 100) return 2;
  if (v <= 110) return 1;
  if (v <= 219) return 0;
  return 3;
}

function scorePulse(v?: number): number {
  if (v == null) return 0;
  if (v <= 40) return 3;
  if (v <= 50) return 1;
  if (v <= 90) return 0;
  if (v <= 110) return 1;
  if (v <= 130) return 2;
  return 3;
}

function scoreTemp(v?: number): number {
  if (v == null) return 0;
  if (v <= 35) return 3;
  if (v <= 36) return 1;
  if (v <= 38) return 0;
  if (v <= 39) return 1;
  return 2;
}

function scoreAvpu(v?: 'A' | 'V' | 'P' | 'U'): number {
  if (v == null || v === 'A') return 0;
  return 3;
}

export function computeNews2(input: NewsInput): NewsResult {
  const triggers: NewsTrigger[] = [];
  let score = 0;
  let hasSingleThree = false;

  const add = (parameter: string, value: string, points: number) => {
    if (points > 0) {
      triggers.push({ parameter, value, points });
      score += points;
      if (points === 3) hasSingleThree = true;
    }
  };

  add('Respiration rate', `${input.respirationRate}/min`, scoreResp(input.respirationRate));
  add('SpO2', `${input.oxygenSat}%`, scoreSpO2(input.oxygenSat));
  if (input.oxygenSupplement) {
    add('Supplemental O2', 'On O2', 2);
  }
  add('Systolic BP', `${input.bpSystolic} mmHg`, scoreBp(input.bpSystolic));
  add('Pulse', `${input.pulse} bpm`, scorePulse(input.pulse));
  add('Temperature', `${input.tempC}°C`, scoreTemp(input.tempC));
  add('AVPU', input.avpu === 'A' ? 'Alert' : (input.avpu || ''), scoreAvpu(input.avpu));

  const complete = ALL_PARAMS.every(p => input[p] != null);

  let level: NewsResult['level'];
  let response: string;
  let monitoring: string;

  if (score === 0 && !hasSingleThree) {
    level = 'Very low';
    response = 'very low risk, minimum 12-hourly monitoring';
    monitoring = 'Minimum 12-hourly monitoring';
  } else if (score >= 7) {
    level = 'High';
    response = 'high clinical risk, emergency response with continuous monitoring';
    monitoring = 'Continuous monitoring of vital signs';
  } else if (score >= 5) {
    level = 'Low-medium';
    response = 'low-medium risk, emergency response and bedside assessment, minimum hourly monitoring';
    monitoring = 'Minimum hourly monitoring';
  } else if (score >= 1 || hasSingleThree) {
    level = 'Low';
    response = hasSingleThree && score <= 4
      ? 'low risk with a single red score (3), ward-based assessment and escalation'
      : 'low risk, ward-based monitoring every 4-6 hours';
    monitoring = hasSingleThree ? 'Minimum every 4-6 hours (single red: escalate)' : 'Minimum every 4-6 hours';
  } else {
    level = 'Very low';
    response = 'very low risk, minimum 12-hourly monitoring';
    monitoring = 'Minimum 12-hourly monitoring';
  }

  return { score, level, response, monitoring, triggers, hasSingleThree, complete };
}

/** Short human-readable summary of the NEWS2 result for a care-log entry. */
export function news2Summary(input: NewsInput): string {
  const r = computeNews2(input);
  const parts = r.triggers.map(t => `${t.parameter} ${t.value} (+${t.points})`);
  const base = `NEWS2 ${r.score} (${r.response}).`;
  if (parts.length === 0) {
    return `${base} No individual parameters scored above normal.`;
  }
  return `${base} Triggered by: ${parts.join('; ')}.`;
}
