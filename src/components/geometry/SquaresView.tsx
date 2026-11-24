/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HoveredObject, PythagoreanPantsCalculations, Point2D } from '../../types/geometry.ts';
import { toScreen } from '../../geometry/transforms.ts';

interface SquaresViewProps {
  calc: PythagoreanPantsCalculations;
  origin: Point2D;
  scale: number;
  showSquares?: boolean;
  showDiagonals?: boolean;
  showGuidingRays?: boolean;
  showLabels?: boolean;
  highlightLayer?: 'all' | 'L1' | 'L2' | 'L3';
  onHoverObject?: (obj: HoveredObject | null) => void;
}

export const SquaresView: React.FC<SquaresViewProps> = ({
  calc,
  origin,
  scale,
  showSquares = true,
  showDiagonals = true,
  showGuidingRays = true,
  showLabels = true,
  highlightLayer = 'all',
  onHoverObject,
}) => {
  const { squareA, squareB, triangle } = calc;

  const pO = toScreen(squareA.O, origin, scale);
  const pA = toScreen(squareA.legVertex, origin, scale);
  const pCa = toScreen(squareA.outerVertex, origin, scale);
  const pDa = toScreen(squareA.baseVertex, origin, scale);

  const pB = toScreen(squareB.legVertex, origin, scale);
  const pCb = toScreen(squareB.outerVertex, origin, scale);
  const pDb = toScreen(squareB.baseVertex, origin, scale);

  const diagA_start = toScreen(squareA.designatedDiagStart, origin, scale);
  const diagA_end = toScreen(squareA.designatedDiagEnd, origin, scale);
  const diagB_start = toScreen(squareB.designatedDiagStart, origin, scale);
  const diagB_end = toScreen(squareB.designatedDiagEnd, origin, scale);

  const rayLength = calc.sideLength * 1.35;
  const rayA_end = toScreen(
    {
      x: triangle.A.x + calc.directionE.x * rayLength,
      y: triangle.A.y + calc.directionE.y * rayLength,
    },
    origin,
    scale
  );

  const rayB_end = toScreen(
    {
      x: triangle.B.x + calc.directionE.x * rayLength,
      y: triangle.B.y + calc.directionE.y * rayLength,
    },
    origin,
    scale
  );

  const isL1 = highlightLayer === 'all' || highlightLayer === 'L1';
  const isL2 = highlightLayer === 'all' || highlightLayer === 'L2';

  return (
    <g className="squares-view-group">
      <defs>
        <marker
          id="arrow-diag"
          viewBox="0 0 10 10"
          refX="6"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto-start-reverse"
        >
          <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#059669" />
        </marker>
        <marker
          id="arrow-ray"
          viewBox="0 0 10 10"
          refX="6"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto-start-reverse"
        >
          <path d="M 0 2 L 7 5 L 0 8 z" fill="#10b981" />
        </marker>
      </defs>

      {/* Squares Qa and Qb */}
      {showSquares && isL1 && (
        <>
          <polygon
            points={`${pO.x},${pO.y} ${pA.x},${pA.y} ${pCa.x},${pCa.y} ${pDa.x},${pDa.y}`}
            fill="#f59e0b"
            fillOpacity="0.12"
            stroke="#d97706"
            strokeWidth="1.8"
            strokeLinejoin="round"
            className="cursor-pointer transition-opacity"
            onPointerEnter={() =>
              onHoverObject?.({
                id: 'square-Qa',
                title: 'Квадрат Qa на вертикальном катете OA',
                details: `Сторона a = ${squareA.side.toFixed(2)}, Площадь Qa = a² = ${squareA.area.toFixed(2)}`,
                category: 'polygon',
              })
            }
            onPointerLeave={() => onHoverObject?.(null)}
          />

          <polygon
            points={`${pO.x},${pO.y} ${pB.x},${pB.y} ${pCb.x},${pCb.y} ${pDb.x},${pDb.y}`}
            fill="#f59e0b"
            fillOpacity="0.12"
            stroke="#d97706"
            strokeWidth="1.8"
            strokeLinejoin="round"
            className="cursor-pointer transition-opacity"
            onPointerEnter={() =>
              onHoverObject?.({
                id: 'square-Qb',
                title: 'Квадрат Qb на горизонтальном катете OB',
                details: `Сторона b = ${squareB.side.toFixed(2)}, Площадь Qb = b² = ${squareB.area.toFixed(2)}`,
                category: 'polygon',
              })
            }
            onPointerLeave={() => onHoverObject?.(null)}
          />

          {showLabels && (
            <>
              <text
                x={(pO.x + pCa.x) / 2}
                y={(pO.y + pCa.y) / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs font-mono font-semibold fill-amber-800 select-none pointer-events-none"
              >
                Q_a = a² ({squareA.area.toFixed(1)})
              </text>
              <text
                x={(pO.x + pCb.x) / 2}
                y={(pO.y + pCb.y) / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs font-mono font-semibold fill-amber-800 select-none pointer-events-none"
              >
                Q_b = b² ({squareB.area.toFixed(1)})
              </text>
              <text
                x={pCa.x - 8}
                y={pCa.y - 6}
                textAnchor="end"
                className="text-[11px] font-mono fill-slate-500 select-none pointer-events-none"
              >
                C_a(-a, a)
              </text>
              <text
                x={pDa.x - 8}
                y={pDa.y + 12}
                textAnchor="end"
                className="text-[11px] font-mono fill-slate-500 select-none pointer-events-none"
              >
                D_a(-a, 0)
              </text>
              <text
                x={pCb.x + 6}
                y={pCb.y + 12}
                className="text-[11px] font-mono fill-slate-500 select-none pointer-events-none"
              >
                C_b(b, -b)
              </text>
              <text
                x={pDb.x - 8}
                y={pDb.y + 12}
                textAnchor="end"
                className="text-[11px] font-mono fill-slate-500 select-none pointer-events-none"
              >
                D_b(0, -b)
              </text>
            </>
          )}
        </>
      )}

      {/* Designated Diagonals DaA and DbB (L2 Guiding Mechanism) */}
      {showDiagonals && isL2 && (
        <>
          <line
            x1={diagA_start.x}
            y1={diagA_start.y}
            x2={diagA_end.x}
            y2={diagA_end.y}
            stroke="#059669"
            strokeWidth="2.5"
            strokeDasharray="5,2"
            markerEnd="url(#arrow-diag)"
            className="cursor-pointer"
            onPointerEnter={() =>
              onHoverObject?.({
                id: 'diag-DaA',
                title: 'Направляющая диагональ DaA (Слой L2)',
                details: `Вектор (${triangle.a.toFixed(1)}, ${triangle.a.toFixed(1)}), направление строго +45°, длина ${(triangle.a * Math.SQRT2).toFixed(2)}`,
                category: 'ray',
              })
            }
            onPointerLeave={() => onHoverObject?.(null)}
          />

          <line
            x1={diagB_start.x}
            y1={diagB_start.y}
            x2={diagB_end.x}
            y2={diagB_end.y}
            stroke="#059669"
            strokeWidth="2.5"
            strokeDasharray="5,2"
            markerEnd="url(#arrow-diag)"
            className="cursor-pointer"
            onPointerEnter={() =>
              onHoverObject?.({
                id: 'diag-DbB',
                title: 'Направляющая диагональ DbB (Слой L2)',
                details: `Вектор (${triangle.b.toFixed(1)}, ${triangle.b.toFixed(1)}), направление строго +45°, длина ${(triangle.b * Math.SQRT2).toFixed(2)}`,
                category: 'ray',
              })
            }
            onPointerLeave={() => onHoverObject?.(null)}
          />

          {showLabels && (
            <>
              <text
                x={(diagA_start.x + diagA_end.x) / 2 - 12}
                y={(diagA_start.y + diagA_end.y) / 2 + 16}
                className="text-[11px] font-mono font-bold fill-emerald-700 select-none pointer-events-none"
              >
                D_a A (+45°)
              </text>
              <text
                x={(diagB_start.x + diagB_end.x) / 2 + 10}
                y={(diagB_start.y + diagB_end.y) / 2 + 16}
                className="text-[11px] font-mono font-bold fill-emerald-700 select-none pointer-events-none"
              >
                D_b B (+45°)
              </text>
            </>
          )}
        </>
      )}

      {/* Guiding Rays along e from A and B */}
      {showGuidingRays && isL2 && (
        <>
          <line
            x1={pA.x}
            y1={pA.y}
            x2={rayA_end.x}
            y2={rayA_end.y}
            stroke="#10b981"
            strokeWidth="1.5"
            strokeDasharray="3,3"
            markerEnd="url(#arrow-ray)"
          />
          <line
            x1={pB.x}
            y1={pB.y}
            x2={rayB_end.x}
            y2={rayB_end.y}
            stroke="#10b981"
            strokeWidth="1.5"
            strokeDasharray="3,3"
            markerEnd="url(#arrow-ray)"
          />
          {showLabels && (
            <text
              x={rayA_end.x + 8}
              y={rayA_end.y - 4}
              className="text-[10px] font-mono font-medium fill-emerald-600 select-none pointer-events-none"
            >
              луч e (45°)
            </text>
          )}
        </>
      )}
    </g>
  );
};
