import Image from 'next/image';
import { assetPath } from '@/lib/asset-path';

const COMPANIES = [
  { name: 'SURE Mechanical', logo: '/brand/SURE_MECHANICAL_alpha.png', text: 'Commercial mechanical design, sheet metal, piping and installation. Founded in Cincinnati in 2010.' },
  { name: 'Cincinnati Air Conditioning Co.', logo: '/brand/CAC_Logo.svg', text: 'Commercial and industrial heating and cooling, design-build engineering, process piping, service and building controls. Established in 1938.' },
  { name: 'Thermolinear', logo: '/brand/Thermolinear_logo.svg', text: 'Environmental rooms and chambers that control temperature and humidity for research and manufacturing.' },
];

export default function SureSystem() {
  return (
    <section id="sure-system" aria-labelledby="companies-title" className="py-20 lg:py-28">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <p className="eyebrow">SURE Group</p>
        <h2 id="companies-title" className="section-title mt-3 text-blueprint-white">Our companies.</h2>
        <p className="mt-5 max-w-2xl text-galv-silver leading-relaxed">SURE Mechanical acquired Cincinnati Air Conditioning Co. in 2025, bringing their mechanical contracting and engineering experience together.</p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {COMPANIES.map(company => <article key={company.name} className="rounded-xl border border-seam-line bg-steel-blue p-6 lg:p-8">
            <div className="mb-7 flex h-24 items-center justify-center rounded-lg bg-white p-4"><Image src={assetPath(company.logo)} alt={company.name} width={260} height={90} className="h-full w-full object-contain" /></div>
            <h3 className="text-lg font-semibold text-blueprint-white">{company.name}</h3>
            <p className="mt-3 text-base leading-relaxed text-galv-silver">{company.text}</p>
          </article>)}
        </div>
      </div>
    </section>
  );
}
