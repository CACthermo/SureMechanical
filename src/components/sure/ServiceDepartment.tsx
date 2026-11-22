import TextReveal from './TextReveal';
import Image from 'next/image';
import { assetPath } from '@/lib/asset-path';
import SectionReveal from './SectionReveal';

const services = [
  ['Preventive maintenance', 'Service and maintenance agreements tailored to your equipment and needs.'],
  ['Inspections & equipment audits', 'Mechanical system inspections with recommendations for improvements and maintenance.'],
  ['Energy audits', 'Energy audits of your current mechanical systems.'],
];
const equipment = ['VRF systems', 'Rooftop units', 'Chillers', 'Air handling units', 'Cooling towers', 'Boilers'];

export default function ServiceDepartment() {
  return (
    <section id="service" aria-labelledby="service-title">
      <SectionReveal>
        <div data-scene className="photo-chapter truck-chapter">
          <Image src={assetPath('/company/service-truck.webp')} alt="Branded SURE Mechanical service truck" fill sizes="100vw" className="photo-chapter-image" />
          <div className="photo-chapter-copy" data-reveal>
            <p className="photo-chapter-label">Commercial Equipment Service Department</p>
            <h2 id="service-title" className="section-title mt-3"><TextReveal>Care for the systems you depend on.</TextReveal></h2>
            <p data-scroll-copy className="mt-4 max-w-xl">Commercial HVAC equipment service, inspections and maintenance for your building.</p>
            <a href="#contact-form" className="photo-chapter-action">Request service</a>
          </div>
        </div>
        <div className="mx-auto max-w-[1200px] px-5 py-12 sm:px-8 lg:py-20">
          <div className="grid gap-x-8 md:grid-cols-3">
            {services.map(([title, text], index) => (
              <article key={title} className="service-feature border-t border-seam-line py-5">
                <span aria-hidden="true" className="service-index">0{index + 1}</span>
                <h3 data-reveal className="text-xl font-semibold text-blueprint-white">{title}</h3>
                <p data-scroll-copy className="mt-2 text-galv-silver">{text}</p>
              </article>
            ))}
          </div>
          <div className="mt-8 border-t border-seam-line pt-6" data-reveal>
            <h3 className="font-semibold text-blueprint-white">Equipment we service</h3>
            <ul className="equipment-list mt-4 flex flex-wrap gap-x-6 gap-y-2 text-galv-silver">
              {equipment.map(item => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </div>
      </SectionReveal>
    </section>
  );
}
