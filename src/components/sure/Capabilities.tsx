import { Building2, Pipette, Wind } from 'lucide-react';

const SERVICES = [
  { id: 'design', icon: Building2, title: 'Engineering & planning', text: 'Mechanical design and 3D building coordination help plan how equipment, ductwork and piping fit together before installation.' },
  { id: 'heating-cooling', icon: Wind, title: 'Heating & cooling', text: 'Commercial heating, ventilation and air conditioning systems, including the ductwork that moves air through a building.' },
  { id: 'installation', icon: Pipette, title: 'Ductwork & piping', text: 'Sheet metal, hydronic piping, welding and field installation for commercial mechanical systems.' },
];

export default function Capabilities() {
  return (
    <section id="engineering" aria-labelledby="services-title" className="py-16 lg:py-24">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="grid gap-5 lg:grid-cols-2 lg:gap-12">
          <div><p className="eyebrow">What we do</p><h2 id="services-title" className="section-title mt-3 text-blueprint-white">Mechanical services,<br />from planning to installation.</h2></div>
          <p className="max-w-xl self-end text-base leading-relaxed text-galv-silver">SURE Mechanical is a commercial HVAC contractor. HVAC stands for heating, ventilation and air conditioning—the systems that heat, cool and move air through a building.</p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {SERVICES.map(service => <article id={service.id} key={service.id} className="scroll-mt-28 rounded-xl border border-seam-line bg-steel-blue p-6 lg:p-8"><service.icon size={28} strokeWidth={1.5} className="text-cool-teal" aria-hidden="true" /><h3 className="mb-3 mt-6 text-xl font-semibold text-blueprint-white">{service.title}</h3><p className="text-base leading-relaxed text-galv-silver">{service.text}</p></article>)}
        </div>
      </div>
    </section>
  );
}
