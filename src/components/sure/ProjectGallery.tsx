'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import type { Project } from '@/lib/projects';

export default function ProjectGallery({ project, onClose }: { project: Project; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const swipeRef = useRef<{ x: number; y: number } | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);
  const count = project.photos.length;
  const photo = project.photos[photoIndex];
  const movePhoto = (direction: number) => setPhotoIndex(index => (index + direction + count) % count);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      opener?.focus({ preventScroll: true });
    };
  }, []);

  return (
    <dialog ref={dialogRef} onClose={onClose} aria-labelledby="project-detail-title"
      onClick={event => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose();
      }}
      onKeyDown={event => {
        if (count > 1 && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
          event.preventDefault();
          movePhoto(event.key === 'ArrowLeft' ? -1 : 1);
        }
        if (event.key !== 'Tab') return;
        const controls = event.currentTarget.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], [tabindex="0"]');
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }}
      className="m-auto w-[calc(100%-1.5rem)] max-w-5xl max-h-[calc(100dvh-1.5rem)] overflow-y-auto rounded-xl border border-seam-line bg-steel-blue p-0 text-blueprint-white shadow-2xl backdrop:bg-black/75 backdrop:backdrop-blur-sm">
      <div className="sticky top-0 z-20 flex items-start justify-between gap-4 border-b border-seam-line bg-steel-blue px-5 py-4 sm:px-7">
        <div className="min-w-0">
          <h3 id="project-detail-title" className="text-lg sm:text-2xl font-semibold leading-tight">{project.title}</h3>
          {project.customer && <p className="mt-2 text-sm text-galv-silver"><span className="font-medium">Customer:</span> {project.customer}</p>}
        </div>
        <button type="button" autoFocus onClick={onClose} aria-label="Close project detail" className="shrink-0 flex h-11 w-11 items-center justify-center rounded-full border border-seam-line hover:text-cool-teal"><X size={20} aria-hidden="true" /></button>
      </div>
      {photo ? (
        <>
          <div className="relative aspect-[4/3] sm:aspect-[16/10] max-h-[65dvh] bg-[#071724] touch-pan-y"
            onPointerDown={event => { if (event.pointerType === 'touch') swipeRef.current = { x: event.clientX, y: event.clientY }; }}
            onPointerCancel={() => { swipeRef.current = null; }}
            onPointerUp={event => {
              const start = swipeRef.current;
              swipeRef.current = null;
              if (!start || count < 2) return;
              const dx = event.clientX - start.x;
              const dy = event.clientY - start.y;
              if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) movePhoto(dx < 0 ? 1 : -1);
            }}>
            <Image key={photo.src} src={photo.src} alt={photo.alt} fill sizes="(max-width: 1023px) 100vw, 1024px" className="object-contain" draggable={false} loading="eager" />
          </div>
          <div className="flex items-center justify-between gap-3 border-b border-seam-line px-5 py-3 sm:px-7">
            {count > 1 ? <button type="button" onClick={() => movePhoto(-1)} aria-label="Previous photo" className="flex h-11 items-center gap-2 rounded-md border border-seam-line px-3 hover:border-cool-teal"><ArrowLeft size={18} aria-hidden="true" /><span className="hidden sm:inline text-sm">Previous</span></button> : <span />}
            <p role="status" aria-live="polite" aria-atomic="true" className="text-sm text-galv-silver">Photo {photoIndex + 1} of {count}</p>
            {count > 1 ? <button type="button" onClick={() => movePhoto(1)} aria-label="Next photo" className="flex h-11 items-center gap-2 rounded-md border border-seam-line px-3 hover:border-cool-teal"><span className="hidden sm:inline text-sm">Next</span><ArrowRight size={18} aria-hidden="true" /></button> : <span />}
          </div>
          {count > 1 && <div role="group" aria-label="Choose a project photo" className="flex gap-3 overflow-x-auto px-5 py-4 sm:px-7">
            {project.photos.map((item, index) => <button key={item.src} type="button" onClick={() => setPhotoIndex(index)} aria-label={`Show photo ${index + 1} of ${count}`} aria-pressed={photoIndex === index} className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-md border-2 ${photoIndex === index ? 'border-cool-teal' : 'border-transparent opacity-70 hover:opacity-100'}`}><Image src={item.src} alt="" fill sizes="96px" className="object-cover" /></button>)}
          </div>}
        </>
      ) : <div className="px-5 py-12 sm:px-7"><p className="text-galv-silver">Project photos will be added when available.</p></div>}
      <div className="px-5 pb-6 pt-4 sm:px-7">
        {project.scope && <p className="text-galv-silver leading-relaxed mb-5">{project.scope}</p>}
        <a href="mailto:bidinvites@suremechanical.com" className="inline-flex min-h-11 items-center font-medium text-cool-teal underline underline-offset-4">Discuss a project with our team</a>
      </div>
    </dialog>
  );
}
