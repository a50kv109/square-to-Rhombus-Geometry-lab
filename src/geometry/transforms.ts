/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Point2D } from '../types/geometry.ts';

/**
 * Transforms Cartesian math point to SVG screen coordinates.
 * Y axis is flipped because SVG y grows downwards.
 */
export function toScreen(p: Point2D, origin: Point2D, scale: number): Point2D {
  return {
    x: origin.x + p.x * scale,
    y: origin.y - p.y * scale,
  };
}

/**
 * Transforms SVG screen coordinates back to Cartesian math coordinates.
 */
export function toMath(screenP: Point2D, origin: Point2D, scale: number): Point2D {
  return {
    x: (screenP.x - origin.x) / scale,
    y: (origin.y - screenP.y) / scale,
  };
}

/**
 * Formats a point as (x, y) with fixed precision.
 */
export function formatPoint(p: Point2D, precision = 2): string {
  return `(${p.x.toFixed(precision)}, ${p.y.toFixed(precision)})`;
}
