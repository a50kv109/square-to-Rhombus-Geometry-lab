/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ActiveModuleId } from '../../types/geometry.ts';
import { Translations } from '../../i18n/translations.ts';
import { CheckSquare, ArrowLeftRight, HelpCircle } from 'lucide-react';

interface HeaderProps {
  activeModule: ActiveModuleId;
  setActiveModule: (module: ActiveModuleId) => void;
  onOpenTestModal: () => void;
  onOpenCompareModal: () => void;
  onOpenHelpModal: () => void;
  t: Translations;
}

export const Header: React.FC<HeaderProps> = ({
  activeModule,
  setActiveModule,
  onOpenTestModal,
  onOpenCompareModal,
  onOpenHelpModal,
  t,
}) => {
  const modules: { id: ActiveModuleId; label: string }[] = [
    { id: 'module_triangle', label: t.modules.triangle },
    { id: 'module_pythagoras', label: t.modules.pythagoras },
    { id: 'module_pants', label: t.modules.pants },
    { id: 'module_experiments', label: t.modules.experiments },
  ];

  return (
    <header className="bg-white border-b border-slate-200 shrink-0">
      <div className="flex items-center justify-between gap-4 lg:gap-8 px-4 lg:px-6 py-3">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center whitespace-nowrap shrink-0">
          <span className="text-base font-bold tracking-tight text-slate-900 font-sans">
            {t.brandTitle}
          </span>
        </div>

        {/* Zone 2: 4 concise single-line navigation tabs (desktop) */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
          {modules.map((m) => (
            <button
              key={m.id}
              onClick={() => setActiveModule(m.id)}
              className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeModule === m.id
                  ? 'border-indigo-600 text-indigo-900 font-bold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              {m.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: Primary actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenCompareModal}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
            title={t.actions.compare}
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.actions.compare}</span>
          </button>

          <button
            onClick={onOpenTestModal}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
            title={t.actions.tests}
          >
            <CheckSquare className="w-3.5 h-3.5" /> {t.actions.tests}
          </button>

          <button
            onClick={onOpenHelpModal}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            title={t.actions.help}
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile horizontal module tabs */}
      <div className="flex md:hidden items-center gap-1 px-4 pb-2 overflow-x-auto">
        {modules.map((m) => (
          <button
            key={m.id}
            onClick={() => setActiveModule(m.id)}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md whitespace-nowrap shrink-0 ${
              activeModule === m.id
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>
    </header>
  );
};
