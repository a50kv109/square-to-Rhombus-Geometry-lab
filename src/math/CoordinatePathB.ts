/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Point2D, PythagoreanPantsCalculations, SquareVertices, Vector2D } from '../types/geometry.ts';
import { assertValidLegs } from './inputValidation.ts';
import { calculateSquareA, calculateSquareB } from './SquareConstruction.ts';

const RAD2DEG = 180 / Math.PI;

export interface PathBResult {
  squareA: SquareVertices;
  squareB: SquareVertices;
  A: Point2D;
  B: Point2D;
  A_prime: Point2D;
  B_prime: Point2D;
  directionE: Vector2D;
  sideLength: number;
  phiA_deg: number;
  phiB_deg: number;
  phiB_prime_deg: number;
  phiA_prime_deg: number;
  d1: number;
  d2: number;
  areaRhombus: number;
  height: number;
  areaSquareHypotenuse: number;
  t: number;
  q: number;
  A_asymmetry: number;
  etaS: number;
  etaL: number;
}

export interface DifferentialComparison {
  maxVertexRelDiff: number;
  sideRelDiff: number;
  maxAngleDiffDeg: number;
  maxDiagRelDiff: number;
  areaRelDiff: number;
  heightRelDiff: number;
  asymmetryDiff: number;
  etaDiff: number;
}

function normalizeVec(v: Vector2D): Vector2D {
  const norm = Math.hypot(v.x, v.y);
  if (!Number.isFinite(norm) || norm <= 0) {
    throw new RangeError('Cannot normalize degenerate vector in Path B.');
  }
  return { x: v.x / norm, y: v.y / norm };
}

function interiorAngleDeg(u: Vector2D, v: Vector2D): number {
  const nu = normalizeVec(u);
  const nv = normalizeVec(v);
  const cross = nu.x * nv.y - nu.y * nv.x;
  const dot = nu.x * nv.x + nu.y * nv.y;
  let rad = Math.atan2(cross, dot);
  if (rad < 0) rad += 2 * Math.PI;
  return rad * RAD2DEG;
}

/**
 * Independent Coordinate Path (Path B):
 * Computes the rhombus and all derived metrics directly from exterior leg squares Qa and Qb
 * without calling RightTriangle or using analytical angle/diagonal formulas.
 */
export function calculateRhombusFromSquaresPathB(a: number, b: number): PathBResult {
  const [validA, validB] = assertValidLegs(a, b);

  const squareA = calculateSquareA(validA);
  const squareB = calculateSquareB(validB);

  const A = squareA.legVertex;
  const B = squareB.legVertex;

  // Guiding vectors directly from exterior square diagonals Da->A and Db->B
  const vA: Vector2D = {
    x: squareA.designatedDiagEnd.x - squareA.designatedDiagStart.x,
    y: squareA.designatedDiagEnd.y - squareA.designatedDiagStart.y,
  };
  const vB: Vector2D = {
    x: squareB.designatedDiagEnd.x - squareB.designatedDiagStart.x,
    y: squareB.designatedDiagEnd.y - squareB.designatedDiagStart.y,
  };

  const eA = normalizeVec(vA);
  const eB = normalizeVec(vB);
  const directionE: Vector2D = normalizeVec({ x: eA.x + eB.x, y: eA.y + eB.y });

  // Side length strictly as Euclidean distance between leg vertices A and B
  const sideLength = Math.hypot(B.x - A.x, B.y - A.y);

  // Closure along square-derived guiding directions
  const A_prime: Point2D = {
    x: A.x + sideLength * eA.x,
    y: A.y + sideLength * eA.y,
  };
  const B_prime: Point2D = {
    x: B.x + sideLength * eB.x,
    y: B.y + sideLength * eB.y,
  };

  // All 4 interior angles computed strictly from vertex coordinate vectors
  const phiA_deg = interiorAngleDeg(
    { x: B.x - A.x, y: B.y - A.y },
    { x: A_prime.x - A.x, y: A_prime.y - A.y }
  );
  const phiB_deg = interiorAngleDeg(
    { x: B_prime.x - B.x, y: B_prime.y - B.y },
    { x: A.x - B.x, y: A.y - B.y }
  );
  const phiB_prime_deg = interiorAngleDeg(
    { x: A_prime.x - B_prime.x, y: A_prime.y - B_prime.y },
    { x: B.x - B_prime.x, y: B.y - B_prime.y }
  );
  const phiA_prime_deg = interiorAngleDeg(
    { x: A.x - A_prime.x, y: A.y - A_prime.y },
    { x: B_prime.x - A_prime.x, y: B_prime.y - A_prime.y }
  );

  // Diagonals strictly as coordinate Euclidean distances
  const d1 = Math.hypot(B_prime.x - A.x, B_prime.y - A.y);
  const d2 = Math.hypot(A_prime.x - B.x, A_prime.y - B.y);

  // Height and area via 2D cross product of adjacent edges (overflow-safe height first)
  const edgeAB_unit: Vector2D = {
    x: (B.x - A.x) / sideLength,
    y: (B.y - A.y) / sideLength,
  };
  const edgeAAprime: Vector2D = {
    x: A_prime.x - A.x,
    y: A_prime.y - A.y,
  };
  const height = Math.abs(edgeAB_unit.x * edgeAAprime.y - edgeAB_unit.y * edgeAAprime.x);
  const areaRhombus = sideLength * height;

  // Hypotenuse square area from sum of leg square areas (fallback to c^2)
  const areaSquareHypotenuse = squareA.area + squareB.area;

  // Asymmetry directly from square side lengths
  const sA = squareA.side;
  const sB = squareB.side;
  const t = sB / sA;
  const maxS = Math.max(sA, sB);
  const q = (sB / maxS - sA / maxS) / (sB / maxS + sA / maxS);
  const A_asymmetry = Math.abs(q);

  // Dimensionless ratio etaS = hr / c (equals Sr / Sc when areas are finite)
  const etaS = height / sideLength;
  const etaL = 1 / etaS;

  return {
    squareA,
    squareB,
    A,
    B,
    A_prime,
    B_prime,
    directionE,
    sideLength,
    phiA_deg,
    phiB_deg,
    phiB_prime_deg,
    phiA_prime_deg,
    d1,
    d2,
    areaRhombus,
    height,
    areaSquareHypotenuse,
    t,
    q,
    A_asymmetry,
    etaS,
    etaL,
  };
}

/**
 * Computes differential discrepancies between Path A (RightTriangle + analytical formulas)
 * and Path B (pure square-derived coordinate vectors).
 */
export function comparePathAAndPathB(
  pathA: PythagoreanPantsCalculations,
  pathB: PathBResult
): DifferentialComparison {
  const c = pathA.sideLength;
  const maxVertexRelDiff =
    Math.max(
      Math.hypot(pathA.A_prime.x - pathB.A_prime.x, pathA.A_prime.y - pathB.A_prime.y),
      Math.hypot(pathA.B_prime.x - pathB.B_prime.x, pathA.B_prime.y - pathB.B_prime.y)
    ) / c;

  const sideRelDiff = Math.abs(pathA.sideLength - pathB.sideLength) / c;

  const maxAngleDiffDeg = Math.max(
    Math.abs(pathA.phiA_deg - pathB.phiA_deg),
    Math.abs(pathA.phiB_deg - pathB.phiB_deg),
    Math.abs(pathA.phiB_prime_deg - pathB.phiB_prime_deg),
    Math.abs(pathA.phiA_prime_deg - pathB.phiA_prime_deg)
  );

  const maxDiagRelDiff = Math.max(
    Math.abs(pathA.d1 - pathB.d1) / pathA.d1,
    Math.abs(pathA.d2 - pathB.d2) / pathA.d2
  );

  const areaRelDiff =
    Number.isFinite(pathA.areaRhombus) && Number.isFinite(pathB.areaRhombus)
      ? Math.abs(pathA.areaRhombus - pathB.areaRhombus) / pathA.areaRhombus
      : NaN;

  const heightRelDiff = Math.abs(pathA.height - pathB.height) / pathA.height;

  const asymmetryDiff = Math.max(
    Math.abs(pathA.q - pathB.q),
    Math.abs(pathA.A - pathB.A_asymmetry)
  );

  const etaDiff = Math.max(
    Math.abs(pathA.etaS - pathB.etaS),
    Math.abs(pathA.etaL - pathB.etaL)
  );

  return {
    maxVertexRelDiff,
    sideRelDiff,
    maxAngleDiffDeg,
    maxDiagRelDiff,
    areaRelDiff,
    heightRelDiff,
    asymmetryDiff,
    etaDiff,
  };
}
