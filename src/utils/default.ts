import { invoke } from "@tauri-apps/api/core";
import { AppData } from "../types/default";
import { initDatabaseData } from "./database";
import { addAccount } from "./totp";
import {
  BaseDirectory,
  create,
  exists,
  readTextFile,
  writeTextFile,
} from "@tauri-apps/plugin-fs";

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
  await initDatabaseData(
    "CREATE TABLE IF NOT EXISTS accounts (Id INTEGER PRIMARY KEY AUTOINCREMENT, Name TEXT, Icon TEXT, OtpAuthUrl TEXT);"
  );
}

export async function getSecretKey(): Promise<string> {
  // + Backend Encode with Pin / Keyring
  const secretFile = await exists(".secret.txt", {
    baseDir: BaseDirectory.AppConfig,
  });

  if (secretFile == false) {
    await create(".secret.txt", {
      baseDir: BaseDirectory.AppConfig,
    });

    const uuid = crypto.randomUUID().slice(0, 32);
    await writeTextFile(".secret.txt", uuid, {
      baseDir: BaseDirectory.AppConfig,
    });
  }

  const fileContent = await readTextFile(".secret.txt", {
    baseDir: BaseDirectory.AppConfig,
  });

  return fileContent;
}
