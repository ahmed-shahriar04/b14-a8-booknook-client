'use client';

import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faCheck, faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons';

export default function StylishSelect({
  value,
  onChange,
  options = [],
  placeholder = 'সিলেক্ট করুন',
  searchable = false,
  searchPlaceholder = 'অনুসন্ধান করুন...',
  className = '',
}) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (open && searchable && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [open, searchable]);

  const selectedOption = options.find((opt) =>
    typeof opt === 'object' ? opt.value === value : opt === value
  );

  const displayLabel = selectedOption
    ? typeof selectedOption === 'object'
      ? selectedOption.label
      : selectedOption
    : placeholder;

  // Filter options based on search query
  const filteredOptions = options.filter((opt) => {
    if (!searchQuery.trim()) return true;
    const label = typeof opt === 'object' ? opt.label : opt;
    return String(label).toLowerCase().includes(searchQuery.toLowerCase().trim());
  });

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => {
          setOpen(!open);
          if (open) setSearchQuery('');
        }}
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
        <div className="absolute left-0 top-full mt-1.5 w-full bg-white dark:bg-darkCard rounded-2xl shadow-xl border border-cream-200 dark:border-darkBorder p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 max-h-60 overflow-y-auto">
          {/* Search Input when searchable is true */}
          {searchable && (
            <div className="sticky top-0 bg-white dark:bg-darkCard pb-1.5 mb-1 border-b border-cream-100 dark:border-darkBorder z-10">
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-cream-50 dark:bg-stone-900 border border-cream-200 dark:border-stone-800 text-xs">
                <FontAwesomeIcon icon={faMagnifyingGlass} className="text-stone-400 text-[10px]" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full bg-transparent text-xs text-forest-950 dark:text-white focus:outline-none placeholder:text-stone-400"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 p-0.5"
                  >
                    <FontAwesomeIcon icon={faXmark} className="text-[10px]" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Options List */}
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt) => {
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
                    setSearchQuery('');
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
            })
          ) : (
            <div className="py-4 text-center text-xs text-stone-400 font-medium">
              {searchQuery ? 'কোনো লেখক পাওয়া যায়নি' : 'কোনো তথ্য নেই'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
