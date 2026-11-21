import { useState } from 'react';
import { ArrowUpRight, Check, Play } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { REAL_FEATURES } from '../data/catalog';
import { MediaFrame } from '../components/MediaFrame';
import { FeatureModuleSpec } from '../types/jitalx';

type FilterGroup = 'all' | FeatureModuleSpec['group'];

const FILTER_TABS: { id: FilterGroup; label: string }[] = [
  { id: 'all', label: 'Tous les modules (15)' },
  { id: 'commandement', label: 'Commandement & Carte' },
  { id: 'progression', label: 'Missions, Garage & Trophées' },
  { id: 'streamer', label: 'Streamer Studio & OBS' },
  { id: 'donnees', label: 'JSON & Profils Cloud' },
];

export function FeaturesPage() {
  const { navigate, siteCopy, setSelectedVideoCode } = useSite();
  const [activeGroup, setActiveGroup] = useState<FilterGroup>('all');

  const visibleFeatures =
    activeGroup === 'all'
      ? REAL_FEATURES
      : REAL_FEATURES.filter((feat) => feat.group === activeGroup);

  const openRelatedVideo = (code: string) => {
    setSelectedVideoCode(code);
    navigate('videos');
  };

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 sm:py-20 space-y-14">
      <header className="max-w-3xl space-y-4">
        <p className="text-xs font-medium text-[#22D3EE]">Fonctionnalités réelles de JITALX</p>
        <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white leading-[1.08]">
          Les 15 modules de votre centre de commande, illustrés sans artifice.
        </h1>
        <p className="text-base text-zinc-300 leading-relaxed">
          Chaque fiche présente une fonctionnalité réellement présente dans JITALX, illustrée à
          partir des captures authentiques de l’application et reliée à sa séquence vidéo dédiée.
        </p>
      </header>

      {/* Interactive Filter Segmented Bar */}
      <div
        role="tablist"
        aria-label="Filtrer les fonctionnalités par domaine"
        className="flex flex-wrap items-center gap-2 p-1.5 rounded-xl bg-[#11101B] border border-white/10 w-fit"
      >
        {FILTER_TABS.map((tab) => {
          const active = activeGroup === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setActiveGroup(tab.id)}
              className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                active
                  ? 'bg-[#EC4899] text-white'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Feature List */}
      <div className="space-y-8">
        {visibleFeatures.map((feature, idx) => {
          const reverse = idx % 2 === 1;
          return (
            <article
              key={feature.id}
              className="rounded-2xl border border-white/10 bg-[#11101B] p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              <div
                className={`lg:col-span-6 space-y-4 ${
                  reverse ? 'lg:order-2' : 'lg:order-1'
                }`}
              >
                <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
                  <span className="text-[#22D3EE]">{feature.number}.</span>
                  <span aria-hidden="true">·</span>
                  <span>Séquence vidéo {feature.relatedVideoCode}</span>
                </div>

                <h2 className="font-display text-2xl sm:text-3xl font-semibold text-white">
                  {feature.title}
                </h2>

                <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                  {feature.summary}
                </p>

                <ul className="space-y-2.5 pt-1">
                  {feature.details.map((detail) => (
                    <li
                      key={detail}
                      className="flex items-start gap-2.5 text-sm text-zinc-400"
                    >
                      <Check className="w-4 h-4 text-[#22D3EE] mt-0.5 shrink-0" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>

                {feature.transparencyNote && (
                  <p className="text-xs text-amber-300/90 bg-amber-500/8 border border-amber-400/20 rounded-lg px-4 py-3 leading-relaxed">
                    {feature.transparencyNote}
                  </p>
                )}

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={() => openRelatedVideo(feature.relatedVideoCode)}
                    className="inline-flex items-center gap-2 text-sm font-medium text-[#22D3EE] hover:text-white transition-colors cursor-pointer"
                  >
                    <Play className="w-4 h-4" />
                    <span>Voir la démonstration (Séquence {feature.relatedVideoCode})</span>
                  </button>
                </div>
              </div>

              <div className={`lg:col-span-6 ${reverse ? 'lg:order-1' : 'lg:order-2'}`}>
                <MediaFrame
                  src={feature.screenshotUrl}
                  alt={feature.screenshotAlt}
                  fit={feature.screenshotUrl.includes('Capture_d__cran') ? 'contain' : 'cover'}
                />
              </div>
            </article>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <section className="rounded-2xl border border-white/10 bg-[#12111C] p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <h2 className="font-display text-2xl font-bold text-white">
            Tous ces modules dans une seule licence à 7 €
          </h2>
          <p className="text-sm text-zinc-400">
            Accès complet JITALX disponible immédiatement en paiement unique sur Gumroad.
          </p>
        </div>
        <a
          href={siteCopy.gumroadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-[#EC4899] hover:bg-[#DB2777] rounded-lg transition-colors whitespace-nowrap shrink-0"
        >
          <span>Obtenir JITALX · 7 €</span>
          <ArrowUpRight className="w-4 h-4" />
        </a>
      </section>
    </div>
  );
}
