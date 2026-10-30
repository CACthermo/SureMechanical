'use client';

import { useState, type FormEvent } from 'react';

type FormKind = 'general' | 'hr' | 'project';
const ENDPOINTS: Record<FormKind, string> = {
  general: 'https://formspree.io/f/mkjjzrrw',
  hr: 'https://formspree.io/f/mpppldpv',
  project: 'https://formspree.io/f/mkjjzrrw',
};

function InquiryForm({ kind }: { kind: FormKind }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const isHR = kind === 'hr';
  const isProject = kind === 'project';

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (status === 'sending' || !form.reportValidity()) return;
    for (const field of Array.from(form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[required]'))) {
      field.setCustomValidity(field.value.trim() ? '' : 'Please complete this field.');
      if (!field.reportValidity()) return;
    }
    setStatus('sending');
    try {
      const response = await fetch(ENDPOINTS[kind], {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(20000),
      });
      if (!response.ok) throw new Error('Form submission was rejected');
      form.reset();
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  const fieldStyle = 'w-full min-h-11 px-3 py-2.5 bg-mech-navy border border-seam-line rounded-sm text-blueprint-white placeholder:text-galv-silver/60 focus:outline-2 focus:outline-cool-teal';
  const labelStyle = 'block text-xs uppercase tracking-[0.08em] text-galv-silver mb-1.5';
  return (
    <form onSubmit={handleSubmit} action={ENDPOINTS[kind]} method="POST" className="flex flex-col gap-4" aria-busy={status === 'sending'} onInput={(event) => {
      const field = event.target;
      if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) field.setCustomValidity('');
      if (status !== 'sending') setStatus('idle');
    }} aria-label={isHR ? 'Human resources inquiry' : isProject ? 'Start a project' : 'Contact SURE Mechanical'}>
      <input type="hidden" name="_subject" value={isHR ? 'SURE Mechanical HR Inquiry' : isProject ? 'SURE Mechanical Project Inquiry' : 'SURE Mechanical Website Inquiry'} />
      <div className="absolute left-[-9999px]" aria-hidden="true"><label>Leave this field blank<input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" /></label></div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div><label className={labelStyle} htmlFor={`${kind}-name`}>Name *</label><input className={fieldStyle} id={`${kind}-name`} name="name" autoComplete="name" required maxLength={120}/></div>
        <div><label className={labelStyle} htmlFor={`${kind}-email`}>Email *</label><input className={fieldStyle} id={`${kind}-email`} name="email" type="email" autoComplete="email" required maxLength={254}/></div>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div><label className={labelStyle} htmlFor={`${kind}-company`}>{isHR ? 'Position / trade' : 'Company'}</label><input className={fieldStyle} id={`${kind}-company`} name={isHR ? 'position' : 'company'} maxLength={140}/></div>
        <div><label className={labelStyle} htmlFor={`${kind}-phone`}>Phone</label><input className={fieldStyle} id={`${kind}-phone`} name="phone" type="tel" autoComplete="tel" maxLength={32}/></div>
      </div>
      {kind === 'general' && <div><label className={labelStyle} htmlFor="general-type">Inquiry Type</label><select className={fieldStyle} name="inquiry_type" id="general-type"><option>General Inquiry</option><option>Request Service</option><option>Capabilities</option><option>Other</option></select></div>}
      <div><label className={labelStyle} htmlFor={`${kind}-message`}>Message *</label><textarea className={`${fieldStyle} min-h-28 resize-y`} id={`${kind}-message`} name="message" required maxLength={5000} rows={4}/></div>
      <button type="submit" disabled={status === 'sending'} className="min-h-12 px-6 py-3 rounded-sm bg-cool-teal text-mech-navy font-semibold text-sm uppercase tracking-wide hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed">
        {status === 'sending' ? 'Sending…' : isHR ? 'Send HR Inquiry' : isProject ? 'Send Project Inquiry' : 'Send Message'}
      </button>
      {status === 'success' && <p role="status" className="text-sm text-cool-teal">Your message was submitted successfully.</p>}
      {status === 'error' && <p role="alert" className="text-sm text-red-700 dark:text-red-400">The form could not send. Please try again in a moment.</p>}
    </form>
  );
}

export default function FinalCTA() {
  return (
    <section id="cta" aria-label="Contact SURE Mechanical" className="relative py-20 lg:py-28 bg-steel-blue/35 border-t border-seam-line">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-cool-teal mb-3">GET IN TOUCH</p>
          <h2 className="section-title text-blueprint-white mb-4">Contact SURE Mechanical.</h2>
          <p className="text-galv-silver max-w-2xl mx-auto leading-relaxed">Reach our team about mechanical services, upcoming projects, or career opportunities.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
          <div id="project-form" className="scroll-mt-28 rounded-lg border border-seam-line bg-steel-blue p-5 sm:p-8 shadow-sm">
            <h3 className="text-xl font-semibold text-blueprint-white mb-2">Start a Project</h3>
            <p className="text-sm text-galv-silver mb-6">Tell us about your upcoming project or bid invitation.</p>
            <InquiryForm kind="project" />
          </div>
          <div id="contact-form" className="scroll-mt-28 rounded-lg border border-seam-line bg-steel-blue p-5 sm:p-8 shadow-sm">
            <h3 className="text-xl font-semibold text-blueprint-white mb-2">General Contact</h3>
            <p className="text-sm text-galv-silver mb-6">Questions, service requests, and other inquiries.</p>
            <InquiryForm kind="general" />
          </div>
          <div id="hr-form" className="scroll-mt-28 rounded-lg border border-seam-line bg-steel-blue p-5 sm:p-8 shadow-sm">
            <h3 className="text-xl font-semibold text-blueprint-white mb-2">Careers &amp; HR</h3>
            <p className="text-sm text-galv-silver mb-6">Use this form for employment and recruiting inquiries.</p>
            <InquiryForm kind="hr" />
          </div>
        </div>
      </div>
    </section>
  );
}
