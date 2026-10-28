'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { MoveHorizontal, CheckCircle2, Play, Pause } from 'lucide-react';

interface BeforeAfterProps {
  beforeAfter?: {
    badge?: string;
    title?: string;
    subtitle?: string;
    beforeImage?: string;
    beforeLabel?: string;
    afterImage?: string;
    afterLabel?: string;
    features?: Array<{ title: string; desc: string }>;
  };
}

export default function BeforeAfterSection({ beforeAfter }: BeforeAfterProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const isInteractingRef = useRef(false);
  const phaseRef = useRef(0);
  const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const badgeText = beforeAfter?.badge || 'Flood Restoration & Deep Cleaning';
  const titleText = beforeAfter?.title || 'เปรียบเทียบผลลัพธ์ ก่อน และ หลัง ทำความสะอาดบ้านน้ำท่วม';
  const subtitleText = beforeAfter?.subtitle || 'เลื่อนแถบเปรียบเทียบตรงกลาง เพื่อสัมผัสการขจัดคราบโคลน ล้างคราบน้ำ และฆ่าเชื้อฟื้นฟูที่พักอาศัยโดยทีมงานมืออาชีพ';
  const beforeImg = beforeAfter?.beforeImage || '/images/flood-cleaning-before.jpg';
  const afterImg = beforeAfter?.afterImage || '/images/flood-cleaning-after.jpg';
  const beforeLbl = beforeAfter?.beforeLabel || '⚠️ สภาพคราบโคลนและน้ำท่วมขัง (Before)';
  const afterLbl = beforeAfter?.afterLabel || '✨ ฟื้นฟูคลีนนิ่งโดย GR Group (After)';
  const featureList = beforeAfter?.features && beforeAfter.features.length > 0 ? beforeAfter.features : [
    { title: 'ขจัดคราบโคลนและตะกอนฝังแน่น', desc: 'ล้างทำความสะอาดพื้นผิว กระเบื้อง และซอกมุมที่เข้าถึงยาก' },
    { title: 'ล้างคราบรอยน้ำและขจัดกลิ่นอับ', desc: 'เช็ดล้างผนัง กำจัดคราบตะกอนน้ำท่วมและกลิ่นไม่พึงประสงค์' },
    { title: 'ฉีดพ่นน้ำยาฆ่าเชื้อโรคและเชื้อรา', desc: 'ยกระดับสุขอนามัย คืนความสะอาดปลอดภัยและสุขภาพที่ดีให้ทุกคนในบ้าน' }
  ];

  // Auto-play animation using smooth sine oscillation (oscillates between 20% and 80%)
  useEffect(() => {
    let animId: number;
    let lastTime: number | null = null;

    const animate = (time: number) => {
      if (lastTime === null) lastTime = time;
      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      if (isAutoPlay && !isInteractingRef.current) {
        // Speed: ~0.85 rad/s (~7.4 seconds for a complete back-and-forth cycle)
        phaseRef.current += delta * 0.85;
        const newPos = 50 + 32 * Math.sin(phaseRef.current);
        setSliderPosition(newPos);
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(animId);
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
    };
  }, [isAutoPlay]);

  const syncPhaseWithPosition = (pos: number) => {
    const ratio = Math.max(-1, Math.min(1, (pos - 50) / 32));
    const currentPhaseMod = ((phaseRef.current % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    const movingLeft = currentPhaseMod > Math.PI / 2 && currentPhaseMod < (3 * Math.PI) / 2;
    const baseAngle = Math.asin(ratio);
    phaseRef.current = movingLeft ? Math.PI - baseAngle : baseAngle;
  };

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
    syncPhaseWithPosition(percentage);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    isInteractingRef.current = true;
    if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
    setIsDragging(true);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    updatePosition(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging) {
      updatePosition(e.clientX);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
    // Resume auto-slide after 2.5 seconds of inactivity
    if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
    idleTimeoutRef.current = setTimeout(() => {
      isInteractingRef.current = false;
    }, 2500);
  };

  return (
    <section className="py-12 sm:py-20 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
        <h2 className="text-xl sm:text-4xl font-extrabold text-[#003168] tracking-tight">
          {titleText}
        </h2>
        <p className="text-xs sm:text-base text-slate-500 mt-2 font-normal leading-relaxed">
          {subtitleText}
        </p>
      </div>

      {/* Interactive Slider Container with Pointer Capture & Touch-none */}
      <div className="w-full max-w-6xl mx-auto">
        <div
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="relative aspect-[4/3] sm:aspect-[16/9] w-full sm:min-h-[460px] lg:min-h-[560px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-slate-200 cursor-ew-resize select-none bg-slate-900 group touch-none"
        >
          {/* AFTER IMAGE (Background) */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={afterImg}
            alt={afterLbl}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
            draggable={false}
          />

          {/* BEFORE IMAGE (Clipped with inset clip-path) */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={beforeImg}
            alt={beforeLbl}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
            draggable={false}
            style={{
              clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
              WebkitClipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
            }}
          />

          {/* BADGES */}
          {/* Before Label */}
          <div className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4 z-10 px-2.5 py-1 sm:px-4 sm:py-1.5 rounded-full bg-black/85 backdrop-blur-md text-white text-[10px] sm:text-sm font-bold shadow-lg border border-white/20 pointer-events-none max-w-[45%] flex items-center min-w-0 select-none">
            <span className="truncate">
              <span className="sm:hidden">⚠️ ก่อน (Before)</span>
              <span className="hidden sm:inline">{beforeLbl}</span>
            </span>
          </div>

          {/* After Label */}
          <div className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 z-10 px-2.5 py-1 sm:px-4 sm:py-1.5 rounded-full bg-[#003168]/90 backdrop-blur-md text-white text-[10px] sm:text-sm font-bold shadow-lg border border-white/30 pointer-events-none flex items-center gap-1 sm:gap-1.5 max-w-[45%] min-w-0 select-none">
            <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
            <span className="truncate">
              <span className="sm:hidden">หลังดูแล (After)</span>
              <span className="hidden sm:inline">{afterLbl}</span>
            </span>
          </div>

          {/* SLIDER HANDLE LINE */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_14px_rgba(0,0,0,0.7)] z-20 pointer-events-none"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-[#0053b5] border-2 border-white text-white shadow-2xl flex items-center justify-center cursor-ew-resize hover:scale-110 active:scale-95 transition-transform pointer-events-none">
              <MoveHorizontal className="w-4 h-4 sm:w-5 sm:h-5 text-white animate-pulse" />
            </div>
          </div>

          {/* Interactive Hint & Auto-play control toggle */}
          <div className="absolute bottom-2.5 sm:bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 sm:gap-3 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-black/80 backdrop-blur-md text-white text-xs font-semibold shadow-lg border border-white/10 select-none max-w-[94%]">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsAutoPlay((prev) => !prev);
              }}
              onPointerDown={(e) => e.stopPropagation()}
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-bold transition-colors cursor-pointer shrink-0"
              title={isAutoPlay ? 'คลิกเพื่อหยุดเลื่อนอัตโนมัติ' : 'คลิกเพื่อเริ่มเลื่อนอัตโนมัติ'}
            >
              {isAutoPlay ? (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                  </span>
                  <span className="text-[10px] sm:text-xs">เลื่อนอัตโนมัติ</span>
                  <Pause className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white/70 ml-0.5" />
                </>
              ) : (
                <>
                  <span className="inline-flex rounded-full h-2 w-2 bg-slate-400"></span>
                  <span className="text-[10px] sm:text-xs text-slate-300">หยุดชั่วคราว</span>
                  <Play className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-400 ml-0.5 fill-emerald-400" />
                </>
              )}
            </button>
            <span className="text-white/30 text-xs">|</span>
            <span className="text-[10px] sm:text-xs text-slate-300 font-normal truncate">แตะหรือลากเพื่อเลื่อน</span>
          </div>
        </div>

        {/* Feature bullets */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          {featureList.map((item, fIdx) => (
            <div key={fIdx} className="p-5 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200 shadow-xs hover:border-[#0053b5]/50 transition-all text-center">
              <div className="text-sm font-bold text-[#003168]">{item.title}</div>
              <div className="text-xs text-slate-500 mt-1 leading-relaxed">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
