'use client';

import { useId, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { assetPath } from '@/lib/asset-path';

gsap.registerPlugin(ScrollTrigger);

const routes = ['founder', 'cac', 'thermolinear', 'return-left', 'return-right', 'terminal'] as const;
type Route = typeof routes[number];
type Point = { x: number; y: number };

function Ducts({ id }: { id: string }) {
  return (
    <svg className="foundation-ducts pointer-events-none" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-metal`} x2="0" y2="1">
          <stop stopColor="#58f2ff" />
          <stop offset=".52" stopColor="#157b99" />
          <stop offset="1" stopColor="#35ddec" />
        </linearGradient>
        {routes.map(name => (
          <mask key={name} id={`${id}-${name}`} maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%" style={{ maskType: 'luminance' }}>
            <path data-draw={name} fill="none" stroke="white" strokeLinejoin="round" />
          </mask>
        ))}
      </defs>
      {routes.map(name => (
        <g key={name} data-route={name} mask={`url(#${id}-${name})`} fill="none" strokeLinejoin="miter">
          <path stroke="#0a5066" data-width="1" />
          <path stroke={`url(#${id}-metal)`} data-width=".85" />
          <path stroke="#072d43" data-width=".71" />
          <path stroke="#23bed8" strokeOpacity=".55" data-width=".56" />
          <path stroke="#92f6ff" strokeOpacity=".75" strokeWidth="1.5" strokeDasharray="4 10" className="duct-flow" />
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
  const ductId = `foundation-${useId().replace(/:/g, "")}`;

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(min-height: 540px) and (prefers-reduced-motion: no-preference)', () => {
      const root = section.current;
      if (!root) return;
      root.dataset.enhanced = 'true';
      const stage = root.querySelector<HTMLElement>('.foundation-stage')!;
      const svg = root.querySelector<SVGSVGElement>('.foundation-ducts')!;
      const progress = Object.fromEntries(routes.map(name => [name, { value: 0 }])) as Record<Route, { value: number }>;
      const layers = Object.fromEntries(routes.map(name => [name, {
        mask: root.querySelector<SVGPathElement>(`[data-draw="${name}"]`)!,
        paths: [...root.querySelectorAll<SVGPathElement>(`[data-route="${name}"] path`)],
      }])) as Record<Route, { mask: SVGPathElement; paths: SVGPathElement[] }>;
      const anchor = (selector: string, edge: 'top' | 'bottom', bounds: DOMRect): Point => {
        const rect = root.querySelector(selector)!.getBoundingClientRect();
        return { x: rect.left + rect.width / 2 - bounds.left, y: rect[edge] - bounds.top + (edge === 'bottom' ? 5 : -5) };
      };
      // Measure the rendered image edges, including their current scroll transforms.
      // A single mask reveals every metallic layer AND its airflow from the source.
      const renderDucts = () => {
        const bounds = stage.getBoundingClientRect();
        const width = bounds.width;
        svg.setAttribute('viewBox', `0 0 ${width} ${bounds.height}`);
        const f = anchor('.foundation-founder img', 'bottom', bounds);
        const gTop = anchor('.foundation-group img', 'top', bounds);
        const g = anchor('.foundation-group img', 'bottom', bounds);
        const cTop = anchor('.foundation-cac img', 'top', bounds);
        const tTop = anchor('.foundation-thermo img', 'top', bounds);
        // Return ducts leave below the compact affiliate heading, never through copy.
        const c = anchor('.foundation-cac h3', 'bottom', bounds);
        const t = anchor('.foundation-thermo h3', 'bottom', bounds);
        const unit = anchor('.foundation-unit', 'top', bounds);
        // The top-down asset has transparent canvas above its visible inlet.
        unit.y += root.querySelector('.foundation-unit')!.getBoundingClientRect().height * (158 / 530);
        const join = { x: unit.x, y: unit.y - Math.max(28, bounds.height * .055) };
        const elbow = (from: Point, to: Point, sideways: number) => {
          const dy = Math.max(36, to.y - from.y);
          return [from, { x: from.x, y: from.y + dy * .28 },
            { x: sideways, y: from.y + dy * .28 }, { x: sideways, y: from.y + dy * .72 },
            { x: to.x, y: from.y + dy * .72 }, to];
        };
        const paths: Record<Route, Point[]> = {
          founder: elbow(f, gTop, width * .32),
          cac: elbow(g, cTop, cTop.x + width * .075),
          thermolinear: elbow(g, tTop, tTop.x - width * .075),
          'return-left': elbow(c, join, c.x + (join.x - c.x) * .5),
          'return-right': elbow(t, join, t.x + (join.x - t.x) * .5),
          terminal: [join, unit],
        };
        const thickness = gsap.utils.clamp(13, 30, width * .024);
        for (const name of routes) {
          const points = paths[name];
          const d = points.map((point, i) => `${i ? 'L' : 'M'}${point.x.toFixed(2)} ${point.y.toFixed(2)}`).join(' ');
          const length = points.slice(1).reduce((sum, point, i) => sum + Math.hypot(point.x - points[i].x, point.y - points[i].y), 0);
          const { mask, paths: surfaces } = layers[name];
          mask.setAttribute('d', d);
          mask.setAttribute('stroke-width', String(thickness + 4));
          mask.setAttribute('stroke-dasharray', `${length} ${length}`);
          mask.setAttribute('stroke-dashoffset', String(length * (1 - progress[name].value)));
          for (const surface of surfaces) {
            surface.setAttribute('d', d);
            if (surface.dataset.width) surface.setAttribute('stroke-width', String(thickness * Number(surface.dataset.width)));
          }
        }
      };
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        onUpdate: renderDucts,
        scrollTrigger: { trigger: '.foundation-track', start: () => `top ${getComputedStyle(stage).top}`, end: 'bottom bottom', scrub: .35, invalidateOnRefresh: true, onRefresh: renderDucts },
      });
      const wipe = { clipPath: 'inset(0 100% 0 0)', autoAlpha: 0, y: 8 };
      gsap.set('.foundation-panel:not(.foundation-founder), .foundation-affiliate, .foundation-iso', { autoAlpha: 0 });
      gsap.set('.foundation-group, .foundation-pair, .foundation-finale', { top: '64%' });
      gsap.set('.foundation-copy, .foundation-year', wipe);
      gsap.set('.foundation-ducts g', { autoAlpha: 0 });
      const reveal = (selector: string, at: number) => {
        tl.to(selector, { clipPath: 'inset(0 0% 0 0)', autoAlpha: 1, y: 0, duration: .42 }, at);
      };
      const draw = (names: Route[], at: number, duration = .85) => {
        names.forEach(name => {
          tl.set(`[data-route="${name}"]`, { autoAlpha: 1 }, at)
            .to(progress[name], { value: 1, duration }, at);
        });
      };
      const moveUp = (panel: string, at: number, scale = .78) => {
        tl.to(panel, { top: '20%', scale, duration: .65, ease: 'power2.inOut' }, at);
      };
      const center = (panel: string, at: number) => {
        tl.to(panel, { top: '50%', duration: .55, ease: 'power2.inOut' }, at);
      };
      tl.from('.foundation-founder .foundation-mark', { autoAlpha: .35, scale: .94, duration: .35 }, 0);
      reveal('.foundation-founder .foundation-year', .12);
      reveal('.foundation-founder .foundation-copy', .55);
      moveUp('.foundation-founder', 1.8);
      draw(['founder'], 2.45);
      tl.to('.foundation-group', { autoAlpha: 1, duration: .22 }, 3.3);
      tl.to('.foundation-founder, [data-route="founder"]', { autoAlpha: 0, duration: .28 }, 3.65);
      center('.foundation-group', 3.93);
      reveal('.foundation-group .foundation-year', 4.15);
      reveal('.foundation-group .foundation-copy', 4.55);
      moveUp('.foundation-group', 5.9);
      draw(['cac'], 6.55);
      draw(['thermolinear'], 6.73);
      tl.set('.foundation-pair', { autoAlpha: 1 }, 7.4);
      tl.to('.foundation-cac', { autoAlpha: 1, duration: .22 }, 7.4);
      tl.to('.foundation-thermo', { autoAlpha: 1, duration: .22 }, 7.58);
      tl.to('.foundation-group, [data-route="cac"], [data-route="thermolinear"]', { autoAlpha: 0, duration: .28 }, 7.95);
      center('.foundation-pair', 8.23);
      reveal('.foundation-cac .foundation-copy', 8.8);
      reveal('.foundation-thermo .foundation-copy', 9.65);
      tl.to('.foundation-pair .foundation-copy', { ...wipe, duration: .3 }, 11.1);
      moveUp('.foundation-pair', 11.4, 1);
      draw(['return-left', 'return-right'], 12.05);
      draw(['terminal'], 12.9, .3);
      tl.to('.foundation-finale', { autoAlpha: 1, duration: .25 }, 13.2);
      tl.to('.foundation-pair, [data-route^="return"], [data-route="terminal"]', { autoAlpha: 0, duration: .35 }, 13.65);
      center('.foundation-finale', 14);
      tl.to('.foundation-iso', { autoAlpha: 1, scale: 1.08, duration: .65, ease: 'power2.out' }, 14.25)
        .to('.foundation-plan', { autoAlpha: 0, duration: .65 }, 14.25);
      reveal('.foundation-finale .foundation-copy', 14.95);
      tl.to('.foundation-finale strong', { color: '#75effa', duration: .55 }, 15.2)
        .to({}, { duration: 1 });
      renderDucts();
      const observer = new ResizeObserver(() => { renderDucts(); ScrollTrigger.refresh(); });
      observer.observe(stage);

      return () => {
        observer.disconnect();
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
          <Ducts id={ductId} />
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
