'use client';

import { useEffect, type ReactNode } from 'react';
import { List, ListInput, Preloader } from 'konsta/react';
import { ChevronLeft, Mail, Phone } from 'lucide-react';
import { ArrowIcon, WhatsAppIcon } from '@/components/icons';
import { AMBITI, EMPTY_TEAM, TEMPI, isEmail, isPhone, teamLines, teamSubject, teamWhatsAppText, type TeamDraft } from '@/lib/forms';
import { EMAIL_PARTNER, PHONE, PHONE_DISPLAY, mailtoLink, waLink } from '@/lib/site';
import { ChipGroup, FieldError, FieldLabel, GroupTitle, SegmentedChoice, StepBar, inputClass, listClass } from './fields';
import { useFlow, type Errors } from './useFlow';

type Field = 'name' | 'email' | 'phone' | 'occupation' | 'inSector' | 'ambito' | 'why' | 'time';

const STEP_TITLES = ['Chi sei', 'Il tuo percorso', 'Il progetto', 'Riepilogo'] as const;

/** Evento che la "parete dei profili" della pagina manda al modulo. */
export const AMBITO_EVENT = 'ab:ambito';

function validate(step: number, d: TeamDraft): Errors<Field> {
  const e: Errors<Field> = {};
  if (step === 0) {
    if (d.name.trim().length < 2) e.name = 'Scrivi nome e cognome.';
    if (!isEmail(d.email)) e.email = 'Mi serve un’email valida per risponderti.';
    if (!isPhone(d.phone)) e.phone = 'Serve un numero valido per ricontattarti.';
  }
  if (step === 1) {
    if (d.occupation.trim().length < 2) e.occupation = 'Una riga basta: mi aiuta a capire da dove parti.';
    if (!d.inSector) e.inSector = 'Scegli una risposta.';
    if (!d.ambito) e.ambito = 'Scegli l’ambito più vicino a te.';
  }
  if (step === 2) {
    if (d.why.trim().length < 5) e.why = 'Raccontami in due righe cosa ti attira del progetto.';
    if (!d.time) e.time = 'Scegli una risposta.';
  }
  return e;
}

/**
 * "Entra nel Team": chi sei → il tuo percorso → il progetto → riepilogo,
 * poi il messaggio arriva ad Andrea per email (con la tua email come
 * risposta). Sempre in pagina, in /lavora-con-noi.
 */
export default function TeamFlow() {
  const { flow: f, bodyRef, titleRef } = useFlow<TeamDraft, Field>({
    storageKey: 'ab:team',
    empty: EMPTY_TEAM,
    steps: 4,
    variant: 'inline',
    validate,
    toPayload: (d) => ({
      kind: 'team',
      name: d.name.trim(),
      email: d.email.trim(),
      phone: d.phone.trim(),
      occupation: d.occupation.trim(),
      inSector: d.inSector === 'No' ? 'No' : 'Sì',
      ambito: d.ambito,
      why: d.why.trim(),
      time: d.time,
      social: d.social.trim(),
    }),
  });
  const { draft: d, step, sent, set } = f;
  const waText = teamWhatsAppText(d);

  // La parete "Ti riconosci?" della pagina sceglie l'ambito qui.
  useEffect(() => {
    const onPick = (e: Event) => set('ambito', (e as CustomEvent<string>).detail);
    window.addEventListener(AMBITO_EVENT, onPick);
    return () => window.removeEventListener(AMBITO_EVENT, onPick);
  }, [set]);

  const err = (key: Field) =>
    f.errors[key] ? <FieldError id={`${f.fid(key)}-error`} message={f.errors[key]} /> : undefined;
  const groupErr = (key: Field) =>
    f.errors[key] ? (
      <p role="alert" className="mt-2 px-1 text-[13.5px] text-peach-deep" data-field={key} tabIndex={-1}>
        {f.errors[key]}
      </p>
    ) : null;

  const title = (text: ReactNode, sub?: ReactNode) => (
    <div className="mb-5 px-1">
      <h3 ref={titleRef} tabIndex={-1} className="text-[27px] leading-[1.05] tracking-[-0.025em] text-ink outline-none">
        {text}
      </h3>
      {sub && <p className="mt-2 text-[15px] leading-snug text-ink-mute">{sub}</p>}
    </div>
  );

  const header = (
    <div className="px-4 pb-3 pt-1">
      <div className="flex h-11 items-center justify-between gap-2">
        {step > 0 && !sent ? (
          <button type="button" onClick={f.back} className="icon-btn !h-10 !w-10" aria-label="Passo precedente">
            <ChevronLeft size={20} aria-hidden />
          </button>
        ) : (
          <span className="w-10" />
        )}
        <div className="min-w-0 text-center">
          <p className="text-[15px] font-[750] leading-tight text-ink">Entra nel Team</p>
          <p className="text-[12.5px] text-ink-mute" aria-live="polite">
            {sent ? 'Messaggio inviato' : `Passo ${step + 1} di 4 · ${STEP_TITLES[step]}`}
          </p>
        </div>
        <span className="w-10" />
      </div>
      <StepBar count={STEP_TITLES.length} step={step} done={!!sent} />
    </div>
  );

  const stepWho = (
    <div className="grid gap-6">
      {title('Chi sei?', 'Tre righe e ci conosciamo. Ti ricontatto io, personalmente.')}
      <List strong inset className={listClass}>
        <ListInput
          label={<FieldLabel htmlFor={f.fid('name')}>Nome e cognome</FieldLabel>}
          error={err('name')}
          input={
            <input id={f.fid('name')} data-field="name" value={d.name} onChange={(e) => set('name', e.target.value)} autoComplete="name" placeholder="Es. Marco Rossi" className={inputClass} {...f.aria('name')} />
          }
        />
        <ListInput
          label={<FieldLabel htmlFor={f.fid('email')}>Email</FieldLabel>}
          error={err('email')}
          input={
            <input id={f.fid('email')} data-field="email" type="email" inputMode="email" value={d.email} onChange={(e) => set('email', e.target.value)} autoComplete="email" placeholder="nome@esempio.it" className={inputClass} {...f.aria('email')} />
          }
        />
        <ListInput
          label={<FieldLabel htmlFor={f.fid('phone')}>Telefono</FieldLabel>}
          error={err('phone')}
          input={
            <input id={f.fid('phone')} data-field="phone" type="tel" inputMode="tel" value={d.phone} onChange={(e) => set('phone', e.target.value)} autoComplete="tel" placeholder="+39 3xx xxx xxxx" className={inputClass} {...f.aria('phone')} />
          }
        />
      </List>
    </div>
  );

  const stepPath = (
    <div className="grid gap-6">
      {title('Il tuo percorso.', 'Non serve un curriculum: mi basta capire da dove parti.')}
      <List strong inset className={listClass}>
        <ListInput
          label={<FieldLabel htmlFor={f.fid('occupation')}>Di cosa ti occupi oggi?</FieldLabel>}
          error={err('occupation')}
          input={
            <input id={f.fid('occupation')} data-field="occupation" value={d.occupation} onChange={(e) => set('occupation', e.target.value)} placeholder="Es. educatrice cinofila, impiegato, studentessa…" className={inputClass} {...f.aria('occupation')} />
          }
        />
      </List>
      <div>
        <GroupTitle id={f.fid('sector-t')}>Lavori già nel settore animale?</GroupTitle>
        <SegmentedChoice
          labelledBy={f.fid('sector-t')}
          options={[
            { value: 'Sì', label: 'Sì' },
            { value: 'No', label: 'No' },
          ]}
          value={d.inSector}
          onChange={(v) => set('inSector', v)}
          deselect={false}
        />
        {groupErr('inSector')}
      </div>
      <div>
        <GroupTitle id={f.fid('ambito-t')}>Qual è il tuo ambito?</GroupTitle>
        <ChipGroup single labelledBy={f.fid('ambito-t')} options={AMBITI} values={d.ambito ? [d.ambito] : []} onToggle={(v) => set('ambito', d.ambito === v ? '' : v)} />
        {groupErr('ambito')}
      </div>
    </div>
  );

  const stepProject = (
    <div className="grid gap-6">
      {title('Il progetto.', 'Due righe sincere valgono più di una lettera di presentazione.')}
      <List strong inset className={listClass}>
        <ListInput
          label={<FieldLabel htmlFor={f.fid('why')}>Perché ti interessa?</FieldLabel>}
          error={err('why')}
          input={
            <textarea id={f.fid('why')} data-field="why" rows={4} value={d.why} onChange={(e) => set('why', e.target.value)} maxLength={2500} placeholder="Cosa ti attira, cosa ti piacerebbe costruire…" className={`${inputClass} h-auto resize-none py-2`} {...f.aria('why')} />
          }
        />
      </List>
      <div>
        <GroupTitle id={f.fid('time-t')}>Quanto tempo vorresti dedicare?</GroupTitle>
        <ChipGroup single labelledBy={f.fid('time-t')} options={TEMPI} values={d.time ? [d.time] : []} onToggle={(v) => set('time', d.time === v ? '' : v)} />
        {groupErr('time')}
      </div>
      <List strong inset className={listClass}>
        <ListInput
          label={
            <FieldLabel htmlFor={f.fid('social')} optional>
              Instagram o sito
            </FieldLabel>
          }
          input={<input id={f.fid('social')} value={d.social} onChange={(e) => set('social', e.target.value)} placeholder="@iltuoprofilo oppure www.iltuosito.it" className={inputClass} />}
        />
      </List>
    </div>
  );

  const stepReview = (
    <div className="grid gap-5">
      {title(`Ecco chi sei, ${d.name.trim().split(' ')[0] || 'in breve'}.`, 'Controlla che sia tutto giusto, poi lo mando ad Andrea.')}
      <div className="slab overflow-hidden !rounded-[26px]">
        <dl className="divide-y divide-ink/[0.08] px-5">
          {teamLines(d).map(([k, v]) => (
            <div key={k} className="grid grid-cols-[9em_1fr] gap-3 py-3 text-[14.5px]">
              <dt className="text-ink-mute">{k}</dt>
              <dd className="whitespace-pre-wrap font-[600] text-ink">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="flex flex-wrap gap-x-4 gap-y-1 border-t border-ink/10 px-5 py-3 text-[14px] font-[700] text-forest">
          {STEP_TITLES.slice(0, 3).map((t, i) => (
            <button key={t} type="button" onClick={() => f.go(i)} className="underline-offset-2 hover:underline">
              Modifica: {t.toLowerCase()}
            </button>
          ))}
        </div>
      </div>
      {f.failed && (
        <div role="alert" className="slab slab-blush !rounded-[22px] p-5">
          <p className="text-[15.5px] font-[750] text-ink">Non sono riuscito a inviarlo da qui.</p>
          <p className="mt-1 text-[14.5px] text-ink-soft">Mandalo in un altro modo, il testo è già pronto:</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a className="btn btn-sm" href={mailtoLink(teamSubject(d), waText, EMAIL_PARTNER)}>
              <Mail size={15} aria-hidden /> Email
            </a>
            <a className="btn btn-ghost btn-sm" href={waLink(waText)} target="_blank" rel="noopener" onClick={() => f.setSent('whatsapp')}>
              <WhatsAppIcon size={15} /> WhatsApp
            </a>
            <a className="btn btn-ghost btn-sm" href={`tel:${PHONE}`}>
              <Phone size={15} aria-hidden /> {PHONE_DISPLAY}
            </a>
          </div>
        </div>
      )}
      <p className="px-1 text-[12.5px] leading-relaxed text-ink-mute">
        Nessuna newsletter, nessuno spam: uso questi dati solo per ricontattarti.
      </p>
    </div>
  );

  const stepSent = (
    <div className="grid justify-items-center gap-4 py-4 text-center">
      <span data-success-check className="grid h-20 w-20 place-items-center rounded-full border border-white/80 bg-sage text-cream-ink shadow-[var(--shadow-sage-l)]">
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M5 12.5 10 17 19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <h3 ref={titleRef} tabIndex={-1} className="text-[30px] leading-[1.02] tracking-[-0.03em] text-ink outline-none">
        Messaggio arrivato.
      </h3>
      <p className="max-w-[24em] text-[16px] leading-relaxed text-ink-soft">
        Grazie, {d.name.trim().split(' ')[0] || 'davvero'}. Ti ricontatto io per un primo confronto, senza impegno: ti racconto
        come funziona il Team e capiamo insieme se fa per te.
      </p>
      <p className="font-[family-name:var(--font-script)] text-[26px] text-peach-deep">— Andrea</p>
    </div>
  );

  return (
    <div data-flow-root className="slab k-ios scroll-mt-24 overflow-hidden !rounded-[30px] !bg-cream/90 shadow-[var(--shadow-peach-l)]">
      <div className="pt-3">{header}</div>
      <div ref={bodyRef} className="px-4 pb-4 pt-2">
        <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden value={f.company} onChange={(e) => f.setCompany(e.target.value)} className="absolute -left-[9999px] h-px w-px opacity-0" />
        {sent ? stepSent : [stepWho, stepPath, stepProject, stepReview][step]}
      </div>
      <div className="px-4 pb-5 pt-1">
        {sent ? (
          <a className="btn btn-block" href={waLink('Ciao Andrea! Ti ho appena scritto dal sito per entrare nel Team.')} target="_blank" rel="noopener">
            <WhatsAppIcon size={16} /> Scrivimi anche su WhatsApp
          </a>
        ) : step < 3 ? (
          <button type="button" className="btn btn-lg btn-block" onClick={f.next}>
            Continua <ArrowIcon size={16} />
          </button>
        ) : (
          <button type="button" className="btn btn-lg btn-block" onClick={f.submit} disabled={f.sending} aria-busy={f.sending}>
            {f.sending ? (
              <>
                <Preloader className="!h-5 !w-5 !text-ink" /> Invio in corso…
              </>
            ) : (
              <>
                Invia il messaggio <ArrowIcon size={16} />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
