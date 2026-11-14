import SectionReveal from './SectionReveal';

// Names verified against the SURE Mechanical brochure's "Clients & Projects" list.
// Do not imply endorsement. Swap text for approved logo assets when provided.
const CLIENTS = [
  '3CDC',
  'Dayton Children’s Hospital',
  'UC Health',
  'TriHealth',
  'Mercy Health',
  'Messer Construction',
  'Cincinnati Shakespeare',
  'Megen Construction',
  'Triversity Construction',
  'St. Elizabeth',
  'Bethany Village',
  'Danis Construction',
];

export default function PartnerProof() {
  return <section id="clients" className="border-t border-seam-line bg-steel-blue/20 py-20 lg:py-28" aria-label="Selected SURE Mechanical clients and projects">
    <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
      <SectionReveal>
        <p className="eyebrow">PROJECT EXPERIENCE</p>
        <h2 data-reveal className="section-title mt-4 text-blueprint-white">TRUST BUILT ON THE JOB.</h2>
        <p data-reveal className="mt-4 max-w-2xl leading-relaxed text-galv-silver">A selection of organizations and projects listed in SURE Mechanical’s company brochure.</p>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {CLIENTS.map(name => <div data-reveal key={name} className="flex min-h-24 items-center justify-center rounded-md border border-seam-line bg-mech-navy/70 px-4 py-5 text-center text-sm font-black uppercase tracking-wide text-blueprint-white transition-colors hover:border-cool-teal/50 hover:text-cool-teal">{name}</div>)}
        </div>
      </SectionReveal>
    </div>
  </section>;
}
