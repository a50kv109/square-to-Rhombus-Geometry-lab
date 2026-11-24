/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  HoveredObject,
  PythagoreanPantsCalculations,
  Point2D,
  ProofVariant,
} from '../../types/geometry.ts';
import { toScreen } from '../../geometry/transforms.ts';

interface PythagoreanProofViewProps {
  calc: PythagoreanPantsCalculations;
  origin: Point2D;
  scale: number;
  proofVariant?: ProofVariant;
  showProofLines?: boolean;
  onHoverObject?: (obj: HoveredObject | null) => void;
}

export const PythagoreanProofView: React.FC<PythagoreanProofViewProps> = ({
  calc,
  origin,
  scale,
  proofVariant = 'euclid',
  showProofLines = true,
  onHoverObject,
}) => {
  const { triangle, squareA, squareB } = calc;
  const a = triangle.a;
  const b = triangle.b;

  const pO = toScreen(triangle.O, origin, scale);
  const pA = toScreen(triangle.A, origin, scale);
  const pB = toScreen(triangle.B, origin, scale);
  const pCa = toScreen(squareA.outerVertex, origin, scale);
  const pCb = toScreen(squareB.outerVertex, origin, scale);
  const pDa = toScreen(squareA.baseVertex, origin, scale);
  const pDb = toScreen(squareB.baseVertex, origin, scale);

  // Square on hypotenuse AB (pointing into Q1)
  const mathBc: Point2D = { x: b + a, y: b };
  const mathAc: Point2D = { x: a, y: a + b };
  const pBc = toScreen(mathBc, origin, scale);
  const pAc = toScreen(mathAc, origin, scale);

  if (proofVariant === 'bhaskara') {
    // Dissection square of side (a+b): [0, a+b] x [0, a+b]
    // 4 congruent right triangles around inner tilted square of side c!
    // Vertices of outer (a+b) square:
    const pS00 = toScreen({ x: 0, y: 0 }, origin, scale);
    const pS10 = toScreen({ x: a + b, y: 0 }, origin, scale);
    const pS11 = toScreen({ x: a + b, y: a + b }, origin, scale);
    const pS01 = toScreen({ x: 0, y: a + b }, origin, scale);

    // Inner tilted square vertices on the boundary of [0, a+b]^2:
    // T1 = (b, 0) = B
    // T2 = (a + b, b) = Bc
    // T3 = (a, a + b) = Ac
    // T4 = (0, a) = A
    // Look how beautifully T4(0,a), T1(b,0), T2(a+b,b), T3(a,a+b) IS ALREADY the square on hypotenuse Qc!
    // Check:
    // Triangle 1: O(0,0), A(0,a), B(b,0) — our original triangle!
    // Triangle 2: (a+b, 0), B(b,0), Bc(a+b, b) — legs a and b!
    // Triangle 3: (a+b, a+b), Bc(a+b,b), Ac(a, a+b) — legs a and b!
    // Triangle 4: (0, a+b), Ac(a,a+b), A(0,a) — legs a and b!
    const pMidCenter = toScreen({ x: (a + b) / 2, y: (a + b) / 2 }, origin, scale);

    return (
      <g className="pythagorean-bhaskara-group">
        {/* Outer square (a+b)^2 */}
        <polygon
          points={`${pS00.x},${pS00.y} ${pS10.x},${pS10.y} ${pS11.x},${pS11.y} ${pS01.x},${pS01.y}`}
          fill="#f8fafc"
          fillOpacity="0.5"
          stroke="#64748b"
          strokeWidth="1.8"
          strokeDasharray="4,3"
        />

        {/* Other 3 congruent right triangles */}
        <polygon
          points={`${pS10.x},${pS10.y} ${pB.x},${pB.y} ${pBc.x},${pBc.y}`}
          fill="#3b82f6"
          fillOpacity="0.14"
          stroke="#2563eb"
          strokeWidth="1.5"
        />
        <polygon
          points={`${pS11.x},${pS11.y} ${pBc.x},${pBc.y} ${pAc.x},${pAc.y}`}
          fill="#3b82f6"
          fillOpacity="0.14"
          stroke="#2563eb"
          strokeWidth="1.5"
        />
        <polygon
          points={`${pS01.x},${pS01.y} ${pAc.x},${pAc.y} ${pA.x},${pA.y}`}
          fill="#3b82f6"
          fillOpacity="0.14"
          stroke="#2563eb"
          strokeWidth="1.5"
        />

        {/* Central tilted square of area c^2 */}
        <polygon
          points={`${pA.x},${pA.y} ${pB.x},${pB.y} ${pBc.x},${pBc.y} ${pAc.x},${pAc.y}`}
          fill="#10b981"
          fillOpacity="0.2"
          stroke="#059669"
          strokeWidth="2.5"
          className="cursor-pointer"
          onPointerEnter={() =>
            onHoverObject?.({
              id: 'bhaskara-square-c2',
              title: 'Центральный квадрат (a+b)² - 2ab = c²',
              details: `Площадь внешнего квадрата ${(a + b).toFixed(2)}² = ${((a + b) ** 2).toFixed(2)}, минус 4 треугольника (${(2 * a * b).toFixed(2)}) = ${calc.areaSquareHypotenuse.toFixed(2)}`,
              category: 'polygon',
            })
          }
          onPointerLeave={() => onHoverObject?.(null)}
        />

        <text
          x={pMidCenter.x}
          y={pMidCenter.y}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-xs font-mono font-bold fill-emerald-950 select-none pointer-events-none"
        >
          c² = (a+b)² - 2ab = {calc.areaSquareHypotenuse.toFixed(1)}
        </text>
      </g>
    );
  }

  // Euclid's proof (Windmill I.47)
  const mathH = triangle.altitudePoint;
  const mathH_far: Point2D = {
    x: mathH.x + a,
    y: mathH.y + b,
  };
  const pH_far = toScreen(mathH_far, origin, scale);

  return (
    <g className="pythagorean-proof-group">
      {/* Square Qa on vertical leg */}
      <polygon
        points={`${pO.x},${pO.y} ${pA.x},${pA.y} ${pCa.x},${pCa.y} ${pDa.x},${pDa.y}`}
        fill="#f59e0b"
        fillOpacity="0.18"
        stroke="#d97706"
        strokeWidth="2"
        className="cursor-pointer"
        onPointerEnter={() =>
          onHoverObject?.({
            id: 'euclid-Qa',
            title: 'Квадрат Qa = a²',
            details: `Площадь a² = ${squareA.area.toFixed(2)} равна левому прямоугольнику S₁ внутри квадрата гипотенузы`,
            category: 'polygon',
          })
        }
        onPointerLeave={() => onHoverObject?.(null)}
      />
      <text
        x={(pO.x + pCa.x) / 2}
        y={(pO.y + pCa.y) / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        className="text-xs font-mono font-bold fill-amber-900 select-none pointer-events-none"
      >
        a² = {squareA.area.toFixed(1)}
      </text>

      {/* Square Qb on horizontal leg */}
      <polygon
        points={`${pO.x},${pO.y} ${pB.x},${pB.y} ${pCb.x},${pCb.y} ${pDb.x},${pDb.y}`}
        fill="#3b82f6"
        fillOpacity="0.18"
        stroke="#2563eb"
        strokeWidth="2"
        className="cursor-pointer"
        onPointerEnter={() =>
          onHoverObject?.({
            id: 'euclid-Qb',
            title: 'Квадрат Qb = b²',
            details: `Площадь b² = ${squareB.area.toFixed(2)} равна правому прямоугольнику S₂ внутри квадрата гипотенузы`,
            category: 'polygon',
          })
        }
        onPointerLeave={() => onHoverObject?.(null)}
      />
      <text
        x={(pO.x + pCb.x) / 2}
        y={(pO.y + pCb.y) / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        className="text-xs font-mono font-bold fill-blue-900 select-none pointer-events-none"
      >
        b² = {squareB.area.toFixed(1)}
      </text>

      {/* Square Qc on Hypotenuse */}
      <polygon
        points={`${pA.x},${pA.y} ${pB.x},${pB.y} ${pBc.x},${pBc.y} ${pAc.x},${pAc.y}`}
        fill="#10b981"
        fillOpacity="0.18"
        stroke="#059669"
        strokeWidth="2.5"
        className="cursor-pointer"
        onPointerEnter={() =>
          onHoverObject?.({
            id: 'euclid-Qc',
            title: 'Квадрат на гипотенузе Qc = c²',
            details: `Площадь c² = ${calc.areaSquareHypotenuse.toFixed(2)} = ${squareA.area.toFixed(2)} + ${squareB.area.toFixed(2)}`,
            category: 'polygon',
          })
        }
        onPointerLeave={() => onHoverObject?.(null)}
      />

      {showProofLines && (
        <>
          <line
            x1={pO.x}
            y1={pO.y}
            x2={pH_far.x}
            y2={pH_far.y}
            stroke="#059669"
            strokeWidth="2"
            strokeDasharray="4,3"
          />
          <line
            x1={pCa.x}
            y1={pCa.y}
            x2={pB.x}
            y2={pB.y}
            stroke="#f59e0b"
            strokeWidth="1.2"
            strokeDasharray="2,2"
            opacity="0.6"
          />
          <line
            x1={pCb.x}
            y1={pCb.y}
            x2={pA.x}
            y2={pA.y}
            stroke="#3b82f6"
            strokeWidth="1.2"
            strokeDasharray="2,2"
            opacity="0.6"
          />
          <text
            x={(pA.x + pH_far.x) / 2 - 8}
            y={(pA.y + pH_far.y) / 2 - 8}
            className="text-[11px] font-mono font-semibold fill-amber-700 select-none pointer-events-none"
          >
            S₁ = a² ({squareA.area.toFixed(1)})
          </text>
          <text
            x={(pB.x + pH_far.x) / 2 + 8}
            y={(pB.y + pH_far.y) / 2 + 12}
            className="text-[11px] font-mono font-semibold fill-blue-700 select-none pointer-events-none"
          >
            S₂ = b² ({squareB.area.toFixed(1)})
          </text>
        </>
      )}

      <text
        x={(pA.x + pBc.x) / 2}
        y={(pA.y + pBc.y) / 2}
        textAnchor="middle"
        className="text-xs font-mono font-bold fill-emerald-900 select-none pointer-events-none"
      >
        c² = a² + b² = {calc.areaSquareHypotenuse.toFixed(1)}
      </text>
    </g>
  );
};
