import React, { useState, useEffect } from 'react';
import LungVisualizer from './components/LungVisualizer';
import InfoPanel from './components/InfoPanel';
import { PathologyType, GeminiResponse } from './types';
import { fetchPathologyDetails } from './services/geminiService';
import { BrainCircuit, Activity, Stethoscope } from 'lucide-react';

const App: React.FC = () => {
  const [selectedPathology, setSelectedPathology] = useState<PathologyType>(PathologyType.NORMAL);
  const [infoData, setInfoData] = useState<GeminiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Load initial data for Normal state
  useEffect(() => {
    handlePathologySelect(PathologyType.NORMAL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePathologySelect = async (pathology: PathologyType) => {
    setSelectedPathology(pathology);
    setLoading(true);
    try {
      const data = await fetchPathologyDetails(pathology);
      setInfoData(data);
    } catch (error) {
      console.error("Failed to load info", error);
    } finally {
      setLoading(false);
    }
  };

  const buttons = [
    { id: PathologyType.NORMAL, label: 'Normal', color: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-200' },
    { id: PathologyType.NEUMOTORAX, label: 'Neumotórax', color: 'bg-slate-200 text-slate-800 hover:bg-slate-300 border-slate-300' },
    { id: PathologyType.DERRAME_PLEURAL, label: 'Derrame Pleural', color: 'bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200' },
    { id: PathologyType.ATELECTASIA, label: 'Atelectasia', color: 'bg-rose-100 text-rose-800 hover:bg-rose-200 border-rose-200' },
    { id: PathologyType.NEUMONIA_ALVEOLAR, label: 'Neumonía Alveolar', color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200' },
    { id: PathologyType.NEUMONIA_DIFUSA, label: 'Neumonía Difusa', color: 'bg-purple-100 text-purple-800 hover:bg-purple-200 border-purple-200' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg shadow-md">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <div>
               <h1 className="text-xl font-bold text-slate-800 tracking-tight leading-none">Pulmo<span className="text-indigo-600">Vis</span></h1>
               <p className="text-[10px] text-slate-500 font-medium">Atlas de Patología Digital</p>
            </div>
          </div>
          <div className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100 flex items-center gap-2">
            <Activity className="w-3 h-3" />
            Análisis IA Activo
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full p-4 sm:p-6 lg:p-8 flex flex-col gap-8">
        
        {/* TOP: Controls Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 animate-in fade-in slide-in-from-top-4 duration-500">
           <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-2">
             <div className="bg-indigo-100 p-2 rounded-lg">
                <Stethoscope className="w-5 h-5 text-indigo-600" />
             </div>
             <h3 className="text-lg font-bold text-slate-800">Seleccionar Condición Clínica</h3>
           </div>
           
           <div className="flex flex-wrap gap-3">
             {buttons.map((btn) => (
               <button
                 key={btn.id}
                 onClick={() => handlePathologySelect(btn.id)}
                 className={`px-5 py-3 rounded-xl text-sm font-bold border transition-all duration-300 shadow-sm flex-grow sm:flex-grow-0 text-center ${
                   selectedPathology === btn.id 
                     ? 'ring-2 ring-offset-2 ring-indigo-500 transform scale-105 z-10 ' + btn.color.replace('100', '600').replace('200', '700').replace('text-', 'bg-').replace('text-', 'text-white border-transparent')
                     : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:bg-slate-50 hover:shadow-md'
                 }`}
               >
                 {btn.label}
               </button>
             ))}
           </div>
        </div>

        {/* MIDDLE: Visualizer */}
        <div className="w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl shadow-slate-200 border border-slate-200 relative min-h-[500px] lg:min-h-[600px] animate-in zoom-in-95 duration-500 delay-100">
           <LungVisualizer pathology={selectedPathology} />
        </div>

        {/* BOTTOM: Info Panel */}
        <div className="w-full">
          <InfoPanel 
            loading={loading} 
            data={infoData} 
            pathology={selectedPathology} 
          />
        </div>

      </main>
    </div>
  );
};

export default App;