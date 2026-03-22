import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    $3Dmol: any;
  }
}

interface MolViewerProps {
  pdbId?: string;
  sequence?: string;
  pdbData?: string;
  plddt?: number;
  isLoading?: boolean;
  targetPdbId?: string;
  targetPdbData?: string | null;
}

export default function MolViewer({ pdbId, sequence, pdbData, plddt, isLoading, targetPdbId, targetPdbData }: MolViewerProps) {
  const viewerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load 3Dmol.js dynamically if not already present
    if (!window.$3Dmol) {
      const script = document.createElement('script');
      script.src = 'https://3dmol.org/build/3Dmol-min.js';
      script.async = true;
      script.onload = () => initViewer();
      document.head.appendChild(script);
    } else {
      initViewer();
    }

    function initViewer() {
      if (!viewerRef.current || viewerRef.current.offsetWidth === 0) return;

      try {
        viewerRef.current.innerHTML = ''; // Clear previous instance
        const viewer = window.$3Dmol.createViewer(viewerRef.current, {
          backgroundColor: '#050505',
          antialias: true,
        });

      // Add receptor target model
      if (targetPdbData && targetPdbData.trim().length > 0) {
        const m = viewer.addModel(targetPdbData, 'pdb');
        m.setStyle({}, { 
          cartoon: { color: 'white', opacity: 0.25 }
        });
        viewer.zoomTo();
      } else if (targetPdbId && targetPdbId.length === 4) {
        window.$3Dmol.download(`pdb:${targetPdbId}`, viewer, {}, (m: any) => {
           if (!viewer || !m) return;
           m.setStyle({}, { 
              cartoon: { color: 'white', opacity: 0.15 }
           });
           viewer.zoomTo();
           viewer.render();
        });
      } else if (!isLoading && !pdbData) {
        // Standby Mode: Load a random structure for aesthetics
        const standbyPdbs = ['1CRN', '1UBQ', '1BNA', '7LYI'];
        const randomPdb = standbyPdbs[Math.floor(Math.random() * standbyPdbs.length)];
        window.$3Dmol.download(`pdb:${randomPdb}`, viewer, {}, (m: any) => {
           if (!viewer || !m) return;
           m.setStyle({}, { 
              cartoon: { color: 'cyan', opacity: 0.08, style: 'oval' },
              stick: { radius: 0.1, opacity: 0.05 }
           });
           viewer.zoomTo();
           viewer.render();
        });
      }

      // Add resulting docked peptide
      if (pdbData && pdbData.trim().length > 0) {
        const m = viewer.addModel(pdbData, 'pdb');
        m.setStyle({}, { 
          cartoon: { color: '#06b6d4', opacity: 1.0 },
          stick: { radius: 0.25, colorscheme: 'Jmol' },
          sphere: { radius: 0.6, opacity: 0.2 } // Subtle glow/volume
        });
        
        // Highlight high-confidence binding interface globally
        if (plddt !== undefined && plddt > 50) {
           viewer.setStyle({ b: { ge: 90 } }, {
              cartoon: { color: '#06b6d4', opacity: 1.0 },
              stick: { radius: 0.2, colorscheme: 'cyanCarbon' }
           });
        }
        viewer.zoomTo();
      }

      viewer.render();
      
      let animationId: number;
      const rotateLoop = () => {
        if (viewer) {
          viewer.rotate(0.15, 'y');
          viewer.render();
          animationId = requestAnimationFrame(rotateLoop);
        }
      };
      rotateLoop();

      // Handle Resize
      const handleResize = () => {
        if (viewer) {
          viewer.resize();
          viewer.render();
        }
      };
      window.addEventListener('resize', handleResize);
      
      return () => {
         cancelAnimationFrame(animationId);
         window.removeEventListener('resize', handleResize);
      }
      } catch (e) {
        console.error("MolViewer initialization failed:", e);
      }
    }
  }, [pdbId, pdbData, plddt, targetPdbId, targetPdbData, isLoading]); // Added full deps

  return (
    <div className="relative w-full h-full bg-black border border-indigo-500/10 overflow-hidden">
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <h4 className="text-[10px] font-black text-cyan-400 font-mono uppercase tracking-[0.2em] mb-1">
          Structural View
        </h4>
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${isLoading ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500 shadow-[0_0_10px_#10b981]'}`}></div>
          <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest font-mono line-clamp-1">
            Receptor: {targetPdbId || (targetPdbData ? 'Custom' : 'None')} | Ligand: {pdbData ? 'Quantum-Optimized' : 'None'}
          </span>
        </div>
      </div>
      <div ref={viewerRef} className="w-full h-full" />

      {/* OVERLAYS */}
      {!isLoading && !pdbData && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
          <div className="border border-white/10 bg-black/60 backdrop-blur-sm p-6 flex flex-col items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">System Standby</span>
             <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest text-center max-w-[200px]">Awaiting sequence input and target receptor parameters.</span>
          </div>
        </div>
      )}

      {isLoading && !pdbData && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
          <div className="border border-cyan-500/20 bg-black/40 backdrop-blur-sm p-6 flex flex-col items-center gap-3">
             <div className="w-8 h-8 rounded-full border-t-2 border-cyan-500 animate-spin shadow-[0_0_15px_#06b6d4]" />
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400 animate-pulse">Running Physics Engine</span>
             <span className="text-[8px] font-mono text-cyan-600/70 uppercase tracking-widest text-center max-w-[250px]">Sampling conformational space against {targetPdbId || 'Receptor'}...</span>
          </div>
        </div>
      )}

      {/* HUD Overlays */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end pointer-events-none z-30">
        <div className="flex-1 mr-8">
           <div className="flex justify-between items-center mb-1.5">
             <p className="text-[7px] text-zinc-600 font-black uppercase tracking-widest opacity-60">Candidate Sequence Mapping</p>
             <span className="text-[10px] font-mono text-cyan-500 font-black">
               Avg Confidence: {plddt?.toFixed(1) || '--'}%
             </span>
           </div>
           <div className="flex gap-0.5 overflow-x-auto scrollbar-hide pointer-events-auto">
              {sequence?.split('').map((aa, i) => (
                <div key={i} className="flex flex-col items-center group">
                  <span className="text-[9px] font-mono font-black text-cyan-500 bg-white/5 w-4 h-4 flex items-center justify-center border border-white/5 group-hover:border-cyan-500/50 transition-colors">{aa}</span>
                  <span className="text-[5px] text-zinc-600 mt-0.5">{i+1}</span>
                </div>
              ))}
           </div>
        </div>
        <div className="text-right">
          <p className="text-[7px] text-zinc-600 font-black uppercase tracking-widest mb-1">Quantum-Validated Interface</p>
          <div className="w-32 h-1 bg-zinc-900 overflow-hidden">
            <div className={`h-full bg-gradient-to-r from-cyan-600 to-indigo-600 ${isLoading ? 'w-full animate-pulse' : 'w-full'}`}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
