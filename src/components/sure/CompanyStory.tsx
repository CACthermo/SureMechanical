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
  return <section id="our-story" className="relative py-20 lg:py-28 border-y border-seam-line"><div className="absolute inset-0 blueprint-grid opacity-30" aria-hidden="true" /><div className="relative mx-auto max-w-[1200px] px-5 sm:px-8">
    <div className="grid gap-8 lg:grid-cols-[.7fr_1.3fr] items-start"><div><p className="eyebrow">Our story</p><p className="mt-4 text-7xl font-bold tracking-tight text-cool-teal">2010</p><p className="mt-2 text-sm text-galv-silver">SURE Mechanical established</p></div><div><h2 className="section-title text-blueprint-white">It began with SURE Mechanical.</h2><p className="mt-5 text-galv-silver leading-relaxed">Established in 2010, SURE Mechanical is the original company. SURE Group subsequently developed as the broader company family, with Cincinnati Air Conditioning Co. and Thermolinear as related companies.</p><p className="mt-4 text-galv-silver leading-relaxed">SURE Mechanical is committed to creating an experienced, inclusive, and diverse workforce.</p></div></div>
    <div className="mt-16 border-t border-seam-line pt-10"><p className="eyebrow">Our core values</p><h3 className="mt-3 text-3xl font-semibold text-blueprint-white">What guides our work</h3><div className="mt-8 grid gap-x-7 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">{VALUES.map(([title, description]) => <div key={title} className="border-l-2 border-cool-teal/40 pl-4 py-2"><h4 className="font-semibold text-blueprint-white">{title}</h4><p className="mt-2 text-sm leading-relaxed text-galv-silver">{description}</p></div>)}</div></div>
  </div></section>;
}
