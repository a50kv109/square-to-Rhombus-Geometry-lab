# Architecture Documentation — Pythagoras Geometry Lab

**Standard:** Mathematical Research Stand Documentation Standard (MRSDS) — Layer 4 (Computational Model)  
**Stack:** React 19, TypeScript, Vite, Tailwind CSS v4, SVG, KaTeX, `tsx`

---

## 1. Core Architectural Principle: Math–UI Separation

The repository enforces a strict separation between the **pure analytical computation core** (`src/math/`) and the **interactive presentation layer** (`src/components/`, `src/geometry/`):

- `src/math/*` contains **zero** imports from `react`, `react-dom`, DOM APIs, or SVG utilities.
- Given scalar parameters $(a, b)$, `calculatePythagoreanPants(a, b)` acts as a single deterministic pure function returning the complete `PythagoreanPantsCalculations` state object.
- Visual components (`RightTriangleView`, `SquaresView`, `RhombusView`, `PythagoreanProofView`) never recompute geometric formulas independently (aside from affine screen projection `toScreen` and SVG visual primitives like perpendicular-foot projection for rendering $h_r$ and angle arcs).

---

## 2. Directory & Module Structure

```text
/
├── index.html                     # Entry HTML, Google Fonts (Plus Jakarta Sans, JetBrains Mono), KaTeX CSS
├── metadata.json                  # AI Studio applet metadata
├── package.json                   # Package manifest, Vite scripts, test script (tsx)
├── LICENSE                        # Apache License 2.0
├── README.md                      # Bilingual scientific-engineering documentation (RU + EN)
├── docs/
│   ├── MATHEMATICAL_SPEC_v1.0.md       # Formal mathematical model, 9 invariants, float64 boundaries
│   ├── MATHEMATICAL_FOUNDATION_v1.0.md # Axiomatics, Theorems 1–6 proofs, Path A/B independence audit
│   ├── INVARIANT_PROOFS_v1.0.md        # 11-point mathematical passports for all 9 invariants
│   ├── NUMERICAL_ANALYSIS_v1.0.md      # IEEE-754 float64 limits, conditioning & stabilization
│   ├── VERIFICATION_MATRIX_v1.0.md     # Consolidated verification status table
│   └── ARCHITECTURE.md                 # Computational & UI architecture (this document)
└── src/
    ├── App.tsx                    # Root state coordinator, Undo/Redo history, snapshot export, modals
    ├── main.tsx                   # React root mount
    ├── index.css                  # Tailwind CSS v4 import & custom scrollbar
    ├── types/
    │   └── geometry.ts            # Shared TypeScript interfaces & calculation contracts
    ├── i18n/
    │   └── translations.ts        # Multi-language dictionary (ru, uk, en)
    ├── math/                      # PURE COMPUTATIONAL CORE (React/SVG-independent)
    │   ├── inputValidation.ts     # Strict finite positive leg contract (InvalidTriangleInputError)
    │   ├── RightTriangle.ts       # Layer L1: triangle OAB, angles α/β, altitude hc, projections
    │   ├── SquareConstruction.ts  # Layers L1–L2: exterior squares Qa, Qb & universal vector e
    │   ├── PythagoreanPants.ts    # Layer L3: rhombus ABB'A', diagonals, heights, q, A, ηS, ηL
    │   ├── CoordinatePathB.ts     # Vector/coordinate path (independent of RightTriangle/trig; shares SquareConstruction)
    │   ├── GeometryValidators.ts  # 9 scale-normalized invariant checks against tolerance 1e-9 (with >0 finite guards)
    │   └── presets.ts             # 8 benchmark & classical configurations
    ├── geometry/
    │   └── transforms.ts          # Cartesian <-> SVG screen coordinate transforms (toScreen, toMath)
    ├── components/
    │   ├── common/
    │   │   ├── Header.tsx         # Top 3-zone bar & mobile module tabs
    │   │   ├── BottomToolbar.tsx  # Undo/Redo, Reset, Save/Load JSON, PNG/SVG export, Step anim, Lang
    │   │   ├── MathFormula.tsx    # KaTeX LaTeX formula renderer
    │   │   └── MetricCard.tsx     # Tabular-numeric metric card
    │   ├── geometry/
    │   │   ├── GeometryBoard.tsx  # Interactive SVG canvas, pan/zoom, layer toggles, hover HUD
    │   │   ├── CoordinateGrid.tsx # Adaptive grid lines & Cartesian axes
    │   │   ├── InteractivePoint.tsx # Axis-constrained draggable vertices A & B
    │   │   ├── RightTriangleView.tsx # Triangle OAB, angle arcs α/β, altitude hc
    │   │   ├── SquaresView.tsx    # Squares Qa, Qb, designated diagonals DaA/DbB, guiding rays
    │   │   ├── RhombusView.tsx    # Rhombus ABB'A', arcs φ, height hr, diagonals d1/d2, Sc overlay
    │   │   └── PythagoreanProofView.tsx # Module 02 proofs: Euclid I.47 & (a+b)² dissection
    │   ├── modules/
    │   │   ├── ModuleRightTriangle.tsx      # Module 01 metrics & trig ratios
    │   │   ├── ModulePythagoreanTheorem.tsx # Module 02 area balance & Euclid breakdown
    │   │   └── ModuleExperiments.tsx        # Module 04 live SVG plots of q(t), A(t), ηS(t)
    │   └── panels/
    │       ├── ControlsPanel.tsx  # Synchronized sliders, numeric inputs, presets, symmetry sweep
    │       ├── ResearchPanel.tsx  # School/Research modes, q-gauge, formulas, coordinates, layers
    │       ├── InvariantsPanel.tsx # Live status & delta display for all 9 invariants
    │       ├── ComparisonModal.tsx # Side-by-side miniature SVG & metric comparison
    │       ├── TestRunnerModal.tsx # In-app benchmark verification matrix (5 cases)
    │       └── HelpModal.tsx      # Mathematical & structural reference modal
    └── tests/
        └── geometry.test.ts       # Node/tsx suite (benchmarks, scales 1e-200..1e200, mutations/counterexamples, Path A vs B)
```

---

## 3. Data Flow (Reactive Construction DAG)

Every state change propagates synchronously through a single unidirectional dependency graph:

```text
User Input (Mouse Drag on A/B | Sliders | Numeric Inputs | Presets | Symmetry Sweep | Load JSON)
        │
        ▼
  App.tsx state: (a, b) + Undo/Redo History Stack
        │
        ▼  [useMemo]
  calculatePythagoreanPants(a, b)  [src/math/PythagoreanPants.ts]
        ├──► calculateRightTriangle(a, b)         → O, A, B, c, α, β, h_c, c_a, c_b
        ├──► calculateSquareA(a)                  → Q_a, D_a A
        ├──► calculateSquareB(b)                  → Q_b, D_b B
        ├──► getUniversalDirectionVector()        → e = (1/√2, 1/√2)
        └──► Rhombus & Asymmetry Engine           → A', B', φ_A, φ_B, h_r, S_r, d_1, d_2, t, q, A, η_S, η_L
        │
        ├──────────────────────────────┬──────────────────────────────┐
        ▼                              ▼                              ▼
  GeometryBoard (SVG)           Research & Module Panels      validateInvariants(calc)
  (toScreen projection)         (MetricCards, KaTeX, Plots)   (9 live delta assertions)
```

---

## 4. Construction & Rendering Algorithms

### 4.1 Coordinate Mapping (`src/geometry/transforms.ts`)
- `toScreen(p, origin, scale)` converts mathematical coordinates $(x, y)$ into SVG pixel coordinates $(x_{\text{origin}} + x \cdot s, y_{\text{origin}} - y \cdot s)$.
- `toMath(screenP, origin, scale)` inverts the mapping during pointer drag events.

### 4.2 Axis-Constrained Dragging (`GeometryBoard.tsx`)
- Vertex $O$ has no drag handler and remains fixed at $(0, 0)$.
- Dragging vertex $A$ projects cursor screen coordinates via `toMath`, discards the $x$-component, and clamps $y \in [0.5, 15]$ rounded to $0.1$, guaranteeing $A = (0, a)$ stays on $+Oy$.
- Dragging vertex $B$ discards the $y$-component and clamps $x \in [0.5, 15]$ rounded to $0.1$, guaranteeing $B = (b, 0)$ stays on $+Ox$.
- History snapshots are pushed on `pointerup` (`onCommitDrag`) rather than every intermediate `pointermove` frame so Undo/Redo steps remain discrete and clean.

### 4.3 Snapshot Export (`App.tsx`)
- **SVG export:** Serializes the live `<svg>` DOM tree via `XMLSerializer` into an `image/svg+xml` Blob download.
- **PNG export:** Serializes the `<svg>`, loads it into an offscreen `HTMLImageElement`, draws at $2\times$ resolution onto an `<canvas>` with `#f8fafc` background fill, and exports `image/png`.

---

## 5. Testing Architecture

Verification operates at two complementary levels:

1. **Automated CLI Suite (`src/tests/geometry.test.ts`):**
   - Executed via `npm test` (`tsx src/tests/geometry.test.ts`).
   - Uses `node:assert/strict` with scale-normalized tolerance `1e-9`.
   - Tests all 5 benchmark configurations `[(4,4), (4,2), (2,4), (1,10), (10,1)]` against all 9 invariant IDs from `validateInvariants`, exact vertex coordinates, state-specific angle inequalities, and leg-swap duality $(2,5) \leftrightarrow (5,2)$.
   - Includes strict invalid-input rejection tests, small/large scale & extreme asymmetry tests (`1e-12`, `1e-200` $L^2$ underflow, `1e150`, `1e200` $L^2$ overflow, `1e20` asymmetry), fault-injection & negative-value sign-cancellation counterexample tests (`Mutation 5e`/`5f`), and Path A vs Path B differential verification (`CoordinatePathB.ts`; independent of `RightTriangle` and trigonometric formulas while sharing `SquareConstruction.ts`).
2. **In-App Live Validation (`GeometryValidators.ts`, `InvariantsPanel.tsx`, `TestRunnerModal.tsx`):**
   - Evaluates all 9 scale-normalized invariants on every render of $(a, b)$ and surfaces numerical residuals $\Delta$ and real pass/fail status in real time.

---

## 6. Runtime Notes & Template Artifacts

- **Client-Only Execution:** All mathematical calculations, state persistence (`localStorage` / JSON import-export), and rendering run purely in the browser.
- **Template Dependencies:** `package.json` and `metadata.json` retain base environment entries (`express`, `@google/genai`, `dotenv`, `MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API`) from the AI Studio starter template; they are not invoked at runtime by the current client-side stand.
- **Localization Architecture:** `src/i18n/translations.ts` defines typed translation dictionaries for `ru`, `uk`, and `en`. Navigation, board controls, toolbar actions, and asymmetry state descriptions update dynamically on language switch; extended pedagogical text blocks in modals and secondary panels currently remain in Russian (`ru`).
