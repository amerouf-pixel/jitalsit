import { ArrowUpRight, Check, Info } from 'lucide-react';
import { useSite } from '../context/SiteContext';

export function PricingPage() {
  const { siteCopy, navigate } = useSite();

  const includedItems = [
    'Espace de travail et tableau de bord tactique',
    'Missions, progression, objets de collection, objectifs et trophées',
    'Garage et personnalisation des véhicules',
    'Carte interactive radar 360° et marqueurs personnalisés',
    'Carnet de notes et statistiques de session',
    'Streamer Studio avec modes Chroma, Transparent OBS et Sunset Néon',
    'Overlays aux formats 16:9 et 9:16 et Mode Capture Propre (touche H)',
    'Widgets mission, compteur de défi, chat HUD, alertes manuelles et chronomètre',
    'Générateur d’URL pour Source Navigateur OBS',
    'Exportation et importation des sauvegardes JSON',
    'Profils personnalisés et sauvegardes Cloud',
  ];

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-14 sm:py-20 space-y-14">
      <header className="max-w-2xl space-y-4">
        <p className="text-xs font-medium text-[#22D3EE]">Tarification officielle et transparente</p>
        <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white leading-[1.08]">
          Une seule formule claire : accès complet à 7 €.
        </h1>
        <p className="text-base text-zinc-300 leading-relaxed">
          Pas de grille complexe ni d’abonnement caché. Vous réglez une seule fois via la page
          officielle Gumroad pour accéder à l’ensemble des fonctionnalités actuelles de JITALX.
        </p>
      </header>

      {/* Main Offer Card */}
      <section className="rounded-2xl border border-white/12 bg-[#12111C] p-8 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5 flex flex-col justify-between gap-6 lg:border-r lg:border-white/10 lg:pr-8">
          <div className="space-y-4">
            <p className="text-xs font-mono text-[#22D3EE]">Licence officielle Gumroad</p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
              {siteCopy.pricingHeadline}
            </h2>
            <div className="flex items-baseline gap-2 pt-2">
              <span className="font-display text-5xl font-bold text-white tabular-nums">7 €</span>
              <span className="text-sm text-zinc-400">paiement unique</span>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed">{siteCopy.pricingNote}</p>
          </div>

          <div className="space-y-3">
            <a
              href={siteCopy.gumroadUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="gumroad-checkout-link"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 text-sm font-semibold text-white bg-[#EC4899] hover:bg-[#DB2777] rounded-lg transition-colors whitespace-nowrap"
            >
              <span>Acheter sur Gumroad — 7 €</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
            <p className="text-xs text-zinc-500 text-center font-mono break-all">
              {siteCopy.gumroadUrl}
            </p>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-5">
          <h3 className="text-sm font-semibold text-white">
            Inclus dans l’accès complet JITALX
          </h3>
          <ul className="space-y-3">
            {includedItems.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-zinc-300">
                <Check className="w-4 h-4 text-[#22D3EE] mt-0.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Explicit Transparency Notice */}
      <section className="rounded-xl border border-amber-400/20 bg-amber-500/6 p-6 sm:p-7 space-y-3">
        <div className="flex items-center gap-2.5 text-sm font-semibold text-amber-200">
          <Info className="w-4 h-4 shrink-0" />
          <span>Précisions importantes avant achat</span>
        </div>
        <ul className="space-y-2 text-sm text-zinc-300 leading-relaxed">
          <li>
            Les abonnements mensuels Stripe et l’activation automatique de formule Pro ne sont pas
            encore opérationnels et ne sont pas commercialisés ici.
          </li>
          <li>
            Les alertes du Streamer Studio fonctionnent aujourd’hui en déclenchement manuel : les
            alertes automatiques Twitch/YouTube et la connexion OBS WebSocket ne sont pas encore
            connectées.
          </li>
        </ul>
        <div className="pt-2">
          <button
            type="button"
            onClick={() => navigate('assistance')}
            className="text-xs font-medium text-[#22D3EE] hover:text-white transition-colors cursor-pointer"
          >
            Une question avant de commander ? Consulter la FAQ ou nous contacter
          </button>
        </div>
      </section>
    </div>
  );
}
