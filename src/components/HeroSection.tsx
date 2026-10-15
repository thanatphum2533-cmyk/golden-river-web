'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Search,
  ArrowUpRight,
  Sparkles,
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
      title: 'ดูแล ตัดแต่ง และฟื้นฟูพื้นที่สีเขียวคอนโดมิเนียมและหมู่บ้าน',
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
  const [searchQuery, setSearchQuery] = useState<string>('');
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = searchQuery.toLowerCase();
    if (q.includes('สวน') || q.includes('ต้นไม้') || q.includes('หญ้า') || q.includes('ตัด')) {
      const el = document.getElementById('services');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (q.includes('โครงการ') || q.includes('คอนโด') || q.includes('ผลงาน')) {
      const el = document.getElementById('projects');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      const el = document.getElementById('services');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
        <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-center sm:justify-end pb-32 sm:pb-36 md:pb-40 pt-20 z-10">
          <div className="max-w-3xl text-left">
            {/* Main Sansiri-Style Headline */}
            <motion.h1
              key={'title-' + currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-[3.15rem] font-bold text-white tracking-normal mb-4 drop-shadow-md whitespace-pre-line"
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
              className="text-sm sm:text-base md:text-lg text-slate-200 font-normal leading-relaxed mb-4 max-w-2xl drop-shadow-sm whitespace-pre-line [text-wrap:pretty]"
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
              className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/40 hover:bg-black/80 backdrop-blur-md text-white flex items-center justify-center transition-all opacity-80 sm:opacity-0 sm:group-hover:opacity-100 hover:scale-105 shadow-xl border border-white/20 cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentSlide((prev) => (prev + 1) % slides.length);
              }}
              aria-label="Next Slide"
              className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/40 hover:bg-black/80 backdrop-blur-md text-white flex items-center justify-center transition-all opacity-80 sm:opacity-0 sm:group-hover:opacity-100 hover:scale-105 shadow-xl border border-white/20 cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Sansiri Slide Counter Indicator (01 / 03) */}
        <div className="absolute bottom-28 sm:bottom-24 right-6 sm:right-10 z-20 flex items-center gap-3 bg-black/50 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-white text-xs font-semibold">
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
        {/* 2. SANSIRI FLOATING QUICKSEARCH BAR (PINNED AT BOTTOM)    */}
        {/* ========================================================= */}
        <div id="QuickSearch" className="absolute bottom-0 inset-x-0 z-20 pb-4 sm:pb-6 px-4 sm:px-6 pointer-events-auto">
          <div className="max-w-6xl mx-auto bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl md:rounded-full p-2.5 sm:p-3 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-3">
            
            {/* Sansiri-Style Shortcut Menu Group */}
            <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              {slides.map((s, idx) => (
                <button
                  key={s.id || idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={'flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ' + (
                    currentSlide === idx
                      ? 'bg-[#0053b5] text-white shadow-md'
                      : 'text-slate-600 hover:text-[#0053b5] hover:bg-[#f0f5fc] border border-transparent'
                  )}
                >
                  {idx === 0 && <span>🧹 แม่บ้านทำความสะอาด</span>}
                  {idx === 1 && <span>🌿 บริการดูแลสวน</span>}
                  {idx > 1 && <span>{s.tag}</span>}
                </button>
              ))}
            </div>

            {/* Quick Search Input */}
            <form onSubmit={handleSearchSubmit} className="w-full md:flex-1 max-w-md relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาบริการ เช่น แม่บ้านทำความสะอาด, ตัดแต่งสวน..."
                className="w-full h-10 sm:h-11 pl-4 pr-10 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:border-[#0053b5] focus:bg-white text-slate-800 placeholder-slate-400 transition-all"
              />
              <button
                type="submit"
                className="absolute right-1.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#0053b5] hover:bg-[#003168] text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Search"
              >
                <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              </button>
            </form>

            {/* Direct Quotation CTA Button */}
            <a
              href="#contact"
              className="w-full md:w-auto px-5 py-2.5 rounded-full bg-[#0053b5] hover:bg-[#003168] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-md hover:shadow-lg cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>นัดประเมินราคาฟรี</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-white" />
            </a>
          </div>
        </div>

      </section>
  );
}
