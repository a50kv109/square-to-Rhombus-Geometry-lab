/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import assert from 'node:assert/strict';
import { calculatePythagoreanPants } from '../math/PythagoreanPants.ts';
import { calculateRightTriangle } from '../math/RightTriangle.ts';
import { calculateSquareA, calculateSquareB } from '../math/SquareConstruction.ts';
import { validateInvariants } from '../math/GeometryValidators.ts';
import { InvalidTriangleInputError } from '../math/inputValidation.ts';
import {
  calculateRhombusFromSquaresPathB,
  comparePathAAndPathB,
} from '../math/CoordinatePathB.ts';

const TOL = 1e-9;

const EXPECTED_INVARIANT_IDS = [
  'sides_equality',
  'supplementary_angles',
  'opposite_angles',
  'orthogonal_diagonals',
  'parallelogram_identity',
  'area_consistency',
  'ratio_invariant',
  'reciprocal_compensation',
  'guiding_parallelism',
];

function assertClose(actual: number, expected: number, message: string, tol = TOL) {
  const diff = Math.abs(actual - expected);
  assert.ok(diff <= tol, `${message}: expected ${expected}, got ${actual} (diff=${diff})`);
}

const benchmarkCases = [
  { a: 4, b: 4, expectedState: 'symmetry' },
  { a: 4, b: 2, expectedState: 'vertical' },
  { a: 2, b: 4, expectedState: 'horizontal' },
  { a: 1, b: 10, expectedState: 'horizontal' },
  { a: 10, b: 1, expectedState: 'vertical' },
];

console.log('Running Pythagoras Geometry Lab — Release Candidate v1.0 Test Suite...\n');

// ============================================================================
// 1. Original 5 Benchmark Configurations & 9 Invariant IDs
// ============================================================================
for (const tc of benchmarkCases) {
  const calc = calculatePythagoreanPants(tc.a, tc.b);
  const invariants = validateInvariants(calc, TOL);

  assert.deepEqual(
    invariants.map((inv) => inv.id),
    EXPECTED_INVARIANT_IDS,
    'Invariant IDs must match specification v1.0'
  );

  for (const inv of invariants) {
    assert.ok(inv.isValid, `[${tc.a}, ${tc.b}] Invariant failed: ${inv.name} (delta=${inv.delta})`);
  }

  // Right angle at O(0,0) and leg coordinates
  assertClose(calc.triangle.O.x, 0, 'O.x');
  assertClose(calc.triangle.O.y, 0, 'O.y');
  assertClose(calc.triangle.A.x, 0, 'A.x');
  assertClose(calc.triangle.A.y, tc.a, 'A.y');
  assertClose(calc.triangle.B.x, tc.b, 'B.x');
  assertClose(calc.triangle.B.y, 0, 'B.y');

  // Exterior squares Qa and Qb positions
  assertClose(calc.squareA.outerVertex.x, -tc.a, 'Ca.x');
  assertClose(calc.squareA.outerVertex.y, tc.a, 'Ca.y');
  assertClose(calc.squareA.baseVertex.x, -tc.a, 'Da.x');
  assertClose(calc.squareA.baseVertex.y, 0, 'Da.y');

  assertClose(calc.squareB.outerVertex.x, tc.b, 'Cb.x');
  assertClose(calc.squareB.outerVertex.y, -tc.b, 'Cb.y');
  assertClose(calc.squareB.baseVertex.x, 0, 'Db.x');
  assertClose(calc.squareB.baseVertex.y, -tc.b, 'Db.y');

  // Designated diagonals & direction vector e = (1/sqrt(2), 1/sqrt(2))
  assertClose(calc.directionE.x, 1 / Math.SQRT2, 'e.x');
  assertClose(calc.directionE.y, 1 / Math.SQRT2, 'e.y');

  // Coordinates A' and B'
  const c = Math.hypot(tc.a, tc.b);
  assertClose(calc.A_prime.x, c / Math.SQRT2, "A'.x");
  assertClose(calc.A_prime.y, tc.a + c / Math.SQRT2, "A'.y");
  assertClose(calc.B_prime.x, tc.b + c / Math.SQRT2, "B'.x");
  assertClose(calc.B_prime.y, c / Math.SQRT2, "B'.y");

  // State-specific angle & asymmetry checks
  if (tc.expectedState === 'symmetry') {
    assertClose(calc.t, 1, 'Symmetry t=1');
    assertClose(calc.q, 0, 'Symmetry q=0');
    assertClose(calc.A, 0, 'Symmetry A=0');
    assertClose(calc.phiA_deg, 90, 'Symmetry phiA=90');
    assertClose(calc.phiB_deg, 90, 'Symmetry phiB=90');
    assertClose(calc.d1, calc.d2, 'Symmetry d1=d2');
    assertClose(calc.areaRhombus, calc.areaSquareHypotenuse, 'Symmetry Sr=Sc');
  } else if (tc.expectedState === 'horizontal') {
    assert.ok(calc.q > 0, `Expected q > 0 for (${tc.a}, ${tc.b})`);
    assert.ok(calc.phiA_deg < 90 && calc.phiB_deg > 90, 'Expected acute phiA, obtuse phiB');
  } else {
    assert.ok(calc.q < 0, `Expected q < 0 for (${tc.a}, ${tc.b})`);
    assert.ok(calc.phiA_deg > 90 && calc.phiB_deg < 90, 'Expected obtuse phiA, acute phiB');
  }

  console.log(`✓ Benchmark (a=${tc.a}, b=${tc.b}): all 9 invariants & coordinate assertions passed.`);
}

// ============================================================================
// 2. Original Duality Symmetry Under Leg Swap (a <-> b, i.e., t -> 1/t)
// ============================================================================
const c1 = calculatePythagoreanPants(2, 5);
const c2 = calculatePythagoreanPants(5, 2);
assertClose(c1.q, -c2.q, 'q(1/t) = -q(t)');
assertClose(c1.A, c2.A, 'A(1/t) = A(t)');
assertClose(c1.phiA_deg, c2.phiB_deg, 'Angles swap under leg swap');
assertClose(c1.areaRhombus, c2.areaRhombus, 'Area invariant under leg swap');
console.log('✓ Duality & leg-swap symmetry q(1/t) = -q(t), A(1/t) = A(t) passed.');

// ============================================================================
// 3. Strict Input Validation Contract (No Silent 0.01 Clamping in Math Core)
// ============================================================================
const invalidPairs: Array<[number, number]> = [
  [0, 4],
  [4, 0],
  [-5, 4],
  [4, -0.001],
  [NaN, 4],
  [4, NaN],
  [Infinity, 4],
  [4, Infinity],
  [-Infinity, 4],
];

for (const [ia, ib] of invalidPairs) {
  assert.throws(
    () => calculatePythagoreanPants(ia, ib),
    InvalidTriangleInputError,
    `calculatePythagoreanPants(${ia}, ${ib}) must reject invalid input`
  );
  assert.throws(
    () => calculateRightTriangle(ia, ib),
    InvalidTriangleInputError,
    `calculateRightTriangle(${ia}, ${ib}) must reject invalid input`
  );
  assert.throws(
    () => calculateRhombusFromSquaresPathB(ia, ib),
    InvalidTriangleInputError,
    `calculateRhombusFromSquaresPathB(${ia}, ${ib}) must reject invalid input`
  );
}
assert.throws(() => calculateSquareA(0), InvalidTriangleInputError);
assert.throws(() => calculateSquareA(-1), InvalidTriangleInputError);
assert.throws(() => calculateSquareB(NaN), InvalidTriangleInputError);
assert.throws(() => calculateSquareB(Infinity), InvalidTriangleInputError);
console.log('✓ Strict core input contract rejected all invalid values (0, <0, NaN, ±Infinity).');

// ============================================================================
// 4. Small-Scale, Large-Scale, Overflow-Free & Extreme Asymmetry Tests
// ============================================================================
const scaleAndAsymmetryCases: Array<[number, number]> = [
  [1e-4, 1e-4],
  [1e-12, 1e-12],
  [1e-8, 2e-8],
  [1, 1000],
  [1000, 1],
  [1, 1e4],
  [1e4, 1e4],
  [1, 1e6],
  [1e6, 1e6],
  [1, 1e10],
  [1e10, 1],
  [1e150, 1e150],
];

for (const [sa, sb] of scaleAndAsymmetryCases) {
  const calc = calculatePythagoreanPants(sa, sb);
  assert.equal(calc.triangle.a, sa, `Leg a=${sa} must not be clamped`);
  assert.equal(calc.triangle.b, sb, `Leg b=${sb} must not be clamped`);

  const invs = validateInvariants(calc, TOL);
  for (const inv of invs) {
    assert.ok(
      inv.isValid,
      `Scale/asymmetry case (${sa}, ${sb}) failed ${inv.id}: delta=${inv.delta}`
    );
  }
}

// Verify Math.hypot prevents premature c overflow at 1e200 (above sqrt(MAX_VALUE) ~ 1.34e154)
const hugeSymmetric = calculatePythagoreanPants(1e200, 1e200);
assert.ok(Number.isFinite(hugeSymmetric.sideLength), 'sideLength must remain finite at 1e200');
assert.ok(Number.isFinite(hugeSymmetric.d1) && Number.isFinite(hugeSymmetric.d2), 'd1/d2 must remain finite at 1e200');
assert.ok(Number.isFinite(hugeSymmetric.triangle.altitude), 'altitude must remain finite at 1e200');
assert.ok(
  Number.isFinite(hugeSymmetric.triangle.altitudePoint.x) &&
    Number.isFinite(hugeSymmetric.triangle.altitudePoint.y),
  'altitudePoint must remain finite at 1e200'
);
const hugeInvs = Object.fromEntries(validateInvariants(hugeSymmetric, TOL).map((i) => [i.id, i]));
for (const lengthOrAngleId of [
  'sides_equality',
  'supplementary_angles',
  'opposite_angles',
  'orthogonal_diagonals',
  'parallelogram_identity',
  'reciprocal_compensation',
  'guiding_parallelism',
]) {
  assert.ok(
    hugeInvs[lengthOrAngleId].isValid,
    `1e200 scale-free invariant ${lengthOrAngleId} should pass (delta=${hugeInvs[lengthOrAngleId].delta})`
  );
}
// Quadratic L^2 quantities physically overflow float64 above ~1.34e154 and must NOT report false valid
assert.equal(hugeInvs['area_consistency'].isValid, false, 'area_consistency must report float64 area overflow at 1e200');
assert.equal(hugeInvs['ratio_invariant'].isValid, false, 'ratio_invariant must report Sr/Sc overflow at 1e200');
console.log('✓ Small-scale (<0.01), large-scale (up to 1e150), 1e200 hypot, and extreme asymmetry tests passed.');

// ============================================================================
// 5. Mutation Tests (Fault Injection — Invariants Must Detect Broken Models)
// ============================================================================
// 5a. Perturb B_prime coordinate while leaving phiB_prime_deg untouched (must catch opposite_angles tautology)
{
  const base = calculatePythagoreanPants(4, 2);
  const mutated = {
    ...base,
    B_prime: { x: base.B_prime.x + 0.05, y: base.B_prime.y },
  };
  const invMap = Object.fromEntries(validateInvariants(mutated, TOL).map((i) => [i.id, i]));
  for (const id of [
    'opposite_angles',
    'sides_equality',
    'orthogonal_diagonals',
    'parallelogram_identity',
    'area_consistency',
    'guiding_parallelism',
  ]) {
    assert.equal(invMap[id].isValid, false, `Mutation 5a (B_prime shift) MUST fail ${id}`);
  }
}

// 5b. Perturb phiB_prime_deg scalar field directly while keeping valid coordinates
{
  const base = calculatePythagoreanPants(4, 2);
  const mutated = {
    ...base,
    phiB_prime_deg: base.phiB_prime_deg + 1.5,
  };
  const invMap = Object.fromEntries(validateInvariants(mutated, TOL).map((i) => [i.id, i]));
  assert.equal(invMap['opposite_angles'].isValid, false, 'Mutation 5b (phiB_prime_deg drift) MUST fail opposite_angles');
}

// 5c. Perturb squareA designated diagonal endpoint while keeping diagVectorA untouched
{
  const base = calculatePythagoreanPants(4, 2);
  const mutated = {
    ...base,
    squareA: {
      ...base.squareA,
      designatedDiagStart: {
        x: base.squareA.designatedDiagStart.x + 0.2,
        y: base.squareA.designatedDiagStart.y,
      },
    },
  };
  const invMap = Object.fromEntries(validateInvariants(mutated, TOL).map((i) => [i.id, i]));
  assert.equal(
    invMap['guiding_parallelism'].isValid,
    false,
    'Mutation 5c (squareA diagonal skew) MUST fail guiding_parallelism'
  );
}

// 5d. Swap A_prime and B_prime to create self-intersecting / flipped orientation
{
  const base = calculatePythagoreanPants(2, 4);
  const mutated = {
    ...base,
    A_prime: base.B_prime,
    B_prime: base.A_prime,
  };
  const invMap = Object.fromEntries(validateInvariants(mutated, TOL).map((i) => [i.id, i]));
  for (const id of [
    'opposite_angles',
    'supplementary_angles',
    'orthogonal_diagonals',
    'area_consistency',
    'guiding_parallelism',
  ]) {
    assert.equal(invMap[id].isValid, false, `Mutation 5d (crossed vertices) MUST fail ${id}`);
  }
}

// 5e. Sign-cancellation counterexamples: negative height, negative diagonals, negative eta pair
{
  const base = calculatePythagoreanPants(4, 2);
  const negHeightInv = Object.fromEntries(
    validateInvariants({ ...base, height: -5 }, TOL).map((i) => [i.id, i])
  );
  assert.equal(negHeightInv['area_consistency'].isValid, false, 'Negative height MUST fail area_consistency');
  assert.equal(negHeightInv['ratio_invariant'].isValid, false, 'Negative height MUST fail ratio_invariant');

  const negDiagInv = Object.fromEntries(
    validateInvariants({ ...base, d1: -base.d1, d2: -base.d2 }, TOL).map((i) => [i.id, i])
  );
  assert.equal(negDiagInv['area_consistency'].isValid, false, 'Negative diagonals MUST fail area_consistency');

  const negEtaInv = Object.fromEntries(
    validateInvariants({ ...base, etaS: -base.etaS, etaL: -base.etaL }, TOL).map((i) => [i.id, i])
  );
  assert.equal(negEtaInv['reciprocal_compensation'].isValid, false, 'Negative eta pair MUST fail reciprocal_compensation');
}

// 5f. Quadratic L^2 underflow boundary at 1e-200 (below ~1.34e-154)
{
  const tiny = calculatePythagoreanPants(1e-200, 1e-200);
  const tinyInvs = Object.fromEntries(validateInvariants(tiny, TOL).map((i) => [i.id, i]));
  assert.equal(tinyInvs['sides_equality'].isValid, true, '1e-200 sides_equality remains valid via Math.hypot');
  assert.equal(tinyInvs['area_consistency'].isValid, false, '1e-200 area_consistency must report float64 area underflow');
  assert.equal(tinyInvs['ratio_invariant'].isValid, false, '1e-200 ratio_invariant must report float64 area underflow');
}
console.log('✓ Fault-injection mutation & counterexample tests confirmed detection of coordinate, angle, sign, underflow, and orientation errors.');

// ============================================================================
// 6. Differential Verification: Path A (Analytical + RightTriangle) vs Path B (Squares-Only Coordinates)
// ============================================================================
const differentialCases: Array<[number, number]> = [
  [4, 4],
  [4, 2],
  [2, 4],
  [1, 10],
  [10, 1],
  [1e-8, 2e-8],
  [1e-12, 1e-12],
  [1, 1e4],
  [1e4, 1e4],
  [1, 1e6],
  [1e6, 1e6],
  [1e50, 2e50],
  [1e150, 1e150],
];

for (const [da, db] of differentialCases) {
  const pathA = calculatePythagoreanPants(da, db);
  const pathB = calculateRhombusFromSquaresPathB(da, db);
  const diff = comparePathAAndPathB(pathA, pathB);

  assert.ok(diff.maxVertexRelDiff < 1e-12, `Path A vs B vertex diff too large for (${da},${db}): ${diff.maxVertexRelDiff}`);
  assert.ok(diff.sideRelDiff < 1e-12, `Path A vs B side diff too large for (${da},${db}): ${diff.sideRelDiff}`);
  assert.ok(diff.maxAngleDiffDeg < 1e-11, `Path A vs B angle diff too large for (${da},${db}): ${diff.maxAngleDiffDeg}`);
  assert.ok(diff.maxDiagRelDiff < 1e-12, `Path A vs B diag diff too large for (${da},${db}): ${diff.maxDiagRelDiff}`);
  assert.ok(diff.areaRelDiff < 1e-12, `Path A vs B area diff too large for (${da},${db}): ${diff.areaRelDiff}`);
  assert.ok(diff.heightRelDiff < 1e-12, `Path A vs B height diff too large for (${da},${db}): ${diff.heightRelDiff}`);
  assert.ok(diff.asymmetryDiff < 1e-12, `Path A vs B asymmetry diff too large for (${da},${db}): ${diff.asymmetryDiff}`);
  assert.ok(diff.etaDiff < 1e-12, `Path A vs B eta diff too large for (${da},${db}): ${diff.etaDiff}`);
}
console.log('✓ Differential Path A vs Path B equivalence verified across 13 configurations (error < 1e-11).');

console.log('\nALL GEOMETRY RELEASE CANDIDATE v1.0 TESTS PASSED SUCCESSFULLY!');
