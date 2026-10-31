'use client';

import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faCheck } from '@fortawesome/free-solid-svg-icons';

export default function StylishSelect({
  value,
  onChange,
  options = [],
  placeholder = 'সিলেক্ট করুন',
  className = '',
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) =>
    typeof opt === 'object' ? opt.value === value : opt === value
  );

  const displayLabel = selectedOption
    ? typeof selectedOption === 'object'
      ? selectedOption.label
      : selectedOption
    : placeholder;

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-cream-300 dark:border-darkBorder bg-cream-50/70 dark:bg-darkBg text-forest-950 dark:text-white text-xs font-medium focus:outline-none hover:border-[#FF7A59] dark:hover:border-[#FF7A59] transition-all text-left shadow-xs"
      >
        <span className="truncate">{displayLabel}</span>
        <FontAwesomeIcon
          icon={faChevronDown}
          className={`text-[10px] text-stone-400 dark:text-darkMuted transition-transform duration-200 ml-2 shrink-0 ${
            open ? 'rotate-180 text-[#FF7A59]' : ''
          }`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1.5 w-full bg-white dark:bg-darkCard rounded-2xl shadow-xl border border-cream-200 dark:border-darkBorder p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 max-h-56 overflow-y-auto">
          {options.map((opt) => {
            const optVal = typeof opt === 'object' ? opt.value : opt;
            const optLabel = typeof opt === 'object' ? opt.label : opt;
            const isSelected = optVal === value;

            return (
              <button
                key={optVal}
                type="button"
                onClick={() => {
                  onChange(optVal);
                  setOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors text-left ${
                  isSelected
                    ? 'bg-forest-950 dark:bg-[#FF7A59] text-white font-bold'
                    : 'text-stone-700 dark:text-darkText hover:bg-cream-100 dark:hover:bg-darkBorder font-medium'
                }`}
              >
                <span className="truncate">{optLabel}</span>
                {isSelected && <FontAwesomeIcon icon={faCheck} className="text-[10px] ml-1 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

