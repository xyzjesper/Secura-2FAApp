import { invoke } from "@tauri-apps/api/core";
import {
  cancel,
  checkPermissions,
  Format,
  requestPermissions,
  scan,
} from "@tauri-apps/plugin-barcode-scanner";
import { ToTpQRCodeCalback } from "../types/callbacks/qrcode";

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

export const getToTpQRCode = async (
  toTpUrl: string
): Promise<ToTpQRCodeCalback> => {
  try {
    const qrCodeData = await invoke<ToTpQRCodeCalback>(
      "generate_totp_qr_base64",
      {
        oauth: toTpUrl,
      }
    );

    return qrCodeData;
  } catch (e) {
    return {
      success: false,
      qrcodebase64: null,
    };
  }
};
