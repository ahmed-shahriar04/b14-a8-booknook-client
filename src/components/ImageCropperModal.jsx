'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCropSimple,
  faXmark,
  faCheck,
  faRotateRight,
  faMagnifyingGlassPlus,
  faMagnifyingGlassMinus,
  faUser,
  faBook,
  faArrowsUpDownLeftRight,
} from '@fortawesome/free-solid-svg-icons';
import { useLang } from '../context/LanguageContext';

export default function ImageCropperModal({
  isOpen,
  imageSrc,
  defaultMode = 'profile', // 'profile' | 'book' | 'free'
  onClose,
  onCropComplete,
}) {
  const { lang, t } = useLang();
  const [cropMode, setCropMode] = useState(defaultMode); // 'profile' | 'book' | 'free'
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  // Sync default mode on open
  useEffect(() => {
    if (isOpen) {
      setCropMode(defaultMode);
      setZoom(1);
      setRotation(0);
      setOffset({ x: 0, y: 0 });
    }
  }, [isOpen, defaultMode]);

  // Load image
  useEffect(() => {
    if (!imageSrc) return;
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageRef.current = img;
      drawCanvas();
    };
    img.src = imageSrc;
  }, [imageSrc]);

  // Target aspect ratios
  const getAspectRatio = useCallback(() => {
    if (cropMode === 'profile') return 1; // 1:1
    if (cropMode === 'book') return 3 / 4; // 3:4 vertical book cover
    return null; // free
  }, [cropMode]);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Save state
    ctx.save();

    // Center and apply transforms
    ctx.translate(width / 2 + offset.x, height / 2 + offset.y);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);

    // Calculate dimensions to maintain aspect ratio
    const imgAspect = img.width / img.height;
    let drawWidth = width;
    let drawHeight = width / imgAspect;

    if (drawHeight < height) {
      drawHeight = height;
      drawWidth = height * imgAspect;
    }

    ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
    ctx.restore();
  }, [zoom, rotation, offset]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Dragging handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - offset.x,
        y: e.touches[0].clientY - offset.y,
      });
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    setOffset({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    });
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleApply = () => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;

    // Create an offscreen canvas with target crop dimensions
    const targetAspect = getAspectRatio();
    let exportWidth = 600;
    let exportHeight = targetAspect ? exportWidth / targetAspect : 600;

    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = exportWidth;
    exportCanvas.height = exportHeight;
    const exportCtx = exportCanvas.getContext('2d');

    // Smooth quality
    exportCtx.imageSmoothingEnabled = true;
    exportCtx.imageSmoothingQuality = 'high';

    // Draw from current canvas view
    exportCtx.drawImage(
      canvas,
      0,
      0,
      canvas.width,
      canvas.height,
      0,
      0,
      exportWidth,
      exportHeight
    );

    const croppedDataUrl = exportCanvas.toDataURL('image/jpeg', 0.92);
    onCropComplete(croppedDataUrl);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-darkCard w-full max-w-lg rounded-3xl border border-cream-200 dark:border-darkBorder shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-cream-200 dark:border-darkBorder flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#E8DFD6] dark:bg-stone-800 flex items-center justify-center text-forest-950 dark:text-cream-100 shadow-inner">
              <FontAwesomeIcon icon={faCropSimple} className="text-sm" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-forest-950 dark:text-white font-bangla">
                {t('cropImageTitle')}
              </h3>
              <p className="text-[11px] text-stone-400 font-bangla">
                {t('cropImageDesc')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-cream-100 dark:hover:bg-darkBorder text-stone-400 hover:text-stone-700 dark:hover:text-white flex items-center justify-center transition-colors"
          >
            <FontAwesomeIcon icon={faXmark} className="text-sm" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="px-6 pt-4 pb-2 bg-cream-50/50 dark:bg-stone-900/30 border-b border-cream-100 dark:border-darkBorder">
          <div className="grid grid-cols-3 gap-2 text-xs font-bold font-bangla">
            <button
              type="button"
              onClick={() => setCropMode('profile')}
              className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                cropMode === 'profile'
                  ? 'bg-forest-950 dark:bg-[#FF7A59] text-white shadow-xs'
                  : 'bg-white dark:bg-darkBorder text-stone-600 dark:text-darkText hover:bg-cream-100'
              }`}
            >
              <FontAwesomeIcon icon={faUser} className="text-xs" />
              <span>{t('cropProfileTab')}</span>
            </button>

            <button
              type="button"
              onClick={() => setCropMode('book')}
              className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                cropMode === 'book'
                  ? 'bg-forest-950 dark:bg-[#FF7A59] text-white shadow-xs'
                  : 'bg-white dark:bg-darkBorder text-stone-600 dark:text-darkText hover:bg-cream-100'
              }`}
            >
              <FontAwesomeIcon icon={faBook} className="text-xs" />
              <span>{t('cropBookTab')}</span>
            </button>

            <button
              type="button"
              onClick={() => setCropMode('free')}
              className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                cropMode === 'free'
                  ? 'bg-forest-950 dark:bg-[#FF7A59] text-white shadow-xs'
                  : 'bg-white dark:bg-darkBorder text-stone-600 dark:text-darkText hover:bg-cream-100'
              }`}
            >
              <FontAwesomeIcon icon={faArrowsUpDownLeftRight} className="text-xs" />
              <span>{t('cropFreeTab')}</span>
            </button>
          </div>
        </div>

        {/* Canvas / Viewport */}
        <div className="relative p-6 flex items-center justify-center bg-stone-900/90 select-none overflow-hidden min-h-[300px]">
          <canvas
            ref={canvasRef}
            width={340}
            height={cropMode === 'book' ? 440 : 340}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
            className={`cursor-grab active:cursor-grabbing border-2 border-dashed border-[#FF7A59]/80 shadow-2xl transition-all ${
              cropMode === 'profile' ? 'rounded-full' : cropMode === 'book' ? 'rounded-2xl' : 'rounded-lg'
            }`}
          />

          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-xs text-[10px] text-white/80 pointer-events-none font-bangla">
            {t('cropDragHint')}
          </div>
        </div>

        {/* Controls: Zoom Slider + Rotate */}
        <div className="p-4 bg-cream-50 dark:bg-stone-900/40 border-t border-cream-200 dark:border-darkBorder space-y-3">
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-stone-600 dark:text-darkText font-bangla whitespace-nowrap flex items-center gap-1">
              <FontAwesomeIcon icon={faMagnifyingGlassMinus} className="text-[10px]" />
              <span>{t('cropZoom')}</span>
            </span>

            <input
              type="range"
              min="0.6"
              max="2.5"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full accent-[#FF7A59] cursor-pointer"
            />

            <span className="text-xs font-bold text-stone-600 dark:text-darkText">
              <FontAwesomeIcon icon={faMagnifyingGlassPlus} className="text-xs" />
            </span>

            <button
              type="button"
              onClick={handleRotate}
              className="p-2 rounded-xl bg-white dark:bg-darkBorder text-stone-700 dark:text-white hover:bg-cream-100 transition-colors shadow-xs shrink-0 flex items-center gap-1.5 text-xs font-bangla font-semibold"
              title={t('cropRotate')}
            >
              <FontAwesomeIcon icon={faRotateRight} />
              <span>90°</span>
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white dark:bg-darkCard border-t border-cream-200 dark:border-darkBorder flex items-center justify-end gap-3 font-bangla">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-cream-300 dark:border-darkBorder text-stone-600 dark:text-darkText hover:bg-cream-100 dark:hover:bg-darkBorder text-xs font-semibold transition-all"
          >
            {t('cropCancel')}
          </button>

          <button
            type="button"
            onClick={handleApply}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-forest-950 dark:bg-[#FF7A59] hover:bg-forest-900 dark:hover:bg-[#ff6842] text-white text-xs font-bold shadow-md transition-all"
          >
            <FontAwesomeIcon icon={faCheck} className="text-xs" />
            <span>{t('cropApply')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
