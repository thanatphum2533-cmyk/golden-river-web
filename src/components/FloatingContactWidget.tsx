'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone } from 'lucide-react';

interface FloatingContactWidgetProps {
  phone: string;
  phoneDisplay?: string;
  lineId?: string;
}

export default function FloatingContactWidget({
  phone,
  phoneDisplay,
  lineId = '@goldenriver',
}: FloatingContactWidgetProps) {
  const [scrolled, setScrolled] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      // Show floating dock after slight scroll down (30px), consistent with Sansiri's website
      setScrolled(scrollY > 30);

      // Hide when scrolled down to the footer / last section
      const footer = document.querySelector('footer');
      if (footer) {
        const footerRect = footer.getBoundingClientRect();
        if (footerRect.top <= windowHeight - 40) {
          setIsAtBottom(true);
          return;
        }
      }

      // Fallback check if near bottom of document
      if (scrollY + windowHeight >= docHeight - 150) {
        setIsAtBottom(true);
        return;
      }

      setIsAtBottom(false);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const cleanPhone = phone ? phone.replace(/\s+/g, '') : '020963579';
  const displayPhone = phoneDisplay || phone || '02-096-3579';
  const formattedLineUrl = `https://line.me/R/ti/p/${lineId.startsWith('@') ? lineId : `@${lineId}`}`;

  return (
    <div className="fixed bottom-4 sm:bottom-6 inset-x-0 z-50 pointer-events-none flex justify-center px-4">
      <AnimatePresence>
        {scrolled && !isAtBottom && (
          <motion.div
            initial={{ opacity: 0, y: 25, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 25, scale: 0.96 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="pointer-events-auto"
          >
            {/* SANSIRI-STYLE FLOATING BOTTOM ACTION DOCK (CENTERED, NO AI) */}
            <div className="bg-white/95 backdrop-blur-md rounded-full p-1.5 sm:p-2 shadow-[0_10px_35px_rgba(0,0,0,0.16)] border border-slate-200/90 flex items-center gap-1.5 sm:gap-2">
              
              {/* 1. Phone Call Pill */}
              <a
                href={`tel:${cleanPhone}`}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-slate-100/80 hover:bg-slate-200/90 text-slate-900 transition-colors group cursor-pointer"
                title={`โทรด่วน ${displayPhone}`}
              >
                <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-900 fill-slate-900 shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight whitespace-nowrap">
                  {displayPhone}
                </span>
              </a>


              {/* 3. Facebook Messenger Circular Button */}
              <a
                href="https://m.me/goldenriver"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#0084FF] hover:bg-[#0074e0] text-white flex items-center justify-center shadow-xs transition-transform hover:scale-105 shrink-0 cursor-pointer"
                title="ติดต่อผ่าน Facebook Messenger"
                aria-label="Facebook Messenger"
              >
                <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-white" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.908 1.455 5.503 3.735 7.152V22l3.447-1.892c.905.251 1.86.386 2.818.386 5.523 0 10-4.145 10-9.236C22 6.145 17.523 2 12 2zm1.066 12.443l-2.56-2.73-5 2.73 5.498-5.836 2.624 2.73 4.936-2.73-5.498 5.836z" />
                </svg>
              </a>

              {/* 4. LINE Official Circular Button */}
              <a
                href={formattedLineUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#06C755] hover:bg-[#05b34c] text-white flex items-center justify-center shadow-xs transition-transform hover:scale-105 shrink-0 cursor-pointer"
                title={`แอด LINE: ${lineId}`}
                aria-label="LINE Official"
              >
                <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-white" viewBox="0 0 24 24">
                  <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.628.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .627.285.627.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                </svg>
              </a>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
