import { PengajuanItem, UserAccount, AppSettings, LoginRecord } from '../types';
import { INITIAL_PENGAJUAN, INITIAL_USERS, INITIAL_SCHOOL_SETTINGS, INITIAL_LOGIN_HISTORY } from '../data/schoolData';

const STORAGE_KEYS = {
  PENGAJUAN: 'kusuma_pengajuanList_v3',
  USERS: 'kusuma_usersList_v2',
  SETTINGS: 'kusuma_settings_v2',
  LOGIN_HISTORY: 'kusuma_loginHistory_v2'
};

const JSONBLOB_URL = "https://jsonblob.com/api/jsonBlob/019fe799-3aca-7d87-992f-a8a0b784dc16";

export function loadLocalSettings(): AppSettings {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : INITIAL_SCHOOL_SETTINGS;
  } catch {
    return INITIAL_SCHOOL_SETTINGS;
  }
}

export function saveLocalSettings(settings: AppSettings) {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.warn("Save settings failed", e);
  }
}

export function loadLocalUsers(): UserAccount[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : INITIAL_USERS;
  } catch {
    return INITIAL_USERS;
  }
}

export function saveLocalUsers(users: UserAccount[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  } catch (e) {
    console.warn("Save users failed", e);
  }
}

export function loadLocalPengajuan(): PengajuanItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PENGAJUAN);
    return data ? JSON.parse(data) : INITIAL_PENGAJUAN;
  } catch {
    return INITIAL_PENGAJUAN;
  }
}

export function saveLocalPengajuan(items: PengajuanItem[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.PENGAJUAN, JSON.stringify(items));
  } catch (e) {
    console.warn("Save pengajuan failed", e);
  }
}

export function loadLocalLoginHistory(): LoginRecord[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.LOGIN_HISTORY);
    return data ? JSON.parse(data) : INITIAL_LOGIN_HISTORY;
  } catch {
    return INITIAL_LOGIN_HISTORY;
  }
}

export function saveLocalLoginHistory(history: LoginRecord[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.LOGIN_HISTORY, JSON.stringify(history));
  } catch (e) {
    console.warn("Save history failed", e);
  }
}

export function notifyRealtimeSync(pengajuanList: PengajuanItem[], loginHistory: LoginRecord[]) {
  if (typeof BroadcastChannel !== 'undefined') {
    try {
      const bc = new BroadcastChannel('kusuma_realtime_channel');
      bc.postMessage({ type: 'SYNC_DATA', pengajuanList, loginHistory });
      bc.close();
    } catch (e) {
      console.warn("BroadcastChannel error", e);
    }
  }
}

/**
 * Merges local items with cloud items.
 * Cloud data is authoritative for existing items (so Admin updates are preserved).
 * Local-only items (newly submitted offline) are kept.
 */
export function mergePengajuanLists(localList: PengajuanItem[], cloudList: PengajuanItem[]): PengajuanItem[] {
  const map = new Map<string, PengajuanItem>();

  // 1. Add cloud items (authoritative)
  for (const item of cloudList) {
    if (item && item.id) {
      map.set(item.id, item);
    }
  }

  // 2. Add local-only items if missing in cloud
  for (const item of localList) {
    if (item && item.id && !map.has(item.id)) {
      map.set(item.id, item);
    }
  }

  return Array.from(map.values()).sort((a, b) => (b.id > a.id ? 1 : -1));
}

export async function fetchCloudData(): Promise<{ pengajuanList?: PengajuanItem[]; loginHistory?: LoginRecord[] } | null> {
  try {
    const cacheBustUrl = `${JSONBLOB_URL}?_t=${Date.now()}`;
    const response = await fetch(cacheBustUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    });

    if (response.ok) {
      const json = await response.json();
      if (json && Array.isArray(json.pengajuanList)) {
        return {
          pengajuanList: json.pengajuanList,
          loginHistory: json.loginHistory || []
        };
      }
    }
  } catch (err) {
    console.warn("Cloud data fetch failed:", err);
  }

  return null;
}

export async function pushCloudData(pengajuanList: PengajuanItem[], loginHistory: LoginRecord[]): Promise<boolean> {
  saveLocalPengajuan(pengajuanList);
  saveLocalLoginHistory(loginHistory);
  notifyRealtimeSync(pengajuanList, loginHistory);

  const payload = { pengajuanList, loginHistory };

  try {
    const response = await fetch(JSONBLOB_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      return true;
    } else {
      console.warn("Cloud push HTTP error:", response.status);
    }
  } catch (err) {
    console.warn("Cloud push fetch failed:", err);
  }

  return false;
}
