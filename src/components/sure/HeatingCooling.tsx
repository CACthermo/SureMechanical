'use client';
import { useRef } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { assetPath } from '@/lib/asset-path';
gsap.registerPlugin(ScrollTrigger);
export default function HeatingCooling() {
  const section = useRef<HTMLElement>(null);
  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.fromTo('.thermal-word', { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: 0.15, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: section.current, start: 'top 65%' } });
    gsap.fromTo('.thermal-photo', { scale: 1.08 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: section.current, start: 'top bottom', end: 'bottom top', scrub: true } });
  }, { scope: section });
  return <section id="hero" ref={section} aria-label="Heating and cooling systems" className="relative min-h-[680px] h-[90svh] max-h-[1000px] overflow-hidden">
    <Image src={assetPath('/company/RTU_pic1.png')} alt="Rooftop mechanical equipment and crew, from the original SURE Mechanical website" priority fill sizes="100vw" className="thermal-photo object-cover" />
    <div className="absolute inset-0 bg-gradient-to-t from-[#020b13]/95 via-[#020b13]/30 to-transparent" />
    <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[1440px] px-5 sm:px-8 pb-16 lg:pb-24 text-white">
      <p className="font-mono text-xs uppercase tracking-[0.2em] mb-6 text-[#5beaf3]">Heating &amp; cooling</p>
      <h1 className="text-[clamp(3rem,8vw,8rem)] font-bold leading-[0.95] tracking-tight overflow-hidden"><span className="thermal-word inline-block">SURE</span>{' '}<span className="thermal-word inline-block">Mechanical</span></h1>
      <p className="mt-7 max-w-xl text-lg text-white/90">Commercial heating, cooling and ventilation. From design through installation.</p>
      <p className="mt-4 max-w-xl text-base text-white/85">SURE Group delivers high-performance HVAC and mechanical solutions for the most demanding environments.</p>
      <div className="mt-7 flex flex-wrap gap-3"><a href="#project-form" className="rounded-sm bg-cool-teal px-5 py-3 font-semibold text-[#020b13]">Start a Project</a><a href="#installation" className="rounded-sm border border-white/50 px-5 py-3 font-semibold text-white">Explore our capabilities</a></div>
    </div>
  </section>;
}
