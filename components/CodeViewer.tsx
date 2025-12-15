import React from 'react';
import { Copy } from 'lucide-react';

const arduinoCode = `
#include <DHT.h>

#define DHTPIN 2     // Digital pin connected to the DHT sensor
#define DHTTYPE DHT11   // DHT 11

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(9600);
  Serial.println(F("DHT11 test!"));
  dht.begin();
}

void loop() {
  // Wait a few seconds between measurements.
  delay(2000);

  // Reading temperature or humidity takes about 250 milliseconds!
  float h = dht.readHumidity();
  float t = dht.readTemperature();

  if (isnan(h) || isnan(t)) {
    Serial.println(F("Failed to read from DHT sensor!"));
    return;
  }

  Serial.print(F("Humidity: "));
  Serial.print(h);
  Serial.print(F("%  Temperature: "));
  Serial.print(t);
  Serial.println(F("°C "));

  // Lógica de Alerta de Umidade
  if (h < 12) {
    Serial.println(F("Estado de emergência"));
  } 
  else if (h >= 12 && h <= 20) {
    Serial.println(F("Estado de alerta"));
  }
  else if (h > 20 && h <= 30) {
    Serial.println(F("Estado de atenção"));
  }
}
`;

export const CodeViewer: React.FC = () => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(arduinoCode.trim());
  };

  return (
    <div className="relative bg-[#1e1e1e] text-gray-300 p-4 rounded-xl font-mono text-sm h-full overflow-auto border border-slate-700 shadow-lg">
        <div className="absolute top-4 right-4">
            <button 
                onClick={copyToClipboard}
                className="p-2 bg-slate-700 hover:bg-slate-600 rounded transition-colors text-white"
                title="Copy Code"
            >
                <Copy size={16} />
            </button>
        </div>
        <pre>
            <code className="language-cpp">
                {arduinoCode.split('\n').map((line, i) => (
                    <div key={i} className="table-row">
                        <span className="table-cell text-slate-600 select-none pr-4 text-right w-8">{i + 1}</span>
                        <span className="table-cell whitespace-pre-wrap">{line}</span>
                    </div>
                ))}
            </code>
        </pre>
    </div>
  );
};