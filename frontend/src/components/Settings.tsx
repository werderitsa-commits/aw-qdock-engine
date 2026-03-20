import { X, Moon, Sun, Monitor, Terminal } from 'lucide-react';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  isLightMode: boolean;
  setLightMode: (val: boolean) => void;
  theme: 'hollywood' | 'barebone';
  setTheme: (val: 'hollywood' | 'barebone') => void;
}

export default function Settings({ 
  isOpen, 
  onClose, 
  isLightMode, 
  setLightMode, 
  theme, 
  setTheme 
}: SettingsProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-[#0a0a0a] border border-cyan-500/20 shadow-2xl relative overflow-hidden theme-container transition-all">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/5 bg-black/40">
          <div className="flex items-center gap-3">
            <Monitor className="w-4 h-4 text-cyan-400" />
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white">System Settings</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-white/5 transition-colors group"
          >
            <X className="w-4 h-4 text-zinc-500 group-hover:text-white" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Theme Section */}
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Interface Theme</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setTheme('hollywood')}
                className={`p-4 border transition-all flex flex-col gap-3 items-center justify-center group ${
                  theme === 'hollywood' 
                    ? 'border-cyan-500/50 bg-cyan-500/5' 
                    : 'border-white/5 bg-black hover:border-white/20'
                }`}
              >
                <Monitor className={`w-5 h-5 ${theme === 'hollywood' ? 'text-cyan-400' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                <span className="text-[9px] font-black uppercase tracking-widest">Hollywood PRO</span>
              </button>
              <button
                onClick={() => setTheme('barebone')}
                className={`p-4 border transition-all flex flex-col gap-3 items-center justify-center group ${
                   theme === 'barebone' 
                    ? 'border-emerald-500/50 bg-emerald-500/5' 
                    : 'border-white/5 bg-black hover:border-white/20'
                }`}
              >
                <Terminal className={`w-5 h-5 ${theme === 'barebone' ? 'text-emerald-400' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                <span className="text-[9px] font-black uppercase tracking-widest">Barebone OS</span>
              </button>
            </div>
          </div>

          {/* Display Mode */}
          <div className="space-y-4">
             <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Visual Mode</label>
             <div className="flex items-center justify-between p-4 border border-white/5 bg-black/40">
                <div className="flex items-center gap-3">
                   {isLightMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-cyan-400" />}
                   <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300">
                     {isLightMode ? 'High Contrast (Light)' : 'Deep Space (Dark)'}
                   </span>
                </div>
                <button
                  onClick={() => setLightMode(!isLightMode)}
                  className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${isLightMode ? 'bg-indigo-600' : 'bg-zinc-800'}`}
                >
                  <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${isLightMode ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
             </div>
          </div>

          {/* Notifications & Profile */}
           <div className="space-y-4">
             <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">User Profile & Notifications</label>
             <div className="flex flex-col gap-2 p-4 border border-white/5 bg-black/40">
                <div className="flex flex-col gap-1 mb-2">
                   <label className="text-[8px] font-black uppercase text-zinc-400">Full Name</label>
                   <input type="text" defaultValue="Adam Werderits" className="bg-black border border-white/10 px-2 py-1.5 text-[10px] text-white focus:outline-none focus:border-cyan-500/50" />
                </div>
                <div className="flex flex-col gap-1 mb-2">
                   <label className="text-[8px] font-black uppercase text-zinc-400">Institution</label>
                   <input type="text" defaultValue="Biotechnic Research" className="bg-black border border-white/10 px-2 py-1.5 text-[10px] text-white focus:outline-none focus:border-cyan-500/50" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                   <div className="flex-1 flex flex-col gap-1">
                      <label className="text-[8px] font-black uppercase text-zinc-400">Email Notifications</label>
                      <input type="email" defaultValue="werderitsa@gmail.com" className="bg-black border border-white/10 px-2 py-1.5 text-[10px] text-white focus:outline-none focus:border-cyan-500/50" />
                   </div>
                   <div className="flex-1 flex flex-col gap-1">
                      <label className="text-[8px] font-black uppercase text-zinc-400">WhatsApp Alerts</label>
                      <input type="text" placeholder="+1 (555) 000-0000" className="bg-black border border-white/10 px-2 py-1.5 text-[10px] text-white focus:outline-none focus:border-cyan-500/50" />
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-black/60 border-t border-white/5 flex items-center justify-center">
           <p className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-600">
             © 2026 AW-QDOCK V1 SYSTEM KERNEL
           </p>
        </div>
      </div>
    </div>
  );
}
