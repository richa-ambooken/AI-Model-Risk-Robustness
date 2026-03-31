import React, { useState, useEffect } from 'react';
import { Download, Sliders, TrendingDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { cn } from '../lib/utils';

export function Metrics() {
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem("simulationResult");
    if (saved) {
      setResult(JSON.parse(saved));
    }
  }, []);

  const rocData = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(val => {
    const auc = result?.metrics?.auc || 0.95;
    const curve = val < 20 ? (val * 2 * auc) : (40 + (val - 20) * 0.7 * auc);
    return { fpr: val, tpr: Math.min(100, curve), baseline: val };
  });

  return (
    <div className="space-y-8 pb-12 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary-container/60 text-xs font-medium uppercase tracking-widest mb-2">
            <span className="text-secondary tracking-widest font-mono">STATISTICAL ENGINE V4.2</span>
          </div>
          <h2 className="text-4xl font-headline font-bold text-on-surface tracking-tight">Metrics & Performance Matrices</h2>
          <p className="text-xs text-on-surface-variant max-w-2xl mt-4">Cross-model validation and diagnostic analytics. Monitoring the observational fidelity of AI decision paths under variable noise injection and adversarial perturbation.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-surface-low rounded-xl p-6 border border-outline-variant/10 shadow-xl relative overflow-hidden h-[400px] flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="font-headline font-bold text-lg text-secondary flex items-center gap-2 mb-1">
                <TrendingDown className="w-5 h-5 text-secondary" /> ROC / Precision-Recall Curves
              </h3>
              <p className="text-[10px] text-on-surface-variant/60 uppercase tracking-widest">Performance trade-offs across all model variants</p>
            </div>
            <div className="flex gap-4 items-center">
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest block mb-1">OVERALL AUC</span>
                <span className="text-2xl font-mono text-secondary font-bold">{result?.metrics?.auc?.toFixed(3) || "0.982"}</span>
              </div>
            </div>
          </div>
          <div className="flex-1 w-full relative">
             <ResponsiveContainer width="100%" height="100%">
               <LineChart data={rocData}>
                 <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                 <XAxis dataKey="fpr" tick={false} axisLine={false} />
                 <YAxis tick={false} axisLine={false} />
                 <Tooltip contentStyle={{ backgroundColor: '#0b1120', border: '1px solid #334155' }} />
                 <Line type="monotone" dataKey="tpr" stroke="#4edea3" strokeWidth={3} dot={false} animationDuration={1000} />
                 <Line type="monotone" dataKey="baseline" stroke="#475569" strokeDasharray="4 4" dot={false} strokeWidth={1} />
               </LineChart>
             </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-surface-low rounded-xl p-6 border border-outline-variant/10 shadow-xl flex-1 flex flex-col justify-center">
            <span className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-2">Precision Gauge</span>
            <div className="w-full bg-surface-highest rounded-full h-2.5 mb-2 overflow-hidden shadow-inner">
              <div className="bg-primary-container h-full" style={{ width: `${Math.max(20, (result?.metrics?.f1 || 0.9) * 100)}%` }}></div>
            </div>
            <div className="flex justify-between text-[10px] font-mono text-on-surface-variant">
              <span>Target: 95%</span><span className="text-primary-container font-bold">{Math.max(20, (result?.metrics?.f1 || 0.9) * 100).toFixed(1)}%</span>
            </div>
          </div>
          <div className="bg-surface-low rounded-xl p-6 border border-outline-variant/10 shadow-xl flex-1 flex flex-col justify-center">
            <span className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-2">Recall Efficiency</span>
            <div className="w-full bg-surface-highest rounded-full h-2.5 mb-2 overflow-hidden shadow-inner">
              <div className="bg-secondary h-full" style={{ width: `${Math.max(20, ((result?.metrics?.f1 || 0.9) - 0.05) * 100)}%` }}></div>
            </div>
            <div className="flex justify-between text-[10px] font-mono text-on-surface-variant">
              <span>Target: 86%</span><span className="text-secondary font-bold">{Math.max(20, ((result?.metrics?.f1 || 0.9) - 0.05) * 100).toFixed(1)}%</span>
            </div>
          </div>
          <div className="bg-surface-low rounded-xl p-6 border border-outline-variant/10 shadow-xl flex-1 flex flex-col justify-center">
            <span className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-2">Inference Latency</span>
            <div className="text-4xl font-headline font-bold text-on-surface">14.2 <span className="text-sm font-normal text-on-surface-variant font-mono">ms / req</span></div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-end mt-12 mb-6 border-b border-surface-highest pb-4">
        <h3 className="text-xl font-bold font-headline text-on-surface">Confusion Matrices Comparison</h3>
        <button className="flex items-center gap-2 text-xs font-bold text-primary-container hover:text-primary transition-colors uppercase tracking-widest">
          Export Raw Tensors <Download className="w-4 h-4 ml-1" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-low border border-outline-variant/10 rounded-xl p-6 shadow-xl overflow-hidden relative group">
          <div className="text-[10px] uppercase font-bold text-on-surface-variant mb-6 tracking-widest">Neural Core V1 (Optimal)</div>
          <div className="grid grid-cols-2 gap-3 text-center aspect-square">
            <MatrixCell label="TRUE POS" val={842} color="text-secondary" bg="bg-secondary-container/10" border="border-secondary-container/30" />
            <MatrixCell label="FALSE POS" val={12} color="text-error" bg="bg-error-container/10" border="border-error-container/30" />
            <MatrixCell label="FALSE NEG" val={24} color="text-error" bg="bg-error-container/10" border="border-error-container/30" />
            <MatrixCell label="TRUE NEG" val={711} color="text-secondary" bg="bg-secondary-container/10" border="border-secondary-container/30" />
          </div>
        </div>

        <div className="bg-surface-low border-2 border-primary-container/30 rounded-xl p-6 shadow-[0_0_30px_rgba(0,229,255,0.05)] overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-primary-container"></div>
          <div className="text-[10px] uppercase font-bold text-primary-container mb-6 tracking-widest">Live Perturbation Test</div>
          <div className="grid grid-cols-2 gap-3 text-center aspect-square flex-1">
            <MatrixCell label="TRUE POS" val={result?.metrics?.tp || 790} color="text-secondary" bg="bg-secondary-container/10" border="border-secondary-container/30" />
            <MatrixCell label="FALSE POS" val={result?.metrics?.fp || 64} color="text-error" bg="bg-error-container/10" border="border-error-container/30" />
            <MatrixCell label="FALSE NEG" val={result?.metrics?.fn || 52} color="text-error" bg="bg-error-container/10" border="border-error-container/30" />
            <MatrixCell label="TRUE NEG" val={result?.metrics?.tn || 683} color="text-secondary" bg="bg-secondary-container/10" border="border-secondary-container/30" />
          </div>
          {result && (
            <div className="absolute bottom-6 right-6 text-xs text-primary-container font-mono border border-primary-container/20 px-2 rounded bg-primary-container/10">
              Drift: {result.accuracy_drift}%
            </div>
          )}
        </div>

        <div className="bg-surface-low border border-outline-variant/5 rounded-xl p-6 shadow-xl relative opacity-70 grayscale-[30%]">
          <div className="text-[10px] uppercase font-bold text-error/80 mb-6 tracking-widest">Ghost Class (Vulnerability)</div>
          <div className="grid grid-cols-2 gap-3 text-center aspect-square flex-1">
            <MatrixCell label="TRUE POS" val={310} color="text-secondary/80" bg="bg-secondary-container/5" border="border-secondary-container/20" />
            <MatrixCell label="FALSE POS" val={542} color="text-error" border="border-error/40" font="text-error font-bold" />
            <MatrixCell label="FALSE NEG" val={92} color="text-error" border="border-error/40" />
            <MatrixCell label="TRUE NEG" val={645} color="text-secondary/80" bg="bg-secondary-container/5" border="border-secondary-container/20" />
          </div>
        </div>
      </div>
    </div>
  );
}

function MatrixCell({ label, val, color, bg, border, font="text-on-surface" }: any) {
  return (
    <div className={cn("rounded-lg flex flex-col items-center justify-center border transition-all h-full shadow-inner", bg, border)}>
      <span className={cn("text-[9px] uppercase font-bold tracking-widest block mb-1 opacity-80", color)}>{label}</span>
      <span className={cn("text-3xl font-bold font-headline", font)}>{val}</span>
    </div>
  );
}
