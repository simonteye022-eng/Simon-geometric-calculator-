
import React from 'react';
import { ShapeType } from '../types';

interface VisualizerProps {
  type: ShapeType;
  inputs: Record<string, number>;
}

const Visualizer: React.FC<VisualizerProps> = ({ type, inputs }) => {
  const containerSize = 300;
  const padding = 40;
  const drawArea = containerSize - (padding * 2);

  const getShapePath = () => {
    switch (type) {
      case ShapeType.SQUARE:
        return (
          <rect 
            x={padding} y={padding} 
            width={drawArea} height={drawArea} 
            className="fill-blue-500/20 stroke-blue-400" 
            strokeWidth="3"
            strokeDasharray="4 2"
          />
        );
      case ShapeType.RECTANGLE:
        const ratio = (inputs.width || 1) / (inputs.length || 1);
        const w = ratio > 1 ? drawArea / ratio : drawArea;
        const h = ratio > 1 ? drawArea : drawArea * ratio;
        return (
          <rect 
            x={padding + (drawArea - w) / 2} 
            y={padding + (drawArea - h) / 2} 
            width={w} height={h} 
            className="fill-indigo-500/20 stroke-indigo-400" 
            strokeWidth="3"
          />
        );
      case ShapeType.CIRCLE:
        return (
          <circle 
            cx={containerSize / 2} cy={containerSize / 2} 
            r={drawArea / 2} 
            className="fill-pink-500/20 stroke-pink-400" 
            strokeWidth="3"
          />
        );
      case ShapeType.TRIANGLE:
        return (
          <path 
            d={`M ${padding},${containerSize - padding} L ${containerSize - padding},${containerSize - padding} L ${containerSize / 2},${padding} Z`}
            className="fill-emerald-500/20 stroke-emerald-400" 
            strokeWidth="3"
          />
        );
      case ShapeType.PARALLELOGRAM:
        return (
          <path 
            d={`M ${padding + 30},${padding} L ${containerSize - padding},${padding} L ${containerSize - padding - 30},${containerSize - padding} L ${padding},${containerSize - padding} Z`}
            className="fill-amber-500/20 stroke-amber-400" 
            strokeWidth="3"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 flex flex-col items-center justify-center">
      <h3 className="text-slate-400 text-sm font-medium mb-4 uppercase tracking-wider">Dynamic Blueprint</h3>
      <svg width={containerSize} height={containerSize} viewBox={`0 0 ${containerSize} ${containerSize}`} className="drop-shadow-lg">
        {getShapePath()}
        {/* Simple Labels */}
        <text x={padding - 10} y={padding - 10} fill="#94a3b8" fontSize="12">Y-Axis</text>
        <text x={containerSize - padding - 30} y={containerSize - padding + 20} fill="#94a3b8" fontSize="12">X-Axis</text>
      </svg>
      <p className="mt-4 text-slate-500 text-xs italic text-center">Visual relative representation (not to scale)</p>
    </div>
  );
};

export default Visualizer;
