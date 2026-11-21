import { ArrowUpRight } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { PageId } from '../types/jitalx';
import { DiscordIcon } from './DiscordIcon';
import { DISCORD_INVITE_URL } from '../utils/validation';
import { getLocaleStrings } from '../i18n/locale';

export function Footer() {
  const { navigate, siteCopy, user } = useSite();
  const locale = getLocaleStrings('fr');

  const linkGroups: { title: string; links: { id: PageId; label: string }[] }[] = [
    {
      title: 'Plateforme',
      links: [
        { id: 'accueil', label: 'Accueil' },
        { id: 'decouvrir', label: 'Découvrir JITALX' },
        { id: 'fonctionnalites', label: 'Fonctionnalités' },
        { id: 'streamer-studio', label: 'Streamer Studio' },
      ],
    },
    {
      title: 'Contenus & Offre',
      links: [
        { id: 'videos', label: 'Bibliothèque Vidéos' },
        { id: 'tarifs', label: 'Tarifs · 7 €' },
        { id: 'actualites', label: 'Actualités' },
        { id: 'assistance', label: 'Assistance & FAQ' },
      ],
    },
    {
      title: 'Compte',
      links: [
        user
          ? { id: 'membre', label: 'Espace membre' }
          : { id: 'connexion', label: 'Connexion & Inscription' },
        { id: 'membre', label: 'Profil & Paramètres' },
        { id: 'admin', label: 'Administration' },
      ],
    },
  ];

  return (
    <footer className="border-t border-white/8 bg-[#07070C] mt-24">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-white/8">
          <div className="md:col-span-5 space-y-4">
            <a
              href="#accueil"
              onClick={(e) => {
                e.preventDefault();
                navigate('accueil');
              }}
              className="font-display text-2xl font-bold tracking-tight text-white inline-block"
            >
              JITALX
            </a>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-md">
              Site officiel, vitrine commerciale et studio vidéo de JITALX — le centre de
              commande numérique conçu pour les gamers et les streamers.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href={siteCopy.gumroadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-[#22D3EE] hover:text-white transition-colors"
              >
                <span>Accès complet JITALX sur Gumroad (7 €)</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>

              <a
                href={DISCORD_INVITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-[#5865F2] hover:bg-[#4752C4] rounded-lg transition-colors whitespace-nowrap"
              >
                <DiscordIcon className="w-4 h-4 shrink-0" />
                <span>{locale.joinDiscordCommunity}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {linkGroups.map((group) => (
              <div key={group.title} className="space-y-3">
                <h2 className="text-sm font-semibold text-white">{group.title}</h2>
                <ul className="space-y-2.5">
                  {group.links.map((item) => (
                    <li key={`${group.title}-${item.id}`}>
                      <a
                        href={`#${item.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(item.id);
                        }}
                        className="text-sm text-zinc-400 hover:text-white transition-colors"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© 2026 JITALX · 10JITAL Production. Tous droits réservés.</p>
          <p>
            Alertes actuelles manuelles · Sans abonnement mensuel Stripe actif · Paiement unique 7 €
            via Gumroad.
          </p>
        </div>
      </div>
    </footer>
  );
}
