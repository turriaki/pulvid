import React from 'react';
import { PathologyType } from '../types';

interface LungVisualizerProps {
  pathology: PathologyType;
}

const LungVisualizer: React.FC<LungVisualizerProps> = ({ pathology }) => {
  
  // --- Animation & State Flags ---
  const isPneumothorax = pathology === PathologyType.NEUMOTORAX;
  const isEffusion = pathology === PathologyType.DERRAME_PLEURAL;
  const isAtelectasis = pathology === PathologyType.ATELECTASIA;
  const isAlveolar = pathology === PathologyType.NEUMONIA_ALVEOLAR;
  const isDiffuse = pathology === PathologyType.NEUMONIA_DIFUSA;

  // --- Paths (Anatomically Approx) ---
  // Coordinate space: 0 0 500 600
  
  // Trachea & Bronchi
  const airwayPath = "M 235 40 L 235 140 Q 235 160 210 190 L 180 220 M 235 140 Q 235 160 265 190 L 290 215";

  // Chest Cavity Outline (Parietal Pleura / Rib Cage Interior) - Used for background reference
  const rightChestCavity = "M 235 160 C 180 160 100 130 80 180 C 60 230 50 400 60 480 C 70 530 230 520 235 520";
  const leftChestCavity = "M 265 160 C 320 160 400 130 420 180 C 440 230 450 400 440 480 C 430 530 270 520 265 520";

  // Right Lung Lobes (Superior, Middle, Inferior)
  const rightSuperior = "M 235 165 C 200 160 100 140 85 180 C 75 220 70 260 75 280 L 235 240 Z";
  const rightMiddle = "M 75 280 C 70 320 75 380 80 400 L 235 360 L 235 240 Z";
  const rightInferior = "M 80 400 C 90 480 120 515 235 515 L 235 360 Z";

  // Left Lung Lobes (Superior, Inferior) - Has Cardiac Notch
  const leftSuperior = "M 265 165 C 300 160 400 140 415 180 C 425 220 430 300 425 340 L 265 280 Z";
  const leftInferior = "M 425 340 C 420 400 415 450 410 480 C 380 515 320 515 265 515 L 265 280 Z";

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-slate-950 rounded-xl shadow-2xl overflow-hidden border border-slate-800">
      
      {/* Background Texture/Grid for Medical Feel */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, #334155 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

      <svg viewBox="0 0 500 600" className="w-full h-full max-h-[700px] z-10">
        <defs>
          {/* Tissue Gradient (Healthy) */}
          <radialGradient id="tissueGradient" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#fda4af" /> {/* pink-300 */}
            <stop offset="100%" stopColor="#e11d48" /> {/* rose-600 */}
          </radialGradient>

          {/* Tissue Gradient (Congested/Dark) */}
          <radialGradient id="congestedGradient" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#f87171" /> 
            <stop offset="100%" stopColor="#991b1b" /> 
          </radialGradient>

          {/* Fluid Gradient */}
          <linearGradient id="fluidGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.8"/>
            <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.9"/>
          </linearGradient>

          {/* Pneumonia Texture */}
          <filter id="consolidation">
            <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" result="noise" />
            <feColorMatrix type="matrix" values="1 0 0 0 1  0 1 0 0 1  0 0 1 0 0  0 0 0 1 0" in="noise" result="coloredNoise" />
            <feComposite operator="in" in="coloredNoise" in2="SourceGraphic" result="composite" />
            <feBlend mode="screen" in="composite" in2="SourceGraphic" />
          </filter>

          <filter id="diffuseHaze">
             <feTurbulence type="turbulence" baseFrequency="0.05" numOctaves="2" result="turbulence"/>
             <feDisplacementMap in2="turbulence" in="SourceGraphic" scale="5" xChannelSelector="R" yChannelSelector="G"/>
             <feGaussianBlur stdDeviation="1.5" />
          </filter>
        </defs>

        {/* --- ANATOMY LAYER --- */}

        {/* 1. Trachea (Behind lungs) */}
        <path d={airwayPath} fill="none" stroke="#94a3b8" strokeWidth="18" strokeLinecap="round" />
        {/* Cartilage Rings */}
        {[50, 70, 90, 110, 130].map(y => (
           <path key={y} d={`M 226 ${y} L 244 ${y}`} stroke="#cbd5e1" strokeWidth="2" strokeOpacity="0.5" />
        ))}

        {/* 2. RIGHT SIDE (Pathology Target usually) */}
        <g id="RightHemithorax">
            {/* Parietal Pleura Outline (Chest Wall) - Visible only when Pneumothorax creates a gap */}
            <path 
                d={rightChestCavity} 
                fill="none" 
                stroke="#334155" 
                strokeWidth="2" 
                className={`transition-opacity duration-500 ${isPneumothorax ? 'opacity-100' : 'opacity-0'}`}
            />
            {isPneumothorax && (
                 <text x="130" y="250" fill="#94a3b8" fontSize="14" fontWeight="bold" opacity="0.7">AIRE (Espacio Pleural)</text>
            )}

            {/* THE RIGHT LUNG GROUP */}
            <g 
                className="transition-all duration-1000 ease-in-out origin-[235px_240px]" // Origin at Hilum
                style={{ 
                    transform: isPneumothorax ? 'scale(0.55)' : 'scale(1)',
                }}
            >
                {/* Right Superior Lobe */}
                <path d={rightSuperior} fill="url(#tissueGradient)" stroke="#be123c" strokeWidth="1" />
                
                {/* Right Middle Lobe */}
                <path d={rightMiddle} fill="url(#tissueGradient)" stroke="#be123c" strokeWidth="1">
                     {/* Alveolar Pneumonia Spot - Localized in Middle Lobe often */}
                    {isAlveolar && (
                        <animate attributeName="fill" values="#fef08a;#fde047;#fef08a" dur="3s" repeatCount="indefinite" />
                    )}
                </path>
                {/* Alveolar overlay specifically */}
                {isAlveolar && (
                    <path d={rightMiddle} fill="white" fillOpacity="0.5" filter="url(#consolidation)" />
                )}


                {/* Right Inferior Lobe */}
                <path d={rightInferior} fill={isAtelectasis ? "#9f1239" : "url(#tissueGradient)"} stroke="#be123c" strokeWidth="1" 
                      className={`transition-all duration-1000 ${isAtelectasis ? 'origin-bottom scale-y-75 translate-y-[-20px]' : ''}`}
                />
                
                {/* Atelectasis Visuals (Volume Loss) */}
                {isAtelectasis && (
                    <g opacity="0.6">
                         <path d="M 120 450 L 140 430" stroke="white" strokeWidth="2" markerEnd="url(#arrow)" />
                         <path d="M 200 450 L 180 430" stroke="white" strokeWidth="2" markerEnd="url(#arrow)" />
                    </g>
                )}

                {/* Diffuse Pattern Overlay (Right) */}
                {isDiffuse && (
                     <g filter="url(#diffuseHaze)" opacity="0.6">
                        <path d={rightSuperior} fill="white"/>
                        <path d={rightMiddle} fill="white"/>
                        <path d={rightInferior} fill="white"/>
                     </g>
                )}
            </g>

            {/* Pleural Effusion (Fluid sits OUTSIDE the lung, inside the chest cavity) */}
            {isEffusion && (
                <g className="animate-in slide-in-from-bottom duration-1000 fade-in">
                    {/* Meniscus Shape: Fills bottom of Right Chest Cavity */}
                    <path 
                        d="M 62 460 Q 150 440 235 480 L 235 520 C 230 520 70 530 60 480 Z" 
                        fill="url(#fluidGradient)"
                    />
                    <path d="M 62 460 Q 150 440 235 480" fill="none" stroke="#60a5fa" strokeWidth="2" />
                    <text x="140" y="500" fill="white" fontSize="12" fontWeight="bold">LÍQUIDO</text>
                </g>
            )}
        </g>

        {/* 3. LEFT LUNG (Generally Healthy in this demo, unless Diffuse) */}
        <g id="LeftHemithorax">
             {/* Left Superior */}
             <path d={leftSuperior} fill="url(#tissueGradient)" stroke="#be123c" strokeWidth="1" />
             {/* Left Inferior */}
             <path d={leftInferior} fill="url(#tissueGradient)" stroke="#be123c" strokeWidth="1" />
             
             {/* Diffuse Pattern Overlay (Left) */}
             {isDiffuse && (
                <g filter="url(#diffuseHaze)" opacity="0.6">
                    <path d={leftSuperior} fill="white"/>
                    <path d={leftInferior} fill="white"/>
                </g>
            )}
            
            {/* Heart Shadow Hint (Cardiac Notch Area) */}
            <circle cx="280" cy="350" r="40" fill="#7f1d1d" opacity="0.2" filter="url(#blur)" />
        </g>

        {/* Labels & Details */}
        <text x="50" y="580" fill="#64748b" fontSize="12" fontFamily="sans-serif">Lóbulo Sup. Der.</text>
        <text x="50" y="595" fill="#64748b" fontSize="12" fontFamily="sans-serif">Lóbulo Med. Der.</text>
        <text x="380" y="580" fill="#64748b" fontSize="12" fontFamily="sans-serif">Lóbulo Sup. Izq.</text>
        
        {/* Hilum Reference (Center) */}
        <circle cx="235" cy="240" r="5" fill="#ef4444" opacity="0.0" />

      </svg>
      
      {/* Legend overlay */}
      <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-md p-4 rounded-xl border border-slate-700 shadow-xl">
        <h4 className="text-slate-400 text-[10px] uppercase font-bold mb-2 tracking-wider">Referencias</h4>
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                <span className="text-xs text-slate-300">Tejido Pulmonar</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-800 border border-slate-600"></div>
                <span className="text-xs text-slate-300">Cavidad Torácica</span>
            </div>
            {isPneumothorax && (
                <div className="flex items-center gap-2 animate-pulse">
                    <div className="w-3 h-3 rounded-full bg-slate-900 border border-slate-500"></div>
                    <span className="text-xs text-slate-200 font-bold">Aire (Colapso)</span>
                </div>
            )}
            {isEffusion && (
                <div className="flex items-center gap-2 animate-pulse">
                    <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                    <span className="text-xs text-blue-200 font-bold">Derrame (Líquido)</span>
                </div>
            )}
            {isAlveolar && (
                 <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-yellow-200 opacity-80"></div>
                 <span className="text-xs text-yellow-200 font-bold">Consolidación</span>
             </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default LungVisualizer;