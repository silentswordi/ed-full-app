/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  PatientCategory,
  BroselowColor,
  PatientParameters,
  AirwayEquipment,
  VentilatorSetup,
  EmergencyMedication,
  DefibShockEnergy,
  CoreMedicationChartItem,
} from '../types';

/**
 * Calculates estimated pediatric or neonatal weight and developmental age based on height/length in cm.
 * Validated against WHO/CDC growth curves, Broselow Pediatric Emergency Tape ranges,
 * and standard neonatal gestational weight-length percentiles.
 */
export function calculatePatientParameters(
  heightCm: number,
  overriddenWeightKg?: number | null
): PatientParameters {
  const h = Math.max(25, Math.min(200, heightCm));

  let estimatedWeightKg = 3.5;
  let estimatedAgeMonths = 0;
  let category: PatientCategory = 'term_neonate';
  let categoryLabel = 'Term Neonate';
  let broselowColor: BroselowColor = 'grey';
  let broselowLabel = 'Grey (0 - 5 kg)';

  if (h < 33) {
    // Extreme preterm (~24-27 weeks)
    estimatedWeightKg = 0.7 + (h - 25) * 0.05; // 0.7 - 1.1 kg
    estimatedAgeMonths = 0;
    category = 'preterm_neonate';
    categoryLabel = 'Extremely Preterm Neonate (<28w)';
    broselowColor = 'grey';
    broselowLabel = 'Neonate (<3 kg)';
  } else if (h < 40) {
    // Very preterm (~28-32 weeks)
    estimatedWeightKg = 1.1 + (h - 33) * 0.11; // 1.1 - 1.8 kg
    estimatedAgeMonths = 0;
    category = 'preterm_neonate';
    categoryLabel = 'Very Preterm Neonate (28-32w)';
    broselowColor = 'grey';
    broselowLabel = 'Neonate (<3 kg)';
  } else if (h < 47) {
    // Moderate to late preterm (~33-36 weeks)
    estimatedWeightKg = 1.9 + (h - 40) * 0.14; // 1.9 - 2.8 kg
    estimatedAgeMonths = 0;
    category = 'preterm_neonate';
    categoryLabel = 'Late Preterm Neonate (33-36w)';
    broselowColor = 'grey';
    broselowLabel = 'Neonate (<3 kg)';
  } else if (h < 54) {
    // Term neonate (37-41 weeks) ~ 48-53 cm
    estimatedWeightKg = 2.9 + (h - 47) * 0.15; // 2.9 - 3.8 kg
    estimatedAgeMonths = 0;
    category = 'term_neonate';
    categoryLabel = 'Full-Term Newborn (0-1 mo)';
    broselowColor = 'grey';
    broselowLabel = 'Grey (3 - 5 kg)';
  } else if (h < 60) {
    // Infant 1-3 months ~ 54-59 cm
    estimatedWeightKg = 4.0 + (h - 54) * 0.25; // 4.0 - 5.5 kg
    estimatedAgeMonths = 2;
    category = 'infant';
    categoryLabel = 'Infant (1 - 3 months)';
    broselowColor = 'grey';
    broselowLabel = 'Grey (3 - 5 kg)';
  } else if (h < 68) {
    // Broselow Pink ~ 60-67.9 cm
    estimatedWeightKg = 5.5 + (h - 60) * 0.25; // 5.5 - 7.5 kg (avg ~6.5)
    estimatedAgeMonths = 5;
    category = 'infant';
    categoryLabel = 'Infant (4 - 6 months)';
    broselowColor = 'pink';
    broselowLabel = 'Pink (6 - 7 kg)';
  } else if (h < 75) {
    // Broselow Red ~ 68-74.9 cm
    estimatedWeightKg = 7.5 + (h - 68) * 0.28; // 7.5 - 9.5 kg (avg ~8.5)
    estimatedAgeMonths = 9;
    category = 'infant';
    categoryLabel = 'Older Infant (7 - 11 months)';
    broselowColor = 'red';
    broselowLabel = 'Red (8 - 9 kg)';
  } else if (h < 85) {
    // Broselow Purple ~ 75-84.9 cm
    estimatedWeightKg = 9.5 + (h - 75) * 0.25; // 9.5 - 12.0 kg (avg ~10.5)
    estimatedAgeMonths = 15;
    category = 'toddler';
    categoryLabel = 'Toddler (1 - 2 years)';
    broselowColor = 'purple';
    broselowLabel = 'Purple (10 - 11 kg)';
  } else if (h < 99) {
    // Broselow Yellow ~ 85-98.9 cm
    estimatedWeightKg = 12.0 + (h - 85) * 0.21; // 12 - 15 kg (avg ~13.5)
    estimatedAgeMonths = 30; // ~2.5 years
    category = 'toddler';
    categoryLabel = 'Toddler (2 - 3 years)';
    broselowColor = 'yellow';
    broselowLabel = 'Yellow (12 - 14 kg)';
  } else if (h < 110) {
    // Broselow White ~ 99-109.9 cm
    estimatedWeightKg = 15.0 + (h - 99) * 0.32; // 15 - 18.5 kg (avg ~16.5)
    estimatedAgeMonths = 48; // ~4 years
    category = 'child';
    categoryLabel = 'Preschool Child (4 - 5 years)';
    broselowColor = 'white';
    broselowLabel = 'White (15 - 18 kg)';
  } else if (h < 122) {
    // Broselow Blue ~ 110-121.9 cm
    estimatedWeightKg = 18.5 + (h - 110) * 0.42; // 18.5 - 23.5 kg (avg ~21)
    estimatedAgeMonths = 72; // ~6 years
    category = 'child';
    categoryLabel = 'School-Age Child (6 - 7 years)';
    broselowColor = 'blue';
    broselowLabel = 'Blue (19 - 23 kg)';
  } else if (h < 135) {
    // Broselow Orange ~ 122-134.9 cm
    estimatedWeightKg = 23.5 + (h - 122) * 0.50; // 23.5 - 30 kg (avg ~26.5)
    estimatedAgeMonths = 96; // ~8 years
    category = 'child';
    categoryLabel = 'School-Age Child (8 - 9 years)';
    broselowColor = 'orange';
    broselowLabel = 'Orange (24 - 29 kg)';
  } else if (h < 145) {
    // Broselow Green ~ 135-144.9 cm
    estimatedWeightKg = 30.0 + (h - 135) * 0.70; // 30 - 37 kg (avg ~33)
    estimatedAgeMonths = 120; // ~10 years
    category = 'child';
    categoryLabel = 'Child (10 - 11 years)';
    broselowColor = 'green';
    broselowLabel = 'Green (30 - 36 kg)';
  } else {
    // Adolescent / Adult size >= 145 cm
    // CDC 50th percentile regression: Weight ~ ((Height - 100) * 0.8) + 15
    estimatedWeightKg = 37.0 + (h - 145) * 0.65;
    estimatedAgeMonths = Math.min(216, 144 + Math.round((h - 145) * 1.5)); // 12 - 18 years
    category = 'adolescent';
    categoryLabel = estimatedAgeMonths >= 192 ? 'Adolescent (>16 years)' : 'Adolescent (12 - 15 years)';
    broselowColor = 'adult';
    broselowLabel = 'Adolescent (>36 kg)';
  }

  // Round estimated weight nicely
  const roundedEstWeight = Math.round(estimatedWeightKg * 10) / 10;
  const isWeightOverridden = Boolean(overriddenWeightKg && overriddenWeightKg > 0);
  const actualWeightKg = isWeightOverridden && overriddenWeightKg
    ? Math.round(overriddenWeightKg * 10) / 10
    : roundedEstWeight;

  const broselowHexMap: Record<BroselowColor, string> = {
    grey: '#64748b',
    pink: '#ec4899',
    red: '#ef4444',
    purple: '#a855f7',
    yellow: '#eab308',
    white: '#f8fafc',
    blue: '#3b82f6',
    orange: '#f97316',
    green: '#22c55e',
    adult: '#0ea5e9',
  };

  return {
    heightCm: Math.round(h * 10) / 10,
    estimatedWeightKg: roundedEstWeight,
    actualWeightKg,
    isWeightOverridden,
    estimatedAgeMonths,
    category,
    categoryLabel,
    broselowColor,
    broselowLabel,
    broselowHex: broselowHexMap[broselowColor],
  };
}

/**
 * Calculates endotracheal tube (ETT) and laryngoscope size & type according to NRP/PALS/Broselow standards.
 */
export function calculateAirwayEquipment(params: PatientParameters): AirwayEquipment {
  const { actualWeightKg, heightCm, estimatedAgeMonths, category } = params;
  const ageYears = estimatedAgeMonths / 12;

  let ettCuffedSize = '3.0 mm';
  let ettUncuffedSize = '3.5 mm';
  let backupEttSizes = '3.0 mm & 4.0 mm';
  let lipDepthCm = 9.0;
  let nasalDepthCm = 10.5;

  let laryngoscopeType: 'Miller (Straight)' | 'Macintosh (Curved)' | 'Miller or Wisconsin' | 'Miller or Mac' = 'Miller (Straight)';
  let laryngoscopeSize = '1';
  let laryngoscopeNotes = 'Miller straight blade directly lifts the large floppy infant epiglottis.';

  let suctionCatheterFr = '8 Fr';
  let lmaSize = '1.0';
  let bvmSize = 'Neonatal (250 mL)';
  let styletSize = 'Pediatric (6 Fr)';
  let chestTubePneumoFr = '8 - 10 Fr';
  let chestTubeHemoFr = '10 - 12 Fr';
  let nasogastricTubeFr = '6 - 8 Fr';

  // Neonates & Preterm
  if (category === 'preterm_neonate') {
    if (actualWeightKg < 1.0) {
      ettUncuffedSize = '2.5 mm uncuffed';
      ettCuffedSize = '2.5 mm microcuff (specialist)';
      backupEttSizes = '2.0 mm & 3.0 mm';
      lipDepthCm = 6.0;
      nasalDepthCm = 7.0;
      laryngoscopeType = 'Miller (Straight)';
      laryngoscopeSize = '00 (double-zero)';
      laryngoscopeNotes = 'Ultra-premature: use Miller 00 blade with extreme gentleness; maintain neutral head position.';
      suctionCatheterFr = '5 - 6 Fr';
      lmaSize = 'Not recommended (<1 kg)';
      bvmSize = 'Neonatal (250 mL with pop-off valve 30-40 cmH2O)';
      styletSize = 'Neonatal 6 Fr';
      chestTubePneumoFr = '8 Fr';
      chestTubeHemoFr = '10 Fr';
      nasogastricTubeFr = '5 - 6 Fr';
    } else if (actualWeightKg < 2.0) {
      ettUncuffedSize = '3.0 mm uncuffed';
      ettCuffedSize = '3.0 mm microcuff (if available)';
      backupEttSizes = '2.5 mm & 3.5 mm';
      lipDepthCm = 7.0 + (actualWeightKg - 1.0) * 1.0; // ~7-8 cm
      nasalDepthCm = lipDepthCm + 1.5;
      laryngoscopeType = 'Miller (Straight)';
      laryngoscopeSize = '0 (zero)';
      laryngoscopeNotes = 'Miller 0 straight blade; lifts epiglottis directly. Do not over-extend the neck (sniffing position only).';
      suctionCatheterFr = '6 Fr';
      lmaSize = '0.5 / 1.0 (rescue only)';
      bvmSize = 'Neonatal (250 mL)';
      styletSize = 'Neonatal 6 Fr';
      chestTubePneumoFr = '8 - 10 Fr';
      chestTubeHemoFr = '10 - 12 Fr';
      nasogastricTubeFr = '6 Fr';
    } else {
      // 2.0 - 2.8 kg
      ettUncuffedSize = '3.0 - 3.5 mm uncuffed';
      ettCuffedSize = '3.0 mm cuffed';
      backupEttSizes = '2.5 mm & 3.5 mm';
      lipDepthCm = 8.0;
      nasalDepthCm = 9.5;
      laryngoscopeType = 'Miller (Straight)';
      laryngoscopeSize = '0 or 1';
      laryngoscopeNotes = 'Miller 0 for small neonates, Miller 1 if length >45cm.';
      suctionCatheterFr = '6 - 8 Fr';
      lmaSize = '1.0 (<5 kg)';
      bvmSize = 'Neonatal (250 mL)';
      styletSize = 'Neonatal 6 Fr';
      chestTubePneumoFr = '10 Fr';
      chestTubeHemoFr = '12 Fr';
      nasogastricTubeFr = '6 - 8 Fr';
    }
  } else if (category === 'term_neonate') {
    // Term neonate (3.0 - 4.5 kg)
    ettUncuffedSize = '3.5 mm uncuffed';
    ettCuffedSize = '3.0 mm cuffed (microcuff)';
    backupEttSizes = '3.0 mm & 4.0 mm';
    // NRP formula: Depth at lip (cm) = Weight (kg) + 6 cm
    lipDepthCm = Math.round((actualWeightKg + 6.0) * 10) / 10;
    nasalDepthCm = Math.round((actualWeightKg + 7.0) * 10) / 10;
    laryngoscopeType = 'Miller (Straight)';
    laryngoscopeSize = '1';
    laryngoscopeNotes = 'Miller 1 straight blade directly lifts large, floppy, omega-shaped epiglottis.';
    suctionCatheterFr = '8 Fr';
    lmaSize = 'Size 1 (up to 5 kg)';
    bvmSize = 'Neonatal (250-350 mL)';
    styletSize = 'Pediatric 6 Fr';
    chestTubePneumoFr = '10 - 12 Fr';
    chestTubeHemoFr = '12 - 14 Fr';
    nasogastricTubeFr = '8 Fr';
  } else if (category === 'infant') {
    // Infant (1 - 12 months)
    ettUncuffedSize = actualWeightKg < 6 ? '3.5 mm uncuffed' : '4.0 mm uncuffed';
    ettCuffedSize = actualWeightKg < 6 ? '3.0 mm cuffed' : '3.5 mm cuffed';
    backupEttSizes = '3.5 mm & 4.5 mm';
    // Depth at lip = 3 * ETT ID, or wt/2 + 8
    lipDepthCm = Math.round((actualWeightKg < 6 ? 10.5 : 11.5) * 10) / 10;
    nasalDepthCm = Math.round((lipDepthCm + 2.0) * 10) / 10;
    laryngoscopeType = 'Miller (Straight)';
    laryngoscopeSize = '1';
    laryngoscopeNotes = 'Miller 1 straight blade preferred in infants under 12-18 months to control the large epiglottis.';
    suctionCatheterFr = '8 Fr';
    lmaSize = actualWeightKg < 5 ? 'Size 1 (<5 kg)' : 'Size 1.5 (5 - 10 kg)';
    bvmSize = 'Pediatric (450 - 500 mL)';
    styletSize = 'Pediatric 6 - 8 Fr';
    chestTubePneumoFr = '12 - 14 Fr';
    chestTubeHemoFr = '14 - 16 Fr';
    nasogastricTubeFr = '8 - 10 Fr';
  } else if (category === 'toddler') {
    // 1 - 3 years
    const rawCuffed = ageYears / 4 + 3.5;
    const roundedCuffed = Math.round(rawCuffed * 2) / 2;
    ettCuffedSize = `${roundedCuffed.toFixed(1)} mm cuffed`;
    ettUncuffedSize = `${(roundedCuffed + 0.5).toFixed(1)} mm uncuffed`;
    backupEttSizes = `${(roundedCuffed - 0.5).toFixed(1)} mm & ${(roundedCuffed + 0.5).toFixed(1)} mm`;

    // Lip depth = age/2 + 12 or 3 * ETT
    lipDepthCm = Math.round((roundedCuffed * 3.0) * 10) / 10;
    nasalDepthCm = Math.round((lipDepthCm + 2.5) * 10) / 10;

    laryngoscopeType = 'Miller or Wisconsin';
    laryngoscopeSize = '1.5 or 2 (Miller 2 / Mac 2)';
    laryngoscopeNotes = 'Miller 2 or Wisconsin 1.5/2 straight blade. Macintosh 2 curved blade acceptable if child >2 years.';
    suctionCatheterFr = '8 - 10 Fr';
    lmaSize = actualWeightKg < 10 ? 'Size 1.5 (5-10 kg)' : 'Size 2 (10-20 kg)';
    bvmSize = 'Pediatric (450 - 500 mL)';
    styletSize = 'Pediatric 8 Fr';
    chestTubePneumoFr = '14 - 16 Fr';
    chestTubeHemoFr = '16 - 20 Fr';
    nasogastricTubeFr = '10 Fr';
  } else if (category === 'child') {
    // 4 - 11 years
    // Formulas: Cuffed = (Age / 4) + 3.5; Uncuffed = (Age / 4) + 4.0
    const rawCuffed = Math.min(6.5, Math.max(4.0, ageYears / 4 + 3.5));
    const roundedCuffed = Math.round(rawCuffed * 2) / 2;
    ettCuffedSize = `${roundedCuffed.toFixed(1)} mm cuffed`;
    ettUncuffedSize = `${(roundedCuffed + 0.5).toFixed(1)} mm uncuffed`;
    backupEttSizes = `${(roundedCuffed - 0.5).toFixed(1)} mm & ${(roundedCuffed + 0.5).toFixed(1)} mm`;

    // Depth = (Age / 2) + 12 cm or 3 * ETT size
    lipDepthCm = Math.round(((ageYears / 2) + 12) * 10) / 10;
    nasalDepthCm = Math.round((lipDepthCm + 3.0) * 10) / 10;

    if (ageYears < 7) {
      laryngoscopeType = 'Miller or Mac';
      laryngoscopeSize = '2';
      laryngoscopeNotes = 'Macintosh 2 curved blade into vallecula OR Miller 2 straight blade.';
    } else {
      laryngoscopeType = 'Macintosh (Curved)';
      laryngoscopeSize = '2 or 3';
      laryngoscopeNotes = 'Macintosh 2 or 3 curved blade inserted into vallecula to indirectly elevate epiglottis.';
    }

    suctionCatheterFr = roundedCuffed >= 5.5 ? '10 - 12 Fr' : '10 Fr';
    lmaSize = actualWeightKg < 20 ? 'Size 2 (10-20 kg)' : actualWeightKg < 30 ? 'Size 2.5 (20-30 kg)' : 'Size 3 (30-50 kg)';
    bvmSize = actualWeightKg < 25 ? 'Pediatric (500 mL)' : 'Adult (1000 - 1500 mL)';
    styletSize = 'Pediatric / Adult 10 Fr';
    chestTubePneumoFr = '16 - 20 Fr';
    chestTubeHemoFr = '20 - 24 Fr';
    nasogastricTubeFr = '10 - 12 Fr';
  } else {
    // Adolescent (> 12 years)
    const isLarge = heightCm > 165 || actualWeightKg > 55;
    ettCuffedSize = isLarge ? '7.0 - 7.5 mm cuffed' : '6.5 - 7.0 mm cuffed';
    ettUncuffedSize = isLarge ? '7.5 - 8.0 mm uncuffed' : '7.0 - 7.5 mm uncuffed';
    backupEttSizes = '6.5 mm, 7.0 mm & 7.5 mm';
    lipDepthCm = isLarge ? 21.0 : 19.5;
    nasalDepthCm = lipDepthCm + 3.0;

    laryngoscopeType = 'Macintosh (Curved)';
    laryngoscopeSize = isLarge ? '3 or 4' : '3';
    laryngoscopeNotes = 'Macintosh 3 (standard adult) or 4 curved blade. Place tip gently into vallecula.';
    suctionCatheterFr = '12 - 14 Fr';
    lmaSize = actualWeightKg < 50 ? 'Size 3 (30-50 kg)' : actualWeightKg < 70 ? 'Size 4 (50-70 kg)' : 'Size 5 (>70 kg)';
    bvmSize = 'Adult (1000 - 1500 mL)';
    styletSize = 'Adult 14 Fr / Bougie';
    chestTubePneumoFr = '20 - 24 Fr';
    chestTubeHemoFr = '28 - 32 Fr';
    nasogastricTubeFr = '14 - 16 Fr';
  }

  return {
    ettCuffedSize,
    ettUncuffedSize,
    ettLipDepthCm: Math.round(lipDepthCm * 10) / 10,
    ettNasalDepthCm: Math.round(nasalDepthCm * 10) / 10,
    backupEttSizes,
    laryngoscopeType,
    laryngoscopeSize,
    laryngoscopeNotes,
    suctionCatheterFr,
    lmaSize,
    bvmSize,
    styletSize,
    chestTubePneumoFr,
    chestTubeHemoFr,
    nasogastricTubeFr,
  };
}

/**
 * Calculates initial standard ventilator setup tailored to patient size, neonatal vs pediatric physiology.
 * Respects ARDSNet lung-protective pediatric ventilation guidelines (PALS, PALICC, NRP).
 */
export function calculateVentilatorSetup(params: PatientParameters): VentilatorSetup {
  const { actualWeightKg, category } = params;

  // Tidal volumes in mL
  const vt6 = Math.round(actualWeightKg * 6.0 * 10) / 10;
  const vt7 = Math.round(actualWeightKg * 7.0 * 10) / 10;
  const vt8 = Math.round(actualWeightKg * 8.0 * 10) / 10;

  let mode = 'Pressure-Regulated Volume Control (PRVC / SIMV-VG)';
  let modeDescription = 'Dual-controlled pressure mode delivering targeted tidal volume with lowest necessary peak pressure.';
  let recommendedVtRange = `${vt6} - ${vt8} mL (6 - 8 mL/kg)`;
  let respiratoryRateBpm = '20 - 24 bpm';
  let peepCmH2O = '5 cmH2O (range 4 - 6)';
  let pipLimitCmH2O = '24 cmH2O (Keep Pplat < 28)';
  let inspiratoryTimeSec = '0.70 - 0.80 s';
  let ieRatio = '1 : 2.0';
  let initialFiO2 = '40% - 60% (titrate SpO2 92-97%)';
  let targetSpO2 = '92% - 97% (PaO2 65-85 mmHg)';
  let triggerSensitivity = 'Flow trigger: 1.0 - 1.5 L/min';
  const clinicalPearls: string[] = [];

  if (category === 'preterm_neonate') {
    mode = 'Pressure Control Assist/Control (PC-A/C) or Volume Guarantee (VG)';
    modeDescription = 'Pressure-limited time-cycled mode with Volume Guarantee to prevent neonatal volutrauma and hypocapnia.';
    const vt4 = Math.round(actualWeightKg * 4.0 * 10) / 10;
    const vt6Preterm = Math.round(actualWeightKg * 6.0 * 10) / 10;
    recommendedVtRange = `${vt4} - ${vt6Preterm} mL (4 - 6 mL/kg for extreme preterm lung)`;
    respiratoryRateBpm = '40 - 55 bpm';
    peepCmH2O = '5 - 6 cmH2O (prevent alveolar collapse)';
    pipLimitCmH2O = '16 - 20 cmH2O (driving pressure ΔP ≤ 12 cmH2O)';
    inspiratoryTimeSec = '0.30 - 0.35 s';
    ieRatio = '1 : 1.5 to 1 : 2.0';
    initialFiO2 = actualWeightKg < 1.5 ? '30% - 40% (avoid hyperoxia)' : '40% - 60%';
    targetSpO2 = '90% - 95% (strictly avoid >95% to prevent Retinopathy of Prematurity)';
    triggerSensitivity = 'Flow trigger: 0.5 L/min';
    clinicalPearls.push(
      'Target permissive hypercapnia (pH 7.25-7.35, PaCO2 45-55 mmHg) to protect premature lungs.',
      'Check for symmetrical chest excursion; tiny movements are adequate.',
      'Always use a warmed humidifier and heated inspiratory circuit.',
      'If sudden desaturation occurs, check DOPE: Dislodged ETT, Obstructed by plug, Pneumothorax, Equipment malfunction.'
    );
  } else if (category === 'term_neonate') {
    mode = 'Pressure Control (PC-SIMV) or Volume Guarantee (PRVC)';
    modeDescription = 'Time-cycled, pressure-limited or volume-targeted ventilation with low compressible volume circuit.';
    recommendedVtRange = `${vt6} - ${vt8} mL (6 - 8 mL/kg)`;
    respiratoryRateBpm = '35 - 45 bpm';
    peepCmH2O = '5 cmH2O (4 - 6 cmH2O)';
    pipLimitCmH2O = '18 - 22 cmH2O';
    inspiratoryTimeSec = '0.35 - 0.45 s';
    ieRatio = '1 : 1.5 to 1 : 2.0';
    initialFiO2 = '40% - 60% (titrate SpO2 92-97%)';
    targetSpO2 = '92% - 97%';
    triggerSensitivity = 'Flow trigger: 0.5 - 1.0 L/min';
    clinicalPearls.push(
      'Target tidal volume 5-6 mL/kg in acute lung injury/meconium aspiration, 6-8 mL/kg in normal compliance.',
      'Verify ETT depth at lip = Weight (kg) + 6 cm. Auscultate axillae bilaterally to exclude right mainstem intubation.',
      'Pass an oro/nasogastric tube to decompress the stomach and prevent diaphragmatic splinting.',
      'Maintain adequate sedation/synchrony to avoid infant-ventilator dyssynchrony and air leaks.'
    );
  } else if (category === 'infant') {
    mode = 'Pressure-Regulated Volume Control (PRVC) or PC-SIMV';
    modeDescription = 'Decelerating flow waveform with tidal volume targeting to prevent barotrauma.';
    recommendedVtRange = `${vt6} - ${vt8} mL (6 - 8 mL/kg)`;
    respiratoryRateBpm = '28 - 35 bpm';
    peepCmH2O = '5 cmH2O';
    pipLimitCmH2O = '20 - 24 cmH2O';
    inspiratoryTimeSec = '0.50 - 0.60 s';
    ieRatio = '1 : 2.0';
    initialFiO2 = '50% - 60% (titrate rapidly once stabilized)';
    targetSpO2 = '92% - 97%';
    triggerSensitivity = 'Flow trigger: 1.0 L/min';
    clinicalPearls.push(
      'In bronchiolitis with air-trapping, prolong expiratory time (I:E 1:2.5 or 1:3) and lower the respiratory rate.',
      'Monitor intrinsic PEEP (auto-PEEP) by inspecting the expiratory flow curve returning to baseline.',
      'Ensure in-line suction is available; secretions easily occlude small infant ETTs.'
    );
  } else if (category === 'toddler') {
    mode = 'PRVC or Volume Control (VC-AC)';
    modeDescription = 'Volume-targeted ventilation with decelerating ramp; set mandatory rate with patient triggering.';
    recommendedVtRange = `${vt6} - ${vt8} mL (6 - 8 mL/kg)`;
    respiratoryRateBpm = '22 - 28 bpm';
    peepCmH2O = '5 cmH2O';
    pipLimitCmH2O = '22 - 26 cmH2O (Pplat < 28)';
    inspiratoryTimeSec = '0.60 - 0.70 s';
    ieRatio = '1 : 2.0';
    initialFiO2 = '50% - 60%';
    targetSpO2 = '92% - 97%';
    triggerSensitivity = 'Flow trigger: 1.0 - 1.5 L/min';
    clinicalPearls.push(
      'Lung-protective ventilation: Limit plateau pressure (Pplat) ≤ 28 cmH2O and driving pressure ΔP ≤ 15 cmH2O.',
      'Continuous waveform capnography (ETCO2) is mandatory for confirming ventilation and ETT position.',
      'Maintain warm humidity to avoid tube encrustation.'
    );
  } else if (category === 'child') {
    mode = 'PRVC / VC-AC with Decelerating Flow';
    modeDescription = 'Standard pediatric lung protective protocol; decelerating flow provides superior gas distribution.';
    recommendedVtRange = `${vt6} - ${vt8} mL (6 - 8 mL/kg)`;
    respiratoryRateBpm = actualWeightKg > 25 ? '16 - 20 bpm' : '18 - 24 bpm';
    peepCmH2O = '5 cmH2O (up to 8-10 in PARDS)';
    pipLimitCmH2O = '25 - 28 cmH2O (Pplat < 28)';
    inspiratoryTimeSec = '0.70 - 0.85 s';
    ieRatio = '1 : 2.0';
    initialFiO2 = '50% - 60%';
    targetSpO2 = '92% - 97%';
    triggerSensitivity = 'Flow trigger: 1.5 - 2.0 L/min';
    clinicalPearls.push(
      'In status asthmaticus: Use low respiratory rate (12-16), high peak flow, and long exhalation (I:E 1:3 to 1:4) to avoid fatal dynamic hyperinflation / breath-stacking.',
      'In Pediatric ARDS (PARDS): Titrate PEEP using high PEEP / lower FiO2 table, accept permissive hypercapnia (pH >7.20).',
      'Verify bilateral equal chest excursion and end-tidal CO2 trace.'
    );
  } else {
    // Adolescent
    mode = 'Volume Control (VC-AC) or PRVC';
    modeDescription = 'Adult-sized pediatric lung protection; tidal volume 6-8 mL/kg of predicted body weight.';
    recommendedVtRange = `${vt6} - ${vt8} mL (6 - 8 mL/kg)`;
    respiratoryRateBpm = '12 - 16 bpm';
    peepCmH2O = '5 cmH2O';
    pipLimitCmH2O = '30 cmH2O (Pplat < 30)';
    inspiratoryTimeSec = '0.80 - 1.00 s';
    ieRatio = '1 : 2.0';
    initialFiO2 = '50% - 60%';
    targetSpO2 = '94% - 98%';
    triggerSensitivity = 'Flow trigger: 2.0 L/min (or -1.0 cmH2O)';
    clinicalPearls.push(
      'Base tidal volume on ideal/predicted body weight from height rather than actual total weight to prevent volutrauma in overweight patients.',
      'Plateau pressure should strictly stay < 30 cmH2O to prevent alveolar rupture.',
      'Assess for patient triggering and dyssynchrony; optimize sedation and analgesia.'
    );
  }

  return {
    mode,
    modeDescription,
    tidalVolume6mL: vt6,
    tidalVolume7mL: vt7,
    tidalVolume8mL: vt8,
    recommendedVtRange,
    respiratoryRateBpm,
    peepCmH2O,
    pipLimitCmH2O,
    inspiratoryTimeSec,
    ieRatio,
    initialFiO2,
    targetSpO2,
    triggerSensitivity,
    clinicalPearls,
  };
}

/**
 * Calculates defibrillation and cardioversion shock energies in Joules.
 */
export function calculateDefibEnergy(actualWeightKg: number): DefibShockEnergy {
  // PALS: Initial defib 2 J/kg; subsequent 4 J/kg (up to 10 J/kg or 200 J)
  // Cardioversion: Initial 0.5 - 1.0 J/kg; subsequent 2 J/kg
  const w = actualWeightKg;
  const initialJ = Math.min(200, Math.max(2, Math.round(w * 2)));
  const subsequentJ = Math.min(200, Math.max(4, Math.round(w * 4)));
  const cardioInitialJ = Math.min(100, Math.max(1, Math.round(w * 1)));
  const cardioSubsequentJ = Math.min(200, Math.max(2, Math.round(w * 2)));

  return {
    initialJ,
    subsequentJ,
    cardioversionInitialJ: cardioInitialJ,
    cardioversionSubsequentJ: cardioSubsequentJ,
    paddleSize: w < 10 ? 'Infant (<10 kg)' : 'Adult (≥10 kg)',
  };
}

/**
 * Calculates comprehensive emergency medications tailored to the pediatric/neonatal patient.
 * Displays calculated dosage in mg/mcg AND exact volume (mL) to draw up based on standard hospital concentrations.
 */
export function calculateEmergencyMedications(params: PatientParameters): EmergencyMedication[] {
  const { actualWeightKg, category } = params;
  const w = actualWeightKg;
  const isNeonate = category === 'preterm_neonate' || category === 'term_neonate';

  const meds: EmergencyMedication[] = [
    // --- RESUSCITATION & CARDIAC ARREST ---
    {
      id: 'epi_arrest',
      name: 'Epinephrine 1:10,000 (Cardiac Arrest)',
      genericName: 'Epinephrine (Adrenaline)',
      category: 'cardiac_arrest',
      categoryLabel: 'Resuscitation & Arrest',
      indication: 'Asystole, PEA, Pulseless VT/VF, severe neonatal bradycardia (HR <60 bpm despite ventilation)',
      doseFormula: '0.01 mg/kg (0.1 mL/kg of 1:10,000)',
      standardConcentration: '1:10,000 (0.1 mg/mL = 100 mcg/mL)',
      calculatedDoseDisplay: `${Math.min(1.0, Math.round(w * 0.01 * 1000) / 1000).toFixed(3)} mg (${Math.min(1000, Math.round(w * 10))} mcg)`,
      calculatedVolumeDisplay: `${Math.min(10.0, Math.round(w * 0.1 * 10) / 10).toFixed(2)} mL`,
      route: 'IV / IO (push fast, follow with 5 mL NS flush)',
      maxDoseDisplay: '1.0 mg (10.0 mL)',
      clinicalAlert: 'Repeat every 3 - 5 minutes. High-priority PALS/NRP code medication. In neonates with HR <60 bpm, ensure 100% O2 and chest compressions first.',
      highPriority: true,
    },
    {
      id: 'amiodarone',
      name: 'Amiodarone (Shockable Arrest)',
      genericName: 'Amiodarone HCl',
      category: 'cardiac_arrest',
      categoryLabel: 'Resuscitation & Arrest',
      indication: 'Refractory Pulseless VT or Ventricular Fibrillation (after 3rd shock)',
      doseFormula: '5 mg/kg IV/IO bolus',
      standardConcentration: '50 mg/mL',
      calculatedDoseDisplay: `${Math.min(300, Math.round(w * 5.0 * 10) / 10)} mg`,
      calculatedVolumeDisplay: `${Math.min(6.0, Math.round((w * 5.0 / 50.0) * 10) / 10).toFixed(2)} mL`,
      route: 'IV / IO rapid push in arrest (over 20-60 min if perfusing tachydysrhythmia)',
      maxDoseDisplay: '300 mg (6.0 mL)',
      clinicalAlert: 'May repeat twice (up to total 15 mg/kg). For perfusing VT, dilute in D5W and infuse slowly to avoid hypotension.',
      highPriority: true,
    },
    {
      id: 'atropine',
      name: 'Atropine Sulfate',
      genericName: 'Atropine',
      category: 'cardiac_arrest',
      categoryLabel: 'Resuscitation & Arrest',
      indication: 'Symptomatic vagal bradycardia, pre-RSI in infants <1 year or repeat succinylcholine',
      doseFormula: '0.02 mg/kg IV/IO (minimum 0.1 mg)',
      standardConcentration: '0.1 mg/mL',
      calculatedDoseDisplay: `${Math.max(0.1, Math.min(0.5, Math.round(w * 0.02 * 100) / 100)).toFixed(2)} mg`,
      calculatedVolumeDisplay: `${Math.max(1.0, Math.min(5.0, Math.round(w * 0.2 * 10) / 10)).toFixed(2)} mL`,
      route: 'IV / IO rapid push',
      maxDoseDisplay: '0.5 mg in child, 1.0 mg in adolescent',
      clinicalAlert: 'Minimum dose 0.1 mg (1 mL) to avoid paradoxical reflex central bradycardia. Hypoxia is the most common cause of bradycardia in children—oxygenate first!',
    },
    {
      id: 'adenosine',
      name: 'Adenosine (1st Dose)',
      genericName: 'Adenosine',
      category: 'cardiac_arrest',
      categoryLabel: 'Resuscitation & Arrest',
      indication: 'Supraventricular Tachycardia (SVT) with narrow QRS and perfusing rhythm',
      doseFormula: '0.1 mg/kg rapid push (2nd dose: 0.2 mg/kg)',
      standardConcentration: '3 mg/mL',
      calculatedDoseDisplay: `1st: ${Math.min(6.0, Math.round(w * 0.1 * 100) / 100).toFixed(2)} mg | 2nd: ${Math.min(12.0, Math.round(w * 0.2 * 100) / 100).toFixed(2)} mg`,
      calculatedVolumeDisplay: `1st: ${Math.min(2.0, Math.round((w * 0.1 / 3.0) * 100) / 100).toFixed(2)} mL | 2nd: ${Math.min(4.0, Math.round((w * 0.2 / 3.0) * 100) / 100).toFixed(2)} mL`,
      route: 'Rapid IV push via proximal vein (closest to heart) followed IMMEDIATELY by 5-10 mL NS flush',
      maxDoseDisplay: '1st dose max: 6 mg (2 mL) | 2nd dose max: 12 mg (4 mL)',
      clinicalAlert: 'Half-life <10 seconds. Use two syringes on a 3-way stopcock. Have resuscitation equipment and defib pads ready.',
    },
    {
      id: 'calcium_chloride',
      name: 'Calcium Chloride 10%',
      genericName: 'Calcium Chloride 10%',
      category: 'cardiac_arrest',
      categoryLabel: 'Resuscitation & Arrest',
      indication: 'Hyperkalemia, hypocalcemia, hypermagnesemia, calcium-channel blocker overdose',
      doseFormula: '20 mg/kg (0.2 mL/kg)',
      standardConcentration: '100 mg/mL (10% solution)',
      calculatedDoseDisplay: `${Math.min(1000, Math.round(w * 20))} mg`,
      calculatedVolumeDisplay: `${Math.min(10.0, Math.round(w * 0.2 * 10) / 10).toFixed(2)} mL`,
      route: 'IV / IO slow push over 5-10 minutes (central line preferred)',
      maxDoseDisplay: '1000 mg (10.0 mL)',
      clinicalAlert: 'Do NOT give via scalp veins. Severe risk of chemical tissue necrosis if extravasated into peripheral tissues. Prefer Calcium Gluconate for peripheral line.',
    },
    {
      id: 'calcium_gluconate',
      name: 'Calcium Gluconate 10%',
      genericName: 'Calcium Gluconate 10%',
      category: 'cardiac_arrest',
      categoryLabel: 'Resuscitation & Arrest',
      indication: 'Peripheral IV treatment for hypocalcemia and hyperkalemia (less sclerosing)',
      doseFormula: '60 - 100 mg/kg (0.6 - 1.0 mL/kg)',
      standardConcentration: '100 mg/mL (10% solution)',
      calculatedDoseDisplay: `${Math.min(3000, Math.round(w * 60))} - ${Math.min(3000, Math.round(w * 100))} mg`,
      calculatedVolumeDisplay: `${Math.min(30.0, Math.round(w * 0.6 * 10) / 10).toFixed(1)} - ${Math.min(30.0, Math.round(w * 1.0 * 10) / 10).toFixed(1)} mL`,
      route: 'IV / IO slow infusion over 10 - 20 minutes',
      maxDoseDisplay: '3000 mg (30 mL)',
      clinicalAlert: 'Less irritant than chloride. Monitor heart rate during infusion; stop if bradycardia develops.',
    },
    {
      id: 'sodium_bicarb',
      name: isNeonate ? 'Sodium Bicarbonate 4.2% (Neonatal)' : 'Sodium Bicarbonate 8.4%',
      genericName: 'Sodium Bicarbonate',
      category: 'cardiac_arrest',
      categoryLabel: 'Resuscitation & Arrest',
      indication: 'Documented severe metabolic acidosis, prolonged arrest, hyperkalemia, TCA overdose',
      doseFormula: isNeonate ? '1 mEq/kg (2.0 mL/kg of 4.2% solution)' : '1 mEq/kg (1.0 mL/kg of 8.4% solution)',
      standardConcentration: isNeonate ? '4.2% (0.5 mEq/mL)' : '8.4% (1.0 mEq/mL)',
      calculatedDoseDisplay: `${Math.min(50, Math.round(w * 1.0))} mEq`,
      calculatedVolumeDisplay: isNeonate
        ? `${Math.round(w * 2.0 * 10) / 10} mL (4.2%)`
        : `${Math.min(50, Math.round(w * 1.0 * 10) / 10)} mL (8.4%)`,
      route: 'IV / IO slow push over 2-5 minutes',
      maxDoseDisplay: '50 mEq (50 mL of 8.4%)',
      clinicalAlert: isNeonate
        ? 'NEONATE ALERT: Use diluted 4.2% (or 1:1 with sterile water) to prevent hyperosmolar intracranial hemorrhage. Ensure adequate ventilation to blow off CO2!'
        : 'Must flush line before and after with NS—precipitates with calcium salts. Ensure adequate ventilation to eliminate CO2 generated.',
    },
    {
      id: 'ns_bolus',
      name: 'Normal Saline (0.9% NaCl) Resuscitation Bolus',
      genericName: '0.9% Sodium Chloride',
      category: 'fluids_electrolytes',
      categoryLabel: 'Fluids & Electrolytes',
      indication: 'Hypovolemic shock, dehydration, septic shock, trauma volume loss',
      doseFormula: isNeonate ? '10 mL/kg rapid IV' : '10 - 20 mL/kg rapid IV push',
      standardConcentration: '0.9% NaCl isotonic crystalloid',
      calculatedDoseDisplay: isNeonate
        ? `${Math.round(w * 10)} mL (10 mL/kg)`
        : `${Math.round(w * 10)} - ${Math.min(1000, Math.round(w * 20))} mL (10 - 20 mL/kg)`,
      calculatedVolumeDisplay: isNeonate
        ? `${Math.round(w * 10)} mL`
        : `${Math.round(w * 10)} - ${Math.min(1000, Math.round(w * 20))} mL`,
      route: 'IV / IO rapid push via pressure bag or push-pull syringe method',
      maxDoseDisplay: '1000 mL per initial bolus',
      clinicalAlert: isNeonate
        ? 'In neonates and preterm infants, give 10 mL/kg over 10-30 minutes; rapid pushes increase risk of intraventricular hemorrhage.'
        : 'Reassess after each 10-20 mL/kg bolus for signs of volume overload (hepatomegaly, crackles, worsening work of breathing).',
    },

    // --- HYPOGLYCEMIA ---
    {
      id: 'dextrose',
      name: isNeonate ? 'Dextrose 10% (D10W) for Neonatal Hypoglycemia' : w < 30 ? 'Dextrose 10% (D10W) / D25W' : 'Dextrose 50% (D50W)',
      genericName: 'Dextrose',
      category: 'fluids_electrolytes',
      categoryLabel: 'Fluids & Electrolytes',
      indication: 'Symptomatic hypoglycemia (Blood glucose <45 mg/dL in neonate, <60 mg/dL in child)',
      doseFormula: isNeonate ? '2 - 3 mL/kg of D10W (0.2 - 0.3 g/kg)' : w < 30 ? '5 mL/kg of D10W (or 2 mL/kg D25W)' : '1 mL/kg of D50W',
      standardConcentration: isNeonate ? 'D10W (100 mg/mL)' : w < 30 ? 'D10W (100 mg/mL)' : 'D50W (500 mg/mL)',
      calculatedDoseDisplay: isNeonate
        ? `${Math.round(w * 0.2 * 1000)} - ${Math.round(w * 0.3 * 1000)} mg`
        : `${Math.round(w * 0.5 * 1000)} mg (${Math.round(w * 0.5)} g)`,
      calculatedVolumeDisplay: isNeonate
        ? `${Math.round(w * 2.0 * 10) / 10} - ${Math.round(w * 3.0 * 10) / 10} mL of D10W`
        : w < 30
        ? `${Math.min(100, Math.round(w * 5.0 * 10) / 10)} mL of D10W (or ${Math.min(40, Math.round(w * 2.0 * 10) / 10)} mL D25W)`
        : `${Math.min(50, Math.round(w * 1.0 * 10) / 10)} mL of D50W`,
      route: 'IV / IO slow push over 2-3 minutes',
      maxDoseDisplay: 'D10W max 250 mL | D50W max 50 mL',
      clinicalAlert: isNeonate
        ? 'NEONATE SAFETY: NEVER administer D25W or D50W to neonates or infants! Hyperosmolarity causes cerebral hemorrhage and peripheral vein sclerosis. Recheck glucose at 15-30 min.'
        : 'Rule of 50: Dose in mL/kg multiplied by % dextrose = 50. (e.g. 5 mL/kg of D10W = 50; 2 mL/kg of D25W = 50).',
      highPriority: true,
    },

    // --- RAPID SEQUENCE INTUBATION (RSI) ---
    {
      id: 'ketamine_rsi',
      name: 'Ketamine (RSI Induction)',
      genericName: 'Ketamine HCl',
      category: 'rsi_induction',
      categoryLabel: 'RSI Induction Agents',
      indication: 'Induction agent of choice in septic shock, bronchospasm / severe asthma, trauma',
      doseFormula: '1.5 - 2.0 mg/kg IV (or 4.0 mg/kg IM)',
      standardConcentration: '50 mg/mL (or 10 mg/mL diluted)',
      calculatedDoseDisplay: `${Math.round(w * 1.5 * 10) / 10} - ${Math.min(200, Math.round(w * 2.0 * 10) / 10)} mg`,
      calculatedVolumeDisplay: `${Math.round((w * 1.5 / 50.0) * 100) / 100} - ${Math.min(4.0, Math.round((w * 2.0 / 50.0) * 100) / 100).toFixed(2)} mL (from 50 mg/mL)`,
      route: 'IV / IO slow push over 60 seconds (rapid push can cause chest wall rigidity / apnea)',
      maxDoseDisplay: '200 mg IV',
      clinicalAlert: 'Preserves airway reflexes and blood pressure; potent bronchodilator. Salivary secretions may increase (consider suction).',
      highPriority: true,
    },
    {
      id: 'etomidate_rsi',
      name: 'Etomidate (RSI Induction)',
      genericName: 'Etomidate',
      category: 'rsi_induction',
      categoryLabel: 'RSI Induction Agents',
      indication: 'Hemodynamically unstable patient, head injury / elevated ICP without sepsis',
      doseFormula: '0.3 mg/kg IV',
      standardConcentration: '2 mg/mL',
      calculatedDoseDisplay: `${Math.min(20, Math.round(w * 0.3 * 10) / 10)} mg`,
      calculatedVolumeDisplay: `${Math.min(10.0, Math.round((w * 0.3 / 2.0) * 10) / 10).toFixed(2)} mL`,
      route: 'IV / IO slow push over 30-60 seconds',
      maxDoseDisplay: '20 mg (10 mL)',
      clinicalAlert: 'Excellent cardiovascular stability. Caution: Transient adrenal suppression; avoid repeat doses in septic shock.',
    },
    {
      id: 'propofol_rsi',
      name: 'Propofol (RSI Induction)',
      genericName: 'Propofol 1%',
      category: 'rsi_induction',
      categoryLabel: 'RSI Induction Agents',
      indication: 'Status epilepticus, stable patient with reactive airway disease / bronchospasm',
      doseFormula: '1.5 - 2.5 mg/kg IV',
      standardConcentration: '10 mg/mL (1%)',
      calculatedDoseDisplay: `${Math.round(w * 1.5 * 10) / 10} - ${Math.min(200, Math.round(w * 2.5 * 10) / 10)} mg`,
      calculatedVolumeDisplay: `${Math.round((w * 1.5 / 10.0) * 10) / 10} - ${Math.min(20.0, Math.round((w * 2.5 / 10.0) * 10) / 10)} mL`,
      route: 'IV / IO slow injection',
      maxDoseDisplay: '200 mg (20 mL)',
      clinicalAlert: 'WARNING: Causes significant peripheral vasodilation and myocardial depression. DO NOT use in hypovolemia or uncorrected shock.',
    },
    {
      id: 'rocuronium_rsi',
      name: 'Rocuronium (RSI Paralytic)',
      genericName: 'Rocuronium Bromide',
      category: 'rsi_paralytic',
      categoryLabel: 'RSI Paralytics (NMB)',
      indication: 'First-line non-depolarizing paralytic for emergency intubation',
      doseFormula: '1.0 - 1.2 mg/kg IV/IO (rapid intubation dose)',
      standardConcentration: '10 mg/mL',
      calculatedDoseDisplay: `${Math.round(w * 1.0 * 10) / 10} - ${Math.min(100, Math.round(w * 1.2 * 10) / 10)} mg`,
      calculatedVolumeDisplay: `${Math.round((w * 1.0 / 10.0) * 100) / 100} - ${Math.min(10.0, Math.round((w * 1.2 / 10.0) * 100) / 100).toFixed(2)} mL`,
      route: 'IV / IO rapid push',
      maxDoseDisplay: '100 mg (10 mL)',
      clinicalAlert: 'Onset 45-60 seconds; paralysis duration 40-60 minutes. Can be immediately reversed with Sugammadex (16 mg/kg) if cannot intubate/cannot oxygenate.',
      highPriority: true,
    },
    {
      id: 'atracurium_rsi',
      name: 'Atracurium (Tracrium Paralytic)',
      genericName: 'Atracurium Besylate',
      category: 'rsi_paralytic',
      categoryLabel: 'RSI Paralytics (NMB)',
      indication: 'Neuromuscular blockade in intubated/ventilated patients; choice agent in renal or hepatic failure',
      doseFormula: '0.3 - 0.5 mg/kg IV',
      standardConcentration: '10 mg/mL',
      calculatedDoseDisplay: `${Math.round(w * 0.3 * 10) / 10} - ${Math.min(50, Math.round(w * 0.5 * 10) / 10)} mg`,
      calculatedVolumeDisplay: `${Math.round((w * 0.3 / 10.0) * 100) / 100} - ${Math.min(5.0, Math.round((w * 0.5 / 10.0) * 100) / 100).toFixed(2)} mL`,
      route: 'IV push over 30 - 60 seconds',
      maxDoseDisplay: '50 mg (5.0 mL)',
      clinicalAlert: 'Undergoes non-enzymatic Hofmann elimination (organ-independent); safe in kidney/liver failure. Rapid bolus may trigger histamine release & hypotension.',
    },
    {
      id: 'succinylcholine_rsi',
      name: 'Succinylcholine (RSI Depolarizing Paralytic)',
      genericName: 'Succinylcholine Chloride',
      category: 'rsi_paralytic',
      categoryLabel: 'RSI Paralytics (NMB)',
      indication: 'Rapid paralysis with short duration (4-6 min)',
      doseFormula: isNeonate || category === 'infant' ? '2.0 mg/kg IV' : '1.5 - 2.0 mg/kg IV',
      standardConcentration: '20 mg/mL',
      calculatedDoseDisplay: isNeonate || category === 'infant'
        ? `${Math.min(150, Math.round(w * 2.0 * 10) / 10)} mg (2.0 mg/kg)`
        : `${Math.round(w * 1.5 * 10) / 10} - ${Math.min(150, Math.round(w * 2.0 * 10) / 10)} mg`,
      calculatedVolumeDisplay: isNeonate || category === 'infant'
        ? `${Math.min(7.5, Math.round((w * 2.0 / 20.0) * 100) / 100).toFixed(2)} mL`
        : `${Math.round((w * 1.5 / 20.0) * 100) / 100} - ${Math.min(7.5, Math.round((w * 2.0 / 20.0) * 100) / 100).toFixed(2)} mL`,
      route: 'IV / IO rapid push',
      maxDoseDisplay: '150 mg (7.5 mL)',
      clinicalAlert: 'CONTRAINDICATED in known hyperkalemia, burns >24 hours, crush injury, malignant hyperthermia history, or undiagnosed neuromuscular disease (risk of fatal hyperkalemic cardiac arrest).',
    },

    // --- SEDATION & ANALGESIA ---
    {
      id: 'fentanyl',
      name: 'Fentanyl (Analgesia / Sedation)',
      genericName: 'Fentanyl Citrate',
      category: 'sedation_analgesia',
      categoryLabel: 'Sedation & Analgesia',
      indication: 'Pre-treatment blunting sympathetic surge in head injury; severe pain control',
      doseFormula: '1 - 2 mcg/kg IV (0.001 - 0.002 mg/kg)',
      standardConcentration: '50 mcg/mL (0.05 mg/mL)',
      calculatedDoseDisplay: `${Math.round(w * 1.0)} - ${Math.min(100, Math.round(w * 2.0))} mcg`,
      calculatedVolumeDisplay: `${Math.round((w * 1.0 / 50.0) * 100) / 100} - ${Math.min(2.0, Math.round((w * 2.0 / 50.0) * 100) / 100).toFixed(2)} mL`,
      route: 'Slow IV push over 1 - 2 minutes',
      maxDoseDisplay: '100 mcg (2.0 mL)',
      clinicalAlert: 'CAUTION: Rapid push can trigger chest wall rigidity ("wooden chest" syndrome) preventing bag ventilation. Reversible with Naloxone.',
    },
    {
      id: 'morphine',
      name: 'Morphine Sulfate',
      genericName: 'Morphine Sulfate',
      category: 'sedation_analgesia',
      categoryLabel: 'Sedation & Analgesia',
      indication: 'Analgesia for severe pain, sedation adjunct, post-intubation pain management',
      doseFormula: '0.05 - 0.1 mg/kg IV / SC / IM',
      standardConcentration: '10 mg/mL (dilute to 1 mg/mL for pediatric use)',
      calculatedDoseDisplay: `${Math.round(w * 0.05 * 100) / 100} - ${Math.min(10.0, Math.round(w * 0.1 * 10) / 10)} mg`,
      calculatedVolumeDisplay: `${Math.round(w * 0.05 * 100) / 100} - ${Math.min(10.0, Math.round(w * 0.1 * 10) / 10)} mL (from 1 mg/mL dilution)`,
      route: 'Slow IV push over 4 - 5 minutes',
      maxDoseDisplay: '10 mg single dose',
      clinicalAlert: 'May cause histamine release with peripheral vasodilation and hypotension. Use caution in asthma and hemodynamically unstable patients. Reversal: Naloxone.',
    },
    {
      id: 'midazolam',
      name: 'Midazolam (Versed) Sedation / Anxiolysis',
      genericName: 'Midazolam',
      category: 'sedation_analgesia',
      categoryLabel: 'Sedation & Analgesia',
      indication: 'Pre-procedure sedation, adjunct induction, anxiolysis',
      doseFormula: '0.05 - 0.1 mg/kg IV',
      standardConcentration: '1 mg/mL (or 5 mg/mL)',
      calculatedDoseDisplay: `${Math.round(w * 0.05 * 100) / 100} - ${Math.min(5.0, Math.round(w * 0.1 * 10) / 10)} mg`,
      calculatedVolumeDisplay: `${Math.round(w * 0.05 * 100) / 100} - ${Math.min(5.0, Math.round(w * 0.1 * 10) / 10)} mL (from 1 mg/mL)`,
      route: 'IV / IO slow push; or 0.2 mg/kg intranasal',
      maxDoseDisplay: '5.0 mg single dose',
      clinicalAlert: 'Monitor respiratory rate and SpO2 closely. Reversal agent: Flumazenil (0.01 mg/kg).',
    },

    // --- STATUS EPILEPTICUS ---
    {
      id: 'midazolam_seizure',
      name: 'Midazolam (Status Epilepticus First-Line)',
      genericName: 'Midazolam',
      category: 'status_epilepticus',
      categoryLabel: 'Status Epilepticus',
      indication: 'Active generalized convulsive seizure >5 minutes',
      doseFormula: '0.2 mg/kg Intranasal (IN) or Buccal / IM (or 0.1-0.2 mg/kg IV)',
      standardConcentration: '5 mg/mL (preferred for IN/IM/buccal volume)',
      calculatedDoseDisplay: `${Math.min(10, Math.round(w * 0.2 * 10) / 10)} mg`,
      calculatedVolumeDisplay: `${Math.min(2.0, Math.round((w * 0.2 / 5.0) * 100) / 100).toFixed(2)} mL (from 5 mg/mL vial)`,
      route: 'Intranasal (IN with atomizer, divide between both nares), IM, or Buccal; or IV if line available',
      maxDoseDisplay: '10 mg (2.0 mL of 5 mg/mL)',
      clinicalAlert: 'Preferred first-line pre-hospital / ED seizure abortive when IV access is not yet secured. May repeat once after 5-10 min.',
      highPriority: true,
    },
    {
      id: 'diazepam_seizure',
      name: 'Diazepam (Valium) IV / PR',
      genericName: 'Diazepam',
      category: 'status_epilepticus',
      categoryLabel: 'Status Epilepticus',
      indication: 'Prolonged seizure, status epilepticus, acute severe muscle spasticity',
      doseFormula: '0.2 - 0.3 mg/kg IV slow push (or 0.5 mg/kg PR rectal gel)',
      standardConcentration: '5 mg/mL',
      calculatedDoseDisplay: `${Math.round(w * 0.2 * 10) / 10} - ${Math.min(w < 15 ? 5.0 : 10.0, Math.round(w * 0.3 * 10) / 10)} mg`,
      calculatedVolumeDisplay: `${Math.round((w * 0.2 / 5.0) * 100) / 100} - ${Math.min(w < 15 ? 1.0 : 2.0, Math.round((w * 0.3 / 5.0) * 100) / 100).toFixed(2)} mL`,
      route: 'IV push slowly (max rate 1-2 mg/min) or Rectal (PR)',
      maxDoseDisplay: '5.0 mg (<5 yrs), 10.0 mg (≥5 yrs)',
      clinicalAlert: 'Inject slowly into large vein to avoid local venous thrombosis. Rapid injection causes respiratory depression and hypotension. Reversal: Flumazenil.',
    },
    {
      id: 'lorazepam_seizure',
      name: 'Lorazepam (Ativan) IV',
      genericName: 'Lorazepam',
      category: 'status_epilepticus',
      categoryLabel: 'Status Epilepticus',
      indication: 'Active seizure when IV access is established',
      doseFormula: '0.1 mg/kg IV',
      standardConcentration: '2 mg/mL',
      calculatedDoseDisplay: `${Math.min(4.0, Math.round(w * 0.1 * 10) / 10)} mg`,
      calculatedVolumeDisplay: `${Math.min(2.0, Math.round((w * 0.1 / 2.0) * 100) / 100).toFixed(2)} mL`,
      route: 'IV / IO slow push over 2 minutes',
      maxDoseDisplay: '4.0 mg (2.0 mL)',
      clinicalAlert: 'Longer duration of anticonvulsant action (4-6 hours) than midazolam or diazepam.',
    },
    {
      id: 'keppra_seizure',
      name: 'Levetiracetam (Keppra) 2nd-Line Anticonvulsant',
      genericName: 'Levetiracetam',
      category: 'status_epilepticus',
      categoryLabel: 'Status Epilepticus',
      indication: 'Status epilepticus refractory to benzodiazepines (established status)',
      doseFormula: '40 - 60 mg/kg IV',
      standardConcentration: '100 mg/mL',
      calculatedDoseDisplay: `${Math.min(3000, Math.round(w * 40))} - ${Math.min(3000, Math.round(w * 60))} mg`,
      calculatedVolumeDisplay: `${Math.min(30.0, Math.round((w * 40 / 100.0) * 10) / 10)} - ${Math.min(30.0, Math.round((w * 60 / 100.0) * 10) / 10)} mL`,
      route: 'IV infusion in 50-100 mL NS over 10 - 15 minutes',
      maxDoseDisplay: '3000 mg (30 mL)',
      clinicalAlert: 'Minimal cardiac or respiratory depressant effect compared to phenytoin or phenobarbital.',
    },
    {
      id: 'phenobarbital_seizure',
      name: isNeonate ? 'Phenobarbital (Neonatal Seizures 1st-Line)' : 'Phenobarbital',
      genericName: 'Phenobarbital Sodium',
      category: 'status_epilepticus',
      categoryLabel: 'Status Epilepticus',
      indication: isNeonate ? 'FIRST-LINE anticonvulsant for neonatal seizures' : 'Refractory status epilepticus',
      doseFormula: '20 mg/kg IV loading dose',
      standardConcentration: '130 mg/mL (or 65 mg/mL)',
      calculatedDoseDisplay: `${Math.min(1000, Math.round(w * 20))} mg`,
      calculatedVolumeDisplay: `${Math.min(7.7, Math.round((w * 20 / 130.0) * 100) / 100).toFixed(2)} mL (from 130 mg/mL)`,
      route: 'IV slow infusion over 15 - 20 minutes (rate ≤ 1 mg/kg/min)',
      maxDoseDisplay: '1000 mg',
      clinicalAlert: 'Gold standard for neonatal seizures (NRP/NICU). Watch for respiratory depression and hypotension; ensure bag-mask is ready.',
    },

    // --- ANAPHYLAXIS ---
    {
      id: 'epi_anaphylaxis',
      name: 'Epinephrine 1:1,000 (IM Anaphylaxis)',
      genericName: 'Epinephrine',
      category: 'anaphylaxis',
      categoryLabel: 'Anaphylaxis & Allergy',
      indication: 'Severe allergic reaction, stridor, bronchospasm, or hypotension from anaphylaxis',
      doseFormula: '0.01 mg/kg (0.01 mL/kg of 1:1,000 IM)',
      standardConcentration: '1:1,000 (1.0 mg/mL)',
      calculatedDoseDisplay: `${Math.min(0.5, Math.max(0.05, Math.round(w * 0.01 * 100) / 100)).toFixed(2)} mg`,
      calculatedVolumeDisplay: `${Math.min(0.5, Math.max(0.05, Math.round(w * 0.01 * 100) / 100)).toFixed(2)} mL`,
      route: 'Intramuscular (IM) ONLY into mid-anterolateral thigh',
      maxDoseDisplay: '0.3 mg (0.3 mL) prepubertal, 0.5 mg (0.5 mL) postpubertal',
      clinicalAlert: 'DO NOT administer 1:1,000 IV! IM anterolateral thigh provides rapid vascular absorption. Repeat every 5-15 min if poor response.',
      highPriority: true,
    },
    {
      id: 'diphenhydramine',
      name: 'Diphenhydramine (Benadryl)',
      genericName: 'Diphenhydramine HCl',
      category: 'anaphylaxis',
      categoryLabel: 'Anaphylaxis & Allergy',
      indication: 'Histamine H1-blockade for urticaria, pruritus, adjunct in anaphylaxis',
      doseFormula: '1.0 mg/kg IV / IM',
      standardConcentration: '50 mg/mL',
      calculatedDoseDisplay: `${Math.min(50, Math.round(w * 1.0 * 10) / 10)} mg`,
      calculatedVolumeDisplay: `${Math.min(1.0, Math.round((w * 1.0 / 50.0) * 100) / 100).toFixed(2)} mL`,
      route: 'IV slow push or deep IM',
      maxDoseDisplay: '50 mg (1.0 mL)',
      clinicalAlert: 'Second-line adjunct; NEVER substitute for Epinephrine in acute anaphylaxis. Causes sedation.',
    },
    {
      id: 'methylprednisolone',
      name: 'Methylprednisolone (Solu-Medrol)',
      genericName: 'Methylprednisolone Sodium Succinate',
      category: 'anaphylaxis',
      categoryLabel: 'Anaphylaxis & Allergy',
      indication: 'Biphasic anaphylaxis prevention, severe asthma flare',
      doseFormula: '1 - 2 mg/kg IV',
      standardConcentration: '40 mg/mL (reconstituted)',
      calculatedDoseDisplay: `${Math.min(60, Math.round(w * 1.0 * 10) / 10)} - ${Math.min(125, Math.round(w * 2.0 * 10) / 10)} mg`,
      calculatedVolumeDisplay: `${Math.min(1.5, Math.round((w * 1.0 / 40.0) * 10) / 10).toFixed(1)} - ${Math.min(3.1, Math.round((w * 2.0 / 40.0) * 10) / 10).toFixed(1)} mL`,
      route: 'IV / IO push over 3-5 minutes',
      maxDoseDisplay: '60 mg for asthma, 125 mg for anaphylaxis',
      clinicalAlert: 'Slow onset (4-6 hours); does not treat acute airway obstruction immediately.',
    },

    // --- RESPIRATORY (CROUP, ASTHMA) ---
    {
      id: 'dexamethasone',
      name: 'Dexamethasone (Croup & Asthma)',
      genericName: 'Dexamethasone Sodium Phosphate',
      category: 'respiratory',
      categoryLabel: 'Respiratory (Croup / Asthma)',
      indication: 'Moderate-to-severe Croup (laryngotracheobronchitis), acute pediatric asthma',
      doseFormula: '0.6 mg/kg PO / IV / IM',
      standardConcentration: '4 mg/mL (injectable) or 2 mg/5 mL (oral)',
      calculatedDoseDisplay: `${Math.min(16.0, Math.round(w * 0.6 * 10) / 10)} mg`,
      calculatedVolumeDisplay: `${Math.min(4.0, Math.round((w * 0.6 / 4.0) * 10) / 10).toFixed(2)} mL (from 4 mg/mL vial)`,
      route: 'PO (oral liquid), IV, or IM',
      maxDoseDisplay: '16.0 mg (4.0 mL)',
      clinicalAlert: 'Single dose provides 72 hours of anti-inflammatory action in viral croup. Oral and IV bioavailability are equivalent.',
    },
    {
      id: 'racemic_epi',
      name: 'Nebulized Epinephrine (Racemic or L-Epi)',
      genericName: 'Epinephrine Nebulized',
      category: 'respiratory',
      categoryLabel: 'Respiratory (Croup / Asthma)',
      indication: 'Stridor at rest from croup, post-extubation subglottic edema, severe bronchiolitis',
      doseFormula: '0.5 mL of 2.25% racemic OR 3 - 5 mL of 1:1,000 (1 mg/mL) L-epinephrine',
      standardConcentration: '2.25% Racemic Epinephrine (or standard 1:1,000 1 mg/mL)',
      calculatedDoseDisplay: w < 5 ? '0.25 mL Racemic (or 2.5 mL 1:1000)' : '0.5 mL Racemic (or 5 mL 1:1000)',
      calculatedVolumeDisplay: w < 5 ? '0.25 mL + 2.5 mL NS' : '0.5 mL + 3 mL NS',
      route: 'Inhalation via nebulizer with 6 - 8 L/min O2 flow',
      maxDoseDisplay: '0.5 mL of 2.25% racemic epi',
      clinicalAlert: 'Alpha-1 vasoconstriction shrinks subglottic mucosal edema. Observe patient for minimum 2-3 hours for rebound stridor.',
    },
    {
      id: 'magnesium_sulfate',
      name: 'Magnesium Sulfate (Severe Asthma)',
      genericName: 'Magnesium Sulfate 50%',
      category: 'respiratory',
      categoryLabel: 'Respiratory (Croup / Asthma)',
      indication: 'Refractory acute severe pediatric asthma unresponsive to initial bronchodilators',
      doseFormula: '50 mg/kg IV',
      standardConcentration: '500 mg/mL (50% solution - MUST DILUTE)',
      calculatedDoseDisplay: `${Math.min(2000, Math.round(w * 50))} mg (${Math.min(2.0, Math.round((w * 50 / 1000) * 10) / 10)} g)`,
      calculatedVolumeDisplay: `${Math.min(4.0, Math.round((w * 50 / 500) * 10) / 10).toFixed(1)} mL (dilute into 50-100 mL NS)`,
      route: 'IV infusion over 20 minutes',
      maxDoseDisplay: '2000 mg (2.0 grams)',
      clinicalAlert: 'Potent bronchial smooth muscle relaxant. Infuse slowly; rapid push causes severe hypotension and bradycardia.',
    },
    {
      id: 'albuterol_neb',
      name: 'Albuterol (Salbutamol) Nebulization',
      genericName: 'Albuterol Sulfate',
      category: 'respiratory',
      categoryLabel: 'Respiratory (Croup / Asthma)',
      indication: 'Acute bronchospasm, asthma exacerbation, hyperkalemia temporization',
      doseFormula: w < 20 ? '2.5 mg nebulized' : '5.0 mg nebulized',
      standardConcentration: '2.5 mg / 3 mL unit-dose vial (0.083%)',
      calculatedDoseDisplay: w < 20 ? '2.5 mg' : '5.0 mg',
      calculatedVolumeDisplay: w < 20 ? '3 mL (1 nebule)' : '6 mL (2 nebules)',
      route: 'Inhalation via nebulizer with 6-8 L/min O2',
      maxDoseDisplay: 'Continuous 10-20 mg/hr in status asthmaticus',
      clinicalAlert: 'Can repeat back-to-back every 20 minutes for 3 doses, or run continuous nebulization in severe respiratory distress.',
    },

    // --- ANTIDOTES & REVERSAL AGENTS ---
    {
      id: 'naloxone',
      name: 'Naloxone (Narcan) Opioid Reversal',
      genericName: 'Naloxone HCl',
      category: 'antidote_reversal',
      categoryLabel: 'Antidotes & Reversal Agents',
      indication: 'Opioid-induced respiratory depression or complete apnea',
      doseFormula: '0.1 mg/kg IV/IO/IM/IN (<5 years or <20 kg); 2.0 mg (≥5 years or ≥20 kg)',
      standardConcentration: '0.4 mg/mL (or 1.0 mg/mL)',
      calculatedDoseDisplay: w < 20
        ? `${Math.min(2.0, Math.round(w * 0.1 * 100) / 100).toFixed(2)} mg`
        : '2.0 mg (adult full dose)',
      calculatedVolumeDisplay: w < 20
        ? `${Math.min(5.0, Math.round((w * 0.1 / 0.4) * 10) / 10).toFixed(1)} mL (from 0.4 mg/mL)`
        : '5.0 mL (from 0.4 mg/mL) or 2 mL (from 1 mg/mL)',
      route: 'IV / IO / IM or Intranasal (IN)',
      maxDoseDisplay: '2.0 mg single dose',
      clinicalAlert: 'Duration is 30-45 minutes; shorter than many opioids (e.g. methadone, morphine). Watch closely for recurrent respiratory depression.',
    },
    {
      id: 'sugammadex',
      name: 'Sugammadex (Bridion) Rocuronium Reversal',
      genericName: 'Sugammadex',
      category: 'antidote_reversal',
      categoryLabel: 'Antidotes & Reversal Agents',
      indication: 'Immediate rescue reversal of rocuronium or vecuronium paralysis in "cannot intubate, cannot oxygenate" crisis',
      doseFormula: '16 mg/kg IV for emergency immediate reversal; 2-4 mg/kg for routine reversal',
      standardConcentration: '100 mg/mL',
      calculatedDoseDisplay: `Emergency: ${Math.round(w * 16)} mg | Routine: ${Math.round(w * 4)} mg`,
      calculatedVolumeDisplay: `Emergency: ${Math.round((w * 16 / 100) * 10) / 10} mL | Routine: ${Math.round((w * 4 / 100) * 10) / 10} mL`,
      route: 'IV rapid bolus within 10 seconds',
      maxDoseDisplay: '1600 mg (16 mL)',
      clinicalAlert: 'Encapsulates rocuronium molecules within seconds, restoring spontaneous diaphragmatic breathing in 1.5 - 3 minutes.',
    },
    {
      id: 'flumazenil',
      name: 'Flumazenil (Romazicon) Benzodiazepine Reversal',
      genericName: 'Flumazenil',
      category: 'antidote_reversal',
      categoryLabel: 'Antidotes & Reversal Agents',
      indication: 'Isolated acute benzodiazepine overdose with severe respiratory depression',
      doseFormula: '0.01 mg/kg IV',
      standardConcentration: '0.1 mg/mL',
      calculatedDoseDisplay: `${Math.min(0.2, Math.round(w * 0.01 * 100) / 100).toFixed(2)} mg`,
      calculatedVolumeDisplay: `${Math.min(2.0, Math.round((w * 0.01 / 0.1) * 10) / 10).toFixed(1)} mL`,
      route: 'IV slow push over 15-30 seconds',
      maxDoseDisplay: '0.2 mg initial dose (max cumulative 1 mg)',
      clinicalAlert: 'CONTRAINDICATED in patients with epilepsy, chronic benzodiazepine dependence, or co-ingestion of tricyclic antidepressants (triggers intractable status epilepticus).',
    },
  ];

  return meds;
}

/**
 * Generates the prioritized 10-Drug Chart specifically requested for Pediatric/Neonatal
 * Emergency Sedation, Paralysis, and Analgesia:
 * 1. Fentanyl
 * 2. Morphine
 * 3. Rocuronium
 * 4. Atracurium (Atracoronium)
 * 5. Succinylcholine (Succinyl Colin)
 * 6. Midazolam
 * 7. Diazepam
 * 8. Ketamine (Ketamin)
 * 9. Etomidate
 * 10. Propofol
 */
export function getCoreRsiSedationChart(params: PatientParameters): CoreMedicationChartItem[] {
  const { actualWeightKg, category } = params;
  const w = actualWeightKg;
  const isNeonateOrInfant = category === 'preterm_neonate' || category === 'term_neonate' || category === 'infant';

  return [
    // 1. Fentanyl
    {
      id: 'core_fentanyl',
      name: 'Fentanyl',
      genericName: 'Fentanyl Citrate',
      classType: 'Opioid Analgesic / Pre-medication',
      indication: 'Analgesia, blunts sympathetic/ICP surge during intubation, sedation',
      doseFormula: '1 - 2 mcg/kg IV (0.001 - 0.002 mg/kg)',
      calculatedDose: `${Math.round(w * 1.0)} - ${Math.min(100, Math.round(w * 2.0))} mcg`,
      standardConcentration: '50 mcg/mL (0.05 mg/mL)',
      volumeToDraw: `${Math.round((w * 1.0 / 50.0) * 100) / 100} - ${Math.min(2.0, Math.round((w * 2.0 / 50.0) * 100) / 100).toFixed(2)} mL`,
      route: 'Slow IV push over 1 - 2 min',
      onsetDuration: 'Onset: 1 - 2 min | Duration: 30 - 60 min',
      maxDose: '100 mcg (2.0 mL) per single dose',
      clinicalAlert: 'Inject slowly over 1-2 min. Rapid IV push can cause fatal glottic & chest wall rigidity ("wooden chest"). Reversible with Naloxone.',
      priorityColor: 'amber',
    },

    // 2. Morphine
    {
      id: 'core_morphine',
      name: 'Morphine',
      genericName: 'Morphine Sulfate',
      classType: 'Opioid Analgesic',
      indication: 'Severe pain control, pulmonary edema, sedation adjunct',
      doseFormula: '0.05 - 0.1 mg/kg IV (or SC/IM)',
      calculatedDose: `${Math.round(w * 0.05 * 100) / 100} - ${Math.min(10.0, Math.round(w * 0.1 * 10) / 10)} mg`,
      standardConcentration: '10 mg/mL (dilute to 1 mg/mL for pediatric accuracy)',
      volumeToDraw: `From 1 mg/mL dilution: ${Math.round(w * 0.05 * 100) / 100} - ${Math.min(10.0, Math.round(w * 0.1 * 10) / 10)} mL (or ${Math.round((w * 0.05 / 10) * 100) / 100} - ${Math.min(1.0, Math.round((w * 0.1 / 10) * 100) / 100).toFixed(2)} mL undiluted)`,
      route: 'Slow IV over 4 - 5 min',
      onsetDuration: 'Onset: 5 - 10 min | Duration: 2 - 4 hours',
      maxDose: '10 mg single dose',
      clinicalAlert: 'Causes histamine release leading to peripheral vasodilation and hypotension. Use caution in asthma/hypovolemia. Reversible with Naloxone.',
      priorityColor: 'amber',
    },

    // 3. Rocuronium
    {
      id: 'core_rocuronium',
      name: 'Rocuronium',
      genericName: 'Rocuronium Bromide',
      classType: 'Non-Depolarizing NMB (Paralytic)',
      indication: 'Rapid sequence intubation (RSI), continuous paralysis in ventilated patients',
      doseFormula: '1.0 - 1.2 mg/kg IV/IO (intubation dose)',
      calculatedDose: `${Math.round(w * 1.0 * 10) / 10} - ${Math.min(100, Math.round(w * 1.2 * 10) / 10)} mg`,
      standardConcentration: '10 mg/mL',
      volumeToDraw: `${Math.round((w * 1.0 / 10.0) * 100) / 100} - ${Math.min(10.0, Math.round((w * 1.2 / 10.0) * 100) / 100).toFixed(2)} mL`,
      route: 'Rapid IV / IO push',
      onsetDuration: 'Onset: 45 - 60 sec | Duration: 40 - 60 min',
      maxDose: '100 mg (10 mL)',
      clinicalAlert: 'Paralytic of first choice in pediatric emergency intubation. Can be immediately reversed with Sugammadex (16 mg/kg) in "cannot ventilate" crisis.',
      priorityColor: 'rose',
    },

    // 4. Atracurium (Atracoronium)
    {
      id: 'core_atracurium',
      name: 'Atracurium (Atracoronium)',
      genericName: 'Atracurium Besylate',
      classType: 'Non-Depolarizing NMB (Paralytic)',
      indication: 'Skeletal muscle relaxation during intubation & mechanical ventilation (choice agent in renal/hepatic failure)',
      doseFormula: '0.3 - 0.5 mg/kg IV',
      calculatedDose: `${Math.round(w * 0.3 * 10) / 10} - ${Math.min(50, Math.round(w * 0.5 * 10) / 10)} mg`,
      standardConcentration: '10 mg/mL',
      volumeToDraw: `${Math.round((w * 0.3 / 10.0) * 100) / 100} - ${Math.min(5.0, Math.round((w * 0.5 / 10.0) * 100) / 100).toFixed(2)} mL`,
      route: 'IV push over 30 - 60 sec',
      onsetDuration: 'Onset: 2 - 3 min | Duration: 20 - 35 min',
      maxDose: '50 mg (5.0 mL)',
      clinicalAlert: 'Undergoes non-enzymatic Hofmann elimination; ideal and safe in renal or liver failure. Avoid rapid bolus to prevent histamine-induced hypotension.',
      priorityColor: 'rose',
    },

    // 5. Succinylcholine (Succynil Colin)
    {
      id: 'core_succinylcholine',
      name: 'Succinylcholine (Succinyl Colin)',
      genericName: 'Succinylcholine Chloride',
      classType: 'Depolarizing NMB (Paralytic)',
      indication: 'Ultra-rapid muscular paralysis for emergency tracheal intubation',
      doseFormula: isNeonateOrInfant ? '2.0 mg/kg IV (infants require 2 mg/kg)' : '1.5 - 2.0 mg/kg IV',
      calculatedDose: isNeonateOrInfant
        ? `${Math.min(150, Math.round(w * 2.0 * 10) / 10)} mg`
        : `${Math.round(w * 1.5 * 10) / 10} - ${Math.min(150, Math.round(w * 2.0 * 10) / 10)} mg`,
      standardConcentration: '20 mg/mL',
      volumeToDraw: isNeonateOrInfant
        ? `${Math.min(7.5, Math.round((w * 2.0 / 20.0) * 100) / 100).toFixed(2)} mL`
        : `${Math.round((w * 1.5 / 20.0) * 100) / 100} - ${Math.min(7.5, Math.round((w * 2.0 / 20.0) * 100) / 100).toFixed(2)} mL`,
      route: 'Rapid IV / IO push',
      onsetDuration: 'Onset: 30 - 45 sec | Duration: 4 - 6 min',
      maxDose: '150 mg (7.5 mL)',
      clinicalAlert: 'FATAL HYPERKALEMIA RISK: Contraindicated in known hyperkalemia, burns >24h, crush trauma, muscular dystrophy, or malignant hyperthermia. Pre-treat infants with Atropine.',
      priorityColor: 'rose',
    },

    // 6. Midazolam
    {
      id: 'core_midazolam',
      name: 'Midazolam',
      genericName: 'Midazolam HCl',
      classType: 'Benzodiazepine (Sedative / Anxiolytic)',
      indication: 'RSI induction adjunct, conscious sedation, status epilepticus, anxiolysis',
      doseFormula: 'Sedation: 0.05 - 0.1 mg/kg IV | RSI: 0.1 - 0.2 mg/kg IV (or 0.2 mg/kg IN)',
      calculatedDose: `${Math.round(w * 0.1 * 10) / 10} - ${Math.min(10, Math.round(w * 0.2 * 10) / 10)} mg`,
      standardConcentration: '5 mg/mL (or 1 mg/mL)',
      volumeToDraw: `From 5 mg/mL: ${Math.round((w * 0.1 / 5.0) * 100) / 100} - ${Math.min(2.0, Math.round((w * 0.2 / 5.0) * 100) / 100).toFixed(2)} mL (from 1 mg/mL: ${Math.round(w * 0.1 * 10) / 10} - ${Math.min(10, Math.round(w * 0.2 * 10) / 10)} mL)`,
      route: 'IV slow push, Intranasal (IN), IM, or Buccal',
      onsetDuration: 'Onset: 1 - 3 min | Duration: 30 - 60 min',
      maxDose: '10 mg single dose',
      clinicalAlert: 'Causes respiratory depression and synergistic hypotension when combined with opioids. Rapid reversal with Flumazenil (0.01 mg/kg).',
      priorityColor: 'cyan',
    },

    // 7. Diazepam
    {
      id: 'core_diazepam',
      name: 'Diazepam',
      genericName: 'Diazepam',
      classType: 'Benzodiazepine (Anticonvulsant / Sedative)',
      indication: 'Status epilepticus, acute sedation, acute severe muscle spasticity',
      doseFormula: '0.2 - 0.3 mg/kg IV slow push (or 0.5 mg/kg PR rectal)',
      calculatedDose: `${Math.round(w * 0.2 * 10) / 10} - ${Math.min(w < 15 ? 5.0 : 10.0, Math.round(w * 0.3 * 10) / 10)} mg`,
      standardConcentration: '5 mg/mL',
      volumeToDraw: `${Math.round((w * 0.2 / 5.0) * 100) / 100} - ${Math.min(w < 15 ? 1.0 : 2.0, Math.round((w * 0.3 / 5.0) * 100) / 100).toFixed(2)} mL`,
      route: 'IV slow push (rate ≤ 1-2 mg/min) or Rectal (PR)',
      onsetDuration: 'Onset: 1 - 3 min | Duration: 15 - 30 min redistribution',
      maxDose: '5 mg (<5 yrs), 10 mg (≥5 yrs)',
      clinicalAlert: 'Formulated in propylene glycol; must inject slowly into a large vein to prevent thrombophlebitis, apnea, and bradycardia. Reversal: Flumazenil.',
      priorityColor: 'cyan',
    },

    // 8. Ketamine (Ketamin)
    {
      id: 'core_ketamine',
      name: 'Ketamine (Ketamin)',
      genericName: 'Ketamine HCl',
      classType: 'Dissociative Anesthetic / NMDA Antagonist',
      indication: 'RSI induction of choice in sepsis/shock, severe asthma/bronchospasm, analgesia',
      doseFormula: '1.5 - 2.0 mg/kg IV (or 4.0 mg/kg IM)',
      calculatedDose: `${Math.round(w * 1.5 * 10) / 10} - ${Math.min(200, Math.round(w * 2.0 * 10) / 10)} mg`,
      standardConcentration: '50 mg/mL (or 10 mg/mL diluted)',
      volumeToDraw: `${Math.round((w * 1.5 / 50.0) * 100) / 100} - ${Math.min(4.0, Math.round((w * 2.0 / 50.0) * 100) / 100).toFixed(2)} mL (from 50 mg/mL)`,
      route: 'IV / IO slow push over 60 sec (or IM)',
      onsetDuration: 'Onset: 30 - 60 sec | Duration: 15 - 30 min',
      maxDose: '200 mg IV',
      clinicalAlert: 'Preserves airway tone and hemodynamics via catecholamine release; potent bronchodilator. Rapid push can cause transient apnea or laryngospasm.',
      priorityColor: 'purple',
    },

    // 9. Etomidate
    {
      id: 'core_etomidate',
      name: 'Etomidate',
      genericName: 'Etomidate',
      classType: 'Non-Barbiturate Hypnotic',
      indication: 'RSI induction in hemodynamically unstable patients, trauma, elevated ICP',
      doseFormula: '0.3 mg/kg IV',
      calculatedDose: `${Math.min(20, Math.round(w * 0.3 * 10) / 10)} mg`,
      standardConcentration: '2 mg/mL',
      volumeToDraw: `${Math.min(10.0, Math.round((w * 0.3 / 2.0) * 10) / 10).toFixed(2)} mL`,
      route: 'IV / IO push over 30 - 60 sec',
      onsetDuration: 'Onset: 15 - 30 sec | Duration: 5 - 15 min',
      maxDose: '20 mg (10 mL)',
      clinicalAlert: 'Maintains cerebral perfusion pressure with minimal drop in BP. Inhibits 11-beta-hydroxylase causing transient adrenal suppression; avoid repeated doses.',
      priorityColor: 'purple',
    },

    // 10. Propofol
    {
      id: 'core_propofol',
      name: 'Propofol',
      genericName: 'Propofol 1%',
      classType: 'Alkylphenol Hypnotic / GABA-A Agonist',
      indication: 'RSI induction in hemodynamically stable patients, status epilepticus, severe bronchospasm',
      doseFormula: '1.5 - 2.5 mg/kg IV',
      calculatedDose: `${Math.round(w * 1.5 * 10) / 10} - ${Math.min(200, Math.round(w * 2.5 * 10) / 10)} mg`,
      standardConcentration: '10 mg/mL (1%)',
      volumeToDraw: `${Math.round((w * 1.5 / 10.0) * 10) / 10} - ${Math.min(20.0, Math.round((w * 2.5 / 10.0) * 10) / 10)} mL`,
      route: 'Slow IV / IO injection',
      onsetDuration: 'Onset: 15 - 30 sec | Duration: 5 - 10 min',
      maxDose: '200 mg (20 mL)',
      clinicalAlert: 'POTENT VASODILATOR & MYOCARDIAL DEPRESSANT: Causes severe hypotension. Strictly contraindicated in shock, hypovolemia, or egg/soy allergy.',
      priorityColor: 'purple',
    },
  ];
}

/**
 * Pre-configured neonatal and pediatric quick presets for emergency room speed.
 */
export interface QuickPatientPreset {
  id: string;
  name: string;
  heightCm: number;
  expectedWeightKg: number;
  description: string;
}

export const QUICK_PATIENT_PRESETS: QuickPatientPreset[] = [
  {
    id: 'preterm_28w',
    name: 'Preterm 28w',
    heightCm: 33,
    expectedWeightKg: 1.1,
    description: 'Extremely preterm neonate (ELBW/VLBW)',
  },
  {
    id: 'preterm_32w',
    name: 'Preterm 32w',
    heightCm: 39,
    expectedWeightKg: 1.8,
    description: 'Very preterm neonate',
  },
  {
    id: 'late_preterm_35w',
    name: 'Preterm 35w',
    heightCm: 44,
    expectedWeightKg: 2.4,
    description: 'Late preterm newborn',
  },
  {
    id: 'term_newborn',
    name: 'Term Newborn',
    heightCm: 50,
    expectedWeightKg: 3.4,
    description: 'Full-term 40w newborn (~3.4 kg)',
  },
  {
    id: 'infant_3mo',
    name: '3 Months',
    heightCm: 60,
    expectedWeightKg: 5.5,
    description: 'Broselow Pink border (~5.5-6 kg)',
  },
  {
    id: 'infant_9mo',
    name: '9 Months',
    heightCm: 71,
    expectedWeightKg: 8.3,
    description: 'Broselow Red zone (~8.5 kg)',
  },
  {
    id: 'toddler_18mo',
    name: '18 Months',
    heightCm: 82,
    expectedWeightKg: 11.2,
    description: 'Broselow Purple zone (~10-11 kg)',
  },
  {
    id: 'toddler_3yr',
    name: '3 Years',
    heightCm: 95,
    expectedWeightKg: 14.1,
    description: 'Broselow Yellow zone (~14 kg)',
  },
  {
    id: 'child_5yr',
    name: '5 Years',
    heightCm: 108,
    expectedWeightKg: 18.0,
    description: 'Broselow White zone (~18 kg)',
  },
  {
    id: 'child_7yr',
    name: '7 Years',
    heightCm: 121,
    expectedWeightKg: 23.1,
    description: 'Broselow Blue zone (~23 kg)',
  },
  {
    id: 'child_9yr',
    name: '9 Years',
    heightCm: 133,
    expectedWeightKg: 29.0,
    description: 'Broselow Orange zone (~29 kg)',
  },
  {
    id: 'child_11yr',
    name: '11 Years',
    heightCm: 144,
    expectedWeightKg: 36.3,
    description: 'Broselow Green zone (~36 kg)',
  },
  {
    id: 'adolescent_14yr',
    name: '14 Years',
    heightCm: 160,
    expectedWeightKg: 46.8,
    description: 'Adolescent patient (~47 kg)',
  },
];
