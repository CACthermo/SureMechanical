'use client';

import { useCallback, useState, useRef } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
import { ArrowUpRight, Images, Search, X } from 'lucide-react';
import { PHOTO_COLLECTIONS, PROJECTS, type Project } from '@/lib/projects';
import ProjectGallery from './ProjectGallery';

export default function Projects() {
  const [view, setView] = useState<'grid' | 'photos' | 'list'>('photos');
  const [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const closeProject = useCallback(() => setSelectedProject(null), []);
  const search = query.trim().toLocaleLowerCase();
  const matches = (project: Project) => `${project.title} ${project.customer ?? ''}`.toLocaleLowerCase().includes(search);
  const photos = PHOTO_COLLECTIONS.filter(matches);
  const jobs = PROJECTS.filter(matches);
  const sectionRef = useRef<HTMLElement>(null);
  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.fromTo('.project-photo-card', { y: 32, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.07, duration: 0.65, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } });
  }, { scope: sectionRef, dependencies: [view, query, expanded], revertOnUpdate: true });
  const gridProjects = [...jobs].sort((a, b) => Number(b.photos.length > 0) - Number(a.photos.length > 0));
  const resultCount = view === 'photos' ? photos.length : jobs.length;

  return (
    <section ref={sectionRef} id="projects" className="relative border-y border-seam-line bg-steel-blue/40 py-20 lg:py-28" aria-labelledby="projects-title">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <p className="eyebrow">Our work</p>
        <h2 id="projects-title" className="section-title mt-3 text-blueprint-white">See Our Work!</h2>
        <p className="mt-5 max-w-2xl text-galv-silver leading-relaxed">Browse project photos or find a job by name or customer. Select a project to take a closer look.</p>
        <div className="mt-9 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div role="group" aria-label="Project view" className="flex w-fit max-w-full gap-1 rounded-lg border border-seam-line bg-mech-navy p-1">
            <button type="button" aria-pressed={view === 'grid'} onClick={() => setView('grid')} className={`min-h-11 rounded-md px-3 text-sm font-medium ${view === 'grid' ? 'bg-cool-teal text-mech-navy' : 'text-galv-silver'}`}>Grid View</button>
            <button type="button" aria-pressed={view === 'photos'} onClick={() => setView('photos')} className={`min-h-11 rounded-md px-4 text-sm font-medium ${view === 'photos' ? 'bg-cool-teal text-mech-navy' : 'text-galv-silver'}`}>Regular View <span className="ml-1 text-xs">{PHOTO_COLLECTIONS.length}</span></button>
            <button type="button" aria-pressed={view === 'list'} onClick={() => setView('list')} className={`min-h-11 rounded-md px-4 text-sm font-medium ${view === 'list' ? 'bg-cool-teal text-mech-navy' : 'text-galv-silver'}`}>Project list <span className="ml-1 text-xs">{PROJECTS.length}</span></button>
          </div>
          <div role="search" className="relative w-full md:max-w-sm">
            <label htmlFor="project-search" className="sr-only">Search projects or customers</label>
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-galv-silver" aria-hidden="true" />
            <input id="project-search" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search projects or customers" className="min-h-12 w-full rounded-lg border border-seam-line bg-steel-blue pl-10 pr-12 text-sm text-blueprint-white placeholder:text-galv-silver" />
            {query && <button type="button" aria-label="Clear project search" onClick={() => setQuery('')} className="absolute right-1 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-galv-silver"><X size={17} /></button>}
          </div>
        </div>
        <p role="status" className="mb-5 mt-5 text-sm text-galv-silver">{resultCount} {view === 'photos' ? resultCount === 1 ? 'photo collection' : 'photo collections' : resultCount === 1 ? 'project' : 'projects'}{search ? ' found' : ''}</p>
        {resultCount === 0 && <div className="rounded-lg border border-seam-line p-8 text-galv-silver">No matches. Try another project name or customer, or <button type="button" onClick={() => setQuery('')} className="text-cool-teal underline">clear your search</button>.</div>}
        {view !== 'list' ? (
          <div className={view === 'grid' ? "project-matrix grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4" : "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"} aria-label="Project photo collections" id="project-cards">
            {(view === 'photos' ? (expanded || search ? gridProjects : gridProjects.slice(0, 6)) : gridProjects).map(project => <button key={project.id} type="button" onClick={() => setSelectedProject(project)} aria-haspopup="dialog" aria-label={`View project: ${project.title}`} className="project-photo-card group flex flex-col overflow-hidden rounded-xl border border-seam-line bg-steel-blue text-left transition-colors hover:border-cool-teal">
              <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-duct-mid">
                {project.photos.length > 0 ? <Image src={project.photos[0].src} alt={project.photos[0].alt} fill sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 400px" className="object-cover transition-transform duration-500 group-hover:scale-[1.025] motion-reduce:transform-none" /> : <div className="absolute inset-0 blueprint-grid flex items-center justify-center"><span className="text-cool-teal text-sm font-mono tracking-widest">SURE Mechanical</span></div>}
                {project.photos.length > 0 && <span className="absolute bottom-3 right-3 flex items-center gap-2 rounded-full bg-[#071724]/90 px-3 py-1.5 text-xs text-white"><Images size={14} aria-hidden="true" />{project.photos.length} {project.photos.length === 1 ? 'photo' : 'photos'}</span>}
              </div>
              <div className="flex w-full flex-1 items-start justify-between gap-4 p-5">
                <div><h3 className="text-lg font-semibold leading-snug text-blueprint-white">{project.title}</h3>{project.customer && <p className="mt-2 text-sm text-galv-silver">{project.customer}</p>}</div>
                <ArrowUpRight size={20} className="mt-1 shrink-0 text-cool-teal" aria-hidden="true" />
              </div>
            </button>)}
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-seam-line bg-steel-blue" aria-label="Project directory">
            <div className="hidden grid-cols-[1.2fr_1fr_44px] gap-5 border-b border-seam-line bg-mech-navy px-5 py-3 text-xs font-semibold uppercase tracking-wide text-galv-silver md:grid"><span>Project</span><span>Customer</span><span className="sr-only">View</span></div>
            <ul className="divide-y divide-seam-line">{jobs.map(project => <li key={project.id}><button type="button" onClick={() => setSelectedProject(project)} aria-haspopup="dialog" aria-label={`View project: ${project.title}`} className="grid w-full grid-cols-[1fr_32px] items-center gap-x-4 gap-y-2 px-5 py-5 text-left hover:bg-cool-teal/5 md:grid-cols-[1.2fr_1fr_44px]">
              <span className="text-base font-semibold leading-snug text-blueprint-white">{project.title}</span>
              <span className="col-start-1 text-sm text-galv-silver md:col-auto">{project.customer}</span>
              <ArrowUpRight size={19} className="col-start-2 row-start-1 row-span-2 justify-self-end text-cool-teal md:col-start-3 md:row-span-1" aria-hidden="true" />
            </button></li>)}</ul>
          </div>
        )}

        {view === 'photos' && !search && <button type="button" aria-expanded={expanded} aria-controls="project-cards" onClick={() => setExpanded(value => !value)} className="mx-auto mt-8 flex min-h-12 flex-col items-center gap-2 px-8 text-galv-silver hover:text-cool-teal"><span className="text-2xl opacity-40" aria-hidden="true">{expanded ? '−' : '＋'}</span><span className="text-sm">{expanded ? 'View Less' : 'View More'}</span></button>}
      </div>
      {selectedProject && <ProjectGallery key={selectedProject.id} project={selectedProject} onClose={closeProject} />}
    </section>
  );
}
