import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { NewsArticleItem, NewsCategory } from '../types/jitalx';

const NEWS_CATEGORIES: (NewsCategory | 'Toutes')[] = [
  'Toutes',
  'Produit',
  'Streamer Studio',
  'Feuille de route',
  'Annonce',
];

export function NewsPage() {
  const { news, navigate } = useSite();
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory | 'Toutes'>('Toutes');
  const [activeArticleId, setActiveArticleId] = useState<string | null>(null);

  const publishedNews = useMemo(
    () => news.filter((item) => item.status === 'published'),
    [news]
  );

  const filteredNews = useMemo(() => {
    if (selectedCategory === 'Toutes') return publishedNews;
    return publishedNews.filter((item) => item.category === selectedCategory);
  }, [publishedNews, selectedCategory]);

  const activeArticle: NewsArticleItem | null =
    publishedNews.find((item) => item.id === activeArticleId) ?? null;

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-14 sm:py-20 space-y-12">
      <header className="max-w-2xl space-y-4">
        <p className="text-xs font-medium text-[#22D3EE]">Journal officiel JITALX</p>
        <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white leading-[1.08]">
          Actualités, sorties produit et feuille de route.
        </h1>
        <p className="text-base text-zinc-300 leading-relaxed">
          Retrouvez les annonces officielles de JITALX, les évolutions du Streamer Studio et nos
          points d’avancement transparents.
        </p>
      </header>

      {activeArticle ? (
        <article className="rounded-2xl border border-white/10 bg-[#12111C] p-7 sm:p-10 space-y-6">
          <button
            type="button"
            onClick={() => setActiveArticleId(null)}
            className="inline-flex items-center gap-2 text-xs font-medium text-[#22D3EE] hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à toutes les actualités</span>
          </button>

          <div className="space-y-2 border-b border-white/10 pb-6">
            <p className="text-xs text-zinc-400">
              <span>{activeArticle.category}</span>
              <span aria-hidden="true"> · </span>
              <span>{activeArticle.publishedLabel}</span>
            </p>
            <h2 className="font-display text-2xl sm:text-4xl font-bold text-white leading-tight">
              {activeArticle.title}
            </h2>
            <p className="text-base text-zinc-300 leading-relaxed pt-1">
              {activeArticle.summary}
            </p>
          </div>

          <div className="text-sm sm:text-base text-zinc-300 leading-relaxed whitespace-pre-line">
            {activeArticle.body}
          </div>
        </article>
      ) : (
        <>
          {/* Category Filter */}
          <div
            role="tablist"
            aria-label="Filtrer les actualités par catégorie"
            className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-[#11101B] border border-white/10 w-fit"
          >
            {NEWS_CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                    active
                      ? 'bg-[#EC4899] text-white'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Articles List */}
          {filteredNews.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-[#11101B] p-8 text-center text-sm text-zinc-400">
              Aucune annonce publiée dans cette catégorie pour le moment.
            </div>
          ) : (
            <div className="divide-y divide-white/10 border-t border-b border-white/10">
              {filteredNews.map((article) => (
                <article
                  key={article.id}
                  className="py-7 flex flex-col sm:flex-row sm:items-start justify-between gap-6"
                >
                  <div className="space-y-2 max-w-2xl">
                    <p className="text-xs text-zinc-400">
                      <span className="text-[#22D3EE]">{article.category}</span>
                      <span aria-hidden="true"> · </span>
                      <span>{article.publishedLabel}</span>
                    </p>
                    <h2 className="font-display text-xl sm:text-2xl font-semibold text-white">
                      {article.title}
                    </h2>
                    <p className="text-sm text-zinc-400 leading-relaxed">{article.summary}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveArticleId(article.id)}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-white hover:text-[#22D3EE] transition-colors whitespace-nowrap shrink-0 self-start sm:self-center cursor-pointer"
                  >
                    <span>Lire l’article</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </article>
              ))}
            </div>
          )}

          <div className="pt-2">
            <button
              type="button"
              onClick={() => navigate('assistance')}
              className="text-sm text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              Une question sur une sortie ou la feuille de route ? Contactez l’assistance →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
