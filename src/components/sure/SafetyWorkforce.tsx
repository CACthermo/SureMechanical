import Image from 'next/image';
import { assetPath } from '@/lib/asset-path';
import SectionReveal from './SectionReveal';

export default function SafetyWorkforce() {
  return (
    <section id="safety" aria-labelledby="people-title">
      <SectionReveal>
        <div data-scene className="photo-chapter people-chapter">
          <Image src={assetPath('/company/people-safety-team.webp')} alt="SURE Mechanical team wearing hard hats and safety glasses" fill sizes="100vw" className="photo-chapter-image" />
          <div className="photo-chapter-copy" data-reveal>
            <p className="photo-chapter-label">People &amp; Safety</p>
            <h2 id="people-title" className="section-title mt-3">Experience. Inclusion. Responsibility.</h2>
            <p data-scroll-copy className="mt-4 max-w-xl">Our installers, technicians and engineers bring their skills to commercial HVAC projects. A safe environment and personal responsibility guide the work.</p>
            <a href="#hr-form" className="photo-chapter-action">Explore careers</a>
          </div>
        </div>
      </SectionReveal>
    </section>
  );
}
