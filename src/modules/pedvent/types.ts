/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PatientCategory = 'preterm_neonate' | 'term_neonate' | 'infant' | 'toddler' | 'child' | 'adolescent';

export type BroselowColor = 
  | 'grey'      // 0 - 5 kg (<60 cm)
  | 'pink'      // 6 - 7 kg (60 - 67 cm)
  | 'red'       // 8 - 9 kg (68 - 74 cm)
  | 'purple'    // 10 - 11 kg (75 - 84 cm)
  | 'yellow'    // 12 - 14 kg (85 - 98 cm)
  | 'white'     // 15 - 18 kg (99 - 109 cm)
  | 'blue'      // 19 - 23 kg (110 - 121 cm)
  | 'orange'    // 24 - 29 kg (122 - 134 cm)
  | 'green'     // 30 - 36 kg (135 - 144 cm)
  | 'adult';    // >36 kg (>=145 cm)

export interface PatientParameters {
  heightCm: number;
  estimatedWeightKg: number;
  actualWeightKg: number;
  isWeightOverridden: boolean;
  estimatedAgeMonths: number;
  category: PatientCategory;
  categoryLabel: string;
  broselowColor: BroselowColor;
  broselowLabel: string;
  broselowHex: string;
}

export interface AirwayEquipment {
  ettCuffedSize: string;
  ettUncuffedSize: string;
  ettLipDepthCm: number;
  ettNasalDepthCm: number;
  backupEttSizes: string;
  laryngoscopeType: 'Miller (Straight)' | 'Macintosh (Curved)' | 'Miller or Wisconsin' | 'Miller or Mac';
  laryngoscopeSize: string;
  laryngoscopeNotes: string;
  suctionCatheterFr: string;
  lmaSize: string;
  bvmSize: string;
  styletSize: string;
  chestTubePneumoFr: string;
  chestTubeHemoFr: string;
  nasogastricTubeFr: string;
}

export interface VentilatorSetup {
  mode: string;
  modeDescription: string;
  tidalVolume6mL: number;
  tidalVolume7mL: number;
  tidalVolume8mL: number;
  recommendedVtRange: string;
  respiratoryRateBpm: string;
  peepCmH2O: string;
  pipLimitCmH2O: string;
  inspiratoryTimeSec: string;
  ieRatio: string;
  initialFiO2: string;
  targetSpO2: string;
  triggerSensitivity: string;
  clinicalPearls: string[];
}

export type MedicationCategory =
  | 'cardiac_arrest'
  | 'rsi_induction'
  | 'rsi_paralytic'
  | 'sedation_analgesia'
  | 'status_epilepticus'
  | 'anaphylaxis'
  | 'respiratory'
  | 'antidote_reversal'
  | 'fluids_electrolytes';

export interface EmergencyMedication {
  id: string;
  name: string;
  genericName: string;
  category: MedicationCategory;
  categoryLabel: string;
  indication: string;
  doseFormula: string;
  standardConcentration: string;
  calculatedDoseDisplay: string;
  calculatedVolumeDisplay: string;
  route: string;
  maxDoseDisplay?: string;
  clinicalAlert?: string;
  highPriority?: boolean;
}

export interface CoreMedicationChartItem {
  id: string;
  name: string;
  genericName: string;
  classType: string;
  indication: string;
  doseFormula: string;
  calculatedDose: string;
  standardConcentration: string;
  volumeToDraw: string;
  route: string;
  onsetDuration: string;
  maxDose?: string;
  clinicalAlert: string;
  priorityColor: 'rose' | 'amber' | 'cyan' | 'purple' | 'emerald';
}

export interface DefibShockEnergy {
  initialJ: number;
  subsequentJ: number;
  cardioversionInitialJ: number;
  cardioversionSubsequentJ: number;
  paddleSize: 'Infant (<10 kg)' | 'Adult (≥10 kg)';
}
