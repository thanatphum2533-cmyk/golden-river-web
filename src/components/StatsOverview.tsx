'use client';

import React from 'react';
import { Building2, Calendar, Users, Award } from 'lucide-react';

interface StatItem {
  label: string;
  value: string;
  detail: string;
}

interface StatsOverviewProps {
  stats: StatItem[];
}

export default function StatsOverview({ stats }: StatsOverviewProps) {
  const statIcons = [Building2, Calendar, Users, Award];

  return (
    <section id="stats-overview" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-4">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-[#003168] tracking-tight">
          สถิติและความสำเร็จที่การันตีคุณภาพ
        </h2>
        <p className="text-sm sm:text-base text-slate-500 mt-2 font-normal">
          ความไว้วางใจจากคณะกรรมการนิติบุคคลและโครงการชั้นนำกว่า 30+ แห่งทั่วกรุงเทพฯ และปริมณฑล
        </p>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
        {stats.map((item, idx) => {
          const Icon = statIcons[idx % statIcons.length];
          return (
            <div
              key={item.label}
              className="bg-white border border-slate-200 p-5 sm:p-6 rounded-2xl shadow-xs text-left hover:border-[#0053b5] hover:shadow-lg transition-all duration-300 group flex flex-col justify-between"
            >
              <div className="w-11 h-11 rounded-xl bg-[#d9e5f4] text-[#0053b5] group-hover:bg-[#0053b5] group-hover:text-white flex items-center justify-center mb-4 transition-colors duration-300">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#0053b5] tracking-tight">
                  {item.value}
                </div>
                <div className="text-xs sm:text-sm font-bold text-[#003168] mt-1.5">
                  {item.label}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 font-normal">
                  {item.detail}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
