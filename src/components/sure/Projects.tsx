'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { PROJECTS } from '@/lib/projects';

type Project = (typeof PROJECTS)[number];
const CATEGORIES = ['All', ...new Set(PROJECTS.map(project => project.industry))];

function ProjectImage({ project }: { project: Project }) {
  return project.image ? (
    <Image src={project.image} alt="Temporary portfolio photograph; project matching pending confirmation" fill sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 40vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
  ) : (
    <div className="absolute inset-0 flex items-center justify-center bg-duct-mid p-8 text-center">
      <span className="font-mono text-sm uppercase tracking-wider text-blueprint-white">Project photograph coming soon</span>
    </div>
  );
}

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const filtered = activeCategory === 'All' ? PROJECTS : PROJECTS.filter(project => project.industry === activeCategory);

  useEffect(() => {
    if (!selectedProject) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      triggerRef.current?.focus({ preventScroll: true });
    };
  }, [selectedProject]);

  return (
    <section id="projects" className="relative py-20 lg:py-28" aria-labelledby="projects-title">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <span className="tech-label">PROJECT EXPERIENCE</span>
        <h2 id="projects-title" className="section-title text-blueprint-white mt-5 mb-5">MECHANICAL SYSTEMS.<br /><span className="text-cool-teal">REAL-WORLD IMPACT.</span></h2>
        <p className="text-galv-silver max-w-2xl mb-8 leading-relaxed">Explore the portfolio layout by sector. Project names, scopes, and photograph assignments shown here are preliminary and await confirmation by SURE leadership.</p>
        <div role="group" aria-label="Filter projects by sector" className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map(category => (
            <button key={category} type="button" aria-pressed={activeCategory === category} onClick={() => setActiveCategory(category)} className={`min-h-11 px-4 py-2 rounded-sm border text-xs font-mono uppercase tracking-wide ${activeCategory === category ? 'bg-cool-teal text-mech-navy border-cool-teal' : 'text-galv-silver border-seam-line hover:border-cool-teal'}`}>
              {category === 'Research & Laboratory' ? 'Research' : category}
            </button>
          ))}
        </div>
        <p role="status" className="text-sm text-galv-silver mb-5">{filtered.length} {filtered.length === 1 ? 'project' : 'projects'} shown</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(project => (
            <button key={project.title} type="button" onClick={event => { triggerRef.current = event.currentTarget; setSelectedProject(project); }} aria-haspopup="dialog" aria-label={`View preliminary project: ${project.title}`} className={`group flex flex-col text-left overflow-hidden rounded-md border border-seam-line bg-steel-blue hover:border-cool-teal transition-colors ${project.featured ? 'md:col-span-2' : ''}`}>
              <div className={`relative w-full shrink-0 ${project.featured ? 'aspect-[16/9]' : 'aspect-[4/3]'}`}>
                <ProjectImage project={project} />
                <span className="absolute left-3 top-3 rounded-sm bg-[#020B13]/90 text-white text-[10px] font-mono tracking-wider uppercase px-3 py-2">Preliminary · Photo {project.image ? 'matching pending' : 'pending'}</span>
              </div>
              <div className="p-5 lg:p-6">
                <p className="text-xs text-cool-teal uppercase tracking-wide mb-2">{project.industry}</p>
                <h3 className="text-lg font-semibold text-blueprint-white mb-2">{project.title}</h3>
                <p className="text-sm text-galv-silver line-clamp-2">{project.scope}</p>
                <span className="mt-4 inline-block text-xs font-semibold text-cool-teal">View preliminary details →</span>
              </div>
            </button>
          ))}
        </div>
      </div>
      {selectedProject && (
        <dialog ref={dialogRef} onKeyDown={event => {
          if (event.key !== 'Tab') return;
          const controls = event.currentTarget.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], [tabindex="0"]');
          const first = controls[0];
          const last = controls[controls.length - 1];
          if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
          else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
        }} aria-labelledby="project-detail-title" aria-describedby="project-review-note" onClose={() => setSelectedProject(null)} onClick={event => { if (event.target === event.currentTarget) setSelectedProject(null); }} className="m-auto w-[calc(100%-2rem)] max-w-3xl max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-md border border-seam-line bg-steel-blue p-0 text-blueprint-white backdrop:bg-black/70 backdrop:backdrop-blur-sm">
          <div className="sticky top-0 z-10 flex justify-between items-center gap-4 p-4 border-b border-seam-line bg-steel-blue">
            <p className="text-xs font-mono uppercase text-cool-teal">Preliminary project details</p>
            <button type="button" autoFocus onClick={() => setSelectedProject(null)} aria-label="Close project detail" className="w-11 h-11 border border-seam-line rounded-md text-xl">×</button>
          </div>
          <div className="relative aspect-video"><ProjectImage project={selectedProject} /></div>
          <div className="p-5 sm:p-8">
            <p id="project-review-note" className="text-sm text-galv-silver border-l-2 border-cool-teal pl-4 mb-6">Placeholder content. Name, scope, company assignment, and photograph require SURE leadership confirmation.</p>
            <p className="text-xs text-cool-teal uppercase tracking-wide mb-3">{selectedProject.industry} · {selectedProject.company}</p>
            <h3 id="project-detail-title" className="text-2xl font-semibold mb-4">{selectedProject.title}</h3>
            <p className="text-galv-silver leading-relaxed">{selectedProject.scope}</p>
            <a href="mailto:bidinvites@suremechanical.com" className="inline-flex mt-6 min-h-11 items-center text-cool-teal underline">Discuss your project</a>
          </div>
        </dialog>
      )}
    </section>
  );
}
