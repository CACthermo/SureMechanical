'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { assetPath } from '@/lib/asset-path';

const CREDIBILITY = [
  { value: '2010', label: 'SURE Founded' },
  { value: '1938', label: 'CAC Established' },
  { value: 'Certified', label: 'Minority-Owned' },
  { value: 'Tri-State', label: 'Mechanical Expertise' },
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  origVx: number;
  origVy: number;
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const [heroReady, setHeroReady] = useState(false);

  // Canvas particles with cursor vortex
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce), (max-width: 767px)').matches) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * Math.min(window.devicePixelRatio, 2);
      canvas.height = canvas.offsetHeight * Math.min(window.devicePixelRatio, 2);
      ctx.setTransform(Math.min(window.devicePixelRatio, 2), 0, 0, Math.min(window.devicePixelRatio, 2), 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const w = () => canvas.offsetWidth;
    const h = () => canvas.offsetHeight;

    particlesRef.current = Array.from({ length: 55 }, () => ({
      x: Math.random() * w(),
      y: Math.random() * h(),
      vx: 0.3 + Math.random() * 0.7,
      vy: (Math.random() - 0.5) * 0.3,
      size: 1 + Math.random() * 2,
      alpha: 0.2 + Math.random() * 0.5,
      color: Math.random() > 0.3 ? '#11C5D6' : '#5BEAF3',
      origVx: 0.3 + Math.random() * 0.7,
      origVy: (Math.random() - 0.5) * 0.3,
    }));

    const VORTEX_RADIUS = 120;
    const VORTEX_STRENGTH = 3.5;

    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    canvas.addEventListener('mousemove', handleMouse);

    const animate = () => {
      ctx.clearRect(0, 0, w(), h());
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      particlesRef.current.forEach((p) => {
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < VORTEX_RADIUS && dist > 1) {
          // Vortex: tangential force + slight inward pull
          const angle = Math.atan2(dy, dx);
          const factor = 1 - dist / VORTEX_RADIUS;
          const tangentX = -Math.sin(angle) * VORTEX_STRENGTH * factor;
          const tangentY = Math.cos(angle) * VORTEX_STRENGTH * factor;
          // Slight inward pull
          const pullX = -dx / dist * 0.8 * factor;
          const pullY = -dy / dist * 0.8 * factor;

          p.vx += (tangentX + pullX) * 0.15;
          p.vy += (tangentY + pullY) * 0.15;
        }

        // Damping back to original velocity
        p.vx += (p.origVx - p.vx) * 0.03;
        p.vy += (p.origVy - p.vy) * 0.03;

        // Clamp speed
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 5) {
          p.vx = (p.vx / speed) * 5;
          p.vy = (p.vy / speed) * 5;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Wrap around
        if (p.x > w() + 10) { p.x = -10; p.y = Math.random() * h(); }
        if (p.x < -10) { p.x = w() + 10; }
        if (p.y > h() + 10) { p.y = -10; }
        if (p.y < -10) { p.y = h() + 10; }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();

        // Glow trail
        ctx.beginPath();
        ctx.arc(p.x - p.vx * 3, p.y - p.vy * 3, p.size * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha * 0.12;
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      animRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouse);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set('.hero-content, .hero-duct-form, .hero-image-card, .hero-cred-item', { opacity: 1 });
      return;
    }
    const tl = gsap.timeline();
    tl.fromTo('.hero-blueprint-line',
      { scaleX: 0, transformOrigin: 'left center' },
      { scaleX: 1, duration: 1.8, ease: 'power2.inOut' }
    );
    tl.fromTo('.hero-duct-form',
      { opacity: 0, y: 20, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power2.out' },
      '-=0.6'
    );
    tl.fromTo('.hero-content',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      '-=0.2'
    );
    tl.fromTo('.hero-image-card',
      { opacity: 0, x: 40, scale: 0.96 },
      { opacity: 1, x: 0, scale: 1, duration: 0.7, ease: 'power3.out' },
      '-=0.3'
    );
    tl.fromTo('.hero-cred-item',
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' },
      '-=0.2'
    );
    tl.eventCallback('onComplete', () => setHeroReady(true));
  }, { scope: sectionRef });

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen flex items-center overflow-hidden"
      aria-label="Hero"
    >
      {/* Blueprint grid background */}
      <div className="absolute inset-0 blueprint-grid" />

      {/* Ambient gradients */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cool-teal/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-heat-amber/3 rounded-full blur-[100px] pointer-events-none" />

      {/* Canvas particles (with vortex) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: heroReady ? 1 : 0, transition: 'opacity 1s ease', zIndex: 2 }}
      />

      {/* Blueprint center line */}
      <div className="hero-blueprint-line absolute top-1/2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cool-teal/20 to-transparent" style={{ zIndex: 1 }} />

      {/* Main content */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full pt-24 pb-16 lg:pt-28 lg:pb-12">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center min-h-[80vh]">
          {/* Left — Text content */}
          <div className="hero-content flex flex-col gap-5 lg:gap-7 opacity-0">
            {/* Subtitle tag */}
            <div className="text-xs font-mono tracking-[0.15em] uppercase text-cool-teal/70">
              — SURE GROUP &bull; COMMERCIAL MECHANICAL SYSTEMS
            </div>

            {/* Main headline — matching reference */}
            <h1 className="hero-headline text-blueprint-white">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cool-teal via-bright-cyan to-cool-teal">
                MECHANICAL
              </span>
              <br />
              EXCELLENCE FOR
              <br />
              <span className="hover-red">
                CRITICAL FACILITIES.
              </span>
            </h1>

            {/* Supporting statement */}
            <p className="section-subtitle text-galv-silver/70 max-w-xl">
              SURE Group delivers high-performance HVAC and mechanical solutions for the most demanding environments.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 mt-1">
              <a href="#engineering"
                className="shine-sweep px-7 py-3.5 bg-cool-teal text-mech-navy font-semibold text-sm tracking-wide uppercase hover:bg-bright-cyan transition-colors duration-300 rounded-sm cursor-pointer"
              >
                Explore Our Capabilities
              </a>
              <a href="#projects"
                className="shine-sweep px-7 py-3.5 border border-galv-silver/20 text-blueprint-white text-sm tracking-wide uppercase hover:border-cool-teal/40 hover:text-bright-cyan transition-all duration-300 rounded-sm cursor-pointer"
              >
                View Featured Projects
              </a>
            </div>
          </div>

          {/* Right — Image composition with Design*Build*Service card + Duct visualizer */}
          <div className="hero-duct-form opacity-0 relative block mt-5 lg:mt-0">
            <div className="relative w-full max-w-[560px] ml-auto">
              {/* Main project image with dark border (matching reference) */}
              <div className="hero-image-card opacity-0 relative rounded-sm border-2 border-galv-silver/15 overflow-hidden">
                <div className="w-full aspect-[4/3] relative brand-plate flex items-center justify-center">
                  <Image src={assetPath('/brand/SURE_MECHANICAL_alpha.png')} alt="SURE Mechanical" width={420} height={210} className="relative w-3/5 max-h-40 object-contain" />
                </div>
                {/* Dark gradient overlay for readability */}


                {/* Design * Build * Service card — overlaid top-left */}
                <div className="absolute top-4 left-4">
                  <div className="px-4 py-2.5 bg-mech-navy/85 backdrop-blur-sm border border-galv-silver/20 rounded-sm">
                    <span className="text-xs font-semibold tracking-[0.15em] uppercase text-blueprint-white">
                      DESIGN &bull; BUILD &bull; SERVICE
                    </span>
                  </div>
                </div>

                {/* Small info card bottom-left — matching reference */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex gap-3 items-start">
                    <div className="w-0.5 h-10 bg-cool-teal/60 rounded-full flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-mono tracking-[0.08em] uppercase text-[#B9C5CC] mb-0.5">Commercial Mechanical Systems</div>
                      <div className="text-sm text-[#F4F8FA]">Engineered, Coordinated &amp; Installed</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Duct Supply Visualizer — positioned below/overlapping the image card */}
              <div className="hero-air-panel relative -mt-8 sm:-mt-16 ml-4 sm:ml-8 z-10">
                <div className="relative bg-mech-navy/90 backdrop-blur-sm border border-seam-line rounded-sm p-4" style={{ maxWidth: '320px' }}>
                  <div className="text-[9px] font-mono tracking-[0.12em] uppercase text-galv-silver/30 mb-3">SUPPLY AIR VISUALIZER</div>
                  <svg
                    viewBox="0 0 300 140"
                    className="w-full"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    {/* Main duct */}
                    <rect x="20" y="40" width="260" height="60" rx="2"
                      fill="url(#heroDuctGrad)" stroke="rgba(185,197,204,0.25)" strokeWidth="1" />
                    {/* Flanges */}
                    <rect x="18" y="36" width="6" height="68" rx="1" fill="rgba(185,197,204,0.12)" stroke="rgba(185,197,204,0.2)" strokeWidth="0.5" />
                    <rect x="276" y="36" width="6" height="68" rx="1" fill="rgba(185,197,204,0.12)" stroke="rgba(185,197,204,0.2)" strokeWidth="0.5" />
                    {/* Seam */}
                    <line x1="20" y1="70" x2="280" y2="70" stroke="rgba(185,197,204,0.06)" strokeWidth="0.5" strokeDasharray="6 8" />
                    {/* Branch takeoff up */}
                    <rect x="120" y="5" width="50" height="35" rx="1.5" fill="url(#heroDuctGrad)" stroke="rgba(185,197,204,0.2)" strokeWidth="0.8" />
                    {/* Access panel */}
                    <rect x="230" y="50" width="35" height="40" rx="1" fill="rgba(2,11,19,0.7)" stroke="rgba(91,234,243,0.12)" strokeWidth="0.4" strokeDasharray="2 2" />
                    <text x="247" y="73" textAnchor="middle" fill="rgba(91,234,243,0.2)" fontSize="5" fontFamily="monospace">ACCESS</text>
                    {/* Rivets */}
                    {[[28,44],[28,96],[276,44],[276,96],[124,8],[166,8]].map(([cx,cy],i) => (
                      <circle key={i} cx={cx} cy={cy} r="1.5" fill="rgba(185,197,204,0.25)" />
                    ))}
                    {/* Airflow */}
                    <circle r="2" fill="#11C5D6" opacity="0.5">
                      <animateMotion dur="3s" repeatCount="indefinite" path="M20,70 L280,70" />
                      <animate attributeName="opacity" values="0;0.6;0.6;0" dur="3s" repeatCount="indefinite" />
                    </circle>
                    <circle r="1.5" fill="#5BEAF3" opacity="0.4">
                      <animateMotion dur="2.6s" repeatCount="indefinite" path="M20,60 L280,60" begin="0.4s" />
                      <animate attributeName="opacity" values="0;0.4;0.4;0" dur="2.6s" repeatCount="indefinite" begin="0.4s" />
                    </circle>
                    <circle r="1.5" fill="#11C5D6" opacity="0.4">
                      <animateMotion dur="2.8s" repeatCount="indefinite" path="M145,40 L145,5" begin="0.2s" />
                      <animate attributeName="opacity" values="0;0.4;0.4;0" dur="2.8s" repeatCount="indefinite" begin="0.2s" />
                    </circle>
                    {/* Label */}
                    <text x="150" y="64" textAnchor="middle" fill="rgba(91,234,243,0.35)" fontSize="7" fontFamily="monospace">SUPPLY AIR</text>
                    <text x="150" y="80" textAnchor="middle" fill="rgba(91,234,243,0.2)" fontSize="6" fontFamily="monospace">SCHEMATIC AIRFLOW</text>

                    <defs>
                      <linearGradient id="heroDuctGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(185,197,204,0.06)" />
                        <stop offset="50%" stopColor="rgba(185,197,204,0.02)" />
                        <stop offset="100%" stopColor="rgba(185,197,204,0.05)" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Credibility row */}
        <div className="mt-12 lg:mt-16 pt-8 border-t border-seam-line">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
            {CREDIBILITY.map((item) => (
              <div key={item.label} className="hero-cred-item opacity-0">
                <div className="text-xl lg:text-2xl font-semibold text-bright-cyan tracking-tight">{item.value}</div>
                <div className="text-xs font-mono tracking-[0.1em] uppercase text-galv-silver/50 mt-1">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
