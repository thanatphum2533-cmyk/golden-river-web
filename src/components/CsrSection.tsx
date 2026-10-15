'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Calendar, MapPin, X, ArrowUpRight, CheckCircle2, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';

interface CsrItem {
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

interface CsrSectionProps {
  csrList: CsrItem[];
}

export default function CsrSection({ csrList }: CsrSectionProps) {
  const [selectedCsr, setSelectedCsr] = useState<CsrItem | null>(null);
  const [activePhoto, setActivePhoto] = useState<string>('');

  const handleOpenModal = (item: CsrItem) => {
    setSelectedCsr(item);
    setActivePhoto(item.image);
  };

  return (
    <section id="csr" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#d9e5f4] text-[#0053b5] text-xs font-semibold uppercase tracking-wider mb-3 border border-gold-300 shadow-xs">
          <Heart className="w-3.5 h-3.5 fill-[#0053b5] text-[#0053b5]" />
          <span>Social Responsibility & Community</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-[#003168] tracking-tight">
          กิจกรรมจริงเพื่อสังคม
        </h2>
        <p className="text-sm sm:text-base text-slate-600 mt-3 font-normal max-w-2xl mx-auto leading-relaxed">
          ภาพถ่ายและบันทึกกิจกรรมจริงของทีมงานและผู้บริหาร GR Group ที่ร่วมส่งมอบความรู้ สิ่งของจำเป็น และความสุขคืนสู่สังคมไทยอย่างต่อเนื่อง
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {csrList.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.12 }}
            onClick={() => handleOpenModal(item)}
            className="bg-white/90 backdrop-blur-md border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:border-[#0053b5]/60 transition-all duration-300 flex flex-col cursor-pointer group"
          >
            {/* Real Activity Photo */}
            <div className="aspect-[16/10] overflow-hidden relative bg-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-[#003168]/90 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-xs border border-gold-400/30">
                {item.category}
              </div>
              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#003168]/85 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight className="w-4 h-4 text-white" />
              </div>
              {(() => {
                const count = (item.gallery?.length || (item as any).images?.length || 0);
                if (count <= 1) return null;
                return (
                  <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
                    <ImageIcon className="w-3 h-3 text-white" />
                    <span>{count} รูป</span>
                  </div>
                );
              })()}
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs text-[#0053b5] font-semibold mb-2">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{item.date}</span>
                </div>
                <h3 className="font-bold text-[#003168] text-base mb-2 group-hover:text-[#0053b5] transition-colors leading-snug">
                  {item.title}
                </h3>
                <div className="flex items-start gap-1 text-xs text-slate-500 mb-3">
                  <MapPin className="w-3.5 h-3.5 text-[#0053b5] shrink-0 mt-0.5" />
                  <span>{item.location}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 font-normal">
                  {item.desc}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#0053b5]">
                <span>คลิกอ่านรายละเอียด & ดูภาพจริง</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* DETAILED MODAL FOR GENUINE CSR CONTENT & PHOTO GALLERY */}
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
                className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/65 hover:bg-black/85 text-white flex items-center justify-center transition-colors"
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
                const currentIdx = gallery.indexOf(activePhoto) !== -1 ? gallery.indexOf(activePhoto) : 0;

                return (
                  <div className="aspect-[16/10] bg-[#003168] relative overflow-hidden group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={activePhoto || selectedCsr.image}
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
                            setActivePhoto(gallery[prevIdx]);
                          }}
                          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/50 hover:bg-[#0053b5] text-white flex items-center justify-center transition-all shadow-md"
                          title="ภาพก่อนหน้า"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const nextIdx = (currentIdx + 1) % gallery.length;
                            setActivePhoto(gallery[nextIdx]);
                          }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/50 hover:bg-[#0053b5] text-white flex items-center justify-center transition-all shadow-md"
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
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f0f5fc]0/30 backdrop-blur-md text-white text-xs font-semibold w-fit mb-2 border border-gold-400/30">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{selectedCsr.category}</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold leading-snug">
                        {selectedCsr.titleFull || selectedCsr.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 mt-2">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#0053b5]" />
                          {selectedCsr.date}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#0053b5]" />
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
                        onClick={() => setActivePhoto(photo)}
                        className={`w-14 h-10 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                          activePhoto === photo
                            ? 'border-[#0053b5] scale-105 shadow-sm ring-1 ring-[#0053b5]'
                            : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={photo} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                );
              })()}

              {/* Content Body */}
              <div className="p-6 sm:p-8 space-y-4 max-h-[40vh] overflow-y-auto">
                <div className="text-sm text-slate-700 leading-relaxed space-y-3 whitespace-pre-line font-normal">
                  {selectedCsr.content || selectedCsr.desc}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">
                  บันทึกกิจกรรมทางการของ GR Group
                </span>
                <button
                  onClick={() => setSelectedCsr(null)}
                  className="px-6 py-2.5 rounded-xl bg-[#003168] hover:bg-[#0053b5] text-white text-xs font-semibold transition-colors shadow-sm"
                >
                  ปิดหน้าต่าง
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
