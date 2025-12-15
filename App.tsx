import React, { useState, useEffect, useRef } from 'react';
import { SensorData, SerialLog } from './types';
import { CircuitVisualizer } from './components/CircuitVisualizer';
import { Controls } from './components/Controls';
import { SerialMonitor } from './components/SerialMonitor';
import { CodeViewer } from './components/CodeViewer';
import { ChatAssistant } from './components/ChatAssistant';
import { LayoutDashboard, Code2, MessageSquareText, Activity } from 'lucide-react';

const App: React.FC = () => {
  // State
  const [sensorData, setSensorData] = useState<SensorData>({ temperature: 25, humidity: 60 });
  const [isSimulating, setIsSimulating] = useState(false);
  const [logs, setLogs] = useState<SerialLog[]>([]);
  const [activeTab, setActiveTab] = useState<'code' | 'chat'>('code');
  
  // Refs for intervals
  const simulationInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // Start/Stop Simulation Logic
  const toggleSimulation = () => {
    setIsSimulating(prev => !prev);
  };

  // Reset logic
  const handleReset = () => {
    setSensorData({ temperature: 25, humidity: 60 });
  };

  // Effect to handle the data logging loop (simulating Arduino loop)
  useEffect(() => {
    if (isSimulating) {
      // Add initial "Boot" logs
      setLogs(prev => [
        ...prev,
        { id: Date.now().toString() + 'init', timestamp: new Date().toLocaleTimeString(), message: "DHT11 test!" }
      ]);
    }

    return () => {
      if (simulationInterval.current) clearInterval(simulationInterval.current);
    };
  }, [isSimulating]); 

  // Optimization: Use Ref for sensorData inside interval to avoid resetting interval on slider change
  const sensorDataRef = useRef(sensorData);
  useEffect(() => {
    sensorDataRef.current = sensorData;
  }, [sensorData]);

  useEffect(() => {
     if (isSimulating) {
        // Clear previous interval
        if (simulationInterval.current) clearInterval(simulationInterval.current);

        simulationInterval.current = setInterval(() => {
            const currentData = sensorDataRef.current;
            let alertMessage = "";

            // Logic for humidity alerts
            if (currentData.humidity < 12) {
                alertMessage = " - Estado de emergência";
            } else if (currentData.humidity >= 12 && currentData.humidity <= 20) {
                alertMessage = " - Estado de alerta";
            } else if (currentData.humidity > 20 && currentData.humidity <= 30) {
                alertMessage = " - Estado de atenção";
            }

             const newLog: SerialLog = {
                id: Date.now().toString(),
                timestamp: new Date().toLocaleTimeString(),
                message: `Humidity: ${currentData.humidity}%  Temperature: ${currentData.temperature}.00°C${alertMessage}`
            };
             setLogs(prev => {
                const newLogs = [...prev, newLog];
                return newLogs.length > 50 ? newLogs.slice(-50) : newLogs;
            });
        }, 2000);
     } else {
        if (simulationInterval.current) clearInterval(simulationInterval.current);
     }
     return () => {
         if (simulationInterval.current) clearInterval(simulationInterval.current);
     };
  }, [isSimulating]);


  const handleSensorChange = (key: keyof SensorData, value: number) => {
    setSensorData(prev => ({ ...prev, [key]: value }));
  };

  const clearLogs = () => setLogs([]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 lg:p-8 flex flex-col gap-6">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-800">
        <div>
            <h1 className="text-2xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
            Simulador Arduino + DHT11
            </h1>
            <p className="text-slate-400 text-sm mt-1">Laboratório Virtual de IoT e Eletrônica</p>
        </div>
        <div className="flex gap-4">
            <a href="https://docs.arduino.cc/learn/sensors-and-actuators/dht11/" target="_blank" rel="noreferrer" className="text-xs font-medium text-slate-500 hover:text-cyan-400 transition-colors">Docs Oficiais</a>
            <a href="https://ai.google.dev/" target="_blank" rel="noreferrer" className="text-xs font-medium text-slate-500 hover:text-purple-400 transition-colors">Powered by Gemini</a>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Visuals & Controls (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Visualizer */}
            <section className="bg-slate-900 rounded-2xl p-1 border border-slate-800 shadow-2xl">
                <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-800/50 mb-1">
                    <Activity size={16} className="text-green-400" />
                    <h2 className="text-sm font-semibold text-slate-300">Bancada de Trabalho</h2>
                </div>
                <CircuitVisualizer isActive={isSimulating} />
            </section>

            {/* Control Panel & Serial Monitor Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Controls 
                    data={sensorData} 
                    onChange={handleSensorChange} 
                    isSimulating={isSimulating} 
                    toggleSimulation={toggleSimulation} 
                    onReset={handleReset}
                />
                {/* Fixed height wrapper for SerialMonitor to prevent layout shift */}
                <div className="h-[300px] md:h-[400px]">
                    <SerialMonitor logs={logs} onClear={clearLogs} isActive={isSimulating} />
                </div>
            </div>
        </div>

        {/* Right Column: Educational (5 cols) */}
        <div className="lg:col-span-5 flex flex-col h-[800px] lg:h-auto">
            {/* Tabs */}
            <div className="flex gap-2 mb-4">
                <button 
                    onClick={() => setActiveTab('code')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all ${
                        activeTab === 'code' 
                        ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30 shadow-lg' 
                        : 'bg-slate-900/50 text-slate-500 hover:bg-slate-800 hover:text-slate-300'
                    }`}
                >
                    <Code2 size={16} /> Código Fonte (C++)
                </button>
                <button 
                    onClick={() => setActiveTab('chat')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all ${
                        activeTab === 'chat' 
                        ? 'bg-slate-800 text-purple-400 border border-purple-500/30 shadow-lg' 
                        : 'bg-slate-900/50 text-slate-500 hover:bg-slate-800 hover:text-slate-300'
                    }`}
                >
                    <MessageSquareText size={16} /> Assistente IA
                </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 relative">
                {activeTab === 'code' ? <CodeViewer /> : <ChatAssistant />}
            </div>
        </div>

      </main>
    </div>
  );
};

export default App;