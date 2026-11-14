'use client';

import { useState, useEffect, useRef, type FormEvent } from 'react';

type FormKind = 'general' | 'hr' | 'project';
// Public form IDs are configuration, not secrets. A project route must never
// silently reuse General Contact; configure only after recipient verification.
const projectId = process.env.NEXT_PUBLIC_FORMSPREE_PROJECT_ID;
const ENDPOINTS: Record<FormKind, string | undefined> = {
  general: 'https://formspree.io/f/mkjjzrrw',
  hr: 'https://formspree.io/f/mpppldpv',
  project: projectId && /^[a-z0-9]+$/i.test(projectId) && !['mkjjzrrw', 'mpppldpv'].includes(projectId)
    ? `https://formspree.io/f/${projectId}` : undefined,
};
const FALLBACK_RECIPIENTS: Record<FormKind, string> = {
  general: 'lhammer@suremechanical.com',
  hr: 'lhammer@suremechanical.com',
  project: 'bidinvites@suremechanical.com',
};

function InquiryForm({ kind }: { kind: FormKind }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const submitting = useRef(false);
  const [errorMessage, setErrorMessage] = useState('');
  const isHR = kind === 'hr';
  const isProject = kind === 'project';

  const endpoint = ENDPOINTS[kind];

  function validate(form: HTMLFormElement) {
    for (const field of Array.from(form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[required]'))) {
      field.setCustomValidity(field.value.trim() ? '' : 'Please complete this field.');
    }
    return form.reportValidity();
  }

  function submitDirectly() {
    const form = document.getElementById(`${kind}-inquiry-form`);
    if (form instanceof HTMLFormElement && endpoint && !submitting.current && validate(form)) {
      // Explicit fallback opens the provider response separately so the source
      // form keeps its entries. Never auto-retry an ambiguous network response.
      submitting.current = true;
      form.target = '_blank';
      form.rel = 'noopener';
      HTMLFormElement.prototype.submit.call(form);
      window.setTimeout(() => { submitting.current = false; }, 3000);
    }
  }

  function prepareProjectInquiry() {
    const form = document.getElementById(`${kind}-inquiry-form`);
    if (!(form instanceof HTMLFormElement) || !validate(form)) return;
    setErrorMessage('Online project routing is being verified. Prepare an email to our bid invitations team below.');
    setStatus('error');
  }

  function composeEmail() {
    const form = document.getElementById(`${kind}-inquiry-form`);
    if (!(form instanceof HTMLFormElement)) return;
    const data = new FormData(form);
    const subject = isHR ? 'HR Inquiry - SURE Mechanical' : isProject ? 'Project Inquiry - SURE Mechanical' : 'Contact Inquiry - SURE Mechanical';
    const fields = ['name', 'email', 'company', 'position', 'phone', 'inquiry_type', 'message'];
    const body = fields.map(field => {
      const value = data.get(field);
      return typeof value === 'string' && value.trim() ? `${field.replace(/_/g, ' ').toUpperCase()}: ${value.trim()}` : null;
    }).filter(Boolean).join('\n\n');
    window.location.href = `mailto:${FALLBACK_RECIPIENTS[kind]}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (submitting.current || !validate(form)) return;
    if (!endpoint) {
      setErrorMessage('Online project routing is being verified. Use the email option below to contact our bid invitations team. Your information is still here.');
      setStatus('error');
      return;
    }
    submitting.current = true;
    setErrorMessage('');
    setStatus('sending');
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(20000),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || result?.ok !== true || result?.errors?.length) {
        throw new Error(response.status === 429 ? 'Too many requests. Please wait before trying again. Your information is still here.' : 'The form was not accepted. Please try again. Your information is still here.');
      }
      form.reset();
      setStatus('success');
    } catch (error) {
      setErrorMessage(error instanceof Error && (error.message.startsWith('The form was not accepted') || error.message.startsWith('Too many requests')) ? error.message : 'We could not confirm your submission. Your information is still here. Please try again in a moment.');
      setStatus('error');
    } finally {
      submitting.current = false;
    }
  }

  const fieldStyle = 'w-full min-h-11 px-3 py-2.5 bg-mech-navy border border-seam-line rounded-sm text-blueprint-white placeholder:text-galv-silver/60 focus:outline-2 focus:outline-cool-teal';
  const labelStyle = 'block text-xs uppercase tracking-[0.08em] text-galv-silver mb-1.5';
  return (
    <form id={`${kind}-inquiry-form`} onSubmit={handleSubmit} action={endpoint} method="POST" className="flex flex-col gap-4" aria-busy={status === 'sending'} onInput={(event) => {
      const field = event.target;
      if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) field.setCustomValidity('');
      if (status !== 'sending') setStatus('idle');
    }} aria-label={isHR ? 'Human resources inquiry' : isProject ? 'Start a project' : 'Contact SURE Mechanical'}>
      {!endpoint && <p className="rounded-md border border-cool-teal/30 p-3 text-sm text-galv-silver">Project form delivery is being verified. Fill in your details, then use the email option to contact our bid invitations team.</p>}
      <noscript><p>JavaScript is unavailable. {endpoint ? 'Use this form to continue on the provider’s standard submission page.' : 'Please contact our office by phone while project form delivery is being verified.'}</p></noscript>
      <input type="hidden" name="contact_category" value={kind} />
      <input type="hidden" name="source_website" value="suremechanical.com" />
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
      <button type={endpoint ? "submit" : "button"} onClick={!endpoint ? prepareProjectInquiry : undefined} disabled={status === 'sending'} className="min-h-12 px-6 py-3 rounded-sm bg-cool-teal text-mech-navy font-semibold text-sm uppercase tracking-wide hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed">
        {status === 'sending' ? 'Sending…' : !endpoint ? 'Prepare Project Inquiry' : isHR ? 'Send HR Inquiry' : isProject ? 'Send Project Inquiry' : 'Send Message'}
      </button>
      {status === 'success' && <p role="status" className="text-sm text-cool-teal">The form provider accepted your message. This confirms submission to the provider, not email delivery.</p>}
      {status === 'error' && <div role="alert" className="rounded-md border border-amber-400/40 bg-amber-400/10 p-4 text-sm text-blueprint-white">
        <p>{errorMessage}</p>
        <p className="mt-2">{endpoint ? 'A connection error can occur after a message is accepted. Retrying may send a duplicate. You can use the standard submission page or prepare an email instead.' : 'The email option opens your email app with these details. Review and send it there; this page does not send the email.'}</p>
        <div className="mt-3 flex flex-wrap gap-3">
          {endpoint && <button type="button" onClick={submitDirectly} className="rounded-sm border border-cool-teal px-3 py-2 font-bold text-cool-teal hover:bg-cool-teal/10">Try standard submission</button>}
          <button type="button" onClick={composeEmail} className="rounded-sm border border-seam-line px-3 py-2 font-bold text-blueprint-white hover:border-cool-teal">Email directly</button>
        </div>
      </div>}
    </form>
  );
}

export default function FinalCTA() {
  useEffect(() => {
    const openTarget = () => {
      const target = document.getElementById(window.location.hash.slice(1));
      if (target instanceof HTMLDetailsElement) target.open = true;
    };
    openTarget();
    window.addEventListener('hashchange', openTarget);
    const onLink = (event: MouseEvent) => {
      const link = (event.target as Element).closest('a[href^="#"]');
      const target = link && document.getElementById(link.getAttribute('href')!.slice(1));
      if (target instanceof HTMLDetailsElement) target.open = true;
    };
    document.addEventListener('click', onLink);
    return () => { window.removeEventListener('hashchange', openTarget); document.removeEventListener('click', onLink); };
  }, []);
  return (
    <section id="cta" aria-label="Contact SURE Mechanical" className="relative py-20 lg:py-28 bg-steel-blue/35 border-t border-seam-line">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-cool-teal mb-3">GET IN TOUCH</p>
          <h2 className="section-title text-blueprint-white mb-4">Contact SURE Mechanical</h2>
          <p className="text-galv-silver max-w-2xl mx-auto leading-relaxed">Reach our team about mechanical services, upcoming projects, or career opportunities.</p>
        </div>
        <div className="mx-auto max-w-3xl space-y-4">
          {([
            ['project', 'project-form', 'Start a Project', 'Tell us about your upcoming project or bid invitation.'],
            ['general', 'contact-form', 'General Contact', 'Questions, service requests, and other inquiries.'],
            ['hr', 'hr-form', 'Careers & HR', 'Employment and recruiting inquiries.'],
          ] as const).map(([kind, id, title, description]) => (
            <details key={kind} id={id} name="contact-options" className="group scroll-mt-28 rounded-lg border border-seam-line bg-steel-blue shadow-sm">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 p-5 sm:p-7 [&::-webkit-details-marker]:hidden">
                <span><span className="block text-xl font-semibold text-blueprint-white">{title}</span><span className="mt-2 block text-sm text-galv-silver">{description}</span></span>
                <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-cool-teal/30 text-2xl text-cool-teal group-open:rotate-45 transition-transform">+</span>
              </summary>
              <div className="border-t border-seam-line p-5 sm:p-7"><InquiryForm kind={kind} /></div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
