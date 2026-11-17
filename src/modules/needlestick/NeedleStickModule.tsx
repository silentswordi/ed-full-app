import { useState } from 'react';
import { Header } from './components/Header';
import { AssessmentForm } from './components/AssessmentForm';
import { ProtocolResult } from './components/ProtocolResult';
import { evaluateClinicalProtocol } from './engine/mohProtocol';
import { ClinicalAssessmentInput, FullClinicalProtocol } from './types/clinical';

const DEFAULT_INPUT: ClinicalAssessmentInput = {
  timeWindow: 'under_2h',
  exposureType: 'percutaneous_high',
  sourceKnowledge: 'known',
  sourceHbsAg: 'unknown',
  sourceAntiHcv: 'unknown',
  sourceHiv: 'unknown',
  sourceHighRisk: false,
  hcwHbvStatus: 'vaccinated_responder',
  isPregnantOrBreastfeeding: false,
  hasRenalDisease: false,
};

export default function NeedleStickModule() {
  const [input, setInput] = useState<ClinicalAssessmentInput>(DEFAULT_INPUT);
  const [protocol, setProtocol] = useState<FullClinicalProtocol | null>(null);

  const handleSubmit = () => {
    setProtocol(evaluateClinicalProtocol(input));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setInput(DEFAULT_INPUT);
    setProtocol(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div dir="rtl" className="min-h-[calc(100vh-2.75rem)] flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Header onReset={handleReset} />

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6">
        {!protocol ? (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              ارزیابی مواجه شغلی
            </h1>

            <AssessmentForm
              input={input}
              onChange={setInput}
              onSubmit={handleSubmit}
            />
          </div>
        ) : (
          <ProtocolResult
            protocol={protocol}
            onEdit={() => setProtocol(null)}
          />
        )}
      </main>
    </div>
  );
}
