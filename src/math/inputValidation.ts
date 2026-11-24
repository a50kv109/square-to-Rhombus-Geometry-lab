/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export class InvalidTriangleInputError extends RangeError {
  readonly paramName: 'a' | 'b';
  readonly value: number;

  constructor(paramName: 'a' | 'b', value: number) {
    super(
      `Invalid leg parameter "${paramName}": expected a finite positive number (> 0), received ${String(value)}.`
    );
    this.name = 'InvalidTriangleInputError';
    this.paramName = paramName;
    this.value = value;
  }
}

export function assertValidLeg(value: number, paramName: 'a' | 'b'): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    throw new InvalidTriangleInputError(paramName, value);
  }
  return value;
}

export function assertValidLegs(a: number, b: number): [number, number] {
  return [assertValidLeg(a, 'a'), assertValidLeg(b, 'b')];
}
