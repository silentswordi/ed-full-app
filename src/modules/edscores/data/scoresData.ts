import { ClinicalScoreDefinition } from '../types';
import { CARDIO_PULM_SCORES } from './cardioPulmScores';
import { NEURO_INFECTIOUS_SCORES } from './neuroInfectiousScores';
import { TRAUMA_GI_OTHER_SCORES } from './traumaGiOtherScores';
import { ADDITIONAL_ROSEN_SCORES } from './additionalRosenScores';
import { ROSEN_FORMULAS } from './formulasScores';
import { ENDOCRINE_LIPID_EXTRA_SCORES } from './endocrineLipidExtraScores';

export const ED_CLINICAL_SCORES: ClinicalScoreDefinition[] = [
  ...CARDIO_PULM_SCORES,
  ...NEURO_INFECTIOUS_SCORES,
  ...TRAUMA_GI_OTHER_SCORES,
  ...ADDITIONAL_ROSEN_SCORES,
  ...ROSEN_FORMULAS,
  ...ENDOCRINE_LIPID_EXTRA_SCORES,
];
