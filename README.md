# Pythagoras Geometry Lab

**Интерактивный математический исследовательский стенд: детерминированное построение ромба на гипотенузе через направляющие диагонали квадратов на катетах («Пифагоровы штаны»)**

[Русская версия](#русская-версия) · [English Version](#english-version) · [Спецификация (`MATHEMATICAL_SPEC_v1.0.md`)](docs/MATHEMATICAL_SPEC_v1.0.md) · [Математическое обоснование (`MATHEMATICAL_FOUNDATION_v1.0.md`)](docs/MATHEMATICAL_FOUNDATION_v1.0.md) · [Паспорта 9 инвариантов (`INVARIANT_PROOFS_v1.0.md`)](docs/INVARIANT_PROOFS_v1.0.md) · [Численный анализ (`NUMERICAL_ANALYSIS_v1.0.md`)](docs/NUMERICAL_ANALYSIS_v1.0.md) · [Матрица верификации (`VERIFICATION_MATRIX_v1.0.md`)](docs/VERIFICATION_MATRIX_v1.0.md) · [Архитектура (`ARCHITECTURE.md`)](docs/ARCHITECTURE.md)

---

## Русская версия

### 1. Название и краткая аннотация

**Pythagoras Geometry Lab** (`pythagoras-geometry-lab`, спецификация конструкции `v1.0`) — интерактивный научно-образовательный стенд для аналитического и экспериментального исследования детерминированной ромбической конструкции на гипотенузе прямоугольного треугольника, её параметрической деформации, знаковой и модульной мер асимметрии $q(t), A(t)$ и 9 математических инвариантов.

> Данный стенд **не** является доказательством новой версии теоремы Пифагора. Его предмет — точная геометрическая конструкция, возникающая из сопряжения внешних квадратов на катетах и условия замыкания длины сторон по гипотенузе, а также её проверяемые аналитические свойства.

---

### 2. Исследовательская задача

В классическом построении к теореме Пифагора на гипотенузе прямоугольного треугольника $OAB$ возводится квадрат $Q_c$ со стороной $c$. В данном стенде ставится и исследуется другая геометрическая задача:

> **Что возникает на гипотенузе $AB$, если направления боковых сторон задаются не нормалью к гипотенузе, а внешними диагоналями квадратов на катетах $Q_a$ и $Q_b$, а длина боковых сторон замыкается величиной гипотенузы $L = c$?**

Стенд позволяет независимому исследователю:
- анализировать разделение конструкции на порождающий механизм направлений и правило замыкания масштаба;
- отслеживать в реальном времени трансформацию фигуры от вытянутого ромба к точному квадрату ($a = b$) и обратно;
- проверять сохранение 9 инвариантов с машинной точностью ($\Delta < 10^{-9}$).

---

### 3. Геометрическая идея и принцип конструкции

Конструкция строится по схеме **трёх структурных слоёв** ($L1 \to L2 \to L3$):

1. **Слой $L1$ (Исходные данные):** Прямоугольный треугольник $OAB$ в I квадранте ($O=(0,0)$ — фиксированный прямой угол) и два внешних квадрата: $Q_a$ слева от вертикального катета $OA$ и $Q_b$ ниже горизонтального катета $OB$.
2. **Слой $L2$ (Направляющий механизм):** В квадратах $Q_a$ и $Q_b$ выбираются внешние диагонали $D_a A$ и $D_b B$ (не проходящие через $O$). Их векторы $\overrightarrow{D_a A} = (a, a)$ и $\overrightarrow{D_b B} = (b, b)$ всегда сонаправлены и задают единый инвариантный орт $\vec{e} = \left(\frac{1}{\sqrt{2}}, \frac{1}{\sqrt{2}}\right)$ под углом $+45^\circ$ к оси $+Ox$.
3. **Слой $L3$ (Правило замыкания $L = c$):** От вершин $A$ и $B$ вдоль орта $\vec{e}$ откладываются отрезки длиной $L = c = \sqrt{a^2 + b^2}$. Это однозначно определяет вершины $A' = A + c\vec{e}$ и $B' = B + c\vec{e}$ и выделяет **единственный ромб $ABB'A'$** из бесконечного семейства параллелограммов, которое возникало бы при свободном параметре $L$.

**О формулировке «без треугольника»:** В контексте направляющего механизма (слой $L2$) вектор $\vec{e} = \frac{1}{\sqrt{2}}(1,1)$ возникает *без участия* треугольника $OAB$ и не зависит от его острых углов $\alpha, \beta$ — он порождается исключительно парой квадратов на ортогональных осях. При этом в фактической вычислительной реализации (`calculatePythagoreanPants`) треугольник $OAB$ присутствует всегда как часть слоя $L1$, так как гипотенуза $c = |AB|$ необходима для правила замыкания $L = c$ в слое $L3$.

---

### 4. Что именно исследует стенд

В интерфейсе реализованы 4 предметных модуля:
- **01. Треугольник (`module_triangle`):** катеты $a, b$, гипотенуза $c$, углы $\alpha, \beta$, высота к гипотенузе $h_c$, проекции катетов $c_a, c_b$, площадь и тригонометрические отношения.
- **02. Теорема Пифагора (`module_pythagoras`):** баланс площадей $a^2 + b^2 = c^2$ в двух наглядных вариантах — классическое доказательство Евклида («Мельница», I.47) и разложение квадрата $(a+b)^2 = c^2 + 4 \cdot \frac{ab}{2}$.
- **03. «Пифагоровы штаны» (`module_pants`):** основной исследовательский модуль ромба $ABB'A'$, слоёв $L1$–$L3$, углов, диагоналей, сравнения $S_r$ и $S_c$.
- **04. Эксперименты (`module_experiments`):** интерактивный SVG-график безразмерных функций $q(t)$, $A(t)$, $\eta_S(t)$ от отношения катетов $t = b/a$ с отслеживанием текущего положения системы.

---

### 5. Геометрическая модель

В декартовой системе координат на плоскости $\mathbb{R}^2$:

- $O = (0, 0)$ — неподвижная вершина прямого угла;
- $A = (0, a)$, $B = (b, 0)$ при $a > 0, b > 0$;
- Квадрат $Q_a$: $O(0,0),\; A(0,a),\; C_a(-a,a),\; D_a(-a,0)$;
- Квадрат $Q_b$: $O(0,0),\; B(b,0),\; C_b(b,-b),\; D_b(0,-b)$;
- Направляющие диагонали: $D_a A$ от $(-a,0)$ к $(0,a)$ и $D_b B$ от $(0,-b)$ к $(b,0)$;
- Вершины ромба $ABB'A'$:
  $$A' = \left(\frac{c}{\sqrt{2}},\; a + \frac{c}{\sqrt{2}}\right), \qquad B' = \left(b + \frac{c}{\sqrt{2}},\; \frac{c}{\sqrt{2}}\right)$$

---

### 6. Математические параметры и обозначения

| Обозначение | Идентификатор в коде | Смысл |
|---|---|---|
| $a, b$ | `triangle.a`, `triangle.b` | Длины вертикального ($OA$) и горизонтального ($OB$) катетов |
| $c$ | `sideLength` / `triangle.c` | Гипотенуза $AB$ и длина каждой стороны ромба |
| $\alpha, \beta$ | `alphaDeg`, `betaDeg` | Острые углы треугольника: $\alpha = \arctan(b/a)$, $\beta = \arctan(a/b)$ |
| $\vec{e}$ | `directionE` | Единичный направляющий вектор $(1/\sqrt{2}, 1/\sqrt{2})$ под углом $+45^\circ$ |
| $t$ | `t` | Параметр формы $t = b/a$ |
| $q(t)$ | `q` | Знаковая мера асимметрии: $q = \frac{t - 1}{t + 1} = \frac{b - a}{a + b} \in (-1, 1)$ |
| $A(t)$ | `A` | Модульная мера асимметрии: $A = \|q(t)\| \in [0, 1)$ |
| $\Delta\varphi$ | `deltaPhiDeg` | Угловое отклонение ромба от прямого угла: $\Delta\varphi = \arctan(A)$ |
| $\varphi_A, \varphi_B, \varphi_{B'}, \varphi_{A'}$ | `phiA_deg`, `phiB_deg`, `phiB_prime_deg`, `phiA_prime_deg` | Внутренние углы $\angle BAA'$, $\angle ABB'$, $\angle BB'A'$, $\angle B'A'A$ |
| $h_r, S_r, P_r$ | `height`, `areaRhombus`, `perimeterRhombus` | Высота, площадь и периметр ромба |
| $S_c$ | `areaSquareHypotenuse` | Площадь квадрата на гипотенузе $c^2$ |
| $d_1, d_2$ | `d1`, `d2` | Диагонали ромба $d_1 = AB'$, $d_2 = BA'$ |
| $\eta_S, \eta_L$ | `etaS`, `etaL` | Площадная согласованность $S_r / S_c$ и линейная компенсационная характеристика |

---

### 7. Основные формулы

- **Внутренние углы ромба:**
  $$\varphi_A = \varphi_{B'} = 45^\circ + \beta = 135^\circ - \alpha = 90^\circ - \arctan(q)$$
  $$\varphi_B = \varphi_{A'} = 45^\circ + \alpha = 135^\circ - \beta = 90^\circ + \arctan(q)$$
- **Высота, периметр и площадь ромба:**
  $$h_r = \frac{a + b}{\sqrt{2}}, \qquad P_r = 4c, \qquad S_r = \frac{c(a + b)}{\sqrt{2}}$$
- **Диагонали ромба:**
  $$d_1^2 = 2c^2 + \sqrt{2}\,c(b - a), \qquad d_2^2 = 2c^2 - \sqrt{2}\,c(b - a)$$
  $$d_1 = 2c\cos\frac{\varphi_A}{2}, \qquad d_2 = 2c\sin\frac{\varphi_A}{2}$$
- **Асимметрия и согласованность площадей:**
  $$q(t) = \frac{t - 1}{t + 1}, \qquad A(t) = |q(t)|, \qquad q(1/t) = -q(t), \qquad A(1/t) = A(t)$$
  $$\eta_S = \frac{S_r}{S_c} = \frac{h_r}{c} = \frac{a + b}{\sqrt{2}\,c} = \frac{1}{\sqrt{1 + A^2}}, \qquad \eta_L = \sqrt{1 + A^2}, \qquad \eta_S \cdot \eta_L = 1$$

---

### 8. Девять математических инвариантов

Все 9 инвариантов проверяются в реальном времени функцией `validateInvariants` (`src/math/GeometryValidators.ts`, безразмерный масштабно-нормированный допуск `1e-9`) с независимым расчётом углов, диагоналей, шнуровой площади и направляющих векторов по координатам вершин:

| № | ID | Формулировка | Статус |
|---|---|---|---|
| 1 | `sides_equality` | $AB = BB' = B'A' = A'A = c$ | Доказано аналитически / проверено численно ($\Delta l / c$) |
| 2 | `supplementary_angles` | $\varphi_A + \varphi_B = 180^\circ$ | Доказано аналитически / проверено численно (аналит. и по координатам) |
| 3 | `opposite_angles` | $\varphi_A = \varphi_{B'}$ и $\varphi_B = \varphi_{A'}$ | Доказано аналитически / независимый векторный расчёт всех 4 углов |
| 4 | `orthogonal_diagonals` | $d_1 \perp d_2 \; (\hat{d}_1 \cdot \hat{d}_2 = 0)$ | Доказано аналитически / нормированное скалярное произведение |
| 5 | `parallelogram_identity` | $(d_1^2 + d_2^2)/(4c^2) = 1$ | Доказано аналитически / проверено по координатам вершин |
| 6 | `area_consistency` | $S_r = \frac{d_1 \cdot d_2}{2} = c \cdot h_r$ | Доказано аналитически / сверка шнуровой и диагональной площадей |
| 7 | `ratio_invariant` | $\frac{S_r}{S_c} = \frac{h_r}{c} = \eta_S = \frac{1}{\sqrt{1 + A^2}}$ | Доказано аналитически / проверено численно |
| 8 | `reciprocal_compensation` | $\eta_S \cdot \eta_L = (h_r/c) \cdot \eta_L = 1$ | Доказано аналитически / проверено численно |
| 9 | `guiding_parallelism` | $\angle(D_a A) = \angle(D_b B) = \angle(AA') = \angle(BB') = +45^\circ$ | Доказано аналитически / проверка по вершинам $Q_a, Q_b$ и рёбрам ромба |

---

### 9. Пять контрольных конфигураций

| $(a, b)$ | Ожидаемое состояние | $c$ | $t = b/a$ | $q(t)$ | $\varphi_A$ | $\varphi_B$ | $\eta_S = S_r/S_c$ | Макс. $\Delta$ |
|---|---|---|---|---|---|---|---|---|
| `(4, 4)` | Симметрия: ромб становится квадратом | 5.6569 | 1.000 | 0.0000 | 90.000° | 90.000° | 1.0000 | $5.55 \times 10^{-16}$ |
| `(4, 2)` | Вертикальный катет длиннее | 4.4721 | 0.500 | -0.3333 | 108.435° | 71.565° | 0.9487 | $2.34 \times 10^{-16}$ |
| `(2, 4)` | Горизонтальный катет длиннее | 4.4721 | 2.000 | +0.3333 | 71.565° | 108.435° | 0.9487 | $2.34 \times 10^{-16}$ |
| `(1, 10)` | Сильная асимметрия ($q > 0$) | 10.0499 | 10.000 | +0.8182 | 50.711° | 129.289° | 0.7740 | $2.22 \times 10^{-16}$ |
| `(10, 1)` | Сильная асимметрия ($q < 0$) | 10.0499 | 0.100 | -0.8182 | 129.289° | 50.711° | 0.7740 | $2.22 \times 10^{-16}$ |

---

### 10. Возможности интерактивного исследования

- Перетаскивание вершин $A$ (по оси $+Oy$) и $B$ (по оси $+Ox$) с жёстким сохранением прямого угла в $O(0,0)$.
- Синхронизированные ползунки, поля точного ввода и 8 пресетов.
- Плавный переход через симметрию (`Пройти через симметрию`: $t < 1 \to t = 1 \to t > 1$) и пошаговая анимация слоёв ($L1 \to L2 \to L3$).
- Сравнение двух конфигураций с мини-чертежами (`ComparisonModal`) и встроенная тестовая матрица (`TestRunnerModal`).
- Режимы **Школьный** и **Исследовательский** (LaTeX-формулы через KaTeX, координаты, шкала $q$).
- История действий Undo/Redo (`Ctrl+Z` / `Ctrl+Y`), сохранение/загрузка JSON, экспорт снимков в **PNG** и **SVG**, сворачивание правой панели и переключение языка (`RU` / `UK` / `EN`).

---

### 11. Архитектура программной реализации

Подробная схема модулей, графа зависимостей и алгоритмов приведена в [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md). Вычислительное ядро (`src/math/*`) полностью отделено от React/SVG и может использоваться автономно.

---

### 12. Технологический стек

- **Ядро и UI:** TypeScript, React 19, Vite 8
- **Визуализация:** нативный SVG, Tailwind CSS v4, Lucide React
- **Математическая нотация:** KaTeX
- **Тестирование:** `tsx` + `node:assert/strict`

---

### 13. Установка и запуск

```bash
npm install
npm run dev
```

Приложение запускается по адресу `http://localhost:3000`. Проверка типов и сборка:

```bash
npm run lint
npm run build
```

---

### 14. Запуск тестов

```bash
npm test
```

Команда выполняет `tsx src/tests/geometry.test.ts` и проверяет:
- все 5 контрольных конфигураций и 9 масштабно-нормированных инвариантов (с допуском `1e-9`);
- строгий входной контракт ядра (`InvalidTriangleInputError` для `0`, `< 0`, `NaN`, `±Infinity`);
- малые ($10^{-12}$, $10^{-200}$), крупные ($10^{150}$–$10^{200}$) масштабы, экстремальную асимметрию ($t = 10^{20}$) и дуальность $q(1/t) = -q(t), \; A(1/t) = A(t)$;
- мутационные и контрпримерные тесты (fault injection) на нарушение координат, углов, диагоналей квадратов, ориентации и отрицательных подмен (`height < 0`, `d1 < 0`, `etaS < 0`);
- дифференциальную сверку Path A (`RightTriangle` + аналитика) и координатного Path B (`CoordinatePathB`).

---

### 15. Ограничения модели

- Конструкция определена строго для конечных положительных катетов $0 < a, b < \infty$ с закреплённым прямым углом в $O=(0,0)$; при нарушении контракта ядро выбрасывает `InvalidTriangleInputError`.
- В UI значения катетов ограничены диапазоном $[0.2, 15]$ для читаемости чертежа, а нечисловые вводы фильтруются до вызова ядра.
- **Окно полной представимости `float64` (все 9/9 инвариантов):** $1.49 \times 10^{-154} \lesssim a, b \lesssim 1.34 \times 10^{154}$. Ниже $\sim 1.49 \times 10^{-154}$ (проверено на `1e-200`) и выше $\sim 1.34 \times 10^{154}$ (проверено на `1e200`) квадратичные площади ($S_r, S_c, a^2, b^2$) уходят в underflow (`0`) или overflow (`Infinity`), тогда как длины и углы через `Math.hypot` остаются точными.
- **Переполнение координат и потеря мантиссы:** при $a, b \gtrsim 7.45 \times 10^{307}$ (симметр.) или $\sim 1.05 \times 10^{308}$ (асимм.) сдвинутые вершины $A'_y, B'_x$ переполняют `Number.MAX_VALUE`. При экстремальной асимметрии $t = b/a > 2^{53} \approx 9 \times 10^{15}$ сдвиг $a + c/\sqrt{2}$ в `float64` теряет вклад меньшего катета $a$.
- Нижняя граница $\eta_S > 1/\sqrt{2}$ является пределом при $t \to 0^+$ или $t \to +\infty$ и не достигается при конечных невырожденных катетах.

---

### 16. Научный статус и дальнейшие направления исследования

- Двумерная модель зафиксирована и верифицирована на уровне спецификации **v1.0**:
  - [`docs/MATHEMATICAL_FOUNDATION_v1.0.md`](docs/MATHEMATICAL_FOUNDATION_v1.0.md) — аксиоматика, строгие доказательства теорем 1–6 и аудит независимости Path A / Path B;
  - [`docs/INVARIANT_PROOFS_v1.0.md`](docs/INVARIANT_PROOFS_v1.0.md) — 11-пунктные паспорта всех 9 инвариантов;
  - [`docs/NUMERICAL_ANALYSIS_v1.0.md`](docs/NUMERICAL_ANALYSIS_v1.0.md) — анализ границ IEEE-754 `float64` и устойчивости;
  - [`docs/VERIFICATION_MATRIX_v1.0.md`](docs/VERIFICATION_MATRIX_v1.0.md) — сводная матрица статусов (`PROVEN`, `NUMERICALLY VERIFIED`, `TESTED`, `CONJECTURE`, `FALSE`).
- **Открытые направления (не реализованы в v1.0):**
  - обобщение направляющего механизма на непрямоугольные треугольники ($\angle AOB \ne 90^\circ$);
  - построение строгой метрики расстояния $d(t_1, t_2)$ на пространстве треугольников;
  - пространственные трёхмерные аналоги.

---

### 17. Лицензия и авторство

Проект распространяется по лицензии **Apache License 2.0** — см. файл [`LICENSE`](LICENSE).

---
---

## English Version

### 1. Title and Abstract

**Pythagoras Geometry Lab** (`pythagoras-geometry-lab`, construction specification `v1.0`) is an interactive scientific and educational stand for analytical and experimental investigation of a deterministic rhombus construction on the hypotenuse of a right triangle ("Pythagorean Pants"), its parametric deformation, signed and unsigned asymmetry measures $q(t), A(t)$, and 9 mathematical invariants.

> This stand does **not** claim a new proof or generalization of the Pythagorean theorem. Its subject is a specific geometric construction emerging from coupling exterior leg squares with a hypotenuse-length closure rule, together with its verifiable analytical properties.

---

### 2. Research Problem

Classical illustrations of the Pythagorean theorem erect an orthogonal square $Q_c$ of side $c$ on hypotenuse $AB$. This stand investigates a distinct geometric question:

> **What figure is formed on hypotenuse $AB$ when side directions are dictated not by the normal to $AB$, but by the outward diagonals of exterior leg squares $Q_a$ and $Q_b$, while the lateral side length is locked to $L = c$?**

The stand enables an independent researcher to:
- separate the direction-generating mechanism from the scale-closure rule;
- observe continuous transitions from a skewed rhombus to a square ($a = b$) and back;
- verify all 9 geometric invariants numerically to within $\Delta < 10^{-9}$.

---

### 3. Geometric Idea and Construction Principle

The construction is organized into **three structural layers** ($L1 \to L2 \to L3$):

1. **Layer $L1$ (Base Geometry):** Right triangle $OAB$ in Quadrant I (fixed right angle at $O=(0,0)$) and two exterior squares: $Q_a$ to the left of vertical leg $OA$, and $Q_b$ below horizontal leg $OB$.
2. **Layer $L2$ (Guiding Mechanism):** In $Q_a$ and $Q_b$, the outward diagonals $D_a A$ and $D_b B$ (not passing through $O$) are selected. Their vectors $\overrightarrow{D_a A} = (a, a)$ and $\overrightarrow{D_b B} = (b, b)$ are identically oriented along the unit vector $\vec{e} = \left(\frac{1}{\sqrt{2}}, \frac{1}{\sqrt{2}}\right)$ at $+45^\circ$ to $+Ox$.
3. **Layer $L3$ (Closure Rule $L = c$):** Segments of length $L = c = \sqrt{a^2 + b^2}$ are laid off from $A$ and $B$ along $\vec{e}$, uniquely defining $A' = A + c\vec{e}$ and $B' = B + c\vec{e}$ and selecting a **unique rhombus $ABB'A'$** out of the 1-parameter family of parallelograms produced by unconstrained $L$.

**Note on the phrase "Without a Triangle" («Без треугольника»):** In the context of Layer $L2$, the guiding direction $\vec{e} = \frac{1}{\sqrt{2}}(1,1)$ arises *without using* triangle $OAB$ or its acute angles $\alpha, \beta$ — it depends solely on two squares on orthogonal axes. In the actual computational implementation (`calculatePythagoreanPants`), however, triangle $OAB$ is always evaluated in Layer $L1$ because hypotenuse $c = |AB|$ is required by the closure rule $L = c$ in Layer $L3$.

---

### 4. Scope of the Stand

The application exposes 4 interactive modules:
- **01. Right Triangle (`module_triangle`):** legs $a, b$, hypotenuse $c$, angles $\alpha, \beta$, altitude $h_c$, projections $c_a, c_b$, area, and trigonometric ratios.
- **02. Pythagorean Theorem (`module_pythagoras`):** real-time area balance $a^2 + b^2 = c^2$ with two visual proofs — Euclid I.47 ("Windmill") and $(a+b)^2 = c^2 + 4 \cdot \frac{ab}{2}$ dissection.
- **03. Pythagorean Pants (`module_pants`):** primary research module for rhombus $ABB'A'$, layers $L1$–$L3$, interior angles, diagonals, and $S_r$ vs $S_c$ comparison.
- **04. Experiments (`module_experiments`):** live SVG curves of $q(t)$, $A(t)$, and $\eta_S(t)$ versus leg ratio $t = b/a$ with live state tracking.

---

### 5. Geometric Model

In Cartesian coordinates on $\mathbb{R}^2$:

- $O = (0, 0)$ — fixed right-angle vertex;
- $A = (0, a)$, $B = (b, 0)$ for $a > 0, b > 0$;
- Square $Q_a$: $O(0,0),\; A(0,a),\; C_a(-a,a),\; D_a(-a,0)$;
- Square $Q_b$: $O(0,0),\; B(b,0),\; C_b(b,-b),\; D_b(0,-b)$;
- Guiding diagonals: $D_a A$ from $(-a,0)$ to $(0,a)$ and $D_b B$ from $(0,-b)$ to $(b,0)$;
- Rhombus $ABB'A'$ vertices:
  $$A' = \left(\frac{c}{\sqrt{2}},\; a + \frac{c}{\sqrt{2}}\right), \qquad B' = \left(b + \frac{c}{\sqrt{2}},\; \frac{c}{\sqrt{2}}\right)$$

---

### 6. Variables and Mathematical Notation

| Symbol | Code Identifier | Meaning |
|---|---|---|
| $a, b$ | `triangle.a`, `triangle.b` | Vertical ($OA$) and horizontal ($OB$) leg lengths |
| $c$ | `sideLength` / `triangle.c` | Hypotenuse $AB$ and rhombus edge length |
| $\alpha, \beta$ | `alphaDeg`, `betaDeg` | Acute triangle angles: $\alpha = \arctan(b/a)$, $\beta = \arctan(a/b)$ |
| $\vec{e}$ | `directionE` | Unit guiding vector $(1/\sqrt{2}, 1/\sqrt{2})$ at $+45^\circ$ |
| $t$ | `t` | Form ratio $t = b/a$ |
| $q(t)$ | `q` | Signed asymmetry measure: $q = \frac{t - 1}{t + 1} = \frac{b - a}{a + b} \in (-1, 1)$ |
| $A(t)$ | `A` | Asymmetry magnitude: $A = \|q(t)\| \in [0, 1)$ |
| $\Delta\varphi$ | `deltaPhiDeg` | Angular skew deviation from $90^\circ$: $\Delta\varphi = \arctan(A)$ |
| $\varphi_A, \varphi_B, \varphi_{B'}, \varphi_{A'}$ | `phiA_deg`, `phiB_deg`, `phiB_prime_deg`, `phiA_prime_deg` | Interior angles $\angle BAA'$, $\angle ABB'$, $\angle BB'A'$, $\angle B'A'A$ |
| $h_r, S_r, P_r$ | `height`, `areaRhombus`, `perimeterRhombus` | Rhombus height, area, and perimeter |
| $S_c$ | `areaSquareHypotenuse` | Area of hypotenuse square $c^2$ |
| $d_1, d_2$ | `d1`, `d2` | Rhombus diagonals $d_1 = AB'$, $d_2 = BA'$ |
| $\eta_S, \eta_L$ | `etaS`, `etaL` | Area consistency ratio $S_r / S_c$ and linear compensation factor |

---

### 7. Core Formulas

- **Rhombus Interior Angles:**
  $$\varphi_A = \varphi_{B'} = 45^\circ + \beta = 135^\circ - \alpha = 90^\circ - \arctan(q)$$
  $$\varphi_B = \varphi_{A'} = 45^\circ + \alpha = 135^\circ - \beta = 90^\circ + \arctan(q)$$
- **Height, Perimeter, and Area:**
  $$h_r = \frac{a + b}{\sqrt{2}}, \qquad P_r = 4c, \qquad S_r = \frac{c(a + b)}{\sqrt{2}}$$
- **Diagonals:**
  $$d_1^2 = 2c^2 + \sqrt{2}\,c(b - a), \qquad d_2^2 = 2c^2 - \sqrt{2}\,c(b - a)$$
  $$d_1 = 2c\cos\frac{\varphi_A}{2}, \qquad d_2 = 2c\sin\frac{\varphi_A}{2}$$
- **Asymmetry and Area Consistency:**
  $$q(t) = \frac{t - 1}{t + 1}, \qquad A(t) = |q(t)|, \qquad q(1/t) = -q(t), \qquad A(1/t) = A(t)$$
  $$\eta_S = \frac{S_r}{S_c} = \frac{h_r}{c} = \frac{a + b}{\sqrt{2}\,c} = \frac{1}{\sqrt{1 + A^2}}, \qquad \eta_L = \sqrt{1 + A^2}, \qquad \eta_S \cdot \eta_L = 1$$

---

### 8. Nine Mathematical Invariants

Evaluated continuously by `validateInvariants` (`src/math/GeometryValidators.ts`, dimensionless scale-normalized tolerance `1e-9`) with independent coordinate-vector computation of all 4 angles, diagonals, shoelace area, and square-derived guiding vectors:

| # | ID | Statement | Status |
|---|---|---|---|
| 1 | `sides_equality` | $AB = BB' = B'A' = A'A = c$ | Proven analytically / verified numerically ($\Delta l / c$) |
| 2 | `supplementary_angles` | $\varphi_A + \varphi_B = 180^\circ$ | Proven analytically / verified numerically (analytic & coordinate) |
| 3 | `opposite_angles` | $\varphi_A = \varphi_{B'}$ and $\varphi_B = \varphi_{A'}$ | Proven analytically / independent 4-vertex vector angle check |
| 4 | `orthogonal_diagonals` | $d_1 \perp d_2 \; (\hat{d}_1 \cdot \hat{d}_2 = 0)$ | Proven analytically / scale-normalized dot product |
| 5 | `parallelogram_identity` | $(d_1^2 + d_2^2)/(4c^2) = 1$ | Proven analytically / coordinate diagonal length check |
| 6 | `area_consistency` | $S_r = \frac{d_1 \cdot d_2}{2} = c \cdot h_r$ | Proven analytically / shoelace vs diagonal vs $c \cdot h_r$ |
| 7 | `ratio_invariant` | $\frac{S_r}{S_c} = \frac{h_r}{c} = \eta_S = \frac{1}{\sqrt{1 + A^2}}$ | Proven analytically / verified numerically |
| 8 | `reciprocal_compensation` | $\eta_S \cdot \eta_L = (h_r/c) \cdot \eta_L = 1$ | Proven analytically / verified numerically |
| 9 | `guiding_parallelism` | $\angle(D_a A) = \angle(D_b B) = \angle(AA') = \angle(BB') = +45^\circ$ | Proven analytically / verified from $Q_a, Q_b$ vertices & rhombus edges |

---

### 9. Five Control Configurations

| $(a, b)$ | Expected State | $c$ | $t = b/a$ | $q(t)$ | $\varphi_A$ | $\varphi_B$ | $\eta_S = S_r/S_c$ | Max $\Delta$ |
|---|---|---|---|---|---|---|---|---|
| `(4, 4)` | Square symmetry | 5.6569 | 1.000 | 0.0000 | 90.000° | 90.000° | 1.0000 | $5.55 \times 10^{-16}$ |
| `(4, 2)` | Vertical leg longer | 4.4721 | 0.500 | -0.3333 | 108.435° | 71.565° | 0.9487 | $2.34 \times 10^{-16}$ |
| `(2, 4)` | Horizontal leg longer | 4.4721 | 2.000 | +0.3333 | 71.565° | 108.435° | 0.9487 | $2.34 \times 10^{-16}$ |
| `(1, 10)` | Strong bias ($q > 0$) | 10.0499 | 10.000 | +0.8182 | 50.711° | 129.289° | 0.7740 | $2.22 \times 10^{-16}$ |
| `(10, 1)` | Strong bias ($q < 0$) | 10.0499 | 0.100 | -0.8182 | 129.289° | 50.711° | 0.7740 | $2.22 \times 10^{-16}$ |

---

### 10. Interactive Exploration Features

- Axis-constrained dragging of vertices $A$ (along $+Oy$) and $B$ (along $+Ox$) preserving the right angle at $O(0,0)$.
- Synchronized sliders, numeric inputs, and 8 preset configurations.
- Symmetry sweep animation ($t < 1 \to t = 1 \to t > 1$) and step-by-step layer construction ($L1 \to L2 \to L3$).
- Side-by-side configuration comparison with miniature SVG previews (`ComparisonModal`) and in-app test matrix (`TestRunnerModal`).
- **School** and **Research** display modes (KaTeX formulas, vertex coordinates, $q$-gauge).
- Undo/Redo history (`Ctrl+Z` / `Ctrl+Y`), JSON config save/load, **PNG** and **SVG** snapshot export, collapsible right panel, and `RU / UK / EN` interface selector.

---

### 11. Software Architecture

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the full module breakdown, reactive DAG data flow, and rendering/testing architecture. The computational core (`src/math/*`) has zero React/SVG dependencies.

---

### 12. Technology Stack

- **Core & UI:** TypeScript, React 19, Vite 8
- **Visualization:** Native SVG, Tailwind CSS v4, Lucide React
- **Math Typography:** KaTeX
- **Testing:** `tsx` + `node:assert/strict`

---

### 13. Installation and Running

```bash
npm install
npm run dev
```

Serves at `http://localhost:3000`. Type-checking and production build:

```bash
npm run lint
npm run build
```

---

### 14. Running Tests

```bash
npm test
```

Executes `tsx src/tests/geometry.test.ts`, verifying:
- all 5 control configurations and all 9 scale-normalized invariants within `1e-9` tolerance;
- strict core input validation (`InvalidTriangleInputError` on `0`, `< 0`, `NaN`, `±Infinity`);
- small ($10^{-12}$, $10^{-200}$), large ($10^{150}$–$10^{200}$) scales, extreme asymmetry ($t = 10^{20}$), and leg-swap duality $q(1/t) = -q(t), \; A(1/t) = A(t)$;
- fault-injection & counterexample tests on coordinates, angles, square diagonals, orientation, and negative mutations (`height < 0`, `d1 < 0`, `etaS < 0`);
- differential Path A (`RightTriangle` + analytic) vs coordinate Path B (`CoordinatePathB`) equivalence.

---

### 15. Model Limitations

- Valid strictly for finite positive legs $0 < a, b < \infty$ with fixed right angle at $O=(0,0)$; invalid inputs throw `InvalidTriangleInputError` in the math core.
- Interactive UI controls clamp leg lengths to $[0.2, 15]$ for visual clarity and filter non-finite inputs before calling the core.
- **Full IEEE-754 `float64` 9/9 validity window:** $1.49 \times 10^{-154} \lesssim a, b \lesssim 1.34 \times 10^{154}$. Below $\sim 1.49 \times 10^{-154}$ (tested at `1e-200`) and above $\sim 1.34 \times 10^{154}$ (tested at `1e200`), quadratic area quantities ($S_r, S_c, a^2, b^2$) underflow to `0` or overflow to `Infinity`, while lengths and angles via `Math.hypot` remain accurate.
- **Coordinate overflow and mantissa loss:** Above $\sim 7.45 \times 10^{307}$ (symmetric) or $\sim 1.05 \times 10^{308}$ (asymmetric), shifted vertices $A'_y, B'_x$ overflow `Number.MAX_VALUE`. Under extreme asymmetry $t = b/a > 2^{53} \approx 9 \times 10^{15}$, $a + c/\sqrt{2}$ rounds to $c/\sqrt{2}$ in `float64`, losing the minor leg contribution in shifted coordinates.
- The lower bound $\eta_S > 1/\sqrt{2}$ is an asymptotic limit as $t \to 0^+$ or $t \to +\infty$ and is never reached for finite positive legs.

---

### 16. Scientific Status and Further Research

- The 2D construction is verified at specification **v1.0** across:
  - [`docs/MATHEMATICAL_FOUNDATION_v1.0.md`](docs/MATHEMATICAL_FOUNDATION_v1.0.md) — axiomatics, step-by-step proofs of Theorems 1–6, and Path A / Path B independence audit;
  - [`docs/INVARIANT_PROOFS_v1.0.md`](docs/INVARIANT_PROOFS_v1.0.md) — 11-point passports for all 9 invariants;
  - [`docs/NUMERICAL_ANALYSIS_v1.0.md`](docs/NUMERICAL_ANALYSIS_v1.0.md) — IEEE-754 `float64` boundary and stability analysis;
  - [`docs/VERIFICATION_MATRIX_v1.0.md`](docs/VERIFICATION_MATRIX_v1.0.md) — consolidated status table (`PROVEN`, `NUMERICALLY VERIFIED`, `TESTED`, `CONJECTURE`, `FALSE`).
- **Open Research Directions (not implemented in v1.0):**
  - extension to oblique triangles ($\angle AOB \ne 90^\circ$);
  - formalizing a true metric distance $d(t_1, t_2)$ on triangle shape classes;
  - 3D spatial analogues.

---

### 17. License and Authorship

Distributed under the **Apache License 2.0** — see [`LICENSE`](LICENSE).
