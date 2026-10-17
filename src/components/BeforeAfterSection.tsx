'use client';

import React, { useState, useRef, useCallback } from 'react';
import { MoveHorizontal, CheckCircle2 } from 'lucide-react';

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

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-[#003168] tracking-tight">
          {titleText}
        </h2>
        <p className="text-sm sm:text-base text-slate-500 mt-2 font-normal leading-relaxed">
          {subtitleText}
        </p>
      </div>

      {/* Interactive Slider Container (Extra Wide & Large Showcase) */}
      <div className="w-full max-w-6xl mx-auto">
        <div
          ref={containerRef}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          onClick={(e) => handleMove(e.clientX)}
          className="relative aspect-[16/10] sm:aspect-[16/9] w-full sm:min-h-[460px] lg:min-h-[560px] rounded-3xl overflow-hidden shadow-2xl border border-slate-200 cursor-ew-resize select-none bg-slate-900 group"
        >
          {/* AFTER IMAGE (Background) */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={afterImg}
            alt={afterLbl}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />

          {/* BEFORE IMAGE (Clipped with inset clip-path for 100% pixel-perfect alignment) */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={beforeImg}
            alt={beforeLbl}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            style={{
              clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
              WebkitClipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
            }}
          />

          {/* BADGES */}
          {/* Before Label */}
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 px-2.5 py-1 sm:px-4 sm:py-1.5 rounded-full bg-black/80 backdrop-blur-md text-white text-[11px] sm:text-sm font-bold shadow-lg border border-white/20 pointer-events-none max-w-[48%] truncate">
            {beforeLbl}
          </div>

          {/* After Label */}
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 px-2.5 py-1 sm:px-4 sm:py-1.5 rounded-full bg-[#003168]/90 backdrop-blur-md text-white text-[11px] sm:text-sm font-bold shadow-lg border border-white/30 pointer-events-none flex items-center gap-1.5 max-w-[48%] truncate">
            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
            <span className="truncate">{afterLbl}</span>
          </div>

          {/* SLIDER HANDLE LINE */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_12px_rgba(0,0,0,0.6)] z-20 pointer-events-none"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-11 h-11 rounded-full bg-[#0053b5] border-2 border-white text-white shadow-2xl flex items-center justify-center pointer-events-auto cursor-grab active:cursor-grabbing hover:scale-110 transition-transform">
              <MoveHorizontal className="w-5 h-5 text-white" />
            </div>
          </div>

          {/* Hint Overlay */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 px-4 py-1.5 rounded-full bg-black/70 backdrop-blur-md text-white text-xs font-semibold shadow-md pointer-events-none">
            ← เลื่อนซ้าย-ขวา เพื่อเปรียบเทียบผลลัพธ์ →
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
