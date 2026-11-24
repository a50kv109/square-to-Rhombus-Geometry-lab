# Mathematical Specification v1.0 — Deterministic Rhombus Construction («Pythagorean Pants»)

**Document Standard:** Mathematical Research Stand Documentation Standard (MRSDS)  
**Target Implementation:** `src/math/inputValidation.ts`, `src/math/RightTriangle.ts`, `src/math/SquareConstruction.ts`, `src/math/PythagoreanPants.ts`, `src/math/CoordinatePathB.ts`, `src/math/GeometryValidators.ts`  
**Supporting Verification Docs:** [`MATHEMATICAL_FOUNDATION_v1.0.md`](MATHEMATICAL_FOUNDATION_v1.0.md) · [`INVARIANT_PROOFS_v1.0.md`](INVARIANT_PROOFS_v1.0.md) · [`NUMERICAL_ANALYSIS_v1.0.md`](NUMERICAL_ANALYSIS_v1.0.md) · [`VERIFICATION_MATRIX_v1.0.md`](VERIFICATION_MATRIX_v1.0.md)  
**Status:** Release Candidate v1.0 (Verified against formal mathematical proofs, Path B differential check, fault-injection & counterexample suite)

---

## A. Mathematical Object

The object of study is the **deterministic rhombus construction on the hypotenuse via guiding diagonals of leg squares** (working title: **«Пифагоровы штаны» / "Pythagorean Pants"**).

Unlike classical Euclidean illustrations of the Pythagorean theorem (which place an orthogonal square $Q_c$ of area $c^2$ on the hypotenuse $AB$), this construction couples **two independent geometric mechanisms**:
1. **Direction-generating mechanism (Layer L2):** Exterior squares $Q_a$ and $Q_b$ constructed on the orthogonal legs $OA$ and $OB$ have designated outward diagonals $D_a A$ and $D_b B$ that are identically oriented along the unit vector $\vec{e} = \frac{1}{\sqrt{2}}(1, 1)$ at $+45^\circ$ to $+Ox$, independently of the leg lengths $a$ and $b$.
2. **Scale-closure rule (Layer L3):** Translating vertices $A$ and $B$ along $\vec{e}$ by the hypotenuse length $L = c = \sqrt{a^2 + b^2}$ produces vertices $A'$ and $B'$ forming a closed equilateral quadrilateral $ABB'A'$ — a **rhombus** for all $a > 0, b > 0$.

### Clarification of «Without a Triangle» («Без треугольника») in the Context of This Stand

In architectural discussions of the guiding mechanism, the phrase *"without a triangle"* refers strictly to **direction generation (Layer L2)**: the guiding angle $+45^\circ$ and unit vector $\vec{e} = \frac{1}{\sqrt{2}}(1,1)$ do **not** depend on the acute angles $\alpha, \beta$ or even on drawing hypotenuse $AB$ — they arise solely from two squares erected on orthogonal coordinate axes.

However, in the **primary implementation** (`src/math/PythagoreanPants.ts` — Path A):
- The right triangle $OAB$ **is always constructed and evaluated** (`calculateRightTriangle(a, b)`) as Layer L1 because hypotenuse $c = |AB|$ is required by Layer L3 ($L = c$) to close the parallelogram family into a unique rhombus.
- An independent coordinate-vector **Path B** (`src/math/CoordinatePathB.ts` — `calculateRhombusFromSquaresPathB`) is also implemented for differential verification: it constructs the rhombus and all derived metrics solely from exterior squares $Q_a$ and $Q_b$ without calling `RightTriangle`, confirming equivalence within $\le 10^{-11}$ across validated regimes.
- On the interactive board (`GeometryBoard`), `RightTriangleView` is always rendered alongside Layers L1–L3.

---

## B. Coordinate System

- **Space:** Euclidean plane $\mathbb{R}^2$ with standard orthonormal Cartesian basis $(+Ox, +Oy)$ in dimensionless units.
- **Screen Mapping (`src/geometry/transforms.ts`):**
  $$x_{\text{screen}} = x_{\text{origin}} + x \cdot s, \qquad y_{\text{screen}} = y_{\text{origin}} - y \cdot s$$
  where $s > 0$ is scale in pixels per mathematical unit (SVG Y-axis points downward).
- **Fixed Origin & Axis Constraints:**
  - $O = (0, 0)$ — fixed vertex; right angle $\angle AOB = 90^\circ$ is enforced structurally.
  - $A = (0, a)$ — constrained to the positive vertical semi-axis $+Oy$ ($a > 0$).
  - $B = (b, 0)$ — constrained to the positive horizontal semi-axis $+Ox$ ($b > 0$).

---

## C. Construction Definition

Given scalar inputs $(a, b)$ with $a > 0, b > 0$, `calculatePythagoreanPants(a, b)` executes the following deterministic sequence:

### Layer L1 — Source Triangle and Exterior Leg Squares
1. **Right Triangle $OAB$ (`calculateRightTriangle`):**
   $$O = (0, 0), \quad A = (0, a), \quad B = (b, 0), \quad c = \sqrt{a^2 + b^2}$$
2. **Exterior Square $Q_a$ on Vertical Leg $OA$ (`calculateSquareA`):**
   Located left of $+Oy$ (Quadrant II):
   $$O = (0, 0), \quad A = (0, a), \quad C_a = (-a, a), \quad D_a = (-a, 0)$$
3. **Exterior Square $Q_b$ on Horizontal Leg $OB$ (`calculateSquareB`):**
   Located below $+Ox$ (Quadrant IV):
   $$O = (0, 0), \quad B = (b, 0), \quad C_b = (b, -b), \quad D_b = (0, -b)$$

### Layer L2 — Guiding Diagonal Mechanism
4. **Designated Diagonals:**
   $$\overrightarrow{D_a A} = A - D_a = (a, a), \qquad \overrightarrow{D_b B} = B - D_b = (b, b)$$
   *(Note: These are the diagonals connecting outer base vertices $D_a, D_b$ to $A, B$, NOT the diagonals passing through $O$.)*
5. **Universal Unit Guiding Vector (`getUniversalDirectionVector`):**
   $$\vec{e} = \frac{\overrightarrow{D_a A}}{\|\overrightarrow{D_a A}\|} = \frac{\overrightarrow{D_b B}}{\|\overrightarrow{D_b B}\|} = \left(\frac{1}{\sqrt{2}}, \frac{1}{\sqrt{2}}\right), \qquad \theta_{\vec{e}} = +45^\circ$$

### Layer L3 — Rhombus Closure Rule ($L = c$)
6. **Translated Vertices:**
   $$A' = A + c\vec{e} = \left(\frac{c}{\sqrt{2}}, \; a + \frac{c}{\sqrt{2}}\right)$$
   $$B' = B + c\vec{e} = \left(b + \frac{c}{\sqrt{2}}, \; \frac{c}{\sqrt{2}}\right)$$
7. **Closed Polygon:**
   Ordered vertex sequence $A \to B \to B' \to A'$ defines quadrilateral $ABB'A'$.
   - *Architectural Distinction:* Without the closure constraint $L = c$ (for free $L > 0$), $A' = A + L\vec{e}$ and $B' = B + L\vec{e}$ generate an infinite 1-parameter family of parallelograms. Enforcing $L = c$ selects the unique rhombus in this family.

---

## D. Variables and Parameters

| Symbol | Code Identifier (`PythagoreanPantsCalculations`) | Domain | Geometric / Analytical Meaning |
|---|---|---|---|
| $a$ | `triangle.a` | $(0, +\infty)$, finite (strict core `InvalidTriangleInputError`; $[0.2, 15]$ in UI) | Vertical leg length $OA$ |
| $b$ | `triangle.b` | $(0, +\infty)$, finite (strict core `InvalidTriangleInputError`; $[0.2, 15]$ in UI) | Horizontal leg length $OB$ |
| $c$ | `sideLength` / `triangle.c` | $(0, +\infty)$ | Hypotenuse $AB = \operatorname{hypot}(a, b)$ and rhombus side length |
| $\alpha$ | `triangle.alphaRad`, `alphaDeg` | $(0, \pi/2)$ | Interior angle at $A$ in $\triangle OAB$: $\arctan(b/a)$ |
| $\beta$ | `triangle.betaRad`, `betaDeg` | $(0, \pi/2)$ | Interior angle at $B$ in $\triangle OAB$: $\arctan(a/b)$ |
| $h_c$ | `triangle.altitude` | $(0, +\infty)$ | Altitude of $\triangle OAB$ to hypotenuse: $ab/c$ |
| $c_a, c_b$ | `projectionA`, `projectionB` | $(0, +\infty)$ | Leg projections onto hypotenuse: $a^2/c$, $b^2/c$ |
| $\vec{e}$ | `directionE` | Unit vector | $(1/\sqrt{2}, 1/\sqrt{2})$ at $+45^\circ$ |
| $t$ | `t` | $(0, +\infty)$ | Form ratio $t = b / a$ |
| $q$ | `q` | $(-1, 1)$ | Signed asymmetry measure $q(t) = \frac{t - 1}{t + 1} = \frac{b - a}{a + b}$ |
| $A$ | `A` | $[0, 1)$ | Unsigned asymmetry magnitude $A(t) = \|q(t)\|$ |
| $\Delta\varphi$ | `deltaPhiRad`, `deltaPhiDeg` | $[0, 45^\circ)$ | Angular skew deviation from $90^\circ$: $\arctan(A)$ |
| $\varphi_A, \varphi_{B'}$ | `phiA_deg`, `phiB_prime_deg` | $(45^\circ, 135^\circ)$ | Interior angles $\angle BAA'$ and $\angle BB'A'$ |
| $\varphi_B, \varphi_{A'}$ | `phiB_deg`, `phiA_prime_deg` | $(45^\circ, 135^\circ)$ | Interior angles $\angle ABB'$ and $\angle B'A'A$ |
| $h_r$ | `height` | $(0, +\infty)$ | Perpendicular height of rhombus relative to base $AB$ |
| $S_r$ | `areaRhombus` | $(0, +\infty)$ | Rhombus area |
| $P_r$ | `perimeterRhombus` | $(0, +\infty)$ | Rhombus perimeter $4c$ |
| $S_c$ | `areaSquareHypotenuse` | $(0, +\infty)$ | Reference area of square on hypotenuse $c^2$ |
| $d_1, d_2$ | `d1`, `d2` | $(0, +\infty)$ | Rhombus diagonals $d_1 = \|AB'\|$, $d_2 = \|BA'\|$ |
| $\eta_S$ | `etaS` | $(1/\sqrt{2}, 1]$ | Area consistency ratio $S_r / S_c$ |
| $\eta_L$ | `etaL` | $[1, \sqrt{2})$ | Linear compensation characteristic $\sqrt{1 + A^2}$ |

---

## E. Mathematical Relations

All relations below are implemented directly in `src/math/RightTriangle.ts` and `src/math/PythagoreanPants.ts` for $a > 0, b > 0$.

### E.1 Side Vectors and Lengths
$$\overrightarrow{AB} = (b, -a), \quad \overrightarrow{A'B'} = B' - A' = (b, -a)$$
$$\overrightarrow{AA'} = \overrightarrow{BB'} = c\vec{e} = \left(\frac{c}{\sqrt{2}}, \frac{c}{\sqrt{2}}\right)$$
$$\|AB\| = \|BB'\| = \|B'A'\| = \|A'A\| = c = \sqrt{a^2 + b^2}$$

### E.2 Interior Angles of Rhombus $ABB'A'$
Using adjacent sides (never diagonals):
- $\varphi_A = \angle BAA' = 45^\circ + \beta = 135^\circ - \alpha = 90^\circ - \arctan(q)$
- $\varphi_B = \angle ABB' = 45^\circ + \alpha = 135^\circ - \beta = 90^\circ + \arctan(q)$
- $\varphi_{B'} = \angle BB'A' = \varphi_A$
- $\varphi_{A'} = \angle B'A'A = \varphi_B$

*Implementation note:* `PythagoreanPants.ts` computes `phiA_rad = Math.PI / 4 + triangle.betaRad` and `phiB_rad = Math.PI / 4 + triangle.alphaRad`, which are algebraically identical to $90^\circ \mp \arctan q$ because $\tan(45^\circ - \alpha) = \frac{1 - b/a}{1 + b/a} = -q$.

### E.3 Height, Area, and Hypotenuse-Square Ratio
- Rhombus height orthogonal to $AB$:
  $$h_r = \frac{a + b}{\sqrt{2}}$$
  *(Derived from projecting $\overrightarrow{AA'} = \frac{c}{\sqrt{2}}(1,1)$ onto the inward unit normal $\vec{n} = \frac{1}{c}(a, b)$ to $AB$: $h_r = \overrightarrow{AA'} \cdot \vec{n} = \frac{a+b}{\sqrt{2}}$.)*
- Rhombus area:
  $$S_r = c \cdot h_r = \frac{c(a + b)}{\sqrt{2}}$$
- Reference hypotenuse square area:
  $$S_c = c^2 = a^2 + b^2$$
- Area and height ratio:
  $$\eta_S = \frac{S_r}{S_c} = \frac{h_r}{c} = \frac{a + b}{\sqrt{2(a^2 + b^2)}} = \frac{1}{\sqrt{1 + A^2}}$$
  with bounds $\frac{1}{\sqrt{2}} < \eta_S \le 1$ for finite $a, b > 0$ (equality $\eta_S = 1$ iff $a = b$).

### E.4 Diagonals
- Diagonal vectors:
  $$\overrightarrow{AB'} = B' - A = \left(b + \frac{c}{\sqrt{2}}, \; \frac{c}{\sqrt{2}} - a\right), \qquad \overrightarrow{BA'} = A' - B = \left(\frac{c}{\sqrt{2}} - b, \; a + \frac{c}{\sqrt{2}}\right)$$
- Analytical diagonal lengths:
  $$d_1^2 = 2c^2 + \sqrt{2}\,c(b - a), \qquad d_2^2 = 2c^2 - \sqrt{2}\,c(b - a)$$
  $$d_1 = 2c\cos\frac{\varphi_A}{2}, \qquad d_2 = 2c\sin\frac{\varphi_A}{2}$$
- Orthogonality and parallelogram identity:
  $$\overrightarrow{AB'} \cdot \overrightarrow{BA'} = 0, \qquad d_1^2 + d_2^2 = 4c^2, \qquad \frac{d_1 d_2}{2} = S_r$$

### E.5 Asymmetry Measures and Reciprocal Compensation
- Signed asymmetry measure $q(t) = \frac{t - 1}{t + 1} = \frac{b - a}{a + b}$ satisfies $q(1/t) = -q(t)$:
  - $q = 0$: square symmetry ($a = b$);
  - $q > 0$: horizontal leg $b > a$ ($\varphi_A < 90^\circ < \varphi_B$);
  - $q < 0$: vertical leg $a > b$ ($\varphi_A > 90^\circ > \varphi_B$).
- Magnitude measure $A(t) = |q(t)|$ satisfies $A(1/t) = A(t)$.
- Angular deviation from $90^\circ$: $\Delta\varphi = \arctan(A)$, so $\varphi_A = 90^\circ - \operatorname{sgn}(q)\Delta\varphi$ and $\varphi_B = 90^\circ + \operatorname{sgn}(q)\Delta\varphi$.
- Reciprocal compensation pair:
  $$\eta_S = \frac{1}{\sqrt{1 + A^2}}, \qquad \eta_L = \sqrt{1 + A^2}, \qquad \eta_S \cdot \eta_L = 1$$

*Terminological Note:* $A(t)$ is a dimensionless **asymmetry indicator** relative to the symmetric reference $t = 1$, not a general distance metric $d(t_1, t_2)$ on the space of triangles.

---

## F. Nine Invariants

All nine invariants are implemented in `validateInvariants(calc, tol = 1e-9)` (`src/math/GeometryValidators.ts`) using **dimensionless, scale-normalized residuals** `delta` and independent coordinate-vector checks.

| # | ID | Mathematical Formulation | Domain | Programmatic Computation (Scale-Normalized) | Expected Value / Range | Verification Method | Proof Status |
|---|---|---|---|---|---|---|---|
| 1 | `sides_equality` | $AB = BB' = B'A' = A'A = c$ | $a, b > 0$ | `max(\|hypot_dist - c\|) / c` over all 4 edges | $\Delta = 0$ ($\Delta < 10^{-9}$) | Unit test, mutation test & live UI | **Mathematically proven** (vector norms) |
| 2 | `supplementary_angles` | $\varphi_A + \varphi_B = 180^\circ$ | $a, b > 0$ | `max(\|anaSum - 180\|, \|vecSum - 180\|) / 180` | $180^\circ$ ($\Delta < 10^{-9}$) | Unit test, mutation test & live UI | **Mathematically proven** ($\alpha + \beta = 90^\circ$) |
| 3 | `opposite_angles` | $\varphi_A = \varphi_{B'}, \; \varphi_B = \varphi_{A'}$ | $a, b > 0$ | Oriented CCW `atan2` interior angles at all 4 vertices $(A, B, B', A')$, cross-checked with `phi*_deg`, `/ 180` | $\Delta = 0$ ($\Delta < 10^{-9}$) | Unit test, fault-injection & live UI | **Mathematically proven** (parallelogram property) |
| 4 | `orthogonal_diagonals` | $d_1 \perp d_2 \; (\overrightarrow{AB'} \cdot \overrightarrow{BA'} = 0)$ | $a, b > 0$ | Normalized unit-vector cosine $\|\hat{d}_1 \cdot \hat{d}_2\|$ from vertex coordinates and stored vectors | $0$ ($\Delta < 10^{-9}$) | Unit test, scale test & live UI | **Mathematically proven** (rhombus property / direct vector dot product) |
| 5 | `parallelogram_identity` | $(d_1^2 + d_2^2)/(4c^2) = 1$ | $a, b > 0$ | `(d1/(2c))^2 + (d2/(2c))^2 - 1` using coordinate `hypot` diagonals and analytical `d1, d2` | $1$ ($\Delta < 10^{-9}$) | Unit test, scale test & live UI | **Mathematically proven** (algebraic sum of $d_1^2, d_2^2$) |
| 6 | `area_consistency` | $S_r = \frac{d_1 d_2}{2} = c \cdot h_r$ | $1.49\cdot 10^{-154} \lesssim a,b \lesssim 1.34\cdot 10^{154}$ | Relative residual between coordinate shoelace area, $(d_1 d_2)/2$, and $c \cdot h_r$ (enforces $S_r, h_r, d_1, d_2 > 0$) | $\Delta = 0$ ($\Delta < 10^{-9}$) | Unit test, counterexample & live UI | **Mathematically proven** ($d_1^2 d_2^2 = 4c^4 - 2c^2(b-a)^2 = 2c^2(a+b)^2$) |
| 7 | `ratio_invariant` | $\frac{S_r}{S_c} = \frac{h_r}{c} = \eta_S = \frac{1}{\sqrt{1 + A^2}}$ | $1.49\cdot 10^{-154} \lesssim a,b \lesssim 1.34\cdot 10^{154}$ | `max(\|Sr/Sc - etaS\|, \|hr/c - etaS\|)` (enforces positive areas & factors) | $\in (1/\sqrt{2}, 1]$ ($\Delta < 10^{-9}$) | Unit test, counterexample & live UI | **Mathematically proven** (algebraic substitution of $A = \|b-a\|/(a+b)$) |
| 8 | `reciprocal_compensation` | $\eta_S \cdot \eta_L = (h_r/c)\cdot \eta_L = 1$ | $a, b > 0$ | `max(\|etaS * etaL - 1\|, \|(hr/c) * etaL - 1\|)` | $1$ ($\Delta < 10^{-9}$) | Unit test & live UI | **Mathematically proven** (definition $\eta_L = 1/\eta_S$) |
| 9 | `guiding_parallelism` | $\angle(D_a A) = \angle(D_b B) = \angle(AA') = \angle(BB') = +45^\circ$ | $a, b > 0$ | Normalized `atan2` of square diagonals $(A - D_a, B - D_b)$, rhombus edges $(A' - A, B' - B)$, and `directionE` | $45^\circ$ ($\Delta < 10^{-9}$) | Unit test, fault-injection & live UI | **Mathematically proven** ($\overrightarrow{D_a A}=(a,a), \overrightarrow{D_b B}=(b,b)$) |

---

## G. Five Control Configurations

Measured directly from `calculatePythagoreanPants(a, b)` and `validateInvariants(calc)` via `src/tests/geometry.test.ts` (all 5 pass 9/9 scale-normalized invariants):

| Case $(a, b)$ | Expected State | $c$ | $t = b/a$ | $q(t)$ | $A(t)$ | $\varphi_A$ | $\varphi_B$ | $S_r$ | $S_c$ | $\eta_S$ | $d_1$ | $d_2$ | Max $\Delta$ |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **(4, 4)** | Square symmetry | 5.6569 | 1.000 | 0.0000 | 0.0000 | 90.000° | 90.000° | 32.000 | 32.000 | 1.0000 | 8.0000 | 8.0000 | $5.55 \times 10^{-16}$ |
| **(4, 2)** | Vertical leg longer | 4.4721 | 0.500 | -0.3333 | 0.3333 | 108.435° | 71.565° | 18.974 | 20.000 | 0.9487 | 5.2298 | 7.2560 | $2.34 \times 10^{-16}$ |
| **(2, 4)** | Horizontal leg longer | 4.4721 | 2.000 | +0.3333 | 0.3333 | 71.565° | 108.435° | 18.974 | 20.000 | 0.9487 | 7.2560 | 5.2298 | $2.34 \times 10^{-16}$ |
| **(1, 10)** | Strong bias ($q > 0$) | 10.0499 | 10.000 | +0.8182 | 0.8182 | 50.711° | 129.289° | 78.170 | 101.000 | 0.7740 | 18.1635 | 8.6073 | $2.22 \times 10^{-16}$ |
| **(10, 1)** | Strong bias ($q < 0$) | 10.0499 | 0.100 | -0.8182 | 0.8182 | 129.289° | 50.711° | 78.170 | 101.000 | 0.7740 | 8.6073 | 18.1635 | $2.22 \times 10^{-16}$ |

---

## H. Proofs and Verification

To prevent conflating numerical testing with formal proof:

1. **Strictly Proven Mathematical Statements (Analytic / Coordinate-Vector Proofs):**
   - $ABB'A'$ is a rhombus for all $a, b > 0$ when $L = c$ (from $\overrightarrow{A'B'} = \overrightarrow{AB} = (b,-a)$ and $\|\overrightarrow{AA'}\| = \|\overrightarrow{BB'}\| = \|c\vec{e}\| = c$).
   - Exact interior angle formulas $\varphi_A = 45^\circ + \beta = 90^\circ - \arctan q$ and $\varphi_B = 45^\circ + \alpha = 90^\circ + \arctan q$, and $\varphi_A + \varphi_B = 180^\circ$.
   - Rhombus height $h_r = (a+b)/\sqrt{2}$, area $S_r = c(a+b)/\sqrt{2}$, diagonal identities $d_1^2 + d_2^2 = 4c^2$, $\overrightarrow{AB'} \cdot \overrightarrow{BA'} = 0$, and $d_1 d_2 / 2 = S_r$.
   - Dimensionless ratio identity $\frac{S_r}{S_c} = \frac{h_r}{c} = \frac{1}{\sqrt{1 + A^2}}$ with strict maximum $1$ at $t = 1$ ($a = b$) and open lower bound $\lim_{t \to 0^+} \eta_S = \lim_{t \to +\infty} \eta_S = \frac{1}{\sqrt{2}}$.
   - Anti-symmetry / evenness under leg swap $t \mapsto 1/t$: $q(1/t) = -q(t)$ and $A(1/t) = A(t)$.

2. **Computationally Verified Statements (`src/tests/geometry.test.ts`):**
   - Floating-point execution of all 9 scale-normalized invariants across the 5 control configurations ($\Delta \le 5.55 \times 10^{-16}$), small scales ($10^{-12}$), large scales (up to $10^{150}$ for all 9 invariants and $10^{200}$ for length/angle invariants), and leg-swap duality $(2,5) \leftrightarrow (5,2)$.
   - Strict rejection of invalid inputs (`0`, `< 0`, `NaN`, `±Infinity`) via `InvalidTriangleInputError`.
   - Fault-injection mutation tests confirming detection of coordinate shifts, angle drift, guiding-diagonal skew, and self-intersecting vertex swaps.
   - Differential equivalence verification between Path A (`calculatePythagoreanPants`) and Path B (`calculateRhombusFromSquaresPathB`) across 13 configurations (relative errors $< 10^{-12}$, angles $< 10^{-11}$ deg).

3. **Experimentally Verified Properties (Interactive UI Exploration):**
   - Continuous sweep transition $t < 1 \to t = 1 \to t > 1$ demonstrates smooth passage through the square state ($q = 0$) and angle inversion between $\varphi_A$ and $\varphi_B$.
   - Visual verification of Euclid I.47 windmill shearing and $(a+b)^2$ dissection in Module 02.

4. **Hypotheses / Future Research Directions (Not Yet Implemented or Proven in v1.0):**
   - Generalization to non-orthogonal triangles ($\angle AOB \ne 90^\circ$) or non-square exterior polygons on the legs.
   - Defining a true metric space $d(t_1, t_2)$ on triangle shape classes (currently only $A(t)$ relative to $t=1$ is defined).
   - 3D spatial extensions (cubes/prisms on orthogonal triads) — intentionally deferred until 2D specification v1.0 is fully consolidated.

---

## I. Boundary Conditions

The computational core enforces a strict two-layer input contract:

- **Strict Math Core Contract (`0 < a, b < ∞`, finite numbers only):**
  - `assertValidLeg` / `assertValidLegs` (`src/math/inputValidation.ts`) throws `InvalidTriangleInputError` (`RangeError`) for `0`, negative numbers (`< 0`), `NaN`, `+Infinity`, and `-Infinity` across `calculateRightTriangle`, `calculateSquareA`, `calculateSquareB`, `calculatePythagoreanPants`, and `calculateRhombusFromSquaresPathB`.
  - Small positive numbers `< 0.01` (such as $10^{-12}$) are preserved without clamping.
- **UI Ergonomic Guarding:**
  - `App.tsx` guards non-finite values to `1` and clamps interactive legs to $[0.2, 15]$; `GeometryBoard.tsx` drag handler clamps to $[0.5, 15]$; `ControlsPanel.tsx` sliders span $[0.5, 12]$.
- **Asymptotic Degeneration ($t \to 0^+$ or $t \to +\infty$):**
  - For fixed $a > 0$ as $b \to +\infty$, the horizontal leg and hypotenuse grow without bound; only the scale-normalized shape and dimensionless quantities ($q \to 1$, $A \to 1$, $\eta_S \to 1/\sqrt{2}$, $\varphi_A \to 45^\circ$, $\varphi_B \to 135^\circ$) remain finite. The lower bound $S_r > \frac{1}{\sqrt{2}} c^2$ is never attained for any non-degenerate finite triangle.

---

## J. Limitations

1. **Strict Orthogonality Assumption:** The model assumes $\angle AOB = 90^\circ$ at $O=(0,0)$ with legs aligned to the coordinate axes; arbitrary rotations or oblique triangles are outside v1.0.
2. **IEEE-754 `float64` Area, Coordinate & Mantissa Precision Limits:**
   - Although `Math.hypot` and scale-factored formulas keep $c, d_1, d_2, h_r, q, \varphi_A, \varphi_B$ finite up to $\sim 10^{307}$, quadratic area quantities ($S_r, S_c, a^2, b^2$) physically overflow `Number.MAX_VALUE` above $\sim 1.34 \times 10^{154}$ and underflow below $\sim 1.49 \times 10^{-154}$ (subnormal floor $\sim 2.2 \times 10^{-162}$), causing `area_consistency` and `ratio_invariant` to report `isValid: false` outside that range.
   - Coordinate representation of shifted vertices $A'$ and $B'$ overflows `Number.MAX_VALUE` when $a + c/\sqrt{2}$ or $b + c/\sqrt{2}$ exceeds $1.7977 \times 10^{308}$ (above $\sim 7.45 \times 10^{307}$ symmetric).
   - At extreme aspect ratios ($t > 2^{53} \approx 9 \times 10^{15}$), adding/subtracting $a$ and $c/\sqrt{2}$ in shifted coordinates loses `float64` mantissa bits of the minor leg, so raw coordinate subtraction in Path B is bounded by IEEE-754 53-bit significand precision.
3. **Interactive Viewport Clamping:** Dragging and UI inputs restrict $a, b \in [0.2, 15]$ to keep SVG labels and shapes legible; extreme scales and ratios require calling the TypeScript core directly.
