/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  PythagoreanPantsCalculations,
  Point2D,
  ActiveModuleId,
  HoveredObject,
  ProofVariant,
} from '../../types/geometry.ts';
import { Translations } from '../../i18n/translations.ts';
import { CoordinateGrid } from './CoordinateGrid.tsx';
import { RightTriangleView } from './RightTriangleView.tsx';
import { SquaresView } from './SquaresView.tsx';
import { RhombusView } from './RhombusView.tsx';
import { PythagoreanProofView } from './PythagoreanProofView.tsx';
import { InteractivePoint } from './InteractivePoint.tsx';
import { toScreen, toMath } from '../../geometry/transforms.ts';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Layers,
  Compass,
  PanelRightClose,
  PanelRightOpen,
  Info,
} from 'lucide-react';

interface GeometryBoardProps {
  calc: PythagoreanPantsCalculations;
  activeModule: ActiveModuleId;
  onChangeA: (newA: number, recordHistory?: boolean) => void;
  onChangeB: (newB: number, recordHistory?: boolean) => void;
  onCommitDrag?: () => void;
  highlightLayer: 'all' | 'L1' | 'L2' | 'L3';
  setHighlightLayer: (layer: 'all' | 'L1' | 'L2' | 'L3') => void;
  showSquareHypotenuse: boolean;
  setShowSquareHypotenuse: (show: boolean) => void;
  showDiagonals: boolean;
  setShowDiagonals: (show: boolean) => void;
  isRightPanelOpen: boolean;
  onToggleRightPanel: () => void;
  svgRefExternal?: React.RefObject<SVGSVGElement | null>;
  t: Translations;
}

export const GeometryBoard: React.FC<GeometryBoardProps> = ({
  calc,
  activeModule,
  onChangeA,
  onChangeB,
  onCommitDrag,
  highlightLayer,
  setHighlightLayer,
  showSquareHypotenuse,
  setShowSquareHypotenuse,
  showDiagonals,
  setShowDiagonals,
  isRightPanelOpen,
  onToggleRightPanel,
  svgRefExternal,
  t,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const internalSvgRef = useRef<SVGSVGElement>(null);
  const svgRef = svgRefExternal || internalSvgRef;

  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [scale, setScale] = useState(45);
  const [originOffset, setOriginOffset] = useState<Point2D>({ x: 260, y: 440 });

  // Dragging states
  const [activeDrag, setActiveDrag] = useState<'A' | 'B' | 'pan' | null>(null);
  const dragStartRef = useRef<{ clientX: number; clientY: number; origOffset: Point2D }>({
    clientX: 0,
    clientY: 0,
    origOffset: { x: 260, y: 440 },
  });

  // Display toggles
  const [showGrid, setShowGrid] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [showAngles, setShowAngles] = useState(true);
  const [showAltitude, setShowAltitude] = useState(true);
  const [proofVariant, setProofVariant] = useState<ProofVariant>('euclid');

  // Hovered object inspection
  const [hoveredObj, setHoveredObj] = useState<HoveredObject | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          setDimensions({ width, height });
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const handleFitView = useCallback(() => {
    const minX = activeModule === 'module_triangle' ? -1 : -calc.triangle.a - 1;
    const maxX =
      activeModule === 'module_triangle'
        ? calc.triangle.b + 1.5
        : activeModule === 'module_pythagoras'
        ? calc.triangle.a + calc.triangle.b + 1.5
        : calc.B_prime.x + 1.5;
    const minY = activeModule === 'module_triangle' ? -1 : -calc.triangle.b - 1;
    const maxY =
      activeModule === 'module_triangle'
        ? calc.triangle.a + 1.5
        : activeModule === 'module_pythagoras'
        ? calc.triangle.a + calc.triangle.b + 1.5
        : calc.A_prime.y + 1.5;

    const mathWidth = maxX - minX;
    const mathHeight = maxY - minY;

    const fitScaleX = (dimensions.width * 0.78) / mathWidth;
    const fitScaleY = (dimensions.height * 0.78) / mathHeight;
    const newScale = Math.min(70, Math.max(18, Math.min(fitScaleX, fitScaleY)));

    setScale(newScale);

    const centerMathX = (minX + maxX) / 2;
    const centerMathY = (minY + maxY) / 2;
    const newOriginX = dimensions.width / 2 - centerMathX * newScale;
    const newOriginY = dimensions.height / 2 + centerMathY * newScale;

    setOriginOffset({ x: newOriginX, y: newOriginY });
  }, [calc, dimensions, activeModule]);

  const handlePointerDownA = (e: React.PointerEvent) => {
    e.stopPropagation();
    setActiveDrag('A');
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerDownB = (e: React.PointerEvent) => {
    e.stopPropagation();
    setActiveDrag('B');
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handleBackgroundPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    setActiveDrag('pan');
    dragStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      origOffset: { ...originOffset },
    };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!activeDrag || !svgRef.current) return;

    if (activeDrag === 'pan') {
      const dx = e.clientX - dragStartRef.current.clientX;
      const dy = e.clientY - dragStartRef.current.clientY;
      setOriginOffset({
        x: dragStartRef.current.origOffset.x + dx,
        y: dragStartRef.current.origOffset.y + dy,
      });
      return;
    }

    const rect = svgRef.current.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    const mathP = toMath({ x: screenX, y: screenY }, originOffset, scale);

    if (activeDrag === 'A') {
      const newA = Math.max(0.5, Math.min(15, Math.round(mathP.y * 10) / 10));
      onChangeA(newA, false);
    } else if (activeDrag === 'B') {
      const newB = Math.max(0.5, Math.min(15, Math.round(mathP.x * 10) / 10));
      onChangeB(newB, false);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (activeDrag) {
      try {
        (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
      } catch {
        // ignore
      }
      if (activeDrag === 'A' || activeDrag === 'B') {
        onCommitDrag?.();
      }
      setActiveDrag(null);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (!svgRef.current) return;

    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    const newScale = Math.min(120, Math.max(15, scale * zoomFactor));

    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const newOriginX = mouseX - (mouseX - originOffset.x) * (newScale / scale);
    const newOriginY = mouseY - (mouseY - originOffset.y) * (newScale / scale);

    setScale(newScale);
    setOriginOffset({ x: newOriginX, y: newOriginY });
  };

  const pO = toScreen(calc.triangle.O, originOffset, scale);
  const pA = toScreen(calc.triangle.A, originOffset, scale);
  const pB = toScreen(calc.triangle.B, originOffset, scale);

  const isPantsOrExp = activeModule === 'module_pants' || activeModule === 'module_experiments';

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[400px] bg-slate-50 overflow-hidden select-none flex flex-col"
    >
      {/* Board Top Toolbar */}
      <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Contextual Left Toolbar: Layer selector for Pants, Proof selector for Pythagoras */}
        {isPantsOrExp && (
          <div className="flex items-center gap-1 p-1 bg-white/92 backdrop-blur-md rounded-lg border border-slate-200/90 shadow-xs pointer-events-auto">
            <span className="text-[11px] font-semibold text-slate-500 px-2 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-slate-400" /> {t.board.layers}
            </span>
            {(['all', 'L1', 'L2', 'L3'] as const).map((layer) => (
              <button
                key={layer}
                onClick={() => setHighlightLayer(layer)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  highlightLayer === layer
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {layer === 'all'
                  ? t.board.all
                  : layer === 'L1'
                  ? t.board.l1
                  : layer === 'L2'
                  ? t.board.l2
                  : t.board.l3}
              </button>
            ))}
          </div>
        )}

        {activeModule === 'module_pythagoras' && (
          <div className="flex items-center gap-1 p-1 bg-white/92 backdrop-blur-md rounded-lg border border-slate-200/90 shadow-xs pointer-events-auto">
            <button
              onClick={() => setProofVariant('euclid')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                proofVariant === 'euclid'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {t.board.proofEuclid}
            </button>
            <button
              onClick={() => setProofVariant('bhaskara')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                proofVariant === 'bhaskara'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {t.board.proofBhaskara}
            </button>
          </div>
        )}

        {activeModule === 'module_triangle' && (
          <div className="flex items-center gap-1 p-1 bg-white/92 backdrop-blur-md rounded-lg border border-slate-200/90 shadow-xs pointer-events-auto">
            <button
              onClick={() => setShowAltitude(!showAltitude)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                showAltitude
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {t.board.altitude} h_c
            </button>
          </div>
        )}

        {/* Visibility Toggles & Zoom Deck */}
        <div className="flex items-center gap-1 p-1 bg-white/92 backdrop-blur-md rounded-lg border border-slate-200/90 shadow-xs pointer-events-auto ml-auto">
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`px-2 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              showGrid ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            {t.board.grid}
          </button>
          <button
            onClick={() => setShowLabels(!showLabels)}
            className={`px-2 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              showLabels ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            {t.board.labels}
          </button>
          <button
            onClick={() => setShowAngles(!showAngles)}
            className={`px-2 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              showAngles ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            {t.board.angles}
          </button>
          {isPantsOrExp && (
            <>
              <button
                onClick={() => setShowDiagonals(!showDiagonals)}
                className={`px-2 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  showDiagonals ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                d₁, d₂
              </button>
              <button
                onClick={() => setShowSquareHypotenuse(!showSquareHypotenuse)}
                className={`px-2 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  showSquareHypotenuse
                    ? 'bg-purple-100 text-purple-800 font-semibold'
                    : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                {t.board.compareSc}
              </button>
            </>
          )}

          <div className="w-px h-4 bg-slate-200 mx-0.5" />

          <button
            onClick={() => setScale((s) => Math.min(120, s * 1.15))}
            className="p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded"
            title="+"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setScale((s) => Math.max(15, s * 0.85))}
            className="p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded"
            title="-"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleFitView}
            className="p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded"
            title="Fit View"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setScale(45);
              setOriginOffset({ x: 260, y: 440 });
            }}
            className="p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded"
            title="Reset View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <div className="hidden lg:block w-px h-4 bg-slate-200 mx-0.5" />
          <button
            onClick={onToggleRightPanel}
            className="hidden lg:flex items-center gap-1 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded whitespace-nowrap shrink-0"
            title={isRightPanelOpen ? t.actions.expandBoard : t.actions.showPanel}
          >
            {isRightPanelOpen ? (
              <PanelRightClose className="w-4 h-4" />
            ) : (
              <>
                <PanelRightOpen className="w-4 h-4" />
                <span>{t.actions.showPanel}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Interactive SVG Canvas */}
      <svg
        ref={svgRef}
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        className={`w-full h-full bg-slate-50 cursor-crosshair ${
          activeDrag === 'pan' ? 'cursor-grabbing' : ''
        }`}
        onPointerDown={handleBackgroundPointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onWheel={handleWheel}
      >
        <CoordinateGrid
          width={dimensions.width}
          height={dimensions.height}
          origin={originOffset}
          scale={scale}
          showGrid={showGrid}
          showAxes={true}
        />

        {activeModule === 'module_pythagoras' && (
          <PythagoreanProofView
            calc={calc}
            origin={originOffset}
            scale={scale}
            proofVariant={proofVariant}
            showProofLines={true}
            onHoverObject={setHoveredObj}
          />
        )}

        {isPantsOrExp && (
          <>
            <SquaresView
              calc={calc}
              origin={originOffset}
              scale={scale}
              showSquares={true}
              showDiagonals={showDiagonals}
              showGuidingRays={showDiagonals}
              showLabels={showLabels}
              highlightLayer={highlightLayer}
              onHoverObject={setHoveredObj}
            />

            <RhombusView
              calc={calc}
              origin={originOffset}
              scale={scale}
              showRhombus={true}
              showDiagonals={showDiagonals}
              showHeight={showAltitude && highlightLayer !== 'L1' && highlightLayer !== 'L2'}
              showSquareHypotenuse={showSquareHypotenuse}
              showAngles={showAngles}
              showLabels={showLabels}
              highlightLayer={highlightLayer}
              onHoverObject={setHoveredObj}
            />
          </>
        )}

        <RightTriangleView
          triangle={calc.triangle}
          origin={originOffset}
          scale={scale}
          showLabels={showLabels}
          showAngles={showAngles}
          showAltitude={activeModule === 'module_triangle' && showAltitude}
          onHoverObject={setHoveredObj}
        />

        {/* Fixed Origin Vertex O */}
        <circle
          cx={pO.x}
          cy={pO.y}
          r="5"
          fill="#1e293b"
          stroke="#ffffff"
          strokeWidth="2"
          className="cursor-pointer"
          onPointerEnter={() =>
            setHoveredObj({
              id: 'vertex-O',
              title: 'Вершина O (Прямой угол 90°)',
              details: 'Фиксированное начало координат (0, 0). Гарантирует сохранение прямого угла.',
              category: 'vertex',
            })
          }
          onPointerLeave={() => setHoveredObj(null)}
        />

        {/* Interactive Point A */}
        <InteractivePoint
          id="handle-vertex-A"
          name="A"
          point={pA}
          mathCoord={calc.triangle.A}
          color="#2563eb"
          isDraggable={true}
          axisConstraint="y-axis"
          isDragging={activeDrag === 'A'}
          onPointerDown={handlePointerDownA}
          onHoverObject={setHoveredObj}
        />

        {/* Interactive Point B */}
        <InteractivePoint
          id="handle-vertex-B"
          name="B"
          point={pB}
          mathCoord={calc.triangle.B}
          color="#2563eb"
          isDraggable={true}
          axisConstraint="x-axis"
          isDragging={activeDrag === 'B'}
          onPointerDown={handlePointerDownB}
          onHoverObject={setHoveredObj}
        />
      </svg>

      {/* Bottom Board HUD: Hover Inspector + Drag Hint */}
      <div className="absolute bottom-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600 shadow-xs">
          <Compass className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span>{t.board.dragHint}</span>
        </div>

        <div className="flex items-center gap-2 bg-white/92 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200 text-xs shadow-xs max-w-md truncate">
          <Info className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
          {hoveredObj ? (
            <span className="truncate">
              <strong className="text-slate-900">{hoveredObj.title}:</strong>{' '}
              <span className="text-slate-600 font-mono text-[11px]">{hoveredObj.details}</span>
            </span>
          ) : (
            <span className="text-slate-500">{t.board.hoverDefault}</span>
          )}
        </div>
      </div>
    </div>
  );
};
