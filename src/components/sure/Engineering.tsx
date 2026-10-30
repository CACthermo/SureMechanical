'use client';

import Image from 'next/image';
import { assetPath } from '@/lib/asset-path';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CAPABILITIES = [
  { label: 'Mechanical Design Support', value: 'MEP COORDINATION' },
  { label: 'BIM Coordination', value: '3D MODELING' },
  { label: 'Constructability Review', value: 'CLASH DETECTION' },
  { label: 'Equipment Planning', value: 'SELECTION & SIZING' },
  { label: 'Duct & Piping Coordination', value: 'LAYOUT OPTIMIZATION' },
  { label: 'Energy-Conscious Decisions', value: 'SYSTEM PERFORMANCE' },
  { label: 'Prefabrication Planning', value: 'DFT APPROACH' },
];


export default function Engineering() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    // Title reveal
    gsap.fromTo('.eng-title', 
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', toggleActions: 'play none none reverse' }
      }
    );
    // Capability items
    gsap.fromTo('.eng-cap-item',
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out',
        scrollTrigger: { trigger: '.eng-cap-grid', start: 'top 85%', toggleActions: 'play none none reverse' }
      }
    );
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.fromTo('.eng-unit', { y: 35, rotate: -2, opacity: 0 }, { y: 0, rotate: 0, opacity: 1, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: '.eng-visual', start: 'top 80%' } });
    }
  }, { scope: sectionRef });

  return (
    <section
      id="engineering"
      ref={sectionRef}
      className="relative py-24 lg:py-36 overflow-hidden"
      aria-label="Engineering capabilities"
    >
      <div className="absolute inset-0 blueprint-grid opacity-40" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cool-teal/20 to-transparent" />

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section label */}
        <div className="eng-title opacity-0 mb-4">
          <span className="tech-label">ENGINEERING</span>
        </div>

        {/* Title */}
        <h2 className="eng-title opacity-0 section-title text-blueprint-white max-w-3xl mb-6">
          <span className="hover-red">EVERY SYSTEM BEGINS</span>{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cool-teal to-bright-cyan">
            BEFORE THE FIELD.
          </span>
        </h2>

        <p className="eng-title opacity-0 section-subtitle text-galv-silver/60 max-w-2xl mb-16">
          SURE Mechanical&apos;s engineering team coordinates the complete virtual system — its components, clearances and connections — before work begins on site.
        </p>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Capabilities list */}
          <div className="eng-cap-grid space-y-0">
            {CAPABILITIES.map((cap) => (
              <div
                key={cap.label}
                className="eng-cap-item opacity-0 group flex items-start gap-4 py-4 border-b border-seam-line hover:border-cool-teal/20 transition-colors duration-300"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-cool-teal/40 mt-2.5 flex-shrink-0 group-hover:bg-bright-cyan transition-colors duration-300" />
                <div>
                  <div className="text-blueprint-white text-sm font-medium">{cap.label}</div>
                  <div className="text-[10px] font-mono tracking-[0.12em] uppercase text-galv-silver/40 mt-0.5">{cap.value}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="eng-visual relative min-h-[540px] sm:min-h-[650px] overflow-hidden rounded-sm border border-cool-teal/20 bg-steel-blue">
            <div className="absolute inset-0 blueprint-grid" aria-hidden="true" />
            <div className="absolute top-12 right-8 w-64 h-64 rounded-full bg-cool-teal/10 blur-3xl" aria-hidden="true" />
            <div className="eng-unit absolute inset-x-0 top-0 h-[440px] sm:h-[530px]" style={{filter:'drop-shadow(0 20px 20px rgba(0,30,45,.18))'}}>
              <Image src={assetPath('/company/duct-unit.webp')} alt="Ductwork and air handling equipment" width={850} height={1135} className="h-full w-auto max-w-full mx-auto object-contain object-top" style={{clipPath:'polygon(0 0,100% 0,100% 43%,64% 76%,35% 75%,0 44%)'}} />
            </div>
            <div className="absolute inset-x-0 bottom-0 p-7 sm:p-9 border-t border-cool-teal/20 bg-mech-navy/95">
              <p className="eyebrow mb-3">Design &amp; coordination</p><h3 className="text-3xl font-bold text-blueprint-white">Every connection matters.</h3><p className="mt-4 text-sm leading-relaxed text-galv-silver">Ductwork, piping and equipment planned together before installation.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Duct connector to next section */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-cool-teal/20 to-transparent" />
    </section>
  );
}
