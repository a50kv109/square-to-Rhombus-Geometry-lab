/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PresetConfiguration } from '../types/geometry.ts';

export const BENCHMARK_PRESETS: PresetConfiguration[] = [
  {
    id: 'sym_4_4',
    title: 'a = 4, b = 4 (Симметрия)',
    description: 't = 1.0, q = 0. Ромб вырождается в идеальный квадрат на гипотенузе, все углы 90°.',
    a: 4,
    b: 4,
    category: 'symmetry',
  },
  {
    id: 'vert_4_2',
    title: 'a = 4, b = 2 (Вертикальный перевес)',
    description: 't = 0.5, q = -0.333. Вертикальный катет длиннее, угол φ_A тупой, φ_B острый.',
    a: 4,
    b: 2,
    category: 'benchmark',
  },
  {
    id: 'horiz_2_4',
    title: 'a = 2, b = 4 (Горизонтальный перевес)',
    description: 't = 2.0, q = +0.333. Горизонтальный катет длиннее, угол φ_A острый, φ_B тупой.',
    a: 2,
    b: 4,
    category: 'benchmark',
  },
  {
    id: 'extreme_1_10',
    title: 'a = 1, b = 10 (Экстремальная асимметрия q > 0)',
    description: 't = 10.0, q = +0.818. Горизонтальное вытягивание, скос углов Δφ ≈ 39.3°.',
    a: 1,
    b: 10,
    category: 'extreme',
  },
  {
    id: 'extreme_10_1',
    title: 'a = 10, b = 1 (Экстремальная асимметрия q < 0)',
    description: 't = 0.1, q = -0.818. Вертикальное вытягивание, зеркальная угловая конфигурация.',
    a: 10,
    b: 1,
    category: 'extreme',
  },
  {
    id: 'classic_egyptian',
    title: 'a = 4, b = 3 (Египетский треугольник)',
    description: 'Катеты 4 и 3, гипотенуза ровно 5.0. Классический античный треугольник.',
    a: 4,
    b: 3,
    category: 'classical',
  },
  {
    id: 'classic_5_12_13',
    title: 'a = 5, b = 12 (Пифагорова тройка 5-12-13)',
    description: 'c = 13.0, целые стороны, t = 2.4, демонстрация сохранения инвариантов.',
    a: 5,
    b: 12,
    category: 'classical',
  },
  {
    id: 'classic_30_60',
    title: 'a = 3, b = 5.196 (Углы 30° / 60°)',
    description: 'Катеты в отношении 1 : √3. Углы треугольника 30° и 60°, c = 6.0.',
    a: 3,
    b: 3 * Math.sqrt(3),
    category: 'classical',
  },
];
