/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PythagoreanPantsCalculations } from '../../types/geometry.ts';
import { MathFormula } from '../common/MathFormula.tsx';
import { TrendingUp, Activity } from 'lucide-react';

interface ModuleExperimentsProps {
  calc: PythagoreanPantsCalculations;
  onSetBoth: (newA: number, newB: number) => void;
}

export const ModuleExperiments: React.FC<ModuleExperimentsProps> = ({ calc, onSetBoth }) => {
  // Generate curve points for t from 0.1 to 5.0
  const chartWidth = 500;
  const chartHeight = 180;
  const padding = { left: 40, right: 20, top: 20, bottom: 30 };

  const plotW = chartWidth - padding.left - padding.right;
  const plotH = chartHeight - padding.top - padding.bottom;

  // t range: 0.1 to 5.0
  const tMin = 0.1;
  const tMax = 5.0;

  // Function mappings to SVG:
  // x: log scale or linear scale? Let's use linear t from 0.1 to 5.0
  const tToX = (t: number) => padding.left + ((t - tMin) / (tMax - tMin)) * plotW;
  // y ranges: from -1.0 to +1.0
  const yToScreen = (yVal: number) => padding.top + plotH * (1 - (yVal - (-1)) / 2);

  // Compute curve points for q(t) = (t - 1)/(t + 1)
  const qPoints: string[] = [];
  const aPoints: string[] = [];
  const etaPoints: string[] = [];

  for (let t = tMin; t <= tMax; t += 0.05) {
    const qVal = (t - 1) / (t + 1);
    const aVal = Math.abs(qVal);
    const etaVal = 1 / Math.sqrt(1 + aVal * aVal);

    const x = tToX(t);
    qPoints.push(`${x},${yToScreen(qVal)}`);
    aPoints.push(`${x},${yToScreen(aVal)}`);
    etaPoints.push(`${x},${yToScreen(etaVal)}`);
  }

  // Current position marker on chart
  const currentT = Math.min(tMax, Math.max(tMin, calc.t));
  const currentMarkerX = tToX(currentT);
  const currentMarkerY_q = yToScreen(calc.q);
  const currentMarkerY_eta = yToScreen(calc.etaS);

  return (
    <div className="space-y-4">
      {/* Intro info card */}
      <div className="p-3.5 bg-purple-50/60 rounded-xl border border-purple-100 text-xs text-slate-700 space-y-1">
        <h4 className="font-bold text-purple-950 flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-purple-600" />
          Модуль 04: Исследование функций асимметрии и инвариантов
        </h4>
        <p>
          Динамический анализ безразмерных функций: знаковой меры <MathFormula tex="q(t)" />, модульной
          меры <MathFormula tex="A(t) = |q|" /> и площадной согласованности{' '}
          <MathFormula tex="\eta_S(t) = S_r / S_c = 1/\sqrt{1 + A^2}" />.
        </p>
      </div>

      {/* SVG Interactive Curves Chart */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-900 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            Графики функций от отношения катетов t = b/a:
          </span>
          <div className="flex items-center gap-3 text-[11px] font-mono">
            <span className="flex items-center gap-1 text-indigo-600">
              <span className="w-2.5 h-0.5 bg-indigo-600 inline-block" /> q(t)
            </span>
            <span className="flex items-center gap-1 text-amber-600">
              <span className="w-2.5 h-0.5 bg-amber-600 inline-block" /> A(t) = |q|
            </span>
            <span className="flex items-center gap-1 text-emerald-600">
              <span className="w-2.5 h-0.5 bg-emerald-600 inline-block" /> η_S(t)
            </span>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-44 select-none">
            {/* Grid and zero line */}
            <line
              x1={padding.left}
              y1={yToScreen(0)}
              x2={chartWidth - padding.right}
              y2={yToScreen(0)}
              stroke="#94a3b8"
              strokeWidth="1"
            />
            <line
              x1={tToX(1.0)}
              y1={padding.top}
              x2={tToX(1.0)}
              y2={chartHeight - padding.bottom}
              stroke="#cbd5e1"
              strokeWidth="1"
              strokeDasharray="3,3"
            />
            <text
              x={tToX(1.0)}
              y={chartHeight - padding.bottom + 14}
              textAnchor="middle"
              className="text-[10px] font-mono fill-slate-500"
            >
              t = 1
            </text>

            {/* Y axis labels */}
            <text x={padding.left - 6} y={yToScreen(1.0) + 4} textAnchor="end" className="text-[10px] font-mono fill-slate-400">
              +1.0
            </text>
            <text x={padding.left - 6} y={yToScreen(0) + 4} textAnchor="end" className="text-[10px] font-mono fill-slate-400">
              0.0
            </text>
            <text x={padding.left - 6} y={yToScreen(-1.0) + 4} textAnchor="end" className="text-[10px] font-mono fill-slate-400">
              -1.0
            </text>

            {/* Curve q(t) */}
            <polyline
              points={qPoints.join(' ')}
              fill="none"
              stroke="#4f46e5"
              strokeWidth="2"
            />

            {/* Curve A(t) */}
            <polyline
              points={aPoints.join(' ')}
              fill="none"
              stroke="#d97706"
              strokeWidth="1.5"
              strokeDasharray="4,2"
            />

            {/* Curve etaS(t) */}
            <polyline
              points={etaPoints.join(' ')}
              fill="none"
              stroke="#059669"
              strokeWidth="2"
            />

            {/* Current marker vertical tracking line */}
            <line
              x1={currentMarkerX}
              y1={padding.top}
              x2={currentMarkerX}
              y2={chartHeight - padding.bottom}
              stroke="#ec4899"
              strokeWidth="1.5"
            />

            {/* Dots for current position */}
            <circle cx={currentMarkerX} cy={currentMarkerY_q} r="4" fill="#4f46e5" stroke="#ffffff" strokeWidth="1.5" />
            <circle cx={currentMarkerX} cy={currentMarkerY_eta} r="4" fill="#059669" stroke="#ffffff" strokeWidth="1.5" />
          </svg>
        </div>

        <div className="flex items-center justify-between text-xs font-mono text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
          <span>Текущая точка: t = {calc.t.toFixed(3)}</span>
          <span className="text-indigo-700 font-bold">q = {calc.q.toFixed(4)}</span>
          <span className="text-amber-700 font-bold">A = {calc.A.toFixed(4)}</span>
          <span className="text-emerald-700 font-bold">η_S = {calc.etaS.toFixed(4)}</span>
        </div>
      </div>

      {/* Experimental Test Benchmarks table */}
      <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-2">
        <span className="font-bold text-slate-900 block">
          Эталонные точки отношения катетов:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {[
            { a: 10, b: 1, label: 't = 0.1', desc: 'q = -0.818' },
            { a: 4, b: 2, label: 't = 0.5', desc: 'q = -0.333' },
            { a: 4, b: 4, label: 't = 1.0', desc: 'q = 0.000 (Симметрия)' },
            { a: 2, b: 4, label: 't = 2.0', desc: 'q = +0.333' },
            { a: 1, b: 10, label: 't = 10.0', desc: 'q = +0.818' },
          ].map((pt, idx) => (
            <button
              key={idx}
              onClick={() => onSetBoth(pt.a, pt.b)}
              className="p-2 rounded-lg bg-slate-50 hover:bg-indigo-50 border border-slate-200/80 hover:border-indigo-200 text-left transition-colors"
            >
              <div className="font-bold font-mono text-slate-900">{pt.label}</div>
              <div className="text-[10px] text-slate-500 font-mono">{pt.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
