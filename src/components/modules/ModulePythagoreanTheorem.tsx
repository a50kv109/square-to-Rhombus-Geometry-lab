/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PythagoreanPantsCalculations } from '../../types/geometry.ts';
import { MetricCard } from '../common/MetricCard.tsx';
import { MathFormula } from '../common/MathFormula.tsx';

interface ModulePythagoreanTheoremProps {
  calc: PythagoreanPantsCalculations;
}

export const ModulePythagoreanTheorem: React.FC<ModulePythagoreanTheoremProps> = ({ calc }) => {
  const { squareA, squareB, triangle } = calc;
  const sumLegSquares = squareA.area + squareB.area;
  const hypSquare = triangle.c * triangle.c;

  return (
    <div className="space-y-4">
      {/* Intro info card */}
      <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-100 text-xs text-slate-700 space-y-1">
        <h4 className="font-bold text-emerald-950">Модуль 02: Теорема Пифагора</h4>
        <p>
          В прямоугольном треугольнике площадь квадрата, построенного на гипотенузе, равна сумме
          площадей квадратов, построенных на катетах: <MathFormula tex="a^2 + b^2 = c^2" />.
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <MetricCard
          label="Квадрат катета a"
          symbol="Q_a = a²"
          value={squareA.area}
          unit="кв. ед."
          highlight={true}
          accentColor="amber"
        />
        <MetricCard
          label="Квадрат катета b"
          symbol="Q_b = b²"
          value={squareB.area}
          unit="кв. ед."
          highlight={true}
          accentColor="sky"
        />
        <MetricCard
          label="Квадрат гипотенузы c"
          symbol="Q_c = c²"
          value={hypSquare}
          unit="кв. ед."
          highlight={true}
          accentColor="emerald"
        />
      </div>

      {/* Verification balance */}
      <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-2">
        <span className="font-bold text-slate-900">Баланс площадей в реальном времени:</span>
        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 font-mono text-xs">
          <div className="text-center">
            <span className="text-[10px] text-slate-400 block">Q_a + Q_b</span>
            <span className="font-bold text-slate-900">
              {squareA.area.toFixed(2)} + {squareB.area.toFixed(2)} = {sumLegSquares.toFixed(2)}
            </span>
          </div>
          <span className="text-lg font-bold text-emerald-600">≡</span>
          <div className="text-center">
            <span className="text-[10px] text-slate-400 block">Q_c</span>
            <span className="font-bold text-emerald-700">{hypSquare.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Historical insight on Euclid I.47 */}
      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-600 space-y-1.5">
        <span className="font-bold text-slate-900 block">Доказательство Евклида («Мельница»):</span>
        <p>
          Высота, опущенная из прямого угла O на гипотенузу, продолжается через квадрат Qc и делит его
          на два прямоугольника. Площадь первого прямоугольника в точности равна{' '}
          <MathFormula tex="c \cdot c_a = c \cdot (a^2/c) = a^2" />, а второго —{' '}
          <MathFormula tex="c \cdot c_b = c \cdot (b^2/c) = b^2" />.
        </p>
      </div>
    </div>
  );
};
