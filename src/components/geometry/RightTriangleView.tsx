/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HoveredObject, Point2D, RightTriangleCalculations } from '../../types/geometry.ts';
import { toScreen } from '../../geometry/transforms.ts';

interface RightTriangleViewProps {
  triangle: RightTriangleCalculations;
  origin: Point2D;
  scale: number;
  showLabels?: boolean;
  showAngles?: boolean;
  showAltitude?: boolean;
  onHoverObject?: (obj: HoveredObject | null) => void;
}

function describeSvgArc(
  cx: number,
  cy: number,
  radius: number,
  startAngleRad: number,
  endAngleRad: number
): string {
  const x1 = cx + radius * Math.cos(startAngleRad);
  const y1 = cy + radius * Math.sin(startAngleRad);
  const x2 = cx + radius * Math.cos(endAngleRad);
  const y2 = cy + radius * Math.sin(endAngleRad);

  let diff = endAngleRad - startAngleRad;
  while (diff < 0) diff += Math.PI * 2;
  while (diff >= Math.PI * 2) diff -= Math.PI * 2;
  const largeArcFlag = diff > Math.PI ? 1 : 0;

  return `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
}

export const RightTriangleView: React.FC<RightTriangleViewProps> = ({
  triangle,
  origin,
  scale,
  showLabels = true,
  showAngles = true,
  showAltitude = false,
  onHoverObject,
}) => {
  const pO = toScreen(triangle.O, origin, scale);
  const pA = toScreen(triangle.A, origin, scale);
  const pB = toScreen(triangle.B, origin, scale);
  const pH = toScreen(triangle.altitudePoint, origin, scale);

  // Right angle symbol at O (size in px)
  const raSize = Math.min(20, Math.min(triangle.a, triangle.b) * scale * 0.3);

  // Angle arcs in screen space (y down):
  // At A: AO points straight down (+PI/2), AB points at atan2(pB.y - pA.y, pB.x - pA.x)
  const angleAB_fromA = Math.atan2(pB.y - pA.y, pB.x - pA.x);
  const angleAO_fromA = Math.PI / 2;
  const arcR = Math.min(26, Math.min(triangle.a, triangle.b) * scale * 0.45);

  // At B: BO points straight left (PI), BA points at atan2(pA.y - pB.y, pA.x - pB.x)
  const angleBA_fromB = Math.atan2(pA.y - pB.y, pA.x - pB.x); // negative (up-left)
  const angleBO_fromB = -Math.PI;

  return (
    <g className="right-triangle-group">
      {/* Triangle fill */}
      <polygon
        points={`${pO.x},${pO.y} ${pA.x},${pA.y} ${pB.x},${pB.y}`}
        fill="#3b82f6"
        fillOpacity="0.12"
        stroke="#2563eb"
        strokeWidth="2.5"
        strokeLinejoin="round"
        className="cursor-pointer"
        onPointerEnter={() =>
          onHoverObject?.({
            id: 'triangle-OAB',
            title: 'Прямоугольный треугольник OAB',
            details: `Катеты a=${triangle.a.toFixed(2)}, b=${triangle.b.toFixed(2)}, гипотенуза c=${triangle.c.toFixed(3)}, S=${triangle.area.toFixed(2)}`,
            category: 'polygon',
          })
        }
        onPointerLeave={() => onHoverObject?.(null)}
      />

      {/* Angle arcs */}
      {showAngles && arcR > 10 && (
        <>
          <path
            d={describeSvgArc(pA.x, pA.y, arcR, angleAB_fromA, angleAO_fromA)}
            fill="#2563eb"
            fillOpacity="0.18"
            stroke="#2563eb"
            strokeWidth="1"
            className="pointer-events-none"
          />
          <path
            d={describeSvgArc(pB.x, pB.y, arcR, angleBO_fromB, angleBA_fromB)}
            fill="#2563eb"
            fillOpacity="0.18"
            stroke="#2563eb"
            strokeWidth="1"
            className="pointer-events-none"
          />
        </>
      )}

      {/* Right angle symbol at origin O */}
      {raSize > 8 && (
        <path
          d={`M ${pO.x} ${pO.y - raSize} L ${pO.x + raSize} ${pO.y - raSize} L ${pO.x + raSize} ${pO.y}`}
          fill="none"
          stroke="#2563eb"
          strokeWidth="1.5"
          className="pointer-events-none"
        />
      )}

      {/* Interactive hit-lines for sides OA, OB, AB */}
      <line
        x1={pO.x}
        y1={pO.y}
        x2={pA.x}
        y2={pA.y}
        stroke="transparent"
        strokeWidth="10"
        className="cursor-pointer"
        onPointerEnter={() =>
          onHoverObject?.({
            id: 'leg-a',
            title: 'Вертикальный катет OA',
            details: `Длина a = ${triangle.a.toFixed(3)} ед. · Проекция на гипотенузу c_a = ${triangle.projectionA.toFixed(3)}`,
            category: 'segment',
          })
        }
        onPointerLeave={() => onHoverObject?.(null)}
      />
      <line
        x1={pO.x}
        y1={pO.y}
        x2={pB.x}
        y2={pB.y}
        stroke="transparent"
        strokeWidth="10"
        className="cursor-pointer"
        onPointerEnter={() =>
          onHoverObject?.({
            id: 'leg-b',
            title: 'Горизонтальный катет OB',
            details: `Длина b = ${triangle.b.toFixed(3)} ед. · Проекция на гипотенузу c_b = ${triangle.projectionB.toFixed(3)}`,
            category: 'segment',
          })
        }
        onPointerLeave={() => onHoverObject?.(null)}
      />
      <line
        x1={pA.x}
        y1={pA.y}
        x2={pB.x}
        y2={pB.y}
        stroke="transparent"
        strokeWidth="10"
        className="cursor-pointer"
        onPointerEnter={() =>
          onHoverObject?.({
            id: 'hypotenuse-c',
            title: 'Гипотенуза AB',
            details: `Длина c = √(a²+b²) = ${triangle.c.toFixed(3)} ед. · Задаёт длину всех сторон ромба`,
            category: 'segment',
          })
        }
        onPointerLeave={() => onHoverObject?.(null)}
      />

      {/* Altitude to hypotenuse if enabled */}
      {showAltitude && (
        <>
          <line
            x1={pO.x}
            y1={pO.y}
            x2={pH.x}
            y2={pH.y}
            stroke="#0284c7"
            strokeWidth="1.8"
            strokeDasharray="4,3"
          />
          <circle cx={pH.x} cy={pH.y} r="3.5" fill="#0284c7" stroke="#fff" strokeWidth="1" />
          <text
            x={pH.x + 8}
            y={pH.y - 6}
            className="text-[10px] font-mono font-semibold fill-sky-700 select-none pointer-events-none"
          >
            H (h_c = {triangle.altitude.toFixed(2)})
          </text>
        </>
      )}

      {/* Side labels */}
      {showLabels && (
        <>
          <text
            x={pO.x - 10}
            y={(pO.y + pA.y) / 2}
            textAnchor="end"
            dominantBaseline="middle"
            className="text-xs font-mono font-bold fill-blue-700 select-none pointer-events-none"
          >
            a = {triangle.a.toFixed(2)}
          </text>

          <text
            x={(pO.x + pB.x) / 2}
            y={pO.y + 18}
            textAnchor="middle"
            className="text-xs font-mono font-bold fill-blue-700 select-none pointer-events-none"
          >
            b = {triangle.b.toFixed(2)}
          </text>

          <text
            x={(pA.x + pB.x) / 2 + 10}
            y={(pA.y + pB.y) / 2 - 8}
            className="text-xs font-mono font-bold fill-indigo-700 select-none pointer-events-none"
          >
            c = {triangle.c.toFixed(2)}
          </text>
        </>
      )}

      {/* Angles alpha and beta labels */}
      {showAngles && (
        <>
          <text
            x={pA.x + 12}
            y={pA.y + 24}
            className="text-[10px] font-mono font-semibold fill-blue-700 select-none pointer-events-none"
          >
            α={triangle.alphaDeg.toFixed(1)}°
          </text>

          <text
            x={pB.x - 44}
            y={pB.y - 10}
            className="text-[10px] font-mono font-semibold fill-blue-700 select-none pointer-events-none"
          >
            β={triangle.betaDeg.toFixed(1)}°
          </text>
        </>
      )}
    </g>
  );
};
