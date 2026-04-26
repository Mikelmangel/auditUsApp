'use client';

import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { AdMob, InterstitialAdPluginEvents } from '@capacitor-community/admob';

let adReady = false;

export const INTERSTITIAL_AD_ID = 'ca-app-pub-6566349379255160/8712694181';

export function AdMobProvider() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const init = async () => {
      try {
        console.log('[AdMob] initializing...');
        await AdMob.initialize();
        console.log('[AdMob] initialized');

        AdMob.addListener(InterstitialAdPluginEvents.Loaded, () => {
          console.log('[AdMob] InterstitialAdPluginEvents.Loaded fired');
          adReady = true;
        });

        AdMob.addListener(InterstitialAdPluginEvents.Dismissed, async () => {
          console.log('[AdMob] InterstitialAdPluginEvents.Dismissed fired');
          adReady = false;
          try {
            const result = await AdMob.prepareInterstitial({ adId: INTERSTITIAL_AD_ID });
            console.log('[AdMob] re-prepared, result:', result);
          } catch (e) {
            console.warn('[AdMob] re-prepare failed:', e);
          }
        });

        AdMob.addListener(InterstitialAdPluginEvents.FailedToLoad, (err) => {
          console.error('[AdMob] FailedToLoad:', err);
        });

        AdMob.addListener(InterstitialAdPluginEvents.Showed, () => {
          console.log('[AdMob] interstitial showed');
        });

        AdMob.addListener(InterstitialAdPluginEvents.FailedToShow, (err) => {
          console.error('[AdMob] FailedToShow:', err);
        });

        console.log('[AdMob] calling prepareInterstitial...');
        const result = await AdMob.prepareInterstitial({ adId: INTERSTITIAL_AD_ID });
        console.log('[AdMob] prepareInterstitial result:', JSON.stringify(result));
      } catch (e) {
        console.error('[AdMob] init failed:', e);
      }
    };

    init();
  }, []);

  return null;
}

export async function showInterstitialAd(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  console.log('[AdMob] showInterstitialAd called, adReady:', adReady);
  if (!adReady) {
    console.warn('[AdMob] ad not ready yet, skipping');
    return;
  }
  try {
    await AdMob.showInterstitial();
  } catch (e) {
    console.error('[AdMob] show failed:', e);
  }
}
