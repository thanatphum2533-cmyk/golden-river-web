'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Clock, Calendar, ArrowRight, X, User, ArrowUpRight,
  Image as ImageIcon, ChevronLeft, ChevronRight, MapPin, CheckCircle2
} from 'lucide-react';

export interface ArticleItem {
  id: string;
  slug: string;
  title: string;
  date: string;
  author: string;
  readTime: string;
  summary: string;
  content?: string;
  image: string;
  images?: string[];
  gallery?: string[];
  tags: string[];
}

export interface CsrItem {
  id: string;
  title: string;
  titleFull?: string;
  date: string;
  location: string;
  desc: string;
  content?: string;
  image: string;
  category: string;
  gallery?: string[];
}

interface ArticlesSectionProps {
  articles: ArticleItem[];
  csrList?: CsrItem[];
}

type TabType = 'all' | 'articles' | 'csr';

export default function ArticlesSection({ articles = [], csrList = [] }: ArticlesSectionProps) {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [selectedArticle, setSelectedArticle] = useState<ArticleItem | null>(null);
  const [selectedCsr, setSelectedCsr] = useState<CsrItem | null>(null);

  // Photo carousel index for article modal
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  // Photo for CSR modal
  const [activeCsrPhoto, setActiveCsrPhoto] = useState<string>('');

  const handleOpenArticle = (item: ArticleItem) => {
    setSelectedArticle(item);
    setActivePhotoIdx(0);
  };

  const handleOpenCsr = (item: CsrItem) => {
    setSelectedCsr(item);
    setActiveCsrPhoto(item.image);
  };

  const handleConsult = () => {
    setSelectedArticle(null);
    setSelectedCsr(null);
    const elem = document.getElementById('contact');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const activeArticlePhotos = selectedArticle
    ? (selectedArticle.images && selectedArticle.images.length > 0
        ? selectedArticle.images
        : (selectedArticle.gallery && selectedArticle.gallery.length > 0
            ? selectedArticle.gallery
            : [selectedArticle.image]))
    : [];

  const handlePrevArticlePhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActivePhotoIdx((prev) => (prev === 0 ? activeArticlePhotos.length - 1 : prev - 1));
  };

  const handleNextArticlePhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActivePhotoIdx((prev) => (prev === activeArticlePhotos.length - 1 ? 0 : prev + 1));
  };

  // Build unified items list
  type UnifiedItem = 
    | { type: 'article'; data: ArticleItem; sortDate: string }
    | { type: 'csr'; data: CsrItem; sortDate: string };

  const unifiedList: UnifiedItem[] = [];

  if (activeTab === 'all' || activeTab === 'articles') {
    articles.forEach((art) => {
      unifiedList.push({ type: 'article', data: art, sortDate: art.date });
    });
  }

  if (activeTab === 'all' || activeTab === 'csr') {
    csrList.forEach((c) => {
      unifiedList.push({ type: 'csr', data: c, sortDate: c.date });
    });
  }

  const totalCount = articles.length + csrList.length;

  return (
    <section id="articles" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/60 backdrop-blur-md border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#003168] tracking-tight">
            คำแนะนำและบทความ
          </h2>
          <p className="text-sm sm:text-base text-slate-500 mt-2 font-normal leading-relaxed">
            รวบรวมเกร็ดความรู้มาตรฐานการบริการ การดูแลพื้นที่สีเขียว และเรื่องราวกิจกรรมเพื่อสังคมโดยทีมงาน GR Group
          </p>
        </div>

        {/* Filter Tabs (Sansiri Luxury Pill Switcher) */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap shadow-xs ${
              activeTab === 'all'
                ? 'bg-[#0053b5] text-white shadow-md'
                : 'bg-white/85 text-slate-600 hover:text-[#0053b5] border border-slate-200 hover:bg-slate-50'
            }`}
          >
            ทั้งหมด ({totalCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('articles')}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap shadow-xs ${
              activeTab === 'articles'
                ? 'bg-[#0053b5] text-white shadow-md'
                : 'bg-white/85 text-slate-600 hover:text-[#0053b5] border border-slate-200 hover:bg-slate-50'
            }`}
          >
            คำแนะนำและสาระน่ารู้ ({articles.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('csr')}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap shadow-xs ${
              activeTab === 'csr'
                ? 'bg-[#0053b5] text-white shadow-md'
                : 'bg-white/85 text-slate-600 hover:text-[#0053b5] border border-slate-200 hover:bg-slate-50'
            }`}
          >
            กิจกรรมเพื่อสังคม ({csrList.length})
          </button>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {unifiedList.map((item, idx) => {
            if (item.type === 'article') {
              const art = item.data;
              const itemPhotos = art.images && art.images.length > 0
                ? art.images
                : (art.gallery && art.gallery.length > 0 ? art.gallery : [art.image]);

              return (
                <motion.div
                  key={`art-${art.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: (idx % 3) * 0.1 }}
                  onClick={() => handleOpenArticle(art)}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:border-[#0053b5]/60 transition-all duration-300 flex flex-col group cursor-pointer"
                >
                  <div className="aspect-[16/10] overflow-hidden relative bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={art.image}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/garden.jpg';
                      }}
                    />
                    {/* Category / Type Badge */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                      <span className="text-[10px] font-bold text-white bg-[#0053b5]/90 backdrop-blur-xs px-2.5 py-1 rounded-full shadow-xs">
                        คำแนะนำ
                      </span>
                      {art.tags?.[0] && (
                        <span className="text-[10px] font-bold text-white bg-slate-900/75 backdrop-blur-xs px-2.5 py-1 rounded-full border border-white/20 hidden sm:inline-block">
                          #{art.tags[0]}
                        </span>
                      )}
                    </div>

                    {/* Multi-Photo Count Badge */}
                    {itemPhotos.length > 1 && (
                      <div className="absolute bottom-3 right-3">
                        <span className="text-[10px] font-bold text-white bg-black/60 backdrop-blur-xs px-2.5 py-0.5 rounded-md border border-white/20 flex items-center gap-1">
                          <ImageIcon className="w-3 h-3 text-white" />
                          <span>{itemPhotos.length} รูป</span>
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-2.5">
                        <span className="flex items-center gap-1 font-semibold text-[#0053b5]">
                          <Calendar className="w-3.5 h-3.5" />
                          {art.date}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {art.readTime}
                        </span>
                      </div>

                      <h3 className="font-bold text-[#003168] text-base mb-2 group-hover:text-[#0053b5] transition-colors leading-snug line-clamp-2">
                        {art.title}
                      </h3>

                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4 font-normal">
                        {art.summary}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {art.tags?.slice(0, 2).map((t) => (
                          <span
                            key={t}
                            className="text-[10px] text-[#0053b5] bg-[#f0f5fc] border border-slate-200 px-2 py-0.5 rounded-md font-medium"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                      <span className="text-xs font-bold text-[#0053b5] flex items-center gap-1 group-hover:translate-x-1 transition-transform whitespace-nowrap">
                        อ่านต่อ <ArrowRight className="w-3.5 h-3.5 text-[#0053b5]" />
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            } else {
              // CSR Card
              const csr = item.data;
              const csrPhotos = (csr.gallery && csr.gallery.length > 0)
                ? csr.gallery
                : ((csr as any).images && (csr as any).images.length > 0
                    ? (csr as any).images
                    : [csr.image]);

              return (
                <motion.div
                  key={`csr-${csr.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: (idx % 3) * 0.1 }}
                  onClick={() => handleOpenCsr(csr)}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:border-[#0053b5]/60 transition-all duration-300 flex flex-col group cursor-pointer"
                >
                  <div className="aspect-[16/10] overflow-hidden relative bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={csr.image}
                      alt={csr.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                      <span className="text-[10px] font-bold text-white bg-[#003168]/90 backdrop-blur-xs px-2.5 py-1 rounded-full shadow-xs">
                        กิจกรรมเพื่อสังคม
                      </span>
                      <span className="text-[10px] font-bold text-white bg-slate-900/75 backdrop-blur-xs px-2.5 py-1 rounded-full border border-white/20 hidden sm:inline-block">
                        {csr.category}
                      </span>
                    </div>

                    {csrPhotos.length > 1 && (
                      <div className="absolute bottom-3 right-3">
                        <span className="text-[10px] font-bold text-white bg-black/60 backdrop-blur-xs px-2.5 py-0.5 rounded-md border border-white/20 flex items-center gap-1">
                          <ImageIcon className="w-3.5 h-3.5 text-white" />
                          <span>{csrPhotos.length} รูป</span>
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-2.5">
                        <span className="flex items-center gap-1 font-semibold text-[#0053b5]">
                          <Calendar className="w-3.5 h-3.5" />
                          {csr.date}
                        </span>
                      </div>

                      <h3 className="font-bold text-[#003168] text-base mb-2 group-hover:text-[#0053b5] transition-colors leading-snug line-clamp-2">
                        {csr.title}
                      </h3>

                      <div className="flex items-start gap-1 text-xs text-slate-500 mb-2.5">
                        <MapPin className="w-3.5 h-3.5 text-[#0053b5] shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{csr.location}</span>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4 font-normal">
                        {csr.desc}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#0053b5]">
                      <span>คลิกดูภาพกิจกรรมจริง</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </motion.div>
              );
            }
          })}
        </div>
      </div>

      {/* ARTICLE FULL READING MODAL */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 relative text-left my-auto"
            >
              {/* Floating Close Button */}
              <button
                onClick={() => setSelectedArticle(null)}
                className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-rose-600 shadow-md flex items-center justify-center transition-all cursor-pointer border border-slate-200"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Cover Banner & Interactive Photo Carousel */}
              <div className="aspect-[16/8] sm:aspect-[16/7] relative w-full overflow-hidden bg-slate-900 group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeArticlePhotos[activePhotoIdx] || selectedArticle.image}
                  alt={selectedArticle.title}
                  className="w-full h-full object-cover opacity-90 transition-opacity duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/garden.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

                {/* Left/Right Carousel Controls */}
                {activeArticlePhotos.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevArticlePhoto}
                      className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-xs transition-all border border-white/20"
                      aria-label="Previous photo"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleNextArticlePhoto}
                      className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-xs transition-all border border-white/20"
                      aria-label="Next photo"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    {/* Photo Counter Pill */}
                    <div className="absolute top-4 left-4 z-20">
                      <span className="text-[11px] font-bold text-white bg-black/60 backdrop-blur-xs px-3 py-1 rounded-full border border-white/20 flex items-center gap-1.5 shadow-sm">
                        <ImageIcon className="w-3.5 h-3.5 text-white" />
                        <span>รูปที่ {activePhotoIdx + 1} / {activeArticlePhotos.length}</span>
                      </span>
                    </div>
                  </>
                )}

                {/* Banner Titles */}
                <div className="absolute bottom-4 left-4 sm:left-8 right-12 pointer-events-none">
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {selectedArticle.tags?.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-bold text-white bg-black/60 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-white/20"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-lg sm:text-2xl font-extrabold text-white leading-snug drop-shadow-md">
                    {selectedArticle.title}
                  </h2>
                </div>
              </div>

              {/* Thumbnails Navigation Strip */}
              {activeArticlePhotos.length > 1 && (
                <div className="px-6 py-2.5 bg-slate-900 border-b border-white/10 flex items-center gap-2 overflow-x-auto">
                  {activeArticlePhotos.map((p, pIdx) => (
                    <button
                      key={pIdx}
                      onClick={() => setActivePhotoIdx(pIdx)}
                      className={`relative w-12 h-9 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                        activePhotoIdx === pIdx
                          ? 'border-[#0053b5] ring-2 ring-[#0053b5]/40 opacity-100 scale-105'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p} alt={`Photo ${pIdx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Meta details bar */}
              <div className="px-6 sm:px-8 py-3.5 bg-[#f0f5fc]/70 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 font-medium text-[#003168]">
                    <User className="w-3.5 h-3.5 text-[#0053b5]" />
                    {selectedArticle.author}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <Calendar className="w-3.5 h-3.5 text-[#0053b5]" />
                    {selectedArticle.date}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[#0053b5] font-semibold bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                  <Clock className="w-3.5 h-3.5" />
                  <span>เวลาอ่าน {selectedArticle.readTime}</span>
                </div>
              </div>

              {/* Full Content Body */}
              <div className="p-6 sm:p-8 space-y-6">
                {/* Summary Callout Box */}
                <div className="p-4 rounded-2xl bg-[#f0f5fc]/50 border-l-4 border-[#0053b5] text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  {selectedArticle.summary}
                </div>

                {/* Main Article Text */}
                <div className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed text-slate-700 space-y-4">
                  {(selectedArticle.content || selectedArticle.summary)
                    .split('\n\n')
                    .map((paragraph, pIdx) => {
                      const isHeader = /^\d+\.\s/.test(paragraph);
                      return (
                        <div key={pIdx} className={isHeader ? 'pt-2' : ''}>
                          {paragraph.split('\n').map((line, lIdx) => {
                            if (line.startsWith('•')) {
                              return (
                                <p key={lIdx} className="pl-4 text-slate-700 my-1.5 font-normal flex items-start gap-2">
                                  <span className="text-[#0053b5] font-bold mt-0.5">•</span>
                                  <span>{line.replace(/^•\s*/, '')}</span>
                                </p>
                              );
                            }
                            if (/^\d+\.\s/.test(line)) {
                              return (
                                <h4 key={lIdx} className="font-bold text-base text-[#003168] mb-1 mt-3">
                                  {line}
                                </h4>
                              );
                            }
                            return (
                              <p key={lIdx} className="mb-2">
                                {line}
                              </p>
                            );
                          })}
                        </div>
                      );
                    })}
                </div>

                {/* Bottom CTA */}
                <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-slate-500">
                    สนใจบริการแม่บ้านทำความสะอาดหรือดูแลภูมิทัศน์สวนสำหรับโครงการของคุณ?
                  </div>
                  <button
                    onClick={handleConsult}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#0053b5] hover:bg-[#003168] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>ปรึกษาทีมงาน / ขอใบเสนอราคา</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CSR DETAIL MODAL */}
      <AnimatePresence>
        {selectedCsr && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0c0926]/80 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 relative my-8"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedCsr(null)}
                className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-black/65 hover:bg-black/85 text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Main Photo Showcase with Slider Navigation */}
              {(() => {
                const gallery = (selectedCsr.gallery && selectedCsr.gallery.length > 0)
                  ? selectedCsr.gallery
                  : ((selectedCsr as any).images && (selectedCsr as any).images.length > 0)
                  ? (selectedCsr as any).images
                  : [selectedCsr.image];
                const currentIdx = gallery.indexOf(activeCsrPhoto) !== -1 ? gallery.indexOf(activeCsrPhoto) : 0;

                return (
                  <div className="aspect-[16/10] bg-[#003168] relative overflow-hidden group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={activeCsrPhoto || selectedCsr.image}
                      alt={selectedCsr.title}
                      className="w-full h-full object-cover transition-all duration-300"
                    />

                    {/* Navigation buttons */}
                    {gallery.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const prevIdx = (currentIdx - 1 + gallery.length) % gallery.length;
                            setActiveCsrPhoto(gallery[prevIdx]);
                          }}
                          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/50 hover:bg-[#0053b5] text-white flex items-center justify-center transition-all shadow-md cursor-pointer"
                          title="ภาพก่อนหน้า"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const nextIdx = (currentIdx + 1) % gallery.length;
                            setActiveCsrPhoto(gallery[nextIdx]);
                          }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/50 hover:bg-[#0053b5] text-white flex items-center justify-center transition-all shadow-md cursor-pointer"
                          title="ภาพถัดไป"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                        <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-semibold text-white flex items-center gap-1.5 border border-white/20">
                          <ImageIcon className="w-3.5 h-3.5 text-white" />
                          <span>รูปที่ {currentIdx + 1} / {gallery.length}</span>
                        </div>
                      </>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-[#003168] via-transparent to-transparent flex flex-col justify-end p-6 sm:p-8 text-white pointer-events-none">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold w-fit mb-2 border border-white/30">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{selectedCsr.category}</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold leading-snug">
                        {selectedCsr.titleFull || selectedCsr.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 mt-2">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-sky-300" />
                          {selectedCsr.date}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-sky-300" />
                          {selectedCsr.location}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Gallery Thumbnails if multiple images exist */}
              {(() => {
                const gallery = (selectedCsr.gallery && selectedCsr.gallery.length > 0)
                  ? selectedCsr.gallery
                  : ((selectedCsr as any).images && (selectedCsr as any).images.length > 0)
                  ? (selectedCsr as any).images
                  : [selectedCsr.image];
                if (gallery.length <= 1) return null;
                return (
                  <div className="bg-slate-100 px-6 py-3 border-b border-slate-200 flex items-center gap-3 overflow-x-auto">
                    <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1 shrink-0">
                      <ImageIcon className="w-3.5 h-3.5 text-[#0053b5]" /> ภาพกิจกรรม ({gallery.length}):
                    </span>
                    {gallery.map((photo: string, pIdx: number) => (
                      <button
                        key={pIdx}
                        type="button"
                        onClick={() => setActiveCsrPhoto(photo)}
                        className={`w-14 h-10 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                          (activeCsrPhoto || selectedCsr.image) === photo
                            ? 'border-[#0053b5] ring-2 ring-[#0053b5]/40 scale-105'
                            : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={photo} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                );
              })()}

              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-2">
                    สรุปกิจกรรม
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed font-normal">
                    {selectedCsr.desc}
                  </p>
                </div>

                {selectedCsr.content && (
                  <div className="pt-4 border-t border-slate-100">
                    <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-3">
                      บันทึกกิจกรรมฉบับเต็ม
                    </h4>
                    <div className="space-y-3 text-sm text-slate-600 leading-relaxed font-normal">
                      {selectedCsr.content.split('\n\n').map((paragraph: string, idx: number) => (
                        <p key={idx}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
