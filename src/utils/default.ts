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
import { ErrorCodeCallback } from "../types/callbacks/default";

export async function appVersion(): Promise<string> {
  return await invoke<string>("get_app_version");
}

export async function importApp(appData: AppData): Promise<ErrorCodeCallback> {
  try {
    if (!appData.version)
      return {
        code: 404,
        message: "Invalid App Data",
      };

    for (const acccount of appData.accounts) {
      await addAccount(acccount);
    }

    return {
      code: 200,
      message: "Import Successful",
    };
  } catch (e) {
    return {
      code: 500,
      message: "Import Failed",
    };
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
