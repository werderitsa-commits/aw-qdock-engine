import { X, BookOpen, Terminal, Activity, Focus, Cpu, Dna } from 'lucide-react';

interface UserManualProps {
  isOpen: boolean;
  onClose: () => void;
  isLightMode: boolean;
}

export default function UserManual({ isOpen, onClose, isLightMode }: UserManualProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className={`w-full max-w-4xl h-[85vh] flex flex-col border shadow-2xl relative overflow-hidden transition-colors ${isLightMode ? 'bg-white border-zinc-200' : 'bg-[#0a0a0a] border-cyan-500/20'}`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b shrink-0 ${isLightMode ? 'border-zinc-200 bg-zinc-50' : 'border-white/5 bg-black/40'}`}>
          <div className="flex items-center gap-3">
            <BookOpen className={`w-5 h-5 ${isLightMode ? 'text-indigo-600' : 'text-cyan-400'}`} />
            <h2 className={`text-sm font-black uppercase tracking-[0.3em] ${isLightMode ? 'text-zinc-800' : 'text-white'}`}>
              AW-Qdock System Manual
            </h2>
          </div>
          <button 
            onClick={onClose}
            className={`p-1.5 transition-colors group ${isLightMode ? 'hover:bg-zinc-200' : 'hover:bg-white/5'}`}
          >
            <X className={`w-5 h-5 ${isLightMode ? 'text-zinc-500 group-hover:text-zinc-900' : 'text-zinc-500 group-hover:text-white'}`} />
          </button>
        </div>

        {/* Content Container */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-0">
          
          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] h-full">
            
            {/* Sidebar Navigation */}
            <div className={`border-r p-6 hidden md:block ${isLightMode ? 'border-zinc-200 bg-zinc-50' : 'border-white/5 bg-black/20'}`}>
               <nav className="flex flex-col gap-4 sticky top-6">
                 {[
                   { id: 'intro', label: 'Platform Architecture', icon: Terminal },
                   { id: 'docking', label: 'Quantum Docking', icon: Cpu },
                   { id: 'results', label: 'Interpreting Results', icon: Activity },
                   { id: 'pipeline', label: 'Pipeline Integration', icon: Dna }
                 ].map(item => (
                   <a key={item.id} href={`#manual-${item.id}`} className={`flex items-center gap-3 text-[10px] font-black uppercase tracking-widest transition-colors ${isLightMode ? 'text-zinc-500 hover:text-indigo-600' : 'text-zinc-400 hover:text-cyan-400'}`}>
                     <item.icon className="w-4 h-4" />
                     {item.label}
                   </a>
                 ))}
               </nav>
            </div>

            {/* Main Article Content */}
            <div className={`p-8 md:p-12 space-y-16 ${isLightMode ? 'text-zinc-700' : 'text-zinc-300'}`}>
              
              {/* Introduction */}
              <section id="manual-intro" className="scroll-mt-12">
                 <div className="flex items-center gap-4 mb-6">
                    <div className={`w-12 h-12 flex items-center justify-center border ${isLightMode ? 'border-indigo-600/20 bg-indigo-50 text-indigo-600' : 'border-cyan-500/20 bg-cyan-500/10 text-cyan-400'}`}>
                       <Terminal className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className={`text-xl font-black uppercase tracking-widest ${isLightMode ? 'text-zinc-900' : 'text-white'}`}>Platform Architecture</h3>
                      <p className="text-[10px] uppercase tracking-[0.2em] opacity-60 mt-1">Foundational Quantum Theory v1.0</p>
                    </div>
                 </div>
                 <div className="prose prose-sm max-w-none space-y-4">
                    <p className="leading-relaxed text-sm">
                      AW-Qdock is a high-performance computational platform built on the hybrid intersection of classic deep learning and quantum annealing. It is explicitly designed to predict sequence-receptor binding poses, validate synthesis pathways, and calculate exact energetic costs of highly stable, commercially viable peptide candidates.
                    </p>
                    <div className={`p-6 border border-l-4 ${isLightMode ? 'border-zinc-200 border-l-indigo-600 bg-white' : 'border-white/5 border-l-cyan-500 bg-white/[0.02]'}`}>
                       <h4 className={`text-[10px] font-black uppercase tracking-widest mb-2 ${isLightMode ? 'text-indigo-600' : 'text-cyan-400'}`}>Key Differentiator</h4>
                       <p className="text-sm">Unlike static grid-based predictors (e.g., AutoDock Vina), AW-Qdock incorporates dynamic conformational flexibility mapping via NVIDIA NIM and physics-based energy formulations optimized for noisy intermediate-scale quantum (NISQ) devices.</p>
                    </div>
                 </div>
              </section>

              {/* Quantum Docking / Running Scans */}
              <section id="manual-docking" className="scroll-mt-12">
                 <div className="flex items-center gap-4 mb-6">
                    <div className={`w-12 h-12 flex items-center justify-center border ${isLightMode ? 'border-indigo-600/20 bg-indigo-50 text-indigo-600' : 'border-cyan-500/20 bg-cyan-500/10 text-cyan-400'}`}>
                       <Cpu className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className={`text-xl font-black uppercase tracking-widest ${isLightMode ? 'text-zinc-900' : 'text-white'}`}>Quantum Docking Routines</h3>
                      <p className="text-[10px] uppercase tracking-[0.2em] opacity-60 mt-1">Configuring the HPC Compute Payload</p>
                    </div>
                 </div>
                 <div className="space-y-6">
                    <p className="leading-relaxed text-sm">Executing a payload requires explicit target parameters alongside an input baseline sequence. The environment is designed to aggressively penalize highly charged, rigid structures that fail to conform to the selected topology.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className={`p-5 border ${isLightMode ? 'bg-zinc-50 border-zinc-200' : 'bg-black border-white/10'}`}>
                          <h5 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest mb-3">
                            <Focus className="w-3.5 h-3.5 text-emerald-500" /> Auto Mode (AI Guided)
                          </h5>
                          <p className="text-xs leading-relaxed opacity-80">Reroutes optimization through AW-PepGen before submitting to the quantum grid. This algorithm automatically repairs structural liabilities (e.g. Proline kinks, surface polar burial) prior to execution.</p>
                       </div>
                       <div className={`p-5 border ${isLightMode ? 'bg-zinc-50 border-zinc-200' : 'bg-black border-white/10'}`}>
                          <h5 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest mb-3">
                            <Cpu className="w-3.5 h-3.5 text-rose-500" /> Quantum Hardware Boost
                          </h5>
                          <p className="text-xs leading-relaxed opacity-80">Enables QUBO reformulation. Your structure is mathematically flattened and sent to a physical annealing device (AWS Braket / D-Wave) to solve the exact minimum energy trough instantaneously.</p>
                       </div>
                    </div>
                 </div>
              </section>

              {/* Reading Results */}
              <section id="manual-results" className="scroll-mt-12">
                 <div className="flex items-center gap-4 mb-6">
                    <div className={`w-12 h-12 flex items-center justify-center border ${isLightMode ? 'border-indigo-600/20 bg-indigo-50 text-indigo-600' : 'border-cyan-500/20 bg-cyan-500/10 text-cyan-400'}`}>
                       <Activity className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className={`text-xl font-black uppercase tracking-widest ${isLightMode ? 'text-zinc-900' : 'text-white'}`}>Interpreting Metrics</h3>
                      <p className="text-[10px] uppercase tracking-[0.2em] opacity-60 mt-1">Understanding The Forensic Dashboard</p>
                    </div>
                 </div>
                 <div className="space-y-6">
                    <p className="leading-relaxed text-sm">Once the execution loop resolves, the panel on the right will compute synthesis validity and binding scores. If a target is structurally unbindable, the engine rejects it to prevent wasted synthesis overhead.</p>
                    
                    <div className="space-y-4">
                       <div className={`p-4 border-l-4 ${isLightMode ? 'border-zinc-200 border-l-emerald-500 bg-emerald-50' : 'border-white/5 border-l-emerald-500 bg-white/[0.02]'}`}>
                          <strong className="text-xs uppercase tracking-widest block mb-1">pLDDT Score (0-100)</strong>
                          <span className="text-sm opacity-80">Confidence of the structural model. Scores &gt;85% are immediately approved for SPPS synthesis; &lt;85% implies a highly volatile disordered state.</span>
                       </div>
                       <div className={`p-4 border-l-4 ${isLightMode ? 'border-zinc-200 border-l-rose-500 bg-rose-50' : 'border-white/5 border-l-rose-500 bg-white/[0.02]'}`}>
                          <strong className="text-xs uppercase tracking-widest block mb-1">Interaction Affinity (kcal/mol)</strong>
                          <span className="text-sm opacity-80">The thermodynamic gradient. Values further from 0 represent stronger, tighter fits within the receptor pocket.</span>
                       </div>
                    </div>
                 </div>
              </section>

            </div>
          </div>

        </div>
        
        {/* Footer */}
        <div className={`p-4 border-t shrink-0 flex items-center justify-between text-[10px] font-black uppercase tracking-widest ${isLightMode ? 'bg-zinc-100 border-zinc-200 text-zinc-500' : 'bg-black/60 border-white/5 text-zinc-600'}`}>
           <span>Version 1.0 — AW-Qdock Architecture</span>
           <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
              System Verified
           </div>
        </div>
      </div>
    </div>
  );
}
