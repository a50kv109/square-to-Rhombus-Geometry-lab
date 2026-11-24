/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { InvariantValidation, Point2D, PythagoreanPantsCalculations, Vector2D } from '../types/geometry.ts';

const DEFAULT_TOLERANCE = 1e-9;
const RAD2DEG = 180 / Math.PI;
const INV_SQRT_2 = 1 / Math.SQRT2;

function dist(p1: Point2D, p2: Point2D): number {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

function sub(p1: Point2D, p2: Point2D): Vector2D {
  return { x: p1.x - p2.x, y: p1.y - p2.y };
}

function normalize(v: Vector2D): Vector2D | null {
  const norm = Math.hypot(v.x, v.y);
  if (!Number.isFinite(norm) || norm <= 0) {
    return null;
  }
  return { x: v.x / norm, y: v.y / norm };
}

function unitDot(u: Vector2D, v: Vector2D): number {
  const nu = normalize(u);
  const nv = normalize(v);
  if (!nu || !nv) return NaN;
  return nu.x * nv.x + nu.y * nv.y;
}

/**
 * Computes the oriented interior angle in degrees [0, 360) from vector u to vector v
 * for a counter-clockwise polygon boundary. Reflex/flipped vertices produce angles > 180°.
 */
function interiorAngleCCWDeg(u: Vector2D, v: Vector2D): number {
  const nu = normalize(u);
  const nv = normalize(v);
  if (!nu || !nv) return NaN;
  const cross = nu.x * nv.y - nu.y * nv.x;
  const dot = nu.x * nv.x + nu.y * nv.y;
  let rad = Math.atan2(cross, dot);
  if (rad < 0) rad += 2 * Math.PI;
  return rad * RAD2DEG;
}

function vectorAngleDeg(v: Vector2D): number {
  const nv = normalize(v);
  if (!nv) return NaN;
  return Math.atan2(nv.y, nv.x) * RAD2DEG;
}

/**
 * Validates all geometric and analytical invariants for the Pythagorean Pants model.
 * All residuals `delta` are dimensionless / scale-normalized for numerical stability across scales.
 */
export function validateInvariants(calc: PythagoreanPantsCalculations, tol = DEFAULT_TOLERANCE): InvariantValidation[] {
  const { triangle, squareA, squareB, A_prime, B_prime } = calc;
  const c = calc.sideLength;
  const hasValidScale = Number.isFinite(c) && c > 0;

  // 1. All four sides equal hypotenuse c (Rhombus definition) — relative error / c
  const l_AB = dist(triangle.A, triangle.B);
  const l_BBprime = dist(triangle.B, B_prime);
  const l_BprimeAprime = dist(B_prime, A_prime);
  const l_AprimeA = dist(A_prime, triangle.A);
  const maxSideRelDev = hasValidScale
    ? Math.max(
        Math.abs(l_AB - c),
        Math.abs(l_BBprime - c),
        Math.abs(l_BprimeAprime - c),
        Math.abs(l_AprimeA - c)
      ) / c
    : NaN;

  // Independent coordinate-vector interior angles along polygon A -> B -> B' -> A'
  const phiA_vec = interiorAngleCCWDeg(sub(triangle.B, triangle.A), sub(A_prime, triangle.A));
  const phiB_vec = interiorAngleCCWDeg(sub(B_prime, triangle.B), sub(triangle.A, triangle.B));
  const phiBprime_vec = interiorAngleCCWDeg(sub(A_prime, B_prime), sub(triangle.B, B_prime));
  const phiAprime_vec = interiorAngleCCWDeg(sub(triangle.A, A_prime), sub(B_prime, A_prime));

  // 2. Supplementary adjacent angles (phiA + phiB = 180°) — normalized by 180°
  const angleSumAnalytical = calc.phiA_deg + calc.phiB_deg;
  const angleSumCoord = phiA_vec + phiB_vec;
  const deltaAngleSum =
    Math.max(Math.abs(angleSumAnalytical - 180), Math.abs(angleSumCoord - 180)) / 180;

  // 3. Opposite angles equality — independent coordinate-vector calculation at all 4 vertices
  const deltaOpposite =
    Math.max(
      Math.abs(phiA_vec - phiBprime_vec),
      Math.abs(phiB_vec - phiAprime_vec),
      Math.abs(phiA_vec - calc.phiA_deg),
      Math.abs(phiB_vec - calc.phiB_deg),
      Math.abs(phiBprime_vec - calc.phiB_prime_deg),
      Math.abs(phiAprime_vec - calc.phiA_prime_deg)
    ) / 180;

  // 4. Diagonal orthogonality: normalized cosine |(AB' · BA') / (||AB'|| ||BA'||)| = 0
  const diag1Coord = sub(B_prime, triangle.A);
  const diag2Coord = sub(A_prime, triangle.B);
  const cosDiagCoord = unitDot(diag1Coord, diag2Coord);
  const cosDiagStored = unitDot(calc.diagVector1, calc.diagVector2);
  const deltaDot = Math.max(Math.abs(cosDiagCoord), Math.abs(cosDiagStored));

  // 5. Parallelogram identity: (d1 / (2c))^2 + (d2 / (2c))^2 = 1 (overflow-free & coordinate-checked)
  const d1_coord = dist(triangle.A, B_prime);
  const d2_coord = dist(triangle.B, A_prime);
  const deltaDiagSq = hasValidScale
    ? Math.max(
        Math.abs((d1_coord / (2 * c)) ** 2 + (d2_coord / (2 * c)) ** 2 - 1),
        Math.abs((calc.d1 / (2 * c)) ** 2 + (calc.d2 / (2 * c)) ** 2 - 1),
        Math.abs(d1_coord - calc.d1) / c,
        Math.abs(d2_coord - calc.d2) / c
      )
    : NaN;

  // 6. Area consistency: coordinate shoelace area == (d1 * d2)/2 == c * hr (normalized)
  let deltaArea = NaN;
  if (
    hasValidScale &&
    Number.isFinite(calc.areaRhombus) &&
    calc.areaRhombus > 0 &&
    Number.isFinite(calc.height) &&
    calc.height > 0 &&
    Number.isFinite(calc.d1) &&
    calc.d1 > 0 &&
    Number.isFinite(calc.d2) &&
    calc.d2 > 0
  ) {
    const u = { x: (triangle.B.x - triangle.A.x) / c, y: (triangle.B.y - triangle.A.y) / c };
    const v = { x: (B_prime.x - triangle.A.x) / c, y: (B_prime.y - triangle.A.y) / c };
    const w = { x: (A_prime.x - triangle.A.x) / c, y: (A_prime.y - triangle.A.y) / c };
    const areaCoordNorm = 0.5 * Math.abs(u.x * v.y - u.y * v.x + (v.x * w.y - v.y * w.x));
    const areaDiagsNorm = 0.5 * (calc.d1 / c) * (calc.d2 / c);
    const areaDiagsCoordNorm = 0.5 * (d1_coord / c) * (d2_coord / c);
    const heightNorm = calc.height / c;
    const relDiagArea = Math.abs((calc.d1 / calc.areaRhombus) * (calc.d2 / 2) - 1);

    deltaArea = Math.max(
      relDiagArea,
      Math.abs(areaDiagsNorm - heightNorm) / heightNorm,
      Math.abs(areaDiagsCoordNorm - areaCoordNorm) / heightNorm,
      Math.abs(areaCoordNorm - heightNorm) / heightNorm
    );
  }
  const areaFromDiags = (calc.d1 * calc.d2) / 2;

  // 7. Area and height ratio invariant: Sr / Sc == hr / c == etaS
  const hasPositiveAreas =
    Number.isFinite(calc.areaRhombus) &&
    calc.areaRhombus > 0 &&
    Number.isFinite(calc.areaSquareHypotenuse) &&
    calc.areaSquareHypotenuse > 0;
  const hasPositiveHeight = Number.isFinite(calc.height) && calc.height > 0;
  const hasPositiveEta =
    Number.isFinite(calc.etaS) && calc.etaS > 0 && Number.isFinite(calc.etaL) && calc.etaL > 0;

  const areaRatio = hasPositiveAreas ? calc.areaRhombus / calc.areaSquareHypotenuse : NaN;
  const heightRatio = hasValidScale && hasPositiveHeight ? calc.height / c : NaN;
  const deltaRatio = hasPositiveEta
    ? Math.max(Math.abs(areaRatio - calc.etaS), Math.abs(heightRatio - calc.etaS))
    : NaN;

  // 8. Reciprocal compensation: etaS * etaL == 1 and (hr / c) * etaL == 1
  const productEta = calc.etaS * calc.etaL;
  const deltaEtaProduct = hasPositiveEta
    ? Math.max(Math.abs(productEta - 1), Math.abs(heightRatio * calc.etaL - 1))
    : NaN;

  // 9. Leg square diagonal direction & rhombus edge alignment: computed directly from vertices
  const diagAVec = sub(squareA.designatedDiagEnd, squareA.designatedDiagStart);
  const diagBVec = sub(squareB.designatedDiagEnd, squareB.designatedDiagStart);
  const edgeAAprime = sub(A_prime, triangle.A);
  const edgeBBprime = sub(B_prime, triangle.B);

  const angleDaA = vectorAngleDeg(diagAVec);
  const angleDbB = vectorAngleDeg(diagBVec);
  const angleAAprime = vectorAngleDeg(edgeAAprime);
  const angleBBprime = vectorAngleDeg(edgeBBprime);
  const dirEDev = Math.hypot(calc.directionE.x - INV_SQRT_2, calc.directionE.y - INV_SQRT_2);

  const deltaGuideAngles = Math.max(
    Math.abs(angleDaA - 45) / 180,
    Math.abs(angleDbB - 45) / 180,
    Math.abs(angleAAprime - 45) / 180,
    Math.abs(angleBBprime - 45) / 180,
    dirEDev
  );

  return [
    {
      id: 'sides_equality',
      name: 'Равенство четырёх сторон',
      formula: 'AB = BB\' = B\'A\' = A\'A = c',
      description: 'Все стороны четырёхугольника равны гипотенузе c (относительная невязка Δl / c).',
      calculatedValue: `l ≈ ${((l_AB + l_BBprime + l_BprimeAprime + l_AprimeA) / 4).toPrecision(6)}`,
      expectedValue: `c = ${c.toPrecision(6)}`,
      delta: maxSideRelDev,
      isValid: Number.isFinite(maxSideRelDev) && maxSideRelDev < tol,
      tolerance: tol,
    },
    {
      id: 'supplementary_angles',
      name: 'Сумма соседних углов',
      formula: '\\varphi_A + \\varphi_B = 180^\\circ',
      description: 'Внутренние углы при смежных вершинах ромба (аналитические и векторные) в сумме дают 180°.',
      calculatedValue: `${angleSumCoord.toFixed(6)}°`,
      expectedValue: '180.000000°',
      delta: deltaAngleSum,
      isValid: Number.isFinite(deltaAngleSum) && deltaAngleSum < tol,
      tolerance: tol,
    },
    {
      id: 'opposite_angles',
      name: 'Равенство противоположных углов',
      formula: '\\varphi_A = \\varphi_{B\'}, \\quad \\varphi_B = \\varphi_{A\'}',
      description: 'Независимый векторный расчёт всех 4 внутренних углов по координатам вершин A, B, B\', A\'.',
      calculatedValue: `φ_A=${phiA_vec.toFixed(4)}°, φ_B'=${phiBprime_vec.toFixed(4)}°`,
      expectedValue: `φ_B=${phiB_vec.toFixed(4)}°, φ_A'=${phiAprime_vec.toFixed(4)}°`,
      delta: deltaOpposite,
      isValid: Number.isFinite(deltaOpposite) && deltaOpposite < tol,
      tolerance: tol,
    },
    {
      id: 'orthogonal_diagonals',
      name: 'Ортогональность диагоналей',
      formula: 'd_1 \\perp d_2 \\;\\; (|AB\' \\cdot BA\'| / (\\lVert AB\' \\rVert \\cdot \\lVert BA\' \\rVert) = 0)',
      description: 'Масштабно-нормированное скалярное произведение векторов диагоналей равно нулю.',
      calculatedValue: cosDiagCoord.toExponential(4),
      expectedValue: '0.0000',
      delta: deltaDot,
      isValid: Number.isFinite(deltaDot) && deltaDot < tol,
      tolerance: tol,
    },
    {
      id: 'parallelogram_identity',
      name: 'Сумма квадратов диагоналей',
      formula: '(d_1^2 + d_2^2) / (4c^2) = 1',
      description: 'Нормированное тождество параллелограмма с проверкой диагоналей по координатам вершин.',
      calculatedValue: `${((d1_coord / (2 * c)) ** 2 + (d2_coord / (2 * c)) ** 2).toFixed(8)}`,
      expectedValue: '1.00000000',
      delta: deltaDiagSq,
      isValid: Number.isFinite(deltaDiagSq) && deltaDiagSq < tol,
      tolerance: tol,
    },
    {
      id: 'area_consistency',
      name: 'Согласованность площади',
      formula: 'S_r = (d_1 \\cdot d_2) / 2 = c \\cdot h_r',
      description: 'Согласованность координатной (шнуровой) площади, диагональной площади и c · h_r.',
      calculatedValue: Number.isFinite(areaFromDiags) ? areaFromDiags.toPrecision(6) : 'Overflow',
      expectedValue: Number.isFinite(calc.areaRhombus) ? calc.areaRhombus.toPrecision(6) : 'Overflow',
      delta: deltaArea,
      isValid: Number.isFinite(deltaArea) && deltaArea < tol,
      tolerance: tol,
    },
    {
      id: 'ratio_invariant',
      name: 'Отношение площади к квадрату гипотенузы',
      formula: 'S_r / S_c = h_r / c = \\eta_S = 1 / \\sqrt{1 + A^2}',
      description: 'Безразмерное отношение площади ромба к квадрату на гипотенузе равно η_S.',
      calculatedValue: Number.isFinite(areaRatio) ? areaRatio.toFixed(6) : 'Overflow',
      expectedValue: calc.etaS.toFixed(6),
      delta: deltaRatio,
      isValid: Number.isFinite(deltaRatio) && deltaRatio < tol,
      tolerance: tol,
    },
    {
      id: 'reciprocal_compensation',
      name: 'Инвариант взаимной компенсации',
      formula: '\\eta_S \\cdot \\eta_L = (h_r / c) \\cdot \\eta_L = 1',
      description: 'Произведение площадной согласованности (и h_r/c) и линейной характеристики равно 1.',
      calculatedValue: productEta.toFixed(6),
      expectedValue: '1.000000',
      delta: deltaEtaProduct,
      isValid: Number.isFinite(deltaEtaProduct) && deltaEtaProduct < tol,
      tolerance: tol,
    },
    {
      id: 'guiding_parallelism',
      name: 'Направляющий механизм диагоналей',
      formula: '\\angle(D_a A) = \\angle(D_b B) = \\angle(AA\') = \\angle(BB\') = +45^\\circ',
      description: 'Внешние диагонали квадратов Qa, Qb и боковые рёбра AA\', BB\' сонаправлены под +45°.',
      calculatedValue: `${angleDaA.toFixed(2)}° & ${angleDbB.toFixed(2)}°`,
      expectedValue: '45.00°',
      delta: deltaGuideAngles,
      isValid: Number.isFinite(deltaGuideAngles) && deltaGuideAngles < tol,
      tolerance: tol,
    },
  ];
}
