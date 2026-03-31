import React, { useState, useEffect } from 'react';
import { Crosshair, Shield, Activity, RefreshCw, TrendingDown, Info, Database } from 'lucide-react';
import { cn } from '../lib/utils';

export function Dashboard() {
  const [models, setModels] = useState<string[]>([]);
  const [modelA, setModelA] = useState('');
  const [modelB, setModelB] = useState('');
  const [noise, setNoise] = useState(0);
  const [noiseType, setNoiseType] = useState('Gaussian');
  const [isPredicting, setIsPredicting] = useState(false);
  const [resultA, setResultA] = useState<any>(null);
  const [resultB, setResultB] = useState<any>(null);

  // Financial Variables
  const [income, setIncome] = useState(85000);
  const [coapplicantIncome, setCoapplicantIncome] = useState(0);
  const [credit, setCredit] = useState(720);
  const [loan, setLoan] = useState(250000);
  const [loanTerm, setLoanTerm] = useState(360);

  // Demographic Variables
  const [gender, setGender] = useState('Male');
  const [married, setMarried] = useState('No');
  const [dependents, setDependents] = useState('0');
  const [education, setEducation] = useState('Graduate');
  const [selfEmployed, setSelfEmployed] = useState('No');
  const [propertyArea, setPropertyArea] = useState('Urban');

  useEffect(() => {
    fetch("https://ai-model-risk-robustness.onrender.com/models")
      .then(res => res.json())
      .then(data => {
        if (data.models && data.models.length > 0) {
          setModels(data.models);
          setModelA(data.models[0]);
          setModelB(data.models.length > 1 ? data.models[1] : data.models[0]);
        }
      })
      .catch(console.error);
  }, []);

  const runAnalysis = async () => {
    setIsPredicting(true);
    const payload = {
      noise, noiseType,
      income, coapplicantIncome, credit, loan, loanTerm,
      gender, married, dependents, education, selfEmployed, propertyArea
    };

    try {
      const resA = await fetch("https://ai-model-risk-robustness.onrender.com/simulate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, model: modelA })
      });
      const dataA = await resA.json();
      
      const resB = await fetch("https://ai-model-risk-robustness.onrender.com/simulate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, model: modelB })
      });
      const dataB = await resB.json();

      if (dataA.status === "success" && dataB.status === "success") {
        setResultA(dataA);
        setResultB(dataB);
      }
    } catch (e) {
      console.error(e);
    }
    setIsPredicting(false);
  };

  return (
    <div className="space-y-6 pb-12 font-sans text-on-surface">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-surface-highest pb-6">
        <div>
          <h1 className="text-3xl font-bold font-headline text-on-surface flex items-center gap-3">
            <Crosshair className="text-secondary w-8 h-8"/> AI Model Risk & Robustness
          </h1>
          <p className="text-sm text-on-surface-variant/60 mt-2 tracking-widest uppercase">Dual-Threat Analysis & Explainability Engine</p>
        </div>
        <div className="bg-surface-high px-4 py-2 rounded-lg text-xs font-mono font-bold border border-primary/20 text-primary mt-4 md:mt-0">
          STATUS: Node Functional
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column Controls */}
        <div className="lg:col-span-4 space-y-6">
          
          <section className="bg-surface-low p-6 rounded-xl border border-outline-variant/5 shadow-xl">
            <h4 className="font-headline font-bold text-lg text-primary-container mb-4">Live Model Parameters</h4>
            
            <div className="grid grid-cols-2 gap-3">
              <InputField label="Income ($)" value={income} onChange={(v: string) => setIncome(Number(v))} />
              <InputField label="Co-Income ($)" value={coapplicantIncome} onChange={(v: string) => setCoapplicantIncome(Number(v))} />
              <InputField label="Loan Amount ($)" value={loan} onChange={(v: string) => setLoan(Number(v))} />
              <InputField label="Loan Term (Mo)" value={loanTerm} onChange={(v: string) => setLoanTerm(Number(v))} />
              <div className="col-span-2">
                <InputField label="Credit Score" value={credit} onChange={(v: string) => setCredit(Number(v))} />
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-outline-variant/10 grid grid-cols-2 gap-3">
              <SelectField label="Gender" value={gender} options={["Male", "Female"]} onChange={setGender} />
              <SelectField label="Married" value={married} options={["Yes", "No"]} onChange={setMarried} />
              <SelectField label="Dependents" value={dependents} options={["0", "1", "2", "3+"]} onChange={setDependents} />
              <SelectField label="Education" value={education} options={["Graduate", "Not Graduate"]} onChange={setEducation} />
              <SelectField label="Self Employed" value={selfEmployed} options={["Yes", "No"]} onChange={setSelfEmployed} />
              <SelectField label="Property Area" value={propertyArea} options={["Urban", "Semiurban", "Rural"]} onChange={setPropertyArea} />
            </div>
          </section>

          <section className="bg-surface-low p-6 rounded-xl border border-outline-variant/5 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-error/10 blur-[40px] -mr-10 -mt-10 rounded-full pointer-events-none"></div>
            <h4 className="font-headline font-bold text-lg text-error mb-4">Adversarial Injection</h4>
            <div className="space-y-5 relative z-10">
              <div>
                <label className="block text-[10px] font-semibold text-on-surface-variant/60 uppercase tracking-widest mb-1">Attack Vector Type</label>
                <select className="w-full bg-surface-highest border border-outline-variant/10 rounded p-2 text-xs outline-none focus:border-error/50 transition-colors" value={noiseType} onChange={e=>setNoiseType(e.target.value)}>
                  <option value="Gaussian">Gaussian Distribution</option>
                  <option value="Missing Values">Missing Values Omission</option>
                  <option value="Feature Corruption">Demographic Feature Corruption</option>
                </select>
              </div>
              <div>
                <div className="flex justify-between items-end mb-2">
                  <label className="text-[10px] font-semibold text-on-surface-variant/60 uppercase tracking-widest">Chaos Intensity (%)</label>
                  <span className="text-error font-bold">{noise}%</span>
                </div>
                <input 
                  type="range" min="0" max="60" value={noise} onChange={e=>setNoise(Number(e.target.value))}
                  className="w-full h-1 bg-surface-highest rounded-lg appearance-none cursor-pointer accent-error"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Right Column Results */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-surface-low p-4 rounded-xl border border-outline-variant/5 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4 w-full flex-1">
              <div className="w-full">
                <label className="block text-[10px] font-semibold text-on-surface-variant/60 uppercase mb-1 tracking-widest">Competitor Alpha</label>
                <select className="w-full bg-surface-highest border border-outline-variant/10 rounded p-2 text-xs font-mono font-bold text-secondary" value={modelA} onChange={e=>setModelA(e.target.value)}>
                  {models.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div className="w-full">
                <label className="block text-[10px] font-semibold text-on-surface-variant/60 uppercase mb-1 tracking-widest">Competitor Beta</label>
                <select className="w-full bg-surface-highest border border-outline-variant/10 rounded p-2 text-xs font-mono font-bold text-error" value={modelB} onChange={e=>setModelB(e.target.value)}>
                  {models.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>
            <button onClick={runAnalysis} disabled={isPredicting} className="bg-primary hover:bg-primary-container text-on-primary font-bold px-8 py-3 rounded shadow-[0_0_15px_rgba(0,229,255,0.3)] transition-all flex items-center justify-center gap-2 h-[52px] mt-4 md:mt-0 whitespace-nowrap active:scale-95 disabled:opacity-50 min-w-[180px]">
              {isPredicting ? <RefreshCw className="w-5 h-5 animate-spin" /> : "Deploy Analysis"}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ModelResultCard title="Model Alpha" data={resultA} isA={true} />
            <ModelResultCard title="Model Beta" data={resultB} isA={false} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ModelResultCard({ title, data, isA }: any) {
  if (!data) return (
    <div className="bg-surface-low p-6 rounded-xl border border-outline-variant/5 flex flex-col items-center justify-center min-h-[300px] opacity-70">
      <Database className="w-8 h-8 text-on-surface-variant/40 mb-3" />
      <span className="text-xs text-on-surface-variant font-mono">Awaiting parameters...</span>
    </div>
  );

  const isApproved = data.decision === 'Risk Approved';
  const colorClass = isApproved ? 'text-secondary' : 'text-error';
  const borderClass = isApproved ? 'border-secondary/30 bg-secondary-container/5' : 'border-error/30 bg-error-container/5';
  const accuracyDrop = data.base_confidence - data.confidence;

  return (
    <div className={cn("p-6 rounded-xl border relative overflow-hidden transition-all", borderClass)}>
      <div className={cn("absolute -right-10 -top-10 w-32 h-32 rounded-full blur-[50px] opacity-30 pointer-events-none", isApproved ? 'bg-secondary' : 'bg-error')}></div>
      
      <div className="flex justify-between flex-wrap gap-2 mb-6 border-b border-outline-variant/10 pb-4 relative z-10">
        <div>
          <h3 className="text-xl font-bold font-headline uppercase text-on-surface">{data.model_name}</h3>
          <span className="text-[10px] text-on-surface-variant uppercase tracking-widest">{title}</span>
        </div>
        <div className={cn("text-right font-headline", colorClass)}>
          <span className="text-3xl font-bold tracking-tighter">{data.confidence.toFixed(1)}%</span>
          <p className="text-[10px] uppercase font-bold tracking-widest border border-current px-2 py-0.5 rounded mt-1 bg-surface-lowest/50">{data.decision}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
        <div className="bg-surface-highest/50 p-3 rounded border border-outline-variant/5">
          <span className="text-[10px] text-on-surface-variant block mb-1 uppercase tracking-widest">Base Accuracy</span>
          <span className="font-mono text-sm text-on-surface">{data.base_confidence.toFixed(1)}%</span>
        </div>
        <div className={cn("p-3 rounded border", accuracyDrop > 5 ? 'bg-error/10 border-error/50' : 'bg-surface-highest/50 border-outline-variant/5')}>
          <span className="text-[10px] text-on-surface-variant block mb-1 uppercase tracking-widest">Stress Defect</span>
          <span className={cn("font-mono text-sm flex items-center gap-1", accuracyDrop > 5 ? 'text-error font-bold' : 'text-on-surface')}>
            <TrendingDown className="w-3 h-3" /> -{accuracyDrop.toFixed(1)}%
          </span>
        </div>
      </div>
      
      <div className="relative z-10 space-y-3">
        <div className="text-[11px] bg-primary-container/10 p-4 rounded text-primary-container font-mono border border-primary-container/20 leading-relaxed shadow-inner">
          <span className="block font-bold mb-2 uppercase text-[10px] text-primary-container/60 border-b border-primary-container/20 pb-1 flex items-center gap-1">
            <Info className="w-3 h-3"/> XAI Explainability Core
          </span>
          {data.xai?.reason}
        </div>
        <div className="text-[11px] bg-secondary-container/10 p-4 rounded text-secondary font-mono border border-secondary/20 leading-relaxed shadow-inner">
          <span className="block font-bold mb-2 uppercase text-[10px] text-secondary/60 border-b border-secondary/20 pb-1 flex items-center gap-1">
            <Shield className="w-3 h-3"/> Threat Solution
          </span>
          {data.xai?.suggestion}
        </div>
      </div>
    </div>
  );
}

function InputField({ label, value, onChange }: any) {
  return (
    <div>
      <label className="block text-[10px] font-semibold text-on-surface-variant/60 uppercase tracking-widest mb-1">{label}</label>
      <input 
        className="w-full bg-surface-highest border border-outline-variant/10 rounded p-2 text-on-surface focus:ring-1 focus:ring-primary/50 transition-all text-xs outline-none" 
        type="number" value={value} onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function SelectField({ label, value, options, onChange }: any) {
  return (
    <div>
      <label className="block text-[10px] font-semibold text-on-surface-variant/60 uppercase tracking-widest mb-1">{label}</label>
      <select 
        className="w-full bg-surface-highest border border-outline-variant/10 rounded p-2 text-on-surface focus:ring-1 focus:ring-primary/50 transition-all text-xs outline-none appearance-none" 
        value={value} onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );
}
