"use client";
import { invoke } from "@tauri-apps/api/core";
import { ToTpAccount, ToTpCreationCallback } from "../types/totp.ts";
import { initDatabaseData, getDatabaseData } from "./database.ts";

export async function getAccounts(): Promise<ToTpAccount[]> {
  try {
    const data = await getDatabaseData("SELECT * FROM accounts;");
    return data as ToTpAccount[];
  } catch (err) {
    return [];
  }
}

export async function addAccount(account: ToTpAccount): Promise<ToTpAccount[]> {
  try {
    try {
      (await invoke("make_totp", {
        oauth: account.OtpAuthUrl,
      })) as ToTpCreationCallback;
    } catch (e) {
      return [];
    }

    await initDatabaseData(
      "INSERT INTO accounts (Name, Icon, OtpAuthUrl) VALUES ($1, $2, $3)",
      [
        account.Name.length >= 2 ? account.Name : `NoName`,
        (account.Icon as string)?.length >= 2
          ? account.Icon
          : "material-symbols-light:fingerprint",
        account.OtpAuthUrl,
      ]
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
    return (await invoke("make_totp", {
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
