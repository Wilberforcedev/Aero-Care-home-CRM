/**
 * Collision-resistant identifier helper.
 * Date.now()-based ids collide when multiple records are created in the same
 * millisecond (e.g. signing off several meds, or a vitals record + its care log).
 */
export function uid(prefix?: string): string {
  let core: string;
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    core = crypto.randomUUID();
  } else {
    core = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  }
  return prefix ? `${prefix}-${core}` : core;
}
