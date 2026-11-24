/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { ActiveModuleId, DisplayMode } from './types/geometry.ts';
import { calculatePythagoreanPants } from './math/PythagoreanPants.ts';
import { LanguageCode, TRANSLATIONS } from './i18n/translations.ts';
import { Header } from './components/common/Header.tsx';
import { BottomToolbar } from './components/common/BottomToolbar.tsx';
import { GeometryBoard } from './components/geometry/GeometryBoard.tsx';
import { ControlsPanel } from './components/panels/ControlsPanel.tsx';
import { ResearchPanel } from './components/panels/ResearchPanel.tsx';
import { InvariantsPanel } from './components/panels/InvariantsPanel.tsx';
import { ComparisonModal } from './components/panels/ComparisonModal.tsx';
import { TestRunnerModal } from './components/panels/TestRunnerModal.tsx';
import { HelpModal } from './components/panels/HelpModal.tsx';
import { ModuleRightTriangle } from './components/modules/ModuleRightTriangle.tsx';
import { ModulePythagoreanTheorem } from './components/modules/ModulePythagoreanTheorem.tsx';
import { ModuleExperiments } from './components/modules/ModuleExperiments.tsx';

interface HistoryEntry {
  a: number;
  b: number;
}

export default function App() {
  // Primary triangle legs state: Default Egyptian (a=4, b=3)
  const [a, setA] = useState<number>(4);
  const [b, setB] = useState<number>(3);

  // History stack for Undo / Redo
  const [history, setHistory] = useState<HistoryEntry[]>([{ a: 4, b: 3 }]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // Language state (Russian default, Ukrainian & English supported)
  const [lang, setLang] = useState<LanguageCode>('ru');
  const t = TRANSLATIONS[lang];

  // Active educational module & display mode
  const [activeModule, setActiveModule] = useState<ActiveModuleId>('module_pants');
  const [displayMode, setDisplayMode] = useState<DisplayMode>('research');
  const [isRightPanelOpen, setIsRightPanelOpen] = useState<boolean>(true);

  // Visualization layer toggles
  const [highlightLayer, setHighlightLayer] = useState<'all' | 'L1' | 'L2' | 'L3'>('all');
  const [showSquareHypotenuse, setShowSquareHypotenuse] = useState<boolean>(false);
  const [showDiagonals, setShowDiagonals] = useState<boolean>(true);

  // Step-by-step construction animation (L1 -> L2 -> L3 -> all)
  const [isStepAnimating, setIsStepAnimating] = useState<boolean>(false);

  // Modals state
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  // SVG Board ref for Snapshot export
  const svgBoardRef = useRef<SVGSVGElement | null>(null);

  // Main unified mathematical calculation DAG
  const calc = useMemo(() => {
    return calculatePythagoreanPants(a, b);
  }, [a, b]);

  // Push a discrete configuration snapshot to Undo/Redo history
  const pushHistory = useCallback(
    (nextA: number, nextB: number) => {
      setHistory((prev) => {
        const sliced = prev.slice(0, historyIndex + 1);
        const last = sliced[sliced.length - 1];
        if (last && Math.abs(last.a - nextA) < 1e-4 && Math.abs(last.b - nextB) < 1e-4) {
          return sliced;
        }
        const updated = [...sliced, { a: nextA, b: nextB }].slice(-40);
        setHistoryIndex(updated.length - 1);
        return updated;
      });
    },
    [historyIndex]
  );

  const clampVal = (val: number) => {
    if (!Number.isFinite(val)) return 1;
    return Math.max(0.2, Math.min(15, Math.round(val * 100) / 100));
  };

  const handleChangeA = useCallback(
    (newA: number, recordHistory = true) => {
      const clamped = clampVal(newA);
      setA(clamped);
      if (recordHistory) {
        pushHistory(clamped, b);
      }
    },
    [b, pushHistory]
  );

  const handleChangeB = useCallback(
    (newB: number, recordHistory = true) => {
      const clamped = clampVal(newB);
      setB(clamped);
      if (recordHistory) {
        pushHistory(a, clamped);
      }
    },
    [a, pushHistory]
  );

  const handleSetBoth = useCallback(
    (newA: number, newB: number, recordHistory = true) => {
      const clampedA = clampVal(newA);
      const clampedB = clampVal(newB);
      setA(clampedA);
      setB(clampedB);
      if (recordHistory) {
        pushHistory(clampedA, clampedB);
      }
    },
    [pushHistory]
  );

  const handleCommitDrag = useCallback(() => {
    pushHistory(a, b);
  }, [a, b, pushHistory]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const handleUndo = useCallback(() => {
    if (historyIndex <= 0) return;
    const prevIdx = historyIndex - 1;
    const entry = history[prevIdx];
    setHistoryIndex(prevIdx);
    setA(entry.a);
    setB(entry.b);
  }, [history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex >= history.length - 1) return;
    const nextIdx = historyIndex + 1;
    const entry = history[nextIdx];
    setHistoryIndex(nextIdx);
    setA(entry.a);
    setB(entry.b);
  }, [history, historyIndex]);

  const handleReset = useCallback(() => {
    handleSetBoth(4, 3, true);
    setHighlightLayer('all');
  }, [handleSetBoth]);

  // Keyboard shortcuts for Undo (Ctrl/Cmd+Z) and Redo (Ctrl/Cmd+Y or Ctrl+Shift+Z)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) handleRedo();
        else handleUndo();
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleUndo, handleRedo]);

  // Step-by-step Construction Animation: L1 -> L2 -> L3 -> all
  useEffect(() => {
    if (!isStepAnimating) return;

    setActiveModule('module_pants');
    const sequence: Array<'L1' | 'L2' | 'L3' | 'all'> = ['L1', 'L2', 'L3', 'all'];
    let stepIdx = 0;
    setHighlightLayer(sequence[0]);

    const timer = setInterval(() => {
      stepIdx += 1;
      if (stepIdx >= sequence.length) {
        setHighlightLayer('all');
        setIsStepAnimating(false);
        clearInterval(timer);
      } else {
        setHighlightLayer(sequence[stepIdx]);
      }
    }, 1200);

    return () => clearInterval(timer);
  }, [isStepAnimating]);

  // Export SVG snapshot
  const handleExportSvg = useCallback(() => {
    const svg = svgBoardRef.current;
    if (!svg) return;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pythagoras_lab_a${a}_b${b}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  }, [a, b]);

  // Export PNG snapshot via offscreen Canvas
  const handleExportPng = useCallback(() => {
    const svg = svgBoardRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const width = Math.max(800, rect.width || 1000);
    const height = Math.max(600, rect.height || 700);

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width * 2;
      canvas.height = height * 2;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.scale(2, 2);
        ctx.drawImage(img, 0, 0, width, height);
        const pngUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = pngUrl;
        link.download = `pythagoras_lab_a${a}_b${b}.png`;
        link.click();
      }
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }, [a, b]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-100 text-slate-900 font-sans">
      {/* Top Header */}
      <Header
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        onOpenTestModal={() => setIsTestModalOpen(true)}
        onOpenCompareModal={() => setIsCompareModalOpen(true)}
        onOpenHelpModal={() => setIsHelpModalOpen(true)}
        t={t}
      />

      {/* Main Workspace (Split 2-zone sandbox layout) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Zone: GEOMETRY BOARD */}
        <section
          aria-label="Интерактивный геометрический планшет"
          className={`relative bg-white transition-all ${
            isRightPanelOpen
              ? 'flex-1 lg:flex-[1.45] h-[45vh] lg:h-full border-b lg:border-b-0 lg:border-r border-slate-200'
              : 'flex-1 h-full w-full'
          }`}
        >
          <GeometryBoard
            calc={calc}
            activeModule={activeModule}
            onChangeA={handleChangeA}
            onChangeB={handleChangeB}
            onCommitDrag={handleCommitDrag}
            highlightLayer={highlightLayer}
            setHighlightLayer={setHighlightLayer}
            showSquareHypotenuse={showSquareHypotenuse}
            setShowSquareHypotenuse={setShowSquareHypotenuse}
            showDiagonals={showDiagonals}
            setShowDiagonals={setShowDiagonals}
            isRightPanelOpen={isRightPanelOpen}
            onToggleRightPanel={() => setIsRightPanelOpen(!isRightPanelOpen)}
            svgRefExternal={svgBoardRef}
            t={t}
          />
        </section>

        {/* Right Zone: RESEARCH DATA & CONTROLS DECK */}
        {isRightPanelOpen && (
          <aside
            aria-label="Панель исследований и управления"
            className="flex-1 lg:flex-[1] h-[55vh] lg:h-full overflow-y-auto bg-slate-50/70 p-4 space-y-4"
          >
            <ControlsPanel
              calc={calc}
              onChangeA={handleChangeA}
              onChangeB={handleChangeB}
              onSetBoth={handleSetBoth}
            />

            {activeModule === 'module_triangle' && <ModuleRightTriangle calc={calc} />}

            {activeModule === 'module_pythagoras' && <ModulePythagoreanTheorem calc={calc} />}

            {activeModule === 'module_experiments' && (
              <ModuleExperiments calc={calc} onSetBoth={(na, nb) => handleSetBoth(na, nb, true)} />
            )}

            <ResearchPanel
              calc={calc}
              displayMode={displayMode}
              setDisplayMode={setDisplayMode}
              t={t}
            />

            <InvariantsPanel calc={calc} />
          </aside>
        )}
      </div>

      {/* Bottom Action Toolbar */}
      <BottomToolbar
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onReset={handleReset}
        currentA={a}
        currentB={b}
        onLoadConfig={(na, nb) => handleSetBoth(na, nb, true)}
        onExportPng={handleExportPng}
        onExportSvg={handleExportSvg}
        isStepAnimating={isStepAnimating}
        onToggleStepAnimation={() => setIsStepAnimating(!isStepAnimating)}
        onOpenHelp={() => setIsHelpModalOpen(true)}
        lang={lang}
        setLang={setLang}
        t={t}
      />

      {/* Modals */}
      <ComparisonModal
        currentCalc={calc}
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        onApplyConfig={(na, nb) => handleSetBoth(na, nb, true)}
      />

      <TestRunnerModal
        isOpen={isTestModalOpen}
        onClose={() => setIsTestModalOpen(false)}
        onLoadTestCase={(na, nb) => handleSetBoth(na, nb, true)}
      />

      <HelpModal isOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} />
    </div>
  );
}
