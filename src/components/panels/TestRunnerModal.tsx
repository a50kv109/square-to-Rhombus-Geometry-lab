/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { calculatePythagoreanPants } from '../../math/PythagoreanPants.ts';
import { validateInvariants } from '../../math/GeometryValidators.ts';
import { X, CheckCircle, ExternalLink, PlayCircle } from 'lucide-react';

interface TestRunnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadTestCase: (a: number, b: number) => void;
}

export const TestRunnerModal: React.FC<TestRunnerModalProps> = ({
  isOpen,
  onClose,
  onLoadTestCase,
}) => {
  const testCases = [
    { a: 4, b: 4, title: 'a = 4, b = 4', expected: 'Ромб превращается в точный квадрат (q = 0)' },
    { a: 4, b: 2, title: 'a = 4, b = 2', expected: 'Вертикальный катет длиннее (q = -1/3, φ_A > 90°)' },
    { a: 2, b: 4, title: 'a = 2, b = 4', expected: 'Горизонтальный катет длиннее (q = +1/3, φ_A < 90°)' },
    { a: 1, b: 10, title: 'a = 1, b = 10', expected: 'Сильная асимметрия q > 0 (q = +0.818, t = 10)' },
    { a: 10, b: 1, title: 'a = 10, b = 1', expected: 'Сильная асимметрия q < 0 (q = -0.818, t = 0.1)' },
  ];

  const testResults = useMemo(() => {
    return testCases.map((tc) => {
      const calc = calculatePythagoreanPants(tc.a, tc.b);
      const invariants = validateInvariants(calc);
      const allPassed = invariants.every((inv) => inv.isValid);
      const maxDelta = Math.max(...invariants.map((inv) => inv.delta));
      return {
        ...tc,
        calc,
        allPassed,
        maxDelta,
        invariantsCount: invariants.length,
      };
    });
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Контрольные конфигурации (Тестовая матрица Спецификации)
              </h3>
              <p className="text-xs text-slate-500">
                Автоматическая проверка инвариантов для 5 базовых тестовых состояний (Раздел 25)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-700">
                <tr>
                  <th className="py-2.5 px-3 text-left">Параметры</th>
                  <th className="py-2.5 px-3 text-left">Ожидаемое состояние</th>
                  <th className="py-2.5 px-3 text-right">t = b/a</th>
                  <th className="py-2.5 px-3 text-right">q(t)</th>
                  <th className="py-2.5 px-3 text-right">Инварианты (9/9)</th>
                  <th className="py-2.5 px-3 text-right">Макс. погрешность Δ</th>
                  <th className="py-2.5 px-3 text-center">Действие</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {testResults.map((res, i) => (
                  <tr key={i} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-3 font-sans font-bold text-slate-900">{res.title}</td>
                    <td className="py-2.5 px-3 font-sans text-slate-600">{res.expected}</td>
                    <td className="py-2.5 px-3 text-right text-slate-700">{res.calc.t.toFixed(2)}</td>
                    <td className="py-2.5 px-3 text-right text-slate-700">{res.calc.q.toFixed(3)}</td>
                    <td
                      className={`py-2.5 px-3 text-right font-bold ${
                        res.allPassed ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {res.allPassed ? `${res.invariantsCount}/${res.invariantsCount} ПРОЙДЕНО` : 'ОШИБКА'}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-500">
                      &lt; {res.maxDelta < 1e-12 ? '10⁻¹²' : res.maxDelta.toExponential(1)}
                    </td>
                    <td className="py-2.5 px-3 text-center font-sans">
                      <button
                        onClick={() => {
                          onLoadTestCase(res.a, res.b);
                          onClose();
                        }}
                        className="px-2 py-1 text-xs font-semibold rounded bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors inline-flex items-center gap-1"
                        title="Загрузить эту конфигурацию на планшет"
                      >
                        <PlayCircle className="w-3.5 h-3.5" /> На планшет
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {testResults.every((r) => r.allPassed) ? (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200/60 text-xs text-emerald-800 flex items-center justify-between">
              <span>
                ✓ Все 5 контрольных конфигураций подтвердили строгое равенство четырёх сторон,
                ортогональность диагоналей и сохранение соотношения площадей.
              </span>
            </div>
          ) : (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200/60 text-xs text-rose-800 flex items-center justify-between">
              <span>⚠ Обнаружено расхождение инвариантов в одной или нескольких конфигурациях.</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
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
