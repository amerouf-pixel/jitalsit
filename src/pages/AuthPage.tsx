import React, { useState } from 'react';
import { KeyRound, ShieldCheck } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import {
  getFirebaseProjectInfo,
  registerWithEmailPassword,
  sendPasswordReset,
  signInWithEmailPassword,
  signInWithGooglePopup,
} from '../firebase';
import { isValidEmail } from '../utils/validation';

type AuthMode = 'login' | 'register' | 'reset';

export function AuthPage() {
  const { user, navigate } = useSite();
  const [mode, setMode] = useState<AuthMode>('login');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const firebaseInfo = getFirebaseProjectInfo();

  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setBusy(true);
    try {
      await signInWithGooglePopup();
      navigate('membre');
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Échec de la connexion Google.';
      setErrorMsg(
        msg.includes('popup-closed-by-user')
          ? 'La fenêtre de connexion Google a été fermée avant validation.'
          : msg
      );
    } finally {
      setBusy(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!isValidEmail(email)) {
      setErrorMsg('Veuillez saisir une adresse e-mail valide.');
      return;
    }

    if (mode !== 'reset' && password.length < 6) {
      setErrorMsg('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    if (mode === 'register' && displayName.trim().length < 2) {
      setErrorMsg('Veuillez indiquer votre nom ou pseudo (2 caractères minimum).');
      return;
    }

    setBusy(true);
    try {
      if (mode === 'login') {
        await signInWithEmailPassword(email, password);
        navigate('membre');
      } else if (mode === 'register') {
        await registerWithEmailPassword(email, password, displayName);
        setSuccessMsg(
          'Compte créé. Un e-mail de vérification a été envoyé afin d’activer la sauvegarde Cloud de votre profil.'
        );
        navigate('membre');
      } else {
        await sendPasswordReset(email);
        setSuccessMsg(
          'Si un compte existe avec cette adresse, un lien de réinitialisation de mot de passe vient d’être envoyé.'
        );
      }
    } catch (error) {
      const raw = error instanceof Error ? error.message : String(error);
      if (raw.includes('operation-not-allowed')) {
        setErrorMsg(
          'Le fournisseur E-mail/Mot de passe n’est pas encore activé dans la console Firebase de ce projet. Utilisez « Continuer avec Google » ou activez Email/Password dans Firebase Console > Authentication > Sign-in method.'
        );
      } else if (raw.includes('invalid-credential') || raw.includes('wrong-password')) {
        setErrorMsg('Identifiants incorrects. Vérifiez votre e-mail et votre mot de passe.');
      } else if (raw.includes('email-already-in-use')) {
        setErrorMsg('Un compte existe déjà avec cette adresse e-mail.');
      } else {
        setErrorMsg(raw);
      }
    } finally {
      setBusy(false);
    }
  };

  if (user) {
    return (
      <div className="max-w-xl mx-auto px-5 sm:px-8 py-20">
        <div className="rounded-2xl border border-white/10 bg-[#12111C] p-8 space-y-5 text-center">
          <ShieldCheck className="w-9 h-9 text-[#22D3EE] mx-auto" />
          <h1 className="font-display text-2xl font-bold text-white">Vous êtes déjà connecté</h1>
          <p className="text-sm text-zinc-400">
            Session active pour <span className="text-white font-medium">{user.email}</span>.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('membre')}
              className="px-5 py-2.5 text-sm font-semibold bg-[#EC4899] hover:bg-[#DB2777] text-white rounded-lg transition-colors cursor-pointer"
            >
              Ouvrir mon espace membre
            </button>
            <button
              type="button"
              onClick={() => navigate('accueil')}
              className="px-5 py-2.5 text-sm font-medium border border-white/12 text-zinc-200 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              Retour à l’accueil
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-14 sm:py-20 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
      {/* Auth Card */}
      <section className="lg:col-span-7 rounded-2xl border border-white/10 bg-[#12111C] p-7 sm:p-9 space-y-6">
        <div className="space-y-2">
          <p className="text-xs font-medium text-[#22D3EE]">Compte utilisateur Firebase</p>
          <h1 className="font-display text-3xl font-bold text-white">
            {mode === 'login'
              ? 'Connexion à votre espace JITALX'
              : mode === 'register'
              ? 'Créer un compte membre'
              : 'Réinitialiser votre mot de passe'}
          </h1>
          <p className="text-sm text-zinc-400">
            Retrouvez votre profil, vos préférences Streamer Studio et le suivi de vos demandes
            d’assistance.
          </p>
        </div>

        {/* Google Auth (provisioned by default) */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={busy}
          className="w-full py-3 px-4 rounded-lg bg-white text-[#09090F] hover:bg-zinc-200 font-semibold text-sm transition-colors disabled:opacity-60 cursor-pointer"
        >
          {busy ? 'Connexion en cours...' : 'Continuer avec Google (recommandé)'}
        </button>

        <div className="relative flex items-center py-1">
          <div className="flex-grow border-t border-white/10" />
          <span className="px-3 text-xs text-zinc-500">ou par e-mail</span>
          <div className="flex-grow border-t border-white/10" />
        </div>

        {/* Mode Tabs */}
        <div
          role="tablist"
          aria-label="Mode d’authentification"
          className="flex gap-1.5 p-1 rounded-lg bg-[#0A0912] border border-white/10"
        >
          {[
            { id: 'login' as AuthMode, label: 'Connexion' },
            { id: 'register' as AuthMode, label: 'Inscription' },
            { id: 'reset' as AuthMode, label: 'Mot de passe oublié' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={mode === tab.id}
              onClick={() => {
                setMode(tab.id);
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`flex-1 py-2 px-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                mode === tab.id ? 'bg-[#1D1B2E] text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleEmailSubmit} className="space-y-4" noValidate>
          {mode === 'register' && (
            <div className="space-y-1.5">
              <label htmlFor="auth-name" className="block text-xs font-medium text-zinc-300">
                Nom affiché / Pseudo
              </label>
              <input
                id="auth-name"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                maxLength={100}
                placeholder="Ex. Runner_10J"
                className="w-full rounded-lg bg-[#0A0912] border border-white/12 px-3.5 py-2.5 text-sm text-white"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="auth-email" className="block text-xs font-medium text-zinc-300">
              Adresse e-mail
            </label>
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={200}
              placeholder="vous@exemple.fr"
              className="w-full rounded-lg bg-[#0A0912] border border-white/12 px-3.5 py-2.5 text-sm text-white"
            />
          </div>

          {mode !== 'reset' && (
            <div className="space-y-1.5">
              <label htmlFor="auth-password" className="block text-xs font-medium text-zinc-300">
                Mot de passe
              </label>
              <input
                id="auth-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="6 caractères minimum"
                className="w-full rounded-lg bg-[#0A0912] border border-white/12 px-3.5 py-2.5 text-sm text-white"
              />
            </div>
          )}

          {errorMsg && (
            <p
              role="alert"
              className="text-xs text-rose-300 bg-rose-500/10 border border-rose-400/25 rounded-lg px-3.5 py-2.5 leading-relaxed"
            >
              {errorMsg}
            </p>
          )}

          {successMsg && (
            <p
              role="status"
              className="text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-400/25 rounded-lg px-3.5 py-2.5 leading-relaxed"
            >
              {successMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full py-3 px-4 rounded-lg bg-[#EC4899] hover:bg-[#DB2777] text-white font-semibold text-sm transition-colors disabled:opacity-60 cursor-pointer"
          >
            {mode === 'login'
              ? 'Se connecter'
              : mode === 'register'
              ? 'Créer mon compte'
              : 'Envoyer le lien de réinitialisation'}
          </button>
        </form>
      </section>

      {/* Firebase Unification Note */}
      <aside className="lg:col-span-5 rounded-2xl border border-white/10 bg-[#11101B] p-7 space-y-5">
        <div className="flex items-center gap-2.5 text-white font-semibold text-base">
          <KeyRound className="w-4 h-4 text-[#22D3EE]" />
          <h2>Unification Firebase Auth</h2>
        </div>

        <p className="text-sm text-zinc-400 leading-relaxed">
          Ce site officiel utilise Firebase Authentication et Firestore pour isoler strictement vos
          données personnelles et sécuriser l’espace administrateur.
        </p>

        <div className="space-y-2 text-xs text-zinc-400 bg-[#0A0912] border border-white/8 rounded-xl p-4">
          <p className="font-semibold text-zinc-200">
            Réutiliser le projet Firebase existant de l’application JITALX :
          </p>
          <p className="leading-relaxed">
            Pour éviter deux bases de comptes distinctes entre l’application JITALX et ce site
            commercial, il suffit de rattacher votre projet Firebase JITALX existant (projet actif
            actuellement : <span className="font-mono text-zinc-200">{firebaseInfo.projectId}</span>
            ).
          </p>
          <p className="leading-relaxed">
            La connexion Google est prête immédiatement. Pour activer également la connexion par
            e-mail et mot de passe, activez « Email/Password » dans la console Firebase
            (Authentication &gt; Sign-in method).
          </p>
        </div>
      </aside>
    </div>
  );
}
