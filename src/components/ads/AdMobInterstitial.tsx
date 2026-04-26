'use client';

import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { AdMob, InterstitialAdPluginEvents } from '@capacitor-community/admob';
import { toast } from 'sonner';

// Production: ca-app-pub-6566349379255160/8712694181
// Test ID (Google always-available): use during debug/testing
const TEST_AD_ID = 'ca-app-pub-3940256099942544/1033173712';
export const INTERSTITIAL_AD_ID = TEST_AD_ID;

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
      console.warn('[AdMob] prepare failed:', JSON.stringify(e));
      toast.error(`[AdMob] prepare failed: ${JSON.stringify(e)}`);
    })
    .finally(() => {
      currentPrepare = null;
    });
  return currentPrepare;
}

export function AdMobProvider() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    console.log('[AdMob] initializing on native platform...');
    toast(`[AdMob] initializing...`);

    AdMob.initialize()
      .then(() => {
        console.log('[AdMob] initialized OK');
        toast.success('[AdMob] initialized OK');

        AdMob.addListener(InterstitialAdPluginEvents.Loaded, () => {
          console.log('[AdMob] Loaded event');
          toast('[AdMob] Loaded');
        });
        AdMob.addListener(InterstitialAdPluginEvents.Dismissed, () => {
          console.log('[AdMob] dismissed, re-preparing...');
          prepareAd();
        });
        AdMob.addListener(InterstitialAdPluginEvents.FailedToShow, (err) => {
          console.error('[AdMob] FailedToShow:', err);
          toast.error(`[AdMob] FailedToShow: ${JSON.stringify(err)}`);
          prepareAd();
        });
        AdMob.addListener(InterstitialAdPluginEvents.FailedToLoad, (err) => {
          console.error('[AdMob] FailedToLoad:', err);
          toast.error(`[AdMob] FailedToLoad: ${JSON.stringify(err)}`);
        });

        prepareAd();
      })
      .catch((e) => {
        console.error('[AdMob] init failed:', e);
        toast.error(`[AdMob] init failed: ${JSON.stringify(e)}`);
      });
  }, []);

  return null;
}

export async function showInterstitialAd(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  if (!adReady) {
    console.log('[AdMob] waiting for prepare...');
    await prepareAd();
  }

  if (!adReady) {
    console.warn('[AdMob] ad unavailable, skipping');
    toast.error('[AdMob] ad unavailable');
    return;
  }

  try {
    adReady = false;
    console.log('[AdMob] showing interstitial...');
    await AdMob.showInterstitial();
  } catch (e) {
    console.error('[AdMob] show failed:', e);
    toast.error(`[AdMob] show failed: ${JSON.stringify(e)}`);
    prepareAd();
  }
}
