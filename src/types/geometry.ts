/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Point2D {
  x: number;
  y: number;
}

export interface Vector2D {
  x: number;
  y: number;
}

export interface TriangleState {
  a: number; // Vertical leg OA (along y-axis)
  b: number; // Horizontal leg OB (along x-axis)
}

export interface RightTriangleCalculations {
  O: Point2D;
  A: Point2D;
  B: Point2D;
  a: number;
  b: number;
  c: number; // Hypotenuse
  alphaRad: number; // angle at A = arctan(b/a)
  alphaDeg: number;
  betaRad: number;  // angle at B = arctan(a/b)
  betaDeg: number;
  area: number;     // a * b / 2
  perimeter: number;// a + b + c
  altitude: number; // h_c = a * b / c
  altitudePoint: Point2D; // Projection of O onto AB
  projectionA: number; // c_a = a^2 / c
  projectionB: number; // c_b = b^2 / c
}

export interface SquareVertices {
  O: Point2D;
  legVertex: Point2D;
  outerVertex: Point2D;
  baseVertex: Point2D;
  designatedDiagStart: Point2D;
  designatedDiagEnd: Point2D;
  side: number;
  area: number;
}

export interface PythagoreanPantsCalculations {
  triangle: RightTriangleCalculations;
  squareA: SquareVertices; // Qa on OA (left of y-axis)
  squareB: SquareVertices; // Qb on OB (below x-axis)
  
  // Guiding mechanism (L2)
  diagVectorA: Vector2D; // (a, a)
  diagVectorB: Vector2D; // (b, b)
  directionE: Vector2D;  // (1/√2, 1/√2)
  directionAngleDeg: number; // 45°

  // Rhombus (L3)
  A_prime: Point2D; // (c/√2, a + c/√2)
  B_prime: Point2D; // (b + c/√2, c/√2)
  sideLength: number; // c
  
  // Rhombus Angles
  phiA_rad: number;
  phiA_deg: number; // ∠BAA' = 45° + β = 135° - α
  phiB_rad: number;
  phiB_deg: number; // ∠ABB' = 45° + α = 135° - β
  phiB_prime_deg: number; // ∠BB'A' = phiA
  phiA_prime_deg: number; // ∠B'A'A = phiB

  // Metrics
  height: number; // hr = (a + b) / √2
  areaRhombus: number; // Sr = c(a + b) / √2
  perimeterRhombus: number; // 4c
  areaSquareHypotenuse: number; // Sc = c^2
  
  // Diagonals
  d1: number; // AB'
  d2: number; // BA'
  d1_squared: number;
  d2_squared: number;
  diagVector1: Vector2D; // AB'
  diagVector2: Vector2D; // BA'
  
  // Asymmetry metrics
  t: number; // b / a
  q: number; // (t - 1) / (t + 1) = (b - a) / (a + b)
  A: number; // |q|
  deltaPhiRad: number; // arctan(A)
  deltaPhiDeg: number;
  etaS: number; // Sr / Sc = 1 / √(1 + A^2) = (a + b) / (√2 * c)
  etaL: number; // √(1 + A^2)
}

export interface InvariantValidation {
  id: string;
  name: string;
  formula: string;
  description: string;
  calculatedValue: string;
  expectedValue: string;
  delta: number;
  isValid: boolean;
  tolerance: number;
}

export interface PresetConfiguration {
  id: string;
  title: string;
  description: string;
  a: number;
  b: number;
  category: 'symmetry' | 'classical' | 'extreme' | 'benchmark';
}

export type ActiveModuleId = 'module_triangle' | 'module_pythagoras' | 'module_pants' | 'module_experiments';

export type DisplayMode = 'school' | 'research';

export type ProofVariant = 'euclid' | 'bhaskara';

export interface HoveredObject {
  id: string;
  title: string;
  details: string;
  category: 'vertex' | 'segment' | 'polygon' | 'ray';
}

export interface SavedConfiguration {
  id: string;
  name: string;
  a: number;
  b: number;
  savedAt: string;
}

