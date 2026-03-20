import { useState } from 'react';
import { supabase } from '../targets';

export default function Auth() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/` 
      }
    });
    if (error) alert(error.message);
  };

  const handleGithubLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/`
      }
    });
    if (error) alert(error.message);
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Testing Bypass
    if (password === 'alchemist') {
      localStorage.setItem('skip_auth', 'true');
      window.location.reload();
      return;
    }

    setIsLoading(true);

    const { error } = isSignUp 
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      alert(error.message);
    } else if (isSignUp) {
      alert('Registration successful! Check your email to verify your account.');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050505] p-4 font-sans border-none">
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(45deg,#fff_12%,transparent_12.5%,transparent_87%,#fff_87.5%,#fff),linear-gradient(-45deg,#fff_12%,transparent_12.5%,transparent_87%,#fff_87.5%,#fff)] bg-[size:40px_40px]" />
      
      <div className="relative w-full max-w-md rounded-none border border-cyan-500/30 bg-zinc-900/40 backdrop-blur-3xl p-8 shadow-[0_0_50px_rgba(6,182,212,0.1)]">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-white tracking-tighter uppercase mb-1">
            AW-QDOCK <span className="text-cyan-500">v1</span>
          </h1>
          <p className="text-zinc-500 text-[9px] font-black uppercase tracking-[0.4em]">
            {isSignUp ? 'Apply for Clearance' : 'Authorization Required'}
          </p>
        </div>

        {/* Social Auth Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-2 bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] text-white px-4 py-3 font-black uppercase text-[8px] tracking-[0.1em] transition-all active:scale-[0.98]"
          >
            <svg className="h-3 w-3" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google
          </button>
          <button
            onClick={handleGithubLogin}
            className="flex items-center justify-center gap-2 bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] text-white px-4 py-3 font-black uppercase text-[8px] tracking-[0.1em] transition-all active:scale-[0.98]"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub
          </button>
        </div>

        <div className="relative mb-8 flex items-center">
          <div className="flex-grow border-t border-white/5"></div>
          <span className="mx-4 text-[7px] font-black text-zinc-600 uppercase tracking-widest">or secure credentials</span>
          <div className="flex-grow border-t border-white/5"></div>
        </div>
        
        <form onSubmit={handleEmailAuth} className="space-y-6">
          <div>
            <label className="block text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-2">Institutional Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-none px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40 transition-all text-xs font-mono lowercase"
              placeholder="dr.smith@university.edu"
            />
          </div>
          
          <div>
            <label className="block text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-2">Access Token</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-none px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40 transition-all text-xs font-mono tracking-widest"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-black py-4 rounded-none uppercase text-[9px] tracking-[0.5em] transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {isLoading ? 'Authenticating...' : (isSignUp ? 'Initialize Workspace' : 'Access Dashboard')}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-white/5 text-center text-zinc-500">
            <p className="text-[9px] font-black uppercase tracking-widest">
            {isSignUp ? 'Already have credentials?' : 'Need an environment?'}
            <button 
                onClick={() => setIsSignUp(!isSignUp)}
                className="ml-2 text-cyan-500 hover:text-cyan-400 font-black border-b border-cyan-500/20"
            >
                {isSignUp ? 'Sign In' : 'Request Access'}
            </button>
            </p>
        </div>

        {/* Bypass for testing */}
        <div className="mt-8 pt-4 border-t border-white/5 text-center">
          <button 
            onClick={() => {
              localStorage.setItem('skip_auth', 'true');
              window.location.reload();
            }}
            className="text-[10px] text-zinc-600 hover:text-cyan-500/50 uppercase font-black tracking-widest transition-colors"
          >
            [ Bypass Authentication (Testing Mode) ]
          </button>
        </div>
      </div>
    </div>
  );
}
