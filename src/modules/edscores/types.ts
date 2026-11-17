export type ScoreCategory =
  | 'cardiology'
  | 'pulmonary'
  | 'neurology'
  | 'infectious'
  | 'trauma'
  | 'gi_surgery'
  | 'peds_heme'
  | 'endocrine'
  | 'formulas';

export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical';

export type CriterionValue = boolean | number | string;

export interface ScoreOption {
  label: string;
  points: number;
}

export interface ScoreCriterion {
  id: string;
  label: string;
  type: 'boolean' | 'select' | 'number';
  points?: number;
  options?: ScoreOption[];
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  optional?: boolean;
  defaultValue?: boolean | number;
}

export interface ScoreEvaluationResult {
  score: number;
  maxScore?: number;
  unit?: string;
  isIncomplete?: boolean;
  riskLevel: RiskLevel;
  riskTitle: string;
  summary: string;
  diagnosisAndTreatment: string[];
  clinicalNotes: string[];
}

export interface ClinicalScoreDefinition {
  id: string;
  titleFa: string;
  titleEn: string;
  category: ScoreCategory;
  categoryLabel: string;
  criteria: ScoreCriterion[];
  evaluate: (values: Record<string, CriterionValue>) => ScoreEvaluationResult;
  reference: string;
}

export function sumCriteria(
  criteria: ScoreCriterion[],
  values: Record<string, CriterionValue>
): number {
  let total = 0;
  for (const c of criteria) {
    if (c.type === 'boolean') {
      if (values[c.id]) total += c.points ?? 0;
    } else if (c.type === 'select' && c.options) {
      const idx = typeof values[c.id] === 'number' ? (values[c.id] as number) : 0;
      const opt = c.options[idx] ?? c.options[0];
      if (opt) total += opt.points;
    }
  }
  return Math.round(total * 10) / 10;
}

export function hasNum(
  values: Record<string, CriterionValue>,
  id: string
): boolean {
  const val = values[id];
  if (typeof val === 'number') return Number.isFinite(val);
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (!trimmed) return false;
    const parsed = Number(trimmed);
    return Number.isFinite(parsed);
  }
  return false;
}

export function getNum(
  values: Record<string, CriterionValue>,
  id: string,
  fallback = 0
): number {
  const val = values[id];
  if (typeof val === 'number' && Number.isFinite(val)) return val;
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (!trimmed) return fallback;
    const parsed = Number(trimmed);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}
