/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { PythagoreanPantsCalculations } from '../../types/geometry.ts';
import { validateInvariants } from '../../math/GeometryValidators.ts';
import { MathFormula } from '../common/MathFormula.tsx';
import confetti from 'canvas-confetti';
import { ShieldCheck, CheckCircle2, Award, AlertTriangle } from 'lucide-react';

interface InvariantsPanelProps {
  calc: PythagoreanPantsCalculations;
}

export const InvariantsPanel: React.FC<InvariantsPanelProps> = ({ calc }) => {
  const invariants = useMemo(() => validateInvariants(calc), [calc]);

  const passedCount = invariants.filter((inv) => inv.isValid).length;
  const allPassed = passedCount === invariants.length;

  const handleCelebrate = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className={`w-4 h-4 ${allPassed ? 'text-emerald-600' : 'text-rose-600'}`} />
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            Проверка математических инвариантов
          </h3>
        </div>

        <button
          onClick={handleCelebrate}
          className={`text-xs font-semibold px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 ${
            allPassed
              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
          }`}
          title="Все инварианты проверены с относительным допуском 10⁻⁹"
        >
          <Award className="w-3.5 h-3.5" /> {passedCount} из {invariants.length} соблюдены
        </button>
      </div>

      <p className="text-xs text-slate-500">
        Численная верификация абсолютных геометрических инвариантов конструкции в реальном времени:
      </p>

      {/* Invariants list */}
      <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
        {invariants.map((inv) => (
          <div
            key={inv.id}
            className="p-2.5 rounded-lg border border-slate-200/80 bg-slate-50/70 hover:bg-white transition-colors space-y-1.5"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-0.5 min-w-0 flex-1">
                <span className="text-xs font-bold text-slate-800">{inv.name}</span>
                <div className="text-xs text-indigo-700 max-w-full overflow-x-auto">
                  <MathFormula tex={inv.formula} />
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded border font-semibold ${
                    inv.isValid
                      ? 'text-emerald-700 bg-emerald-50 border-emerald-200/60'
                      : 'text-rose-700 bg-rose-50 border-rose-200/60'
                  }`}
                >
                  {Number.isFinite(inv.delta)
                    ? inv.delta < 1e-12
                      ? 'Δ < 10⁻¹²'
                      : `Δ = ${inv.delta.toExponential(1)}`
                    : `Δ = ${String(inv.delta)}`}
                </span>
                {inv.isValid ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                )}
              </div>
            </div>

            <p className="text-[11px] text-slate-500">{inv.description}</p>

            <div className="flex items-center justify-between text-[11px] font-mono pt-1 border-t border-slate-200/50 text-slate-600">
              <span>Расчёт: {inv.calculatedValue}</span>
              <span>Ожидание: {inv.expectedValue}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
