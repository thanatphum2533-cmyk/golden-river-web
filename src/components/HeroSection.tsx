'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Building2,
  Trees,
  ArrowRight,
  ChevronDown
} from 'lucide-react';

interface BannerSlide {
  id: string;
  tag: string;
  title: string;
  subtitle?: string;
  image: string;
  desktopImage?: string;
  mobileImage?: string;
  badge?: string;
}

interface HeroSectionProps {
  hero?: {
    badge?: string;
    title?: string;
    subtitle?: string;
    ctaText?: string;
    secondaryCtaText?: string;
    bannerSlides?: BannerSlide[];
  };
  company: {
    name?: string;
    slogan: string;
    description: string;
    stats: Array<{ label: string; value: string; detail: string }>;
  };
}

export default function HeroSection({ hero, company }: HeroSectionProps) {
  const defaultSlides: BannerSlide[] = [
    {
      id: 'slide-cleaning',
      tag: '🧹 บริการแม่บ้าน & ทำความสะอาดอาคาร',
      title: 'บริการแม่บ้านทำความสะอาดอาคาร คอนโดมิเนียม และเช็ดกระจกสูง',
      subtitle: 'ทีมงานแม่บ้านและช่างเช็ดกระจกมืออาชีพ ผ่านการตรวจประวัติ 100% พร้อมอุปกรณ์และน้ำยาเฉพาะทาง',
      image: '/images/hero-cleaning-desktop-fullscreen.jpg',
      desktopImage: '/images/hero-cleaning-desktop-fullscreen.jpg',
      mobileImage: '/images/hero-cleaning-mobile-1080x1920.jpg',
      badge: 'ทีมงานมืออาชีพ ตรวจประวัติ 100%'
    },
    {
      id: 'slide-garden',
      tag: '🌿 บริการดูแลสวน & ภูมิทัศน์โครงการ',
      title: 'ดูแล ตัดแต่ง และฟื้นฟู\nพื้นที่สีเขียวคอนโดมิเนียมและหมู่บ้าน',
      subtitle: 'ยกระดับความร่มรื่น เพิ่มมูลค่าให้โครงการ ด้วยทีมรุกขกรและช่างสวนมืออาชีพกว่า 5 ปี',
      image: '/images/hero-garden-desktop-1920x720.jpg',
      desktopImage: '/images/hero-garden-desktop-1920x720.jpg',
      mobileImage: '/images/hero-garden-mobile-1080x1920.jpg',
      badge: '30+ โครงการชั้นนำ ไว้วางใจ'
    }
  ];

  const slides = (hero?.bannerSlides && hero.bannerSlides.length > 0)
    ? hero.bannerSlides
    : defaultSlides;

  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 40;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    } else if (isRightSwipe) {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    }
  };

  // Auto-rotate every 6.5s when not hovered
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const activeSlide = slides[currentSlide] || slides[0];

  return (
    <section
      className="relative w-full h-[100dvh] min-h-[640px] max-h-[1080px] overflow-hidden select-none bg-slate-950 group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Full-Bleed Background Slide Cross-fade */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Responsive Picture - Full screen on any monitor and mobile */}
            <picture className="w-full h-full block">
              <source
                media="(max-width: 768px)"
                srcSet={activeSlide.image || activeSlide.mobileImage}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeSlide.image || activeSlide.desktopImage}
                alt={activeSlide.title}
                width={1920}
                height={1080}
                className="w-full h-full object-cover object-center pointer-events-none"
              />
            </picture>

            {/* Sansiri Luxury Daylight Scrim: Soft bottom gradient + Left subtle gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#001e42]/95 via-[#001e42]/40 to-transparent pointer-events-none" />
            <div className="absolute inset-y-0 left-0 w-full md:w-3/5 bg-gradient-to-r from-[#001e42]/85 via-[#001e42]/40 to-transparent pointer-events-none" />
            <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-black/85 via-black/45 to-transparent pointer-events-none z-[1]" />
          </motion.div>
        </AnimatePresence>

        {/* Hero Overlay Content Container */}
        <div className="relative max-w-7xl mx-auto h-full px-8 sm:px-10 lg:px-8 flex flex-col justify-center sm:justify-end pb-36 sm:pb-36 md:pb-40 pt-16 sm:pt-20 z-10">
          <div className="max-w-3xl mx-auto sm:mx-0 text-center sm:text-left">
            {/* Main Sansiri-Style Headline */}
            <motion.h1
              key={'title-' + currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-[3.15rem] font-bold text-white tracking-normal mb-3 sm:mb-4 drop-shadow-md whitespace-pre-line break-words"
              style={{ lineHeight: '1.55' }}
            >
              {activeSlide.title}
            </motion.h1>

            {/* Subtitle Description */}
            <motion.p
              key={'sub-' + currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
              className="text-xs sm:text-base md:text-lg text-slate-200 font-normal leading-relaxed mb-4 max-w-2xl mx-auto sm:mx-0 drop-shadow-sm whitespace-pre-line [text-wrap:pretty] break-words"
            >
              {activeSlide.subtitle || company.description}
            </motion.p>
          </div>
        </div>


        {/* Sansiri-Style Minimalist Left/Right Circular Arrows */}
        {slides.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
              }}
              aria-label="Previous Slide"
              className="absolute left-2 sm:left-8 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-13 sm:h-13 rounded-full bg-black/40 hover:bg-black/80 backdrop-blur-md text-white flex items-center justify-center transition-all opacity-70 sm:opacity-0 sm:group-hover:opacity-100 hover:scale-105 shadow-xl border border-white/20 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentSlide((prev) => (prev + 1) % slides.length);
              }}
              aria-label="Next Slide"
              className="absolute right-2 sm:right-8 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-13 sm:h-13 rounded-full bg-black/40 hover:bg-black/80 backdrop-blur-md text-white flex items-center justify-center transition-all opacity-70 sm:opacity-0 sm:group-hover:opacity-100 hover:scale-105 shadow-xl border border-white/20 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </>
        )}

        {/* Sansiri Slide Counter Indicator (01 / 02) */}
        <div className="absolute bottom-20 sm:bottom-24 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-10 z-20 flex items-center gap-3 bg-black/50 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-white text-xs font-semibold">
          <span>0{currentSlide + 1}</span>
          <span className="text-white/40">/</span>
          <span className="text-white/60">0{slides.length}</span>
          <div className="flex items-center gap-1.5 ml-1">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={'h-1.5 rounded-full transition-all duration-300 cursor-pointer ' + (
                  currentSlide === idx ? 'w-4 bg-gold-400' : 'w-1.5 bg-white/40'
                )}
                aria-label={'Slide ' + (idx + 1)}
              />
            ))}
          </div>
        </div>

        {/* ========================================================= */}
        {/* LUXURY GLASSMORPHISM SERVICE DOCK (SANSIRI / APPLE STYLE) */}
        {/* ========================================================= */}
        <div id="ServiceDock" className="absolute bottom-5 sm:bottom-8 inset-x-0 z-20 px-3 sm:px-6 pointer-events-auto flex justify-center">
          <div className="w-full max-w-3xl bg-slate-950/60 hover:bg-slate-950/70 backdrop-blur-2xl border border-white/20 rounded-full p-1.5 sm:p-2 shadow-[0_20px_50px_rgba(0,0,0,0.4)] flex items-center justify-between gap-1.5 sm:gap-4 transition-all duration-300">
            
            {/* Service Segmented Tabs (No Emojis) */}
            <div className="flex items-center gap-1 sm:gap-2 flex-1 sm:flex-none">
              {slides.map((s, idx) => {
                const isActive = currentSlide === idx;
                return (
                  <button
                    key={s.id || idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 cursor-pointer ${
                      isActive
                        ? 'bg-white text-slate-900 shadow-md font-semibold'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {idx === 0 ? (
                      <>
                        <Building2 className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${isActive ? 'text-[#0053b5]' : 'text-white/70'}`} />
                        <span>งานแม่บ้านอาคาร</span>
                      </>
                    ) : idx === 1 ? (
                      <>
                        <Trees className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${isActive ? 'text-emerald-600' : 'text-white/70'}`} />
                        <span>งานดูแลสวน</span>
                      </>
                    ) : (
                      <span>{s.tag?.replace(/^[^\w\u0E00-\u0E7F]+/, '') || s.title}</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Direct Quotation CTA Button (No AI Sparkles) */}
            <a
              href="#contact"
              className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-[#0053b5] to-[#003c82] hover:from-[#0062d6] hover:to-[#00479e] text-white text-xs sm:text-sm font-semibold tracking-wide shadow-md hover:shadow-lg transition-all active:scale-[0.98] shrink-0 cursor-pointer"
            >
              <span>ขอใบเสนอราคา</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>

      </section>
  );
}
