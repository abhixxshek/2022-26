
'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  if (!getApps().length) {
    // Attempt to initialize using the provided config object (standard for local dev)
    // and fallback to automatic initialization for App Hosting.
    let firebaseApp;
    try {
      // In development, prioritize the config object for stability
      if (process.env.NODE_ENV === 'development') {
        firebaseApp = initializeApp(firebaseConfig);
      } else {
        // In production, attempt automatic initialization via environment variables
        firebaseApp = initializeApp();
      }
    } catch (e) {
      // Fallback for all environments
      firebaseApp = initializeApp(firebaseConfig);
    }

    return getSdks(firebaseApp);
  }

  // If already initialized, return the SDKs with the already initialized App
  return getSdks(getApp());
}

export function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp)
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
