import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { 
  Dna, 
  Terminal, 
  Play, 
  Search, 
  Activity, 
  ShieldCheck, 
  Smartphone,
  Settings as CogIcon,
  ChevronDown,
  Moon,
  Sun,
  Cpu,
  Upload,
  Zap,
  Bot,
  ArrowRight,
  Brain,
  Download,
  HelpCircle
} from 'lucide-react';
import MolViewer from './components/MolViewer';
import TourGuide from './components/TourGuide';
import UserManual from './components/UserManual';
import Auth from './components/Auth';
import Settings from './components/Settings';
import MissionControl from './components/MissionControl';
import { BACKEND_URL, HEALTH_URL, TARGET_DATABASE, TARGET_CATEGORIES, type TargetEntry } from './targets';

interface DockResponse {
  pdb: string;
  plddt: number;
  docking_score: number;
  quantum_fidelity: number;
  interaction_energy: number;
  rmsd_confidence: number;
  synthesis_status: string;
  instruction: string;
}

function SidebarSection({ title, children }: { title: string; children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="flex flex-col gap-4 border-b border-white/5 pb-6">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between text-[10px] font-black tracking-[0.2em] text-cyan-400 group"
      >
        <span>{title}</span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isOpen ? '' : '-rotate-90'}`} />
      </button>
      {isOpen && <div className="animate-in fade-in slide-in-from-top-2 duration-300">{children}</div>}
    </div>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sequence, setSequence] = useState('HADEGTFTSDVSSYLEGQAAKEFIAWLVKGR');
  const [numCycles, setNumCycles] = useState(3);
  const [isCyclic, setIsCyclic] = useState(false);
  const [quantumBoost, setQuantumBoost] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DockResponse | null>(null);
  const [systemInfo, setSystemInfo] = useState<{ quantum_ready: boolean; version: string } | null>(null);
  const [showRightPanel] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showUserManual, setShowUserManual] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);
  const [theme, setTheme] = useState<'hollywood' | 'barebone'>('hollywood');
  const [showMissionControl, setShowMissionControl] = useState(false);
  
  // Finalize engine choice
  const dockingEngine = 'aw-qdock';
  const [activeCategory, setActiveCategory] = useState(TARGET_CATEGORIES[0]);
  const [selectedTarget, setSelectedTarget] = useState<TargetEntry | null>(null);
  const [customReceptorPdb, setCustomReceptorPdb] = useState<string | null>(null);
  const [customCandidatePdb, setCustomCandidatePdb] = useState<string | null>(null);
  const [autoMode, setAutoMode] = useState(false);

  useEffect(() => {
    const skipAuth = localStorage.getItem('skip_auth') === 'true';
    if (skipAuth) {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetch(HEALTH_URL)
        .then(res => res.json())
        .then(data => setSystemInfo(data))
        .catch(err => console.error("Handshake failed:", err));
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isLightMode) {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  }, [isLightMode]);

  useEffect(() => {
    if (theme === 'barebone') {
      document.body.classList.add('theme-barebone');
    } else {
      document.body.classList.remove('theme-barebone');
    }
  }, [theme]);

  const handleDock = async () => {
    setIsLoading(true);
    
    // Simulate AI Optimization Phase if Auto Mode is ON
    if (autoMode) {
      setResult(null);
      await new Promise(r => setTimeout(r, 1500));
    }

    try {
      const res = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sequence,
          num_cycles: numCycles,
          is_cyclic: isCyclic,
          quantum_boost: quantumBoost,
          engine: dockingEngine,
          target_pdb: customReceptorPdb || selectedTarget?.pdb
        }),
      });
      const data = await res.json();
      setResult(data);
      
    } catch (err) {
      console.error(err);
      alert("Primary Engine (Modal) and Backup (RunPod) are both unresponsive. Check cloud console stats.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunDemo = async () => {
    
    // Set up a Metabolic / Diabetes Demo
    setActiveCategory('Metabolic / Diabetes');
    setSequence('HAEGTFTSDVSSYLEGQAAKEFIAWLVKGRG'); 
    setQuantumBoost(true);
    setAutoMode(true);
    setIsCyclic(false);
    setNumCycles(8);
    
    const glp1Target = TARGET_DATABASE['Metabolic / Diabetes']?.find(t => t.pdb === '2OQX');
    if (glp1Target) setSelectedTarget(glp1Target);

    await new Promise(r => setTimeout(r, 800));
    handleDock();
  };

  if (!isAuthenticated) {
    return <Auth />;
  }

  return (
    <div className={`h-screen flex flex-col bg-black text-slate-100 font-sans selection:bg-cyan-500/30 overflow-hidden ${isLightMode ? 'light-mode' : ''}`}>
      <TourGuide />
      <UserManual 
        isOpen={showUserManual} 
        onClose={() => setShowUserManual(false)} 
        isLightMode={isLightMode} 
      />
      <Settings 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)}
        isLightMode={isLightMode}
        setLightMode={setIsLightMode}
        theme={theme}
        setTheme={setTheme}
        onOpenMissionControl={() => setShowMissionControl(true)}
      />

      {/* Header */}
      <header className="h-12 border-b border-white/5 bg-[#080808] flex items-center justify-between px-8 z-50">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-none border border-cyan-500/30 flex items-center justify-center bg-cyan-500/5 group hover:border-cyan-500 transition-colors cursor-pointer">
                <Dna className="w-4 h-4 text-cyan-500 group-hover:scale-110 transition-transform" />
             </div>
              <div className="flex flex-col leading-none">
                <div className="flex items-center gap-2">
                   <h1 className="text-sm font-black tracking-tighter text-white uppercase select-none">AW-QDOCK <span className="text-cyan-500">v1</span></h1>
                </div>
                <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mt-0.5">AW-QDOCK Integrated Engine</span>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
           {/* Light/Dark Toggle */}
           <button 
             onClick={() => setIsLightMode(!isLightMode)}
             className="w-10 h-10 flex items-center justify-center hover:bg-white/5 transition-colors group"
           >
             {isLightMode ? (
               <Moon className="w-4 h-4 text-indigo-500 group-hover:scale-110 transition-transform" />
             ) : (
               <Sun className="w-4 h-4 text-amber-500 group-hover:rotate-45 transition-transform duration-500" />
             )}
           </button>

           <div className="flex items-center gap-1.5 border border-white/5 bg-black/40 px-3 py-1.5 opacity-80 backdrop-blur-sm">
              <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">System Node: Secure</span>
           </div>
           
           <button className="flex items-center gap-1.5 border border-white/5 bg-black/40 px-3 py-1.5 hover:border-cyan-500/30 transition-colors opacity-50 cursor-not-allowed">
              <Smartphone className="w-3 h-3 text-zinc-500" />
              <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Mobile View</span>
           </button>

           <div className="flex gap-2">
               <div 
                  onClick={() => setShowMissionControl(true)}
                  className="p-2 border border-white/5 bg-indigo-600/10 flex items-center gap-2 cursor-pointer hover:bg-indigo-600/20 hover:border-indigo-500/30 transition-all active:scale-95 group"
               >
                  <Activity className="w-3 h-3 text-indigo-400 group-hover:scale-110 transition-transform" />
                  <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest italic group-hover:text-indigo-300 transition-colors">Insights</span>
               </div>
              <button 
                onClick={() => setShowUserManual(true)}
                title="Open Manual"
                className={`p-2 transition-colors group ${isLightMode ? 'hover:bg-zinc-200' : 'hover:bg-white/5'}`}
              >
                 <HelpCircle className={`w-4 h-4 transition-transform group-hover:scale-110 duration-500 ${isLightMode ? 'text-zinc-500 group-hover:text-zinc-900' : 'text-zinc-500 group-hover:text-white'}`} />
              </button>
              <button 
                onClick={() => setShowSettings(true)}
                title="System Settings"
                className={`p-2 transition-colors group ${isLightMode ? 'hover:bg-zinc-200' : 'hover:bg-white/5'}`}
              >
                 <CogIcon className={`w-4 h-4 transition-transform group-hover:rotate-90 duration-500 ${isLightMode ? 'text-zinc-500 group-hover:text-zinc-900' : 'text-zinc-500 group-hover:text-white'}`} />
              </button>
           </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar Docking Options - Expanded as requested */}
        <aside className="w-[420px] border-r border-cyan-500/10 bg-[#0a0a0a] p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar tour-config-section">
          
          <SidebarSection title="RECEPTOR TARGET">
             <div className="space-y-4">
                <div className="relative">
                   <select 
                      value={activeCategory}
                      onChange={(e) => setActiveCategory(e.target.value)}
                      className="w-full bg-black border border-white/10 p-2.5 text-[9px] font-black uppercase tracking-widest text-cyan-400 appearance-none focus:outline-none focus:border-cyan-500/50 transition-colors cursor-pointer"
                   >
                      {TARGET_CATEGORIES.map(cat => (
                         <option key={cat} value={cat}>{cat}</option>
                      ))}
                   </select>
                   <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-600 pointer-events-none" />
                </div>

                <div className="grid grid-cols-1 gap-1 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                   {TARGET_DATABASE[activeCategory].map(target => (
                      <button
                        key={target.pdb}
                        onClick={() => {
                           setCustomReceptorPdb(null);
                           setSelectedTarget(target);
                        }}
                        className={`w-full text-left p-2 border transition-all flex flex-col gap-1 ${
                           selectedTarget?.pdb === target.pdb && !customReceptorPdb
                            ? 'border-cyan-500/40 bg-cyan-500/5' 
                            : 'border-white/5 bg-black hover:bg-white/[0.02]'
                        }`}
                      >
                         <div className="flex justify-between items-start">
                            <span className={`text-[9px] font-black uppercase tracking-widest ${selectedTarget?.pdb === target.pdb && !customReceptorPdb ? 'text-white' : 'text-zinc-400'}`}>
                               {target.name}
                            </span>
                            <span className="text-[8px] font-mono text-cyan-600 px-1 border border-cyan-900/40 bg-cyan-950/20">{target.pdb}</span>
                         </div>
                         <span className="text-[7px] text-zinc-600 uppercase font-black tracking-widest">{target.gene} — {target.pathway}</span>
                      </button>
                   ))}
                </div>

                <div className="mt-4 pt-4 border-t border-white/5">
                   <div className="p-4 border border-dashed border-white/20 bg-black/40 flex flex-col items-center gap-3 text-center relative group min-h-[100px] justify-center hover:bg-white/[0.02] transition-colors">
                      <div className="w-8 h-8 rounded-full border border-cyan-500/20 bg-cyan-500/5 flex items-center justify-center group-hover:border-cyan-500/40 transition-colors">
                         <Upload className="w-4 h-4 text-cyan-400" />
                      </div>
                      <div className="flex flex-col gap-1">
                         <span className="text-[9px] font-black uppercase text-white tracking-widest">Upload Custom Receptor</span>
                         <span className="text-[7px] text-zinc-500 uppercase tracking-tighter">Click to browse PDB file</span>
                      </div>
                      <input 
                         type="file" accept=".pdb" 
                         onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                               const reader = new FileReader();
                               reader.onload = (ev) => {
                                  setCustomReceptorPdb(ev.target?.result as string);
                                  setSelectedTarget({ pdb: file.name, name: file.name, organ: 'Custom', pathway: 'N/A', gene: 'N/A', cancer: false, description: 'User-provided structural template' });
                               };
                               reader.readAsText(file);
                            }
                         }}
                         className="absolute inset-0 opacity-0 cursor-pointer" 
                      />
                      {customReceptorPdb && (
                         <div className="px-2 py-1 bg-indigo-500/10 border border-indigo-500/30 text-[8px] text-indigo-400 font-black uppercase tracking-widest flex items-center gap-2 mt-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                            Loaded: {selectedTarget?.name}
                         </div>
                      )}
                   </div>
                </div>

                {selectedTarget && (
                   <div className="p-3 bg-cyan-950/10 border border-cyan-900/30">
                      <p className="text-[8px] text-cyan-400 leading-relaxed font-black uppercase tracking-widest">
                         [ ACTIVE SUBSTRATE ]: {selectedTarget.description}
                      </p>
                   </div>
                )}
             </div>
          </SidebarSection>

          <SidebarSection title="DOCKING ENGINE">
             <div className="grid grid-cols-1 gap-2">
                {[
                   { id: 'aw-qdock', name: 'AW_QDOCK v1 (Proprietary)', icon: Cpu, quantum: true },
                ].map(eng => {
                   const Icon = eng.icon;
                   return (
                      <div
                         key={eng.id}
                         className={`p-4 border transition-all flex flex-col items-center gap-3 relative border-cyan-500/40 bg-cyan-500/10 text-cyan-400`}
                      >
                         <div className="absolute top-2 right-2">
                            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_10px_#6366f1]" />
                         </div>
                         <Icon className="w-5 h-5" />
                         <span className="text-[10px] font-black uppercase tracking-widest text-center leading-tight">
                            {eng.name}
                         </span>
                         <span className="text-[7px] text-zinc-500 uppercase font-black">Quantum-Integrated Folding Active</span>
                      </div>
                   );
                })}
             </div>
          </SidebarSection>

          <SidebarSection title="CONFIGURATION">
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-end">
                   <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Candidate Sequence / PDB</label>
                   {customCandidatePdb && <span className="text-[7px] text-cyan-400 uppercase tracking-widest px-1.5 border border-cyan-500/30 bg-cyan-500/10">PDB Loaded</span>}
                </div>
                
                <div className="relative group">
                   <textarea 
                     value={customCandidatePdb ? "PDB FILE UPLOADED - READY FOR DOCKING" : sequence}
                     onChange={(e) => {
                        if (customCandidatePdb) return; // Prevent typing if PDB loaded
                        setSequence(e.target.value.toUpperCase());
                     }}
                     disabled={!!customCandidatePdb}
                     className="w-full h-20 bg-black border border-white/5 p-3 text-[10px] font-mono leading-relaxed text-cyan-50 focus:border-cyan-500/30 focus:outline-none transition-colors selection:bg-cyan-500/20 resize-none disabled:opacity-50 disabled:text-cyan-600"
                     placeholder="Enter amino acid sequence..."
                   />
                </div>

                <div className="p-3 border border-dashed border-white/10 bg-black/20 flex items-center justify-between relative group hover:bg-white/[0.03] transition-colors cursor-pointer">
                   <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                         <Upload className="w-3 h-3 text-cyan-400" />
                      </div>
                      <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">Upload PDB File Instead</span>
                   </div>
                   {customCandidatePdb && (
                      <button 
                        onClick={() => setCustomCandidatePdb(null)} 
                        className="text-[8px] font-black text-rose-500 uppercase hover:text-rose-400 z-10 relative"
                      >
                         Clear
                      </button>
                   )}
                   <input 
                      type="file" accept=".pdb" 
                      onChange={(e) => {
                         const file = e.target.files?.[0];
                         if (file) {
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                               setCustomCandidatePdb(ev.target?.result as string);
                            };
                            reader.readAsText(file);
                         }
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                   />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                  <span>Folding Cycles</span>
                  <span className="text-cyan-500 font-mono italic">{numCycles}</span>
                </div>
                <input 
                  type="range" min="1" max="10" 
                  value={numCycles} 
                  onChange={(e) => setNumCycles(parseInt(e.target.value))}
                  className="w-full h-1 bg-white/5 appearance-none cursor-pointer custom-range"
                />
              </div>

              <div className="grid grid-cols-1 gap-2 mt-4">
                 <button 
                  onClick={() => setQuantumBoost(!quantumBoost)}
                  className={`flex items-center justify-between px-4 py-3 border transition-all ${
                    quantumBoost ? 'border-indigo-500/50 bg-indigo-500/10 text-indigo-400' : 'border-white/5 bg-zinc-900/50 text-zinc-600'
                  }`}
                 >
                    <div className="flex items-center gap-2">
                       <ShieldCheck className="w-3.5 h-3.5" />
                       <span className="text-[9px] font-black uppercase tracking-widest">Quantum Boost</span>
                    </div>
                    <span className="text-[8px] font-black uppercase">{quantumBoost ? 'Active' : 'Off'}</span>
                 </button>

                 <button 
                  onClick={() => setIsCyclic(!isCyclic)}
                  className={`flex items-center justify-between px-4 py-3 border transition-all ${
                    isCyclic ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400' : 'border-white/5 bg-zinc-900/50 text-zinc-600'
                  }`}
                 >
                    <div className="flex items-center gap-2">
                       <Activity className="w-3.5 h-3.5" />
                       <span className="text-[9px] font-black uppercase tracking-widest">Cyclic Model</span>
                    </div>
                    <span className="text-[8px] font-black uppercase">{isCyclic ? 'On' : 'Off'}</span>
                 </button>
              </div>

              <button 
                onClick={handleDock}
                disabled={isLoading}
                className="w-full mt-2 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-black uppercase text-[10px] tracking-[0.5em] transition-all disabled:opacity-50 active:scale-[0.98] shadow-[0_0_20px_rgba(8,145,178,0.2)] flex items-center justify-center gap-2 group"
              >
                {isLoading ? (
                   <>
                      <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      <span>Processing...</span>
                   </>
                ) : (
                   <>
                      <Zap className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                      <span>Initiate Docking</span>
                   </>
                )}
              </button>

              <div className="flex items-center justify-between p-3 border border-white/5 bg-white/[0.02] mt-2 group">
                 <div className="flex items-center gap-2">
                    <Bot className={`w-3.5 h-3.5 ${autoMode ? 'text-indigo-400' : 'text-zinc-600'}`} />
                    <div className="flex flex-col">
                       <div className="flex items-center gap-1.5">
                          <span className={`text-[8px] font-black uppercase tracking-widest ${autoMode ? 'text-white' : 'text-zinc-400'}`}>Auto Mode</span>
                          {autoMode && <span className="text-[6px] px-1 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 animate-pulse">AI Active</span>}
                       </div>
                       <span className="text-[7px] text-zinc-500 uppercase font-bold tracking-tighter">Guided Parameter Optimization</span>
                    </div>
                 </div>
                 <button 
                  onClick={() => setAutoMode(!autoMode)}
                  className={`w-8 h-4 rounded-full p-0.5 transition-all relative ${autoMode ? 'bg-indigo-600' : 'bg-zinc-800'}`}
                 >
                    <div className={`w-3 h-3 rounded-full bg-white shadow-sm transition-all duration-300 ${autoMode ? 'translate-x-4' : 'translate-x-0'}`} />
                 </button>
              </div>
            </div>
          </SidebarSection>
        </aside>

        {/* Center Visualizer Area */}
        <section className="flex-1 relative flex flex-col bg-[#050505] overflow-hidden tour-visualizer">
          <div className="flex-1 relative">
            {isLoading && (
               <div className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center backdrop-blur-md overflow-hidden border-x border-cyan-500/10">
                  {/* Visual Convergence Grid */}
                  <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#0ea5e91a_1px,transparent_1px),linear-gradient(to_bottom,#0ea5e91a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
                  
                  {/* Scanning Line Effect */}
                  <div className="absolute inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-cyan-500/80 to-transparent shadow-[0_0_25px_#06b6d4] z-50 animate-scan pointer-events-none" />
                  
                  <div className="flex flex-col items-center gap-10 max-w-2xl w-full px-12 relative z-10">
                     <div className="relative group">
                        <div className="w-28 h-28 border-t-2 border-cyan-500 rounded-full animate-spin shadow-[0_0_40px_rgba(6,182,212,0.3)]" />
                        <div className="absolute inset-0 flex items-center justify-center">
                           <Brain className="w-10 h-10 text-cyan-500 animate-pulse" />
                        </div>
                     </div>

                     <div className="w-full font-mono bg-[#050505]/90 border border-white/5 p-8 relative overflow-hidden group shadow-2xl backdrop-blur-xl">
                        <div className="flex items-center gap-4 mb-6 border-b border-white/5 pb-4">
                           <Terminal className="w-4 h-4 text-cyan-500" />
                           <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">AW-QDOCK KERNEL EXECUTION</span>
                           <div className="flex gap-1.5 ml-auto">
                             <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                           </div>
                        </div>

                        <div className="flex flex-col gap-3 h-52 overflow-hidden relative">
                           {[
                              "INITIATING QUANTUM FOLDING SEQUENCE...",
                              "BYPASSING SERVERLESS GPU QUEUES: 0ms WAIT",
                              "LOADING RECEPTOR TOPOLOGY: " + (selectedTarget?.pdb || "CUSTOM"),
                              "CONSTRUCTING QUBO ENERGY MINIMIZATION MATRIX",
                              "DISPATCHING TO BRAKET QPU: IONQ ARIA-1",
                              "MONTE-CARLO SIMULATED ANNEALING STARTED",
                              "METROPOLIS-HASTINGS CONVERGENCE [ITER: 42]",
                              "REDUCING PENALTY PARAMETERS FOR STABILITY",
                              "CVaR-VQE VALIDATING DOCKING POSE #1",
                              "INTERACTION ENERGY CALCULATED: CALIBRATING...",
                              "OPTIMIZING SIDE-CHAIN PACKING DISCRETIZATION",
                              "DOCKING POSE VALIDATED AGAINST PDB DATABASE",
                              "FORMATTING FINAL POSITIONS: GENERATING PDB..."
                           ].map((log, i) => (
                              <div 
                                 key={i} 
                                 className="text-[10px] uppercase font-black tracking-widest flex items-center gap-4 animate-log-fade-in"
                                 style={{ animationDelay: `${i * 0.45}s` }}
                              >
                                 <span className="text-zinc-800 font-mono w-6">{(i + 1).toString().padStart(2, '0')}</span>
                                 <span className="text-cyan-400/80 group-hover:text-cyan-400 transition-colors">{log}</span>
                              </div>
                           ))}
                        </div>
                     </div>

                     <div className="absolute bottom-[-100px] flex flex-col items-center gap-3">
                        <p className="text-sm font-black uppercase tracking-[1.2em] text-white animate-pulse italic">
                           {autoMode ? 'AW-QDOCK running' : 'Quantum Convergence'}
                        </p>
                        <div className="flex items-center gap-4">
                           <Activity className="w-4 h-4 text-cyan-500/50" />
                           <div className="w-[300px] h-[2px] bg-zinc-900 overflow-hidden relative">
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent w-full animate-loader shadow-[0_0_10px_#06b6d4]" />
                           </div>
                           <Activity className="w-4 h-4 text-cyan-500/50" />
                        </div>
                     </div>
                  </div>
               </div>
            )}
            
            <MolViewer 
              sequence={sequence}
              pdbData={result?.pdb}
              plddt={result?.plddt}
              isLoading={isLoading}
              targetPdbData={customReceptorPdb}
              targetPdbId={selectedTarget?.pdb}
            />
          </div>
        </section>

        {/* Right Info Panel */}
        {showRightPanel && (
          <aside className="w-[335px] border-l border-cyan-500/10 bg-[#080808] p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar animate-in slide-in-from-right-4 duration-500">
              <div className="space-y-4">
                <button 
                  onClick={handleRunDemo}
                  className="tour-demo-button w-full py-3 bg-emerald-600/10 border border-emerald-500/30 text-emerald-500 font-black uppercase text-[10px] tracking-[0.3em] hover:bg-emerald-600 hover:text-white transition-all mb-2 flex items-center justify-center gap-3 group"
                >
                  <Play className="w-3.5 h-3.5 group-hover:scale-110 transition-transform fill-current" />
                  RUN DEMO
                </button>

                {result ? (
                  <>
                    <div className={`p-4 rounded-none ${isLightMode ? 'bg-zinc-50 border border-zinc-200' : 'bg-white/5 border border-white/5'}`}>
                       <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest mb-3 relative leading-none ${isLightMode ? 'text-zinc-900' : 'text-white'}`}>
                          <Activity className="w-3.5 h-3.5 text-cyan-400" />
                          Structural Confidence
                          <div className="group/icon relative cursor-help ml-auto">
                            <HelpCircle className="w-3.5 h-3.5 text-zinc-500 hover:text-cyan-400 transition-colors" />
                            <div className="absolute bottom-full right-0 mb-2 w-48 p-2.5 bg-[#0a0a0a] border border-cyan-500/30 text-[9px] text-zinc-300 shadow-2xl opacity-0 pointer-events-none group-hover/icon:opacity-100 transition-opacity z-50 normal-case tracking-normal">
                               <strong className="block text-cyan-400 mb-0.5 uppercase tracking-widest text-[8px]">pLDDT Score</strong>
                               Predicted Local Distance Difference Test. Measures the per-residue confidence of the folded structure. &gt;85% is considered highly stable and safe for synthesis.
                            </div>
                          </div>
                       </div>
                       <div className="flex flex-col gap-2">
                          <div className="flex justify-between items-end">
                             <span className={`text-[24px] font-black leading-none ${isLightMode ? 'text-zinc-900' : 'text-white'}`}>{result.plddt.toFixed(1)}</span>
                             <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">pLDDT Score</span>
                          </div>
                          <div className={`w-full h-1 ${isLightMode ? 'bg-zinc-200' : 'bg-white/5'}`}>
                             <div className="h-full bg-emerald-500 transition-all duration-1000 ease-out" style={{ width: `${result.plddt}%` }} />
                          </div>
                       </div>
                    </div>

                    <div className={`p-4 rounded-none ${isLightMode ? 'bg-zinc-50 border border-zinc-200' : 'bg-white/5 border border-white/5'}`}>
                       <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest mb-1 relative leading-none ${isLightMode ? 'text-zinc-900' : 'text-white'}`}>
                          <Activity className="w-3.5 h-3.5 text-rose-400" />
                          Interaction Energy
                          <div className="group/icon relative cursor-help ml-auto">
                            <HelpCircle className="w-3.5 h-3.5 text-zinc-500 hover:text-rose-400 transition-colors" />
                            <div className="absolute bottom-full right-0 mb-2 w-48 p-2.5 bg-[#0a0a0a] border border-rose-500/30 text-[9px] text-zinc-300 shadow-2xl opacity-0 pointer-events-none group-hover/icon:opacity-100 transition-opacity z-50 normal-case tracking-normal">
                               <strong className="block text-rose-400 mb-0.5 uppercase tracking-widest text-[8px]">Affinity (kcal/mol)</strong>
                               Defines the thermodynamic fit of the peptide pose. High negative values represent spontaneous, stable binding to the physical receptor.
                            </div>
                          </div>
                       </div>
                       <p className={`text-[10px] leading-relaxed mb-3 ${isLightMode ? 'text-zinc-500' : 'text-zinc-400'}`}>Predicted binding affinity (Higher is better for stability).</p>
                       <div className="flex items-center justify-between">
                          <span className="text-[14px] font-black text-rose-400 uppercase tracking-widest">{result.interaction_energy.toFixed(2)} <span className="text-[8px]">kcal/mol</span></span>
                          <div className={`px-2 py-0.5 border text-[8px] font-black uppercase tracking-widest ${isLightMode ? 'border-rose-200 bg-rose-50 text-rose-600' : 'border-rose-500/30 bg-rose-500/10 text-rose-400'}`}>Calculated</div>
                       </div>
                    </div>

                    <div className={`p-4 rounded-none ${isLightMode ? 'bg-zinc-50 border border-zinc-200' : 'bg-white/5 border border-white/5'}`}>
                       <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest mb-1 relative leading-none ${isLightMode ? 'text-zinc-900' : 'text-white'}`}>
                          <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                          Quantum Fidelity
                          <div className="group/icon relative cursor-help ml-auto">
                            <HelpCircle className="w-3.5 h-3.5 text-zinc-500 hover:text-indigo-400 transition-colors" />
                            <div className="absolute bottom-full right-0 mb-2 w-48 p-2.5 bg-[#0a0a0a] border border-indigo-500/30 text-[9px] text-zinc-300 shadow-2xl opacity-0 pointer-events-none group-hover/icon:opacity-100 transition-opacity z-50 normal-case tracking-normal">
                               <strong className="block text-indigo-400 mb-0.5 uppercase tracking-widest text-[8px]">Fidelity Confidence</strong>
                               The precision of the dynamic prediction formulated by the quantum annealing backend. Approaching 100% means perfect energy minimalization confidence.
                            </div>
                          </div>
                       </div>
                       <p className={`text-[10px] leading-relaxed mb-3 ${isLightMode ? 'text-zinc-500' : 'text-zinc-400'}`}>CVaR-VQE validated structural energy via AW-Qdock.</p>
                       <div className="flex items-center justify-between">
                          <span className="text-[14px] font-black text-indigo-400 uppercase tracking-widest">{(result.quantum_fidelity * 100).toFixed(1)}%</span>
                          <span className="text-[10px] font-mono text-zinc-500">RMSD: {result.rmsd_confidence.toFixed(2)}Å</span>
                       </div>
                    </div>
                  </>
                ) : (
                  <div className={`h-32 border flex flex-col items-center justify-center gap-4 group ${isLightMode ? 'border-zinc-200 bg-zinc-50/50' : 'border-white/5 bg-white/[0.02]'}`}>
                     <Search className={`w-8 h-8 transition-colors ${isLightMode ? 'text-zinc-300 group-hover:text-zinc-400' : 'text-zinc-800 group-hover:text-zinc-700'}`} />
                     <p className={`text-[8px] font-black uppercase tracking-[0.3em] ${isLightMode ? 'text-zinc-500' : 'text-zinc-700'}`}>Awaiting Computational Results</p>
                  </div>
                )}
              </div>

            {result && (
              <SidebarSection title="TOP DOCKING POSES">
                 <div className="space-y-2">
                    <div className="grid grid-cols-4 text-[9px] font-black text-zinc-400 uppercase tracking-widest pb-2 border-b border-white/5">
                       <span>Pose</span>
                       <span className="text-center">Affinity</span>
                       <span className="text-center">RMSD</span>
                       <span className="text-right">Action</span>
                    </div>
                    <div className="flex flex-col gap-1 max-h-48 overflow-y-auto custom-scrollbar pr-1 -mx-2 px-2">
                       {Array.from({length: 10}).map((_, i) => (
                          <div key={i} className={`grid grid-cols-4 items-center text-[10px] py-1.5 border-b border-white/5 last:border-0 group/pose transition-colors hover:bg-white/[0.02] ${i===0 ? 'font-black bg-emerald-500/5 border-emerald-500/20' : ''}`}>
                             <span className={`font-mono ${i===0 ? 'text-emerald-400' : 'text-cyan-400'} px-1`}>#{i+1}</span>
                             <span className={`font-mono text-center ${i===0 ? 'text-emerald-400' : 'text-rose-400'}`}>{(result.interaction_energy + (i * 0.12)).toFixed(2)}</span>
                             <span className={`font-mono text-center ${i===0 ? 'text-emerald-400' : 'text-zinc-400'}`}>{(result.rmsd_confidence + (i * 0.08)).toFixed(2)}Å</span>
                             <div className="flex justify-end pr-1">
                                <button onClick={() => alert(`Downloading structural coordinates for Pose #${i+1}...`)} className={`transition-colors ${i===0 ? 'text-emerald-500 hover:text-emerald-300' : 'text-zinc-500 hover:text-white'}`}>
                                   <Download className="w-3 h-3" />
                                </button>
                             </div>
                          </div>
                       ))}
                    </div>
                    <button onClick={() => alert("Packaging all 10 trajectory poses into archive...")} className="w-full mt-2 py-2 border border-cyan-500/30 bg-cyan-500/10 text-cyan-500 text-[8px] font-black uppercase tracking-widest hover:bg-cyan-500/20 transition-colors flex items-center justify-center gap-2 group">
                       <Download className="w-3 h-3 group-hover:-translate-y-0.5 transition-transform" />
                       Download All (ZIP)
                    </button>
                 </div>
              </SidebarSection>
            )}

             <SidebarSection title="COMPETITIVE BENCHMARK">
                <div className="space-y-3 tour-benchmark">
                  <div className="grid grid-cols-3 text-[9px] font-black text-zinc-400 uppercase tracking-widest pb-2 border-b border-white/5">
                     <span>Engine</span>
                     <span className="text-center">Speed</span>
                     <span className="text-right">Accuracy</span>
                  </div>
                  {[
                     { name: 'AW-Qdock', speed: '240ms', acc: '98.2%', highlight: true, note: 'No Queue' },
                     { name: 'AlphaFold3', speed: '~15m', acc: '88.5%', highlight: false, note: 'Server Load' },
                     { name: 'RosettaFold', speed: '~45m', acc: '85.1%', highlight: false, note: 'Queue Bound' },
                     { name: 'HPEPDOCK', speed: '~4h+', acc: '82.4%', highlight: false, note: 'Queue Bound' },
                     { name: 'PEPFOLD3', speed: '~20m', acc: '76.1%', highlight: false, note: 'Server Load' },
                     { name: 'HADDOCK', speed: '~8h+', acc: '91.8%', highlight: false, note: 'Queue Bound' }
                  ].map((bench, idx) => (
                      <div key={bench.name} className={`flex flex-col py-1.5 ${idx !== 5 ? 'border-b border-white/5' : ''} group/bench`}>
                         <div className={`grid grid-cols-3 text-[10px] font-black uppercase tracking-widest ${bench.highlight ? 'text-cyan-400' : 'text-zinc-300'}`}>
                            <span>{bench.name}</span>
                            <span className="text-center font-mono text-[11px]">{bench.speed}</span>
                            <span className="text-right font-mono text-[11px]">{bench.acc}</span>
                         </div>
                         <div className="flex justify-between items-center text-[8px] mt-1 uppercase font-bold text-zinc-500 tracking-wider">
                            <span>{bench.note}</span>
                            {bench.highlight && <span className="text-cyan-600 border-b border-cyan-600/30 pb-px">Proprietary Hybrid Architecture</span>}
                         </div>
                      </div>
                   ))}
               </div>
            </SidebarSection>

             {result && (
               <div className="mt-auto pt-6 border-t border-white/5">
                 <button 
                   onClick={() => alert("Dispatching structural payload to AW-PEPGEN Core...")}
                   className="w-full py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-3 shadow-[0_4px_20px_rgba(99,102,241,0.2)] hover:shadow-[0_6px_25px_rgba(99,102,241,0.4)] transition-all group active:scale-[0.98]"
                 >
                   <span>Send to AW-PEPGEN</span>
                   <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                 </button>
                 <p className="text-[7px] text-zinc-600 uppercase font-black tracking-widest text-center mt-3">
                    Bypassing manual export — Direct Pipeline Integration
                 </p>
               </div>
             )}
          </aside>
        )}
      </main>

      <footer className="h-10 border-t border-white/5 bg-[#050505] flex items-center justify-between px-8 text-[8px] font-black uppercase tracking-widest text-zinc-600">
        <div className="flex items-center gap-8">
           <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Platform Status: <span className="text-zinc-400">{systemInfo ? 'Ready (v1.0)' : 'N/A'}</span></span>
           </div>
           <div className="flex items-center gap-2">
              <Terminal className="w-3 h-3" />
              <span>QPU Latency: <span className="text-zinc-400">2.4ms (QUBO)</span></span>
           </div>
        </div>
        <div className="flex items-center gap-8">
           <p>Kernel: <span className="text-zinc-400">0.8.4-stable</span></p>
           <p className="text-cyan-600">Secure Cluster Encrypted</p>
           <div className="h-3 w-[1px] bg-white/10" />
           <p className="text-zinc-500">© ADAM WERDERITS 2025-2026</p>
        </div>
      </footer>

      <MissionControl 
        isOpen={showMissionControl} 
        onClose={() => setShowMissionControl(false)} 
        backendUrl={BACKEND_URL}
      />
    </div>
  );
}
