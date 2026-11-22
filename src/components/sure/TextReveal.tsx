'use client';

import { Fragment, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function TextReveal({ children }: { children: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo('.type-word', { yPercent: 110, rotation: 2, opacity: 0 }, {
        yPercent: 0, rotation: 0, opacity: 1, duration: .75, stagger: .065, ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 94%', once: true },
      });
    }, ref);
    return () => media.revert();
  }, { scope: ref });
  return <span ref={ref} className="type-reveal">
    <span className="sr-only">{children}</span>
    <span aria-hidden="true">{children.split(' ').map((word, index) => <Fragment key={index}>
      {index > 0 && ' '}<span className="type-word-mask"><span className="type-word">{word}</span></span>
    </Fragment>)}</span>
  </span>;
}
