import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildObsOverlayUrl,
  filterVideosByCategory,
  formatSecondsToTimecode,
  getTotalStoryboardSeconds,
  isBootstrappedAdminEmail,
  isSafeHttpUrl,
  isValidEmail,
  OFFICIAL_GUMROAD_URL,
  sanitizeSlugId,
  validateContactForm,
  validateProfileUpdate,
} from './validation';
import { VideoProductionItem } from '../types/jitalx';

test('isValidEmail validates standard addresses and rejects malformed strings', () => {
  assert.equal(isValidEmail('joueur@jitalx.fr'), true);
  assert.equal(isValidEmail('  harzyyouness75@gmail.com '), true);
  assert.equal(isValidEmail('invalide'), false);
  assert.equal(isValidEmail('sans-domaine@'), false);
  assert.equal(isValidEmail('a@b'), false);
});

test('validateContactForm catches empty fields and accepts valid submissions', () => {
  const bad = validateContactForm({
    name: 'A',
    email: 'pas-un-email',
    topic: 'Sujet inconnu',
    message: 'Court',
  });
  assert.equal(bad.valid, false);
  assert.ok(bad.errors.name);
  assert.ok(bad.errors.email);
  assert.ok(bad.errors.topic);
  assert.ok(bad.errors.message);

  const ok = validateContactForm({
    name: 'Alex Streamer',
    email: 'alex@studio.fr',
    topic: 'Streamer Studio & OBS',
    message: 'Bonjour, comment configurer le mode fond transparent dans OBS Studio ?',
  });
  assert.equal(ok.valid, true);
  assert.deepEqual(ok.errors, {});
});

test('validateProfileUpdate enforces blueprint limits and allowed aspect ratios', () => {
  const bad = validateProfileUpdate({
    displayName: '',
    streamerHandle: '@'.repeat(70),
    bio: 'x'.repeat(405),
    preferredFormat: '4:3',
  });
  assert.equal(bad.valid, false);
  assert.ok(bad.errors.displayName);
  assert.ok(bad.errors.streamerHandle);
  assert.ok(bad.errors.bio);
  assert.ok(bad.errors.preferredFormat);

  const ok = validateProfileUpdate({
    displayName: 'Runner 10J',
    streamerHandle: '@Runner_10J',
    bio: 'Streamer 100% completion et overlays 16:9.',
    preferredFormat: '16:9',
  });
  assert.equal(ok.valid, true);
});

test('buildObsOverlayUrl encodes format, background, clean mode and manual widgets', () => {
  const url = buildObsOverlayUrl({
    baseUrl: 'https://app.jitalx.com/',
    handle: '@Runner_10J',
    liveTitle: 'Objectif 100 % — Jour 1',
    format: '9:16',
    background: 'transparent',
    cleanMode: true,
    showMissionWidget: true,
    showChallengeCounter: true,
    showChatHud: false,
    showManualAlerts: true,
    showTimer: true,
  });

  const parsed = new URL(url);
  assert.equal(parsed.pathname, '/studio/obs');
  assert.equal(parsed.searchParams.get('ratio'), '9:16');
  assert.equal(parsed.searchParams.get('bg'), 'transparent');
  assert.equal(parsed.searchParams.get('clean'), '1');
  assert.equal(
    parsed.searchParams.get('widgets'),
    'mission,challenge,manual-alerts,timer'
  );
});

test('storyboard helpers compute durations, timecodes and category filtering', () => {
  const sample: VideoProductionItem[] = [
    {
      id: 'v1',
      code: 'A',
      title: 'Découverte',
      subtitle: 'Intro',
      category: 'principale',
      aspectRatio: '16:9',
      durationLabel: '00:20',
      status: 'storyboard',
      videoUrl: '',
      posterUrl: '/assets/aistudio/test.png',
      targetPage: 'accueil',
      veoPrompt: 'Prompt',
      scenes: [
        {
          id: 's1',
          timecode: '00:00',
          durationSec: 8,
          title: 'Intro',
          overlayCaption: 'JITALX',
          voiceOver: 'Bienvenue',
          cameraMotion: 'zoom-in',
          transition: 'Fondu',
          imageUrl: '/assets/aistudio/test.png',
          imageAlt: 'Test',
        },
        {
          id: 's2',
          timecode: '00:08',
          durationSec: 12,
          title: 'Suite',
          overlayCaption: 'OBS',
          voiceOver: 'Studio',
          cameraMotion: 'pan-right',
          transition: 'Glissé',
          imageUrl: '/assets/aistudio/test.png',
          imageAlt: 'Test 2',
        },
      ],
    },
  ];

  assert.equal(getTotalStoryboardSeconds(sample[0]), 20);
  assert.equal(formatSecondsToTimecode(75), '01:15');
  assert.equal(filterVideosByCategory(sample, 'principale').length, 1);
  assert.equal(filterVideosByCategory(sample, 'social').length, 0);
});

test('security helpers guard URLs, slug IDs and verified admin email', () => {
  assert.equal(OFFICIAL_GUMROAD_URL, 'https://gumroad.com/l/jitalx');
  assert.equal(isSafeHttpUrl('https://gumroad.com/l/jitalx'), true);
  assert.equal(isSafeHttpUrl('/assets/aistudio/capture.png'), true);
  assert.equal(isSafeHttpUrl('javascript:alert(1)'), false);

  assert.equal(sanitizeSlugId('Nouvelle Sortie 2026 !'), 'nouvelle-sortie-2026');
  assert.equal(isBootstrappedAdminEmail('harzyyouness75@gmail.com', true), true);
  assert.equal(isBootstrappedAdminEmail('harzyyouness75@gmail.com', false), false);
  assert.equal(isBootstrappedAdminEmail('other@example.com', true), false);
});
