'use client';

import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { AdMob, InterstitialAdPluginEvents } from '@capacitor-community/admob';

// Production: ca-app-pub-6566349379255160/8712694181
const TEST_AD_ID = 'ca-app-pub-3940256099942544/1033173712';
export const INTERSTITIAL_AD_ID = TEST_AD_ID;

let adReady = false;
let isPreparing = false;
let initDone = false;

function prepareAd(): void {
  if (isPreparing || adReady) return;
  isPreparing = true;

  // Fire-and-forget — adReady is set by the Loaded event, not this promise
  AdMob.prepareInterstitial({ adId: INTERSTITIAL_AD_ID })
    .catch((e) => {
      console.warn('[AdMob] prepare error:', e);
      isPreparing = false;
      setTimeout(prepareAd, 5000);
    });
}

export function AdMobProvider() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform() || initDone) return;

    console.log('[AdMob] initializing...');
    initDone = true;

    AdMob.initialize({ initializeForTesting: true })
      .then(() => {
        console.log('[AdMob] init ok');

        AdMob.addListener(InterstitialAdPluginEvents.Loaded, () => {
          console.log('[AdMob] ad loaded and ready');
          adReady = true;
          isPreparing = false;
        });
        AdMob.addListener(InterstitialAdPluginEvents.Dismissed, () => {
          console.log('[AdMob] dismissed, re-preparing...');
          adReady = false;
          prepareAd();
        });
        AdMob.addListener(InterstitialAdPluginEvents.FailedToLoad, (err) => {
          console.error('[AdMob] FailedToLoad:', err);
          isPreparing = false;
          setTimeout(prepareAd, 5000);
        });
        AdMob.addListener(InterstitialAdPluginEvents.FailedToShow, () => {
          adReady = false;
          prepareAd();
        });

        prepareAd();
      })
      .catch((e) => {
        console.error('[AdMob] init failed:', e);
        initDone = false;
      });
  }, []);

  return null;
}

export async function showInterstitialAd(): Promise<void> {
  if (!Capacitor.isNativePlatform() || !initDone) return;

  if (!adReady) {
    console.log('[AdMob] ad not ready yet, skipping');
    return;
  }

  try {
    adReady = false;
    console.log('[AdMob] showing interstitial...');
    await AdMob.showInterstitial();
  } catch (e: any) {
    console.error('[AdMob] show failed:', e);
    prepareAd();
  }
}
