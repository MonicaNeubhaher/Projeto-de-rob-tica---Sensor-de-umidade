import React, { useEffect, useRef } from 'react';
import { SerialLog } from '../types';
import { Terminal, Trash2 } from 'lucide-react';

interface SerialMonitorProps {
  logs: SerialLog[];
  onClear: () => void;
  isActive: boolean;
}

export const SerialMonitor: React.FC<SerialMonitorProps> = ({ logs, onClear, isActive }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [logs]);

  return (
    <div className="flex flex-col h-full bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 shrink-0">
             <div className="flex items-center gap-2 text-slate-400">
                <Terminal size={14} />
                <span className="text-xs font-semibold uppercase tracking-wider">Monitor Serial (9600 baud)</span>
            </div>
            <button onClick={onClear} className="text-slate-500 hover:text-rose-400 transition-colors">
                <Trash2 size={14} />
            </button>
        </div>

        {/* Content */}
        <div 
            ref={scrollContainerRef}
            className="flex-1 p-4 font-mono text-xs sm:text-sm overflow-y-auto font-light space-y-1"
        >
            {!isActive && logs.length === 0 && (
                <div className="text-slate-600 italic opacity-50">
                    Dispositivo desligado. Inicie a simulação para ver os dados.
                </div>
            )}
            
            {logs.map((log) => (
                <div key={log.id} className="flex gap-3 animate-in fade-in slide-in-from-bottom-1 duration-300">
                    <span className="text-slate-600 select-none shrink-0">{log.timestamp}</span>
                    <span className="text-green-400">{log.message}</span>
                </div>
            ))}
        </div>
    </div>
  );
};