import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs
} from 'firebase/firestore';
import type { PengajuanItem, LoginRecord } from '../types';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp({
  apiKey: firebaseConfig.apiKey,
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
  messagingSenderId: firebaseConfig.messagingSenderId,
  appId: firebaseConfig.appId
});

export const db = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

const PENGAJUAN_COLLECTION = 'pengajuan';
const LOGIN_COLLECTION = 'login_history';

/**
 * Subscribe to real-time updates for Pengajuan items from Firestore.
 * Automatically updates whenever any device or account creates/updates/deletes a submission.
 */
export function subscribeToPengajuan(onUpdate: (items: PengajuanItem[]) => void, onError?: (err: any) => void) {
  const colRef = collection(db, PENGAJUAN_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const items: PengajuanItem[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as PengajuanItem;
        if (data && data.id) {
          items.push(data);
        }
      });
      // Sort newest first by id
      items.sort((a, b) => (b.id > a.id ? 1 : -1));
      onUpdate(items);
    },
    (err) => {
      console.warn('Firestore pengajuan listener error:', err);
      if (onError) onError(err);
    }
  );
}

/**
 * Subscribe to real-time updates for Login History from Firestore.
 */
export function subscribeToLoginHistory(onUpdate: (items: LoginRecord[]) => void) {
  const colRef = collection(db, LOGIN_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const records: LoginRecord[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as LoginRecord;
        if (data && data.id) {
          records.push(data);
        }
      });
      records.sort((a, b) => (b.waktu > a.waktu ? 1 : -1));
      onUpdate(records);
    },
    (err) => {
      console.warn('Firestore login history listener error:', err);
    }
  );
}

/**
 * Save or update a single Pengajuan item in Firestore real-time database.
 */
export async function savePengajuanToFirestore(item: PengajuanItem): Promise<boolean> {
  try {
    const docRef = doc(db, PENGAJUAN_COLLECTION, item.id);
    // Remove undefined values if any
    const cleanItem = JSON.parse(JSON.stringify(item));
    await setDoc(docRef, cleanItem, { merge: true });
    return true;
  } catch (err) {
    console.error('Error saving pengajuan to Firestore:', err);
    return false;
  }
}

/**
 * Delete a Pengajuan item from Firestore real-time database.
 */
export async function deletePengajuanFromFirestore(id: string): Promise<boolean> {
  try {
    const docRef = doc(db, PENGAJUAN_COLLECTION, id);
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.error('Error deleting pengajuan from Firestore:', err);
    return false;
  }
}

/**
 * Add a Login Record to Firestore.
 */
export async function addLoginRecordToFirestore(record: LoginRecord): Promise<boolean> {
  try {
    const docRef = doc(db, LOGIN_COLLECTION, record.id);
    const cleanRecord = JSON.parse(JSON.stringify(record));
    await setDoc(docRef, cleanRecord, { merge: true });
    return true;
  } catch (err) {
    console.error('Error saving login record to Firestore:', err);
    return false;
  }
}

/**
 * One-time fetch of all pengajuan from Firestore.
 */
export async function fetchAllPengajuanFromFirestore(): Promise<PengajuanItem[]> {
  try {
    const colRef = collection(db, PENGAJUAN_COLLECTION);
    const snapshot = await getDocs(colRef);
    const items: PengajuanItem[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data() as PengajuanItem;
      if (data && data.id) {
        items.push(data);
      }
    });
    items.sort((a, b) => (b.id > a.id ? 1 : -1));
    return items;
  } catch (err) {
    console.error('Error fetching pengajuan from Firestore:', err);
    return [];
  }
}
