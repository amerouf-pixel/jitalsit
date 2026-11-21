import React, { useEffect, useState } from 'react';
import { Lock, Plus, RefreshCw, Trash2 } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import {
  ContactStatus,
  MediaAssetItem,
  MediaCategory,
  NewsArticleItem,
  NewsCategory,
  PromoContentItem,
  VideoProductionItem,
} from '../types/jitalx';
import { BOOTSTRAPPED_ADMIN_EMAIL, isSafeHttpUrl } from '../utils/validation';

type AdminTab = 'copy' | 'videos' | 'images' | 'news' | 'contacts' | 'promos' | 'users';

const ADMIN_TABS: { id: AdminTab; label: string }[] = [
  { id: 'copy', label: 'Textes commerciaux' },
  { id: 'videos', label: 'Vidéos (A–G)' },
  { id: 'images', label: 'Images' },
  { id: 'news', label: 'Actualités' },
  { id: 'contacts', label: 'Contacts' },
  { id: 'promos', label: 'Promos' },
  { id: 'users', label: 'Utilisateurs' },
];

export function AdminPage() {
  const {
    user,
    isAdmin,
    navigate,
    siteCopy,
    videos,
    mediaAssets,
    news,
    promos,
    adminUsers,
    adminContacts,
    adminSaveSiteCopy,
    adminSaveVideo,
    adminSaveMediaAsset,
    adminDeleteMediaAsset,
    adminSaveNewsArticle,
    adminDeleteNewsArticle,
    adminSavePromo,
    adminDeletePromo,
    adminUpdateContactStatus,
    adminDeleteContactRequest,
    adminUpdateUserRole,
    refreshAdminData,
  } = useSite();

  const [tab, setTab] = useState<AdminTab>('copy');
  const [statusNotice, setStatusNotice] = useState('');
  const [busy, setBusy] = useState(false);

  // Copy form state
  const [copyForm, setCopyForm] = useState({
    heroTitle: siteCopy.heroTitle,
    heroSubtitle: siteCopy.heroSubtitle,
    primaryCtaLabel: siteCopy.primaryCtaLabel,
    pricingHeadline: siteCopy.pricingHeadline,
    pricingNote: siteCopy.pricingNote,
    gumroadUrl: siteCopy.gumroadUrl,
  });

  useEffect(() => {
    setCopyForm({
      heroTitle: siteCopy.heroTitle,
      heroSubtitle: siteCopy.heroSubtitle,
      primaryCtaLabel: siteCopy.primaryCtaLabel,
      pricingHeadline: siteCopy.pricingHeadline,
      pricingNote: siteCopy.pricingNote,
      gumroadUrl: siteCopy.gumroadUrl,
    });
  }, [siteCopy]);

  // Video edit state
  const [editingVideoId, setEditingVideoId] = useState<string>(videos[0]?.id ?? '');
  const selectedVideo = videos.find((v) => v.id === editingVideoId) ?? videos[0];
  const [videoDraft, setVideoDraft] = useState<VideoProductionItem>(selectedVideo);

  useEffect(() => {
    if (selectedVideo) setVideoDraft(selectedVideo);
  }, [selectedVideo]);

  // Media add form
  const [newAsset, setNewAsset] = useState<{
    title: string;
    moduleName: string;
    category: MediaCategory;
    imageUrl: string;
    caption: string;
  }>({
    title: '',
    moduleName: '',
    category: 'capture-app',
    imageUrl: '',
    caption: '',
  });

  // News add form
  const [newArticle, setNewArticle] = useState<{
    title: string;
    category: NewsCategory;
    summary: string;
    body: string;
    publishedLabel: string;
    status: 'published' | 'draft';
  }>({
    title: '',
    category: 'Annonce',
    summary: '',
    body: '',
    publishedLabel: 'Novembre 2026',
    status: 'published',
  });

  // Promo add form
  const [newPromo, setNewPromo] = useState<{
    title: string;
    description: string;
    ctaLabel: string;
    ctaUrl: string;
    active: boolean;
  }>({
    title: '',
    description: '',
    ctaLabel: 'Découvrir',
    ctaUrl: siteCopy.gumroadUrl,
    active: true,
  });

  const notify = (msg: string) => {
    setStatusNotice(msg);
    window.setTimeout(() => setStatusNotice(''), 4000);
  };

  if (!user || !isAdmin) {
    return (
      <div className="max-w-xl mx-auto px-5 sm:px-8 py-20">
        <div className="rounded-2xl border border-white/10 bg-[#12111C] p-8 space-y-5 text-center">
          <Lock className="w-9 h-9 text-[#EC4899] mx-auto" />
          <h1 className="font-display text-2xl font-bold text-white">
            Espace Administrateur protégé
          </h1>
          <p className="text-sm text-zinc-400 leading-relaxed">
            L’accès au back-office JITALX (utilisateurs, vidéos, images, textes commerciaux,
            actualités, contacts et contenus promotionnels) est strictement réservé aux comptes
            administrateurs vérifiés via Firebase.
          </p>
          <p className="text-xs font-mono text-zinc-500">
            Compte administrateur principal configuré : {BOOTSTRAPPED_ADMIN_EMAIL}
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            {!user ? (
              <button
                type="button"
                onClick={() => navigate('connexion')}
                className="px-6 py-3 text-sm font-semibold bg-[#EC4899] hover:bg-[#DB2777] text-white rounded-lg transition-colors cursor-pointer"
              >
                Se connecter avec un compte administrateur
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigate('membre')}
                className="px-6 py-3 text-sm font-medium border border-white/12 text-zinc-200 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                Revenir à mon espace membre
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const handleSaveCopy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSafeHttpUrl(copyForm.gumroadUrl)) {
      notify('URL Gumroad invalide : utilisez un lien https:// valide.');
      return;
    }
    setBusy(true);
    try {
      await adminSaveSiteCopy(copyForm);
      notify('Textes commerciaux enregistrés dans Firestore.');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Échec de sauvegarde.');
    } finally {
      setBusy(false);
    }
  };

  const handleSaveVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (videoDraft.videoUrl.trim() && !isSafeHttpUrl(videoDraft.videoUrl)) {
      notify('URL vidéo invalide : utilisez une URL https:// ou /assets/.');
      return;
    }
    setBusy(true);
    try {
      await adminSaveVideo(videoDraft);
      notify(`Séquence ${videoDraft.code} mise à jour dans Firestore.`);
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Échec de sauvegarde vidéo.');
    } finally {
      setBusy(false);
    }
  };

  const handleAddAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newAsset.title.trim().length < 2 || !isSafeHttpUrl(newAsset.imageUrl)) {
      notify('Renseignez un titre et une URL d’image valide (/assets/... ou https://...).');
      return;
    }
    setBusy(true);
    try {
      const payload: MediaAssetItem = {
        id: `asset-${Date.now()}`,
        ...newAsset,
      };
      await adminSaveMediaAsset(payload);
      setNewAsset({
        title: '',
        moduleName: '',
        category: 'capture-app',
        imageUrl: '',
        caption: '',
      });
      notify('Visuel ajouté à la médiathèque Firestore.');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Erreur lors de l’ajout du visuel.');
    } finally {
      setBusy(false);
    }
  };

  const handleAddNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      newArticle.title.trim().length < 4 ||
      newArticle.summary.trim().length < 10 ||
      newArticle.body.trim().length < 20
    ) {
      notify('Complétez le titre (4+ car.), le résumé (10+ car.) et le contenu (20+ car.).');
      return;
    }
    setBusy(true);
    try {
      const payload: NewsArticleItem = {
        id: `news-${Date.now()}`,
        ...newArticle,
      };
      await adminSaveNewsArticle(payload);
      setNewArticle({
        title: '',
        category: 'Annonce',
        summary: '',
        body: '',
        publishedLabel: 'Novembre 2026',
        status: 'published',
      });
      notify('Actualité enregistrée dans Firestore.');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Erreur lors de la création de l’actualité.');
    } finally {
      setBusy(false);
    }
  };

  const handleAddPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPromo.title.trim().length < 3 || newPromo.description.trim().length < 10) {
      notify('Complétez le titre et la description promotionnelle.');
      return;
    }
    setBusy(true);
    try {
      const payload: PromoContentItem = {
        id: `promo-${Date.now()}`,
        ...newPromo,
      };
      await adminSavePromo(payload);
      setNewPromo({
        title: '',
        description: '',
        ctaLabel: 'Découvrir',
        ctaUrl: siteCopy.gumroadUrl,
        active: true,
      });
      notify('Contenu promotionnel ajouté.');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Erreur lors de l’ajout du contenu promo.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 sm:py-16 space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div className="space-y-1">
          <p className="text-xs font-medium text-[#22D3EE]">
            Administration sécurisée · {user.email}
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white">
            Gestion du site officiel JITALX
          </h1>
        </div>
        <button
          type="button"
          onClick={() => void refreshAdminData()}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium border border-white/12 text-zinc-200 hover:text-white hover:bg-white/5 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Actualiser Firestore</span>
        </button>
      </header>

      {/* Admin Tab Bar */}
      <div
        role="tablist"
        aria-label="Sections d’administration"
        className="flex flex-wrap gap-1.5 p-1.5 rounded-xl bg-[#11101B] border border-white/10"
      >
        {ADMIN_TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            onClick={() => setTab(item.id)}
            className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              tab === item.id
                ? 'bg-[#EC4899] text-white'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {statusNotice && (
        <div
          role="status"
          className="rounded-xl border border-[#22D3EE]/30 bg-[#22D3EE]/10 px-4 py-3 text-xs text-[#22D3EE]"
        >
          {statusNotice}
        </div>
      )}

      {/* 1. Commercial Copy */}
      {tab === 'copy' && (
        <form
          onSubmit={handleSaveCopy}
          className="rounded-2xl border border-white/10 bg-[#12111C] p-7 space-y-5 max-w-3xl"
        >
          <h2 className="font-display text-xl font-semibold text-white">
            Textes commerciaux &amp; lien Gumroad
          </h2>

          <div className="space-y-1.5">
            <label htmlFor="adm-hero-title" className="block text-xs font-medium text-zinc-300">
              Titre principal Hero (Accueil)
            </label>
            <input
              id="adm-hero-title"
              type="text"
              value={copyForm.heroTitle}
              onChange={(e) => setCopyForm((p) => ({ ...p, heroTitle: e.target.value }))}
              maxLength={160}
              className="w-full rounded-lg bg-[#0A0912] border border-white/12 px-3.5 py-2.5 text-sm text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="adm-hero-sub" className="block text-xs font-medium text-zinc-300">
              Sous-titre commercial Hero
            </label>
            <textarea
              id="adm-hero-sub"
              rows={3}
              value={copyForm.heroSubtitle}
              onChange={(e) => setCopyForm((p) => ({ ...p, heroSubtitle: e.target.value }))}
              maxLength={360}
              className="w-full rounded-lg bg-[#0A0912] border border-white/12 px-3.5 py-2.5 text-sm text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="adm-cta" className="block text-xs font-medium text-zinc-300">
                Libellé CTA principal
              </label>
              <input
                id="adm-cta"
                type="text"
                value={copyForm.primaryCtaLabel}
                onChange={(e) => setCopyForm((p) => ({ ...p, primaryCtaLabel: e.target.value }))}
                maxLength={60}
                className="w-full rounded-lg bg-[#0A0912] border border-white/12 px-3.5 py-2.5 text-sm text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="adm-price-head" className="block text-xs font-medium text-zinc-300">
                Titre section Tarifs
              </label>
              <input
                id="adm-price-head"
                type="text"
                value={copyForm.pricingHeadline}
                onChange={(e) => setCopyForm((p) => ({ ...p, pricingHeadline: e.target.value }))}
                maxLength={140}
                className="w-full rounded-lg bg-[#0A0912] border border-white/12 px-3.5 py-2.5 text-sm text-white"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="adm-price-note" className="block text-xs font-medium text-zinc-300">
              Note de transparence Tarifs
            </label>
            <textarea
              id="adm-price-note"
              rows={2}
              value={copyForm.pricingNote}
              onChange={(e) => setCopyForm((p) => ({ ...p, pricingNote: e.target.value }))}
              maxLength={360}
              className="w-full rounded-lg bg-[#0A0912] border border-white/12 px-3.5 py-2.5 text-sm text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="adm-gumroad" className="block text-xs font-medium text-zinc-300">
              Lien d’achat officiel Gumroad
            </label>
            <input
              id="adm-gumroad"
              type="url"
              value={copyForm.gumroadUrl}
              onChange={(e) => setCopyForm((p) => ({ ...p, gumroadUrl: e.target.value }))}
              maxLength={300}
              className="w-full rounded-lg bg-[#0A0912] border border-white/12 px-3.5 py-2.5 text-sm font-mono text-[#22D3EE]"
            />
          </div>

          <button
            type="submit"
            disabled={busy}
            className="px-5 py-3 text-sm font-semibold bg-[#EC4899] hover:bg-[#DB2777] text-white rounded-lg transition-colors disabled:opacity-60 cursor-pointer"
          >
            Enregistrer les textes commerciaux
          </button>
        </form>
      )}

      {/* 2. Videos Manager */}
      {tab === 'videos' && videoDraft && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-4 space-y-2">
            {videos.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setEditingVideoId(v.id)}
                className={`w-full text-left p-3.5 rounded-xl border transition-colors cursor-pointer ${
                  editingVideoId === v.id
                    ? 'bg-[#19162B] border-[#EC4899]/60 text-white'
                    : 'bg-[#11101B] border-white/8 text-zinc-400 hover:text-white'
                }`}
              >
                <div className="text-xs font-mono text-[#22D3EE]">
                  Vidéo {v.code} · {v.aspectRatio} ·{' '}
                  {v.status === 'published' ? 'Publiée' : 'Storyboard'}
                </div>
                <div className="text-sm font-medium mt-0.5 truncate">{v.title}</div>
              </button>
            ))}
          </div>

          <form
            onSubmit={handleSaveVideo}
            className="lg:col-span-8 rounded-2xl border border-white/10 bg-[#12111C] p-7 space-y-4"
          >
            <h2 className="font-display text-xl font-semibold text-white">
              Éditer la Vidéo {videoDraft.code}
            </h2>

            <div className="space-y-1.5">
              <label htmlFor="vid-title" className="block text-xs font-medium text-zinc-300">
                Titre
              </label>
              <input
                id="vid-title"
                type="text"
                value={videoDraft.title}
                onChange={(e) => setVideoDraft((p) => ({ ...p, title: e.target.value }))}
                maxLength={140}
                className="w-full rounded-lg bg-[#0A0912] border border-white/12 px-3.5 py-2.5 text-sm text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="vid-sub" className="block text-xs font-medium text-zinc-300">
                Description
              </label>
              <textarea
                id="vid-sub"
                rows={2}
                value={videoDraft.subtitle}
                onChange={(e) => setVideoDraft((p) => ({ ...p, subtitle: e.target.value }))}
                maxLength={260}
                className="w-full rounded-lg bg-[#0A0912] border border-white/12 px-3.5 py-2.5 text-sm text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="vid-status" className="block text-xs font-medium text-zinc-300">
                  Statut d’affichage
                </label>
                <select
                  id="vid-status"
                  value={videoDraft.status}
                  onChange={(e) =>
                    setVideoDraft((p) => ({
                      ...p,
                      status: e.target.value === 'published' ? 'published' : 'storyboard',
                    }))
                  }
                  className="w-full rounded-lg bg-[#0A0912] border border-white/12 px-3.5 py-2.5 text-sm text-white"
                >
                  <option value="storyboard">Séquence animée (Storyboard pré-production)</option>
                  <option value="published">Vidéo HD publiée (lecteur vidéo direct)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="vid-dur" className="block text-xs font-medium text-zinc-300">
                  Durée affichée
                </label>
                <input
                  id="vid-dur"
                  type="text"
                  value={videoDraft.durationLabel}
                  onChange={(e) =>
                    setVideoDraft((p) => ({ ...p, durationLabel: e.target.value }))
                  }
                  maxLength={20}
                  className="w-full rounded-lg bg-[#0A0912] border border-white/12 px-3.5 py-2.5 text-sm font-mono text-white"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="vid-url" className="block text-xs font-medium text-zinc-300">
                URL du fichier vidéo MP4 / WebM final (laisser vide pour le lecteur animé)
              </label>
              <input
                id="vid-url"
                type="url"
                value={videoDraft.videoUrl}
                onChange={(e) => setVideoDraft((p) => ({ ...p, videoUrl: e.target.value }))}
                maxLength={500}
                placeholder="https://.../jitalx-video-a.mp4"
                className="w-full rounded-lg bg-[#0A0912] border border-white/12 px-3.5 py-2.5 text-sm font-mono text-[#22D3EE]"
              />
            </div>

            <button
              type="submit"
              disabled={busy}
              className="px-5 py-3 text-sm font-semibold bg-[#EC4899] hover:bg-[#DB2777] text-white rounded-lg transition-colors cursor-pointer"
            >
              Enregistrer la vidéo
            </button>
          </form>
        </div>
      )}

      {/* 3. Images Manager */}
      {tab === 'images' && (
        <div className="space-y-8">
          <form
            onSubmit={handleAddAsset}
            className="rounded-2xl border border-white/10 bg-[#12111C] p-6 space-y-4"
          >
            <h2 className="font-display text-lg font-semibold text-white">
              Ajouter un visuel ou une capture
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Titre du visuel"
                value={newAsset.title}
                onChange={(e) => setNewAsset((p) => ({ ...p, title: e.target.value }))}
                maxLength={120}
                className="rounded-lg bg-[#0A0912] border border-white/12 px-3.5 py-2.5 text-sm text-white"
              />
              <input
                type="text"
                placeholder="Module associé"
                value={newAsset.moduleName}
                onChange={(e) => setNewAsset((p) => ({ ...p, moduleName: e.target.value }))}
                maxLength={80}
                className="rounded-lg bg-[#0A0912] border border-white/12 px-3.5 py-2.5 text-sm text-white"
              />
              <select
                value={newAsset.category}
                onChange={(e) =>
                  setNewAsset((p) => ({ ...p, category: e.target.value as MediaCategory }))
                }
                className="rounded-lg bg-[#0A0912] border border-white/12 px-3.5 py-2.5 text-sm text-white"
              >
                <option value="capture-app">Capture application</option>
                <option value="streamer-obs">Streamer Studio OBS</option>
                <option value="studio-photo">Photographie studio</option>
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="URL (/assets/aistudio/... ou https://...)"
                value={newAsset.imageUrl}
                onChange={(e) => setNewAsset((p) => ({ ...p, imageUrl: e.target.value }))}
                maxLength={500}
                className="rounded-lg bg-[#0A0912] border border-white/12 px-3.5 py-2.5 text-sm font-mono text-white"
              />
              <input
                type="text"
                placeholder="Légende descriptive"
                value={newAsset.caption}
                onChange={(e) => setNewAsset((p) => ({ ...p, caption: e.target.value }))}
                maxLength={300}
                className="rounded-lg bg-[#0A0912] border border-white/12 px-3.5 py-2.5 text-sm text-white"
              />
            </div>
            <button
              type="submit"
              disabled={busy}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold bg-[#EC4899] hover:bg-[#DB2777] text-white rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter à la médiathèque</span>
            </button>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {mediaAssets.map((asset) => (
              <div
                key={asset.id}
                className="rounded-xl border border-white/10 bg-[#11101B] overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-video bg-black overflow-hidden">
                    <img
                      src={asset.imageUrl}
                      alt={asset.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 space-y-1">
                    <p className="text-xs text-[#22D3EE]">{asset.moduleName}</p>
                    <h3 className="text-sm font-semibold text-white">{asset.title}</h3>
                    <p className="text-xs text-zinc-400 line-clamp-2">{asset.caption}</p>
                  </div>
                </div>
                <div className="px-4 py-3 border-t border-white/8 flex justify-end">
                  <button
                    type="button"
                    aria-label={`Supprimer ${asset.title}`}
                    onClick={() => void adminDeleteMediaAsset(asset.id)}
                    className="inline-flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Supprimer</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. News Manager */}
      {tab === 'news' && (
        <div className="space-y-8">
          <form
            onSubmit={handleAddNews}
            className="rounded-2xl border border-white/10 bg-[#12111C] p-6 space-y-4"
          >
            <h2 className="font-display text-lg font-semibold text-white">
              Publier une actualité JITALX
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Titre de l’article"
                value={newArticle.title}
                onChange={(e) => setNewArticle((p) => ({ ...p, title: e.target.value }))}
                maxLength={160}
                className="sm:col-span-2 rounded-lg bg-[#0A0912] border border-white/12 px-3.5 py-2.5 text-sm text-white"
              />
              <select
                value={newArticle.category}
                onChange={(e) =>
                  setNewArticle((p) => ({ ...p, category: e.target.value as NewsCategory }))
                }
                className="rounded-lg bg-[#0A0912] border border-white/12 px-3.5 py-2.5 text-sm text-white"
              >
                <option value="Annonce">Annonce</option>
                <option value="Produit">Produit</option>
                <option value="Streamer Studio">Streamer Studio</option>
                <option value="Feuille de route">Feuille de route</option>
              </select>
            </div>
            <input
              type="text"
              placeholder="Résumé court (affiché dans la liste)"
              value={newArticle.summary}
              onChange={(e) => setNewArticle((p) => ({ ...p, summary: e.target.value }))}
              maxLength={320}
              className="w-full rounded-lg bg-[#0A0912] border border-white/12 px-3.5 py-2.5 text-sm text-white"
            />
            <textarea
              rows={4}
              placeholder="Contenu complet de l’actualité..."
              value={newArticle.body}
              onChange={(e) => setNewArticle((p) => ({ ...p, body: e.target.value }))}
              maxLength={4000}
              className="w-full rounded-lg bg-[#0A0912] border border-white/12 px-3.5 py-2.5 text-sm text-white"
            />
            <div className="flex flex-wrap items-center gap-4">
              <input
                type="text"
                placeholder="Date affichée (ex. Novembre 2026)"
                value={newArticle.publishedLabel}
                onChange={(e) =>
                  setNewArticle((p) => ({ ...p, publishedLabel: e.target.value }))
                }
                maxLength={40}
                className="rounded-lg bg-[#0A0912] border border-white/12 px-3.5 py-2 text-sm text-white"
              />
              <select
                value={newArticle.status}
                onChange={(e) =>
                  setNewArticle((p) => ({
                    ...p,
                    status: e.target.value === 'draft' ? 'draft' : 'published',
                  }))
                }
                className="rounded-lg bg-[#0A0912] border border-white/12 px-3.5 py-2 text-sm text-white"
              >
                <option value="published">Publié</option>
                <option value="draft">Brouillon</option>
              </select>
              <button
                type="submit"
                disabled={busy}
                className="px-4 py-2.5 text-xs font-semibold bg-[#EC4899] hover:bg-[#DB2777] text-white rounded-lg transition-colors cursor-pointer"
              >
                Enregistrer l’actualité
              </button>
            </div>
          </form>

          <div className="divide-y divide-white/10 border-t border-b border-white/10">
            {news.map((item) => (
              <div
                key={item.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <p className="text-xs text-zinc-400">
                    <span className="text-[#22D3EE]">{item.category}</span>
                    {' · '}
                    {item.publishedLabel}
                    {' · '}
                    {item.status === 'published' ? 'Publié' : 'Brouillon'}
                  </p>
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                </div>
                <button
                  type="button"
                  onClick={() => void adminDeleteNewsArticle(item.id)}
                  className="inline-flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 self-start sm:self-center cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Supprimer</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Contacts Manager */}
      {tab === 'contacts' && (
        <div className="space-y-4">
          <h2 className="font-display text-xl font-semibold text-white">
            Demandes d’assistance ({adminContacts.length})
          </h2>
          {adminContacts.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-[#11101B] p-8 text-center text-sm text-zinc-400">
              Aucune demande d’assistance enregistrée dans Firestore pour le moment.
            </div>
          ) : (
            <div className="space-y-3">
              {adminContacts.map((req) => (
                <div
                  key={req.id}
                  className="rounded-xl border border-white/10 bg-[#11101B] p-5 flex flex-col md:flex-row md:items-start justify-between gap-4"
                >
                  <div className="space-y-1.5 max-w-2xl">
                    <p className="text-xs text-zinc-400">
                      <span className="text-white font-medium">{req.name}</span>
                      {' · '}
                      <span className="font-mono">{req.email}</span>
                      {' · '}
                      <span className="text-[#22D3EE]">{req.topic}</span>
                    </p>
                    <p className="text-sm text-zinc-300 leading-relaxed">{req.message}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <select
                      aria-label={`Statut de la demande de ${req.name}`}
                      value={req.status}
                      onChange={(e) =>
                        void adminUpdateContactStatus(req.id, e.target.value as ContactStatus)
                      }
                      className="rounded-lg bg-[#0A0912] border border-white/12 px-3 py-1.5 text-xs text-white"
                    >
                      <option value="new">Nouvelle</option>
                      <option value="in_progress">En cours</option>
                      <option value="resolved">Résolue</option>
                    </select>
                    <button
                      type="button"
                      aria-label={`Supprimer la demande de ${req.name}`}
                      onClick={() => void adminDeleteContactRequest(req.id)}
                      className="p-2 text-rose-400 hover:text-rose-300 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 6. Promotional Content */}
      {tab === 'promos' && (
        <div className="space-y-8">
          <form
            onSubmit={handleAddPromo}
            className="rounded-2xl border border-white/10 bg-[#12111C] p-6 space-y-4"
          >
            <h2 className="font-display text-lg font-semibold text-white">
              Ajouter un encart promotionnel
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Titre promotionnel"
                value={newPromo.title}
                onChange={(e) => setNewPromo((p) => ({ ...p, title: e.target.value }))}
                maxLength={140}
                className="rounded-lg bg-[#0A0912] border border-white/12 px-3.5 py-2.5 text-sm text-white"
              />
              <input
                type="text"
                placeholder="Texte du bouton CTA"
                value={newPromo.ctaLabel}
                onChange={(e) => setNewPromo((p) => ({ ...p, ctaLabel: e.target.value }))}
                maxLength={60}
                className="rounded-lg bg-[#0A0912] border border-white/12 px-3.5 py-2.5 text-sm text-white"
              />
            </div>
            <input
              type="text"
              placeholder="Description promotionnelle"
              value={newPromo.description}
              onChange={(e) => setNewPromo((p) => ({ ...p, description: e.target.value }))}
              maxLength={360}
              className="w-full rounded-lg bg-[#0A0912] border border-white/12 px-3.5 py-2.5 text-sm text-white"
            />
            <div className="flex flex-wrap items-center gap-4">
              <input
                type="text"
                placeholder="URL cible (https://... ou #streamer-studio)"
                value={newPromo.ctaUrl}
                onChange={(e) => setNewPromo((p) => ({ ...p, ctaUrl: e.target.value }))}
                maxLength={300}
                className="flex-1 min-w-[240px] rounded-lg bg-[#0A0912] border border-white/12 px-3.5 py-2 text-sm font-mono text-white"
              />
              <label className="flex items-center gap-2 text-xs text-zinc-300">
                <input
                  type="checkbox"
                  checked={newPromo.active}
                  onChange={(e) => setNewPromo((p) => ({ ...p, active: e.target.checked }))}
                  className="accent-[#EC4899] w-4 h-4"
                />
                <span>Actif sur l’accueil</span>
              </label>
              <button
                type="submit"
                disabled={busy}
                className="px-4 py-2.5 text-xs font-semibold bg-[#EC4899] hover:bg-[#DB2777] text-white rounded-lg transition-colors cursor-pointer"
              >
                Ajouter l’encart
              </button>
            </div>
          </form>

          <div className="space-y-3">
            {promos.map((promo) => (
              <div
                key={promo.id}
                className="rounded-xl border border-white/10 bg-[#11101B] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-white">
                    {promo.title}{' '}
                    <span className="text-xs font-normal text-zinc-400">
                      · {promo.active ? 'Actif' : 'Masqué'}
                    </span>
                  </p>
                  <p className="text-xs text-zinc-400">{promo.description}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      void adminSavePromo({ ...promo, active: !promo.active })
                    }
                    className="px-3 py-1.5 text-xs rounded-lg border border-white/12 text-zinc-200 hover:text-white cursor-pointer"
                  >
                    {promo.active ? 'Masquer' : 'Activer'}
                  </button>
                  <button
                    type="button"
                    aria-label={`Supprimer ${promo.title}`}
                    onClick={() => void adminDeletePromo(promo.id)}
                    className="p-2 text-rose-400 hover:text-rose-300 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. Users Manager */}
      {tab === 'users' && (
        <div className="space-y-4">
          <h2 className="font-display text-xl font-semibold text-white">
            Comptes membres enregistrés ({adminUsers.length})
          </h2>
          {adminUsers.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-[#11101B] p-8 text-center text-sm text-zinc-400">
              Aucun profil membre synchronisé pour le moment.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#11101B]">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-white/10 text-xs text-zinc-400">
                  <tr>
                    <th className="py-3 px-4 font-medium">Nom</th>
                    <th className="py-3 px-4 font-medium">E-mail</th>
                    <th className="py-3 px-4 font-medium">Pseudo OBS</th>
                    <th className="py-3 px-4 font-medium">Format</th>
                    <th className="py-3 px-4 font-medium">Rôle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/8 text-zinc-300">
                  {adminUsers.map((member) => (
                    <tr key={member.uid}>
                      <td className="py-3 px-4 font-medium text-white">{member.displayName}</td>
                      <td className="py-3 px-4 font-mono text-xs">{member.email}</td>
                      <td className="py-3 px-4 font-mono text-xs text-[#22D3EE]">
                        {member.streamerHandle || '—'}
                      </td>
                      <td className="py-3 px-4 font-mono text-xs tabular-nums">
                        {member.preferredFormat}
                      </td>
                      <td className="py-3 px-4">
                        <select
                          aria-label={`Rôle de ${member.displayName}`}
                          value={member.role}
                          onChange={(e) =>
                            void adminUpdateUserRole(
                              member.uid,
                              e.target.value === 'admin' ? 'admin' : 'member'
                            )
                          }
                          className="rounded-lg bg-[#0A0912] border border-white/12 px-2.5 py-1 text-xs text-white"
                        >
                          <option value="member">Membre</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
