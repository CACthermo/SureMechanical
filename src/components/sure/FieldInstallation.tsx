'use client';

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
    // BIM overlay lines
    gsap.fromTo('.fi-bim-line',
      { strokeDashoffset: 600 },
      { strokeDashoffset: 0, duration: 2, ease: 'power2.inOut',
        scrollTrigger: { trigger: '.fi-image-area', start: 'top 70%', toggleActions: 'play none none reverse' }
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
          <span className="hover-red">COORDINATED IN THE MODEL.</span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cool-teal to-bright-cyan">
            BUILT IN THE REAL WORLD.
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

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Field image with BIM overlay */}
          <div className="fi-image-area lg:col-span-3 relative">
            <div className="relative aspect-[16/10] rounded-sm overflow-hidden border border-seam-line">
              <div className="absolute inset-0 bg-gradient-to-br from-duct-mid via-steel-blue to-mech-navy blueprint-grid" aria-hidden="true" />
              {/* BIM overlay lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 500" aria-hidden="true">
                <rect x="100" y="80" width="300" height="200" rx="2" className="fi-bim-line" stroke="var(--sure-cool-teal)" strokeWidth="1" fill="none" strokeDasharray="600" />
                <line x1="100" y1="180" x2="400" y2="180" className="fi-bim-line" stroke="rgba(91,234,243,0.25)" strokeWidth="0.5" strokeDasharray="600" />
                <rect x="500" y="200" width="200" height="150" rx="2" className="fi-bim-line" stroke="var(--sure-cool-teal)" strokeWidth="1" fill="none" strokeDasharray="600" />
                {/* Dimension callout */}
                <line x1="100" y1="60" x2="400" y2="60" className="fi-bim-line" stroke="rgba(245,158,11,0.25)" strokeWidth="0.5" strokeDasharray="600" />
                <text x="250" y="55" textAnchor="middle" fill="var(--sure-galv-silver)" fontSize="9" fontFamily="monospace">COORDINATED MECHANICAL SYSTEM</text>
                {/* Installation path */}
                <path d="M 400 180 L 500 250" className="fi-bim-line" stroke="rgba(91,234,243,0.2)" strokeWidth="0.5" strokeDasharray="4 4" />
              </svg>
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-mech-navy/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4">
                <span className="tech-label">BIM COORDINATION → FIELD INSTALLATION</span>
              </div>
            </div>
          </div>

          {/* Worker image */}
          <div className="lg:col-span-2 relative">
            <div className="relative aspect-[4/3] lg:aspect-[3/4] rounded-sm overflow-hidden border border-seam-line">
              <div className="absolute inset-0 bg-gradient-to-br from-duct-mid via-steel-blue to-mech-navy blueprint-grid" aria-hidden="true" />
              <div className="absolute inset-0 flex flex-col justify-center p-8 gap-6">
                <p className="text-cool-teal font-mono text-xs uppercase tracking-widest">From model to site</p>
                <p className="text-3xl font-semibold text-blueprint-white">Plan.<br />Coordinate.<br />Install.</p>
                <p className="text-galv-silver text-sm leading-relaxed">Engineering and field teams working together through startup and commissioning.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
