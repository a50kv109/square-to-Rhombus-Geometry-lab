/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SquareVertices, Vector2D } from '../types/geometry.ts';
import { assertValidLeg } from './inputValidation.ts';

const INV_SQRT_2 = 1 / Math.SQRT2;

/**
 * Calculates exterior square Qa on vertical leg OA:
 * Vertices: O(0,0), A(0,a), Ca(-a, a), Da(-a, 0)
 * Designated diagonal: DaA from Da(-a, 0) to A(0, a)
 */
export function calculateSquareA(a: number): SquareVertices {
  const validA = assertValidLeg(a, 'a');
  return {
    O: { x: 0, y: 0 },
    legVertex: { x: 0, y: validA },       // A
    outerVertex: { x: -validA, y: validA }, // Ca
    baseVertex: { x: -validA, y: 0 },      // Da
    designatedDiagStart: { x: -validA, y: 0 }, // Da
    designatedDiagEnd: { x: 0, y: validA },    // A
    side: validA,
    area: validA * validA,
  };
}

/**
 * Calculates exterior square Qb on horizontal leg OB:
 * Vertices: O(0,0), B(b,0), Cb(b, -b), Db(0, -b)
 * Designated diagonal: DbB from Db(0, -b) to B(b, 0)
 */
export function calculateSquareB(b: number): SquareVertices {
  const validB = assertValidLeg(b, 'b');
  return {
    O: { x: 0, y: 0 },
    legVertex: { x: validB, y: 0 },        // B
    outerVertex: { x: validB, y: -validB }, // Cb
    baseVertex: { x: 0, y: -validB },      // Db
    designatedDiagStart: { x: 0, y: -validB }, // Db
    designatedDiagEnd: { x: validB, y: 0 },    // B
    side: validB,
    area: validB * validB,
  };
}

/**
 * Returns the universal unit direction vector e = (1/√2, 1/√2)
 * determined by the designated diagonals of Qa and Qb.
 */
export function getUniversalDirectionVector(): Vector2D {
  return {
    x: INV_SQRT_2,
    y: INV_SQRT_2,
  };
}
