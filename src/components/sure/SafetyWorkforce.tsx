'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const VALUES = [
  { title: 'Safety-First Planning', desc: 'Every project begins with comprehensive safety planning, hazard analysis and protocols that protect our team and everyone on site.' },
  { title: 'Skilled Trades', desc: 'Our workforce represents decades of combined craft expertise across sheet metal, piping, welding and HVAC service disciplines.' },
  { title: 'Apprenticeship & Workforce Development', desc: 'We invest in the next generation through structured apprenticeship programs that build lasting careers and community strength.' },
  { title: 'Inclusive Opportunity', desc: 'As a certified minority-owned enterprise, we create pathways for skilled professionals from every background to excel in the trades.' },
  { title: 'Continuous Technical Training', desc: 'Ongoing education in emerging technologies, codes and methods ensures our teams deliver at the leading edge of the industry.' },
];

export default function SafetyWorkforce() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.fromTo('.sw-title',
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', toggleActions: 'play none none reverse' }
      }
    );
    // Value items
    gsap.fromTo('.sw-value',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out',
        scrollTrigger: { trigger: '.sw-values', start: 'top 85%', toggleActions: 'play none none reverse' }
      }
    );
  }, { scope: sectionRef });

  return (
    <section
      id="safety"
      ref={sectionRef}
      className="relative py-24 lg:py-36 overflow-hidden"
      aria-label="Safety and workforce"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-heat-amber/15 to-transparent" />

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="sw-title opacity-0 mb-4">
          <span className="tech-label-warm">PEOPLE & SAFETY</span>
        </div>

        <h2 className="sw-title opacity-0 section-title text-blueprint-white max-w-3xl mb-16">
          <span className="hover-red">THE SYSTEM ONLY WORKS</span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-heat-amber to-warm-orange">
            BECAUSE OUR PEOPLE DO.
          </span>
        </h2>

        {/* Full-width worker image with craft labels */}
        <div className="sw-image-area relative mb-16 rounded-sm overflow-hidden border border-seam-line">
          <div className="relative aspect-[16/8] lg:aspect-[3/1]">
            <div className="absolute inset-0 bg-gradient-to-br from-duct-mid via-steel-blue to-mech-navy blueprint-grid" aria-hidden="true" />
            {/* Dark overlay for label readability */}
            <div className="absolute inset-0 bg-mech-navy/10" />
            <div className="absolute inset-0 flex items-center justify-center p-5 text-center pointer-events-none">
              <span className="text-xl sm:text-3xl lg:text-4xl tracking-[0.08em] uppercase font-semibold text-blueprint-white">People. Safety. Excellence.</span>
            </div>
            {/* Metallic texture overlay */}
            <div className="absolute inset-0 brushed-metal opacity-20" />


          </div>
        </div>

        {/* Values grid */}
        <div className="sw-values grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {VALUES.map((val) => (
            <div
              key={val.title}
              className="sw-value opacity-0 group p-5 border border-seam-line rounded-sm bg-steel-blue/20 hover:border-heat-amber/15 transition-all duration-500"
            >
              <h3 className="text-sm font-semibold text-blueprint-white mb-2 group-hover:text-heat-amber/90 transition-colors duration-300">
                {val.title}
              </h3>
              <p className="text-xs text-galv-silver/50 leading-relaxed">{val.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
