/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Point2D } from '../../types/geometry.ts';

interface CoordinateGridProps {
  width: number;
  height: number;
  origin: Point2D;
  scale: number;
  showGrid?: boolean;
  showAxes?: boolean;
}

export const CoordinateGrid: React.FC<CoordinateGridProps> = ({
  width,
  height,
  origin,
  scale,
  showGrid = true,
  showAxes = true,
}) => {
  // Determine suitable grid unit step based on zoom level
  const minPixelsPerUnit = 30;
  let unit = 1;
  if (scale < minPixelsPerUnit) {
    unit = scale < 15 ? 5 : 2;
  } else if (scale > 120) {
    unit = 0.5;
  }

  const stepPx = unit * scale;

  // Grid lines
  const lines: React.ReactNode[] = [];
  const labels: React.ReactNode[] = [];

  if (showGrid) {
    // Vertical grid lines
    const startX = origin.x % stepPx;
    for (let x = startX; x < width; x += stepPx) {
      const mathX = Math.round(((x - origin.x) / scale) * 100) / 100;
      const isAxis = Math.abs(x - origin.x) < 0.5;
      lines.push(
        <line
          key={`v-${x}`}
          x1={x}
          y1={0}
          x2={x}
          y2={height}
          stroke={isAxis ? '#94a3b8' : '#e2e8f0'}
          strokeWidth={isAxis ? 1.5 : 0.75}
          strokeDasharray={isAxis ? undefined : '2,2'}
        />
      );
      if (!isAxis && Math.abs(mathX) > 0.01) {
        labels.push(
          <text
            key={`lbl-x-${x}`}
            x={x}
            y={Math.min(height - 10, Math.max(16, origin.y + 14))}
            textAnchor="middle"
            className="text-[10px] font-mono fill-slate-400 select-none pointer-events-none"
          >
            {mathX}
          </text>
        );
      }
    }

    // Horizontal grid lines
    const startY = origin.y % stepPx;
    for (let y = startY; y < height; y += stepPx) {
      const mathY = Math.round(((origin.y - y) / scale) * 100) / 100;
      const isAxis = Math.abs(y - origin.y) < 0.5;
      lines.push(
        <line
          key={`h-${y}`}
          x1={0}
          y1={y}
          x2={width}
          y2={y}
          stroke={isAxis ? '#94a3b8' : '#e2e8f0'}
          strokeWidth={isAxis ? 1.5 : 0.75}
          strokeDasharray={isAxis ? undefined : '2,2'}
        />
      );
      if (!isAxis && Math.abs(mathY) > 0.01) {
        labels.push(
          <text
            key={`lbl-y-${y}`}
            x={Math.max(12, Math.min(width - 24, origin.x - 8))}
            y={y + 3}
            textAnchor="end"
            className="text-[10px] font-mono fill-slate-400 select-none pointer-events-none"
          >
            {mathY}
          </text>
        );
      }
    }
  }

  return (
    <g className="coordinate-grid">
      {lines}
      {showAxes && (
        <>
          {/* Main X Axis */}
          <line
            x1={0}
            y1={origin.y}
            x2={width}
            y2={origin.y}
            stroke="#64748b"
            strokeWidth={1.5}
          />
          {/* Main Y Axis */}
          <line
            x1={origin.x}
            y1={0}
            x2={origin.x}
            y2={height}
            stroke="#64748b"
            strokeWidth={1.5}
          />
          {/* Origin Label */}
          <text
            x={origin.x - 10}
            y={origin.y + 15}
            className="text-xs font-mono font-semibold fill-slate-600 select-none pointer-events-none"
          >
            O (0,0)
          </text>
          {/* Axis Labels */}
          <text
            x={width - 20}
            y={origin.y - 8}
            className="text-xs font-mono font-bold fill-slate-600 select-none pointer-events-none"
          >
            +X
          </text>
          <text
            x={origin.x + 8}
            y={20}
            className="text-xs font-mono font-bold fill-slate-600 select-none pointer-events-none"
          >
            +Y
          </text>
        </>
      )}
      {labels}
    </g>
  );
};
