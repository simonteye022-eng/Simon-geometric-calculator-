
import React, { useState, useEffect, useCallback } from 'react';
import { ShapeType, CalculationResult } from './types';
import { SHAPE_CONFIGS } from './constants';
import ShapeIcon from './components/ShapeIcon';
import Visualizer from './components/Visualizer';
import { getShapeInsight } from './services/geminiService';

const App: React.FC = () => {
  const [selectedShape, setSelectedShape] = useState<ShapeType>(ShapeType.SQUARE);
  const [inputs, setInputs] = useState<Record<string, number>>({});
  const [result, setResult] = useState<{ area: number; perimeter: number } | null>(null);
  const [history, setHistory] = useState<CalculationResult[]>([]);
  const [aiInsight, setAiInsight] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Initialize inputs when shape changes
  useEffect(() => {
    const config = SHAPE_CONFIGS[selectedShape];
    const initialInputs: Record<string, number> = {};
    config.fields.forEach(f => initialInputs[f.key] = 0);
    setInputs(initialInputs);
    setResult(null);
    setAiInsight('');
  }, [selectedShape]);

  const calculate = useCallback(async () => {
    let area = 0;
    let perimeter = 0;

    const { side, length, width, radius, base, height, sideA, sideB, sideC } = inputs;

    switch (selectedShape) {
      case ShapeType.SQUARE:
        area = side * side;
        perimeter = 4 * side;
        break;
      case ShapeType.RECTANGLE:
        area = length * width;
        perimeter = 2 * (length + width);
        break;
      case ShapeType.CIRCLE:
        area = Math.PI * radius * radius;
        perimeter = 2 * Math.PI * radius;
        break;
      case ShapeType.TRIANGLE:
        area = 0.5 * base * height;
        perimeter = (sideA || 0) + (sideB || 0) + (sideC || 0);
        break;
      case ShapeType.PARALLELOGRAM:
        area = base * height;
        perimeter = 2 * (base + side);
        break;
    }

    if (isNaN(area) || isNaN(perimeter)) return;

    const newResult = { area, perimeter };
    setResult(newResult);

    const calcResult: CalculationResult = {
      id: Math.random().toString(36).substr(2, 9),
      shape: selectedShape,
      inputs: { ...inputs },
      area,
      perimeter,
      timestamp: Date.now()
    };
    
    setHistory(prev => [calcResult, ...prev].slice(0, 10));

    // Get AI Insight
    setIsAiLoading(true);
    const insight = await getShapeInsight(selectedShape, area, perimeter);
    setAiInsight(insight);
    setIsAiLoading(false);
  }, [selectedShape, inputs]);

  const handleInputChange = (key: string, value: string) => {
    const num = parseFloat(value);
    setInputs(prev => ({ ...prev, [key]: isNaN(num) ? 0 : num }));
  };

  return (
    <div className="min-h-screen pb-20 overflow-x-hidden selection:bg-blue-500/30">
      {/* Header */}
      <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <i className="fa-solid fa-compass-drafting text-white text-xl"></i>
            </div>
            <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              ShapeMaster <span className="font-light text-slate-500">Pro</span>
            </h1>
          </div>
          <div className="hidden md:flex gap-6 text-sm font-medium text-slate-400">
            <span className="hover:text-blue-400 cursor-pointer transition-colors">Calculator</span>
            <span className="hover:text-blue-400 cursor-pointer transition-colors">History</span>
            <span className="hover:text-blue-400 cursor-pointer transition-colors">Documentation</span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar - Shape Selector */}
        <div className="lg:col-span-3 space-y-4">
          <h2 className="text-slate-400 text-xs font-bold uppercase tracking-widest px-1">Select Primitive</h2>
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
            {(Object.values(ShapeType) as ShapeType[]).map((type) => (
              <button
                key={type}
                onClick={() => setSelectedShape(type)}
                className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 group ${
                  selectedShape === type
                    ? 'bg-blue-600/10 border-blue-500/50 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.1)]'
                    : 'bg-slate-800/40 border-slate-700 hover:border-slate-500 text-slate-400'
                }`}
              >
                <ShapeIcon iconClass={SHAPE_CONFIGS[type].icon} size="sm" active={selectedShape === type} />
                <span className="font-semibold text-sm">{type}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Workspace */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-slate-800/30 rounded-3xl p-8 border border-slate-700/50 shadow-xl backdrop-blur-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">{selectedShape} Parameters</h2>
                <p className="text-slate-400 text-sm">Define the dimensions for the geometric analysis.</p>
              </div>
              <ShapeIcon iconClass={SHAPE_CONFIGS[selectedShape].icon} size="lg" active />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              {SHAPE_CONFIGS[selectedShape].fields.map((field) => (
                <div key={field.key} className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 ml-1">{field.label}</label>
                  <div className="relative group">
                    <input
                      type="number"
                      step="any"
                      min="0"
                      placeholder={field.placeholder}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-600"
                      onChange={(e) => handleInputChange(field.key, e.target.value)}
                      value={inputs[field.key] || ''}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-mono">UNIT</div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={calculate}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/20 transform transition-all active:scale-[0.98]"
            >
              Solve Geometry
            </button>

            {result && (
              <div className="mt-8 grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-slate-900/80 p-6 rounded-2xl border border-blue-500/30 flex flex-col items-center">
                  <span className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">Total Area</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold mono text-white">{result.area.toFixed(2)}</span>
                    <span className="text-slate-500 text-xs">sq u</span>
                  </div>
                </div>
                <div className="bg-slate-900/80 p-6 rounded-2xl border border-indigo-500/30 flex flex-col items-center">
                  <span className="text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">Perimeter</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold mono text-white">{result.perimeter.toFixed(2)}</span>
                    <span className="text-slate-500 text-xs">u</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* AI Insights Card */}
          {(aiInsight || isAiLoading) && (
            <div className="bg-slate-900/50 rounded-3xl p-8 border border-purple-500/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <i className="fa-solid fa-sparkles text-6xl text-purple-400"></i>
              </div>
              <h3 className="text-purple-400 text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                <i className="fa-solid fa-brain"></i> Geometric Insight
              </h3>
              {isAiLoading ? (
                <div className="flex flex-col gap-3">
                  <div className="h-4 bg-slate-800 rounded w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-slate-800 rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-slate-800 rounded w-5/6 animate-pulse"></div>
                </div>
              ) : (
                <div className="prose prose-invert prose-sm max-w-none text-slate-300 leading-relaxed">
                  {aiInsight.split('\n').map((line, i) => (
                    <p key={i} className="mb-2">{line}</p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column - Visualizer & History */}
        <div className="lg:col-span-3 space-y-6">
          <Visualizer type={selectedShape} inputs={inputs} />
          
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-slate-400 text-xs font-bold uppercase tracking-widest">Recent Logs</h2>
              <button 
                onClick={() => setHistory([])}
                className="text-[10px] text-slate-500 hover:text-red-400 transition-colors uppercase font-bold"
              >
                Clear All
              </button>
            </div>
            
            <div className="space-y-3">
              {history.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-slate-800 rounded-2xl">
                  <i className="fa-solid fa-clock-rotate-left text-slate-700 text-2xl mb-2"></i>
                  <p className="text-slate-600 text-xs">No records found</p>
                </div>
              ) : (
                history.map((item) => (
                  <div key={item.id} className="bg-slate-800/30 border border-slate-700/50 p-4 rounded-xl flex justify-between items-center group hover:bg-slate-800/50 transition-colors">
                    <div>
                      <h4 className="text-white text-xs font-bold">{item.shape}</h4>
                      <div className="flex gap-2 text-[10px] text-slate-500 font-mono mt-1">
                        <span>A: {item.area.toFixed(1)}</span>
                        <span>P: {item.perimeter.toFixed(1)}</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-600">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Floating Action Bar (Mobile-first persistent CTA) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 shadow-2xl flex items-center justify-between lg:hidden z-50">
         <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-blue-500/20 text-blue-400`}>
                <i className={`fa-solid ${SHAPE_CONFIGS[selectedShape].icon}`}></i>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold">Active Shape</p>
              <p className="text-sm font-bold text-white">{selectedShape}</p>
            </div>
         </div>
         <button 
            onClick={calculate}
            className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-blue-500 transition-colors"
         >
           Calculate
         </button>
      </div>
    </div>
  );
};

export default App;
