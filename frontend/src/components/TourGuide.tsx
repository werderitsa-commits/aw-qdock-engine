import { useState, useEffect } from 'react';
import Joyride, { STATUS } from 'react-joyride';
import type { CallBackProps, Step } from 'react-joyride';

export default function TourGuide() {
  const [run, setRun] = useState(false);

  useEffect(() => {
    // Only run the tour if they haven't seen it before! (Or if the user asked for it to open now)
    const hasSeenTour = localStorage.getItem('aw-qdock-tour-completed');
    if (!hasSeenTour) {
      setRun(true);
    }

    const handleRestart = () => {
      setRun(false);
      setTimeout(() => setRun(true), 100);
    };

    window.addEventListener('start-qdock-tour', handleRestart);
    return () => window.removeEventListener('start-qdock-tour', handleRestart);
  }, []);

  const steps: Step[] = [
    {
      target: 'body',
      content: (
        <div className="p-2">
          <h4 className="font-black uppercase tracking-tighter text-cyan-400 mb-2">AW-Qdock v1.0: Quantum Structural Guard</h4>
          <p className="text-[11px] leading-relaxed">Welcome to the industrial folding engine. We have integrated CVaR-VQE validated structural analysis with the AW-Qdock Proprietary Engine.</p>
        </div>
      ),
      placement: 'center',
    },
    {
      target: '.tour-config-section',
      content: (
        <div className="p-2">
          <h4 className="font-black uppercase tracking-tighter text-indigo-400 mb-2">Structural Blueprint</h4>
          <p className="text-[11px] leading-relaxed">Define your peptide substrate here. You can configure folding cycles and enable our proprietary **Quantum Boost**.</p>
        </div>
      ),
    },
    {
      target: '.tour-visualizer',
      content: (
        <div className="p-2">
          <h4 className="font-black uppercase tracking-tighter text-cyan-400 mb-2">Structural Visualizer</h4>
          <p className="text-[11px] leading-relaxed">Real-time render of the fold. We use high-fidelity PDB mapping to identify high-confidence binding interfaces.</p>
        </div>
      ),
    },
    {
      target: '.tour-demo-button',
      content: (
        <div className="p-2">
          <h4 className="font-black uppercase tracking-tighter text-emerald-400 mb-2">One-Click Validation</h4>
          <p className="text-[11px] leading-relaxed">Click here to launch an automated demo session. We use a canonical peptide standard as a benchmark for high-fidelity folding.</p>
        </div>
      ),
    },
    {
      target: '.tour-benchmark',
      content: (
        <div className="p-2">
          <h4 className="font-black uppercase tracking-tighter text-indigo-400 mb-2">Competitive Benchmark</h4>
          <p className="text-[11px] leading-relaxed">Compare AW-Qdock performance against industry standards in real-time speed and accuracy tests.</p>
        </div>
      ),
    },
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setRun(false);
      localStorage.setItem('aw-qdock-tour-completed', 'true');
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous={true}
      showSkipButton={true}
      callback={handleJoyrideCallback}
      locale={{ last: "Finalize" }}
      styles={{
        options: {
          primaryColor: '#06b6d4', // cyan-500
          backgroundColor: '#0a0a0a', 
          textColor: '#e5e7eb',
          arrowColor: '#0a0a0a',
          overlayColor: 'rgba(0, 0, 0, 0.45)',
          zIndex: 10000,
        },
        tooltipContainer: {
          textAlign: 'left',
          borderRadius: '0px',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          fontFamily: 'inherit',
          backdropFilter: 'blur(10px)',
        },
        buttonNext: {
          borderRadius: '0px',
          fontSize: '10px',
          fontWeight: '900',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
        },
        buttonBack: {
            fontSize: '10px',
            fontWeight: '900',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginRight: '10px',
            color: '#9ca3af'
        },
        buttonSkip: {
            fontSize: '10px',
            fontWeight: '900',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: '#6b7280'
        }
      }}
    />
  );
}
