// Firebase auth + Firestore sync, isolated from render logic in app.js.
// Firebase's web API key is not a secret -- access is enforced by Firestore
// security rules (see README) plus the auth requirement below, not by
// hiding this config.
//
// This app uses its OWN Firebase project, deliberately separate from
// workout-tracker: that app has other people's accounts in it, and sharing a
// project would mean editing live security rules protecting their data every
// time this app's schema changes.
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  writeBatch,
  enableIndexedDbPersistence,
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const firebaseConfig = {
  apiKey: 'AIzaSyAqlLrjUUIIahD1GZEL6KAUk3AdsiaQU2s',
  authDomain: 'couch-to-novel.firebaseapp.com',
  projectId: 'couch-to-novel',
  storageBucket: 'couch-to-novel.firebasestorage.app',
  messagingSenderId: '1012232826404',
  appId: '1:1012232826404:web:ccaf29e8557402e02eb2b1',
};

export const isConfigured = !firebaseConfig.apiKey.startsWith('REPLACE');

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Lets a writing session save and read instantly from local cache and sync
// when back online -- drafting shouldn't depend on having signal.
enableIndexedDbPersistence(db).catch((err) => {
  console.warn('Offline persistence unavailable:', err.code);
});

const BATCH_LIMIT = 400; // Firestore write-batch limit is 500

export function onAuthChange(cb) {
  return onAuthStateChanged(auth, cb);
}

export function signUp(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export function signIn(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function signOutUser() {
  return signOut(auth);
}

// --- Project (one doc: target length, dates, template, beat completions) ---

export function subscribeProject(uid, onChange, onError) {
  const ref = doc(db, 'users', uid, 'novel', 'project');
  return onSnapshot(
    ref,
    (snap) => onChange(snap.exists() ? snap.data() : null),
    (err) => {
      console.error('Project listener error', err);
      if (onError) onError(err);
    }
  );
}

export function saveProjectCloud(uid, project) {
  return setDoc(doc(db, 'users', uid, 'novel', 'project'), project);
}

// --- Entries (one doc per logged writing session) ---

export function subscribeEntries(uid, onChange, onError) {
  const ref = collection(db, 'users', uid, 'novelEntries');
  return onSnapshot(
    ref,
    (snap) => onChange(snap.docs.map((d) => d.data())),
    (err) => {
      console.error('Entries listener error', err);
      if (onError) onError(err);
    }
  );
}

export function saveEntryCloud(uid, entry) {
  return setDoc(doc(db, 'users', uid, 'novelEntries', entry.id), entry);
}

export function deleteEntryCloud(uid, id) {
  return deleteDoc(doc(db, 'users', uid, 'novelEntries', id));
}

// --- Warm-up writing (kept entirely separate from the manuscript) ---
// Its own collection rather than a flag on novelEntries: these never count
// toward the word target, never affect pacing, and should survive starting a
// different novel. They are scales, not the performance.

export function subscribeWarmups(uid, onChange, onError) {
  const ref = collection(db, 'users', uid, 'warmupWriting');
  return onSnapshot(
    ref,
    (snap) => onChange(snap.docs.map((d) => d.data())),
    (err) => {
      console.error('Warm-up listener error', err);
      if (onError) onError(err);
    }
  );
}

export function saveWarmupCloud(uid, piece) {
  return setDoc(doc(db, 'users', uid, 'warmupWriting', piece.id), piece);
}

export function deleteWarmupCloud(uid, id) {
  return deleteDoc(doc(db, 'users', uid, 'warmupWriting', id));
}

export async function bulkImportCloud(uid, entries) {
  for (let i = 0; i < entries.length; i += BATCH_LIMIT) {
    const batch = writeBatch(db);
    entries.slice(i, i + BATCH_LIMIT).forEach((e) => {
      batch.set(doc(db, 'users', uid, 'novelEntries', e.id), e);
    });
    await batch.commit();
  }
}

export async function bulkDeleteCloud(uid, entries) {
  for (let i = 0; i < entries.length; i += BATCH_LIMIT) {
    const batch = writeBatch(db);
    entries.slice(i, i + BATCH_LIMIT).forEach((e) => {
      batch.delete(doc(db, 'users', uid, 'novelEntries', e.id));
    });
    await batch.commit();
  }
}

const AUTH_ERROR_MESSAGES = {
  'auth/invalid-email': 'That email address looks invalid.',
  'auth/user-not-found': 'No account with that email. Try creating one instead.',
  'auth/wrong-password': 'Incorrect password.',
  'auth/invalid-credential': 'Incorrect email or password.',
  'auth/email-already-in-use': 'An account already exists with that email -- try signing in instead.',
  'auth/weak-password': 'Password should be at least 6 characters.',
  'auth/network-request-failed': 'No internet connection. Sign-in needs to be online once; the app works offline after that.',
};

export function authErrorMessage(err) {
  return AUTH_ERROR_MESSAGES[err.code] || err.message || 'Something went wrong.';
}
