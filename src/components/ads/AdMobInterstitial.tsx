'use client';

import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { AdMob, InterstitialAdPluginEvents } from '@capacitor-community/admob';

export const INTERSTITIAL_AD_ID = 'ca-app-pub-6566349379255160/8712694181';

let adReady = false;
let currentPrepare: Promise<void> | null = null;

function prepareAd(): Promise<void> {
  if (currentPrepare) return currentPrepare;
  adReady = false;
  currentPrepare = AdMob.prepareInterstitial({ adId: INTERSTITIAL_AD_ID })
    .then(() => {
      adReady = true;
      console.log('[AdMob] ad ready');
    })
    .catch((e) => {
      console.warn('[AdMob] prepare failed:', e);
    })
    .finally(() => {
      currentPrepare = null;
    });
  return currentPrepare;
}

export function AdMobProvider() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    AdMob.initialize()
      .then(() => {
        console.log('[AdMob] initialized');
        AdMob.addListener(InterstitialAdPluginEvents.Dismissed, () => {
          console.log('[AdMob] dismissed, re-preparing...');
          prepareAd();
        });
        AdMob.addListener(InterstitialAdPluginEvents.FailedToShow, (err) => {
          console.error('[AdMob] FailedToShow:', err);
          prepareAd();
        });
        AdMob.addListener(InterstitialAdPluginEvents.FailedToLoad, (err) => {
          console.error('[AdMob] FailedToLoad:', err);
        });
        prepareAd();
      })
      .catch((e) => console.error('[AdMob] init failed:', e));
  }, []);

  return null;
}

export async function showInterstitialAd(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  // If preparing (init in progress or previous dismiss), wait for it
  if (!adReady) {
    console.log('[AdMob] waiting for ad to be ready...');
    await prepareAd();
  }

  if (!adReady) {
    console.warn('[AdMob] ad unavailable, skipping');
    return;
  }

  try {
    adReady = false;
    await AdMob.showInterstitial();
  } catch (e) {
    console.error('[AdMob] show failed:', e);
    prepareAd();
  }
}
