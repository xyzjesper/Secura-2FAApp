import { invoke } from "@tauri-apps/api/core";
import {
  cancel,
  checkPermissions,
  Format,
  requestPermissions,
  scan,
} from "@tauri-apps/plugin-barcode-scanner";
import { ToTpQRCodeCalback } from "../types/totp";

export const cancelScan = async () => {
  await cancel();
};

export const startScan = async () => {
  const result = await scan({
    windowed: true,
    cameraDirection: "back",
    formats: [Format.QRCode],
  });
  return result;
};

export const requestScanPermissions = async () => {
  let checked = await checkPermissions();
  if (checked !== "granted") {
    let requested = await requestPermissions();
    if (requested !== "granted") {
      console.error("Camera permission not granted");
    }
  }
};

export const getToTpQRCode = async (toTpUrl: string) => {
  try {
    const json = (await invoke("generate_totp_qr_base64", {
      oauth: toTpUrl,
    })) as ToTpQRCodeCalback;
    return json.qrCodeBase64;
  } catch (e) {
    return String(e);
  }
};
