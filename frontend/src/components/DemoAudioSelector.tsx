import React from 'react';
import { PlayCircle } from 'lucide-react';

interface DemoAudioSelectorProps {
  onSelectSample: (filename: string, file: File) => void;
  disabled: boolean;
}

export const DemoAudioSelector: React.FC<DemoAudioSelectorProps> = ({
  onSelectSample,
  disabled,
}) => {
  const demoFiles = [
    {
      label: 'Genuine Human Call',
      file: 'genuine_sample.wav',
      desc: 'Natural pitch & spectral variance',
    },
    {
      label: 'Cloned Voice (Scam)',
      file: 'scam_sample.wav',
      desc: 'Synthetic artifact indicators',
    },
  ];

  const loadSample = async (filename: string) => {
    try {
      const response = await fetch(`/samples/${filename}`);

      if (!response.ok) {
        throw new Error('Sample not found in /public/samples/');
      }

      const blob = await response.blob();
      const file = new File([blob], filename, { type: 'audio/wav' });

      onSelectSample(filename, file);
    } catch (e: unknown) {
      alert(
        `Could not load /samples/${filename}. Ensure it is placed in the Vite public/ folder.`
      );
    }
  };

  return (
    <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-xs">
      <div className="flex items-center space-x-2 text-slate-400 font-semibold mb-2">
        <PlayCircle className="w-3.5 h-3.5 text-indigo-400" />
        <span>Hackathon Fast-Test Samples</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {demoFiles.map((demo) => (
          <button
            key={demo.file}
            type="button"
            disabled={disabled}
            onClick={() => loadSample(demo.file)}
            className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-indigo-500/50 text-slate-300 hover:text-white transition disabled:opacity-40 text-left"
          >
            <div className="font-semibold text-[11px]">
              {demo.label}
            </div>

            <div className="text-[10px] text-slate-500 font-mono">
              {demo.file}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
