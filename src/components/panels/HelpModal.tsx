/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, BookOpen, Layers, CheckCircle2 } from 'lucide-react';
import { MathFormula } from '../common/MathFormula.tsx';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Справка: Лаборатория и авторская модель «Пифагоровы штаны»
              </h3>
              <p className="text-xs text-slate-500">
                Геометрический принцип детерминированного построения ромба на гипотенузе
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
        <div className="p-6 space-y-4 overflow-y-auto text-xs text-slate-700 leading-relaxed">
          <section className="space-y-1.5">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-indigo-600" />
              Принцип построения: 3 независимых слоя
            </h4>
            <p>
              Конструкция не добавляет произвольный параллелограмм к гипотенузе, а является строгим
              результатом сочетания двух механизмов:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-slate-600">
              <li>
                <strong>Слой L1 (База):</strong> Прямоугольный треугольник <MathFormula tex="OAB" /> с катетами{' '}
                <MathFormula tex="a" /> и <MathFormula tex="b" />, а также внешние квадраты{' '}
                <MathFormula tex="Q_a" /> и <MathFormula tex="Q_b" /> на катетах.
              </li>
              <li>
                <strong>Слой L2 (Порождающий механизм направлений):</strong> Диагонали квадратов{' '}
                <MathFormula tex="D_a A = (a, a)" /> и <MathFormula tex="D_b B = (b, b)" /> автоматически
                параллельны и задают единый инвариантный орт <MathFormula tex="\vec{e} = (1/\sqrt{2}, 1/\sqrt{2})" /> под
                углом строго <strong>+45°</strong>.
              </li>
              <li>
                <strong>Слой L3 (Замыкающее правило масштаба):</strong> От вершин A и B откладываются отрезки
                длиной ровно <MathFormula tex="c" /> вдоль орта <MathFormula tex="\vec{e}" />. Это однозначно
                выделяет <strong>строгий ромб</strong> <MathFormula tex="ABB'A'" /> среди семейства параллелограммов.
              </li>
            </ul>
          </section>

          <section className="space-y-1.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200/70">
            <h4 className="font-bold text-slate-900">Формулы углов и асимметрии:</h4>
            <p>
              Отношение катетов <MathFormula tex="t = b/a" />. Знаковая мера асимметрии:
            </p>
            <div className="py-1 font-mono text-center">
              <MathFormula tex="q(t) = \frac{t - 1}{t + 1} = \frac{b - a}{a + b}" />
            </div>
            <p>
              Внутренние углы ромба выражаются строго через <MathFormula tex="q" />:
            </p>
            <div className="py-1 font-mono text-center">
              <MathFormula tex="\varphi_A = 90^\circ - \arctan q, \quad \varphi_B = 90^\circ + \arctan q" />
            </div>
            <p>
              При <MathFormula tex="a = b" /> (<MathFormula tex="t = 1, q = 0" />) все углы равны 90°, и ромб становится
              идеальным квадратом на гипотенузе!
            </p>
          </section>

          <section className="space-y-1.5">
            <h4 className="font-bold text-slate-900">Инварианты, сохраняющиеся при любом изменении катетов:</h4>
            <div className="space-y-1 text-slate-600">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Все 4 стороны равны гипотенузе c (<MathFormula tex="AB = BB' = B'A' = A'A = c" />).</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Диагонали ромба взаимно перпендикулярны (<MathFormula tex="d_1 \perp d_2" />).</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Тождество параллелограмма: <MathFormula tex="d_1^2 + d_2^2 = 4c^2" />.</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>
                  Связь площадей и высоты: <MathFormula tex="S_r / S_c = h_r / c = \eta_S = 1/\sqrt{1 + A^2}" />.
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors"
          >
            Понятно
          </button>
        </div>
      </div>
    </div>
  );
};
