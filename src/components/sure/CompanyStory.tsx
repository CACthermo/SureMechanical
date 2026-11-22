import TextReveal from './TextReveal';
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
  return (
    <section id="our-story" aria-labelledby="about-title">
      <SectionReveal>
        <div data-scene className="photo-chapter about-chapter">
          <Image src={assetPath('/company/about-wall.jpeg')} alt="SURE Mechanical wall signage" fill sizes="100vw" className="photo-chapter-image" />
          <div className="photo-chapter-copy" data-reveal>
            <p className="photo-chapter-label">About SURE Mechanical</p>
            <h2 id="about-title" className="section-title mt-3"><TextReveal>Experienced. Inclusive. Diverse.</TextReveal></h2>
            <p data-scroll-copy className="mt-4 max-w-xl">SURE Mechanical is a certified minority-owned commercial HVAC company serving Greater Cincinnati. Our work includes healthcare construction, bringing together experienced installers, technicians and engineers.</p>
          </div>
        </div>
        <div className="mx-auto max-w-[1200px] px-5 py-12 sm:px-8 lg:py-20">
          <p className="eyebrow">Our core values</p>
          <h3 data-reveal className="mt-3 text-3xl font-semibold text-blueprint-white"><TextReveal>What guides our work</TextReveal></h3>
          <p data-scroll-copy className="mt-3 text-galv-silver">SURE Mechanical is committed to creating an experienced, inclusive, and diverse workforce.</p>
          <div className="value-grid mt-10 grid gap-x-7 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map(([title, description], index) => (
              <div key={title} className="value-item border-t border-seam-line py-4">
                <span aria-hidden="true" className="value-index">0{index + 1}</span>
                <h4 data-reveal className="font-semibold text-blueprint-white">{title}</h4>
                <p data-scroll-copy className="mt-2 text-sm leading-relaxed text-galv-silver">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionReveal>
    </section>
  );
}
