"use client"
import {checkPermissions, Format, requestPermissions, scan} from "@tauri-apps/plugin-barcode-scanner";
import {invoke} from "@tauri-apps/api/core";
import {ToTpCreationCallback} from "../types/totp.ts";
import {initDatabaseData, getDatabaseData} from "./database.ts";


export async function getAccounts() {
    try {
        const data = await getDatabaseData("SELECT * FROM accounts;");
        return data as any
    } catch (err) {
        return String(err)
    }
}

export async function addAccount() {
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
            formats: [Format.QRCode],
        });
        const token = await invoke("make_totp_qrcode", {oauth: result.content}) as ToTpCreationCallback

        await initDatabaseData(
            "INSERT INTO accounts (Name, Icon, OtpAuthUrl) VALUES ($1, $2, $3)",
            ["Discord", "", result.content]
        )

        const data = await getAccounts()
        return data
    } catch (e) {
        return String(e)
    }
}