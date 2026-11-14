import Image from 'next/image';
import { assetPath } from '@/lib/asset-path';
import SectionReveal from './SectionReveal';
const VALUES = [
  ['Integrity', 'Honesty and straightforwardness guide our trade.'],
  ['Teamwork', 'Open communication, trust and mutual respect.'],
  ['Ownership', 'Accountability as individuals and as an organization.'],
  ['Passion', 'Care for our work, our people and our clients.'],
  ['Commitment', 'Client satisfaction is our ultimate reward.'],
  ['Safety', 'A safe environment and personal responsibility.'],
  ['Diversity', 'Different backgrounds, one purpose: quality construction.'],
];
export default function CompanyStory() {
  return <section id="our-story" className="relative py-20 lg:py-28 border-y border-seam-line"><div className="absolute inset-0 blueprint-grid opacity-30" aria-hidden="true" /><div className="relative mx-auto max-w-[1200px] px-5 sm:px-8"><SectionReveal>
    <div className="grid gap-8 lg:grid-cols-2 items-center">
      <div data-reveal><p className="eyebrow">About SURE Mechanical</p><h2 className="section-title mt-4 text-blueprint-white">Experienced.<br />Inclusive.<br /><span className="text-cool-teal">Diverse.</span></h2><p className="mt-6 text-lg text-galv-silver leading-relaxed">Established in 2010, SURE Mechanical is a certified minority-owned heating, ventilation and air conditioning company serving Greater Cincinnati and surrounding areas.</p><p className="mt-4 text-galv-silver leading-relaxed">Our commercial HVAC work includes a focus on healthcare construction, bringing together experienced installers, technicians and engineers.</p><div className="mt-7 border-l-2 border-cool-teal pl-5"><h3 className="text-sm font-semibold uppercase tracking-widest text-cool-teal">Our commitment</h3><p className="mt-3 text-xl text-blueprint-white leading-relaxed">SURE Mechanical is committed to creating an experienced, inclusive, and diverse workforce.</p></div></div>
      <figure data-reveal className="relative overflow-hidden rounded-lg border border-seam-line"><Image src={assetPath('/company/brochure/rooftop-ductwork.webp')} alt="Commercial rooftop ductwork pictured in SURE Mechanical’s company brochure" width={1200} height={676} className="aspect-[4/3] lg:aspect-[4/5] w-full object-cover" /><figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#020b13]/95 to-transparent px-6 pb-6 pt-16 text-white"><span className="text-xs uppercase tracking-widest text-[#5beaf3]">Commercial HVAC</span><p className="mt-2 text-xl font-semibold">From the plan to the connections.</p></figcaption></figure>
    </div>
    <div data-reveal className="mt-12 grid gap-6 border-y border-seam-line py-8 sm:grid-cols-[160px_1fr]"><div><p className="text-5xl font-bold text-cool-teal">2010</p><p className="mt-2 text-xs uppercase tracking-wider text-galv-silver">Our beginning</p></div><div><h3 className="text-2xl font-semibold text-blueprint-white">It began with SURE Mechanical.</h3><p className="mt-3 text-galv-silver leading-relaxed">Founded in 2010, SURE Mechanical is the foundation of the companies shown below. In 2025, SURE Mechanical acquired Cincinnati Air Conditioning Co. The SURE Group family developed with Thermolinear as a related company, connecting their specialized capabilities.</p></div></div>
    <div className="mt-12"><p className="eyebrow">Our core values</p><h3 className="mt-3 text-3xl font-semibold text-blueprint-white">What guides our work</h3><div className="mt-8 grid gap-x-7 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">{VALUES.map(([title, description]) => <div data-reveal key={title} className="border-l-2 border-cool-teal/40 pl-4 py-2"><h4 className="font-semibold text-blueprint-white">{title}</h4><p className="mt-2 text-sm leading-relaxed text-galv-silver">{description}</p></div>)}</div></div>
  </SectionReveal></div></section>;
}
