import React, { useState, useEffect, useMemo } from 'react';
import { ChevronRight, Play, Save, Sliders, Shield, Maximize2, RotateCcw, Router } from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, Cell, ScatterChart, XAxis, YAxis, ZAxis, Scatter } from 'recharts';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export function Simulation() {
  const [noise, setNoise] = useState(0);
  const [noiseType, setNoiseType] = useState('Gaussian');
  const [drift, setDrift] = useState('Med');
  const [isPredicting, setIsPredicting] = useState(false);
  const [models, setModels] = useState<string[]>([]);
  const [activeModel, setActiveModel] = useState('');
  const [modelLoading, setModelLoading] = useState(true);
  const [modelError, setModelError] = useState('');
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const loadModels = async () => {
      try {
        setModelLoading(true);
        const res = await fetch("https://ai-model-risk-robustness.onrender.com/models");
        const data = await res.json();
        if (data.models && data.models.length > 0) {
          setModels(data.models);
          setActiveModel(data.models[0]);
        }
      } catch (e) {
        console.error(e);
        setModelError("Waking up server... Please wait 30s and refresh!");
      } finally {
        setModelLoading(false);
      }
    };
    loadModels();
  }, []);

  const runSimulation = async () => {
    setIsPredicting(true);
    try {
      const response = await fetch("https://ai-model-risk-robustness.onrender.com/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: activeModel, noise, noiseType })
      });
      const data = await response.json();
      if (data.status === "success") {
        setResult(data);
        sessionStorage.setItem("simulationResult", JSON.stringify(data));
      }
    } catch (e) {
      console.error(e);
    }
    setIsPredicting(false);
  };

  const scatterData = useMemo(() => {
    const seed = activeModel.length || 1;
    return Array.from({ length: 15 }, (_, i) => ({
      x: (Math.sin(seed * i) * 50) + 50, 
      y: (Math.cos(seed * i * 2) * 50) + 50, 
      z: 15 + (Math.random() * (noise > 0 ? noise * 10 : 5))
    }));
  }, [activeModel, noise]);

  const waveformData = Array.from({ length: 15 }, (_, i) => ({
    name: i,
    confidence: Math.max(10, (result?.base_confidence || 95) - (i * i * noise * 0.02)),
    drift: Math.min(90, 5 + (i * noise * 0.4)),
  }));

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary-container/60 text-xs font-medium uppercase tracking-widest mb-2">
            <span>Simulations</span><ChevronRight className="w-3 h-3" />
            <span className="text-primary-container">Stress Test Core</span>
          </div>
          <h2 className="text-4xl font-headline font-bold text-on-surface tracking-tight">Risk Model Stress Test</h2>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 rounded border border-outline-variant/30 text-on-surface text-sm font-medium hover:bg-surface-high transition-colors flex items-center gap-2">
            <Save className="w-4 h-4" /> Save Config
          </button>
          <button 
            onClick={runSimulation} disabled={isPredicting}
            className="px-6 py-2.5 rounded bg-primary-container text-on-primary-container font-bold text-sm shadow-[0_0_20px_rgba(0,229,255,0.2)] hover:shadow-primary-container/30 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isPredicting ? <RotateCcw className="w-4 h-4 animate-spin"/> : <Play className="w-4 h-4 fill-on-primary-container" />}
            Run Simulation
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-surface-low rounded-xl p-6 border border-outline-variant/5">
            <h3 className="font-headline font-bold text-lg text-primary-container mb-6 flex items-center gap-2">
              <Sliders className="w-5 h-5" /> Input Perturbation
            </h3>
            <div className="space-y-8">
              <div className="space-y-4">
                <label className="text-sm font-medium text-on-surface-variant">Target ML Model</label>
                <select className="w-full bg-surface-highest border border-outline-variant/10 rounded p-2 text-on-surface" value={activeModel} onChange={e=>setActiveModel(e.target.value)}>
                   {modelLoading ? <option>Waking up AI Brain (Wait 30s)...</option> :
                    modelError ? <option>{modelError}</option> :
                    models.length === 0 ? <option>No models found</option> :
                    models.map(m=><option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div className="space-y-4">
                <label className="text-sm font-medium text-on-surface-variant">Noise Injection Type</label>
                <select className="w-full bg-surface-highest border border-outline-variant/10 rounded p-2 text-on-surface" value={noiseType} onChange={e=>setNoiseType(e.target.value)}>
                   <option value="Gaussian">Gaussian Distribution</option>
                   <option value="Missing Values">Missing Value Omits</option>
                   <option value="Feature Corruption">Feature Corruption</option>
                </select>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-on-surface-variant">Chaos Intensity Level</label>
                  <span className="text-xs font-mono text-error bg-error/10 px-2 py-0.5 rounded">{noise}%</span>
                </div>
                <input className="w-full h-1 bg-surface-highest rounded-lg appearance-none cursor-pointer accent-error" type="range" value={noise} onChange={(e) => setNoise(Number(e.target.value))} />
              </div>
            </div>
          </div>
          <div className="bg-surface-low rounded-xl p-6 border border-outline-variant/5">
            <h3 className="font-headline font-bold text-lg text-secondary mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5" /> Threat Solution
            </h3>
            <p className="text-xs text-on-surface/80 font-mono leading-relaxed bg-surface-highest p-4 rounded border border-outline-variant/10">
              {result?.xai?.suggestion || "Run simulation to extract architectural vulnerabilities and solutions."}
            </p>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
          <div className="flex-1 bg-surface-high rounded-xl relative overflow-hidden group min-h-[300px]">
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#00daf3 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <div className="relative w-full h-full border border-primary-container/10 rounded-full flex items-center justify-center">
                <div className="w-2/3 h-2/3 border border-primary-container/20 rounded-full flex items-center justify-center border-dashed">
                  <div className="w-1/3 h-1/3 bg-primary-container/10 border border-primary-container/40 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,229,255,0.3)]"></div>
                </div>
              </div>
              <ScatterChart width={300} height={300} className="absolute inset-0 pointer-events-none z-10 m-auto">
                <XAxis type="number" dataKey="x" hide domain={[0, 100]} />
                <YAxis type="number" dataKey="y" hide domain={[0, 100]} />
                <ZAxis type="number" dataKey="z" range={[10, 50]} />
                <Scatter data={scatterData} fill="#00e5ff" fillOpacity={0.6} />
              </ScatterChart>
            </div>
            <div className="absolute top-6 left-6">
              <span className="bg-surface-lowest/80 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-bold text-primary-container uppercase tracking-widest border border-primary-container/20">Spatial Latent Analysis</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-surface-low p-4 rounded-xl border border-outline-variant/5">
              <p className="text-[10px] font-bold text-on-surface-variant/60 uppercase mb-1">Mean Accuracy Drift</p>
              <p className="text-2xl font-headline font-bold text-primary-container">{result?.xai?.accuracy_drift || 0}%</p>
            </div>
            <div className="bg-surface-low p-4 rounded-xl border border-outline-variant/5">
              <p className="text-[10px] font-bold text-on-surface-variant/60 uppercase mb-1">Risk Vector</p>
              <p className="text-2xl font-headline font-bold text-error">{noise > 30 ? "Critical" : noise > 10 ? "Elevated" : "Low"}</p>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-3 flex flex-col gap-6">
          <div className="bg-surface-lowest rounded-xl flex-1 border border-outline-variant/10 flex flex-col overflow-hidden shadow-inner h-[300px]">
            <div className="bg-surface-highest px-4 py-2 flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-on-surface-variant/60">SIMULATION_LOG.SH</span>
            </div>
            <div className="p-4 font-mono text-[11px] leading-relaxed overflow-y-auto flex-1 custom-scrollbar">
              {result?.status_log ? result.status_log.map((log:string, i:number) => (
                <div key={i} className={cn("mb-2", log.includes('[WARN]') ? 'text-error font-bold' : log.includes('[SUCCESS]') ? 'text-secondary' : 'text-on-surface/60')}>{log}</div>
              )) : (
                <div className="text-primary-container/70 animate-pulse">Awaiting matrix input...</div>
              )}
              {result?.xai && <div className="mt-4 border-t border-dashed border-outline-variant/20 pt-2 text-primary-container/70">{">"} XAI CORE: {result.xai.reason}</div>}
            </div>
          </div>
          <div className="glass-panel p-5 rounded-xl border border-primary-container/20">
            <h4 className="text-xs font-bold text-primary-container uppercase tracking-widest mb-3">Live Feed Status</h4>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded bg-surface-highest flex items-center justify-center border border-outline-variant/20"><Router className="w-6 h-6 text-primary-container" /></div>
              <div><p className="text-xs font-bold">Node: AWS-USE-1A</p><p className="text-[10px] text-on-surface-variant">Latency: 12ms</p></div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-surface-low rounded-xl p-6 border border-outline-variant/5">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-headline font-bold text-lg text-on-surface">Waveform Stress Analysis</h3>
        </div>
        <div className="h-32 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={waveformData}>
              <Bar dataKey="confidence" radius={[2, 2, 0, 0]} fill="#00e5ff" fillOpacity={0.6}/>
              <Bar dataKey="drift" radius={[2, 2, 0, 0]} fill="#ffb4ab" fillOpacity={0.6}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
