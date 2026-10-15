'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import DynamicStoryBackground from '@/components/DynamicStoryBackground';
import HeroSection from '@/components/HeroSection';
import ClientMarquee from '@/components/ClientMarquee';
import ServicesSection from '@/components/ServicesSection';
import BeforeAfterSection from '@/components/BeforeAfterSection';
import ProjectsSection from '@/components/ProjectsSection';
import TrustGuarantees from '@/components/TrustGuarantees';
import ArticlesSection from '@/components/ArticlesSection';
import StatsOverview from '@/components/StatsOverview';
import ContactSection from '@/components/ContactSection';
import FloatingContactWidget from '@/components/FloatingContactWidget';
import Footer from '@/components/Footer';

import defaultData from '@/data/siteData.json';

interface HomeClientProps {
  initialData?: any;
}

export default function HomeClient({ initialData }: HomeClientProps) {
  const [data, setData] = useState(initialData || defaultData);
  const [selectedServiceForQuote, setSelectedServiceForQuote] = useState<string>('');

  useEffect(() => {
    if (initialData) {
      setData(initialData);
    }
  }, [initialData]);

  // Fetch updated data from API if modified via admin
  useEffect(() => {
    fetch('/api/data?t=' + Date.now(), { cache: 'no-store' })
      .then((res) => res.json())
      .then((json) => {
        if (json && json.company) {
          setData(json);
        }
      })
      .catch((err) => console.log('Using local fallback data:', err));
  }, []);

  const handleSelectServiceForQuote = (serviceTitle: string) => {
    setSelectedServiceForQuote(serviceTitle);
    const contactElem = document.getElementById('contact');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="min-h-screen relative text-slate-800 selection:bg-[#765321] selection:text-white">
      {/* Dynamic Storytelling Scroll Background */}
      <DynamicStoryBackground backgroundScenes={(data as any).backgroundScenes} />

      <Navbar company={data.company} />
      <HeroSection hero={(data as any).hero} company={data.company} />
      <ClientMarquee clients={(data as any).clients} />
      <ServicesSection
        services={data.services}
        onSelectForQuote={handleSelectServiceForQuote}
      />
      <BeforeAfterSection beforeAfter={(data as any).beforeAfter} />
      <ProjectsSection
        projects={data.projects}
        onSelectForQuote={handleSelectServiceForQuote}
      />
      <TrustGuarantees guarantees={(data as any).guarantees} />
      <ArticlesSection articles={data.articles} csrList={data.csr} />
      <StatsOverview stats={data.company.stats} />
      <ContactSection
        company={data.company}
        prefilledService={selectedServiceForQuote}
      />
      <Footer company={data.company} />

      {/* Floating Quick Contact Action Widget */}
      <FloatingContactWidget
        phone={data.company.phone}
        phoneDisplay={data.company.phoneDisplay}
        lineId={data.company.lineId}
      />
    </main>
  );
}
