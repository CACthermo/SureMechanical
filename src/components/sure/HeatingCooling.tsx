'use client';

import { useRef, useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const AHU_COMPONENTS = [
  { label: 'Outside Air', icon: 'OA', side: 'left' },
  { label: 'Return Air', icon: 'RA', side: 'left' },
  { label: 'Filtration', icon: 'F', side: 'left' },
  { label: 'Heating Coil', icon: 'HC', side: 'center-warm' },
  { label: 'Cooling Coil', icon: 'CC', side: 'center-cool' },
  { label: 'Supply Fan', icon: 'SF', side: 'right' },
  { label: 'Supply Duct', icon: 'SD', side: 'right' },
  { label: 'Return Duct', icon: 'RD', side: 'right' },
];

export default function HeatingCooling() {
  const sectionRef = useRef<HTMLElement>(null);
  const [thermalBalance, setThermalBalance] = useState(0.5); // 0=full cool, 1=full warm
  const trackRef = useRef<HTMLDivElement>(null);

  // Cursor-based thermal interaction
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      setThermalBalance(Math.max(0, Math.min(1, x)));
    };
    const el = sectionRef.current;
    el?.addEventListener('mousemove', handleMove);
    return () => el?.removeEventListener('mousemove', handleMove);
  }, []);

  // Touch support
  useEffect(() => {
    const handleTouch = (e: TouchEvent) => {
      if (!sectionRef.current || !e.touches[0]) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const x = (e.touches[0].clientX - rect.left) / rect.width;
      setThermalBalance(Math.max(0, Math.min(1, x)));
    };
    const el = sectionRef.current;
    el?.addEventListener('touchmove', handleTouch, { passive: true });
    return () => el?.removeEventListener('touchmove', handleTouch);
  }, []);

  useGSAP(() => {
    gsap.fromTo('.hc-title',
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', toggleActions: 'play none none reverse' }
      }
    );
    gsap.fromTo('.hc-ahu-component',
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.4, stagger: 0.06, ease: 'back.out(1.3)',
        scrollTrigger: { trigger: '.hc-ahu', start: 'top 80%', toggleActions: 'play none none reverse' }
      }
    );
  }, { scope: sectionRef });

  const coolOpacity = Math.max(0, 1 - thermalBalance * 1.5);
  const warmOpacity = Math.max(0, (thermalBalance - 0.33) * 1.5);

  return (
    <section
      id="heating-cooling"
      ref={sectionRef}
      className="relative py-24 lg:py-36 overflow-hidden"
      aria-label="Heating and cooling systems"
    >
      <div className="absolute inset-0 blueprint-grid opacity-30" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cool-teal/15 to-heat-amber/15" />

      {/* Dynamic thermal gradients based on cursor position */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-700"
        style={{
          background: `radial-gradient(ellipse at 30% 50%, rgba(17,197,214,${coolOpacity * 0.08}) 0%, transparent 60%)`,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-700"
        style={{
          background: `radial-gradient(ellipse at 70% 50%, rgba(245,158,11,${warmOpacity * 0.08}) 0%, transparent 60%)`,
        }}
      />

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="hc-title opacity-0 mb-4">
          <span className="tech-label">ENERGY EXCHANGE</span>
        </div>

        <h2 className="hc-title opacity-0 section-title text-blueprint-white max-w-3xl mb-6">
          <span className="hover-red">CONTROL THE</span>{' '}
          <span style={{ color: `rgb(${17 + thermalBalance * 228}, ${197 - thermalBalance * 39}, ${214 - thermalBalance * 203})` }}>
            ENERGY.
          </span>
          <br />
          <span className="hover-red">CONTROL THE ENVIRONMENT.</span>
        </h2>

        <p className="hc-title opacity-0 section-subtitle text-galv-silver/60 max-w-2xl mb-16">
          SURE Mechanical designs and installs heating and cooling systems that maintain precise environmental conditions across every type of commercial facility. Move your cursor to explore the thermal spectrum.
        </p>

        {/* Split thermal visualization */}
        <div className="relative mb-16">
          {/* Cooling side */}
          <div className="absolute inset-0 left-0 w-1/2 pointer-events-none overflow-hidden rounded-sm"
            style={{ opacity: 0.3 + coolOpacity * 0.7 }}>
            <div className="absolute inset-0 bg-gradient-to-r from-cool-teal/10 to-transparent" />
            {/* Cool particles */}
            {[...Array(6)].map((_, i) => (
              <div
                key={`cool-${i}`}
                className="absolute w-1.5 h-1.5 rounded-full bg-cool-teal/40"
                style={{
                  left: `${10 + i * 12}%`,
                  top: `${20 + (i % 3) * 30}%`,
                  animation: `airflow-cool ${2 + i * 0.3}s ease-in-out infinite`,
                  animationDelay: `${i * 0.4}s`,
                }}
              />
            ))}
            <div className="absolute bottom-4 left-4">
              <span className="tech-label" style={{ opacity: coolOpacity }}>COOLING MODE</span>
            </div>
          </div>

          {/* Heating side */}
          <div className="absolute inset-0 right-0 w-1/2 pointer-events-none overflow-hidden rounded-sm"
            style={{ opacity: 0.3 + warmOpacity * 0.7 }}>
            <div className="absolute inset-0 bg-gradient-to-l from-heat-amber/10 to-transparent" />
            {[...Array(6)].map((_, i) => (
              <div
                key={`warm-${i}`}
                className="absolute w-1.5 h-1.5 rounded-full bg-heat-amber/40"
                style={{
                  right: `${10 + i * 12}%`,
                  top: `${25 + (i % 3) * 25}%`,
                  animation: `airflow-warm ${2.2 + i * 0.25}s ease-in-out infinite`,
                  animationDelay: `${i * 0.35}s`,
                }}
              />
            ))}
            <div className="absolute bottom-4 right-4">
              <span className="tech-label-warm" style={{ opacity: warmOpacity }}>HEATING MODE</span>
            </div>
          </div>

          {/* Center AHU diagram */}
          <div className="relative h-[400px] lg:h-[500px] rounded-sm border border-seam-line bg-duct-dark/60 backdrop-blur-sm overflow-hidden">
            <div className="hc-ahu absolute inset-0 flex items-center justify-center">
              <div className="relative w-full max-w-3xl mx-auto px-8">
                {/* AHU box */}
                <div className="relative border border-galv-silver/20 rounded-sm bg-steel-blue/50 p-6 lg:p-10">
                  <div className="text-center text-[10px] font-mono tracking-[0.2em] uppercase text-galv-silver/40 mb-6">AIR HANDLING UNIT — SCHEMATIC</div>
                  <div className="grid grid-cols-4 gap-2 lg:gap-4">
                    {AHU_COMPONENTS.map((comp) => {
                      const isWarm = comp.side === 'center-warm' || comp.side === 'left' && comp.label === 'Heating Coil';
                      const isCool = comp.side === 'center-cool' || comp.label === 'Cooling Coil';
                      return (
                        <div
                          key={comp.label}
                          className="hc-ahu-component opacity-0 flex flex-col items-center gap-2 p-3 rounded-sm border transition-all duration-500 cursor-default hover:border-galv-silver/30"
                          style={{
                            borderColor: isWarm ? 'rgba(245,158,11,0.2)' : isCool ? 'rgba(17,197,214,0.2)' : 'rgba(185,197,204,0.1)',
                            background: isWarm ? 'rgba(245,158,11,0.05)' : isCool ? 'rgba(17,197,214,0.05)' : 'rgba(6,26,43,0.3)',
                          }}
                        >
                          <div
                            className="w-10 h-10 lg:w-12 lg:h-12 rounded-sm flex items-center justify-center text-xs font-mono font-bold border"
                            style={{
                              borderColor: isWarm ? 'rgba(245,158,11,0.3)' : isCool ? 'rgba(17,197,214,0.3)' : 'rgba(185,197,204,0.15)',
                              color: isWarm ? '#F59E0B' : isCool ? '#5BEAF3' : '#B9C5CC',
                              background: isWarm ? 'rgba(245,158,11,0.08)' : isCool ? 'rgba(17,197,214,0.08)' : 'rgba(6,26,43,0.5)',
                            }}
                          >
                            {comp.icon}
                          </div>
                          <span className="text-[9px] lg:text-[10px] font-mono tracking-[0.05em] uppercase text-galv-silver/60 text-center leading-tight">
                            {comp.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Airflow path arrows */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 600 200" aria-hidden="true">
                    <defs>
                      <linearGradient id="coolFlow" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="rgba(17,197,214,0.4)" />
                        <stop offset="100%" stopColor="rgba(91,234,243,0.1)" />
                      </linearGradient>
                      <linearGradient id="warmFlow" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="rgba(245,158,11,0.1)" />
                        <stop offset="100%" stopColor="rgba(255,107,53,0.4)" />
                      </linearGradient>
                    </defs>
                    <line x1="50" y1="100" x2="550" y2="100" stroke="url(#coolFlow)" strokeWidth="1" strokeDasharray="4 4">
                      <animate attributeName="stroke-dashoffset" from="0" to="-16" dur="1s" repeatCount="indefinite" />
                    </line>
                    <line x1="50" y1="110" x2="550" y2="110" stroke="url(#warmFlow)" strokeWidth="1" strokeDasharray="4 4">
                      <animate attributeName="stroke-dashoffset" from="0" to="16" dur="1.2s" repeatCount="indefinite" />
                    </line>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Thermal balance indicator */}
        <div className="flex items-center gap-4">
          <span className="text-xs font-mono text-cool-teal/60 uppercase tracking-wider">Cooling</span>
          <div
            ref={trackRef}
            className="flex-1 h-1 rounded-full bg-duct-dark relative overflow-hidden cursor-crosshair"
          >
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-all duration-300"
              style={{
                width: `${thermalBalance * 100}%`,
                background: 'linear-gradient(to right, #11C5D6, #F59E0B)',
              }}
            />
          </div>
          <span className="text-xs font-mono text-heat-amber/60 uppercase tracking-wider">Heating</span>
        </div>
      </div>
    </section>
  );
}