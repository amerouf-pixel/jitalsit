import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import {
  ContactRequestItem,
  ContactStatus,
  ContactTopic,
  MediaAssetItem,
  NewsArticleItem,
  PageId,
  PromoContentItem,
  SiteCopyConfig,
  UserProfileRecord,
  VideoProductionItem,
} from '../types/jitalx';
import { DEFAULT_MEDIA_ASSETS } from '../data/assets';
import {
  DEFAULT_NEWS_ARTICLES,
  DEFAULT_PROMOS,
  DEFAULT_SITE_COPY,
  DEFAULT_VIDEO_PRODUCTIONS,
} from '../data/catalog';
import { OperationType, auth, db, handleFirestoreError } from '../firebase';
import {
  isBootstrappedAdminEmail,
  OFFICIAL_GUMROAD_URL,
  sanitizeSlugId,
} from '../utils/validation';

interface SiteContextValue {
  currentPage: PageId;
  navigate: (page: PageId) => void;
  user: User | null;
  authReady: boolean;
  profile: UserProfileRecord | null;
  isAdmin: boolean;
  siteCopy: SiteCopyConfig;
  videos: VideoProductionItem[];
  mediaAssets: MediaAssetItem[];
  news: NewsArticleItem[];
  promos: PromoContentItem[];
  myContactRequests: ContactRequestItem[];
  adminUsers: UserProfileRecord[];
  adminContacts: ContactRequestItem[];
  selectedVideoCode: string;
  setSelectedVideoCode: (code: string) => void;
  saveProfile: (updates: {
    displayName: string;
    streamerHandle: string;
    bio: string;
    preferredFormat: '16:9' | '9:16';
    newsletterOptIn: boolean;
  }) => Promise<void>;
  submitContactRequest: (payload: {
    name: string;
    email: string;
    topic: ContactTopic;
    message: string;
  }) => Promise<{ persistedToCloud: boolean }>;
  adminSaveSiteCopy: (copy: Omit<SiteCopyConfig, 'id' | 'updatedAt'>) => Promise<void>;
  adminSaveVideo: (video: VideoProductionItem) => Promise<void>;
  adminSaveMediaAsset: (asset: MediaAssetItem) => Promise<void>;
  adminDeleteMediaAsset: (assetId: string) => Promise<void>;
  adminSaveNewsArticle: (article: NewsArticleItem) => Promise<void>;
  adminDeleteNewsArticle: (newsId: string) => Promise<void>;
  adminSavePromo: (promo: PromoContentItem) => Promise<void>;
  adminDeletePromo: (promoId: string) => Promise<void>;
  adminUpdateContactStatus: (requestId: string, status: ContactStatus) => Promise<void>;
  adminDeleteContactRequest: (requestId: string) => Promise<void>;
  adminUpdateUserRole: (uid: string, role: 'member' | 'admin') => Promise<void>;
  refreshAdminData: () => Promise<void>;
}

const SiteContext = createContext<SiteContextValue | null>(null);

const PAGE_HASH_MAP: Record<string, PageId> = {
  '': 'accueil',
  accueil: 'accueil',
  decouvrir: 'decouvrir',
  fonctionnalites: 'fonctionnalites',
  videos: 'videos',
  'streamer-studio': 'streamer-studio',
  tarifs: 'tarifs',
  connexion: 'connexion',
  membre: 'membre',
  actualites: 'actualites',
  assistance: 'assistance',
  admin: 'admin',
};

function readPageFromHash(): PageId {
  if (typeof window === 'undefined') return 'accueil';
  const raw = window.location.hash.replace(/^#\/?/, '').split('?')[0].toLowerCase();
  return PAGE_HASH_MAP[raw] ?? 'accueil';
}

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [currentPage, setCurrentPage] = useState<PageId>(readPageFromHash);
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [profile, setProfile] = useState<UserProfileRecord | null>(null);
  const [isAdminDoc, setIsAdminDoc] = useState(false);

  const [siteCopy, setSiteCopy] = useState<SiteCopyConfig>(DEFAULT_SITE_COPY);
  const [videos, setVideos] = useState<VideoProductionItem[]>(DEFAULT_VIDEO_PRODUCTIONS);
  const [mediaAssets, setMediaAssets] = useState<MediaAssetItem[]>(DEFAULT_MEDIA_ASSETS);
  const [news, setNews] = useState<NewsArticleItem[]>(DEFAULT_NEWS_ARTICLES);
  const [promos, setPromos] = useState<PromoContentItem[]>(DEFAULT_PROMOS);
  const [myContactRequests, setMyContactRequests] = useState<ContactRequestItem[]>([]);
  const [adminUsers, setAdminUsers] = useState<UserProfileRecord[]>([]);
  const [adminContacts, setAdminContacts] = useState<ContactRequestItem[]>([]);
  const [selectedVideoCode, setSelectedVideoCode] = useState<string>('A');

  const isAdmin = useMemo(() => {
    if (!user) return false;
    return isBootstrappedAdminEmail(user.email, user.emailVerified) || isAdminDoc;
  }, [user, isAdminDoc]);

  const navigate = (page: PageId) => {
    setCurrentPage(page);
    if (typeof window !== 'undefined') {
      window.location.hash = page === 'accueil' ? '' : page;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const onHashChange = () => {
      setCurrentPage(readPageFromHash());
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Load public Firestore overrides without blocking initial render
  useEffect(() => {
    let active = true;

    async function loadPublicCatalog() {
      try {
        const copySnap = await getDoc(doc(db, 'siteCopy', 'main'));
        if (active && copySnap.exists()) {
          const data = copySnap.data();
          const rawGumroadUrl = String(data.gumroadUrl || DEFAULT_SITE_COPY.gumroadUrl);
          setSiteCopy({
            id: 'main',
            heroTitle: String(data.heroTitle || DEFAULT_SITE_COPY.heroTitle),
            heroSubtitle: String(data.heroSubtitle || DEFAULT_SITE_COPY.heroSubtitle),
            primaryCtaLabel: String(data.primaryCtaLabel || DEFAULT_SITE_COPY.primaryCtaLabel),
            pricingHeadline: String(data.pricingHeadline || DEFAULT_SITE_COPY.pricingHeadline),
            pricingNote: String(data.pricingNote || DEFAULT_SITE_COPY.pricingNote),
            gumroadUrl:
              rawGumroadUrl === 'https://gumroad.com/l/jitalx-full-access'
                ? OFFICIAL_GUMROAD_URL
                : rawGumroadUrl,
          });
        }
      } catch {
        // Fallback to default copy
      }

      try {
        const videosSnap = await getDocs(collection(db, 'videos'));
        if (active && !videosSnap.empty) {
          const overrides = new Map<string, Record<string, unknown>>();
          videosSnap.forEach((docItem) => {
            overrides.set(docItem.id, docItem.data() as Record<string, unknown>);
          });
          setVideos((prev) =>
            prev.map((item) => {
              const found = overrides.get(item.id);
              if (!found) return item;
              return {
                ...item,
                title: String(found.title || item.title),
                subtitle: String(found.subtitle ?? item.subtitle),
                durationLabel: String(found.durationLabel || item.durationLabel),
                status: found.status === 'published' ? 'published' : 'storyboard',
                videoUrl: String(found.videoUrl ?? item.videoUrl),
                posterUrl: String(found.posterUrl || item.posterUrl),
              };
            })
          );
        }
      } catch {
        // Fallback to default video production items
      }

      try {
        const assetsSnap = await getDocs(collection(db, 'mediaAssets'));
        if (active && !assetsSnap.empty) {
          const loaded: MediaAssetItem[] = [];
          assetsSnap.forEach((d) => {
            const data = d.data();
            loaded.push({
              id: d.id,
              title: String(data.title || ''),
              moduleName: String(data.moduleName || ''),
              category:
                data.category === 'streamer-obs' || data.category === 'studio-photo'
                  ? data.category
                  : 'capture-app',
              imageUrl: String(data.imageUrl || ''),
              caption: String(data.caption || ''),
            });
          });
          if (loaded.length > 0) setMediaAssets(loaded);
        }
      } catch {
        // Fallback to default media assets
      }

      try {
        const newsQuery = query(collection(db, 'news'), where('status', '==', 'published'));
        const newsSnap = await getDocs(newsQuery);
        if (active && !newsSnap.empty) {
          const loaded: NewsArticleItem[] = [];
          newsSnap.forEach((d) => {
            const data = d.data();
            loaded.push({
              id: d.id,
              title: String(data.title || ''),
              category: (data.category as NewsArticleItem['category']) || 'Annonce',
              summary: String(data.summary || ''),
              body: String(data.body || ''),
              publishedLabel: String(data.publishedLabel || ''),
              status: data.status === 'draft' ? 'draft' : 'published',
            });
          });
          if (loaded.length > 0) setNews(loaded);
        }
      } catch {
        // Fallback to default news
      }

      try {
        const promosSnap = await getDocs(collection(db, 'promos'));
        if (active && !promosSnap.empty) {
          const loaded: PromoContentItem[] = [];
          promosSnap.forEach((d) => {
            const data = d.data();
            const rawCtaUrl = String(data.ctaUrl || '');
            loaded.push({
              id: d.id,
              title: String(data.title || ''),
              description: String(data.description || ''),
              ctaLabel: String(data.ctaLabel || ''),
              ctaUrl:
                rawCtaUrl === 'https://gumroad.com/l/jitalx-full-access'
                  ? OFFICIAL_GUMROAD_URL
                  : rawCtaUrl,
              active: Boolean(data.active),
            });
          });
          if (loaded.length > 0) setPromos(loaded);
        }
      } catch {
        // Fallback to default promos
      }
    }

    void loadPublicCatalog();
    return () => {
      active = false;
    };
  }, []);

  // Auth listener & profile synchronization
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setAuthReady(true);

      if (!firebaseUser) {
        setProfile(null);
        setIsAdminDoc(false);
        setMyContactRequests([]);
        setAdminUsers([]);
        setAdminContacts([]);
        return;
      }

      try {
        const adminSnap = await getDoc(doc(db, 'admins', firebaseUser.uid));
        setIsAdminDoc(adminSnap.exists());
      } catch {
        setIsAdminDoc(false);
      }

      const userRef = doc(db, 'users', firebaseUser.uid);
      try {
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setProfile({
            uid: firebaseUser.uid,
            email: String(data.email || firebaseUser.email || ''),
            displayName: String(data.displayName || firebaseUser.displayName || 'Membre JITALX'),
            streamerHandle: String(data.streamerHandle || ''),
            bio: String(data.bio || ''),
            preferredFormat: data.preferredFormat === '9:16' ? '9:16' : '16:9',
            newsletterOptIn: Boolean(data.newsletterOptIn),
            role: data.role === 'admin' ? 'admin' : 'member',
          });
        } else if (firebaseUser.email && firebaseUser.emailVerified) {
          const initialRole = isBootstrappedAdminEmail(
            firebaseUser.email,
            firebaseUser.emailVerified
          )
            ? 'admin'
            : 'member';
          const initialProfile: UserProfileRecord = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: (firebaseUser.displayName || firebaseUser.email.split('@')[0]).slice(0, 100),
            streamerHandle: '@Runner_10J',
            bio: '',
            preferredFormat: '16:9',
            newsletterOptIn: false,
            role: initialRole,
          };
          await setDoc(userRef, {
            ...initialProfile,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
          setProfile(initialProfile);
        } else {
          setProfile({
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || 'Membre JITALX',
            streamerHandle: '',
            bio: '',
            preferredFormat: '16:9',
            newsletterOptIn: false,
            role: 'member',
          });
        }
      } catch (error) {
        console.error('Profile sync warning:', error);
      }
    });

    return () => unsub();
  }, []);

  // Subscribe to current user's contact requests once authenticated
  useEffect(() => {
    if (!authReady || !user) return;
    const reqQuery = query(
      collection(db, 'contactRequests'),
      where('userId', '==', user.uid)
    );
    const unsub = onSnapshot(
      reqQuery,
      (snap) => {
        const items: ContactRequestItem[] = [];
        snap.forEach((d) => {
          const data = d.data();
          items.push({
            id: d.id,
            name: String(data.name || ''),
            email: String(data.email || ''),
            topic: (data.topic as ContactTopic) || 'Autre question',
            message: String(data.message || ''),
            status: (data.status as ContactStatus) || 'new',
            userId: String(data.userId || ''),
          });
        });
        setMyContactRequests(items);
      },
      (error) => {
        console.error('Contact list subscription notice:', error);
      }
    );
    return () => unsub();
  }, [authReady, user]);

  const refreshAdminData = async () => {
    if (!isAdmin) return;
    try {
      const usersSnap = await getDocs(collection(db, 'users'));
      const loadedUsers: UserProfileRecord[] = [];
      usersSnap.forEach((d) => {
        const data = d.data();
        loadedUsers.push({
          uid: d.id,
          email: String(data.email || ''),
          displayName: String(data.displayName || ''),
          streamerHandle: String(data.streamerHandle || ''),
          bio: String(data.bio || ''),
          preferredFormat: data.preferredFormat === '9:16' ? '9:16' : '16:9',
          newsletterOptIn: Boolean(data.newsletterOptIn),
          role: data.role === 'admin' ? 'admin' : 'member',
        });
      });
      setAdminUsers(loadedUsers);
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'users');
    }

    try {
      const contactsSnap = await getDocs(collection(db, 'contactRequests'));
      const loadedContacts: ContactRequestItem[] = [];
      contactsSnap.forEach((d) => {
        const data = d.data();
        loadedContacts.push({
          id: d.id,
          name: String(data.name || ''),
          email: String(data.email || ''),
          topic: (data.topic as ContactTopic) || 'Autre question',
          message: String(data.message || ''),
          status: (data.status as ContactStatus) || 'new',
          userId: String(data.userId || ''),
        });
      });
      setAdminContacts(loadedContacts);
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'contactRequests');
    }

    try {
      const allNewsSnap = await getDocs(collection(db, 'news'));
      if (!allNewsSnap.empty) {
        const loadedNews: NewsArticleItem[] = [];
        allNewsSnap.forEach((d) => {
          const data = d.data();
          loadedNews.push({
            id: d.id,
            title: String(data.title || ''),
            category: (data.category as NewsArticleItem['category']) || 'Annonce',
            summary: String(data.summary || ''),
            body: String(data.body || ''),
            publishedLabel: String(data.publishedLabel || ''),
            status: data.status === 'draft' ? 'draft' : 'published',
          });
        });
        setNews(loadedNews);
      }
    } catch {
      // Keep default news list if none created yet
    }
  };

  useEffect(() => {
    if (isAdmin && currentPage === 'admin') {
      void refreshAdminData();
    }
  }, [isAdmin, currentPage]);

  const saveProfile: SiteContextValue['saveProfile'] = async (updates) => {
    if (!user) throw new Error('Vous devez être connecté pour modifier votre profil.');
    const path = `users/${user.uid}`;
    const userRef = doc(db, 'users', user.uid);
    const sanitized = {
      displayName: updates.displayName.trim().slice(0, 100),
      streamerHandle: updates.streamerHandle.trim().slice(0, 60),
      bio: updates.bio.trim().slice(0, 400),
      preferredFormat: updates.preferredFormat,
      newsletterOptIn: updates.newsletterOptIn,
    };

    try {
      const existing = await getDoc(userRef);
      if (existing.exists()) {
        await updateDoc(userRef, {
          ...sanitized,
          updatedAt: serverTimestamp(),
        });
      } else {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email || '',
          ...sanitized,
          role: 'member',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      setProfile((prev) => ({
        uid: user.uid,
        email: prev?.email || user.email || '',
        role: prev?.role || 'member',
        ...sanitized,
      }));
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const submitContactRequest: SiteContextValue['submitContactRequest'] = async (payload) => {
    const id = `req-${Date.now()}`;
    if (user && user.emailVerified) {
      const path = `contactRequests/${id}`;
      try {
        await setDoc(doc(db, 'contactRequests', id), {
          name: payload.name.trim().slice(0, 100),
          email: payload.email.trim().slice(0, 200),
          topic: payload.topic,
          message: payload.message.trim().slice(0, 2000),
          status: 'new',
          userId: user.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        return { persistedToCloud: true };
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, path);
      }
    }

    // For visitors browsing without an authenticated session, record in session state
    // so they receive immediate feedback and can sign in to track replies in Firestore.
    const localRecord: ContactRequestItem = {
      id,
      name: payload.name.trim().slice(0, 100),
      email: payload.email.trim().slice(0, 200),
      topic: payload.topic,
      message: payload.message.trim().slice(0, 2000),
      status: 'new',
      userId: 'visitor',
    };
    setMyContactRequests((prev) => [localRecord, ...prev]);
    return { persistedToCloud: false };
  };

  const adminSaveSiteCopy: SiteContextValue['adminSaveSiteCopy'] = async (copy) => {
    const path = 'siteCopy/main';
    const payload = {
      heroTitle: copy.heroTitle.trim().slice(0, 160),
      heroSubtitle: copy.heroSubtitle.trim().slice(0, 360),
      primaryCtaLabel: copy.primaryCtaLabel.trim().slice(0, 60),
      pricingHeadline: copy.pricingHeadline.trim().slice(0, 140),
      pricingNote: copy.pricingNote.trim().slice(0, 360),
      gumroadUrl: copy.gumroadUrl.trim().slice(0, 300),
      updatedAt: serverTimestamp(),
    };
    try {
      await setDoc(doc(db, 'siteCopy', 'main'), payload);
      setSiteCopy({ id: 'main', ...copy });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const adminSaveVideo: SiteContextValue['adminSaveVideo'] = async (video) => {
    const docId = sanitizeSlugId(video.id);
    const path = `videos/${docId}`;
    try {
      await setDoc(doc(db, 'videos', docId), {
        code: video.code.trim().slice(0, 8),
        title: video.title.trim().slice(0, 140),
        subtitle: video.subtitle.trim().slice(0, 260),
        category: video.category,
        aspectRatio: video.aspectRatio,
        durationLabel: video.durationLabel.trim().slice(0, 20),
        status: video.status,
        videoUrl: video.videoUrl.trim().slice(0, 500),
        posterUrl: video.posterUrl.trim().slice(0, 500),
        updatedAt: serverTimestamp(),
      });
      setVideos((prev) => prev.map((item) => (item.id === video.id ? video : item)));
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const adminSaveMediaAsset: SiteContextValue['adminSaveMediaAsset'] = async (asset) => {
    const docId = sanitizeSlugId(asset.id || asset.title);
    const path = `mediaAssets/${docId}`;
    const normalized: MediaAssetItem = {
      ...asset,
      id: docId,
      title: asset.title.trim().slice(0, 120),
      moduleName: asset.moduleName.trim().slice(0, 80),
      imageUrl: asset.imageUrl.trim().slice(0, 500),
      caption: asset.caption.trim().slice(0, 300),
    };
    try {
      await setDoc(doc(db, 'mediaAssets', docId), {
        title: normalized.title,
        moduleName: normalized.moduleName,
        category: normalized.category,
        imageUrl: normalized.imageUrl,
        caption: normalized.caption,
        updatedAt: serverTimestamp(),
      });
      setMediaAssets((prev) => {
        const exists = prev.some((m) => m.id === docId);
        return exists ? prev.map((m) => (m.id === docId ? normalized : m)) : [normalized, ...prev];
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const adminDeleteMediaAsset: SiteContextValue['adminDeleteMediaAsset'] = async (assetId) => {
    const path = `mediaAssets/${assetId}`;
    try {
      await deleteDoc(doc(db, 'mediaAssets', assetId));
      setMediaAssets((prev) => prev.filter((item) => item.id !== assetId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  const adminSaveNewsArticle: SiteContextValue['adminSaveNewsArticle'] = async (article) => {
    const docId = sanitizeSlugId(article.id || article.title);
    const path = `news/${docId}`;
    const normalized: NewsArticleItem = {
      ...article,
      id: docId,
      title: article.title.trim().slice(0, 160),
      summary: article.summary.trim().slice(0, 320),
      body: article.body.trim().slice(0, 4000),
      publishedLabel: article.publishedLabel.trim().slice(0, 40),
    };
    try {
      await setDoc(doc(db, 'news', docId), {
        title: normalized.title,
        category: normalized.category,
        summary: normalized.summary,
        body: normalized.body,
        publishedLabel: normalized.publishedLabel,
        status: normalized.status,
        updatedAt: serverTimestamp(),
      });
      setNews((prev) => {
        const exists = prev.some((n) => n.id === docId);
        return exists ? prev.map((n) => (n.id === docId ? normalized : n)) : [normalized, ...prev];
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const adminDeleteNewsArticle: SiteContextValue['adminDeleteNewsArticle'] = async (newsId) => {
    const path = `news/${newsId}`;
    try {
      await deleteDoc(doc(db, 'news', newsId));
      setNews((prev) => prev.filter((item) => item.id !== newsId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  const adminSavePromo: SiteContextValue['adminSavePromo'] = async (promo) => {
    const docId = sanitizeSlugId(promo.id || promo.title);
    const path = `promos/${docId}`;
    const normalized: PromoContentItem = {
      ...promo,
      id: docId,
      title: promo.title.trim().slice(0, 140),
      description: promo.description.trim().slice(0, 360),
      ctaLabel: promo.ctaLabel.trim().slice(0, 60),
      ctaUrl: promo.ctaUrl.trim().slice(0, 300),
    };
    try {
      await setDoc(doc(db, 'promos', docId), {
        title: normalized.title,
        description: normalized.description,
        ctaLabel: normalized.ctaLabel,
        ctaUrl: normalized.ctaUrl,
        active: normalized.active,
        updatedAt: serverTimestamp(),
      });
      setPromos((prev) => {
        const exists = prev.some((p) => p.id === docId);
        return exists ? prev.map((p) => (p.id === docId ? normalized : p)) : [normalized, ...prev];
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const adminDeletePromo: SiteContextValue['adminDeletePromo'] = async (promoId) => {
    const path = `promos/${promoId}`;
    try {
      await deleteDoc(doc(db, 'promos', promoId));
      setPromos((prev) => prev.filter((item) => item.id !== promoId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  const adminUpdateContactStatus: SiteContextValue['adminUpdateContactStatus'] = async (
    requestId,
    status
  ) => {
    const path = `contactRequests/${requestId}`;
    try {
      await updateDoc(doc(db, 'contactRequests', requestId), {
        status,
        updatedAt: serverTimestamp(),
      });
      setAdminContacts((prev) =>
        prev.map((c) => (c.id === requestId ? { ...c, status } : c))
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const adminDeleteContactRequest: SiteContextValue['adminDeleteContactRequest'] = async (
    requestId
  ) => {
    const path = `contactRequests/${requestId}`;
    try {
      await deleteDoc(doc(db, 'contactRequests', requestId));
      setAdminContacts((prev) => prev.filter((c) => c.id !== requestId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  const adminUpdateUserRole: SiteContextValue['adminUpdateUserRole'] = async (uid, role) => {
    const path = `users/${uid}`;
    try {
      await updateDoc(doc(db, 'users', uid), {
        role,
        updatedAt: serverTimestamp(),
      });
      setAdminUsers((prev) => prev.map((u) => (u.uid === uid ? { ...u, role } : u)));
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const value: SiteContextValue = {
    currentPage,
    navigate,
    user,
    authReady,
    profile,
    isAdmin,
    siteCopy,
    videos,
    mediaAssets,
    news,
    promos,
    myContactRequests,
    adminUsers,
    adminContacts,
    selectedVideoCode,
    setSelectedVideoCode,
    saveProfile,
    submitContactRequest,
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
  };

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) {
    throw new Error('useSite doit être utilisé à l’intérieur de SiteProvider.');
  }
  return ctx;
}
