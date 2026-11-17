export type ToxinCategory =
  | 'analgesics'
  | 'cardiovascular'
  | 'neuro_psych'
  | 'drugs_of_abuse'
  | 'alcohols_gases'
  | 'pesticides_metals'
  | 'caustics_plants_metabolic';

export interface ToxinAntidote {
  nameFa: string;
  nameEn: string;
  dosing: string[];
}

export interface ToxinDefinition {
  id: string;
  nameFa: string;
  nameEn: string;
  category: ToxinCategory;
  categoryLabel: string;
  toxidrome: string;
  toxicDose: string;
  clinicalFeatures: string[];
  diagnostics: string[];
  ecgFindings: string[];
  decontamination: string[];
  antidote: ToxinAntidote | null;
  management: string[];
  pitfalls: string[];
  keywords?: string[];
}
