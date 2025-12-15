import React from 'react';

interface CircuitVisualizerProps {
  isActive: boolean;
}

export const CircuitVisualizer: React.FC<CircuitVisualizerProps> = ({ isActive }) => {
  return (
    <div className="relative w-full h-full min-h-[300px] bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-inner flex items-center justify-center p-4">
      <svg viewBox="0 0 800 500" className="w-full h-full select-none">
        <defs>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.3" />
          </filter>
          <linearGradient id="ledOn" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4ade80" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>
           <linearGradient id="ledOff" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
        </defs>

        {/* --- Breadboard --- */}
        <rect x="50" y="50" width="300" height="400" rx="10" fill="#f1f5f9" filter="url(#shadow)" />
        {/* Power Rails */}
        <rect x="65" y="60" width="10" height="380" fill="#ef4444" opacity="0.2" />
        <rect x="80" y="60" width="10" height="380" fill="#3b82f6" opacity="0.2" />
        <rect x="310" y="60" width="10" height="380" fill="#ef4444" opacity="0.2" />
        <rect x="325" y="60" width="10" height="380" fill="#3b82f6" opacity="0.2" />
        {/* Center groove */}
        <rect x="195" y="60" width="10" height="380" fill="#cbd5e1" />

        {/* Holes (Simplified visual) */}
        {Array.from({ length: 30 }).map((_, i) => (
            <g key={i} transform={`translate(0, ${i * 12})`}>
                <circle cx="70" cy="70" r="2" fill="#334155" />
                <circle cx="85" cy="70" r="2" fill="#334155" />
                
                <circle cx="120" cy="70" r="2" fill="#334155" />
                <circle cx="135" cy="70" r="2" fill="#334155" />
                <circle cx="150" cy="70" r="2" fill="#334155" />
                <circle cx="165" cy="70" r="2" fill="#334155" />
                <circle cx="180" cy="70" r="2" fill="#334155" />

                <circle cx="220" cy="70" r="2" fill="#334155" />
                <circle cx="235" cy="70" r="2" fill="#334155" />
                <circle cx="250" cy="70" r="2" fill="#334155" />
                <circle cx="265" cy="70" r="2" fill="#334155" />
                <circle cx="280" cy="70" r="2" fill="#334155" />
            </g>
        ))}

        {/* --- Arduino Uno --- */}
        <g transform="translate(400, 100)">
            <rect x="0" y="0" width="300" height="220" rx="5" fill="#0e7490" filter="url(#shadow)" /> {/* PCB Teal */}
            <rect x="20" y="160" width="260" height="40" fill="#1e293b" /> {/* Headers bottom */}
            <rect x="20" y="20" width="260" height="40" fill="#1e293b" /> {/* Headers top */}
            
            {/* USB Port */}
            <rect x="-10" y="40" width="40" height="60" fill="#94a3b8" stroke="#475569" />
            
            {/* Main Chip */}
            <rect x="120" y="100" width="100" height="30" fill="#0f172a" />
            <text x="130" y="120" fontSize="10" fill="#94a3b8" fontFamily="monospace">ATMEGA328P</text>

            {/* TX/RX LEDs */}
            <circle cx="140" cy="80" r="3" fill={isActive ? "url(#ledOn)" : "url(#ledOff)"} className={isActive ? "animate-pulse" : ""} />
            <text x="150" y="83" fontSize="8" fill="white">TX</text>
            <circle cx="140" cy="90" r="3" fill={isActive ? "url(#ledOn)" : "url(#ledOff)"} className={isActive ? "animate-pulse" : ""} />
            <text x="150" y="93" fontSize="8" fill="white">RX</text>

             {/* Pin Labels Top */}
            <text x="200" y="15" fontSize="10" fill="white">DIGITAL (PWM~)</text>
            {/* Pin 2 */}
             <text x="240" y="35" fontSize="8" fill="white" textAnchor="middle">2</text>
             
             {/* Pin Labels Bottom */}
            <text x="140" y="215" fontSize="10" fill="white">POWER / ANALOG</text>
            <text x="180" y="190" fontSize="8" fill="white" textAnchor="middle">5V</text>
            <text x="200" y="190" fontSize="8" fill="white" textAnchor="middle">GND</text>
        </g>

        {/* --- DHT11 Sensor --- */}
        <g transform="translate(120, 200)">
             <rect x="0" y="0" width="60" height="70" rx="2" fill="#3b82f6" filter="url(#shadow)" /> {/* Blue body */}
             <rect x="5" y="5" width="50" height="60" rx="1" fill="#60a5fa" opacity="0.5" /> {/* Grid pattern */}
             <text x="30" y="35" fontSize="12" fill="white" textAnchor="middle" fontWeight="bold">DHT11</text>
             
             {/* Pins */}
             <rect x="10" y="70" width="4" height="20" fill="#94a3b8" /> {/* VCC */}
             <rect x="23" y="70" width="4" height="20" fill="#94a3b8" /> {/* Data */}
             <rect x="36" y="70" width="4" height="20" fill="#94a3b8" /> {/* NC */}
             <rect x="49" y="70" width="4" height="20" fill="#94a3b8" /> {/* GND */}
        </g>

        {/* --- Wires (Jumpers) --- */}
        
        {/* 5V (Red) from Arduino to Breadboard Power Rail */}
        <path d="M 580 260 C 580 300, 80 480, 70 430" stroke="#ef4444" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.9" />
        
        {/* GND (Black) from Arduino to Breadboard Ground Rail */}
        <path d="M 600 260 C 600 320, 90 490, 85 430" stroke="#1e293b" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.9" />

        {/* DHT11 VCC to Power Rail */}
        <path d="M 132 290 L 132 350 L 70 350" stroke="#ef4444" strokeWidth="4" fill="none" strokeLinecap="round" />
        
        {/* DHT11 GND to Ground Rail */}
        <path d="M 171 290 L 171 370 L 85 370" stroke="#1e293b" strokeWidth="4" fill="none" strokeLinecap="round" />

        {/* DHT11 Data (Green) to Arduino Pin 2 */}
        <path d="M 145 290 C 145 150, 600 0, 640 120" stroke="#22c55e" strokeWidth="4" fill="none" strokeLinecap="round" />
        
      </svg>
      
      <div className="absolute bottom-4 right-4 bg-slate-900/80 p-2 rounded border border-slate-600 text-xs text-slate-300">
        <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-1 bg-red-500"></div> 5V VCC
        </div>
        <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-1 bg-slate-800 border border-slate-500"></div> GND
        </div>
         <div className="flex items-center gap-2">
            <div className="w-3 h-1 bg-green-500"></div> DATA (PIN 2)
        </div>
      </div>
    </div>
  );
};
