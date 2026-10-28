'use client';
import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, MessageSquare, Image as ImageIcon, Upload, X, Loader2, Copy, Check } from 'lucide-react';

interface ContactSectionProps {
  company: {
    name: string;
    phone: string;
    phoneDisplay?: string;
    email: string;
    address: string;
    workingHours: string;
    lineId?: string;
  };
  prefilledService?: string;
}

export default function ContactSection({ company, prefilledService }: ContactSectionProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: prefilledService || 'บริการดูแลสวนและภูมิทัศน์',
    projectName: '',
    message: '',
  });

  const [attachedImages, setAttachedImages] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showWebForm, setShowWebForm] = useState(false);
  const [copiedLineId, setCopiedLineId] = useState(false);

  const rawLineId = company.lineId || '@goldenriver';
  const lineId = rawLineId.startsWith('@') ? rawLineId : `@${rawLineId}`;
  const lineUrl = (company as any).lineUrl || (lineId.startsWith('http') ? lineId : `https://line.me/R/ti/p/${lineId}`);
  const lineQrCode = (company as any).lineQrCode || '/images/line-qr-code.svg';
  const cleanPhone = company.phone ? company.phone.replace(/\s+/g, '') : '020963579';
  const displayPhone = company.phoneDisplay || company.phone || '02-096-3579';

  const handleCopyLineId = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(lineId);
      setCopiedLineId(true);
      setTimeout(() => setCopiedLineId(false), 2000);
    }
  };

  React.useEffect(() => {
    if (prefilledService) {
      setFormData((prev) => ({ ...prev, service: prefilledService }));
    }
  }, [prefilledService]);

  const handleFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const remainingSlots = 10 - attachedImages.length;
    if (remainingSlots <= 0) {
      alert('สามารถแนบรูปภาพได้สูงสุด 10 รูปครับ');
      return;
    }
    const filesToUpload = Array.from(e.target.files).slice(0, remainingSlots);
    setUploadingImages(true);
    try {
      const uploadFormData = new FormData();
      filesToUpload.forEach((f) => uploadFormData.append('files', f));
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });
      const data = await res.json();
      if (data.urls && Array.isArray(data.urls)) {
        setAttachedImages((prev) => [...prev, ...data.urls].slice(0, 10));
      } else if (data.url) {
        setAttachedImages((prev) => [...prev, data.url].slice(0, 10));
      }
    } catch {
      alert('เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ');
    } finally {
      setUploadingImages(false);
      e.target.value = '';
    }
  };

  const removeImage = (indexToRemove: number) => {
    setAttachedImages((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, images: attachedImages }),
      });

      if (res.ok) {
        setSubmitted(true);
        setAttachedImages([]);
        setFormData({
          name: '',
          phone: '',
          email: '',
          service: 'บริการดูแลสวนและภูมิทัศน์',
          projectName: '',
          message: '',
        });
      } else {
        const err = await res.json();
        setErrorMsg(err.error || 'เกิดข้อผิดพลาดในการส่งข้อมูล');
      }
    } catch {
      setErrorMsg('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="pt-6 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-[#003168] rounded-3xl overflow-hidden shadow-xl border border-gold-400/30 text-white">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left Column: Contact Info in Navy & Gold */}
          <div className="lg:col-span-5 p-6 sm:p-10 lg:p-12 flex flex-col justify-between bg-gradient-to-br from-[#003168] via-[#1b154d] to-[#251e66] border-b lg:border-b-0 lg:border-r border-gold-300/20">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
                ติดต่อเราเพื่อรับคำปรึกษา<br />และนัดสำรวจหน้างาน
              </h2>
              <p className="text-sm text-gold-100/80 font-light leading-relaxed mb-8">
                GR Group พร้อมให้คำแนะนำและประเมินราคาตามขนาดพื้นที่จริงของโครงการท่าน โดยไม่มีค่าใช้จ่าย
              </p>

              <div className="space-y-5 text-xs sm:text-sm">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-white/10 border border-gold-300/30 flex items-center justify-center text-white shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-white block font-medium">ที่ตั้งสำนักงาน</strong>
                    <span className="text-slate-200 leading-normal">{company.address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-white/10 border border-gold-300/30 flex items-center justify-center text-white shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-white block font-medium">โทรศัพท์</strong>
                    <a
                      href={`tel:${company.phone.replace(/\s+/g, '')}`}
                      className="text-white hover:text-gold-200 font-semibold"
                    >
                      {company.phoneDisplay || company.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-white/10 border border-gold-300/30 flex items-center justify-center text-white shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-white block font-medium">อีเมล</strong>
                    <a
                      href={`mailto:${company.email}`}
                      className="text-slate-200 hover:text-white"
                    >
                      {company.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-white/10 border border-gold-300/30 flex items-center justify-center text-white shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-white block font-medium">เวลาทำการ</strong>
                    <span className="text-slate-200">{company.workingHours}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 text-[11px] text-gold-200/60">
              GR Group (สำนักงานใหญ่)
            </div>
          </div>

          {/* Right Column: QR LINE เสนอราคา (LINE Quick Quotation Card) */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 bg-white text-slate-800 flex flex-col justify-center">
            {/* Header Badge */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#06C755]/10 border border-[#06C755]/30 text-[#059b43] text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-[#06C755] animate-pulse"></span>
                <span>LINE Official Account</span>
              </div>
              <span className="text-xs font-semibold text-slate-400">
                ⚡ ประเมินราคาไว นัดสำรวจหน้างานฟรี
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#003168] mb-1.5 leading-tight">
              สแกน QR Code ขอใบเสนอราคา
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
              {prefilledService && (
                <span className="inline-block bg-blue-50 text-[#0053b5] px-2.5 py-0.5 rounded-md font-semibold text-xs border border-blue-200 mr-1.5 mb-1">
                  บริการที่เลือก: {prefilledService}
                </span>
              )}
              ส่งภาพถ่ายหน้างานจริง ขนาดพื้นที่ หรือความต้องการของโครงการ เพื่อให้เจ้าหน้าที่ฝ่ายประเมินราคาจัดทำใบเสนอราคาเบื้องต้นได้ทันที
            </p>

            {/* Main QR Card */}
            <div className="bg-gradient-to-br from-[#f8fafc] via-[#f1f6fd] to-[#e8f1fc] p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-sm mb-5">
              <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-7">
                {/* QR Code Container with Frame & Center Logo */}
                <div className="relative shrink-0 flex flex-col items-center">
                  <a
                    href={lineUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-44 h-44 sm:w-48 sm:h-48 bg-white p-3 rounded-2xl shadow-md border-2 border-[#06C755]/40 flex items-center justify-center relative group cursor-pointer hover:border-[#06C755] transition-all hover:scale-[1.02]"
                    title="คลิกเพื่อเพิ่มเพื่อนใน LINE ทันที"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={lineQrCode}
                      alt="LINE QR Code ขอใบเสนอราคา"
                      className="w-full h-full object-contain"
                    />
                    {/* Center LINE Icon Badge */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-10 h-10 rounded-full bg-[#06C755] border-2 border-white flex items-center justify-center shadow-md">
                        <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                          <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.628.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .627.285.627.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                        </svg>
                      </div>
                    </div>
                  </a>
                  <span className="text-[11px] text-slate-500 font-medium mt-2">
                    เปิดกล้องมือถือสแกนได้ทันที
                  </span>
                </div>

                {/* Action buttons and info */}
                <div className="flex-1 w-full space-y-3">
                  {/* LINE ID Pill */}
                  <div className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        LINE ID ทางการ
                      </div>
                      <div className="text-base sm:text-lg font-extrabold text-slate-900">
                        {lineId}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyLineId}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-[#06C755] hover:text-white text-slate-700 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      {copiedLineId ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600 group-hover:text-white" />
                          <span>คัดลอกแล้ว!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>คัดลอก ID</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Direct Add LINE Button */}
                  <a
                    href={lineUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-5 rounded-2xl bg-[#06C755] hover:bg-[#05b34c] text-white font-bold text-sm sm:text-base shadow-lg shadow-[#06C755]/25 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 cursor-pointer"
                  >
                    <svg className="w-5 h-5 fill-white shrink-0" viewBox="0 0 24 24">
                      <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.628.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .627.285.627.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                    </svg>
                    <span>กดเพิ่มเพื่อนใน LINE ทันที</span>
                  </a>

                  {/* Quick Call Button */}
                  <a
                    href={`tel:${cleanPhone}`}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5 text-slate-600" />
                    <span>โทรสายด่วนฝ่ายประเมินราคา: {displayPhone}</span>
                  </a>
                </div>
              </div>
            </div>

            {/* 3 Steps Guide to Request Quotation */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-[#0053b5] flex items-center justify-center font-extrabold text-sm shrink-0">
                  1
                </div>
                <div>
                  <div className="font-bold text-slate-800 text-xs">ถ่ายภาพหน้างาน</div>
                  <div className="text-[11px] text-slate-500 leading-tight mt-0.5">
                    ถ่ายรูปพื้นที่ที่ต้องการทำความสะอาด หรือดูแลสวน
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#06C755] flex items-center justify-center font-extrabold text-sm shrink-0">
                  2
                </div>
                <div>
                  <div className="font-bold text-slate-800 text-xs">ส่งภาพในแชท LINE</div>
                  <div className="text-[11px] text-slate-500 leading-tight mt-0.5">
                    แจ้งขนาดพื้นที่หรือประเภทบริการที่ต้องการ
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-extrabold text-sm shrink-0">
                  3
                </div>
                <div>
                  <div className="font-bold text-slate-800 text-xs">รับใบเสนอราคา</div>
                  <div className="text-[11px] text-slate-500 leading-tight mt-0.5">
                    เจ้าหน้าที่ประเมินและจัดส่งใบเสนอราคาให้ทันที
                  </div>
                </div>
              </div>
            </div>

            {/* Collapsible Form Toggle */}
            <div className="text-center pt-3">
              <button
                type="button"
                onClick={() => setShowWebForm(!showWebForm)}
                className="text-[14.5px] sm:text-[15px] text-slate-700 hover:text-[#003168] font-semibold transition-all inline-flex items-center gap-1.5 cursor-pointer py-1.5 px-4 rounded-lg hover:bg-slate-100 border border-slate-200/60 shadow-2xs bg-white/60"
              >
                <span>
                  {showWebForm
                    ? '▲ ซ่อนแบบฟอร์มบนเว็บไซต์'
                    : '▼ หากไม่สะดวกแอด LINE คลิกที่นี่เพื่อกรอกแบบฟอร์มบนเว็บไซต์'}
                </span>
              </button>
            </div>

            {/* Collapsible Web Form (if expanded) */}
            {showWebForm && (
              <div className="mt-5 pt-5 border-t border-slate-200 animate-in fade-in duration-300">
                <h4 className="text-sm font-bold text-[#003168] mb-3">
                  แบบฟอร์มขอใบเสนอราคาผ่านเว็บไซต์
                </h4>

                {submitted ? (
                  <div className="p-8 rounded-2xl bg-[#f0f5fc] border border-slate-200 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-gold-100 text-[#0053b5] mx-auto flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-bold text-[#003168]">ส่งคำขอสำเร็จเรียบร้อยแล้ว</h4>
                    <p className="text-xs text-[#0053b5] max-w-md mx-auto">
                      ขอบพระคุณที่ไว้วางใจ GR Group เจ้าหน้าที่ฝ่ายประสานงานโครงการจะติดต่อกลับท่านโดยเร็วที่สุด
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="mt-4 px-5 py-2 text-xs font-semibold text-[#003168] bg-white border border-gold-300 rounded-lg hover:bg-[#f0f5fc]"
                    >
                      ส่งข้อมูลเพิ่มเติม
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                    {errorMsg && (
                      <div className="p-3 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-xs">
                        {errorMsg}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-medium text-[#003168] mb-1">
                          ชื่อผู้ติดต่อ / นิติบุคคล <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="เช่น คุณสมชาย (นิติบุคคลอาคารชุด)"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-[#0053b5] text-slate-800 bg-[#f0f5fc]/20"
                        />
                      </div>

                      <div>
                        <label className="block font-medium text-[#003168] mb-1">
                          เบอร์โทรศัพท์ติดต่อ <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="08X-XXX-XXXX"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-[#0053b5] text-slate-800 bg-[#f0f5fc]/20"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-medium text-[#003168] mb-1">
                          อีเมล (สำหรับส่งใบเสนอราคา)
                        </label>
                        <input
                          type="email"
                          placeholder="name@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-[#0053b5] text-slate-800 bg-[#f0f5fc]/20"
                        />
                      </div>

                      <div>
                        <label className="block font-medium text-[#003168] mb-1">
                          ชื่อโครงการ / สถานที่ปฏิบัติงาน
                        </label>
                        <input
                          type="text"
                          placeholder="เช่น คอนโดเดอะริเวอร์ สุขุมวิท"
                          value={formData.projectName}
                          onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-[#0053b5] text-slate-800 bg-[#f0f5fc]/20"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-medium text-[#003168] mb-1">
                        บริการที่ต้องการขอใบเสนอราคา
                      </label>
                      <select
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-[#0053b5] text-slate-800 bg-[#f0f5fc]/20"
                      >
                        <option value="บริการแม่บ้านและรักษาความสะอาด">บริการแม่บ้านและรักษาความสะอาด (Maid & Cleaning)</option>
                        <option value="บริการดูแลสวนและภูมิทัศน์">บริการดูแลสวนและภูมิทัศน์ (Landscape Care)</option>
                        <option value="แพ็กเกจแม่บ้านทำความสะอาด + ดูแลสวน">แพ็กเกจแม่บ้านทำความสะอาด + ดูแลสวน (Combo)</option>
                        <option value="บริการทำความสะอาดกระจกอาคารสูง">บริการทำความสะอาดกระจกอาคารสูง (High-Rise Window Cleaning)</option>
                        <option value="งานตัดแต่งต้นไม้ใหญ่และค้ำยัน">งานตัดแต่งต้นไม้ใหญ่และค้ำยัน (Arborist)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-medium text-[#003168] mb-1">
                        รายละเอียดเพิ่มเติม / ขนาดพื้นที่โครงการ
                      </label>
                      <textarea
                        rows={3}
                        placeholder="เช่น คอนโด 30 ชั้น ต้องการแม่บ้านประจำ 4 คน และคนสวนดูแลพื้นที่ 2 ไร่ หรือเวลาที่สะดวกให้เข้าสำรวจ..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-[#0053b5] text-slate-800 bg-[#f0f5fc]/20"
                      />
                    </div>

                    {/* Photo attachment up to 10 images */}
                    <div className="bg-[#f0f5fc]/40 p-3.5 sm:p-4 rounded-2xl border border-dashed border-gold-300 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="font-semibold text-[#003168] text-xs flex items-center gap-1.5">
                          <ImageIcon className="w-4 h-4 text-[#0053b5]" />
                          <span>แนบภาพถ่ายหน้างานจริงเพื่อประเมินราคา (ใส่ได้สูงสุด 10 รูป)</span>
                        </label>
                        <span className="text-[11px] font-bold text-[#0053b5] bg-white px-2 py-0.5 rounded-full border border-slate-200">
                          {attachedImages.length} / 10 รูป
                        </span>
                      </div>

                      {/* Thumbnails list */}
                      {attachedImages.length > 0 && (
                        <div className="grid grid-cols-5 gap-2">
                          {attachedImages.map((imgUrl, imgIdx) => (
                            <div key={imgIdx} className="aspect-square rounded-lg overflow-hidden relative border border-slate-200 group bg-slate-100">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => removeImage(imgIdx)}
                                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 hover:bg-rose-600 text-white flex items-center justify-center transition-colors shadow-xs"
                                title="ลบรูปนี้"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {attachedImages.length < 10 && (
                        <div className="flex items-center gap-3">
                          <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-[#f0f5fc] border border-gold-300 rounded-xl text-xs font-semibold text-[#0053b5] transition-all shadow-xs">
                            {uploadingImages ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0053b5]" />
                                <span>กำลังอัปโหลด...</span>
                              </>
                            ) : (
                              <>
                                <Upload className="w-3.5 h-3.5 text-[#0053b5]" />
                                <span>+ แนบรูปภาพหน้างาน</span>
                              </>
                            )}
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              disabled={uploadingImages}
                              className="hidden"
                              onChange={handleFilesChange}
                            />
                          </label>
                          <span className="text-[11px] text-slate-400">คลิกเลือกได้ครั้งละหลายรูป (สูงสุด 10 รูป)</span>
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 rounded-xl bg-[#003168] hover:bg-[#0053b5] disabled:bg-slate-300 text-white font-semibold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <span>กำลังบันทึกข้อมูล...</span>
                      ) : (
                        <>
                          <span>ส่งคำขอใบเสนอราคา</span>
                          <Send className="w-3.5 h-3.5 text-white" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
