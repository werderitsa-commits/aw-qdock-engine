import { useState, useEffect } from 'react';
import { Activity, Zap, ShieldCheck, Clock, Database, Server, RefreshCw, X, Terminal } from 'lucide-react';

interface Task {
  timestamp: number;
  engine: string;
  sequence: string;
  duration: number;
  status: string;
}

interface Stats {
  summary: {
    total_tasks: number;
    compute_utilization: string;
    avg_latency: string;
  };
  recent_tasks: Task[];
  error?: string;
}

export default function MissionControl({ isOpen, onClose, backendUrl }: { isOpen: boolean; onClose: () => void; backendUrl: string }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${backendUrl.replace('/dock', '/stats')}`);
      if (!res.ok) throw new Error(`API Error: ${res.status}`);
      const data = await res.json();
      if (data && data.summary) {
        setStats(data);
      } else {
        throw new Error("Invalid telemetry data format");
      }
    } catch (err: any) {
      console.error("Failed to fetch mission control data:", err);
      // We don't set stats here so it keeps showing loading/standby or error
      if (!stats) setStats({ error: err.message, summary: { total_tasks: 0, compute_utilization: '0%', avg_latency: '0.00s' }, recent_tasks: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStats();
      const interval = setInterval(fetchStats, 5000); // Polling every 5s
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-8 animate-in fade-in duration-300">
      <div className="w-full max-w-6xl aspect-video bg-[#0a0a0a] border border-cyan-500/20 shadow-[0_0_100px_rgba(6,182,212,0.1)] flex flex-col relative overflow-hidden">
        
        {/* Scanning Line Effect */}
        <div className="absolute inset-x-0 h-[2px] bg-cyan-500/50 shadow-[0_0_20px_#06b6d4] z-50 animate-scan pointer-events-none" />

        {/* Header */}
        <div className="h-16 border-b border-white/5 bg-black/40 flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 border border-cyan-500/30 bg-cyan-500/5 flex items-center justify-center">
              <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-sm font-black text-white uppercase tracking-[0.3em]">Mission Control</h2>
              <span className="text-[9px] font-black text-cyan-600 uppercase tracking-widest">Real-Time Docking Engine Telemetry</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-2 group cursor-pointer" onClick={fetchStats}>
                <RefreshCw className={`w-3.5 h-3.5 text-zinc-500 group-hover:text-cyan-400 transition-colors ${loading ? 'animate-spin' : ''}`} />
                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest group-hover:text-cyan-400 transition-colors">Manual Sync</span>
             </div>
             <button onClick={onClose} className="p-2 hover:bg-white/5 transition-colors group">
                <X className="w-5 h-5 text-zinc-500 group-hover:text-white transition-transform group-hover:rotate-90" />
             </button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel: Stats */}
          <div className="w-1/3 border-r border-white/5 p-8 flex flex-col gap-6">
            
            {/* Quick Summary Cards */}
            <div className="grid grid-cols-2 gap-4">
               <div className="p-4 bg-white/5 border border-white/5 flex flex-col gap-2 relative group hover:border-cyan-500/30 transition-colors overflow-hidden">
                  <div className="absolute top-0 right-0 p-2 opacity-10">
                     <Zap className="w-10 h-10 text-cyan-400" />
                  </div>
                  <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Docking Jobs</span>
                  <span className="text-2xl font-black text-white">{stats?.summary?.total_tasks || 0}</span>
                  <div className="flex items-center gap-1.5 mt-1">
                     <div className="w-1 h-1 rounded-full bg-emerald-500" />
                     <span className="text-[8px] text-emerald-500 font-black uppercase tracking-widest">Active Feed</span>
                  </div>
               </div>
               
               <div className="p-4 bg-white/5 border border-white/5 flex flex-col gap-2 relative group hover:border-indigo-500/30 transition-colors overflow-hidden">
                  <div className="absolute top-0 right-0 p-2 opacity-10">
                     <Server className="w-10 h-10 text-indigo-400" />
                  </div>
                  <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Compute Utilization</span>
                  <span className="text-2xl font-black text-white">{stats?.summary?.compute_utilization || '0%'}</span>
                  <span className="text-[8px] text-zinc-500 font-black uppercase tracking-widest mt-1">Resource Allocation</span>
               </div>
            </div>

            <div className="p-4 bg-white/5 border border-white/5 flex flex-col gap-2 relative group hover:border-amber-500/30 transition-colors">
               <div className="flex justify-between items-center mb-2">
                  <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Average Process Time</span>
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
               </div>
               <div className="flex items-end gap-2">
                  <span className="text-4xl font-black text-white tabular-nums tracking-tighter">
                    {stats?.summary?.avg_latency || '0.00s'}
                  </span>
               </div>
               <p className="text-[9px] text-zinc-500 uppercase font-black tracking-widest mt-2 leading-relaxed">
                  Total wall-clock time including queuing and structural convergence.
               </p>
            </div>

            <div className="p-6 bg-cyan-500/5 border border-cyan-500/10 flex flex-col gap-6 mt-2 relative overflow-hidden">
                <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl" />
                
                <div className="flex flex-col gap-4">
                   <div className="flex justify-between items-center">
                     <div className="flex items-center gap-2">
                        <Server className="w-4 h-4 text-cyan-400" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Compute Breakdown</span>
                     </div>
                     <span className="text-[10px] font-black text-cyan-400 tabular-nums uppercase">{stats?.summary.compute_utilization || '100%'} Primary</span>
                   </div>
                   
                   <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-[9px] text-zinc-500 font-black uppercase tracking-widest">
                           <span>Primary (A10G)</span>
                           <span className="text-zinc-400">OPTIMAL</span>
                        </div>
                        <div className="h-1.5 bg-black/40 border border-white/5 overflow-hidden">
                           <div className="h-full bg-cyan-500 shadow-[0_0_10px_#06b6d4] transition-all duration-1000" style={{ width: stats?.summary.compute_utilization || '0%' }} />
                        </div>
                      </div>

                      <div className="space-y-2 opacity-50">
                        <div className="flex justify-between text-[9px] text-zinc-500 font-black uppercase tracking-widest">
                           <span>Secondary (L4)</span>
                           <span className="text-zinc-600">IDLE</span>
                        </div>
                        <div className="h-1.5 bg-black/40 border border-white/5 overflow-hidden">
                           <div className="h-full bg-zinc-700 w-0 transition-all duration-1000" />
                        </div>
                      </div>
                   </div>
                </div>

                <div className="p-4 border border-white/5 bg-black/40 flex items-center gap-4">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                   <div className="flex flex-col">
                      <span className="text-[9px] font-black text-white uppercase tracking-widest">Quantum Gateway Linked</span>
                      <span className="text-[7px] text-zinc-500 uppercase font-black">Ready for QUBO Energy Minimization</span>
                   </div>
                </div>
            </div>

          </div>

          {/* Right Panel: Logs */}
          <div className="flex-1 p-8 flex flex-col bg-black/40 backdrop-blur-md">
            <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
               <div className="flex items-center gap-3">
                  <Terminal className="w-4 h-4 text-zinc-500" />
                  <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Live Execution Stream</span>
               </div>
               <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 border border-white/5">
                     <Database className="w-3 h-3 text-zinc-400" />
                     <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">Redis Persistence</span>
                  </div>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-2">
               <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-2 px-1">
                  <span className="w-16">Time</span>
                  <span className="w-16">Source</span>
                  <span className="flex-1">Sequence Segment</span>
                  <span>Duration</span>
               </div>
               {stats?.recent_tasks && stats.recent_tasks.length > 0 ? (
                 stats.recent_tasks.map((task, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 border border-white/5 bg-black/20 hover:bg-white/[0.03] transition-colors group">
                       <div className={`w-1 h-8 ${task.engine === 'Primary' ? 'bg-cyan-500 shadow-[0_0_10px_#06b6d4]' : 'bg-indigo-500 shadow-[0_0_10px_#6366f1]'}`} />
                       
                       <div className="flex flex-col gap-1 w-16">
                          <span className="text-[8px] font-black text-zinc-600 uppercase tabular-nums">
                            {new Date(task.timestamp * 1000).toLocaleTimeString()}
                          </span>
                       </div>
                       <div className="flex flex-col gap-1 w-16">
                          <span className={`text-[9px] font-black uppercase tracking-widest ${task.engine === 'Primary' ? 'text-cyan-400' : 'text-indigo-400'}`}>
                            {task.engine}
                          </span>
                       </div>

                       <div className="flex flex-col gap-1 flex-1">
                          <span className="text-[10px] font-mono font-black text-white/90 truncate max-w-xs">{task.sequence}</span>
                          <div className="flex items-center gap-3">
                             <span className="text-[8px] text-zinc-500 font-black uppercase tracking-widest"></span>
                          </div>
                       </div>
                       <div className="flex items-center gap-2">
                          <span className="text-[8px] text-zinc-500 font-black uppercase tracking-widest">{task.duration.toFixed(2)}s</span>
                       </div>

                       <div className="flex items-center gap-2">
                          <ShieldCheck className="w-3.5 h-3.5 text-zinc-500 group-hover:text-emerald-500 transition-colors" />
                          <div className="px-2 py-0.5 border border-white/5 bg-black/40 text-[8px] font-black text-zinc-400 uppercase tracking-[0.2em]">Verified</div>
                       </div>
                    </div>
                 ))
               ) : (
                 <div className="flex-1 flex flex-col items-center justify-center opacity-20">
                    <Zap className="w-12 h-12 text-zinc-800 mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-[0.4em]">Listening for Data...</p>
                 </div>
               )}
            </div>
            
            <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
                   <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Gateway Link Synchronized</span>
                </div>
                <div className="flex items-center gap-4 text-[9px] font-black text-zinc-600 uppercase tracking-widest">
                   <span>Buffer: 100 Entries</span>
                   <span>Version: 0.9.8-BETA</span>
                </div>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan {
          0% { transform: translateY(-300px); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(700px); opacity: 0; }
        }
        .animate-scan {
          animation: scan 8s linear infinite;
        }
      `}} />
    </div>
  );
}
