'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, ShieldCheck, ArrowUp } from 'lucide-react';

interface FooterProps {
  company: {
    name: string;
    phone: string;
    phoneDisplay?: string;
    email: string;
    address: string;
    taxId?: string;
    logoUrl?: string;
  };
}

export default function Footer({ company }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-900 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={company.logoUrl || '/GR.svg'}
                alt="GR Group Logo"
                className="h-11 sm:h-12 w-auto object-contain brightness-0 invert drop-shadow"
              />
            </div>
            <p className="text-slate-400 leading-relaxed max-w-sm">
              GR Group ผู้เชี่ยวชาญด้านบริการแม่บ้านทำความสะอาด และดูแลรักษาภูมิทัศน์สวนสำหรับคอนโดมิเนียมและโครงการที่พักอาศัยชั้นนำ
            </p>
            <div className="text-[11px] text-slate-400">
              เลขประจำตัวผู้เสียภาษี: {company.taxId || '0105564115160'}
            </div>
          </div>

          {/* Nav links */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4">
              บริการหลัก
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  บริการแม่บ้านประจำโครงการ
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  บริการดูแลสวนและภูมิทัศน์
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  บริการตัดแต่งต้นไม้ใหญ่ (Arborist)
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  บริการเช็ดกระจกอาคารสูง (High-Rise)
                </a>
              </li>
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4">
              เมนูแนะนำ
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#projects" className="hover:text-white transition-colors">
                  โครงการที่ให้บริการ (30+)
                </a>
              </li>
              <li>
                <a href="#articles" className="hover:text-white transition-colors">
                  คำแนะนำและบทความ
                </a>
              </li>
              <li>
                <Link href="/admin" className="text-sky-300 hover:text-white flex items-center gap-1.5 transition-colors">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>ระบบหลังบ้าน (Admin)</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4">
              ติดต่อด่วน
            </h4>
            <ul className="space-y-2.5">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <a href={`tel:${company.phone.replace(/\s+/g, '')}`} className="hover:text-white">
                  {company.phoneDisplay || company.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <a href={`mailto:${company.email}`} className="hover:text-white truncate">
                  {company.email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{company.address}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright and back to top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-[11px]">
          <div>
            © {new Date().getFullYear()} GR Group. All rights reserved.
          </div>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 hover:text-white transition-colors px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800"
          >
            <span>กลับขึ้นด้านบน</span>
            <ArrowUp className="w-3 h-3" />
          </button>
        </div>
      </div>
    </footer>
  );
}
