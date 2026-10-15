'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trees, Waves, Sparkles, Check, ArrowRight, Phone } from 'lucide-react';

interface SubService {
  name: string;
  desc: string;
}

interface ServiceItem {
  id: string;
  title: string;
  titleEn: string;
  icon: string;
  badge: string;
  shortDesc: string;
  fullDesc: string;
  image: string;
  subServices: SubService[];
}

interface ServicesSectionProps {
  services: ServiceItem[];
  onSelectForQuote: (serviceTitle: string) => void;
}

export default function ServicesSection({ services, onSelectForQuote }: ServicesSectionProps) {
  // Only display active services (Cleaning & Garden), hide pool service
  const activeServices = services.filter((s) => s.id !== 'pool' && !(s as any).hidden);
  const [activeTab, setActiveTab] = useState<string>(activeServices[0]?.id || 'cleaning');

  const currentService = activeServices.find((s) => s.id === activeTab) || activeServices[0] || services[0];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Trees':
        return <Trees className="w-4 h-4 shrink-0" />;
      case 'Waves':
        return <Waves className="w-4 h-4 shrink-0" />;
      case 'Sparkles':
        return <Sparkles className="w-4 h-4 shrink-0" />;
      default:
        return <Trees className="w-4 h-4 shrink-0" />;
    }
  };

  return (
    <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Title */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-[#003168] tracking-tight">
          บริการหลักของเรา
        </h2>
        <p className="text-sm sm:text-base text-slate-500 mt-3 font-normal">
          เลือกหมวดหมู่บริการเพื่อดูขอบเขตงานและมาตรฐานการดูแลอย่างละเอียด
        </p>
      </div>

      {/* MOTION TAB SWITCHER in Navy & Gold */}
      <div className="flex justify-center mb-10 overflow-x-auto pb-2 px-2">
        <div className="inline-flex bg-navy-50/90 p-1.5 rounded-2xl border border-slate-200 shadow-inner max-w-full shrink-0">
          {activeServices.map((svc) => {
            const isActive = svc.id === activeTab;
            return (
              <button
                key={svc.id}
                onClick={() => setActiveTab(svc.id)}
                className={`relative z-10 flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold transition-colors duration-200 whitespace-nowrap shrink-0 ${
                  isActive ? 'text-white' : 'text-[#003168]/80 hover:text-[#0053b5]'
                }`}
              >
                {/* Active motion indicator background pill in Navy */}
                {isActive && (
                  <motion.div
                    layoutId="activeServiceTabPill"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    className="absolute inset-0 bg-[#003168] rounded-xl shadow-xs z-[-1]"
                  />
                )}
                <span className={isActive ? 'text-[#0053b5]' : 'text-[#0053b5]'}>
                  {getIcon(svc.icon)}
                </span>
                <span>{svc.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ANIMATED SERVICE DETAIL CONTAINER */}
      <div className="bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-md min-h-[480px] relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentService.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
          >
            {/* Left Column: Descriptions & Sub-services */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold text-[#0053b5] bg-[#f0f5fc] border border-slate-200 px-3 py-1 rounded-full">
                    {currentService.badge}
                  </span>
                  <span className="text-xs font-medium text-slate-400">
                    {currentService.titleEn}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-[#003168] tracking-tight leading-snug">
                  <span className="inline-block">{currentService.title}</span>
                </h3>
                <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
                  {currentService.fullDesc}
                </p>
              </div>

              {/* Sub-services list */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  ขอบเขตงานและบริการย่อย
                </div>
                <div className="grid grid-cols-1 gap-2.5">
                  {currentService.subServices.map((sub, i) => (
                    <motion.div
                      key={sub.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 + 0.1 }}
                      className="p-3.5 rounded-xl bg-[#f0f5fc]/40 border border-slate-100 hover:border-gold-300 hover:bg-[#f0f5fc]/80 transition-all flex items-start gap-3"
                    >
                      <div className="w-5 h-5 rounded-full bg-[#d9e5f4] text-[#0053b5] flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                        <Check className="w-3 h-3" />
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-semibold text-[#003168] leading-snug">
                          {sub.name}
                        </div>
                        <div className="text-[12px] text-slate-500 mt-0.5 leading-relaxed">
                          {sub.desc}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Action Buttons in Navy & Gold */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4">
                <button
                  onClick={() => onSelectForQuote(currentService.title)}
                  className="px-6 py-3.5 rounded-xl bg-[#003168] hover:bg-[#0053b5] text-white text-xs sm:text-sm font-semibold shadow-xs hover:shadow transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <span>ขอใบเสนอราคาสำหรับบริการนี้</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
                <a
                  href="tel:020963579"
                  className="px-5 py-3.5 rounded-xl bg-[#f0f5fc]/90 hover:bg-[#d9e5f4] text-[#003168] border border-slate-200 text-xs sm:text-sm font-medium transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <Phone className="w-3.5 h-3.5 text-[#0053b5]" />
                  <span>โทรสอบถามทันที 02 096 3579</span>
                </a>
              </div>
            </div>

            {/* Right Column: Visual Showcase */}
            <div className="lg:col-span-5 h-full flex flex-col justify-center">
              <div className="relative rounded-2xl overflow-hidden shadow-md border border-slate-200 aspect-[16/10] sm:aspect-[4/3] group bg-slate-100 w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentService.image || '/images/garden.jpg'}
                  alt={currentService.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/garden.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#003168]/95 via-[#003168]/35 to-transparent flex flex-col justify-end p-5 sm:p-7 text-white">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gold-400/20 text-white text-[11px] font-semibold uppercase tracking-wider mb-2 border border-gold-400/30 w-fit">
                    Quality Guarantee
                  </div>
                  <div className="text-base sm:text-lg font-bold text-white leading-snug whitespace-nowrap">
                    มาตรฐานการทำงานระดับพรีเมียม
                  </div>
                  <div className="text-xs text-gold-200/90 mt-1 leading-normal whitespace-nowrap">
                    ตรวจสอบคุณภาพสม่ำเสมอโดยผู้จัดการเขต
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
