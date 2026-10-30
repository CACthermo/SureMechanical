import Image from 'next/image';
import { assetPath } from '@/lib/asset-path';

const LINKS = [
  { heading: 'Company', links: [
    { label: 'SURE Group Companies', href: '#sure-system' },
    { label: 'People & Safety', href: '#safety' },
    { label: 'Careers & HR', href: '#hr-form' },
  ]},
  { heading: 'Services', links: [
    { label: 'Engineering & Planning', href: '#engineering' },
    { label: 'Heating & Cooling', href: '#heating-cooling' },
    { label: 'Field Installation', href: '#installation' },
  ]},
  { heading: 'Connect', links: [
    { label: 'Project Experience', href: '#projects' },
    { label: 'General Contact', href: '#contact-form' },
    { label: 'Bid Invitations', href: 'mailto:bidinvites@suremechanical.com' },
  ]},
];

export default function Footer() {
  return (
    <footer id="footer" className="relative border-t border-seam-line bg-mech-navy py-12 lg:py-16" role="contentinfo">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-9">
          <div className="lg:col-span-2">
            <Image src={assetPath('/brand/SURE_MECHANICAL_alpha.png')} alt="SURE Mechanical" width={245} height={85} className="w-auto max-w-[240px] h-14 object-contain mb-4" />
            <p className="max-w-sm text-sm text-galv-silver leading-relaxed">Commercial heating, cooling, ductwork and piping. Based in Cincinnati and serving Southern Ohio and Northern Kentucky.</p>
            <p className="text-xs text-galv-silver mt-3">Cincinnati, Ohio · Tri-State Region</p>
          </div>
          {LINKS.map(col => (
            <div key={col.heading}>
              <h3 className="text-xs font-semibold tracking-[0.1em] uppercase text-blueprint-white mb-4">{col.heading}</h3>
              <ul className="space-y-3">{col.links.map(link => <li key={link.href}><a href={link.href} className="text-sm text-galv-silver hover:text-cool-teal">{link.label}</a></li>)}</ul>
            </div>
          ))}
        </div>
        <p className="mt-12 pt-5 border-t border-seam-line text-xs text-galv-silver">© {new Date().getFullYear()} SURE Mechanical. All rights reserved. <a href="https://starrtree.org" className="inline-block ml-3 underline underline-offset-4 hover:text-cool-teal">Website by StarrTree</a></p>
      </div>
    </footer>
  );
}
