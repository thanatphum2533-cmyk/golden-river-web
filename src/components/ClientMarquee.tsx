'use client';

import React from 'react';

interface ClientMarqueeProps {
  clients?: Array<{ name: string; role?: string; image?: string; logo?: string }>;
}

export default function ClientMarquee({ clients }: ClientMarqueeProps = {}) {
  // Row 1: Premium High-Rise & Luxury Developers
  const row1 = [
    { name: 'Sansiri', src: '/images/logos/sansiri.svg' },
    { name: 'Land & Houses', src: '/images/logos/lh.svg' },
    { name: 'Origin Property', src: '/images/logos/origin.svg' },
    { name: 'Ananda Development', src: '/images/logos/ananda.svg' },
    { name: 'SC Asset', src: '/images/logos/scasset.svg' },
    { name: 'Noble Development', src: '/images/logos/noble.svg' },
    { name: 'The Room', src: '/images/logos/theroom.svg' },
    { name: 'Ideo', src: '/images/logos/ideo.svg' },
    { name: 'Wyndham Hotels & Resorts', src: '/images/logos/wyndham.svg' },
    { name: 'Singha Estate', src: '/images/logos/singha.svg' },
  ];

  // Row 2: Renowned Developers & Community Projects
  const row2 = [
    { name: 'AP Thailand', src: '/images/logos/ap.svg' },
    { name: 'Supalai', src: '/images/logos/supalai.svg' },
    { name: 'Pruksa Holding', src: '/images/logos/pruksa.svg' },
    { name: 'Chewathai', src: '/images/logos/chewathai.svg' },
    { name: 'The Parkland', src: '/images/logos/parkland.svg' },
    { name: 'CMC Group', src: '/images/logos/cmc.svg' },
    { name: 'Major Development', src: '/images/logos/major.svg' },
    { name: 'Frasers Property', src: '/images/logos/frasers.svg' },
    { name: 'a space', src: '/images/logos/aspace.svg' },
    { name: 'Sansiri', src: '/images/logos/sansiri.svg' },
  ];

  // Duplicate for seamless infinite marquee loop
  const marqueeRow1 = [...row1, ...row1];
  const marqueeRow2 = [...row2, ...row2];

  return (
    <section className="py-8 sm:py-10 bg-white/80 backdrop-blur-md border-y border-slate-200/80 overflow-hidden relative select-none">

      {/* Marquee Container with Subtle Left/Right Fade Gradient */}
      <div className="relative w-full space-y-4 sm:space-y-6">
        {/* Left & Right Edge Vignette Fades */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

        {/* ========================================================= */}
        {/* ROW 1: LARGE LOGOS SCROLLING LEFT                         */}
        {/* ========================================================= */}
        <div className="flex gap-4 sm:gap-6 animate-marquee hover:[animation-play-state:paused] w-max">
          {marqueeRow1.map((item, idx) => (
            <div
              key={'r1-' + idx}
              className="w-44 sm:w-52 md:w-60 h-20 sm:h-24 md:h-26 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-[#0053b5] hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center p-4 sm:p-5 shrink-0 group cursor-default"
              title={item.name}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.src}
                alt={item.name}
                className="max-h-11 sm:max-h-13 md:max-h-14 w-auto max-w-[160px] sm:max-w-[180px] object-contain transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {/* ========================================================= */}
        {/* ROW 2: LARGE LOGOS SCROLLING RIGHT (OR OFFSET)           */}
        {/* ========================================================= */}
        <div className="flex gap-4 sm:gap-6 animate-marquee-reverse hover:[animation-play-state:paused] w-max">
          {marqueeRow2.map((item, idx) => (
            <div
              key={'r2-' + idx}
              className="w-44 sm:w-52 md:w-60 h-20 sm:h-24 md:h-26 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-[#0053b5] hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center p-4 sm:p-5 shrink-0 group cursor-default"
              title={item.name}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.src}
                alt={item.name}
                className="max-h-11 sm:max-h-13 md:max-h-14 w-auto max-w-[160px] sm:max-w-[180px] object-contain transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
