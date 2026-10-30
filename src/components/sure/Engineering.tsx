'use client';

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

const TECH_LABELS = [
  { label: 'SUPPLY AIR', value: '24,000 CFM', x: '15%', y: '25%' },
  { label: 'CHILLED WATER', value: '42°F SUPPLY', x: '70%', y: '20%' },
  { label: 'DUCT STATIC PRESSURE', value: '2.5 IN. W.G.', x: '20%', y: '70%' },
  { label: 'RETURN AIR', value: '72°F', x: '75%', y: '65%' },
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
    // Blueprint lines draw
    gsap.fromTo('.eng-blueprint-line',
      { strokeDashoffset: 800 },
      { strokeDashoffset: 0, duration: 1.5, ease: 'power2.inOut',
        scrollTrigger: { trigger: '.eng-visual', start: 'top 80%', toggleActions: 'play none none reverse' }
      }
    );
    // Tech labels fade in
    gsap.fromTo('.eng-tech-label',
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.4, stagger: 0.15, ease: 'back.out(1.4)',
        scrollTrigger: { trigger: '.eng-visual', start: 'top 60%', toggleActions: 'play none none reverse' }
      }
    );
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

          {/* BIM/Blueprint Visual */}
          <div className="eng-visual relative">
            <div className="relative aspect-[4/3] rounded-sm border border-seam-line overflow-hidden bg-duct-dark/50">
              <div className="absolute inset-0 bg-gradient-to-br from-duct-mid via-steel-blue to-mech-navy blueprint-grid" aria-hidden="true" />

              {/* Blueprint overlay lines */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                {/* Grid lines */}
                {[...Array(8)].map((_, i) => (
                  <line key={`h${i}`} x1="0" y1={i * 80 + 40} x2="800" y2={i * 80 + 40} className="eng-blueprint-line" stroke="rgba(17,197,214,0.12)" strokeWidth="0.5" strokeDasharray="800" />
                ))}
                {[...Array(6)].map((_, i) => (
                  <line key={`v${i}`} x1={i * 140 + 20} y1="0" x2={i * 140 + 20} y2="600" className="eng-blueprint-line" stroke="rgba(17,197,214,0.12)" strokeWidth="0.5" strokeDasharray="800" />
                ))}
                {/* Duct outline */}
                <rect x="80" y="150" width="640" height="120" rx="3" className="eng-blueprint-line" stroke="rgba(91,234,243,0.35)" strokeWidth="1.5" strokeDasharray="800" />
                <rect x="250" y="50" width="100" height="100" rx="2" className="eng-blueprint-line" stroke="rgba(91,234,243,0.25)" strokeWidth="1" strokeDasharray="800" />
                <rect x="500" y="350" width="120" height="150" rx="2" className="eng-blueprint-line" stroke="rgba(91,234,243,0.25)" strokeWidth="1" strokeDasharray="800" />
                {/* Dimension callouts */}
                <line x1="80" y1="130" x2="720" y2="130" className="eng-blueprint-line" stroke="rgba(245,158,11,0.2)" strokeWidth="0.5" strokeDasharray="800" />
                <text x="400" y="125" textAnchor="middle" fill="rgba(245,158,11,0.3)" fontSize="10" fontFamily="monospace">ELEV. 24&apos;-0&quot; AFF</text>
                {/* Section marker */}
                <circle cx="400" cy="210" r="12" className="eng-blueprint-line" stroke="rgba(91,234,243,0.3)" strokeWidth="0.5" fill="none" strokeDasharray="800" />
                <text x="400" y="214" textAnchor="middle" fill="rgba(91,234,243,0.4)" fontSize="8" fontFamily="monospace">A/101</text>
              </svg>

              {/* Hover tech labels */}
              {TECH_LABELS.map((tl) => (
                <div
                  key={tl.label}
                  className="eng-tech-label opacity-0 absolute pointer-events-auto cursor-default"
                  style={{ left: tl.x, top: tl.y }}
                >
                  <div className="tech-label holo-label">
                    {tl.label}
                    <br />
                    <span className="text-bright-cyan/80">{tl.value}</span>
                  </div>
                </div>
              ))}
            </div>
            {/* Caption */}
            <p className="text-[10px] font-mono tracking-[0.1em] uppercase text-galv-silver/30 mt-3 text-right">
              Technical labels are visual storytelling devices only.
            </p>
          </div>
        </div>
      </div>

      {/* Duct connector to next section */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-cool-teal/20 to-transparent" />
    </section>
  );
}
