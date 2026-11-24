/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HoveredObject, PythagoreanPantsCalculations, Point2D } from '../../types/geometry.ts';
import { toScreen, formatPoint } from '../../geometry/transforms.ts';

interface RhombusViewProps {
  calc: PythagoreanPantsCalculations;
  origin: Point2D;
  scale: number;
  showRhombus?: boolean;
  showDiagonals?: boolean;
  showHeight?: boolean;
  showSquareHypotenuse?: boolean;
  showAngles?: boolean;
  showLabels?: boolean;
  highlightLayer?: 'all' | 'L1' | 'L2' | 'L3';
  onHoverObject?: (obj: HoveredObject | null) => void;
}

function describeAngleArc(
  cx: number,
  cy: number,
  radius: number,
  pPrev: Point2D,
  pNext: Point2D
): string {
  const a1 = Math.atan2(pPrev.y - cy, pPrev.x - cx);
  const a2 = Math.atan2(pNext.y - cy, pNext.x - cx);

  let diff = a2 - a1;
  while (diff < -Math.PI) diff += Math.PI * 2;
  while (diff > Math.PI) diff -= Math.PI * 2;

  const sweep = diff >= 0 ? 1 : 0;
  const x1 = cx + radius * Math.cos(a1);
  const y1 = cy + radius * Math.sin(a1);
  const x2 = cx + radius * Math.cos(a2);
  const y2 = cy + radius * Math.sin(a2);

  return `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 0 ${sweep} ${x2} ${y2} Z`;
}

export const RhombusView: React.FC<RhombusViewProps> = ({
  calc,
  origin,
  scale,
  showRhombus = true,
  showDiagonals = true,
  showHeight = true,
  showSquareHypotenuse = false,
  showAngles = true,
  showLabels = true,
  highlightLayer = 'all',
  onHoverObject,
}) => {
  const { triangle, A_prime, B_prime } = calc;

  const pA = toScreen(triangle.A, origin, scale);
  const pB = toScreen(triangle.B, origin, scale);
  const pA_prime = toScreen(A_prime, origin, scale);
  const pB_prime = toScreen(B_prime, origin, scale);

  const centerMath: Point2D = {
    x: (triangle.A.x + triangle.B.x + A_prime.x + B_prime.x) / 4,
    y: (triangle.A.y + triangle.B.y + A_prime.y + B_prime.y) / 4,
  };
  const pCenter = toScreen(centerMath, origin, scale);

  // Exact foot of perpendicular from A' onto line AB:
  // H_r = A' - h_r * (a, b) / c
  const c = calc.sideLength;
  const mathHr: Point2D = {
    x: A_prime.x - (calc.height * triangle.a) / c,
    y: A_prime.y - (calc.height * triangle.b) / c,
  };
  const pHr = toScreen(mathHr, origin, scale);

  // Square on hypotenuse Sc vertices for visual comparison
  const mathBc: Point2D = { x: triangle.b + triangle.a, y: triangle.b };
  const mathAc: Point2D = { x: triangle.a, y: triangle.a + triangle.b };
  const pBc = toScreen(mathBc, origin, scale);
  const pAc = toScreen(mathAc, origin, scale);

  const isL3 = highlightLayer === 'all' || highlightLayer === 'L3';
  if (!showRhombus || !isL3) return null;

  const arcRadius = Math.min(24, Math.max(12, c * scale * 0.14));
  const isSymmetric = Math.abs(calc.q) < 0.005;

  return (
    <g className="rhombus-view-group">
      {/* Square on Hypotenuse Sc overlay (for comparison) */}
      {showSquareHypotenuse && (
        <g className="square-hypotenuse-overlay">
          <polygon
            points={`${pA.x},${pA.y} ${pB.x},${pB.y} ${pBc.x},${pBc.y} ${pAc.x},${pAc.y}`}
            fill="#6366f1"
            fillOpacity="0.06"
            stroke="#6366f1"
            strokeWidth="1.5"
            strokeDasharray="4,4"
          />
          <text
            x={(pA.x + pBc.x) / 2}
            y={(pA.y + pBc.y) / 2 + 16}
            textAnchor="middle"
            className="text-[11px] font-mono fill-indigo-600/80 select-none pointer-events-none"
          >
            S_c = c² ({calc.areaSquareHypotenuse.toFixed(1)})
          </text>
        </g>
      )}

      {/* Rhombus Polygon ABB'A' */}
      <polygon
        points={`${pA.x},${pA.y} ${pB.x},${pB.y} ${pB_prime.x},${pB_prime.y} ${pA_prime.x},${pA_prime.y}`}
        fill={isSymmetric ? '#10b981' : '#8b5cf6'}
        fillOpacity={isSymmetric ? 0.16 : 0.15}
        stroke={isSymmetric ? '#059669' : '#7c3aed'}
        strokeWidth="2.5"
        strokeLinejoin="round"
        className="cursor-pointer transition-colors"
        onPointerEnter={() =>
          onHoverObject?.({
            id: 'rhombus-ABBpAp',
            title: isSymmetric ? 'Ромб ABB\'A\' (Вырожден в квадрат)' : 'Ромб ABB\'A\' (Слой L3, L = c)',
            details: `Все 4 стороны = ${c.toFixed(3)} · Площадь Sr = ${calc.areaRhombus.toFixed(2)} · η_S = ${calc.etaS.toFixed(4)}`,
            category: 'polygon',
          })
        }
        onPointerLeave={() => onHoverObject?.(null)}
      />

      {/* Internal angle arcs */}
      {showAngles && (
        <g className="pointer-events-none">
          <path
            d={describeAngleArc(pA.x, pA.y, arcRadius, pB, pA_prime)}
            fill={isSymmetric ? '#10b981' : '#7c3aed'}
            fillOpacity="0.18"
            stroke={isSymmetric ? '#059669' : '#7c3aed'}
            strokeWidth="1"
          />
          <path
            d={describeAngleArc(pB.x, pB.y, arcRadius, pB_prime, pA)}
            fill={isSymmetric ? '#10b981' : '#7c3aed'}
            fillOpacity="0.18"
            stroke={isSymmetric ? '#059669' : '#7c3aed'}
            strokeWidth="1"
          />
          <path
            d={describeAngleArc(pB_prime.x, pB_prime.y, arcRadius, pA_prime, pB)}
            fill={isSymmetric ? '#10b981' : '#7c3aed'}
            fillOpacity="0.18"
            stroke={isSymmetric ? '#059669' : '#7c3aed'}
            strokeWidth="1"
          />
          <path
            d={describeAngleArc(pA_prime.x, pA_prime.y, arcRadius, pA, pB_prime)}
            fill={isSymmetric ? '#10b981' : '#7c3aed'}
            fillOpacity="0.18"
            stroke={isSymmetric ? '#059669' : '#7c3aed'}
            strokeWidth="1"
          />
        </g>
      )}

      {/* Rhombus Area label in center */}
      {showLabels && (
        <text
          x={pCenter.x}
          y={pCenter.y - 12}
          textAnchor="middle"
          dominantBaseline="middle"
          className={`text-xs font-mono font-bold select-none pointer-events-none ${
            isSymmetric ? 'fill-emerald-900' : 'fill-purple-900'
          }`}
        >
          S_r = {calc.areaRhombus.toFixed(2)}
        </text>
      )}

      {/* Diagonals d1 (AB') and d2 (BA') */}
      {showDiagonals && (
        <g className="rhombus-diagonals">
          <line
            x1={pA.x}
            y1={pA.y}
            x2={pB_prime.x}
            y2={pB_prime.y}
            stroke="#ec4899"
            strokeWidth="1.8"
            strokeDasharray="5,3"
            className="cursor-pointer"
            onPointerEnter={() =>
              onHoverObject?.({
                id: 'diag-d1',
                title: 'Диагональ ромба d₁ = AB\'',
                details: `Длина d₁ = ${calc.d1.toFixed(3)} ед. · Ортогональна d₂ (d₁ ⟂ d₂)`,
                category: 'segment',
              })
            }
            onPointerLeave={() => onHoverObject?.(null)}
          />

          <line
            x1={pB.x}
            y1={pB.y}
            x2={pA_prime.x}
            y2={pA_prime.y}
            stroke="#06b6d4"
            strokeWidth="1.8"
            strokeDasharray="5,3"
            className="cursor-pointer"
            onPointerEnter={() =>
              onHoverObject?.({
                id: 'diag-d2',
                title: 'Диагональ ромба d₂ = BA\'',
                details: `Длина d₂ = ${calc.d2.toFixed(3)} ед. · d₁² + d₂² = 4c² = ${(4 * c * c).toFixed(2)}`,
                category: 'segment',
              })
            }
            onPointerLeave={() => onHoverObject?.(null)}
          />

          <circle cx={pCenter.x} cy={pCenter.y} r="3.5" fill="#7c3aed" />

          {showLabels && (
            <>
              <text
                x={(pA.x + pB_prime.x) / 2 + 10}
                y={(pA.y + pB_prime.y) / 2 + 14}
                className="text-[10px] font-mono font-semibold fill-pink-600 select-none pointer-events-none"
              >
                d₁={calc.d1.toFixed(2)}
              </text>
              <text
                x={(pB.x + pA_prime.x) / 2 - 10}
                y={(pB.y + pA_prime.y) / 2 - 12}
                textAnchor="end"
                className="text-[10px] font-mono font-semibold fill-cyan-700 select-none pointer-events-none"
              >
                d₂={calc.d2.toFixed(2)}
              </text>
            </>
          )}
        </g>
      )}

      {/* Exact Rhombus Height hr from A' perpendicular to line AB */}
      {showHeight && (
        <g className="rhombus-height">
          {/* Dashed extension from A to Hr in case Hr falls outside segment AB */}
          <line
            x1={pA.x}
            y1={pA.y}
            x2={pHr.x}
            y2={pHr.y}
            stroke="#94a3b8"
            strokeWidth="1"
            strokeDasharray="3,3"
          />
          <line
            x1={pA_prime.x}
            y1={pA_prime.y}
            x2={pHr.x}
            y2={pHr.y}
            stroke="#f43f5e"
            strokeWidth="1.8"
            strokeDasharray="4,2"
            className="cursor-pointer"
            onPointerEnter={() =>
              onHoverObject?.({
                id: 'height-hr',
                title: 'Высота ромба h_r',
                details: `Перпендикуляр из A' к прямой AB · h_r = (a+b)/√2 = ${calc.height.toFixed(3)} ед.`,
                category: 'segment',
              })
            }
            onPointerLeave={() => onHoverObject?.(null)}
          />
          <circle cx={pHr.x} cy={pHr.y} r="3" fill="#f43f5e" />
          {showLabels && (
            <text
              x={(pA_prime.x + pHr.x) / 2 - 8}
              y={(pA_prime.y + pHr.y) / 2}
              textAnchor="end"
              className="text-[10px] font-mono font-bold fill-rose-600 select-none pointer-events-none"
            >
              h_r={calc.height.toFixed(2)}
            </text>
          )}
        </g>
      )}

      {/* Interactive hover hit-lines for AA' and BB' */}
      <line
        x1={pA.x}
        y1={pA.y}
        x2={pA_prime.x}
        y2={pA_prime.y}
        stroke="transparent"
        strokeWidth="10"
        className="cursor-pointer"
        onPointerEnter={() =>
          onHoverObject?.({
            id: 'side-AAp',
            title: 'Боковая сторона AA\'',
            details: `Вектор c·e (+45°) · Длина AA' = c = ${c.toFixed(3)} ед.`,
            category: 'segment',
          })
        }
        onPointerLeave={() => onHoverObject?.(null)}
      />
      <line
        x1={pB.x}
        y1={pB.y}
        x2={pB_prime.x}
        y2={pB_prime.y}
        stroke="transparent"
        strokeWidth="10"
        className="cursor-pointer"
        onPointerEnter={() =>
          onHoverObject?.({
            id: 'side-BBp',
            title: 'Боковая сторона BB\'',
            details: `Вектор c·e (+45°) · Длина BB' = c = ${c.toFixed(3)} ед.`,
            category: 'segment',
          })
        }
        onPointerLeave={() => onHoverObject?.(null)}
      />

      {/* Vertices A' and B' markers with hover inspection */}
      <circle
        cx={pA_prime.x}
        cy={pA_prime.y}
        r="5.5"
        fill={isSymmetric ? '#059669' : '#7c3aed'}
        stroke="#ffffff"
        strokeWidth="2"
        className="cursor-pointer"
        onPointerEnter={() =>
          onHoverObject?.({
            id: 'vertex-Ap',
            title: "Вершина A' (Построена по правилу L = c)",
            details: `A' = A + c·e = ${formatPoint(A_prime)} · Угол φ_A' = ${calc.phiA_prime_deg.toFixed(2)}°`,
            category: 'vertex',
          })
        }
        onPointerLeave={() => onHoverObject?.(null)}
      />
      <circle
        cx={pB_prime.x}
        cy={pB_prime.y}
        r="5.5"
        fill={isSymmetric ? '#059669' : '#7c3aed'}
        stroke="#ffffff"
        strokeWidth="2"
        className="cursor-pointer"
        onPointerEnter={() =>
          onHoverObject?.({
            id: 'vertex-Bp',
            title: "Вершина B' (Построена по правилу L = c)",
            details: `B' = B + c·e = ${formatPoint(B_prime)} · Угол φ_B' = ${calc.phiB_prime_deg.toFixed(2)}°`,
            category: 'vertex',
          })
        }
        onPointerLeave={() => onHoverObject?.(null)}
      />

      {/* Vertices Labels */}
      {showLabels && (
        <>
          <text
            x={pA_prime.x + 8}
            y={pA_prime.y - 8}
            className="text-xs font-mono font-bold fill-purple-900 select-none pointer-events-none"
          >
            A' {formatPoint(A_prime)}
          </text>
          <text
            x={pB_prime.x + 8}
            y={pB_prime.y + 14}
            className="text-xs font-mono font-bold fill-purple-900 select-none pointer-events-none"
          >
            B' {formatPoint(B_prime)}
          </text>
        </>
      )}

      {/* Interior angles labels */}
      {showAngles && (
        <>
          <text
            x={pA.x + 22}
            y={pA.y - 12}
            className="text-[10px] font-mono font-bold fill-purple-800 select-none pointer-events-none"
          >
            φ_A={calc.phiA_deg.toFixed(1)}°
          </text>

          <text
            x={pB.x + 14}
            y={pB.y - 14}
            className="text-[10px] font-mono font-bold fill-purple-800 select-none pointer-events-none"
          >
            φ_B={calc.phiB_deg.toFixed(1)}°
          </text>

          <text
            x={pB_prime.x - 52}
            y={pB_prime.y + 4}
            className="text-[10px] font-mono fill-purple-700 select-none pointer-events-none"
          >
            φ_B'={calc.phiB_prime_deg.toFixed(1)}°
          </text>

          <text
            x={pA_prime.x - 52}
            y={pA_prime.y + 16}
            className="text-[10px] font-mono fill-purple-700 select-none pointer-events-none"
          >
            φ_A'={calc.phiA_prime_deg.toFixed(1)}°
          </text>
        </>
      )}
    </g>
  );
};
