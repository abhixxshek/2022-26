
'use client';
import {
  Auth,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { toast } from '@/hooks/use-toast';

/** Initiate anonymous sign-in (non-blocking). */
export function initiateAnonymousSignIn(authInstance: Auth): void {
  signInAnonymously(authInstance).catch((error) => {
    toast({
      variant: "destructive",
      title: "Authentication Error",
      description: error.message,
    });
  });
}

/** Initiate Google sign-in (non-blocking). */
export function initiateGoogleSignIn(authInstance: Auth): void {
  const provider = new GoogleAuthProvider();
  // Adding custom parameters can help with specific environment issues
  provider.setCustomParameters({
    prompt: 'select_account'
  });

  signInWithPopup(authInstance, provider)
    .then((result) => {
      toast({
        title: "Authorized via Google",
        description: `Welcome, ${result.user.displayName || 'Navodayan'}. Your session is active.`,
      });
    })
    .catch((error) => {
      // Check for common popup blocked error
      const message = error.code === 'auth/popup-blocked' 
        ? "The sign-in popup was blocked by your browser. Please allow popups for this site."
        : error.message;

      toast({
        variant: "destructive",
        title: "Google Auth Error",
        description: message,
      });
    });
}

/** Initiate email/password sign-up (non-blocking). */
export function initiateEmailSignUp(authInstance: Auth, email: string, password: string): void {
  createUserWithEmailAndPassword(authInstance, email, password).catch((error) => {
    toast({
      variant: "destructive",
      title: "Sign Up Error",
      description: error.message,
    });
  });
}

/** Initiate email/password sign-in (non-blocking). */
export function initiateEmailSignIn(authInstance: Auth, email: string, password: string): void {
  signInWithEmailAndPassword(authInstance, email, password).catch((error) => {
    toast({
      variant: "destructive",
      title: "Sign In Error",
      description: error.message,
    });
  });
}

/** Initiate sign-out (non-blocking). */
export function initiateSignOut(authInstance: Auth): void {
  signOut(authInstance).then(() => {
    toast({
      title: "Signed Out",
      description: "You have been securely logged out of the archive.",
    });
  }).catch((error) => {
    toast({
      variant: "destructive",
      title: "Sign Out Error",
      description: error.message,
    });
  });
}
