/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Point2D, PythagoreanPantsCalculations } from '../types/geometry.ts';
import { assertValidLegs } from './inputValidation.ts';
import { calculateRightTriangle } from './RightTriangle.ts';
import { calculateSquareA, calculateSquareB, getUniversalDirectionVector } from './SquareConstruction.ts';

const RAD2DEG = 180 / Math.PI;
const INV_SQRT_2 = 1 / Math.SQRT2;

/**
 * Calculates the complete analytical model for the "Pythagorean Pants"
 * construction: Rhombus on Hypotenuse guided by leg square diagonals.
 */
export function calculatePythagoreanPants(a: number, b: number): PythagoreanPantsCalculations {
  const [validA, validB] = assertValidLegs(a, b);

  const triangle = calculateRightTriangle(validA, validB);
  const squareA = calculateSquareA(validA);
  const squareB = calculateSquareB(validB);
  const directionE = getUniversalDirectionVector();

  const c = triangle.c;
  const cOverSqrt2 = c * INV_SQRT_2;

  // Closure rule (L3): AA' = BB' = c * e
  // A' = (c/√2, a + c/√2)
  // B' = (b + c/√2, c/√2)
  const A_prime: Point2D = {
    x: cOverSqrt2,
    y: validA + cOverSqrt2,
  };

  const B_prime: Point2D = {
    x: validB + cOverSqrt2,
    y: cOverSqrt2,
  };

  // Form parameter and overflow-safe asymmetry measures
  const t = validB / validA;
  const maxLeg = Math.max(validA, validB);
  const normA = validA / maxLeg;
  const normB = validB / maxLeg;
  const q = (normB - normA) / (normB + normA); // (t - 1) / (t + 1)
  const A = Math.abs(q);

  // Rhombus Internal Angles
  // phiA = 45° + β = 135° - α = 90° - arctan(q)
  // phiB = 45° + α = 135° - β = 90° + arctan(q)
  const phiA_rad = Math.PI / 4 + triangle.betaRad;
  const phiA_deg = phiA_rad * RAD2DEG;

  const phiB_rad = Math.PI / 4 + triangle.alphaRad;
  const phiB_deg = phiB_rad * RAD2DEG;

  const phiB_prime_deg = phiA_deg;
  const phiA_prime_deg = phiB_deg;

  // Metric Characteristics (overflow-safe height)
  const height = validA * INV_SQRT_2 + validB * INV_SQRT_2;
  const areaRhombus = c * height;
  const perimeterRhombus = 4 * c;
  const areaSquareHypotenuse = c * c;

  // Diagonals
  // d1 = AB' from A(0, a) to B'(b + c/√2, c/√2)
  // d2 = BA' from B(b, 0) to A'(c/√2, a + c/√2)
  const diagVector1 = {
    x: B_prime.x - triangle.A.x,
    y: B_prime.y - triangle.A.y,
  };

  const diagVector2 = {
    x: A_prime.x - triangle.B.x,
    y: A_prime.y - triangle.B.y,
  };

  // Scale-factored diagonal formula: d = c * sqrt(2 ± sqrt(2) * (b - a) / c)
  // Avoids c^2 overflow while preserving exact identity for finite c.
  const legDiffOverC = (validB - validA) / c;
  const d1 = c * Math.sqrt(Math.max(0, 2 + Math.SQRT2 * legDiffOverC));
  const d2 = c * Math.sqrt(Math.max(0, 2 - Math.SQRT2 * legDiffOverC));
  const d1_squared = d1 * d1;
  const d2_squared = d2 * d2;

  // Guiding vectors derived directly from square diagonal endpoints
  const diagVectorA = {
    x: squareA.designatedDiagEnd.x - squareA.designatedDiagStart.x,
    y: squareA.designatedDiagEnd.y - squareA.designatedDiagStart.y,
  };
  const diagVectorB = {
    x: squareB.designatedDiagEnd.x - squareB.designatedDiagStart.x,
    y: squareB.designatedDiagEnd.y - squareB.designatedDiagStart.y,
  };

  // Asymmetry metrics
  const deltaPhiRad = Math.atan(A);
  const deltaPhiDeg = deltaPhiRad * RAD2DEG;
  const etaS = 1 / Math.sqrt(1 + A * A); // Sr / Sc
  const etaL = Math.sqrt(1 + A * A);

  return {
    triangle,
    squareA,
    squareB,
    diagVectorA,
    diagVectorB,
    directionE,
    directionAngleDeg: 45,
    A_prime,
    B_prime,
    sideLength: c,
    phiA_rad,
    phiA_deg,
    phiB_rad,
    phiB_deg,
    phiB_prime_deg,
    phiA_prime_deg,
    height,
    areaRhombus,
    perimeterRhombus,
    areaSquareHypotenuse,
    d1,
    d2,
    d1_squared,
    d2_squared,
    diagVector1,
    diagVector2,
    t,
    q,
    A,
    deltaPhiRad,
    deltaPhiDeg,
    etaS,
    etaL,
  };
}
