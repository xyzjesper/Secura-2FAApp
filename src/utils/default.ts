import { invoke } from "@tauri-apps/api/core";
import { AppData } from "../types/default";
import { initDatabaseData } from "./database";
import { addAccount } from "./totp";

export async function appVersion() {
  return await invoke<string>("get_app_version");
}

export async function importApp(appData: AppData) {
  try {
    if (!appData.version) return 0;

    for (const acccount of appData.accounts) {
      await addAccount(acccount);
    }

    return 1;
  } catch (e) {
    return String(e);
  }
}

export async function resetApp() {
  await initDatabaseData("DROP TABLE accounts;");
}
