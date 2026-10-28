'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Building, X, ArrowUpRight, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProjectItem {
  id: string;
  title: string;
  titleEn: string;
  category: string;
  categoryName: string;
  location: string;
  services: string[];
  image: string;
  highlight: string;
  gallery?: string[];
}

interface ProjectsSectionProps {
  projects: ProjectItem[];
  onSelectForQuote: (serviceTitle: string) => void;
}

export default function ProjectsSection({ projects, onSelectForQuote }: ProjectsSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [activePhoto, setActivePhoto] = useState<string>('');

  const handleOpenProject = (project: ProjectItem) => {
    setSelectedProject(project);
    setActivePhoto(project.image);
  };

  const categories = [
    { id: 'all', name: 'ทั้งหมด' },
    { id: 'condo', name: 'คอนโดมิเนียม' },
    { id: 'luxury', name: 'คอนโดลักชัวรี' },
    { id: 'housing', name: 'หมู่บ้านจัดสรร' },
    { id: 'commercial', name: 'โรงแรม/พาณิชย์' },
  ];

  const filteredProjects =
    selectedCategory === 'all'
      ? projects
      : projects.filter((p) => p.category === selectedCategory);

  return (
    <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 bg-transparent">
      <div className="max-w-7xl mx-auto">
        {/* Header and Filter */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#003168] tracking-tight">
              โครงการที่ไว้วางใจเรา
            </h2>
            <p className="text-sm sm:text-base text-slate-500 mt-2 font-normal">
              ตัวอย่างโครงการชั้นนำกว่า 30+ แห่งที่ GR Group ได้รับความไว้วางใจให้ดูแล
            </p>
          </div>

          {/* Filter Pills in Navy & Gold */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#003168] text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-[#0053b5] hover:text-[#003168]'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Project Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                onClick={() => handleOpenProject(project)}
                className="bg-white/90 backdrop-blur-md border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:border-[#0053b5]/50 transition-all duration-300 cursor-pointer group flex flex-col"
              >
                {/* Image */}
                <div className="aspect-[16/10] overflow-hidden relative bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/garden.jpg';
                    }}
                  />
                  <div className="absolute top-3 left-3 bg-[#0053b5] backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-xs border border-gold-400/30">
                    {project.categoryName}
                  </div>
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#0053b5] backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight className="w-4 h-4 text-white" />
                  </div>
                  {project.gallery && project.gallery.length > 1 && (
                    <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
                      <ImageIcon className="w-3 h-3 text-white" />
                      <span>{project.gallery.length} รูป</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-[#003168] text-base group-hover:text-[#0053b5] transition-colors">
                      {project.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1 mb-3">
                      <MapPin className="w-3.5 h-3.5 text-[#0053b5] shrink-0" />
                      <span className="truncate">{project.location}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {project.highlight}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100/80 flex flex-wrap gap-1.5">
                    {project.services.slice(0, 2).map((svc) => (
                      <span
                        key={svc}
                        className="text-[11px] font-medium text-[#0053b5] bg-[#f0f5fc]/80 px-2.5 py-0.5 rounded-md border border-slate-200/50"
                      >
                        {svc}
                      </span>
                    ))}
                    {project.services.length > 2 && (
                      <span className="text-[11px] font-medium text-slate-400 self-center">
                        +{project.services.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* INTERACTIVE MODAL FOR PROJECT DETAIL */}
        <AnimatePresence>
          {selectedProject && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0c0926]/75 backdrop-blur-xs overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 relative my-8"
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Main Photo Container with Slider Navigation */}
                {(() => {
                  const gallery = (selectedProject.gallery && selectedProject.gallery.length > 0)
                    ? selectedProject.gallery
                    : [selectedProject.image];
                  const currentIdx = gallery.indexOf(activePhoto) !== -1 ? gallery.indexOf(activePhoto) : 0;

                  return (
                    <div className="aspect-[16/10] relative bg-[#003168] overflow-hidden group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={activePhoto || selectedProject.image}
                        alt={selectedProject.title}
                        className="w-full h-full object-cover transition-all duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/garden.jpg';
                        }}
                      />

                      {/* Photo navigation controls if more than 1 photo */}
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

                      <div className="absolute inset-0 bg-gradient-to-t from-[#003168] via-transparent to-transparent flex flex-col justify-end p-6 text-white pointer-events-none">
                        <span className="text-xs font-semibold text-[#d9e5f4] mb-1">
                          {selectedProject.categoryName}
                        </span>
                        <h3 className="text-2xl font-bold">{selectedProject.title}</h3>
                        <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-[#d9e5f4]" />
                          {selectedProject.location}
                        </p>
                      </div>
                    </div>
                  );
                })()}

                {/* Thumbnails if gallery exists */}
                {(() => {
                  const gallery = (selectedProject.gallery && selectedProject.gallery.length > 0)
                    ? selectedProject.gallery
                    : [selectedProject.image];
                  if (gallery.length <= 1) return null;
                  return (
                    <div className="bg-slate-100 px-6 py-2.5 border-b border-slate-200 flex items-center gap-2 overflow-x-auto">
                      <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1 shrink-0">
                        <ImageIcon className="w-3.5 h-3.5 text-[#0053b5]" /> ภาพโครงการ ({gallery.length}):
                      </span>
                      {gallery.map((photo, pIdx) => (
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

                <div className="p-6 sm:p-8 space-y-6">
                  <div>
                    <h4 className="text-xs font-bold text-[#0053b5] uppercase tracking-wider mb-2">
                      จุดเด่นและลักษณะการให้บริการ
                    </h4>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {selectedProject.highlight}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-[#0053b5] uppercase tracking-wider mb-2">
                      บริการที่ GR Group ดูแลในโครงการนี้
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.services.map((svc) => (
                        <span
                          key={svc}
                          className="text-xs font-semibold text-[#0053b5] bg-[#f0f5fc] border border-slate-200 px-3 py-1.5 rounded-lg"
                        >
                          ✓ {svc}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                    <button
                      onClick={() => {
                        const title = selectedProject.title;
                        setSelectedProject(null);
                        onSelectForQuote(`โครงการรูปแบบคล้ายกับ ${title}`);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-[#003168] hover:bg-[#0053b5] text-white text-xs font-semibold shadow-xs transition-colors"
                    >
                      ขอใบเสนอราคาสำหรับโครงการของคุณ
                    </button>
                    <button
                      onClick={() => setSelectedProject(null)}
                      className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-600 hover:bg-[#f0f5fc]"
                    >
                      ปิดหน้าต่าง
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
