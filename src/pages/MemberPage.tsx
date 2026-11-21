import React, { useEffect, useState } from 'react';
import { LogOut, Shield, User as UserIcon } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { signOutUser } from '../firebase';
import { validateProfileUpdate } from '../utils/validation';

export function MemberPage() {
  const { user, profile, isAdmin, myContactRequests, saveProfile, navigate } = useSite();
  const [displayName, setDisplayName] = useState('');
  const [streamerHandle, setStreamerHandle] = useState('');
  const [bio, setBio] = useState('');
  const [preferredFormat, setPreferredFormat] = useState<'16:9' | '9:16'>('16:9');
  const [newsletterOptIn, setNewsletterOptIn] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || '');
      setStreamerHandle(profile.streamerHandle || '');
      setBio(profile.bio || '');
      setPreferredFormat(profile.preferredFormat === '9:16' ? '9:16' : '16:9');
      setNewsletterOptIn(Boolean(profile.newsletterOptIn));
    }
  }, [profile]);

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-5 sm:px-8 py-20">
        <div className="rounded-2xl border border-white/10 bg-[#12111C] p-8 space-y-5 text-center">
          <UserIcon className="w-9 h-9 text-zinc-400 mx-auto" />
          <h1 className="font-display text-2xl font-bold text-white">Espace membre réservé</h1>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Connectez-vous à votre compte Firebase pour gérer votre profil, vos préférences
            Streamer Studio et le suivi de vos demandes d’assistance.
          </p>
          <button
            type="button"
            onClick={() => navigate('connexion')}
            className="px-6 py-3 text-sm font-semibold bg-[#EC4899] hover:bg-[#DB2777] text-white rounded-lg transition-colors cursor-pointer"
          >
            Aller à la connexion
          </button>
        </div>
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback('');
    const check = validateProfileUpdate({
      displayName,
      streamerHandle,
      bio,
      preferredFormat,
    });
    if (!check.valid) {
      setErrors(check.errors);
      return;
    }
    setErrors({});
    setSaving(true);
    try {
      await saveProfile({
        displayName,
        streamerHandle,
        bio,
        preferredFormat,
        newsletterOptIn,
      });
      setFeedback('Profil enregistré dans votre compte Cloud.');
    } catch (err) {
      setFeedback(
        err instanceof Error ? err.message : 'Erreur lors de la sauvegarde du profil.'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOutUser();
    navigate('accueil');
  };

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-14 sm:py-20 space-y-10">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-[#22D3EE]">
            Espace membre · {profile?.role === 'admin' || isAdmin ? 'Administrateur' : 'Membre'}
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white">
            {profile?.displayName || user.displayName || 'Votre profil JITALX'}
          </h1>
          <p className="text-sm text-zinc-400">{user.email}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {isAdmin && (
            <button
              type="button"
              onClick={() => navigate('admin')}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold bg-[#22D3EE] text-[#09090F] hover:bg-cyan-300 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            >
              <Shield className="w-4 h-4" />
              <span>Ouvrir l’Administration</span>
            </button>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium border border-white/12 text-zinc-200 hover:text-white hover:bg-white/5 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Déconnexion</span>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Profile Settings Form */}
        <form
          onSubmit={handleSave}
          className="lg:col-span-7 rounded-2xl border border-white/10 bg-[#12111C] p-7 space-y-5"
          noValidate
        >
          <h2 className="font-display text-xl font-semibold text-white">
            Informations personnelles &amp; paramètres
          </h2>

          <div className="space-y-1.5">
            <label htmlFor="profile-name" className="block text-xs font-medium text-zinc-300">
              Nom affiché
            </label>
            <input
              id="profile-name"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              maxLength={100}
              className="w-full rounded-lg bg-[#0A0912] border border-white/12 px-3.5 py-2.5 text-sm text-white"
            />
            {errors.displayName && (
              <p className="text-xs text-rose-400">{errors.displayName}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="profile-handle" className="block text-xs font-medium text-zinc-300">
              Pseudo Streamer Studio (OBS)
            </label>
            <input
              id="profile-handle"
              type="text"
              value={streamerHandle}
              onChange={(e) => setStreamerHandle(e.target.value)}
              maxLength={60}
              placeholder="@Runner_10J"
              className="w-full rounded-lg bg-[#0A0912] border border-white/12 px-3.5 py-2.5 text-sm text-white"
            />
            {errors.streamerHandle && (
              <p className="text-xs text-rose-400">{errors.streamerHandle}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="profile-bio" className="block text-xs font-medium text-zinc-300">
              Bio / Jeux suivis (max. 400 caractères)
            </label>
            <textarea
              id="profile-bio"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={400}
              className="w-full rounded-lg bg-[#0A0912] border border-white/12 px-3.5 py-2.5 text-sm text-white resize-y"
            />
            {errors.bio && <p className="text-xs text-rose-400">{errors.bio}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div className="space-y-1.5">
              <label htmlFor="profile-ratio" className="block text-xs font-medium text-zinc-300">
                Format d’overlay préféré
              </label>
              <select
                id="profile-ratio"
                value={preferredFormat}
                onChange={(e) =>
                  setPreferredFormat(e.target.value === '9:16' ? '9:16' : '16:9')
                }
                className="w-full rounded-lg bg-[#0A0912] border border-white/12 px-3.5 py-2.5 text-sm text-white"
              >
                <option value="16:9">16:9 (Paysage / Twitch &amp; YouTube)</option>
                <option value="9:16">9:16 (Vertical / Shorts &amp; TikTok)</option>
              </select>
            </div>

            <label className="flex items-center gap-2.5 pt-4 text-xs text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={newsletterOptIn}
                onChange={(e) => setNewsletterOptIn(e.target.checked)}
                className="accent-[#EC4899] w-4 h-4"
              />
              <span>Recevoir les annonces produit JITALX</span>
            </label>
          </div>

          {feedback && (
            <p role="status" className="text-xs text-[#22D3EE]">
              {feedback}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="px-5 py-3 text-sm font-semibold bg-[#EC4899] hover:bg-[#DB2777] text-white rounded-lg transition-colors disabled:opacity-60 cursor-pointer"
          >
            {saving ? 'Enregistrement...' : 'Enregistrer les paramètres'}
          </button>
        </form>

        {/* User Support Requests */}
        <section className="lg:col-span-5 rounded-2xl border border-white/10 bg-[#11101B] p-7 space-y-5">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-display text-xl font-semibold text-white">
              Mes demandes d’assistance
            </h2>
            <button
              type="button"
              onClick={() => navigate('assistance')}
              className="text-xs font-medium text-[#22D3EE] hover:text-white cursor-pointer"
            >
              Nouvelle demande
            </button>
          </div>

          {myContactRequests.length === 0 ? (
            <p className="text-sm text-zinc-400 leading-relaxed">
              Vous n’avez pas encore envoyé de message depuis la page Assistance.
            </p>
          ) : (
            <div className="space-y-3">
              {myContactRequests.map((req) => (
                <div
                  key={req.id}
                  className="rounded-xl border border-white/8 bg-[#0A0912] p-4 space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2 text-xs text-zinc-400">
                    <span className="font-medium text-zinc-200">{req.topic}</span>
                    <span className="font-mono text-[#22D3EE]">
                      {req.status === 'resolved'
                        ? 'Résolue'
                        : req.status === 'in_progress'
                        ? 'En cours'
                        : 'Envoyée'}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed">
                    {req.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
