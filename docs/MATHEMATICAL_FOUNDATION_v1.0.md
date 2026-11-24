# Математическое основание конструкции «Пифагоровы штаны» (`v1.0`)

**Стандарт:** Mathematical Research Stand Documentation Standard (MRSDS) — Фундаментальное обоснование  
**Целевые модули:** `src/math/RightTriangle.ts`, `src/math/SquareConstruction.ts`, `src/math/PythagoreanPants.ts`, `src/math/CoordinatePathB.ts`  
**Принцип:** *Сначала доказательство, затем реализация, затем независимая проверка.*

---

## Этап A. Восстановление геометрической модели

### A.1. Исходные геометрические объекты и аксиоматика (допустимая область)
На евклидовой плоскости $\mathbb{R}^2$ фиксируются два действительных положительных параметра $a, b \in \mathbb{R}_{>0}$ ($0 < a, b < +\infty$).

1. **Прямоугольный треугольник $\triangle OAB$:**
   - Вершина прямого угла $O$ фиксирована; $\angle AOB = 90^\circ$.
   - Катеты имеют длины $|OA| = a$ и $|OB| = b$.
   - Гипотенуза $AB$ имеет длину $c = |AB| = \sqrt{a^2 + b^2} > 0$ по теореме Пифагора.
2. **Внешние квадраты $Q_a$ и $Q_b$ на катетах:**
   - $Q_a$ — квадрат со стороной $a$, построенный на катете $OA$ во внешнюю полуплоскость относительно прямой $OA$ (в противоположную от $B$ сторону).
   - $Q_b$ — квадрат со стороной $b$, построенный на катете $OB$ во внешнюю полуплоскость относительно прямой $OB$ (в противоположную от $A$ сторону).

### A.2. Фиксация декартовой системы координат
Вводим стандартную ортонормированную декартову систему координат $(O; \vec{i}, \vec{j})$:
- $O = (0, 0)$ — начало координат;
- Луч $OA$ направлен вдоль положительной полуоси $+Oy$, так что:
  $$A = (0, a), \qquad a > 0;$$
- Луч $OB$ направлен вдоль положительной полуоси $+Ox$, так что:
  $$B = (b, 0), \qquad b > 0.$$

**Однозначность треугольника:** При заданных $a, b > 0$ в выбранной канонической ориентации (прямой угол в $O$, $A \in +Oy$, $B \in +Ox$) тройка точек $(O, A, B)$ определена единственным образом. В частности:
$$\overrightarrow{AB} = B - A = (b, -a), \qquad c = \|\overrightarrow{AB}\| = \sqrt{b^2 + (-a)^2} = \sqrt{a^2 + b^2}.$$
Острые углы треугольника $\triangle OAB$ при вершинах $A$ и $B$:
$$\alpha = \angle OAB = \arctan\!\left(\frac{b}{a}\right) \in \left(0, \frac{\pi}{2}\right), \qquad \beta = \angle OBA = \arctan\!\left(\frac{a}{b}\right) \in \left(0, \frac{\pi}{2}\right), \qquad \alpha + \beta = \frac{\pi}{2}.$$

### A.3. Координаты вершин внешних квадратов $Q_a$ и $Q_b$
1. **Квадрат $Q_a$ на вертикальном катете $OA$ (II квадрант, $x \le 0$):**
   Вектор $\overrightarrow{OA} = (0, a)$. Внешняя единичная нормаль к $OA$ (повёрнутая на $+90^\circ$ против часовой стрелки от $\overrightarrow{OA}$, то есть в сторону, противоположную $B$) равна $\vec{n}_a = (-1, 0)$. Сдвигая вершины $O$ и $A$ на $a \vec{n}_a = (-a, 0)$, получаем:
   $$O = (0, 0), \quad A = (0, a), \quad C_a = (-a, a), \quad D_a = (-a, 0).$$
   Выделенная диагональ $D_a A$ (не проходящая через $O$):
   $$\overrightarrow{D_a A} = A - D_a = (0 - (-a),\; a - 0) = (a, a).$$

2. **Квадрат $Q_b$ на горизонтальном катете $OB$ (IV квадрант, $y \le 0$):**
   Вектор $\overrightarrow{OB} = (b, 0)$. Внешняя единичная нормаль к $OB$ (повёрнутая на $-90^\circ$, то есть в сторону, противоположную $A$) равна $\vec{n}_b = (0, -1)$. Сдвигая $O$ и $B$ на $b \vec{n}_b = (0, -b)$, получаем:
   $$O = (0, 0), \quad B = (b, 0), \quad C_b = (b, -b), \quad D_b = (0, -b).$$
   Выделенная диагональ $D_b B$ (не проходящая через $O$):
   $$\overrightarrow{D_b B} = B - D_b = (b - 0,\; 0 - (-b)) = (b, b).$$

### A.4. Построение ромбической конструкции («Пифагоровы штаны»)
Построение разделяется на два строго разграниченных механизма:

1. **Направляющий механизм (Слой $L2$, следует из исходного построения квадратов):**
   Поскольку $a > 0$ и $b > 0$, обе диагонали имеют строго одинаковый единичный направляющий вектор:
   $$\vec{e}_a = \frac{\overrightarrow{D_a A}}{\|\overrightarrow{D_a A}\|} = \frac{(a, a)}{\sqrt{2}\,a} = \left(\frac{1}{\sqrt{2}}, \frac{1}{\sqrt{2}}\right), \qquad \vec{e}_b = \frac{\overrightarrow{D_b B}}{\|\overrightarrow{D_b B}\|} = \frac{(b, b)}{\sqrt{2}\,b} = \left(\frac{1}{\sqrt{2}}, \frac{1}{\sqrt{2}}\right).$$
   Обозначим общий направляющий орт $\vec{e} = \left(\frac{1}{\sqrt{2}}, \frac{1}{\sqrt{2}}\right)$. Он направлен под углом $+45^\circ$ к $+Ox$ и **не зависит от $a$ и $b$**.

2. **Дополнительное условие замыкания (Слой $L3$, постулат конструкции):**
   Из исходных квадратов $Q_a, Q_b$ и их диагоналей $D_a A, D_b B$ следует только **направление** лучей $A + L\vec{e}$ и $B + L\vec{e}$ ($L > 0$). При произвольном $L > 0$ семейство вершин $A'_L = A + L\vec{e}$, $B'_L = B + L\vec{e}$ образует однопараметрическое семейство **параллелограммов** (поскольку $\overrightarrow{A'_L B'_L} = B - A = \overrightarrow{AB}$).
   
   Чтобы выделить **ромб**, автор конструкции вводит **правило замыкания по гипотенузе**:
   $$L = c = |AB| = \sqrt{a^2 + b^2}.$$
   При $L = c$ координаты вершин $A'$ и $B'$ однозначно определяются как:
   $$A' = A + c\vec{e} = \left(\frac{c}{\sqrt{2}},\; a + \frac{c}{\sqrt{2}}\right), \qquad B' = B + c\vec{e} = \left(b + \frac{c}{\sqrt{2}},\; \frac{c}{\sqrt{2}}\right).$$
   Упорядоченный обход $A \to B \to B' \to A'$ задаёт замкнутый четырёхугольник $ABB'A'$, а его диагонали имеют векторы:
   $$\overrightarrow{d_1} = \overrightarrow{AB'} = B' - A = \left(b + \frac{c}{\sqrt{2}},\; \frac{c}{\sqrt{2}} - a\right), \qquad \overrightarrow{d_2} = \overrightarrow{BA'} = A' - B = \left(\frac{c}{\sqrt{2}} - b,\; a + \frac{c}{\sqrt{2}}\right).$$

### A.5. Разделение: что следует из геометрии, а что является дополнительным правилом
- **Следует из исходной геометрии $\triangle OAB$ и квадратов $Q_a, Q_b$:**
  - взаимное расположение $D_a, A, D_b, B$;
  - сонаправленность $\overrightarrow{D_a A} \parallel \overrightarrow{D_b B} \parallel \vec{e} = \frac{1}{\sqrt{2}}(1, 1)$ под углом $+45^\circ$ (без участия острых углов $\alpha, \beta$ треугольника);
  - то, что любой сдвиг $A + L\vec{e}$, $B + L\vec{e}$ даёт параллелограмм $ABB'A'$ с невырожденной положительной площадью при любых $a, b > 0, L > 0$.
- **Является дополнительным правилом построения (постулатом слоя $L3$):**
  - выбор именно диагоналей $D_a A, D_b B$ (а не диагоналей $O C_a, O C_b$);
  - правило замыкания длины боковых сторон $L = c$, которое превращает общий параллелограмм в **ромб**.

### A.6. Однозначность построения при $a, b > 0$
При любых $a, b > 0$:
1. $c = \sqrt{a^2 + b^2} > 0$ определено однозначно.
2. Знаменатели $a, b, a+b, c$ строго положительны.
3. Проверим невырожденность (неколлинеарность векторов $\overrightarrow{AB}$ и $\overrightarrow{AA'}$):
   $$\overrightarrow{AB} \times \overrightarrow{AA'} = \det \begin{pmatrix} b & c/\sqrt{2} \\ -a & c/\sqrt{2} \end{pmatrix} = \frac{c(a + b)}{\sqrt{2}} > 0.$$
   Так как ориентированное векторное произведение строго положительно для всех $a, b > 0$, четыре вершины $A, B, B', A'$ **всегда** различны, **никогда** не лежат на одной прямой и **всегда** задают строго выпуклый невырожденный многоугольник с обходом против часовой стрелки.

### A.7. Симметричный и предельные случаи
- **Симметричный случай ($a = b \iff t = b/a = 1$):**
  $c = a\sqrt{2}$, $c/\sqrt{2} = a$, $q = 0$, $A = 0$.
  Координаты: $A = (0, a)$, $B = (a, 0)$, $A' = (a, 2a)$, $B' = (2a, a)$.
  $\overrightarrow{AB} \cdot \overrightarrow{AA'} = a \cdot a + (-a) \cdot a = 0 \implies \varphi_A = \varphi_B = \varphi_{B'} = \varphi_{A'} = 90^\circ$. Ромб становится **точным квадратом** со стороной $a\sqrt{2}$ и площадью $S_r = S_c = 2a^2$.
- **Предельные случаи асимметрии ($t = b/a \to +\infty$ или $t \to 0^+$):**
  - При $t \to +\infty$ ($b \gg a > 0$): $q = \frac{t-1}{t+1} \to 1^-$, $A \to 1^-$, $\alpha \to 90^{\circ -}$, $\beta \to 0^{\circ +}$,
    $$\varphi_A = 45^\circ + \beta \to 45^{\circ +}, \qquad \varphi_B = 45^\circ + \alpha \to 135^{\circ -}, \qquad \eta_S = \frac{S_r}{S_c} = \frac{1}{\sqrt{1+A^2}} \to \frac{1}{\sqrt{2}}^+.$$
  - При $t \to 0^+$ ($a \gg b > 0$): $q \to (-1)^+$, $A \to 1^-$, $\varphi_A \to 135^{\circ -}$, $\varphi_B \to 45^{\circ +}$, $\eta_S \to \frac{1}{\sqrt{2}}^+$.
  - **Вывод:** Нижняя граница $\eta_S = \frac{1}{\sqrt{2}}$ и углы $45^\circ, 135^\circ$ **недостижимы** ни при каких конечных положительных $a, b > 0$, а являются строгими асимптотическими пределами при вырождении треугольника.

---

## Этап B. Строгие доказательства геометрических свойств

### Теорема 1 (Параллельность направляющих диагоналей)
**Формулировка:** Для всех $a, b > 0$ векторы выделенных диагоналей $\overrightarrow{D_a A}$ и $\overrightarrow{D_b B}$ сонаправлены и образуют угол $+45^\circ$ с осью $+Ox$.  
**Предпосылки:** $A=(0,a), D_a=(-a,0), B=(b,0), D_b=(0,-b)$, $a, b > 0$.  
**Доказательство:** $\overrightarrow{D_a A} = (a, a) = \sqrt{2}\,a \cdot \left(\frac{1}{\sqrt{2}}, \frac{1}{\sqrt{2}}\right)$ и $\overrightarrow{D_b B} = (b, b) = \sqrt{2}\,b \cdot \left(\frac{1}{\sqrt{2}}, \frac{1}{\sqrt{2}}\right)$. Поскольку $a, b > 0$, оба вектора положительно пропорциональны одному и тому же единичному вектору $\vec{e} = (\cos 45^\circ, \sin 45^\circ)$. $\blacksquare$  
**Область применимости:** Все $a, b > 0$. **Исключения:** При $a = 0$ или $b = 0$ соответствующая диагональ вырождается в нулевой вектор.

---

### Теорема 2 (Равенство сторон и ромбическая структура $ABB'A'$)
**Формулировка:** При условии замыкания $L = c$ четырёхугольник $ABB'A'$ является ромбом со стороной $c$.  
**Предпосылки:** $A' = A + c\vec{e}$, $B' = B + c\vec{e}$, $c = |AB| = \sqrt{a^2 + b^2} > 0$, $\|\vec{e}\| = 1$.  
**Доказательство:**
1. $\overrightarrow{AA'} = c\vec{e} \implies |AA'| = c\|\vec{e}\| = c$.
2. $\overrightarrow{BB'} = c\vec{e} \implies |BB'| = c\|\vec{e}\| = c$.
3. $\overrightarrow{A'B'} = B' - A' = (B + c\vec{e}) - (A + c\vec{e}) = B - A = \overrightarrow{AB} \implies |A'B'| = |AB| = c$.
4. Поскольку $\overrightarrow{AB} \times \overrightarrow{AA'} = \frac{c(a+b)}{\sqrt{2}} > 0$, точки неколлинеарны. Все 4 стороны равны $c > 0$, значит $ABB'A'$ — строгий невырожденный ромб. $\blacksquare$  
**Область применимости:** Все $a, b > 0$.

---

### Теорема 3 (Формулы внутренних углов и свойства соседних/противоположных углов)
**Формулировка:** Внутренние углы ромба $ABB'A'$ равны:
$$\varphi_A = \varphi_{B'} = 45^\circ + \beta = 135^\circ - \alpha = 90^\circ - \arctan(q),$$
$$\varphi_B = \varphi_{A'} = 45^\circ + \alpha = 135^\circ - \beta = 90^\circ + \arctan(q),$$
где $q = \frac{b-a}{a+b} = \frac{t-1}{t+1}$, и $\varphi_A + \varphi_B = 180^\circ$.  
**Вывод и доказательство:**
1. Вычислим косинус и синус угла $\varphi_A = \angle(\overrightarrow{AB}, \overrightarrow{AA'})$ с использованием $\overrightarrow{AB} = (b, -a)$ (длина $c$) и $\overrightarrow{AA'} = \frac{c}{\sqrt{2}}(1, 1)$ (длина $c$):
   $$\cos\varphi_A = \frac{\overrightarrow{AB} \cdot \overrightarrow{AA'}}{c^2} = \frac{b - a}{\sqrt{2}\,c}, \qquad \sin\varphi_A = \frac{\overrightarrow{AB} \times \overrightarrow{AA'}}{c^2} = \frac{a + b}{\sqrt{2}\,c} > 0.$$
   Подставляя $a = c\sin\beta = c\cos\alpha$, $b = c\cos\beta = c\sin\alpha$ ($\alpha + \beta = \frac{\pi}{2}$):
   $$\cos\varphi_A = \frac{\cos\beta - \sin\beta}{\sqrt{2}} = \cos\!\left(\frac{\pi}{4} + \beta\right), \qquad \sin\varphi_A = \frac{\sin\beta + \cos\beta}{\sqrt{2}} = \sin\!\left(\frac{\pi}{4} + \beta\right).$$
   Так как $\frac{\pi}{4} + \beta \in \left(\frac{\pi}{4}, \frac{3\pi}{4}\right) \subset (0, \pi)$, имеем $\varphi_A = \frac{\pi}{4} + \beta = \frac{3\pi}{4} - \alpha$.
2. Аналогично выразим через $q = \frac{b - a}{a + b}$:
   $$\cot\varphi_A = \frac{\cos\varphi_A}{\sin\varphi_A} = \frac{b - a}{a + b} = q = \tan\!\left(\frac{\pi}{2} - \varphi_A\right) \implies \varphi_A = \frac{\pi}{2} - \arctan(q).$$
3. Поскольку $\overrightarrow{BA} = -\overrightarrow{AB}$, то $\overrightarrow{BA} \cdot \overrightarrow{BB'} = -\overrightarrow{AB} \cdot \overrightarrow{AA'}$, откуда $\cos\varphi_B = -\cos\varphi_A$, а при $\varphi_A, \varphi_B \in (0, \pi)$ это даёт $\varphi_B = \pi - \varphi_A = \frac{\pi}{4} + \alpha = \frac{\pi}{2} + \arctan(q)$ и $\varphi_A + \varphi_B = 180^\circ$.
4. В любом параллелограмме противоположные стороны противоположно сонаправлены ($\overrightarrow{B'B} = -\overrightarrow{AA'}$, $\overrightarrow{B'A'} = -\overrightarrow{AB}$), поэтому скалярные произведения пар смежных сторон в $A$ и $B'$ совпадают, откуда $\varphi_{B'} = \varphi_A$ и $\varphi_{A'} = \varphi_B$. $\blacksquare$

---

### Теорема 4 (Перпендикулярность и длины диагоналей; тождество параллелограмма)
**Формулировка:** Диагонали $\overrightarrow{d_1} = \overrightarrow{AB'}$ и $\overrightarrow{d_2} = \overrightarrow{BA'}$ строго ортогональны ($\overrightarrow{d_1} \cdot \overrightarrow{d_2} = 0$), их длины удовлетворяют:
$$d_1^2 = 2c^2 + \sqrt{2}\,c(b - a), \qquad d_2^2 = 2c^2 - \sqrt{2}\,c(b - a), \qquad d_1^2 + d_2^2 = 4c^2.$$
**Доказательство:**
1. Из координат:
   $$\overrightarrow{d_1} = \left(b + \frac{c}{\sqrt{2}},\; \frac{c}{\sqrt{2}} - a\right), \qquad \overrightarrow{d_2} = \left(\frac{c}{\sqrt{2}} - b,\; a + \frac{c}{\sqrt{2}}\right).$$
2. Вычисляем скалярное произведение напрямую (используя $a^2 + b^2 = c^2$):
   $$\overrightarrow{d_1} \cdot \overrightarrow{d_2} = \left(\frac{c^2}{2} - b^2\right) + \left(\frac{c^2}{2} - a^2\right) = c^2 - (a^2 + b^2) = 0.$$
3. Вычисляем квадраты длин:
   $$d_1^2 = \left(b + \frac{c}{\sqrt{2}}\right)^2 + \left(\frac{c}{\sqrt{2}} - a\right)^2 = a^2 + b^2 + c^2 + \sqrt{2}\,c(b - a) = 2c^2 + \sqrt{2}\,c(b - a),$$
   $$d_2^2 = \left(\frac{c}{\sqrt{2}} - b\right)^2 + \left(a + \frac{c}{\sqrt{2}}\right)^2 = a^2 + b^2 + c^2 - \sqrt{2}\,c(b - a) = 2c^2 - \sqrt{2}\,c(b - a).$$
   Также из теоремы косинусов (и из $2c^2(1 \pm \cos\varphi_A)$): $d_1 = 2c\cos\frac{\varphi_A}{2}$, $d_2 = 2c\sin\frac{\varphi_A}{2}$.
4. Суммируя: $d_1^2 + d_2^2 = 4c^2$. $\blacksquare$

---

### Теорема 5 (Высота и согласованность формул площади)
**Формулировка:** Высота ромба к основанию $AB$ равна $h_r = \frac{a+b}{\sqrt{2}}$, а площадь ромба удовлетворяет:
$$S_r = \frac{c(a + b)}{\sqrt{2}} = c \cdot h_r = \frac{d_1 d_2}{2}.$$
**Доказательство:**
1. Ориентированная площадь параллелограмма, натянутого на $\overrightarrow{AB} = (b, -a)$ и $\overrightarrow{AA'} = \left(\frac{c}{\sqrt{2}}, \frac{c}{\sqrt{2}}\right)$, равна:
   $$S_r = \left| \overrightarrow{AB} \times \overrightarrow{AA'} \right| = \frac{bc}{\sqrt{2}} - \left(-\frac{ac}{\sqrt{2}}\right) = \frac{c(a + b)}{\sqrt{2}}.$$
2. Высота ромба относительно основания $AB$ длины $c$: $h_r = \frac{S_r}{c} = \frac{a + b}{\sqrt{2}}$.
3. Из формул Теоремы 4:
   $$d_1^2 d_2^2 = \left(2c^2 + \sqrt{2}\,c(b - a)\right)\left(2c^2 - \sqrt{2}\,c(b - a)\right) = 4c^4 - 2c^2(b - a)^2.$$
   Так как $2c^2 - (b - a)^2 = 2(a^2 + b^2) - (b^2 - 2ab + a^2) = a^2 + 2ab + b^2 = (a + b)^2$, получаем:
   $$d_1^2 d_2^2 = 2c^2(a + b)^2 \implies \frac{d_1 d_2}{2} = \frac{c(a + b)}{\sqrt{2}} = S_r. \quad \blacksquare$$

---

### Теорема 6 (Отношение площадей, параметр асимметрии и взаимная компенсация)
**Формулировка:** Пусть $t = \frac{b}{a} > 0$, $q(t) = \frac{t - 1}{t + 1} = \frac{b - a}{a + b}$, $A(t) = |q(t)|$, $S_c = c^2$, $\eta_S = \frac{S_r}{S_c}$, $\eta_L = \sqrt{1 + A^2}$. Тогда:
1. $\eta_S = \frac{S_r}{S_c} = \frac{h_r}{c} = \frac{a + b}{\sqrt{2}\,c} = \frac{1}{\sqrt{1 + A^2}} \in \left(\frac{1}{\sqrt{2}}, 1\right]$;
2. $\eta_S \cdot \eta_L = 1$;
3. При перестановке катетов $(a, b) \mapsto (b, a)$ ($t \mapsto 1/t$): $q(1/t) = -q(t)$, $A(1/t) = A(t)$, $\eta_S(1/t) = \eta_S(t)$.

**Доказательство:**
1. Вычислим $1 + A^2$:
   $$1 + A^2 = 1 + q^2 = 1 + \frac{(b - a)^2}{(a + b)^2} = \frac{(a + b)^2 + (b - a)^2}{(a + b)^2} = \frac{2(a^2 + b^2)}{(a + b)^2} = \frac{2c^2}{(a + b)^2}.$$
   Извлекая положительный квадратный корень (так как $a, b, c > 0$):
   $$\sqrt{1 + A^2} = \frac{\sqrt{2}\,c}{a + b} \implies \frac{1}{\sqrt{1 + A^2}} = \frac{a + b}{\sqrt{2}\,c} = \frac{h_r}{c} = \frac{c \cdot h_r}{c^2} = \frac{S_r}{S_c} = \eta_S.$$
   Так как $0 \le A < 1$, имеем $1 \le \sqrt{1 + A^2} < \sqrt{2}$, откуда $\frac{1}{\sqrt{2}} < \eta_S \le 1$ (равенство $\eta_S = 1 \iff A = 0 \iff a = b$).
2. По определению $\eta_L = \sqrt{1 + A^2} = \frac{\sqrt{2}\,c}{a+b}$, откуда $\eta_S \cdot \eta_L = \frac{1}{\sqrt{1+A^2}}\cdot\sqrt{1+A^2} = 1$.
3. $q(1/t) = \frac{1/t - 1}{1/t + 1} = \frac{1 - t}{1 + t} = -q(t)$, откуда $A(1/t) = |-q(t)| = A(t)$ и $\eta_S(1/t) = \eta_S(t)$. $\blacksquare$

---

### Статус открытых / не являющихся теоремами утверждений
- **Замечание об обобщённой «безтреугольной» формулировке:** Направляющий орт $\vec{e}$ возникает из квадратов $Q_a, Q_b$ без участия треугольника $OAB$, однако сам ромб $ABB'A'$ требует длины гипотенузы $c = |AB|$ как замыкающего параметра $L = c$. Это **архитектурное определение конструкции**, а не теорема.
- **Гипотеза о метрике пространства треугольников:** Величина $A(t) = |q(t)|$ является безразмерной мерой асимметрии относительно симметричного эталона $t = 1$. Расстояние $d(t_1, t_2) = |q(t_1) - q(t_2)|$ гипотетически задаёт метрику на классах подобия прямоугольных треугольников $t \in \mathbb{R}_{>0}$, однако в реализации `v1.0` не используется и оставлено вне рамок спецификации.
- **Гипотезы об обобщениях (косоугольные треугольники, 3D-аналоги):** Вынесены за пределы `v1.0` и помечены как `CONJECTURE` / `UNVERIFIED`.

---

## Этап D. Анализ независимости Path A и Path B

### D.1. Сопоставление текущих реализаций
- **Path A (`src/math/PythagoreanPants.ts`):**
  Использует `calculateRightTriangle(a, b)` ($\alpha, \beta, c$), `calculateSquareA(a)`, `calculateSquareB(b)`, аналитические углы $\varphi_A = \frac{\pi}{4} + \beta$, $\varphi_B = \frac{\pi}{4} + \alpha$, факторизованные диагонали $d_{1,2} = c\sqrt{2 \pm \sqrt{2}(b-a)/c}$, высоту $h_r = \frac{a+b}{\sqrt{2}}$, площадь $S_r = c h_r$ и $\eta_S = 1/\sqrt{1+A^2}$.
- **Path B (`src/math/CoordinatePathB.ts`):**
  Не вызывает `RightTriangle.ts`. Вызывает `calculateSquareA(a)`, `calculateSquareB(b)`, берёт из их вершин $A, B$ и диагонали $D_a A, D_b B$, вычисляет $c = \operatorname{hypot}(B_x - A_x, B_y - A_y)$, замыкает $A' = A + c\vec{e}_a, B' = B + c\vec{e}_b$, и вычисляет углы через `atan2`, диагонали через `hypot`, высоту через $|\hat{AB} \times \overrightarrow{AA'}|$ и $S_c = \text{area}(Q_a) + \text{area}(Q_b)$.

### D.2. Выявленные общие зависимости (честный аудит независимости)
1. **Общий источник вершин $Q_a, Q_b$:** Оба пути вызывают `calculateSquareA(a)` и `calculateSquareB(b)` из `src/math/SquareConstruction.ts`. Если в `SquareConstruction.ts` внести систематическую ошибку в координаты $A, B, D_a, D_b$ (например, повернуть $Q_a$ или сдвинуть $D_a$ вместе с $A$), оба пути частично унаследуют искажённую геометрию (кроме случаев нарушения угла $+45^\circ$, которые поймает `GeometryValidators.ts`).
2. **Общий принцип расчёта $q$ и $A$:** В `Path B` строки 145–150 (`q = (sB/maxS - sA/maxS)/(sB/maxS + sA/maxS)`) используют ту же алгебраическую формулу от длин сторон квадратов, что и `Path A`. Это не независимое геометрическое измерение, а повторение алгебраического определения.
3. **Общий алгоритм `interiorAngleCCWDeg`:** `CoordinatePathB.ts` и `GeometryValidators.ts` используют идентичный векторный алгоритм `atan2(cross, dot)` по вершинам. При этом `Path A` (углы из $\alpha, \beta$) и `Path B` (углы из координат) действительно **принципиально независимы** по углам!
4. **Недостающая перекрёстная проверка в `Path B`:** `Path B` вычисляет `etaS = height / sideLength`, что геометрически отлично от `1 / sqrt(1 + A^2)` в `Path A` — это действительно независимая дифференциальная проверка! Но $\eta_L$ в `Path B` вычисляется как `1 / etaS` без проверки формулы $\sqrt{1 + A^2}$.

### D.3. Схема действительно независимой верификации
1. **Уровень 1 (Аналитический эталон $\alpha, \beta, q$):** Вычисляет углы, $\eta_S$, диагонали через тригонометрию $\triangle OAB$ (`Path A`).
2. **Уровень 2 (Независимый координатно-векторный эталон `Path B` без тригонометрии и без `RightTriangle`):** Строит квадраты, орты, вершины $A', B'$, векторные углы, евклидовы диагонали и векторную площадь через $\times$.
3. **Уровень 3 (Независимый валидатор `GeometryValidators.ts`):** Должен оставаться арбитром, сверяющим **геометрические аксиомы фигуры** напрямую по массиву вершин (длины рёбер, углы, ортогональность, шнуровая площадь, направление диагоналей $Q_a, Q_b$), не полагаясь на скалярные поля `calc`.
4. **Что принципиально должно оставаться разным в Path A и Path B:**
   - в `Path A`: углы из `atan2(b,a)`, диагонали $c\sqrt{2 \pm \sqrt{2}(b-a)/c}$, $S_r = c(a+b)/\sqrt{2}$, $\eta_S = 1/\sqrt{1+q^2}$;
   - в `Path B`: углы из координатных векторов $(A, B, B', A')$, диагонали $\|B'-A\|, \|A'-B\|$, $S_r = |\overrightarrow{AB} \times \overrightarrow{AA'}|$, $\eta_S = h_r/c$.
