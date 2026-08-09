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

export function mergePengajuanLists(localList: PengajuanItem[], cloudList: PengajuanItem[]): PengajuanItem[] {
  const map = new Map<string, PengajuanItem>();

  for (const item of cloudList) {
    if (item && item.id) {
      map.set(item.id, item);
    }
  }

  for (const item of localList) {
    if (item && item.id) {
      if (!map.has(item.id)) {
        map.set(item.id, item);
      } else {
        const existing = map.get(item.id)!;
        map.set(item.id, {
          ...existing,
          ...item,
          status: item.status !== 'Sedang Dalam Antrian' ? item.status : existing.status,
          catatanAdmin: (item.catatanAdmin && item.catatanAdmin !== '-') ? item.catatanAdmin : existing.catatanAdmin
        });
      }
    }
  }

  return Array.from(map.values()).sort((a, b) => (b.id > a.id ? 1 : -1));
}

export async function fetchCloudData(): Promise<{ pengajuanList?: PengajuanItem[]; loginHistory?: LoginRecord[] } | null> {
  // Try /api/sync first
  try {
    const res = await fetch("/api/sync", { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      if (json && Array.isArray(json.pengajuanList)) {
        return {
          pengajuanList: json.pengajuanList,
          loginHistory: json.loginHistory || []
        };
      }
    }
  } catch {
    // /api/sync not available, fallback
  }

  // Fallback to jsonblob directly
  try {
    const response = await fetch(JSONBLOB_URL, { cache: 'no-store' });
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
    console.warn("Direct JSONBlob fetch failed", err);
  }

  return null;
}

export async function pushCloudData(pengajuanList: PengajuanItem[], loginHistory: LoginRecord[]) {
  saveLocalPengajuan(pengajuanList);
  saveLocalLoginHistory(loginHistory);
  notifyRealtimeSync(pengajuanList, loginHistory);

  const payload = { pengajuanList, loginHistory };

  let pushedToApi = false;
  try {
    const res = await fetch("/api/sync", {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      pushedToApi = true;
    }
  } catch {
    // ignore
  }

  try {
    await fetch(JSONBLOB_URL, {
      method: 'PUT',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  } catch (err) {
    if (!pushedToApi) {
      console.warn("Cloud push to JSONBlob failed", err);
    }
  }
}
