import { PengajuanItem, UserAccount, AppSettings, LoginRecord } from '../types';
import { INITIAL_PENGAJUAN, INITIAL_USERS, INITIAL_SCHOOL_SETTINGS, INITIAL_LOGIN_HISTORY } from '../data/schoolData';

const STORAGE_KEYS = {
  PENGAJUAN: 'kusuma_pengajuanList_v3',
  USERS: 'kusuma_usersList_v2',
  SETTINGS: 'kusuma_settings_v2',
  LOGIN_HISTORY: 'kusuma_loginHistory_v2'
};

const CLOUD_BIN_URL = "https://api.jsonbin.io/v3/b/662eaf6facd3cb34a83e6012";
const CLOUD_API_KEY = "$2a$10$tZ27gG3Hw9h5dKx.w4xLkuG8q1dJz3sJk5m5L5Ww5Jz3sJk5m5L5W";

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

export async function fetchCloudData(): Promise<{ pengajuanList?: PengajuanItem[]; loginHistory?: LoginRecord[] } | null> {
  try {
    const response = await fetch(CLOUD_BIN_URL + "/latest", {
      headers: { "X-Master-Key": CLOUD_API_KEY }
    });
    if (response.ok) {
      const json = await response.json();
      if (json && json.record) {
        return {
          pengajuanList: json.record.pengajuanList,
          loginHistory: json.record.loginHistory
        };
      }
    }
    return null;
  } catch (err) {
    console.warn("Cloud sync fetch failed, using local storage fallback", err);
    return null;
  }
}

export async function pushCloudData(pengajuanList: PengajuanItem[], loginHistory: LoginRecord[]) {
  saveLocalPengajuan(pengajuanList);
  saveLocalLoginHistory(loginHistory);

  try {
    await fetch(CLOUD_BIN_URL, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": CLOUD_API_KEY
      },
      body: JSON.stringify({ pengajuanList, loginHistory })
    });
  } catch (err) {
    console.warn("Cloud push failed, saved to local storage", err);
  }
}
