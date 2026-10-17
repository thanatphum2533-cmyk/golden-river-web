'use client';

import React from 'react';

export interface ClientItem {
  id?: string;
  name: string;
  role?: string;
  image?: string;
  logo?: string;
  src?: string;
}

interface ClientMarqueeProps {
  clients?: ClientItem[];
}

const defaultRow1: ClientItem[] = [
  { name: 'Noble Development', src: '/images/logos/noble.svg' },
  { name: 'The Room', src: '/images/logos/theroom.svg' },
  { name: 'IDEO Condominium', src: '/images/logos/ideo.svg' },
  { name: 'WYNDHAM Hotels & Resorts', src: '/images/logos/wyndham.svg' },
  { name: 'SINGHA ESTATE', src: '/images/logos/singha.svg' },
  { name: 'แสนสิริ (Sansiri)', src: '/images/logos/sansiri.svg' },
  { name: 'LAND & HOUSES', src: '/images/logos/lh.svg' },
  { name: 'ORIGIN Property', src: '/images/logos/origin.svg' },
  { name: 'ANANDA Development', src: '/images/logos/ananda.svg' },
  { name: 'SC ASSET', src: '/images/logos/scasset.svg' },
];

const defaultRow2: ClientItem[] = [
  { name: 'CMC GROUP', src: '/images/logos/cmc.svg' },
  { name: 'MAJOR Development', src: '/images/logos/major.svg' },
  { name: 'FRASERS Property', src: '/images/logos/frasers.svg' },
  { name: 'a space CONDO ME', src: '/images/logos/aspace.svg' },
  { name: 'แสนสิริ (Sansiri)', src: '/images/logos/sansiri.svg' },
  { name: 'AP THAILAND', src: '/images/logos/ap.svg' },
  { name: 'SUPALAI', src: '/images/logos/supalai.svg' },
  { name: 'PRUKSA Holding', src: '/images/logos/pruksa.svg' },
  { name: 'CHEWATHAI', src: '/images/logos/chewathai.svg' },
  { name: 'The Parkland', src: '/images/logos/parkland.svg' },
];

export default function ClientMarquee({ clients }: ClientMarqueeProps = {}) {
  // If clients are provided from siteData.json, split evenly into Row 1 and Row 2
  let row1 = defaultRow1;
  let row2 = defaultRow2;

  if (clients && clients.length > 0) {
    const half = Math.ceil(clients.length / 2);
    row1 = clients.slice(0, half).map(c => ({
      name: c.name,
      src: c.image || c.logo || c.src || '/images/logos/noble.svg'
    }));
    row2 = clients.slice(half).map(c => ({
      name: c.name,
      src: c.image || c.logo || c.src || '/images/logos/sansiri.svg'
    }));
    if (row2.length === 0) row2 = row1;
  }

  // Duplicate for seamless infinite marquee loop (minimum 16 items for infinite seamless scroll)
  const marqueeRow1 = [...row1, ...row1, ...row1];
  const marqueeRow2 = [...row2, ...row2, ...row2];

  return (
    <section className="py-8 sm:py-10 bg-white/80 backdrop-blur-md border-y border-slate-200/80 overflow-hidden relative select-none w-full max-w-full">
      {/* Marquee Container with Subtle Left/Right Fade Gradient */}
      <div className="relative w-full max-w-full overflow-hidden space-y-4 sm:space-y-6">
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
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/GR.svg';
                }}
              />
            </div>
          ))}
        </div>

        {/* ========================================================= */}
        {/* ROW 2: LARGE LOGOS SCROLLING RIGHT                       */}
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
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/GR.svg';
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
