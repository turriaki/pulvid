import React from 'react';
import { GeminiResponse, PathologyType } from '../types';
import { Activity, Thermometer, FileText, Stethoscope } from 'lucide-react';

interface InfoPanelProps {
  loading: boolean;
  data: GeminiResponse | null;
  pathology: PathologyType;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ loading, data, pathology }) => {
  if (loading) {
    return (
      <div className="w-full flex flex-col items-center justify-center p-12 bg-white rounded-2xl shadow-sm border border-slate-100 min-h-[300px]">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 animate-pulse">Consultando a Gemini AI...</p>
      </div>
    );
  }

  if (!data) return null;

  const getTitle = () => {
    switch (pathology) {
      case PathologyType.NORMAL: return "Pulmones Sanos";
      case PathologyType.DERRAME_PLEURAL: return "Derrame Pleural";
      case PathologyType.ATELECTASIA: return "Atelectasia";
      case PathologyType.NEUMONIA_ALVEOLAR: return "Neumonía Alveolar";
      case PathologyType.NEUMONIA_DIFUSA: return "Neumonía Difusa";
      case PathologyType.NEUMOTORAX: return "Neumotórax";
      default: return "Información";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-indigo-600 p-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Stethoscope className="w-6 h-6" />
          {getTitle()}
        </h2>
      </div>
      
      <div className="p-6 space-y-6">
        
        {/* Description Section */}
        <div>
          <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-wide mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4" /> Descripción
          </h3>
          <p className="text-slate-700 leading-relaxed text-sm md:text-base">
            {data.description}
          </p>
        </div>

        {/* Symptoms Section */}
        <div className="bg-orange-50 p-6 rounded-xl border border-orange-100">
          <h3 className="text-sm font-bold text-orange-600 uppercase tracking-wide mb-3 flex items-center gap-2">
            <Thermometer className="w-4 h-4" /> Síntomas Comunes
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {data.symptoms.map((symptom, idx) => (
              <li key={idx} className="flex items-start gap-2 text-slate-700 text-sm">
                <span className="mt-1.5 w-1.5 h-1.5 bg-orange-400 rounded-full shrink-0"></span>
                {symptom}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Radiography Section */}
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wide mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4" /> Hallazgos Radiológicos
            </h3>
            <ul className="space-y-3">
                {data.radiographicFeatures.map((feature, idx) => (
                <li key={idx} className="text-sm text-slate-600 italic border-l-4 border-slate-300 pl-3">
                    "{feature}"
                </li>
                ))}
            </ul>
            </div>

            {/* Treatment Section */}
            <div className="bg-teal-50 p-6 rounded-xl border border-teal-100">
            <h3 className="text-sm font-bold text-teal-600 uppercase tracking-wide mb-3">Tratamiento General</h3>
            <p className="text-slate-700 text-sm leading-relaxed">{data.treatment}</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;