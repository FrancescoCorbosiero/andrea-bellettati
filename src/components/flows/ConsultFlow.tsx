'use client';

import type { ReactNode } from 'react';
import { List, ListInput, ListItem, Preloader, Toggle } from 'konsta/react';
import { Cat, ChevronLeft, Dog, Mail, Phone, RotateCcw, X } from 'lucide-react';
import { ArrowIcon, WhatsAppIcon } from '@/components/icons';
import {
  AGES,
  CALL_TIMES,
  CONCERNS,
  DIETS,
  EMPTY_CONSULT,
  SIZES,
  consultLines,
  consultSubject,
  consultWhatsAppText,
  isEmail,
  isPhone,
  type ConsultDraft,
} from '@/lib/forms';
import { EMAIL_CONSULENZE, PHONE, PHONE_DISPLAY, mailtoLink, waLink } from '@/lib/site';
import { ChipGroup, ChoiceCards, FieldError, FieldLabel, GroupTitle, PetTag, PrivacyNote, SegmentedChoice, StepBar, inputClass, listClass } from './fields';
import { useFlow, type Errors, type Variant } from './useFlow';

type Field = 'species' | 'petName' | 'concerns' | 'name' | 'phone' | 'email';

const STEP_TITLES = ['Il tuo animale', 'La ciotola', 'I tuoi contatti', 'Riepilogo'] as const;

function validate(step: number, d: ConsultDraft): Errors<Field> {
  const e: Errors<Field> = {};
  if (step === 0) {
    if (!d.species) e.species = 'Scegli se è un cane o un gatto.';
    if (!d.petName.trim()) e.petName = 'Scrivi come si chiama: lo uso nella sua scheda.';
  }
  if (step === 1 && d.concerns.length === 0 && d.story.trim().length < 5) {
    e.concerns = 'Scegli almeno una voce, oppure raccontamelo in due righe.';
  }
  if (step === 2) {
    if (d.name.trim().length < 2) e.name = 'Scrivi nome e cognome.';
    if (!isPhone(d.phone)) e.phone = 'Mi serve un numero valido per richiamarti.';
    if (d.email.trim() && !isEmail(d.email)) e.email = 'Controlla l’indirizzo email.';
  }
  return e;
}

export type FlowParts = { header: ReactNode; body: ReactNode; footer: ReactNode };

/**
 * Il questionario della consulenza gratuita: animale → ciotola → contatti
 * → riepilogo, poi la richiesta parte per email (e, se si vuole, anche su
 * WhatsApp). Non disegna niente da solo: l'ospite (foglio dal basso sul
 * telefono, pannello sul desktop, scheda nella pagina) riceve testata,
 * corpo e barra delle azioni e li impagina.
 */
export default function ConsultFlow({
  variant,
  handoff,
  onClose,
  children,
}: {
  variant: Variant;
  handoff?: Partial<ConsultDraft>;
  onClose?: () => void;
  children: (parts: FlowParts) => ReactNode;
}) {
  const { flow: f, bodyRef, titleRef } = useFlow<ConsultDraft, Field>({
    storageKey: 'ab:consulenza',
    empty: EMPTY_CONSULT,
    handoff,
    steps: 4,
    variant,
    validate,
    toPayload: (d) => ({
      kind: 'consulenza',
      species: d.species || 'cane',
      petName: d.petName.trim(),
      age: d.age,
      size: d.species === 'cane' ? d.size : '',
      diet: d.diet,
      concerns: d.concerns,
      story: d.story.trim(),
      name: d.name.trim(),
      phone: d.phone.trim(),
      email: d.email.trim(),
      callTime: d.callTime,
      whatsappOk: d.whatsappOk,
    }),
  });
  const { draft: d, step, sent } = f;
  const pet = d.petName.trim() || (d.species === 'gatto' ? 'il tuo gatto' : d.species === 'cane' ? 'il tuo cane' : 'il tuo animale');
  const waText = consultWhatsAppText(d);
  const mailto = mailtoLink(consultSubject(d), waText, EMAIL_CONSULENZE);

  /* ── testata: indietro, titolo, chiudi, avanzamento ─────────────── */
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
          <p className="text-[15px] font-[750] leading-tight text-ink">Consulenza gratuita</p>
          <p className="text-[12.5px] text-ink-mute" aria-live="polite">
            {sent ? 'Richiesta inviata' : `Passo ${step + 1} di 4 · ${STEP_TITLES[step]}`}
          </p>
        </div>
        {onClose ? (
          <button type="button" onClick={onClose} className="icon-btn !h-10 !w-10" aria-label="Chiudi il questionario">
            <X size={19} aria-hidden />
          </button>
        ) : (
          <span className="w-10" />
        )}
      </div>
      <StepBar count={STEP_TITLES.length} step={step} done={!!sent} />
    </div>
  );

  /* ── corpo: un passo alla volta ─────────────────────────────────── */
  const title = (text: ReactNode, sub?: ReactNode) => (
    <div className="mb-5 px-1">
      <h3 ref={titleRef} tabIndex={-1} className="text-[27px] leading-[1.05] tracking-[-0.025em] text-ink outline-none">
        {text}
      </h3>
      {sub && <p className="mt-2 text-[15px] leading-snug text-ink-mute">{sub}</p>}
    </div>
  );

  const stepPet = (
    <div className="grid gap-6">
      {title('Parlami del tuo animale.', 'Due tocchi e il nome: il resto lo vediamo insieme al telefono.')}
      <div>
        <GroupTitle id={f.fid('species-t')}>È un cane o un gatto?</GroupTitle>
        <ChoiceCards
          labelledBy={f.fid('species-t')}
          value={d.species}
          onChange={(v) => f.set('species', v)}
          options={[
            { value: 'cane', label: 'Cane', icon: <Dog size={30} strokeWidth={1.7} aria-hidden /> },
            { value: 'gatto', label: 'Gatto', icon: <Cat size={30} strokeWidth={1.7} aria-hidden /> },
          ]}
        />
        {f.errors.species && (
          <p role="alert" className="mt-2 px-1 text-[13.5px] text-peach-deep" data-field="species" tabIndex={-1}>
            {f.errors.species}
          </p>
        )}
      </div>
      <div className="grid items-center gap-4 sm:grid-cols-[auto_1fr]">
        <PetTag name={d.petName} species={d.species} />
        <List strong inset className={listClass}>
          <ListInput
            label={<FieldLabel htmlFor={f.fid('petName')}>Come si chiama?</FieldLabel>}
            error={f.errors.petName ? <FieldError id={`${f.fid('petName')}-error`} message={f.errors.petName} /> : undefined}
            input={
              <input
                id={f.fid('petName')}
                data-field="petName"
                value={d.petName}
                onChange={(e) => f.set('petName', e.target.value)}
                autoComplete="off"
                autoCapitalize="words"
                enterKeyHint="next"
                maxLength={40}
                placeholder={d.species === 'gatto' ? 'Es. Micio' : 'Es. Birba'}
                className={inputClass}
                onKeyDown={(e) => e.key === 'Enter' && f.next()}
                {...f.aria('petName')}
              />
            }
          />
        </List>
      </div>
      <div>
        <GroupTitle id={f.fid('age-t')} hint="facoltativo">
          Quanti anni ha?
        </GroupTitle>
        <SegmentedChoice labelledBy={f.fid('age-t')} options={AGES} value={d.age} onChange={(v) => f.set('age', v)} />
      </div>
      {d.species === 'cane' && (
        <div>
          <GroupTitle id={f.fid('size-t')} hint="facoltativo">
            Di che taglia?
          </GroupTitle>
          <SegmentedChoice labelledBy={f.fid('size-t')} options={SIZES} value={d.size} onChange={(v) => f.set('size', v)} />
        </div>
      )}
    </div>
  );

  const stepBowl = (
    <div className="grid gap-6">
      {title(
        <>
          Cosa c’è nella ciotola di <span className="text-peach-deep">{pet}</span>?
        </>,
        'Non serve essere precisi: mi basta capire da dove partiamo.',
      )}
      <div>
        <GroupTitle id={f.fid('diet-t')} hint="anche più di una">
          Cosa mangia oggi
        </GroupTitle>
        <ChipGroup labelledBy={f.fid('diet-t')} options={DIETS} values={d.diet} onToggle={(v) => f.toggle('diet', v)} />
      </div>
      <div>
        <GroupTitle id={f.fid('concerns-t')} hint="anche più di una">
          Cosa ti preoccupa
        </GroupTitle>
        <ChipGroup
          labelledBy={f.fid('concerns-t')}
          options={CONCERNS}
          values={d.concerns}
          onToggle={(v) => f.toggle('concerns', v)}
        />
        {f.errors.concerns && (
          <p role="alert" className="mt-2 px-1 text-[13.5px] text-peach-deep" data-field="concerns" tabIndex={-1}>
            {f.errors.concerns}
          </p>
        )}
      </div>
      <List strong inset className={listClass}>
        <ListInput
          label={
            <FieldLabel htmlFor={f.fid('story')} optional>
              Raccontamelo in due righe
            </FieldLabel>
          }
          input={
            <textarea
              id={f.fid('story')}
              value={d.story}
              onChange={(e) => f.set('story', e.target.value)}
              rows={3}
              maxLength={1500}
              placeholder="Da quando succede, cosa hai già provato, cosa ti ha detto il veterinario…"
              className={`${inputClass} h-auto resize-none py-2`}
            />
          }
        />
      </List>
    </div>
  );

  const stepContact = (
    <div className="grid gap-6">
      {title('Come ti ricontatto?', 'Ti chiamo io, per fissare i 45 minuti quando ti è comodo.')}
      <List strong inset className={listClass}>
        <ListInput
          label={<FieldLabel htmlFor={f.fid('name')}>Nome e cognome</FieldLabel>}
          error={f.errors.name ? <FieldError id={`${f.fid('name')}-error`} message={f.errors.name} /> : undefined}
          input={
            <input
              id={f.fid('name')}
              data-field="name"
              value={d.name}
              onChange={(e) => f.set('name', e.target.value)}
              autoComplete="name"
              enterKeyHint="next"
              placeholder="Es. Giulia Bianchi"
              className={inputClass}
              {...f.aria('name')}
            />
          }
        />
        <ListInput
          label={<FieldLabel htmlFor={f.fid('phone')}>Telefono</FieldLabel>}
          error={f.errors.phone ? <FieldError id={`${f.fid('phone')}-error`} message={f.errors.phone} /> : undefined}
          input={
            <input
              id={f.fid('phone')}
              data-field="phone"
              type="tel"
              inputMode="tel"
              value={d.phone}
              onChange={(e) => f.set('phone', e.target.value)}
              autoComplete="tel"
              enterKeyHint="next"
              placeholder="+39 3xx xxx xxxx"
              className={inputClass}
              {...f.aria('phone')}
            />
          }
        />
        <ListInput
          label={
            <FieldLabel htmlFor={f.fid('email')} optional>
              Email
            </FieldLabel>
          }
          info={f.errors.email ? undefined : 'Se la lasci, ti mando il riepilogo.'}
          error={f.errors.email ? <FieldError id={`${f.fid('email')}-error`} message={f.errors.email} /> : undefined}
          input={
            <input
              id={f.fid('email')}
              data-field="email"
              type="email"
              inputMode="email"
              value={d.email}
              onChange={(e) => f.set('email', e.target.value)}
              autoComplete="email"
              enterKeyHint="done"
              placeholder="nome@esempio.it"
              className={inputClass}
              {...f.aria('email')}
            />
          }
        />
      </List>
      <div>
        <GroupTitle id={f.fid('time-t')} hint="facoltativo">
          Quando preferisci la chiamata?
        </GroupTitle>
        <SegmentedChoice labelledBy={f.fid('time-t')} options={CALL_TIMES} value={d.callTime} onChange={(v) => f.set('callTime', v)} />
      </div>
      <List strong inset className={listClass}>
        <ListItem
          label
          title={
            <span className="inline-flex items-center gap-2">
              <WhatsAppIcon size={17} className="text-[#1fa855]" /> Va bene anche un messaggio WhatsApp
            </span>
          }
          after={
            <Toggle
              checked={d.whatsappOk}
              onChange={() => f.set('whatsappOk', !d.whatsappOk)}
              aria-label="Va bene anche un messaggio WhatsApp"
            />
          }
        />
      </List>
    </div>
  );

  const rows = consultLines(d).filter(([k]) => k !== 'Animale');
  const stepReview = (
    <div className="grid gap-5">
      {title(
        <>
          La scheda di <span className="text-peach-deep">{d.petName.trim() || 'Birba'}</span>.
        </>,
        'Controlla che sia tutto giusto, poi la mando ad Andrea.',
      )}
      <div className="slab overflow-hidden !rounded-[26px]">
        <div className="flex items-center gap-4 border-b border-ink/10 bg-peach-soft/60 px-5 py-4">
          <div className="scale-[0.62] -m-6 shrink-0">
            <PetTag name={d.petName} species={d.species} />
          </div>
          <div className="min-w-0">
            <p className="text-[19px] font-[800] leading-tight tracking-[-0.02em] text-ink">{d.petName.trim() || '—'}</p>
            <p className="text-[14px] text-ink-mute">
              {[
                d.species === 'gatto' ? 'Gatto' : d.species === 'cane' ? 'Cane' : '',
                AGES.find((a) => a.value === d.age)?.label.toLowerCase(),
                d.species === 'cane' && d.size ? `taglia ${d.size}` : '',
              ]
                .filter(Boolean)
                .join(' · ')}
            </p>
          </div>
          <button type="button" onClick={() => f.go(0)} className="ml-auto text-[14px] font-[700] text-forest underline-offset-2 hover:underline">
            Modifica
          </button>
        </div>
        <dl className="divide-y divide-ink/[0.08] px-5">
          {rows.map(([k, v]) => (
            <div key={k} className="grid grid-cols-[8.5em_1fr] gap-3 py-3 text-[14.5px]">
              <dt className="text-ink-mute">{k}</dt>
              <dd className="font-[600] text-ink">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="flex gap-4 border-t border-ink/10 px-5 py-3 text-[14px] font-[700] text-forest">
          <button type="button" onClick={() => f.go(1)} className="underline-offset-2 hover:underline">
            Modifica la ciotola
          </button>
          <button type="button" onClick={() => f.go(2)} className="underline-offset-2 hover:underline">
            Modifica i contatti
          </button>
        </div>
      </div>
      {f.failed && (
        <div role="alert" className="slab slab-blush !rounded-[22px] p-5">
          <p className="text-[15.5px] font-[750] text-ink">Non sono riuscito a mandarla da qui.</p>
          <p className="mt-1 text-[14.5px] text-ink-soft">
            Succede se la rete fa i capricci. Mandala in un altro modo, il testo è già pronto:
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a className="btn btn-sm" href={waLink(waText)} target="_blank" rel="noopener" onClick={() => f.setSent('whatsapp')}>
              <WhatsAppIcon size={15} /> WhatsApp
            </a>
            <a className="btn btn-ghost btn-sm" href={mailto}>
              <Mail size={15} aria-hidden /> Email
            </a>
            <a className="btn btn-ghost btn-sm" href={`tel:${PHONE}`}>
              <Phone size={15} aria-hidden /> {PHONE_DISPLAY}
            </a>
          </div>
        </div>
      )}
      <p className="px-1 text-[12.5px] leading-relaxed text-ink-mute">
        Uso questi dati solo per ricontattarti sulla consulenza: niente newsletter, niente spam.
      </p>
    </div>
  );

  const when = CALL_TIMES.find((c) => c.value === d.callTime)?.label.toLowerCase();
  const stepSent = (
    <div className="grid justify-items-center gap-4 py-4 text-center">
      <span data-success-check className="grid h-20 w-20 place-items-center rounded-full border border-white/80 bg-sage text-cream-ink shadow-[var(--shadow-sage-l)]">
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M5 12.5 10 17 19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <h3 ref={titleRef} tabIndex={-1} className="text-[30px] leading-[1.02] tracking-[-0.03em] text-ink outline-none">
        {sent === 'whatsapp' ? 'Ci sentiamo su WhatsApp.' : `Ricevuto, ${d.name.trim().split(' ')[0] || 'grazie'}!`}
      </h3>
      <p className="max-w-[24em] text-[16px] leading-relaxed text-ink-soft">
        {sent === 'whatsapp'
          ? 'Premi invio su WhatsApp e il messaggio arriva ad Andrea. Ti risponde personalmente.'
          : `Ti richiamo io${when ? ` di ${when}` : ''} al ${d.phone.trim() || 'numero che mi hai lasciato'}, di solito entro 24–48 ore. Nel frattempo pensa a ${pet}: com'è una sua giornata tipo?`}
      </p>
      <p className="font-[family-name:var(--font-script)] text-[26px] text-peach-deep">— Andrea</p>
    </div>
  );

  const body = (
    <div ref={bodyRef} className="px-4 pb-6 pt-2">
      {/* Trappola per i bot: invisibile alle persone. */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        value={f.company}
        onChange={(e) => f.setCompany(e.target.value)}
        className="absolute -left-[9999px] h-px w-px opacity-0"
      />
      {sent ? stepSent : [stepPet, stepBowl, stepContact, stepReview][step]}
    </div>
  );

  /* ── barra delle azioni ─────────────────────────────────────────── */
  const footer = (
    <div className="border-t border-white/70 bg-cream/85 px-4 pb-[calc(env(safe-area-inset-bottom)+14px)] pt-3 backdrop-blur-xl">
      {sent ? (
        <div className="grid gap-2">
          <a className="btn btn-lg btn-block" href={waLink(waText)} target="_blank" rel="noopener">
            <WhatsAppIcon size={17} /> {sent === 'whatsapp' ? 'Riapri WhatsApp' : 'Scrivimi subito su WhatsApp'}
          </a>
          <div className="flex justify-center gap-5 pt-1 text-[14.5px] font-[700] text-forest">
            {onClose && (
              <button type="button" onClick={onClose}>
                Torna al sito
              </button>
            )}
            <button type="button" onClick={f.restart} className="inline-flex items-center gap-1.5">
              <RotateCcw size={14} aria-hidden /> Un altro animale
            </button>
          </div>
        </div>
      ) : step < 3 ? (
        <button type="button" className="btn btn-lg btn-block" onClick={f.next}>
          Continua <ArrowIcon size={16} />
        </button>
      ) : (
        <div className="grid gap-2">
          <button type="button" className="btn btn-lg btn-block" onClick={f.submit} disabled={f.sending} aria-busy={f.sending}>
            {f.sending ? (
              <>
                <Preloader className="!h-5 !w-5 !text-ink" /> Invio in corso…
              </>
            ) : (
              <>
                Invia ad Andrea <ArrowIcon size={16} />
              </>
            )}
          </button>
          <a
            className="inline-flex items-center justify-center gap-2 py-1.5 text-[14.5px] font-[700] text-forest"
            href={waLink(waText)}
            target="_blank"
            rel="noopener"
            onClick={() => {
              f.sendQuietly();
              f.setSent('whatsapp');
            }}
          >
            <WhatsAppIcon size={15} /> Preferisci WhatsApp? Mandala da lì
          </a>
          <PrivacyNote />
        </div>
      )}
    </div>
  );

  return <>{children({ header, body, footer })}</>;
}
