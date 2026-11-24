/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PythagoreanPantsCalculations } from '../../types/geometry.ts';
import { MetricCard } from '../common/MetricCard.tsx';
import { MathFormula } from '../common/MathFormula.tsx';

interface ModuleRightTriangleProps {
  calc: PythagoreanPantsCalculations;
}

export const ModuleRightTriangle: React.FC<ModuleRightTriangleProps> = ({ calc }) => {
  const { triangle } = calc;

  return (
    <div className="space-y-4">
      {/* Intro info card */}
      <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-slate-700 space-y-1">
        <h4 className="font-bold text-blue-900">Модуль 01: Прямоугольный треугольник OAB</h4>
        <p>
          Исследование метрических соотношений, углов, высоты и проекций катетов на гипотенузу.
          Вершина <strong>O(0,0)</strong> фиксирует прямой угол 90°.
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        <MetricCard label="Катет a (OA)" symbol="a" value={triangle.a} unit="ед." />
        <MetricCard label="Катет b (OB)" symbol="b" value={triangle.b} unit="ед." />
        <MetricCard
          label="Гипотенуза c (AB)"
          symbol="c"
          value={triangle.c}
          unit="ед."
          highlight={true}
          accentColor="indigo"
        />
        <MetricCard
          label="Угол α при A"
          symbol="α"
          value={triangle.alphaDeg}
          unit="°"
          subtext="arctan(b/a)"
        />
        <MetricCard
          label="Угол β при B"
          symbol="β"
          value={triangle.betaDeg}
          unit="°"
          subtext="arctan(a/b)"
        />
        <MetricCard
          label="Высота к гипотенузе"
          symbol="h_c"
          value={triangle.altitude}
          unit="ед."
          subtext="ab / c"
        />
        <MetricCard
          label="Проекция a на гипотенузу"
          symbol="c_a"
          value={triangle.projectionA}
          unit="ед."
          subtext="a² / c"
        />
        <MetricCard
          label="Проекция b на гипотенузу"
          symbol="c_b"
          value={triangle.projectionB}
          unit="ед."
          subtext="b² / c"
        />
        <MetricCard
          label="Площадь треугольника"
          symbol="S_Δ"
          value={triangle.area}
          unit="кв. ед."
          subtext="ab / 2"
        />
      </div>

      {/* Trigonometric ratios */}
      <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-2">
        <span className="font-bold text-slate-900">Тригонометрические соотношения:</span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-[11px] text-slate-700">
          <div className="p-2 bg-slate-50 rounded border border-slate-100">
            <MathFormula tex="\sin\alpha = \frac{b}{c} = " /> {(triangle.b / triangle.c).toFixed(3)}
          </div>
          <div className="p-2 bg-slate-50 rounded border border-slate-100">
            <MathFormula tex="\cos\alpha = \frac{a}{c} = " /> {(triangle.a / triangle.c).toFixed(3)}
          </div>
          <div className="p-2 bg-slate-50 rounded border border-slate-100">
            <MathFormula tex="\tan\alpha = \frac{b}{a} = " /> {(triangle.b / triangle.a).toFixed(3)}
          </div>
        </div>
      </div>
    </div>
  );
};
