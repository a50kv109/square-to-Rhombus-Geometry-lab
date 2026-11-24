/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Point2D, RightTriangleCalculations } from '../types/geometry.ts';
import { assertValidLegs } from './inputValidation.ts';

const RAD2DEG = 180 / Math.PI;

/**
 * Calculates all analytical properties of a right triangle OAB:
 * O = (0, 0) - Right angle vertex
 * A = (0, a) - Top vertex on positive y-axis (a > 0)
 * B = (b, 0) - Right vertex on positive x-axis (b > 0)
 */
export function calculateRightTriangle(a: number, b: number): RightTriangleCalculations {
  const [validA, validB] = assertValidLegs(a, b);
  const c = Math.hypot(validA, validB);

  // α is the angle at vertex A (between leg OA and hypotenuse AB): tan(α) = b / a
  const alphaRad = Math.atan2(validB, validA);
  const alphaDeg = alphaRad * RAD2DEG;

  // β is the angle at vertex B (between leg OB and hypotenuse AB): tan(β) = a / b
  const betaRad = Math.atan2(validA, validB);
  const betaDeg = betaRad * RAD2DEG;

  const area = (validA * validB) / 2;
  const perimeter = validA + validB + c;

  // Overflow-safe direction cosines along hypotenuse AB
  const cosAlpha = validA / c;
  const sinAlpha = validB / c;

  // Altitude from right angle O to hypotenuse AB: hc = a * b / c = a * sin(alpha)
  const altitude = validA * sinAlpha;

  // Projection of O onto AB: H = (b * (a/c)^2, a * (b/c)^2)
  const altitudePoint: Point2D = {
    x: validB * cosAlpha * cosAlpha,
    y: validA * sinAlpha * sinAlpha,
  };

  // Projections of legs on hypotenuse
  const projectionA = validA * cosAlpha; // AH = a^2 / c
  const projectionB = validB * sinAlpha; // BH = b^2 / c

  return {
    O: { x: 0, y: 0 },
    A: { x: 0, y: validA },
    B: { x: validB, y: 0 },
    a: validA,
    b: validB,
    c,
    alphaRad,
    alphaDeg,
    betaRad,
    betaDeg,
    area,
    perimeter,
    altitude,
    altitudePoint,
    projectionA,
    projectionB,
  };
}
