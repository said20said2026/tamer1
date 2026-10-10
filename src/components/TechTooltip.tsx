import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, Info, Sparkles, Check, Lightbulb, X } from 'lucide-react';
import { TECH_GLOSSARY, TechTermExplanation } from '../data/techGlossary';

interface TechTooltipProps {
  termKey: keyof typeof TECH_GLOSSARY | string;
  children: React.ReactNode;
  showIcon?: boolean;
  inlineLabel?: string;
}

export const TechTooltip: React.FC<TechTooltipProps> = ({
  termKey,
  children,
  showIcon = true,
  inlineLabel,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<'top' | 'bottom'>('top');
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const termData: TechTermExplanation | undefined = TECH_GLOSSARY[termKey];

  // Adjust top/bottom positioning based on viewport proximity
  useEffect(() => {
    if (isVisible && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      if (rect.top < 180) {
        setPosition('bottom');
      } else {
        setPosition('top');
      }
    }
  }, [isVisible]);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node) &&
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node)
      ) {
        setIsVisible(false);
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isVisible]);

  if (!termData) {
    return <>{children}</>;
  }

  return (
    <div
      ref={triggerRef}
      className="relative inline-flex items-center group cursor-help select-none"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onClick={(e) => {
        e.stopPropagation();
        setIsVisible(!isVisible);
      }}
      tabIndex={0}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
      aria-label={`شرح مصطلح: ${termData.nameAr}`}
    >
      {/* Content wrapper */}
      <span className="flex items-center gap-1">
        {children}
        {showIcon && (
          <span
            className="w-4 h-4 rounded-full bg-slate-100 hover:bg-amber-100 text-slate-400 group-hover:text-amber-700 inline-flex items-center justify-center transition-colors shrink-0"
            title="انقر أو مرر الفأرة للشرح التقني"
          >
            <Info className="w-2.5 h-2.5 stroke-[2.5]" />
          </span>
        )}
      </span>

      {/* Floating Interactive Tooltip Card */}
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`absolute z-50 w-72 sm:w-80 p-3.5 bg-slate-900/95 backdrop-blur-md text-white rounded-2xl shadow-2xl border border-slate-700/80 text-right font-sans transition-all duration-200 animate-in fade-in zoom-in-95 pointer-events-auto ${
            position === 'top'
              ? 'bottom-full mb-2.5 left-1/2 -translate-x-1/2'
              : 'top-full mt-2.5 left-1/2 -translate-x-1/2'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Arrow */}
          <div
            className={`absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900 border-slate-700 rotate-45 ${
              position === 'top'
                ? 'bottom-[-6px] border-r border-b'
                : 'top-[-6px] border-l border-t'
            }`}
          />

          {/* Header */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <h5 className="text-xs font-black text-amber-300">
                {termData.nameAr}
              </h5>
            </div>
            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono font-semibold border border-slate-700">
              دليل المشتري
            </span>
          </div>

          {/* Short layman explanation */}
          <p className="text-[11px] text-slate-200 leading-relaxed mb-2.5">
            {termData.shortDesc}
          </p>

          {/* Why it matters box */}
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-2.5 flex items-start gap-2">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] font-bold text-amber-300 block mb-0.5">
                ماذا يعني لك كمستخدم؟
              </span>
              <p className="text-[11px] text-slate-300 leading-snug">
                {termData.whyItMatters}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
