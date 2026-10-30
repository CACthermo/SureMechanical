import Image from 'next/image';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { assetPath } from '@/lib/asset-path';

export default function Hero() {
  return (
    <section id="hero" aria-labelledby="hero-title" className="relative overflow-hidden pb-16 pt-28 sm:pt-36 lg:pb-24 lg:pt-44">
      <div className="mx-auto grid max-w-[1280px] items-center gap-10 px-5 sm:px-8 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
        <div>
          <p className="eyebrow">SURE Mechanical · Cincinnati, Ohio</p>
          <h1 id="hero-title" className="mt-5 max-w-3xl text-[clamp(2.5rem,3.8vw,4rem)] font-semibold leading-[1.08] tracking-[-0.035em] text-blueprint-white">Commercial heating,<br className="hidden sm:block" /> cooling <span className="text-cool-teal">&amp; mechanical services.</span></h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-galv-silver">Mechanical design, ductwork, piping and installation for commercial and institutional buildings across Southern Ohio and Northern Kentucky.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="mailto:bidinvites@suremechanical.com?subject=Project%20Bid%20Invitation" className="inline-flex min-h-12 items-center justify-center gap-3 rounded-md bg-cool-teal px-6 py-3 text-sm font-semibold text-mech-navy">Start a Project <ArrowUpRight size={18} aria-hidden="true" /></a>
            <a href="#projects" className="inline-flex min-h-12 items-center justify-center gap-3 rounded-md border border-seam-line px-6 py-3 text-sm font-medium text-blueprint-white hover:border-cool-teal">View Our Work <ArrowDownRight size={18} aria-hidden="true" /></a>
          </div>
          <p className="mt-8 text-sm text-galv-silver">Cincinnati-based. Minority-owned. Established in 2010.</p>
        </div>
        <div className="relative flex aspect-[5/4] items-center justify-center overflow-hidden rounded-2xl border border-seam-line bg-steel-blue p-8 sm:p-12" aria-label="SURE Mechanical brand">
          <div className="absolute inset-x-0 top-0 h-1 bg-cool-teal" />
          <svg className="absolute inset-0 h-full w-full text-cool-teal/10" viewBox="0 0 500 400" fill="none" aria-hidden="true">
            <path d="M-30 110H150V70H350V110H530 M-30 290H150V330H350V290H530" stroke="currentColor" strokeWidth="25" />
            <path d="M-30 110H150V70H350V110H530 M-30 290H150V330H350V290H530" stroke="currentColor" strokeWidth="1" />
          </svg>
          <div className="relative w-full text-center">
            <Image src={assetPath('/brand/SURE_MECHANICAL_alpha.png')} alt="SURE Mechanical — Experienced, Innovative, Diverse" width={520} height={180} priority className="h-auto w-full object-contain" />
            <p className="mt-7 text-xs uppercase tracking-[0.22em] text-galv-silver">Commercial mechanical contracting</p>
          </div>
        </div>
      </div>
    </section>
  );
}
