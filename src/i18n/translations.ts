/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type LanguageCode = 'ru' | 'uk' | 'en';

export interface Translations {
  brandTitle: string;
  modules: {
    triangle: string;
    pythagoras: string;
    pants: string;
    experiments: string;
  };
  actions: {
    compare: string;
    tests: string;
    help: string;
    undo: string;
    redo: string;
    reset: string;
    save: string;
    load: string;
    snapshotPng: string;
    snapshotSvg: string;
    buildAnim: string;
    expandBoard: string;
    showPanel: string;
  };
  modes: {
    school: string;
    research: string;
  };
  board: {
    layers: string;
    all: string;
    l1: string;
    l2: string;
    l3: string;
    grid: string;
    labels: string;
    angles: string;
    altitude: string;
    compareSc: string;
    proofEuclid: string;
    proofBhaskara: string;
    dragHint: string;
    hoverDefault: string;
  };
  research: {
    title: string;
    subtitle: string;
    symState: string;
    horizBias: string;
    vertBias: string;
    symDesc: string;
    horizDesc: string;
    vertDesc: string;
  };
}

export const TRANSLATIONS: Record<LanguageCode, Translations> = {
  ru: {
    brandTitle: 'Pythagoras Geometry Lab',
    modules: {
      triangle: '01. Треугольник',
      pythagoras: '02. Теорема Пифагора',
      pants: '03. «Пифагоровы штаны»',
      experiments: '04. Эксперименты',
    },
    actions: {
      compare: 'Сравнить',
      tests: 'Тесты 9/9',
      help: 'Справка',
      undo: 'Отменить',
      redo: 'Вернуть',
      reset: 'Сброс',
      save: 'Сохранить',
      load: 'Загрузить',
      snapshotPng: 'Снимок PNG',
      snapshotSvg: 'SVG',
      buildAnim: 'Пошагово L1→L3',
      expandBoard: 'Скрыть панель',
      showPanel: 'Показать панель',
    },
    modes: {
      school: 'Школьный',
      research: 'Исследовательский',
    },
    board: {
      layers: 'Слои:',
      all: 'Все',
      l1: 'L1 База',
      l2: 'L2 Орт 45°',
      l3: 'L3 Ромб (L=c)',
      grid: 'Сетка',
      labels: 'Метки',
      angles: 'Углы',
      altitude: 'Высота',
      compareSc: 'Сравнить с Sc',
      proofEuclid: 'Евклид (Мельница)',
      proofBhaskara: 'Разложение (a+b)²',
      dragHint: 'Тяните A по вертикали или B по горизонтали · Прокрутка для зума',
      hoverDefault: 'Наведите на вершину или сторону для инспекции',
    },
    research: {
      title: 'Исследовательские данные',
      subtitle: 'Аналитические метрики в реальном времени',
      symState: 'Симметричное состояние',
      horizBias: 'Горизонтальный перевес (b > a)',
      vertBias: 'Вертикальный перевес (a > b)',
      symDesc: 'Катеты равны (a = b). Ромб является идеальным квадратом, все углы 90°.',
      horizDesc: 'Горизонтальный катет длиннее. Угол φ_A острый, угол φ_B тупой.',
      vertDesc: 'Вертикальный катет длиннее. Угол φ_A тупой, угол φ_B острый.',
    },
  },
  uk: {
    brandTitle: 'Pythagoras Geometry Lab',
    modules: {
      triangle: '01. Трикутник',
      pythagoras: '02. Теорема Піфагора',
      pants: '03. «Піфагорові штани»',
      experiments: '04. Експерименти',
    },
    actions: {
      compare: 'Порівняти',
      tests: 'Тести 9/9',
      help: 'Довідка',
      undo: 'Скасувати',
      redo: 'Повернути',
      reset: 'Скидання',
      save: 'Зберегти',
      load: 'Завантажити',
      snapshotPng: 'Знімок PNG',
      snapshotSvg: 'SVG',
      buildAnim: 'Покроково L1→L3',
      expandBoard: 'Сховати панель',
      showPanel: 'Показати панель',
    },
    modes: {
      school: 'Шкільний',
      research: 'Дослідницький',
    },
    board: {
      layers: 'Шари:',
      all: 'Усі',
      l1: 'L1 База',
      l2: 'L2 Орт 45°',
      l3: 'L3 Ромб (L=c)',
      grid: 'Сітка',
      labels: 'Позначки',
      angles: 'Кути',
      altitude: 'Висота',
      compareSc: 'Порівняти з Sc',
      proofEuclid: 'Евклід (Млин)',
      proofBhaskara: 'Розкладання (a+b)²',
      dragHint: 'Тягніть A по вертикалі або B по горизонталі · Прокрутка для зуму',
      hoverDefault: 'Наведіть на вершину або сторону для інспекції',
    },
    research: {
      title: 'Дослідницькі дані',
      subtitle: 'Аналітичні метрики в реальному часі',
      symState: 'Симетричний стан',
      horizBias: 'Горизонтальна перевага (b > a)',
      vertBias: 'Вертикальна перевага (a > b)',
      symDesc: 'Катети рівні (a = b). Ромб є ідеальним квадратом, усі кути 90°.',
      horizDesc: 'Горизонтальний катет довший. Кут φ_A гострий, кут φ_B тупий.',
      vertDesc: 'Вертикальний катет довший. Кут φ_A тупий, кут φ_B гострий.',
    },
  },
  en: {
    brandTitle: 'Pythagoras Geometry Lab',
    modules: {
      triangle: '01. Right Triangle',
      pythagoras: '02. Pythagorean Theorem',
      pants: '03. Pythagorean Pants',
      experiments: '04. Experiments',
    },
    actions: {
      compare: 'Compare',
      tests: 'Tests 9/9',
      help: 'Help',
      undo: 'Undo',
      redo: 'Redo',
      reset: 'Reset',
      save: 'Save',
      load: 'Load',
      snapshotPng: 'Snapshot PNG',
      snapshotSvg: 'SVG',
      buildAnim: 'Step Build L1→L3',
      expandBoard: 'Hide Panel',
      showPanel: 'Show Panel',
    },
    modes: {
      school: 'School',
      research: 'Research',
    },
    board: {
      layers: 'Layers:',
      all: 'All',
      l1: 'L1 Base',
      l2: 'L2 Unit 45°',
      l3: 'L3 Rhombus (L=c)',
      grid: 'Grid',
      labels: 'Labels',
      angles: 'Angles',
      altitude: 'Altitude',
      compareSc: 'Compare w/ Sc',
      proofEuclid: 'Euclid (Windmill)',
      proofBhaskara: 'Dissection (a+b)²',
      dragHint: 'Drag A vertically or B horizontally · Scroll to zoom',
      hoverDefault: 'Hover any vertex or segment to inspect',
    },
    research: {
      title: 'Research Data',
      subtitle: 'Real-time analytical metrics',
      symState: 'Symmetric State',
      horizBias: 'Horizontal Bias (b > a)',
      vertBias: 'Vertical Bias (a > b)',
      symDesc: 'Equal legs (a = b). Rhombus becomes an exact square, all angles 90°.',
      horizDesc: 'Horizontal leg is longer. Angle φ_A is acute, angle φ_B is obtuse.',
      vertDesc: 'Vertical leg is longer. Angle φ_A is obtuse, angle φ_B is acute.',
    },
  },
};
