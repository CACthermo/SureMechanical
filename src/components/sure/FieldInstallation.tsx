'use client';

import Image from 'next/image';
import { assetPath } from '@/lib/asset-path';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PROCESS_STEPS = [
  { label: 'ENGINEERING', detail: 'Virtual coordination' },
  { label: 'DELIVERY', detail: 'Just-in-time logistics' },
  { label: 'INSTALLATION', detail: 'Coordinated field execution' },
  { label: 'STARTUP', detail: 'Commissioning & verification' },
];

export default function FieldInstallation() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.fromTo('.fi-title',
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', toggleActions: 'play none none reverse' }
      }
    );
    // Process steps
    gsap.fromTo('.fi-step',
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.5, stagger: 0.12, ease: 'power2.out',
        scrollTrigger: { trigger: '.fi-process', start: 'top 80%', toggleActions: 'play none none reverse' }
      }
    );
  }, { scope: sectionRef });

  return (
    <section
      id="installation"
      ref={sectionRef}
      className="relative py-24 lg:py-36 overflow-hidden"
      aria-label="Field installation"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-mech-navy via-steel-blue/50 to-mech-navy" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cool-teal/15 to-transparent" />

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="fi-title opacity-0 mb-4">
          <span className="tech-label">FIELD EXECUTION</span>
        </div>

        <h2 className="fi-title opacity-0 section-title text-blueprint-white max-w-3xl mb-6">
          <span className="hover-red">FROM DESIGN</span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cool-teal to-bright-cyan">
            TO THE FIELD.
          </span>
        </h2>

        {/* Process progression */}
        <div className="fi-process flex flex-wrap gap-2 mb-16">
          {PROCESS_STEPS.map((step, i) => (
            <div key={step.label} className="fi-step opacity-0 flex items-center gap-2">
              <div className="px-4 py-2.5 border border-cool-teal/20 rounded-sm bg-cool-teal/5">
                <div className="text-xs font-mono tracking-[0.08em] uppercase text-bright-cyan/90">{step.label}</div>
                <div className="text-[9px] font-mono text-galv-silver/40 mt-0.5">{step.detail}</div>
              </div>
              {i < PROCESS_STEPS.length - 1 && (
                <svg className="w-4 h-4 text-cool-teal/30 flex-shrink-0 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-5 gap-6 lg:gap-8">
          <div className="lg:col-span-3 relative aspect-[4/3] overflow-hidden rounded-sm"><Image src={assetPath('/company/field-crew.webp')} alt="Rooftop installation crew, from the original SURE Mechanical website" fill sizes="(max-width:1023px) 100vw, 60vw" className="object-cover" /><div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#020b13]/90 to-transparent p-6 pt-16"><p className="font-mono text-xs text-[#5beaf3] uppercase tracking-widest">Field installation</p><p className="mt-2 text-2xl font-semibold text-white">Built by our people.</p></div></div>
          <div className="lg:col-span-2 relative overflow-hidden rounded-sm min-h-[450px]">
            <Image src={assetPath('/company/Worker_pic1.png')} alt="SURE Mechanical field team, from the original website" fill sizes="(max-width:1023px) 100vw, 40vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#020b13]/95 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-7 text-white"><p className="font-mono text-xs tracking-widest text-[#5beaf3] uppercase mb-3">From model to site</p><h3 className="text-3xl font-bold">Plan. Coordinate. Install.</h3><p className="mt-4 text-sm text-white/90">Engineering and field teams working together through startup and commissioning.</p></div>
          </div>
        </div>
      </div>
    </section>
  );
}
