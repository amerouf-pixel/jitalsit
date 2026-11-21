import React, { useState } from 'react';
import { CheckCircle2, ChevronDown } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { DEFAULT_FAQ_ENTRIES } from '../data/catalog';
import { ContactTopic } from '../types/jitalx';
import { ALLOWED_CONTACT_TOPICS, validateContactForm } from '../utils/validation';

export function SupportPage() {
  const { user, profile, submitContactRequest, navigate } = useSite();
  const [openFaqId, setOpenFaqId] = useState<string>(DEFAULT_FAQ_ENTRIES[0].id);

  const [name, setName] = useState(profile?.displayName || user?.displayName || '');
  const [email, setEmail] = useState(profile?.email || user?.email || '');
  const [topic, setTopic] = useState<ContactTopic>('Achat & Licence 7 €');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submittedNotice, setSubmittedNotice] = useState<{
    persistedToCloud: boolean;
  } | null>(null);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmittedNotice(null);

    const check = validateContactForm({ name, email, topic, message });
    if (!check.valid) {
      setErrors(check.errors);
      return;
    }

    setErrors({});
    setSubmitting(true);
    try {
      const result = await submitContactRequest({ name, email, topic, message });
      setSubmittedNotice(result);
      setMessage('');
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Impossible d’envoyer votre message pour le moment.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 sm:py-20 space-y-16">
      <header className="max-w-3xl space-y-4">
        <p className="text-xs font-medium text-[#22D3EE]">Assistance &amp; Questions fréquentes</p>
        <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white leading-[1.08]">
          Besoin d’aide avec JITALX ou OBS Studio ?
        </h1>
        <p className="text-base text-zinc-300 leading-relaxed">
          Consultez nos réponses directes sur la licence Gumroad à 7 €, l’intégration OBS et la
          sauvegarde de vos données, ou écrivez-nous via le formulaire ci-dessous.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* FAQ Accordion */}
        <section className="lg:col-span-6 space-y-4" aria-label="Questions fréquentes">
          <h2 className="font-display text-2xl font-semibold text-white">Questions fréquentes</h2>

          <div className="divide-y divide-white/10 border-t border-b border-white/10">
            {DEFAULT_FAQ_ENTRIES.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div key={faq.id} className="py-4">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaqId(isOpen ? '' : faq.id)}
                    className="w-full flex items-center justify-between gap-4 text-left py-1 cursor-pointer"
                  >
                    <div>
                      <p className="text-xs text-[#22D3EE] mb-1">{faq.category}</p>
                      <span className="text-sm sm:text-base font-medium text-white">
                        {faq.question}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform ${
                        isOpen ? 'rotate-180 text-white' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <p className="pt-3 pr-6 text-sm text-zinc-400 leading-relaxed">{faq.answer}</p>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Contact Form */}
        <section
          className="lg:col-span-6 rounded-2xl border border-white/10 bg-[#12111C] p-7 sm:p-8 space-y-6"
          aria-label="Formulaire de contact"
        >
          <div className="space-y-1.5">
            <h2 className="font-display text-2xl font-semibold text-white">Nous contacter</h2>
            <p className="text-sm text-zinc-400">
              {user
                ? 'Connecté : votre demande sera enregistrée dans votre espace membre et transmise à l’administration.'
                : 'Vous pouvez envoyer une demande ci-dessous. Connectez-vous pour la synchroniser dans votre espace membre et l’administration Firebase.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="contact-name" className="block text-xs font-medium text-zinc-300">
                  Nom ou pseudo
                </label>
                <input
                  id="contact-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={100}
                  placeholder="Ex. Alex_Live"
                  className="w-full rounded-lg bg-[#0A0912] border border-white/12 px-3.5 py-2.5 text-sm text-white"
                />
                {errors.name && (
                  <p role="alert" className="text-xs text-rose-400">
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="contact-email" className="block text-xs font-medium text-zinc-300">
                  Adresse e-mail
                </label>
                <input
                  id="contact-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  maxLength={200}
                  placeholder="vous@exemple.fr"
                  className="w-full rounded-lg bg-[#0A0912] border border-white/12 px-3.5 py-2.5 text-sm text-white"
                />
                {errors.email && (
                  <p role="alert" className="text-xs text-rose-400">
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="contact-topic" className="block text-xs font-medium text-zinc-300">
                Sujet de votre demande
              </label>
              <select
                id="contact-topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value as ContactTopic)}
                className="w-full rounded-lg bg-[#0A0912] border border-white/12 px-3.5 py-2.5 text-sm text-white"
              >
                {ALLOWED_CONTACT_TOPICS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              {errors.topic && (
                <p role="alert" className="text-xs text-rose-400">
                  {errors.topic}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="contact-message" className="block text-xs font-medium text-zinc-300">
                Votre message
              </label>
              <textarea
                id="contact-message"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={2000}
                placeholder="Décrivez votre question ou votre configuration OBS..."
                className="w-full rounded-lg bg-[#0A0912] border border-white/12 px-3.5 py-2.5 text-sm text-white resize-y"
              />
              {errors.message && (
                <p role="alert" className="text-xs text-rose-400">
                  {errors.message}
                </p>
              )}
            </div>

            {submitError && (
              <p
                role="alert"
                className="text-xs text-rose-300 bg-rose-500/10 border border-rose-400/25 rounded-lg px-3.5 py-2.5"
              >
                {submitError}
              </p>
            )}

            {submittedNotice && (
              <div
                role="status"
                className="rounded-xl border border-emerald-400/25 bg-emerald-500/10 p-4 flex items-start gap-3 text-xs text-emerald-200 leading-relaxed"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-white">Votre demande a bien été enregistrée.</p>
                  {submittedNotice.persistedToCloud ? (
                    <p>
                      Elle est synchronisée dans Firestore et visible depuis votre espace membre
                      ainsi que par l’équipe d’administration.
                    </p>
                  ) : (
                    <p>
                      Demande enregistrée dans votre session actuelle.{' '}
                      <button
                        type="button"
                        onClick={() => navigate('connexion')}
                        className="underline text-white cursor-pointer"
                      >
                        Connectez-vous avec Firebase
                      </button>{' '}
                      pour synchroniser vos prochains tickets dans le Cloud.
                    </p>
                  )}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-5 text-sm font-semibold bg-[#EC4899] hover:bg-[#DB2777] text-white rounded-lg transition-colors disabled:opacity-60 cursor-pointer"
            >
              {submitting ? 'Envoi en cours...' : 'Envoyer la demande'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
