import { useState, useEffect, useRef } from 'react';
import { Terminal, Clock, Activity, Zap } from 'lucide-react';

interface Task {
  timestamp: number;
  engine: string;
  sequence: string;
  duration: number;
  status: string;
}

export default function LiveLog({ backendUrl }: { backendUrl: string }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchLogs = async () => {
    try {
      const res = await fetch(`${backendUrl.replace('/dock', '/stats')}`);
      const data = await res.json();
      if (data && data.recent_tasks) {
        setTasks(data.recent_tasks);
      }
    } catch (err) {
      console.error("Failed to fetch live logs:", err);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = 0; // Keep newest at top
    }
  }, [tasks]);

  return (
    <div className="h-44 border-t border-white/5 bg-[#050505] flex flex-col overflow-hidden relative group">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-black/40">
        <div className="flex items-center gap-2">
            <Terminal className="w-3 h-3 text-cyan-500 animate-pulse" />
            <span className="text-[9px] font-black text-white uppercase tracking-[0.2em]">Global Execution Stream</span>
        </div>
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981]" />
                <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Real-Time Sync</span>
            </div>
            <span className="text-[8px] font-mono text-zinc-600 uppercase">Buffer: {tasks.length}/100</span>
        </div>
      </div>

      {/* Log Container */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar p-0">
        {tasks.length > 0 ? (
          <div className="flex flex-col">
            {tasks.map((task, i) => (
              <div key={i} className="flex items-center gap-4 px-4 py-2 border-b border-white/5 hover:bg-white/[0.02] transition-colors group/row">
                 <span className="text-[8px] font-mono text-zinc-700 w-12 font-black">
                    {new Date(task.timestamp * 1000).toLocaleTimeString([], { hour12: false })}
                 </span>
                 <div className={`w-1 h-3 ${task.engine === 'Primary Compute' ? 'bg-cyan-500/50' : 'bg-indigo-500/50'}`} />
                 <span className={`text-[8px] font-black uppercase tracking-widest w-24 ${task.engine === 'Primary Compute' ? 'text-cyan-400/70' : 'text-indigo-400/70'}`}>
                    {task.engine}
                 </span>
                 <span className="text-[9px] font-mono font-black text-zinc-400 flex-1 truncate group-hover/row:text-white transition-colors">
                    {task.sequence}
                 </span>
                 <div className="flex items-center gap-3 opacity-40 group-hover/row:opacity-100 transition-opacity">
                    <div className="flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5 text-zinc-500" />
                        <span className="text-[8px] font-black text-zinc-500">{task.duration.toFixed(1)}s</span>
                    </div>
                 </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center opacity-10">
             <Zap className="w-6 h-6 mb-2 text-zinc-500" />
             <span className="text-[8px] font-black uppercase tracking-[0.4em]">Listening for Node traffic...</span>
          </div>
        )}
      </div>

      {/* Grid Pattern Overlay (Subtle) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:20px_20px]" />
    </div>
  );
}
