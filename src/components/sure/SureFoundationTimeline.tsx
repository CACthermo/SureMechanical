'use client';

import { useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { assetPath } from '@/lib/asset-path';

gsap.registerPlugin(ScrollTrigger);

const routes = [
  ['founder', 'M500 177 V285 H365 V355 H500 V445'],
  ['cac', 'M500 177 V288 H320 V340 H235 V445'],
  ['thermolinear', 'M500 177 V310 H680 V370 H765 V445'],
  ['return-left', 'M235 200 V304 H380 V380 H500'],
  ['return-right', 'M765 200 V324 H625 V380 H500'],
  ['terminal', 'M500 380 V445'],
] as const;

function Ducts() {
  return (
    <svg className="foundation-ducts pointer-events-none" viewBox="0 0 1000 800" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="foundation-metal" x2="0" y2="1">
          <stop stopColor="#58f2ff" />
          <stop offset=".52" stopColor="#157b99" />
          <stop offset="1" stopColor="#35ddec" />
        </linearGradient>
      </defs>
      {routes.map(([name, path]) => (
        <g key={name} data-route={name} fill="none" strokeLinejoin="miter">
          <path d={path} pathLength="1" stroke="#0a5066" strokeWidth="38" vectorEffect="non-scaling-stroke" />
          <path d={path} pathLength="1" stroke="url(#foundation-metal)" strokeWidth="32" vectorEffect="non-scaling-stroke" />
          <path d={path} pathLength="1" stroke="#072d43" strokeWidth="27" vectorEffect="non-scaling-stroke" />
          <path d={path} pathLength="1" stroke="#23bed8" strokeOpacity=".55" strokeWidth="21" vectorEffect="non-scaling-stroke" />
          <path d={path} stroke="#92f6ff" strokeOpacity=".75" strokeWidth="2" strokeDasharray="5 9" vectorEffect="non-scaling-stroke" className="duct-flow" />
        </g>
      ))}
    </svg>
  );
}

function Mark({ src, alt, width }: {src: string; alt: string; width: number}) {
  return <Image src={assetPath(src)} alt={alt} width={width} height={120} className="mx-auto h-auto max-h-24 max-w-full object-contain" />;
}

export default function SureFoundationTimeline() {
  const section = useRef<HTMLElement>(null);

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(min-height: 540px) and (prefers-reduced-motion: no-preference)', () => {
      const root = section.current;
      if (!root) return;
      root.dataset.enhanced = 'true';
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: '.foundation-track', start: 'top 80px', end: 'bottom bottom', scrub: .25 },
      });
      const wipe = { clipPath: 'inset(0 100% 0 0)', autoAlpha: 0, y: 8 };
      gsap.set('.foundation-panel:not(.foundation-founder), .foundation-affiliate, .foundation-iso', { autoAlpha: 0 });
      gsap.set('.foundation-copy, .foundation-year', wipe);
      gsap.set('.foundation-ducts g', { autoAlpha: 0 });
      gsap.set('.foundation-ducts g path:not(.duct-flow)', { strokeDasharray: '1 1', strokeDashoffset: 1 });
      const reveal = (selector: string, at: number) => {
        tl.to(selector, { clipPath: 'inset(0 0% 0 0)', autoAlpha: 1, y: 0, duration: .42 }, at);
      };
      const draw = (routes: string[], at: number, duration = .65) => {
        for (const route of routes) {
          const group = `[data-route="${route}"]`;
          tl.set(group, { autoAlpha: 1 }, at)
            .set(`${group} .duct-flow`, { autoAlpha: 0 }, at)
            .to(`${group} path:not(.duct-flow)`, { strokeDashoffset: 0, duration }, at)
            .to(`${group} .duct-flow`, { autoAlpha: 1, duration: .22 }, at + duration);
        }
      };
      const moveUp = (panel: string, at: number) => {
        tl.to(panel, { top: '24%', scale: .73, duration: .5, ease: 'power2.inOut' }, at);
      };
      tl.from('.foundation-founder .foundation-mark', { autoAlpha: .35, scale: .89, duration: .35 }, 0);
      reveal('.foundation-founder .foundation-year', .12);
      reveal('.foundation-founder .foundation-copy', .48);
      moveUp('.foundation-founder', 1.35);
      draw(['founder'], 1.78);
      tl.fromTo('.foundation-group', { scale: .87 }, { scale: 1, autoAlpha: 1, duration: .35 }, 2.27);
      reveal('.foundation-group .foundation-year', 2.48);
      reveal('.foundation-group .foundation-copy', 2.82);
      tl.to('.foundation-founder, [data-route="founder"]', { autoAlpha: 0, duration: .35 }, 2.72);
      moveUp('.foundation-group', 3.7);
      draw(['cac', 'thermolinear'], 4.12);
      tl.set('.foundation-pair', { autoAlpha: 1 }, 4.66);
      tl.fromTo('.foundation-cac', { y: 14 }, { y: 0, autoAlpha: 1, duration: .3 }, 4.66);
      tl.fromTo('.foundation-thermo', { y: 14 }, { y: 0, autoAlpha: 1, duration: .3 }, 4.86);
      tl.to('.foundation-group, [data-route="cac"], [data-route="thermolinear"]', { autoAlpha: 0, duration: .4 }, 5.02);
      reveal('.foundation-cac .foundation-copy', 5.12);
      reveal('.foundation-thermo .foundation-copy', 5.82);
      tl.to('.foundation-pair .foundation-copy', { ...wipe, duration: .27 }, 6.71)
        .to('.foundation-pair', { top: '24%', duration: .52, ease: 'power2.inOut' }, 6.71);
      draw(['return-left', 'return-right'], 7.13);
      draw(['terminal'], 7.78, .24);
      tl.to('.foundation-finale', { autoAlpha: 1, duration: .29 }, 7.99)
        .to('.foundation-pair, [data-route^="return"]', { autoAlpha: 0, duration: .45 }, 8.25)
        .to('.foundation-iso', { autoAlpha: 1, scale: 1.13, duration: .62, ease: 'power2.out' }, 8.35)
        .to('.foundation-plan', { autoAlpha: 0, duration: .5 }, 8.35)
        .to('[data-route="terminal"]', { autoAlpha: 0, duration: .45 }, 8.35);
      reveal('.foundation-finale .foundation-copy', 8.75);
      tl.to('.foundation-finale strong', { color: '#75effa', duration: .55 }, 9.08)
        .to({}, { duration: .85 });
      return () => {
        delete root.dataset.enhanced;
        root.querySelectorAll('.foundation-panel, .foundation-mark, .foundation-year, .foundation-copy, .foundation-affiliate, .foundation-unit img, .foundation-finale strong, .foundation-ducts g, .foundation-ducts path')
          .forEach(element => element.removeAttribute('style'));
      };
    }, section);
    return () => media.revert();
  }, { scope: section });

  return (
    <section id="sure-system" ref={section} className="relative bg-mech-navy text-blueprint-white" aria-label="SURE Mechanical company history">
      <div className="foundation-track">
        <div className="foundation-stage">
          <Ducts />
          <article className="foundation-panel foundation-founder foundation-milestone">
            <h2 className="foundation-year">2010</h2>
            <div className="foundation-mark"><Mark src="/brand/SURE_Mechanical_trimmed.png" alt="SURE Mechanical" width={300} /></div>
            <p className="foundation-copy">SURE Mechanical was founded to serve Greater Cincinnati’s commercial mechanical needs.</p>
          </article>
          <article className="foundation-panel foundation-group foundation-milestone">
            <h3 className="foundation-year">2025</h3>
            <div className="foundation-mark"><Mark src="/brand/SURE_Group_horizontal.webp" alt="SURE Group" width={325} /></div>
            <p className="foundation-copy">SURE Group developed after SURE Mechanical acquired Cincinnati Air Conditioning Co., bringing complementary mechanical capabilities together.</p>
          </article>
          <div className="foundation-panel foundation-pair">
            <article className="foundation-affiliate foundation-cac">
              <a className="foundation-mark" href="https://cincinnatiair.com/"><Mark src="/brand/CAC_Logo_2026.png" alt="Cincinnati Air Conditioning Co." width={72} /></a>
              <h3>Cincinnati Air Conditioning Co.</h3>
              <p className="foundation-copy">Founded in 1938, CAC brings design-build, engineered systems and building controls experience.</p>
            </article>
            <article className="foundation-affiliate foundation-thermo">
              <a className="foundation-mark" href="https://thermolinearusa.com/"><Mark src="/brand/Thermolinear_logo.svg" alt="Thermolinear" width={164} /></a>
              <h3>Thermolinear</h3>
              <p className="foundation-copy">Part of Cincinnati Air Conditioning Co., Thermolinear specializes in controlled rooms for research and industry.</p>
            </article>
          </div>
          <article className="foundation-panel foundation-finale">
            <div className="foundation-unit" role="img" aria-label="Cyan rooftop HVAC model">
              <Image className="foundation-plan" src={assetPath('/models/rtu-topdown.webp')} alt="" fill sizes="(max-width: 640px) 80vw, 400px" />
              <Image className="foundation-iso" src={assetPath('/models/rtu-isometric.webp')} alt="" fill sizes="(max-width: 640px) 80vw, 400px" />
            </div>
            <p className="foundation-copy">Together, these companies bring deep experience in <strong>Design Build, Plan &amp; Spec, Engineering Systems, and Controlled Rooms.</strong></p>
          </article>
        </div>
      </div>
    </section>
  );
}
