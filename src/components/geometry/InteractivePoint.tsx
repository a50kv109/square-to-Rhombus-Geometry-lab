/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HoveredObject, Point2D } from '../../types/geometry.ts';

interface InteractivePointProps {
  id: string;
  name: string;
  point: Point2D;
  mathCoord: Point2D;
  color: string;
  isDraggable?: boolean;
  axisConstraint?: 'x-axis' | 'y-axis' | 'none';
  onPointerDown?: (e: React.PointerEvent<SVGGElement>) => void;
  onHoverObject?: (obj: HoveredObject | null) => void;
  isDragging?: boolean;
}

export const InteractivePoint: React.FC<InteractivePointProps> = ({
  id,
  name,
  point,
  mathCoord,
  color,
  isDraggable = true,
  axisConstraint = 'none',
  onPointerDown,
  onHoverObject,
  isDragging = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const radius = isDragging ? 8 : isHovered ? 7 : 5.5;
  const labelText = `${name} (${mathCoord.x.toFixed(1)}, ${mathCoord.y.toFixed(1)})`;
  const boxWidth = Math.max(66, labelText.length * 6.8 + 12);

  const handleEnter = () => {
    setIsHovered(true);
    onHoverObject?.({
      id,
      title: `Вершина ${name}`,
      details: `Координаты: (${mathCoord.x.toFixed(2)}, ${mathCoord.y.toFixed(2)}) · ${
        axisConstraint === 'y-axis'
          ? 'Перемещение по вертикальной оси (x = 0)'
          : axisConstraint === 'x-axis'
          ? 'Перемещение по горизонтальной оси (y = 0)'
          : 'Фиксированная вершина'
      }`,
      category: 'vertex',
    });
  };

  const handleLeave = () => {
    setIsHovered(false);
    onHoverObject?.(null);
  };

  return (
    <g
      id={id}
      className={`interactive-point ${isDraggable ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}
      onPointerDown={onPointerDown}
      onPointerEnter={handleEnter}
      onPointerLeave={handleLeave}
      tabIndex={isDraggable ? 0 : -1}
      role="button"
      aria-label={`Вершина ${name}`}
    >
      {/* Glow / Hover effect ring */}
      {(isHovered || isDragging) && (
        <circle
          cx={point.x}
          cy={point.y}
          r={radius + 8}
          fill={color}
          fillOpacity={isDragging ? 0.35 : 0.2}
          className="transition-all"
        />
      )}

      {/* Axis constraint guideline while dragging */}
      {isDragging && axisConstraint === 'y-axis' && (
        <line
          x1={point.x}
          y1={-4000}
          x2={point.x}
          y2={4000}
          stroke={color}
          strokeWidth="1"
          strokeDasharray="3,3"
          opacity="0.6"
        />
      )}
      {isDragging && axisConstraint === 'x-axis' && (
        <line
          x1={-4000}
          y1={point.y}
          x2={4000}
          y2={point.y}
          stroke={color}
          strokeWidth="1"
          strokeDasharray="3,3"
          opacity="0.6"
        />
      )}

      {/* Invisible larger touch/click hit area */}
      <circle cx={point.x} cy={point.y} r={14} fill="transparent" />

      {/* Core Point Circle */}
      <circle
        cx={point.x}
        cy={point.y}
        r={radius}
        fill={color}
        stroke="#ffffff"
        strokeWidth="2.5"
        className="transition-all duration-75 shadow-sm"
      />

      {/* Label and coordinates */}
      <g
        transform={`translate(${point.x + 12}, ${point.y - 10})`}
        className="pointer-events-none select-none"
      >
        <rect
          x="-4"
          y="-13"
          width={boxWidth}
          height="19"
          rx="4"
          fill="#ffffff"
          fillOpacity="0.94"
          stroke="#cbd5e1"
          strokeWidth="1"
        />
        <text
          x={boxWidth / 2 - 4}
          y="0"
          textAnchor="middle"
          className="text-[11px] font-mono font-bold fill-slate-800"
        >
          {labelText}
        </text>
      </g>
    </g>
  );
};
