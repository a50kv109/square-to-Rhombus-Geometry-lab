/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PythagoreanPantsCalculations } from '../../types/geometry.ts';
import { calculatePythagoreanPants } from '../../math/PythagoreanPants.ts';
import { X, ArrowLeftRight, BookmarkPlus } from 'lucide-react';

interface ComparisonModalProps {
  currentCalc: PythagoreanPantsCalculations;
  isOpen: boolean;
  onClose: () => void;
  onApplyConfig: (a: number, b: number) => void;
}

const MiniPantsPreview: React.FC<{ calc: PythagoreanPantsCalculations; label: string; accent: string }> = ({
  calc,
  label,
  accent,
}) => {
  const minX = -calc.triangle.a - 0.8;
  const maxX = calc.B_prime.x + 0.8;
  const minY = -calc.triangle.b - 0.8;
  const maxY = calc.A_prime.y + 0.8;
  const span = Math.max(maxX - minX, maxY - minY, 6);
  const scale = 150 / span;

  const ox = 85 - ((minX + maxX) / 2) * scale;
  const oy = 85 + ((minY + maxY) / 2) * scale;
  const p = (pt: { x: number; y: number }) => `${ox + pt.x * scale},${oy - pt.y * scale}`;

  return (
    <div className="flex-1 bg-slate-50 rounded-xl border border-slate-200 p-2.5 flex flex-col items-center">
      <span className={`text-[11px] font-bold mb-1 ${accent}`}>{label}</span>
      <svg viewBox="0 0 170 170" className="w-36 h-36 bg-white rounded-lg border border-slate-100">
        {/* Square Qa */}
        <polygon
          points={`${p(calc.squareA.O)} ${p(calc.squareA.legVertex)} ${p(calc.squareA.outerVertex)} ${p(calc.squareA.baseVertex)}`}
          fill="#f59e0b"
          fillOpacity="0.14"
          stroke="#d97706"
          strokeWidth="1.2"
        />
        {/* Square Qb */}
        <polygon
          points={`${p(calc.squareB.O)} ${p(calc.squareB.legVertex)} ${p(calc.squareB.outerVertex)} ${p(calc.squareB.baseVertex)}`}
          fill="#f59e0b"
          fillOpacity="0.14"
          stroke="#d97706"
          strokeWidth="1.2"
        />
        {/* Rhombus */}
        <polygon
          points={`${p(calc.triangle.A)} ${p(calc.triangle.B)} ${p(calc.B_prime)} ${p(calc.A_prime)}`}
          fill="#8b5cf6"
          fillOpacity="0.18"
          stroke="#7c3aed"
          strokeWidth="1.5"
        />
        {/* Triangle */}
        <polygon
          points={`${p(calc.triangle.O)} ${p(calc.triangle.A)} ${p(calc.triangle.B)}`}
          fill="#3b82f6"
          fillOpacity="0.2"
          stroke="#2563eb"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
};

export const ComparisonModal: React.FC<ComparisonModalProps> = ({
  currentCalc,
  isOpen,
  onClose,
  onApplyConfig,
}) => {
  const [savedConfig, setSavedConfig] = useState<{ a: number; b: number }>({
    a: 4,
    b: 4,
  });

  if (!isOpen) return null;

  const config1 = calculatePythagoreanPants(savedConfig.a, savedConfig.b);
  const config2 = currentCalc;

  const handleCaptureCurrent = () => {
    setSavedConfig({
      a: currentCalc.triangle.a,
      b: currentCalc.triangle.b,
    });
  };

  const metricsToCompare = [
    { label: 'Катет a', v1: config1.triangle.a.toFixed(2), v2: config2.triangle.a.toFixed(2) },
    { label: 'Катет b', v1: config1.triangle.b.toFixed(2), v2: config2.triangle.b.toFixed(2) },
    { label: 'Гипотенуза c', v1: config1.sideLength.toFixed(3), v2: config2.sideLength.toFixed(3) },
    { label: 'Отношение t = b/a', v1: config1.t.toFixed(3), v2: config2.t.toFixed(3) },
    { label: 'Асимметрия q', v1: config1.q.toFixed(4), v2: config2.q.toFixed(4) },
    { label: 'Модуль A = |q|', v1: config1.A.toFixed(4), v2: config2.A.toFixed(4) },
    { label: 'Угол φ_A', v1: `${config1.phiA_deg.toFixed(2)}°`, v2: `${config2.phiA_deg.toFixed(2)}°` },
    { label: 'Угол φ_B', v1: `${config1.phiB_deg.toFixed(2)}°`, v2: `${config2.phiB_deg.toFixed(2)}°` },
    { label: 'Площадь ромба Sr', v1: config1.areaRhombus.toFixed(3), v2: config2.areaRhombus.toFixed(3) },
    { label: 'Квадрат гипотенузы Sc', v1: config1.areaSquareHypotenuse.toFixed(3), v2: config2.areaSquareHypotenuse.toFixed(3) },
    { label: 'Отношение η_S = Sr/Sc', v1: config1.etaS.toFixed(4), v2: config2.etaS.toFixed(4) },
    { label: 'Диагональ d₁', v1: config1.d1.toFixed(3), v2: config2.d1.toFixed(3) },
    { label: 'Диагональ d₂', v1: config1.d2.toFixed(3), v2: config2.d2.toFixed(3) },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
          <div>
            <h3 className="text-base font-bold text-slate-900">Сравнение геометрических конфигураций</h3>
            <p className="text-xs text-slate-500">
              Визуальное и численное сопоставление зафиксированного эталона и текущей модели
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <button
              onClick={handleCaptureCurrent}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors flex items-center gap-1.5"
            >
              <BookmarkPlus className="w-4 h-4" /> Зафиксировать текущее в Конфигурацию 1
            </button>

            <button
              onClick={() => onApplyConfig(savedConfig.a, savedConfig.b)}
              className="px-3 py-1.5 text-xs font-medium rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" /> Загрузить Конфигурацию 1 на планшет
            </button>
          </div>

          {/* Side-by-side miniature SVG geometric previews */}
          <div className="flex flex-col sm:flex-row gap-3">
            <MiniPantsPreview
              calc={config1}
              label={`Конфигурация 1 (a=${savedConfig.a}, b=${savedConfig.b})`}
              accent="text-slate-700"
            />
            <MiniPantsPreview
              calc={config2}
              label={`Конфигурация 2 (a=${config2.triangle.a}, b=${config2.triangle.b})`}
              accent="text-indigo-700"
            />
          </div>

          {/* Comparison Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-700">
                <tr>
                  <th className="py-2 px-4 text-left">Параметр</th>
                  <th className="py-2 px-4 text-right bg-slate-100/50">
                    Конф. 1 (t={config1.t.toFixed(2)})
                  </th>
                  <th className="py-2 px-4 text-right text-indigo-700 bg-indigo-50/40">
                    Конф. 2 (t={config2.t.toFixed(2)})
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono tabular-nums">
                {metricsToCompare.map((m, i) => (
                  <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-1.5 px-4 font-sans font-medium text-slate-700">{m.label}</td>
                    <td className="py-1.5 px-4 text-right text-slate-600 bg-slate-50/30">{m.v1}</td>
                    <td className="py-1.5 px-4 text-right font-bold text-indigo-900 bg-indigo-50/20">{m.v2}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
