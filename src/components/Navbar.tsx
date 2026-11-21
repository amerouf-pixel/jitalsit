import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { PageId } from '../types/jitalx';

const PRIMARY_LINKS: { id: PageId; label: string }[] = [
  { id: 'decouvrir', label: 'Découvrir' },
  { id: 'fonctionnalites', label: 'Fonctionnalités' },
  { id: 'videos', label: 'Vidéos' },
  { id: 'streamer-studio', label: 'Streamer Studio' },
];

export function Navbar() {
  const { currentPage, navigate, user, isAdmin } = useSite();
  const [moreOpen, setMoreOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setMoreOpen(false);
      }
    }
    function handleEsc(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setMoreOpen(false);
        setMobileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const secondaryLinks: { id: PageId; label: string }[] = [
    { id: 'tarifs', label: 'Tarifs · 7 €' },
    { id: 'actualites', label: 'Actualités' },
    { id: 'assistance', label: 'Assistance & FAQ' },
    user
      ? { id: 'membre', label: 'Espace membre' }
      : { id: 'connexion', label: 'Connexion / Inscription' },
    { id: 'admin', label: isAdmin ? 'Administration (Actif)' : 'Administration' },
  ];

  const isSecondaryActive = secondaryLinks.some((item) => item.id === currentPage);

  const handleNav = (page: PageId) => {
    navigate(page);
    setMoreOpen(false);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 h-16 bg-[#09090F]/92 backdrop-blur-md border-b border-white/8">
      <div className="max-w-7xl mx-auto h-full px-5 sm:px-8 flex items-center justify-between gap-8">
        {/* Zone 1: Single-element Brand Wordmark */}
        <a
          href="#accueil"
          onClick={(e) => {
            e.preventDefault();
            handleNav('accueil');
          }}
          className="font-display text-xl font-bold tracking-tight text-white hover:text-[#22D3EE] transition-colors whitespace-nowrap shrink-0"
        >
          JITALX
        </a>

        {/* Zone 2: 5 concise single-line navigation controls */}
        <nav
          aria-label="Navigation principale"
          className="hidden lg:flex items-center gap-7 text-sm font-medium"
        >
          {PRIMARY_LINKS.map((item) => {
            const active = currentPage === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNav(item.id);
                }}
                aria-current={active ? 'page' : undefined}
                className={`py-1 whitespace-nowrap shrink-0 transition-colors border-b ${
                  active
                    ? 'text-white border-[#EC4899]'
                    : 'text-zinc-400 border-transparent hover:text-white hover:border-white/30'
                }`}
              >
                {item.label}
              </a>
            );
          })}

          <div ref={moreRef} className="relative">
            <button
              type="button"
              onClick={() => setMoreOpen((open) => !open)}
              aria-expanded={moreOpen}
              aria-haspopup="menu"
              className={`inline-flex items-center gap-1.5 py-1 whitespace-nowrap shrink-0 transition-colors border-b ${
                isSecondaryActive || moreOpen
                  ? 'text-white border-[#22D3EE]'
                  : 'text-zinc-400 border-transparent hover:text-white hover:border-white/30'
              }`}
            >
              <span>Plus</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-150 ${
                  moreOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {moreOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-3 w-56 rounded-xl bg-[#13121E] border border-white/10 shadow-2xl py-2"
              >
                {secondaryLinks.map((item) => {
                  const active = currentPage === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="menuitem"
                      onClick={() => handleNav(item.id)}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors whitespace-nowrap ${
                        active
                          ? 'text-white bg-white/8 font-medium'
                          : 'text-zinc-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Zone 3: Single Primary Action + Mobile Menu Trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleNav('tarifs')}
            className="px-4 py-2 text-sm font-semibold text-white bg-[#EC4899] hover:bg-[#DB2777] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Accès 7 €
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={mobileOpen}
            className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg border border-white/10 text-zinc-200 hover:text-white hover:bg-white/5 transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-x-0 top-16 bottom-0 bg-[#09090F]/98 backdrop-blur-lg border-t border-white/8 overflow-y-auto px-6 py-6 z-50">
          <nav aria-label="Navigation mobile" className="flex flex-col gap-1">
            {[
              { id: 'accueil' as PageId, label: 'Accueil' },
              ...PRIMARY_LINKS,
              ...secondaryLinks,
            ].map((item) => {
              const active = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNav(item.id)}
                  className={`w-full text-left px-4 py-3.5 rounded-lg text-base font-medium transition-colors ${
                    active
                      ? 'bg-[#181628] text-white border border-white/10'
                      : 'text-zinc-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
