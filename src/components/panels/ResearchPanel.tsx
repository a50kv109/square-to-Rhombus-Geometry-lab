/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PythagoreanPantsCalculations, DisplayMode } from '../../types/geometry.ts';
import { Translations } from '../../i18n/translations.ts';
import { MetricCard } from '../common/MetricCard.tsx';
import { MathFormula } from '../common/MathFormula.tsx';
import { formatPoint } from '../../geometry/transforms.ts';
import {
  GraduationCap,
  FlaskConical,
  ChevronDown,
  ChevronUp,
  Info,
} from 'lucide-react';

interface ResearchPanelProps {
  calc: PythagoreanPantsCalculations;
  displayMode: DisplayMode;
  setDisplayMode: (mode: DisplayMode) => void;
  t: Translations;
}

export const ResearchPanel: React.FC<ResearchPanelProps> = ({
  calc,
  displayMode,
  setDisplayMode,
  t,
}) => {
  const [showCoordinates, setShowCoordinates] = useState(false);
  const [showLayersExplanation, setShowLayersExplanation] = useState(false);

  const { triangle, A_prime, B_prime } = calc;

  let stateTitle = t.research.symState;
  let stateDesc = t.research.symDesc;

  if (calc.q > 0.005) {
    stateTitle = t.research.horizBias;
    stateDesc = t.research.horizDesc;
  } else if (calc.q < -0.005) {
    stateTitle = t.research.vertBias;
    stateDesc = t.research.vertDesc;
  }

  // Normalized gauge position [0..100]% for q in [-1, 1]
  const qPercent = ((calc.q + 1) / 2) * 100;

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs space-y-4">
      {/* Mode Switcher */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">{t.research.title}</h2>
          <p className="text-xs text-slate-500">{t.research.subtitle}</p>
        </div>

        <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg">
          <button
            onClick={() => setDisplayMode('school')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md flex items-center gap-1 transition-colors whitespace-nowrap shrink-0 ${
              displayMode === 'school'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" /> {t.modes.school}
          </button>
          <button
            onClick={() => setDisplayMode('research')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md flex items-center gap-1 transition-colors whitespace-nowrap shrink-0 ${
              displayMode === 'research'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5" /> {t.modes.research}
          </button>
        </div>
      </div>

      {/* State & Asymmetry Gauge */}
      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/70 space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-bold text-slate-900">{stateTitle}</span>
          <span className="text-[11px] font-mono font-bold text-slate-700 tabular-nums">
            t = {calc.t.toFixed(3)} · q = {calc.q.toFixed(3)}
          </span>
        </div>
        <p className="text-xs text-slate-600">{stateDesc}</p>

        {/* Visual Asymmetry Gauge Bar q in [-1, +1] */}
        <div className="space-y-1">
          <div className="relative h-2 rounded-full bg-gradient-to-r from-amber-200 via-emerald-200 to-indigo-200">
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-emerald-600 -translate-x-1/2" />
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-slate-900 border-2 border-white shadow-xs transition-all duration-75"
              style={{ left: `${qPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-slate-400">
            <span>q → -1 (a ≫ b)</span>
            <span className="text-emerald-700 font-semibold">q = 0 (квадрат)</span>
            <span>q → +1 (b ≫ a)</span>
          </div>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      {displayMode === 'school' ? (
        <div className="grid grid-cols-2 gap-2.5">
          <MetricCard
            label="Гипотенуза (сторона ромба)"
            value={calc.sideLength}
            unit="ед."
            highlight={true}
            accentColor="indigo"
          />
          <MetricCard
            label="Периметр ромба"
            value={calc.perimeterRhombus}
            unit="ед."
            subtext="4 одинаковых стороны"
          />
          <MetricCard
            label="Угол ромба при A"
            value={calc.phiA_deg}
            unit="°"
          />
          <MetricCard
            label="Угол ромба при B"
            value={calc.phiB_deg}
            unit="°"
          />
          <MetricCard
            label="Площадь ромба"
            value={calc.areaRhombus}
            unit="кв. ед."
            highlight={true}
            accentColor="rose"
          />
          <MetricCard
            label="Квадрат на гипотенузе"
            value={calc.areaSquareHypotenuse}
            unit="кв. ед."
            subtext={`Ромб = ${(calc.etaS * 100).toFixed(1)}% от квадрата`}
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          <MetricCard
            label="Гипотенуза"
            symbol="c"
            value={calc.sideLength}
            unit="ед."
            subtext="√(a² + b²)"
            highlight={true}
            accentColor="indigo"
          />
          <MetricCard
            label="Знаковая мера"
            symbol="q(t)"
            value={calc.q}
            subtext="(t - 1) / (t + 1)"
            highlight={Math.abs(calc.q) < 0.005}
            accentColor="emerald"
          />
          <MetricCard
            label="Модуль асимметрии"
            symbol="A"
            value={calc.A}
            subtext="|q(t)|"
          />
          <MetricCard
            label="Угол при A"
            symbol="φ_A"
            value={calc.phiA_deg}
            unit="°"
            subtext="90° - arctan(q)"
          />
          <MetricCard
            label="Угол при B"
            symbol="φ_B"
            value={calc.phiB_deg}
            unit="°"
            subtext="90° + arctan(q)"
          />
          <MetricCard
            label="Угловой скос"
            symbol="Δφ"
            value={calc.deltaPhiDeg}
            unit="°"
            subtext="arctan(A)"
          />
          <MetricCard
            label="Площадь ромба"
            symbol="S_r"
            value={calc.areaRhombus}
            subtext="c(a+b)/√2"
            highlight={true}
            accentColor="rose"
          />
          <MetricCard
            label="Квадрат гипотенузы"
            symbol="S_c"
            value={calc.areaSquareHypotenuse}
            subtext="c² = a² + b²"
          />
          <MetricCard
            label="Согласованность"
            symbol="η_S"
            value={calc.etaS}
            subtext={`η_L = ${calc.etaL.toFixed(3)}`}
          />
          <MetricCard
            label="Высота ромба"
            symbol="h_r"
            value={calc.height}
            subtext="(a + b) / √2"
          />
          <MetricCard
            label="Диагональ d₁"
            symbol="AB'"
            value={calc.d1}
            subtext="2c cos(φ_A/2)"
          />
          <MetricCard
            label="Диагональ d₂"
            symbol="BA'"
            value={calc.d2}
            subtext="2c sin(φ_A/2)"
          />
        </div>
      )}

      {/* Analytical Formulas Section (Research Mode) */}
      {displayMode === 'research' && (
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-800">Аналитические формулы модели:</span>
          <div className="space-y-1.5 text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200/80 font-mono">
            <div className="flex items-center justify-between py-0.5 border-b border-slate-200/50 gap-2">
              <span className="text-slate-500">Углы ромба:</span>
              <MathFormula tex="\varphi_A = 90^\circ - \arctan q, \quad \varphi_B = 90^\circ + \arctan q" />
            </div>
            <div className="flex items-center justify-between py-0.5 border-b border-slate-200/50 gap-2">
              <span className="text-slate-500">Сумма соседних:</span>
              <MathFormula tex="\varphi_A + \varphi_B = 180^\circ" />
            </div>
            <div className="flex items-center justify-between py-0.5 border-b border-slate-200/50 gap-2">
              <span className="text-slate-500">Площадное отношение:</span>
              <MathFormula tex="\frac{S_r}{S_c} = \frac{h_r}{c} = \frac{1}{\sqrt{1 + A^2}}" />
            </div>
            <div className="flex items-center justify-between py-0.5 border-b border-slate-200/50 gap-2">
              <span className="text-slate-500">Тождество диагоналей:</span>
              <MathFormula tex="d_1^2 + d_2^2 = 4c^2, \quad \overrightarrow{AB'} \cdot \overrightarrow{BA'} = 0" />
            </div>
            <div className="flex items-center justify-between py-0.5 gap-2">
              <span className="text-slate-500">Взаимная компенсация:</span>
              <MathFormula tex="\eta_S \cdot \eta_L = 1 \quad (\eta_L = \sqrt{1 + A^2})" />
            </div>
          </div>
        </div>
      )}

      {/* Collapsible Coordinates Deck */}
      <div className="pt-2 border-t border-slate-100">
        <button
          onClick={() => setShowCoordinates(!showCoordinates)}
          className="w-full flex items-center justify-between text-xs font-semibold text-slate-700 hover:text-slate-900 py-1"
        >
          <span>Точные координаты вершин</span>
          {showCoordinates ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showCoordinates && (
          <div className="grid grid-cols-2 gap-2 mt-2 p-2.5 bg-slate-50 rounded-lg text-xs font-mono border border-slate-200/70">
            <div>O = {formatPoint(triangle.O)}</div>
            <div>A = {formatPoint(triangle.A)}</div>
            <div>B = {formatPoint(triangle.B)}</div>
            <div>A' = {formatPoint(A_prime)}</div>
            <div>B' = {formatPoint(B_prime)}</div>
            <div>C_a = {formatPoint(calc.squareA.outerVertex)}</div>
            <div>D_a = {formatPoint(calc.squareA.baseVertex)}</div>
            <div>C_b = {formatPoint(calc.squareB.outerVertex)}</div>
          </div>
        )}
      </div>

      {/* Collapsible 3-Layer Structural Architecture */}
      <div className="pt-2 border-t border-slate-100">
        <button
          onClick={() => setShowLayersExplanation(!showLayersExplanation)}
          className="w-full flex items-center justify-between text-xs font-semibold text-slate-700 hover:text-slate-900 py-1"
        >
          <span className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-indigo-500" />
            3 архитектурных слоя модели (L1, L2, L3)
          </span>
          {showLayersExplanation ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showLayersExplanation && (
          <div className="mt-2 space-y-2 text-xs text-slate-600 bg-indigo-50/40 p-3 rounded-lg border border-indigo-100">
            <div>
              <strong className="text-slate-900 font-semibold">Слой L1 (База):</strong> Прямоугольный
              треугольник OAB и внешние квадраты Qa, Qb на катетах.
            </div>
            <div>
              <strong className="text-slate-900 font-semibold">Слой L2 (Направляющий механизм):</strong>{' '}
              Диагонали DaA и DbB внешних квадратов строго сонаправлены под углом +45°, задавая единый орт
              e = (1/√2, 1/√2).
            </div>
            <div>
              <strong className="text-slate-900 font-semibold">Слой L3 (Замыкающее правило L = c):</strong>{' '}
              Откладывание от A и B отрезков длиной ровно c вдоль орта e детерминированно образует строгий
              ромб ABB'A'. При свободном L получалось бы семейство параллелограммов.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
