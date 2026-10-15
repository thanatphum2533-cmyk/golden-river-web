'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Phone, MessageSquare, MapPin, ChevronRight, FileText, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  company: {
    phone: string;
    phoneDisplay?: string;
    logoUrl?: string;
    name: string;
  };
}

export default function Navbar({ company }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  const navLinks = [
    { name: 'หน้าแรก', href: '#' },
    { name: 'บริการของเรา', href: '#services' },
    { name: 'ผลงานโครงการ', href: '#projects' },
    { name: 'คำแนะนำและบทความ', href: '#articles' },
    { name: 'ติดต่อเรา', href: '#contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md py-2.5 border-b border-slate-200'
            : 'bg-gradient-to-b from-black/85 via-black/50 to-transparent py-3.5 sm:py-4 border-transparent'
        }`}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8">
          {/* Mobile Bar: Logo on Left, 3-Stripes on Right */}
          <div className="flex lg:hidden items-center justify-between min-h-[48px]">
            <Link href="/" className="flex items-center shrink-0 group py-0.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={company.logoUrl || '/GR.svg'}
                alt="GR Group Logo"
                className={`h-10 sm:h-11 w-auto object-contain transition-all duration-200 ${
                  !scrolled ? 'brightness-0 invert drop-shadow-md' : 'drop-shadow-xs'
                }`}
              />
            </Link>

            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="เปิดเมนูนำทาง"
              className={`group p-2.5 rounded-xl transition-all flex flex-col items-center justify-center gap-[5px] focus:outline-none ${
                scrolled ? 'hover:bg-slate-100 text-slate-900' : 'hover:bg-white/15 text-white'
              }`}
            >
              <span
                className={`block h-[2.5px] w-[24px] rounded-full transition-all duration-300 ${
                  scrolled ? 'bg-slate-900' : 'bg-white'
                }`}
              />
              <span
                className={`block h-[2.5px] w-[14px] rounded-full transition-all duration-300 ${
                  scrolled ? 'bg-slate-900' : 'bg-white'
                }`}
              />
              <span
                className={`block h-[2.5px] w-[24px] rounded-full transition-all duration-300 ${
                  scrolled ? 'bg-slate-900' : 'bg-white'
                }`}
              />
            </button>
          </div>

          {/* Desktop Bar: Centered Group -> [ Logo ] [ หน้าแรก ... ติดต่อเรา ] [ 3-Stripes ] */}
          <div className="hidden lg:flex items-center justify-center min-h-[52px]">
            <div className="flex items-center justify-center gap-2 xl:gap-3">
              {/* Logo: Attached to the left of 'หน้าแรก' */}
              <Link href="/" className="flex items-center shrink-0 group py-0.5 mr-2 xl:mr-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={company.logoUrl || '/GR.svg'}
                  alt="GR Group Logo"
                  className={`h-11 sm:h-12 md:h-13 lg:h-14 w-auto object-contain transition-all duration-200 group-hover:scale-105 ${
                    !scrolled ? 'brightness-0 invert drop-shadow-md' : 'drop-shadow-xs'
                  }`}
                />
              </Link>

              {/* Navigation Links: หน้าแรก -> บริการของเรา -> ผลงานโครงการ -> คำแนะนำและบทความ -> ติดต่อเรา */}
              <nav className="flex items-center gap-1 xl:gap-2">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className={`px-3 xl:px-4 py-2 text-sm xl:text-base font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                      scrolled
                        ? 'text-slate-800 hover:text-[#0053b5] hover:bg-slate-100/80'
                        : 'text-white hover:text-white hover:bg-white/20 drop-shadow-sm'
                    }`}
                  >
                    {link.name}
                  </a>
                ))}
              </nav>

              {/* 3-Stripes Hamburger Button: Attached to the right of 'ติดต่อเรา' */}
              <div className="flex items-center shrink-0 ml-2 xl:ml-3">
                <button
                  type="button"
                  onClick={() => setDrawerOpen(true)}
                  aria-label="เปิดเมนูนำทาง"
                  className={`group p-2.5 rounded-xl transition-all flex flex-col items-center justify-center gap-[5px] focus:outline-none ${
                    scrolled
                      ? 'hover:bg-slate-100 text-slate-900'
                      : 'hover:bg-white/15 text-white'
                  }`}
                >
                  {/* Top stripe (wide) */}
                  <span
                    className={`block h-[2.5px] w-[26px] rounded-full transition-all duration-300 group-hover:scale-x-105 ${
                      scrolled ? 'bg-slate-900' : 'bg-white'
                    }`}
                  />
                  {/* Middle stripe (short, centered) */}
                  <span
                    className={`block h-[2.5px] w-[15px] rounded-full transition-all duration-300 group-hover:w-[26px] ${
                      scrolled ? 'bg-slate-900' : 'bg-white'
                    }`}
                  />
                  {/* Bottom stripe (wide) */}
                  <span
                    className={`block h-[2.5px] w-[26px] rounded-full transition-all duration-300 group-hover:scale-x-105 ${
                      scrolled ? 'bg-slate-900' : 'bg-white'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Slide-over Luxury Drawer Menu */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-300"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Side Drawer Panel (Slide in from Left) */}
          <aside className="fixed inset-y-0 left-0 w-full max-w-sm sm:max-w-md bg-white shadow-2xl flex flex-col justify-between z-50 overflow-y-auto animate-in slide-in-from-left duration-300">
            {/* Drawer Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/GR.svg" alt="GR Group Logo" className="h-10 w-auto" />
                <div>
                  <h3 className="font-bold text-slate-900 leading-tight">Golden River Group</h3>
                  <p className="text-xs text-slate-500 font-medium">Professional Facility Services</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="ปิดเมนู"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Drawer Navigation Links */}
            <div className="p-6 space-y-2 flex-1">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                เมนูนำทางหลัก
              </p>
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setDrawerOpen(false)}
                  className="group flex items-center justify-between px-4 py-3 rounded-xl text-base font-semibold text-slate-800 hover:text-[#0053b5] hover:bg-blue-50/70 transition-all"
                >
                  <span>{link.name}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#0053b5] group-hover:translate-x-1 transition-all" />
                </a>
              ))}

              {/* Company Info Box */}
              <div className="mt-8 pt-6 border-t border-slate-100 space-y-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  ติดต่อสอบถามและสำนักงาน
                </p>

                <a
                  href={`tel:${company.phone || '020963579'}`}
                  className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-[#0053b5] transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-100/80 flex items-center justify-center text-[#0053b5] shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">โทรศัพท์สายด่วน</div>
                    <div className="text-sm font-bold text-slate-900">
                      {company.phoneDisplay || '02-096-3579'}
                    </div>
                  </div>
                </a>

                <a
                  href="https://line.me/ti/p/~@grgroup"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-emerald-100/80 flex items-center justify-center text-emerald-600 shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">LINE Official Account</div>
                    <div className="text-sm font-bold text-slate-900">@grgroup</div>
                  </div>
                </a>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 text-xs text-slate-600 leading-relaxed">
                  <MapPin className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-800">สำนักงานใหญ่:</span> เลขที่ 59/29
                    หมู่ที่ 2 ตำบลคลองหก อำเภอคลองหลวง จังหวัดปทุมธานี 12120
                  </div>
                </div>

                <div className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>เลขประจำตัวผู้เสียภาษี: 0105562094254</span>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 space-y-3">
              <a
                href="#contact"
                onClick={() => setDrawerOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#0053b5] to-[#003c82] hover:from-[#00479e] hover:to-[#002f66] text-white font-semibold text-sm shadow-md transition-all active:scale-[0.98]"
              >
                <FileText className="w-4 h-4" />
                <span>ขอใบเสนอราคา / ติดต่อด่วน</span>
              </a>

              <div className="text-center">
                <Link
                  href="/admin"
                  onClick={() => setDrawerOpen(false)}
                  className="text-xs text-slate-400 hover:text-slate-600 font-medium transition-colors"
                >
                  ระบบจัดการภายใน (Admin Portal)
                </Link>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

