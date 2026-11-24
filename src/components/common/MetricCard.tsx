/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface MetricCardProps {
  label: string;
  symbol?: string;
  value: string | number;
  unit?: string;
  subtext?: string;
  highlight?: boolean;
  accentColor?: 'indigo' | 'emerald' | 'amber' | 'sky' | 'rose' | 'slate';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  symbol,
  value,
  unit,
  subtext,
  highlight = false,
  accentColor = 'indigo',
}) => {
  const accentColors = {
    indigo: 'border-indigo-200 bg-indigo-50/40 text-indigo-900',
    emerald: 'border-emerald-200 bg-emerald-50/40 text-emerald-900',
    amber: 'border-amber-200 bg-amber-50/40 text-amber-900',
    sky: 'border-sky-200 bg-sky-50/40 text-sky-900',
    rose: 'border-rose-200 bg-rose-50/40 text-rose-900',
    slate: 'border-slate-200 bg-slate-50/60 text-slate-800',
  };

  return (
    <div
      className={`p-3 rounded-lg border transition-all ${
        highlight
          ? accentColors[accentColor]
          : 'border-slate-200 bg-white shadow-xs hover:border-slate-300'
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="text-xs font-medium text-slate-500 truncate">{label}</span>
        {symbol && (
          <span className="text-xs font-mono font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
            {symbol}
          </span>
        )}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-lg font-bold font-mono tracking-tight tabular-nums text-slate-900">
          {typeof value === 'number' ? value.toFixed(3) : value}
        </span>
        {unit && <span className="text-xs text-slate-400 font-mono">{unit}</span>}
      </div>
      {subtext && <div className="text-[11px] text-slate-500 mt-1 truncate">{subtext}</div>}
    </div>
  );
};
