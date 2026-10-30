'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { assetPath } from '@/lib/asset-path';
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
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set('.sw-title, .sw-value', { opacity: 1 });
      return;
    }
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
      className="relative py-16 lg:py-20 overflow-hidden"
      aria-label="Safety and workforce"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-heat-amber/15 to-transparent" />

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="sw-title opacity-0 mb-4">
          <span className="tech-label-warm">PEOPLE & SAFETY</span>
        </div>

        <h2 className="sw-title opacity-0 section-title text-blueprint-white max-w-3xl mb-8">
          <span className="hover-red">THE SYSTEM ONLY WORKS</span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-heat-amber to-warm-orange">
            BECAUSE OUR PEOPLE DO.
          </span>
        </h2>

        <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-6 lg:gap-10 items-start">
          <div className="sw-image-area relative aspect-[4/3] lg:aspect-[4/5] rounded-sm overflow-hidden border border-seam-line">
            <Image src={assetPath('/company/Worker_pic1.png')} alt="SURE Mechanical crew at work" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
          </div>

        {/* Values grid */}
        <div className="sw-values grid sm:grid-cols-2 gap-4">
          {VALUES.map((val) => (
            <div
              key={val.title}
              className="sw-value opacity-0 group p-4 border border-seam-line rounded-sm bg-steel-blue/20 hover:border-heat-amber/15 transition-all duration-500"
            >
              <h3 className="text-sm font-semibold text-blueprint-white mb-2 group-hover:text-heat-amber/90 transition-colors duration-300">
                {val.title}
              </h3>
              <p className="text-xs text-galv-silver/50 leading-relaxed">{val.desc}</p>
            </div>
          ))}
        </div>
        </div>
      </div>
    </section>
  );
}
