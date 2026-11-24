/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { SavedConfiguration } from '../../types/geometry.ts';
import { LanguageCode, Translations } from '../../i18n/translations.ts';
import {
  Undo2,
  Redo2,
  RotateCcw,
  Save,
  FolderOpen,
  Camera,
  PlayCircle,
  HelpCircle,
  Download,
  Upload,
  Trash2,
  X,
} from 'lucide-react';

interface BottomToolbarProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onReset: () => void;
  currentA: number;
  currentB: number;
  onLoadConfig: (a: number, b: number) => void;
  onExportPng: () => void;
  onExportSvg: () => void;
  isStepAnimating: boolean;
  onToggleStepAnimation: () => void;
  onOpenHelp: () => void;
  lang: LanguageCode;
  setLang: (lang: LanguageCode) => void;
  t: Translations;
}

const STORAGE_KEY = 'pythagoras_lab_saved_configs_v1';

export const BottomToolbar: React.FC<BottomToolbarProps> = ({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onReset,
  currentA,
  currentB,
  onLoadConfig,
  onExportPng,
  onExportSvg,
  isStepAnimating,
  onToggleStepAnimation,
  onOpenHelp,
  lang,
  setLang,
  t,
}) => {
  const [showLoadMenu, setShowLoadMenu] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);
  const [savedConfigs, setSavedConfigs] = useState<SavedConfiguration[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    const newItem: SavedConfiguration = {
      id: `cfg_${Date.now()}`,
      name: `a=${currentA.toFixed(1)}, b=${currentB.toFixed(1)}`,
      a: currentA,
      b: currentB,
      savedAt: new Date().toLocaleTimeString(),
    };
    const updated = [newItem, ...savedConfigs].slice(0, 10);
    setSavedConfigs(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore storage quota errors
    }
    setSaveFeedback('Сохранено');
    setTimeout(() => setSaveFeedback(null), 1500);
  };

  const handleDownloadJson = () => {
    const data = JSON.stringify({ a: currentA, b: currentB, exportedAt: new Date().toISOString() }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pythagoras_a${currentA}_b${currentB}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleUploadJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (typeof parsed.a === 'number' && typeof parsed.b === 'number') {
          onLoadConfig(parsed.a, parsed.b);
          setShowLoadMenu(false);
        }
      } catch {
        // ignore invalid json
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleDeleteSaved = (id: string) => {
    const updated = savedConfigs.filter((c) => c.id !== id);
    setSavedConfigs(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  return (
    <footer className="relative bg-white border-t border-slate-200 px-4 py-2 flex flex-wrap items-center justify-between gap-2 shrink-0 z-20">
      {/* Left group: History & Reset */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1 whitespace-nowrap shrink-0 transition-colors"
          title={`${t.actions.undo} (Ctrl+Z)`}
        >
          <Undo2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{t.actions.undo}</span>
        </button>

        <button
          onClick={onRedo}
          disabled={!canRedo}
          className="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1 whitespace-nowrap shrink-0 transition-colors"
          title={`${t.actions.redo} (Ctrl+Y)`}
        >
          <Redo2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{t.actions.redo}</span>
        </button>

        <button
          onClick={onReset}
          className="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center gap-1 whitespace-nowrap shrink-0 transition-colors"
          title={t.actions.reset}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{t.actions.reset}</span>
        </button>
      </div>

      {/* Center group: Save / Load / Snapshot / Step Build Animation */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <button
          onClick={handleSave}
          className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-800 flex items-center gap-1 whitespace-nowrap shrink-0 transition-colors"
        >
          <Save className="w-3.5 h-3.5 text-indigo-600" />
          <span>{saveFeedback || t.actions.save}</span>
        </button>

        <div className="relative">
          <button
            onClick={() => setShowLoadMenu(!showLoadMenu)}
            className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-800 flex items-center gap-1 whitespace-nowrap shrink-0 transition-colors"
          >
            <FolderOpen className="w-3.5 h-3.5 text-amber-600" />
            <span>{t.actions.load}</span>
          </button>

          {showLoadMenu && (
            <div className="absolute bottom-full mb-2 left-0 w-68 bg-white rounded-xl border border-slate-200 shadow-lg p-3 space-y-2.5 z-50">
              <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                <span className="text-xs font-bold text-slate-900">Конфигурации</span>
                <button
                  onClick={() => setShowLoadMenu(false)}
                  className="p-0.5 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex gap-1.5">
                <button
                  onClick={handleDownloadJson}
                  className="flex-1 px-2 py-1.5 text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 rounded-md flex items-center justify-center gap-1 text-slate-700"
                >
                  <Download className="w-3 h-3" /> Экспорт JSON
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 px-2 py-1.5 text-[11px] font-semibold bg-indigo-50 hover:bg-indigo-100 rounded-md flex items-center justify-center gap-1 text-indigo-700"
                >
                  <Upload className="w-3 h-3" /> Импорт JSON
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={handleUploadJson}
                />
              </div>

              <div className="max-h-40 overflow-y-auto space-y-1">
                {savedConfigs.length === 0 ? (
                  <p className="text-[11px] text-slate-400 text-center py-2">
                    Нет сохранённых точек
                  </p>
                ) : (
                  savedConfigs.map((cfg) => (
                    <div
                      key={cfg.id}
                      className="flex items-center justify-between gap-2 p-1.5 rounded-md hover:bg-slate-50 border border-slate-100"
                    >
                      <button
                        onClick={() => {
                          onLoadConfig(cfg.a, cfg.b);
                          setShowLoadMenu(false);
                        }}
                        className="text-left flex-1 text-xs font-mono font-semibold text-slate-800 hover:text-indigo-700"
                      >
                        {cfg.name}{' '}
                        <span className="text-[10px] font-sans text-slate-400 font-normal">
                          · {cfg.savedAt}
                        </span>
                      </button>
                      <button
                        onClick={() => handleDeleteSaved(cfg.id)}
                        className="p-1 text-slate-400 hover:text-rose-600"
                        title="Удалить"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={onExportPng}
          className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-800 flex items-center gap-1 whitespace-nowrap shrink-0 transition-colors"
          title="Скачать снимок эксперимента (PNG)"
        >
          <Camera className="w-3.5 h-3.5 text-emerald-600" />
          <span>{t.actions.snapshotPng}</span>
        </button>

        <button
          onClick={onExportSvg}
          className="px-2 py-1.5 text-xs font-mono font-medium rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-700 whitespace-nowrap shrink-0 transition-colors"
          title="Скачать векторный чертёж (SVG)"
        >
          {t.actions.snapshotSvg}
        </button>

        <button
          onClick={onToggleStepAnimation}
          className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1 whitespace-nowrap shrink-0 transition-colors ${
            isStepAnimating
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700'
          }`}
        >
          <PlayCircle className="w-3.5 h-3.5" />
          <span>{t.actions.buildAnim}</span>
        </button>
      </div>

      {/* Right group: Language Switcher & Help */}
      <div className="flex items-center gap-2">
        <div className="flex items-center p-0.5 bg-slate-100 rounded-md text-[11px] font-mono font-semibold">
          {(['ru', 'uk', 'en'] as const).map((code) => (
            <button
              key={code}
              onClick={() => setLang(code)}
              className={`px-1.5 py-0.5 rounded transition-colors uppercase ${
                lang === code ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {code}
            </button>
          ))}
        </div>

        <button
          onClick={onOpenHelp}
          className="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center gap-1 whitespace-nowrap shrink-0 transition-colors"
        >
          <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden sm:inline">{t.actions.help}</span>
        </button>
      </div>
    </footer>
  );
};
