'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, UserCheck, Award, FileCheck2 } from 'lucide-react';

interface GuaranteeItem {
  id?: string;
  title: string;
  subtitle: string;
  desc: string;
}

interface TrustGuaranteesProps {
  guarantees?: GuaranteeItem[];
}

export default function TrustGuarantees({ guarantees: propGuarantees }: TrustGuaranteesProps) {
  const fallbackIcons = [ShieldAlert, UserCheck, Award, FileCheck2];

  const fallbackGuarantees: GuaranteeItem[] = [
    {
      title: 'ประกันภัยคุ้มครอง 5,000,000 บาท',
      subtitle: 'Public Liability Insurance',
      desc: 'มีประกันภัยคุ้มครองความรับผิดชอบต่อบุคคลภายนอกและทรัพย์สินของโครงการ มั่นใจในความปลอดภัยสูงสุดตลอดอายุสัญญา'
    },
    {
      title: 'ตรวจประวัติอาชญากรรม 100%',
      subtitle: 'Strict Background Check',
      desc: 'พนักงานทุกคนผ่านการตรวจสอบประวัติอาชญากรรมจากสำนักงานตำรวจแห่งชาติ พร้อมตรวจสุขภาพและตรวจสารเสพติดก่อนเข้าปฏิบัติงาน'
    },
    {
      title: 'รุกขกรผ่านการรับรองมาตรฐาน',
      subtitle: 'Certified Arborists',
      desc: 'งานตัดแต่งต้นไม้ใหญ่ดำเนินการโดยทีมรุกขกรมืออาชีพ ตัดแต่งถูกต้องตามหลักชีววิทยาของพืช เพื่อความปลอดภัยและยั่งยืน'
    },
    {
      title: 'รายงานผลดิจิทัล (Site Report)',
      subtitle: 'Digital Quality Control',
      desc: 'มีผู้จัดการเขต (Area Manager) เข้าตรวจประเมินคุณภาพทุกสัปดาห์ พร้อมจัดส่งรายงานภาพถ่ายการทำงานให้นิติบุคคลทราบสม่ำเสมอ'
    }
  ];

  const guarantees = (propGuarantees && propGuarantees.length > 0) ? propGuarantees : fallbackGuarantees;

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-[#003168] tracking-tight">
          มาตรฐานความปลอดภัยและความมั่นใจระดับองค์กร
        </h2>
        <p className="text-sm sm:text-base text-slate-500 mt-2 font-normal">
          ทำไมคณะกรรมการนิติบุคคลและผู้บริหารโครงการชั้นนำจึงไว้วางใจ GR Group
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {guarantees.map((item, idx) => {
          const Icon = fallbackIcons[idx % fallbackIcons.length];
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="bg-white/90 backdrop-blur-md border border-slate-200 rounded-2xl p-6 shadow-xs hover:shadow-lg hover:border-[#0053b5]/60 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#003168] text-white flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-[#0053b5] group-hover:text-white transition-all shadow-xs">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-[11px] font-semibold text-[#0053b5] mb-1">
                  {item.subtitle}
                </div>
                <h3 className="text-base font-bold text-[#003168] mb-3 leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {item.desc}
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                <span>✓ มาตรฐานพร้อมตรวจสอบ</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
