"use client";
import { invoke } from "@tauri-apps/api/core";
import { ToTpAccount, ToTpCreationCallback } from "../types/totp.ts";
import { initDatabaseData, getDatabaseData } from "./database.ts";
import { getSecretKey } from "./default.ts";

export async function getAccounts(): Promise<ToTpAccount[] | string> {
  try {
    const data = (await getDatabaseData(
      "SELECT * FROM accounts;"
    )) as ToTpAccount[];

    const key = await getSecretKey();

    const decryptedData = (await Promise.all(
      data.map(async (a: ToTpAccount) => {
        const url = await invoke("unblur_password", {
          blurred: a.OtpAuthUrl,
          key,
        });
        return {
          Id: a.Id,
          Name: a.Name,
          Code: a.Code,
          NextCode: a.NextCode,
          Icon: a.Icon,
          OtpAuthUrl: url,
        };
      })
    )) as ToTpAccount[];

    return decryptedData;
  } catch (err) {
    return String(err);
  }
}

export async function addAccount(
  account: ToTpAccount
): Promise<ToTpAccount[] | string> {
  try {
    if (!account.OtpAuthUrl) {
      return "No Secret to generate!";
    }
    const key = await getSecretKey();

    const parsedUrl = account.OtpAuthUrl.startsWith("otpauth://")
      ? account.OtpAuthUrl
      : `otpauth://totp/${account.Name ? account.Name : "Secura"}:${
          account.Name ? account.Name.toLowerCase() : "Secura"
        }@xy-z.org?secret=${account.OtpAuthUrl.toUpperCase().replace(
          / /g,
          ""
        )}&issuer=Secura`;

    // Check if valid secret!
    try {
      (await invoke("make_totp", {
        oauth: parsedUrl,
      })) as ToTpCreationCallback;
    } catch (e) {
      return "Please use a valid Secret!";
    }

    const bluredUrl = await invoke("blur_password", {
      password: parsedUrl,
      key,
    });

    await initDatabaseData(
      "INSERT INTO accounts (Name, Icon, OtpAuthUrl) VALUES ($1, $2, $3)",
      [
        account.Name.length >= 2 ? account.Name : `NoName`,
        (account.Icon as string)?.length >= 2
          ? account.Icon
          : "material-symbols-light:fingerprint",
        String(bluredUrl),
      ]
    );

    const data = await getAccounts();
    return data;
  } catch (e) {
    return String(e);
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
