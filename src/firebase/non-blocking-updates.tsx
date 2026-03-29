
'use client';
    
import {
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  CollectionReference,
  DocumentReference,
  SetOptions,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { toast } from '@/hooks/use-toast';

/**
 * Initiates a setDoc operation for a document reference.
 * Does NOT await the write operation internally.
 */
export function setDocumentNonBlocking(docRef: DocumentReference, data: any, options: SetOptions) {
  if (!docRef) return;
  setDoc(docRef, data, options).catch(error => {
    errorEmitter.emit(
      'permission-error',
      new FirestorePermissionError({
        path: docRef.path,
        operation: 'write',
        requestResourceData: data,
      })
    );
  });
}

/**
 * Initiates an addDoc operation for a collection reference.
 * Does NOT await the write operation internally.
 */
export function addDocumentNonBlocking(colRef: CollectionReference, data: any) {
  if (!colRef) return;
  return addDoc(colRef, data).catch(error => {
    errorEmitter.emit(
      'permission-error',
      new FirestorePermissionError({
        path: colRef.path,
        operation: 'create',
        requestResourceData: data,
      })
    );
  });
}

/**
 * Initiates an updateDoc operation for a document reference.
 * Does NOT await the write operation internally.
 */
export function updateDocumentNonBlocking(docRef: DocumentReference, data: any) {
  if (!docRef) return;
  updateDoc(docRef, data).catch(error => {
    errorEmitter.emit(
      'permission-error',
      new FirestorePermissionError({
        path: docRef.path,
        operation: 'update',
        requestResourceData: data,
      })
    );
  });
}

/**
 * Initiates a deleteDoc operation for a document reference.
 * Provides immediate feedback and handles server-side rejection.
 */
export function deleteDocumentNonBlocking(docRef: DocumentReference, successTitle: string = "Record Removed") {
  if (!docRef) {
    toast({ variant: "destructive", title: "Reference Error", description: "The archival record could not be found." });
    return;
  }

  // Optimistic UI handled by Firestore SDK; we handle the promise for confirmation/rejection.
  deleteDoc(docRef)
    .then(() => {
      toast({
        title: successTitle,
        description: "The record has been permanently purged from the master archive."
      });
    })
    .catch(error => {
      // Revert feedback if server rejects the operation (e.g. permission or path issues)
      errorEmitter.emit(
        'permission-error',
        new FirestorePermissionError({
          path: docRef.path,
          operation: 'delete',
        })
      );
      toast({
        variant: "destructive",
        title: "Purge Failed",
        description: error.message || "The archive rejected the removal request."
      });
    });
}
