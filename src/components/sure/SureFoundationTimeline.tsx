'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { assetPath } from '@/lib/asset-path';

gsap.registerPlugin(ScrollTrigger);

const FOUNDATION = {
  name: 'SURE Mechanical',
  logo: '/brand/SURE_Mechanical_trimmed.png',
};

const RELATED = [
  {
    name: 'Cincinnati Air Conditioning Co.',
    role: 'DESIGN-BUILD & ENGINEERED SYSTEMS',
    description: 'Founded in 1938, Cincinnati Air brings established design-build, building controls and commercial/industrial engineering experience.',
    logo: '/brand/CAC_Logo_2026.png',
    href: 'https://cincinnatiair.com',
  },
  {
    name: 'Thermolinear',
    role: 'CONTROLLED ENVIRONMENTS',
    description: 'Thermolinear specializes in environmental rooms and precision-controlled spaces for research, industry and critical applications.',
    logo: '/brand/Thermolinear_logo.svg',
    href: 'https://thermolinearusa.com',
  },
];

const PATHS = [
  { id: 'foundation', d: 'M600 70 V215', phase: 0.15, duration: 0.10 },
  { id: 'cac', d: 'M600 310 V352 H315 V385 H235 V478', phase: 0.31, duration: 0.18 },
  { id: 'thermolinear', d: 'M600 310 V352 H885 V385 H965 V478', phase: 0.31, duration: 0.18 },
  { id: 'return-left', d: 'M235 645 V670 H415 V700 H600', phase: 0.65, duration: 0.11 },
  { id: 'return-right', d: 'M965 645 V670 H785 V700 H600', phase: 0.65, duration: 0.11 },
  { id: 'unit', d: 'M600 700 V740', phase: 0.76, duration: 0.08 },
];

function Mark({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  return <Image src={assetPath(src)} alt={alt} width={370} height={150} className={`h-auto w-full object-contain ${className}`} />;
}

function UnitSequence({ className = '' }: { className?: string }) {
  return (
    <div className={`relative aspect-[800/530] w-full ${className}`} aria-label="Rooftop HVAC unit, transitioning from plan view to three-dimensional hologram" role="img">
      <Image src={assetPath('/models/rtu-topdown.webp')} alt="" width={800} height={530} className="rtu-top absolute inset-0 h-full w-full object-contain drop-shadow-[0_0_18px_rgba(67,222,246,.55)]" />
      <Image src={assetPath('/models/rtu-transition.webp')} alt="" width={800} height={530} className="rtu-middle absolute inset-0 h-full w-full object-contain opacity-0 drop-shadow-[0_0_20px_rgba(67,222,246,.6)]" />
      <Image src={assetPath('/models/rtu-isometric.webp')} alt="" width={800} height={530} className="rtu-iso absolute inset-0 h-full w-full object-contain opacity-0 drop-shadow-[0_0_32px_rgba(67,222,246,.8)]" />
      <div className="pointer-events-none absolute inset-x-[12%] bottom-[4%] h-[1px] bg-cool-teal/50 shadow-[0_0_18px_4px_rgba(17,197,214,.5)]" />
    </div>
  );
}

export default function SureFoundationTimeline() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(min-width: 1024px) and (min-height: 760px) and (prefers-reduced-motion: no-preference)', () => {
    // The linear story is the default, including when JavaScript is unavailable.
    section.current?.setAttribute('data-enhanced', 'true');
    const ducts = gsap.utils.toArray<SVGPathElement>('.story-duct');
    ducts.forEach(path => {
      const length = path.getTotalLength();
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
    });

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: track.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.55,
        invalidateOnRefresh: true,
      },
    });

    // Begin with SURE Mechanical's mark centered. It becomes the top origin
    // of the blueprint as the user scrolls, then the first duct draws.
    timeline.to('.story-founder', { top: '1%', duration: 0.13, ease: 'power2.inOut' }, 0.02);
    timeline.fromTo('.story-2010', { opacity: 0, x: -12 }, { opacity: 1, x: 0, duration: 0.08 }, 0.09);
    PATHS.forEach(({ id, phase, duration }) => {
      timeline.to(`.story-duct[data-duct="${id}"]`, { strokeDashoffset: 0, duration, ease: 'none' }, phase);
    });
    timeline.fromTo('.story-group', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.09 }, 0.22);
    timeline.fromTo('.story-2025', { opacity: 0, x: 10 }, { opacity: 1, x: 0, duration: 0.08 }, 0.24);
    timeline.fromTo('.story-acquired', { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.015, duration: 0.10 }, 0.46);
    timeline.fromTo('.story-description', { opacity: 0, y: 15 }, { opacity: 1, y: 0, stagger: 0.02, duration: 0.1 }, 0.55);
    timeline.fromTo('.story-unit', { opacity: 0, scale: 0.52 }, { opacity: 1, scale: 1, duration: 0.08 }, 0.83);
    timeline.to('.rtu-top', { opacity: 0, duration: 0.055 }, 0.88);
    timeline.fromTo('.rtu-middle', { opacity: 0 }, { opacity: 1, duration: 0.055 }, 0.88);
    timeline.to('.rtu-middle', { opacity: 0, duration: 0.06 }, 0.94);
    timeline.fromTo('.rtu-iso', { opacity: 0 }, { opacity: 1, duration: 0.06 }, 0.94);
    timeline.to('.story-acquired, .story-group, .story-founder, .story-2010, .story-2025', { opacity: 0.22, duration: 0.1 }, 0.94);
    timeline.to('.story-duct', { opacity: 0.25, duration: 0.1 }, 0.94);
    timeline.to('.story-unit', { scale: 1.55, y: -180, rotation: -3, duration: 0.13, ease: 'power1.inOut' }, 0.94);
    timeline.fromTo('.story-conclusion', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.08 }, 1.01);
    return () => section.current?.removeAttribute('data-enhanced');
    });
    return () => media.revert();
  }, { scope: section });

  return (
    <section ref={section} id="sure-system" className="relative overflow-clip bg-mech-navy text-blueprint-white" aria-label="SURE Mechanical's company history and related companies">
      <div className="relative mx-auto max-w-[1200px] px-5 pt-20 pb-10 sm:px-8 lg:pt-28">
        <p className="eyebrow">THE SURE MECHANICAL FOUNDATION</p>
        <h2 className="section-title mt-4 max-w-4xl">BUILT BY SURE MECHANICAL.<br /><span className="text-cool-teal">CONNECTED THROUGH SURE GROUP.</span></h2>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-galv-silver">SURE Mechanical was founded in 2010. In 2025, SURE Mechanical acquired Cincinnati Air Conditioning Co. The SURE Group family developed to connect complementary capabilities, including Thermolinear’s controlled environments expertise.</p>
      </div>

      {/* Desktop engineering-plan narrative. Native sticky positioning keeps
          nodes centered while the ducts draw as the user scrolls. */}
      <div ref={track} className="story-track relative h-[380vh]">
        <div className="story-stage sticky top-20 h-[calc(100svh-8rem)] overflow-hidden">
          <div className="blueprint-grid absolute inset-0 opacity-25" aria-hidden="true" />
          <div className="relative mx-auto h-full w-full max-w-[1200px]">
            <svg viewBox="0 0 1200 820" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
              <defs><filter id="storyGlow" filterUnits="userSpaceOnUse" x="-20" y="-20" width="1240" height="860"><feGaussianBlur stdDeviation="2" result="glow" /><feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
              {PATHS.map(path => <path key={path.id} data-duct={path.id} className="story-duct" d={path.d} fill="none" stroke="#11C5D6" strokeWidth="10" strokeLinejoin="miter" opacity=".82" filter="url(#storyGlow)" />)}
              <circle cx="600" cy="352" r="13" fill="#061A2B" stroke="#5BEAF3" strokeWidth="2" />
              <circle cx="600" cy="700" r="12" fill="#061A2B" stroke="#5BEAF3" strokeWidth="2" />
            </svg>

            <div className="story-founder absolute left-1/2 top-[45%] z-10 w-[230px] -translate-x-1/2 text-center">
              <Mark src={FOUNDATION.logo} alt="SURE Mechanical" />
              <div className="story-2010 absolute -left-32 top-2 w-24 opacity-0"><span className="text-4xl font-black text-cool-teal">2010</span><p className="text-[10px] font-bold uppercase tracking-widest text-galv-silver">Founded</p></div>
              <p className="mt-1 text-[10px] font-black tracking-[.2em] text-cool-teal">THE ORIGINAL COMPANY</p>
            </div>

            <div className="story-group absolute left-1/2 top-[26%] z-10 w-[350px] -translate-x-1/2 rounded-xl border border-cool-teal/30 bg-[#061A2B]/95 px-5 py-3 text-center opacity-0 shadow-[0_0_25px_rgba(17,197,214,.12)]">
              <div className="flex items-center justify-center gap-3">
                <div className="w-[120px]"><Mark src={FOUNDATION.logo} alt="SURE Mechanical" /></div>
                <span className="text-2xl text-cool-teal">+</span>
                <div className="w-[130px]"><Mark src="/brand/SURE_Group_horizontal.webp" alt="SURE Group" /></div>
              </div>
              <p className="mt-1 text-[11px] font-semibold leading-snug text-galv-silver">SURE Mechanical formed the SURE Group family following the 2025 acquisition.</p>
              <div className="story-2025 absolute -right-32 top-3 w-24 opacity-0"><span className="text-4xl font-black text-cool-teal">2025</span><p className="text-[10px] font-bold uppercase tracking-widest text-galv-silver">Expansion</p></div>
            </div>

            {RELATED.map((company, i) => (
              <div key={company.name} className={`story-acquired absolute top-[59%] z-10 flex w-[270px] flex-col items-center text-center opacity-0 ${i === 0 ? 'left-[19.6%]' : 'left-[80.4%]'} -translate-x-1/2`}>
                <a href={company.href} target="_blank" rel="noopener noreferrer" className="flex h-[65px] w-[185px] items-center justify-center rounded-md bg-[#061A2B]/90 p-2 hover:ring-1 hover:ring-cool-teal">
                  <Mark src={company.logo} alt={`${company.name} logo`} className={i === 0 ? "max-h-[65px] max-w-[65px]" : "max-h-[65px]"} />
                </a>
                <p className="mt-2 text-sm font-black leading-tight">{company.name}</p>
                <p className="text-[9px] font-bold tracking-[.12em] text-cool-teal">{company.role}</p>
                <p className="story-description mt-2 rounded-md bg-[#061A2B]/90 px-4 py-2 text-[11px] leading-snug text-galv-silver opacity-0">{company.description}</p>
              </div>
            ))}

            <div className="story-unit absolute left-1/2 top-[79%] z-20 w-[280px] -translate-x-1/2 opacity-0"><UnitSequence /></div>
            <div className="story-conclusion absolute bottom-[3%] left-1/2 -translate-x-1/2 z-30 w-[600px] max-w-[90%] text-center rounded-lg border border-cool-teal/25 bg-[#020B13]/95 p-5 opacity-0 shadow-xl">
              <p className="text-[10px] font-black uppercase tracking-[.2em] text-cool-teal">Together, deeper expertise</p>
              <p className="mt-2 text-lg font-bold leading-snug">Together the two companies have deep experience in Design Build, Plan &amp; Spec, Engineering Systems, and Controlled Rooms.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Readable, linear mobile / reduced-motion narrative. */}
      <div className="story-linear relative mx-auto max-w-3xl px-6 pb-20">
        <div className="mx-auto w-[220px]"><Mark src={FOUNDATION.logo} alt="SURE Mechanical" /></div>
        <p className="mt-3 text-center text-3xl font-black text-cool-teal">2010</p>
        <p className="text-center text-sm text-galv-silver">SURE Mechanical founded</p>
        <div className="mx-auto my-5 h-16 w-1 rounded-full bg-cool-teal/75" aria-hidden="true" />
        <div className="rounded-lg border border-cool-teal/25 bg-steel-blue/50 p-6 text-center"><div className="flex items-center justify-center gap-4"><div className="w-[130px]"><Mark src={FOUNDATION.logo} alt="SURE Mechanical" /></div><span aria-hidden="true" className="text-cool-teal">+</span><div className="w-[150px]"><Mark src="/brand/SURE_Group_horizontal.webp" alt="SURE Group" /></div></div><p className="mt-2 text-2xl font-black text-cool-teal">2025</p><p className="text-sm text-galv-silver">SURE Mechanical acquired Cincinnati Air Conditioning Co. The SURE Group family developed with Thermolinear as a related company.</p></div>
        <div className="mx-auto my-5 h-14 w-1 rounded-full bg-cool-teal/75" aria-hidden="true" />
        <div className="grid gap-5 sm:grid-cols-2">{RELATED.map(company => <div key={company.name} className="rounded-lg border border-seam-line p-5 text-center"><a href={company.href} target="_blank" rel="noopener noreferrer" className={`mx-auto flex h-[80px] items-center justify-center ${company.name.startsWith('Cincinnati') ? 'w-[80px]' : 'w-[170px]'}`}><Mark src={company.logo} alt={`${company.name} logo`} /></a><p className="mt-3 font-bold">{company.name}</p><p className="mt-2 text-xs leading-relaxed text-galv-silver">{company.description}</p></div>)}</div>
        <div className="mx-auto my-5 h-16 w-1 rounded-full bg-cool-teal/75" aria-hidden="true" />
        <div className="mx-auto w-[300px] max-w-full"><Image src={assetPath('/models/rtu-isometric.webp')} alt="Holographic rooftop HVAC unit" width={800} height={530} /></div>
        <p className="mx-auto mt-4 max-w-lg text-center text-xl font-bold">Together the two companies have deep experience in Design Build, Plan &amp; Spec, Engineering Systems, and Controlled Rooms.</p>
      </div>
    </section>
  );
}
