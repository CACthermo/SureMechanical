import { ArrowUpRight } from 'lucide-react';

export default function SafetyWorkforce() {
  return (
    <section id="safety" aria-labelledby="people-title" className="border-y border-seam-line bg-steel-blue/40 py-16 lg:py-20">
      <div className="mx-auto grid max-w-[1280px] gap-8 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
        <div><p className="eyebrow">People &amp; safety</p><h2 id="people-title" className="section-title mt-3 text-blueprint-white">Skilled people.<br />A commitment to safety.</h2></div>
        <div className="max-w-xl"><p className="text-base leading-relaxed text-galv-silver">Safety, teamwork and diversity are part of SURE Mechanical’s company values. The company supports workforce development through apprenticeship programs and opportunities in the skilled trades.</p><a href="#hr-form" className="mt-6 inline-flex min-h-11 items-center gap-3 font-semibold text-cool-teal">Contact careers &amp; HR <ArrowUpRight size={18} aria-hidden="true" /></a></div>
      </div>
    </section>
  );
}
