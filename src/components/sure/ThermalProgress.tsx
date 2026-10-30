'use client';
import { useEffect, useRef } from 'react';
export default function ThermalProgress() {
  const fill = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let frame = 0;
    const update = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(() => {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      if (fill.current) fill.current.style.transform = `scaleX(${height > 0 ? Math.min(1, Math.max(0, window.scrollY / height)) : 0})`;
    }); };
    update(); window.addEventListener('scroll', update, { passive: true }); window.addEventListener('resize', update);
    const observer = new ResizeObserver(update); observer.observe(document.body);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, []);
  return <div aria-hidden="true" className="thermal-progress fixed bottom-0 inset-x-0 z-40 flex items-center gap-3 sm:gap-5 border-t border-seam-line bg-mech-navy/95 px-4 sm:px-8 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] backdrop-blur-md pointer-events-none">
    <span className="text-[10px] sm:text-xs font-mono text-cool-teal">Cooling</span>
    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-duct-mid"><div ref={fill} className="h-full origin-left scale-x-0 rounded-full bg-gradient-to-r from-[#11c5d6] to-[#f59e0b]" /></div>
    <span className="text-[10px] sm:text-xs font-mono text-heat-amber">Heating</span>
  </div>;
}
