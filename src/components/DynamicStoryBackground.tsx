'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles, Leaf } from 'lucide-react';

interface BackgroundSceneItem {
  id: string;
  name?: string;
  label?: string;
  sub?: string;
  image: string;
}

interface DynamicStoryBackgroundProps {
  backgroundScenes?: BackgroundSceneItem[];
}

export default function DynamicStoryBackground({ backgroundScenes }: DynamicStoryBackgroundProps) {
  const { scrollYProgress } = useScroll();

  const defaultScenes: BackgroundSceneItem[] = [
    {
      id: 'scene-1',
      label: 'บริการดูแลสวน & พื้นที่สีเขียว',
      sub: 'Garden Care & Maintenance',
      image: '/images/garden.jpg'
    },
    {
      id: 'scene-2',
      label: 'งานตกแต่ง & ตัดแต่งภูมิทัศน์',
      sub: 'Landscape Styling & Tree Pruning',
      image: '/images/garden-styling.jpg'
    },
    {
      id: 'scene-3',
      label: 'ผลงานโครงการจริงกว่า 30+ แห่ง',
      sub: 'Real Condominium & Residential Projects',
      image: '/images/projects/b38e2aab8d87f658c5aa4e584005f0ad.jpg'
    },
    {
      id: 'scene-4',
      label: 'กิจกรรมจริงเพื่อสังคมและเยาวชน',
      sub: 'Real CSR & Community Activities',
      image: '/images/csr-saturday-school-real.jpg'
    }
  ];

  const scenes = (backgroundScenes && backgroundScenes.length >= 4) ? backgroundScenes : defaultScenes;
  const s1 = scenes[0] || defaultScenes[0];
  const s2 = scenes[1] || defaultScenes[1];
  const s3 = scenes[2] || defaultScenes[2];
  const s4 = scenes[3] || defaultScenes[3];

  // Parallax subtle scales & opacities
  // Scene 1: ดูแลสวน (Garden Care) - 0% to 22%
  const opacity1 = useTransform(scrollYProgress, [0, 0.18, 0.28], [1, 1, 0]);
  const scale1 = useTransform(scrollYProgress, [0, 0.28], [1.02, 1.10]);
  const y1 = useTransform(scrollYProgress, [0, 0.28], [0, -30]);

  // Scene 2: ตกแต่งสวน & ช่างตัดแต่งภูมิทัศน์ (Garden Styling & Landscape Pruning) - 20% to 45%
  const opacity2 = useTransform(scrollYProgress, [0.18, 0.28, 0.42, 0.50], [0, 1, 1, 0]);
  const scale2 = useTransform(scrollYProgress, [0.18, 0.50], [1.08, 1.02]);
  const y2 = useTransform(scrollYProgress, [0.18, 0.50], [30, -30]);

  // Scene 3: รูปโครงการจริง (Real Projects Showcase) - 42% to 68%
  const opacity3 = useTransform(scrollYProgress, [0.42, 0.50, 0.65, 0.74], [0, 1, 1, 0]);
  const scale3 = useTransform(scrollYProgress, [0.42, 0.74], [1.08, 1.02]);
  const y3 = useTransform(scrollYProgress, [0.42, 0.74], [30, -30]);

  // Scene 4: กิจกรรมจริงเพื่อสังคม & จิตอาสา (Real CSR & Activities) - 65% to 90%
  const opacity4 = useTransform(scrollYProgress, [0.65, 0.74, 0.92, 0.98], [0, 1, 1, 0]);
  const scale4 = useTransform(scrollYProgress, [0.65, 0.96], [1.08, 1.02]);
  const y4 = useTransform(scrollYProgress, [0.65, 0.96], [30, -25]);

  // Scene 5: Royal Navy & Gold Outro - 88% to 100%
  const opacity5 = useTransform(scrollYProgress, [0.92, 0.98, 1], [0, 1, 1]);

  return (
    <div className="fixed inset-0 pointer-events-none -z-20 overflow-hidden select-none">
        {/* SCENE 1: ภาพดูแลสวน (Lush Garden Care) */}
        <motion.div
          style={{ opacity: opacity1, scale: scale1, y: y1 }}
          className="absolute inset-0 will-change-transform"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={s1.image || '/images/garden.jpg'}
            alt="Garden Maintenance"
            className="w-full h-full object-cover object-center filter brightness-[0.98] contrast-[1.05]"
          />
          {/* Ultra-soft Nature Scrim for crystal clear readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/85 via-white/70 to-white/90 backdrop-blur-[2px]" />
        </motion.div>

        {/* SCENE 2: ภาพช่างตัดแต่งต้นไม้ & แต่งสวน (Garden Styling & Pruning) */}
        <motion.div
          style={{ opacity: opacity2, scale: scale2, y: y2 }}
          className="absolute inset-0 will-change-transform"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={s2.image || '/images/garden-styling.jpg'}
            alt="Garden Styling and Landscape Pruning"
            className="w-full h-full object-cover object-center filter brightness-[0.95] contrast-[1.08]"
          />
          {/* Subtle gold & green tinted translucent overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-gold-50/75 to-white/90 backdrop-blur-[2px]" />
        </motion.div>

        {/* SCENE 3: ภาพผลงานโครงการจริง (Real Projects Showcase) */}
        <motion.div
          style={{ opacity: opacity3, scale: scale3, y: y3 }}
          className="absolute inset-0 will-change-transform"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={s3.image || '/images/projects/b38e2aab8d87f658c5aa4e584005f0ad.jpg'}
            alt="Real Projects Portfolio GR Group"
            className="w-full h-full object-cover object-center filter brightness-[0.96] contrast-[1.06]"
          />
          {/* Soft architectural translucent scrim */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/85 via-slate-50/75 to-white/90 backdrop-blur-[2px]" />
        </motion.div>

        {/* SCENE 4: ภาพกิจกรรมจริงเพื่อสังคม (Real CSR Activities) */}
        <motion.div
          style={{ opacity: opacity4, scale: scale4, y: y4 }}
          className="absolute inset-0 will-change-transform"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={s4.image || '/images/csr-saturday-school-real.jpg'}
            alt="Real CSR Activities GR Group"
            className="w-full h-full object-cover object-center filter brightness-[0.92] contrast-[1.05]"
          />
          {/* Warm translucent overlay for CSR warmth */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/45 to-white/60 backdrop-blur-[1px]" />
        </motion.div>

        {/* SCENE 5: Royal Navy & Gold Outro */}
        <motion.div
          style={{ opacity: opacity5 }}
          className="absolute inset-0 will-change-transform bg-gradient-to-b from-white/80 via-[#161141]/5 to-[#161141]/10"
        />

        {/* AMBIENT FLOATING LEAF & NATURE PARTICLES (โมชั่นสวยไม่เหมือนใคร) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating Leaf 1 */}
          <motion.div
            animate={{
              y: [-20, -120, -20],
              x: [0, 40, 0],
              rotate: [0, 45, 0],
              opacity: [0.3, 0.7, 0.3]
            }}
            transition={{
              duration: 16,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="absolute top-1/4 left-[8%] w-10 h-10 text-emerald-600/30"
          >
            <Leaf className="w-full h-full transform -rotate-12" />
          </motion.div>

          {/* Floating Leaf 2 (Golden Tint) */}
          <motion.div
            animate={{
              y: [0, -160, 0],
              x: [0, -50, 0],
              rotate: [20, -35, 20],
              opacity: [0.2, 0.6, 0.2]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 3
            }}
            className="absolute top-1/2 right-[10%] w-12 h-12 text-[#765321]/30"
          >
            <Leaf className="w-full h-full transform rotate-45" />
          </motion.div>

          {/* Floating Leaf 3 */}
          <motion.div
            animate={{
              y: [0, -100, 0],
              x: [0, 30, 0],
              rotate: [-10, 30, -10],
              opacity: [0.25, 0.55, 0.25]
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 6
            }}
            className="absolute top-3/4 left-[15%] w-8 h-8 text-emerald-700/25"
          >
            <Leaf className="w-full h-full" />
          </motion.div>

          {/* Sparkle 1 */}
          <motion.div
            animate={{
              scale: [0.8, 1.2, 0.8],
              opacity: [0.2, 0.6, 0.2]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="absolute top-1/3 right-1/4 w-6 h-6 text-gold-400/40"
          >
            <Sparkles className="w-full h-full" />
          </motion.div>
        </div>

        {/* Global Radial Depth Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(22,17,65,0.06)_100%)] pointer-events-none" />
      </div>
  );
}
