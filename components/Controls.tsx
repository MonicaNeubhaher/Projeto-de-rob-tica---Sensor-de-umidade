import React from 'react';
import { SensorData } from '../types';
import { Thermometer, Droplets, RotateCcw } from 'lucide-react';

interface ControlsProps {
  data: SensorData;
  onChange: (key: keyof SensorData, value: number) => void;
  isSimulating: boolean;
  toggleSimulation: () => void;
  onReset: () => void;
}

export const Controls: React.FC<ControlsProps> = ({ data, onChange, isSimulating, toggleSimulation, onReset }) => {
  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 space-y-6 h-full">
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-white">Ambiente Simulado</h2>
                <button 
                    onClick={onReset}
                    className="p-1.5 text-slate-500 hover:text-white hover:bg-slate-700 rounded transition-colors"
                    title="Resetar para padrão (25°C, 60%)"
                >
                    <RotateCcw size={16} />
                </button>
            </div>
            <button 
                onClick={toggleSimulation}
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                    isSimulating 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/50 animate-pulse' 
                    : 'bg-slate-700 text-slate-400 border border-slate-600 hover:bg-slate-600'
                }`}
            >
                {isSimulating ? 'Arduino Ligado' : 'Arduino Desligado'}
            </button>
        </div>

      <div className="space-y-4">
        {/* Temperature Control */}
        <div className="space-y-2">
            <div className="flex justify-between text-sm">
                <span className="flex items-center gap-2 text-rose-400"><Thermometer size={16}/> Temperatura</span>
                <span className="font-mono text-rose-200">{data.temperature}°C</span>
            </div>
            <input
                type="range"
                min="0"
                max="50"
                value={data.temperature}
                onChange={(e) => onChange('temperature', parseInt(e.target.value))}
                disabled={!isSimulating}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500 disabled:opacity-50"
            />
            <div className="flex justify-between text-xs text-slate-500 font-mono">
                <span>0°C</span>
                <span>50°C</span>
            </div>
        </div>

        {/* Humidity Control */}
        <div className="space-y-2">
             <div className="flex justify-between text-sm">
                <span className="flex items-center gap-2 text-cyan-400"><Droplets size={16}/> Umidade</span>
                <span className="font-mono text-cyan-200">{data.humidity}%</span>
            </div>
            <input
                type="range"
                min="0"
                max="90"
                value={data.humidity}
                onChange={(e) => onChange('humidity', parseInt(e.target.value))}
                disabled={!isSimulating}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500 disabled:opacity-50"
            />
             <div className="flex justify-between text-xs text-slate-500 font-mono">
                <span>0%</span>
                <span>90%</span>
            </div>
        </div>
      </div>
    </div>
  );
};