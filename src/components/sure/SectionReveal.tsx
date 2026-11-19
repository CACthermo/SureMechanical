'use client';
import { useRef, type ReactNode } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
export default function SectionReveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.utils.toArray<HTMLElement>('[data-scene]', ref.current).forEach(scene => {
        gsap.fromTo(scene.querySelector('.photo-chapter-image'), { scale: 1.06 }, {
          scale: 1,
          ease: 'none',
          scrollTrigger: { trigger: scene, start: 'top bottom', end: 'center center', scrub: .45 },
        });
      });
      gsap.utils.toArray<HTMLElement>('[data-scroll-copy]', ref.current).forEach(copy => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: copy, start: 'top 88%', end: 'bottom 12%', scrub: .25 },
          defaults: { ease: 'none' },
        });
        // Reserve room for the text so expanding it never moves other scroll targets.
        tl.fromTo(copy, { clipPath: 'inset(0 0 100% 0)', opacity: 0 }, {
          clipPath: 'inset(0 0 0% 0)', opacity: 1, duration: .23,
        }).to(copy, { clipPath: 'inset(100% 0 0 0)', opacity: 0, duration: .2 }, .8);
      });
      gsap.utils.toArray<HTMLElement>('[data-reveal]', ref.current).forEach(element => {
        gsap.from(element, { y: 28, opacity: 0, duration: .8, ease: 'power2.out', scrollTrigger: { trigger: element, start: 'top 92%', once: true } });
      });
    }, ref);
    return () => media.revert();
  }, { scope: ref });
  return <div ref={ref}>{children}</div>;
}
