"use client";
import {
  checkPermissions,
  Format,
  requestPermissions,
  scan,
} from "@tauri-apps/plugin-barcode-scanner";
import { invoke } from "@tauri-apps/api/core";
import { ToTpAccount, ToTpCreationCallback } from "../types/totp.ts";
import { initDatabaseData, getDatabaseData } from "./database.ts";

export async function getAccounts() {
  try {
    const data = await getDatabaseData("SELECT * FROM accounts;");
    return data as any;
  } catch (err) {
    return String(err);
  }
}

export async function addAccount(): Promise<ToTpAccount[]> {
  try {
    let checked = await checkPermissions();
    if (checked !== "granted") {
      let requested = await requestPermissions();
      if (requested !== "granted") {
        console.error("Camera permission not granted");
      }
    }

    const result = await scan({
      windowed: false,
      cameraDirection: "front",
      formats: [Format.QRCode],
    });
    try {
      (await invoke("make_totp_qrcode", {
        oauth: result.content,
      })) as ToTpCreationCallback;
    } catch (e) {
      return [];
    }

    await initDatabaseData(
      "INSERT INTO accounts (Name, Icon, OtpAuthUrl) VALUES ($1, $2, $3)",
      ["Discord", "", result.content]
    );

    const data = await getAccounts();
    return data;
  } catch (e) {
    return [];
  }
}

export async function generateToTp(
  toTpUrl: string
): Promise<ToTpCreationCallback> {
  try {
    return (await invoke("make_totp_qrcode", {
      oauth: toTpUrl,
    })) as ToTpCreationCallback;
  } catch (e) {
    return {
      success: false,
      message: "Can't generate your ToTp Code.",
    };
  }
}

export async function deleteToTp(totpAccountId: number): Promise<boolean> {
  try {
    await initDatabaseData(`DELETE FROM accounts WHERE Id = ${totpAccountId}`);
    return true;
  } catch (e) {
    return false;
  }
}

export async function upateToTp(
  totpAccountId: number,
  name?: string,
  icon?: string
): Promise<boolean | string> {
  try {
    if (!name && !icon) return false;

    if (name) {
      await initDatabaseData(
        `UPDATE accounts SET Name='${name}' WHERE Id='${totpAccountId}'`
      );
    }
    if (icon) {
      await initDatabaseData(
        `UPDATE accounts SET Icon='${icon}' WHERE Id='${totpAccountId}'`
      );
    }
    return true;
  } catch (e) {
    return String(e);
  }
}
