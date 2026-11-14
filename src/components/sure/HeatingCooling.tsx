'use client';
import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { assetPath } from '@/lib/asset-path';
gsap.registerPlugin(ScrollTrigger);
export default function HeatingCooling() {
  const section = useRef<HTMLElement>(null);
  const photo = useRef<HTMLImageElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (photo.current?.complete && photo.current.naturalWidth > 0) setReady(true);
    const fallback = window.setTimeout(() => setReady(true), 5000);
    return () => window.clearTimeout(fallback);
  }, []);
  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.fromTo('.thermal-photo', { scale: 1.08 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: section.current, start: 'top bottom', end: 'bottom top', scrub: true } });
  }, { scope: section });
  return <section id="hero" ref={section} data-ready={ready} aria-label="Heating and cooling systems" style={{ backgroundImage: `url(data:image/webp;base64,UklGRsgAAABXRUJQVlA4ILwAAACQBQCdASogABgAPxF+s1GsKKSisBgIAYAiCWQAnTMAQOQdifLz3Akx+g2Dwr9yYvuacULJAAD+Ia7Zbzt/agXB1r1ZQEklgDwiJmTnFQTvL2iqz+gnhey9FDCFekSsvlsVhbDfb7qZV0YscsMF8MrjQbOAT6x60FEgzHv1dHRPIjGsGFj1c+K2FQOCMjHK0c+1mVWe28Y+J6vtLYzwjEljVz8R1TY9r1hbWH2aQ+B+daH7woqJEp9iOYAAAA==)`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: '#061a2b' }} className="hero-intro relative min-h-[680px] h-[90svh] max-h-[1000px] overflow-hidden">
    <Image ref={photo} src={assetPath('/company/hero-rooftop.webp')} alt="Rooftop mechanical equipment and crew, from the original SURE Mechanical website" onLoad={() => setReady(true)} onError={() => setReady(true)} priority fetchPriority="high" fill sizes="100vw" className="thermal-photo hero-photo object-cover" />
    <div className="absolute inset-0 bg-gradient-to-t from-[#020b13]/95 via-[#020b13]/30 to-transparent" />
    <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[1440px] px-5 sm:px-8 pb-16 lg:pb-24 text-white">
      <p className="hero-support font-mono text-xs uppercase tracking-[0.2em] mb-6 text-[#5beaf3]">Heating &amp; cooling</p>
      <h1 className="hero-title text-[clamp(3rem,8vw,8rem)] font-bold leading-[0.95] tracking-tight overflow-hidden"><span className="thermal-word inline-block">SURE</span>{' '}<span className="thermal-word inline-block">Mechanical</span></h1>
      <p className="hero-support mt-7 max-w-xl text-lg text-white/90">Commercial heating, cooling and ventilation. From design through installation.</p>
      <p className="hero-support mt-4 max-w-xl text-base text-white/85">SURE Group delivers high-performance HVAC and mechanical solutions for the most demanding environments.</p>
      <div className="hero-support mt-7 flex flex-wrap gap-3"><a href="#project-form" className="rounded-sm bg-cool-teal px-5 py-3 font-semibold text-[#020b13]">Start a Project</a><a href="#installation" className="rounded-sm border border-white/50 px-5 py-3 font-semibold text-white">Explore our capabilities</a></div>
    </div>
    <noscript><style>{`.hero-intro .hero-title,.hero-intro .hero-support,.hero-intro .hero-photo{opacity:1!important;transform:none!important;mask-image:none!important;filter:none!important}`}</style></noscript>
  </section>;
}
