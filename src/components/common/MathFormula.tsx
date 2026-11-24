/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import katex from 'katex';

interface MathFormulaProps {
  tex: string;
  block?: boolean;
  className?: string;
}

export const MathFormula: React.FC<MathFormulaProps> = ({ tex, block = false, className = '' }) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(tex, {
        displayMode: block,
        throwOnError: false,
      });
    } catch {
      return `<span>${tex}</span>`;
    }
  }, [tex, block]);

  return (
    <span
      className={`inline-block select-all ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
