'use client';

import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { AdMob, InterstitialAdPluginEvents } from '@capacitor-community/admob';

// Production: ca-app-pub-6566349379255160/8712694181
// Test ID (Google always-available): use during debug/testing
const TEST_AD_ID = 'ca-app-pub-3940256099942544/1033173712';
export const INTERSTITIAL_AD_ID = TEST_AD_ID;

let adReady = false;
let currentPrepare: Promise<void> | null = null;
let initPromise: Promise<void> | null = null;

function prepareAd(): Promise<void> {
  if (currentPrepare) return currentPrepare;
  adReady = false;
  
  currentPrepare = AdMob.prepareInterstitial({ 
    adId: INTERSTITIAL_AD_ID,
    isTesting: true // Best practice for test ads
  })
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

    if (!initPromise) {
      console.log('[AdMob] initializing on native platform...');
      
      initPromise = AdMob.initialize()
        .then(() => {
          console.log('[AdMob] initialized OK');

          // Add listeners
          AdMob.addListener(InterstitialAdPluginEvents.Loaded, () => {
            console.log('[AdMob] Loaded event');
          });
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

          // Prepare initial ad
          return prepareAd();
        })
        .catch((e) => {
          console.error('[AdMob] init failed:', e);
          initPromise = null; // allow retrying
        });
    }
  }, []);

  return null;
}

export async function showInterstitialAd(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  if (!initPromise) {
    console.warn('[AdMob] plugin not initialized, skipping ad');
    return;
  }

  // Ensure init is fully complete
  await initPromise;

  if (!adReady) {
    console.log('[AdMob] waiting for prepare...');
    await prepareAd();
  }

  if (!adReady) {
    console.warn('[AdMob] ad unavailable, skipping');
    return;
  }

  try {
    adReady = false;
    console.log('[AdMob] showing interstitial...');
    await AdMob.showInterstitial();
  } catch (e) {
    console.error('[AdMob] show failed:', e);
    // Suppress throwing here so we don't break UI flow
    prepareAd();
  }
}
