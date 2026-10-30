'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { assetPath } from '@/lib/asset-path';

gsap.registerPlugin(ScrollTrigger);

/* ─────────────── Duct path data (SVG coordinates) ─────────────── */
const VB_W = 1200;
const VB_H = 420;

/* Shared trunk from SureGroup logo down to the split point */
const TRUNK_PATH = 'M600,0 V65';

/* Three rectangular-duct branches — 90° elbows, no crossings, compact vertical spread */
const BRANCH_PATHS = [
  /* Branch A → SURE Mechanical (left) */
  'M600,65 H360 V150 H260 V240 H200 V310',
  /* Branch B → CAC (center, jogs right then returns) */
  'M600,65 H740 V180 H660 V260 H600 V310',
  /* Branch C → Thermolinear (right) */
  'M600,65 H840 V150 H940 V240 H1000 V310',
];

/* Elbow corner positions (for decorative detail marks) */
const ELBOWS = [
  /* Branch A */
  { x: 600, y: 65 }, { x: 360, y: 65 }, { x: 360, y: 150 }, { x: 260, y: 150 }, { x: 260, y: 240 }, { x: 200, y: 240 },
  /* Branch B */
  { x: 600, y: 65 }, { x: 740, y: 65 }, { x: 740, y: 180 }, { x: 660, y: 180 }, { x: 660, y: 260 }, { x: 600, y: 260 },
  /* Branch C */
  { x: 600, y: 65 }, { x: 840, y: 65 }, { x: 840, y: 150 }, { x: 940, y: 150 }, { x: 940, y: 240 }, { x: 1000, y: 240 },
];

const SUB_COMPANIES = [
  {
    name: 'Sure Mechanical',
    role: 'PRIMARY SYSTEM CONTRACTOR',
    description: 'Complete commercial mechanical systems — from engineering and BIM coordination through fabrication, installation, commissioning and long-term service for the most demanding facilities.',
    logo: assetPath('/brand/SURE_Mechanical_trimmed.png'),
    svgX: 200, svgY: 310,
    pctLeft: 16.67, pctTop: 73.81,
  },
  {
    name: 'Cincinnati Air Conditioning Co.',
    role: 'DESIGN-BUILD, SERVICE & CONTROLS',
    description: 'Legacy HVAC expertise with deep design-build capabilities, comprehensive service programs and advanced building controls integration across the Tri-State region.',
    logo: assetPath('/brand/CAC_Logo_2026.png'),
    svgX: 600, svgY: 310,
    pctLeft: 50, pctTop: 73.81,
  },
  {
    name: 'Thermolinear',
    role: 'PRECISION ENVIRONMENTS',
    description: 'Specialized in the design and construction of environmental rooms, test chambers and precision-controlled spaces for research, manufacturing and critical storage applications.',
    logo: assetPath('/brand/Thermolinear_logo.svg'),
    svgX: 1000, svgY: 310,
    pctLeft: 83.33, pctTop: 73.81,
  },
];

export default function SureSystem() {
  const sectionRef = useRef<HTMLElement>(null);
  const sureGroupRef = useRef<HTMLDivElement>(null);
  const animContainerRef = useRef<HTMLDivElement>(null);
  const trunkPathRef = useRef<SVGPathElement>(null);
  const branchRefs = useRef<(SVGPathElement | null)[]>([]);
  const centerLineTrunkRef = useRef<SVGPathElement>(null);
  const centerLineRefs = useRef<(SVGPathElement | null)[]>([]);

  useGSAP(() => {
    const trunk = trunkPathRef.current;
    const branches = branchRefs.current.filter(Boolean) as SVGPathElement[];
    const centerLines = centerLineRefs.current.filter(Boolean) as SVGPathElement[];
    const centerTrunk = centerLineTrunkRef.current;

    const staticView = window.matchMedia('(max-width: 767px), (prefers-reduced-motion: reduce)').matches;
    if (staticView) {
      gsap.set('.ss-title, .ss-white-card, .sub-logo-reveal, .sub-name-reveal, .duct-dim, .conn-dot, .splitter-node', { opacity: 1 });
      gsap.set(sureGroupRef.current, { opacity: 1 });
      return;
    }

    /* Calculate path lengths & set initial dash state */
    const allDuctPaths = [trunk, ...branches].filter(Boolean) as SVGPathElement[];
    allDuctPaths.forEach((p) => {
      const len = p.getTotalLength();
      p.style.strokeDasharray = `${len}`;
      p.style.strokeDashoffset = `${len}`;
    });

    /* ── Title fade-in (plays once on scroll) ── */
    gsap.fromTo('.ss-title',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', toggleActions: 'play none none reverse' }
      }
    );

    /* ── White cards fade-in ── */
    gsap.fromTo('.ss-white-card',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.12, ease: 'power2.out',
        scrollTrigger: { trigger: '.ss-white-cards', start: 'top 88%', toggleActions: 'play none none reverse' }
      }
    );

    /* ── Pinned scroll-driven timeline — everything stays fixed while scrolling ── */
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: animContainerRef.current,
        start: 'top 55%',
        end: '+=90%',
        scrub: 0.5,
        pin: window.innerWidth >= 768,
        pinSpacing: true,
      },
    });

    /* Phase 1 — SureGroup logo reveal */
    tl.fromTo(
      sureGroupRef.current,
      { opacity: 0, scale: 0.7 },
      { opacity: 1, scale: 1, duration: 0.08, ease: 'power2.out' },
      0,
    );

    /* Phase 2 — Trunk duct draws */
    tl.to(trunk, { strokeDashoffset: 0, duration: 0.08, ease: 'power1.inOut' }, 0.04);

    /* Phase 3 — Branch ducts draw (staggered) */
    branches.forEach((b, i) => {
      tl.to(b, { strokeDashoffset: 0, duration: 0.28, ease: 'power1.inOut' }, 0.08 + i * 0.08);
    });

    /* Phase 4 — Center lines appear */
    if (centerTrunk) {
      tl.fromTo(centerTrunk, { opacity: 0 }, { opacity: 0.3, duration: 0.04 }, 0.20);
    }
    centerLines.forEach((cl, i) => {
      tl.fromTo(cl, { opacity: 0 }, { opacity: 0.3, duration: 0.04 }, 0.24 + i * 0.03);
    });

    /* Phase 5 — Elbow detail marks */
    tl.fromTo('.duct-elbow', { opacity: 0 }, { opacity: 0.35, stagger: 0.003, duration: 0.08 }, 0.26);

    /* Phase 6 — Dimension labels */
    tl.fromTo('.duct-dim', { opacity: 0 }, { opacity: 1, stagger: 0.02, duration: 0.06 }, 0.32);

    /* Phase 7 — Splitter node */
    tl.fromTo('.splitter-node', { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.07, ease: 'back.out(2)' }, 0.06);

    /* Phase 8 — Connection dots at endpoints */
    tl.fromTo('.conn-dot', { opacity: 0, scale: 0 }, { opacity: 0.9, scale: 1, stagger: 0.03, duration: 0.05, ease: 'back.out(2)' }, 0.40);

    /* Phase 9 — Logo reveal (big, no card borders) */
    tl.fromTo('.sub-logo-reveal', { opacity: 0, y: 16, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, stagger: 0.05, duration: 0.08, ease: 'power2.out' }, 0.46);

    /* Phase 10 — Company names reveal */
    tl.fromTo('.sub-name-reveal', { opacity: 0, y: 8 }, { opacity: 1, y: 0, stagger: 0.04, duration: 0.06, ease: 'power2.out' }, 0.56);

    /* Phase 11 — Data flow dots start */
    tl.fromTo('.flow-dot', { opacity: 0 }, { opacity: 0.7, stagger: 0.03, duration: 0.08 }, 0.66);

  }, { scope: sectionRef });

  return (
    <section
      id="sure-system"
      ref={sectionRef}
      className="relative overflow-hidden"
      aria-label="The SURE System of companies"
    >
      {/* ═══════ COMPACT DARK BANNER — Title only ═══════ */}
      <div className="relative bg-mech-navy pt-14 lg:pt-20 pb-2 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-bright-cyan/15 to-transparent" />

        <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="ss-title opacity-0 mb-2">
            <span className="tech-label">THE SURE SYSTEM</span>
          </div>
          <h2 className="ss-title opacity-0 section-title text-blueprint-white max-w-3xl mb-2">
            <span className="hover-red">SPECIALIZED COMPANIES.</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-bright-cyan via-cool-teal to-bright-cyan">
              ONE MECHANICAL STANDARD.
            </span>
          </h2>
          <p className="ss-title opacity-0 text-galv-silver/50 max-w-xl text-sm leading-relaxed">
            Three specialized companies operating under one unified mechanical standard, delivering coordinated expertise from concept through long-term service.
          </p>
        </div>
      </div>

      {/* ═══════ PINNED ANIMATION CONTAINER (SureGroup + ducts + logos — ALL fixed) ═══════ */}
      <div
        ref={animContainerRef}
        className="relative bg-mech-navy w-full max-w-[1200px] mx-auto pb-28 sm:pb-36 lg:pb-44"
      >
        {/* ── SureGroup Logo — stays pinned at the top ── */}
        <div
          ref={sureGroupRef}
          className="relative z-10 flex flex-col items-center pt-2 pb-0 opacity-0"
        >
          <div className="relative">
            <div className="absolute inset-0 -m-4 rounded-full bg-cool-teal/5 blur-2xl" />
            <img
              src={assetPath('/brand/SureGroup_logo_stacked_color.png')}
              alt="Sure Group — Parent Company"
              className="relative h-14 sm:h-16 lg:h-20 w-auto object-contain drop-shadow-[0_0_30px_rgba(17,197,214,0.15)]"
            />
          </div>
          <span className="mt-1 text-[7px] lg:text-[8px] font-mono tracking-[0.2em] uppercase text-cool-teal/35">
            Parent Company
          </span>
        </div>

        {/* ── SVG Duct Animation ── */}
        <div
          className="relative w-full"
          style={{ aspectRatio: `${VB_W}/${VB_H}` }}
        >
          <svg
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="xMidYMid meet"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            {/* ── Defs ── */}
            <defs>
              <filter id="ductGlow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <filter id="dotGlow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <pattern id="sysGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(91,234,243,0.03)" strokeWidth="0.5" />
              </pattern>
            </defs>

            {/* Background grid */}
            <rect width={VB_W} height={VB_H} fill="url(#sysGrid)" />

            {/* ── DUCT TRUNK ── */}
            <path
              ref={trunkPathRef}
              d={TRUNK_PATH}
              stroke="#11C5D6"
              strokeWidth="18"
              strokeLinecap="square"
              strokeLinejoin="miter"
              filter="url(#ductGlow)"
              opacity="0.5"
            />
            <path
              ref={centerLineTrunkRef}
              d={TRUNK_PATH}
              stroke="#5BEAF3"
              strokeWidth="1"
              strokeDasharray="6 4"
              opacity="0"
            />

            {/* ── BRANCH DUCTS ── */}
            {BRANCH_PATHS.map((d, i) => (
              <g key={`branch-${i}`}>
                <path
                  ref={(el) => { branchRefs.current[i] = el; }}
                  d={d}
                  stroke="#11C5D6"
                  strokeWidth="18"
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                  filter="url(#ductGlow)"
                  opacity="0.5"
                />
                <path
                  ref={(el) => { centerLineRefs.current[i] = el; }}
                  d={d}
                  stroke="#5BEAF3"
                  strokeWidth="1"
                  strokeDasharray="6 4"
                  opacity="0"
                />
              </g>
            ))}

            {/* ── SPLITTER NODE ── */}
            <g className="splitter-node" opacity="0">
              <circle cx="600" cy="65" r="14" fill="#061A2B" stroke="#11C5D6" strokeWidth="1.5" filter="url(#ductGlow)" />
              <circle cx="600" cy="65" r="7" fill="none" stroke="rgba(91,234,243,0.3)" strokeWidth="0.5" strokeDasharray="2 3" />
              <line x1="596" y1="65" x2="604" y2="65" stroke="#5BEAF3" strokeWidth="1" opacity="0.6" />
              <line x1="600" y1="61" x2="600" y2="69" stroke="#5BEAF3" strokeWidth="1" opacity="0.6" />
            </g>

            {/* ── ELBOW DETAIL MARKS ── */}
            {ELBOWS.map((el, i) => (
              <g key={`elbow-${i}`} className="duct-elbow" opacity="0">
                <rect x={el.x - 5} y={el.y - 5} width="10" height="10" fill="none" stroke="rgba(91,234,243,0.3)" strokeWidth="0.75" rx="1" />
                <circle cx={el.x} cy={el.y} r="1.5" fill="rgba(91,234,243,0.4)" />
              </g>
            ))}

            {/* ── DIMENSION LABELS ── */}
            <g className="duct-dim" opacity="0">
              <text x="616" y="38" fill="rgba(91,234,243,0.3)" fontSize="7" fontFamily="monospace" letterSpacing="0.1em">MAIN RD 30x14</text>
            </g>
            <g className="duct-dim" opacity="0">
              <text x="440" y="58" fill="rgba(91,234,243,0.22)" fontSize="6.5" fontFamily="monospace" letterSpacing="0.08em">BR-A 24x12</text>
            </g>
            <g className="duct-dim" opacity="0">
              <text x="770" y="58" fill="rgba(91,234,243,0.22)" fontSize="6.5" fontFamily="monospace" letterSpacing="0.08em">BR-B 20x10</text>
            </g>
            <g className="duct-dim" opacity="0">
              <text x="880" y="58" fill="rgba(91,234,243,0.22)" fontSize="6.5" fontFamily="monospace" letterSpacing="0.08em">BR-C 24x12</text>
            </g>
            <g className="duct-dim" opacity="0">
              <text x="120" y="200" fill="rgba(91,234,243,0.18)" fontSize="6" fontFamily="monospace" letterSpacing="0.06em">OFFSET ELEV.</text>
            </g>
            <g className="duct-dim" opacity="0">
              <text x="1010" y="200" fill="rgba(91,234,243,0.18)" fontSize="6" fontFamily="monospace" letterSpacing="0.06em">OFFSET ELEV.</text>
            </g>

            {/* ── CONNECTION DOTS at branch endpoints ── */}
            {SUB_COMPANIES.map((co) => (
              <g key={`conn-${co.name}`}>
                <circle className="conn-dot" cx={co.svgX} cy={co.svgY} r="5" fill="#11C5D6" opacity="0" filter="url(#dotGlow)" />
                <circle className="conn-dot" cx={co.svgX} cy={co.svgY} r="10" fill="none" stroke="rgba(17,197,214,0.25)" strokeWidth="0.75" opacity="0" />
              </g>
            ))}

            {/* ── ANIMATED DATA FLOW DOTS ── */}
            <circle r="2.5" fill="#5BEAF3" className="flow-dot" opacity="0">
              <animateMotion dur="2.8s" repeatCount="indefinite" path={`${TRUNK_PATH} ${BRANCH_PATHS[0].replace('M600,65 ', '')}`} />
              <animate attributeName="opacity" values="0.3;0.9;0.3" dur="2.8s" repeatCount="indefinite" />
            </circle>
            <circle r="2" fill="#11C5D6" className="flow-dot" opacity="0">
              <animateMotion dur="3s" repeatCount="indefinite" path={`${TRUNK_PATH} ${BRANCH_PATHS[1].replace('M600,65 ', '')}`} begin="0.4s" />
              <animate attributeName="opacity" values="0.2;0.8;0.2" dur="3s" repeatCount="indefinite" begin="0.4s" />
            </circle>
            <circle r="2.5" fill="#5BEAF3" className="flow-dot" opacity="0">
              <animateMotion dur="2.6s" repeatCount="indefinite" path={`${TRUNK_PATH} ${BRANCH_PATHS[2].replace('M600,65 ', '')}`} begin="0.8s" />
              <animate attributeName="opacity" values="0.3;0.9;0.3" dur="2.6s" repeatCount="indefinite" begin="0.8s" />
            </circle>

            {/* ── Ambient particles ── */}
            <circle cx="140" cy="250" r="1" fill="#11C5D6" opacity="0.2">
              <animate attributeName="opacity" values="0.1;0.35;0.1" dur="4s" repeatCount="indefinite" />
            </circle>
            <circle cx="500" cy="380" r="1" fill="#5BEAF3" opacity="0.15">
              <animate attributeName="opacity" values="0.05;0.25;0.05" dur="3.5s" repeatCount="indefinite" begin="0.5s" />
            </circle>
            <circle cx="920" cy="220" r="1" fill="#11C5D6" opacity="0.2">
              <animate attributeName="opacity" values="0.1;0.3;0.1" dur="3s" repeatCount="indefinite" begin="1s" />
            </circle>
            <circle cx="1100" cy="360" r="0.8" fill="#5BEAF3" opacity="0.15">
              <animate attributeName="opacity" values="0.05;0.2;0.05" dur="4.5s" repeatCount="indefinite" begin="0.8s" />
            </circle>
          </svg>

          {/* ═══ ENDPOINT LOGOS — NO cards/borders, just logos floating at duct endpoints ═══ */}
          {SUB_COMPANIES.map((co) => (
            <div
              key={co.name}
              className="sub-logo-reveal absolute opacity-0 flex flex-col items-center text-center pointer-events-none"
              style={{
                left: `${co.pctLeft}%`,
                top: `${co.pctTop + 4}%`,
                translate: '-50% 0',
              }}
            >
              {/* SURE Mechanical — naturally smaller PNG, scale way up */}
              {co.name === 'Sure Mechanical' && (
                <Image
                  src={co.logo}
                  alt={co.name}
                  width={300}
                  height={80}
                  className="w-[90px] sm:w-[180px] lg:w-[230px] h-auto object-contain drop-shadow-[0_0_20px_rgba(17,197,214,0.2)]"
                />
              )}
              {/* CAC — circular mark balanced with the adjacent wordmarks */}
              {co.name === 'Cincinnati Air Conditioning Co.' && (
                <img src={co.logo} alt={co.name} className="h-16 sm:h-24 lg:h-28 w-auto object-contain" />
              )}
              {/* Thermolinear — naturally larger, moderate scale */}
              {co.name === 'Thermolinear' && (
                <img
                  src={co.logo}
                  alt={co.name}
                  className="w-[90px] sm:w-[180px] lg:w-[230px] h-auto object-contain drop-shadow-[0_0_20px_rgba(17,197,214,0.2)]"
                />
              )}

              <div className="sub-name-reveal opacity-0 mt-2">
                <div className="font-bold text-blueprint-white text-[9px] sm:text-xs lg:text-sm leading-tight max-w-[110px] sm:max-w-[230px]">{co.name}</div>
                <div className="font-mono text-[6px] sm:text-[7px] lg:text-[8px] tracking-[0.1em] text-cool-teal/50 uppercase mt-0.5">{co.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* pinSpacing fills the scroll distance automatically */}

      {/* ═══════ DIAGONAL ZIGZAG SEPARATOR ═══════ */}
      <div className="relative z-20 bg-mech-navy" aria-hidden="true">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="block w-full h-[50px] lg:h-[70px]">
          <path d="M0,0 L360,0 L480,120 L1440,120 L1440,0 L960,0 L840,120 L0,120 Z" fill="#020B13" />
        </svg>
      </div>

      {/* ═══════ WHITE AREA — Professional Company Summary ═══════ */}
      <div className="relative bg-white pt-10 lg:pt-16 pb-20 lg:pb-28">
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="ss-white-cards relative z-10 max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Company description cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {SUB_COMPANIES.map((co) => (
              <div
                key={co.name}
                className="ss-white-card opacity-0 flex flex-col items-center text-center p-6 lg:p-8 border border-[#020B13]/[0.06] rounded-sm hover:border-cool-teal/20 transition-colors duration-500"
              >
                <div className="mb-4 h-20 lg:h-24 flex items-center justify-center">
                  {co.name === 'Cincinnati Air Conditioning Co.' ? (
                    <Image src={co.logo} alt={co.name} width={96} height={96} className="h-20 lg:h-24 w-auto object-contain" />
                  ) : co.logo.endsWith('.svg') ? (
                    <img src={co.logo} alt={co.name} className="h-10 lg:h-12 w-auto object-contain" />
                  ) : (
                    <Image src={co.logo} alt={co.name} width={160} height={40} className="w-[180px] lg:w-[200px] max-w-full h-auto object-contain" />
                  )}
                </div>
                <h3 className="font-bold text-[#020B13] text-sm lg:text-base mb-1 leading-tight">{co.name}</h3>
                <div className="font-mono tracking-[0.08em] uppercase text-[8px] lg:text-[9px] text-[#425B69] mb-4">{co.role}</div>
                <div className="w-8 h-px bg-[#020B13]/10 mb-4" />
                <p className="text-[#425B69] text-xs lg:text-sm leading-relaxed max-w-xs">{co.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
